import { expect, test } from '@playwright/test';

test('技术栈卡片点击后展示详情', async ({ page }) => {
  await page.goto('/#/tech-stack');

  await expect(page.getByRole('heading', { name: '技术栈详解' })).toBeVisible();

  const card = page.getByTestId('tech-card-react-ts');
  await card.click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText('React 18 + TypeScript strict', { exact: true })).toBeVisible();
  await expect(dialog.getByText('在方案中的角色', { exact: true })).toBeVisible();

  await dialog.getByRole('button', { name: '关闭' }).click();
  await expect(dialog).not.toBeVisible();
});

test('迁移计划表支持表格内编辑与提交', async ({ page }) => {
  await page.goto('/#/migration-plan');

  await expect(page.getByRole('heading', { name: '可编辑迁移计划表' })).toBeVisible();

  await page.getByTestId('edit-phase-01').click();
  await page.locator('#input-phase-phase-01').fill('资产盘点与技术验证（已更新）');
  await page.getByTestId('save-phase-01').click();

  await expect(page.getByText('资产盘点与技术验证（已更新）', { exact: true })).toBeVisible();

  await page.getByTestId('submit-all').click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText('提交预览', { exact: true })).toBeVisible();
  await expect(dialog.getByText(/资产盘点与技术验证（已更新）/)).toBeVisible();

  await dialog.getByRole('button', { name: '确认提交' }).click();
  await expect(page.getByText('已模拟提交当前计划', { exact: true })).toBeVisible();
});
