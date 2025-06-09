# Rebuild CECI-AI Server with Enhanced Search
Write-Host "Rebuilding CECI-AI Server with Enhanced Search..." -ForegroundColor Cyan

# Navigate to server directory
Set-Location "C:\Users\tomer\OneDrive\Desktop\integration\ceci-ai-main\server"

# Clean previous build
Write-Host "`nCleaning previous build..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Path "dist" -Recurse -Force
}

# Build the project
Write-Host "`nBuilding TypeScript project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nBuild completed successfully!" -ForegroundColor Green
    
    # Show the enhanced features
    Write-Host "`nEnhanced Features Added:" -ForegroundColor Cyan
    Write-Host "  - Added mapping for all 35 official policy tags" -ForegroundColor Green
    Write-Host "  - Added synonyms and keywords for each tag" -ForegroundColor Green
    Write-Host "  - Improved tag-based search prioritization" -ForegroundColor Green
    Write-Host "  - Enhanced fallback search with tag matching" -ForegroundColor Green
    Write-Host "  - Updated prompt to recognize all policy areas" -ForegroundColor Green
    
    Write-Host "`nAvailable Policy Tags:" -ForegroundColor Yellow
    Write-Host "  - Security and Defense"
    Write-Host "  - Education" 
    Write-Host "  - Health and Medicine"
    Write-Host "  - Technology and Innovation"
    Write-Host "  - Housing and Real Estate"
    Write-Host "  ... and 30 more tags"
    
    Write-Host "`nExample Searches:" -ForegroundColor Cyan
    Write-Host "  'החלטות בנושא סייבר'"
    Write-Host "  'מה יש על טכנולוגיה וחדשנות'"
    Write-Host "  'החלטות משנה האחרונה על מילואים'"
    Write-Host "  'תן לי החלטה אחת על דיור'"
    
    Write-Host "`nTo run the server:" -ForegroundColor Yellow
    Write-Host "  .\run-server.ps1" -ForegroundColor White
    Write-Host "  or" -ForegroundColor Gray
    Write-Host "  node dist\main.js" -ForegroundColor White
    
} else {
    Write-Host "`nBuild failed!" -ForegroundColor Red
    Write-Host "Please check the error messages above." -ForegroundColor Yellow
}
