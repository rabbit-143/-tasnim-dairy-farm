@echo off
REM Tasnim Dairy Farm - Complete Startup Script

echo.
echo ====================================================
echo   Tasnim Dairy Farm Project Startup
echo ====================================================
echo.

REM Kill any existing Node processes
echo [1/4] Stopping any running servers...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

REM Start Backend
echo [2/4] Starting Backend Server on port 5000...
start cmd /k "cd backend && npm start"
timeout /t 5 /nobreak >nul

REM Start Frontend
echo [3/4] Starting Frontend Server on port 5173...
start cmd /k "npm run dev"
timeout /t 5 /nobreak >nul

echo.
echo ====================================================
echo   ALL SERVERS STARTED!
echo ====================================================
echo.
echo Frontend:  http://localhost:5173
echo Backend:   http://localhost:5000/api
echo.
echo [4/4] Opening browser...
start "" "http://localhost:5173"
timeout /t 3 /nobreak >nul

echo.
echo Servers are running. Press Ctrl+C to stop any server.
echo.
