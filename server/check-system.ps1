# Quick diagnostic script
Write-Host "=== System Diagnostic ===" -ForegroundColor Cyan

# Check Node.js
Write-Host "`nNode.js:" -ForegroundColor Yellow
$node = Get-Command node -ErrorAction SilentlyContinue
if ($node) {
    Write-Host "✓ Found at: $($node.Source)" -ForegroundColor Green
    & node --version
} else {
    Write-Host "✗ Not found in PATH" -ForegroundColor Red
}

# Check npm
Write-Host "`nnpm:" -ForegroundColor Yellow
$npm = Get-Command npm -ErrorAction SilentlyContinue
if ($npm) {
    Write-Host "✓ Found at: $($npm.Source)" -ForegroundColor Green
    & npm --version
} else {
    Write-Host "✗ Not found in PATH" -ForegroundColor Red
}

# Check if npm.cmd exists
Write-Host "`nnpm.cmd:" -ForegroundColor Yellow
$npmCmd = Get-Command npm.cmd -ErrorAction SilentlyContinue
if ($npmCmd) {
    Write-Host "✓ Found at: $($npmCmd.Source)" -ForegroundColor Green
} else {
    Write-Host "✗ Not found" -ForegroundColor Red
}

# Check current directory
Write-Host "`nCurrent directory:" -ForegroundColor Yellow
Write-Host (Get-Location) -ForegroundColor Gray

# Check if package.json exists
Write-Host "`npackage.json:" -ForegroundColor Yellow
if (Test-Path "package.json") {
    Write-Host "✓ Found" -ForegroundColor Green
} else {
    Write-Host "✗ Not found" -ForegroundColor Red
}

# Check if dist exists
Write-Host "`ndist folder:" -ForegroundColor Yellow
if (Test-Path "dist") {
    Write-Host "✓ Found" -ForegroundColor Green
    $mainJs = Test-Path "dist\main.js"
    if ($mainJs) {
        Write-Host "  ✓ main.js exists" -ForegroundColor Green
    } else {
        Write-Host "  ✗ main.js missing" -ForegroundColor Red
    }
} else {
    Write-Host "✗ Not found - need to run build" -ForegroundColor Red
}

# Simple test
Write-Host "`nTrying simple npm command:" -ForegroundColor Yellow
try {
    $result = & cmd /c "npm --version 2>&1"
    Write-Host "npm version: $result" -ForegroundColor Green
} catch {
    Write-Host "Failed: $_" -ForegroundColor Red
}
