import type { Meta, StoryObj } from '@storybook/react-vite'
import { WorkflowSuggestionList } from '@clarity-chat/react'
import type { WorkflowSuggestion } from '@clarity-chat/react'

const meta: Meta<typeof WorkflowSuggestionList> = {
  title: 'Advanced/AI/WorkflowSuggestionList',
  component: WorkflowSuggestionList,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Present curated workflows that help users accomplish routine tasks with minimal prompting. Great for onboarding and task automation.',
      },
    },
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof WorkflowSuggestionList>

const mockWorkflows: WorkflowSuggestion[] = [
  {
    id: '1',
    name: 'Set Up New Project',
    description:
      'Initialize a new project with best practices and configuration',
    steps: [
      'Create project structure',
      'Configure build tools',
      'Set up testing framework',
      'Initialize version control',
    ],
    estimatedTime: '5 min',
    audience: 'Developers',
    tags: ['setup', 'project', 'configuration'],
  },
  {
    id: '2',
    name: 'Code Review Checklist',
    description: 'Complete code review with quality gates and standards',
    steps: [
      'Review code changes',
      'Check test coverage',
      'Verify documentation',
      'Approve or request changes',
    ],
    estimatedTime: '10 min',
    audience: 'Developers',
    tags: ['review', 'quality', 'process'],
  },
  {
    id: '3',
    name: 'Deploy to Production',
    description: 'Safe deployment workflow with rollback capabilities',
    steps: [
      'Run pre-deployment tests',
      'Create backup',
      'Deploy to staging',
      'Deploy to production',
      'Monitor and verify',
    ],
    estimatedTime: '15 min',
    audience: 'DevOps',
    tags: ['deployment', 'production', 'devops'],
  },
]

export const Default: Story = {
  args: {
    workflows: mockWorkflows,
  },
}

export const WithActions: Story = {
  args: {
    workflows: mockWorkflows,
    onSelect: (workflow) => {
      console.log('Selected workflow:', workflow.name)
      alert(`Starting workflow: ${workflow.name}`)
    },
    onPreview: (workflow) => {
      console.log('Preview workflow:', workflow.name)
      alert(
        `Previewing: ${workflow.name}\n\nSteps:\n${workflow.steps.join('\n')}`
      )
    },
  },
}

export const Empty: Story = {
  args: {
    workflows: [],
  },
}

export const SingleWorkflow: Story = {
  args: {
    workflows: [mockWorkflows[0]],
  },
}

export const ManyWorkflows: Story = {
  args: {
    workflows: Array.from({ length: 8 }, (_, i) => ({
      id: `workflow-${i}`,
      name: `Workflow ${i + 1}`,
      description: `Description for workflow ${i + 1}`,
      steps: [`Step 1`, `Step 2`, `Step 3`],
      estimatedTime: `${(i + 1) * 5} min`,
      audience: i % 2 === 0 ? 'Developers' : 'Designers',
      tags: ['tag1', 'tag2'],
    })),
  },
}

export const CustomTitle: Story = {
  args: {
    workflows: mockWorkflows,
    title: 'Suggested Workflows',
    subtitle: 'Choose a workflow to get started quickly',
  },
}
