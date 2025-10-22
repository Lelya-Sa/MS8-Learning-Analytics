# 🚀 **PHASE 1B: SERVICE PROVIDER ACCOUNT SETUP**

**Phase**: Service Provider Account Setup  
**Status**: ⏳ **IN PROGRESS**  
**Date**: 2025-01-22  
**Roles**: DevOps Engineer, Security Engineer  

---

## 📋 **SERVICE PROVIDER SETUP REQUIREMENTS**

### **🎯 Vercel Account Setup (Frontend)**

#### **Step 1: Create Vercel Account**
1. **Sign Up**: Go to [vercel.com](https://vercel.com) and sign up
2. **GitHub Integration**: Connect your GitHub account
3. **Team Setup**: Create or join a team (optional)

#### **Step 2: Create Vercel Project**
1. **Import Repository**: 
   - Click "New Project"
   - Import `MS8-Learning-Analytics` repository
   - Select `frontend/` as the root directory

2. **Project Configuration**:
   - **Project Name**: `ms8-learning-analytics-frontend`
   - **Framework Preset**: Auto-detect (or specify your framework)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist` (or your build output)

#### **Step 3: Environment Variables**
Set these in Vercel dashboard (Project Settings → Environment Variables):
```
NEXT_PUBLIC_API_URL=https://your-railway-backend-url.railway.app
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_NAME=MS8 Learning Analytics
NEXT_PUBLIC_APP_VERSION=1.0.0
```

#### **Step 4: Get Vercel Credentials**
1. **API Token**: 
   - Go to Account Settings → Tokens
   - Create new token with "Full Access" scope
   - Copy token for GitHub secrets

2. **Project IDs**:
   - Project ID: Found in project settings
   - Organization ID: Found in team settings

---

### **🚂 Railway Account Setup (Backend)**

#### **Step 1: Create Railway Account**
1. **Sign Up**: Go to [railway.app](https://railway.app) and sign up
2. **GitHub Integration**: Connect your GitHub account
3. **Team Setup**: Create or join a team (optional)

#### **Step 2: Create Railway Project**
1. **New Project**: Click "New Project"
2. **Deploy from GitHub**: Select `MS8-Learning-Analytics` repository
3. **Service Configuration**:
   - **Service Name**: `ms8-learning-analytics-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`

#### **Step 3: Environment Variables**
Set these in Railway dashboard (Variables tab):
```
PORT=8000
NODE_ENV=production
DATABASE_URL=postgresql://postgres:[password]@[host]:[port]/[database]
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=https://your-vercel-frontend-url.vercel.app
```

#### **Step 4: Get Railway Credentials**
1. **API Token**:
   - Go to Account Settings → Tokens
   - Create new token
   - Copy token for GitHub secrets

2. **Service URL**:
   - Copy the generated Railway URL
   - Format: `https://your-service-name.railway.app`

---

### **🗄️ Supabase Account Setup (Database)**

#### **Step 1: Create Supabase Account**
1. **Sign Up**: Go to [supabase.com](https://supabase.com) and sign up
2. **GitHub Integration**: Connect your GitHub account
3. **Team Setup**: Create or join a team (optional)

#### **Step 2: Create Supabase Project**
1. **New Project**: Click "New Project"
2. **Project Configuration**:
   - **Project Name**: `MS8-Learning-Analytics`
   - **Database Password**: Generate strong password
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Start with free tier

#### **Step 3: Database Setup**
1. **Schema Creation**: Use the SQL editor to create initial schema
2. **Row Level Security**: Enable RLS policies
3. **API Keys**: Copy API keys from Settings → API

#### **Step 4: Environment Variables**
Set these in Supabase dashboard (Settings → API):
```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

#### **Step 5: Get Supabase Credentials**
1. **Access Token**:
   - Go to Account Settings → Access Tokens
   - Create new token
   - Copy token for GitHub secrets

2. **Project Reference**:
   - Found in project settings
   - Format: `abcdefghijklmnop`

---

## 🔐 **GITHUB SECRETS CONFIGURATION**

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

### **Vercel Secrets**
```
VERCEL_TOKEN=your_vercel_api_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
VERCEL_FRONTEND_URL=https://your-project.vercel.app
```

### **Railway Secrets**
```
RAILWAY_TOKEN=your_railway_api_token
RAILWAY_BACKEND_URL=https://your-service.railway.app
```

### **Supabase Secrets**
```
SUPABASE_ACCESS_TOKEN=your_supabase_access_token
SUPABASE_PROJECT_REF=your_project_ref
SUPABASE_DATABASE_URL=your_database_url
```

---

## ✅ **VALIDATION CHECKLIST**

### **Vercel Validation**
- [ ] Account created and GitHub connected
- [ ] Project created and linked to repository
- [ ] Environment variables configured
- [ ] API token generated
- [ ] Project ID and Org ID obtained
- [ ] Deployment test successful

### **Railway Validation**
- [ ] Account created and GitHub connected
- [ ] Project created and linked to repository
- [ ] Environment variables configured
- [ ] API token generated
- [ ] Service URL obtained
- [ ] Deployment test successful

### **Supabase Validation**
- [ ] Account created and GitHub connected
- [ ] Project created with database
- [ ] API keys obtained
- [ ] Access token generated
- [ ] Project reference obtained
- [ ] Database connection test successful

### **GitHub Secrets Validation**
- [ ] All Vercel secrets added
- [ ] All Railway secrets added
- [ ] All Supabase secrets added
- [ ] Secrets tested in workflows

---

## 🚀 **NEXT STEPS - PHASE 1C**

Once all service providers are configured:
1. **Test GitHub Actions workflows** with new secrets
2. **Verify cross-service communication**
3. **Run integration tests**
4. **Proceed to Phase 2** (Service Integration & Configuration)

---

## 📞 **SUPPORT RESOURCES**

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)

---

*Complete this phase before proceeding to Phase 1C. All service providers must be configured and validated.*
