import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { ThemePreview } from '@clarity-chat/react'

const meta = {
  title: 'Customization/Theme/Theme Preview',
  component: ThemePreview,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Live preview and editor for theme tokens. Mirrors the approach used in Adobe Spectrum and Lightning Design System storybooks—great for design/dev collaboration during theming workshops.',
      },
    },
  },
  argTypes: {
    showEditor: { control: 'boolean' },
  },
  args: {
    showEditor: true,
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ThemePreview>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const PreviewOnly: Story = {
  args: {
    showEditor: false,
  },
}
