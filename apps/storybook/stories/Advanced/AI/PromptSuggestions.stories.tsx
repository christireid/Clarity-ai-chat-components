import type { Meta, StoryObj } from '@storybook/react-vite'
import { PromptSuggestions, type PromptSuggestion } from '@clarity-chat/react'
import {
  SparklesIcon,
  CodeIcon,
  FileTextIcon,
  MessageSquareIcon,
} from 'lucide-react'
import { expect, within } from 'storybook/test'

/**
 * **PromptSuggestions Component**
 *
 * Display prompt suggestions for starting or continuing conversations.
 * Supports starter prompts and follow-up prompts with icons and categories.
 *
 * **Key Features:**
 * - Starter prompts for new conversations
 * - Follow-up prompts for continuing
 * - Icons and categories
 * - Usage statistics
 * - Confidence scores
 * - Accessible with keyboard navigation
 *
 * **Use Cases:**
 * - Chat interfaces
 * - AI assistants
 * - Prompt libraries
 * - User onboarding
 */
const meta: Meta<typeof PromptSuggestions> = {
  title: 'Advanced/AI/PromptSuggestions',
  component: PromptSuggestions,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Display prompt suggestions for starting or continuing conversations.
Supports starter prompts and follow-up prompts with icons and categories.

## Features

- ✅ Starter prompts for new conversations
- ✅ Follow-up prompts for continuing
- ✅ Icons and categories
- ✅ Usage statistics
- ✅ Confidence scores
- ✅ Accessible with keyboard navigation
- ✅ Smooth animations

## Basic Usage

\`\`\`tsx
<PromptSuggestions
  suggestions={prompts}
  onSelect={(suggestion) => {
    console.log('Selected:', suggestion)
  }}
/>
\`\`\`
        `,
      },
    },
    status: {
      type: 'stable',
    },
    badges: ['stable', 'tested', 'accessible'],
  },
  tags: ['autodocs', 'stable'],
  argTypes: {
    suggestions: {
      description: 'Array of prompt suggestions',
      control: { type: 'object' },
    },
    onSelect: {
      description: 'Callback when a prompt is selected',
      action: 'prompt-selected',
    },
    showIcons: {
      description: 'Show icons for prompts',
      control: 'boolean',
    },
    showUsageCount: {
      description: 'Show usage count statistics',
      control: 'boolean',
    },
    maxSuggestions: {
      description: 'Maximum number of suggestions to display',
      control: { type: 'number', min: 1, max: 20 },
    },
  },
}

export default meta
type Story = StoryObj<typeof PromptSuggestions>

const starterPrompts: PromptSuggestion[] = [
  {
    id: 'starter-1',
    text: 'Help me get started with AI',
    label: 'Get Started',
    description: 'Begin a new conversation',
    type: 'starter',
    icon: <SparklesIcon className="h-4 w-4" />,
    category: 'General',
  },
  {
    id: 'starter-2',
    text: 'What can you help me with?',
    label: 'Capabilities',
    description: 'Learn about available features',
    type: 'starter',
    icon: <MessageSquareIcon className="h-4 w-4" />,
    category: 'General',
  },
  {
    id: 'starter-3',
    text: 'Write a function to sort an array',
    label: 'Code Helper',
    description: 'Get coding assistance',
    type: 'starter',
    icon: <CodeIcon className="h-4 w-4" />,
    category: 'Development',
    usageCount: 150,
  },
  {
    id: 'starter-4',
    text: 'Summarize this document',
    label: 'Document Summarizer',
    description: 'Analyze and summarize text',
    type: 'starter',
    icon: <FileTextIcon className="h-4 w-4" />,
    category: 'Documentation',
    usageCount: 89,
  },
]

const followUpPrompts: PromptSuggestion[] = [
  {
    id: 'follow-up-1',
    text: 'Can you explain this in more detail?',
    label: 'Explain More',
    type: 'follow-up',
    confidence: 0.85,
    keywords: ['explain', 'detail'],
  },
  {
    id: 'follow-up-2',
    text: 'Show me an example',
    label: 'Show Example',
    type: 'follow-up',
    confidence: 0.78,
    keywords: ['example', 'demo'],
  },
  {
    id: 'follow-up-3',
    text: 'What are the alternatives?',
    label: 'Alternatives',
    type: 'follow-up',
    confidence: 0.72,
    keywords: ['alternatives', 'options'],
  },
  {
    id: 'follow-up-4',
    text: 'Tell me more',
    label: 'More Info',
    type: 'follow-up',
    confidence: 0.65,
  },
]

export const StarterPrompts: Story = {
  args: {
    suggestions: starterPrompts,
    onSelect: (suggestion) => {
      console.log('Selected:', suggestion.text)
    },
    suggestionType: 'starter',
    layout: 'chips',
    showCategories: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test starter prompt labels render
    await expect(canvas.getByText('Get Started')).toBeInTheDocument()
    await expect(canvas.getByText('Code Helper')).toBeInTheDocument()
    await expect(canvas.getByText('Document Summarizer')).toBeInTheDocument()

    // Test categories display
    await expect(canvas.getByText('General')).toBeInTheDocument()
    await expect(canvas.getByText('Development')).toBeInTheDocument()
  },
}

export const FollowUpPrompts: Story = {
  args: {
    suggestions: followUpPrompts,
    onSelect: (suggestion) => {
      console.log('Selected:', suggestion.text)
    },
    suggestionType: 'follow-up',
    layout: 'chips',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test follow-up prompt labels render
    await expect(canvas.getByText('Explain More')).toBeInTheDocument()
    await expect(canvas.getByText('Show Example')).toBeInTheDocument()
    await expect(canvas.getByText('Alternatives')).toBeInTheDocument()

    // Test multiple prompts are clickable
    const buttons = canvas.getAllByRole('button')
    await expect(buttons.length).toBeGreaterThanOrEqual(3)
  },
}

export const CardsLayout: Story = {
  args: {
    suggestions: starterPrompts,
    onSelect: (suggestion) => {
      console.log('Selected:', suggestion.text)
    },
    layout: 'cards',
    showCategories: false,
  },
}

export const ListLayout: Story = {
  args: {
    suggestions: followUpPrompts,
    onSelect: (suggestion) => {
      console.log('Selected:', suggestion.text)
    },
    layout: 'list',
  },
}

export const WithCategories: Story = {
  args: {
    suggestions: starterPrompts,
    onSelect: (suggestion) => {
      console.log('Selected:', suggestion.text)
    },
    layout: 'chips',
    showCategories: true,
    maxSuggestions: 6,
  },
}

export const LoadingState: Story = {
  args: {
    suggestions: [],
    onSelect: () => {},
    isLoading: true,
    maxSuggestions: 4,
  },
}

export const EmptyState: Story = {
  args: {
    suggestions: [],
    onSelect: () => {},
    isLoading: false,
    emptyState: (
      <div className="text-sm text-muted-foreground">
        No suggestions available
      </div>
    ),
  },
}
