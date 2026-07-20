"""
测试站点 HTTP 服务器 — 为 web-gui-tester 提供本地测试页面

用法：
  python test_server.py [端口]

默认端口 8765，启动后访问 http://localhost:8765
"""
import http.server
import socketserver
import sys
from pathlib import Path

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
SITE_DIR = Path(__file__).parent / "test-site"


class TestSiteHandler(http.server.SimpleHTTPRequestHandler):
    """为 test-site 目录提供静态文件服务"""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(SITE_DIR), **kwargs)

    def log_message(self, format, *args):
        """简化日志输出"""
        print(f"  [server] {args[0]} {args[1]} {args[2]}")


if __name__ == "__main__":
    print(f"""
╔══════════════════════════════════════════════╗
║      Web GUI Tester — 测试站点              ║
║                                              ║
║  地址: http://localhost:{PORT:<5}               ║
║  页面:                                       ║
║    /index.html      登录页（测试登录）       ║
║    /dashboard.html  仪表盘（含弹窗按钮）     ║
║    /popup.html      弹窗内容页              ║
║                                              ║
║  按 Ctrl+C 停止                              ║
╚══════════════════════════════════════════════╝
    """)

    with socketserver.TCPServer(("", PORT), TestSiteHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n  服务器已停止。")
