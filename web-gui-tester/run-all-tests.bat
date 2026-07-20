@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

REM ── 检查必需的环境变量 ──
set MISSING=
if not defined LOGIN_USER set MISSING=%MISSING% LOGIN_USER
if not defined LOGIN_PASS set MISSING=%MISSING% LOGIN_PASS

if defined MISSING (
    echo ========================================
    echo   [ERROR] 缺少必需的环境变量：
    for %%v in (%MISSING%) do echo   * %%v
    echo.
    echo   请先设置以上环境变量后再运行。
    echo ========================================
    pause
    exit /b 1
)

echo ========================================
echo   Web GUI Tester - Running All Tests
echo ========================================
echo   LOGIN_USER: %LOGIN_USER%
echo.

set PASS=0
set FAIL=0
set TOTAL=0

for %%f in ("tests\*.yaml") do (
    set /a TOTAL+=1
    set "FILE=%%~nxf"
    echo [!TOTAL!] Running: !FILE!
    echo ----------------------------------------
    python run.py "%%f"
    if !errorlevel! equ 0 (
        set /a PASS+=1
        echo [PASS] !FILE!
    ) else (
        set /a FAIL+=1
        echo [FAIL] !FILE!
    )
    echo.
)

echo ========================================
if !TOTAL! equ 0 (
    echo   No test files found in tests\*.yaml
) else (
    echo   Results: !PASS! passed, !FAIL! failed / !TOTAL! total
)
echo ========================================
pause
