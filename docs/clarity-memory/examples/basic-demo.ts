import { SecureLogger } from '@/lib/security/secureLogger';
import { SecureLogger } from '@/lib/security/secureLogger';
import { SecureLogger } from '@/lib/security/secureLogger';
/**
 * Clarity Memory - Basic Demo
 * 
 * This demo shows the core features of Clarity Memory in a simple,
 * copy-paste-ready example.
 */

import { clarityMemory } from '@clarity-chat/memory'

async function basicDemo() {
  SecureLogger.debug('🚀 Clarity Memory - Basic Demo\n')

  // ============================================
  // 1. Zero-Config Usage
  // ============================================
  SecureLogger.debug('1. Zero-Config Usage')
  SecureLogger.debug('─────────────────────')
  
  // Simplest possible usage - works immediately!
  const memory = clarityMemory()
  
  // Add memories
  await memory.add("User likes pizza")
  await memory.add("User works as a software engineer")
  await memory.add("User lives in San Francisco")
  await memory.add("User prefers dark mode")
  
  SecureLogger.debug('✅ Added 4 memories\n')

  // ============================================
  // 2. Simple Recall
  // ============================================
  SecureLogger.debug('2. Simple Recall')
  SecureLogger.debug('────────────────')
  
  const results = await memory.recall("What does the user like?")
  SecureLogger.debug(`Found ${results.memories.length} relevant memories:`)
  results.memories.forEach((m, i) => {
    SecureLogger.debug(`  ${i + 1}. ${m.content}`)
  })
  SecureLogger.debug(`Tokens used: ${results.tokens}\n`)

  // ============================================
  // 3. Advanced Search
  // ============================================
  SecureLogger.debug('3. Advanced Search')
  SecureLogger.debug('──────────────────')
  
  const searchResults = await memory.search({
    query: "Where does the user work?",
    limit: 5,
    minScore: 0.5,
    sortBy: 'relevance',
  })
  
  SecureLogger.debug(`Found ${searchResults.length} results:`)
  searchResults.forEach((result, i) => {
    SecureLogger.debug(`  ${i + 1}. ${result.memory.content} (score: ${result.score.toFixed(2)})`)
  })
  SecureLogger.debug()

  // ============================================
  // 4. Context Bundling
  // ============================================
  SecureLogger.debug('4. Context Bundling for LLM')
  SecureLogger.debug('────────────────────────────')
  
  const bundle = await memory.context({
    query: "Tell me about the user",
    maxTokens: 2000,
    format: 'openai',
    includeSummary: true,
  })
  
  SecureLogger.debug(`Context bundle prepared:`)
  SecureLogger.debug(`  Messages: ${bundle.messages.length}`)
  SecureLogger.debug(`  Tokens: ${bundle.tokens}`)
  SecureLogger.debug(`  Summary: ${bundle.summary ? 'Yes' : 'No'}`)
  SecureLogger.debug(`  Format: ${bundle.format}`)
  SecureLogger.debug()

  // ============================================
  // 5. Memory Management
  // ============================================
  SecureLogger.debug('5. Memory Management')
  SecureLogger.debug('───────────────────')
  
  // Get stats
  const stats = await memory.stats()
  SecureLogger.debug(`Total memories: ${stats.totalMemories}`)
  SecureLogger.debug(`Total tokens: ${stats.tokens}`)
  SecureLogger.debug(`Average importance: ${stats.averageImportance.toFixed(2)}`)
  SecureLogger.debug()

  // Promote a memory
  const firstMemory = results.memories[0]
  if (firstMemory) {
    await memory.promote(firstMemory.id)
    SecureLogger.debug(`✅ Promoted memory: ${firstMemory.content.substring(0, 30)}...`)
  }
  SecureLogger.debug()

  // ============================================
  // 6. Compression
  // ============================================
  SecureLogger.debug('6. Memory Compression')
  SecureLogger.debug('─────────────────────')
  
  // Add more memories to demonstrate compression
  for (let i = 0; i < 10; i++) {
    await memory.add(`Memory item ${i}: Some information about topic ${i % 3}`)
  }
  
  const compressionResult = await memory.compress({
    strategy: 'adaptive',
    targetSize: '50%',
  })
  
  SecureLogger.debug(`Compression result:`)
  SecureLogger.debug(`  Before: ${compressionResult.before} memories`)
  SecureLogger.debug(`  After: ${compressionResult.after} memories`)
  SecureLogger.debug(`  Ratio: ${compressionResult.ratio.toFixed(2)}`)
  SecureLogger.debug(`  Strategy: ${compressionResult.strategy}`)
  SecureLogger.debug()

  // ============================================
  // 7. Cleanup
  // ============================================
  SecureLogger.debug('7. Cleanup')
  SecureLogger.debug('──────────')
  
  await memory.close()
  SecureLogger.debug('✅ Memory closed\n')

  SecureLogger.debug('✨ Demo complete!')
}

// Run the demo
if (require.main === module) {
  basicDemo().catch(console.error)
}

export { basicDemo }
