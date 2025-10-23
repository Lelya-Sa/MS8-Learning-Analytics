#!/bin/bash

# Script to help find Railway backend URL for testing
echo "🚀 Finding Railway Backend URL for Testing"
echo "=========================================="
echo ""

echo "1. Go to your Railway dashboard: https://railway.app/dashboard"
echo "2. Select your MS8 Learning Analytics backend project"
echo "3. Look for the 'Public URL' or 'Domain' section"
echo "4. Copy the URL (it should look like: https://your-app-name.railway.app)"
echo ""

echo "5. Your API base URL will be: [Railway-URL]/api"
echo "   Example: https://ms8-learning-analytics-production.railway.app/api"
echo ""

echo "6. Test the backend health endpoint:"
echo "   curl [Railway-URL]/api/health"
echo ""

echo "7. If you find the URL, set it as an environment variable:"
echo "   export RAILWAY_API_URL='https://your-app-name.railway.app/api'"
echo ""

echo "8. Then run the cloud tests:"
echo "   cd frontend"
echo "   npm test -- --run src/test/api-integration.test.js"
echo ""

echo "🔍 Alternative: Check Railway CLI"
echo "If you have Railway CLI installed:"
echo "   railway status"
echo "   railway domain"
