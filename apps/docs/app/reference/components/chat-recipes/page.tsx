'use client'

import {
  ChatWithMemory,
  ChatComplete,
  ChatWithAnalytics,
} from '@clarity-chat/react'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ScrollReveal, ScrollRevealItem } from '@/components/UI/ScrollReveal'

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

export default function ChatRecipesPage() {
  return (
    <div className="docs-content">
      <Breadcrumbs />

      <ScrollReveal>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
            Chat Recipes
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed">
            Pre-configured combinations of Clarity Chat features for common use
            cases. These "recipes" let you drop in complex functionality with a
            single component.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <h2 id="import">Import</h2>
        <EnhancedCodeBlock
          code={`import { 
  ChatComplete, 
  ChatWithMemory, 
  ChatWithAnalytics 
} from '@clarity-chat/react'`}
          language="tsx"
        />
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <h2 id="chat-complete">ChatComplete</h2>
        <p className="mb-4">
          The "batteries-included" component. It enables memory, error handling,
          persistence, and analytics hooks by default. Perfect for production
          applications.
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
      </ScrollReveal>

      <ScrollReveal delay={0.3}>
        <h3 className="mt-6 mb-4">Props</h3>
        <PropsTable props={chatCompleteProps} />
      </ScrollReveal>

      <ScrollReveal delay={0.4}>
        <h2 id="chat-with-memory" className="mt-12">
          ChatWithMemory
        </h2>
        <p className="mb-4">
          Focused on context retention. Use this when you need long-term memory
          via vector stores or smart context window management.
        </p>
        <EnhancedCodeBlock
          code={`<ChatWithMemory 
  api="/api/chat" 
  strategy="vector-store" 
  maxTokens={4000} 
/>`}
          language="tsx"
        />
      </ScrollReveal>

      <ScrollReveal delay={0.5}>
        <h2 id="chat-with-analytics" className="mt-12">
          ChatWithAnalytics
        </h2>
        <p className="mb-4">
          Automatically tracks key events like message sent, message received,
          and errors.
        </p>
        <EnhancedCodeBlock
          code={`<ChatWithAnalytics
  api="/api/chat"
  onMessageSent={(content) => track('sent', content)}
  onMessageReceived={(id) => track('received', id)}
/>`}
          language="tsx"
        />
      </ScrollReveal>
    </div>
  )
}
