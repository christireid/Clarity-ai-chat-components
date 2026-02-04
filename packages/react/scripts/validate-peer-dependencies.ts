#!/usr/bin/env tsx

/**
 * Peer Dependency Validation Script
 *
 * Validates peer dependencies and generates reports
 *
 * Usage:
 *   tsx scripts/validate-peer-dependencies.ts
 *   tsx scripts/validate-peer-dependencies.ts --report
 *   tsx scripts/validate-peer-dependencies.ts --check-components
 */

import * as fs from 'fs'
import * as path from 'path'

interface PeerDependency {
  name: string
  version: string
  required: boolean
  purpose: string
  bundleSize: string
  components: string[]
}

interface ComponentRequirement {
  component: string
  required: string[]
  optional: string[]
  fallback?: string
}

// Read package.json
const packageJsonPath = path.join(__dirname, '../package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

const peerDependencies = packageJson.peerDependencies || {}
const peerDependenciesMeta = packageJson.peerDependenciesMeta || {}

// Peer dependency metadata
const peerMetadata: Record<string, { purpose: string; bundleSize: string; components: string[] }> = {
  'react': {
    purpose: 'Core framework for all components',
    bundleSize: '~45KB',
    components: ['All components']
  },
  'framer-motion': {
    purpose: 'Declarative animations and gesture handling',
    bundleSize: '~60KB',
    components: ['ClarityChat', 'ChatWindow', 'MessageList', 'StreamingMessage', 'TypingIndicator', 'TokenBudgetBar', 'EnhancedMarkdownRenderer']
  },
  'lucide-react': {
    purpose: 'Icon library with 1000+ SVG icons',
    bundleSize: '~5KB (tree-shakeable)',
    components: ['ChatInput', 'SearchableChat', 'DocumentIntegration', 'BatchExportDialog']
  },
  'zod': {
    purpose: 'TypeScript-first schema validation',
    bundleSize: '~15KB',
    components: ['useClarityChat', 'useRAGPipeline', 'useAgent']
  },
  'react-dom': {
    purpose: 'DOM rendering (usually already installed)',
    bundleSize: '~40KB',
    components: ['Client-side rendering']
  },
  'flowtoken': {
    purpose: 'Advanced token counting and optimization',
    bundleSize: '~15KB',
    components: ['TokenBudgetBar', 'useTokenBudgetMonitor', 'useTokenValidator']
  },
  'mermaid': {
    purpose: 'Diagram rendering (flowcharts, sequence diagrams, etc.)',
    bundleSize: '~200KB (lazy loaded)',
    components: ['EnhancedMarkdownRenderer']
  },
  'pdfjs-dist': {
    purpose: 'PDF document parsing and text extraction',
    bundleSize: '~400KB (lazy loaded)',
    components: ['PDFLoader', 'useRAGPipeline', 'DocumentIntegration']
  },
  'mammoth': {
    purpose: 'DOCX document parsing',
    bundleSize: '~100KB (lazy loaded)',
    components: ['DOCXLoader', 'useRAGPipeline', 'DocumentIntegration']
  },
  'cohere-ai': {
    purpose: 'Reranking search results for better RAG accuracy',
    bundleSize: '~50KB',
    components: ['useRAGPipeline', 'SemanticMessageSearch']
  },
  'shiki': {
    purpose: 'Advanced syntax highlighting with VS Code themes',
    bundleSize: '~50KB + themes',
    components: ['CodeBlock', 'EnhancedMarkdownRenderer']
  },
  'jszip': {
    purpose: 'ZIP file creation for batch exports',
    bundleSize: '~20KB',
    components: ['BatchExportDialog']
  },
  'prismjs': {
    purpose: 'Lightweight syntax highlighting',
    bundleSize: '~10KB + languages',
    components: ['CodeBlock']
  },
  'react-markdown': {
    purpose: 'Markdown rendering',
    bundleSize: '~40KB',
    components: ['EnhancedMarkdownRenderer', 'ChatWindow', 'StreamingMessage']
  },
  'remark-gfm': {
    purpose: 'GitHub Flavored Markdown support',
    bundleSize: '~15KB',
    components: ['EnhancedMarkdownRenderer']
  },
  'rehype-highlight': {
    purpose: 'Syntax highlighting in markdown code blocks',
    bundleSize: '~25KB',
    components: ['EnhancedMarkdownRenderer']
  }
}

// Component requirements
const componentRequirements: ComponentRequirement[] = [
  {
    component: 'ClarityChat',
    required: ['react', 'framer-motion', 'lucide-react', 'zod'],
    optional: ['react-markdown', 'shiki', 'flowtoken', 'mermaid']
  },
  {
    component: 'ChatWindow',
    required: ['react', 'framer-motion', 'lucide-react', 'zod'],
    optional: ['react-markdown', 'remark-gfm', 'shiki', 'flowtoken'],
    fallback: 'Markdown renders as plain text'
  },
  {
    component: 'EnhancedMarkdownRenderer',
    required: ['react', 'framer-motion'],
    optional: ['react-markdown', 'remark-gfm', 'rehype-highlight', 'mermaid'],
    fallback: 'Plain text with basic formatting'
  },
  {
    component: 'CodeBlock',
    required: ['react'],
    optional: ['shiki', 'prismjs'],
    fallback: 'Plain text code block'
  },
  {
    component: 'DocumentIntegration',
    required: ['react', 'framer-motion', 'lucide-react'],
    optional: ['pdfjs-dist', 'mammoth'],
    fallback: 'Shows warning for unsupported file types'
  },
  {
    component: 'TokenBudgetBar',
    required: ['react', 'framer-motion'],
    optional: ['flowtoken'],
    fallback: 'Character-based token estimation (~75% accurate)'
  },
  {
    component: 'SemanticMessageSearch',
    required: ['react', 'framer-motion', 'lucide-react'],
    optional: ['cohere-ai'],
    fallback: 'Vector similarity without reranking'
  },
  {
    component: 'BatchExportDialog',
    required: ['react', 'framer-motion', 'lucide-react'],
    optional: ['jszip'],
    fallback: 'Individual file downloads instead of ZIP'
  },
  {
    component: 'useClarityChat',
    required: ['react', 'zod'],
    optional: []
  },
  {
    component: 'useTokenBudgetMonitor',
    required: ['react'],
    optional: ['flowtoken'],
    fallback: 'Character-based estimation'
  },
  {
    component: 'useRAGPipeline',
    required: ['react', 'zod'],
    optional: ['pdfjs-dist', 'mammoth', 'cohere-ai'],
    fallback: 'Limited to supported document types'
  }
]

function validatePeerDependencies(): void {
  console.log('🔍 Validating Peer Dependencies...\n')

  const required: PeerDependency[] = []
  const optional: PeerDependency[] = []

  Object.entries(peerDependencies).forEach(([name, version]) => {
    const isRequired = !peerDependenciesMeta[name]?.optional
    const metadata = peerMetadata[name] || {
      purpose: 'Unknown',
      bundleSize: 'Unknown',
      components: []
    }

    const peer: PeerDependency = {
      name,
      version: version as string,
      required: isRequired,
      purpose: metadata.purpose,
      bundleSize: metadata.bundleSize,
      components: metadata.components
    }

    if (isRequired) {
      required.push(peer)
    } else {
      optional.push(peer)
    }
  })

  console.log('✅ Required Peer Dependencies:')
  console.log('═'.repeat(80))
  required.forEach(peer => {
    console.log(`  ${peer.name} (${peer.version})`)
    console.log(`    Purpose: ${peer.purpose}`)
    console.log(`    Bundle: ${peer.bundleSize}`)
    console.log(`    Components: ${peer.components.join(', ')}`)
    console.log()
  })

  console.log('\n🔶 Optional Peer Dependencies:')
  console.log('═'.repeat(80))
  optional.forEach(peer => {
    console.log(`  ${peer.name} (${peer.version})`)
    console.log(`    Purpose: ${peer.purpose}`)
    console.log(`    Bundle: ${peer.bundleSize}`)
    console.log(`    Components: ${peer.components.join(', ')}`)
    console.log()
  })

  console.log('\n📊 Summary:')
  console.log('═'.repeat(80))
  console.log(`  Required: ${required.length}`)
  console.log(`  Optional: ${optional.length}`)
  console.log(`  Total: ${required.length + optional.length}`)
}

function generateReport(): void {
  console.log('📄 Generating Peer Dependency Report...\n')

  const report = {
    generated: new Date().toISOString(),
    package: packageJson.name,
    version: packageJson.version,
    peerDependencies: {
      required: [] as PeerDependency[],
      optional: [] as PeerDependency[]
    },
    componentRequirements: componentRequirements,
    bundleSizes: {
      minimalSetup: '~125KB',
      withMarkdown: '~205KB',
      withRAG: '~255KB base + ~500KB lazy loaded',
      fullFeatured: '~300KB base + ~700KB lazy loaded'
    }
  }

  Object.entries(peerDependencies).forEach(([name, version]) => {
    const isRequired = !peerDependenciesMeta[name]?.optional
    const metadata = peerMetadata[name] || {
      purpose: 'Unknown',
      bundleSize: 'Unknown',
      components: []
    }

    const peer: PeerDependency = {
      name,
      version: version as string,
      required: isRequired,
      purpose: metadata.purpose,
      bundleSize: metadata.bundleSize,
      components: metadata.components
    }

    if (isRequired) {
      report.peerDependencies.required.push(peer)
    } else {
      report.peerDependencies.optional.push(peer)
    }
  })

  const reportPath = path.join(__dirname, '../docs/api/peer-dependency-report.json')
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))

  console.log(`✅ Report generated: ${reportPath}`)
}

function checkComponents(): void {
  console.log('🔍 Checking Component Requirements...\n')

  componentRequirements.forEach(req => {
    console.log(`${req.component}`)
    console.log('─'.repeat(80))
    console.log(`  Required: ${req.required.join(', ')}`)
    console.log(`  Optional: ${req.optional.join(', ') || 'None'}`)
    if (req.fallback) {
      console.log(`  Fallback: ${req.fallback}`)
    }
    console.log()
  })
}

function generateMarkdownMatrix(): void {
  console.log('📊 Generating Component Matrix...\n')

  const allPeers = Object.keys(peerDependencies)
  const requiredPeers = allPeers.filter(p => !peerDependenciesMeta[p]?.optional)
  const optionalPeers = allPeers.filter(p => peerDependenciesMeta[p]?.optional)

  let markdown = '# Component Peer Dependency Matrix\n\n'
  markdown += '> Auto-generated by validate-peer-dependencies.ts\n\n'

  markdown += '## Core Components\n\n'
  markdown += '| Component | ' + requiredPeers.join(' | ') + ' | ' + optionalPeers.join(' | ') + ' |\n'
  markdown += '|' + Array(requiredPeers.length + optionalPeers.length + 2).fill('---').join('|') + '|\n'

  componentRequirements.forEach(req => {
    const row = [req.component]

    requiredPeers.forEach(peer => {
      row.push(req.required.includes(peer) ? '✅' : '⚪')
    })

    optionalPeers.forEach(peer => {
      row.push(req.optional.includes(peer) ? '🔶' : '⚪')
    })

    markdown += '| ' + row.join(' | ') + ' |\n'
  })

  const matrixPath = path.join(__dirname, '../docs/api/component-matrix.md')
  fs.writeFileSync(matrixPath, markdown)

  console.log(`✅ Matrix generated: ${matrixPath}`)
}

// Main execution
const args = process.argv.slice(2)

if (args.includes('--report')) {
  generateReport()
} else if (args.includes('--check-components')) {
  checkComponents()
} else if (args.includes('--matrix')) {
  generateMarkdownMatrix()
} else if (args.includes('--all')) {
  validatePeerDependencies()
  console.log('\n')
  checkComponents()
  console.log('\n')
  generateReport()
  generateMarkdownMatrix()
} else {
  validatePeerDependencies()
}
