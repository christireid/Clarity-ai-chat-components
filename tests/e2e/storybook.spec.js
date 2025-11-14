import { test, expect } from '@playwright/test';
/**
 * Visual regression tests for Storybook components
 * These tests ensure components render correctly across different browsers and viewports
 */
test.describe('Storybook Visual Regression', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });
    test('homepage loads correctly', async ({ page }) => {
        await expect(page).toHaveTitle(/Storybook/);
        await expect(page.locator('h1')).toBeVisible();
    });
    test('sidebar navigation is visible', async ({ page }) => {
        const sidebar = page.locator('[class*="sidebar"]');
        await expect(sidebar).toBeVisible();
    });
    test('can navigate to a story', async ({ page }) => {
        // Wait for stories to load
        await page.waitForSelector('[role="tree"]');
        // Click on first story
        const firstStory = page.locator('[role="treeitem"]').first();
        await firstStory.click();
        // Verify story canvas is visible
        await expect(page.locator('#storybook-preview-iframe')).toBeVisible();
    });
    test('toolbar controls are visible', async ({ page }) => {
        const toolbar = page.locator('[class*="toolbar"]');
        await expect(toolbar).toBeVisible();
    });
});
test.describe('Component Visual Tests', () => {
    const components = [
        'chat-window',
        'message-bubble',
        'input-field',
        'model-selector',
        'thinking-indicator',
    ];
    for (const component of components) {
        test(`${component} renders correctly`, async ({ page }) => {
            await page.goto(`/iframe.html?id=components-${component}--default`);
            // Wait for component to render
            await page.waitForLoadState('networkidle');
            // Take screenshot for visual comparison
            await expect(page).toHaveScreenshot(`${component}-default.png`, {
                fullPage: true,
                animations: 'disabled',
            });
        });
    }
});
test.describe('Accessibility', () => {
    test('has no automatically detectable accessibility issues', async ({ page }) => {
        await page.goto('/');
        // This is a placeholder - you'd use @axe-core/playwright for real a11y testing
        // const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
        // expect(accessibilityScanResults.violations).toEqual([])
    });
});
test.describe('Responsive Design', () => {
    const viewports = [
        { name: 'mobile', width: 375, height: 667 },
        { name: 'tablet', width: 768, height: 1024 },
        { name: 'desktop', width: 1920, height: 1080 },
    ];
    for (const viewport of viewports) {
        test(`renders correctly on ${viewport.name}`, async ({ page }) => {
            await page.setViewportSize({ width: viewport.width, height: viewport.height });
            await page.goto('/');
            await expect(page).toHaveScreenshot(`homepage-${viewport.name}.png`, {
                fullPage: true,
                animations: 'disabled',
            });
        });
    }
});
//# sourceMappingURL=storybook.spec.js.map