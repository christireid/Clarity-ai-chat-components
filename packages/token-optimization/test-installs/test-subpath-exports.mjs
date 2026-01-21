/**
 * Test: Subpath Exports Work Correctly
 * Verifies that /react, /compression, /cache exports are functional
 */

import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const packageRoot = join(__dirname, '..')

console.log('🧪 Testing Subpath Exports...\n')

// Test 1: Main export
console.log('1. Testing main export (.) ...')
try {
  const pkgJson = JSON.parse(await readFile(join(packageRoot, 'package.json'), 'utf-8'))
  const mainExport = pkgJson.exports['.']
  console.log(`   ✓ Main export configured:`, mainExport)

  // Check dist files exist
  const distIndex = join(packageRoot, mainExport.import)
  await readFile(distIndex)
  console.log(`   ✓ File exists: ${mainExport.import}`)
} catch (err) {
  console.error(`   ✗ FAIL:`, err.message)
  process.exit(1)
}

// Test 2: /react export
console.log('\n2. Testing /react export...')
try {
  const pkgJson = JSON.parse(await readFile(join(packageRoot, 'package.json'), 'utf-8'))
  const reactExport = pkgJson.exports['./react']
  console.log(`   ✓ React export configured:`, reactExport)

  const distReact = join(packageRoot, reactExport.import)
  const content = await readFile(distReact, 'utf-8')

  // Verify it exports React hooks
  if (content.includes('useTokenCount') && content.includes('useTokenBudget')) {
    console.log(`   ✓ React hooks found in export`)
  } else {
    throw new Error('React hooks not found in /react export')
  }
} catch (err) {
  console.error(`   ✗ FAIL:`, err.message)
  process.exit(1)
}

// Test 3: /compression export
console.log('\n3. Testing /compression export...')
try {
  const pkgJson = JSON.parse(await readFile(join(packageRoot, 'package.json'), 'utf-8'))
  const compressionExport = pkgJson.exports['./compression']
  console.log(`   ✓ Compression export configured:`, compressionExport)

  const distCompression = join(packageRoot, compressionExport.import)
  await readFile(distCompression)
  console.log(`   ✓ File exists: ${compressionExport.import}`)
} catch (err) {
  console.error(`   ✗ FAIL:`, err.message)
  process.exit(1)
}

// Test 4: /cache export
console.log('\n4. Testing /cache export...')
try {
  const pkgJson = JSON.parse(await readFile(join(packageRoot, 'package.json'), 'utf-8'))
  const cacheExport = pkgJson.exports['./cache']
  console.log(`   ✓ Cache export configured:`, cacheExport)

  const distCache = join(packageRoot, cacheExport.import)
  await readFile(distCache)
  console.log(`   ✓ File exists: ${cacheExport.import}`)
} catch (err) {
  console.error(`   ✗ FAIL:`, err.message)
  process.exit(1)
}

console.log('\n✅ All subpath exports are properly configured!\n')
