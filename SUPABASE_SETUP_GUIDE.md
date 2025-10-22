# 🗄️ **SUPABASE CONNECTION SETUP GUIDE**

## 🎯 **Phase 2C: Supabase Connection Setup**

**Status**: ⏳ **Manual Setup Required**  
**Repository**: `https://github.com/Lelya-Sa/MS8-Learning-Analytics`  
**Database Folder**: `database/`

---

## 📋 **Step-by-Step Supabase Setup**

### **1. Create Supabase Account**
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Choose "Sign up with GitHub"
4. Authorize Supabase to access your GitHub account

### **2. Create New Project**
1. Click "New Project"
2. **Project Name**: `MS8-Learning-Analytics`
3. **Database Password**: Create a strong password (save this!)
4. **Region**: Choose closest to your users
5. Click "Create new project"

### **3. Setup Database Schema**
1. Go to "SQL Editor" in the left sidebar
2. Click "New Query"
3. Copy and paste the contents of `database/schema.sql`
4. Click "Run" to execute the schema
5. Wait for completion (30-60 seconds)

### **4. Add Sample Data**
1. Create another "New Query"
2. Copy and paste the contents of `database/seed.sql`
3. Click "Run" to execute the seed data
4. Wait for completion (10-30 seconds)

### **5. Configure Environment Variables**
1. Go to "Settings" → "API"
2. Copy the following values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### **6. Update Railway Environment Variables**
1. Go back to Railway dashboard
2. Navigate to your backend service
3. Go to "Variables" tab
4. Update/add these variables:
   ```
   SUPABASE_URL = https://your-project-id.supabase.co
   SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

## ✅ **Validation Checklist**

- [ ] Supabase account created and connected to GitHub
- [ ] Project created: `MS8-Learning-Analytics`
- [ ] Database schema executed successfully
- [ ] Seed data loaded successfully
- [ ] Environment variables copied
- [ ] Railway environment variables updated
- [ ] Database accessible from backend
- [ ] Row Level Security policies active

---

## 🗄️ **Database Schema Overview**

### **Tables Created**:
- **users**: User accounts (admin, teacher, student roles)
- **courses**: Course information and metadata
- **enrollments**: Student course enrollments
- **assignments**: Course assignments and due dates
- **submissions**: Student assignment submissions
- **analytics_events**: Learning analytics tracking
- **learning_progress**: Student progress tracking

### **Features**:
- ✅ Row Level Security (RLS) enabled
- ✅ UUID primary keys
- ✅ Automatic timestamps
- ✅ Foreign key relationships
- ✅ Performance indexes
- ✅ Data validation constraints

---

## 🔧 **Database Functions Available**

### **Analytics Functions**:
- `getOverview()`: Learning analytics overview
- `getStudentProgress(studentId)`: Individual student progress
- `getCourseAnalytics(courseId)`: Course-specific analytics
- `trackEvent(userId, courseId, eventType, eventData)`: Event tracking

### **User Management**:
- `getUserByEmail(email)`: Find user by email
- `createUser(userData)`: Create new user account

### **Course Management**:
- `getAllCourses()`: List all active courses
- `getCourseById(courseId)`: Get course details with enrollments

---

## 🔧 **Troubleshooting**

### **Common Issues**:
1. **Schema Errors**: Check SQL syntax in schema.sql
2. **Permission Errors**: Verify RLS policies are active
3. **Connection Issues**: Check environment variables in Railway
4. **Seed Data**: Ensure foreign key relationships exist

### **Expected Result**:
- ✅ Database accessible at Supabase URL
- ✅ All tables created successfully
- ✅ Sample data loaded
- ✅ Backend can connect to database
- ✅ Analytics functions working

---

## 📊 **Deployment Status**

| Component | Status | URL | Notes |
|-----------|--------|-----|-------|
| **Frontend** | ✅ Complete | `https://ms8-learning-analytics-frontend.vercel.app` | Deployed |
| **Backend** | ✅ Complete | `https://ms8-learning-analytics-backend.railway.app` | Deployed |
| **Database** | ⏳ Deploying | `https://your-project-id.supabase.co` | Ready for setup |

---

## 🔐 **Security Features**

### **Row Level Security (RLS)**:
- Users can only access their own data
- Teachers can access their course data
- Students can access enrolled course data
- Admins have full access

### **Authentication**:
- Supabase Auth integration ready
- JWT token validation
- Role-based access control

---

*Supabase connection setup guide - Ready for database setup*
