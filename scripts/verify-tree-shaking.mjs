#!/usr/bin/env node
/**
 * Tree-shaking verification script
 *
 * Tests that importing specific APIs doesn't bundle unrelated code.
 * This ensures proper code splitting and tree-shaking effectiveness.
 */

import { rollup } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import fs from 'fs/promises'

const tests = [
  {
    name: 'Import only useTokenCount',
    input: `import { useTokenCount } from '@clarity-chat/token-optimization'; export { useTokenCount }`,
    maxSize: 25_000,
    excludes: ['LLMLingua', 'Compression', 'TieredCache', 'SemanticCache'],
  },
  {
    name: 'Import only SmartCache',
    input: `import { SmartCache } from '@clarity-chat/token-optimization/cache'; export { SmartCache }`,
    maxSize: 18_000,
    excludes: ['AccurateTokenCounter', 'useTokenCount', 'LLMLingua'],
  },
  {
    name: 'Import only AccurateTokenCounter',
    input: `import { AccurateTokenCounter } from '@clarity-chat/token-optimization'; export { AccurateTokenCounter }`,
    maxSize: 20_000,
    excludes: ['Compression', 'Cache', 'React'],
  },
]

async function verifyTreeShaking() {
  console.log('=== TREE-SHAKING VERIFICATION ===\n')

  let passed = 0
  let failed = 0

  for (const test of tests) {
    try {
      // Write test input to temp file
      const tempFile = `/tmp/tree-shake-input-${Date.now()}.js`
      await fs.writeFile(tempFile, test.input)

      // Bundle
      const bundle = await rollup({
        input: tempFile,
        plugins: [nodeResolve()],
        external: ['react', 'react-dom', 'framer-motion', '@clarity-chat/primitives', '@clarity-chat/utils'],
      })

      const { output } = await bundle.generate({ format: 'esm' })
      const code = output[0].code
      const size = code.length

      // Check size
      const sizePass = size <= test.maxSize

      // Check exclusions
      const exclusionPasses = test.excludes.map((exclude) => ({
        exclude,
        pass: !code.includes(exclude),
      }))

      const allExclusionsPass = exclusionPasses.every((e) => e.pass)

      const testPassed = sizePass && allExclusionsPass

      console.log(`${testPassed ? '✓' : '✗'} ${test.name}`)
      console.log(`  Size: ${size.toLocaleString()} / ${test.maxSize.toLocaleString()} bytes ${sizePass ? '✓' : '✗'}`)

      exclusionPasses.forEach((e) => {
        console.log(`  Excludes "${e.exclude}": ${e.pass ? '✓' : '✗ INCLUDED (BAD)'}`)
      })

      console.log('')

      if (testPassed) passed++
      else failed++

      // Clean up
      await fs.unlink(tempFile)
    } catch (error) {
      console.error(`✗ ${test.name}`)
      console.error(`  Error: ${error.message}\n`)
      failed++
    }
  }

  console.log(`\n=== SUMMARY ===`)
  console.log(`Passed: ${passed}`)
  console.log(`Failed: ${failed}`)
  console.log(`Status: ${failed === 0 ? 'PASS ✓' : 'FAIL ✗'}`)

  process.exit(failed === 0 ? 0 : 1)
}

verifyTreeShaking().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})
