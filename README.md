# 🚀 MS8-Learning-Analytics

**Framework**: Automated GitHub Actions CI/CD pipeline and multi-service deployment setup for MS8-Learning-Analytics repository.

**Architecture**: Monorepo with folder-based deployments
- `frontend/` → Vercel deployment
- `backend/` → Railway deployment  
- `database/` → Supabase integration

**Stack**: Technology-agnostic - works with any frontend/backend/database stack

## 📋 Project Structure

```
MS8-Learning-Analytics/
├── frontend/          # Frontend application (Vercel deployment)
├── backend/           # Backend API (Railway deployment)
├── database/          # Database schemas and migrations (Supabase)
├── .github/
│   └── workflows/    # GitHub Actions CI/CD workflows
└── README.md
```

## 🚀 Quick Start

1. **Development**: Each folder contains its respective application
2. **Deployment**: Automated via GitHub Actions on folder changes
3. **Services**: Integrated with Vercel, Railway, and Supabase

## 🔧 Infrastructure

- **CI/CD**: GitHub Actions with folder-based triggers
- **Frontend**: Vercel deployment
- **Backend**: Railway deployment
- **Database**: Supabase integration
- **Security**: Security-first approach with automated scanning

## 📚 Documentation

- [Infrastructure Setup Guide](./docs/infrastructure-setup.md)
- [Deployment Guide](./docs/deployment.md)
- [Security Policies](./docs/security.md)

---

**Status**: Infrastructure setup in progress
**Last Updated**: $(Get-Date -Format "yyyy-MM-dd")
