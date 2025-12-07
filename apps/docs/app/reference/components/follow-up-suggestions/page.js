import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ApiTable } from '@/components/Demo/ApiTable';
import { CodePlayground } from '@/components/Playground/CodePlayground';
import { Callout } from '@/components/MDX/Callout';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Follow-Up Suggestions - Clarity Chat Components',
    description: 'Smart follow-up question suggestions to keep conversations flowing naturally.',
};
export default function FollowUpSuggestionsPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Component" }), _jsx("h1", { children: "Follow-Up Suggestions" }), _jsx("p", { className: "docs-lead", children: "Smart follow-up questions that help users continue the conversation naturally. Like having a helpful friend who knows what to ask next." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Overview" }), _jsx("p", { children: "After the AI responds, show 3-5 suggested follow-up questions. It's like when Netflix suggests \"You might also like...\" but for conversations. Helps users who might be stuck thinking \"what should I ask now?\"" }), _jsx(Callout, { type: "info", title: "Why This Matters", children: "Users often don't know what else to ask. Suggestions reduce friction and keep conversations flowing. This can increase engagement by 2-3x." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Basic Usage" }), _jsx(CodePlayground, { initialCode: `function SimpleSuggestions() {
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
    console.log('Selected:', suggestion.title)
    // In real app: add this as a new message
  }

  return (
    <FollowUpSuggestions
      suggestions={suggestions}
      onSelect={handleSelect}
    />
  )
}

render(<SimpleSuggestions />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "With Icons" }), _jsx("p", { children: "Add visual icons to make suggestions more scannable." }), _jsx(CodePlayground, { initialCode: `function IconSuggestions() {
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

render(<IconSuggestions />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "With Confidence Scores" }), _jsx("p", { children: "Show how relevant each suggestion is (useful for AI-generated suggestions)." }), _jsx(CodePlayground, { initialCode: `function RankedSuggestions() {
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
      onSelect={(s) => console.log('Selected:', s)}
      title="You might want to ask"
      subtitle="AI-ranked by relevance to your conversation"
    />
  )
}

render(<RankedSuggestions />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Layout Options" }), _jsx("p", { children: "Choose between grid (default) or list layout." }), _jsx(CodePlayground, { initialCode: `import { useState } from 'react'

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
        onSelect={(s) => console.log(s.title)}
      />
    </div>
  )
}

render(<LayoutOptions />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Loading State" }), _jsx("p", { children: "Show skeleton placeholders while AI generates suggestions." }), _jsx(CodePlayground, { initialCode: `import { useState, useEffect } from 'react'

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

render(<LoadingSuggestions />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Real-World Example: AI Chat with Smart Suggestions" }), _jsx(CodePlayground, { initialCode: `import { useState } from 'react'

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

render(<SmartChatSuggestions />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Props" }), _jsx(ApiTable, { title: "FollowUpSuggestions Props", data: followUpProps })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Best Practices" }), _jsx("h3", { children: "Crafting Good Suggestions" }), _jsxs("ul", { children: [_jsx("li", { children: "\u2705 Make them specific to the current conversation" }), _jsx("li", { children: "\u2705 Start with action words (\"Explain...\", \"Show me...\", \"How do I...\")" }), _jsx("li", { children: "\u2705 Include 3-5 suggestions (not too many)" }), _jsx("li", { children: "\u2705 Order by relevance/confidence" }), _jsx("li", { children: "\u274C Avoid generic questions like \"Tell me more\"" }), _jsx("li", { children: "\u274C Don't show obvious next steps" })] }), _jsx("h3", { children: "When to Show Suggestions" }), _jsxs("ul", { children: [_jsx("li", { children: "After AI completes a response" }), _jsx("li", { children: "When user might be stuck" }), _jsx("li", { children: "To guide users through complex topics" }), _jsx("li", { children: "To discover features users don't know about" })] }), _jsx(Callout, { type: "tip", title: "UX Tip", children: "Show suggestions right after the AI message. Users are most likely to click them when the response is fresh in their mind." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Generating Suggestions with AI" }), _jsx("pre", { children: _jsx("code", { children: `// Example: Generate contextual suggestions using OpenAI
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
}, [messages])` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "TypeScript" }), _jsx("pre", { children: _jsx("code", { children: `import { 
  FollowUpSuggestions,
  type FollowUpSuggestionsProps,
  type FollowUpSuggestion 
} from '@clarity-chat/react'

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
]` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Accessibility" }), _jsxs("ul", { children: [_jsx("li", { children: "All suggestions are keyboard accessible" }), _jsx("li", { children: "Uses semantic button elements" }), _jsx("li", { children: "Aria-labels describe each suggestion clearly" }), _jsx("li", { children: "Focus indicators show current selection" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("a", { href: "/reference/components/chat-input", className: "docs-card", children: [_jsx("h3", { children: "Chat Input" }), _jsx("p", { children: "Where users type messages" })] }), _jsxs("a", { href: "/reference/components/message", className: "docs-card", children: [_jsx("h3", { children: "Message" }), _jsx("p", { children: "Display chat messages" })] }), _jsxs("a", { href: "/reference/components/prompt-library", className: "docs-card", children: [_jsx("h3", { children: "Prompt Library" }), _jsx("p", { children: "Pre-built prompt templates" })] }), _jsxs("a", { href: "/reference/hooks/use-chat", className: "docs-card", children: [_jsx("h3", { children: "useChat" }), _jsx("p", { children: "Manage chat state" })] })] })] })] }));
}
const followUpProps = [
    {
        name: 'suggestions',
        type: 'FollowUpSuggestion[]',
        required: true,
        description: 'Array of follow-up suggestions to display'
    },
    {
        name: 'onSelect',
        type: '(suggestion: FollowUpSuggestion) => void',
        required: true,
        description: 'Callback when user clicks a suggestion'
    },
    {
        name: 'title',
        type: 'string',
        required: false,
        default: "'Suggested follow-ups'",
        description: 'Section heading'
    },
    {
        name: 'subtitle',
        type: 'string',
        required: false,
        description: 'Description text under the heading'
    },
    {
        name: 'layout',
        type: "'grid' | 'list'",
        required: false,
        default: "'grid'",
        description: 'Visual layout style'
    },
    {
        name: 'isLoading',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Show loading skeleton state'
    },
    {
        name: 'loadingCount',
        type: 'number',
        required: false,
        default: '4',
        description: 'Number of skeleton placeholders while loading'
    },
    {
        name: 'emptyState',
        type: 'React.ReactNode',
        required: false,
        description: 'Custom component to show when no suggestions'
    },
    {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Additional CSS classes'
    }
];
//# sourceMappingURL=page.js.map