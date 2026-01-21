/**
 * Test: Zero-Config Node.js Usage (No React)
 * Verifies core functionality works without React installed
 */

// Note: This test uses relative import since we're in the package
// In real usage, it would be: import { countTokens } from '@clarity-chat/token-optimization'

import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)

console.log('🧪 Testing Zero-Config Node.js Usage (No React)...\n')

let countTokens, DEFAULTS, AccurateTokenCounter

try {
  // Import from built dist (simulating real npm package usage)
  const distPath = join(__dirname, '../dist/index.js')
  const module = await import(distPath)

  countTokens = module.countTokens
  DEFAULTS = module.DEFAULTS
  AccurateTokenCounter = module.AccurateTokenCounter

  if (!countTokens) {
    throw new Error('countTokens not exported from main entry')
  }
  console.log('✓ Successfully imported core exports without React')
} catch (err) {
  console.error('✗ FAIL: Could not import core exports:', err.message)
  process.exit(1)
}

// Test 1: Basic token counting with zero config
console.log('\n1. Testing zero-config token counting...')
try {
  const text = 'Hello, world! This is a test.'
  const count = countTokens(text)

  if (typeof count !== 'number' || count <= 0) {
    throw new Error(`Expected positive number, got: ${count}`)
  }

  console.log(`   ✓ Counted ${count} tokens in: "${text}"`)
  console.log(`   ✓ Used default model: ${DEFAULTS.model}`)
} catch (err) {
  console.error(`   ✗ FAIL:`, err.message)
  process.exit(1)
}

// Test 2: Verify DEFAULTS exist and are sensible
console.log('\n2. Checking DEFAULTS...')
try {
  const requiredDefaults = ['model', 'debounceMs', 'maxCacheSize', 'cacheTtlMs']

  for (const key of requiredDefaults) {
    if (!(key in DEFAULTS)) {
      throw new Error(`Missing DEFAULTS.${key}`)
    }
    console.log(`   ✓ DEFAULTS.${key} = ${DEFAULTS[key]}`)
  }

  // Verify defaults match README claims
  if (DEFAULTS.model !== 'gpt-4o') {
    console.warn(`   ⚠ README claims default is 'gpt-4o', but DEFAULTS.model = '${DEFAULTS.model}'`)
  }
  if (DEFAULTS.debounceMs !== 150) {
    console.warn(`   ⚠ README claims debounceMs = 150, but DEFAULTS.debounceMs = ${DEFAULTS.debounceMs}`)
  }
} catch (err) {
  console.error(`   ✗ FAIL:`, err.message)
  process.exit(1)
}

// Test 3: Test with different models
console.log('\n3. Testing model specification...')
try {
  const text = 'Testing different models'

  // Test explicit model
  const countWithModel = countTokens(text, { model: 'claude-3-5-sonnet' })

  if (typeof countWithModel !== 'number' || countWithModel <= 0) {
    throw new Error(`Model specification failed, got: ${countWithModel}`)
  }

  console.log(`   ✓ Explicit model works: ${countWithModel} tokens with claude-3-5-sonnet`)
} catch (err) {
  console.error(`   ✗ FAIL:`, err.message)
  console.error('   Stack:', err.stack)
  process.exit(1)
}

// Test 4: Test AccurateTokenCounter class
console.log('\n4. Testing AccurateTokenCounter class...')
try {
  const counter = new AccurateTokenCounter({ model: 'gpt-4o' })
  const text = 'Class-based token counting'
  const count = counter.count(text)

  if (typeof count !== 'number' || count <= 0) {
    throw new Error(`Counter.count() failed, got: ${count}`)
  }

  console.log(`   ✓ AccurateTokenCounter works: ${count} tokens`)
} catch (err) {
  console.error(`   ✗ FAIL:`, err.message)
  console.error('   Stack:', err.stack)
  process.exit(1)
}

console.log('\n✅ Zero-config Node.js usage works perfectly!\n')
console.log('Key Findings:')
console.log('  • Core token counting works without React dependency')
console.log('  • DEFAULTS provide sensible zero-config experience')
console.log('  • Both functional and class-based APIs work')
console.log('  • Model specification works correctly')
