# ClearFunnel

An ATS Decision Governance Layer — a SaaS product that sits alongside a company's existing ATS, making every automated rejection decision visible, testable, and recoverable. Built for HR Operations teams who need auditability, not a new ATS.

## Run & Operate

- `pnpm --filter @workspace/clearfunnel run dev` — run the frontend (port auto-assigned)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Wouter routing, TanStack Query, Recharts, shadcn/ui, Tailwind CSS
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec in `lib/api-spec/openapi.yaml`)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — single source of truth for all API contracts
- `lib/db/src/schema/` — Drizzle table definitions (roles, rules, benchmark_resumes, validation_runs, candidates, decisions, alerts)
- `artifacts/api-server/src/routes/` — Express route handlers (roles, rules, validation, benchmarks, decisions, candidates, alerts, dashboard)
- `artifacts/clearfunnel/src/` — React frontend (pages per route, persistent sidebar layout)

## Core Product Concepts

- **Rule Registry** — Versioned log of every ATS filter rule. Rules must pass validation before going active.
- **Validation Harness** — Benchmark resume set (should-pass + should-fail) tested automatically on rule changes. A rule that rejects a should-pass resume is blocked from activating.
- **Decision Log** — Every auto-rejection stored with the specific rule(s) that triggered it, in plain language.
- **Recovery Pool** — Rejected candidates retained for 90 days; recoverable with logged override + reason.
- **Anomaly Alerts** — Monitors rejection rates per role, flags statistically significant shifts.

## Architecture decisions

- OpenAPI-first: all contracts defined in `lib/api-spec/openapi.yaml`, codegen produces React Query hooks and Zod validation schemas. Subagent used for the full frontend build.
- Multi-tenant isolation is foundational (per PRD) — schema supports company/tenant scoping for future expansion.
- Validation harness runs a simulation on demand (Phase 1 MVP); full async queue-based execution is Phase 2.
- Dashboard summary endpoint computes all stats in a single request to keep the dashboard load fast.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After any OpenAPI spec change, re-run `pnpm --filter @workspace/api-spec run codegen` before touching frontend code.
- `pnpm --filter @workspace/db run push` must be run after schema changes before restarting the API server.
- Express 5 wildcard routes require named params: `/{*splat}` not `*`.
