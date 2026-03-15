import { expect, test } from '@playwright/test';

test.describe('Spring Data Grid Integration', () => {
  test('should render data from a mocked Spring Data PagedModel', async ({ page }) => {
    // Mock the Spring Data backend call
    await page.route('**/api/users*', async (route) => {
      const json = {
        content: [
          { id: 1, name: 'Spring User 1', email: 'user1@spring.io' },
          { id: 2, name: 'Spring User 2', email: 'user2@spring.io' },
        ],
        page: {
          size: 10,
          totalElements: 2,
          totalPages: 1,
          number: 0,
        },
      };
      await route.fulfill({ json });
    });

    await page.goto('/vanilla?bypassMock=true');

    // Verify headers
    await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Email' })).toBeVisible();

    // Verify mocked data
    await expect(page.getByText('Spring User 1')).toBeVisible();
    await expect(page.getByText('user1@spring.io')).toBeVisible();
    await expect(page.getByText('Spring User 2')).toBeVisible();
  });

  test('should trigger a new request when sorting is changed', async ({ page }) => {
    const requestedUrls: string[] = [];
    page.on('request', (req) => requestedUrls.push(req.url()));

    // Initial mock for page load
    await page.route('**/api/users*', async (route) => {
      await route.fulfill({
        json: {
          content: [],
          page: { size: 10, totalElements: 0, totalPages: 0, number: 0 },
        },
      });
    });

    await page.goto('/vanilla?bypassMock=true');

    // Setup listener for the NEXT request triggered by sorting
    await page.getByText('Name', { exact: true }).click();

    // Wait for the URL to contain the sort param (via Router)
    await expect(page).toHaveURL(/.*v_sort=name,asc.*/);

    // Verify that an API request was made with the correct parameters
    const apiRequest = requestedUrls.find(
      (url) => url.includes('/api/users') && url.includes('sort=name,asc'),
    );
    expect(apiRequest).toBeDefined();

    // Setup listener for the DESC request
    await page.getByText('Name', { exact: true }).click();
    await expect(page).toHaveURL(/.*v_sort=name,desc.*/);

    const apiRequestDesc = requestedUrls.find(
      (url) => url.includes('/api/users') && url.includes('sort=name,desc'),
    );
    expect(apiRequestDesc).toBeDefined();

    // Verify the .active class is applied to the sort button
    const sortBtn = page.locator('.tb-grid-header-cell:has-text("Name") .sort-btn');
    await expect(sortBtn).toHaveClass(/active/);
  });

  test('should trigger a new request when filtering is applied', async ({ page }) => {
    const requestedUrls: string[] = [];
    page.on('request', (req) => requestedUrls.push(req.url()));

    // Initial mock for page load
    await page.route('**/api/users*', async (route) => {
      await route.fulfill({
        json: {
          content: [],
          page: { size: 10, totalElements: 0, totalPages: 0, number: 0 },
        },
      });
    });

    await page.goto('/vanilla?bypassMock=true');

    // Open filter dropdown for 'Name'
    await page.locator('.tb-grid-header-cell:has-text("Name") .filter-btn').click();

    // Type in the filter input
    await page.getByPlaceholder('Search...').fill('John');

    // Apply filter
    await page.getByRole('button', { name: 'Apply' }).click();

    // Wait for the URL to contain the filter param
    await expect(page).toHaveURL(/.*v_f_name=John.*/);

    // Verify API request
    const apiRequest = requestedUrls.find(
      (url) => url.includes('/api/users') && url.includes('name.contains=John'),
    );
    expect(apiRequest).toBeDefined();
  });

  test('should show error overlay when API fails', async ({ page }) => {
    // Mock a 500 error
    await page.route('**/api/users*', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Internal Server Error' }),
      });
    });

    await page.goto('/vanilla?bypassMock=true');

    // Verify error overlay is visible
    const errorOverlay = page.locator('.tb-error-overlay');
    await expect(errorOverlay).toBeVisible();

    // Verify default error message from TB_GRID_DEFAULT_TRANSLATIONS
    await expect(page.getByText('An error occurred while loading data.')).toBeVisible();
  });
});
