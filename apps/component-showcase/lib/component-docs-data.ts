/**
 * Component Documentation Database
 * Centralized documentation for all Clarity Chat components
 */

import type { ComponentDocs } from './docs-parser'

export const componentDocsDatabase: ComponentDocs[] = [
  {
    name: 'TokenCounter',
    description:
      'Display real-time token counts with visual feedback. Helps users understand and manage their AI usage costs.',
    category: 'Token Management',
    tags: ['tokens', 'usage', 'metrics', 'optimization'],
    props: [
      {
        name: 'count',
        type: 'number',
        required: true,
        description: 'Current token count to display',
      },
      {
        name: 'maxTokens',
        type: 'number',
        required: false,
        description: 'Maximum token limit for visual warning',
      },
      {
        name: 'showWarning',
        type: 'boolean',
        required: false,
        defaultValue: 'true',
        description: 'Display warning when approaching limit',
      },
      {
        name: 'variant',
        type: "'compact' | 'detailed' | 'minimal'",
        required: false,
        defaultValue: "'compact'",
        description: 'Display variant for different use cases',
      },
      {
        name: 'onThresholdReached',
        type: '(percentage: number) => void',
        required: false,
        description: 'Callback when token usage exceeds threshold',
      },
      {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Additional CSS classes',
      },
    ],
    examples: [
      {
        title: 'Basic Usage',
        description: 'Simple token counter with default settings',
        code: `import { TokenCounter } from '@clarity-chat/react'

function MyComponent() {
  const [tokens, setTokens] = useState(0)

  return (
    <TokenCounter
      count={tokens}
      maxTokens={4096}
    />
  )
}`,
      },
      {
        title: 'With Warning Threshold',
        description: 'Get notified when users approach their token limit',
        code: `import { TokenCounter } from '@clarity-chat/react'

function MyComponent() {
  const handleThreshold = (percentage: number) => {
    if (percentage > 80) {
      console.warn('Token usage high:', percentage + '%')
    }
  }

  return (
    <TokenCounter
      count={3500}
      maxTokens={4096}
      onThresholdReached={handleThreshold}
      showWarning
    />
  )
}`,
      },
      {
        title: 'Compact Variant',
        description: 'Minimal display for tight spaces',
        code: `<TokenCounter
  count={tokens}
  variant="minimal"
  className="ml-auto"
/>`,
      },
    ],
    bestPractices: [
      'Always provide maxTokens to show visual progress and warnings',
      'Use onThresholdReached callback to implement usage limits or warnings',
      'Place token counters near input fields for immediate feedback',
      'Use compact variant in toolbars, minimal variant in status bars',
      'Update token counts in real-time as users type for better UX',
      'Consider color-coding: green (low), yellow (medium), red (high)',
    ],
    troubleshooting: [
      {
        problem: 'Token count not updating in real-time',
        solution:
          'Ensure you are passing updated count values. Use useEffect to calculate tokens from text changes.',
        code: `const [tokens, setTokens] = useState(0)

useEffect(() => {
  const newCount = countTokens(text)
  setTokens(newCount)
}, [text])`,
      },
      {
        problem: 'Warning not showing at expected threshold',
        solution:
          'Check that showWarning is true and maxTokens is set. Default threshold is 80%.',
      },
      {
        problem: 'Performance issues with frequent updates',
        solution: 'Debounce token calculations for large texts',
        code: `const debouncedCount = useMemo(
  () => debounce((text: string) => {
    setTokens(countTokens(text))
  }, 300),
  []
)`,
      },
    ],
    relatedComponents: [
      'TokenBudgetBar',
      'TokenOptimizationPanel',
      'TokenUsageMeter',
      'TokenCostPreview',
    ],
  },
  {
    name: 'ClarityChatApp',
    description:
      'All-in-one chat application component. Get a production-ready AI chat interface with streaming, memory, and token optimization in minutes.',
    category: 'Core Chat',
    tags: ['chat', 'streaming', 'memory', 'enterprise'],
    props: [
      {
        name: 'api',
        type: 'string',
        required: true,
        description: 'API endpoint for chat messages (e.g., "/api/chat")',
      },
      {
        name: 'preset',
        type: "'basic' | 'enterprise' | 'custom'",
        required: false,
        defaultValue: "'basic'",
        description: 'Pre-configured feature set',
      },
      {
        name: 'features',
        type: 'FeatureConfig',
        required: false,
        description:
          'Enable/disable specific features: memory, streaming, tools, etc.',
      },
      {
        name: 'theme',
        type: 'ThemeConfig',
        required: false,
        description: 'Custom theme configuration',
      },
      {
        name: 'initialMessages',
        type: 'Message[]',
        required: false,
        description: 'Pre-populate chat with messages',
      },
      {
        name: 'onMessage',
        type: '(message: Message) => void',
        required: false,
        description: 'Callback when new message is received',
      },
      {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Additional CSS classes',
      },
    ],
    examples: [
      {
        title: 'Quick Start (3 Lines)',
        description: 'Get a fully functional chat in under 3 minutes',
        code: `import { ClarityChatApp } from '@clarity-chat/react'

export default function Page() {
  return <ClarityChatApp api="/api/chat" />
}`,
      },
      {
        title: 'With Memory Enabled',
        description: 'Enable conversation memory with one flag',
        code: `<ClarityChatApp
  api="/api/chat"
  features={{
    memory: true,
    memoryConfig: {
      maxMessages: 50,
      enableSemanticSearch: true
    }
  }}
/>`,
      },
      {
        title: 'Enterprise Configuration',
        description: 'Full-featured setup with all enterprise capabilities',
        code: `<ClarityChatApp
  api="/api/chat"
  preset="enterprise"
  features={{
    memory: true,
    streaming: true,
    tools: true,
    analytics: true,
    tokenOptimization: true
  }}
  theme={{
    mode: 'dark',
    accentColor: '#6366f1'
  }}
  onMessage={(msg) => {
    console.log('New message:', msg)
  }}
/>`,
      },
    ],
    bestPractices: [
      'Start with the basic preset and enable features as needed',
      'Use the enterprise preset for production applications',
      'Always handle loading and error states appropriately',
      'Implement proper authentication before enabling tools',
      'Monitor token usage with analytics enabled',
      'Use memory feature for multi-turn conversations',
      'Configure CORS properly for API endpoints',
    ],
    troubleshooting: [
      {
        problem: 'API endpoint not responding',
        solution:
          'Verify your API route is configured correctly and returns proper streaming responses',
        code: `// app/api/chat/route.ts
export async function POST(req: Request) {
  const { messages } = await req.json()

  const stream = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
    stream: true
  })

  return new Response(stream)
}`,
      },
      {
        problem: 'Streaming not working',
        solution:
          'Ensure your API returns a proper streaming response and features.streaming is true',
      },
      {
        problem: 'Memory not persisting',
        solution:
          'Check that features.memory is true and configure storage adapter if needed',
      },
    ],
    relatedComponents: [
      'ClarityChat',
      'ChatWindow',
      'ChatInput',
      'MessageList',
      'StreamingMessage',
    ],
  },
  {
    name: 'ChatInput',
    description:
      'Advanced chat input component with voice support, file attachments, and auto-growing textarea.',
    category: 'Input',
    tags: ['input', 'chat', 'voice', 'files', 'textarea'],
    props: [
      {
        name: 'value',
        type: 'string',
        required: true,
        description: 'Current input value',
      },
      {
        name: 'onChange',
        type: '(value: string) => void',
        required: true,
        description: 'Callback when input changes',
      },
      {
        name: 'onSubmit',
        type: '(value: string) => void',
        required: true,
        description: 'Callback when message is submitted',
      },
      {
        name: 'onFileUpload',
        type: '(files: File[]) => void',
        required: false,
        description: 'Callback when files are uploaded',
      },
      {
        name: 'onVoiceInput',
        type: '(transcript: string) => void',
        required: false,
        description: 'Callback when voice input is transcribed',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        defaultValue: '"Type a message..."',
        description: 'Input placeholder text',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'Disable input while processing',
      },
      {
        name: 'enableVoice',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'Enable voice input button',
      },
      {
        name: 'enableFiles',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'Enable file upload button',
      },
      {
        name: 'maxLength',
        type: 'number',
        required: false,
        description: 'Maximum character length',
      },
    ],
    examples: [
      {
        title: 'Basic Chat Input',
        code: `const [message, setMessage] = useState('')

<ChatInput
  value={message}
  onChange={setMessage}
  onSubmit={(text) => {
    sendMessage(text)
    setMessage('')
  }}
/>`,
      },
      {
        title: 'With Voice and File Support',
        code: `<ChatInput
  value={message}
  onChange={setMessage}
  onSubmit={handleSubmit}
  enableVoice
  enableFiles
  onVoiceInput={(transcript) => {
    setMessage(transcript)
  }}
  onFileUpload={(files) => {
    handleFileUpload(files)
  }}
/>`,
      },
    ],
    bestPractices: [
      'Clear input value after successful submission',
      'Disable input while processing to prevent duplicate submissions',
      'Show loading indicator during voice transcription',
      'Validate file types and sizes before upload',
      'Use maxLength to prevent token limit issues',
    ],
    troubleshooting: [
      {
        problem: 'Auto-grow not working',
        solution:
          'Ensure parent container allows height changes and does not have fixed height constraints',
      },
      {
        problem: 'Voice input not available',
        solution:
          'Check browser compatibility and ensure HTTPS is used (required for microphone access)',
      },
    ],
    relatedComponents: ['VoiceInput', 'FileUpload', 'MessageComposer'],
  },
]

/**
 * Get documentation for a specific component
 */
export function getComponentDocs(componentName: string): ComponentDocs | undefined {
  return componentDocsDatabase.find(
    (doc) => doc.name.toLowerCase() === componentName.toLowerCase()
  )
}

/**
 * Get all component names
 */
export function getAllComponentNames(): string[] {
  return componentDocsDatabase.map((doc) => doc.name)
}

/**
 * Get components by category
 */
export function getComponentsByCategory(category: string): ComponentDocs[] {
  return componentDocsDatabase.filter((doc) => doc.category === category)
}

/**
 * Get all categories
 */
export function getAllCategories(): string[] {
  return Array.from(
    new Set(componentDocsDatabase.map((doc) => doc.category).filter(Boolean))
  ) as string[]
}
