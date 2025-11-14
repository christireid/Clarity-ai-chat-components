/**
 * Clarity Memory - Basic Usage Example
 * 
 * Demonstrates the core API of Clarity Memory
 */

import { clarityMemory } from '../src/clarity-memory'

async function main() {
  // Create a memory instance (zero-config)
  const memory = clarityMemory()

  // Add memories
  await memory.add("User prefers TypeScript over JavaScript")
  await memory.add("User likes dark mode UI")
  await memory.add("User works on AI/ML projects", {
    type: 'semantic',
    tags: ['work', 'ai'],
    importance: 0.8,
  })

  // Search for memories
  const results = await memory.search("What does user prefer?")
  console.log('Search results:', results.map(r => r.content))

  // Recall with context bundling
  const context = await memory.recall("Tell me about user preferences", {
    maxTokens: 500,
    includeSummary: true,
  })
  
  console.log('\nContext Bundle:')
  console.log('Total memories:', context.memories.length)
  console.log('Total tokens:', context.tokens)
  console.log('Summary:', context.summary)
  console.log('\nMemories:')
  context.memories.forEach(m => {
    console.log(`- [${m.type}] ${m.content} (importance: ${m.importance})`)
  })

  // Get statistics
  const stats = await memory.stats()
  console.log('\nMemory Statistics:')
  console.log('Total:', stats.total)
  console.log('By type:', stats.byType)
  console.log('Total tokens:', stats.totalTokens)
  console.log('Average importance:', stats.averageImportance)

  // List all memories
  const allMemories = await memory.list()
  console.log('\nAll memories:', allMemories.length)

  // Cleanup
  await memory.clear()
}

// Run example
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}
