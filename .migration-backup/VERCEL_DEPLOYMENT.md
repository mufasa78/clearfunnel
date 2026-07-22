# Vercel Deployment Guide for ClearFunnel

This guide explains how to deploy ClearFunnel (frontend + backend) to Vercel.

## Prerequisites

- Vercel account (sign up at https://vercel.com)
- Vercel CLI installed: `npm i -g vercel`
- PostgreSQL database (Vercel Postgres, Supabase, Neon, etc.)

## Setup Steps

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Set Up Environment Variables

You need to add environment variables to your Vercel project:

```bash
# Navigate to your project
cd clear-funnel

# Add DATABASE_URL
vercel env add DATABASE_URL

# Add other environment variables as needed
vercel env add NODE_ENV
vercel env add VITE_API_BASE_URL
```

**Required Environment Variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Set to `production`
- `VITE_API_BASE_URL` - Your Vercel app URL with /api (e.g., `https://clearfunnel.vercel.app/api`)

### 4. Configure Database

#### Option A: Vercel Postgres (Recommended)

1. Go to your Vercel dashboard
2. Select your project > Storage > Create Database
3. Choose Postgres
4. The `DATABASE_URL` will be automatically added to your environment variables

#### Option B: External Database (Supabase, Neon, etc.)

1. Create a PostgreSQL database on your preferred provider
2. Copy the connection string
3. Add it as `DATABASE_URL` environment variable in Vercel

### 5. Deploy to Vercel

#### First Deployment

```bash
# Run from project root
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account/team
- Link to existing project? **N**
- Project name? **clearfunnel** (or your preferred name)
- Directory? **./** (project root)
- Override settings? **N**

#### Subsequent Deployments

```bash
# Deploy to production
vercel --prod

# Or just deploy to preview
vercel
```

### 6. Run Database Migrations

After first deployment, run migrations:

```bash
# Install dependencies locally
pnpm install

# Push database schema
pnpm --filter @workspace/db run push
```

Or connect to your database and run migrations manually.

### 7. Update Frontend API URL

Update your environment variables in Vercel dashboard:

1. Go to Project Settings > Environment Variables
2. Update `VITE_API_BASE_URL` to your deployed URL + /api
   - Example: `https://clearfunnel.vercel.app/api`
3. Redeploy: `vercel --prod`

## Architecture on Vercel

ClearFunnel deploys as:

- **Frontend**: Static site from `artifacts/clearfunnel/dist`
  - Served at the root `/`
  - Built with Vite
  - All `/api/*` requests are proxied to the backend

- **Backend**: Serverless function at `/api`
  - Express app runs as a Vercel serverless function
  - Located in `api/index.ts`
  - Routes all API requests through `/api/*`

## Project Structure

```
clear-funnel/
├── api/
│   └── index.ts              # Vercel serverless function (Express API)
├── artifacts/
│   ├── clearfunnel/          # Frontend (React + Vite)
│   └── api-server/           # Backend source (Express)
├── lib/
│   └── db/                   # Database schema & client
├── vercel.json               # Vercel configuration
└── .vercelignore             # Files to ignore during deployment
```

## Vercel Configuration

The `vercel.json` file configures:

- **Build Command**: `pnpm run build` - Builds both frontend and backend
- **Output Directory**: `artifacts/clearfunnel/dist` - Frontend static files
- **Rewrites**: Routes `/api/*` to the serverless function
- **Functions**: Configures Node.js 20 runtime with 1GB memory

## Troubleshooting

### Build Fails

**Check pnpm version:**
```bash
vercel env add PNPM_VERSION
# Enter: 9 (or your version)
```

**Check Node version:**
Vercel uses Node 20 by default. To change:
```bash
vercel env add NODE_VERSION
# Enter: 20 (or your preferred version)
```

### Database Connection Issues

- Verify `DATABASE_URL` is set correctly in Vercel environment variables
- For Vercel Postgres, ensure you're using the pooled connection string
- Check database allows connections from Vercel IPs

### API Routes Not Working

- Ensure `/api` prefix is used in frontend API calls
- Check `VITE_API_BASE_URL` environment variable
- Verify rewrites in `vercel.json` are correct

### Environment Variables Not Loading

- Environment variables must be set in Vercel dashboard
- Restart the project after adding new variables
- For frontend variables, prefix with `VITE_`

## Useful Commands

```bash
# View deployment logs
vercel logs <deployment-url>

# List all deployments
vercel ls

# Remove a deployment
vercel rm <deployment-url>

# Open project in Vercel dashboard
vercel open

# Check environment variables
vercel env ls

# Pull environment variables locally
vercel env pull
```

## Production Checklist

- [ ] Database is provisioned and accessible
- [ ] All environment variables are set
- [ ] Database schema is pushed/migrated
- [ ] Frontend API URL is configured
- [ ] Custom domain is configured (optional)
- [ ] CORS is properly configured for your domain
- [ ] Error tracking is set up (Sentry, etc.)
- [ ] Analytics is configured (if needed)

## Custom Domain

To add a custom domain:

1. Go to Project Settings > Domains
2. Add your domain
3. Follow DNS configuration instructions
4. Update `VITE_API_BASE_URL` and `CORS_ORIGIN` accordingly

## Continuous Deployment

Vercel automatically deploys:

- **Production**: Commits to `main` branch
- **Preview**: Pull requests and other branches

Configure in: Project Settings > Git

## Support

- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- ClearFunnel Issues: https://github.com/yourusername/clear-funnel/issues
