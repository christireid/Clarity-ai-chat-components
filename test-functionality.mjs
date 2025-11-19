#!/usr/bin/env node
/**
 * Functional test script - Verify package exports and functionality
 */

console.log('🧪 Testing Package Functionality\n')

// Test 1: Types package
console.log('1. Testing @clarity-chat/types...')
try {
  const types = await import('./packages/types/dist/index.mjs')
  console.log('   ✅ Types package imports successfully')
  console.log('   📦 Exports:', Object.keys(types).length, 'items')
} catch (error) {
  console.error('   ❌ Error:', error.message)
}

// Test 2: Primitives package
console.log('\n2. Testing @clarity-chat/primitives...')
try {
  const primitives = await import('./packages/primitives/dist/index.mjs')
  const exports = Object.keys(primitives)
  console.log('   ✅ Primitives package imports successfully')
  console.log('   📦 Exports:', exports.length, 'items')
  console.log('   🎨 Components:', exports.filter(e => !e.startsWith('use')).slice(0, 5).join(', '), '...')
} catch (error) {
  console.error('   ❌ Error:', error.message)
}

// Test 3: Error handling package
console.log('\n3. Testing @clarity-chat/error-handling...')
try {
  const errorHandling = await import('./packages/error-handling/dist/index.mjs')
  console.log('   ✅ Error handling package imports successfully')
  console.log('   📦 Exports:', Object.keys(errorHandling).length, 'items')
} catch (error) {
  console.error('   ❌ Error:', error.message)
}

// Test 4: Memory package
console.log('\n4. Testing @clarity-chat/memory...')
try {
  const memory = await import('./packages/memory/dist/index.mjs')
  console.log('   ✅ Memory package imports successfully')
  console.log('   📦 Exports:', Object.keys(memory).length, 'items')
} catch (error) {
  console.error('   ❌ Error:', error.message)
}

// Test 5: React package
console.log('\n5. Testing @clarity-chat/react...')
try {
  const react = await import('./packages/react/dist/index.mjs')
  const exports = Object.keys(react)
  console.log('   ✅ React package imports successfully')
  console.log('   📦 Exports:', exports.length, 'items')

  // Check for key exports
  const hasUseClarityChat = exports.includes('useClarityChat')
  const hasUseChatEnhanced = exports.includes('useChatEnhanced')
  const hasMemoryProvider = exports.includes('MemoryProvider')

  console.log('   🔑 Key exports:')
  console.log('      - useClarityChat:', hasUseClarityChat ? '✅' : '❌')
  console.log('      - useChatEnhanced:', hasUseChatEnhanced ? '✅' : '❌')
  console.log('      - MemoryProvider:', hasMemoryProvider ? '✅' : '❌')
} catch (error) {
  console.error('   ❌ Error:', error.message)
}

// Test 6: CLI package
console.log('\n6. Testing @clarity-chat/cli...')
try {
  const cli = await import('./packages/cli/dist/index.js')
  console.log('   ✅ CLI package imports successfully')
  console.log('   📦 Exports:', Object.keys(cli).length, 'items')
} catch (error) {
  console.error('   ❌ Error:', error.message)
}

// Test 7: Licensing package
console.log('\n7. Testing @clarity-chat/licensing...')
try {
  const licensing = await import('./packages/licensing/dist/index.mjs')
  console.log('   ✅ Licensing package imports successfully')
  console.log('   📦 Exports:', Object.keys(licensing).length, 'items')
} catch (error) {
  console.error('   ❌ Error:', error.message)
}

console.log('\n✨ Functional testing complete!\n')
