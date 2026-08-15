import { expect, test } from '@playwright/test';

/**
 * 迁移计划页 E2E 示例：
 * 对应真实项目中的「同一套 Playwright 用例，只切换 baseURL 验证新旧系统」。
 *
 * 运行本文件：
 *   npx playwright test tests/e2e/migration-plan.spec.ts
 *
 * 如果 5173 端口已经有 dev server：
 *   $env:E2E_BASE_URL='http://127.0.0.1:5173'
 *   npx playwright test tests/e2e/migration-plan.spec.ts
 */

test.beforeEach(async ({ page }) => {
  await page.goto('/#/migration-plan');
  await expect(page.getByRole('heading', { name: '可编辑迁移计划表' })).toBeVisible();
});

test('示例 1：进入页面后，编辑一行并保存', async ({ page }) => {
  // 1. 点击第一行的“编辑”
  await page.getByTestId('edit-phase-01').click();

  // 2. 修改“阶段”列
  const phaseInput = page.locator('#input-phase-phase-01');
  await expect(phaseInput).toBeVisible();
  await phaseInput.fill('资产盘点与技术验证（已更新）');

  // 3. 点击“保存”
  await page.getByTestId('save-phase-01').click();

  // 4. 断言：表格里出现新文案，且出现保存成功提示
  await expect(
    page.locator('.ant-table-tbody').getByText('资产盘点与技术验证（已更新）', { exact: true }),
  ).toBeVisible();
  await expect(page.getByText('该行修改已在表格内保存', { exact: true })).toBeVisible();
});

test('示例 2：一次修改多个字段，然后提交所有修改', async ({ page }) => {
  await page.getByTestId('edit-phase-01').click();

  // 修改阶段、目标
  await page.locator('#input-phase-phase-01').fill('资产盘点与技术验证（E2E）');
  await page.locator('#input-goal-phase-01').fill('完成自动化验收并记录测试基线。');

  // 修改状态：点击 Select 的选择框本身，而不是内部隐藏的搜索 input
  await page.locator('.ant-table-row').first().locator('.ant-select-selector').click();
  await page
    .locator('.ant-select-item-option')
    .filter({ hasText: '灰度中' })
    .click();

  // 修改进度
  await page.locator('#input-progress-phase-01').fill('60');

  // 修改备注
  await page.locator('#input-note-phase-01').fill('由 Playwright E2E 自动修改');

  await page.getByTestId('save-phase-01').click();

  // 保存后的单元格断言（限定在表格内，避免命中隐藏的 Select 选项）
  const tableBody = page.locator('.ant-table-tbody');
  await expect(tableBody.getByText('资产盘点与技术验证（E2E）', { exact: true })).toBeVisible();
  await expect(tableBody.getByText('60%', { exact: true })).toBeVisible();
  await expect(tableBody.getByText('灰度中', { exact: true })).toBeVisible();

  // 提交所有修改，并检查提交预览弹窗
  await page.getByTestId('submit-all').click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText('提交预览', { exact: true })).toBeVisible();
  await expect(dialog.getByText(/由 Playwright E2E 自动修改/)).toBeVisible();

  await dialog.getByRole('button', { name: '确认提交' }).click();
  await expect(page.getByText('已模拟提交当前计划', { exact: true })).toBeVisible();
});

test('示例 3：必填校验失败时，不允许保存', async ({ page }) => {
  await page.getByTestId('edit-phase-01').click();

  const phaseInput = page.locator('#input-phase-phase-01');
  await phaseInput.clear();

  await page.getByTestId('save-phase-01').click();

  // 校验错误应显示在单元格内
  await expect(page.getByText('请输入阶段', { exact: true })).toBeVisible();

  // 成功提示不应出现
  await expect(page.getByText('该行修改已在表格内保存', { exact: true })).toHaveCount(0);

  // 取消后恢复为普通单元格
  await page.getByRole('button', { name: '取消' }).click();
  await expect(
    page.locator('.ant-table-tbody').getByText('资产盘点与技术验证', { exact: true }),
  ).toBeVisible();
});

test('示例 4：新增一行，在表格内修改并保存', async ({ page }) => {
  await page.getByTestId('add-row').click();

  // 新行位于表格最后，通过保存按钮的 data-testid 取出该行 id
  const newRow = page.locator('.ant-table-row').last();
  const saveButton = newRow.locator('[data-testid^="save-"]');
  await expect(saveButton).toBeVisible();

  const saveTestId = await saveButton.getAttribute('data-testid');
  if (!saveTestId) {
    throw new Error('未找到新行的保存按钮');
  }
  const rowId = saveTestId.replace('save-', '');

  // 新行默认处于编辑态，直接修改各字段
  await page.locator(`#input-phase-${rowId}`).fill('E2E 新增阶段');
  await page.locator(`#input-goal-${rowId}`).fill('验证新增行与表格内编辑。');
  await page.locator(`#input-progress-${rowId}`).fill('20');
  await page.locator(`#input-note-${rowId}`).fill('该行由自动化测试创建');

  await page.getByTestId(`save-${rowId}`).click();

  const tableBody = page.locator('.ant-table-tbody');
  await expect(tableBody.getByText('E2E 新增阶段', { exact: true })).toBeVisible();
  await expect(tableBody.getByText('20%', { exact: true })).toBeVisible();
  await expect(tableBody.getByText('该行由自动化测试创建', { exact: true })).toBeVisible();
});
