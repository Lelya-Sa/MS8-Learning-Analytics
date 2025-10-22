# 🔐 **ENVIRONMENT VARIABLES REFERENCE GUIDE**

## 📋 **Overview**

This guide provides a complete reference for all environment variables needed across the MS8-Learning-Analytics infrastructure. All variables are managed through cloud service dashboards, not local `.env` files.

---

## 🌐 **VERCEL ENVIRONMENT VARIABLES**

### **Frontend Application Variables**
Set these in Vercel Dashboard → Project Settings → Environment Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://ms8-backend.railway.app` | ✅ |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://abcdefgh.supabase.co` | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | ✅ |
| `NEXT_PUBLIC_APP_NAME` | Application name | `MS8 Learning Analytics` | ✅ |
| `NEXT_PUBLIC_APP_VERSION` | Application version | `1.0.0` | ✅ |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | Analytics feature flag | `true` | ❌ |
| `NEXT_PUBLIC_ENABLE_DARK_MODE` | Dark mode feature flag | `true` | ❌ |

### **Vercel Configuration Variables**
Set these in Vercel Dashboard → Project Settings → General

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `VERCEL_TOKEN` | API token for deployments | `vercel_xxxxx` | ✅ |
| `VERCEL_ORG_ID` | Organization ID | `team_xxxxx` | ✅ |
| `VERCEL_PROJECT_ID` | Project ID | `prj_xxxxx` | ✅ |

---

## 🚂 **RAILWAY ENVIRONMENT VARIABLES**

### **Backend Application Variables**
Set these in Railway Dashboard → Project → Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | `8000` | ✅ |
| `NODE_ENV` | Environment | `production` | ✅ |
| `DATABASE_URL` | Database connection string | `postgresql://user:pass@host:port/db` | ✅ |
| `SUPABASE_URL` | Supabase project URL | `https://abcdefgh.supabase.co` | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | ✅ |
| `JWT_SECRET` | JWT signing secret | `your-super-secret-jwt-key` | ✅ |
| `CORS_ORIGIN` | Allowed CORS origins | `https://ms8-frontend.vercel.app` | ✅ |
| `LOG_LEVEL` | Logging level | `info` | ❌ |
| `API_RATE_LIMIT` | API rate limit | `100` | ❌ |

### **Railway Configuration Variables**
Set these in Railway Dashboard → Account Settings → Tokens

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `RAILWAY_TOKEN` | API token for deployments | `railway_xxxxx` | ✅ |
| `RAILWAY_PROJECT_ID` | Project ID | `project_xxxxx` | ✅ |

---

## 🗄️ **SUPABASE ENVIRONMENT VARIABLES**

### **Database Configuration Variables**
Set these in Supabase Dashboard → Settings → API

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `SUPABASE_URL` | Project URL | `https://abcdefgh.supabase.co` | ✅ |
| `SUPABASE_ANON_KEY` | Anonymous key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | ✅ |
| `DATABASE_URL` | Database connection string | `postgresql://postgres:pass@db.abcdefgh.supabase.co:5432/postgres` | ✅ |
| `SUPABASE_PROJECT_REF` | Project reference | `abcdefgh` | ✅ |

### **Supabase Configuration Variables**
Set these in Supabase Dashboard → Account Settings → Access Tokens

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `SUPABASE_ACCESS_TOKEN` | Access token for API | `sbp_xxxxx` | ✅ |

---

## 🔐 **GITHUB SECRETS**

Set these in GitHub Repository → Settings → Secrets and variables → Actions

### **Vercel Secrets**
```
VERCEL_TOKEN=vercel_xxxxx
VERCEL_ORG_ID=team_xxxxx
VERCEL_PROJECT_ID=prj_xxxxx
VERCEL_FRONTEND_URL=https://ms8-frontend.vercel.app
```

### **Railway Secrets**
```
RAILWAY_TOKEN=railway_xxxxx
RAILWAY_BACKEND_URL=https://ms8-backend.railway.app
```

### **Supabase Secrets**
```
SUPABASE_ACCESS_TOKEN=sbp_xxxxx
SUPABASE_PROJECT_REF=abcdefgh
SUPABASE_DATABASE_URL=postgresql://postgres:pass@db.abcdefgh.supabase.co:5432/postgres
```

---

## 🔄 **ENVIRONMENT VARIABLE FLOW**

### **Development → Production Flow**
1. **Local Development**: Use cloud service development environments
2. **Staging**: Use cloud service preview/staging environments
3. **Production**: Use cloud service production environments

### **Cross-Service Communication**
```
Frontend (Vercel) → Backend (Railway) → Database (Supabase)
     ↓                    ↓                    ↓
NEXT_PUBLIC_API_URL → RAILWAY_BACKEND_URL → SUPABASE_DATABASE_URL
```

---

## ✅ **VALIDATION CHECKLIST**

### **Vercel Variables**
- [ ] All `NEXT_PUBLIC_*` variables set
- [ ] API URL points to Railway backend
- [ ] Supabase URL and keys configured
- [ ] Feature flags set appropriately

### **Railway Variables**
- [ ] Port and environment configured
- [ ] Database URL points to Supabase
- [ ] CORS origin allows Vercel frontend
- [ ] JWT secret is secure and unique

### **Supabase Variables**
- [ ] Project URL and keys configured
- [ ] Database connection string valid
- [ ] Service role key has proper permissions
- [ ] Project reference is correct

### **GitHub Secrets**
- [ ] All service provider tokens added
- [ ] URLs point to correct deployments
- [ ] Secrets tested in workflows

---

## 🚨 **SECURITY BEST PRACTICES**

1. **Never commit secrets** to version control
2. **Use strong, unique passwords** for all services
3. **Rotate secrets regularly** (every 90 days)
4. **Limit secret permissions** to minimum required
5. **Monitor secret usage** through service dashboards
6. **Use different secrets** for different environments

---

## 🔧 **TROUBLESHOOTING**

### **Common Issues**
- **CORS errors**: Check `CORS_ORIGIN` in Railway
- **Database connection**: Verify `DATABASE_URL` format
- **API calls failing**: Check `NEXT_PUBLIC_API_URL` in Vercel
- **Authentication issues**: Verify Supabase keys

### **Testing Commands**
```bash
# Test Vercel connection
curl -H "Authorization: Bearer $VERCEL_TOKEN" https://api.vercel.com/v2/user

# Test Railway connection
curl -H "Authorization: Bearer $RAILWAY_TOKEN" https://backboard.railway.app/graphql

# Test Supabase connection
curl -H "apikey: $SUPABASE_ANON_KEY" $SUPABASE_URL/rest/v1/
```

---

*This guide ensures all environment variables are properly configured across all services for the MS8-Learning-Analytics infrastructure.*
