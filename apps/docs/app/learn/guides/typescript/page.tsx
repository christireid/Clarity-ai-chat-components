import Link from 'next/link'
import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { CodeBlock } from '@/components/MDX/CodeBlock'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'TypeScript Quickstart - Learn Clarity Chat',
  description:
    'How to get full IntelliSense, strict typings, and safe adapters when using Clarity Chat.',
}

export default function LearnTypeScriptGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Quick Guide</span>
        <h1>TypeScript</h1>
        <p className="docs-lead">
          Clarity Chat is built in TypeScript with 100% type coverage. Use this
          quickstart to wire up types correctly and avoid implicit <code>any</code>{' '}
          sneaking into your codebase.
        </p>
      </div>

      <section className="docs-section">
        <h2>Install Types</h2>
        <p>
          The primary package exports types, but you can optionally install{' '}
          <code>@clarity-chat/types</code> for shared models between frontend and
          backend.
        </p>
        <CodeBlock
          language="bash"
          code={`npm install @clarity-chat/react @clarity-chat/types`}
        />
      </section>

      <section className="docs-section">
        <h2>Typed Messages</h2>
        <p>
          Import base interfaces for messages, tools, and adapters. They keep your
          API routes and client components aligned.
        </p>
        <CodeBlock
          language="ts"
          code={`import type {
  Message,
  ToolInvocation,
  ProviderResponse,
} from '@clarity-chat/types'

const messages: Message[] = [
  { id: '1', role: 'user', content: 'Hello!', createdAt: new Date() },
]

function handleToolInvocation(tool: ToolInvocation) {
  if (tool.name === 'search_docs') {
    // ...
  }
}

function normalizeResponse(response: ProviderResponse) {
  return response.choices[0].message
}
`}
        />
      </section>

      <section className="docs-section">
        <h2>Custom Hooks &amp; Components</h2>
        <p>
          Extend the built-in hooks with your own typed wrappers. The generics
          make it easy to plug in custom message metadata.
        </p>
        <CodeBlock
          language="ts"
          code={`import type { Message } from '@clarity-chat/types'
import { useChat } from '@clarity-chat/react'

interface SupportMessage extends Message {
  sentiment?: 'positive' | 'neutral' | 'negative'
  ticketId?: string
}

export function useSupportChat() {
  return useChat<SupportMessage>({
    id: 'support',
    initialMessages: [],
  })
}
`}
        />
      </section>

      <section className="docs-section">
        <h2>Strict Type Safety Tips</h2>
        <ul>
          <li>Enable <code>"strict": true</code> in <code>tsconfig.json</code></li>
          <li>Use <code>ProviderConfig</code> and <code>AdapterConfig</code> types to validate adapters</li>
          <li>For streaming handlers, type responses with <code>StreamingChunk</code></li>
          <li>Wrap API routes with <code>ValidatedRequest</code> to catch schema mismatches</li>
        </ul>
      </section>

      <section className="docs-section">
        <Callout type="success">
          Want to see exhaustive examples (mock providers, testing helpers, error
          boundaries)? Visit the{' '}
          <Link href="/guides/testing">Testing Strategy Guide</Link> and{' '}
          <Link href="/guides/state-management">State Management Guide</Link>.
        </Callout>
      </section>
    </div>
  )
}

