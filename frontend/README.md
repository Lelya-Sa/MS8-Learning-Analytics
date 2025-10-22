# MS8 Learning Analytics Frontend

A Next.js React application for the MS8 Learning Analytics platform.

## Features

- **Next.js 14** with React 18
- **TypeScript** support
- **Supabase** integration ready
- **Responsive design** with modern UI
- **API integration** with backend services

## Environment Variables

Set these in your Vercel dashboard:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_NAME=MS8 Learning Analytics
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run tests
npm test
```

## Deployment

This frontend is configured for Vercel deployment with:
- Automatic builds on git push
- Preview deployments for pull requests
- Environment variable management
- Static site generation

## Project Structure

```
frontend/
├── pages/
│   └── index.js          # Home page
├── package.json         # Dependencies
├── vercel.json         # Vercel configuration
└── README.md           # This file
```
