/**
 * Bundle size test script
 * Measures bundle sizes with and without tokenizers
 */
const esbuild = require('esbuild')
const fs = require('fs')
const path = require('path')

async function buildAndMeasure(name, entryPoint) {
  const outfile = path.join(__dirname, `${name}.bundle.js`)

  try {
    // Build the bundle
    const result = await esbuild.build({
      entryPoints: [entryPoint],
      bundle: true,
      minify: true,
      format: 'esm',
      outfile,
      platform: 'browser',
      target: 'es2020',
      metafile: true,
      external: ['react', 'react-dom'], // Don't bundle React
    })

    // Get file size
    const stats = fs.statSync(outfile)
    const sizeKB = (stats.size / 1024).toFixed(2)

    // Get detailed analysis
    const analysis = await esbuild.analyzeMetafile(result.metafile, {
      verbose: true,
    })

    return {
      name,
      size: stats.size,
      sizeKB,
      analysis,
      outfile,
    }
  } catch (error) {
    return {
      name,
      error: error.message,
    }
  }
}

async function main() {
  console.log('\n📦 Bundle Size Test: Tokenizer Split Import\n')
  console.log('='.repeat(60))

  // Test 1: Without tokenizers (lightweight estimation)
  console.log('\n🔵 Building WITHOUT tokenizers...')
  const without = await buildAndMeasure(
    'without-tokenizers',
    path.join(__dirname, 'test-without-tokenizers.ts')
  )

  // Test 2: With tokenizers (accurate counting)
  console.log('🔵 Building WITH tokenizers...')
  const with_ = await buildAndMeasure(
    'with-tokenizers',
    path.join(__dirname, 'test-with-tokenizers.ts')
  )

  // Results
  console.log('\n' + '='.repeat(60))
  console.log('\n📊 RESULTS:\n')

  if (without.error) {
    console.log('❌ Without tokenizers: ERROR')
    console.log('   ', without.error)
  } else {
    console.log(`✅ Without tokenizers: ${without.sizeKB} KB`)
    console.log(`   Bundle: ${without.outfile}`)
  }

  if (with_.error) {
    console.log('\n❌ With tokenizers: ERROR')
    console.log('   ', with_.error)
  } else {
    console.log(`\n✅ With tokenizers: ${with_.sizeKB} KB`)
    console.log(`   Bundle: ${with_.outfile}`)
  }

  // Calculate savings
  if (!without.error && !with_.error) {
    const savings = with_.size - without.size
    const savingsKB = (savings / 1024).toFixed(2)
    const savingsPercent = ((savings / with_.size) * 100).toFixed(1)

    console.log('\n' + '='.repeat(60))
    console.log('\n💰 SAVINGS:\n')
    console.log(`   Size difference: ${savingsKB} KB`)
    console.log(`   Percentage saved: ${savingsPercent}%`)
    console.log(
      `   \n   By using '@clarity-chat/token-optimization' instead of`
    )
    console.log(`   '@clarity-chat/token-optimization/tokenizers', you save`)
    console.log(`   ${savingsKB} KB (${savingsPercent}% reduction)`)

    console.log('\n' + '='.repeat(60))
    console.log('\n📝 DETAILED ANALYSIS:\n')

    console.log('Without tokenizers:')
    console.log(without.analysis)

    console.log('\nWith tokenizers:')
    console.log(with_.analysis)
  }

  console.log('\n' + '='.repeat(60))
  console.log('\n✨ Test complete!\n')
}

main().catch(console.error)
