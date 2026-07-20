# ClearFunnel

An ATS Decision Governance Layer — a SaaS platform that sits alongside a company's existing ATS to validate filter rules before they go live, log every auto-rejection with a traceable reason, monitor rejection patterns for anomalies, and recover wrongly-filtered candidates.

## Stack

- **Frontend:** React 19 + Vite + Tailwind CSS v4 + shadcn/ui (artifact: `artifacts/clearfunnel`)
- **Backend:** Express 5 API server (artifact: `artifacts/api-server`)
- **Database:** PostgreSQL via Drizzle ORM (lib: `lib/db`)
- **Routing:** Wouter (client-side)
- **State:** TanStack Query + generated API client (`lib/api-client-react`)

## Project Structure

```
artifacts/
  clearfunnel/       React + Vite frontend (preview path: /)
  api-server/        Express API server (preview path: /api)
  mockup-sandbox/    Design/canvas sandbox (preview path: /__mockup)
lib/
  db/                Drizzle ORM schema + PostgreSQL client
  api-spec/          OpenAPI spec + Orval codegen config
  api-client-react/  Generated React Query hooks
  api-zod/           Generated Zod validators
```

## How to Run

All services are managed by Replit workflows:

| Workflow | Command |
|---|---|
| `artifacts/clearfunnel: web` | `pnpm --filter @workspace/clearfunnel run dev` |
| `artifacts/api-server: API Server` | `pnpm --filter @workspace/api-server run dev` |

The database (`DATABASE_URL`) is auto-provisioned by Replit — no manual setup needed.

### Database schema

To push schema changes to the development database:
```bash
pnpm --filter @workspace/db run push
```

## Pages

### Marketing
- `/` — Home
- `/pricing` — Pricing
- `/how-it-works` — How It Works
- `/about` — About

### App (dashboard)
- `/dashboard` — Overview metrics
- `/rules` — Filter rule management
- `/decisions` — Auto-rejection log
- `/candidates` — Candidate recovery pool
- `/alerts` — Anomaly alerts
- `/validation` — Rule validation harness
- `/settings` — Settings

## User Preferences

<!-- Add user preferences here as they are expressed -->
