"""
Action 系统 — 每个 action 对应一个可执行的测试步骤
"""
import time
from pathlib import Path
from playwright.sync_api import Page, expect


class ActionError(Exception):
    """Action 执行失败"""
    pass


# ---------- 选择器工具 ----------

def _locate(page: Page, selector: str):
    """统一的选择器定位，支持 CSS 和 text= 前缀"""
    try:
        return page.locator(selector)
    except Exception as e:
        raise ActionError(f"无法定位元素: selector={selector}, error={e}")


# ---------- Action 函数映射 ----------
# 每个 action 对应一个 (name, handler) 对
# handler 签名: (page, step: dict, context: dict) -> dict


def _action_navigate(page: Page, step: dict, context: dict) -> dict:
    """导航到 URL"""
    url = step["url"]
    timeout = step.get("timeout", 30000)
    page.goto(url, timeout=timeout, wait_until="networkidle")
    return {"status": "ok", "url": url}


def _action_wait(page: Page, step: dict, context: dict) -> dict:
    """等待条件"""
    if "selector" in step:
        state = step.get("state", "visible")  # visible | hidden | attached | detached
        page.locator(step["selector"]).wait_for(state=state)
    elif "timeout" in step:
        time.sleep(step["timeout"] / 1000)
    return {"status": "ok"}


def _action_fill(page: Page, step: dict, context: dict) -> dict:
    """填充输入框"""
    locator = _locate(page, step["selector"])
    locator.fill(step["value"])
    return {"status": "ok", "selector": step["selector"]}


def _action_click(page: Page, step: dict, context: dict) -> dict:
    """点击元素"""
    locator = _locate(page, step["selector"])
    locator.click()
    return {"status": "ok", "selector": step["selector"]}


def _action_select(page: Page, step: dict, context: dict) -> dict:
    """选择下拉框选项"""
    locator = _locate(page, step["selector"])
    locator.select_option(step["value"])
    return {"status": "ok", "selector": step["selector"]}


def _action_type(page: Page, step: dict, context: dict) -> dict:
    """逐键输入（比 fill 更接近真实用户输入）"""
    locator = _locate(page, step["selector"])
    delay = step.get("delay", 50)
    locator.press_sequentially(step["value"], delay=delay)
    return {"status": "ok", "selector": step["selector"]}


def _action_login(page: Page, step: dict, context: dict) -> dict:
    """登录 — 特殊组合 action"""
    url = step.get("url")
    if url:
        page.goto(url, timeout=30000, wait_until="networkidle")

    # 填充用户名
    if "username_selector" in step and "username" in step:
        _locate(page, step["username_selector"]).fill(step["username"])

    # 填充密码
    if "password_selector" in step and "password" in step:
        _locate(page, step["password_selector"]).fill(step["password"])

    # 点击登录按钮
    if "submit_selector" in step:
        _locate(page, step["submit_selector"]).click()

    # 等待登录完成（等待某个元素出现）
    if "success_selector" in step:
        page.locator(step["success_selector"]).wait_for(state="visible")

    return {"status": "ok", "action": "login"}


def _action_screenshot(page: Page, step: dict, context: dict) -> dict:
    """截图"""
    name = step.get("name", None)
    output_dir = step.get("output_dir", "reports/screenshots")
    Path(output_dir).mkdir(parents=True, exist_ok=True)

    timestamp = time.strftime("%Y%m%d_%H%M%S")
    filename = f"{name or 'screenshot'}_{timestamp}.png"
    filepath = Path(output_dir) / filename

    page.screenshot(path=str(filepath), full_page=True)
    return {"status": "ok", "screenshot": str(filepath)}


def _action_assert_url(page: Page, step: dict, context: dict) -> dict:
    """断言当前 URL 包含指定文本"""
    expected = step["contains"]
    current_url = page.url
    if expected not in current_url:
        raise ActionError(f"URL 断言失败: 期望包含 '{expected}', 实际为 '{current_url}'")
    return {"status": "ok", "url": current_url}


def _action_assert_text(page: Page, step: dict, context: dict) -> dict:
    """断言元素包含指定文本"""
    locator = _locate(page, step["selector"])
    expected = step["contains"]
    text = locator.text_content() or ""
    if expected not in text:
        raise ActionError(
            f"文本断言失败: 元素 '{step['selector']}' 期望包含 '{expected}', "
            f"实际内容为 '{text[:100]}'"
        )
    return {"status": "ok"}


def _action_assert_visible(page: Page, step: dict, context: dict) -> dict:
    """断言元素可见"""
    locator = _locate(page, step["selector"])
    if not locator.is_visible():
        raise ActionError(f"可见性断言失败: 元素 '{step['selector']}' 不可见")
    return {"status": "ok"}


# ---------- Action 注册表 ----------

ACTION_REGISTRY = {
    "navigate": _action_navigate,
    "wait": _action_wait,
    "fill": _action_fill,
    "click": _action_click,
    "select": _action_select,
    "type": _action_type,
    "login": _action_login,
    "screenshot": _action_screenshot,
    "assert_url": _action_assert_url,
    "assert_text": _action_assert_text,
    "assert_visible": _action_assert_visible,
}


def execute_action(page: Page, step: dict, context: dict) -> dict:
    """执行单个 action"""
    action_name = step.get("action")
    if not action_name:
        raise ActionError("step 缺少 'action' 字段")

    handler = ACTION_REGISTRY.get(action_name)
    if not handler:
        raise ActionError(f"未知 action: '{action_name}'，可用: {list(ACTION_REGISTRY.keys())}")

    return handler(page, step, context)
