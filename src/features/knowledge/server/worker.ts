import { OPENROUTER_EMBEDDING_MODEL } from "~/server/env-server";

import { chunkSections, extractDocument } from "./extract";
import { embedTexts } from "./openrouter";
import { knowledgeRepository } from "./repository";
import { documentStorage } from "./storage";

export async function processNextKnowledgeJob() {
  const job = await knowledgeRepository.claimJob();
  if (!job) return false;
  try {
    const document = await knowledgeRepository.getInternal(job.documentId);
    if (!document) throw new Error("Document no longer exists.");
    await knowledgeRepository.setProgress(document.id, "extracting", 10);
    const bytes = await documentStorage.get(document.storageKey);
    const extracted = await extractDocument(bytes, document.mimeType);
    await knowledgeRepository.setProgress(document.id, "chunking", 35);
    const chunks = chunkSections(extracted.sections);
    if (!chunks.length)
      throw new Error("No readable text was found in this document.");
    await knowledgeRepository.setProgress(document.id, "embedding", 40, {
      processed: 0,
      total: chunks.length,
    });
    const embeddings: number[][] = [];
    const batchSize = 32;
    for (let offset = 0; offset < chunks.length; offset += batchSize) {
      embeddings.push(
        ...(await embedTexts(
          chunks.slice(offset, offset + batchSize).map((chunk) => chunk.text),
        )),
      );
      await knowledgeRepository.setProgress(
        document.id,
        "embedding",
        40 +
          Math.round(
            (Math.min(offset + batchSize, chunks.length) / chunks.length) * 55,
          ),
        {
          processed: Math.min(offset + batchSize, chunks.length),
          total: chunks.length,
        },
      );
    }
    await knowledgeRepository.replaceChunks(
      document.id,
      chunks.map((chunk, index) => ({
        ...chunk,
        content: chunk.text,
        embedding: embeddings[index]!,
      })),
      OPENROUTER_EMBEDDING_MODEL,
      extracted.pageCount,
    );
    await knowledgeRepository.completeJob(job.id);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Indexing failed.";
    await knowledgeRepository.failJob(
      job.id,
      job.documentId,
      message,
      job.attempts,
    );
    return true;
  }
}
