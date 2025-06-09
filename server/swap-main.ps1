# PowerShell script to swap main.ts with debug version

param(
    [switch]$Restore = $false
)

$serverPath = "C:\Users\tomer\OneDrive\Desktop\integration\ceci-ai-main\server\src"
$mainFile = Join-Path $serverPath "main.ts"
$backupFile = Join-Path $serverPath "main.original.ts"
$debugFile = Join-Path $serverPath "main-debug.ts"

if ($Restore) {
    # Restore original
    if (Test-Path $backupFile) {
        Write-Host "Restoring original main.ts..." -ForegroundColor Yellow
        Copy-Item $backupFile $mainFile -Force
        Write-Host "✅ Original main.ts restored" -ForegroundColor Green
    } else {
        Write-Host "❌ No backup found!" -ForegroundColor Red
    }
} else {
    # Backup and replace with debug version
    if (-not (Test-Path $backupFile)) {
        Write-Host "Creating backup of main.ts..." -ForegroundColor Yellow
        Copy-Item $mainFile $backupFile
        Write-Host "✅ Backup created: main.original.ts" -ForegroundColor Green
    }
    
    Write-Host "Replacing main.ts with debug version..." -ForegroundColor Yellow
    Copy-Item $debugFile $mainFile -Force
    Write-Host "✅ Debug version activated" -ForegroundColor Green
    Write-Host "Don't forget to rebuild: npm run build" -ForegroundColor Cyan
}
