# E2E Testing Documentation

Comprehensive Playwright E2E test suite for the Clarity Chat documentation site.

## Table of Contents

- [Overview](#overview)
- [Test Suites](#test-suites)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

## Overview

This test suite provides comprehensive coverage of:

- **Navigation**: Header, sidebar, breadcrumbs, and routing
- **Search**: Search functionality, keyboard shortcuts, and results
- **DocsAssistant**: AI chat interface, message streaming, and responses
- **Accessibility**: WCAG 2.1 AA compliance with axe-core
- **Visual Regression**: Screenshot comparison to detect UI changes
- **Mobile Responsive**: Testing across different viewports and devices

### Coverage Goals

- 80%+ E2E coverage of critical user paths
- Zero accessibility violations (WCAG 2.1 AA)
- Visual regression baselines for all major pages
- Cross-browser testing (Chromium, Firefox, WebKit)
- Mobile and tablet viewport testing

## Test Suites

### Navigation Tests

**Location**: `e2e/navigation/`

Tests for navigation components:

- `header-navigation.spec.ts`: Main header navigation, logo, and mobile menu
- `sidebar-navigation.spec.ts`: Sidebar expand/collapse, active states
- `breadcrumbs.spec.ts`: Breadcrumb trail, hierarchy, and navigation

**Run**: `npx playwright test e2e/navigation`

### Search Tests

**Location**: `e2e/search/`

Tests for search functionality:

- `search-functionality.spec.ts`: Search modal, results, keyboard shortcuts

**Run**: `npx playwright test e2e/search`

### Chat Tests

**Location**: `e2e/chat/`

Tests for DocsAssistant AI chat:

- `docs-assistant.spec.ts`: Chat interface, messages, streaming, error handling

**Run**: `npx playwright test e2e/chat`

### Accessibility Tests

**Location**: `e2e/accessibility/`

Tests for WCAG 2.1 AA compliance:

- `wcag-compliance.spec.ts`: Automated axe-core testing, keyboard navigation, screen readers

**Run**: `npx playwright test e2e/accessibility`

### Visual Regression Tests

**Location**: `e2e/visual-regression/`

Tests for visual changes:

- `page-screenshots.spec.ts`: Full-page screenshots, component screenshots, responsive views

**Run**: `npx playwright test e2e/visual-regression`

## Running Tests

### Prerequisites

```bash
# Install dependencies
pnpm install

# Install Playwright browsers
pnpm exec playwright install --with-deps
```

### Run All Tests

```bash
# Run all E2E tests
npx playwright test --config=playwright.e2e.config.ts

# Run with UI mode
npx playwright test --ui

# Run in headed mode (see browser)
npx playwright test --headed
```

### Run Specific Test Suite

```bash
# Navigation tests only
npx playwright test e2e/navigation

# Accessibility tests only
npx playwright test e2e/accessibility

# Single test file
npx playwright test e2e/navigation/header-navigation.spec.ts
```

### Run Specific Browser

```bash
# Chromium only
npx playwright test --project=chromium

# All browsers
npx playwright test --project=chromium --project=firefox --project=webkit
```

### Run Mobile Tests

```bash
# Mobile Chrome
npx playwright test --project=mobile-chrome

# Mobile Safari
npx playwright test --project=mobile-safari

# Tablet
npx playwright test --project=tablet
```

### Debug Tests

```bash
# Debug mode (step through tests)
npx playwright test --debug

# Debug specific test
npx playwright test e2e/navigation/header-navigation.spec.ts --debug
```

### Visual Regression

```bash
# Update visual baselines
npx playwright test --update-snapshots

# Update specific test baselines
npx playwright test e2e/visual-regression --update-snapshots

# Compare against baselines
npx playwright test e2e/visual-regression
```

### View Test Report

```bash
# Generate and open HTML report
npx playwright show-report

# Generate report only
npx playwright test --reporter=html
```

## Writing Tests

### Using Test Fixtures

```typescript
import { test, expect } from '../fixtures/test-fixtures'

test('my test', async ({ page, docsPage, makeAxeBuilder }) => {
  // page: Standard Playwright page object
  // docsPage: Custom page object with helper methods
  // makeAxeBuilder: Accessibility testing helper
})
```

### DocsPage Fixture

The `docsPage` fixture provides helper methods:

```typescript
// Navigation helpers
await docsPage.navigation.clickHeaderLink('API Reference')
await docsPage.navigation.clickSidebarLink('Components')
await docsPage.navigation.getBreadcrumbs()
await docsPage.navigation.goToReference('hooks')

// Search helpers
await docsPage.search.open()
await docsPage.search.typeQuery('ChatProvider')
await docsPage.search.selectResult(0)
const results = await docsPage.search.getResults()

// DocsAssistant helpers
await docsPage.docsAssistant.open()
await docsPage.docsAssistant.sendMessage('How do I install?')
await docsPage.docsAssistant.waitForResponse()
const messages = await docsPage.docsAssistant.getMessages()
await docsPage.docsAssistant.close()
```

### Accessibility Testing

```typescript
test('should have no a11y violations', async ({ page, makeAxeBuilder }) => {
  await page.goto('/api/reference')

  const results = await makeAxeBuilder().analyze()

  expect(results.violations).toEqual([])
})
```

### Visual Regression Testing

```typescript
test('homepage visual test', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  // Full page screenshot
  await expect(page).toHaveScreenshot('homepage.png', {
    fullPage: true,
    maxDiffPixels: 100,
  })

  // Component screenshot
  const header = page.locator('header')
  await expect(header).toHaveScreenshot('header.png')
})
```

### Test Patterns

#### Arrange-Act-Assert

```typescript
test('search returns results', async ({ page, docsPage }) => {
  // Arrange: Set up initial state
  await page.goto('/')

  // Act: Perform action
  await docsPage.search.open()
  await docsPage.search.typeQuery('component')

  // Assert: Verify outcome
  const results = await docsPage.search.getResults()
  expect(results.length).toBeGreaterThan(0)
})
```

#### Page Object Pattern

```typescript
// Use docsPage fixture instead of direct selectors
// Good:
await docsPage.navigation.clickHeaderLink('Guides')

// Avoid:
await page.locator('header a:has-text("Guides")').click()
```

#### Waiting for Elements

```typescript
// Wait for load state
await page.waitForLoadState('networkidle')

// Wait for specific element
await page.waitForSelector('[data-testid="search-results"]')

// Wait for timeout (use sparingly)
await page.waitForTimeout(500)
```

## CI/CD Integration

### GitHub Actions

The E2E test suite runs automatically on:

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`
- Manual workflow dispatch

### Workflow Jobs

1. **E2E Tests**: Main test suite (sharded 4 ways)
2. **Visual Regression**: Screenshot comparison tests
3. **Accessibility**: WCAG 2.1 AA compliance tests
4. **Smoke Tests**: Fast smoke tests across all browsers
5. **Mobile Tests**: Responsive tests for mobile/tablet

### Viewing CI Results

- Test reports are uploaded as artifacts
- Screenshots on failure are uploaded
- Visual diffs are uploaded on regression failures

### Running Tests Locally Like CI

```bash
# Set CI environment variable
CI=true npx playwright test --config=playwright.e2e.config.ts
```

## Troubleshooting

### Common Issues

#### Tests Timing Out

```typescript
// Increase timeout for slow tests
test('slow test', async ({ page }) => {
  test.setTimeout(60000) // 60 seconds

  // Your test code
})
```

#### Flaky Tests

```typescript
// Use waitForLoadState instead of fixed timeouts
await page.waitForLoadState('networkidle')

// Wait for specific conditions
await page.waitForSelector('[data-testid="content"]')

// Retry assertions
await expect(page.locator('.result')).toBeVisible({ timeout: 10000 })
```

#### Visual Regression Failures

```bash
# View visual diffs
npx playwright show-report

# Update baselines if changes are intentional
npx playwright test --update-snapshots

# Update specific test baselines
npx playwright test e2e/visual-regression/page-screenshots.spec.ts --update-snapshots
```

#### Accessibility Violations

```typescript
// Get detailed violation information
const results = await makeAxeBuilder().analyze()

if (results.violations.length > 0) {
  console.log('Violations:', JSON.stringify(results.violations, null, 2))
}

expect(results.violations).toEqual([])
```

#### Browser Not Installed

```bash
# Install all browsers
npx playwright install --with-deps

# Install specific browser
npx playwright install chromium --with-deps
```

### Debug Mode

```bash
# Run with Playwright Inspector
npx playwright test --debug

# Run with browser visible
npx playwright test --headed

# Run with verbose logging
DEBUG=pw:api npx playwright test
```

### Test Reports

```bash
# HTML report
npx playwright show-report

# JSON report
cat test-results/e2e-results.json | jq

# JUnit XML (for CI)
cat test-results/junit.xml
```

## Best Practices

1. **Use fixtures**: Leverage `docsPage` fixture for consistent test patterns
2. **Wait properly**: Use `waitForLoadState` instead of fixed timeouts
3. **Descriptive names**: Write clear, descriptive test names
4. **Test isolation**: Each test should be independent
5. **Clean up**: Reset state between tests
6. **Accessibility first**: Include accessibility checks in all test suites
7. **Visual baselines**: Update visual snapshots intentionally
8. **Mobile testing**: Test on multiple viewports
9. **Error handling**: Test error states and edge cases
10. **Documentation**: Document complex test scenarios

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Testing Best Practices](https://playwright.dev/docs/best-practices)

## Support

For issues or questions:

1. Check this documentation
2. Review existing tests for examples
3. Check Playwright documentation
4. Open an issue in the repository
