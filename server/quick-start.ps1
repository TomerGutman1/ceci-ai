# Quick start script - runs both backend and frontend without rebuilding

Write-Host "=== CECI-AI Quick Start ===" -ForegroundColor Cyan
Write-Host "(No rebuild - using existing build)" -ForegroundColor Gray
Write-Host ""

# Function to check if port is in use
function Test-Port {
    param($Port)
    $connection = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    return $connection -ne $null
}

# Check and kill existing processes
Write-Host "Checking for existing processes..." -ForegroundColor Yellow

# Check backend port (5173)
if (Test-Port 5173) {
    $process = Get-NetTCPConnection -LocalPort 5173 -State Listen
    Stop-Process -Id $process.OwningProcess -Force
    Write-Host "Stopped previous backend process on port 5173" -ForegroundColor Green
    Start-Sleep -Seconds 1
}

# Check frontend port (5174)
if (Test-Port 5174) {
    $process = Get-NetTCPConnection -LocalPort 5174 -State Listen
    Stop-Process -Id $process.OwningProcess -Force
    Write-Host "Stopped previous frontend process on port 5174" -ForegroundColor Green
    Start-Sleep -Seconds 1
}

# Start backend in new window
Write-Host ""
Write-Host "Starting backend server..." -ForegroundColor Green

$backendScript = @"
Set-Location 'C:\Users\tomer\OneDrive\Desktop\integration\ceci-ai-main\server'
`$env:NODE_ENV = 'development'
`$env:DEBUG = 'true'
Write-Host '=== CECI-AI Backend Server ===' -ForegroundColor Cyan
Write-Host 'Running on http://localhost:5173' -ForegroundColor Green
Write-Host 'Press Ctrl+C to stop' -ForegroundColor Gray
Write-Host ''
node dist\main.js
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendScript

# Wait a bit
Start-Sleep -Seconds 2

# Start frontend in new window
Write-Host "Starting frontend..." -ForegroundColor Green

$frontendScript = @"
Set-Location 'C:\Users\tomer\OneDrive\Desktop\integration\ceci-ai-main'
Write-Host '=== CECI-AI Frontend ===' -ForegroundColor Cyan
Write-Host 'Starting Vite development server...' -ForegroundColor Yellow
npm run dev
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendScript

# Wait and show final message
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ CECI-AI is starting up!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Frontend: http://localhost:5174" -ForegroundColor Cyan
Write-Host "🔧 Backend:  http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Opening browser in 3 seconds..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Open browser
Start-Process "http://localhost:5174"

Write-Host ""
Write-Host "This window can be closed." -ForegroundColor Gray
