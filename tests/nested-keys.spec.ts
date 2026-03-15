import { expect, test } from '@playwright/test';

test.describe('Nested Keys Support', () => {
  test('should render data from nested properties (City)', async ({ page }) => {
    // Navigate to vanilla demo where we added City column (address.city)
    await page.goto('/vanilla');

    // Verify City column header is visible
    await expect(page.getByRole('columnheader', { name: 'City' })).toBeVisible();

    // Verify nested data from mock is rendered
    // Use .first() because multiple rows might have the same city
    await expect(page.getByText('Amsterdam').first()).toBeVisible();
    await expect(page.getByText('Rotterdam').first()).toBeVisible();
  });

  test('should support nested keys in sorting (City)', async ({ page }) => {
    const requestedUrls: string[] = [];
    page.on('request', (req) => requestedUrls.push(req.url()));

    await page.goto('/vanilla?bypassMock=true'); // bypass mock to see actual outgoing request params

    // Click to sort
    await page.getByText('City', { exact: true }).click();

    // Verify URL param
    await expect(page).toHaveURL(/.*v_sort=address.city,asc.*/);

    // Verify API request param
    const apiRequest = requestedUrls.find(
      (url) => url.includes('/api/users') && url.includes('sort=address.city,asc'),
    );
    expect(apiRequest).toBeDefined();
  });

  test('should support nested keys in filtering (City)', async ({ page }) => {
    const requestedUrls: string[] = [];
    page.on('request', (req) => requestedUrls.push(req.url()));

    await page.goto('/vanilla?bypassMock=true');

    // Open filter
    await page.locator('.tb-grid-header-cell:has-text("City") .filter-btn').click();
    await page.getByPlaceholder('Search...').fill('Amster');
    await page.getByRole('button', { name: 'Apply' }).click();

    // Verify URL param
    await expect(page).toHaveURL(/.*v_f_address.city=Amster.*/);

    // Verify API request param
    const apiRequest = requestedUrls.find(
      (url) => url.includes('/api/users') && url.includes('address.city.contains=Amster'),
    );
    expect(apiRequest).toBeDefined();
  });
});
