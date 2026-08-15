/**
 * 行业趋势与数据支撑（调研时间：2026-08）
 * 数据来源：
 * - npm 官方下载量 API（对比 2025-08 与 2026-07）
 * - State of JavaScript 2025（13,002 受访者）
 * - Stack Overflow Developer Survey 2025（约 6 万受访者）
 * - GitHub Trending（2026-08 抓取）
 */

export interface NpmTrend {
  name: string;
  category: string;
  yearAgo: number;
  now: number;
  growth: number;
  tier: 'boom' | 'fast' | 'steady';
}

export interface AiMetric {
  value: string;
  label: string;
  hint: string;
}

export interface TrendingRepo {
  name: string;
  category: string;
  note: string;
}

export interface TrendMapping {
  trend: string;
  evidence: string;
  choice: string;
}

export interface SourceItem {
  name: string;
  url: string;
  note: string;
}

/** 过去一年 npm 月下载量对比（按增速降序，growth 为整数百分比） */
export const NPM_TRENDS: NpmTrend[] = [
  { name: 'rolldown', category: '构建工具', yearAgo: 2946761, now: 345775568, growth: 11634, tier: 'boom' },
  { name: 'motion', category: '动画', yearAgo: 7510851, now: 68986668, growth: 818, tier: 'boom' },
  { name: 'bun', category: '运行时', yearAgo: 1428518, now: 11909682, growth: 734, tier: 'boom' },
  { name: 'astro', category: '元框架', yearAgo: 3062965, now: 17480302, growth: 471, tier: 'boom' },
  { name: 'zod', category: '类型校验', yearAgo: 177569000, now: 1002699955, growth: 465, tier: 'boom' },
  { name: 'vitest', category: '测试', yearAgo: 61602787, now: 347427797, growth: 464, tier: 'boom' },
  { name: 'tailwindcss', category: '样式', yearAgo: 97628638, now: 487735181, growth: 400, tier: 'boom' },
  { name: '@tanstack/react-query', category: '数据请求', yearAgo: 55298073, now: 253740234, growth: 359, tier: 'fast' },
  { name: '@playwright/test', category: '测试', yearAgo: 46243324, now: 204135164, growth: 341, tier: 'fast' },
  { name: 'zustand', category: '状态管理', yearAgo: 45385147, now: 198546234, growth: 337, tier: 'fast' },
  { name: 'solid-js', category: '框架', yearAgo: 3345197, now: 13287731, growth: 297, tier: 'fast' },
  { name: 'next', category: '元框架', yearAgo: 60323221, now: 212404572, growth: 252, tier: 'fast' },
  { name: '@sveltejs/kit', category: '元框架', yearAgo: 2777395, now: 9502136, growth: 242, tier: 'fast' },
  { name: 'react', category: '框架', yearAgo: 194592673, now: 663454644, growth: 241, tier: 'fast' },
  { name: 'react-router', category: '路由', yearAgo: 84823757, now: 203490471, growth: 140, tier: 'steady' },
  { name: 'alpinejs', category: '轻量库', yearAgo: 1274359, now: 2606360, growth: 105, tier: 'steady' },
  { name: 'nuxt', category: '元框架', yearAgo: 3903577, now: 7443425, growth: 91, tier: 'steady' },
  { name: 'svelte', category: '框架', yearAgo: 11883635, now: 21473163, growth: 81, tier: 'steady' },
  { name: 'webpack', category: '构建工具', yearAgo: 133284854, now: 221168061, growth: 66, tier: 'steady' },
  { name: 'vue', category: '框架', yearAgo: 35686275, now: 58026042, growth: 63, tier: 'steady' },
  { name: '@remix-run/react', category: '元框架', yearAgo: 1967806, now: 3203040, growth: 63, tier: 'steady' },
  { name: 'vite', category: '构建工具', yearAgo: 394535888, now: 639516066, growth: 62, tier: 'steady' },
  { name: '@angular/core', category: '框架', yearAgo: 17313223, now: 23949355, growth: 38, tier: 'steady' },
];

/** AI 时代的关键量化指标 */
export const AI_METRICS: AiMetric[] = [
  { value: '29%', label: '代码由 AI 生成', hint: '2025 年底，一年前为 20%（State of JS 2025）' },
  { value: '30%', label: '开发者手写代码减少', hint: '相比 12 个月前写得更少（State of JS 2025）' },
  { value: '42%', label: '用上 AI 生成 UI 工具', hint: 'v0 / Lovable 等，2024 年不足 5%（State of JS 2025）' },
  { value: '84%', label: '开发者使用 AI 工具', hint: '2025 年为 76%（Stack Overflow 2025）' },
  { value: '46%', label: '不信任 AI 输出准确性', hint: '信任的仅 33%；仅 3.1% 高度信任（Stack Overflow 2025）' },
];

/** GitHub Trending 现状（2026-08，TypeScript 月度榜代表项目） */
export const TRENDING_REPOS: TrendingRepo[] = [
  { name: 'QwenLM/qwen-code', category: '编码 Agent', note: '开源终端 AI 编码 Agent（TypeScript）' },
  { name: 'MoonshotAI/kimi-code', category: '编码 Agent', note: 'Kimi Code CLI，下一代表面 Agent（TypeScript）' },
  { name: 'cursor/plugins', category: 'AI 编辑器生态', note: 'Cursor 插件规范与官方插件（TypeScript）' },
  { name: 'different-ai/openwork', category: 'Agent 协作', note: 'Claude Cowork 的开源替代（TypeScript）' },
  { name: 'TencentCloud/TencentDB-Agent-Memory', category: 'Agent 基础设施', note: 'AI Agent 团队级记忆中枢（TypeScript）' },
  { name: 'stablyai/orca', category: 'Agent 工具', note: '并行编码 Agent 的 ADE（TypeScript）' },
  { name: 'diegosouzapw/OmniRoute', category: 'AI 基础设施', note: '开源 AI 网关，339 家模型提供商（TypeScript）' },
  { name: 'earendil-works/pi', category: 'Agent 工具', note: '统一 LLM API 与编码 Agent CLI（TypeScript）' },
];

export const TRENDING_SUMMARY =
  'TypeScript 月度榜 20 个位置几乎被 AI 编码工具 / Agent 生态占满，语言清一色 TypeScript。' +
  '结论：新的开源项目都以 TypeScript 起步、都面向 AI 工作流——这就是当下开源趋势的定义。';

/** AI 变化 → 行业应对 → 本方案选型 */
export const TREND_MAPPINGS: TrendMapping[] = [
  {
    trend: 'AI 生成代码的语料集中在 React + TS',
    evidence: 'State of JS：AI 工具生成 React 代码最熟练，进一步强化其主导地位',
    choice: 'React 18 + TypeScript strict',
  },
  {
    trend: 'AI 时代类型安全是刚需',
    evidence: 'zod 月下载 +465%；SoJS 结论作者断言 "TypeScript has won"',
    choice: 'TypeScript strict + Zod',
  },
  {
    trend: '手工配置被抛弃，零配置 CLI 成主流',
    evidence: 'Vite 满意度 +55 vs Webpack -23；Rolldown 一年 +116 倍，2026 成为 Vite 引擎',
    choice: 'Vite 5 构建链',
  },
  {
    trend: 'AI 生成的代码必须验证',
    evidence: 'vitest +464%、Playwright +341%；46% 开发者不信任 AI 输出',
    choice: 'Vitest 单测 + Playwright E2E 基线',
  },
  {
    trend: 'AI 生成 UI 依赖成熟组件库',
    evidence: 'Generative UI 工具使用率 <5% → 42%，组件消费爆发',
    choice: 'Ant Design 5（成熟组件库）',
  },
  {
    trend: '轻量、可预测的状态管理',
    evidence: 'zustand 月下载 +337%，超越传统重型状态方案',
    choice: 'Zustand',
  },
];

export const SOURCES: SourceItem[] = [
  { name: 'State of JavaScript 2025', url: 'https://2025.stateofjs.com', note: '13,002 受访者；AI 代码占比、Generative UI、工具满意度' },
  { name: 'Stack Overflow Developer Survey 2025', url: 'https://survey.stackoverflow.co/2025', note: '约 6 万受访者；84% 使用 AI、信任度数据' },
  { name: 'npm 官方下载量 API', url: 'https://api.npmjs.org/downloads', note: '2025-08 与 2026-07 月度下载量对比' },
  { name: 'GitHub Trending', url: 'https://github.com/trending', note: '2026-08 抓取 TypeScript 月度榜' },
  { name: 'State of React 2025', url: 'https://2025.stateofreact.com', note: '官方引言：AI 依赖现有代码库，React 可能成为 "forever framework"' },
];
