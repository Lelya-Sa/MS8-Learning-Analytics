#!/bin/bash
# MS8 Learning Analytics - Connection Testing Script
# Tests all service connections and validates infrastructure

echo "🚀 MS8 Learning Analytics - Connection Testing"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results
FRONTEND_STATUS="❌"
BACKEND_STATUS="❌"
DATABASE_STATUS="❌"
INTEGRATION_STATUS="❌"

# Configuration (update these URLs after deployment)
FRONTEND_URL="https://ms8-learning-analytics-frontend.vercel.app"
BACKEND_URL="https://ms8-learning-analytics-backend.railway.app"
SUPABASE_URL="https://your-project-id.supabase.co"

echo ""
echo "🔍 Testing Service Connections..."
echo ""

# Test Frontend (Vercel)
echo -e "${BLUE}Testing Frontend (Vercel)...${NC}"
if curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL" | grep -q "200"; then
    echo -e "${GREEN}✅ Frontend accessible at $FRONTEND_URL${NC}"
    FRONTEND_STATUS="✅"
else
    echo -e "${RED}❌ Frontend not accessible${NC}"
    echo -e "${YELLOW}   Make sure Vercel deployment is complete${NC}"
fi

# Test Backend (Railway)
echo -e "${BLUE}Testing Backend (Railway)...${NC}"
if curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/health" | grep -q "200"; then
    echo -e "${GREEN}✅ Backend health check passed${NC}"
    BACKEND_STATUS="✅"
    
    # Test specific endpoints
    echo -e "${BLUE}  Testing API endpoints...${NC}"
    
    # Test status endpoint
    if curl -s "$BACKEND_URL/api/status" | grep -q "operational"; then
        echo -e "${GREEN}  ✅ Status endpoint working${NC}"
    else
        echo -e "${YELLOW}  ⚠️  Status endpoint issue${NC}"
    fi
    
    # Test analytics endpoint
    if curl -s "$BACKEND_URL/api/analytics/overview" | grep -q "totalStudents"; then
        echo -e "${GREEN}  ✅ Analytics endpoint working${NC}"
    else
        echo -e "${YELLOW}  ⚠️  Analytics endpoint issue${NC}"
    fi
else
    echo -e "${RED}❌ Backend not accessible${NC}"
    echo -e "${YELLOW}   Make sure Railway deployment is complete${NC}"
fi

# Test Database (Supabase) via Backend
echo -e "${BLUE}Testing Database (Supabase)...${NC}"
if curl -s "$BACKEND_URL/api/analytics/students" | grep -q "students"; then
    echo -e "${GREEN}✅ Database connection working${NC}"
    DATABASE_STATUS="✅"
else
    echo -e "${RED}❌ Database connection failed${NC}"
    echo -e "${YELLOW}   Check Supabase configuration and environment variables${NC}"
fi

# Test Integration
echo -e "${BLUE}Testing Integration...${NC}"
if [ "$FRONTEND_STATUS" = "✅" ] && [ "$BACKEND_STATUS" = "✅" ] && [ "$DATABASE_STATUS" = "✅" ]; then
    echo -e "${GREEN}✅ All services connected and working${NC}"
    INTEGRATION_STATUS="✅"
else
    echo -e "${RED}❌ Integration issues detected${NC}"
fi

# Summary
echo ""
echo "📊 Test Results Summary"
echo "======================"
echo -e "Frontend (Vercel):  $FRONTEND_STATUS"
echo -e "Backend (Railway):  $BACKEND_STATUS"
echo -e "Database (Supabase): $DATABASE_STATUS"
echo -e "Integration:        $INTEGRATION_STATUS"
echo ""

# Overall status
if [ "$INTEGRATION_STATUS" = "✅" ]; then
    echo -e "${GREEN}🎉 INFRASTRUCTURE READY FOR DEVELOPMENT!${NC}"
    echo -e "${GREEN}All services are connected and operational.${NC}"
    exit 0
else
    echo -e "${RED}⚠️  INFRASTRUCTURE NOT READY${NC}"
    echo -e "${YELLOW}Please complete the manual setup steps and run this test again.${NC}"
    exit 1
fi
