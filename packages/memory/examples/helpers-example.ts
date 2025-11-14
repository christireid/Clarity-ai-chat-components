/**
 * Clarity Memory - Helpers Example
 * 
 * Demonstrates helper utilities for common operations
 */

import { clarityMemory } from '../src/clarity-memory'
import {
  createSemanticMemory,
  createEpisodicMemory,
  extractTags,
  estimateImportance,
  formatMemory,
  groupByType,
  sortByImportance,
} from '../src/utils/helpers'

async function main() {
  console.log('🛠️  Clarity Memory Helpers Example\n')

  const memory = clarityMemory()

  // Example 1: Using helper functions to create memories
  console.log('1️⃣  Creating memories with helpers...')
  const semanticMem = createSemanticMemory("User prefers TypeScript", 0.9)
  const episodicMem = createEpisodicMemory("User asked about memory system")
  
  await memory.add(semanticMem.content!, semanticMem)
  await memory.add(episodicMem.content!, episodicMem)
  console.log('   ✅ Memories created\n')

  // Example 2: Extract tags from content
  console.log('2️⃣  Extracting tags...')
  const content = "User likes TypeScript, React, and Node.js"
  const tags = extractTags(content)
  console.log(`   Content: "${content}"`)
  console.log(`   Tags: ${tags.join(', ')}\n`)

  // Example 3: Estimate importance
  console.log('3️⃣  Estimating importance...')
  const importance1 = estimateImportance("I really love TypeScript!")
  const importance2 = estimateImportance("What is TypeScript?")
  console.log(`   "I really love TypeScript!" → ${importance1.toFixed(2)}`)
  console.log(`   "What is TypeScript?" → ${importance2.toFixed(2)}\n`)

  // Example 4: Format memory
  console.log('4️⃣  Formatting memories...')
  const allMemories = await memory.list()
  if (allMemories.length > 0) {
    console.log('   Short format:')
    console.log(`   ${formatMemory(allMemories[0], 'short')}`)
    console.log('\n   Full format:')
    console.log(`   ${formatMemory(allMemories[0], 'full')}\n`)
  }

  // Example 5: Group by type
  console.log('5️⃣  Grouping memories by type...')
  const grouped = groupByType(allMemories)
  console.log(`   Episodic: ${grouped.episodic.length}`)
  console.log(`   Semantic: ${grouped.semantic.length}`)
  console.log(`   Persistent: ${grouped.persistent.length}`)
  console.log(`   Ephemeral: ${grouped.ephemeral.length}\n`)

  // Example 6: Sort by importance
  console.log('6️⃣  Sorting by importance...')
  const sorted = sortByImportance(allMemories)
  sorted.forEach((m, i) => {
    console.log(`   ${i + 1}. [${m.importance.toFixed(2)}] ${m.content.substring(0, 50)}...`)
  })

  console.log('\n✨ All helper examples completed!')
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}
