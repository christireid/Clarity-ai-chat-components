import type { Meta, StoryObj } from '@storybook/react-vite'
import { FollowUpSuggestions } from '@clarity-chat/react'
import type { FollowUpSuggestion } from '@clarity-chat/react'
import { expect, within } from 'storybook/test'

/**
 * **FollowUpSuggestions Component**
 *
 * Display contextual follow-up suggestions to keep conversations flowing.
 * Supports grid and list layouts with loading states.
 *
 * **Key Features:**
 * - Contextual suggestions based on conversation
 * - Grid and list layouts
 * - Loading states
 * - Confidence scores
 * - Keyword matching
 * - Accessible with keyboard navigation
 *
 * **Use Cases:**
 * - Chat interfaces
 * - AI assistants
 * - Conversation flows
 * - User guidance
 */
const meta: Meta<typeof FollowUpSuggestions> = {
  title: 'Advanced/AI/FollowUpSuggestions',
  component: FollowUpSuggestions,
  tags: ['autodocs', 'stable'],
  parameters: {
    docs: {
      description: {
        component: `
Display contextual follow-up suggestions to keep conversations flowing.
Supports grid and list layouts with loading states.

## Features

- ✅ Contextual suggestions based on conversation
- ✅ Grid and list layouts
- ✅ Loading states
- ✅ Confidence scores
- ✅ Keyword matching
- ✅ Accessible with keyboard navigation
- ✅ Smooth animations

## Basic Usage

\`\`\`tsx
<FollowUpSuggestions
  suggestions={suggestions}
  onSelect={(suggestion) => {
    console.log('Selected:', suggestion)
  }}
  layout="grid"
/>
\`\`\`
        `,
      },
    },
    layout: 'padded',
    status: {
      type: 'stable',
    },
    badges: ['stable', 'tested', 'accessible'],
  },
  argTypes: {
    suggestions: {
      description: 'Array of follow-up suggestions',
      control: { type: 'object' },
    },
    onSelect: {
      description: 'Callback when a suggestion is selected',
      action: 'suggestion-selected',
    },
    layout: {
      description: 'Layout type (grid or list)',
      control: 'select',
      options: ['grid', 'list'],
    },
    isLoading: {
      description: 'Show loading state',
      control: 'boolean',
    },
    maxSuggestions: {
      description: 'Maximum number of suggestions to display',
      control: { type: 'number', min: 1, max: 10 },
    },
  },
}

export default meta
type Story = StoryObj<typeof FollowUpSuggestions>

const mockSuggestions: FollowUpSuggestion[] = [
  {
    id: '1',
    title: 'Advanced/AI/FollowUpSuggestions',
    description: 'Learn about useState, useEffect, and more',
    keywords: ['hooks', 'react', 'state'],
    confidence: 0.95,
  },
  {
    id: '2',
    title: 'Advanced/AI/FollowUpSuggestions',
    description: 'See practical examples in action',
    keywords: ['examples', 'code', 'tutorial'],
    confidence: 0.88,
  },
  {
    id: '3',
    title: 'Advanced/AI/FollowUpSuggestions',
    description: 'Deep dive into type system',
    keywords: ['typescript', 'types', 'explanation'],
    confidence: 0.82,
  },
  {
    id: '4',
    title: 'Advanced/AI/FollowUpSuggestions',
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test suggestions render
    await expect(
      canvas.getByText('How do I use React hooks?')
    ).toBeInTheDocument()
    await expect(canvas.getByText('Show me code examples')).toBeInTheDocument()
    await expect(
      canvas.getByText('Explain TypeScript types')
    ).toBeInTheDocument()

    // Test descriptions render
    await expect(canvas.getByText(/Learn about useState/)).toBeInTheDocument()
  },
}

export const GridLayout: Story = {
  args: {
    suggestions: mockSuggestions,
    layout: 'grid',
    onSelect: (suggestion) => console.log('Selected:', suggestion),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test suggestions render in grid layout
    await expect(
      canvas.getByText('How do I use React hooks?')
    ).toBeInTheDocument()
    await expect(canvas.getByText('Best practices guide')).toBeInTheDocument()

    // Test all 4 suggestions are visible
    const suggestions = canvas.getAllByRole('button')
    await expect(suggestions.length).toBeGreaterThanOrEqual(4)
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
    title: 'Advanced/AI/FollowUpSuggestions',
    subtitle: 'Advanced/AI/FollowUpSuggestions',
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
