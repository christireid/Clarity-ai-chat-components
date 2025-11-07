# Storybook Quick Reference Card

Quick reference for common Storybook patterns and code snippets.

---

## 🚀 Quick Start

```bash
npm run storybook        # Start development server
npm run build-storybook  # Build static site
npm run test-storybook   # Run interaction tests
```

---

## 📝 Story Template

### Minimal Story

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { Component } from '@clarity-chat/react'

const meta = {
  title: 'Category/Component',
  component: Component,
  tags: ['autodocs'],
} satisfies Meta<typeof Component>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    prop: 'value',
  },
}
```

### Complete Story

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { Component } from '@clarity-chat/react'

const meta = {
  title: 'Category/Component',
  component: Component,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Component description here.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary'],
      description: 'Visual variant',
    },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof Component>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: 'default',
  },
}

export const Interactive: Story = {
  render: () => {
    const [state, setState] = React.useState(false)
    return <Component checked={state} onChange={setState} />
  },
}
```

---

## 🎮 Controls

```typescript
argTypes: {
  // Text
  name: { control: 'text' },
  
  // Boolean
  enabled: { control: 'boolean' },
  
  // Number
  count: { control: 'number' },
  
  // Range
  size: { 
    control: { type: 'range', min: 0, max: 100, step: 5 } 
  },
  
  // Select
  variant: {
    control: 'select',
    options: ['sm', 'md', 'lg'],
  },
  
  // Radio
  type: {
    control: 'radio',
    options: ['primary', 'secondary'],
  },
  
  // Multi-select
  tags: {
    control: 'check',
    options: ['tag1', 'tag2', 'tag3'],
  },
  
  // Color
  color: { control: 'color' },
  
  // Date
  date: { control: 'date' },
  
  // Object
  config: { control: 'object' },
  
  // Action
  onClick: { action: 'clicked' },
}
```

---

## 🧪 Interaction Tests

### Basic Test

```typescript
import { within, userEvent, expect } from '@storybook/testing-library'

export const WithTest: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button')
    await userEvent.click(button)
    await expect(button).toHaveFocus()
  },
}
```

### Test with Steps

```typescript
play: async ({ canvasElement, step }) => {
  const canvas = within(canvasElement)
  
  await step('Click button', async () => {
    const button = canvas.getByRole('button')
    await userEvent.click(button)
  })
  
  await step('Verify result', async () => {
    const result = canvas.getByText(/success/i)
    await expect(result).toBeInTheDocument()
  })
}
```

---

## 🔍 Queries (Priority Order)

```typescript
// 1. By Role (Best)
canvas.getByRole('button', { name: /submit/i })
canvas.getByRole('textbox', { name: /email/i })
canvas.getByRole('heading', { level: 1 })

// 2. By Label
canvas.getByLabelText('Email')

// 3. By Placeholder
canvas.getByPlaceholderText('Enter email...')

// 4. By Text
canvas.getByText(/hello/i)

// 5. By Display Value
canvas.getByDisplayValue('value')

// Avoid: Test ID (last resort)
canvas.getByTestId('id')
```

---

## ⌨️ User Events

```typescript
import { userEvent } from '@storybook/testing-library'

// Click
await userEvent.click(element)

// Type
await userEvent.type(input, 'text')

// Clear
await userEvent.clear(input)

// Tab navigation
await userEvent.tab()
await userEvent.tab({ shift: true }) // Shift+Tab

// Keyboard
await userEvent.keyboard('{Enter}')
await userEvent.keyboard(' ') // Space
await userEvent.keyboard('{Escape}')
await userEvent.keyboard('{Shift>}{Enter}{/Shift}')

// Hover
await userEvent.hover(element)
await userEvent.unhover(element)

// Select
await userEvent.selectOptions(select, 'option')
```

---

## ✅ Assertions

```typescript
import { expect } from '@storybook/testing-library'

// Presence
expect(element).toBeInTheDocument()
expect(element).not.toBeInTheDocument()

// Visibility
expect(element).toBeVisible()

// State
expect(element).toBeDisabled()
expect(element).toBeEnabled()
expect(element).toHaveFocus()
expect(checkbox).toBeChecked()

// Values
expect(input).toHaveValue('text')
expect(element).toHaveTextContent('text')

// Attributes
expect(element).toHaveAttribute('attr', 'value')
expect(element).toHaveClass('className')

// Accessibility
expect(element).toHaveAccessibleName('Name')
expect(element).toHaveAccessibleDescription('Desc')
```

---

## ⏱️ Async

```typescript
import { waitFor } from '@storybook/testing-library'

// Wait for condition
await waitFor(async () => {
  const element = await canvas.findByRole('dialog')
  await expect(element).toBeInTheDocument()
})

// With timeout
await waitFor(() => {
  // assertion
}, { timeout: 5000 })

// Find queries (wait automatically)
const element = await canvas.findByRole('button')
```

---

## ♿ Accessibility

### ARIA Attributes

```typescript
// Button with icon
<button aria-label="Close">
  <XIcon />
</button>

// Form input
<label htmlFor="email">Email</label>
<input
  id="email"
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby="hint"
/>

// Dialog
<div
  role="dialog"
  aria-labelledby="title"
  aria-describedby="description"
>
  <h2 id="title">Title</h2>
  <p id="description">Description</p>
</div>

// Live region
<div aria-live="polite" aria-atomic="true">
  {message}
</div>
```

### Focus Styles

```css
/* Visible for keyboard */
.element:focus-visible {
  outline: 2px solid blue;
  outline-offset: 2px;
}

/* Hidden for mouse */
.element:focus:not(:focus-visible) {
  outline: none;
}
```

---

## 🎨 Parameters

### Layout

```typescript
parameters: {
  layout: 'centered',  // centered, padded, fullscreen
}
```

### Backgrounds

```typescript
parameters: {
  backgrounds: {
    default: 'dark',
    values: [
      { name: 'light', value: '#ffffff' },
      { name: 'dark', value: '#000000' },
    ],
  },
}
```

### Viewport

```typescript
parameters: {
  viewport: {
    defaultViewport: 'mobile1',
  },
}
```

### Docs

```typescript
parameters: {
  docs: {
    description: {
      component: 'Component description',
      story: 'Story description',
    },
  },
}
```

---

## 🎭 Decorators

### Wrapper

```typescript
decorators: [
  (Story) => (
    <div style={{ padding: '3rem' }}>
      <Story />
    </div>
  ),
]
```

### Theme

```typescript
decorators: [
  (Story) => (
    <ThemeProvider theme="dark">
      <Story />
    </ThemeProvider>
  ),
]
```

### Multiple

```typescript
decorators: [
  (Story) => <Wrapper1><Story /></Wrapper1>,
  (Story) => <Wrapper2><Story /></Wrapper2>,
]
```

---

## 📦 Common Patterns

### All Variants

```typescript
export const AllVariants: Story = {
  render: () => (
    <>
      <Component variant="default" />
      <Component variant="primary" />
      <Component variant="secondary" />
    </>
  ),
}
```

### State Management

```typescript
export const Stateful: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <Component value={value} onChange={setValue} />
    )
  },
}
```

### Async Loading

```typescript
export const AsyncLoad: Story = {
  render: () => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    
    const load = async () => {
      setLoading(true)
      const result = await fetchData()
      setData(result)
      setLoading(false)
    }
    
    return (
      <Component 
        data={data} 
        loading={loading}
        onLoad={load}
      />
    )
  },
}
```

### Form Example

```typescript
export const FormExample: Story = {
  render: () => {
    const [form, setForm] = useState({ name: '', email: '' })
    
    const handleSubmit = (e) => {
      e.preventDefault()
      console.log(form)
    }
    
    return (
      <form onSubmit={handleSubmit}>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <button type="submit">Submit</button>
      </form>
    )
  },
}
```

---

## 🐛 Troubleshooting

### Story not showing
- Check file naming: `*.stories.tsx`
- Verify `export default meta`
- Restart Storybook

### Controls not working
- Add `tags: ['autodocs']`
- Add argTypes manually
- Check TypeScript types

### Tests timing out
- Increase timeout: `waitFor(() => {}, { timeout: 5000 })`
- Use `findBy` queries (wait automatically)
- Check element exists first

### TypeScript errors
- Use `satisfies Meta<typeof Component>`
- Type Story: `type Story = StoryObj<typeof meta>`

---

## 🎯 Checklist

When creating a new story:

- [ ] Use CSF3 format (`satisfies Meta`)
- [ ] Add to correct category
- [ ] Include `tags: ['autodocs']`
- [ ] Add component description
- [ ] Define argTypes with controls
- [ ] Create multiple variations
- [ ] Add interactive examples
- [ ] Write interaction tests
- [ ] Verify accessibility
- [ ] Test keyboard navigation
- [ ] Check in multiple viewports

---

## 📚 Resources

- [Storybook Docs](https://storybook.js.org/docs)
- [Testing Library](https://testing-library.com)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)

---

## 💡 Tips

1. **Start simple**: Create basic story first, then add variations
2. **Use real data**: Mock realistic data for better examples
3. **Test early**: Add interaction tests while developing
4. **Think accessibility**: Build it in from the start
5. **Document well**: Future you will thank you

---

**Keep this handy while developing stories!** 📌
