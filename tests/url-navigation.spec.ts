import { expect, test } from '@playwright/test';

test.describe('Grid URL & Navigation', () => {
  test('should update grid state and trigger API when navigating back/forward', async ({
    page,
  }) => {
    const requests: string[] = [];
    page.on('request', (req) => {
      if (req.url().includes('/api/users')) {
        requests.push(req.url());
      }
    });

    // 1. Initial Page Load
    await page.route('**/api/users*', async (route) => {
      await route.fulfill({
        json: {
          content: [],
          page: { size: 10, totalElements: 50, totalPages: 5, number: 0 },
        },
      });
    });

    await page.goto('/vanilla?bypassMock=true');
    await expect(page).toHaveURL(/.*vanilla.*/);

    // Clear initial load requests
    requests.length = 0;

    // 2. Change page to 2
    await page.getByTitle('Next').click();
    await expect(page).toHaveURL(/.*v_page=1.*/);

    // Check that API request for page 1 was made
    expect(requests.find((u) => u.includes('page=1'))).toBeDefined();
    requests.length = 0;

    // 3. Apply a filter
    await page.locator('.tb-grid-header-cell:has-text("Name") .filter-btn').click();
    await page.getByPlaceholder('Search...').fill('Alice');
    await page.getByRole('button', { name: 'Apply' }).click();

    await expect(page).toHaveURL(/.*v_f_name=Alice.*/);
    // When filtering, page should reset to 0
    await expect(page).not.toHaveURL(/.*v_page=1.*/);

    expect(requests.find((u) => u.includes('name.contains=Alice'))).toBeDefined();
    requests.length = 0;

    // 4. Navigate BACK (should go back to Page 2, no filter)
    const backResponse1 = page.waitForResponse((r) => r.url().includes('page=1'));
    await page.goBack();
    await backResponse1;

    await expect(page).toHaveURL(/.*v_page=1.*/);
    await expect(page).not.toHaveURL(/.*v_f_name=Alice.*/);
    requests.length = 0;

    // 5. Navigate BACK again (should go back to Page 1, no filter)
    const backResponse0 = page.waitForResponse((r) => r.url().includes('page=0'));
    await page.goBack();
    await backResponse0;

    await expect(page).not.toHaveURL(/.*v_page=1.*/);
    requests.length = 0;

    // 6. Navigate FORWARD (should go back to Page 2)
    const forwardResponse1 = page.waitForResponse((r) => r.url().includes('page=1'));
    await page.goForward();
    await forwardResponse1;

    await expect(page).toHaveURL(/.*v_page=1.*/);
    requests.length = 0;

    // 7. Navigate FORWARD again (should go back to Page 1 + Filter Alice)
    const forwardResponseFilter = page.waitForResponse((r) =>
      r.url().includes('name.contains=Alice'),
    );
    await page.goForward();
    await forwardResponseFilter;

    await expect(page).toHaveURL(/.*v_f_name=Alice.*/);
  });

  test('should persist multiple selections in multiselect filter dialog', async ({ page }) => {
    await page.route('**/api/users*', async (route) => {
      await route.fulfill({
        json: { content: [], page: { size: 10, totalElements: 0, totalPages: 0, number: 0 } },
      });
    });

    await page.goto('/vanilla?bypassMock=true');

    // 1. Open 'Role' filter (which has options)
    const roleHeader = page.locator('.tb-grid-header-cell:has-text("Role")');
    await roleHeader.locator('.filter-btn').click();

    // 2. Select 'Admin' and 'User'
    await page.getByLabel('Admin').check();
    await page.getByLabel('User').check();
    await page.getByRole('button', { name: 'Apply' }).click();

    // 3. Verify URL contains both (comma-separated)
    await expect(page).toHaveURL(/.*v_f_role=Admin,User.*/);

    // 4. Re-open the filter dialog
    await roleHeader.locator('.filter-btn').click();

    // 5. Verify both are still checked in the UI
    await expect(page.getByLabel('Admin')).toBeChecked();
    await expect(page.getByLabel('User')).toBeChecked();

    // 6. Navigate back and verify state restoration
    await page.getByRole('button', { name: 'Apply' }).click(); // Close
    await page.goto('/vanilla?bypassMock=true'); // Reset
    await page.goBack(); // Should restore Admin,User

    await expect(page).toHaveURL(/.*v_f_role=Admin,User.*/);

    await roleHeader.locator('.filter-btn').click();
    await expect(page.getByLabel('Admin')).toBeChecked();
    await expect(page.getByLabel('User')).toBeChecked();
  });
});
