# 前端现代化重构方案 Demo

这是一个用于验证「可商用前端重构方案」的交互式 Demo，项目本身使用推荐技术栈搭建：

- **React 18 + TypeScript strict**
- **Vite 5**
- **React Router**（Hash 模式，便于静态部署）
- **Ant Design 5**（使用定制产品化主题，非默认后台样式）
- **Zustand**（持久化可编辑计划表）
- **Vitest + Testing Library**
- **Playwright**（端到端演示用例）

Demo 中的所有页面内容均为方案规划内容本身，不包含任何具体业务信息。

## 功能演示

| 页面 | 交互 | 验证点 |
| --- | --- | --- |
| 方案总览 | 路线图、选型决策、AI 重构流水线、无缝切换机制 | 展示整体方案 |
| 技术栈详解 | 点击技术栈卡片，弹出详情介绍；支持分类筛选 | 卡片点击效果 + Modal 详情 |
| 迁移计划表格 | 表格内编辑、行级保存、新增/删除、恢复基线、提交全部修改 | 表格内部提交内容修改 |
| 测试与切换 | 测试分层表格、切换验收门槛勾选、模拟验收 | E2E 与灰度安全网 |

## 快速开始

要求 Node.js 18+。

```bash
npm install
npm run dev
```

浏览器打开 `http://127.0.0.1:5173`。

Windows 下也可以双击 `start-demo.bat` 启动，双击 `run-plan-e2e.bat` 自动启动服务并运行迁移计划表测试，或双击 `run-checks.bat` 依次执行类型检查、单元测试和生产构建。

## 常用命令

```bash
npm run dev          # 启动开发服务器
npm run build        # 类型检查 + 生产构建
npm run preview      # 预览生产构建
npm run typecheck    # 仅 TypeScript 类型检查
npm test             # Vitest 单元测试
npm run test:e2e           # 全部 E2E（自动在 4173 端口启动 dev server）
npm run test:e2e:plan      # 只跑迁移计划表测试
npm run test:e2e:headed    # 有头模式，能看见浏览器操作
npm run test:e2e:ui        # Playwright UI 模式
```

## 目录结构

```text
frontend-refactor-demo/
├── src/
│   ├── App.tsx                    # 布局与路由
│   ├── data/techStack.tsx         # 技术栈详情数据
│   ├── pages/
│   │   ├── OverviewPage.tsx       # 方案总览
│   │   ├── TechStackPage.tsx      # 技术栈点击详情
│   │   ├── MigrationPlanPage.tsx  # 可编辑表格
│   │   └── TestingPage.tsx        # 测试与切换
│   ├── store/useMigrationStore.ts # Zustand 本地持久化
│   └── utils/planUtils.ts         # 纯函数 + 单元测试
├── tests/e2e/demo.spec.ts           # Playwright 基础演示用例
├── tests/e2e/migration-plan.spec.ts # 迁移计划表：编辑、保存、校验、新增行
├── playwright.config.ts
├── vitest.config.ts
└── vite.config.ts
```

## 可编辑表格说明

- 点击某一行的「编辑」后，单元格变为输入框，支持必填校验和长度限制。
- 「保存」只提交当前行到本地演示状态。
- 「提交所有修改」会先校验正在编辑的行，然后弹出提交预览。
- 数据通过 Zustand `persist` 写入浏览器 localStorage，Key 为 `frontend-refactor-demo-plan`。
- 「恢复基线」可一键回到初始计划。

## 端到端测试说明

`tests/e2e/demo.spec.ts` 演示两个关键场景：

1. 技术栈卡片点击后打开详情弹窗。
2. 表格内编辑、保存、提交全流程。

这对应真实迁移项目中的同一套 Playwright 用例分别驱动旧版与新版、仅切换 `baseURL` 的验证方式。


### 针对迁移计划页的自动化测试

`tests/e2e/migration-plan.spec.ts` 包含 4 个示例：

1. 进入 `/#/migration-plan`，点击编辑，修改阶段名称并保存。
2. 一次修改阶段、目标、状态、进度、备注，然后提交所有修改。
3. 清空必填字段后保存，断言校验失败并阻止保存。
4. 新增一行，在表格内修改并保存。

直接运行（Playwright 会自动在 4173 端口启动 dev server）：

```bash
npm run test:e2e:plan
```

如果你已经手动开着 `http://127.0.0.1:5173`，想让测试直接打这个地址：

```powershell
$env:E2E_BASE_URL='http://127.0.0.1:5173'
npm run test:e2e:plan
```

Windows CMD：

```bat
set E2E_BASE_URL=http://127.0.0.1:5173
npm run test:e2e:plan
```

想看浏览器一步步执行：

```bash
npm run test:e2e:headed
```

本 Demo 已配置为使用本机安装的 Google Chrome（`channel: 'chrome'`），无需下载 Playwright 浏览器。

如果本机没有 Chrome，可以改回 Playwright 自带浏览器并执行 `npx playwright install chromium`。