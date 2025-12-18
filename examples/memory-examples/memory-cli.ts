#!/usr/bin/env node
/**
 * Standalone Node.js CLI Example - Clarity Memory
 *
 * This example demonstrates using Clarity Memory in a command-line application
 * for interactive chat with persistent memory.
 *
 * Install dependencies: npm install readline
 * Run: npx tsx examples/memory-examples/memory-cli.ts
 */

import * as readline from 'readline'
import { clarityMemory } from '../../packages/memory/src/factory'

// Initialize memory service with file persistence
// @ts-expect-error - Example uses minimal config, factory provides defaults
const memory = clarityMemory({
  debug: false,
  storage: {
    type: 'memory', // Change to 'file' with path for persistence
  },
})

// Initialize memory
await memory.initialize()

// Create readline interface for CLI input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '\n💭 You: ',
})

console.log('╔═══════════════════════════════════════════════════════════╗')
console.log('║         🧠 Clarity Memory CLI Chat Demo                 ║')
console.log('╚═══════════════════════════════════════════════════════════╝')
console.log('\nThis is a simple CLI chat with memory capabilities.')
console.log('Type your messages and the system will remember context.')
console.log('Commands: /stats, /clear, /exit\n')

rl.prompt()

rl.on('line', async (input) => {
  const message = input.trim()

  if (!message) {
    rl.prompt()
    return
  }

  // Handle special commands
  if (message === '/exit' || message === '/quit') {
    console.log('\n👋 Goodbye! Closing memory and exiting...')
    await memory.close()
    rl.close()
    process.exit(0)
  }

  if (message === '/stats') {
    const stats = memory.getStats()
    console.log('\n📊 Memory Statistics:')
    console.log(`  Total memories: ${stats.total}`)
    console.log(`  By type: ${JSON.stringify(stats.byType, null, 2)}`)
    console.log(`  Total tokens: ${stats.totalTokens}`)
    rl.prompt()
    return
  }

  if (message === '/clear') {
    // Note: clearAll() may not be available, this is a placeholder
    console.log(
      '✨ Memory cleared (in production, implement clearAll() method)'
    )
    rl.prompt()
    return
  }

  if (message.startsWith('/')) {
    console.log(`\n❌ Unknown command: ${message}`)
    console.log('Available commands: /stats, /clear, /exit')
    rl.prompt()
    return
  }

  try {
    // Search for relevant memories
    const relevantMemories = await memory.recall(message, {
      limit: 5,
      minConfidence: 0.6,
    })

    // Get optimized context
    const contextBundle = await memory.context({
      maxTokens: 500,
    })

    // Generate response (in real app, call your LLM here)
    const response = await generateResponse(
      message,
      contextBundle.formatted || '',
      relevantMemories.length
    )

    // Display response
    console.log(`\n🤖 Assistant: ${response}`)

    // Store the conversation
    await Promise.all([
      memory.add(message, {
        type: 'episodic',
        scope: 'session',
        importance: 0.5,
        tags: ['user-message'],
      }),
      memory.add(response, {
        type: 'episodic',
        scope: 'session',
        importance: 0.6,
        tags: ['assistant-response'],
      }),
    ])

    // Show memory info
    if (relevantMemories.length > 0) {
      console.log(`   (Used ${relevantMemories.length} relevant memories)`)
    }
  } catch (error) {
    console.error('\n❌ Error:', error)
  }

  rl.prompt()
})

rl.on('close', () => {
  console.log('\n👋 Session ended.')
  process.exit(0)
})

/**
 * Mock response generator
 * In a real application, replace this with actual LLM integration
 */
async function generateResponse(
  message: string,
  context: string,
  memoriesUsed: number
): Promise<string> {
  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Mock responses based on keywords
  if (
    message.toLowerCase().includes('hello') ||
    message.toLowerCase().includes('hi')
  ) {
    return `Hello! I'm here to help. ${memoriesUsed > 0 ? 'I remember our previous conversations.' : 'This is our first chat!'}`
  }

  if (message.toLowerCase().includes('name')) {
    return "I'm a Clarity Memory-powered assistant. I can remember things you tell me!"
  }

  if (message.toLowerCase().includes('remember')) {
    await memory.add(message, {
      type: 'semantic',
      scope: 'user',
      importance: 0.9,
      tags: ['user-fact'],
    })
    return "I've stored that in my semantic memory. I'll remember it for future conversations!"
  }

  // Default response
  return `I understand you said: "${message}". ${
    context ? `I'm using context from ${memoriesUsed} previous memories.` : ''
  } In a real implementation, this would be an LLM response.`
}
