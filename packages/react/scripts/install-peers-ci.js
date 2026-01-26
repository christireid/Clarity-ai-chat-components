#!/usr/bin/env node

/**
 * Non-Interactive Peer Dependencies Installer
 *
 * For CI/CD environments. Supports preset selection via argument.
 *
 * Usage:
 *   node scripts/install-peers-ci.js [preset]
 *
 * Presets:
 *   minimal   - Core only (web app)
 *   standard  - Core + Markdown + Code highlighting (default)
 *   full      - All features
 *   document  - Document Q&A setup
 *   custom    - Specify features as additional args
 *
 * Examples:
 *   node scripts/install-peers-ci.js minimal
 *   node scripts/install-peers-ci.js standard
 *   node scripts/install-peers-ci.js custom core reactDom markdown
 */

import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  FEATURES,
  detectPackageManager,
  generateInstallCommand,
  calculateTotalSize,
} from './install-peers.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Parse command line arguments
const args = process.argv.slice(2)
const preset = args[0] || 'standard'

// Map preset names to feature keys
function getFeaturesByPreset(presetName) {
  switch (presetName.toLowerCase()) {
    case 'minimal':
    case 'min':
    case 'p1':
      return ['core', 'reactDom']

    case 'standard':
    case 'std':
    case 'p2':
      return ['core', 'reactDom', 'markdown', 'codeHighlighting']

    case 'full':
    case 'all':
    case 'p3':
      return Object.keys(FEATURES)

    case 'document':
    case 'doc':
    case 'rag':
    case 'p4':
      return ['core', 'reactDom', 'markdown', 'documentProcessing', 'reranking']

    case 'custom':
      // Get features from remaining args
      const customFeatures = args.slice(1)
      if (customFeatures.length === 0) {
        console.error(
          'Error: Custom preset requires feature names as arguments'
        )
        console.error(
          'Example: node install-peers-ci.js custom core reactDom markdown'
        )
        process.exit(1)
      }
      return customFeatures

    default:
      console.error(`Unknown preset: ${presetName}`)
      console.error('Valid presets: minimal, standard, full, document, custom')
      process.exit(1)
  }
}

// Main execution
function main() {
  const selectedKeys = getFeaturesByPreset(preset)
  const selectedFeatures = selectedKeys
    .map((key) => FEATURES[key])
    .filter(Boolean)

  if (selectedFeatures.length === 0) {
    console.error('Error: No valid features selected')
    process.exit(1)
  }

  const packageManager = detectPackageManager()
  const installCommand = generateInstallCommand(
    selectedFeatures,
    packageManager
  )
  const totalSize = calculateTotalSize(selectedFeatures)

  // Output in CI-friendly format
  console.log('# Clarity Chat - Peer Dependencies')
  console.log('')
  console.log(`Preset: ${preset}`)
  console.log(`Package Manager: ${packageManager}`)
  console.log(`Estimated Bundle Size: ${totalSize}`)
  console.log('')
  console.log('Features:')
  selectedFeatures.forEach((feature) => {
    console.log(`  - ${feature.name} (${feature.bundleSize})`)
  })
  console.log('')
  console.log('Installation Command:')
  console.log(installCommand)
  console.log('')

  // Output for GitHub Actions
  if (process.env.GITHUB_ACTIONS) {
    console.log('::set-output name=install-command::' + installCommand)
    console.log('::set-output name=bundle-size::' + totalSize)
  }

  // Output for environment variable usage
  if (process.env.OUTPUT_ENV === 'true') {
    console.log('# Export as environment variables:')
    console.log(`export CLARITY_INSTALL_CMD="${installCommand}"`)
    console.log(`export CLARITY_BUNDLE_SIZE="${totalSize}"`)
  }
}

// Run
try {
  main()
} catch (error) {
  console.error('Error:', error.message)
  process.exit(1)
}
