import { sql } from "drizzle-orm";

import { getDb } from "~/database";
import { OPENROUTER_EMBEDDING_MODEL } from "~/server/env-server";

import { embedTexts } from "./openrouter";

export type RetrievedEvidence = {
  chunkId: string;
  documentId: string;
  documentTitle: string;
  content: string;
  pageNumber: number | null;
  section: string | null;
  score: number;
};

type Row = Omit<RetrievedEvidence, "score">;

const idsSql = (ids: string[]) =>
  sql.join(
    ids.map((id) => sql`${id}::uuid`),
    sql`, `,
  );

export async function retrieveEvidence(
  query: string,
  documentIds: string[],
  limit = 8,
) {
  if (!documentIds.length) return [];
  const [queryEmbedding] = await embedTexts([query]);
  if (!queryEmbedding) return [];
  const vectorLiteral = `[${queryEmbedding.join(",")}]`;
  const selectedIds = idsSql(documentIds);
  const vector = await getDb().execute(sql`
    SELECT c."id" AS "chunkId", c."documentId", d."title" AS "documentTitle",
      c."content", c."pageNumber", c."section"
    FROM "knowledgeChunk" c JOIN "knowledgeDocument" d ON d."id"=c."documentId"
    WHERE c."documentId" IN (${selectedIds}) AND d."status"='ready'
      AND d."embeddingModel"=${OPENROUTER_EMBEDDING_MODEL}
    ORDER BY c."embedding" <=> ${vectorLiteral}::vector LIMIT 20
  `);
  const keyword = await getDb().execute(sql`
    SELECT c."id" AS "chunkId", c."documentId", d."title" AS "documentTitle",
      c."content", c."pageNumber", c."section"
    FROM "knowledgeChunk" c JOIN "knowledgeDocument" d ON d."id"=c."documentId"
    WHERE c."documentId" IN (${selectedIds}) AND d."status"='ready'
      AND d."embeddingModel"=${OPENROUTER_EMBEDDING_MODEL}
      AND to_tsvector('english', c."content") @@ websearch_to_tsquery('english', ${query})
    ORDER BY ts_rank_cd(to_tsvector('english', c."content"), websearch_to_tsquery('english', ${query})) DESC
    LIMIT 20
  `);
  const fused = new Map<string, RetrievedEvidence>();
  const add = (rows: unknown[], sourceWeight: number) => {
    (rows as Row[]).forEach((row, rank) => {
      const current = fused.get(row.chunkId);
      fused.set(row.chunkId, {
        ...row,
        score: (current?.score ?? 0) + sourceWeight / (60 + rank + 1),
      });
    });
  };
  add(vector.rows, 1);
  add(keyword.rows, 1.2);
  const ordered = [...fused.values()].sort((a, b) => b.score - a.score);
  const result: RetrievedEvidence[] = [];
  for (const item of ordered) {
    const duplicate = result.some(
      (existing) =>
        existing.documentId === item.documentId &&
        Math.abs(item.content.length - existing.content.length) < 80 &&
        existing.content.slice(0, 180) === item.content.slice(0, 180),
    );
    if (!duplicate) result.push(item);
    if (result.length === limit) break;
  }
  return result;
}

export function evidencePrompt(
  evidence: RetrievedEvidence[],
  webSearchEnabled: boolean,
) {
  const sources = evidence
    .map(
      (item, index) =>
        `[D${index + 1}] ${item.documentTitle}${item.pageNumber ? `, page ${item.pageNumber}` : item.section ? `, ${item.section}` : ""}\n${item.content}`,
    )
    .join("\n\n");
  return (
    `You are a rigorously evidence-bound assistant. Never fabricate facts.\n\n` +
    `Use the selected-document evidence below as the primary source. Cite document claims inline as [D1], [D2], etc. ` +
    `If the evidence is insufficient${webSearchEnabled ? ", use the available web-search tool only for the missing information and cite every web-derived claim with its returned URL" : ", say what could not be found in the selected documents and do not use general knowledge"}. ` +
    `Clearly distinguish document evidence from web evidence.\n\nSELECTED DOCUMENT EVIDENCE:\n${sources || "(No supporting document chunks were retrieved.)"}`
  );
}
