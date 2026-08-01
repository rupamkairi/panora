import type { PoolClient } from 'pg'

const sql = `CREATE TABLE "chatQuota" (
	"quotaKey" text PRIMARY KEY,
	"windowStartedAt" timestamp,
	"usedCount" integer DEFAULT 0 NOT NULL,
	"expiresAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE INDEX "chatQuota_expiresAt_idx" ON "chatQuota" ("expiresAt");`

export async function up(client: PoolClient) {
  await client.query(sql)
}
