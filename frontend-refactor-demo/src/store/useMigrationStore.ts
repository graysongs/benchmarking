import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type MigrationStatus = 'pending' | 'active' | 'canary' | 'done';

export interface MigrationItem {
  id: string;
  phase: string;
  goal: string;
  status: MigrationStatus;
  progress: number;
  note?: string;
}

export type MigrationItemPatch = Partial<Omit<MigrationItem, 'id'>>;

export const BASELINE_PLAN: MigrationItem[] = [
  {
    id: 'phase-01',
    phase: '资产盘点与技术验证',
    goal: '完成路由、依赖与交互组件清单，并在最复杂表格页面完成 POC。',
    status: 'active',
    progress: 35,
    note: '优先验证表格内编辑与提交，释放最大技术风险。',
  },
  {
    id: 'phase-02',
    phase: '测试基线与新骨架搭建',
    goal: '用 Playwright 录制核心流程，完成登录、权限、布局、路由与 API 层。',
    status: 'pending',
    progress: 0,
    note: '黄金 E2E 必须先于批量迁移存在。',
  },
  {
    id: 'phase-03',
    phase: '试点模块迁移',
    goal: '选择一至两个高频模块完成迁移，并通过同一套 E2E 用例。',
    status: 'pending',
    progress: 0,
    note: '试点通过后再复制流水线。',
  },
  {
    id: 'phase-04',
    phase: '批量迁移与灰度',
    goal: '按路由切流，逐模块通过验收后进入灰度发布。',
    status: 'pending',
    progress: 0,
    note: '灰度维度可按用户、组织、路由或比例。',
  },
  {
    id: 'phase-05',
    phase: '全量切换与旧系统下线',
    goal: '保留只读回滚环境，稳定运行后清理旧框架依赖。',
    status: 'pending',
    progress: 0,
    note: '全量稳定后再执行清理，避免不可逆操作。',
  },
];

interface MigrationStore {
  items: MigrationItem[];
  baseline: MigrationItem[];
  updateItem: (id: string, patch: MigrationItemPatch) => void;
  addItem: (item: MigrationItem) => void;
  removeItem: (id: string) => void;
  reset: () => void;
}

export const useMigrationStore = create<MigrationStore>()(
  persist(
    (set) => ({
      items: BASELINE_PLAN.map((item) => ({ ...item })),
      baseline: BASELINE_PLAN.map((item) => ({ ...item })),
      updateItem: (id, patch) =>
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, ...patch, id } : item)),
        })),
      addItem: (item) => set((state) => ({ items: [...state.items, item] })),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      reset: () => set(() => ({ items: BASELINE_PLAN.map((item) => ({ ...item })) })),
    }),
    {
      name: 'frontend-refactor-demo-plan',
      version: 1,
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
