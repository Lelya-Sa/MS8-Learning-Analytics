# 🚀 MS8 Learning Analytics - New Developer Guide

**Welcome!** This guide will help you understand the project structure, technologies, and how to get started as a new developer.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Frontend Deep Dive](#frontend-deep-dive)
6. [Backend Deep Dive](#backend-deep-dive)
7. [Database Setup](#database-setup)
8. [Getting Started](#getting-started)
9. [Development Workflow](#development-workflow)
10. [Key Features](#key-features)
11. [Testing](#testing)
12. [Deployment](#deployment)

---

## 🎯 Project Overview

**MS8 Learning Analytics** is a comprehensive learning analytics platform that provides insights for three user roles:
- **Learners**: Track personal learning progress, skill gaps, and receive recommendations
- **Trainers**: Monitor teaching effectiveness, course health, and student performance
- **Organization Administrators**: Analyze organization-wide metrics, strategic alignment, and learning culture

### Core Capabilities

- **19 Analytics Categories**: 6 Learner, 4 Trainer, 4 Organization, 2 Comparison, 3 Predictive
- **Multi-Role Support**: Users can have multiple roles within the same account
- **Gamification**: Points, badges, leaderboards, and streaks
- **Predictive Analytics**: ML-powered forecasts and risk assessments
- **Peer Comparison**: Benchmark against cohort and industry standards
- **Real-time Dashboards**: Live analytics with interactive charts

---

## 🏗️ Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────┐
│              Frontend (Vercel)                   │
│  ┌──────────────────────────────────────────┐  │
│  │  React SPA with Role-Based Dashboards     │  │
│  │  - Learner Dashboard                      │  │
│  │  - Trainer Dashboard                      │  │
│  │  - Organization Dashboard                 │  │
│  └──────────────────────────────────────────┘  │
└──────────────────┬──────────────────────────────┘
                   │ HTTP/REST
                   ▼
┌─────────────────────────────────────────────────┐
│              Backend (Railway)                   │
│  ┌──────────────────────────────────────────┐  │
│  │  Express.js REST API                     │  │
│  │  - Auth Routes                           │  │
│  │  - Analytics Routes                      │  │
│  │  - Gamification Routes                   │  │
│  │  - Integration Routes                    │  │
│  └──────────────────────────────────────────┘  │
└──────────────────┬──────────────────────────────┘
                   │ Prisma ORM
                   ▼
┌─────────────────────────────────────────────────┐
│              Database (Supabase)                 │
│  ┌──────────────────────────────────────────┐  │
│  │  PostgreSQL Database                     │  │
│  │  - Users, Organizations                  │  │
│  │  - Analytics Data                         │  │
│  │  - Gamification Data                      │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### Architecture Pattern

This project follows the **Onion Architecture** (also known as Clean Architecture):

```
┌─────────────────────────────────────────────┐
│  PRESENTATION LAYER (React Components)      │
│  - Pages, Components, Charts, Layouts       │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│  APPLICATION LAYER (Business Logic)         │
│  - Hooks (useAuth, useAnalytics)           │
│  - Services (authService, analyticsService)│
│  - State Management (Context API)          │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│  DOMAIN LAYER (Core Entities)                │
│  - Business Models, Entities, Interfaces   │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│  INFRASTRUCTURE LAYER (External APIs)       │
│  - API Clients, Cache, External Services    │
└─────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router v7** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js** - Data visualization
- **Axios** - HTTP client
- **Jest + React Testing Library** - Testing

### Backend
- **Node.js 18+** - Runtime environment
- **Express.js** - Web framework
- **Prisma** - ORM for database operations
- **PostgreSQL** - Database (via Supabase)
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Winston** - Logging
- **BullMQ** - Job queue for background tasks
- **Jest** - Testing framework

### Database
- **Supabase** - PostgreSQL with built-in authentication
- **Prisma Schema** - Database schema definition

### Deployment
- **Vercel** - Frontend hosting
- **Railway** - Backend hosting
- **Supabase** - Database hosting
- **GitHub Actions** - CI/CD pipeline

---

## 📁 Project Structure

### Root Directory

```
MS8-Learning-Analytics/
├── frontend/              # React application (deployed to Vercel)
├── backend/               # Node.js API (deployed to Railway)
├── database/              # Database configuration
├── config/                # Shared configuration files
├── shared/                # Shared utilities and types
├── scripts/               # Deployment and utility scripts
├── docs/                  # Project documentation
└── README.md              # Project overview
```

---

## 🎨 Frontend Deep Dive

### Directory Structure

```
frontend/
├── src/
│   ├── presentation/          # UI Layer (React Components)
│   │   ├── pages/            # Route pages
│   │   │   ├── HomePage.jsx                 # Landing page
│   │   │   ├── LoginPage.jsx                # Authentication
│   │   │   ├── LearnerDashboard.jsx         # Learner dashboard
│   │   │   ├── TrainerDashboard.jsx         # Trainer dashboard
│   │   │   ├── OrganizationDashboard.jsx    # Org admin dashboard
│   │   │   ├── ReportsPage.jsx              # Report generation
│   │   │   ├── PresentationPage.jsx         # Meeting presentation
│   │   │   └── NotFoundPage.jsx             # 404 page
│   │   │
│   │   ├── components/       # Reusable components
│   │   │   ├── analytics/    # Analytics cards
│   │   │   │   ├── learner/        # 6 learner analytics cards
│   │   │   │   ├── trainer/        # 4 trainer analytics cards
│   │   │   │   ├── organization/   # 4 org analytics cards
│   │   │   │   └── comparison/     # 5 comparison cards
│   │   │   ├── auth/         # Authentication components
│   │   │   ├── charts/       # Chart.js wrappers
│   │   │   ├── common/       # Shared UI components
│   │   │   ├── gamification/ # Gamification UI
│   │   │   ├── layout/       # Layout components (Header, Footer, etc.)
│   │   │   ├── optimization/ # Performance optimization
│   │   │   └── reports/      # Report generation UI
│   │   │
│   │   ├── assets/          # Static assets
│   │   │   ├── css/         # Component-specific styles
│   │   │   └── img/         # Images
│   │   │
│   │   └── App.jsx          # Main app component with routing
│   │
│   ├── application/         # Business Logic Layer
│   │   ├── hooks/          # Custom React hooks
│   │   │   ├── useAuth.js            # Authentication logic
│   │   │   ├── useAnalytics.js       # Analytics data fetching
│   │   │   ├── useGamification.js    # Gamification logic
│   │   │   ├── useApiError.js        # API error handling
│   │   │   └── useReports.js         # Report generation
│   │   │
│   │   ├── services/       # Business services
│   │   │   ├── AuthService.js        # Auth operations
│   │   │   ├── analyticsService.js   # Analytics operations
│   │   │   ├── GamificationService.js # Gamification operations
│   │   │   └── api.js                # API client
│   │   │
│   │   ├── state/          # State management (Context API)
│   │   │   ├── AuthContext.jsx       # Auth state
│   │   │   └── ThemeContext.jsx      # Theme state
│   │   │
│   │   └── useCases/       # Use cases (business logic)
│   │       ├── AuthUseCase.js
│   │       ├── GetLearnerAnalyticsUseCase.js
│   │       └── RefreshAnalyticsUseCase.js
│   │
│   ├── infrastructure/     # External Services Layer
│   │   ├── api/           # API clients and adapters
│   │   ├── cache/         # Caching mechanisms
│   │   └── external/      # External service integrations
│   │
│   ├── domain/            # Core Business Logic
│   │   ├── entities/      # Business entities
│   │   ├── interfaces/    # Service interfaces
│   │   └── models/        # Domain models
│   │
│   ├── styles.css         # Main CSS entry point
│   └── main.jsx           # React entry point
│
├── public/                # Static public assets
├── dist/                  # Production build output
├── tests/                 # Test files
├── package.json           # Dependencies
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── vercel.json            # Vercel deployment configuration
```

### Key Frontend Components

#### Pages
- **HomePage.jsx** - Public landing page with project overview
- **LoginPage.jsx** - Multi-role authentication page
- **LearnerDashboard.jsx** - 6 analytics cards for learners
- **TrainerDashboard.jsx** - 4 analytics cards for trainers
- **OrganizationDashboard.jsx** - 4 analytics cards for org admins
- **ReportsPage.jsx** - Report generation interface
- **PresentationPage.jsx** - Meeting presentation slides

#### Analytics Cards (by Role)

**Learner Analytics** (6 cards):
1. PerformanceAnalyticsCard - Learning progress
2. EngagementMetricsCard - Activity tracking
3. LearningVelocityCard - Speed of learning
4. SkillGapMatrixCard - Skill assessment
5. MasteryProgressionCard - Skill mastery levels
6. ContentEffectivenessCard - Content quality

**Trainer Analytics** (4 cards):
1. TeachingEffectivenessCard - Teaching quality
2. CourseHealthCard - Course performance
3. StudentDistributionCard - Class metrics
4. CoursePerformanceCard - Course-wide stats

**Organization Analytics** (4 cards):
1. OrgLearningVelocityCard - Org-wide speed
2. StrategicAlignmentCard - Goal alignment
3. LearningCultureCard - Culture metrics
4. OrgBenchmarkingCard - Industry comparison

**Comparison Analytics** (5 cards):
1. PeerComparisonCard - Compare with peers
2. PerformanceForecastCard - Future predictions
3. SkillDemandCard - Market demand
4. RecommendationsCard - AI recommendations
5. DropOffRiskCard - Risk assessment

#### Layout Components
- **Header.jsx** - Navigation, user menu, role switcher
- **Footer.jsx** - Footer with links
- **Layout.jsx** - Main app layout wrapper
- **Sidebar.jsx** - Dashboard sidebar navigation

#### Common Components
- **Button.jsx** - Reusable button component
- **Card.jsx** - Analytics card wrapper
- **Input.jsx** - Form input
- **Modal.jsx** - Modal dialogs
- **Toast.jsx** - Notifications
- **Spinner.jsx** - Loading indicators
- **ErrorBoundary.jsx** - Error handling

#### Chart Components
- **BarChart.jsx** - Bar chart wrapper (Chart.js)
- **LineChart.jsx** - Line chart wrapper
- **PieChart.jsx** - Pie chart wrapper
- **DataTable.jsx** - Data table display

### Frontend Styling

The project uses a **dual CSS strategy**:
1. **Tailwind CSS** - Utility classes for rapid development
2. **Custom CSS** - Theme-based styling with CSS variables

#### CSS Files Location
```
frontend/src/presentation/assets/css/
├── theme.css              # CSS variables (colors, spacing)
├── landing.css            # Landing page styles
├── login-page.css         # Login page styles
├── header.css             # Header/navigation styles
├── footer.css             # Footer styles
├── dashboard-layout.css   # Dashboard layout styles
├── analytics-cards.css    # Analytics card styles
├── multi-role-dashboard.css # Role-specific dashboard styles
└── presentation.css       # Presentation page styles
```

#### Theme System
- **Dark Emerald Theme** - Primary color scheme
- **WCAG 2.2 AA Compliant** - Accessibility standards
- **CSS Variables** - Centralized theming (see `theme.css`)

---

## ⚙️ Backend Deep Dive

### Directory Structure

```
backend/
├── routes/                # API Endpoints
│   ├── auth.js                      # Authentication endpoints
│   ├── analytics.js                  # General analytics endpoints
│   ├── learner-analytics.js          # Learner-specific analytics
│   ├── trainer-analytics.js          # Trainer-specific analytics
│   ├── org-analytics.js              # Org admin analytics
│   ├── comparison-analytics.js       # Comparison analytics
│   ├── predictive-analytics.js       # Predictive/ML analytics
│   ├── gamification.js                # Gamification endpoints
│   ├── reports.js                     # Report generation
│   ├── integration.js                 # External service integration
│   ├── system.js                      # System health/status
│   └── bff.js                         # Backend-for-Frontend (BFF)
│
├── services/              # Business Logic Layer
│   ├── authService.js                 # Authentication logic
│   ├── database.js                    # Prisma database setup
│   ├── integrationService.js          # External integrations
│   ├── circuitBreaker.js              # Circuit breaker pattern
│   └── mockData.js                    # Mock data for development
│
├── middleware/            # Express Middleware
│   ├── auth.js                       # JWT verification
│   └── validation.js                 # Input validation
│
├── prisma/                # Database Schema
│   └── schema.prisma                  # Prisma schema definition
│
├── scripts/               # Utility Scripts
│   └── migrate.js                     # Database migration script
│
├── tests/                 # Test Files
│   ├── auth.test.js                  # Auth tests
│   ├── analytics.test.js             # Analytics tests
│   ├── api-endpoints.test.js         # API endpoint tests
│   └── [more test files]
│
├── src/                   # Additional Source Files
│   ├── application/        # Application layer
│   ├── domain/            # Domain layer
│   └── infrastructure/     # Infrastructure layer
│
├── server.js              # Express server entry point
├── package.json           # Dependencies
├── jest.config.js         # Jest configuration
└── railway.json           # Railway deployment configuration
```

### API Endpoints

#### Authentication (`/api/v1/auth`)
- `POST /login` - User login
- `POST /register` - User registration
- `POST /logout` - User logout
- `GET /verify` - Token verification
- `POST /refresh` - Refresh access token

#### Learner Analytics (`/api/v1/learner/analytics`)
- `GET /performance` - Performance metrics
- `GET /engagement` - Engagement metrics
- `GET /velocity` - Learning velocity
- `GET /skill-gap` - Skill gap analysis
- `GET /mastery` - Mastery progression
- `GET /content-effectiveness` - Content quality metrics

#### Trainer Analytics (`/api/v1/trainer/analytics`)
- `GET /teaching-effectiveness` - Teaching quality
- `GET /course-health` - Course performance
- `GET /student-distribution` - Student metrics
- `GET /course-performance` - Course statistics

#### Organization Analytics (`/api/v1/org-admin/analytics`)
- `GET /velocity` - Organization learning velocity
- `GET /strategic-alignment` - Goal alignment
- `GET /learning-culture` - Culture metrics
- `GET /benchmarking` - Industry benchmarking

#### Comparison Analytics (`/api/v1/comparison`)
- `GET /peer` - Peer comparison data
- `GET /forecast` - Performance forecast
- `GET /skill-demand` - Skill demand analysis
- `GET /recommendations` - AI recommendations
- `GET /drop-off-risk` - Drop-off risk assessment

#### Gamification (`/api/v1/gamification`)
- `GET /points` - User points
- `GET /badges` - User badges
- `GET /leaderboard` - Leaderboard data
- `GET /streak` - Learning streak
- `POST /claim-badge` - Claim a badge

#### Reports (`/api/v1/reports`)
- `POST /generate` - Generate report
- `GET /history` - Report history
- `GET /:id` - Get specific report
- `DELETE /:id` - Delete report

#### System (`/api`)
- `GET /health` - Health check
- `GET /status` - System status

### Backend Middleware

#### Authentication Middleware (`middleware/auth.js`)
- JWT token verification
- Role-based access control (RBAC)
- User session management

#### Validation Middleware (`middleware/validation.js`)
- Input validation using `express-validator`
- Request sanitization
- Error handling

### Database Schema

The project uses **Prisma** as the ORM with PostgreSQL.

#### Key Models (see `prisma/schema.prisma`)

```prisma
model Organization {
  id        String   @id @default(cuid())
  name      String
  settings  Json
  users     User[]
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt
}

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  password_hash String
  role          String   // learner, trainer, org_admin
  organization_id String
  profile       Json
  analytics_data AnalyticsData[]
  created_at    DateTime @default(now())
  updated_at    DateTime @updatedAt
}

model AnalyticsData {
  id            String   @id @default(cuid())
  user_id       String
  analytics_type String
  data          Json
  calculated_at DateTime @default(now())
  created_at    DateTime @default(now())
}
```

---

## 🗄️ Database Setup

### Supabase Configuration

The project uses **Supabase** (PostgreSQL) for the database.

#### Connection
1. Create a Supabase account
2. Create a new project
3. Get your connection URL
4. Add to environment variables: `DATABASE_URL`

#### Database Migrations
```bash
cd backend
npm run db:migrate          # Run migrations
npm run db:generate         # Generate Prisma client
npm run db:studio           # Open Prisma Studio
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+**
- **npm** or **yarn**
- **Git**
- **Supabase account** (for database)
- **Railway account** (for backend deployment)
- **Vercel account** (for frontend deployment)

### Installation Steps

#### 1. Clone Repository
```bash
git clone https://github.com/your-org/MS8-Learning-Analytics.git
cd MS8-Learning-Analytics
```

#### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Setup database
npm run db:generate
npm run db:migrate

# Start development server
npm run dev
```

Backend will run on `http://localhost:3000`

#### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

#### 4. Environment Variables

**Backend** (`.env` in `backend/`):
```env
PORT=3000
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=your-secret-key
NODE_ENV=development
```

**Frontend** (create `.env` in `frontend/`):
```env
VITE_API_URL=http://localhost:3000/api/v1
```

---

## 💻 Development Workflow

### Running Locally

#### Development Mode
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

### Testing

#### Backend Tests
```bash
cd backend
npm test                  # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

#### Frontend Tests
```bash
cd frontend
npm test                  # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

### Building for Production

#### Backend
```bash
cd backend
npm start                 # Start production server
```

#### Frontend
```bash
cd frontend
npm run build            # Build production bundle
npm run preview          # Preview production build
```

### Code Structure Guidelines

#### Frontend Components
```jsx
// components/analytics/learner/PerformanceAnalyticsCard.jsx
import React from 'react';
import { useAnalytics } from '@/application/hooks/useAnalytics';
import Card from '@/presentation/components/common/Card';

export default function PerformanceAnalyticsCard() {
  const { data, loading, error } = useAnalytics('learner', 'performance');
  
  if (loading) return <Card.Skeleton />;
  if (error) return <Card.Error />;
  
  return (
    <Card>
      {/* Card content */}
    </Card>
  );
}
```

#### Backend Routes
```javascript
// routes/learner-analytics.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

router.get('/performance', authenticate, async (req, res) => {
  // Fetch performance data
  res.json(data);
});

module.exports = router;
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature
```

---

## 🎯 Key Features

### 1. Multi-Role Authentication
- Users can have multiple roles (learner, trainer, org_admin)
- Role switching without re-login
- Role-based UI rendering

### 2. Analytics Dashboards
- **19 analytics categories** across 3 roles
- Real-time data updates
- Interactive charts and visualizations

### 3. Gamification System
- Points and badges
- Leaderboards
- Learning streaks
- Achievement tracking

### 4. Predictive Analytics
- ML-powered forecasts
- Risk assessment
- Skill demand predictions
- Drop-off risk identification

### 5. Peer Comparison
- Compare with cohort peers
- Industry benchmarking
- Performance positioning

### 6. Report Generation
- Custom report generation
- Export to PDF/Excel
- Scheduled reports

---

## 🧪 Testing

### Test Coverage

- **Unit Tests**: Individual components and functions
- **Integration Tests**: API endpoints
- **E2E Tests**: User flows (coming soon)

### Running Tests

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

---

## 🚢 Deployment

### Deployment Process

#### Frontend (Vercel)
1. Push code to GitHub
2. Vercel automatically deploys from `frontend/` folder
3. Environment variables configured in Vercel dashboard

#### Backend (Railway)
1. Push code to GitHub
2. Railway automatically deploys from `backend/` folder
3. Environment variables configured in Railway dashboard

#### Database (Supabase)
1. Database hosted on Supabase
2. Prisma migrations run automatically on deployment

### Environment Variables (Production)

**Vercel** (Frontend):
- `VITE_API_URL` - Backend API URL

**Railway** (Backend):
- `PORT` - Server port
- `DATABASE_URL` - Supabase connection string
- `JWT_SECRET` - JWT secret key
- `NODE_ENV=production`

---

## 📚 Additional Resources

### Documentation
- `docs/` - Comprehensive project documentation
- `docs/phase_1/` - Phase 1 specifications
- `docs/phase_2/` - Phase 2 specifications
- `docs/Analytics-Specifications/` - Analytics feature specs

### Guides
- `docs/RAILWAY_SETUP_GUIDE.md` - Railway setup
- `docs/VERCEL_SETUP_GUIDE.md` - Vercel setup
- `docs/SUPABASE_SETUP_GUIDE.md` - Supabase setup

### API Documentation
- `backend/API_SUMMARY.md` - API endpoint summary

---

## 🤝 Contributing

### Before You Start
1. Read this guide thoroughly
2. Check existing documentation in `docs/`
3. Review similar features for patterns

### Development Guidelines
- Follow existing code style
- Write tests for new features
- Update documentation
- Use meaningful commit messages

### Getting Help
- Check documentation first
- Review existing code
- Ask questions in team channels

---

## ✅ Checklist for New Developers

- [ ] Read this guide
- [ ] Review project structure
- [ ] Set up local development environment
- [ ] Run tests and verify they pass
- [ ] Understand authentication flow
- [ ] Familiarize yourself with analytics features
- [ ] Review existing code patterns
- [ ] Join team communication channels

---

**Welcome aboard! 🚀**

For questions or support, reach out to the development team.

