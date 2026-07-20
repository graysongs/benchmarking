#!/bin/bash
# 启动本地测试网站（后台运行）
cd "$(dirname "$0")"

echo "Starting test website..."
python test_server.py &
PID=$!
echo $PID > .test_server.pid

echo ""
echo "  Test server started (PID: $PID)"
echo "  URL: http://localhost:8765"
echo "  Stop: run stop-test-site.sh"
echo ""
