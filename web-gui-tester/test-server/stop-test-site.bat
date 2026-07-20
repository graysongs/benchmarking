@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"
echo Stopping test website...

REM Find the Python process running test_server.py by port 8765
set "FOUND="
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8765" ^| findstr "LISTENING"') do (
    taskkill /pid %%a /f >nul 2>&1
    if !errorlevel! equ 0 (
        set "MSG=Test server (PID: %%a) stopped."
        echo !MSG!
        set "FOUND=1"
    ) else (
        set "MSG=Failed to stop process PID: %%a."
        echo !MSG!
    )
)

if not defined FOUND (
    echo No test server found on port 8765.
)

endlocal
pause
