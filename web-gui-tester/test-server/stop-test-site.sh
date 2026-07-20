#!/bin/bash
# 停止本地测试网站
cd "$(dirname "$0")"

if [ -f .test_server.pid ]; then
    PID=$(cat .test_server.pid)
    if taskkill //PID $PID //F 2>/dev/null; then
        echo "Test server (PID: $PID) stopped."
    else
        echo "Test server (PID: $PID) not found, may already be stopped."
    fi
    rm -f .test_server.pid
else
    echo "No PID file found. Trying to find by port..."
    PID=$(netstat -ano | grep ":8765" | grep "LISTENING" | awk '{print $NF}' | head -1)
    if [ -n "$PID" ]; then
        taskkill //PID $PID //F && echo "Test server (PID: $PID) stopped."
    else
        echo "No test server running on port 8765."
    fi
fi
