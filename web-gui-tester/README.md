# Web GUI Tester

基于 Playwright 的 YAML 驱动浏览器自动化测试工具。只需写 YAML 就能定义登录、截图、断言等浏览器操作，无需手写测试代码。

---

## 前置条件

| 依赖 | 说明 |
|------|------|
| **Python 3.10+** | 推荐 3.12 |
| **Google Chrome** | 用于浏览器自动化，需已安装 |
| **Playwright** | Python 浏览器自动化库 |
| **PyYAML** | YAML 解析库 |

## 安装

```bash
# 1. 安装 Python 依赖
pip install playwright pyyaml

# 2. 安装 Playwright 浏览器驱动
playwright install chrome
```

## 运行所有测试

### 方式一：一键式（推荐）

自动启动本地测试站点 → 批量运行所有测试 → 停止站点：

**Windows:**
```bash
test-server\run-all-tests-with-site.bat
```


> 内置测试站点接受任意用户名密码，无需额外配置。

### 方式二：手动分步运行

```bash
# 1. 设置登录凭据（环境变量）
export LOGIN_USER="my_username"
export LOGIN_PASS="my_password"

# 2. 启动测试服务器（新开终端）
python test-server/test_server.py

# 3. 运行全部测试
run-all-tests.bat          # Windows

# 4. 手动停止测试服务器
test-server\stop.bat             # Windows

```

### 方式三：运行单个测试

```bash
python run.py tests/login_screenshot.yaml
python run.py tests/login_and_popup_screenshot.yaml
```

---

## 编写测试用例

在 `tests/` 下创建 `.yaml` 文件：

```yaml
name: "示例测试"
steps:
  - action: navigate
    url: "https://example.com"

  - action: fill
    selector: "#search"
    value: "hello"

  - action: click
    selector: "button[type='submit']"

  - action: screenshot
    name: "result"

  - action: assert_url
    contains: "search"
```

运行：`python run.py tests/你的测试.yaml`

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

YAML 中通过 `{vars.xxx}` 引用已定义变量：

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

编辑 `config.yaml` 控制浏览器行为、超时、截图等：

```yaml
browser:
  type: chromium          # chromium | firefox | webkit
  channel: chrome         # 使用系统 Chrome
  headless: false         # true = 无界面运行
  viewport:
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
├── run-all-tests.bat            # 批量运行所有测试
├── core/
│   ├── actions.py               # Action 注册表（所有可执行步骤）
│   ├── browser.py               # Playwright 浏览器管理器
│   ├── config.py                # YAML 配置加载
│   └── runner.py                # 测试执行引擎
├── tests/
│   ├── login_screenshot.yaml              # 键盘流登录测试
│   └── login_and_popup_screenshot.yaml    # 登录 + 弹窗截图
└── test-server/
    ├── test_server.py                     # 本地 HTTP 测试服务器
    ├── run-all-tests-with-site.bat        # 一键：启动站点 → 批量测试 → 停止
    ├── start.bat                         # 启动脚本
    ├── stop.bat                          # 停止脚本
    └── test-site/                         # 测试用静态页面
```
