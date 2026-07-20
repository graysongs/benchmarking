@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0.."

REM ── 默认凭据（测试站点接受任意用户名密码） ──
if not defined LOGIN_URL set LOGIN_URL=http://localhost:8765
if not defined LOGIN_USER set LOGIN_USER=testuser
if not defined LOGIN_PASS set LOGIN_PASS=testpass

echo ==========================================
echo   Web GUI Tester - 启动测试站点 + 批量测试
echo ==========================================
echo   LOGIN_URL : %LOGIN_URL%
echo   LOGIN_USER: %LOGIN_USER%
echo.

REM ── 启动测试服务器 ──
echo [1/3] 启动测试服务器...
start "TestServer" python test-server/test_server.py
timeout /t 2 /nobreak >nul
echo.

REM ── 运行所有测试 ──
echo [2/3] 批量运行测试...
echo ----------------------------------------

set PASS=0
set FAIL=0
set TOTAL=0

for %%f in ("tests\*.yaml") do (
    set /a TOTAL+=1
    set "FILE=%%~nxf"
    echo [!TOTAL!] !FILE!
    echo ----------------------------------------
    python run.py "%%f"
    echo.
)

REM ── 停止测试服务器 ──
echo [3/3] 停止测试服务器...
call test-server\stop-test-site.bat
echo   服务器已停止
echo.

echo ==========================================
echo   批量测试完成
echo ==========================================
if !TOTAL! gtr 0 pause
