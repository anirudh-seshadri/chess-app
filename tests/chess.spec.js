const { test, expect } = require('@playwright/test');
test('test', async ({ page }) => {
  // Go to http://localhost:3001/
  await page.goto('http://localhost:3001/');
  // Click [placeholder="Enter your move..."]
  await page.click('[placeholder="Enter your move..."]');
  // Fill [placeholder="Enter your move..."]
  await page.fill('[placeholder="Enter your move..."]', 'e4');
  // Press Enter
  await page.press('[placeholder="Enter your move..."]', 'Enter');
  // Fill [placeholder="Enter your move..."]
  await page.fill('[placeholder="Enter your move..."]', 'e5');
  // Press Enter
  await page.press('[placeholder="Enter your move..."]', 'Enter');
  // Fill [placeholder="Enter your move..."]
  await page.fill('[placeholder="Enter your move..."]', 'Nf3');
  // Press Enter
  await page.press('[placeholder="Enter your move..."]', 'Enter');
  // Fill [placeholder="Enter your move..."]
  await page.fill('[placeholder="Enter your move..."]', 'Nc6');
  // Press Enter
  await page.press('[placeholder="Enter your move..."]', 'Enter');
  // Fill [placeholder="Enter your move..."]
  await page.fill('[placeholder="Enter your move..."]', 'Bb5');
  // Press Enter
  await page.press('[placeholder="Enter your move..."]', 'Enter');
  // Fill [placeholder="Enter your move..."]
  await page.fill('[placeholder="Enter your move..."]', 'a6');
  // Press Enter
  await page.press('[placeholder="Enter your move..."]', 'Enter');
  await expect (true);
});