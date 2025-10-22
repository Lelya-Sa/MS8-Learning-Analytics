# 🔗 **PHASE 2: SERVICE INTEGRATION & CONFIGURATION**

**Phase**: Service Integration & Configuration  
**Status**: ⏳ **IN PROGRESS**  
**Date**: 2025-01-22  
**Roles**: Frontend Engineer, Backend Engineer, Database Engineer, DevOps Engineer  

---

## 📋 **PHASE 2 OVERVIEW**

Phase 2 focuses on integrating and configuring the three main services (Vercel, Railway, Supabase) to work together seamlessly with proper cross-service communication.

### **🎯 Phase 2A: Vercel Frontend Integration**
### **🎯 Phase 2B: Railway Backend Integration**  
### **🎯 Phase 2C: Supabase Database Integration**

---

## 🔗 **PHASE 2A: VERCEL FRONTEND INTEGRATION**

### **Step 1: Vercel Project Configuration**
1. **Import Repository**: Connect Vercel to your GitHub repository
2. **Root Directory**: Set to `frontend/` for monorepo deployment
3. **Build Settings**: Configure Next.js build commands
4. **Environment Variables**: Set frontend-specific variables

### **Step 2: Environment Variables Setup**
Configure these in Vercel Dashboard → Project Settings → Environment Variables:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://your-railway-backend-url.railway.app
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# App Configuration  
NEXT_PUBLIC_APP_NAME=MS8 Learning Analytics
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_ENVIRONMENT=production
```

### **Step 3: Vercel Configuration File**
The `frontend/vercel.json` is already configured with:
- Build settings for Next.js
- Environment variables
- Function runtime configuration

### **Step 4: GitHub Integration**
- **Automatic Deployments**: Enabled for main branch
- **Preview Deployments**: Enabled for pull requests
- **Build Commands**: `npm run build`
- **Output Directory**: `.next`

---

## 🚂 **PHASE 2B: RAILWAY BACKEND INTEGRATION**

### **Step 1: Railway Project Configuration**
1. **Import Repository**: Connect Railway to your GitHub repository
2. **Root Directory**: Set to `backend/` for monorepo deployment
3. **Build Settings**: Configure Node.js build commands
4. **Environment Variables**: Set backend-specific variables

### **Step 2: Environment Variables Setup**
Configure these in Railway Dashboard → Project → Variables:

```bash
# Server Configuration
PORT=8000
NODE_ENV=production

# Database Configuration
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# CORS Configuration
CORS_ORIGIN=https://your-vercel-frontend-url.vercel.app

# Optional Configuration
LOG_LEVEL=info
API_RATE_LIMIT=100
```

### **Step 3: Railway Configuration File**
The `backend/railway.json` is already configured with:
- Build settings for Node.js
- Health check configuration
- Restart policy settings

### **Step 4: GitHub Integration**
- **Automatic Deployments**: Enabled for main branch
- **Health Checks**: Configured on `/health` endpoint
- **Build Commands**: `npm run build`
- **Start Commands**: `npm start`

---

## 🗄️ **PHASE 2C: SUPABASE DATABASE INTEGRATION**

### **Step 1: Supabase Project Configuration**
1. **Create Project**: Set up Supabase project
2. **Database Setup**: Configure PostgreSQL database
3. **API Keys**: Generate and configure API keys
4. **Schema Management**: Set up database schema

### **Step 2: Environment Variables Setup**
Configure these in Supabase Dashboard → Settings → API:

```bash
# Project Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database Configuration
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
SUPABASE_PROJECT_REF=your_project_ref
```

### **Step 3: Database Schema Setup**
Create initial database schema in Supabase SQL Editor:

```sql
-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create users table
CREATE TABLE public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics table
CREATE TABLE public.analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  event_type TEXT NOT NULL,
  event_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own analytics" ON public.analytics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics" ON public.analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### **Step 4: GitHub Integration**
- **Schema Migrations**: Store in `database/` folder
- **Type Generation**: Automated TypeScript type generation
- **API Integration**: Ready for frontend and backend

---

## 🔄 **CROSS-SERVICE COMMUNICATION**

### **Frontend → Backend Communication**
```javascript
// Frontend API calls to Railway backend
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Example API call
const response = await fetch(`${API_URL}/api/users`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### **Backend → Database Communication**
```javascript
// Backend Supabase client
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Example database query
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId);
```

### **Frontend → Database Communication**
```javascript
// Frontend Supabase client
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Example direct database access
const { data, error } = await supabase
  .from('analytics')
  .select('*')
  .eq('user_id', userId);
```

---

## ✅ **VALIDATION CHECKLIST**

### **Vercel Integration**
- [ ] Project connected to GitHub repository
- [ ] Root directory set to `frontend/`
- [ ] Environment variables configured
- [ ] Build and deployment successful
- [ ] Preview deployments working

### **Railway Integration**
- [ ] Project connected to GitHub repository
- [ ] Root directory set to `backend/`
- [ ] Environment variables configured
- [ ] Build and deployment successful
- [ ] Health checks passing

### **Supabase Integration**
- [ ] Project created and configured
- [ ] Database schema created
- [ ] API keys generated and configured
- [ ] RLS policies implemented
- [ ] Type generation working

### **Cross-Service Communication**
- [ ] Frontend can communicate with backend
- [ ] Backend can communicate with database
- [ ] Frontend can communicate with database
- [ ] CORS policies configured correctly
- [ ] Authentication working across services

---

## 🚀 **NEXT STEPS - PHASE 3**

Once all services are integrated and communicating:
1. **Test GitHub Actions Workflows** with live deployments
2. **Validate Folder-Based Deployments** across all services
3. **Run Integration Tests** for end-to-end validation
4. **Configure Monitoring** and alerting systems

---

## 📞 **SUPPORT RESOURCES**

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)

---

*Complete Phase 2 before proceeding to Phase 3. All services must be integrated and communicating properly.*
