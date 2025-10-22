# 🚀 **MS8-Learning-Analytics**

A comprehensive learning analytics platform with automated CI/CD pipeline and multi-service deployment infrastructure.

## 🎯 **Project Status**

**✅ INFRASTRUCTURE SETUP COMPLETE** - Production-ready infrastructure with automated CI/CD pipeline, comprehensive security, and complete documentation.

## 🏗️ **Architecture**

This is a monorepo with folder-based deployments:
- **`frontend/`** → Vercel deployment (Next.js 14)
- **`backend/`** → Railway deployment (Express.js)  
- **`database/`** → Supabase integration (PostgreSQL)

## 🔗 **Live Services**

- **Frontend**: https://ms8-frontend.vercel.app
- **Backend**: https://ms8-backend.railway.app
- **Database**: https://ms8-project.supabase.co
- **Repository**: https://github.com/Lelya-Sa/MS8-Learning-Analytics

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+
- Git
- Service provider accounts (Vercel, Railway, Supabase)

### **Development Setup**
1. **Clone the repository**
   ```bash
   git clone https://github.com/Lelya-Sa/MS8-Learning-Analytics.git
   cd MS8-Learning-Analytics
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd frontend && npm install
   
   # Backend
   cd ../backend && npm install
   ```

3. **Configure environment variables**
   - See `ENVIRONMENT_VARIABLES_GUIDE.md` for complete setup
   - Configure Vercel, Railway, and Supabase environment variables

4. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

## 📚 **Documentation**

### **Infrastructure Setup**
- **Complete Setup Guide**: `INFRASTRUCTURE_SETUP_COMPLETE.md`
- **Phase-by-Phase Guides**: `PHASE_*_*.md` files
- **Environment Variables**: `ENVIRONMENT_VARIABLES_GUIDE.md`
- **Service Integration**: `PHASE_2_INTEGRATION_GUIDE.md`

### **Testing & Validation**
- **CI/CD Testing**: `PHASE_3_CICD_TESTING.md`
- **Testing Scripts**: `scripts/test-*.sh` and `scripts/test-*.ps1`
- **Service Validation**: `scripts/test-service-providers.*`

### **Configuration**
- **GitHub Repository**: `GITHUB_REPO_CONFIG.md`
- **Service Provider Setup**: `PHASE_1B_SERVICE_SETUP.md`
- **Database Schema**: `database/schema.sql`
- **Migrations**: `database/migrations/`

## 🔧 **Technology Stack**

### **Frontend**
- **Framework**: Next.js 14 with React 18
- **Deployment**: Vercel
- **Database Client**: Supabase Client
- **Styling**: Modern CSS with responsive design

### **Backend**
- **Framework**: Express.js with Node.js 18
- **Deployment**: Railway
- **Database**: Supabase (PostgreSQL)
- **Security**: Helmet, CORS, Rate Limiting, JWT

### **Database**
- **Database**: PostgreSQL on Supabase
- **Security**: Row Level Security (RLS) policies
- **Schema**: Complete learning analytics schema
- **Functions**: Analytics and reporting functions

### **DevOps**
- **CI/CD**: GitHub Actions
- **Deployment**: Automated folder-based deployments
- **Monitoring**: Health checks and performance monitoring
- **Security**: Dependabot, secret scanning, branch protection

## 🛡️ **Security Features**

- **Repository Security**: Branch protection, Dependabot alerts
- **Service Security**: Environment variables, API key protection
- **Database Security**: RLS policies, user authentication
- **Network Security**: CORS policies, rate limiting
- **Authentication**: Supabase Auth with JWT tokens

## 📊 **Database Schema**

The database includes comprehensive tables for learning analytics:
- **Users**: User management and authentication
- **Courses**: Course management and enrollment
- **Enrollments**: Student course enrollments
- **Learning Analytics**: Event tracking and analytics
- **Assignments**: Assignment management
- **Submissions**: Student submissions and grading

## 🔄 **CI/CD Pipeline**

### **Automated Workflows**
- **Frontend Deployment**: Triggers on `frontend/` changes → Vercel
- **Backend Deployment**: Triggers on `backend/` changes → Railway
- **Database Updates**: Triggers on `database/` changes → Supabase
- **Integration Testing**: Cross-service testing and validation

### **Deployment Process**
1. **Code Push**: Push changes to GitHub
2. **Workflow Trigger**: GitHub Actions detects folder changes
3. **Service Deployment**: Automated deployment to respective service
4. **Health Checks**: Automated health checks and validation
5. **Integration Testing**: Cross-service communication tests

## 🧪 **Testing**

### **Testing Scripts**
- **Service Provider Testing**: `scripts/test-service-providers.*`
- **Integration Testing**: `scripts/test-phase2-integration.*`
- **CI/CD Testing**: `scripts/test-phase3-cicd.*`

### **Manual Testing**
```bash
# Test frontend
curl -f https://ms8-frontend.vercel.app

# Test backend
curl -f https://ms8-backend.railway.app/health

# Test database
curl -H "apikey: $SUPABASE_ANON_KEY" $SUPABASE_URL/rest/v1/
```

## 📈 **Performance**

### **Targets**
- **Frontend Load Time**: < 2 seconds
- **Backend Response Time**: < 1 second
- **Database Queries**: < 500ms
- **Uptime**: 99.9% target

### **Monitoring**
- **Health Checks**: Automated health monitoring
- **Performance Monitoring**: Response time tracking
- **Error Logging**: Centralized error logging
- **Alerting**: Automated alerting for issues

## 🚀 **Development Roadmap**

### **Immediate Tasks**
1. **User Authentication**: Implement Supabase Auth UI
2. **Course Management**: Build course CRUD operations
3. **Analytics Dashboard**: Create analytics visualization
4. **Assignment System**: Implement assignment management
5. **Grade Management**: Build grading and feedback system

### **Future Features**
- **Real-time Analytics**: Live analytics dashboard
- **Advanced Reporting**: Custom report generation
- **Mobile App**: React Native mobile application
- **API Extensions**: Additional API endpoints
- **Performance Optimization**: Advanced caching and optimization

## 🤝 **Contributing**

Please read our [Contributing Guidelines](CONTRIBUTING.md) and follow the established workflows.

### **Development Process**
1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** your changes
5. **Submit** a pull request

## 📞 **Support**

### **Documentation**
- **Setup Guides**: Complete infrastructure setup documentation
- **Troubleshooting**: Common issues and solutions
- **API Documentation**: Complete API reference
- **Database Schema**: Complete database documentation

### **Emergency Contacts**
- **Technical Lead**: [Contact Information]
- **DevOps Engineer**: [Contact Information]
- **Security Engineer**: [Contact Information]

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 **Acknowledgments**

- **Infrastructure Setup**: Complete automated infrastructure setup
- **Security Framework**: Comprehensive security implementation
- **Documentation**: Complete setup and operational documentation
- **Testing Framework**: Automated testing and validation

---

**🚀 Ready for Development! The MS8-Learning-Analytics infrastructure is complete and ready for feature development.**
