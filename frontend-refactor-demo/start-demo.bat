@echo off
cd /d "%~dp0"

if not exist node_modules (
  echo [1/2] Installing dependencies...
  call npm install
  if errorlevel 1 (
    echo npm install failed.
    pause
    exit /b 1
  )
)

echo [2/2] Starting demo at http://127.0.0.1:5173
start "" http://127.0.0.1:5173
call npm run dev
