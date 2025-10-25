import type { Meta, StoryObj } from '@storybook/react'
import { CopyButton } from '@clarity-chat/react'

const meta: Meta<typeof CopyButton> = {
  title: 'Components/CopyButton',
  component: CopyButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Button for copying text to clipboard with success animation.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CopyButton>

export const Default: Story = {
  args: {
    content: 'This is the text that will be copied to clipboard',
  },
}

export const CodeSnippet: Story = {
  args: {
    content: `const greeting = 'Hello, World!'
console.log(greeting)`,
  },
}

export const LongText: Story = {
  args: {
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.`,
  },
}

export const JSONData: Story = {
  args: {
    content: JSON.stringify({
      name: 'John Doe',
      email: 'john@example.com',
      roles: ['admin', 'user'],
      active: true,
    }, null, 2),
  },
}
