import type { Meta, StoryObj } from '@storybook/react'
import { ConversationList } from '@clarity-chat/react'

const meta: Meta<typeof ConversationList> = {
  title: 'Components/ConversationList',
  component: ConversationList,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ConversationList>

const mockConversations = [
  { id: '1', title: 'React Hooks Discussion', preview: 'How to use useState...', lastMessage: Date.now() },
  { id: '2', title: 'TypeScript Tips', preview: 'Best practices for types...', lastMessage: Date.now() - 3600000 },
]

export const Default: Story = {
  args: { conversations: mockConversations, onSelect: (id) => console.log(id) },
}
