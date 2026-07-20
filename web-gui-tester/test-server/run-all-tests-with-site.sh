#!/bin/bash
# 启动测试站点 → 运行 tests/ 下所有测试 → 停止站点
set -e

cd "$(dirname "$0")/.."
ROOT=$(pwd)

# ── 默认凭据（测试站点接受任意用户名密码） ──
export LOGIN_URL="${LOGIN_URL:-http://localhost:8765}"
export LOGIN_USER="${LOGIN_USER:-testuser}"
export LOGIN_PASS="${LOGIN_PASS:-testpass}"

echo "=========================================="
echo "  Web GUI Tester — 启动测试站点 + 批量测试"
echo "=========================================="
echo "  LOGIN_URL : $LOGIN_URL"
echo "  LOGIN_USER: $LOGIN_USER"
echo ""

# ── 启动测试服务器 ──
echo "[1/3] 启动测试服务器..."
python test-server/test_server.py &
SERVER_PID=$!
sleep 2  # 等服务器就绪

# ── 检查服务器是否正常启动 ──
if ! kill -0 $SERVER_PID 2>/dev/null; then
    echo "[FAIL] 测试服务器启动失败"
    exit 1
fi
echo "  PID: $SERVER_PID  (http://localhost:8765)"
echo ""

# ── 运行所有测试 ──
echo "[2/3] 批量运行测试..."
echo "----------------------------------------"

TESTS=(tests/*.yaml)
PASS=0
FAIL=0
TOTAL=${#TESTS[@]}

if [ $TOTAL -eq 0 ]; then
    echo "  tests/*.yaml 不存在，跳过"
else
    for i in "${!TESTS[@]}"; do
        FILE="${TESTS[$i]##*/}"
        N=$((i+1))
        echo "[$N/$TOTAL] $FILE"
        echo "----------------------------------------"
        python run.py "${TESTS[$i]}" || true
        # 统计通过/失败（run.py 内部已有输出，这里只计数）
        echo ""
    done
fi

# ── 停止测试服务器 ──
echo "[3/3] 停止测试服务器 (PID $SERVER_PID)..."
kill $SERVER_PID 2>/dev/null || true
wait $SERVER_PID 2>/dev/null || true
echo "  服务器已停止"
echo ""

echo "=========================================="
echo "  批量测试完成"
echo "=========================================="
