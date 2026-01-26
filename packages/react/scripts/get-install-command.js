#!/usr/bin/env node

/**
 * Get Install Command Only
 *
 * Outputs just the installation command for easy parsing/piping.
 * Perfect for scripting and automation.
 *
 * Usage:
 *   node scripts/get-install-command.js [preset] [package-manager]
 *
 * Examples:
 *   node scripts/get-install-command.js minimal npm
 *   node scripts/get-install-command.js standard pnpm
 *   eval $(node scripts/get-install-command.js standard)
 *
 * Output:
 *   npm install react@"^18.0.0" ...
 */

import {
  FEATURES,
  detectPackageManager,
  generateInstallCommand,
} from './install-peers.js'

const args = process.argv.slice(2)
const preset = args[0] || 'standard'
const packageManager = args[1] || detectPackageManager()

// Map preset to features
function getFeatures(presetName) {
  const map = {
    minimal: ['core', 'reactDom'],
    min: ['core', 'reactDom'],
    p1: ['core', 'reactDom'],

    standard: ['core', 'reactDom', 'markdown', 'codeHighlighting'],
    std: ['core', 'reactDom', 'markdown', 'codeHighlighting'],
    p2: ['core', 'reactDom', 'markdown', 'codeHighlighting'],

    full: Object.keys(FEATURES),
    all: Object.keys(FEATURES),
    p3: Object.keys(FEATURES),

    document: ['core', 'reactDom', 'markdown', 'documentProcessing', 'reranking'],
    doc: ['core', 'reactDom', 'markdown', 'documentProcessing', 'reranking'],
    rag: ['core', 'reactDom', 'markdown', 'documentProcessing', 'reranking'],
    p4: ['core', 'reactDom', 'markdown', 'documentProcessing', 'reranking'],
  }

  return map[presetName.toLowerCase()] || map.standard
}

try {
  const featureKeys = getFeatures(preset)
  const selectedFeatures = featureKeys.map(key => FEATURES[key]).filter(Boolean)

  if (selectedFeatures.length === 0) {
    console.error('Error: No features found for preset:', preset)
    process.exit(1)
  }

  const command = generateInstallCommand(selectedFeatures, packageManager)
  console.log(command)
} catch (error) {
  console.error('Error:', error.message)
  process.exit(1)
}
