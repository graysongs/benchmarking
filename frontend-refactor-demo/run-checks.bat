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

echo [1/3] TypeScript type check...
call npm run typecheck
if errorlevel 1 goto :failed

echo [2/3] Vitest unit tests...
call npm test
if errorlevel 1 goto :failed

echo [3/3] Production build...
call npm run build
if errorlevel 1 goto :failed

echo.
echo All checks passed.
pause
exit /b 0

:failed
echo.
echo Checks failed. See output above.
pause
exit /b 1
