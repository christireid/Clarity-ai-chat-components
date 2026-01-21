import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'PromptSuggestionsEnhanced - Clarity Chat Components',
  description:
    'ML-based prompt suggestions with personalization, A/B testing, and effectiveness tracking.',
}

const props: Prop[] = [
  {
    name: 'messages',
    type: 'Message[]',
    required: true,
    description: 'Array of conversation messages for context-aware suggestions',
  },
  {
    name: 'onSelect',
    type: '(suggestion: { id: string; text: string; type: string; confidence?: number }) => void',
    required: true,
    description: 'Callback when a suggestion is selected',
  },
  {
    name: 'config',
    type: 'Partial<SuggestionRankingConfig>',
    description: 'Configuration for ML-based ranking and personalization',
  },
  {
    name: 'suggestionType',
    type: '"starter" | "follow-up" | "quick-reply" | "template"',
    description:
      'Type of suggestions to show (inherited from PromptSuggestions)',
  },
  {
    name: 'layout',
    type: '"chips" | "cards" | "list"',
    description:
      'Layout style for suggestions (inherited from PromptSuggestions)',
  },
  {
    name: 'isLoading',
    type: 'boolean',
    description: 'Show loading state (inherited from PromptSuggestions)',
  },
  {
    name: 'maxSuggestions',
    type: 'number',
    description:
      'Maximum number of suggestions to show (inherited from PromptSuggestions)',
  },
  {
    name: 'emptyState',
    type: 'React.ReactNode',
    description: 'Custom empty state (inherited from PromptSuggestions)',
  },
  {
    name: 'showCategories',
    type: 'boolean',
    description:
      'Show suggestion categories (inherited from PromptSuggestions)',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes',
  },
]

const configProps: Prop[] = [
  {
    name: 'rankingModel',
    type: '{ type: "ml" | "rule-based" | "hybrid", provider?: "openai" | "cohere" | "anthropic" | "custom", endpoint?: string, apiKey?: string }',
    description: 'ML-based ranking configuration',
  },
  {
    name: 'features',
    type: '{ conversationContext: boolean, userHistory: boolean, timeOfDay: boolean, previousSelections: boolean }',
    description: 'Features to enable for ranking',
  },
  {
    name: 'fallback',
    type: '"rule-based" | "random" | "frequency"',
    description: 'Fallback strategy when ML is unavailable',
  },
  {
    name: 'enableABTesting',
    type: 'boolean',
    description: 'Enable A/B testing framework',
  },
  {
    name: 'trackEffectiveness',
    type: 'boolean',
    description: 'Track suggestion effectiveness metrics',
  },
]

export default function PromptSuggestionsEnhancedPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>PromptSuggestionsEnhanced</h1>
        <p className="docs-lead">
          ML-based prompt suggestions with personalization, A/B testing, and
          2-3x higher click-through rates.
        </p>
      </div>

      <YouWillLearn
        items={[
          'How to use ML-based suggestion ranking',
          'Configure personalization features',
          'Set up A/B testing for suggestions',
          'Track suggestion effectiveness',
          'Handle fallback strategies',
        ]}
      />

      <Callout type="info" className="my-6">
        <p>
          <strong>New in 2025:</strong> This enhanced version provides ML-based
          ranking with personalization, resulting in 2-3x higher click-through
          rates compared to basic suggestions.
        </p>
      </Callout>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>Use the component with the enhanced hook for ML-based ranking:</p>
        <CodePlayground
          initialCode={`import { PromptSuggestionsEnhanced, usePromptSuggestionsEnhanced } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

function ChatWithSuggestions() {
  const [messages, setMessages] = React.useState<Message[]>([])
  
  // Note: suggestions is a Promise<PromptSuggestion[]>
  // The component handles unwrapping internally
  const { suggestions, trackInteraction, stats } = usePromptSuggestionsEnhanced(messages, {
    rankingModel: { type: 'hybrid', provider: 'openai' },
    features: {
      conversationContext: true,
      userHistory: true,
      timeOfDay: true,
      previousSelections: true,
    },
    enableABTesting: true,
    trackEffectiveness: true,
  })

  return (
    <div className="p-4">
      <PromptSuggestionsEnhanced
        messages={messages}
        config={{
          rankingModel: { type: 'hybrid' },
          features: {
            conversationContext: true,
            userHistory: true,
            timeOfDay: true,
            previousSelections: true,
          },
        }}
        onSelect={(suggestion) => {
          trackInteraction(suggestion, true)
          // Handle suggestion selection
          setMessages([...messages, { role: 'user', content: suggestion.text }])
        }}
      />
    </div>
  )
}

render(<ChatWithSuggestions />)`}
        />
      </section>

      <section className="docs-section">
        <h2>ML-Based Ranking</h2>
        <p>Configure ML-based ranking for intelligent suggestion ordering:</p>
        <CodePlayground
          initialCode={`import { PromptSuggestionsEnhanced } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

function MLRankedSuggestions({ messages }: { messages: Message[] }) {
  const handleSelect = (suggestion: { id: string; text: string; type: string }) => {
    console.log('Selected:', suggestion.text)
    // Handle suggestion selection
  }

  return (
    <PromptSuggestionsEnhanced
      messages={messages}
      config={{
        rankingModel: {
          type: 'ml',
          provider: 'openai',
          // Note: apiKey should be set server-side or via secure config
        },
        features: {
          conversationContext: true,
          userHistory: true,
          timeOfDay: false,
          previousSelections: true,
        },
        fallback: 'rule-based',
      }}
      onSelect={handleSelect}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Personalization</h2>
        <p>Enable personalization features to learn from user behavior:</p>
        <CodePlayground
          initialCode={`import { PromptSuggestionsEnhanced } from '@clarity-chat/react'

function PersonalizedSuggestions({ messages }: { messages: Message[] }) {
  return (
    <PromptSuggestionsEnhanced
      messages={messages}
      config={{
        rankingModel: { type: 'hybrid' },
        features: {
          conversationContext: true,  // Use conversation context
          userHistory: true,          // Learn from user history
          timeOfDay: true,            // Consider time patterns
          previousSelections: true,   // Track what user clicks
        },
        trackEffectiveness: true,
      }}
      onSelect={(suggestion) => {
        // Suggestions improve over time based on user behavior
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>A/B Testing</h2>
        <p>Enable A/B testing to compare suggestion strategies:</p>
        <CodePlayground
          initialCode={`import { PromptSuggestionsEnhanced } from '@clarity-chat/react'

function ABTestedSuggestions({ messages }: { messages: Message[] }) {
  const { abVariant, stats } = usePromptSuggestionsEnhanced(messages, {
    enableABTesting: true,
    trackEffectiveness: true,
  })

  return (
    <>
      <PromptSuggestionsEnhanced
        messages={messages}
      config={{
        rankingModel: { type: 'hybrid' },
        features: {
          conversationContext: true,
          userHistory: true,
          timeOfDay: true,
          previousSelections: true,
        },
        enableABTesting: true,  // Automatically splits users into control/experiment
        trackEffectiveness: true,
      }}
        onSelect={(suggestion) => {
          // Track which variant performs better
          console.log('Variant:', abVariant, 'CTR:', stats.clickThroughRate)
        }}
      />
    </>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Effectiveness Tracking</h2>
        <p>Track suggestion effectiveness metrics:</p>
        <CodePlayground
          initialCode={`import { PromptSuggestionsEnhanced, usePromptSuggestionsEnhanced } from '@clarity-chat/react'

function TrackedSuggestions({ messages }: { messages: Message[] }) {
  const { suggestions, trackInteraction, stats } = usePromptSuggestionsEnhanced(messages, {
    trackEffectiveness: true,
  })

  React.useEffect(() => {
    console.log('Stats:', {
      clickThroughRate: stats.clickThroughRate,
      totalInteractions: stats.totalInteractions,
      averageConfidence: stats.averageConfidence,
    })
  }, [stats])

  return (
    <PromptSuggestionsEnhanced
      messages={messages}
      config={{ trackEffectiveness: true }}
      onSelect={(suggestion) => {
        trackInteraction(suggestion.id, true)
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Fallback Strategies</h2>
        <p>Configure fallback behavior when ML is unavailable:</p>
        <CodePlayground
          initialCode={`import { PromptSuggestionsEnhanced } from '@clarity-chat/react'

function FallbackSuggestions({ messages }: { messages: Message[] }) {
  return (
    <PromptSuggestionsEnhanced
      messages={messages}
      config={{
        rankingModel: { type: 'ml' },
        fallback: 'rule-based',  // Use rule-based when ML fails
        // Options: 'rule-based' | 'random' | 'frequency'
      }}
      onSelect={(suggestion) => {
        // Gracefully degrades to rule-based ranking if ML fails
        console.log('Selected:', suggestion.text)
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <PropsTable props={props} />
      </section>

      <section className="docs-section">
        <h2>Configuration Options</h2>
        <PropsTable props={configProps} />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>
            Start with <code>hybrid</code> ranking for best balance of
            performance and accuracy
          </li>
          <li>
            Enable <code>trackEffectiveness</code> to monitor suggestion
            performance
          </li>
          <li>Use A/B testing to compare different ranking strategies</li>
          <li>Configure fallback strategies for reliability</li>
          <li>Enable personalization features for better user experience</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/reference/components/prompt-suggestions">
              PromptSuggestions
            </a>{' '}
            - Basic version
          </li>
          <li>
            <a href="/guides/performance">Performance Guide</a> - Tracking and
            analytics
          </li>
          <li>
            <a href="/guides/token-optimization">Token Optimization Guide</a> -
            Cost optimization strategies
          </li>
        </ul>
      </section>
    </div>
  )
}
