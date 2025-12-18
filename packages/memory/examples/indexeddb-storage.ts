import { logger } from '@clarity-chat/utils/logger';
/**
 * IndexedDB Storage Example
 * Demonstrates using browser-native IndexedDB storage
 * 
 * Note: This example is for browser environments only
 * Run in a browser console or use with a bundler
 */

import { clarityMemory } from '../src/core/memory'

async function main() {
  // Check if we're in a browser environment
  if (typeof window === 'undefined' || !window.indexedDB) {
    logger.error('❌ IndexedDB is only available in browser environments')
    logger.debug('   This example should be run in a browser')
    return
  }

  logger.debug('🗄️  IndexedDB Storage Example\n')

  // Create memory instance with IndexedDB storage
  const mem = clarityMemory({
    vectorStore: {
      type: 'indexeddb',
      dbName: 'clarity-memory-example',
    },
  })

  logger.debug('✅ Memory instance created with IndexedDB storage')

  // Add some memories
  logger.debug('\n📝 Adding memories...')
  await mem.add("User prefers dark mode", {
    type: 'semantic',
    importance: 0.9,
    tags: ['preferences', 'ui'],
  })

  await mem.add("User is a frontend developer", {
    type: 'profile',
    importance: 1.0,
  })

  await mem.add("User asked about CSS Grid", {
    type: 'episodic',
  })

  logger.debug('✅ Memories added and persisted to IndexedDB')

  // Get statistics
  const stats = await mem.getStats()
  logger.debug(`\n📊 Statistics:`)
  logger.debug(`   Total: ${stats.total}`)
  logger.debug(`   By type:`, stats.byType)

  // Search for memories
  const results = await mem.search("user preferences", {
    limit: 5,
  })

  logger.debug(`\n🔍 Found ${results.length} relevant memories:`)
  results.forEach((result, i) => {
    logger.debug(`   ${i + 1}. [${result.score.toFixed(2)}] ${result.memory.content}`)
  })

  // Close
  await mem.close()
  logger.debug('\n✅ Example complete!')
  logger.debug('   Memories are persisted in IndexedDB')
  logger.debug('   Database name: clarity-memory-example')
}

// Only run if in browser
if (typeof window !== 'undefined') {
  main().catch(console.error)
} else {
  logger.debug('This example requires a browser environment')
}
