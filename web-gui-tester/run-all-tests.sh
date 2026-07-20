#!/bin/bash
# 执行 tests/ 下所有测试
cd "$(dirname "$0")"

# ── 检查 / 提示输入登录凭据 ──
if [ -z "$LOGIN_USER" ]; then
    read -p "Enter LOGIN_USER: " LOGIN_USER
fi
if [ -z "$LOGIN_PASS" ]; then
    read -p "Enter LOGIN_PASS: " LOGIN_PASS
fi

echo "========================================"
echo "  Web GUI Tester - Running All Tests"
echo "========================================"
echo "  LOGIN_USER: $LOGIN_USER"
echo ""

TESTS=(tests/*.yaml)
PASS=0
FAIL=0
TOTAL=${#TESTS[@]}

if [ $TOTAL -eq 0 ]; then
    echo "  No test files found in tests/*.yaml"
    echo ""
    exit 1
fi

for i in "${!TESTS[@]}"; do
    FILE="${TESTS[$i]##*/}"
    N=$((i+1))
    echo "[$N/$TOTAL] Running: $FILE"
    echo "----------------------------------------"
    python run.py "${TESTS[$i]}"
    if [ $? -eq 0 ]; then
        PASS=$((PASS+1))
        echo "[PASS] $FILE"
    else
        FAIL=$((FAIL+1))
        echo "[FAIL] $FILE"
    fi
    echo ""
done

echo "========================================"
echo "  Results: $PASS passed, $FAIL failed / $TOTAL total"
echo "========================================"
