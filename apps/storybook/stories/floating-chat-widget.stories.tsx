import type { Meta, StoryObj } from '@storybook/react-vite'
import { FloatingChatWidget } from '@clarity-chat/react/internal'

const meta: Meta<typeof FloatingChatWidget> = {
  title: 'Components/Chat/FloatingChatWidget',
  component: FloatingChatWidget,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FloatingChatWidget>

export const Default: Story = {
  args: {
    title: 'Clarity AI',
    subtitle: 'Always here to help',
    initialMessage: 'Hello! How can I assist you today?',
  },
}

export const WithMemory: Story = {
  args: {
    title: 'Memory Bot',
    subtitle: 'I remember things!',
    initialMessage: 'Hi! I have long-term memory enabled.',
    memoryConfig: {
      enabled: true,
      strategy: 'vector-store',
    },
  },
}

export const Optimized: Story = {
  args: {
    title: 'Efficient Bot',
    subtitle: 'Token Optimized',
    initialMessage: 'I am optimized to save tokens.',
    optimizationConfig: {
      enabled: true,
      targetTokens: 1000,
      strategy: 'hybrid',
    },
  },
}
