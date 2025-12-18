/**
 * Clarity Memory - Basic Demo
 *
 * This demo shows the core features of Clarity Memory in a simple,
 * copy-paste-ready example.
 */

import { clarityMemory } from '@clarity-chat/memory'

async function basicDemo() {
  console.log('🚀 Clarity Memory - Basic Demo\n')

  // ============================================
  // 1. Zero-Config Usage
  // ============================================
  console.log('1. Zero-Config Usage')
  console.log('─────────────────────')

  // Simplest possible usage - works immediately!
  const memory = clarityMemory()

  // Add memories
  await memory.add('User likes pizza')
  await memory.add('User works as a software engineer')
  await memory.add('User lives in San Francisco')
  await memory.add('User prefers dark mode')

  console.log('✅ Added 4 memories\n')

  // ============================================
  // 2. Simple Recall
  // ============================================
  console.log('2. Simple Recall')
  console.log('────────────────')

  const results = await memory.recall('What does the user like?')
  console.log(`Found ${results.memories.length} relevant memories:`)
  results.memories.forEach((m, i) => {
    console.log(`  ${i + 1}. ${m.content}`)
  })
  console.log(`Tokens used: ${results.tokens}\n`)

  // ============================================
  // 3. Advanced Search
  // ============================================
  console.log('3. Advanced Search')
  console.log('──────────────────')

  const searchResults = await memory.search({
    query: 'Where does the user work?',
    limit: 5,
    minScore: 0.5,
    sortBy: 'relevance',
  })

  console.log(`Found ${searchResults.length} results:`)
  searchResults.forEach((result, i) => {
    console.log(
      `  ${i + 1}. ${result.memory.content} (score: ${result.score.toFixed(2)})`
    )
  })
  console.log()

  // ============================================
  // 4. Context Bundling
  // ============================================
  console.log('4. Context Bundling for LLM')
  console.log('────────────────────────────')

  const bundle = await memory.context({
    query: 'Tell me about the user',
    maxTokens: 2000,
    format: 'openai',
    includeSummary: true,
  })

  console.log(`Context bundle prepared:`)
  console.log(`  Messages: ${bundle.messages.length}`)
  console.log(`  Tokens: ${bundle.tokens}`)
  console.log(`  Summary: ${bundle.summary ? 'Yes' : 'No'}`)
  console.log(`  Format: ${bundle.format}`)
  console.log()

  // ============================================
  // 5. Memory Management
  // ============================================
  console.log('5. Memory Management')
  console.log('───────────────────')

  // Get stats
  const stats = await memory.stats()
  console.log(`Total memories: ${stats.totalMemories}`)
  console.log(`Total tokens: ${stats.tokens}`)
  console.log(`Average importance: ${stats.averageImportance.toFixed(2)}`)
  console.log()

  // Promote a memory
  const firstMemory = results.memories[0]
  if (firstMemory) {
    await memory.promote(firstMemory.id)
    console.log(
      `✅ Promoted memory: ${firstMemory.content.substring(0, 30)}...`
    )
  }
  console.log()

  // ============================================
  // 6. Compression
  // ============================================
  console.log('6. Memory Compression')
  console.log('─────────────────────')

  // Add more memories to demonstrate compression
  for (let i = 0; i < 10; i++) {
    await memory.add(`Memory item ${i}: Some information about topic ${i % 3}`)
  }

  const compressionResult = await memory.compress({
    strategy: 'adaptive',
    targetSize: '50%',
  })

  console.log(`Compression result:`)
  console.log(`  Before: ${compressionResult.before} memories`)
  console.log(`  After: ${compressionResult.after} memories`)
  console.log(`  Ratio: ${compressionResult.ratio.toFixed(2)}`)
  console.log(`  Strategy: ${compressionResult.strategy}`)
  console.log()

  // ============================================
  // 7. Cleanup
  // ============================================
  console.log('7. Cleanup')
  console.log('──────────')

  await memory.close()
  console.log('✅ Memory closed\n')

  console.log('✨ Demo complete!')
}

// Run the demo
if (require.main === module) {
  basicDemo().catch(console.error)
}

export { basicDemo }
