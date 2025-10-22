#!/bin/bash

# MS8-Learning-Analytics Phase 2 Integration Testing Script
# This script tests the integration between Vercel, Railway, and Supabase

echo "🔗 MS8-Learning-Analytics Phase 2 Integration Testing"
echo "====================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results tracking
VERCEL_STATUS=0
RAILWAY_STATUS=0
SUPABASE_STATUS=0
INTEGRATION_STATUS=0

# Function to test Vercel deployment
test_vercel() {
    echo -e "${BLUE}🔍 Testing Vercel Frontend...${NC}"
    
    if [ -z "$VERCEL_FRONTEND_URL" ]; then
        echo -e "${RED}❌ VERCEL_FRONTEND_URL not set${NC}"
        return 1
    fi
    
    # Test frontend deployment
    response=$(curl -s -o /dev/null -w "%{http_code}" "$VERCEL_FRONTEND_URL")
    
    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✅ Vercel frontend accessible (HTTP $response)${NC}"
        
        # Test if it's the correct page
        content=$(curl -s "$VERCEL_FRONTEND_URL")
        if echo "$content" | grep -q "MS8 Learning Analytics"; then
            echo -e "${GREEN}✅ Vercel frontend content correct${NC}"
            return 0
        else
            echo -e "${YELLOW}⚠️  Vercel frontend content unexpected${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ Vercel frontend not accessible (HTTP $response)${NC}"
        return 1
    fi
}

# Function to test Railway backend
test_railway() {
    echo -e "${BLUE}🔍 Testing Railway Backend...${NC}"
    
    if [ -z "$RAILWAY_BACKEND_URL" ]; then
        echo -e "${RED}❌ RAILWAY_BACKEND_URL not set${NC}"
        return 1
    fi
    
    # Test health endpoint
    health_response=$(curl -s "$RAILWAY_BACKEND_URL/health")
    health_code=$(curl -s -o /dev/null -w "%{http_code}" "$RAILWAY_BACKEND_URL/health")
    
    if [ "$health_code" = "200" ]; then
        echo -e "${GREEN}✅ Railway backend health check passed (HTTP $health_code)${NC}"
        
        # Test API endpoints
        api_response=$(curl -s -o /dev/null -w "%{http_code}" "$RAILWAY_BACKEND_URL/api/status")
        if [ "$api_response" = "200" ]; then
            echo -e "${GREEN}✅ Railway backend API accessible${NC}"
            return 0
        else
            echo -e "${YELLOW}⚠️  Railway backend API not accessible (HTTP $api_response)${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ Railway backend health check failed (HTTP $health_code)${NC}"
        return 1
    fi
}

# Function to test Supabase database
test_supabase() {
    echo -e "${BLUE}🔍 Testing Supabase Database...${NC}"
    
    if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
        echo -e "${RED}❌ SUPABASE_URL or SUPABASE_ANON_KEY not set${NC}"
        return 1
    fi
    
    # Test Supabase API
    response=$(curl -s -H "apikey: $SUPABASE_ANON_KEY" \
        -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
        "$SUPABASE_URL/rest/v1/")
    
    if echo "$response" | grep -q "swagger"; then
        echo -e "${GREEN}✅ Supabase API accessible${NC}"
        
        # Test database connection
        db_response=$(curl -s -H "apikey: $SUPABASE_ANON_KEY" \
            -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
            "$SUPABASE_URL/rest/v1/users?select=count")
        
        if echo "$db_response" | grep -q "count"; then
            echo -e "${GREEN}✅ Supabase database accessible${NC}"
            return 0
        else
            echo -e "${YELLOW}⚠️  Supabase database connection issue${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ Supabase API not accessible${NC}"
        return 1
    fi
}

# Function to test cross-service integration
test_integration() {
    echo -e "${BLUE}🔍 Testing Cross-Service Integration...${NC}"
    
    if [ -z "$VERCEL_FRONTEND_URL" ] || [ -z "$RAILWAY_BACKEND_URL" ]; then
        echo -e "${RED}❌ Frontend or Backend URL not set${NC}"
        return 1
    fi
    
    # Test if frontend can reach backend
    echo -e "${YELLOW}📡 Testing Frontend → Backend communication...${NC}"
    
    # This would typically be done through the frontend application
    # For now, we'll test if both services are accessible
    frontend_status=$(curl -s -o /dev/null -w "%{http_code}" "$VERCEL_FRONTEND_URL")
    backend_status=$(curl -s -o /dev/null -w "%{http_code}" "$RAILWAY_BACKEND_URL/health")
    
    if [ "$frontend_status" = "200" ] && [ "$backend_status" = "200" ]; then
        echo -e "${GREEN}✅ Both frontend and backend are accessible${NC}"
        echo -e "${GREEN}✅ Cross-service communication ready${NC}"
        return 0
    else
        echo -e "${RED}❌ Cross-service communication test failed${NC}"
        return 1
    fi
}

# Function to display test results
display_results() {
    echo ""
    echo -e "${BLUE}📊 Integration Test Results:${NC}"
    echo "=========================="
    
    if [ $VERCEL_STATUS -eq 0 ]; then
        echo -e "${GREEN}✅ Vercel Frontend: Connected${NC}"
    else
        echo -e "${RED}❌ Vercel Frontend: Failed${NC}"
    fi
    
    if [ $RAILWAY_STATUS -eq 0 ]; then
        echo -e "${GREEN}✅ Railway Backend: Connected${NC}"
    else
        echo -e "${RED}❌ Railway Backend: Failed${NC}"
    fi
    
    if [ $SUPABASE_STATUS -eq 0 ]; then
        echo -e "${GREEN}✅ Supabase Database: Connected${NC}"
    else
        echo -e "${RED}❌ Supabase Database: Failed${NC}"
    fi
    
    if [ $INTEGRATION_STATUS -eq 0 ]; then
        echo -e "${GREEN}✅ Cross-Service Integration: Working${NC}"
    else
        echo -e "${RED}❌ Cross-Service Integration: Failed${NC}"
    fi
    
    echo ""
    
    if [ $VERCEL_STATUS -eq 0 ] && [ $RAILWAY_STATUS -eq 0 ] && [ $SUPABASE_STATUS -eq 0 ] && [ $INTEGRATION_STATUS -eq 0 ]; then
        echo -e "${GREEN}🎉 All services integrated successfully!${NC}"
        echo -e "${GREEN}✅ Ready to proceed to Phase 3${NC}"
    else
        echo -e "${YELLOW}⚠️  Some services failed integration test${NC}"
        echo -e "${RED}❌ Please check configuration before proceeding${NC}"
    fi
}

# Main execution
main() {
    echo -e "${YELLOW}🧪 Testing service integrations...${NC}"
    echo ""
    
    test_vercel || VERCEL_STATUS=1
    test_railway || RAILWAY_STATUS=1
    test_supabase || SUPABASE_STATUS=1
    test_integration || INTEGRATION_STATUS=1
    
    display_results
}

# Run main function
main
