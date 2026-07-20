"""
浏览器控制器 — 基于 Playwright 封装
"""
import time
from pathlib import Path
from playwright.sync_api import sync_playwright, Page, BrowserContext


class BrowserManager:
    """管理浏览器实例的生命周期"""

    def __init__(self, config: dict):
        self.config = config
        self._playwright = None
        self._browser = None
        self._context: BrowserContext | None = None
        self._page: Page | None = None

    def start(self):
        """启动浏览器并创建上下文"""
        bc = self.config["browser"]
        self._playwright = sync_playwright().start()

        browser_type = getattr(self._playwright, bc["type"])

        launch_kwargs = {
            "headless": bc["headless"],
            "args": bc.get("launch_args", []),
        }
        # 支持 channel（使用系统 Chrome）
        if bc.get("channel"):
            launch_kwargs["channel"] = bc["channel"]
        # 支持指定可执行文件路径
        if bc.get("executable_path"):
            launch_kwargs["executable_path"] = bc["executable_path"]

        self._browser = browser_type.launch(**launch_kwargs)

        self._context = self._browser.new_context(
            viewport=bc.get("viewport"),
            locale="zh-CN",
        )
        self._page = self._context.new_page()
        # 设置全局超时
        self._page.set_default_timeout(self.config["timeout"]["element"])
        return self._page

    @property
    def page(self) -> Page:
        if not self._page:
            raise RuntimeError("浏览器未启动，请先调用 start()")
        return self._page

    def navigate(self, url: str):
        """导航到指定 URL"""
        timeout = self.config["timeout"]["navigation"]
        self.page.goto(url, timeout=timeout, wait_until="networkidle")

    def screenshot(self, name: str = None) -> str:
        """截取当前页面截图"""
        output_dir = Path(self.config["screenshot"]["output_dir"])
        output_dir.mkdir(parents=True, exist_ok=True)

        timestamp = time.strftime("%Y%m%d_%H%M%S")
        filename = f"{name or 'screenshot'}_{timestamp}.png"
        filepath = output_dir / filename

        self.page.screenshot(path=str(filepath), full_page=True)
        return str(filepath)

    def close(self):
        """关闭浏览器"""
        try:
            if self._context:
                self._context.close()
            if self._browser:
                self._browser.close()
            if self._playwright:
                self._playwright.stop()
        except Exception:
            pass
