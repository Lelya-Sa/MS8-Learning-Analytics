#!/bin/bash

# MS8-Learning-Analytics Service Provider Setup Script
# This script helps validate and configure service provider connections

echo "🚀 MS8-Learning-Analytics Service Provider Setup"
echo "================================================"

# Check if required tools are installed
check_tools() {
    echo "🔍 Checking required tools..."
    
    if ! command -v curl &> /dev/null; then
        echo "❌ curl is required but not installed"
        exit 1
    fi
    
    if ! command -v jq &> /dev/null; then
        echo "⚠️  jq is recommended for JSON parsing"
    fi
    
    echo "✅ Required tools check complete"
}

# Test Vercel connection
test_vercel() {
    echo "🔍 Testing Vercel connection..."
    
    if [ -z "$VERCEL_TOKEN" ]; then
        echo "❌ VERCEL_TOKEN not set"
        return 1
    fi
    
    # Test Vercel API
    response=$(curl -s -H "Authorization: Bearer $VERCEL_TOKEN" \
        "https://api.vercel.com/v2/user")
    
    if echo "$response" | grep -q "id"; then
        echo "✅ Vercel connection successful"
        return 0
    else
        echo "❌ Vercel connection failed"
        return 1
    fi
}

# Test Railway connection
test_railway() {
    echo "🔍 Testing Railway connection..."
    
    if [ -z "$RAILWAY_TOKEN" ]; then
        echo "❌ RAILWAY_TOKEN not set"
        return 1
    fi
    
    # Test Railway API
    response=$(curl -s -H "Authorization: Bearer $RAILWAY_TOKEN" \
        "https://backboard.railway.app/graphql" \
        -H "Content-Type: application/json" \
        -d '{"query":"query { me { id } }"}')
    
    if echo "$response" | grep -q "me"; then
        echo "✅ Railway connection successful"
        return 0
    else
        echo "❌ Railway connection failed"
        return 1
    fi
}

# Test Supabase connection
test_supabase() {
    echo "🔍 Testing Supabase connection..."
    
    if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
        echo "❌ SUPABASE_URL or SUPABASE_ANON_KEY not set"
        return 1
    fi
    
    # Test Supabase API
    response=$(curl -s -H "apikey: $SUPABASE_ANON_KEY" \
        -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
        "$SUPABASE_URL/rest/v1/")
    
    if echo "$response" | grep -q "swagger"; then
        echo "✅ Supabase connection successful"
        return 0
    else
        echo "❌ Supabase connection failed"
        return 1
    fi
}

# Main execution
main() {
    check_tools
    
    echo ""
    echo "🧪 Testing service provider connections..."
    echo ""
    
    vercel_status=0
    railway_status=0
    supabase_status=0
    
    test_vercel || vercel_status=1
    test_railway || railway_status=1
    test_supabase || supabase_status=1
    
    echo ""
    echo "📊 Connection Test Results:"
    echo "=========================="
    
    if [ $vercel_status -eq 0 ]; then
        echo "✅ Vercel: Connected"
    else
        echo "❌ Vercel: Failed"
    fi
    
    if [ $railway_status -eq 0 ]; then
        echo "✅ Railway: Connected"
    else
        echo "❌ Railway: Failed"
    fi
    
    if [ $supabase_status -eq 0 ]; then
        echo "✅ Supabase: Connected"
    else
        echo "❌ Supabase: Failed"
    fi
    
    echo ""
    
    if [ $vercel_status -eq 0 ] && [ $railway_status -eq 0 ] && [ $supabase_status -eq 0 ]; then
        echo "🎉 All service providers connected successfully!"
        echo "✅ Ready to proceed to Phase 1C"
    else
        echo "⚠️  Some service providers failed connection test"
        echo "❌ Please check configuration before proceeding"
    fi
}

# Run main function
main
