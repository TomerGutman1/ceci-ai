# PowerShell script to run only the backend server

Write-Host "=== CECI-AI Backend Server Runner ===" -ForegroundColor Cyan
Write-Host ""

# Change to server directory
Set-Location "C:\Users\tomer\OneDrive\Desktop\integration\ceci-ai-main\server"

# Check for existing process on port 5173
Write-Host "Checking for existing processes..." -ForegroundColor Yellow
$process = Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue
if ($process) {
    Stop-Process -Id $process.OwningProcess -Force
    Write-Host "Previous process stopped" -ForegroundColor Green
    Start-Sleep -Seconds 2
}

# Build the project
Write-Host ""
Write-Host "Building project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit
}

Write-Host "Build completed successfully" -ForegroundColor Green

# Create logs directory
if (!(Test-Path "logs")) {
    New-Item -ItemType Directory -Path "logs" | Out-Null
}

# Run the server
Write-Host ""
Write-Host "Starting server on port 5173..." -ForegroundColor Green
Write-Host "Logs saved to: logs\server.log" -ForegroundColor Gray
Write-Host "To stop: Ctrl+C" -ForegroundColor Gray
Write-Host ""

# Set environment variables
$env:NODE_ENV = "development"
$env:DEBUG = "true"

# Run server and save logs
node dist\main.js 2>&1 | Tee-Object -FilePath "logs\server.log" -Append
