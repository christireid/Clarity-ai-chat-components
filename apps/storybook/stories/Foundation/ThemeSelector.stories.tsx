import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { ThemeSelector, ThemeSelectorDropdown, ThemeToggle } from '@clarity-chat/react'

const meta = {
  title: 'Foundation/ThemeSelector',
  component: ThemeSelector,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Theme management components inspired by companies like Intercom and Zendesk, combining visual previews with accessible toggles. Use alongside ThemeProvider to power live theming workflows.',
      },
    },
  },
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
    },
    showPreview: { control: 'boolean' },
  },
  args: {
    orientation: 'vertical',
    showPreview: true,
  },
  decorators: [
    (Story) => (
      <div className="flex w-full max-w-5xl flex-col gap-6">
        <div className="flex items-center justify-between rounded-lg border border-border/50 bg-card p-4 shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)]">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Global toolbar</h3>
            <p className="text-xs text-muted-foreground">Live preview uses Storybook global toolbar controls.</p>
          </div>
          <ThemeToggle className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
        </div>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof ThemeSelector>

export default meta
type Story = StoryObj<typeof meta>

export const Gallery: Story = {
  render: (args) => (
    <ThemeSelector {...args} />
  ),
}

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
  },
}

export const DropdownAndSelector: Story = {
  name: 'Dropdown + Selector',
  render: (args) => (
    <div className="grid gap-6 md:grid-cols-[280px_1fr]">
      <ThemeSelector {...args} />
      <div className="space-y-4 rounded-lg border border-border/50 bg-card p-6 shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)]">
        <h3 className="text-sm font-semibold text-foreground">Dropdown surface</h3>
        <p className="text-xs text-muted-foreground">
          Use the compact dropdown variant inside headers or mobile sheets while keeping the full selector available in settings.
        </p>
        <ThemeSelectorDropdown />
      </div>
    </div>
  ),
}
