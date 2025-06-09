Write-Host "🚀 Rebuilding CECI-AI Server with Enhanced Search..." -ForegroundColor Cyan

# Navigate to server directory
Set-Location "C:\Users\tomer\OneDrive\Desktop\integration\ceci-ai-main\server"

# Clean previous build
Write-Host "`n🧹 Cleaning previous build..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Path "dist" -Recurse -Force
}

# Build the project
Write-Host "`n🔨 Building TypeScript project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Build completed successfully!" -ForegroundColor Green
    
    # Show the enhanced features
    Write-Host "`n📋 Enhanced Features Added:" -ForegroundColor Cyan
    Write-Host "  ✓ Added mapping for all 35 official policy tags" -ForegroundColor Green
    Write-Host "  ✓ Added synonyms and keywords for each tag" -ForegroundColor Green
    Write-Host "  ✓ Improved tag-based search prioritization" -ForegroundColor Green
    Write-Host "  ✓ Enhanced fallback search with tag matching" -ForegroundColor Green
    Write-Host "  ✓ Updated prompt to recognize all policy areas" -ForegroundColor Green
    
    Write-Host "`n🏷️ Available Policy Tags:" -ForegroundColor Yellow
    Write-Host "  - ביטחון לאומי וצה״ל"
    Write-Host "  - ביטחון פנים וחירום אזרחי"
    Write-Host "  - דיפלומטיה ויחסים בינ״ל"
    Write-Host "  - הגירה וקליטת עלייה"
    Write-Host "  - תעסוקה ושוק העבודה"
    Write-Host "  - כלכלה מאקרו ותקציב"
    Write-Host "  ... and 29 more tags"
    
    Write-Host "`n💡 Example Searches:" -ForegroundColor Cyan
    Write-Host '  "החלטות בנושא סייבר"'
    Write-Host '  "מה יש על טכנולוגיה וחדשנות"'
    Write-Host '  "החלטות משנה האחרונה על מילואים"'
    Write-Host '  "תן לי החלטה אחת על דיור"'
    
    Write-Host "`n🚀 To run the server:" -ForegroundColor Yellow
    Write-Host "  .\run-server.ps1" -ForegroundColor White
    Write-Host "  or" -ForegroundColor Gray
    Write-Host "  node dist\main.js" -ForegroundColor White
    
} else {
    Write-Host "`n❌ Build failed!" -ForegroundColor Red
    Write-Host "Please check the error messages above." -ForegroundColor Yellow
}
