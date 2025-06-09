# Test script for single decision request
Write-Host "Testing single decision request..." -ForegroundColor Cyan

# Test the API directly
$body = @{
    newMessageContent = "הבא לי החלטה בנושא אנרגיה מהשנה האחרונה"
    conversationId = ""
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5173/api/chat" `
    -Method POST `
    -Body $body `
    -ContentType "application/json; charset=utf-8" `
    -ErrorAction SilentlyContinue

if ($response.StatusCode -eq 200) {
    Write-Host "API call successful!" -ForegroundColor Green
    Write-Host "Check the console logs to see if it detected '1 decision'" -ForegroundColor Yellow
} else {
    Write-Host "API call failed with status: $($response.StatusCode)" -ForegroundColor Red
}
