@echo off
cd /d "%~dp0"

if not exist node_modules (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 (
    echo npm install failed.
    pause
    exit /b 1
  )
)

echo Using local Google Chrome as the test browser...
REM call npx playwright install chromium
if errorlevel 1 (
  echo Playwright browser install failed.
  pause
  exit /b 1
)

echo Starting demo dev server on http://127.0.0.1:5173 ...
start "frontend-refactor-demo" cmd /c "npm run dev -- --host 127.0.0.1 --port 5173"

echo Waiting for dev server...
timeout /t 4 /nobreak >nul

set E2E_BASE_URL=http://127.0.0.1:5173
echo Running migration-plan E2E tests in headed mode...
call npx playwright test tests/e2e/migration-plan.spec.ts --headed

set E2E_BASE_URL=
pause
