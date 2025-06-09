# PowerShell script to test the API and show better results

Write-Host "=== API Tester ===" -ForegroundColor Cyan
Write-Host ""

# Test chat with decision query
Write-Host "Testing chat with decision query..." -ForegroundColor Yellow
$chatBody = @{
    newMessageContent = "What are the latest government decisions about education?"
} | ConvertTo-Json

try {
    $headers = @{
        "Content-Type" = "application/json"
    }
    
    Write-Host "Sending request..." -ForegroundColor Gray
    
    $response = Invoke-WebRequest -Uri "http://localhost:5173/api/chat" `
        -Method Post `
        -Body $chatBody `
        -Headers $headers `
        -UseBasicParsing
    
    Write-Host "Response received!" -ForegroundColor Green
    
    # Parse the streaming response properly
    $lines = $response.Content -split "`n" | Where-Object { $_.Trim() -ne "" }
    
    Write-Host ""
    Write-Host "Parsing response..." -ForegroundColor Yellow
    
    $fullMessage = ""
    $toolCalled = $false
    
    foreach ($line in $lines) {
        try {
            $json = $line | ConvertFrom-Json
            
            switch ($json.type) {
                "MessageCreated" {
                    Write-Host "[Conversation ID: $($json.conversationId)]" -ForegroundColor Cyan
                }
                "MessageAdded" {
                    if ($json.message.content -like "*search*" -or $json.message.content -like "*decision*") {
                        Write-Host "[Assistant is searching...]" -ForegroundColor Yellow
                        $toolCalled = $true
                    }
                }
                "MessageDelta" {
                    $fullMessage += $json.delta
                }
                "MessageCompleted" {
                    # This might be the tool response
                    if ($json.text -like "*decision*" -or $json.text -like "*government*") {
                        Write-Host "[Found decision content!]" -ForegroundColor Green
                    }
                }
            }
        } catch {
            # Skip unparseable lines
        }
    }
    
    Write-Host ""
    Write-Host "=== ASSISTANT RESPONSE ===" -ForegroundColor Green
    Write-Host $fullMessage.Substring(0, [Math]::Min(1000, $fullMessage.Length)) -ForegroundColor White
    if ($fullMessage.Length -gt 1000) {
        Write-Host "... (truncated, full length: $($fullMessage.Length) chars)" -ForegroundColor Gray
    }
    
    Write-Host ""
    if ($toolCalled) {
        Write-Host "✓ Tool was called!" -ForegroundColor Green
    } else {
        Write-Host "✗ No tool call detected in response" -ForegroundColor Red
    }
    
} catch {
    Write-Host "Request failed: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== CHECK SERVER LOGS ===" -ForegroundColor Yellow
Write-Host "The server window should show:" -ForegroundColor Cyan
Write-Host "- Red emojis (CHAT CONTROLLER)" -ForegroundColor White
Write-Host "- TOOL CALL logs" -ForegroundColor White
Write-Host "- Decision search activity" -ForegroundColor White
