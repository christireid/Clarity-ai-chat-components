# Storybook Developer Guide

A comprehensive guide for developers working with the Clarity Chat Storybook.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Creating Stories](#creating-stories)
3. [Writing Interaction Tests](#writing-interaction-tests)
4. [Accessibility Guidelines](#accessibility-guidelines)
5. [Best Practices](#best-practices)
6. [Common Patterns](#common-patterns)
7. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites

```bash
node >= 18.0.0
npm >= 9.0.0
```

### Installation

```bash
# Install dependencies
npm install

# Start Storybook
npm run storybook

# Build Storybook
npm run build-storybook
```

### Project Structure

```
apps/storybook/
├── .storybook/
│   ├── main.ts          # Storybook configuration
│   └── preview.tsx      # Global decorators and parameters
├── stories/
│   ├── *.stories.tsx    # Component stories
│   ├── *.mdx           # Documentation pages
│   └── *.interactions.stories.tsx  # Interaction tests
└── public/             # Static assets
```

---

## Creating Stories

### Basic Story Template

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { ComponentName } from '@clarity-chat/react'

const meta = {
  title: 'Category/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered', // or 'padded', 'fullscreen'
    docs: {
      description: {
        component: 'A clear, concise description of the component.',
      },
    },
  },
  argTypes: {
    propName: {
      control: 'text', // or 'boolean', 'select', 'number', etc.
      description: 'Description of the prop',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    onAction: {
      action: 'action-name', // Logs actions in Actions panel
    },
  },
} satisfies Meta<typeof ComponentName>

export default meta
type Story = StoryObj<typeof meta>

// Basic story with args
export const Default: Story = {
  args: {
    propName: 'value',
  },
}

// Story with custom render
export const CustomRender: Story = {
  render: (args) => (
    <div>
      <ComponentName {...args} />
    </div>
  ),
}

// Interactive story with state
export const Interactive: Story = {
  render: () => {
    const [state, setState] = React.useState(initialValue)
    
    return (
      <ComponentName
        value={state}
        onChange={setState}
      />
    )
  },
}
```

### Story Categories

Organize stories using clear categories:

```typescript
// ✅ Good
title: 'Components/Message'
title: 'Hooks/useChat'
title: 'Primitives/Button'
title: 'Utilities/Token Estimation'
title: 'Examples/Chat Interface'

// ❌ Bad
title: 'message'
title: 'Button Component'
title: 'stuff/things'
```

### Control Types

Use appropriate controls for different prop types:

```typescript
argTypes: {
  // Text input
  text: { control: 'text' },
  
  // Boolean toggle
  enabled: { control: 'boolean' },
  
  // Number slider
  count: { 
    control: { type: 'range', min: 0, max: 100, step: 1 }
  },
  
  // Select dropdown
  variant: {
    control: 'select',
    options: ['default', 'primary', 'secondary'],
  },
  
  // Radio buttons
  size: {
    control: 'radio',
    options: ['sm', 'md', 'lg'],
  },
  
  // Color picker
  color: { control: 'color' },
  
  // Date picker
  date: { control: 'date' },
  
  // Object editor
  config: { control: 'object' },
  
  // Action logger
  onClick: { action: 'clicked' },
}
```

### Multiple Story Variations

Create comprehensive examples:

```typescript
// Basic
export const Default: Story = {
  args: { children: 'Button' },
}

// Size variants
export const Small: Story = {
  args: { children: 'Button', size: 'sm' },
}

export const Large: Story = {
  args: { children: 'Button', size: 'lg' },
}

// State variants
export const Loading: Story = {
  args: { children: 'Button', loading: true },
}

export const Disabled: Story = {
  args: { children: 'Button', disabled: true },
}

// Context examples
export const InForm: Story = {
  render: () => (
    <form>
      <label>Name: <input type="text" /></label>
      <Button type="submit">Submit</Button>
    </form>
  ),
}
```

---

## Writing Interaction Tests

### Basic Test Structure

```typescript
import { within, userEvent, expect, waitFor } from '@storybook/testing-library'

export const WithInteractions: Story = {
  args: {
    // story args
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Description of test step', async () => {
      // Test implementation
      const element = canvas.getByRole('button')
      await expect(element).toBeInTheDocument()
    })
  },
}
```

### Common Test Patterns

#### 1. Click Interaction

```typescript
await step('User can click button', async () => {
  const button = canvas.getByRole('button', { name: /click me/i })
  await userEvent.click(button)
  await expect(button).toHaveFocus()
})
```

#### 2. Keyboard Navigation

```typescript
await step('Tab to element and activate', async () => {
  await userEvent.tab()
  const element = canvas.getByRole('button')
  await expect(element).toHaveFocus()
  
  await userEvent.keyboard('{Enter}')
  // or
  await userEvent.keyboard(' ') // Space key
})
```

#### 3. Form Input

```typescript
await step('User can type in input', async () => {
  const input = canvas.getByRole('textbox')
  await userEvent.type(input, 'Hello world')
  await expect(input).toHaveValue('Hello world')
})
```

#### 4. Async Waiting

```typescript
await step('Dialog opens', async () => {
  const trigger = canvas.getByRole('button')
  await userEvent.click(trigger)
  
  await waitFor(async () => {
    const dialog = await canvas.findByRole('dialog')
    await expect(dialog).toBeInTheDocument()
  })
})
```

#### 5. Accessibility Checks

```typescript
await step('Element is accessible', async () => {
  const element = canvas.getByRole('button')
  await expect(element).toHaveAccessibleName('Button Name')
  await expect(element).toHaveAccessibleDescription('Description')
  await expect(element).toHaveAttribute('aria-label', 'Label')
})
```

### Query Priorities

Use queries in this order (most to least preferred):

```typescript
// 1. Role queries (best)
canvas.getByRole('button', { name: /submit/i })
canvas.getByRole('textbox', { name: /email/i })
canvas.getByRole('heading', { level: 1 })

// 2. Label queries
canvas.getByLabelText('Email address')

// 3. Placeholder queries
canvas.getByPlaceholderText('Enter email...')

// 4. Text queries
canvas.getByText(/hello world/i)

// 5. Display value (for inputs)
canvas.getByDisplayValue('current value')

// ❌ Avoid: Test ID (implementation detail)
canvas.getByTestId('button-1') // Only as last resort
```

### Test Assertions

Common assertions:

```typescript
// Presence
await expect(element).toBeInTheDocument()
await expect(element).not.toBeInTheDocument()

// Visibility
await expect(element).toBeVisible()
await expect(element).not.toBeVisible()

// State
await expect(element).toBeDisabled()
await expect(element).toBeEnabled()
await expect(element).toHaveFocus()

// Values
await expect(input).toHaveValue('text')
await expect(checkbox).toBeChecked()

// Attributes
await expect(element).toHaveAttribute('aria-label', 'value')
await expect(element).toHaveClass('className')

// Accessibility
await expect(element).toHaveAccessibleName('Name')
await expect(element).toHaveAccessibleDescription('Description')
```

---

## Accessibility Guidelines

### Keyboard Navigation

Every interactive element must be keyboard accessible:

```typescript
// ✅ Good
<button onClick={handleClick}>Click me</button>

// ❌ Bad
<div onClick={handleClick}>Click me</div>
```

### ARIA Attributes

Use ARIA attributes correctly:

```typescript
// Button with icon only
<button aria-label="Close">
  <XIcon />
</button>

// Dialog
<div
  role="dialog"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
>
  <h2 id="dialog-title">Title</h2>
  <p id="dialog-description">Description</p>
</div>

// Form input
<label htmlFor="email">Email</label>
<input
  id="email"
  type="email"
  required
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby="email-hint email-error"
/>
<span id="email-hint">Enter your email address</span>
{hasError && (
  <span id="email-error" role="alert">
    Please enter a valid email
  </span>
)}
```

### Focus Management

Ensure focus is visible and managed correctly:

```css
/* Visible focus indicator */
.button:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}

/* Hide outline for mouse users */
.button:focus:not(:focus-visible) {
  outline: none;
}
```

### Color Contrast

Maintain WCAG AA contrast ratios:

- **Normal text**: 4.5:1 minimum
- **Large text**: 3:1 minimum
- **UI components**: 3:1 minimum

Use tools to verify:
- Chrome DevTools Color Picker
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Storybook's built-in a11y addon

### Screen Reader Support

Test with screen readers:
- **Windows**: NVDA (free), JAWS
- **macOS**: VoiceOver (built-in)
- **Mobile**: VoiceOver (iOS), TalkBack (Android)

---

## Best Practices

### 1. Component Naming

```typescript
// ✅ Good
export const DefaultButton: Story = {}
export const LargeButton: Story = {}
export const LoadingState: Story = {}

// ❌ Bad
export const Story1: Story = {}
export const test: Story = {}
export const buttonExample: Story = {}
```

### 2. Documentation

Always include:

```typescript
parameters: {
  docs: {
    description: {
      component: `
# Component Name

Brief description of what this component does.

## Features
- Feature 1
- Feature 2

## When to Use
- Use case 1
- Use case 2

## Example
\`\`\`tsx
<Component prop="value" />
\`\`\`
      `,
      story: 'Description specific to this story variation.',
    },
  },
}
```

### 3. Mock Data

Create reusable mock data:

```typescript
// At top of file
const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
}

const mockMessages = [
  { id: '1', content: 'Hello', role: 'user' },
  { id: '2', content: 'Hi there!', role: 'assistant' },
]

// Use in stories
export const WithMessages: Story = {
  args: {
    messages: mockMessages,
  },
}
```

### 4. State Management

For interactive demos:

```typescript
export const InteractiveDemo: Story = {
  render: () => {
    const [value, setValue] = React.useState('')
    const [items, setItems] = React.useState([])
    
    const handleAdd = () => {
      setItems([...items, value])
      setValue('')
    }
    
    return (
      <div>
        <input value={value} onChange={(e) => setValue(e.target.value)} />
        <button onClick={handleAdd}>Add</button>
        <ul>
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    )
  },
}
```

### 5. Error States

Always show error states:

```typescript
export const WithError: Story = {
  args: {
    error: new Error('Something went wrong'),
    status: 'error',
  },
}

export const ValidationError: Story = {
  args: {
    value: 'invalid',
    error: 'Please enter a valid email address',
  },
}
```

---

## Common Patterns

### Pattern 1: Component Variants

```typescript
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Button variant="default">Default</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  ),
}
```

### Pattern 2: Responsive Layout

```typescript
export const ResponsiveGrid: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Content */}
    </div>
  ),
}
```

### Pattern 3: Dark Mode

```typescript
export const DarkMode: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
}
```

### Pattern 4: Loading States

```typescript
export const LoadingSequence: Story = {
  render: () => {
    const [loading, setLoading] = React.useState(false)
    
    const handleClick = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 2000))
      setLoading(false)
    }
    
    return <Button loading={loading} onClick={handleClick}>Click me</Button>
  },
}
```

### Pattern 5: Form Examples

```typescript
export const FormExample: Story = {
  render: () => {
    const [formData, setFormData] = React.useState({
      email: '',
      password: '',
    })
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      console.log('Submitted:', formData)
    }
    
    return (
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <button type="submit">Submit</button>
      </form>
    )
  },
}
```

---

## Troubleshooting

### Issue: Story not appearing

**Problem**: Story doesn't show up in Storybook sidebar

**Solutions**:
1. Check file naming: `*.stories.tsx` or `*.stories.ts`
2. Verify export default meta statement
3. Check `main.ts` stories glob pattern
4. Restart Storybook dev server

### Issue: TypeScript errors

**Problem**: Type errors in story file

**Solutions**:
```typescript
// Use satisfies for type checking
const meta = {
  // ...
} satisfies Meta<typeof Component>

// Proper Story type
type Story = StoryObj<typeof meta>

// Type args correctly
export const Example: Story = {
  args: {
    // TypeScript will autocomplete and check these
  },
}
```

### Issue: Controls not working

**Problem**: Controls panel shows "No controls"

**Solutions**:
1. Ensure `tags: ['autodocs']` is set
2. Add argTypes manually if needed
3. Check component has proper TypeScript props
4. Use react-docgen-typescript in main.ts

### Issue: Interaction tests failing

**Problem**: Tests fail or timeout

**Solutions**:
```typescript
// Increase timeout for slow operations
await waitFor(async () => {
  // assertion
}, { timeout: 5000 })

// Use correct query for async elements
const element = await canvas.findByRole('dialog') // findBy waits

// Check element exists before interacting
const button = canvas.getByRole('button')
await expect(button).toBeInTheDocument()
await userEvent.click(button)
```

### Issue: Accessibility violations

**Problem**: a11y addon shows errors

**Solutions**:
1. Add proper ARIA labels
2. Ensure sufficient color contrast
3. Fix keyboard navigation
4. Add semantic HTML

```typescript
// Before (violations)
<div onClick={handleClick}>Click</div>

// After (no violations)
<button onClick={handleClick} aria-label="Submit form">
  Click
</button>
```

---

## Quick Reference

### Story Boilerplate

```bash
# Create new story file
touch apps/storybook/stories/ComponentName.stories.tsx
```

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { ComponentName } from '@clarity-chat/react'

const meta = {
  title: 'Category/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],
} satisfies Meta<typeof ComponentName>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
```

### Useful Commands

```bash
# Start Storybook
npm run storybook

# Build Storybook
npm run build-storybook

# Run interaction tests
npm run test-storybook

# Check accessibility
# (Use addon-a11y panel in Storybook UI)
```

### Keyboard Shortcuts in Storybook

- `S` - Show sidebar
- `A` - Show addons panel
- `F` - Fullscreen
- `D` - Change background
- `/` - Search
- `Ctrl+Shift+F` - Filter stories

---

## Resources

### Internal
- [Storybook Enhancement Complete](./STORYBOOK_ENHANCEMENT_COMPLETE.md)
- [Interaction Tests Summary](./STORYBOOK_INTERACTION_TESTS_SUMMARY.md)
- [Accessibility Audit](./STORYBOOK_ACCESSIBILITY_AUDIT.md)

### External
- [Storybook Documentation](https://storybook.js.org/docs/react/get-started/introduction)
- [Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)

---

## Contributing

When adding new stories:

1. ✅ Follow CSF3 format
2. ✅ Add comprehensive documentation
3. ✅ Include multiple variations
4. ✅ Add interaction tests
5. ✅ Verify accessibility
6. ✅ Test keyboard navigation
7. ✅ Add to appropriate category

Questions? Check existing stories for examples or refer to this guide.

---

**Happy Storybook Development!** 🎨
