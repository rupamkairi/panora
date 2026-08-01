CREATE TABLE "chatQuota" (
	"quotaKey" text PRIMARY KEY,
	"windowStartedAt" timestamp,
	"usedCount" integer DEFAULT 0 NOT NULL,
	"expiresAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE INDEX "chatQuota_expiresAt_idx" ON "chatQuota" ("expiresAt");