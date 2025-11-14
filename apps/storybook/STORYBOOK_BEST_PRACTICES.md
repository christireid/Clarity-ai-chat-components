# 🎨 Storybook Best Practices Guide

**Purpose**: Ensure all Storybook stories follow modern best practices and provide excellent developer experience.

---

## ✅ Storybook Setup

**Current Configuration:**
- ✅ Storybook 8.6.14 (Latest)
- ✅ React 19.2.0 (Latest)
- ✅ CSF3 format (Modern)
- ✅ Autodocs enabled
- ✅ TypeScript throughout

---

## 📐 Story Structure (CSF3)

### Basic Template

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Component } from '@clarity-chat/react'

/**
 * **Component Name**
 * 
 * Brief description of what this component does and why it matters.
 * 
 * **Key Features:**
 * - Feature 1
 * - Feature 2
 * - Feature 3
 * 
 * **Use Cases:**
 * - Use case 1
 * - Use case 2
 */
const meta = {
  title: 'Category/ComponentName',
  component: Component,
  tags: ['autodocs'], // Always include this
  parameters: {
    layout: 'padded', // or 'centered', 'fullscreen'
    docs: {
      description: {
        component: `
Detailed component description with markdown support.

## Features

- ✅ Feature 1
- ✅ Feature 2

## Basic Usage

\`\`\`tsx
<Component prop="value" />
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    prop: {
      description: 'Clear description of what this prop does',
      control: { type: 'text' }, // or 'boolean', 'number', 'object', etc.
    },
  },
} satisfies Meta<typeof Component>

export default meta
type Story = StoryObj<typeof meta>

// Default story - most common use case
export const Default: Story = {
  args: {
    prop: 'value',
  },
}

// Loading state
export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true,
  },
}

// Error state
export const Error: Story = {
  args: {
    ...Default.args,
    error: 'Something went wrong',
  },
}

// Empty state
export const Empty: Story = {
  args: {
    ...Default.args,
    items: [],
  },
}
```

---

## 🎯 Story Variants

### Always Include These Variants

1. **Default** - Most common use case
2. **Loading** - Loading state
3. **Error** - Error state
4. **Empty** - Empty state (if applicable)

### Additional Variants (When Applicable)

5. **Long Content** - Test with long content
6. **Many Items** - Test with many items (performance)
7. **Custom Styling** - Custom theme/styling
8. **Interactive** - Interactive example with state

---

## 📝 Documentation Standards

### Component Description

**Include:**
- What the component does (one sentence)
- Key features (bulleted list)
- Use cases (when to use it)
- Code example (basic usage)

**Example:**
```tsx
/**
 * **ChatWindow Component**
 * 
 * Complete chat window component that orchestrates MessageList and ChatInput
 * to provide a full-featured chat interface.
 * 
 * **Key Features:**
 * - Message display and management
 * - Input handling with send functionality
 * - Loading states
 * - Empty state handling
 * 
 * **Use Cases:**
 * - AI chat interfaces
 * - Customer support
 * - Messaging applications
 */
```

### Parameters Documentation

**Always include:**
- Component description in `docs.description.component`
- Use markdown for formatting
- Include code examples
- Link to related components

---

## 🎨 Controls & ArgTypes

### Best Practices

1. **Descriptive Names**
   ```tsx
   argTypes: {
     isLoading: {
       description: 'Whether a message is currently being processed',
       control: { type: 'boolean' },
     },
   }
   ```

2. **Sensible Defaults**
   ```tsx
   args: {
     isLoading: false, // Most common state
   }
   ```

3. **Control Types**
   - `boolean` - For boolean props
   - `text` - For strings
   - `number` - For numbers
   - `object` - For objects (use sparingly)
   - `select` - For enums

4. **Action Handlers**
   ```tsx
   argTypes: {
     onSendMessage: {
       description: 'Callback function called when a message is sent',
       action: 'message-sent', // Shows in Actions panel
     },
   }
   ```

---

## 🧪 Interactive Stories

### When to Use

- Complex state management
- User interactions
- Form submissions
- Real-time updates

### Template

```tsx
import { useState } from 'react'

function InteractiveTemplate() {
  const [state, setState] = useState(initialState)

  const handleAction = () => {
    // Update state
    setState(newState)
  }

  return (
    <Component
      {...props}
      onAction={handleAction}
    />
  )
}

export const Interactive: Story = {
  render: () => <InteractiveTemplate />,
}
```

---

## 📊 Realistic Data

### ✅ DO

- Use realistic data that matches real-world usage
- Include edge cases (long text, special characters)
- Show actual use cases

### ❌ DON'T

- Use `foo`/`bar` placeholders
- Use contrived examples
- Skip edge cases

**Example:**
```tsx
const mockMessages: Message[] = [
  {
    id: '1',
    role: 'user',
    content: 'Hello! Can you help me with React?',
    timestamp: Date.now() - 60000,
  },
  {
    id: '2',
    role: 'assistant',
    content: 'Of course! I\'d be happy to help you with React. What specific topic would you like to discuss?',
    timestamp: Date.now() - 30000,
  },
]
```

---

## 🎭 Decorators

### When to Use

- Consistent layout
- Theme providers
- Context providers
- Size constraints

### Example

```tsx
decorators: [
  (Story) => (
    <div style={{ width: '600px', height: '500px' }}>
      <Story />
    </div>
  ),
],
```

---

## 📱 Viewports

### Standard Viewports

- **Mobile**: 375px × 667px
- **Tablet**: 768px × 1024px
- **Desktop**: 1280px × 800px
- **Ultra Wide**: 1920px × 1080px

### Testing

Always test stories across viewports to ensure responsive design works correctly.

---

## ♿ Accessibility

### Best Practices

1. **Use Semantic HTML**
   - Proper heading hierarchy
   - ARIA labels where needed
   - Keyboard navigation

2. **Test with A11y Addon**
   - Enable `@storybook/addon-a11y`
   - Check for violations
   - Fix issues before publishing

3. **Document Accessibility Features**
   - Mention keyboard shortcuts
   - Note screen reader support
   - Document focus management

---

## 🔗 Related Stories

### Cross-Linking

Link to related stories in documentation:

```tsx
docs: {
  description: {
    component: `
See also:
- [MessageList](./?path=/story/components-messagelist--default)
- [ChatInput](./?path=/story/components-chatinput--default)
    `,
  },
},
```

---

## ✅ Checklist

Before publishing a story:

- [ ] Uses CSF3 format
- [ ] Has `autodocs` tag
- [ ] Includes component description
- [ ] Has multiple variants (Default, Loading, Error, Empty)
- [ ] Uses realistic data
- [ ] Controls are well-configured
- [ ] ArgTypes have descriptions
- [ ] Code examples work
- [ ] Accessibility tested
- [ ] Responsive design tested
- [ ] Related stories linked

---

## 🚀 Advanced Patterns

### Composition Stories

Show how components work together:

```tsx
export const WithOtherComponent: Story = {
  render: () => (
    <div>
      <ComponentA />
      <ComponentB />
    </div>
  ),
}
```

### Performance Stories

Test with large datasets:

```tsx
export const ManyItems: Story = {
  args: {
    items: Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      content: `Item ${i}`,
    })),
  },
}
```

### Theme Stories

Show different themes:

```tsx
export const DarkTheme: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider theme={darkTheme}>
        <Story />
      </ThemeProvider>
    ),
  ],
}
```

---

## 📚 Resources

- [Storybook Documentation](https://storybook.js.org/docs)
- [CSF3 Format](https://storybook.js.org/docs/api/csf)
- [Controls](https://storybook.js.org/docs/essentials/controls)
- [Accessibility](https://storybook.js.org/docs/essentials/accessibility)

---

**Remember**: Great stories help developers understand and use components effectively. Make them clear, comprehensive, and helpful!
