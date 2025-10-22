#!/bin/bash

# MS8-Learning-Analytics Phase 3 CI/CD Pipeline Testing Script
# This script tests the complete CI/CD pipeline and service integration

echo "🔄 MS8-Learning-Analytics Phase 3 CI/CD Pipeline Testing"
echo "========================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Test results tracking
DEPLOYMENT_STATUS=0
COMMUNICATION_STATUS=0
INTEGRATION_STATUS=0
SECURITY_STATUS=0
PERFORMANCE_STATUS=0

# Function to test deployment pipeline
test_deployment_pipeline() {
    echo -e "${BLUE}🔍 Testing Deployment Pipeline...${NC}"
    
    # Test frontend deployment
    echo -e "${YELLOW}📱 Testing Frontend Deployment...${NC}"
    if [ -z "$VERCEL_FRONTEND_URL" ]; then
        echo -e "${RED}❌ VERCEL_FRONTEND_URL not set${NC}"
        return 1
    fi
    
    frontend_response=$(curl -s -o /dev/null -w "%{http_code}" "$VERCEL_FRONTEND_URL")
    if [ "$frontend_response" = "200" ]; then
        echo -e "${GREEN}✅ Frontend deployment successful${NC}"
    else
        echo -e "${RED}❌ Frontend deployment failed (HTTP $frontend_response)${NC}"
        return 1
    fi
    
    # Test backend deployment
    echo -e "${YELLOW}🚂 Testing Backend Deployment...${NC}"
    if [ -z "$RAILWAY_BACKEND_URL" ]; then
        echo -e "${RED}❌ RAILWAY_BACKEND_URL not set${NC}"
        return 1
    fi
    
    backend_response=$(curl -s -o /dev/null -w "%{http_code}" "$RAILWAY_BACKEND_URL/health")
    if [ "$backend_response" = "200" ]; then
        echo -e "${GREEN}✅ Backend deployment successful${NC}"
    else
        echo -e "${RED}❌ Backend deployment failed (HTTP $backend_response)${NC}"
        return 1
    fi
    
    # Test database connection
    echo -e "${YELLOW}🗄️ Testing Database Connection...${NC}"
    if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
        echo -e "${RED}❌ Supabase credentials not set${NC}"
        return 1
    fi
    
    db_response=$(curl -s -H "apikey: $SUPABASE_ANON_KEY" \
        -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
        "$SUPABASE_URL/rest/v1/" | grep -o "swagger" | head -1)
    
    if [ "$db_response" = "swagger" ]; then
        echo -e "${GREEN}✅ Database connection successful${NC}"
    else
        echo -e "${RED}❌ Database connection failed${NC}"
        return 1
    fi
    
    echo -e "${GREEN}✅ Deployment pipeline test completed${NC}"
    return 0
}

# Function to test service communication
test_service_communication() {
    echo -e "${BLUE}🔍 Testing Service Communication...${NC}"
    
    # Test frontend to backend communication
    echo -e "${YELLOW}📡 Testing Frontend → Backend Communication...${NC}"
    
    # Simulate frontend API call to backend
    api_response=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "Content-Type: application/json" \
        "$RAILWAY_BACKEND_URL/api/status")
    
    if [ "$api_response" = "200" ]; then
        echo -e "${GREEN}✅ Frontend → Backend communication successful${NC}"
    else
        echo -e "${RED}❌ Frontend → Backend communication failed (HTTP $api_response)${NC}"
        return 1
    fi
    
    # Test backend to database communication
    echo -e "${YELLOW}🗄️ Testing Backend → Database Communication...${NC}"
    
    # Test database query through backend
    db_test_response=$(curl -s -o /dev/null -w "%{http_code}" \
        "$RAILWAY_BACKEND_URL/api/users")
    
    if [ "$db_test_response" = "200" ]; then
        echo -e "${GREEN}✅ Backend → Database communication successful${NC}"
    else
        echo -e "${RED}❌ Backend → Database communication failed (HTTP $db_test_response)${NC}"
        return 1
    fi
    
    # Test frontend to database communication
    echo -e "${YELLOW}🔗 Testing Frontend → Database Communication...${NC}"
    
    # Test direct database access from frontend
    direct_db_response=$(curl -s -H "apikey: $SUPABASE_ANON_KEY" \
        -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
        "$SUPABASE_URL/rest/v1/users?select=count" | grep -o "count" | head -1)
    
    if [ "$direct_db_response" = "count" ]; then
        echo -e "${GREEN}✅ Frontend → Database communication successful${NC}"
    else
        echo -e "${RED}❌ Frontend → Database communication failed${NC}"
        return 1
    fi
    
    echo -e "${GREEN}✅ Service communication test completed${NC}"
    return 0
}

# Function to test integration
test_integration() {
    echo -e "${BLUE}🔍 Testing Integration...${NC}"
    
    # Test complete user journey
    echo -e "${YELLOW}👤 Testing Complete User Journey...${NC}"
    
    # Step 1: Access frontend
    frontend_access=$(curl -s -o /dev/null -w "%{http_code}" "$VERCEL_FRONTEND_URL")
    if [ "$frontend_access" != "200" ]; then
        echo -e "${RED}❌ Frontend access failed${NC}"
        return 1
    fi
    
    # Step 2: Backend API access
    backend_access=$(curl -s -o /dev/null -w "%{http_code}" "$RAILWAY_BACKEND_URL/health")
    if [ "$backend_access" != "200" ]; then
        echo -e "${RED}❌ Backend access failed${NC}"
        return 1
    fi
    
    # Step 3: Database access
    database_access=$(curl -s -H "apikey: $SUPABASE_ANON_KEY" \
        -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
        "$SUPABASE_URL/rest/v1/" | grep -o "swagger" | head -1)
    if [ "$database_access" != "swagger" ]; then
        echo -e "${RED}❌ Database access failed${NC}"
        return 1
    fi
    
    echo -e "${GREEN}✅ Complete user journey test successful${NC}"
    
    # Test API endpoints
    echo -e "${YELLOW}🔌 Testing API Endpoints...${NC}"
    
    endpoints=(
        "$RAILWAY_BACKEND_URL/health"
        "$RAILWAY_BACKEND_URL/api/status"
        "$RAILWAY_BACKEND_URL/api/users"
        "$RAILWAY_BACKEND_URL/api/analytics"
    )
    
    for endpoint in "${endpoints[@]}"; do
        response=$(curl -s -o /dev/null -w "%{http_code}" "$endpoint")
        if [ "$response" = "200" ]; then
            echo -e "${GREEN}✅ $endpoint - OK${NC}"
        else
            echo -e "${RED}❌ $endpoint - Failed (HTTP $response)${NC}"
            return 1
        fi
    done
    
    echo -e "${GREEN}✅ Integration test completed${NC}"
    return 0
}

# Function to test security
test_security() {
    echo -e "${BLUE}🔍 Testing Security...${NC}"
    
    # Test security headers
    echo -e "${YELLOW}🛡️ Testing Security Headers...${NC}"
    
    # Test frontend security headers
    frontend_headers=$(curl -s -I "$VERCEL_FRONTEND_URL" | grep -i "x-frame-options\|x-content-type-options\|x-xss-protection")
    if [ -n "$frontend_headers" ]; then
        echo -e "${GREEN}✅ Frontend security headers present${NC}"
    else
        echo -e "${YELLOW}⚠️  Frontend security headers missing${NC}"
    fi
    
    # Test backend security headers
    backend_headers=$(curl -s -I "$RAILWAY_BACKEND_URL/health" | grep -i "x-frame-options\|x-content-type-options\|x-xss-protection")
    if [ -n "$backend_headers" ]; then
        echo -e "${GREEN}✅ Backend security headers present${NC}"
    else
        echo -e "${YELLOW}⚠️  Backend security headers missing${NC}"
    fi
    
    # Test CORS configuration
    echo -e "${YELLOW}🌐 Testing CORS Configuration...${NC}"
    
    cors_response=$(curl -s -H "Origin: $VERCEL_FRONTEND_URL" \
        -H "Access-Control-Request-Method: GET" \
        -H "Access-Control-Request-Headers: Content-Type" \
        -X OPTIONS "$RAILWAY_BACKEND_URL/api/status")
    
    if echo "$cors_response" | grep -q "Access-Control-Allow-Origin"; then
        echo -e "${GREEN}✅ CORS configuration working${NC}"
    else
        echo -e "${YELLOW}⚠️  CORS configuration may need adjustment${NC}"
    fi
    
    echo -e "${GREEN}✅ Security test completed${NC}"
    return 0
}

# Function to test performance
test_performance() {
    echo -e "${BLUE}🔍 Testing Performance...${NC}"
    
    # Test response times
    echo -e "${YELLOW}⏱️ Testing Response Times...${NC}"
    
    # Test frontend response time
    frontend_time=$(curl -s -o /dev/null -w "%{time_total}" "$VERCEL_FRONTEND_URL")
    if (( $(echo "$frontend_time < 2.0" | bc -l) )); then
        echo -e "${GREEN}✅ Frontend response time: ${frontend_time}s${NC}"
    else
        echo -e "${YELLOW}⚠️  Frontend response time: ${frontend_time}s (slow)${NC}"
    fi
    
    # Test backend response time
    backend_time=$(curl -s -o /dev/null -w "%{time_total}" "$RAILWAY_BACKEND_URL/health")
    if (( $(echo "$backend_time < 1.0" | bc -l) )); then
        echo -e "${GREEN}✅ Backend response time: ${backend_time}s${NC}"
    else
        echo -e "${YELLOW}⚠️  Backend response time: ${backend_time}s (slow)${NC}"
    fi
    
    # Test database response time
    db_time=$(curl -s -o /dev/null -w "%{time_total}" \
        -H "apikey: $SUPABASE_ANON_KEY" \
        -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
        "$SUPABASE_URL/rest/v1/users?select=count")
    if (( $(echo "$db_time < 1.0" | bc -l) )); then
        echo -e "${GREEN}✅ Database response time: ${db_time}s${NC}"
    else
        echo -e "${YELLOW}⚠️  Database response time: ${db_time}s (slow)${NC}"
    fi
    
    echo -e "${GREEN}✅ Performance test completed${NC}"
    return 0
}

# Function to display test results
display_results() {
    echo ""
    echo -e "${CYAN}📊 Phase 3 CI/CD Pipeline Test Results:${NC}"
    echo "=============================================="
    
    if [ $DEPLOYMENT_STATUS -eq 0 ]; then
        echo -e "${GREEN}✅ Deployment Pipeline: Working${NC}"
    else
        echo -e "${RED}❌ Deployment Pipeline: Failed${NC}"
    fi
    
    if [ $COMMUNICATION_STATUS -eq 0 ]; then
        echo -e "${GREEN}✅ Service Communication: Working${NC}"
    else
        echo -e "${RED}❌ Service Communication: Failed${NC}"
    fi
    
    if [ $INTEGRATION_STATUS -eq 0 ]; then
        echo -e "${GREEN}✅ Integration Testing: Working${NC}"
    else
        echo -e "${RED}❌ Integration Testing: Failed${NC}"
    fi
    
    if [ $SECURITY_STATUS -eq 0 ]; then
        echo -e "${GREEN}✅ Security Testing: Working${NC}"
    else
        echo -e "${RED}❌ Security Testing: Failed${NC}"
    fi
    
    if [ $PERFORMANCE_STATUS -eq 0 ]; then
        echo -e "${GREEN}✅ Performance Testing: Working${NC}"
    else
        echo -e "${RED}❌ Performance Testing: Failed${NC}"
    fi
    
    echo ""
    
    if [ $DEPLOYMENT_STATUS -eq 0 ] && [ $COMMUNICATION_STATUS -eq 0 ] && [ $INTEGRATION_STATUS -eq 0 ] && [ $SECURITY_STATUS -eq 0 ] && [ $PERFORMANCE_STATUS -eq 0 ]; then
        echo -e "${GREEN}🎉 All CI/CD pipeline tests passed!${NC}"
        echo -e "${GREEN}✅ Ready to proceed to Phase 4${NC}"
    else
        echo -e "${YELLOW}⚠️  Some CI/CD pipeline tests failed${NC}"
        echo -e "${RED}❌ Please check configuration before proceeding${NC}"
    fi
}

# Main execution
main() {
    echo -e "${YELLOW}🧪 Testing CI/CD pipeline components...${NC}"
    echo ""
    
    test_deployment_pipeline || DEPLOYMENT_STATUS=1
    test_service_communication || COMMUNICATION_STATUS=1
    test_integration || INTEGRATION_STATUS=1
    test_security || SECURITY_STATUS=1
    test_performance || PERFORMANCE_STATUS=1
    
    display_results
}

# Check if bc is available for floating point comparison
if ! command -v bc &> /dev/null; then
    echo -e "${YELLOW}⚠️  bc command not found. Performance testing may be limited.${NC}"
fi

# Run main function
main
