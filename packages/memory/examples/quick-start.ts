/**
 * Clarity Memory - Quick Start Example
 * 
 * Copy-paste ready example showing the simplest possible usage
 */

import { clarityMemory } from '../src/clarity-memory'

async function main() {
  console.log('🚀 Clarity Memory Quick Start\n')

  // Step 1: Create memory instance (zero config!)
  const memory = clarityMemory()
  console.log('✅ Memory instance created\n')

  // Step 2: Add some memories
  console.log('📝 Adding memories...')
  await memory.add("User prefers TypeScript over JavaScript")
  await memory.add("User likes dark mode UI")
  await memory.add("User works on AI/ML projects", {
    type: 'semantic',
    importance: 0.8,
    tags: ['work', 'ai'],
  })
  console.log('✅ Memories added\n')

  // Step 3: Search for memories
  console.log('🔍 Searching for "user preferences"...')
  const results = await memory.search("user preferences")
  console.log(`Found ${results.length} memories:`)
  results.forEach((m, i) => {
    console.log(`  ${i + 1}. [${m.type}] ${m.content}`)
  })
  console.log()

  // Step 4: Recall with context bundling
  console.log('🧠 Recalling context for "Tell me about user preferences"...')
  const context = await memory.recall("Tell me about user preferences", {
    maxTokens: 500,
    includeSummary: true,
  })
  
  console.log(`✅ Context bundle created:`)
  console.log(`   - ${context.memories.length} memories`)
  console.log(`   - ${context.tokens} tokens`)
  console.log(`   - Summary: ${context.summary || 'none'}\n`)

  // Step 5: Get statistics
  console.log('📊 Memory statistics:')
  const stats = await memory.stats()
  console.log(`   - Total: ${stats.total}`)
  console.log(`   - By type:`, stats.byType)
  console.log(`   - Total tokens: ${stats.totalTokens}`)
  console.log(`   - Avg importance: ${stats.averageImportance.toFixed(2)}\n`)

  // Step 6: Format context for LLM
  console.log('📤 Formatted context (ready for LLM):')
  console.log(context.toPrompt())
  console.log()

  console.log('✨ Done! Your memory system is working.')
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}
