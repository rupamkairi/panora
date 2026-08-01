import type { PoolClient } from 'pg'

const sql = `CREATE EXTENSION IF NOT EXISTS vector;
--> statement-breakpoint
CREATE TABLE "knowledgeChunk" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"documentId" uuid NOT NULL,
	"ordinal" integer NOT NULL,
	"content" text NOT NULL,
	"pageNumber" integer,
	"section" text,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	"embedding" vector(2048)
);
--> statement-breakpoint
CREATE TABLE "knowledgeDocument" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" text NOT NULL,
	"originalFilename" text NOT NULL,
	"description" text,
	"author" text,
	"organization" text,
	"sourceUrl" text,
	"publicationDate" text,
	"language" text,
	"category" text,
	"tags" text[] DEFAULT '{}'::text[] NOT NULL,
	"mimeType" text NOT NULL,
	"sizeBytes" integer NOT NULL,
	"checksum" text NOT NULL,
	"storageKey" text NOT NULL,
	"status" text DEFAULT 'uploaded' NOT NULL,
	"phase" text DEFAULT 'uploaded' NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"processedChunks" integer DEFAULT 0 NOT NULL,
	"totalChunks" integer,
	"errorMessage" text,
	"pageCount" integer,
	"wordCount" integer,
	"chunkCount" integer,
	"embeddingModel" text,
	"embeddingDimensions" integer,
	"uploadedBy" text NOT NULL,
	"uploadedAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledgeIndexJob" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"documentId" uuid NOT NULL,
	"status" text DEFAULT 'queued' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"availableAt" timestamp DEFAULT now() NOT NULL,
	"lockedAt" timestamp,
	"errorMessage" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "knowledgeChunk_documentId_idx" ON "knowledgeChunk" ("documentId");--> statement-breakpoint
CREATE UNIQUE INDEX "knowledgeDocument_checksum_uidx" ON "knowledgeDocument" ("checksum");--> statement-breakpoint
CREATE INDEX "knowledgeDocument_status_idx" ON "knowledgeDocument" ("status");--> statement-breakpoint
CREATE INDEX "knowledgeIndexJob_status_available_idx" ON "knowledgeIndexJob" ("status","availableAt");--> statement-breakpoint
ALTER TABLE "knowledgeChunk" ADD CONSTRAINT "knowledgeChunk_documentId_knowledgeDocument_id_fkey" FOREIGN KEY ("documentId") REFERENCES "knowledgeDocument"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "knowledgeIndexJob" ADD CONSTRAINT "knowledgeIndexJob_documentId_knowledgeDocument_id_fkey" FOREIGN KEY ("documentId") REFERENCES "knowledgeDocument"("id") ON DELETE CASCADE;`

export async function up(client: PoolClient) {
  await client.query(sql)
}
