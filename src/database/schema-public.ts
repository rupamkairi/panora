import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  vector,
} from "drizzle-orm/pg-core";

export const userPublic = pgTable(
  "userPublic",
  {
    id: text("id").primaryKey(),
    name: text("name"),
    username: text("username"),
    image: text("image"),
    joinedAt: timestamp("joinedAt", { mode: "string" }).defaultNow().notNull(),
  },
  (table) => [index("userPublic_username_idx").on(table.username)],
);

export const userState = pgTable("userState", {
  userId: text("userId").primaryKey(),
  darkMode: boolean("darkMode").notNull().default(false),
});

export const todo = pgTable(
  "todo",
  {
    id: text("id").primaryKey(),
    userId: text("userId").notNull(),
    text: text("text").notNull(),
    completed: boolean("completed").notNull().default(false),
    createdAt: timestamp("createdAt", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("todo_userId_idx").on(table.userId)],
);

export const knowledgeDocument = pgTable(
  "knowledgeDocument",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    originalFilename: text("originalFilename").notNull(),
    description: text("description"),
    author: text("author"),
    organization: text("organization"),
    sourceUrl: text("sourceUrl"),
    publicationDate: text("publicationDate"),
    language: text("language"),
    category: text("category"),
    tags: text("tags").array().notNull().default([]),
    mimeType: text("mimeType").notNull(),
    sizeBytes: integer("sizeBytes").notNull(),
    checksum: text("checksum").notNull(),
    storageKey: text("storageKey").notNull(),
    status: text("status").notNull().default("uploaded"),
    phase: text("phase").notNull().default("uploaded"),
    progress: integer("progress").notNull().default(0),
    processedChunks: integer("processedChunks").notNull().default(0),
    totalChunks: integer("totalChunks"),
    errorMessage: text("errorMessage"),
    pageCount: integer("pageCount"),
    wordCount: integer("wordCount"),
    chunkCount: integer("chunkCount"),
    embeddingModel: text("embeddingModel"),
    embeddingDimensions: integer("embeddingDimensions"),
    uploadedBy: text("uploadedBy").notNull(),
    uploadedAt: timestamp("uploadedAt", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("knowledgeDocument_checksum_uidx").on(table.checksum),
    index("knowledgeDocument_status_idx").on(table.status),
  ],
);

export const knowledgeChunk = pgTable(
  "knowledgeChunk",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    documentId: uuid("documentId")
      .notNull()
      .references(() => knowledgeDocument.id, { onDelete: "cascade" }),
    ordinal: integer("ordinal").notNull(),
    content: text("content").notNull(),
    pageNumber: integer("pageNumber"),
    section: text("section"),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .notNull()
      .default({}),
    embedding: vector("embedding", { dimensions: 2048 }),
  },
  (table) => [index("knowledgeChunk_documentId_idx").on(table.documentId)],
);

export const knowledgeIndexJob = pgTable(
  "knowledgeIndexJob",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    documentId: uuid("documentId")
      .notNull()
      .references(() => knowledgeDocument.id, { onDelete: "cascade" }),
    status: text("status").notNull().default("queued"),
    attempts: integer("attempts").notNull().default(0),
    availableAt: timestamp("availableAt", { mode: "string" })
      .defaultNow()
      .notNull(),
    lockedAt: timestamp("lockedAt", { mode: "string" }),
    errorMessage: text("errorMessage"),
    createdAt: timestamp("createdAt", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("knowledgeIndexJob_status_available_idx").on(
      table.status,
      table.availableAt,
    ),
  ],
);
