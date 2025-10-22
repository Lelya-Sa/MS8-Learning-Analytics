# Backend Application

This folder contains the backend API that will be deployed to Railway.

## Technology Stack
- **Framework**: Node.js with Express
- **Deployment**: Railway
- **Database**: Supabase integration
- **Package Manager**: npm

## Project Structure
```
backend/
├── index.js          # Main application entry point
├── package.json      # Node.js dependencies and scripts
├── railway.json      # Railway deployment configuration
├── env.example       # Environment variables template
└── README.md         # This file
```

## Configuration
- `railway.json` - Railway deployment configuration
- `package.json` - Node.js dependencies and scripts
- Environment variables configured for database communication

## Development
1. Install dependencies: `npm install`
2. Copy environment variables: `cp env.example .env`
3. Configure your environment variables
4. Start development server: `npm run dev`
5. Deploy automatically via GitHub Actions

## Deployment
- Automatic deployment on changes to `backend/` folder
- Health checks available at `/health`
- API endpoints available at `/api`
- Production deployment on main branch

## Environment Variables
- `DATABASE_URL` - Supabase database connection string
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (production/development)
