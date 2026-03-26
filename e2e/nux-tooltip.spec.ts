import {test, expect} from '@playwright/test';

test.describe('NUX Tooltip', () => {
  test('should appear on first visit, dismiss on click, and persist dismissal', async ({
    page,
  }) => {
    page.on('console', msg => console.log(`BROWSER MSG: ${msg.text()}`));
    page.on('pageerror', err => console.log(`BROWSER ERROR: ${err}`));

    await page.goto('/');

    const tooltip = page.getByTestId('nux-tooltip');
    const dismissBtn = page.getByTestId('nux-tooltip-dismiss');

    // 1. Tooltip appears on first visit
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('Click ♥ to configure content filters');

    // 2. Click dismiss button
    await dismissBtn.click({force: true});
    await expect(tooltip).toBeHidden();

    // 3. Reload page - should not reappear
    await page.goto('/', {waitUntil: 'domcontentloaded'});
    await expect(tooltip).toBeHidden({timeout: 2000});
  });

  test('should dismiss when discovering the heart icon organically', async ({
    page,
  }) => {
    await page.goto('/');

    const tooltip = page.getByTestId('nux-tooltip');
    await expect(tooltip).toBeVisible();

    // Click the heart button itself
    await page.getByTestId('heart-button').click({force: true});

    // Tooltip should dismiss
    await expect(tooltip).toBeHidden();

    // Dropdown should be open
    await expect(page.getByText('Content filter preferences')).toBeVisible();

    // Reload page - should not reappear
    await page.goto('/', {waitUntil: 'domcontentloaded'});
    await expect(tooltip).toBeHidden({timeout: 2000});
  });
});
