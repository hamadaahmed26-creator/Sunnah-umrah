CREATE TABLE family_members (
  secret_hash TEXT PRIMARY KEY,
  public_id TEXT NOT NULL UNIQUE,
  group_id TEXT NOT NULL,
  nickname TEXT NOT NULL,
  expires INTEGER NOT NULL,
  invite_hash TEXT UNIQUE,
  invite_until INTEGER,
  epoch INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 0,
  captured INTEGER NOT NULL DEFAULT 0,
  packet TEXT
);
--> statement-breakpoint
CREATE INDEX family_group ON family_members(group_id,expires);
