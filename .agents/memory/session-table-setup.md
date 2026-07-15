---
name: connect-pg-simple session table in esbuild dist
description: connect-pg-simple's bundled table.sql is unreachable from esbuild dist output; must create table manually and disable createTableIfMissing.
---

## Rule
When using `connect-pg-simple` with an esbuild-bundled Express server, set `createTableIfMissing: false` and create the session table via raw SQL at startup instead.

**Why:** esbuild bundles code into `dist/index.mjs` and `connect-pg-simple` resolves `table.sql` relative to `__dirname` (which becomes `dist/`), not its original `node_modules` location. This causes an ENOENT error on every request, and since sessions can't be stored, all auth checks fail with 401.

**How to apply:** In `app.ts`, run `pool.query(CREATE TABLE IF NOT EXISTS "session" ...)` before initializing the session middleware, and pass `createTableIfMissing: false` to `PgSession`.

## Session table SQL
```sql
CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL,
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL,
  CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE
);
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
```
