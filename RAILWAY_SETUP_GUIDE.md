# 🚂 **RAILWAY CONNECTION SETUP GUIDE**

## 🎯 **Phase 2B: Railway Connection Setup**

**Status**: ⏳ **Manual Setup Required**  
**Repository**: `https://github.com/Lelya-Sa/MS8-Learning-Analytics`  
**Backend Folder**: `backend/`

---

## 📋 **Step-by-Step Railway Setup**

### **1. Create Railway Account**
1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Choose "Login with GitHub"
4. Authorize Railway to access your GitHub account

### **2. Deploy from GitHub**
1. Click "Deploy from GitHub repo"
2. Find and select `Lelya-Sa/MS8-Learning-Analytics`
3. Click "Deploy Now"

### **3. Configure Service**
1. **Service Name**: `ms8-learning-analytics-backend`
2. **Root Directory**: `backend`
3. **Build Command**: `npm install` (auto-detected)
4. **Start Command**: `npm start` (auto-detected)

### **4. Environment Variables**
1. Go to "Variables" tab
2. Add the following variables:
   ```
   NODE_ENV = production
   PORT = 3000
   SUPABASE_URL = your-supabase-project-url
   SUPABASE_ANON_KEY = your-supabase-anon-key
   ```

### **5. Deploy**
1. Railway will automatically detect the `backend/` folder
2. Wait for deployment to complete (3-5 minutes)
3. Note the deployment URL (e.g., `https://ms8-learning-analytics-backend.railway.app`)

---

## ✅ **Validation Checklist**

- [ ] Railway account created and connected to GitHub
- [ ] Project deployed from `Lelya-Sa/MS8-Learning-Analytics`
- [ ] Root directory set to `backend/`
- [ ] Environment variables configured
- [ ] Deployment successful
- [ ] Backend accessible via URL
- [ ] Health check endpoint responds: `/api/health`

---

## 🔧 **API Endpoints Available**

### **Health Check**
- **URL**: `GET /api/health`
- **Response**: `{"status": "healthy", "timestamp": "...", "uptime": 123}`

### **Status Endpoint**
- **URL**: `GET /api/status`
- **Response**: Service status and connection info

### **Analytics Endpoints**
- **URL**: `GET /api/analytics/overview`
- **Response**: Learning analytics overview data

- **URL**: `GET /api/analytics/students`
- **Response**: Student data and progress

- **URL**: `GET /api/analytics/courses`
- **Response**: Course information and statistics

---

## 🔧 **Troubleshooting**

### **Common Issues**:
1. **Port Issues**: Ensure `PORT` environment variable is set
2. **Dependencies**: Check that `package.json` is in `backend/` folder
3. **Health Check**: Verify `/api/health` endpoint responds

### **Expected Result**:
- ✅ Backend deployed at `https://ms8-learning-analytics-backend.railway.app`
- ✅ Health check endpoint returns 200 OK
- ✅ API endpoints respond correctly
- ✅ Environment variables loaded

---

## 📊 **Deployment Status**

| Component | Status | URL | Notes |
|-----------|--------|-----|-------|
| **Frontend** | ✅ Complete | `https://ms8-learning-analytics-frontend.vercel.app` | Deployed |
| **Backend** | ⏳ Deploying | `https://ms8-learning-analytics-backend.railway.app` | Ready for deployment |
| **Database** | ⏳ Pending | Supabase Project | Next step |

---

*Railway connection setup guide - Ready for deployment*
