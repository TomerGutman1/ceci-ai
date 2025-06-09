# PowerShell script to run the server with proper logging
param(
    [switch]$Build = $false,
    [switch]$Clean = $false
)

Write-Host "=== CECI-AI Debug Server Runner ===" -ForegroundColor Cyan
Write-Host "Starting at: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray

# Set working directory
$serverPath = "C:\Users\tomer\OneDrive\Desktop\integration\ceci-ai-main\server"
Set-Location $serverPath
Write-Host "Working directory: $serverPath" -ForegroundColor Gray

# Clean logs if requested
if ($Clean) {
    Write-Host "Cleaning old logs..." -ForegroundColor Yellow
    if (Test-Path "logs") {
        Remove-Item "logs\*" -Force -ErrorAction SilentlyContinue
    }
    if (Test-Path "debug-logs") {
        Remove-Item "debug-logs\*" -Force -ErrorAction SilentlyContinue
    }
    if (Test-Path "server.log") {
        Remove-Item "server.log" -Force -ErrorAction SilentlyContinue
    }
}

# Kill any existing Node processes on port 5173
Write-Host "Checking for existing processes on port 5173..." -ForegroundColor Yellow
$existingProcess = Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue
if ($existingProcess) {
    $pid = $existingProcess.OwningProcess
    Write-Host "Found process $pid on port 5173, terminating..." -ForegroundColor Red
    Stop-Process -Id $pid -Force
    Start-Sleep -Seconds 2
}

# Build if requested or if dist doesn't exist
if ($Build -or -not (Test-Path "dist")) {
    Write-Host "`nBuilding TypeScript..." -ForegroundColor Yellow
    
    # Use cmd to run npm
    $buildResult = & cmd /c "npm run build 2>&1"
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Build failed!" -ForegroundColor Red
        Write-Host $buildResult -ForegroundColor Red
        exit 1
    }
    Write-Host "Build completed successfully" -ForegroundColor Green
}

# Create logs directory
if (-not (Test-Path "logs")) {
    New-Item -ItemType Directory -Path "logs" | Out-Null
    Write-Host "Created logs directory" -ForegroundColor Gray
}

# Start the server
Write-Host "`nStarting server..." -ForegroundColor Yellow
Write-Host "Server will run on port 5173" -ForegroundColor Gray
Write-Host "Logs will be saved to: $(Join-Path $serverPath 'logs')" -ForegroundColor Gray
Write-Host "Press Ctrl+C to stop the server`n" -ForegroundColor Gray

# Set environment variables
$env:NODE_ENV = "development"
$env:DEBUG = "true"
$env:FORCE_COLOR = "0"

# Find node executable
$nodeExe = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeExe) {
    Write-Host "Node.js not found in PATH!" -ForegroundColor Red
    exit 1
}

Write-Host "Using Node.js: $($nodeExe.Source)" -ForegroundColor Gray

# Run the server directly with full output
& $nodeExe.Source dist/main.js 2>&1 | ForEach-Object {
    $line = $_
    Write-Host $line
    
    # Also write to log file
    $logFile = Join-Path $serverPath "logs\server-$(Get-Date -Format 'yyyy-MM-dd').log"
    Add-Content -Path $logFile -Value "[$(Get-Date -Format 'HH:mm:ss')] $line"
}

# This will only execute after the server is stopped
Write-Host "`nServer stopped" -ForegroundColor Yellow
