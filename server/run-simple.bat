@echo off
echo === Simple Server Runner ===
echo.

REM Change to server directory
cd /d "C:\Users\tomer\OneDrive\Desktop\integration\ceci-ai-main\server"

REM Check if we need to build
if not exist dist\main.js (
    echo Building project...
    call npm run build
    echo.
)

REM Run the server
echo Starting server on port 5173...
echo Press Ctrl+C to stop
echo.

set NODE_ENV=development
set DEBUG=true

node dist\main.js

pause
