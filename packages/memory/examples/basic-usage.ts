/**
 * Clarity Memory - Basic Usage Example
 * 
 * This example demonstrates basic usage of Clarity Memory.
 * Run with: npx tsx examples/basic-usage.ts
 */

import { clarityMemory } from '../src/core/memory'

async function main() {
  console.log('🚀 Clarity Memory - Basic Usage Example\n')

  // Create a memory instance (zero-config)
  const memory = clarityMemory({
    context: 'example-user',
  })

  // Initialize
  await memory.init()
  console.log('✅ Memory initialized\n')

  // Add memories
  console.log('1. Adding memories...')
  try {
    // TODO: Uncomment when add() is implemented
    // await memory.add('User likes pizza')
    // await memory.add('User works as a software engineer')
    // await memory.add('User lives in San Francisco')
    // console.log('✅ Added 3 memories\n')
    console.log('⏳ add() method not yet implemented\n')
  } catch (error) {
    console.error('❌ Error adding memories:', error)
  }

  // Recall memories
  console.log('2. Recalling memories...')
  try {
    // TODO: Uncomment when recall() is implemented
    // const result = await memory.recall('What does the user like?')
    // console.log(`Found ${result.memories.length} relevant memories:`)
    // result.memories.forEach((m, i) => {
    //   console.log(`  ${i + 1}. ${m.content}`)
    // })
    // console.log(`Tokens used: ${result.tokens}\n`)
    console.log('⏳ recall() method not yet implemented\n')
  } catch (error) {
    console.error('❌ Error recalling memories:', error)
  }

  // Get statistics
  console.log('3. Getting statistics...')
  try {
    // TODO: Uncomment when stats() is implemented
    // const stats = await memory.stats()
    // console.log(`Total memories: ${stats.totalMemories}`)
    // console.log(`Total tokens: ${stats.totalTokens}`)
    // console.log(`Average importance: ${stats.averageImportance.toFixed(2)}\n`)
    console.log('⏳ stats() method not yet implemented\n')
  } catch (error) {
    console.error('❌ Error getting stats:', error)
  }

  // Close
  await memory.close()
  console.log('✅ Memory closed\n')
  console.log('✨ Example complete!')
}

// Run if executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
}

export { main }
