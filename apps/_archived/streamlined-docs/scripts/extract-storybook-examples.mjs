#!/usr/bin/env node

/**
 * Extract Component Examples from Storybook Stories
 *
 * This script parses Storybook story files to extract component usage examples
 * that can be used in the AI documentation API.
 *
 * Usage: node scripts/extract-storybook-examples.mjs
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const STORYBOOK_DIR = path.resolve(__dirname, '../../../apps/storybook/stories')

/**
 * Extract component name from story file content
 */
function extractComponentName(content) {
  // Look for component in meta
  const componentMatch = content.match(/component:\s*(\w+)/)
  if (componentMatch) {
    return componentMatch[1]
  }

  // Fallback: look for import
  const importMatch = content.match(/import\s*{\s*([^}]+)}\s*from\s*['"]@clarity-chat/)
  if (importMatch) {
    const imports = importMatch[1].split(',').map(s => s.trim())
    // Return first non-type import
    const componentImport = imports.find(i => !i.startsWith('type '))
    if (componentImport) {
      return componentImport.trim()
    }
  }

  return null
}

/**
 * Extract description from story meta
 */
function extractDescription(content) {
  const descMatch = content.match(/description:\s*{[\s\S]*?component:\s*['"`]([^'"`]+)['"`]/)
  if (descMatch) {
    return descMatch[1].trim()
  }

  // Alternative pattern
  const altMatch = content.match(/description:\s*['"`]([^'"`]+)['"`]/)
  if (altMatch) {
    return altMatch[1].trim()
  }

  return ''
}

/**
 * Extract story variants (named exports)
 */
function extractStoryVariants(content) {
  const variants = []

  // Match export const VariantName: Story = { ... }
  const storyRegex = /export\s+const\s+(\w+):\s*Story\s*=\s*{([^}]*(?:{[^}]*}[^}]*)*)}/gs
  let match

  while ((match = storyRegex.exec(content)) !== null) {
    const name = match[1]
    const body = match[2]

    // Skip default export
    if (name === 'default') continue

    // Extract args if present
    const argsMatch = body.match(/args:\s*{([^}]*(?:{[^}]*}[^}]*)*)}/s)
    const args = argsMatch ? argsMatch[1].trim() : ''

    variants.push({
      name,
      hasArgs: args.length > 0,
      argsPreview: args.substring(0, 200) // First 200 chars of args
    })
  }

  return variants
}

/**
 * Generate code example from story
 */
function generateCodeExample(componentName, variant, description) {
  const variantComment = variant.name !== 'Default'
    ? `// ${variant.name} variant\n`
    : ''

  const propsHint = variant.hasArgs
    ? '  // Pass appropriate props based on your use case\n'
    : ''

  return `import { ${componentName} } from '@clarity-chat/react';

${variantComment}function Example() {
  return (
    <${componentName}
${propsHint}    />
  );
}`
}

/**
 * Process a single story file
 */
function processStoryFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')

  const componentName = extractComponentName(content)
  if (!componentName) {
    return null
  }

  const description = extractDescription(content)
  const variants = extractStoryVariants(content)

  // Generate examples from variants
  const examples = variants.slice(0, 3).map(variant =>
    generateCodeExample(componentName, variant, description)
  )

  return {
    componentName,
    fileName: path.basename(filePath),
    storyPath: path.relative(STORYBOOK_DIR, filePath),
    description,
    variantCount: variants.length,
    variants: variants.map(v => v.name),
    examples: examples.length > 0 ? examples : [
      `import { ${componentName} } from '@clarity-chat/react';

function Example() {
  return <${componentName} />;
}`
    ]
  }
}

/**
 * Scan all story files
 */
function scanStoryFiles() {
  const storyExamples = []

  function walkDir(dir) {
    const files = fs.readdirSync(dir)

    for (const file of files) {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)

      if (stat.isDirectory()) {
        walkDir(filePath)
      } else if (file.endsWith('.stories.tsx')) {
        try {
          const result = processStoryFile(filePath)
          if (result) {
            storyExamples.push(result)
          }
        } catch (error) {
          console.warn(`Warning: Could not process ${filePath}:`, error.message)
        }
      }
    }
  }

  if (fs.existsSync(STORYBOOK_DIR)) {
    walkDir(STORYBOOK_DIR)
  } else {
    console.warn('Storybook directory not found:', STORYBOOK_DIR)
  }

  return storyExamples
}

/**
 * Main function
 */
async function main() {
  console.log('🔍 Extracting examples from Storybook stories...\n')

  const examples = scanStoryFiles()

  console.log(`Found ${examples.length} component stories\n`)

  // Generate TypeScript data file
  const outputPath = path.join(__dirname, '../lib/ai/storybook-examples.ts')
  const outputDir = path.dirname(outputPath)

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  const content = `/**
 * Auto-generated Storybook Examples
 *
 * Generated from Storybook story files at: ${new Date().toISOString()}
 * Total components with stories: ${examples.length}
 *
 * DO NOT EDIT MANUALLY - Run 'node scripts/extract-storybook-examples.mjs' to regenerate
 */

export interface StorybookExample {
  componentName: string
  fileName: string
  storyPath: string
  description: string
  variantCount: number
  variants: string[]
  examples: string[]
}

export const storybookExamples: StorybookExample[] = ${JSON.stringify(examples, null, 2)}

/**
 * Get examples for a specific component
 */
export function getExamplesForComponent(componentName: string): string[] {
  const example = storybookExamples.find(
    e => e.componentName.toLowerCase() === componentName.toLowerCase()
  )
  return example?.examples || []
}

/**
 * Get all story variants for a component
 */
export function getVariantsForComponent(componentName: string): string[] {
  const example = storybookExamples.find(
    e => e.componentName.toLowerCase() === componentName.toLowerCase()
  )
  return example?.variants || []
}

export const storybookMetadata = {
  generatedAt: '${new Date().toISOString()}',
  totalComponents: ${examples.length},
  totalVariants: ${examples.reduce((sum, e) => sum + e.variantCount, 0)}
}
`

  fs.writeFileSync(outputPath, content)

  console.log('✅ Storybook examples extracted successfully!\n')
  console.log(`📊 Statistics:`)
  console.log(`   Components with stories: ${examples.length}`)
  console.log(`   Total story variants: ${examples.reduce((sum, e) => sum + e.variantCount, 0)}`)

  // Show sample
  if (examples.length > 0) {
    console.log(`\n📦 Sample:`)
    const sample = examples[0]
    console.log(`   Component: ${sample.componentName}`)
    console.log(`   Variants: ${sample.variants.slice(0, 3).join(', ')}${sample.variants.length > 3 ? '...' : ''}`)
    console.log(`   Description: ${sample.description?.substring(0, 60) || 'N/A'}...`)
  }

  console.log(`\n📁 Output: ${outputPath}`)
}

main().catch(console.error)
