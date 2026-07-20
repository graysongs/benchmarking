@echo off
cd /d "%~dp0"
echo Starting test website...
python test_server.py
if errorlevel 1 (
    echo.
    echo Failed to start. Press any key to exit.
    pause >nul
)
