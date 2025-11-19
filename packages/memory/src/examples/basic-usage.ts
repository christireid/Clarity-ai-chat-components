/**
 * Basic Usage Example
 * 
 * Demonstrates the core Clarity Memory API
 */

import { clarityMemory } from '../factory'

async function basicExample() {
  // Zero-config usage
  const memory = clarityMemory()
  await memory.initialize()

  // Add memories
  await memory.add('User prefers dark mode', {
    type: 'semantic',
    scope: 'user',
    importance: 0.8,
    tags: ['preferences', 'ui'],
  })

  await memory.add('User mentioned they work as a software engineer', {
    type: 'episodic',
    scope: 'session',
    importance: 0.6,
  })

  // Recall memories
  const results = await memory.recall('user preferences')
  console.log('Found memories:', results.length)
  results.forEach(result => {
    console.log(`- ${result.memory.content} (score: ${(result.score ?? result.relevance).toFixed(2)})`)
  })

  // Get optimized context
  const context = await memory.context({ maxTokens: 1000 })
  console.log('\nContext bundle:')
  console.log(`Total tokens: ${context.tokenBreakdown.total}`)
  console.log(`Semantic memories: ${context.semanticMemories?.length ?? 0}`)
  console.log(`Episodic memories: ${context.episodicMemories?.length ?? 0}`)
  console.log('\nFormatted context:')
  console.log(context.formatted)

  // Get stats
  const stats = await memory.getStats()
  console.log('\nMemory stats:', stats)

  await memory.close()
}

// Example with OpenAI embeddings
async function withEmbeddingsExample() {
  const memory = clarityMemory({
    embeddingProvider: {
      provider: 'openai',
      apiKey: process.env.OPENAI_API_KEY || '',
      model: 'text-embedding-3-small',
    },
    tokenBudget: {
      maxContextWindow: 4096,
      allocation: {
        systemPrompt: 512,
        userPreferences: 614,
        recentContext: 1229,
        semanticMemory: 1024,
        episodicMemory: 614,
        responseReserve: 205,
      },
      dynamicAllocation: true,
    },
  })

  await memory.initialize()

  // Add memories with automatic embedding generation
  await memory.add('I love TypeScript and React')
  await memory.add('I prefer functional programming over OOP')
  await memory.add('My favorite framework is Next.js')

  // Semantic search with embeddings
  const results = await memory.recall('programming languages', {
    limit: 5,
    minConfidence: 0.5,
  })

  console.log('Semantic search results:', results.map(r => ({
    content: r.memory.content,
    score: r.score,
    relevance: r.relevance,
  })))

  await memory.close()
}

// Run examples if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  basicExample().catch(console.error)
  void withEmbeddingsExample().catch(console.error)
}
