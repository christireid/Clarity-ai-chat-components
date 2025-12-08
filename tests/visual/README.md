# Visual Regression Testing

Automated visual regression testing for Clarity Chat Components using Playwright.

## Overview

Visual regression tests capture screenshots of components and compare them against baseline images
to detect unintended visual changes.

## Setup

```bash
# Install dependencies (from repo root)
pnpm install

# Install Playwright browsers
npx playwright install chromium
```

## Initial Setup: Creating Baseline Screenshots

Before running visual tests for the first time, you need to create baseline screenshots:

```bash
# Generate baseline screenshots (from repo root)
pnpm test:visual --update-snapshots
```

This creates reference images in `__screenshots__/` that future tests compare against. Commit these
baseline images to the repository.

## Running Tests

```bash
# Run all visual tests (from repo root)
pnpm test:visual

# Run in UI mode (interactive)
npx playwright test --ui

# Update baseline screenshots
npx playwright test --update-snapshots

# Run specific test file
npx playwright test specs/components.spec.ts
```

## What's Tested

### Component States

- Button variants (default, outline, ghost, etc.)
- Button states (hover, focus, active, disabled)
- Input states (normal, focus, error, success)
- Card variants and interactions

### Design Patterns

- Shadow hierarchy (xs, sm, md, lg, xl)
- Border radius scale (sm, md, lg, full)
- Ring-based borders
- Focus states (3px ring with 50% opacity)

### Themes

- Light mode
- Dark mode
- Custom themes

### Responsive

- Mobile (375px)
- Tablet (768px)
- Desktop (1920px)

### Interactive States

- Hover effects
- Focus rings
- Active states
- Disabled states

## CI/CD Integration

Visual regression tests run automatically on:

- Pull requests to `main`
- Pushes to `main`

If visual changes are detected:

1. Tests fail
2. Diff images are uploaded as artifacts
3. PR is commented with failure notice

## Reviewing Changes

When tests fail:

1. **Check artifacts** in GitHub Actions
2. **Review diff images** showing changes
3. **Decide**: Bug fix or intentional change?
4. If intentional: Update baselines with `--update-snapshots`

## Best Practices

1. **Run tests locally** before pushing
2. **Update baselines** when making intentional visual changes
3. **Review diffs carefully** to catch unintended changes
4. **Keep viewport sizes consistent** across environments
5. **Use meaningful test names** for easier debugging

## Configuration

Visual regression settings in `playwright.config.ts`:

```typescript
{
  maxDiffPixels: 100,  // Max pixel difference allowed
  threshold: 0.2,       // Pixel difference threshold
  animations: 'disabled' // Disable animations for consistency
}
```

## Troubleshooting

### Tests fail in CI but pass locally

- Ensure same OS (use Docker for consistency)
- Check font rendering differences
- Verify browser version matches

### Too many false positives

- Increase `maxDiffPixels` threshold
- Disable animations
- Wait for network idle before screenshots

### Can't update baselines

- Delete old screenshots in `__screenshots__` folder
- Run with `--update-snapshots`
- Commit new baseline images

## File Structure

```
tests/visual/
├── playwright.config.ts      # Playwright configuration
├── specs/
│   └── components.spec.ts    # Visual test specs
├── __screenshots__/          # Baseline images (committed)
└── __diff_output__/          # Diff images (gitignored)
```
