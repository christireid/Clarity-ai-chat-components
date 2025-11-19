import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'MemoryService',
  description: 'Framework-agnostic memory and context management utilities for AI applications.',
}

export default function MemoryServicePage() {
  return (
    <>
      <Breadcrumbs />

      <h1>MemoryService (`@clarity-chat/memory`)</h1>
      <p className="lead">
        Manage semantic memory, episodic history, and token budgets across any JavaScript runtime. Works with React,
        Node.js, serverless functions, or other frameworks.
      </p>

      <Callout type="info">
        <p>
          Install with <code>npm install @clarity-chat/memory</code>. The package has zero runtime dependencies and
          ships full TypeScript definitions.
        </p>
      </Callout>

      <h2 id="quick-start">Quick Start</h2>
      <CodeBlock
        language="ts"
        code={`import { MemoryService } from '@clarity-chat/memory'

const memory = new MemoryService({
  tokenOptimization: {
    maxContextWindow: 4096,
    allocation: {
      systemPrompt: 0.1,
      userPreferences: 0.15,
      recentContext: 0.3,
      semanticMemory: 0.25,
      episodicMemory: 0.15,
      responseReserve: 0.05,
    },
    dynamicAllocation: true,
    enableCompression: true,
    enableChunking: true,
  },
  persistence: {
    useVectorStore: false,
    useCache: true,
    useDatabase: false,
  },
})`}
      />

      <h2 id="core-api">Core API</h2>
      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
        <li>
          <code>addMemory(content, type, scope, metadata?)</code> – Store semantic, episodic, or session memories.
        </li>
        <li>
          <code>query({'{'} query, limit, userId {'}'})</code> – Retrieve relevant memories using semantic scoring.
        </li>
        <li>
          <code>getOptimizer()</code> – Access context optimizer for building prompts with token budgets.
        </li>
        <li>
          <code>promoteMemory(id, scope)</code> – Move important items to higher retention tiers.
        </li>
        <li>
          <code>compressMemory(id, ratio)</code> – Apply abstraction/compression to reduce storage.
        </li>
      </ul>

      <h2 id="optimizers">Context Optimizer</h2>
      <CodeBlock
        language="ts"
        code={`const optimizer = memory.getOptimizer()

const context = optimizer.optimizeContext({
  systemPrompt: 'You are a helpful assistant.',
  userPreferences: { tone: 'friendly' },
  recentMessages: transcript.slice(-8),
  semanticMemories: await memory.query({ query: lastUserMessage, limit: 5 }),
  episodicMemories: await memory.query({ query: userId, limit: 10, scope: 'session' }),
})`}
      />

      <h2 id="framework-examples">Framework Examples</h2>
      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
        <li>
          Node.js/Express – store conversation history and retrieve context before hitting the LLM.
        </li>
        <li>React – instantiate <code>MemoryService</code> once per app and reuse across hooks.</li>
        <li>Vue/Svelte – import the class directly; the API is framework agnostic.</li>
        <li>Serverless functions – instantiate inside handler or reuse via warm global state.</li>
      </ul>

      <h2 id="token-tools">Token Tools</h2>
      <CodeBlock
        language="ts"
        code={`import { TokenCounter, TokenBudgetManager } from '@clarity-chat/memory'

const tokens = TokenCounter.count('Hello world')
const manager = new TokenBudgetManager({ maxContextWindow: 16_000 })
const allocation = manager.getAllocation()`}
      />
    </>
  )
}
