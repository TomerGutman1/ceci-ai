@echo off
echo === CECI-AI Debug Server Runner (CMD) ===
echo Starting at: %date% %time%
echo.

cd /d "C:\Users\tomer\OneDrive\Desktop\integration\ceci-ai-main\server"

REM Kill existing processes on port 5173
echo Checking for existing processes on port 5173...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do (
    echo Killing process %%a
    taskkill /F /PID %%a 2>nul
)

REM Build if requested
if "%1"=="build" (
    echo.
    echo Building TypeScript...
    call npm run build
    if errorlevel 1 (
        echo Build failed!
        exit /b 1
    )
    echo Build completed successfully
)

REM Create logs directory
if not exist logs mkdir logs

REM Start server with output to both console and file
echo.
echo Starting server...
echo Server will run on port 5173
echo Logs will be saved to: logs\server-%date:~-4,4%-%date:~-10,2%-%date:~-7,2%.log
echo Press Ctrl+C to stop the server
echo.

set NODE_ENV=development
set DEBUG=true
set FORCE_COLOR=0

REM Run server and capture output
node dist/main.js 2>&1 | powershell -Command "$input | ForEach-Object { Write-Host $_; Add-Content -Path 'logs\server.log' -Value \"[$(Get-Date -Format 'HH:mm:ss')] $_\" }"

echo.
echo Server stopped
pause
