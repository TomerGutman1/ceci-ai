# PowerShell script to test the API and monitor logs

Write-Host "=== API Tester ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health check
Write-Host "1. Testing health endpoint..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5173/health" -Method Get
    Write-Host "Health check passed" -ForegroundColor Green
    $health | ConvertTo-Json
} catch {
    Write-Host "Health check failed: $_" -ForegroundColor Red
}

Write-Host ""

# Test 2: Decision status
Write-Host "2. Testing decision status..." -ForegroundColor Yellow
try {
    $status = Invoke-RestMethod -Uri "http://localhost:5173/api/decisions/status" -Method Get
    Write-Host "Decision status:" -ForegroundColor Green
    $status | ConvertTo-Json
} catch {
    Write-Host "Decision status failed: $_" -ForegroundColor Red
}

Write-Host ""

# Test 3: Chat with decision query - Only send newMessageContent
Write-Host "3. Testing chat with decision query..." -ForegroundColor Yellow
$chatBody = @{
    newMessageContent = "What are the latest government decisions about education?"
} | ConvertTo-Json

try {
    $headers = @{
        "Content-Type" = "application/json"
    }
    
    Write-Host "Sending request with body:" -ForegroundColor Gray
    Write-Host $chatBody -ForegroundColor DarkGray
    
    $response = Invoke-WebRequest -Uri "http://localhost:5173/api/chat" `
        -Method Post `
        -Body $chatBody `
        -Headers $headers `
        -UseBasicParsing
    
    Write-Host "Response received (Status: $($response.StatusCode))" -ForegroundColor Green
    Write-Host ""
    
    # Parse streaming response
    $lines = $response.Content -split "`n"
    Write-Host "Response preview (first 10 lines):" -ForegroundColor Yellow
    $lineCount = 0
    foreach ($line in $lines) {
        if ($line.Trim() -ne "" -and $lineCount -lt 10) {
            try {
                $json = $line | ConvertFrom-Json
                Write-Host "[$($json.type)]" -ForegroundColor Cyan -NoNewline
                if ($json.message) {
                    Write-Host " - $($json.message.content.Substring(0, [Math]::Min(50, $json.message.content.Length)))..." -ForegroundColor Gray
                }
                if ($json.delta) {
                    Write-Host " - $($json.delta.Substring(0, [Math]::Min(50, $json.delta.Length)))..." -ForegroundColor Gray
                }
                if ($json.text) {
                    Write-Host " - $($json.text.Substring(0, [Math]::Min(50, $json.text.Length)))..." -ForegroundColor Gray
                }
            } catch {
                Write-Host "Raw: $line" -ForegroundColor DarkGray
            }
            $lineCount++
        }
    }
    
    Write-Host ""
    Write-Host "Total response lines: $($lines.Count)" -ForegroundColor Gray
    
} catch {
    Write-Host "Chat request failed: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errorContent = $reader.ReadToEnd()
        Write-Host "Error details: $errorContent" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "===== IMPORTANT: CHECK THE SERVER WINDOW =====" -ForegroundColor Yellow
Write-Host "Look for these logs:" -ForegroundColor Cyan
Write-Host "1. Red emojis: 'CHAT CONTROLLER CALLED'" -ForegroundColor White
Write-Host "2. '[OpenAI] Assistant request with tools:'" -ForegroundColor White
Write-Host "3. '========== TOOL CALL =========='" -ForegroundColor White
Write-Host "4. '[OpenAI] Calling search_decisions'" -ForegroundColor White
Write-Host "5. Decision search results" -ForegroundColor White
