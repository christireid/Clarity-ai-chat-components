import type { Meta, StoryObj } from '@storybook/react'
import { FollowUpSuggestions } from '@clarity-chat/react'

/**
 * FollowUpSuggestions displays suggested follow-up questions or actions.
 * 
 * **Key Features:**
 * - Smart contextual suggestions
 * - Click to auto-fill
 * - Customizable appearance
 * - Responsive layout
 * 
 * **Use Cases:**
 * - Guiding conversations
 * - Reducing user effort
 * - Improving engagement
 * - Discovering features
 */
const meta = {
  title: 'Components/FollowUpSuggestions',
  component: FollowUpSuggestions,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Suggest follow-up questions or actions to guide the conversation.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '600px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FollowUpSuggestions>

export default meta
type Story = StoryObj<typeof meta>

const suggestions = [
  'Tell me more about this',
  'Can you explain that differently?',
  'What are the best practices?',
  'Show me an example',
]

export const Default: Story = {
  args: {
    suggestions,
    onSuggestionClick: (suggestion: string) => {
      console.log('Clicked:', suggestion)
    },
  },
}

export const WithIcons: Story = {
  args: {
    suggestions: [
      { text: 'Explain in detail', icon: '📖' },
      { text: 'Show code example', icon: '💻' },
      { text: 'Compare options', icon: '⚖️' },
      { text: 'Best practices', icon: '✨' },
    ],
    onSuggestionClick: (suggestion: any) => {
      console.log('Clicked:', suggestion)
    },
  },
}

export const TechnicalQuestions: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-700">
          React hooks provide a way to use state and lifecycle features in function components.
        </p>
      </div>
      
      <FollowUpSuggestions
        suggestions={[
          'How do I use useState?',
          'What is useEffect for?',
          'Show me custom hooks examples',
          'When should I use useCallback?',
        ]}
        onSuggestionClick={(s: string) => alert(`You asked: ${s}`)}
      />
    </div>
  ),
}

export const ProductSupport: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm font-semibold mb-2">How can I help you today?</p>
        <p className="text-sm text-gray-600">
          I'm here to assist with your order, account, or product questions.
        </p>
      </div>
      
      <FollowUpSuggestions
        suggestions={[
          '📦 Track my order',
          '💰 Request a refund',
          '🔄 Return an item',
          '📧 Contact support',
        ]}
        onSuggestionClick={(s: string) => console.log(s)}
      />
    </div>
  ),
}

export const ContextualSuggestions: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-100 px-4 py-3 border-b">
          <h3 className="font-semibold">Chat Assistant</h3>
        </div>
        
        <div className="p-4 space-y-3">
          <div className="flex justify-end">
            <div className="max-w-xs bg-blue-500 text-white px-4 py-2 rounded-lg">
              How do I reset my password?
            </div>
          </div>
          
          <div className="flex justify-start">
            <div className="max-w-md bg-gray-100 px-4 py-2 rounded-lg">
              <p className="text-sm mb-2">
                You can reset your password by clicking the "Forgot Password" link on the login page,
                then following the instructions sent to your email.
              </p>
            </div>
          </div>
          
          <FollowUpSuggestions
            suggestions={[
              'I didn\'t receive the email',
              'How do I change my email address?',
              'What if I don\'t remember my email?',
              'Security tips for passwords',
            ]}
            onSuggestionClick={(s: string) => alert(s)}
          />
        </div>
      </div>
    </div>
  ),
}

export const CompactLayout: Story = {
  args: {
    suggestions: ['Yes', 'No', 'Tell me more', 'Start over'],
    layout: 'compact',
    onSuggestionClick: (s: string) => console.log(s),
  },
}

export const GridLayout: Story = {
  args: {
    suggestions: [
      'Getting Started',
      'Documentation',
      'Examples',
      'API Reference',
      'Community',
      'Support',
    ],
    layout: 'grid',
    onSuggestionClick: (s: string) => console.log(s),
  },
}
