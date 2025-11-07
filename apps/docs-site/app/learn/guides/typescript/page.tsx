import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'TypeScript Guide',
  description: 'Work with strongly typed messages, adapters, and hooks across the Clarity Chat stack.',
}

export default function TypeScriptGuidePage() {
  return (
    <>
      <Breadcrumbs />

      <h1>TypeScript Guide</h1>

      <p className="lead">
        Clarity Chat is written in TypeScript end-to-end. Use the shared <code>@clarity-chat/types</code>
        package to keep domain models consistent from server to client.
      </p>

      <h2 id="core-types">Core Message Types</h2>
      <CodeBlock
        language="ts"
        code={`import type { Message, Conversation, ToolInvocation } from '@clarity-chat/types'

const greeting: Message = {
  id: 'msg-1',
  role: 'assistant',
  content: 'Hello! How can I help?',
  timestamp: new Date(),
  metadata: {
    tokens: 24,
    citations: [{ id: 'doc-1', title: 'Safety policy' }],
  },
}`}
      />

      <h2 id="hook-inference">Hook Inference</h2>
      <p>
        Hooks expose generics so you can specify domain-specific payloads. Types flow from server
        responses through to UI components, enabling end-to-end safety.
      </p>
      <CodeBlock
        language="tsx"
        code={`import { useChat } from '@clarity-chat/react'

type SupportMessage = {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  sentiment?: 'positive' | 'neutral' | 'negative'
}

const { messages } = useChat<SupportMessage>({ chatId: 'support' })`}
      />

      <h2 id="adapters">Adapter Typings</h2>
      <p>
        Model adapters implement shared interfaces—<code>ChatAdapter</code>, <code>StreamingAdapter</code>,
        <code>EmbeddingsAdapter</code>—defined in <code>@clarity-chat/types</code>. Extend them to integrate
        new providers while retaining tooling support.
      </p>

      <h2 id="memory-types">Memory &amp; Context Types</h2>
      <p>
        The <code>@clarity-chat/memory</code> package exports <code>MemoryService</code>,
        <code>MemoryRecord</code>, and context optimization helpers. Import them directly in server
        environments to ensure typed context pipelines.
      </p>

      <Callout type="tip">
        <p>
          Enable <code>"strict": true</code> and <code>"strictNullChecks": true</code> in <code>tsconfig.json</code>.
          Our generators and templates assume strict mode and ship appropriate typings.
        </p>
      </Callout>

      <h2 id="intellisense">IntelliSense &amp; Tooling</h2>
      <ul>
        <li>
          The VSCode extension surfaces component props and hook signatures inline (see{' '}
          <a href="/tools/vscode">VSCode tools</a>).
        </li>
        <li>Generated d.ts bundles live in every package for consumers using JavaScript.</li>
        <li>
          Run <code>npm run typecheck</code> from the repo root to validate all workspaces with project
          references.
        </li>
      </ul>
    </>
  )
}
