"""
测试套件执行引擎 — 解析 YAML 测试用例并逐步骤执行
"""
import sys
import time
import yaml
from pathlib import Path

from .browser import BrowserManager
from .actions import execute_action, ActionError


class TestRunner:
    """测试运行器"""

    def __init__(self, config: dict):
        self.config = config
        self.browser = BrowserManager(config)
        self.context = {}  # 跨步骤共享的上下文（可用于变量传递）

    def run_suite(self, suite_path: str | Path) -> list[dict]:
        """运行一个测试套件文件"""
        suite_path = Path(suite_path)
        if not suite_path.exists():
            raise FileNotFoundError(f"测试套件文件不存在: {suite_path}")

        with open(suite_path, encoding="utf-8") as f:
            suite = yaml.safe_load(f)

        name = suite.get("name", suite_path.stem)
        description = suite.get("description", "")
        steps = suite.get("steps", [])

        if not steps:
            print(f"  ⚠  测试套件 '{name}' 中没有 steps，跳过")
            return []

        print(f"\n{'='*60}")
        print(f"  测试套件: {name}")
        if description:
            print(f"  描述: {description}")
        print(f"{'='*60}")

        results = []
        auto_screenshot = self.config["screenshot"]["auto_capture"]

        try:
            self.browser.start()
            page = self.browser.page

            for i, step in enumerate(steps, 1):
                action_name = step.get("action", "?")
                description = step.get("description", action_name)
                print(f"\n  [{i}/{len(steps)}] {description} ... ", end="", flush=True)

                try:
                    result = execute_action(page, step, self.context)
                    result["step"] = i
                    result["action"] = action_name
                    result["status"] = "PASS"
                    result["description"] = description
                    print("PASS")

                    # 自动截图
                    if auto_screenshot and action_name != "screenshot":
                        ss_path = self.browser.screenshot(name=f"step{i:02d}_{action_name}")
                        result["screenshot"] = ss_path

                except ActionError as e:
                    result = {
                        "step": i,
                        "action": action_name,
                        "status": "FAIL",
                        "description": description,
                        "error": str(e),
                    }
                    print(f"FAIL")
                    print(f"     原因: {e}")
                    # 失败时截图
                    ss_path = self.browser.screenshot(name=f"FAIL_step{i:02d}")
                    result["screenshot"] = ss_path
                    if step.get("continue_on_fail"):
                        results.append(result)
                        continue
                    else:
                        results.append(result)
                        break

                results.append(result)

        except Exception as e:
            print(f"\n  ❌ 测试执行异常: {e}")
            results.append({
                "step": "?",
                "action": "?",
                "status": "ERROR",
                "error": str(e),
            })
        finally:
            self.browser.close()

        self._print_summary(results)
        return results

    def _print_summary(self, results: list[dict]):
        """打印测试结果汇总"""
        passed = sum(1 for r in results if r["status"] == "PASS")
        failed = sum(1 for r in results if r["status"] in ("FAIL", "ERROR"))
        total = len(results)

        print(f"\n{'─'*60}")
        print(f"  结果汇总: {passed}/{total} 通过", end="")
        if failed:
            print(f", {failed} 失败")
            for r in results:
                if r["status"] in ("FAIL", "ERROR"):
                    print(f"    ❌ Step {r['step']} [{r.get('action','?')}]: {r.get('error','')}")
        else:
            print()
        print(f"{'─'*60}\n")
