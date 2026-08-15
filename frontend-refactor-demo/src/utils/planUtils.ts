import type { MigrationItem, MigrationStatus } from '../store/useMigrationStore';

export const STATUS_META: Record<MigrationStatus, { label: string; color: string }> = {
  pending: { label: '待开始', color: 'default' },
  active: { label: '进行中', color: 'processing' },
  canary: { label: '灰度中', color: 'warning' },
  done: { label: '已完成', color: 'success' },
};

export function createId(): string {
  if (typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  return `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createMigrationItem(overrides?: Partial<MigrationItem>): MigrationItem {
  return {
    id: createId(),
    phase: '',
    goal: '',
    status: 'pending',
    progress: 0,
    note: '',
    ...overrides,
  };
}

export interface PlanDiff {
  changed: number;
  added: number;
  removed: number;
}

export function summarizeDiff(current: MigrationItem[], baseline: MigrationItem[]): PlanDiff {
  const currentIds = new Set(current.map((item) => item.id));
  const baselineById = new Map(baseline.map((item) => [item.id, item]));

  const removed = baseline.filter((item) => !currentIds.has(item.id)).length;
  const added = current.filter((item) => !baselineById.has(item.id)).length;
  const changed = current.filter((item) => {
    const base = baselineById.get(item.id);
    if (!base) {
      return false;
    }
    return (
      base.phase !== item.phase ||
      base.goal !== item.goal ||
      base.status !== item.status ||
      Number(base.progress) !== Number(item.progress) ||
      (base.note ?? '') !== (item.note ?? '')
    );
  }).length;

  return { changed, added, removed };
}

export function getCompletionRate(items: MigrationItem[]): number {
  if (items.length === 0) {
    return 0;
  }
  return Math.round((items.filter((item) => item.status === 'done').length / items.length) * 100);
}

export function getAverageProgress(items: MigrationItem[]): number {
  if (items.length === 0) {
    return 0;
  }
  return Math.round(
    items.reduce((total, item) => total + Number(item.progress), 0) / items.length,
  );
}
