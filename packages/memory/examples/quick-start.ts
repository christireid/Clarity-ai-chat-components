import { logger } from '@clarity-chat/utils/logger';
/**
 * Quick Start Example
 * The simplest possible usage of Clarity Memory
 * 
 * Run: npm run example:basic
 * or: npx tsx examples/quick-start.ts
 */

import { clarityMemory } from '../src/core/memory'

async function main() {
  logger.debug('🚀 Clarity Memory Quick Start\n')

  // Step 1: Create memory instance (zero config!)
  const mem = clarityMemory()
  logger.debug('✅ Memory instance created\n')

  // Step 2: Add some memories
  logger.debug('📝 Adding memories...')
  await mem.add("User prefers TypeScript over JavaScript", {
    type: 'semantic',
    importance: 0.9,
    tags: ['preferences', 'programming']
  })

  await mem.add("User is a frontend developer", {
    type: 'profile',
    importance: 1.0
  })

  await mem.add("User asked about React hooks today", {
    type: 'episodic',
    importance: 0.5
  })
  logger.debug('✅ Memories added\n')

  // Step 3: Search for memories
  logger.debug('🔍 Searching for "user preferences"...')
  const results = await mem.search("user preferences", {
    limit: 5
  })
  
  logger.debug(`Found ${results.length} results:`)
  results.forEach((result, i) => {
    logger.debug(`  ${i + 1}. [${result.score.toFixed(2)}] ${result.memory.content}`)
  })
  logger.debug()

  // Step 4: Get optimized context for LLM
  logger.debug('📦 Getting optimized context...')
  const context = await mem.context({
    maxTokens: 500,
    query: "user preferences"
  })
  
  logger.debug(`Context (${context.tokens} tokens):`)
  logger.debug(context.text)
  logger.debug()

  // Step 5: Check statistics
  logger.debug('📊 Statistics:')
  const stats = await mem.getStats()
  logger.debug(`  Total memories: ${stats.total}`)
  logger.debug(`  By type:`, stats.byType)
  logger.debug(`  Total tokens: ${stats.totalTokens}`)
  logger.debug()

  // Cleanup
  await mem.close()
  logger.debug('✅ Example complete!')
}

main().catch((error) => {
  logger.logger.error('❌ Error:', error)
  process.exit(1)
})
