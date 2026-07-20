@echo off
cd /d "%~dp0"
echo Starting test website...
start "TestServer" python test_server.py
