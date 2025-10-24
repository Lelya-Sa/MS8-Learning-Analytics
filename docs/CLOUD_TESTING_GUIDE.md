# Cloud Testing Configuration Guide

This guide explains how to configure tests to run against your cloud deployment (Railway + Vercel + Supabase) with proper environment variables.

## 🚀 Quick Setup

### 1. Get Your Cloud URLs

#### Railway Backend URL
1. Go to your Railway dashboard
2. Select your MS8 Learning Analytics backend project
3. Copy the **Public URL** (e.g., `https://ms8-learning-analytics-production.railway.app`)
4. Your API base URL will be: `https://ms8-learning-analytics-production.railway.app/api`

#### Vercel Frontend URL
1. Go to your Vercel dashboard
2. Select your MS8 Learning Analytics frontend project
3. Copy the **Production URL** (e.g., `https://ms8-learning-analytics-k1c9h6yt3-lelya-salmans-projects.vercel.app`)

#### Supabase Database URL
1. Go to your Supabase dashboard
2. Select your project
3. Go to Settings > Database
4. Copy the **Connection string** (URI format)

### 2. Set GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions, and add these secrets:

```
RAILWAY_API_URL=https://your-railway-app.railway.app
VERCEL_URL=https://ms8-learning-analytics-k1c9h6yt3-lelya-salmans-projects.vercel.app
TEST_EMAIL=test@example.com
TEST_PASSWORD=test-password-123
DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres
JWT_SECRET=your-jwt-secret-from-railway
```

**Note**: Use just the Railway URL (without `/api`) - the test configuration will automatically add `/api` to create the correct API endpoint.

### 3. Test Configuration

The test configuration automatically detects the environment:

- **Local Development**: Uses `http://localhost:3000/api`
- **CI/CD Pipeline**: Uses Railway URL from secrets
- **Environment Variables**: Automatically loaded from cloud platforms

## 🧪 Running Tests

### Local Testing (against localhost)
```bash
cd frontend
npm test
```

### Cloud Testing (against Railway/Vercel)
```bash
# Set environment variables
export RAILWAY_API_URL="https://your-railway-app.railway.app/api"
export VERCEL_URL="https://your-vercel-app.vercel.app"
export CI=true

# Run tests
cd frontend
npm test -- --run src/test/api-integration.test.js
```

### CI/CD Testing
Tests automatically run against cloud deployment when you push to `master` branch.

## 🔧 Test Configuration Files

### `frontend/src/test/config.js`
- Automatically detects cloud vs local environment
- Uses appropriate API endpoints
- Loads environment variables from cloud platforms

### `.github/workflows/test-cloud-deployment.yml`
- Runs tests against cloud deployment
- Uses GitHub Secrets for environment variables
- Generates test reports and coverage

## 📊 Test Types

1. **Unit Tests**: Mock API calls (fast, isolated)
2. **Integration Tests**: Real API calls to cloud backend
3. **E2E Tests**: Full user journey on cloud frontend

## 🐛 Troubleshooting

### Tests failing against cloud?
1. Check Railway backend is deployed and healthy
2. Verify GitHub Secrets are set correctly
3. Check Railway logs for backend errors
4. Ensure test credentials match cloud environment

### Environment variables not loading?
1. Verify secrets are set in GitHub repository settings
2. Check the workflow file uses correct secret names
3. Ensure Railway/Vercel environment variables are set

### CORS errors?
1. Check Railway CORS configuration
2. Verify Vercel URL is in allowed origins
3. Check backend CORS middleware

## 🔒 Security Notes

- Never commit environment variables to code
- Use GitHub Secrets for sensitive data
- Test credentials should be separate from production
- JWT secrets should be strong and unique per environment

## 📈 Monitoring

- Check GitHub Actions for test results
- Monitor Railway logs for backend issues
- Use Vercel Analytics for frontend performance
- Set up alerts for test failures
