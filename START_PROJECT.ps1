# Tasnim Dairy Farm - Complete Startup Script (PowerShell)

Write-Host ""
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "   Tasnim Dairy Farm Project Startup" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Kill any existing Node processes
Write-Host "[1/4] Stopping any running servers..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force 2>$null
Start-Sleep -Seconds 2

# Step 2: Start Backend
Write-Host "[2/4] Starting Backend Server on port 5000..." -ForegroundColor Yellow
Write-Host "      Command: cd backend && npm start" -ForegroundColor Gray
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm start"
Start-Sleep -Seconds 5

# Step 3: Start Frontend
Write-Host "[3/4] Starting Frontend Server on port 5173..." -ForegroundColor Yellow
Write-Host "      Command: npm run dev" -ForegroundColor Gray
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm run dev"
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "===================================================" -ForegroundColor Green
Write-Host "   ALL SERVERS STARTED!" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Frontend:  http://localhost:5173" -ForegroundColor Cyan
Write-Host "  Backend:   http://localhost:5000/api" -ForegroundColor Cyan
Write-Host ""
Write-Host "[4/4] Opening browser..." -ForegroundColor Yellow
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "✓ Servers are running!" -ForegroundColor Green
Write-Host "✓ Close any terminal window to stop that server" -ForegroundColor Green
Write-Host ""
