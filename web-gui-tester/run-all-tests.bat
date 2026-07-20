@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

echo ========================================
echo   Web GUI Tester - Running All Tests
echo ========================================
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
