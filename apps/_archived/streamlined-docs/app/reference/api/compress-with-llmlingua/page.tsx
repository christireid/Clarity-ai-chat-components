'use client'

/**
 * compressWithLLMLingua API Reference
 *
 * Comprehensive documentation for the LLMLingua-2 style compression function.
 * Achieves 2-20x compression while maintaining semantic quality.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Zap,
  Copy,
  Check,
  ChevronRight,
  AlertTriangle,
  DollarSign,
  TrendingDown,
  Gauge,
  FileText,
  Database,
  Code,
  Sparkles,
  Target,
  Activity,
  BadgePercent,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodeBlock } from '@/components/Docs/CodeBlock'

// ISR Configuration
export const revalidate = 3600

// ============================================================================
// Copy Button Component
// ============================================================================

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'p-2 rounded-md hover:bg-muted/50 transition-colors',
        'text-muted-foreground hover:text-foreground',
        className
      )}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  )
}

// ============================================================================
// Props/Return Table Components
// ============================================================================

interface PropDefinition {
  name: string
  type: string
  default?: string
  required?: boolean
  description: string
}

function PropsTable({
  props,
  title,
}: {
  props: PropDefinition[]
  title?: string
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      {title && (
        <div className="px-4 py-3 bg-muted/30 border-b border-border/50">
          <h4 className="font-semibold text-foreground">{title}</h4>
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/20">
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Name
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Type
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Default
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop, index) => (
            <tr
              key={prop.name}
              className={cn(
                'border-b border-border/30 last:border-b-0',
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10'
              )}
            >
              <td className="px-4 py-3 font-mono text-sm">
                <span className="text-brand-600 dark:text-brand-400">
                  {prop.name}
                </span>
                {prop.required && (
                  <span className="ml-1 text-red-500" title="Required">
                    *
                  </span>
                )}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground max-w-[200px] break-words">
                {prop.type}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-neutral-500">
                {prop.default || '-'}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {prop.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ============================================================================
// Section Components
// ============================================================================

function Section({
  id,
  title,
  children,
  className,
}: {
  id: string
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section id={id} className={cn('scroll-mt-24', className)}>
      <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
        <a
          href={`#${id}`}
          className="hover:text-brand-500 transition-colors group"
        >
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
            #
          </span>
        </a>
      </h2>
      {children}
    </section>
  )
}

function SubSection({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div id={id} className="scroll-mt-24 mt-8">
      <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
        <a
          href={`#${id}`}
          className="hover:text-brand-500 transition-colors group"
        >
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-base">
            #
          </span>
        </a>
      </h3>
      {children}
    </div>
  )
}

// ============================================================================
// Table of Contents
// ============================================================================

const tableOfContents = [
  { id: 'overview', title: 'Overview' },
  { id: 'import', title: 'Import' },
  {
    id: 'api-reference',
    title: 'API Reference',
    children: [
      { id: 'signature', title: 'Signature' },
      { id: 'parameters', title: 'Parameters' },
      { id: 'return-value', title: 'Return Value' },
    ],
  },
  { id: 'cost-impact', title: 'Cost Impact' },
  {
    id: 'usage',
    title: 'Usage Examples',
    children: [
      { id: 'basic-example', title: 'Basic Compression' },
      { id: 'advanced-example', title: 'Advanced Options' },
      { id: 'real-world-example', title: 'Real-World Use Case' },
    ],
  },
  {
    id: 'use-cases',
    title: 'Common Use Cases',
    children: [
      { id: 'rag-context', title: 'RAG Context Compression' },
      { id: 'conversation-history', title: 'Conversation History' },
      { id: 'documentation', title: 'Documentation/Code' },
    ],
  },
  { id: 'performance', title: 'Performance Characteristics' },
  { id: 'troubleshooting', title: 'Troubleshooting' },
  { id: 'related', title: 'Related Functions' },
]

function TableOfContents() {
  const [activeId, setActiveId] = React.useState('')

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-100px 0px -66%' }
    )

    const headings = document.querySelectorAll('section[id], div[id]')
    headings.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [])

  return (
    <nav
      className="sticky top-24 space-y-1 text-sm"
      aria-label="Table of contents"
    >
      <p className="font-semibold text-foreground mb-3">On this page</p>
      {tableOfContents.map((item) => (
        <div key={item.id}>
          <a
            href={`#${item.id}`}
            className={cn(
              'block py-1 px-2 rounded transition-colors',
              activeId === item.id
                ? 'text-brand-600 dark:text-brand-400 bg-brand-500/10'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {item.title}
          </a>
          {item.children && (
            <div className="ml-3 mt-1 space-y-1 border-l border-border/50 pl-2">
              {item.children.map((child) => (
                <a
                  key={child.id}
                  href={`#${child.id}`}
                  className={cn(
                    'block py-0.5 text-xs transition-colors',
                    activeId === child.id
                      ? 'text-brand-600 dark:text-brand-400'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {child.title}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}

// ============================================================================
// Props Data
// ============================================================================

const optionsProps: PropDefinition[] = [
  {
    name: 'targetRatio',
    type: 'number',
    default: '0.5',
    description:
      'Target compression ratio (0-1). Lower values = more aggressive compression. 0.5 = compress to 50% of original length.',
  },
  {
    name: 'preserveFirst',
    type: 'number',
    default: '100',
    description:
      'Number of tokens at start to always preserve. Critical for maintaining context and instructions.',
  },
  {
    name: 'preserveLast',
    type: 'number',
    default: '50',
    description:
      'Number of tokens at end to always preserve. Important for maintaining recent context and conclusions.',
  },
  {
    name: 'preserveCodeBlocks',
    type: 'boolean',
    default: 'true',
    description:
      'Whether to preserve code blocks intact. Recommended to keep true to avoid breaking syntax.',
  },
  {
    name: 'preserveMarkdownStructure',
    type: 'boolean',
    default: 'true',
    description:
      'Whether to preserve markdown headings and lists. Helps maintain document structure.',
  },
  {
    name: 'qualityThreshold',
    type: 'number',
    default: '0.7',
    description:
      'Minimum quality score (0-1). If compression quality falls below this, original text is returned. Higher = stricter quality requirements.',
  },
  {
    name: 'model',
    type: 'string',
    default: "'gpt-4o'",
    description:
      'Model to use for token counting. Affects how compression is measured. Supports OpenAI, Claude, and Gemini models.',
  },
]

const returnProps: PropDefinition[] = [
  {
    name: 'compressed',
    type: 'string',
    description:
      'The compressed text. Returns original text if compression fails or quality is too low.',
  },
  {
    name: 'original',
    type: 'string',
    description: 'The original input text for comparison.',
  },
  {
    name: 'tokensOriginal',
    type: 'number',
    description: 'Token count of original text.',
  },
  {
    name: 'tokensCompressed',
    type: 'number',
    description: 'Token count of compressed text.',
  },
  {
    name: 'compressionRatio',
    type: 'number',
    description:
      'Actual compression ratio achieved (tokensCompressed / tokensOriginal). 0.5 = 50% of original size.',
  },
  {
    name: 'tokensSaved',
    type: 'number',
    description: 'Number of tokens saved (tokensOriginal - tokensCompressed).',
  },
  {
    name: 'quality',
    type: 'number',
    description:
      'Estimated quality score (0-1). Based on semantic similarity and structure preservation. 1.0 = perfect quality.',
  },
  {
    name: 'usedCompression',
    type: 'boolean',
    description:
      'Whether compression was actually used. False if quality was too low or text was too short.',
  },
  {
    name: 'failureReason',
    type: 'string | undefined',
    description:
      'Reason for compression failure if usedCompression is false. Examples: "quality_too_low", "text_too_short".',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import { compressWithLLMLingua } from '@clarity-chat/token-optimization'
import type { CompressionOptions, CompressionResult } from '@clarity-chat/token-optimization'`

const signatureCode = `function compressWithLLMLingua(
  text: string,
  options?: CompressionOptions
): Promise<CompressionResult>`

const basicExampleCode = `import { compressWithLLMLingua } from '@clarity-chat/token-optimization'

async function compressDocument() {
  const longDocument = \`
    Your long document here...
    This could be documentation, conversation history,
    RAG context, or any text you want to compress.
  \`

  const result = await compressWithLLMLingua(longDocument)

  console.log(\`Original: \${result.tokensOriginal} tokens\`)
  console.log(\`Compressed: \${result.tokensCompressed} tokens\`)
  console.log(\`Saved: \${result.tokensSaved} tokens (\${(result.compressionRatio * 100).toFixed(1)}%)\`)
  console.log(\`Quality: \${(result.quality * 100).toFixed(1)}%\`)

  // Use compressed text in your API call
  return result.compressed
}`

const advancedExampleCode = `import { compressWithLLMLingua } from '@clarity-chat/token-optimization'

async function compressWithOptions() {
  const ragContext = \`
    # Product Documentation

    ## Overview
    Our product helps teams collaborate...

    ## Features
    - Real-time messaging
    - File sharing
    - Video calls

    ## API Reference
    \\\`\\\`\\\`typescript
    function sendMessage(content: string) {
      // Implementation
    }
    \\\`\\\`\\\`
  \`

  const result = await compressWithLLMLingua(ragContext, {
    targetRatio: 0.3,              // Aggressive 70% compression
    preserveFirst: 150,            // Keep first 150 tokens (title, intro)
    preserveLast: 75,              // Keep last 75 tokens (conclusions)
    preserveCodeBlocks: true,      // Don't compress code
    preserveMarkdownStructure: true, // Keep headings
    qualityThreshold: 0.8,         // High quality requirement
    model: 'claude-sonnet-4-5',    // Use Claude for token counting
  })

  if (!result.usedCompression) {
    console.warn(\`Compression failed: \${result.failureReason}\`)
    // Fall back to original text or other strategy
    return result.original
  }

  console.log(\`Successfully compressed from \${result.tokensOriginal} to \${result.tokensCompressed} tokens\`)
  console.log(\`Quality score: \${result.quality}\`)

  return result.compressed
}`

const realWorldExampleCode = `import { compressWithLLMLingua } from '@clarity-chat/token-optimization'
import { anthropic } from '@anthropic-ai/sdk'

/**
 * Real-world example: RAG chatbot with conversation history
 *
 * Scenario:
 * - 10,000 token knowledge base
 * - 2,000 token conversation history
 * - 1,000 token user query
 * - Total: 13,000 tokens input
 *
 * With compression:
 * - Knowledge base: 10,000 → 2,000 tokens (5x compression)
 * - Conversation: 2,000 → 800 tokens (2.5x compression)
 * - User query: Preserved at 1,000 tokens
 * - Total: 3,800 tokens (71% reduction)
 */

interface Message {
  role: 'user' | 'assistant'
  content: string
}

async function chatWithRAG(
  userQuery: string,
  knowledgeBase: string,
  conversationHistory: Message[]
) {
  // 1. Compress knowledge base (aggressive)
  const compressedKB = await compressWithLLMLingua(knowledgeBase, {
    targetRatio: 0.2,  // 80% compression for static content
    preserveFirst: 200, // Keep title/overview
    preserveCodeBlocks: true,
    model: 'claude-sonnet-4-5',
  })

  // 2. Compress conversation history (moderate)
  const historyText = conversationHistory
    .map(m => \`\${m.role}: \${m.content}\`)
    .join('\\n\\n')

  const compressedHistory = await compressWithLLMLingua(historyText, {
    targetRatio: 0.4,  // 60% compression for context
    preserveLast: 200, // Keep recent messages intact
    model: 'claude-sonnet-4-5',
  })

  // 3. Build prompt with compressed content
  const messages = [
    {
      role: 'system' as const,
      content: \`You are a helpful assistant. Use this knowledge base to answer questions:\\n\\n\${compressedKB.compressed}\`,
    },
    {
      role: 'user' as const,
      content: \`Previous conversation:\\n\${compressedHistory.compressed}\\n\\nCurrent question: \${userQuery}\`,
    },
  ]

  // 4. Calculate cost savings
  const originalTokens = compressedKB.tokensOriginal + compressedHistory.tokensOriginal + 1000
  const compressedTokens = compressedKB.tokensCompressed + compressedHistory.tokensCompressed + 1000
  const tokensSaved = originalTokens - compressedTokens
  const percentSaved = ((tokensSaved / originalTokens) * 100).toFixed(1)

  console.log(\`Cost optimization:
    Original: \${originalTokens.toLocaleString()} tokens
    Compressed: \${compressedTokens.toLocaleString()} tokens
    Saved: \${tokensSaved.toLocaleString()} tokens (\${percentSaved}%)
    Quality: KB=\${(compressedKB.quality * 100).toFixed(1)}%, History=\${(compressedHistory.quality * 100).toFixed(1)}%
  \`)

  // 5. Send to API
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250514',
    max_tokens: 1024,
    messages,
  })

  return {
    response: response.content[0].text,
    stats: {
      originalTokens,
      compressedTokens,
      tokensSaved,
      percentSaved: parseFloat(percentSaved),
      qualityKB: compressedKB.quality,
      qualityHistory: compressedHistory.quality,
    },
  }
}

// Example usage
const result = await chatWithRAG(
  'How do I integrate the API?',
  knowledgeBaseText,
  previousMessages
)

console.log(result.response)
console.log(\`Saved \${result.stats.percentSaved}% on API costs\`)`

const ragContextCode = `import { compressWithLLMLingua } from '@clarity-chat/token-optimization'

/**
 * Use Case: Compress RAG context before sending to LLM
 *
 * Typical scenario:
 * - Vector search returns 5 documents, each 2,000 tokens
 * - Total: 10,000 tokens
 * - After compression (0.2 ratio): 2,000 tokens
 * - Savings: 8,000 tokens (80%)
 */

async function compressRAGContext(documents: string[]) {
  const combinedContext = documents.join('\\n\\n---\\n\\n')

  const result = await compressWithLLMLingua(combinedContext, {
    targetRatio: 0.2,              // Aggressive compression
    preserveFirst: 100,            // Keep document titles
    preserveCodeBlocks: true,      // Preserve examples
    preserveMarkdownStructure: true,
    qualityThreshold: 0.75,        // High quality for accuracy
  })

  return {
    compressed: result.compressed,
    stats: {
      originalDocs: documents.length,
      tokensOriginal: result.tokensOriginal,
      tokensCompressed: result.tokensCompressed,
      compressionRatio: result.compressionRatio,
      quality: result.quality,
    },
  }
}

// Example: Compress search results
const searchResults = [
  'Document 1: API authentication guide...',
  'Document 2: Rate limiting documentation...',
  'Document 3: Error handling best practices...',
]

const { compressed, stats } = await compressRAGContext(searchResults)

console.log(\`Compressed \${stats.originalDocs} docs\`)
console.log(\`From \${stats.tokensOriginal} to \${stats.tokensCompressed} tokens\`)
console.log(\`Quality: \${(stats.quality * 100).toFixed(1)}%\`)`

const conversationHistoryCode = `import { compressWithLLMLingua } from '@clarity-chat/token-optimization'

/**
 * Use Case: Compress long conversation history
 *
 * Problem: After 20+ messages, context grows to 5,000+ tokens
 * Solution: Compress older messages while keeping recent ones intact
 */

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

async function compressConversationHistory(messages: Message[]) {
  // Keep last 5 messages uncompressed
  const recentMessages = messages.slice(-5)
  const olderMessages = messages.slice(0, -5)

  if (olderMessages.length === 0) {
    return messages // Not enough history to compress
  }

  // Convert older messages to text
  const olderText = olderMessages
    .map(m => \`\${m.role}: \${m.content}\`)
    .join('\\n\\n')

  // Compress older messages
  const result = await compressWithLLMLingua(olderText, {
    targetRatio: 0.3,        // 70% compression
    preserveFirst: 200,      // Keep conversation start
    preserveLast: 100,       // Keep context before recent messages
    qualityThreshold: 0.7,
  })

  // Return compressed older messages + uncompressed recent
  return {
    compressed: result.compressed,
    recent: recentMessages,
    stats: {
      totalMessages: messages.length,
      compressedMessages: olderMessages.length,
      recentMessages: recentMessages.length,
      tokensSaved: result.tokensSaved,
      quality: result.quality,
    },
  }
}

// Build prompt with compressed history
function buildPromptWithHistory(
  compressedOlder: string,
  recentMessages: Message[],
  newQuery: string
) {
  return {
    role: 'user' as const,
    content: \`Previous conversation summary:\\n\${compressedOlder}\\n\\nRecent messages:\\n\${recentMessages.map(m => \`\${m.role}: \${m.content}\`).join('\\n\\n')}\\n\\nNew question: \${newQuery}\`,
  }
}`

const documentationCode = `import { compressWithLLMLingua } from '@clarity-chat/token-optimization'

/**
 * Use Case: Compress documentation and code for LLM analysis
 *
 * Common scenarios:
 * - Code review: Include relevant files as context
 * - Documentation Q&A: Compress docs to fit in context
 * - Test generation: Provide compressed codebase overview
 */

async function compressCodeDocumentation(code: string) {
  const result = await compressWithLLMLingua(code, {
    targetRatio: 0.4,              // Moderate compression
    preserveCodeBlocks: true,      // CRITICAL: Keep code intact
    preserveMarkdownStructure: true, // Keep structure
    preserveFirst: 150,            // Keep file header/imports
    preserveLast: 50,              // Keep exports
    qualityThreshold: 0.8,         // High quality for accuracy
  })

  return result
}

// Example: Compress multiple files for context
async function compressMultipleFiles(files: Record<string, string>) {
  const results = await Promise.all(
    Object.entries(files).map(async ([filename, content]) => {
      const compressed = await compressCodeDocumentation(content)
      return {
        filename,
        original: content,
        compressed: compressed.compressed,
        tokensSaved: compressed.tokensSaved,
        quality: compressed.quality,
      }
    })
  )

  // Combine compressed files
  const combinedContext = results
    .map(r => \`// File: \${r.filename}\\n\${r.compressed}\`)
    .join('\\n\\n')

  const totalTokensSaved = results.reduce((sum, r) => sum + r.tokensSaved, 0)
  const avgQuality = results.reduce((sum, r) => sum + r.quality, 0) / results.length

  return {
    context: combinedContext,
    stats: {
      filesProcessed: results.length,
      totalTokensSaved,
      averageQuality: avgQuality,
    },
  }
}

// Example usage
const files = {
  'src/api.ts': '/* API implementation code */',
  'src/types.ts': '/* Type definitions */',
  'README.md': '# Project documentation...',
}

const { context, stats } = await compressMultipleFiles(files)

console.log(\`Compressed \${stats.filesProcessed} files\`)
console.log(\`Saved \${stats.totalTokensSaved} tokens\`)
console.log(\`Avg quality: \${(stats.averageQuality * 100).toFixed(1)}%\`)`

const performanceCode = `// Performance Characteristics of compressWithLLMLingua

/**
 * Processing Time:
 * - 1,000 tokens:  ~50-100ms
 * - 5,000 tokens:  ~200-400ms
 * - 10,000 tokens: ~500-800ms
 * - 50,000 tokens: ~2-4 seconds
 *
 * Compression Ratios (typical):
 * - Natural language: 2-5x compression (targetRatio: 0.2-0.5)
 * - Technical docs:   2-3x compression (targetRatio: 0.3-0.5)
 * - Code + comments:  1.5-2x compression (targetRatio: 0.5-0.7)
 * - Pure code:        1.2-1.5x compression (targetRatio: 0.7-0.8)
 *
 * Quality Scores:
 * - 0.9-1.0: Excellent (minimal information loss)
 * - 0.7-0.9: Good (slight paraphrasing, maintains meaning)
 * - 0.5-0.7: Fair (noticeable compression, core meaning intact)
 * - Below 0.5: Poor (significant information loss)
 *
 * Memory Usage:
 * - Input text:  ~1-2 bytes per character in memory
 * - Processing:  ~2-3x input size (temporary buffers)
 * - Peak memory: ~3-5x input text size
 */

// Performance Tips

// 1. Batch compress multiple texts in parallel
async function batchCompress(texts: string[]) {
  const results = await Promise.all(
    texts.map(text => compressWithLLMLingua(text, {
      targetRatio: 0.3,
    }))
  )
  return results
}

// 2. Cache compression results for repeated content
const compressionCache = new Map<string, CompressionResult>()

async function compressWithCache(text: string, options?: CompressionOptions) {
  const cacheKey = \`\${text.length}-\${JSON.stringify(options)}\`

  if (compressionCache.has(cacheKey)) {
    return compressionCache.get(cacheKey)!
  }

  const result = await compressWithLLMLingua(text, options)
  compressionCache.set(cacheKey, result)

  return result
}

// 3. Skip compression for short texts
async function smartCompress(text: string) {
  // Don't compress if already short
  if (text.length < 500) {
    return {
      compressed: text,
      original: text,
      tokensOriginal: Math.ceil(text.length / 4),
      tokensCompressed: Math.ceil(text.length / 4),
      compressionRatio: 1,
      tokensSaved: 0,
      quality: 1,
      usedCompression: false,
      failureReason: 'text_too_short',
    }
  }

  return compressWithLLMLingua(text, { targetRatio: 0.3 })
}

// 4. Use appropriate targetRatio for content type
function getCompressionOptionsForType(type: 'natural' | 'technical' | 'code') {
  switch (type) {
    case 'natural':
      return { targetRatio: 0.2, qualityThreshold: 0.7 }
    case 'technical':
      return { targetRatio: 0.4, qualityThreshold: 0.8 }
    case 'code':
      return { targetRatio: 0.7, qualityThreshold: 0.9, preserveCodeBlocks: true }
  }
}`

const troubleshootingCode = `// Troubleshooting compressWithLLMLingua

// Issue 1: Quality too low, compression not used
// Symptom: result.usedCompression = false, failureReason = "quality_too_low"
// Solution: Lower qualityThreshold or increase targetRatio

async function fixLowQuality(text: string) {
  // ❌ Too strict
  const result1 = await compressWithLLMLingua(text, {
    targetRatio: 0.1,     // Very aggressive
    qualityThreshold: 0.9, // Very high quality requirement
  })
  // Often fails: quality requirement too high for aggressive compression

  // ✅ Better balance
  const result2 = await compressWithLLMLingua(text, {
    targetRatio: 0.3,     // Moderate compression
    qualityThreshold: 0.7, // Reasonable quality
  })
  // More likely to succeed

  return result2
}

// Issue 2: Code blocks getting corrupted
// Symptom: Compressed code has syntax errors
// Solution: Enable preserveCodeBlocks

async function preserveCode(markdown: string) {
  // ❌ Bad: Code gets compressed and breaks
  const result1 = await compressWithLLMLingua(markdown, {
    preserveCodeBlocks: false,
  })

  // ✅ Good: Code blocks preserved
  const result2 = await compressWithLLMLingua(markdown, {
    preserveCodeBlocks: true,
    preserveMarkdownStructure: true,
  })

  return result2
}

// Issue 3: Important intro/conclusion lost
// Symptom: Compressed text missing key information from start/end
// Solution: Increase preserveFirst and preserveLast

async function preserveBoundaries(text: string) {
  // ❌ Default may be too aggressive for your content
  const result1 = await compressWithLLMLingua(text)
  // May lose important intro/conclusion

  // ✅ Preserve more boundaries
  const result2 = await compressWithLLMLingua(text, {
    preserveFirst: 200,  // Keep first 200 tokens
    preserveLast: 100,   // Keep last 100 tokens
  })

  return result2
}

// Issue 4: Compression too slow
// Symptom: Takes >5 seconds for moderate text
// Solution: Batch process or use web workers

// Use parallel processing
async function parallelCompress(chunks: string[]) {
  const results = await Promise.all(
    chunks.map(chunk => compressWithLLMLingua(chunk, {
      targetRatio: 0.3,
    }))
  )

  return {
    compressed: results.map(r => r.compressed).join('\\n\\n'),
    totalTokensSaved: results.reduce((sum, r) => sum + r.tokensSaved, 0),
  }
}

// Issue 5: Different models give different results
// Symptom: Token counts vary between compression and API
// Solution: Use same model for compression and API

async function matchModels(text: string, apiModel: string) {
  const result = await compressWithLLMLingua(text, {
    model: apiModel,  // Match compression model to API model
    targetRatio: 0.3,
  })

  // Now token counts will match API usage
  return result
}

// Issue 6: Unclear what targetRatio to use
// Decision tree for targetRatio

function getRecommendedRatio(
  contentType: 'natural' | 'technical' | 'code',
  priority: 'quality' | 'balanced' | 'aggressive'
): number {
  const ratios = {
    natural: {
      quality: 0.5,     // 50% compression, high quality
      balanced: 0.3,    // 70% compression
      aggressive: 0.2,  // 80% compression
    },
    technical: {
      quality: 0.6,     // 40% compression
      balanced: 0.4,    // 60% compression
      aggressive: 0.3,  // 70% compression
    },
    code: {
      quality: 0.8,     // 20% compression
      balanced: 0.7,    // 30% compression
      aggressive: 0.6,  // 40% compression
    },
  }

  return ratios[contentType][priority]
}`

// ============================================================================
// Main Page Component
// ============================================================================

export default function CompressWithLLMLinguaPage() {
  return (
    <div className="min-h-screen">
      <Breadcrumbs />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8 py-8">
          {/* Main content */}
          <main className="flex-1 min-w-0 space-y-12">
            {/* Page Header */}
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: durations.moderate,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                  <Zap className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
                      HIGH PRIORITY
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Stable
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                      <BadgePercent className="w-3 h-3 inline mr-1" />
                      Token Optimization
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @clarity-chat/token-optimization
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">
                compressWithLLMLingua
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl">
                Advanced LLMLingua-2 style compression that achieves 2-20x
                compression while maintaining semantic quality. Perfect for
                compressing RAG context, conversation history, and documentation
                before sending to LLMs.
              </p>
            </motion.header>

            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: durations.slow,
                delay: 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                {
                  icon: TrendingDown,
                  label: '2-20x Compression',
                  desc: 'Typical 50-90% reduction',
                },
                {
                  icon: Sparkles,
                  label: 'Quality Preserved',
                  desc: '70-95% semantic accuracy',
                },
                {
                  icon: Code,
                  label: 'Code-Aware',
                  desc: 'Preserves code blocks',
                },
                {
                  icon: Gauge,
                  label: 'Fast',
                  desc: '~100ms per 1K tokens',
                },
              ].map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="p-4 rounded-lg bg-muted/30 border border-border/50"
                >
                  <Icon
                    className="w-5 h-5 text-brand-500 mb-2"
                    aria-hidden="true"
                  />
                  <p className="font-medium text-foreground text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              ))}
            </motion.div>

            {/* Overview Section */}
            <Section id="overview" title="Overview">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  The <code>compressWithLLMLingua</code> function provides
                  state-of-the-art text compression using techniques inspired by
                  LLMLingua-2. It intelligently removes redundant information
                  while preserving semantic meaning, making it ideal for fitting
                  more context into LLM token limits.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Key Features
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>High Compression Ratios:</strong> Achieve 2-20x
                    compression (50-95% size reduction) depending on content type
                    and settings
                  </li>
                  <li>
                    <strong>Quality Preservation:</strong> Maintains 70-95%
                    semantic similarity to original text
                  </li>
                  <li>
                    <strong>Smart Preservation:</strong> Automatically preserves
                    code blocks, markdown structure, and boundary content
                  </li>
                  <li>
                    <strong>Multi-Model Support:</strong> Works with OpenAI,
                    Claude, and Gemini tokenizers
                  </li>
                  <li>
                    <strong>Quality Gates:</strong> Returns original text if
                    compression quality falls below threshold
                  </li>
                  <li>
                    <strong>Detailed Metrics:</strong> Returns compression ratio,
                    tokens saved, and quality scores
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  When to Use
                </h4>
                <div className="overflow-x-auto rounded-lg border border-border/50 not-prose">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50 bg-muted/20">
                        <th className="px-4 py-3 text-left font-semibold">
                          Use Case
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Typical Compression
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/30">
                        <td className="px-4 py-3">RAG context (10K+ tokens)</td>
                        <td className="px-4 py-3">5-10x (80-90%)</td>
                      </tr>
                      <tr className="border-b border-border/30 bg-muted/10">
                        <td className="px-4 py-3">Conversation history</td>
                        <td className="px-4 py-3">2-5x (50-80%)</td>
                      </tr>
                      <tr className="border-b border-border/30">
                        <td className="px-4 py-3">Documentation/Articles</td>
                        <td className="px-4 py-3">3-5x (67-80%)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">Code + documentation</td>
                        <td className="px-4 py-3">2-3x (50-67%)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Section>

            {/* Import Section */}
            <Section id="import" title="Import">
              <CodeBlock
                code={importCode}
                language="tsx"
                filename="Import"
                showDownloadButton={false}
              />
            </Section>

            {/* API Reference Section */}
            <Section id="api-reference" title="API Reference">
              <SubSection id="signature" title="Signature">
                <CodeBlock
                  code={signatureCode}
                  language="tsx"
                  filename="Signature"
                  showDownloadButton={false}
                />
              </SubSection>

              <SubSection id="parameters" title="Parameters">
                <div className="mb-4">
                  <p className="text-muted-foreground mb-4">
                    The function accepts two parameters:
                  </p>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border border-border/50">
                      <code className="text-brand-600 dark:text-brand-400">
                        text
                      </code>
                      <span className="text-red-500 ml-1">*</span>
                      <span className="ml-2 text-xs font-mono text-muted-foreground">
                        string
                      </span>
                      <p className="mt-2 text-sm text-muted-foreground">
                        The text to compress. Can be any length, but works best
                        with 500+ characters. For texts under 500 characters,
                        consider skipping compression.
                      </p>
                    </div>
                    <div className="p-4 rounded-lg border border-border/50">
                      <code className="text-brand-600 dark:text-brand-400">
                        options
                      </code>
                      <span className="ml-2 text-xs font-mono text-muted-foreground">
                        CompressionOptions (optional)
                      </span>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Configuration options for compression behavior. All
                        options have sensible defaults.
                      </p>
                    </div>
                  </div>
                </div>
                <PropsTable props={optionsProps} title="Options Properties" />
              </SubSection>

              <SubSection id="return-value" title="Return Value">
                <p className="text-muted-foreground mb-4">
                  The function returns a Promise that resolves to a{' '}
                  <code>CompressionResult</code> object with the following
                  properties:
                </p>
                <PropsTable props={returnProps} />
              </SubSection>
            </Section>

            {/* Cost Impact Section */}
            <Section id="cost-impact" title="Cost Impact">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/50 mb-6">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500 text-white flex-shrink-0">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-foreground">
                      Achieve 2-20x Compression (10-15% of Baseline Cost Reduction)
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Compression is most effective when combined with provider
                      caching and smart routing. Used alone, it contributes
                      10-15% to the overall 50-70% cost reduction baseline.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div className="p-4 rounded-lg bg-white/60 dark:bg-white/[0.02] border border-emerald-200/50 dark:border-emerald-800/30">
                        <div className="text-sm font-medium text-muted-foreground mb-1">
                          RAG Context (10,000 tokens)
                        </div>
                        <div className="text-2xl font-bold text-foreground mb-1">
                          5-10x
                        </div>
                        <div className="text-xs text-muted-foreground">
                          $0.05 → $0.005-0.01 per request (90% reduction)
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-white/60 dark:bg-white/[0.02] border border-emerald-200/50 dark:border-emerald-800/30">
                        <div className="text-sm font-medium text-muted-foreground mb-1">
                          Conversation History (2,000 tokens)
                        </div>
                        <div className="text-2xl font-bold text-foreground mb-1">
                          2-5x
                        </div>
                        <div className="text-xs text-muted-foreground">
                          $0.01 → $0.002-0.005 per request (50-80% reduction)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Compression in Context
                </h4>
                <p>
                  While compression alone can save 10-15% of costs, it's most
                  powerful when combined with other optimization strategies:
                </p>
                <ul>
                  <li>
                    <strong>Provider Caching:</strong> 50-60% baseline savings
                    (caches system prompts, RAG context)
                  </li>
                  <li>
                    <strong>Compression:</strong> +10-15% additional savings
                    (reduces uncached content)
                  </li>
                  <li>
                    <strong>Smart Routing:</strong> +10-15% additional savings
                    (uses cheaper models when possible)
                  </li>
                  <li>
                    <strong>Combined Total:</strong> 70-90% overall cost
                    reduction
                  </li>
                </ul>
                <p>
                  See the{' '}
                  <Link
                    href="/cookbook/achieving-50-percent-reduction"
                    className="text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    Achieving 50-70% Cost Reduction
                  </Link>{' '}
                  cookbook for a complete integration guide.
                </p>
              </div>
            </Section>

            {/* Usage Examples Section */}
            <Section id="usage" title="Usage Examples">
              <SubSection id="basic-example" title="Basic Compression">
                <p className="text-muted-foreground mb-4">
                  The simplest usage - compress text with default settings:
                </p>
                <CodeBlock
                  code={basicExampleCode}
                  language="tsx"
                  filename="BasicExample.ts"
                  showLineNumbers
                />
              </SubSection>

              <SubSection id="advanced-example" title="Advanced Options">
                <p className="text-muted-foreground mb-4">
                  Customize compression behavior for specific use cases:
                </p>
                <CodeBlock
                  code={advancedExampleCode}
                  language="tsx"
                  filename="AdvancedExample.ts"
                  showLineNumbers
                />
              </SubSection>

              <SubSection id="real-world-example" title="Real-World Use Case">
                <p className="text-muted-foreground mb-4">
                  Complete example: RAG chatbot with compressed knowledge base
                  and conversation history:
                </p>
                <CodeBlock
                  code={realWorldExampleCode}
                  language="tsx"
                  filename="RealWorldExample.ts"
                  showLineNumbers
                />
              </SubSection>
            </Section>

            {/* Common Use Cases Section */}
            <Section id="use-cases" title="Common Use Cases">
              <SubSection id="rag-context" title="RAG Context Compression">
                <p className="text-muted-foreground mb-4">
                  Compress retrieved documents before sending to LLM:
                </p>
                <CodeBlock
                  code={ragContextCode}
                  language="tsx"
                  filename="RAGContext.ts"
                  showLineNumbers
                />
              </SubSection>

              <SubSection
                id="conversation-history"
                title="Conversation History"
              >
                <p className="text-muted-foreground mb-4">
                  Compress older messages while keeping recent ones intact:
                </p>
                <CodeBlock
                  code={conversationHistoryCode}
                  language="tsx"
                  filename="ConversationHistory.ts"
                  showLineNumbers
                />
              </SubSection>

              <SubSection id="documentation" title="Documentation & Code">
                <p className="text-muted-foreground mb-4">
                  Compress documentation and code for LLM analysis:
                </p>
                <CodeBlock
                  code={documentationCode}
                  language="tsx"
                  filename="Documentation.ts"
                  showLineNumbers
                />
              </SubSection>
            </Section>

            {/* Performance Characteristics Section */}
            <Section id="performance" title="Performance Characteristics">
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border border-border/50">
                    <div className="flex items-center gap-2 mb-3">
                      <Activity className="w-5 h-5 text-blue-500" />
                      <h4 className="font-semibold text-foreground">
                        Processing Speed
                      </h4>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>1,000 tokens: ~50-100ms</li>
                      <li>5,000 tokens: ~200-400ms</li>
                      <li>10,000 tokens: ~500-800ms</li>
                      <li>50,000 tokens: ~2-4 seconds</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg border border-border/50">
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-5 h-5 text-purple-500" />
                      <h4 className="font-semibold text-foreground">
                        Compression Ratios
                      </h4>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>Natural language: 2-5x (50-80%)</li>
                      <li>Technical docs: 2-3x (50-67%)</li>
                      <li>Code + comments: 1.5-2x (33-50%)</li>
                      <li>Pure code: 1.2-1.5x (17-33%)</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg border border-border/50">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-emerald-500" />
                      <h4 className="font-semibold text-foreground">
                        Quality Scores
                      </h4>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>0.9-1.0: Excellent (minimal loss)</li>
                      <li>0.7-0.9: Good (slight paraphrasing)</li>
                      <li>0.5-0.7: Fair (core meaning intact)</li>
                      <li>Below 0.5: Poor (avoid using)</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg border border-border/50">
                    <div className="flex items-center gap-2 mb-3">
                      <Database className="w-5 h-5 text-amber-500" />
                      <h4 className="font-semibold text-foreground">
                        Memory Usage
                      </h4>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>Input: ~1-2 bytes/char</li>
                      <li>Processing: ~2-3x input</li>
                      <li>Peak: ~3-5x input size</li>
                      <li>Output: ~0.2-0.8x input</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-muted-foreground mb-4">
                    Detailed performance tips and benchmarks:
                  </p>
                  <CodeBlock
                    code={performanceCode}
                    language="tsx"
                    filename="Performance.ts"
                    showLineNumbers
                  />
                </div>
              </div>
            </Section>

            {/* Troubleshooting Section */}
            <Section id="troubleshooting" title="Troubleshooting">
              <div className="space-y-6">
                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Quality too low, compression not used
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    When <code>usedCompression</code> is false with reason
                    "quality_too_low":
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>Lower <code>qualityThreshold</code> (e.g., 0.7 → 0.6)</li>
                    <li>Increase <code>targetRatio</code> (less aggressive compression)</li>
                    <li>Increase <code>preserveFirst</code> and <code>preserveLast</code></li>
                    <li>Check if content is suitable for compression (avoid pure code)</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Code blocks getting corrupted
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Compressed code has syntax errors:
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>Ensure <code>preserveCodeBlocks: true</code></li>
                    <li>Enable <code>preserveMarkdownStructure: true</code></li>
                    <li>Use higher <code>targetRatio</code> for code-heavy content (0.7-0.8)</li>
                    <li>Consider not compressing code blocks at all</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Important information lost from start/end
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Key intro or conclusion missing from compressed text:
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>Increase <code>preserveFirst</code> (default: 100 → 200+)</li>
                    <li>Increase <code>preserveLast</code> (default: 50 → 100+)</li>
                    <li>Verify preserved regions cover critical content</li>
                    <li>Consider manual text splitting for better control</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Compression too slow
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Processing takes longer than expected:
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>Split large texts and compress in parallel</li>
                    <li>Cache compression results for repeated content</li>
                    <li>Skip compression for texts under 500 characters</li>
                    <li>Use web workers for UI-blocking scenarios</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-muted-foreground mb-4">
                  Complete troubleshooting examples:
                </p>
                <CodeBlock
                  code={troubleshootingCode}
                  language="tsx"
                  filename="Troubleshooting.ts"
                  showLineNumbers
                />
              </div>
            </Section>

            {/* Related Functions Section */}
            <Section id="related" title="Related Functions">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    name: 'useTokenCount',
                    type: 'hook',
                    description:
                      'Count tokens before and after compression to measure savings',
                    href: '/reference/hooks/use-token-count',
                  },
                  {
                    name: 'useTokenOptimization',
                    type: 'hook',
                    description:
                      'Full optimization pipeline including compression, caching, and routing',
                    href: '/reference/hooks/use-token-optimization',
                  },
                  {
                    name: 'Provider Caching Setup',
                    type: 'cookbook',
                    description:
                      'Combine compression with provider caching for maximum savings',
                    href: '/cookbook/provider-caching-setup',
                  },
                  {
                    name: 'Achieving 50-70% Reduction',
                    type: 'cookbook',
                    description:
                      'Complete guide to combining all optimization strategies',
                    href: '/cookbook/achieving-50-percent-reduction',
                  },
                ].map((api) => (
                  <Link
                    key={api.name}
                    href={api.href}
                    className={cn(
                      'group p-4 rounded-lg border border-border/50',
                      'hover:border-brand-500/30 hover:shadow-sm transition-all',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {api.name}
                      </span>
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full',
                          api.type === 'hook'
                            ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                            : api.type === 'cookbook'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        )}
                      >
                        {api.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {api.description}
                    </p>
                  </Link>
                ))}
              </div>
            </Section>

            {/* Footer Navigation */}
            <div className="border-t border-border/50 pt-8 mt-12">
              <div className="grid gap-4 sm:grid-cols-2">
                <Link
                  href="/reference/api"
                  className={cn(
                    'group flex items-center gap-3 p-4 rounded-lg border border-border/50',
                    'hover:border-brand-500/30 hover:shadow-sm transition-all',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
                  )}
                >
                  <ChevronRight className="w-5 h-5 text-muted-foreground rotate-180 group-hover:text-brand-500 transition-colors" />
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Previous
                    </div>
                    <div className="font-medium text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      API Reference
                    </div>
                  </div>
                </Link>
                <Link
                  href="/cookbook/achieving-50-percent-reduction"
                  className={cn(
                    'group flex items-center gap-3 p-4 rounded-lg border border-border/50',
                    'hover:border-brand-500/30 hover:shadow-sm transition-all',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                    'text-right'
                  )}
                >
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">
                      Next
                    </div>
                    <div className="font-medium text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      Achieving 50-70% Cost Reduction
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-brand-500 transition-colors" />
                </Link>
              </div>
            </div>
          </main>

          {/* Table of Contents Sidebar */}
          <aside className="hidden xl:block w-64 shrink-0">
            <TableOfContents />
          </aside>
        </div>
      </div>
    </div>
  )
}
