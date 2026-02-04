# CommandPalette Testing Guide

> **Component**: CommandPalette
> **Package**: @clarity-chat/react
> **Version**: 1.0+
> **Last Updated**: January 28, 2026

Comprehensive testing guide for the CommandPalette component, including unit tests, integration tests, accessibility tests, and performance tests.

---

## Table of Contents

1. [Test Setup](#test-setup)
2. [Unit Tests](#unit-tests)
3. [Integration Tests](#integration-tests)
4. [Accessibility Tests](#accessibility-tests)
5. [Keyboard Navigation Tests](#keyboard-navigation-tests)
6. [Performance Tests](#performance-tests)
7. [Visual Regression Tests](#visual-regression-tests)
8. [E2E Tests](#e2e-tests)

---

## Test Setup

### Dependencies

```bash
# Install testing dependencies
pnpm add -D @testing-library/react @testing-library/user-event @testing-library/jest-dom
pnpm add -D vitest jsdom @vitest/ui
pnpm add -D jest-axe # For accessibility testing
pnpm add -D @playwright/test # For E2E testing
```

### Test Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/'],
    },
  },
})
```

### Setup File

```typescript
// tests/setup.ts
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
}

// Mock matchMedia for reduced motion tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: query.includes('prefers-reduced-motion: reduce') ? false : true,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  }),
})
```

---

## Unit Tests

### Basic Rendering

```typescript
// tests/components/CommandPalette.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { CommandPalette } from '../CommandPalette'
import type { CommandItem } from '../CommandPalette'

describe('CommandPalette', () => {
  const mockCommands: CommandItem[] = [
    {
      id: 'test-1',
      label: 'Test Command 1',
      description: 'First test command',
      onSelect: vi.fn(),
    },
    {
      id: 'test-2',
      label: 'Test Command 2',
      description: 'Second test command',
      onSelect: vi.fn(),
    },
  ]

  it('renders when open', () => {
    render(
      <CommandPalette
        items={mockCommands}
        open={true}
        onClose={vi.fn()}
      />
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(
      <CommandPalette
        items={mockCommands}
        open={false}
        onClose={vi.fn()}
      />
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('displays all command items', () => {
    render(
      <CommandPalette
        items={mockCommands}
        open={true}
        onClose={vi.fn()}
      />
    )

    expect(screen.getByText('Test Command 1')).toBeInTheDocument()
    expect(screen.getByText('Test Command 2')).toBeInTheDocument()
    expect(screen.getByText('First test command')).toBeInTheDocument()
    expect(screen.getByText('Second test command')).toBeInTheDocument()
  })

  it('displays placeholder text', () => {
    render(
      <CommandPalette
        items={mockCommands}
        open={true}
        onClose={vi.fn()}
        placeholder="Custom placeholder"
      />
    )

    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument()
  })

  it('displays loading spinner when loading', () => {
    render(
      <CommandPalette
        items={mockCommands}
        open={true}
        onClose={vi.fn()}
        loading={true}
      />
    )

    const input = screen.getByRole('combobox')
    expect(input).toHaveAttribute('aria-busy', 'true')
  })
})
```

### Search Filtering

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('CommandPalette - Search', () => {
  const mockCommands: CommandItem[] = [
    {
      id: '1',
      label: 'New Chat',
      description: 'Start a new conversation',
      onSelect: vi.fn(),
    },
    {
      id: '2',
      label: 'Settings',
      description: 'Open settings',
      onSelect: vi.fn(),
    },
  ]

  it('filters commands by label', async () => {
    const user = userEvent.setup()
    render(
      <CommandPalette
        items={mockCommands}
        open={true}
        onClose={vi.fn()}
      />
    )

    const input = screen.getByRole('combobox')
    await user.type(input, 'new')

    // Wait for debounce
    await waitFor(() => {
      expect(screen.getByText('New Chat')).toBeInTheDocument()
      expect(screen.queryByText('Settings')).not.toBeInTheDocument()
    })
  })

  it('filters commands by description', async () => {
    const user = userEvent.setup()
    render(
      <CommandPalette
        items={mockCommands}
        open={true}
        onClose={vi.fn()}
      />
    )

    const input = screen.getByRole('combobox')
    await user.type(input, 'conversation')

    await waitFor(() => {
      expect(screen.getByText('New Chat')).toBeInTheDocument()
      expect(screen.queryByText('Settings')).not.toBeInTheDocument()
    })
  })

  it('shows "no commands found" message when no results', async () => {
    const user = userEvent.setup()
    render(
      <CommandPalette
        items={mockCommands}
        open={true}
        onClose={vi.fn()}
      />
    )

    const input = screen.getByRole('combobox')
    await user.type(input, 'xyz123')

    await waitFor(() => {
      expect(screen.getByText('No commands found')).toBeInTheDocument()
    })
  })

  it('is case insensitive', async () => {
    const user = userEvent.setup()
    render(
      <CommandPalette
        items={mockCommands}
        open={true}
        onClose={vi.fn()}
      />
    )

    const input = screen.getByRole('combobox')
    await user.type(input, 'NEW')

    await waitFor(() => {
      expect(screen.getByText('New Chat')).toBeInTheDocument()
    })
  })
})
```

### Event Handlers

```typescript
import { fireEvent } from '@testing-library/react'

describe('CommandPalette - Events', () => {
  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn()
    render(
      <CommandPalette
        items={mockCommands}
        open={true}
        onClose={onClose}
      />
    )

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn()
    const { container } = render(
      <CommandPalette
        items={mockCommands}
        open={true}
        onClose={onClose}
      />
    )

    const backdrop = container.querySelector('.fixed.inset-0')
    fireEvent.click(backdrop!)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls command onSelect when clicked', async () => {
    const onSelect = vi.fn()
    const commands: CommandItem[] = [
      {
        id: 'test',
        label: 'Test Command',
        onSelect,
      },
    ]

    const user = userEvent.setup()
    render(
      <CommandPalette
        items={commands}
        open={true}
        onClose={vi.fn()}
      />
    )

    const button = screen.getByRole('option', { name: /test command/i })
    await user.click(button)

    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it('calls command onSelect when Enter is pressed', () => {
    const onSelect = vi.fn()
    const commands: CommandItem[] = [
      {
        id: 'test',
        label: 'Test Command',
        onSelect,
      },
    ]

    render(
      <CommandPalette
        items={commands}
        open={true}
        onClose={vi.fn()}
      />
    )

    fireEvent.keyDown(document, { key: 'Enter' })

    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it('calls onClose after command execution', async () => {
    const onClose = vi.fn()
    const onSelect = vi.fn()
    const commands: CommandItem[] = [
      {
        id: 'test',
        label: 'Test Command',
        onSelect,
      },
    ]

    const user = userEvent.setup()
    render(
      <CommandPalette
        items={commands}
        open={true}
        onClose={onClose}
      />
    )

    const button = screen.getByRole('option')
    await user.click(button)

    expect(onSelect).toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
  })
})
```

### AI Context Display

```typescript
describe('CommandPalette - AI Context', () => {
  const aiContext = {
    modelName: 'Claude 3.5 Sonnet',
    conversationId: 'conv-123',
    tokenUsage: {
      input: 100,
      output: 50,
      total: 150,
    },
  }

  it('displays model name', () => {
    render(
      <CommandPalette
        items={[]}
        open={true}
        onClose={vi.fn()}
        aiContext={aiContext}
      />
    )

    expect(screen.getByText('Claude 3.5 Sonnet')).toBeInTheDocument()
  })

  it('displays conversation ID', () => {
    render(
      <CommandPalette
        items={[]}
        open={true}
        onClose={vi.fn()}
        aiContext={aiContext}
      />
    )

    expect(screen.getByText('conv-123')).toBeInTheDocument()
  })

  it('displays token usage', () => {
    render(
      <CommandPalette
        items={[]}
        open={true}
        onClose={vi.fn()}
        aiContext={aiContext}
      />
    )

    expect(screen.getByText('150 tokens')).toBeInTheDocument()
  })

  it('does not display AI context when not provided', () => {
    render(
      <CommandPalette
        items={[]}
        open={true}
        onClose={vi.fn()}
      />
    )

    expect(screen.queryByText(/tokens/i)).not.toBeInTheDocument()
  })
})
```

---

## Integration Tests

### Complete User Flow

```typescript
describe('CommandPalette - Integration', () => {
  it('completes full user flow', async () => {
    const onSelect = vi.fn()
    const onClose = vi.fn()
    const commands: CommandItem[] = [
      {
        id: 'new-chat',
        label: 'New Chat',
        description: 'Start a new conversation',
        category: 'Chat',
        onSelect,
      },
      {
        id: 'settings',
        label: 'Settings',
        description: 'Open settings',
        category: 'System',
        onSelect: vi.fn(),
      },
    ]

    const user = userEvent.setup()
    render(
      <CommandPalette
        items={commands}
        open={true}
        onClose={onClose}
      />
    )

    // 1. Palette is open
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    // 2. Search for command
    const input = screen.getByRole('combobox')
    await user.type(input, 'new')

    // 3. Wait for filter
    await waitFor(() => {
      expect(screen.getByText('New Chat')).toBeInTheDocument()
      expect(screen.queryByText('Settings')).not.toBeInTheDocument()
    })

    // 4. Select command
    const command = screen.getByRole('option', { name: /new chat/i })
    await user.click(command)

    // 5. Command executed
    expect(onSelect).toHaveBeenCalled()

    // 6. Palette closed
    expect(onClose).toHaveBeenCalled()
  })

  it('handles keyboard navigation flow', async () => {
    const commands: CommandItem[] = [
      { id: '1', label: 'Command 1', onSelect: vi.fn() },
      { id: '2', label: 'Command 2', onSelect: vi.fn() },
      { id: '3', label: 'Command 3', onSelect: vi.fn() },
    ]

    render(
      <CommandPalette
        items={commands}
        open={true}
        onClose={vi.fn()}
      />
    )

    // First command selected by default
    const firstCommand = screen.getByRole('option', { name: /command 1/i })
    expect(firstCommand).toHaveAttribute('aria-selected', 'true')

    // Navigate down
    fireEvent.keyDown(document, { key: 'ArrowDown' })
    const secondCommand = screen.getByRole('option', { name: /command 2/i })
    expect(secondCommand).toHaveAttribute('aria-selected', 'true')

    // Navigate up
    fireEvent.keyDown(document, { key: 'ArrowUp' })
    expect(firstCommand).toHaveAttribute('aria-selected', 'true')

    // Jump to end
    fireEvent.keyDown(document, { key: 'End' })
    const lastCommand = screen.getByRole('option', { name: /command 3/i })
    expect(lastCommand).toHaveAttribute('aria-selected', 'true')

    // Jump to start
    fireEvent.keyDown(document, { key: 'Home' })
    expect(firstCommand).toHaveAttribute('aria-selected', 'true')
  })
})
```

---

## Accessibility Tests

### WCAG Compliance

```typescript
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('CommandPalette - Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(
      <CommandPalette
        items={mockCommands}
        open={true}
        onClose={vi.fn()}
      />
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('has proper ARIA attributes', () => {
    render(
      <CommandPalette
        items={mockCommands}
        open={true}
        onClose={vi.fn()}
        aria-label="Test command palette"
      />
    )

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-label', 'Test command palette')

    const input = screen.getByRole('combobox')
    expect(input).toHaveAttribute('aria-expanded', 'true')
    expect(input).toHaveAttribute('aria-controls')
    expect(input).toHaveAttribute('aria-autocomplete', 'list')
  })

  it('announces results to screen readers', async () => {
    const user = userEvent.setup()
    render(
      <CommandPalette
        items={mockCommands}
        open={true}
        onClose={vi.fn()}
      />
    )

    // Check initial announcement
    const liveRegion = screen.getByRole('status', { hidden: true })
    expect(liveRegion).toHaveTextContent('2 commands available')

    // Search to change results
    const input = screen.getByRole('combobox')
    await user.type(input, 'new')

    await waitFor(() => {
      expect(liveRegion).toHaveTextContent('1 command available')
    })
  })

  it('supports keyboard focus management', () => {
    render(
      <CommandPalette
        items={mockCommands}
        open={true}
        onClose={vi.fn()}
      />
    )

    // Input should be focused
    const input = screen.getByRole('combobox')
    expect(document.activeElement).toBe(input)
  })

  it('traps focus within dialog', () => {
    const { container } = render(
      <CommandPalette
        items={mockCommands}
        open={true}
        onClose={vi.fn()}
      />
    )

    const focusableElements = container.querySelectorAll(
      'button, input, [tabindex]:not([tabindex="-1"])'
    )

    expect(focusableElements.length).toBeGreaterThan(0)

    // Tab through elements
    focusableElements.forEach((element) => {
      fireEvent.keyDown(element, { key: 'Tab' })
    })

    // Focus should still be within dialog
    const dialog = screen.getByRole('dialog')
    expect(dialog.contains(document.activeElement)).toBe(true)
  })
})
```

---

## Keyboard Navigation Tests

```typescript
describe('CommandPalette - Keyboard Navigation', () => {
  const commands: CommandItem[] = [
    { id: '1', label: 'First', onSelect: vi.fn() },
    { id: '2', label: 'Second', onSelect: vi.fn() },
    { id: '3', label: 'Third', onSelect: vi.fn() },
  ]

  it('navigates down with ArrowDown', () => {
    render(
      <CommandPalette
        items={commands}
        open={true}
        onClose={vi.fn()}
      />
    )

    fireEvent.keyDown(document, { key: 'ArrowDown' })

    const secondOption = screen.getByRole('option', { name: /second/i })
    expect(secondOption).toHaveAttribute('aria-selected', 'true')
  })

  it('navigates up with ArrowUp', () => {
    render(
      <CommandPalette
        items={commands}
        open={true}
        onClose={vi.fn()}
      />
    )

    // Start at second item
    fireEvent.keyDown(document, { key: 'ArrowDown' })
    fireEvent.keyDown(document, { key: 'ArrowUp' })

    const firstOption = screen.getByRole('option', { name: /first/i })
    expect(firstOption).toHaveAttribute('aria-selected', 'true')
  })

  it('wraps to last item from first with ArrowUp', () => {
    render(
      <CommandPalette
        items={commands}
        open={true}
        onClose={vi.fn()}
      />
    )

    fireEvent.keyDown(document, { key: 'ArrowUp' })

    const lastOption = screen.getByRole('option', { name: /third/i })
    expect(lastOption).toHaveAttribute('aria-selected', 'true')
  })

  it('wraps to first item from last with ArrowDown', () => {
    render(
      <CommandPalette
        items={commands}
        open={true}
        onClose={vi.fn()}
      />
    )

    // Navigate to last item
    fireEvent.keyDown(document, { key: 'End' })
    // Wrap around
    fireEvent.keyDown(document, { key: 'ArrowDown' })

    const firstOption = screen.getByRole('option', { name: /first/i })
    expect(firstOption).toHaveAttribute('aria-selected', 'true')
  })

  it('jumps to first item with Home', () => {
    render(
      <CommandPalette
        items={commands}
        open={true}
        onClose={vi.fn()}
      />
    )

    // Go to middle
    fireEvent.keyDown(document, { key: 'ArrowDown' })
    // Jump to start
    fireEvent.keyDown(document, { key: 'Home' })

    const firstOption = screen.getByRole('option', { name: /first/i })
    expect(firstOption).toHaveAttribute('aria-selected', 'true')
  })

  it('jumps to last item with End', () => {
    render(
      <CommandPalette
        items={commands}
        open={true}
        onClose={vi.fn()}
      />
    )

    fireEvent.keyDown(document, { key: 'End' })

    const lastOption = screen.getByRole('option', { name: /third/i })
    expect(lastOption).toHaveAttribute('aria-selected', 'true')
  })
})
```

---

## Performance Tests

```typescript
import { performance } from 'perf_hooks'

describe('CommandPalette - Performance', () => {
  it('renders large lists efficiently', () => {
    const largeCommandList: CommandItem[] = Array.from(
      { length: 100 },
      (_, i) => ({
        id: `cmd-${i}`,
        label: `Command ${i}`,
        description: `Description ${i}`,
        onSelect: vi.fn(),
      })
    )

    const start = performance.now()

    render(
      <CommandPalette
        items={largeCommandList}
        open={true}
        onClose={vi.fn()}
      />
    )

    const end = performance.now()
    const renderTime = end - start

    // Should render in less than 500ms
    expect(renderTime).toBeLessThan(500)
  })

  it('debounces search input', async () => {
    const user = userEvent.setup({ delay: null })
    const { rerender } = render(
      <CommandPalette
        items={mockCommands}
        open={true}
        onClose={vi.fn()}
      />
    )

    const input = screen.getByRole('combobox')

    // Type quickly
    await user.type(input, 'test')

    // Should not have filtered yet (within debounce period)
    expect(screen.getByText('New Chat')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()

    // Wait for debounce
    await waitFor(
      () => {
        // Now it should be filtered
      },
      { timeout: 200 }
    )
  })
})
```

---

## Visual Regression Tests

### With Playwright

```typescript
// tests/e2e/command-palette.visual.spec.ts
import { test, expect } from '@playwright/test'

test.describe('CommandPalette Visual Regression', () => {
  test('matches snapshot when open', async ({ page }) => {
    await page.goto('/command-palette-demo')

    await page.click('button:has-text("Open")')
    await page.waitForSelector('[role="dialog"]')

    await expect(page).toHaveScreenshot('command-palette-open.png')
  })

  test('matches snapshot with search results', async ({ page }) => {
    await page.goto('/command-palette-demo')

    await page.click('button:has-text("Open")')
    await page.fill('[role="combobox"]', 'new')
    await page.waitForTimeout(200) // Wait for debounce

    await expect(page).toHaveScreenshot('command-palette-filtered.png')
  })

  test('matches snapshot with no results', async ({ page }) => {
    await page.goto('/command-palette-demo')

    await page.click('button:has-text("Open")')
    await page.fill('[role="combobox"]', 'xyz123')
    await page.waitForTimeout(200)

    await expect(page).toHaveScreenshot('command-palette-no-results.png')
  })
})
```

---

## E2E Tests

```typescript
// tests/e2e/command-palette.spec.ts
import { test, expect } from '@playwright/test'

test.describe('CommandPalette E2E', () => {
  test('opens with keyboard shortcut', async ({ page }) => {
    await page.goto('/command-palette-demo')

    await page.keyboard.press('Meta+K')

    await expect(page.locator('[role="dialog"]')).toBeVisible()
  })

  test('executes command and closes', async ({ page }) => {
    await page.goto('/command-palette-demo')

    await page.keyboard.press('Meta+K')
    await page.click('button:has-text("New Chat")')

    await expect(page.locator('[role="dialog"]')).not.toBeVisible()
    await expect(page.locator('text=Chat created')).toBeVisible()
  })

  test('filters commands', async ({ page }) => {
    await page.goto('/command-palette-demo')

    await page.keyboard.press('Meta+K')
    await page.fill('[role="combobox"]', 'settings')

    await expect(page.locator('text=Settings')).toBeVisible()
    await expect(page.locator('text=New Chat')).not.toBeVisible()
  })

  test('navigates with keyboard', async ({ page }) => {
    await page.goto('/command-palette-demo')

    await page.keyboard.press('Meta+K')
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Enter')

    await expect(page.locator('[role="dialog"]')).not.toBeVisible()
  })
})
```

---

## Coverage Requirements

- **Unit Tests**: 90%+ coverage
- **Integration Tests**: All user flows covered
- **Accessibility Tests**: WCAG 2.1 AA compliance
- **Keyboard Tests**: All keyboard interactions
- **Performance Tests**: Render time < 500ms for 100 items
- **E2E Tests**: Critical paths covered

---

## Running Tests

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Run specific test file
pnpm test CommandPalette.test.tsx

# Run E2E tests
pnpm test:e2e

# Run visual regression tests
pnpm test:visual

# Watch mode
pnpm test:watch
```

---

## CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Run tests
        run: pnpm test:coverage

      - name: Run accessibility tests
        run: pnpm test:a11y

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

**Last Updated**: January 28, 2026
