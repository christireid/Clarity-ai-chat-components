/**
 * PromptComposer Storybook Stories
 *
 * Interactive documentation and visual testing.
 */

import type { Meta, StoryObj } from '@storybook/react'
import { PromptComposer } from './PromptComposer'
import { createContextItem } from '../../hooks/prompt-composer/context-utils'
import type { ContextProvider, Suggestion } from '../../hooks/prompt-composer/types'

const meta: Meta<typeof PromptComposer> = {
  title: 'Components/PromptComposer',
  component: PromptComposer,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Progressive disclosure prompt system with 90% token savings through smart context expansion.',
      },
    },
  },
  argTypes: {
    api: {
      control: 'text',
      description: 'API endpoint for chat submissions',
    },
    tokenBudget: {
      control: { type: 'number', min: 1000, max: 128000, step: 1000 },
      description: 'Maximum tokens allowed (default: 8000)',
    },
    showTokenBudget: {
      control: 'boolean',
      description: 'Show token usage indicator',
    },
    showTokenSavings: {
      control: 'boolean',
      description: 'Show token savings statistics',
    },
    showContextBreakdown: {
      control: 'boolean',
      description: 'Show detailed context breakdown',
    },
    placeholder: {
      control: 'text',
      description: 'Input placeholder text',
    },
  },
}

export default meta
type Story = StoryObj<typeof PromptComposer>

// ============================================================================
// Basic Story
// ============================================================================

export const Default: Story = {
  args: {
    api: '/api/chat',
    tokenBudget: 8000,
    placeholder: 'Ask anything...',
    showTokenBudget: true,
    onSubmit: (message) => {
      console.log('Submitted:', message)
      alert(`Message submitted!\nTokens: ${message.metadata?.totalTokens}`)
    },
  },
}

// ============================================================================
// With Token Budget
// ============================================================================

export const WithTokenBudget: Story = {
  args: {
    api: '/api/chat',
    tokenBudget: 8000,
    showTokenBudget: true,
    showTokenSavings: false,
    placeholder: 'Type to see token budget...',
  },
}

// ============================================================================
// With Token Savings
// ============================================================================

export const WithTokenSavings: Story = {
  args: {
    api: '/api/chat',
    tokenBudget: 8000,
    showTokenBudget: true,
    showTokenSavings: true,
    showContextBreakdown: true,
    placeholder: 'Add context items to see savings...',
  },
}

// ============================================================================
// With Suggestions
// ============================================================================

const mockSuggestions: Suggestion[] = [
  {
    id: '1',
    type: 'starter',
    text: 'Explain this code',
    icon: '📖',
  },
  {
    id: '2',
    type: 'starter',
    text: 'Write tests for...',
    icon: '🧪',
  },
  {
    id: '3',
    type: 'starter',
    text: 'Debug issue',
    icon: '🐛',
  },
  {
    id: '4',
    type: 'starter',
    text: 'Refactor to improve performance',
    icon: '🔧',
  },
  {
    id: '5',
    type: 'starter',
    text: 'Generate documentation',
    icon: '📝',
  },
  {
    id: '6',
    type: 'starter',
    text: 'Review security',
    icon: '🔒',
  },
]

export const WithSuggestions: Story = {
  args: {
    api: '/api/chat',
    tokenBudget: 8000,
    suggestions: mockSuggestions,
    showTokenBudget: true,
    placeholder: 'Click to see suggestions...',
    onSuggestionClick: (suggestion) => {
      console.log('Suggestion clicked:', suggestion)
    },
  },
}

// ============================================================================
// With Context Providers
// ============================================================================

const mockFileProvider: ContextProvider = {
  type: 'file',
  search: async (query) => {
    const mockFiles = [
      { name: 'Button.tsx', path: 'src/components/Button.tsx', lines: 250 },
      { name: 'Input.tsx', path: 'src/components/Input.tsx', lines: 180 },
      { name: 'Modal.tsx', path: 'src/components/Modal.tsx', lines: 320 },
      { name: 'utils.ts', path: 'src/utils/utils.ts', lines: 120 },
    ]

    return mockFiles
      .filter((file) =>
        file.name.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5)
      .map((file) =>
        createContextItem({
          id: file.path,
          type: 'file',
          label: file.name,
          description: file.path,
          summary: `${file.name} - ${file.lines} lines, exports 3 components`,
          preview: `File: ${file.path}\nLines: ${file.lines}\n\nExports:\n- Component\n- Props\n- Variants`,
          full: `// Full file content\n// ${file.lines} lines of code\n// Located at ${file.path}\n\n[Full content would be here]`,
        })
      )
  },
  priority: 80,
}

export const WithContextProviders: Story = {
  args: {
    api: '/api/chat',
    tokenBudget: 8000,
    features: {
      context: {
        triggers: ['@'],
        providers: [mockFileProvider],
        fuzzySearch: true,
      },
    },
    showTokenBudget: true,
    showTokenSavings: true,
    showContextBreakdown: true,
    placeholder: 'Type @ to search files...',
  },
  parameters: {
    docs: {
      description: {
        story: 'Type `@` to trigger context search and add file mentions.',
      },
    },
  },
}

// ============================================================================
// Full Featured
// ============================================================================

export const FullFeatured: Story = {
  args: {
    api: '/api/chat',
    tokenBudget: 8000,
    features: {
      context: {
        triggers: ['@'],
        providers: [mockFileProvider],
      },
      suggestions: true,
      attachments: {
        maxFiles: 5,
        maxSize: 10 * 1024 * 1024, // 10MB
      },
      settings: true,
    },
    suggestions: mockSuggestions,
    showTokenBudget: true,
    showTokenSavings: true,
    showContextBreakdown: true,
    placeholder: 'Full-featured prompt composer...',
  },
}

// ============================================================================
// Large Token Budget
// ============================================================================

export const LargeTokenBudget: Story = {
  args: {
    api: '/api/chat',
    tokenBudget: 128000, // Claude 3 Opus context window
    showTokenBudget: true,
    placeholder: 'Large context window (128K tokens)...',
  },
}

// ============================================================================
// Small Token Budget
// ============================================================================

export const SmallTokenBudget: Story = {
  args: {
    api: '/api/chat',
    tokenBudget: 2000,
    showTokenBudget: true,
    showTokenSavings: true,
    placeholder: 'Small budget (2K tokens)...',
  },
  parameters: {
    docs: {
      description: {
        story: 'See how the UI adapts to tight token budgets.',
      },
    },
  },
}

// ============================================================================
// Dark Mode
// ============================================================================

export const DarkMode: Story = {
  args: {
    api: '/api/chat',
    tokenBudget: 8000,
    showTokenBudget: true,
    showTokenSavings: true,
    suggestions: mockSuggestions,
    placeholder: 'Dark mode example...',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <div className="bg-gray-950 min-h-screen p-8">
          <Story />
        </div>
      </div>
    ),
  ],
}

// ============================================================================
// Compact Variant
// ============================================================================

export const Compact: Story = {
  args: {
    api: '/api/chat',
    tokenBudget: 8000,
    showTokenBudget: false,
    placeholder: 'Compact variant...',
    className: 'max-w-md',
  },
}

// ============================================================================
// With Error State
// ============================================================================

export const WithError: Story = {
  args: {
    api: '/api/chat',
    tokenBudget: 8000,
    showTokenBudget: true,
    placeholder: 'Try submitting to see error...',
    onSubmit: async () => {
      throw new Error('Failed to send message. Please try again.')
    },
  },
}

// ============================================================================
// Responsive Mobile
// ============================================================================

export const Mobile: Story = {
  args: {
    api: '/api/chat',
    tokenBudget: 8000,
    showTokenBudget: true,
    suggestions: mockSuggestions,
    placeholder: 'Mobile responsive...',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

// ============================================================================
// Responsive Tablet
// ============================================================================

export const Tablet: Story = {
  args: {
    api: '/api/chat',
    tokenBudget: 8000,
    showTokenBudget: true,
    showTokenSavings: true,
    suggestions: mockSuggestions,
    placeholder: 'Tablet responsive...',
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
}
