import type { Meta, StoryObj } from '@storybook/react'
import { ThemeSwitcher } from '@clarity-chat/react'
import { useState } from 'react'
import type { Theme } from '@clarity-chat/react'

const meta: Meta<typeof ThemeSwitcher> = {
  title: 'Components/ThemeSwitcher',
  component: ThemeSwitcher,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Theme switcher component allowing users to toggle between light, dark, and system themes. Supports preview mode and compact layout.',
      },
    },
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof ThemeSwitcher>

export const Default: Story = {
  render: () => {
    const [theme, setTheme] = useState<Theme>('light')
    return (
      <ThemeSwitcher
        currentTheme={theme}
        onThemeChange={setTheme}
      />
    )
  },
}

export const WithPreview: Story = {
  render: () => {
    const [theme, setTheme] = useState<Theme>('light')
    return (
      <ThemeSwitcher
        currentTheme={theme}
        onThemeChange={setTheme}
        showPreview={true}
      />
    )
  },
}

export const Compact: Story = {
  render: () => {
    const [theme, setTheme] = useState<Theme>('dark')
    return (
      <ThemeSwitcher
        currentTheme={theme}
        onThemeChange={setTheme}
        compact={true}
      />
    )
  },
}

export const SystemTheme: Story = {
  render: () => {
    const [theme, setTheme] = useState<Theme>('system')
    return (
      <div className="space-y-4">
        <ThemeSwitcher
          currentTheme={theme}
          onThemeChange={setTheme}
          showPreview={true}
        />
        <p className="text-sm text-muted-foreground text-center">
          Current theme: {theme}
        </p>
      </div>
    )
  },
}

export const Interactive: Story = {
  render: () => {
    const [theme, setTheme] = useState<Theme>('light')
    
    return (
      <div className="space-y-6">
        <ThemeSwitcher
          currentTheme={theme}
          onThemeChange={(newTheme) => {
            setTheme(newTheme)
            console.log('Theme changed to:', newTheme)
          }}
          showPreview={true}
        />
        <div className="p-4 border rounded-lg">
          <p className="text-sm mb-2">Current theme: <strong>{theme}</strong></p>
          <p className="text-xs text-muted-foreground">
            Click the theme buttons above to see the switcher in action
          </p>
        </div>
      </div>
    )
  },
}
