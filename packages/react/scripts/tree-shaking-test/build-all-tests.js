/**
 * Build all test apps with multiple bundlers to verify tree-shaking
 */
const fs = require('fs')
const path = require('path')
const { rollup } = require('rollup')
const resolve = require('@rollup/plugin-node-resolve').default
const commonjs = require('@rollup/plugin-commonjs')
const terser = require('@rollup/plugin-terser')
const replace = require('@rollup/plugin-replace')
const esbuild = require('esbuild')

const testApps = [
  'minimal',
  'single-component',
  'multiple-components',
  'hooks-only',
  'utilities-only',
  'full-import',
  'external-deps',
]

const outputDir = path.join(__dirname, 'dist')

// Clean output directory
if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true })
}
fs.mkdirSync(outputDir, { recursive: true })

/**
 * Build with Rollup (best tree-shaking)
 */
async function buildWithRollup(testName) {
  console.log(`\n📦 Building ${testName} with Rollup...`)

  const inputFile = path.join(__dirname, 'test-apps', `${testName}.js`)

  try {
    const bundle = await rollup({
      input: inputFile,
      external: ['react', 'react-dom', 'react-dom/client', 'lucide-react'],
      plugins: [
        replace({
          'process.env.NODE_ENV': JSON.stringify('production'),
          preventAssignment: true,
        }),
        resolve({
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        }),
        commonjs(),
        terser({
          compress: {
            passes: 2,
            pure_getters: true,
            unsafe: true,
          },
          mangle: {
            safari10: true,
          },
        }),
      ],
      onwarn(warning, warn) {
        // Suppress certain warnings
        if (warning.code === 'UNRESOLVED_IMPORT') return
        if (warning.code === 'CIRCULAR_DEPENDENCY') return
        warn(warning)
      },
    })

    await bundle.write({
      file: path.join(outputDir, `rollup-${testName}.js`),
      format: 'esm',
      sourcemap: true,
    })

    await bundle.close()
    console.log(`✅ Rollup build complete: ${testName}`)
  } catch (error) {
    console.error(`❌ Rollup build failed for ${testName}:`, error.message)
  }
}

/**
 * Build with esbuild (fast, good tree-shaking)
 */
async function buildWithEsbuild(testName) {
  console.log(`\n⚡ Building ${testName} with esbuild...`)

  const inputFile = path.join(__dirname, 'test-apps', `${testName}.js`)

  try {
    await esbuild.build({
      entryPoints: [inputFile],
      bundle: true,
      minify: true,
      treeShaking: true,
      format: 'esm',
      outfile: path.join(outputDir, `esbuild-${testName}.js`),
      external: ['react', 'react-dom', 'lucide-react'],
      sourcemap: true,
      platform: 'browser',
      target: 'es2020',
      define: {
        'process.env.NODE_ENV': '"production"',
      },
      logLevel: 'warning',
    })

    console.log(`✅ esbuild build complete: ${testName}`)
  } catch (error) {
    console.error(`❌ esbuild build failed for ${testName}:`, error.message)
  }
}

/**
 * Build without tree-shaking (baseline comparison)
 */
async function buildWithoutTreeShaking(testName) {
  console.log(`\n📊 Building ${testName} without tree-shaking (baseline)...`)

  const inputFile = path.join(__dirname, 'test-apps', `${testName}.js`)

  try {
    const bundle = await rollup({
      input: inputFile,
      external: ['react', 'react-dom', 'react-dom/client', 'lucide-react'],
      treeshake: false, // Disable tree-shaking
      plugins: [
        replace({
          'process.env.NODE_ENV': JSON.stringify('production'),
          preventAssignment: true,
        }),
        resolve({
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        }),
        commonjs(),
        terser({
          compress: {
            passes: 1,
          },
        }),
      ],
      onwarn() {}, // Suppress warnings
    })

    await bundle.write({
      file: path.join(outputDir, `no-treeshake-${testName}.js`),
      format: 'esm',
      sourcemap: true,
    })

    await bundle.close()
    console.log(`✅ No-treeshake build complete: ${testName}`)
  } catch (error) {
    console.error(
      `❌ No-treeshake build failed for ${testName}:`,
      error.message
    )
  }
}

/**
 * Build all test apps
 */
async function buildAll() {
  console.log('🌳 Tree-shaking Effectiveness Test Suite')
  console.log('=========================================\n')

  const startTime = Date.now()

  for (const testName of testApps) {
    await buildWithRollup(testName)
    await buildWithEsbuild(testName)
    if (testName !== 'full-import') {
      // Only build baseline for non-full imports
      await buildWithoutTreeShaking(testName)
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2)
  console.log(`\n✨ All builds complete in ${duration}s`)
  console.log(`📁 Output directory: ${outputDir}`)
}

// Run builds
buildAll().catch((error) => {
  console.error('❌ Build failed:', error)
  process.exit(1)
})
