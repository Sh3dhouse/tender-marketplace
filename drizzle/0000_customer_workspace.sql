CREATE TABLE customer_workspace (
 user_id TEXT PRIMARY KEY NOT NULL,
 revision INTEGER NOT NULL DEFAULT 0,
 data TEXT NOT NULL,
 updated_at TEXT NOT NULL
);
