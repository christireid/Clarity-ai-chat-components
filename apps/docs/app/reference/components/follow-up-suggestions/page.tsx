import React from 'react'
import { Metadata } from 'next'
import { ApiTable } from '@/components/Demo/ApiTable'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Follow-Up Suggestions - Clarity Chat Components',
  description:
    'Smart follow-up question suggestions to keep conversations flowing naturally.',
}

export default function FollowUpSuggestionsPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>Follow-Up Suggestions</h1>
        <p className="docs-lead">
          Smart follow-up questions that help users continue the conversation
          naturally. Like having a helpful friend who knows what to ask next.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          After the AI responds, show 3-5 suggested follow-up questions. It's
          like when Netflix suggests "You might also like..." but for
          conversations. Helps users who might be stuck thinking "what should I
          ask now?"
        </p>

        <Callout type="info" title="Why This Matters">
          Users often don't know what else to ask. Suggestions reduce friction
          and keep conversations flowing. This can increase engagement by 2-3x.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <CodePlayground
          code={`function SimpleSuggestions() {
  const suggestions = [
    {
      id: '1',
      title: 'Tell me more about the pricing',
      description: 'Learn about different pricing tiers'
    },
    {
      id: '2',
      title: 'How does it compare to competitors?',
      description: 'See competitive advantages'
    },
    {
      id: '3',
      title: 'Show me integration examples',
      description: 'View code samples'
    }
  ]

  const handleSelect = (suggestion) => {
    logger.debug('Selected:', suggestion.title)
    // In real app: add this as a new message
  }

  return (
    <FollowUpSuggestions
      suggestions={suggestions}
      onSelect={handleSelect}
    />
  )
}

render(<SimpleSuggestions />)`}
        />
      </section>

      <section className="docs-section">
        <h2>With Icons</h2>
        <p>Add visual icons to make suggestions more scannable.</p>
        <CodePlayground
          code={`function IconSuggestions() {
  const suggestions = [
    {
      id: '1',
      title: 'See code examples',
      description: 'Real-world integration code',
      icon: '💻'
    },
    {
      id: '2',
      title: 'View pricing details',
      description: 'Compare plans and features',
      icon: '💰'
    },
    {
      id: '3',
      title: 'Read customer stories',
      description: 'How others use this',
      icon: '⭐'
    },
    {
      id: '4',
      title: 'Check API limits',
      description: 'Rate limits and quotas',
      icon: '📊'
    }
  ]

  return (
    <FollowUpSuggestions
      suggestions={suggestions}
      onSelect={(s) => alert(\`Selected: \${s.title}\`)}
    />
  )
}

render(<IconSuggestions />)`}
        />
      </section>

      <section className="docs-section">
        <h2>With Confidence Scores</h2>
        <p>
          Show how relevant each suggestion is (useful for AI-generated
          suggestions).
        </p>
        <CodePlayground
          code={`function RankedSuggestions() {
  const suggestions = [
    {
      id: '1',
      title: 'What are the installation requirements?',
      description: 'Prerequisites and setup',
      confidence: 0.95,
      icon: '📦'
    },
    {
      id: '2',
      title: 'How do I handle errors?',
      description: 'Error handling patterns',
      confidence: 0.82,
      icon: '🐛'
    },
    {
      id: '3',
      title: 'Can I customize the theme?',
      description: 'Theming and styling options',
      confidence: 0.68,
      icon: '🎨'
    },
    {
      id: '4',
      title: 'What about TypeScript support?',
      description: 'Type definitions and usage',
      confidence: 0.45,
      icon: '📘'
    }
  ]

  return (
    <FollowUpSuggestions
      suggestions={suggestions}
      onSelect={(s) => logger.debug('Selected:', s)}
      title="You might want to ask"
      subtitle="AI-ranked by relevance to your conversation"
    />
  )
}

render(<RankedSuggestions />)`}
        />
      </section>

      <section className="docs-section">
        <h2>Layout Options</h2>
        <p>Choose between grid (default) or list layout.</p>
        <CodePlayground
          code={`import { useState } from 'react'

function LayoutOptions() {
  const [layout, setLayout] = useState('grid')

  const suggestions = [
    { id: '1', title: 'How do I get started?', icon: '🚀' },
    { id: '2', title: 'Show me examples', icon: '📝' },
    { id: '3', title: 'What are the limits?', icon: '⚡' },
    { id: '4', title: 'Can I export data?', icon: '💾' }
  ]

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={layout === 'grid' ? 'default' : 'outline'}
          onClick={() => setLayout('grid')}
        >
          Grid Layout
        </Button>
        <Button
          size="sm"
          variant={layout === 'list' ? 'default' : 'outline'}
          onClick={() => setLayout('list')}
        >
          List Layout
        </Button>
      </div>

      <FollowUpSuggestions
        suggestions={suggestions}
        layout={layout}
        onSelect={(s) => logger.debug(s.title)}
      />
    </div>
  )
}

render(<LayoutOptions />)`}
        />
      </section>

      <section className="docs-section">
        <h2>Loading State</h2>
        <p>Show skeleton placeholders while AI generates suggestions.</p>
        <CodePlayground
          code={`import { useState, useEffect } from 'react'

function LoadingSuggestions() {
  const [isLoading, setIsLoading] = useState(true)
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    // Simulate AI generating suggestions
    setTimeout(() => {
      setSuggestions([
        { id: '1', title: 'Explain that in simpler terms', icon: '💡' },
        { id: '2', title: 'Show me a code example', icon: '💻' },
        { id: '3', title: 'What are the limitations?', icon: '⚠️' }
      ])
      setIsLoading(false)
    }, 2000)
  }, [])

  return (
    <FollowUpSuggestions
      suggestions={suggestions}
      isLoading={isLoading}
      loadingCount={3}
      onSelect={(s) => alert(s.title)}
    />
  )
}

render(<LoadingSuggestions />)`}
        />
      </section>

      <section className="docs-section">
        <h2>Real-World Example: AI Chat with Smart Suggestions</h2>
        <CodePlayground
          code={`import { useState } from 'react'

function SmartChatSuggestions() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'I can help you build a chat app with React!' }
  ])
  
  // In real app: these would come from your AI
  const suggestions = [
    {
      id: '1',
      title: 'What libraries do I need?',
      description: 'Dependencies and setup',
      icon: '📦',
      confidence: 0.92
    },
    {
      id: '2',
      title: 'Show me a basic example',
      description: 'Minimal working code',
      icon: '💻',
      confidence: 0.88
    },
    {
      id: '3',
      title: 'How do I add streaming?',
      description: 'Real-time message updates',
      icon: '⚡',
      confidence: 0.75
    },
    {
      id: '4',
      title: 'Can I use it with Next.js?',
      description: 'Framework integration',
      icon: '▲',
      confidence: 0.65
    }
  ]

  const handleSelectSuggestion = (suggestion) => {
    // Add as user message
    setMessages(prev => [...prev, {
      role: 'user',
      content: suggestion.title
    }])
    
    // Then AI would respond...
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: \`Great question about "\${suggestion.title}"! Here's the answer...\`
      }])
    }, 1000)
  }

  return (
    <div className="space-y-4">
      {/* Chat messages */}
      <div className="space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={\`p-3 rounded-lg \${
              msg.role === 'user'
                ? 'bg-primary text-primary-foreground ml-8'
                : 'bg-muted mr-8'
            }\`}
          >
            <div className="text-xs font-semibold mb-1">
              {msg.role === 'user' ? 'You' : 'AI'}
            </div>
            <div className="text-sm">{msg.content}</div>
          </div>
        ))}
      </div>

      {/* Suggestions */}
      <FollowUpSuggestions
        suggestions={suggestions}
        onSelect={handleSelectSuggestion}
        title="What would you like to know?"
      />
    </div>
  )
}

render(<SmartChatSuggestions />)`}
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <ApiTable title="FollowUpSuggestions Props" data={followUpProps} />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>

        <h3>Crafting Good Suggestions</h3>
        <ul>
          <li>✅ Make them specific to the current conversation</li>
          <li>
            ✅ Start with action words ("Explain...", "Show me...", "How do
            I...")
          </li>
          <li>✅ Include 3-5 suggestions (not too many)</li>
          <li>✅ Order by relevance/confidence</li>
          <li>❌ Avoid generic questions like "Tell me more"</li>
          <li>❌ Don't show obvious next steps</li>
        </ul>

        <h3>When to Show Suggestions</h3>
        <ul>
          <li>After AI completes a response</li>
          <li>When user might be stuck</li>
          <li>To guide users through complex topics</li>
          <li>To discover features users don't know about</li>
        </ul>

        <Callout type="tip" title="UX Tip">
          Show suggestions right after the AI message. Users are most likely to
          click them when the response is fresh in their mind.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Generating Suggestions with AI</h2>
        <pre>
          <code>{`// Example: Generate contextual suggestions using OpenAI
async function generateFollowUps(conversation: Message[]) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: \`Based on the conversation, suggest 4 natural follow-up 
                 questions the user might want to ask next. Return JSON array 
                 with {title, description, confidence}\`
      },
      ...conversation
    ],
    response_format: { type: 'json_object' }
  })

  const suggestions = JSON.parse(response.choices[0].message.content)
  return suggestions
}

// Use in your chat component
const [suggestions, setSuggestions] = useState([])

useEffect(() => {
  if (messages.length > 0) {
    generateFollowUps(messages).then(setSuggestions)
  }
}, [messages])`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>TypeScript</h2>
        <pre>
          <code>{`import { 
  FollowUpSuggestions,
  type FollowUpSuggestionsProps,
  type FollowUpSuggestion 
} from '@clarity-chat/react/internal'

// Suggestion structure
interface FollowUpSuggestion {
  id: string
  title: string              // The question to ask
  description?: string       // Why ask this?
  keywords?: string[]        // Related topics
  icon?: React.ReactNode    // Visual icon
  confidence?: number       // 0-1, how relevant
}

// Usage
const suggestions: FollowUpSuggestion[] = [
  {
    id: '1',
    title: 'How do I deploy this?',
    description: 'Deployment guide',
    icon: '🚀',
    confidence: 0.9
  }
]`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Accessibility</h2>
        <ul>
          <li>All suggestions are keyboard accessible</li>
          <li>Uses semantic button elements</li>
          <li>Aria-labels describe each suggestion clearly</li>
          <li>Focus indicators show current selection</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/components/chat-input" className="docs-card">
            <h3>Chat Input</h3>
            <p>Where users type messages</p>
          </a>
          <a href="/reference/components/message" className="docs-card">
            <h3>Message</h3>
            <p>Display chat messages</p>
          </a>
          <a href="/reference/components/prompt-library" className="docs-card">
            <h3>Prompt Library</h3>
            <p>Pre-built prompt templates</p>
          </a>
          <a href="/reference/hooks/use-chat" className="docs-card">
            <h3>useChat</h3>
            <p>Manage chat state</p>
          </a>
        </div>
      </section>
    </div>
  )
}

const followUpProps = [
  {
    name: 'suggestions',
    type: 'FollowUpSuggestion[]',
    required: true,
    description: 'Array of follow-up suggestions to display',
  },
  {
    name: 'onSelect',
    type: '(suggestion: FollowUpSuggestion) => void',
    required: true,
    description: 'Callback when user clicks a suggestion',
  },
  {
    name: 'title',
    type: 'string',
    required: false,
    default: "'Suggested follow-ups'",
    description: 'Section heading',
  },
  {
    name: 'subtitle',
    type: 'string',
    required: false,
    description: 'Description text under the heading',
  },
  {
    name: 'layout',
    type: "'grid' | 'list'",
    required: false,
    default: "'grid'",
    description: 'Visual layout style',
  },
  {
    name: 'isLoading',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'Show loading skeleton state',
  },
  {
    name: 'loadingCount',
    type: 'number',
    required: false,
    default: '4',
    description: 'Number of skeleton placeholders while loading',
  },
  {
    name: 'emptyState',
    type: 'React.ReactNode',
    required: false,
    description: 'Custom component to show when no suggestions',
  },
  {
    name: 'className',
    type: 'string',
    required: false,
    description: 'Additional CSS classes',
  },
]
