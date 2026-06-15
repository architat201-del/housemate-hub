# Roomly

Roomly is a household management app for adult co-living — handling rent splitting, shared expense tracking, chore rotation, and house agreements in one place, with a landlord-facing analytics layer.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, proxied at /api)
- `pnpm --filter @workspace/roomly run dev` — run the frontend (port 23714, proxied at /)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + shadcn/ui, wouter routing
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec → React Query hooks + Zod schemas)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — source of truth for all API contracts
- `lib/db/src/schema/` — Drizzle table definitions (households, members, rooms, expenses, chores, rules, payments)
- `lib/api-client-react/src/generated/` — generated React Query hooks (do not hand-edit)
- `lib/api-zod/src/generated/` — generated Zod schemas used by server routes
- `artifacts/api-server/src/routes/` — Express route handlers (one file per domain)
- `artifacts/roomly/src/` — React frontend pages and components

## Architecture decisions

- **OpenAPI-first**: All types flow from `openapi.yaml` → Orval codegen → frontend hooks + server Zod schemas. Never hand-write types the codegen produces.
- **Active household = 1**: MVP hardcodes `householdId = 1` via a React context. Multi-household support is additive.
- **Chore rotation stored as JSON**: `rotationOrder` is a JSON-serialized array of member IDs in the `chores` table. Rotation advances automatically on `POST /chores/:id/complete`.
- **Expense splits created server-side**: The server calculates equal splits from the household member list; custom splits are passed as `customSplits[]`. Splits table is always populated on expense creation.
- **House rules versioning**: Any `PUT /rules` bumps the version and clears all signatures — forces re-signature when rules change.

## Product

- **Dashboard** (`/`) — Real-time snapshot: total rent, pending expense total, overdue chores, member count, recent expenses
- **Expenses** (`/expenses`) — Log shared expenses, view category breakdown, see who owes what, settle up
- **Chores** (`/chores`) — Rotation schedule, mark complete (auto-rotates to next assignee), add/edit chores
- **Rent Split** (`/rent`) — Room-level pricing, member rent shares, monthly payment recording and tracking
- **House Rules** (`/rules`) — Editable household agreement with digital signature per member, versioned
- **Landlord Portal** (`/landlord`) — Aggregate view: all households, on-time payment rates, monthly breakdowns
- **Settings** (`/settings`) — Household info, lease dates, landlord contact, member management

## Gotchas

- After any change to `lib/api-spec/openapi.yaml`, always re-run `pnpm --filter @workspace/api-spec run codegen` before using updated types.
- The `rotationOrder` column is stored as a JSON string — parse it with `JSON.parse()` server-side and stringify before writing.
- Seeded household is ID=1. The MVP context hardcodes this. To add multi-household, replace the context value with a selector/auth layer.
- `pnpm run typecheck:libs` must pass before leaf artifact typechecks see fresh workspace declarations.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
