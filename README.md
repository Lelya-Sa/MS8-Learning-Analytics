# MS8-Learning-Analytics

A comprehensive learning analytics platform with multi-service deployment architecture.

## Architecture

- **Frontend**: Deployed on Vercel
- **Backend**: Deployed on Railway  
- **Database**: Supabase integration

## Project Structure

```
MS8-Learning-Analytics/
├── frontend/          # Frontend application (Vercel deployment)
├── backend/           # Backend API (Railway deployment)
├── database/          # Database schemas and migrations (Supabase)
└── README.md          # This file
```

## Getting Started

This repository is configured for automated deployment across multiple services:

1. **Frontend**: Automatically deploys to Vercel when changes are pushed to the main branch
2. **Backend**: Automatically deploys to Railway when changes are pushed to the main branch  
3. **Database**: Connected to Supabase for data persistence

## Development

Each service can be developed independently within its respective folder. The infrastructure is stack-agnostic and supports any frontend framework, backend language, or database technology.

## Infrastructure Status

- ✅ Repository initialized
- ✅ Essential folder structure created
- 🔄 Service provider connections in progress
