import { logger } from '@clarity-chat/utils/logger';
/**
 * Basic Usage Example
 * Demonstrates the zero-config clarityMemory() API
 * 
 * Run: npm run example:basic
 * or: npx tsx examples/basic-usage.ts
 */

import { clarityMemory } from '../src/core/memory'

async function main() {
  // Zero-config usage - works out of the box!
  const mem = clarityMemory()

  logger.debug('✅ Memory instance created')

  // Add some memories
  logger.debug('\n📝 Adding memories...')
  await mem.add("User prefers TypeScript over JavaScript", {
    type: 'semantic',
    importance: 0.9,
    tags: ['preferences', 'programming'],
  })

  await mem.add("User loves dark mode", {
    type: 'semantic',
    importance: 0.8,
    tags: ['preferences', 'ui'],
  })

  await mem.add("User asked about React hooks", {
    type: 'episodic',
    importance: 0.6,
  })

  logger.debug('✅ Memories added')

  // Search for relevant memories
  logger.debug('\n🔍 Searching memories...')
  const results = await mem.search("What are the user's preferences?", {
    limit: 5,
    minScore: 0.5,
  })

  logger.debug(`Found ${results.length} relevant memories:`)
  results.forEach((result, i) => {
    logger.debug(`  ${i + 1}. [${result.score.toFixed(2)}] ${result.memory.content}`)
  })

  // Get optimized context for LLM
  logger.debug('\n📦 Getting context bundle...')
  const context = await mem.context({
    maxTokens: 500,
    query: "user preferences",
    prioritizeRecent: true,
  })

  logger.debug(`Context bundle:`)
  logger.debug(`  Total tokens: ${context.totalTokens}`)
  logger.debug(`  Memories: ${context.memories.length}`)
  logger.debug(`  Strategy: ${context.metadata.strategy}`)
  logger.debug('\n  Memory contents:')
  context.memories.forEach((memory, i) => {
    logger.debug(`    ${i + 1}. ${memory.content}`)
  })

  // Get statistics
  logger.debug('\n📊 Statistics:')
  const stats = await mem.getStats()
  logger.debug(`  Total memories: ${stats.total}`)
  logger.debug(`  By type:`, stats.byType)
  logger.debug(`  Average importance: ${stats.averageImportance.toFixed(2)}`)
  logger.debug(`  Average tokens: ${stats.averageTokens.toFixed(0)}`)

  // Inspect system state
  logger.debug('\n🔍 System inspection:')
  const state = await mem.inspect()
  logger.debug(`  Total memories: ${state.totalMemories}`)
  logger.debug(`  Total tokens: ${state.totalTokens}`)
  logger.debug(`  Storage: ${state.storage.type} (${state.storage.size})`)

  logger.debug('\n✅ Example complete!')
}

main().catch(console.error)
