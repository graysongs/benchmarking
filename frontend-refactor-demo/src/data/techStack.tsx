import {
  ApiOutlined,
  AppstoreOutlined,
  BlockOutlined,
  CodeOutlined,
  DeploymentUnitOutlined,
  ExperimentOutlined,
  FileTextOutlined,
  FundProjectionScreenOutlined,
  SafetyCertificateOutlined,
  TableOutlined,
  ThunderboltOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import type { ReactNode } from 'react';

export type TechCategory =
  | '运行时与构建'
  | '界面与交互'
  | '状态与数据'
  | '质量与测试'
  | 'AI 重构工具链';

export type TechBadge = '首推' | '按需' | '可选';

export interface TechItem {
  id: string;
  name: string;
  category: TechCategory;
  license: string;
  badge: TechBadge;
  summary: string;
  role: string;
  details: string[];
  icon: ReactNode;
}

export const TECH_CATEGORIES: TechCategory[] = [
  '运行时与构建',
  '界面与交互',
  '状态与数据',
  '质量与测试',
  'AI 重构工具链',
];

export const TECH_STACK: TechItem[] = [
  {
    id: 'react-ts',
    name: 'React 18 + TypeScript strict',
    category: '运行时与构建',
    license: 'MIT',
    badge: '首推',
    summary:
      '当前 AI 编码工具训练语料最丰富的组件化运行时；strict 模式让 AI 生成的迁移代码有更清晰的编译期边界。',
    role: '承载页面与组件组合逻辑，作为新系统的视图层。',
    details: [
      'React 18+ 的生态和语料规模最大，Cursor、Copilot、Claude 等工具对 React + TypeScript 的生成质量最稳定。',
      'TypeScript strict 让路由参数、API 响应、表格列定义、表单字段等在编译期被约束，AI 产物更容易审查。',
      'MIT 协议，商用不需要支付框架授权费用，后续招聘和社区方案选择面也最大。',
      '纯内部系统且无 SEO 需求时只使用 SPA 能力，不引入 Next.js，减少不必要的复杂度。',
    ],
    icon: <CodeOutlined />,
  },
  {
    id: 'vite',
    name: 'Vite',
    category: '运行时与构建',
    license: 'MIT',
    badge: '首推',
    summary: '启动快、配置少、插件成熟的现代构建工具，适合 SPA 和演示项目的快速迭代。',
    role: '开发服务器、构建与预览，承接 TypeScript 和 React 的编译。',
    details: [
      '开发环境毫秒级热更新，适合 AI 生成代码后的快速验证循环。',
      '配置简单，团队只需维护少量构建配置，降低重构项目的基础设施成本。',
      'MIT 协议，商用无授权费用。',
    ],
    icon: <ThunderboltOutlined />,
  },
  {
    id: 'router',
    name: 'React Router',
    category: '运行时与构建',
    license: 'MIT',
    badge: '首推',
    summary: '标准 SPA 路由方案，配合反向代理实现按路由灰度切换。',
    role: '管理页面路由与导航，保持旧系统深链接可用。',
    details: [
      '路由边界就是灰度边界：已迁移模块的路径切到新应用，其余路径继续走旧应用。',
      '新系统应保持旧 URL 形态兼容，必要时提供等价重定向。',
      'MIT 协议，生态成熟稳定。',
    ],
    icon: <DeploymentUnitOutlined />,
  },
  {
    id: 'antd',
    name: 'Ant Design 5 + ProComponents',
    category: '界面与交互',
    license: 'MIT',
    badge: '首推',
    summary: '中后台场景最完整的免费组件体系，ProTable/ProForm 对表格内编辑和表单提交支持成熟。',
    role: '布局、表格、表单、弹窗、反馈等企业级 UI 组件。',
    details: [
      'ProTable 可编辑行、ProForm 校验、Drawer/Modal 表单可覆盖大多数后台复杂交互。',
      'AI 对 Ant Design 的训练语料非常充分，组件调用方式的生成质量高。',
      'MIT 协议，商用无授权费用；建议封装公司级 EditableDataGrid 统一行内编辑规范。',
      '本 Demo 的可编辑迁移计划表就是同类交互的最小验证。',
    ],
    icon: <TableOutlined />,
  },
  {
    id: 'ag-grid',
    name: 'AG Grid（可选企业版）',
    category: '界面与交互',
    license: 'MIT / 商业双许可',
    badge: '按需',
    summary: '只有出现 Excel 级表格交互时才评估：批量粘贴、填充柄、区域选择、服务端大数据量等。',
    role: '复杂数据网格的按需补充方案。',
    details: [
      'Community 版为 MIT，基础功能免费；企业功能需要商业许可并按开发者计费。',
      '除非 ProTable 在 POC 中确认无法满足，否则不要为了少数页面引入商业依赖。',
      '如果选择企业版，需要提前完成法务审查和预算评估。',
    ],
    icon: <FundProjectionScreenOutlined />,
  },
  {
    id: 'tanstack-query',
    name: 'TanStack Query',
    category: '状态与数据',
    license: 'MIT',
    badge: '首推',
    summary: '把服务端状态和 UI 状态分开，统一处理缓存、重试、失效和加载态。',
    role: 'API 请求层与服务端状态管理。',
    details: [
      '避免大量 useEffect + setState 的请求样板代码，减少 AI 生成代码中的时序错误。',
      '配合 OpenAPI 生成客户端，可显著降低接口字段和路径被 AI 编造的概率。',
      'MIT 协议，商用无授权费用。',
    ],
    icon: <ApiOutlined />,
  },
  {
    id: 'zustand',
    name: 'Zustand',
    category: '状态与数据',
    license: 'MIT',
    badge: '首推',
    summary: '极简全局状态库，只放登录态、权限、UI 偏好等少量跨组件状态。',
    role: '跨页面的轻量全局状态；本 Demo 用它持久化可编辑计划表。',
    details: [
      'API 面积小，AI 生成的正确率较高，团队维护成本低。',
      '不要把服务端数据放进全局 store，服务端状态交给 TanStack Query。',
      'MIT 协议，商用无授权费用。',
    ],
    icon: <BlockOutlined />,
  },
  {
    id: 'rhf-zod',
    name: 'react-hook-form + zod',
    category: '状态与数据',
    license: 'MIT',
    badge: '首推',
    summary: '非受控表单性能好，zod schema 可以同时用于前端校验和 API 契约描述。',
    role: '复杂表单、抽屉表单、多步骤表单的校验与提交。',
    details: [
      '与 Ant Design Form 互补：简单表格内编辑用 ProTable/Form，复杂跨字段联动用 react-hook-form。',
      'zod schema 可同时生成类型和校验规则，减少重复定义。',
      '两者均为 MIT 协议。',
    ],
    icon: <FileTextOutlined />,
  },
  {
    id: 'vitest',
    name: 'Vitest + Testing Library',
    category: '质量与测试',
    license: 'MIT',
    badge: '首推',
    summary: '与 Vite 同源的单元/组件测试方案，启动快，适合 AI 批量生成测试用例。',
    role: '业务函数、权限逻辑、组件交互的单元与组件测试。',
    details: [
      'AI 迁移模块必须配套单测，且断言应来自已确认的业务规则清单。',
      'Testing Library 按用户视角查询元素，避免测试绑定实现细节。',
      '两者均为 MIT 协议。',
    ],
    icon: <ExperimentOutlined />,
  },
  {
    id: 'playwright',
    name: 'Playwright',
    category: '质量与测试',
    license: 'Apache-2.0',
    badge: '首推',
    summary: '同一套端到端用例分别驱动旧版与新版，仅切换 baseURL，保证行为一致。',
    role: '黄金 E2E、截图基线、表格表单专项验证、灰度前验收。',
    details: [
      '用例只断言用户可见行为和 URL/API 契约，不依赖旧系统 DOM 结构。',
      '复杂表格至少覆盖：新增、行内编辑、校验失败、部分保存失败、权限禁用、未保存离开提示。',
      'Apache-2.0 协议，商用友好。',
    ],
    icon: <SafetyCertificateOutlined />,
  },
  {
    id: 'ai-rules',
    name: 'AI 迁移规则包',
    category: 'AI 重构工具链',
    license: '工程约定',
    badge: '首推',
    summary: 'CLAUDE.md / Cursor Rules / OpenAPI 生成客户端，把规范固化到每一次 AI 生成中。',
    role: '约束 AI 的目录结构、组件映射、API 调用、测试要求和禁止事项。',
    details: [
      '每次迁移的输入包包含：旧模块源码、路由、API 契约、黄金 E2E 用例、组件映射表。',
      '规则中明确：不得改变 URL、不得改变用户可见文案和流程、每个模块必须附测试。',
      'OpenAPI 生成客户端可以防止 AI 编造接口路径和字段。',
    ],
    icon: <ToolOutlined />,
  },
  {
    id: 'micro-frontend',
    name: '微前端过渡外壳',
    category: 'AI 重构工具链',
    license: 'MIT',
    badge: '可选',
    summary: 'single-spa / qiankun / Module Federation 默认不引入；需要临时嵌入旧页面时再按需评估。',
    role: '可选的过渡期外壳，不是长期目标架构。',
    details: [
      '中型页面规模优先使用 Nginx/网关按路由切流，维护成本更低。',
      '如果必须在新外壳中临时展示旧模块，可先用 iframe 或 Web Component 包装。',
      '只在多团队、多应用长期并存等场景下才评估完整微前端方案。',
    ],
    icon: <AppstoreOutlined />,
  },
];
