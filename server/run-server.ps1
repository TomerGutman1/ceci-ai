# PowerShell script to run both backend and frontend

Write-Host "=== CECI-AI Full Stack Runner ===" -ForegroundColor Cyan
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

# Build backend
Write-Host ""
Write-Host "Building backend..." -ForegroundColor Yellow
Set-Location "C:\Users\tomer\OneDrive\Desktop\integration\ceci-ai-main\server"

npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Backend build failed!" -ForegroundColor Red
    exit
}

Write-Host "Backend build completed successfully" -ForegroundColor Green

# Create logs directory
if (!(Test-Path "logs")) {
    New-Item -ItemType Directory -Path "logs" | Out-Null
}

# Start backend in new window
Write-Host ""
Write-Host "Starting backend server on port 5173..." -ForegroundColor Green

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

# Wait for backend to start
Write-Host "Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Check if backend started successfully
if (Test-Port 5173) {
    Write-Host "Backend started successfully!" -ForegroundColor Green
} else {
    Write-Host "Backend failed to start. Check the backend window for errors." -ForegroundColor Red
    exit
}

# Start frontend
Write-Host ""
Write-Host "Starting frontend on port 5174..." -ForegroundColor Yellow

# Change to frontend directory
Set-Location "C:\Users\tomer\OneDrive\Desktop\integration\ceci-ai-main"

# Start frontend in new window
$frontendScript = @"
Set-Location 'C:\Users\tomer\OneDrive\Desktop\integration\ceci-ai-main'
Write-Host '=== CECI-AI Frontend ===' -ForegroundColor Cyan
Write-Host 'Starting Vite development server...' -ForegroundColor Yellow
npm run dev
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendScript

# Wait for frontend to start
Write-Host "Waiting for frontend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Check if frontend started successfully
if (Test-Port 5174) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✅ CECI-AI is running successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Frontend: http://localhost:5174" -ForegroundColor Cyan
    Write-Host "🔧 Backend:  http://localhost:5173" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📋 Features:" -ForegroundColor Yellow
    Write-Host "  - Enhanced search with 35 policy tags" -ForegroundColor White
    Write-Host "  - Smart tag detection and matching" -ForegroundColor White
    Write-Host "  - 24,716 government decisions available" -ForegroundColor White
    Write-Host ""
    Write-Host "🛑 To stop: Close both PowerShell windows" -ForegroundColor Gray
    
    # Open browser
    Write-Host ""
    Write-Host "Opening browser..." -ForegroundColor Yellow
    Start-Process "http://localhost:5174"
    
} else {
    Write-Host "Frontend failed to start. Check the frontend window for errors." -ForegroundColor Red
}

Write-Host ""
Write-Host "This window can be closed. The servers are running in separate windows." -ForegroundColor Gray
