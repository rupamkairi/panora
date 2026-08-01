import type { Endpoint } from "one";

import { SYSTEM_PROMPT } from "~/features/chat/constants";
import { knowledgeRepository } from "~/features/knowledge/server/repository";
import {
  evidencePrompt,
  retrieveEvidence,
  type RetrievedEvidence,
} from "~/features/knowledge/server/retrieval";
import { MAX_CHAT_DOCUMENTS } from "~/features/knowledge/types";
import {
  CHAT_LIMITS,
  OPENROUTER_CHAT_URL,
  resolveFreeChatModel,
} from "~/features/chat/server/config";
import { OPENROUTER_EMBEDDING_MODEL } from "~/server/env-server";
import {
  acquireChatRateLimit,
  resolveChatClientId,
} from "~/features/chat/server/rateLimiter";
import {
  quotaHeaders,
  refundChatQuota,
  reserveChatQuota,
  resolveQuotaIdentity,
} from "~/features/chat/server/quota";

type RequestMessage = { role: "user" | "assistant"; content: string };
type ProviderChunk = {
  choices?: {
    delta?: {
      content?: string;
      annotations?: Array<{
        type?: string;
        url_citation?: { url?: string; title?: string };
      }>;
    };
    finish_reason?: string | null;
  }[];
  error?: {
    code?: string | number;
    message?: string;
    metadata?: { error_type?: string };
  };
};

const jsonError = (error: string, status: number, headers?: HeadersInit) =>
  Response.json({ error }, { status, headers });

const isMessage = (value: unknown): value is RequestMessage => {
  if (!value || typeof value !== "object") return false;
  const message = value as Record<string, unknown>;
  return (
    (message.role === "user" || message.role === "assistant") &&
    typeof message.content === "string" &&
    message.content.trim().length > 0
  );
};

const parseMessages = async (request: Request) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return { error: jsonError("The request body must be valid JSON.", 400) };
  }
  const record =
    body && typeof body === "object" ? (body as Record<string, unknown>) : null;
  const messages =
    body &&
    typeof body === "object" &&
    Array.isArray((body as { messages?: unknown }).messages)
      ? (body as { messages: unknown[] }).messages
      : null;
  if (
    !messages ||
    messages.length === 0 ||
    messages.length > CHAT_LIMITS.maxMessages ||
    !messages.every(isMessage)
  ) {
    return {
      error: jsonError(
        `Provide between 1 and ${CHAT_LIMITS.maxMessages} valid chat messages.`,
        400,
      ),
    };
  }
  const totalCharacters = messages.reduce(
    (sum, message) => sum + message.content.length,
    0,
  );
  if (totalCharacters > CHAT_LIMITS.maxTotalCharacters) {
    return {
      error: jsonError(
        `Conversation content must not exceed ${CHAT_LIMITS.maxTotalCharacters} characters.`,
        400,
      ),
    };
  }
  const documentIds = Array.isArray(record?.documentIds)
    ? record.documentIds
    : [];
  if (
    documentIds.length > MAX_CHAT_DOCUMENTS ||
    !documentIds.every(
      (id): id is string => typeof id === "string" && id.length > 0,
    ) ||
    new Set(documentIds).size !== documentIds.length
  ) {
    return {
      error: jsonError("Select no more than five valid documents.", 400),
    };
  }
  return {
    messages,
    documentIds,
    webSearchEnabled: record?.webSearchEnabled !== false,
  };
};

const event = (value: unknown) => `data: ${JSON.stringify(value)}\n\n`;

export const POST: Endpoint = async (request) => {
  const apiKey = process.env["OPENROUTER_API_KEY"];
  if (!apiKey) return jsonError("Chat is not configured on this server.", 503);

  const parsed = await parseMessages(request);
  if (parsed.error) return parsed.error;

  const concurrencyLease = acquireChatRateLimit(resolveChatClientId(request));
  if (!concurrencyLease.allowed) {
    return jsonError(
      "Another answer is already being generated. Please try again.",
      429,
      {
        "Retry-After": String(concurrencyLease.retryAfterSeconds),
      },
    );
  }

  const identity = resolveQuotaIdentity(request);
  const reservation = await reserveChatQuota(identity);
  if (!reservation.allowed) {
    concurrencyLease.release();
    const retryAfter = reservation.quota.resetAt
      ? Math.max(
          1,
          Math.ceil(
            (new Date(reservation.quota.resetAt).getTime() - Date.now()) / 1000,
          ),
        )
      : 1;
    return jsonError(
      "You have used all 10 asks. Your limit resets 24 hours after your first ask.",
      429,
      {
        ...quotaHeaders(identity, reservation.quota),
        "Retry-After": String(retryAfter),
      },
    );
  }

  let evidence: RetrievedEvidence[] = [];
  if (parsed.documentIds.length) {
    try {
      const ready = await knowledgeRepository.selectedReady(parsed.documentIds);
      if (ready.length !== parsed.documentIds.length) {
        concurrencyLease.release();
        const quota = await refundChatQuota(identity);
        return jsonError(
          "One or more selected documents are unavailable.",
          409,
          quotaHeaders(identity, quota),
        );
      }
      if (
        ready.some(
          (document) =>
            document.embeddingModel !== OPENROUTER_EMBEDDING_MODEL ||
            document.embeddingDimensions !== 2048,
        )
      ) {
        concurrencyLease.release();
        const quota = await refundChatQuota(identity);
        return jsonError(
          "One or more selected documents must be reindexed for the current embedding model.",
          409,
          quotaHeaders(identity, quota),
        );
      }
      const latestQuestion = [...parsed.messages]
        .reverse()
        .find((message) => message.role === "user")!;
      evidence = await retrieveEvidence(
        latestQuestion.content,
        parsed.documentIds,
      );
    } catch (error) {
      concurrencyLease.release();
      const quota = await refundChatQuota(identity);
      if (error instanceof Response) return error;
      console.error("[chat] document retrieval failed", {
        category: error instanceof Error ? error.name : "unknown",
      });
      return jsonError(
        "The selected documents could not be searched.",
        502,
        quotaHeaders(identity, quota),
      );
    }
  }

  const timeoutController = new AbortController();
  const allowWebFallback = parsed.webSearchEnabled && evidence.length < 3;
  let didTimeout = false;
  const timeout = setTimeout(() => {
    didTimeout = true;
    timeoutController.abort();
  }, CHAT_LIMITS.upstreamTimeoutMs);
  const abortUpstream = () => timeoutController.abort();
  request.signal.addEventListener("abort", abortUpstream, { once: true });

  let upstream: Response;
  try {
    upstream = await fetch(OPENROUTER_CHAT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env["ONE_SERVER_URL"] || "https://panora.app",
        "X-Title": "Panora",
      },
      body: JSON.stringify({
        model: resolveFreeChatModel(process.env["OPENROUTER_MODEL"]),
        messages: [
          {
            role: "system",
            content: parsed.documentIds.length
              ? evidencePrompt(evidence, allowWebFallback)
              : `${SYSTEM_PROMPT}\nNever fabricate facts. ${allowWebFallback ? "Use web search when current or externally verifiable information is needed, and cite returned URLs." : "Do not use the web; state when you cannot support an answer."}`,
          },
          ...parsed.messages,
        ],
        ...(allowWebFallback
          ? {
              tools: [
                {
                  type: "openrouter:web_search",
                  parameters: { max_results: 5, max_total_results: 5 },
                },
              ],
            }
          : {}),
        stream: true,
      }),
      signal: timeoutController.signal,
    });
  } catch (error) {
    clearTimeout(timeout);
    request.signal.removeEventListener("abort", abortUpstream);
    concurrencyLease.release();
    const quota = await refundChatQuota(identity);
    if (didTimeout) {
      return jsonError(
        "The AI provider took too long to respond.",
        504,
        quotaHeaders(identity, quota),
      );
    }
    if (request.signal.aborted) {
      return jsonError(
        "The request was cancelled.",
        499,
        quotaHeaders(identity, quota),
      );
    }
    console.error("[chat] OpenRouter connection failed", {
      category: error instanceof Error ? error.name : "unknown",
    });
    return jsonError(
      "The AI provider is temporarily unavailable.",
      502,
      quotaHeaders(identity, quota),
    );
  }

  if (!upstream.ok || !upstream.body) {
    clearTimeout(timeout);
    request.signal.removeEventListener("abort", abortUpstream);
    concurrencyLease.release();
    const quota = await refundChatQuota(identity);
    console.error("[chat] OpenRouter rejected request", {
      status: upstream.status,
      generationId: upstream.headers.get("x-generation-id") || undefined,
    });
    return jsonError(
      "The AI provider could not complete the request.",
      502,
      quotaHeaders(identity, quota),
    );
  }

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";
  let producedContent = false;
  let finished = false;
  const webReferences = new Map<string, string>();

  const cleanup = () => {
    if (finished) return;
    finished = true;
    clearTimeout(timeout);
    request.signal.removeEventListener("abort", abortUpstream);
    concurrencyLease.release();
  };

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(
        encoder.encode(event({ type: "quota", quota: reservation.quota })),
      );
    },
    async pull(controller) {
      try {
        while (true) {
          const { done, value } = await reader.read();
          let emitted = false;
          if (!done) buffer += decoder.decode(value, { stream: true });
          else buffer += decoder.decode();

          const frames = buffer.split(/\r?\n\r?\n/);
          const trailing = frames.pop() ?? "";
          buffer = done ? "" : trailing;
          if (done && trailing.trim()) frames.push(trailing);

          for (const frame of frames) {
            const data = frame
              .split(/\r?\n/)
              .filter((line) => line.startsWith("data:"))
              .map((line) => line.slice(5).trimStart())
              .join("\n");
            if (!data || data === "[DONE]") continue;
            let chunk: ProviderChunk;
            try {
              chunk = JSON.parse(data) as ProviderChunk;
            } catch {
              continue;
            }
            if (chunk.error || chunk.choices?.[0]?.finish_reason === "error") {
              const shouldRefund = !producedContent;
              const quota = shouldRefund
                ? await refundChatQuota(identity)
                : reservation.quota;
              console.error("[chat] OpenRouter stream failed", {
                category:
                  chunk.error?.metadata?.error_type ||
                  chunk.error?.code ||
                  "stream",
                generationId:
                  upstream.headers.get("x-generation-id") || undefined,
              });
              controller.enqueue(
                encoder.encode(
                  event({
                    type: "error",
                    error: "The AI provider could not complete that answer.",
                    quota,
                  }),
                ),
              );
              cleanup();
              controller.close();
              return;
            }
            const content = chunk.choices?.[0]?.delta?.content;
            for (const annotation of chunk.choices?.[0]?.delta?.annotations ??
              []) {
              const citation = annotation.url_citation;
              if (annotation.type === "url_citation" && citation?.url) {
                webReferences.set(citation.url, citation.title || citation.url);
              }
            }
            if (content) {
              producedContent = true;
              emitted = true;
              controller.enqueue(
                encoder.encode(event({ type: "delta", content })),
              );
            }
          }

          if (!done) {
            if (emitted) return;
            continue;
          }
          if (!producedContent) {
            const quota = await refundChatQuota(identity);
            controller.enqueue(
              encoder.encode(
                event({
                  type: "error",
                  error:
                    "The AI provider returned an empty answer. Please try again.",
                  quota,
                }),
              ),
            );
          } else {
            const documentReferences = evidence.length
              ? `\n\n### Document sources\n${evidence
                  .map(
                    (item, index) =>
                      `- [D${index + 1}: ${item.documentTitle}${item.pageNumber ? `, page ${item.pageNumber}` : ""}](/api/documents/${item.documentId}/download)`,
                  )
                  .join("\n")}`
              : "";
            const webReferenceText = webReferences.size
              ? `\n\n### Web references\n${[...webReferences]
                  .map(([url, title]) => `- [${title}](${url})`)
                  .join("\n")}`
              : "";
            if (documentReferences || webReferenceText) {
              controller.enqueue(
                encoder.encode(
                  event({
                    type: "delta",
                    content: documentReferences + webReferenceText,
                  }),
                ),
              );
            }
            controller.enqueue(
              encoder.encode(
                event({ type: "complete", quota: reservation.quota }),
              ),
            );
          }
          cleanup();
          controller.close();
          return;
        }
      } catch (error) {
        const quota = producedContent
          ? reservation.quota
          : await refundChatQuota(identity);
        console.error("[chat] OpenRouter stream interrupted", {
          category: error instanceof Error ? error.name : "unknown",
          generationId: upstream.headers.get("x-generation-id") || undefined,
        });
        controller.enqueue(
          encoder.encode(
            event({
              type: "error",
              error: "The AI response was interrupted. Please try again.",
              quota,
            }),
          ),
        );
        cleanup();
        controller.close();
      }
    },
    async cancel() {
      timeoutController.abort();
      await reader.cancel();
      if (!producedContent) await refundChatQuota(identity);
      cleanup();
    },
  });

  return new Response(stream, {
    headers: {
      ...quotaHeaders(identity, reservation.quota),
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
};
