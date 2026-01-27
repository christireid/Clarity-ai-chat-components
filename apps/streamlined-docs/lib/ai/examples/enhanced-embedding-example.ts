/**
 * Enhanced Embedding Strategy - Practical Examples
 *
 * This file demonstrates how to use the enhanced embedding system
 * for various documentation indexing scenarios.
 */

import {
  SemanticChunker,
  generateEmbeddingsBatch,
  deduplicateChunks,
  EMBEDDING_CONFIGS,
  type EnhancedChunk,
  type ChunkMetadata,
} from '../embeddings-enhanced'
import { getVectorStore } from '../vectorStore'

// ============================================================================
// Example 1: Index a Component Documentation Page
// ============================================================================

export async function indexComponentDoc() {
  console.log('Example 1: Indexing Component Documentation')

  const document = {
    title: 'ChatWindow Component',
    url: '/components/chat-window',
    category: 'component' as const,
    content: `
# ChatWindow Component

The ChatWindow component provides a complete chat interface with streaming support,
typing indicators, and customizable styling.

## Installation

\`\`\`bash
npm install @clarity-chat/react
\`\`\`

## Basic Usage

\`\`\`tsx
import { ChatWindow } from '@clarity-chat/react'

function App() {
  const [messages, setMessages] = useState([])

  const handleSend = async (content: string) => {
    const newMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content,
    }
    setMessages(prev => [...prev, newMessage])

    // Stream AI response
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: [...messages, newMessage] }),
    })

    // Handle streaming...
  }

  return (
    <ChatWindow
      messages={messages}
      onSend={handleSend}
      showTypingIndicator
    />
  )
}
\`\`\`

## Props

### Required Props

- \`messages\`: Array of chat messages
- \`onSend\`: Callback when user sends a message

### Optional Props

- \`showTypingIndicator\`: Show typing indicator (default: false)
- \`theme\`: Custom theme object
- \`className\`: Additional CSS classes

## Styling

The component supports full theme customization:

\`\`\`tsx
<ChatWindow
  theme={{
    primaryColor: '#007bff',
    backgroundColor: '#ffffff',
    messageBackground: '#f0f0f0',
  }}
/>
\`\`\`

## Advanced Features

### Streaming Support

ChatWindow has built-in streaming support for AI responses:

\`\`\`tsx
const stream = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: chatMessages,
  stream: true,
})

for await (const chunk of stream) {
  // Component automatically handles streaming display
}
\`\`\`

### Custom Message Rendering

You can customize how messages are rendered:

\`\`\`tsx
<ChatWindow
  messages={messages}
  renderMessage={(message) => (
    <CustomMessageComponent message={message} />
  )}
/>
\`\`\`
    `.trim(),
    tags: ['react', 'component', 'chat', 'streaming'],
    lastUpdated: new Date().toISOString(),
  }

  // 1. Create chunker with appropriate config
  const chunker = new SemanticChunker(EMBEDDING_CONFIGS.mixed)

  // 2. Extract headings from content
  const headings = extractHeadings(document.content)

  // 3. Chunk the document
  console.log('  Chunking document...')
  const chunks = chunker.chunk(document.content, {
    title: document.title,
    url: document.url,
    category: document.category,
    tags: document.tags,
    headings,
    lastUpdated: document.lastUpdated,
  })

  console.log(`  Generated ${chunks.length} chunks`)
  chunks.forEach((chunk, i) => {
    console.log(`    Chunk ${i + 1}: ${chunk.tokenCount} tokens, ${chunk.keywords.length} keywords`)
    if (chunk.metadata.symbols?.length) {
      console.log(`      Symbols: ${chunk.metadata.symbols.join(', ')}`)
    }
  })

  // 4. Generate embeddings
  console.log('  Generating embeddings...')
  const embedded = await generateEmbeddingsBatch(chunks, {
    model: 'text-embedding-3-small',
    dimensions: 1536,
  })

  // 5. Store in vector database
  console.log('  Storing in vector database...')
  const vectorStore = getVectorStore()
  await vectorStore.initialize()
  await vectorStore.upsertBatch(
    embedded.map(chunk => ({
      id: chunk.id,
      title: chunk.metadata.title,
      content: chunk.content,
      url: chunk.metadata.url,
      category: chunk.metadata.category,
      embedding: chunk.embedding!,
      metadata: chunk.metadata,
    }))
  )

  console.log('  ✓ Component documentation indexed successfully\n')
  return embedded
}

// ============================================================================
// Example 2: Index API Reference with High Precision
// ============================================================================

export async function indexAPIReference() {
  console.log('Example 2: Indexing API Reference')

  const apiDocs = [
    {
      name: 'useChat',
      signature: 'useChat(options?: UseChatOptions): UseChatReturn',
      description: 'React hook for managing chat state and streaming responses.',
      parameters: [
        {
          name: 'options',
          type: 'UseChatOptions',
          optional: true,
          description: 'Configuration options for the chat hook',
        },
        {
          name: 'options.api',
          type: 'string',
          optional: true,
          description: 'API endpoint for chat completions',
        },
        {
          name: 'options.initialMessages',
          type: 'Message[]',
          optional: true,
          description: 'Initial messages to display',
        },
      ],
      returns: {
        type: 'UseChatReturn',
        properties: [
          'messages: Message[]',
          'sendMessage: (content: string) => Promise<void>',
          'isLoading: boolean',
          'error: Error | null',
        ],
      },
      example: `
import { useChat } from '@clarity-chat/react'

function ChatComponent() {
  const { messages, sendMessage, isLoading } = useChat({
    api: '/api/chat',
    initialMessages: [],
  })

  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id}>{msg.content}</div>
      ))}
      <button
        onClick={() => sendMessage('Hello!')}
        disabled={isLoading}
      >
        Send
      </button>
    </div>
  )
}
      `.trim(),
      category: 'hook' as const,
      url: '/hooks/use-chat',
      tags: ['hook', 'react', 'chat', 'api'],
    },
  ]

  // Use API reference config (high precision, large model)
  const chunker = new SemanticChunker(EMBEDDING_CONFIGS['api-reference'])

  const allChunks: EnhancedChunk[] = []

  for (const api of apiDocs) {
    // Format API documentation
    const content = formatAPIReference(api)

    console.log(`  Processing ${api.name}...`)
    const chunks = chunker.chunk(content, {
      title: api.name,
      url: api.url,
      category: api.category,
      symbols: [api.name],
      tags: api.tags,
      headings: ['Parameters', 'Returns', 'Example'],
      lastUpdated: new Date().toISOString(),
    })

    allChunks.push(...chunks)
  }

  console.log(`  Generated ${allChunks.length} API chunks`)

  // Use large model for better API understanding
  console.log('  Generating embeddings with text-embedding-3-large...')
  const embedded = await generateEmbeddingsBatch(allChunks, {
    model: 'text-embedding-3-large',
    dimensions: 1536,
    prefix: 'API Reference:',
  })

  // Store
  const vectorStore = getVectorStore()
  await vectorStore.initialize()
  await vectorStore.upsertBatch(
    embedded.map(chunk => ({
      id: chunk.id,
      title: chunk.metadata.title,
      content: chunk.content,
      url: chunk.metadata.url,
      category: chunk.metadata.category,
      embedding: chunk.embedding!,
      metadata: chunk.metadata,
    }))
  )

  console.log('  ✓ API reference indexed successfully\n')
  return embedded
}

// ============================================================================
// Example 3: Bulk Index All Documentation with Progress Tracking
// ============================================================================

export async function bulkIndexDocumentation(documents: Array<{
  title: string
  content: string
  url: string
  category: 'component' | 'hook' | 'guide' | 'example'
  tags: string[]
}>) {
  console.log(`Example 3: Bulk Indexing ${documents.length} Documents`)

  const allChunks: EnhancedChunk[] = []
  let totalTokens = 0

  // Step 1: Chunk all documents
  console.log('  Step 1: Chunking documents...')
  for (let i = 0; i < documents.length; i++) {
    const doc = documents[i]

    // Select config based on category
    const config = selectConfigForCategory(doc.category)
    const chunker = new SemanticChunker(config)

    const headings = extractHeadings(doc.content)
    const chunks = chunker.chunk(doc.content, {
      title: doc.title,
      url: doc.url,
      category: doc.category,
      tags: doc.tags,
      headings,
      lastUpdated: new Date().toISOString(),
    })

    allChunks.push(...chunks)
    totalTokens += chunks.reduce((sum, c) => sum + c.tokenCount, 0)

    if ((i + 1) % 10 === 0) {
      console.log(`    Progress: ${i + 1}/${documents.length} documents`)
    }
  }

  console.log(`  Generated ${allChunks.length} chunks (${totalTokens.toLocaleString()} tokens)`)

  // Step 2: Deduplicate
  console.log('  Step 2: Deduplicating...')
  const uniqueChunks = deduplicateChunks(allChunks)
  const savedChunks = allChunks.length - uniqueChunks.length
  const savedPercentage = ((savedChunks / allChunks.length) * 100).toFixed(1)
  console.log(`  Removed ${savedChunks} duplicate chunks (${savedPercentage}%)`)

  // Step 3: Generate embeddings in batches
  console.log('  Step 3: Generating embeddings...')
  const batchSize = 100
  const totalBatches = Math.ceil(uniqueChunks.length / batchSize)

  const embeddedChunks: EnhancedChunk[] = []

  for (let i = 0; i < totalBatches; i++) {
    const start = i * batchSize
    const end = Math.min(start + batchSize, uniqueChunks.length)
    const batch = uniqueChunks.slice(start, end)

    try {
      const embedded = await generateEmbeddingsBatch(batch, {
        model: 'text-embedding-3-small',
        dimensions: 1536,
      })

      embeddedChunks.push(...embedded)

      const progress = ((i + 1) / totalBatches * 100).toFixed(1)
      console.log(`    Progress: ${progress}% (batch ${i + 1}/${totalBatches})`)
    } catch (error) {
      console.error(`    Error in batch ${i + 1}:`, error)
      // Implement retry logic here
      throw error
    }
  }

  // Step 4: Store in vector database
  console.log('  Step 4: Storing in vector database...')
  const vectorStore = getVectorStore()
  await vectorStore.initialize()

  // Store in batches of 100 (Pinecone limit)
  for (let i = 0; i < embeddedChunks.length; i += 100) {
    const batch = embeddedChunks.slice(i, i + 100)
    await vectorStore.upsertBatch(
      batch.map(chunk => ({
        id: chunk.id,
        title: chunk.metadata.title,
        content: chunk.content,
        url: chunk.metadata.url,
        category: chunk.metadata.category,
        embedding: chunk.embedding!,
        metadata: chunk.metadata,
      }))
    )
  }

  // Summary
  console.log('\n  Summary:')
  console.log(`    Documents processed: ${documents.length}`)
  console.log(`    Total chunks: ${allChunks.length}`)
  console.log(`    Unique chunks: ${uniqueChunks.length}`)
  console.log(`    Deduplication: ${savedPercentage}%`)
  console.log(`    Total tokens: ${totalTokens.toLocaleString()}`)
  console.log(`    Estimated cost: $${estimateCost(totalTokens, 'text-embedding-3-small')}`)
  console.log('  ✓ Bulk indexing complete\n')

  return embeddedChunks
}

// ============================================================================
// Example 4: Query with Metadata Filtering
// ============================================================================

export async function queryWithMetadata(query: string) {
  console.log(`Example 4: Querying with Metadata - "${query}"`)

  // Generate query embedding
  const { generateEmbedding } = await import('../embeddings')
  const queryEmbedding = await generateEmbedding(query)

  // Search with metadata filters
  const vectorStore = getVectorStore()
  await vectorStore.initialize()

  // Get more results for filtering
  const results = await vectorStore.search(queryEmbedding, 20)

  // Apply metadata-based filtering and reranking
  const filtered = results
    // Filter by category (only components and hooks)
    .filter(r => ['component', 'hook'].includes(r.category))
    // Filter by complexity (only beginner/intermediate)
    .filter(r => !r.metadata.complexity || r.metadata.complexity <= 3)
    // Boost recent updates
    .map(r => ({
      ...r,
      score: r.score * getRecencyBoost(r.metadata.lastUpdated),
    }))
    // Boost exact symbol matches
    .map(r => ({
      ...r,
      score: r.score * getSymbolBoost(query, r.metadata.symbols || []),
    }))
    // Re-sort
    .sort((a, b) => b.score - a.score)
    // Take top 5
    .slice(0, 5)

  console.log(`  Found ${filtered.length} filtered results:`)
  filtered.forEach((result, i) => {
    console.log(`    ${i + 1}. ${result.title} (${result.category})`)
    console.log(`       Score: ${(result.score * 100).toFixed(1)}%`)
    console.log(`       Complexity: ${result.metadata.complexity || 'N/A'}`)
    console.log(`       Updated: ${new Date(result.metadata.lastUpdated).toLocaleDateString()}`)
    if (result.metadata.symbols?.length) {
      console.log(`       Symbols: ${result.metadata.symbols.join(', ')}`)
    }
  })

  return filtered
}

// ============================================================================
// Utility Functions
// ============================================================================

function extractHeadings(content: string): string[] {
  const headingRegex = /^#{1,6}\s+(.+)$/gm
  const headings: string[] = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    headings.push(match[1].trim())
  }

  return headings
}

function formatAPIReference(api: {
  name: string
  signature: string
  description: string
  parameters: Array<{ name: string; type: string; optional?: boolean; description: string }>
  returns: { type: string; properties: string[] }
  example: string
}): string {
  let formatted = `# ${api.name}\n\n`
  formatted += `${api.description}\n\n`
  formatted += `## Signature\n\n\`\`\`typescript\n${api.signature}\n\`\`\`\n\n`
  formatted += `## Parameters\n\n`

  for (const param of api.parameters) {
    const optional = param.optional ? ' (optional)' : ''
    formatted += `- **${param.name}**${optional}: \`${param.type}\`\n`
    formatted += `  ${param.description}\n\n`
  }

  formatted += `## Returns\n\n`
  formatted += `\`${api.returns.type}\` with properties:\n\n`
  for (const prop of api.returns.properties) {
    formatted += `- \`${prop}\`\n`
  }

  formatted += `\n## Example\n\n\`\`\`tsx\n${api.example}\n\`\`\`\n`

  return formatted
}

function selectConfigForCategory(
  category: 'component' | 'hook' | 'guide' | 'example'
): typeof EMBEDDING_CONFIGS[keyof typeof EMBEDDING_CONFIGS] {
  switch (category) {
    case 'component':
    case 'hook':
      return EMBEDDING_CONFIGS['api-reference']
    case 'example':
      return EMBEDDING_CONFIGS.code
    case 'guide':
    default:
      return EMBEDDING_CONFIGS.prose
  }
}

function estimateCost(tokens: number, model: string): string {
  const prices: Record<string, number> = {
    'text-embedding-3-small': 0.02,
    'text-embedding-3-large': 0.13,
    'text-embedding-ada-002': 0.10,
  }

  const cost = (tokens / 1_000_000) * (prices[model] || 0.02)
  return cost.toFixed(4)
}

function getRecencyBoost(lastUpdated: string): number {
  const daysSinceUpdate = (Date.now() - new Date(lastUpdated).getTime()) / (1000 * 60 * 60 * 24)

  if (daysSinceUpdate < 7) return 1.1    // Recently updated
  if (daysSinceUpdate < 30) return 1.05  // Updated this month
  if (daysSinceUpdate < 90) return 1.0   // Updated this quarter
  return 0.95                             // Older content
}

function getSymbolBoost(query: string, symbols: string[]): number {
  const queryLower = query.toLowerCase()

  for (const symbol of symbols) {
    if (queryLower.includes(symbol.toLowerCase())) {
      return 1.15 // Exact symbol match
    }
  }

  return 1.0
}

// ============================================================================
// Run Examples
// ============================================================================

export async function runAllExamples() {
  try {
    console.log('='.repeat(60))
    console.log('Enhanced Embedding Strategy - Examples')
    console.log('='.repeat(60))
    console.log()

    // Example 1: Component documentation
    await indexComponentDoc()

    // Example 2: API reference
    await indexAPIReference()

    // Example 3: Bulk indexing
    // (Commented out - would need actual documents)
    // await bulkIndexDocumentation(documents)

    // Example 4: Query with metadata
    await queryWithMetadata('how to use the ChatWindow component')

    console.log('='.repeat(60))
    console.log('All examples completed successfully!')
    console.log('='.repeat(60))
  } catch (error) {
    console.error('Error running examples:', error)
    throw error
  }
}

// Run examples if called directly
if (require.main === module) {
  runAllExamples()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}
