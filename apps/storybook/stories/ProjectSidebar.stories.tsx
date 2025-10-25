import type { Meta, StoryObj } from '@storybook/react'
import { ProjectSidebar } from '@clarity-chat/react'

const meta: Meta<typeof ProjectSidebar> = {
  title: 'Components/ProjectSidebar',
  component: ProjectSidebar,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ProjectSidebar>

const mockProjects = [
  { id: '1', name: 'React Tutorial', conversationCount: 5, lastActive: Date.now() - 3600000 },
  { id: '2', name: 'TypeScript Guide', conversationCount: 3, lastActive: Date.now() - 7200000 },
]

export const Default: Story = {
  args: { projects: mockProjects, activeProjectId: '1', onProjectSelect: (id) => console.log(id) },
}
