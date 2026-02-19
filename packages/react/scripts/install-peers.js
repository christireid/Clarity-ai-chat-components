#!/usr/bin/env node

/**
 * Interactive Peer Dependencies Installation Helper
 *
 * Helps users install only the peer dependencies they need based on
 * their feature requirements. Provides bundle size estimates and
 * copy-paste ready installation commands.
 *
 * Usage:
 *   node scripts/install-peers.js
 *   pnpm install-peers (if configured in package.json scripts)
 */

import readline from 'node:readline'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// ANSI color codes for better UX
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
}

// Feature categories with their peer dependencies
const FEATURES = {
  core: {
    name: 'Core Features',
    description: 'Essential dependencies required by all installations',
    required: true,
    dependencies: {
      react: '^18.0.0 || ^19.0.0',
      'framer-motion': '^12.23.25',
      'lucide-react': '^0.500.0',
      zod: '^3.24.0',
    },
    bundleSize: '450 KB',
    features: [
      'Basic chat components',
      'Message rendering',
      'Smooth animations',
      'Icons',
      'Input validation',
    ],
  },
  reactDom: {
    name: 'React DOM',
    description:
      'Required for browser/web applications (not needed for React Native)',
    dependencies: {
      'react-dom': '^18.0.0 || ^19.0.0',
    },
    bundleSize: '130 KB',
    features: ['DOM rendering', 'Browser event handling', 'Portal support'],
  },
  markdown: {
    name: 'Markdown Rendering',
    description: 'Enhanced markdown support with syntax highlighting',
    dependencies: {
      'react-markdown': '^10.0.0',
      'remark-gfm': '^4.0.0',
      'rehype-highlight': '^7.0.0',
    },
    bundleSize: '85 KB',
    features: [
      'GitHub Flavored Markdown',
      'Tables, task lists, strikethrough',
      'Code syntax highlighting (basic)',
      'Safe HTML rendering',
    ],
  },
  codeHighlighting: {
    name: 'Advanced Code Highlighting',
    description: 'Premium syntax highlighting for code blocks',
    dependencies: {
      shiki: '^3.0.0',
      prismjs: '^1.29.0',
    },
    bundleSize: '195 KB',
    features: [
      'Beautiful syntax themes',
      '100+ language support',
      'Line numbers & highlighting',
      'Copy code button',
    ],
  },
  diagrams: {
    name: 'Diagram Support',
    description: 'Render flowcharts, sequence diagrams, and more',
    dependencies: {
      mermaid: '^11.0.0',
    },
    bundleSize: '320 KB',
    features: [
      'Flowcharts',
      'Sequence diagrams',
      'Gantt charts',
      'Class diagrams',
      'State diagrams',
    ],
  },
  documentProcessing: {
    name: 'Document Processing',
    description: 'PDF and DOCX file reading for RAG/document Q&A',
    dependencies: {
      'pdfjs-dist': '^3.0.0 || ^4.0.0',
      mammoth: '^1.0.0',
    },
    bundleSize: '450 KB',
    features: [
      'PDF text extraction',
      'DOCX text extraction',
      'Document chunking',
      'Vector search integration',
    ],
  },
  exportFeatures: {
    name: 'Export Features',
    description: 'Export conversations to ZIP archives',
    dependencies: {
      jszip: '^3.10.0',
    },
    bundleSize: '120 KB',
    features: [
      'Export chats to ZIP',
      'Batch export',
      'Multiple format support',
    ],
  },
  reranking: {
    name: 'AI Reranking',
    description: 'Improve RAG search quality with Cohere reranking',
    dependencies: {
      'cohere-ai': '^7.0.0',
    },
    bundleSize: '65 KB',
    features: [
      'Semantic reranking',
      'Better search results',
      'RAG optimization',
    ],
  },
  tokenOptimization: {
    name: 'Advanced Token Optimization',
    description: 'Precise token counting and optimization (experimental)',
    dependencies: {
      flowtoken: '^1.0.0',
    },
    bundleSize: '40 KB',
    features: [
      'Accurate token counting',
      'Token budget monitoring',
      'Cost optimization',
    ],
  },
}

// Package manager detection
function detectPackageManager() {
  const userAgent = process.env.npm_config_user_agent || ''

  if (userAgent.includes('pnpm')) return 'pnpm'
  if (userAgent.includes('yarn')) return 'yarn'
  if (userAgent.includes('bun')) return 'bun'
  return 'npm'
}

// Create readline interface
function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
}

// Prompt user with a question
function question(rl, prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

// Print section header
function printHeader(text) {
  console.log(
    '\n' + colors.bright + colors.cyan + '━'.repeat(70) + colors.reset
  )
  console.log(colors.bright + colors.cyan + text + colors.reset)
  console.log(colors.cyan + '━'.repeat(70) + colors.reset + '\n')
}

// Print feature option
function printFeature(key, feature, index) {
  const number = colors.bright + colors.blue + `[${index}]` + colors.reset
  const name = colors.bright + feature.name + colors.reset
  const required = feature.required
    ? colors.yellow + ' (REQUIRED)' + colors.reset
    : ''
  const size = colors.dim + `~${feature.bundleSize}` + colors.reset

  console.log(`${number} ${name}${required} ${size}`)
  console.log(colors.dim + `    ${feature.description}` + colors.reset)

  if (feature.features && feature.features.length > 0) {
    console.log(
      colors.dim + '    Features: ' + feature.features.join(', ') + colors.reset
    )
  }
  console.log()
}

// Print summary
function printSummary(selectedFeatures, totalSize) {
  printHeader('📦 Installation Summary')

  console.log(colors.bright + 'Selected Features:' + colors.reset)
  selectedFeatures.forEach((feature) => {
    console.log(
      colors.green +
        '  ✓ ' +
        colors.reset +
        feature.name +
        colors.dim +
        ` (~${feature.bundleSize})` +
        colors.reset
    )
  })

  console.log(
    '\n' +
      colors.bright +
      'Total Bundle Size Estimate: ' +
      colors.reset +
      colors.yellow +
      totalSize +
      colors.reset
  )
  console.log(
    colors.dim +
      '(Actual size may vary based on tree-shaking and compression)' +
      colors.reset
  )
}

// Generate installation command
function generateInstallCommand(selectedFeatures, packageManager) {
  const allDeps = new Map()

  selectedFeatures.forEach((feature) => {
    Object.entries(feature.dependencies).forEach(([pkg, version]) => {
      allDeps.set(pkg, version)
    })
  })

  const deps = Array.from(allDeps.entries())
    .map(([pkg, version]) => `${pkg}@"${version}"`)
    .join(' ')

  const commands = {
    npm: `npm install ${deps}`,
    yarn: `yarn add ${deps}`,
    pnpm: `pnpm add ${deps}`,
    bun: `bun add ${deps}`,
  }

  return commands[packageManager]
}

// Generate dev dependencies install command
function generateDevInstallCommand(packageManager) {
  const devDeps = '@types/react @types/react-dom typescript'

  const commands = {
    npm: `npm install --save-dev ${devDeps}`,
    yarn: `yarn add --dev ${devDeps}`,
    pnpm: `pnpm add -D ${devDeps}`,
    bun: `bun add --dev ${devDeps}`,
  }

  return commands[packageManager]
}

// Calculate total bundle size
function calculateTotalSize(selectedFeatures) {
  const totalKB = selectedFeatures.reduce((sum, feature) => {
    const kb = parseInt(feature.bundleSize.replace(/[^\d]/g, ''), 10)
    return sum + kb
  }, 0)

  if (totalKB < 1024) {
    return `${totalKB} KB`
  }
  return `${(totalKB / 1024).toFixed(1)} MB`
}

// Print installation instructions
function printInstallationInstructions(
  installCommand,
  devCommand,
  packageManager
) {
  printHeader('📋 Installation Commands')

  console.log(colors.bright + '1. Install peer dependencies:' + colors.reset)
  console.log('\n' + colors.green + installCommand + colors.reset + '\n')

  console.log(
    colors.bright +
      '2. Install TypeScript types (if using TypeScript):' +
      colors.reset
  )
  console.log('\n' + colors.green + devCommand + colors.reset + '\n')

  console.log(colors.bright + '3. Install Clarity Chat:' + colors.reset)
  const clarityCommand = {
    npm: 'npm install @clarity-chat/react',
    yarn: 'yarn add @clarity-chat/react',
    pnpm: 'pnpm add @clarity-chat/react',
    bun: 'bun add @clarity-chat/react',
  }[packageManager]
  console.log('\n' + colors.green + clarityCommand + colors.reset + '\n')
}

// Print usage example
function printUsageExample(selectedFeatures) {
  printHeader('🚀 Quick Start Example')

  const hasMarkdown = selectedFeatures.some(
    (f) => f.name === 'Markdown Rendering'
  )
  const hasDiagrams = selectedFeatures.some((f) => f.name === 'Diagram Support')

  console.log(
    colors.dim + '// Example usage with your selected features' + colors.reset
  )
  console.log('')
  console.log("import { ClarityChat } from '@clarity-chat/react'")
  console.log("import '@clarity-chat/react/styles.css'")
  console.log('')
  console.log('export function App() {')
  console.log('  return (')
  console.log('    <ClarityChat')
  console.log("      api='/api/chat'")

  if (hasMarkdown) {
    console.log('      markdown={{ enabled: true }}')
  }

  if (hasDiagrams) {
    console.log('      mermaid={{ enabled: true }}')
  }

  console.log('    />')
  console.log('  )')
  console.log('}')
  console.log('')
}

// Save to file option
function printSaveOption() {
  console.log(
    colors.dim +
      '\n💡 Tip: Copy the commands above and save them to a script file for easy re-installation.' +
      colors.reset
  )
  console.log(
    colors.dim +
      '   You can also add them to your package.json postinstall script.' +
      colors.reset +
      '\n'
  )
}

// Print common presets
function printPresets() {
  console.log(colors.bright + '\nCommon Presets:' + colors.reset)
  console.log(
    colors.blue + '  [P1]' + colors.reset + ' Minimal - Core only (web app)'
  )
  console.log(
    colors.blue +
      '  [P2]' +
      colors.reset +
      ' Standard - Core + Markdown + Code highlighting'
  )
  console.log(colors.blue + '  [P3]' + colors.reset + ' Full - All features')
  console.log(
    colors.blue +
      '  [P4]' +
      colors.reset +
      ' Document Q&A - Core + Markdown + Document processing'
  )
  console.log(
    colors.blue + '  [P5]' + colors.reset + ' Custom - Pick features manually\n'
  )
}

// Apply preset
function applyPreset(presetNumber) {
  const featureKeys = Object.keys(FEATURES).filter((key) => key !== 'core')

  switch (presetNumber) {
    case '1': // Minimal
      return ['core', 'reactDom']
    case '2': // Standard
      return ['core', 'reactDom', 'markdown', 'codeHighlighting']
    case '3': // Full
      return Object.keys(FEATURES)
    case '4': // Document Q&A
      return ['core', 'reactDom', 'markdown', 'documentProcessing', 'reranking']
    case '5': // Custom
      return null // Let user pick
    default:
      return null
  }
}

// Main interactive flow
async function main() {
  const packageManager = detectPackageManager()

  console.clear()

  // Welcome header
  console.log(colors.bright + colors.cyan)
  console.log(
    '╔══════════════════════════════════════════════════════════════════╗'
  )
  console.log(
    '║                                                                  ║'
  )
  console.log(
    '║          🎯 Clarity Chat - Peer Dependencies Installer          ║'
  )
  console.log(
    '║                                                                  ║'
  )
  console.log(
    '╚══════════════════════════════════════════════════════════════════╝'
  )
  console.log(colors.reset)

  console.log(
    '\nThis tool helps you install only the peer dependencies you need.'
  )
  console.log(
    colors.dim +
      'Detected package manager: ' +
      colors.reset +
      colors.green +
      packageManager +
      colors.reset
  )

  const rl = createInterface()

  try {
    // Step 1: Choose preset or custom
    printPresets()
    const presetChoice = await question(
      rl,
      colors.bright + 'Choose a preset (P1-P5): ' + colors.reset
    )

    let selectedKeys = applyPreset(presetChoice.toUpperCase().replace('P', ''))

    // If custom, ask about each feature
    if (!selectedKeys) {
      selectedKeys = ['core', 'reactDom'] // Always include core and reactDom for web apps

      printHeader('🎨 Select Additional Features')
      console.log(
        colors.dim + 'Core features are already included.\n' + colors.reset
      )

      const featureEntries = Object.entries(FEATURES).filter(
        ([key]) => key !== 'core' && key !== 'reactDom'
      )

      for (let i = 0; i < featureEntries.length; i++) {
        const [key, feature] = featureEntries[i]
        printFeature(key, feature, i + 1)

        const answer = await question(
          rl,
          colors.bright + `Include ${feature.name}? (y/N): ` + colors.reset
        )
        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
          selectedKeys.push(key)
        }
      }
    }

    // Step 2: Collect selected features
    const selectedFeatures = selectedKeys
      .map((key) => FEATURES[key])
      .filter(Boolean)
    const totalSize = calculateTotalSize(selectedFeatures)

    // Step 3: Show summary
    printSummary(selectedFeatures, totalSize)

    // Step 4: Generate commands
    const installCommand = generateInstallCommand(
      selectedFeatures,
      packageManager
    )
    const devCommand = generateDevInstallCommand(packageManager)

    // Step 5: Show installation instructions
    printInstallationInstructions(installCommand, devCommand, packageManager)

    // Step 6: Show usage example
    printUsageExample(selectedFeatures)

    // Step 7: Show tips
    printSaveOption()

    // Step 8: Offer to run installation
    console.log(
      colors.bright +
        '\n❓ Would you like to run the installation now?' +
        colors.reset
    )
    const runNow = await question(
      rl,
      colors.bright + 'Install now? (y/N): ' + colors.reset
    )

    if (runNow.toLowerCase() === 'y' || runNow.toLowerCase() === 'yes') {
      console.log(
        '\n' +
          colors.bright +
          colors.green +
          '▶ Running installation...' +
          colors.reset +
          '\n'
      )

      // We can't actually run the installation from here, but we can provide the command
      console.log(
        colors.yellow +
          '⚠ Please run the following command manually:' +
          colors.reset
      )
      console.log('\n' + colors.green + installCommand + colors.reset + '\n')
    }

    // Success message
    console.log(
      colors.bright +
        colors.green +
        '\n✨ Setup complete! Happy coding!' +
        colors.reset
    )
    console.log(
      colors.dim +
        '\nFor more info, visit: https://github.com/christireid/Clarity-ai-chat-components/blob/main/docs/installation' +
        colors.reset +
        '\n'
    )
  } catch (error) {
    console.error(colors.red + '\n❌ Error: ' + error.message + colors.reset)
    process.exit(1)
  } finally {
    rl.close()
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(
      colors.red + '\n❌ Fatal error: ' + error.message + colors.reset
    )
    process.exit(1)
  })
}

export {
  FEATURES,
  detectPackageManager,
  generateInstallCommand,
  calculateTotalSize,
}
