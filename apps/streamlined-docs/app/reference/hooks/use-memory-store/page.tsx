'use client'

/**
 * useMemoryStore Hook - API Reference Documentation
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Copy, Check, ChevronRight, Database, Search, BookOpen, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodeBlock } from '@/components/Docs/CodeBlock'

export const revalidate = 3600

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = React.useState(false)
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={handleCopy} className={cn('p-2 rounded-md hover:bg-muted/50 transition-colors', 'text-muted-foreground hover:text-foreground', className)} aria-label={copied ? 'Copied' : 'Copy to clipboard'}>
      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
    </button>
  )
}

interface PropDefinition { name: string; type: string; default?: string; required?: boolean; description: string }

function PropsTable({ props, title }: { props: PropDefinition[]; title?: string }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      {title && <div className="px-4 py-3 bg-muted/30 border-b border-border/50"><h4 className="font-semibold text-foreground">{title}</h4></div>}
      <table className="w-full text-sm">
        <thead><tr className="border-b border-border/50 bg-muted/20"><th className="px-4 py-3 text-left font-semibold text-foreground">Name</th><th className="px-4 py-3 text-left font-semibold text-foreground">Type</th><th className="px-4 py-3 text-left font-semibold text-foreground">Default</th><th className="px-4 py-3 text-left font-semibold text-foreground">Description</th></tr></thead>
        <tbody>
          {props.map((prop, index) => (
            <tr key={prop.name} className={cn('border-b border-border/30 last:border-b-0', index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10')}>
              <td className="px-4 py-3 font-mono text-sm"><span className="text-brand-600 dark:text-brand-400">{prop.name}</span>{prop.required && <span className="ml-1 text-red-500" title="Required">*</span>}</td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground max-w-[200px] break-words">{prop.type}</td>
              <td className="px-4 py-3 font-mono text-xs text-neutral-500">{prop.default || '-'}</td>
              <td className="px-4 py-3 text-muted-foreground">{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Section({ id, title, children, className }: { id: string; title: string; children: React.ReactNode; className?: string }) {
  return <section id={id} className={cn('scroll-mt-24', className)}><h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2"><a href={`#${id}`} className="hover:text-brand-500 transition-colors group">{title}<span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">#</span></a></h2>{children}</section>
}

function SubSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return <div id={id} className="scroll-mt-24 mt-8"><h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2"><a href={`#${id}`} className="hover:text-brand-500 transition-colors group">{title}<span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-base">#</span></a></h3>{children}</div>
}

const tableOfContents = [
  { id: 'overview', title: 'Overview' },
  { id: 'import', title: 'Import' },
  { id: 'signature', title: 'Signature' },
  { id: 'parameters', title: 'Parameters' },
  { id: 'returns', title: 'Return Value' },
  { id: 'examples', title: 'Examples', children: [
      { id: 'example-basic', title: 'Basic Usage' },
      { id: 'example-strategies', title: 'Memory Strategies' },
      { id: 'example-semantic', title: 'Semantic Search' },
      { id: 'example-integration', title: 'Chat Integration' },
      { id: 'example-persistence', title: 'Persistence' },
    ]},
  { id: 'advanced', title: 'Advanced Usage' },
  { id: 'best-practices', title: 'Best Practices' },
  { id: 'typescript', title: 'TypeScript' },
  { id: 'related', title: 'Related APIs' },
  { id: 'troubleshooting', title: 'Troubleshooting' },
]

function TableOfContents() {
  const [activeId, setActiveId] = React.useState('')
  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) { setActiveId(entry.target.id) } })
    }, { rootMargin: '-100px 0px -66%' })
    const headings = document.querySelectorAll('section[id], div[id]')
    headings.forEach((heading) => observer.observe(heading))
    return () => observer.disconnect()
  }, [])
  return (
    <nav className="sticky top-24 space-y-1 text-sm" aria-label="Table of contents">
      <p className="font-semibold text-foreground mb-3">On this page</p>
      {tableOfContents.map((item) => (
        <div key={item.id}>
          <a href={`#${item.id}`} className={cn('block py-1 px-2 rounded transition-colors', activeId === item.id ? 'text-brand-600 dark:text-brand-400 bg-brand-500/10' : 'text-muted-foreground hover:text-foreground')}>{item.title}</a>
          {item.children && (
            <div className="ml-3 mt-1 space-y-1 border-l border-border/50 pl-2">
              {item.children.map((child) => <a key={child.id} href={`#${child.id}`} className={cn('block py-0.5 text-xs transition-colors', activeId === child.id ? 'text-brand-600 dark:text-brand-400' : 'text-muted-foreground hover:text-foreground')}>{child.title}</a>)}
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}

const optionsProps: PropDefinition[] = [
  { name: 'enabled', type: 'boolean', default: 'false', description: 'Enable memory storage and retrieval' },
  { name: 'strategy', type: `'sliding-window' | 'semantic-chunks' | 'vector-store'`, default: `'sliding-window'`, description: 'Memory management strategy' },
  { name: 'maxTokens', type: 'number', description: 'Maximum tokens for memory context' },
  { name: 'scope', type: 'MemoryScope', default: `'session'`, description: 'Memory scope (session, user, global)' },
]

const returnProps: PropDefinition[] = [
  { name: 'enabled', type: 'boolean', description: 'Whether memory is enabled' },
  { name: 'service', type: 'MemoryContextValue | null', description: 'Memory service instance' },
  { name: 'config', type: 'object', description: 'Configuration for useClarityChat' },
  { name: 'addMemory', type: '(content: string, type?: MemoryType, metadata?: Record<string, any>) => Promise<void>', description: 'Add a memory' },
  { name: 'query', type: '(query: string) => Promise<any[]>', description: 'Query memories' },
  { name: 'clear', type: '() => Promise<void>', description: 'Clear all memories' },
]

const importCode = `import { useMemoryStore } from '@clarity-chat/react'`
const signatureCode = `function useMemoryStore(options?: UseMemoryStoreOptions): UseMemoryStoreReturn`

const basicUsageCode = `import { useMemoryStore } from '@clarity-chat/react'

function ChatWithMemory() {
  const memory = useMemoryStore({
    enabled: true,
    strategy: 'sliding-window',
    maxTokens: 4000,
  })

  const handleSave = async (message: string) => {
    await memory.addMemory(message, 'episodic', {
      timestamp: Date.now(),
      importance: 0.8,
    })
  }

  return (
    <div>
      <div>Memory enabled: {memory.enabled ? 'Yes' : 'No'}</div>
      <button onClick={() => handleSave('Important fact')}>
        Save to Memory
      </button>
    </div>
  )
}`

const strategiesCode = `import { useMemoryStore } from '@clarity-chat/react'

// Sliding window - keeps N most recent messages
const slidingMemory = useMemoryStore({
  enabled: true,
  strategy: 'sliding-window',
  maxTokens: 4000,
})

// Semantic chunks - groups related messages
const semanticMemory = useMemoryStore({
  enabled: true,
  strategy: 'semantic-chunks',
  maxTokens: 8000,
})

// Vector store - similarity-based retrieval
const vectorMemory = useMemoryStore({
  enabled: true,
  strategy: 'vector-store',
  maxTokens: 16000,
})`

const semanticCode = `import { useMemoryStore } from '@clarity-chat/react'

function SemanticMemory() {
  const memory = useMemoryStore({
    enabled: true,
    strategy: 'vector-store',
  })

  const searchMemories = async (query: string) => {
    const results = await memory.query(query)
    console.log('Found memories:', results)
    return results
  }

  const handleQuestion = async (question: string) => {
    const relevantMemories = await searchMemories(question)
    // Use memories to enhance context
    sendMessageWithContext(question, relevantMemories)
  }

  return (
    <div>
      <input
        placeholder="Ask a question..."
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleQuestion(e.currentTarget.value)
          }
        }}
      />
    </div>
  )
}`

const integrationCode = `import { useClarityChat } from '@clarity-chat/react'
import { useMemoryStore } from '@clarity-chat/react'

function ChatWithMemoryIntegration() {
  const memory = useMemoryStore({
    enabled: true,
    strategy: 'semantic-chunks',
    maxTokens: 8000,
    scope: 'user',
  })

  const chat = useClarityChat({
    api: '/api/chat',
    memory: memory.config,
  })

  return (
    <div>
      <ChatWindow {...chat} />
      <button onClick={() => memory.clear()}>
        Clear Memory
      </button>
    </div>
  )
}`

const persistenceCode = `import { useMemoryStore } from '@clarity-chat/react'

function PersistentMemory() {
  const memory = useMemoryStore({
    enabled: true,
    strategy: 'vector-store',
    scope: 'user', // Persists across sessions
  })

  // Memories are automatically persisted
  const saveImportantFact = async (fact: string) => {
    await memory.addMemory(fact, 'semantic', {
      importance: 1.0,
      category: 'facts',
    })
  }

  // Clear all user memories
  const resetMemory = async () => {
    await memory.clear()
  }

  return (
    <div>
      <button onClick={() => saveImportantFact('User prefers dark mode')}>
        Save Preference
      </button>
      <button onClick={resetMemory}>
        Reset All Memory
      </button>
    </div>
  )
}`

const advancedCode = `import { useMemoryStore } from '@clarity-chat/react'
import { useState, useEffect } from 'react'

function AdvancedMemory() {
  const [memoryStats, setMemoryStats] = useState({ count: 0, size: 0 })
  
  const memory = useMemoryStore({
    enabled: true,
    strategy: 'vector-store',
    maxTokens: 16000,
    scope: 'user',
  })

  useEffect(() => {
    if (memory.service) {
      // Access raw memory service for advanced operations
      const stats = memory.service.getStats()
      setMemoryStats(stats)
    }
  }, [memory.service])

  const queryWithFilters = async (query: string) => {
    const results = await memory.query(query)
    // Filter by metadata
    return results.filter(m => m.metadata?.importance > 0.7)
  }

  return (
    <div>
      <div>Memories: {memoryStats.count}</div>
      <div>Size: {memoryStats.size} tokens</div>
    </div>
  )
}`

const bestPracticesCode = `// ✅ Enable memory for persistent context
const memory = useMemoryStore({
  enabled: true,
  strategy: 'semantic-chunks',
})

// ✅ Use appropriate scope
const userMemory = useMemoryStore({ scope: 'user' }) // Across sessions
const sessionMemory = useMemoryStore({ scope: 'session' }) // Current session only

// ✅ Add metadata for better retrieval
await memory.addMemory(content, 'episodic', {
  timestamp: Date.now(),
  importance: 0.9,
  category: 'preferences',
})

// ❌ Not enabling memory
const memory = useMemoryStore() // enabled defaults to false

// ❌ Exceeding token limits
const memory = useMemoryStore({ maxTokens: 1000000 }) // Too large`

const typesCode = `interface UseMemoryStoreOptions {
  enabled?: boolean
  strategy?: 'sliding-window' | 'semantic-chunks' | 'vector-store'
  maxTokens?: number
  scope?: MemoryScope
}

interface UseMemoryStoreReturn {
  enabled: boolean
  service: MemoryContextValue | null
  config: {
    enabled: boolean
    strategy?: 'sliding-window' | 'semantic-chunks' | 'vector-store'
    maxTokens?: number
  }
  addMemory: (content: string, type?: MemoryType, metadata?: Record<string, any>) => Promise<void>
  query: (query: string) => Promise<any[]>
  clear: () => Promise<void>
}

type MemoryType = 'episodic' | 'semantic' | 'procedural'
type MemoryScope = 'session' | 'user' | 'global'`

export default function UseMemoryStorePage() {
  return (
    <div className="min-h-screen">
      <Breadcrumbs />
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8 py-8">
          <main className="flex-1 min-w-0 space-y-12">
            <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: durations.moderate, ease: [0.25, 0.1, 0.25, 1] }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800"><Database className="w-6 h-6" /></div>
                <div><div className="flex items-center gap-2"><span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">Stable</span><span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">Hook</span><span className="text-xs text-muted-foreground">@clarity-chat/react</span></div></div>
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-4">useMemoryStore</h1>
              <p className="text-lg text-muted-foreground max-w-3xl">Conversation memory persistence with multiple storage strategies, semantic search, and seamless integration with ClarityChat. Maintains context across sessions with episodic, semantic, and procedural memory types.</p>
            </motion.header>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: durations.slow, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[{ icon: Database, label: 'Persistence', desc: 'Cross-session' }, { icon: Search, label: 'Semantic', desc: 'Smart retrieval' }, { icon: BookOpen, label: 'Strategies', desc: 'Multiple types' }, { icon: Layers, label: 'Scoped', desc: 'User/session' }].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="p-4 rounded-lg bg-muted/30 border border-border/50"><Icon className="w-5 h-5 text-brand-500 mb-2" /><p className="font-medium text-foreground text-sm">{label}</p><p className="text-xs text-muted-foreground">{desc}</p></div>
              ))}
            </motion.div>

            <Section id="overview" title="Overview">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p><code>useMemoryStore</code> provides a simple API for conversation memory management with multiple strategies and automatic persistence.</p>
                <h4 className="text-lg font-semibold mt-6 mb-3">Key Features</h4>
                <ul className="space-y-2">
                  <li><strong>Multiple Strategies:</strong> Sliding window, semantic chunks, vector store</li>
                  <li><strong>Semantic Search:</strong> Query memories by similarity</li>
                  <li><strong>Persistence:</strong> Automatic cross-session storage</li>
                  <li><strong>Scoped Memory:</strong> Session, user, or global scope</li>
                  <li><strong>Type Safety:</strong> Full TypeScript support</li>
                </ul>
              </div>
            </Section>

            <Section id="import" title="Import"><CodeBlock code={importCode} language="tsx" filename="Import" showDownloadButton={false} /></Section>
            <Section id="signature" title="Signature"><CodeBlock code={signatureCode} language="tsx" filename="Signature" showDownloadButton={false} /></Section>
            <Section id="parameters" title="Parameters"><PropsTable props={optionsProps} /></Section>
            <Section id="returns" title="Return Value"><PropsTable props={returnProps} /></Section>

            <Section id="examples" title="Examples">
              <SubSection id="example-basic" title="Basic Usage"><CodeBlock code={basicUsageCode} language="tsx" filename="BasicMemory.tsx" /></SubSection>
              <SubSection id="example-strategies" title="Memory Strategies"><CodeBlock code={strategiesCode} language="tsx" filename="MemoryStrategies.tsx" /></SubSection>
              <SubSection id="example-semantic" title="Semantic Search"><CodeBlock code={semanticCode} language="tsx" filename="SemanticSearch.tsx" /></SubSection>
              <SubSection id="example-integration" title="Chat Integration"><CodeBlock code={integrationCode} language="tsx" filename="ChatIntegration.tsx" /></SubSection>
              <SubSection id="example-persistence" title="Persistence"><CodeBlock code={persistenceCode} language="tsx" filename="Persistence.tsx" /></SubSection>
            </Section>

            <Section id="advanced" title="Advanced Usage"><CodeBlock code={advancedCode} language="tsx" filename="Advanced.tsx" /></Section>
            <Section id="best-practices" title="Best Practices"><CodeBlock code={bestPracticesCode} language="tsx" filename="BestPractices.tsx" /></Section>
            <Section id="typescript" title="TypeScript"><CodeBlock code={typesCode} language="tsx" filename="types.ts" showLineNumbers /></Section>

            <Section id="related" title="Related APIs">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { name: 'useClarityChat', type: 'hook', description: 'High-level chat hook with memory support', href: '/reference/hooks/use-clarity-chat' },
                  { name: 'MemoryProvider', type: 'component', description: 'Memory context provider', href: '/reference/components/memory-provider' },
                  { name: 'useMemoryFeedback', type: 'hook', description: 'Memory feedback collection', href: '/reference/hooks/use-memory-feedback' },
                  { name: 'ChatWindow', type: 'component', description: 'UI component with memory integration', href: '/reference/components/chat-window' },
                ].map((api) => (
                  <Link key={api.name} href={api.href} className={cn('group p-4 rounded-lg border border-border/50', 'hover:border-brand-500/30 hover:shadow-sm transition-all')}>
                    <div className="flex items-center justify-between mb-2"><span className="font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{api.name}</span><span className={cn('text-xs px-2 py-0.5 rounded-full', api.type === 'hook' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400')}>{api.type}</span></div>
                    <p className="text-sm text-muted-foreground">{api.description}</p>
                  </Link>
                ))}
              </div>
            </Section>

            <Section id="troubleshooting" title="Troubleshooting">
              <div className="space-y-6">
                <div><h4 className="font-semibold text-foreground mb-2">Memories not persisting</h4><p className="text-muted-foreground">Ensure <code>enabled: true</code> is set and <code>scope</code> is set to <code>&apos;user&apos;</code> for cross-session persistence.</p></div>
                <div><h4 className="font-semibold text-foreground mb-2">Query returning no results</h4><p className="text-muted-foreground">Check that memories have been added first. Use <code>addMemory()</code> before querying.</p></div>
                <div><h4 className="font-semibold text-foreground mb-2">Memory service is null</h4><p className="text-muted-foreground">Ensure <code>enabled: true</code> is set. The service is only initialized when memory is enabled.</p></div>
              </div>
            </Section>

            <div className="border-t border-border/50 pt-8 mt-12">
              <div className="grid gap-4 sm:grid-cols-2">
                <Link href="/reference/hooks/use-token-budget-monitor" className={cn('group flex items-center gap-3 p-4 rounded-lg border border-border/50')}><ChevronRight className="w-5 h-5 text-muted-foreground rotate-180" /><div><div className="text-xs text-muted-foreground mb-1">Previous</div><div className="font-medium text-foreground">useTokenBudgetMonitor</div></div></Link>
                <Link href="/reference/hooks" className={cn('group flex items-center gap-3 p-4 rounded-lg border border-border/50', 'text-right')}><div className="flex-1"><div className="text-xs text-muted-foreground mb-1">Back to</div><div className="font-medium text-foreground">All Hooks</div></div><ChevronRight className="w-5 h-5 text-muted-foreground" /></Link>
              </div>
            </div>
          </main>
          <aside className="hidden xl:block w-64 shrink-0"><TableOfContents /></aside>
        </div>
      </div>
    </div>
  )
}
