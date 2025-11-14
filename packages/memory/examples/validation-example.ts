/**
 * Clarity Memory - Validation Example
 * 
 * Demonstrates input validation and helpful error messages
 */

import { clarityMemory } from '../src/clarity-memory'

async function main() {
  console.log('🔍 Clarity Memory Validation Example\n')

  const memory = clarityMemory()

  // Example 1: Valid memory
  console.log('✅ Adding valid memory...')
  try {
    await memory.add("User prefers TypeScript")
    console.log('   Success!\n')
  } catch (error) {
    console.error('   Error:', error)
  }

  // Example 2: Empty content (should fail)
  console.log('❌ Trying empty content...')
  try {
    await memory.add("")
  } catch (error) {
    console.log('   Caught error:', (error as Error).message)
    console.log('   ✅ Validation works!\n')
  }

  // Example 3: Invalid importance (should fail)
  console.log('❌ Trying invalid importance...')
  try {
    await memory.add("Test", { importance: 2.0 })
  } catch (error) {
    console.log('   Caught error:', (error as Error).message)
    console.log('   ✅ Validation works!\n')
  }

  // Example 4: Content too long (should fail)
  console.log('❌ Trying very long content...')
  try {
    await memory.add("x".repeat(100001))
  } catch (error) {
    console.log('   Caught error:', (error as Error).message)
    console.log('   ✅ Validation works!\n')
  }

  // Example 5: Invalid ID (should fail)
  console.log('❌ Trying invalid ID...')
  try {
    await memory.get("")
  } catch (error) {
    console.log('   Caught error:', (error as Error).message)
    console.log('   ✅ Validation works!\n')
  }

  console.log('✨ All validation examples completed!')
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}
