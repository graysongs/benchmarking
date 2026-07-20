#!/usr/bin/env python
"""
Web GUI Tester — CLI 入口

用法:
    python run.py tests/example_login.yaml
    python run.py tests/example_login.yaml -c config.yaml -v
    python run.py --list-actions
"""
import sys
import argparse
from pathlib import Path

# 确保项目根目录在 sys.path 中
ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

from core.config import load_config
from core.runner import TestRunner
from core.actions import ACTION_REGISTRY


def main():
    parser = argparse.ArgumentParser(
        description="Web GUI Tester — 基于 Playwright 的浏览器自动化测试工具",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("suite", nargs="?", help="测试套件 YAML 文件路径")
    parser.add_argument("-c", "--config", default=None, help="配置文件路径（默认: config.yaml）")
    parser.add_argument("--list-actions", action="store_true", help="列出所有可用的 action 类型")
    parser.add_argument("-v", "--verbose", action="store_true", help="详细输出")

    args = parser.parse_args()

    if args.list_actions:
        print("可用 Actions:")
        print(f"{'─'*50}")
        for name in ACTION_REGISTRY:
            print(f"  • {name}")
        print(f"\n共 {len(ACTION_REGISTRY)} 个 action")
        return

    if not args.suite:
        parser.print_help()
        print("\n错误: 请指定测试套件文件路径")
        sys.exit(1)

    # 加载配置
    config = load_config(args.config)

    # 运行测试
    runner = TestRunner(config)
    results = runner.run_suite(args.suite)

    # 根据结果设置退出码
    failed = any(r["status"] in ("FAIL", "ERROR") for r in results)
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
