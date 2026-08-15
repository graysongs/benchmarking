import { describe, expect, it } from 'vitest';
import {
  createMigrationItem,
  getAverageProgress,
  getCompletionRate,
  summarizeDiff,
} from './planUtils';
import type { MigrationItem } from '../store/useMigrationStore';

function makeItem(overrides: Partial<MigrationItem>): MigrationItem {
  return {
    id: 'id-1',
    phase: '阶段一',
    goal: '目标一',
    status: 'pending',
    progress: 0,
    note: '备注一',
    ...overrides,
  };
}

describe('createMigrationItem', () => {
  it('生成唯一 id 并合并默认值', () => {
    const first = createMigrationItem();
    const second = createMigrationItem();
    expect(first.id).toBeTruthy();
    expect(second.id).toBeTruthy();
    expect(first.id).not.toBe(second.id);
    expect(first.status).toBe('pending');
  });

  it('支持覆盖默认字段', () => {
    const item = createMigrationItem({ phase: '试点迁移', progress: 20 });
    expect(item.phase).toBe('试点迁移');
    expect(item.progress).toBe(20);
  });
});

describe('summarizeDiff', () => {
  it('识别新增、删除和变更行', () => {
    const baseline = [makeItem({ id: 'a' }), makeItem({ id: 'b', phase: '旧阶段' })];
    const current = [
      makeItem({ id: 'a', progress: 30 }),
      makeItem({ id: 'b', phase: '新阶段' }),
      makeItem({ id: 'c' }),
    ];

    expect(summarizeDiff(current, baseline)).toEqual({
      changed: 2,
      added: 1,
      removed: 0,
    });
  });

  it('识别删除行', () => {
    const baseline = [makeItem({ id: 'a' }), makeItem({ id: 'b' })];
    const current = [makeItem({ id: 'a' })];

    expect(summarizeDiff(current, baseline)).toEqual({
      changed: 0,
      added: 0,
      removed: 1,
    });
  });
});

describe('plan statistics', () => {
  it('计算完成率和平均进度', () => {
    const items = [
      makeItem({ id: 'a', status: 'done', progress: 100 }),
      makeItem({ id: 'b', status: 'active', progress: 50 }),
    ];

    expect(getCompletionRate(items)).toBe(50);
    expect(getAverageProgress(items)).toBe(75);
  });

  it('空计划返回 0', () => {
    expect(getCompletionRate([])).toBe(0);
    expect(getAverageProgress([])).toBe(0);
  });
});
