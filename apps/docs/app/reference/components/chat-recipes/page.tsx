'use client'

import { ChatWithMemory, ChatComplete, ChatWithAnalytics } from '@clarity-chat/react'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'

const chatCompleteProps: Prop[] = [
  {
    name: 'api',
    type: 'string',
    required: true,
    description: 'API endpoint for chat completion.',
  },
  {
    name: 'memoryStrategy',
    type: "'vector-store' | 'sliding-window' | 'semantic-chunks'",
    default: "'vector-store'",
    description: 'Strategy for managing conversation memory.',
  },
  {
    name: 'errorBoundary',
    type: 'boolean',
    default: 'true',
    description: 'Wrap in ErrorBoundary for production safety.',
  },
  {
    name: 'storageKey',
    type: 'string',
    default: "'clarity-chat-complete'",
    description: 'Key for local storage persistence.',
  },
  {
    name: 'onMessageSent',
    type: '(content: string) => void',
    description: 'Callback for analytics.',
  },
]

export const dynamic = 'force-dynamic'

export default function ChatRecipesPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>Chat Recipes</h1>

      <p className="lead">
        Pre-configured combinations of Clarity Chat features for common use cases.
        These "recipes" let you drop in complex functionality with a single component.
      </p>

      <h2 id="import">Import</h2>

      <EnhancedCodeBlock
        code={`import { 
  ChatComplete, 
  ChatWithMemory, 
  ChatWithAnalytics 
} from '@clarity-chat/react'`}
        language="tsx"
      />

      <h2 id="chat-complete">ChatComplete</h2>

      <p>
        The "batteries-included" component. It enables memory, error handling, persistence,
        and analytics hooks by default. Perfect for production applications.
      </p>

      <EnhancedCodeBlock
        code={`<ChatComplete
  api="/api/chat"
  memoryStrategy="vector-store"
  onMessageSent={(content) => analytics.track('message_sent', { content })}
  onError={(error) => analytics.track('error', { error })}
/>`}
        language="tsx"
      />

      <h3>Props</h3>
      <PropsTable props={chatCompleteProps} />

      <h2 id="chat-with-memory">ChatWithMemory</h2>

      <p>
        Focused on context retention. Use this when you need long-term memory via
        vector stores or smart context window management.
      </p>

      <EnhancedCodeBlock
        code={`<ChatWithMemory 
  api="/api/chat" 
  strategy="vector-store" 
  maxTokens={4000} 
/>`}
        language="tsx"
      />

      <h2 id="chat-with-analytics">ChatWithAnalytics</h2>

      <p>
        Automatically tracks key events like message sent, message received, and errors.
      </p>

      <EnhancedCodeBlock
        code={`<ChatWithAnalytics
  api="/api/chat"
  onMessageSent={(content) => track('sent', content)}
  onMessageReceived={(id) => track('received', id)}
/>`}
        language="tsx"
      />
    </>
  )
}
