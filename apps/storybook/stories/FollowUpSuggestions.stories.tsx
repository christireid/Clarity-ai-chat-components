import type { Meta, StoryObj } from '@storybook/react'
import { FollowUpSuggestions } from '@clarity-chat/react'
import type { FollowUpSuggestion } from '@clarity-chat/react'

const meta: Meta<typeof FollowUpSuggestions> = {
  title: 'Components/FollowUpSuggestions',
  component: FollowUpSuggestions,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Display contextual follow-up suggestions to keep conversations flowing. Supports grid and list layouts with loading states.',
      },
    },
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof FollowUpSuggestions>

const mockSuggestions: FollowUpSuggestion[] = [
  {
    id: '1',
    title: 'How do I use React hooks?',
    description: 'Learn about useState, useEffect, and more',
    keywords: ['hooks', 'react', 'state'],
    confidence: 0.95,
  },
  {
    id: '2',
    title: 'Show me code examples',
    description: 'See practical examples in action',
    keywords: ['examples', 'code', 'tutorial'],
    confidence: 0.88,
  },
  {
    id: '3',
    title: 'Explain TypeScript types',
    description: 'Deep dive into type system',
    keywords: ['typescript', 'types', 'explanation'],
    confidence: 0.82,
  },
  {
    id: '4',
    title: 'Best practices guide',
    description: 'Learn industry standards',
    keywords: ['best practices', 'guide', 'patterns'],
    confidence: 0.75,
  },
]

export const Default: Story = {
  args: {
    suggestions: mockSuggestions,
    onSelect: (suggestion) => {
      console.log('Selected:', suggestion.title)
      alert(`Selected: ${suggestion.title}`)
    },
  },
}

export const GridLayout: Story = {
  args: {
    suggestions: mockSuggestions,
    layout: 'grid',
    onSelect: (suggestion) => console.log('Selected:', suggestion),
  },
}

export const ListLayout: Story = {
  args: {
    suggestions: mockSuggestions,
    layout: 'list',
    onSelect: (suggestion) => console.log('Selected:', suggestion),
  },
}

export const Loading: Story = {
  args: {
    suggestions: [],
    isLoading: true,
    loadingCount: 4,
    onSelect: () => {},
  },
}

export const CustomTitle: Story = {
  args: {
    suggestions: mockSuggestions,
    title: 'What would you like to know next?',
    subtitle: 'Choose a topic to continue exploring',
    onSelect: (suggestion) => console.log('Selected:', suggestion),
  },
}

export const EmptyState: Story = {
  args: {
    suggestions: [],
    emptyState: (
      <div className="text-center py-8 text-muted-foreground">
        <p>No suggestions available at this time.</p>
      </div>
    ),
    onSelect: () => {},
  },
}

export const ManySuggestions: Story = {
  args: {
    suggestions: Array.from({ length: 12 }, (_, i) => ({
      id: `suggestion-${i}`,
      title: `Suggestion ${i + 1}`,
      description: `This is suggestion number ${i + 1}`,
      keywords: [`keyword${i}`],
      confidence: 0.9 - i * 0.05,
    })),
    layout: 'grid',
    onSelect: (suggestion) => console.log('Selected:', suggestion),
  },
}
