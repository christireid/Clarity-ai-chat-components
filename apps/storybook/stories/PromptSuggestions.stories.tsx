import type { Meta, StoryObj } from '@storybook/react'
import { PromptSuggestions, type PromptSuggestion } from '@clarity-chat/react'
import { SparklesIcon, CodeIcon, FileTextIcon, MessageSquareIcon } from 'lucide-react'

const meta: Meta<typeof PromptSuggestions> = {
  title: 'Components/PromptSuggestions',
  component: PromptSuggestions,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
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
    emptyState: <div className="text-sm text-muted-foreground">No suggestions available</div>,
  },
}
