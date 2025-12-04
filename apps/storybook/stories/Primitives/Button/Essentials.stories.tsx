import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@clarity-chat/primitives'

const meta: Meta<typeof Button> = {
  title: 'Primitives/Button/Essentials',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The Button component is a versatile, accessible button with multiple variants
and states. This track shows the essential patterns you'll use in 90% of cases.

## When to Use Button

- ✅ User actions (submit, cancel, confirm)
- ✅ Navigation (links styled as buttons)
- ✅ Destructive actions (delete, remove)
- ✅ Secondary actions (cancel, back)

## Key Features

- **Variants** - Default, destructive, outline, secondary, ghost, link
- **Sizes** - Default, sm, lg, icon
- **States** - Loading, disabled, success, error
- **Accessibility** - WCAG AAA compliant
        `,
      },
    },
  },
  argTypes: {
    variant: {
      description: 'Button visual style',
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      description: 'Button size',
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    loading: {
      description: 'Show loading spinner',
      control: { type: 'boolean' },
    },
    disabled: {
      description: 'Disable button interaction',
      control: { type: 'boolean' },
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'default',
  },
  parameters: {
    docs: {
      description: {
        story: `
The default button style. Use for primary actions.

**When to Use:**
- Primary actions (Submit, Save, Continue)
- Important user actions
- Call-to-action buttons
        `,
      },
    },
  },
}

export const Destructive: Story = {
  args: {
    children: 'Delete',
    variant: 'destructive',
  },
  parameters: {
    docs: {
      description: {
        story: `
Destructive variant for dangerous actions. Use sparingly and with caution.

**When to Use:**
- Delete actions
- Remove actions
- Irreversible operations

**Best Practice:** Always confirm destructive actions.
        `,
      },
    },
  },
}

export const Outline: Story = {
  args: {
    children: 'Cancel',
    variant: 'outline',
  },
  parameters: {
    docs: {
      description: {
        story: `
Outline variant for secondary actions. Less prominent than default.

**When to Use:**
- Cancel actions
- Secondary options
- Alternative actions
        `,
      },
    },
  },
}

export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
  parameters: {
    docs: {
      description: {
        story: `
Secondary variant for less prominent actions.

**When to Use:**
- Secondary actions
- Alternative options
- Less important actions
        `,
      },
    },
  },
}

export const Loading: Story = {
  args: {
    children: 'Loading...',
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story: `
Loading state shows a spinner and disables interaction. Use during async operations.

**Usage:**
1. Set \`loading={true}\` when operation starts
2. Set \`loading={false}\` when operation completes
3. Button automatically disables during loading
        `,
      },
    },
  },
}

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: `
Disabled state prevents interaction. Use when action is not available.

**When to Use:**
- Form validation (disable until valid)
- Permission restrictions
- Conditional availability
        `,
      },
    },
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button>Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
Different button sizes for various contexts. Use appropriately for your layout.

**Sizes:**
- **sm** - Compact spaces, dense layouts
- **default** - Standard size, most common
- **lg** - Prominent actions, hero sections
        `,
      },
    },
  },
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
All button variants. Choose the appropriate variant for your use case.

**Variants:**
- **default** - Primary actions
- **destructive** - Dangerous actions
- **outline** - Secondary actions
- **secondary** - Less prominent actions
- **ghost** - Subtle actions
- **link** - Link-styled buttons
        `,
      },
    },
  },
}
