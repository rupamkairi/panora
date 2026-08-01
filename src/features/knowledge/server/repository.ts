import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";

import { getDb } from "~/database";
import {
  knowledgeChunk,
  knowledgeDocument,
  knowledgeIndexJob,
} from "~/database/schema";

import type { IndexingPhase, KnowledgeDocument } from "../types";

const publicDocument = (
  row: typeof knowledgeDocument.$inferSelect,
): KnowledgeDocument => ({
  id: row.id,
  title: row.title,
  originalFilename: row.originalFilename,
  description: row.description,
  author: row.author,
  organization: row.organization,
  sourceUrl: row.sourceUrl,
  publicationDate: row.publicationDate,
  language: row.language,
  category: row.category,
  tags: row.tags,
  mimeType: row.mimeType,
  sizeBytes: row.sizeBytes,
  status: row.status as KnowledgeDocument["status"],
  phase: row.phase as KnowledgeDocument["phase"],
  progress: row.progress,
  processedChunks: row.processedChunks,
  totalChunks: row.totalChunks,
  errorMessage: row.errorMessage,
  pageCount: row.pageCount,
  wordCount: row.wordCount,
  chunkCount: row.chunkCount,
  uploadedAt: row.uploadedAt,
  updatedAt: row.updatedAt,
  uploadedBy: row.uploadedBy,
});

export const knowledgeRepository = {
  async list(readyOnly = false) {
    const rows = await getDb()
      .select()
      .from(knowledgeDocument)
      .where(readyOnly ? eq(knowledgeDocument.status, "ready") : undefined)
      .orderBy(desc(knowledgeDocument.uploadedAt));
    return rows.map(publicDocument);
  },
  async findByChecksum(checksum: string) {
    const [row] = await getDb()
      .select()
      .from(knowledgeDocument)
      .where(eq(knowledgeDocument.checksum, checksum))
      .limit(1);
    return row ? publicDocument(row) : null;
  },
  async create(input: typeof knowledgeDocument.$inferInsert) {
    const [row] = await getDb()
      .insert(knowledgeDocument)
      .values(input)
      .returning();
    if (!row) throw new Error("The document could not be created.");
    await getDb().insert(knowledgeIndexJob).values({ documentId: row.id });
    return publicDocument(row);
  },
  async getInternal(id: string) {
    const [row] = await getDb()
      .select()
      .from(knowledgeDocument)
      .where(eq(knowledgeDocument.id, id))
      .limit(1);
    return row ?? null;
  },
  async retry(id: string) {
    await getDb().transaction(async (tx) => {
      await tx
        .update(knowledgeDocument)
        .set({
          status: "uploaded",
          phase: "uploaded",
          progress: 0,
          processedChunks: 0,
          totalChunks: null,
          errorMessage: null,
        })
        .where(eq(knowledgeDocument.id, id));
      await tx.insert(knowledgeIndexJob).values({ documentId: id });
    });
  },
  async remove(id: string) {
    await getDb().delete(knowledgeDocument).where(eq(knowledgeDocument.id, id));
  },
  async selectedReady(ids: string[]) {
    if (!ids.length) return [];
    return getDb()
      .select()
      .from(knowledgeDocument)
      .where(
        and(
          inArray(knowledgeDocument.id, ids),
          eq(knowledgeDocument.status, "ready"),
        ),
      );
  },
  async claimJob() {
    const result = await getDb().execute(sql`
      UPDATE "knowledgeIndexJob" SET "status"='processing', "lockedAt"=now(),
        "attempts"="attempts"+1, "updatedAt"=now()
      WHERE "id"=(SELECT "id" FROM "knowledgeIndexJob"
        WHERE ("status"='queued' AND "availableAt"<=now())
          OR ("status"='processing' AND "lockedAt" < now() - interval '10 minutes')
        ORDER BY "createdAt" FOR UPDATE SKIP LOCKED LIMIT 1)
      RETURNING *
    `);
    return (
      (result.rows[0] as {
        id: string;
        documentId: string;
        attempts: number;
      }) ?? null
    );
  },
  async setProgress(
    id: string,
    phase: IndexingPhase,
    progress: number,
    chunks?: { processed: number; total: number },
  ) {
    await getDb()
      .update(knowledgeDocument)
      .set({
        status: "processing",
        phase,
        progress,
        ...(chunks
          ? { processedChunks: chunks.processed, totalChunks: chunks.total }
          : {}),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(knowledgeDocument.id, id));
  },
  async replaceChunks(
    id: string,
    chunks: Array<{
      content: string;
      pageNumber?: number;
      section?: string;
      embedding: number[];
    }>,
    embeddingModel: string,
    pageCount: number | null,
  ) {
    await getDb().transaction(async (tx) => {
      await tx.delete(knowledgeChunk).where(eq(knowledgeChunk.documentId, id));
      if (chunks.length) {
        await tx
          .insert(knowledgeChunk)
          .values(
            chunks.map((chunk, ordinal) => ({
              documentId: id,
              ordinal,
              ...chunk,
            })),
          );
      }
      await tx
        .update(knowledgeDocument)
        .set({
          status: "ready",
          phase: "ready",
          progress: 100,
          processedChunks: chunks.length,
          totalChunks: chunks.length,
          errorMessage: null,
          pageCount,
          chunkCount: chunks.length,
          wordCount: chunks.reduce(
            (count, chunk) => count + chunk.content.split(/\s+/).length,
            0,
          ),
          embeddingModel,
          embeddingDimensions: chunks[0]?.embedding.length ?? null,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(knowledgeDocument.id, id));
    });
  },
  async completeJob(jobId: string) {
    await getDb()
      .update(knowledgeIndexJob)
      .set({ status: "complete" })
      .where(eq(knowledgeIndexJob.id, jobId));
  },
  async failJob(
    jobId: string,
    documentId: string,
    message: string,
    attempts: number,
  ) {
    const retry = attempts < 3;
    await getDb().transaction(async (tx) => {
      await tx
        .update(knowledgeIndexJob)
        .set({
          status: retry ? "queued" : "failed",
          errorMessage: message,
          availableAt: new Date(Date.now() + 30_000 * attempts).toISOString(),
        })
        .where(eq(knowledgeIndexJob.id, jobId));
      await tx
        .update(knowledgeDocument)
        .set({
          status: retry ? "processing" : "failed",
          phase: retry ? "embedding" : "failed",
          errorMessage: message,
        })
        .where(eq(knowledgeDocument.id, documentId));
    });
  },
  async chunksFor(ids: string[]) {
    if (!ids.length) return [];
    return getDb()
      .select()
      .from(knowledgeChunk)
      .where(inArray(knowledgeChunk.documentId, ids))
      .orderBy(asc(knowledgeChunk.ordinal));
  },
};
