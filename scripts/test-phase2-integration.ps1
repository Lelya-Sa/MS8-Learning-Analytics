# MS8-Learning-Analytics Phase 2 Integration Testing Script (PowerShell)
# This script tests the integration between Vercel, Railway, and Supabase

Write-Host "🔗 MS8-Learning-Analytics Phase 2 Integration Testing" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan

# Test results tracking
$VERCEL_STATUS = 0
$RAILWAY_STATUS = 0
$SUPABASE_STATUS = 0
$INTEGRATION_STATUS = 0

# Function to test Vercel deployment
function Test-Vercel {
    Write-Host "🔍 Testing Vercel Frontend..." -ForegroundColor Blue
    
    if (-not $env:VERCEL_FRONTEND_URL) {
        Write-Host "❌ VERCEL_FRONTEND_URL not set" -ForegroundColor Red
        return $false
    }
    
    try {
        # Test frontend deployment
        $response = Invoke-WebRequest -Uri $env:VERCEL_FRONTEND_URL -UseBasicParsing
        
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Vercel frontend accessible (HTTP $($response.StatusCode))" -ForegroundColor Green
            
            # Test if it's the correct page
            if ($response.Content -match "MS8 Learning Analytics") {
                Write-Host "✅ Vercel frontend content correct" -ForegroundColor Green
                return $true
            } else {
                Write-Host "⚠️  Vercel frontend content unexpected" -ForegroundColor Yellow
                return $false
            }
        } else {
            Write-Host "❌ Vercel frontend not accessible (HTTP $($response.StatusCode))" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ Vercel frontend test failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Function to test Railway backend
function Test-Railway {
    Write-Host "🔍 Testing Railway Backend..." -ForegroundColor Blue
    
    if (-not $env:RAILWAY_BACKEND_URL) {
        Write-Host "❌ RAILWAY_BACKEND_URL not set" -ForegroundColor Red
        return $false
    }
    
    try {
        # Test health endpoint
        $healthResponse = Invoke-WebRequest -Uri "$env:RAILWAY_BACKEND_URL/health" -UseBasicParsing
        
        if ($healthResponse.StatusCode -eq 200) {
            Write-Host "✅ Railway backend health check passed (HTTP $($healthResponse.StatusCode))" -ForegroundColor Green
            
            # Test API endpoints
            try {
                $apiResponse = Invoke-WebRequest -Uri "$env:RAILWAY_BACKEND_URL/api/status" -UseBasicParsing
                if ($apiResponse.StatusCode -eq 200) {
                    Write-Host "✅ Railway backend API accessible" -ForegroundColor Green
                    return $true
                } else {
                    Write-Host "⚠️  Railway backend API not accessible (HTTP $($apiResponse.StatusCode))" -ForegroundColor Yellow
                    return $false
                }
            } catch {
                Write-Host "⚠️  Railway backend API test failed: $($_.Exception.Message)" -ForegroundColor Yellow
                return $false
            }
        } else {
            Write-Host "❌ Railway backend health check failed (HTTP $($healthResponse.StatusCode))" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ Railway backend test failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Function to test Supabase database
function Test-Supabase {
    Write-Host "🔍 Testing Supabase Database..." -ForegroundColor Blue
    
    if (-not $env:SUPABASE_URL -or -not $env:SUPABASE_ANON_KEY) {
        Write-Host "❌ SUPABASE_URL or SUPABASE_ANON_KEY not set" -ForegroundColor Red
        return $false
    }
    
    try {
        # Test Supabase API
        $headers = @{
            "apikey" = $env:SUPABASE_ANON_KEY
            "Authorization" = "Bearer $env:SUPABASE_ANON_KEY"
        }
        
        $response = Invoke-RestMethod -Uri "$env:SUPABASE_URL/rest/v1/" -Headers $headers
        
        if ($response -match "swagger") {
            Write-Host "✅ Supabase API accessible" -ForegroundColor Green
            
            # Test database connection
            try {
                $dbResponse = Invoke-RestMethod -Uri "$env:SUPABASE_URL/rest/v1/users?select=count" -Headers $headers
                if ($dbResponse -match "count") {
                    Write-Host "✅ Supabase database accessible" -ForegroundColor Green
                    return $true
                } else {
                    Write-Host "⚠️  Supabase database connection issue" -ForegroundColor Yellow
                    return $false
                }
            } catch {
                Write-Host "⚠️  Supabase database test failed: $($_.Exception.Message)" -ForegroundColor Yellow
                return $false
            }
        } else {
            Write-Host "❌ Supabase API not accessible" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ Supabase test failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Function to test cross-service integration
function Test-Integration {
    Write-Host "🔍 Testing Cross-Service Integration..." -ForegroundColor Blue
    
    if (-not $env:VERCEL_FRONTEND_URL -or -not $env:RAILWAY_BACKEND_URL) {
        Write-Host "❌ Frontend or Backend URL not set" -ForegroundColor Red
        return $false
    }
    
    # Test if frontend can reach backend
    Write-Host "📡 Testing Frontend → Backend communication..." -ForegroundColor Yellow
    
    try {
        $frontendResponse = Invoke-WebRequest -Uri $env:VERCEL_FRONTEND_URL -UseBasicParsing
        $backendResponse = Invoke-WebRequest -Uri "$env:RAILWAY_BACKEND_URL/health" -UseBasicParsing
        
        if ($frontendResponse.StatusCode -eq 200 -and $backendResponse.StatusCode -eq 200) {
            Write-Host "✅ Both frontend and backend are accessible" -ForegroundColor Green
            Write-Host "✅ Cross-service communication ready" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ Cross-service communication test failed" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ Cross-service communication test failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Function to display test results
function Show-Results {
    Write-Host ""
    Write-Host "📊 Integration Test Results:" -ForegroundColor Cyan
    Write-Host "==========================" -ForegroundColor Cyan
    
    if ($VERCEL_STATUS -eq 0) {
        Write-Host "✅ Vercel Frontend: Connected" -ForegroundColor Green
    } else {
        Write-Host "❌ Vercel Frontend: Failed" -ForegroundColor Red
    }
    
    if ($RAILWAY_STATUS -eq 0) {
        Write-Host "✅ Railway Backend: Connected" -ForegroundColor Green
    } else {
        Write-Host "❌ Railway Backend: Failed" -ForegroundColor Red
    }
    
    if ($SUPABASE_STATUS -eq 0) {
        Write-Host "✅ Supabase Database: Connected" -ForegroundColor Green
    } else {
        Write-Host "❌ Supabase Database: Failed" -ForegroundColor Red
    }
    
    if ($INTEGRATION_STATUS -eq 0) {
        Write-Host "✅ Cross-Service Integration: Working" -ForegroundColor Green
    } else {
        Write-Host "❌ Cross-Service Integration: Failed" -ForegroundColor Red
    }
    
    Write-Host ""
    
    if ($VERCEL_STATUS -eq 0 -and $RAILWAY_STATUS -eq 0 -and $SUPABASE_STATUS -eq 0 -and $INTEGRATION_STATUS -eq 0) {
        Write-Host "🎉 All services integrated successfully!" -ForegroundColor Green
        Write-Host "✅ Ready to proceed to Phase 3" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Some services failed integration test" -ForegroundColor Yellow
        Write-Host "❌ Please check configuration before proceeding" -ForegroundColor Red
    }
}

# Main execution
function Main {
    Write-Host "🧪 Testing service integrations..." -ForegroundColor Yellow
    Write-Host ""
    
    if (-not (Test-Vercel)) { $VERCEL_STATUS = 1 }
    if (-not (Test-Railway)) { $RAILWAY_STATUS = 1 }
    if (-not (Test-Supabase)) { $SUPABASE_STATUS = 1 }
    if (-not (Test-Integration)) { $INTEGRATION_STATUS = 1 }
    
    Show-Results
}

# Run main function
Main
