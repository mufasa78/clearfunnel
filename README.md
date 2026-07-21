# ClearFunnel

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen)
![pnpm](https://img.shields.io/badge/pnpm-required-orange)

**ClearFunnel** is an ATS Decision Governance Layer — a SaaS platform that sits alongside a company's existing Applicant Tracking System (ATS) to validate filter rules before they go live, log every auto-rejection with a traceable reason, monitor rejection patterns for anomalies, and recover wrongly-filtered candidates.

## 🎯 Why ClearFunnel?

Modern ATS systems use automated filters to manage high-volume applicant pools, but these filters can inadvertently create bias, miss qualified candidates, or violate compliance requirements. ClearFunnel solves this by providing:

- **Rule Validation** — Test and validate filter rules before deployment
- **Decision Logging** — Full audit trail of every auto-rejection with reasoning
- **Anomaly Detection** — Pattern monitoring to catch biased or broken filters
- **Candidate Recovery** — Identify and retrieve wrongly-filtered applicants
- **Compliance Assurance** — Ensure hiring filters meet legal and ethical standards

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20 or higher
- **pnpm** 9 or higher (required)
- **PostgreSQL** database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/clear-funnel.git
cd clear-funnel
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
# Create .env file in the root
cp .env.example .env
```

Add your database connection string:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/clearfunnel
```

4. Push database schema:
```bash
pnpm --filter @workspace/db run push
```

5. Start development servers:
```bash
# Terminal 1 - API Server
pnpm --filter @workspace/api-server run dev

# Terminal 2 - Frontend
pnpm --filter @workspace/clearfunnel run dev
```

The app will be available at `http://localhost:5173` (frontend) and `http://localhost:3000` (API).

---

## 📦 Tech Stack

### Frontend
- **React 19** — UI library with latest features
- **Vite 7** — Lightning-fast build tool
- **Tailwind CSS v4** — Utility-first styling with latest engine
- **shadcn/ui** — Beautifully designed components
- **Wouter** — Lightweight client-side routing
- **TanStack Query** — Powerful async state management
- **Framer Motion** — Smooth animations
- **Lucide React** — Modern icon library

### Backend
- **Express 5** — Fast, minimalist web framework
- **TypeScript** — Type-safe JavaScript
- **Drizzle ORM** — TypeScript ORM for SQL databases
- **PostgreSQL** — Robust relational database
- **Zod** — Runtime type validation

### DevOps & Tooling
- **pnpm** — Fast, disk-efficient package manager
- **Orval** — OpenAPI to TypeScript codegen
- **tsx** — TypeScript execution
- **ESLint & Prettier** — Code quality and formatting

---

## 📁 Project Structure

```
clear-funnel/
├── api/                       # Vercel serverless functions
│   └── index.ts              # Express API wrapper for Vercel
│
├── artifacts/                  # Applications and services
│   ├── clearfunnel/           # React frontend (Vite + Tailwind)
│   ├── api-server/            # Express API server
│   └── mockup-sandbox/        # Design/canvas sandbox (optional)
│
├── lib/                       # Shared libraries
│   ├── db/                    # Drizzle ORM schema + PostgreSQL client
│   ├── api-spec/              # OpenAPI specification
│   ├── api-client-react/      # Generated React Query hooks
│   └── api-zod/               # Generated Zod validators
│
├── scripts/                   # Build and utility scripts
├── .agents/                   # AI agent configurations
├── .local/                    # Local development files
├── package.json               # Workspace root configuration
├── pnpm-workspace.yaml        # pnpm workspace configuration
├── tsconfig.base.json         # Shared TypeScript configuration
├── vercel.json                # Vercel deployment configuration
├── .vercelignore              # Vercel ignore patterns
├── .env.example               # Environment variables template
├── VERCEL_DEPLOYMENT.md       # Detailed deployment guide
└── README.md                  # This file
```

### Workspace Packages

| Package | Description | Path |
|---------|-------------|------|
| `@workspace/clearfunnel` | React frontend application | `artifacts/clearfunnel` |
| `@workspace/api-server` | Express backend API | `artifacts/api-server` |
| `@workspace/db` | Database schema and client | `lib/db` |
| `@workspace/api-spec` | OpenAPI specification | `lib/api-spec` |
| `@workspace/api-client-react` | Auto-generated React Query hooks | `lib/api-client-react` |
| `@workspace/api-zod` | Auto-generated Zod validators | `lib/api-zod` |

---

## 🛠️ Development

### Available Scripts

#### Root Level
```bash
# Install all dependencies
pnpm install

# Build all packages
pnpm run build

# Type check all packages
pnpm run typecheck

# Type check libraries only
pnpm run typecheck:libs
```

#### Frontend (`artifacts/clearfunnel`)
```bash
# Start dev server
pnpm --filter @workspace/clearfunnel run dev

# Build for production
pnpm --filter @workspace/clearfunnel run build

# Preview production build
pnpm --filter @workspace/clearfunnel run preview

# Type check
pnpm --filter @workspace/clearfunnel run typecheck
```

#### Backend (`artifacts/api-server`)
```bash
# Start dev server
pnpm --filter @workspace/api-server run dev

# Build for production
pnpm --filter @workspace/api-server run build

# Start production server
pnpm --filter @workspace/api-server run start
```

#### Database (`lib/db`)
```bash
# Push schema changes to database
pnpm --filter @workspace/db run push

# Generate migrations
pnpm --filter @workspace/db run generate

# Run migrations
pnpm --filter @workspace/db run migrate

# Open Drizzle Studio (database GUI)
pnpm --filter @workspace/db run studio
```

### Working with the API

The project uses an **OpenAPI-first** approach:

1. Define API endpoints in `lib/api-spec/openapi.yaml`
2. Generate TypeScript types and React Query hooks:
```bash
pnpm --filter @workspace/api-spec run generate
```
3. Use the generated hooks in your React components:
```tsx
import { useGetRules } from '@workspace/api-client-react';

function RulesList() {
  const { data, isLoading } = useGetRules();
  // ...
}
```

---

## 🌐 Application Pages

### Marketing Pages
- **`/`** — Home page with product overview
- **`/pricing`** — Pricing plans and features
- **`/how-it-works`** — Product demonstration and workflow
- **`/about`** — Company information and mission

### Application Dashboard
- **`/dashboard`** — Overview metrics and insights
- **`/rules`** — Filter rule management and configuration
- **`/decisions`** — Auto-rejection log and audit trail
- **`/candidates`** — Candidate recovery pool
- **`/alerts`** — Anomaly alerts and notifications
- **`/validation`** — Rule validation test harness
- **`/settings`** — User and system settings

---

## 🔒 Security Features

### Supply Chain Protection

This project implements **supply-chain attack defense** via pnpm's `minimumReleaseAge` setting:

- All npm packages must be published for at least **24 hours** before installation
- Malicious releases are typically caught and removed within hours
- Trusted packages (e.g., `@replit/*`, `react`, `typescript`) can be excluded

Configure in `pnpm-workspace.yaml`:
```yaml
minimumReleaseAge: 1440  # 24 hours in minutes

minimumReleaseAgeExclude:
  - '@replit/*'
  - react
  - typescript
```

⚠️ **DO NOT DISABLE THIS SETTING** — it's a critical security defense.

---

## 🧪 Testing

```bash
# Run all tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Run tests with coverage
pnpm run test:coverage
```

---

## 🏗️ Building for Production

```bash
# Build all packages
pnpm run build

# Build specific package
pnpm --filter @workspace/clearfunnel run build
pnpm --filter @workspace/api-server run build
```

### Production Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/clearfunnel

# API Server
PORT=3000
NODE_ENV=production
JWT_SECRET=your-secret-key

# Frontend
VITE_API_BASE_URL=https://api.clearfunnel.com
```

---

## 🚀 Deploying to Vercel

ClearFunnel is fully configured for deployment on Vercel, including both the frontend and backend API as a serverless function.

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/clear-funnel)

### Manual Deployment

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy:**
```bash
vercel --prod
```

4. **Set Environment Variables:**

Go to your Vercel dashboard and add:
- `DATABASE_URL` — PostgreSQL connection string
- `VITE_API_BASE_URL` — Your deployment URL + /api (e.g., `https://yourapp.vercel.app/api`)

5. **Run Database Migrations:**
```bash
pnpm --filter @workspace/db run push
```

### Vercel Configuration

- **Frontend**: Static site served from `artifacts/clearfunnel/dist`
- **Backend**: Serverless function at `/api` routes
- **Rewrites**: All `/api/*` requests route to the Express backend
- **Runtime**: Node.js 20.x with 1GB memory

For detailed deployment instructions, see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md).

---

## 📚 Database Schema

The database schema is managed with **Drizzle ORM** and includes:

- **Users** — User accounts and authentication
- **Organizations** — Company/tenant information
- **Rules** — Filter rules and configurations
- **Decisions** — Auto-rejection logs
- **Candidates** — Applicant data
- **Alerts** — Anomaly detection alerts

### Schema Management

```bash
# View current schema
pnpm --filter @workspace/db run studio

# Create new migration
pnpm --filter @workspace/db run generate

# Apply migrations
pnpm --filter @workspace/db run migrate

# Push schema directly (dev only)
pnpm --filter @workspace/db run push
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and type checking (`pnpm run typecheck && pnpm run test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Style

- Use **TypeScript** for all new code
- Follow **ESLint** and **Prettier** configurations
- Write **meaningful commit messages**
- Add **JSDoc comments** for public APIs
- Ensure **type safety** — no `any` types without justification

---

## 🐛 Troubleshooting

### Common Issues

#### "Use pnpm instead" error
This project requires pnpm. Install it globally:
```bash
npm install -g pnpm
```

#### Database connection errors
Ensure PostgreSQL is running and `DATABASE_URL` is correctly set in `.env`:
```bash
# Test connection
psql $DATABASE_URL
```

#### Port already in use
Change the port in your environment variables or kill the process:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

#### Module not found errors
Clear node_modules and reinstall:
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Replit](https://replit.com) — Development environment and deployment
- [shadcn/ui](https://ui.shadcn.com/) — Beautiful component library
- [TanStack Query](https://tanstack.com/query) — Powerful data fetching
- [Drizzle ORM](https://orm.drizzle.team/) — Excellent TypeScript ORM

---

## 📞 Support

- **Documentation:** [docs.clearfunnel.com](https://docs.clearfunnel.com)
- **Issues:** [GitHub Issues](https://github.com/yourusername/clear-funnel/issues)
- **Email:** support@clearfunnel.com

---

## 🗺️ Roadmap

- [ ] Multi-tenant support
- [ ] Advanced analytics dashboard
- [ ] ATS integration plugins (Greenhouse, Lever, Workday)
- [ ] Machine learning bias detection
- [ ] Compliance report generation
- [ ] Mobile application
- [ ] API webhooks
- [ ] SSO/SAML authentication

---

**Built with ❤️ by the ClearFunnel Team**
