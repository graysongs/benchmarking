@echo off
setlocal
cd /d "%~dp0"

REM ── 检查 / 提示输入登录凭据 ──
if not defined LOGIN_USER set /p LOGIN_USER=Enter LOGIN_USER: 
if not defined LOGIN_PASS set /p LOGIN_PASS=Enter LOGIN_PASS: 

echo ========================================
echo   Web GUI Tester - Running All Tests
echo ========================================
echo   LOGIN_USER: %LOGIN_USER%
echo.

set PASS=0
set FAIL=0
set TOTAL=0

for %%f in ("tests\*.yaml") do call :runtest "%%f"
goto :done

:runtest
set /a TOTAL+=1
set FILE=%~nx1
echo [%TOTAL%] Running: %FILE%
echo ----------------------------------------
python run.py "%~1"
if %errorlevel% equ 0 (
    set /a PASS+=1
    echo [PASS] %FILE%
) else (
    set /a FAIL+=1
    echo [FAIL] %FILE%
)
echo.
exit /b

:done
echo ========================================
if %TOTAL% equ 0 (
    echo   No test files found in tests\*.yaml
) else (
    echo   Results: %PASS% passed, %FAIL% failed / %TOTAL% total
)
echo ========================================
pause
