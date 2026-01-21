import type { Meta, StoryObj } from '@storybook/react-vite'
import { PromptLibrary } from '@clarity-chat/react'

const meta: Meta<typeof PromptLibrary> = {
  title: 'Advanced/AI/PromptLibrary',
  component: PromptLibrary,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PromptLibrary>

const mockPrompts = [
  {
    id: '1',
    title: 'Code Review Assistant',
    content: 'Review this code for best practices...',
    category: 'development',
  },
  {
    id: '2',
    title: 'Concept Explainer',
    content: 'Explain {concept} in simple terms...',
    category: 'education',
  },
]

export const Default: Story = {
  args: { prompts: mockPrompts, onPromptSelect: (p) => console.log(p) },
}
