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
    console.error('❌ IndexedDB is only available in browser environments')
    console.log('   This example should be run in a browser')
    return
  }

  console.log('🗄️  IndexedDB Storage Example\n')

  // Create memory instance with IndexedDB storage
  const mem = clarityMemory({
    vectorStore: {
      type: 'indexeddb',
      dbName: 'clarity-memory-example',
    },
  })

  console.log('✅ Memory instance created with IndexedDB storage')

  // Add some memories
  console.log('\n📝 Adding memories...')
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

  console.log('✅ Memories added and persisted to IndexedDB')

  // Get statistics
  const stats = await mem.getStats()
  console.log(`\n📊 Statistics:`)
  console.log(`   Total: ${stats.total}`)
  console.log(`   By type:`, stats.byType)

  // Search for memories
  const results = await mem.search("user preferences", {
    limit: 5,
  })

  console.log(`\n🔍 Found ${results.length} relevant memories:`)
  results.forEach((result, i) => {
    console.log(`   ${i + 1}. [${result.score.toFixed(2)}] ${result.memory.content}`)
  })

  // Close
  await mem.close()
  console.log('\n✅ Example complete!')
  console.log('   Memories are persisted in IndexedDB')
  console.log('   Database name: clarity-memory-example')
}

// Only run if in browser
if (typeof window !== 'undefined') {
  main().catch(console.error)
} else {
  console.log('This example requires a browser environment')
}
