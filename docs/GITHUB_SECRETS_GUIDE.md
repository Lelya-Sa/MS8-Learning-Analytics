# 🔐 GitHub Secrets Configuration Guide

## 📋 Overview

This guide shows **exactly** how to configure GitHub secrets for CI/CD deployment. **NO local .env files needed** - everything uses GitHub Secrets and cloud platform variables.

## 🎯 Required Secrets

### Go to: GitHub Repository → Settings → Secrets and variables → Actions → New repository secret

---

## 🔴 Backend Secrets (For Railway Deployment)

### 1. RAILWAY_TOKEN
**Name**: `RAILWAY_TOKEN`

**How to get it**:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Get your token
railway whoami
# Copy the token from the output, or get it from:
# https://railway.app/account/tokens
```

**Where it's used**: `.github/workflows/backend-ci-cd.yml` line 114

---

### 2. DATABASE_URL (For Prisma)
**Name**: `DATABASE_URL`

**How to get it**:
1. Go to your **Supabase project** dashboard
2. Navigate to **Settings** → **Database**
3. Scroll to "Connection string" → **URI**
4. Copy the connection string
5. Format: `postgresql://postgres:[PASSWORD]@[PROJECT_REF].supabase.co:5432/postgres`

**Example**:
```
postgresql://postgres.abcdef:MyPassword@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Where it's used**: 
- `.github/workflows/backend-ci-cd.yml` line 60
- `.github/workflows/database-ci-cd.yml` (multiple places)

---

## 🔵 Frontend Secrets (For Vercel Deployment)

### 3. VERCEL_TOKEN
**Name**: `VERCEL_TOKEN`

**How to get it**:
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link your project
cd frontend
vercel link

# Or get token from dashboard:
# https://vercel.com/account/tokens
```

**Where it's used**: `.github/workflows/frontend-ci-cd.yml` lines 118, 159

---

### 4. VERCEL_ORG_ID
**Name**: `VERCEL_ORG_ID`

**How to get it**:
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Go to your project → **Settings** → **General**
3. Find "Team ID" or "Organization ID"
4. Copy the ID

**Where it's used**: `.github/workflows/frontend-ci-cd.yml` lines 119, 160

---

### 5. VERCEL_PROJECT_ID
**Name**: `VERCEL_PROJECT_ID`

**How to get it**:

**Option 1: From Vercel Dashboard**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project: `ms8-learning-analytics-frontend`
3. Go to **Settings** tab (at the top)
4. Scroll down to **General** section
5. You'll see **Project ID** listed there
6. Copy the ID (it's typically in format like: `prj_xxxxxxxxxxxxx`)

**Option 2: Using Vercel CLI**
```bash
cd frontend
vercel link
# This will show your project ID in the output
```

**Option 3: From vercel.json or .vercel folder**
- If you've linked the project, check `frontend/.vercel/project.json`
- Or check your terminal output after running `vercel link`

**Where it's used**: `.github/workflows/frontend-ci-cd.yml` lines 120, 161

---

### 6. VITE_API_BASE_URL (Optional for build)
**Name**: `VITE_API_BASE_URL`

**Value**: Your Railway backend URL

**🎯 IMPORTANT**: Railway provides the domain automatically as an environment variable!

**How Railway Provides It**:
Railway automatically provides `RAILWAY_PUBLIC_DOMAIN` to every deployment with your actual URL, like:
```
https://your-project-name-production-xxxx.up.railway.app
```

**Option 1: Use in Vercel Dashboard (Recommended)**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `VITE_API_BASE_URL`
3. Set value to: Your Railway URL with `/api/v1` appended
4. Get the actual URL from Railway Dashboard → Your Service → Settings → Domains
5. Example: `https://your-backend-production-xxxx.up.railway.app/api/v1`

**Option 2: Use Railway Variable in Build**
You can reference Railway's environment variable in your build (if accessible):
```
https://${RAILWAY_PUBLIC_DOMAIN}/api/v1
```

**Option 3: Set After First Deployment**
If you don't know the URL yet:
1. Deploy backend first to get the URL
2. Then add it to Vercel environment variables
3. Redeploy frontend

**Where it's used**: `.github/workflows/frontend-ci-cd.yml` line 89

---

## 🟢 Database Secrets (For Supabase Migrations)

### 7. SUPABASE_URL (Optional, if using Supabase API)
**Name**: `SUPABASE_URL`

**How to get it**:
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy "Project URL"

**Where it's used**: Backend environment variables (Railway)

---

### 8. SUPABASE_ANON_KEY (Optional, if using Supabase API)
**Name**: `SUPABASE_ANON_KEY`

**How to get it**:
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy "anon public" key

**Where it's used**: Backend environment variables (Railway)

---

## ☁️ Cloud Platform Environment Variables

### Railway (Backend)

Go to: Railway Dashboard → Your Project → Variables

#### Required Variables:
```
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://...
```

#### Railway Auto-Provided Variables (READ-ONLY):
Railway automatically provides these - **don't add them manually**:
```
RAILWAY_PUBLIC_DOMAIN - Your public domain (https://xxx.up.railway.app)
RAILWAY_PROJECT_NAME - Your project name
RAILWAY_SERVICE_NAME - Your service name
RAILWAY_ENVIRONMENT_NAME - Environment name (production, etc.)
```

#### Optional Variables:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
JWT_SECRET=your-secret-key
```

### Vercel (Frontend)

Go to: Vercel Dashboard → Your Project → Settings → Environment Variables

#### Required Variables:
```
NODE_ENV=production
VITE_API_BASE_URL=https://[YOUR-ACTUAL-RAILWAY-URL].up.railway.app/api/v1
```

**⚠️ Important**: Replace `[YOUR-ACTUAL-RAILWAY-URL]` with your actual Railway URL (get it after deploying backend to Railway).

See [docs/RAILWAY_URL_EXPLANATION.md](./docs/RAILWAY_URL_EXPLANATION.md) for detailed instructions.

#### Optional Variables:
```
VITE_ENABLE_ANALYTICS=true
VITE_DEBUG_MODE=false
```

---

## 📊 Secrets Summary Table

| Secret Name | Used In | How to Get | Required |
|-------------|---------|------------|----------|
| `RAILWAY_TOKEN` | Backend deployment | `railway whoami` | ✅ Yes |
| `DATABASE_URL` | Database migrations | Supabase dashboard | ✅ Yes |
| `VERCEL_TOKEN` | Frontend deployment | `vercel login` | ✅ Yes |
| `VERCEL_ORG_ID` | Frontend deployment | Vercel dashboard | ✅ Yes |
| `VERCEL_PROJECT_ID` | Frontend deployment | Vercel dashboard | ✅ Yes |
| `VITE_API_BASE_URL` | Build process | Your backend URL | ⚠️ Optional |
| `SUPABASE_URL` | Backend runtime | Supabase dashboard | ⚠️ Optional |
| `SUPABASE_ANON_KEY` | Backend runtime | Supabase dashboard | ⚠️ Optional |

---

## ✅ Setup Checklist

### GitHub Secrets (Required)
- [ ] Added `RAILWAY_TOKEN`
- [ ] Added `DATABASE_URL`
- [ ] Added `VERCEL_TOKEN`
- [ ] Added `VERCEL_ORG_ID`
- [ ] Added `VERCEL_PROJECT_ID`

### Railway Environment Variables (Required)
- [ ] Added `NODE_ENV=production`
- [ ] Added `PORT=3000`
- [ ] Added `DATABASE_URL` (connection string)

### Vercel Environment Variables (Required)
- [ ] Added `NODE_ENV=production`
- [ ] Added `VITE_API_BASE_URL` (your backend URL)

---

## 🚀 Next Steps

1. **Add all secrets to GitHub** (see table above)
2. **Configure Railway variables** (backend)
3. **Configure Vercel variables** (frontend)
4. **Push to main** to trigger first deployment

---

## ⚠️ Important Notes

- **NO local .env files** are used in CI/CD
- All secrets come from **GitHub Secrets**
- All runtime variables come from **cloud platform dashboards**
- Secrets are encrypted and only available during workflow execution
- Do NOT commit secrets to code - use GitHub Secrets instead

---

## 🔗 Quick Links

- [Add GitHub Secrets](https://github.com/Lelya-Sa/MS8-Learning-Analytics/settings/secrets/actions)
- [Railway Environment Variables](https://railway.app/dashboard)
- [Vercel Environment Variables](https://vercel.com/dashboard)
- [Supabase API Settings](https://app.supabase.com/project/_/settings/api)

---

**Last Updated**: 2024-01-16
**Status**: Ready for configuration

