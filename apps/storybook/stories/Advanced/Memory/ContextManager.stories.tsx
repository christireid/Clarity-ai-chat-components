import type { Meta, StoryObj } from '@storybook/react'
import { ContextManager } from '@clarity-chat/react'

const meta: Meta<typeof ContextManager> = {
  title: 'Advanced/Memory/ContextManager',
  component: ContextManager,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ContextManager>

const mockContexts = [
  { id: '1', type: 'document' as const, title: 'Advanced/Memory/ContextManager', size: '2MB' },
  { id: '2', type: 'image' as const, title: 'Advanced/Memory/ContextManager', size: '500KB' },
]

export const Default: Story = {
  args: { contexts: mockContexts, onRemove: (id) => console.log('Remove:', id) },
}
