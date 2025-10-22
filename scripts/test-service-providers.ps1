# MS8-Learning-Analytics Service Provider Setup Script (PowerShell)
# This script helps validate and configure service provider connections

Write-Host "🚀 MS8-Learning-Analytics Service Provider Setup" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

# Check if required tools are installed
function Test-Tools {
    Write-Host "🔍 Checking required tools..." -ForegroundColor Yellow
    
    if (-not (Get-Command curl -ErrorAction SilentlyContinue)) {
        Write-Host "❌ curl is required but not installed" -ForegroundColor Red
        exit 1
    }
    
    if (-not (Get-Command jq -ErrorAction SilentlyContinue)) {
        Write-Host "⚠️  jq is recommended for JSON parsing" -ForegroundColor Yellow
    }
    
    Write-Host "✅ Required tools check complete" -ForegroundColor Green
}

# Test Vercel connection
function Test-Vercel {
    Write-Host "🔍 Testing Vercel connection..." -ForegroundColor Yellow
    
    if (-not $env:VERCEL_TOKEN) {
        Write-Host "❌ VERCEL_TOKEN not set" -ForegroundColor Red
        return $false
    }
    
    try {
        $headers = @{
            "Authorization" = "Bearer $env:VERCEL_TOKEN"
        }
        
        $response = Invoke-RestMethod -Uri "https://api.vercel.com/v2/user" -Headers $headers
        
        if ($response.id) {
            Write-Host "✅ Vercel connection successful" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ Vercel connection failed" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ Vercel connection failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Test Railway connection
function Test-Railway {
    Write-Host "🔍 Testing Railway connection..." -ForegroundColor Yellow
    
    if (-not $env:RAILWAY_TOKEN) {
        Write-Host "❌ RAILWAY_TOKEN not set" -ForegroundColor Red
        return $false
    }
    
    try {
        $headers = @{
            "Authorization" = "Bearer $env:RAILWAY_TOKEN"
            "Content-Type" = "application/json"
        }
        
        $body = @{
            query = "query { me { id } }"
        } | ConvertTo-Json
        
        $response = Invoke-RestMethod -Uri "https://backboard.railway.app/graphql" -Method Post -Headers $headers -Body $body
        
        if ($response.data.me.id) {
            Write-Host "✅ Railway connection successful" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ Railway connection failed" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ Railway connection failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Test Supabase connection
function Test-Supabase {
    Write-Host "🔍 Testing Supabase connection..." -ForegroundColor Yellow
    
    if (-not $env:SUPABASE_URL -or -not $env:SUPABASE_ANON_KEY) {
        Write-Host "❌ SUPABASE_URL or SUPABASE_ANON_KEY not set" -ForegroundColor Red
        return $false
    }
    
    try {
        $headers = @{
            "apikey" = $env:SUPABASE_ANON_KEY
            "Authorization" = "Bearer $env:SUPABASE_ANON_KEY"
        }
        
        $response = Invoke-RestMethod -Uri "$env:SUPABASE_URL/rest/v1/" -Headers $headers
        
        if ($response -match "swagger") {
            Write-Host "✅ Supabase connection successful" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ Supabase connection failed" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ Supabase connection failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Main execution
function Main {
    Test-Tools
    
    Write-Host ""
    Write-Host "🧪 Testing service provider connections..." -ForegroundColor Cyan
    Write-Host ""
    
    $vercelStatus = Test-Vercel
    $railwayStatus = Test-Railway
    $supabaseStatus = Test-Supabase
    
    Write-Host ""
    Write-Host "📊 Connection Test Results:" -ForegroundColor Cyan
    Write-Host "==========================" -ForegroundColor Cyan
    
    if ($vercelStatus) {
        Write-Host "✅ Vercel: Connected" -ForegroundColor Green
    } else {
        Write-Host "❌ Vercel: Failed" -ForegroundColor Red
    }
    
    if ($railwayStatus) {
        Write-Host "✅ Railway: Connected" -ForegroundColor Green
    } else {
        Write-Host "❌ Railway: Failed" -ForegroundColor Red
    }
    
    if ($supabaseStatus) {
        Write-Host "✅ Supabase: Connected" -ForegroundColor Green
    } else {
        Write-Host "❌ Supabase: Failed" -ForegroundColor Red
    }
    
    Write-Host ""
    
    if ($vercelStatus -and $railwayStatus -and $supabaseStatus) {
        Write-Host "🎉 All service providers connected successfully!" -ForegroundColor Green
        Write-Host "✅ Ready to proceed to Phase 1C" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Some service providers failed connection test" -ForegroundColor Yellow
        Write-Host "❌ Please check configuration before proceeding" -ForegroundColor Red
    }
}

# Run main function
Main
