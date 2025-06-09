@echo off
cd /d "C:\Users\tomer\OneDrive\Desktop\integration\ceci-ai-main\server"

echo === Building Server ===
call npm run build

echo.
echo === Starting Server ===
node dist\main.js
