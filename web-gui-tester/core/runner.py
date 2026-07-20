"""
测试套件执行引擎 — 解析 YAML 测试用例并逐步骤执行
"""
import os
import re
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
        self._vars = {}    # 解析后的变量表

    # ── 变量解析 ─────────────────────────────────────

    def _resolve_vars(self, suite: dict):
        """解析套件中的 vars 定义"""
        raw_vars = suite.get("vars", {})
        for key, value in raw_vars.items():
            if isinstance(value, str):
                # 替换 ${ENV_VAR} 为环境变量
                self._vars[key] = re.sub(
                    r'\$\{(\w+)\}',
                    lambda m: os.environ.get(m.group(1), ""),
                    value,
                )
            else:
                self._vars[key] = value

    def _interpolate(self, value, step: dict) -> str:
        """在值中替换 {vars.xxx} 和 ${ENV_VAR} 占位符"""
        if not isinstance(value, str):
            return value
        # {vars.xxx} → self._vars["xxx"]
        result = re.sub(
            r'\{vars\.(\w+)\}',
            lambda m: str(self._vars.get(m.group(1), "")),
            value,
        )
        # ${ENV_VAR} → 环境变量
        result = re.sub(
            r'\$\{(\w+)\}',
            lambda m: os.environ.get(m.group(1), ""),
            result,
        )
        return result

    def _interpolate_step(self, step: dict) -> dict:
        """递归替换 step 中所有字符串值的占位符"""
        resolved = {}
        for key, value in step.items():
            if isinstance(value, str):
                resolved[key] = self._interpolate(value, step)
            elif isinstance(value, dict):
                resolved[key] = {k: self._interpolate(v, step) for k, v in value.items()}
            elif isinstance(value, list):
                resolved[key] = [self._interpolate(item, step) if isinstance(item, str) else item for item in value]
            else:
                resolved[key] = value
        return resolved

    # ── 测试执行 ─────────────────────────────────────

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
        self._resolve_vars(suite)

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
            # 将浏览器管理器注入上下文，供 action 使用（如 switch_to_new_page）
            self.context["_browser_manager"] = self.browser

            for i, step in enumerate(steps, 1):
                action_name = step.get("action", "?")
                description = step.get("description", action_name)
                print(f"\n  [{i}/{len(steps)}] {description} ... ", end="", flush=True)

                # 变量替换
                resolved_step = self._interpolate_step(step)

                try:
                    result = execute_action(page, resolved_step, self.context)
                    # 如果 action 切换了页面（如 switch_to_new_page），同步更新 page 引用
                    page = self.browser.page
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
