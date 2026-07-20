# Web GUI Tester

基于 Playwright 的 YAML 驱动浏览器自动化测试工具。

```bash
# 装依赖
pip install playwright pyyaml
playwright install chrome

# 设置登录凭据（环境变量名对应 YAML 中的 ${LOGIN_USER} / ${LOGIN_PASS}）
export LOGIN_USER="your_username"
export LOGIN_PASS="your_password"

# 跑测试
python run.py tests/login_screenshot.yaml

# 查看所有可用 action
python run.py --list-actions

# 一站式：自动启动测试站点 → 跑所有测试 → 停止站点
test-server/run-all-tests-with-site.sh
# 或 Windows: test-server\run-all-tests-with-site.bat

# 分步本地试玩
python test-server/test_server.py
# 另开终端：python run.py tests/login_and_popup_screenshot.yaml
```

---

## 快速开始

### 1. 写一个测试用例

在 `tests/` 下创建 `.yaml` 文件：

```yaml
name: "示例测试"
steps:
  - action: navigate
    description: "打开首页"
    url: "https://example.com"

  - action: fill
    description: "搜索"
    selector: "#search"
    value: "hello"

  - action: click
    description: "点搜索按钮"
    selector: "button[type='submit']"

  - action: screenshot
    description: "截取搜索结果"
    name: "search_result"

  - action: assert_url
    description: "验证 URL 包含关键词"
    contains: "search"
```

### 2. 运行

```bash
python run.py tests/你的测试.yaml
python run.py tests/你的测试.yaml -c 自定义配置.yaml -v
```

---

## 可用 Actions

| Action | 作用 |
|--------|------|
| `navigate` | 导航到 URL |
| `click` | 点击元素（CSS / text= 选择器） |
| `click_coords` | 在指定视口坐标点击 |
| `click_coords_expect_popup` | 坐标点击 + 自动等待弹窗并切换过去 |
| `fill` | 填充输入框 |
| `fill_active` | 在当前聚焦的输入框输入 |
| `type` | 逐键输入（更接近真人） |
| `press_key` | 模拟按键（Tab / Enter / Escape 等） |
| `select` | 选择下拉框选项 |
| `login` | 组合操作：填用户名 → 填密码 → 点提交 → 等待成功 |
| `wait` | 等待元素出现，或等待指定时间 |
| `screenshot` | 截取当前页面 |
| `assert_url` | 断言 URL 包含/不包含指定文本 |
| `assert_text` | 断言元素包含指定文本 |
| `assert_visible` | 断言元素可见 |

---

## 变量系统

### 环境变量

YAML 中通过 `${VAR_NAME}` 引用环境变量：

```yaml
vars:
  username: "${LOGIN_USER}"
  password: "${LOGIN_PASS}"
```

### 步骤间变量

YAML 中通过 `{vars.xxx}` 引用已定义的变量：

```yaml
vars:
  popup_btn_left: "85"
  popup_btn_top: "120"

steps:
  - action: click_coords
    left: "{vars.popup_btn_left}"
    top: "{vars.popup_btn_top}"
```

---

## 配置

`config.yaml` 控制浏览器行为、超时、截图等：

```yaml
browser:
  type: chromium          # chromium | firefox | webkit
  channel: chrome         # 使用系统 Chrome
  headless: false         # true = 无界面运行
  viewport:               # 窗口大小
    width: 1280
    height: 720

timeout:
  element: 10000          # 元素等待 (ms)
  page_load: 30000        # 页面加载 (ms)
  navigation: 30000       # 导航 (ms)

screenshot:
  auto_capture: false     # 每步自动截图
  output_dir: reports/screenshots
```

---

## 项目结构

```
web-gui-tester/
├── run.py                       # CLI 入口
├── config.yaml                  # 全局配置
├── core/
│   ├── actions.py               # Action 注册表（所有可执行步骤）
│   ├── browser.py               # Playwright 浏览器管理器
│   ├── config.py                # YAML 配置加载
│   └── runner.py                # 测试执行引擎
├── tests/
│   ├── login_screenshot.yaml      # 键盘流登录测试（Tab/Enter 操作）
│   └── login_and_popup_screenshot.yaml  # 登录 + 弹窗截图示例
└── test-server/
    ├── test_server.py                # 本地 HTTP 测试服务器
    ├── run-all-tests-with-site.bat   # 一键：启动站点 → 批量测试 → 停止
    ├── run-all-tests-with-site.sh    # （同上，bash 版）
    ├── start-test-site.bat/.sh       # 启动脚本
    ├── stop-test-site.bat/.sh        # 停止脚本
    └── test-site/                    # 测试页面（index/dashboard/popup）
```
