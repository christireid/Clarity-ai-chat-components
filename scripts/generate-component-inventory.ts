#!/usr/bin/env tsx
/**
 * Component Inventory Generator
 *
 * Automatically generates a searchable component inventory from source files.
 * Helps developers quickly find and use the right components.
 *
 * Usage: pnpm tsx scripts/generate-component-inventory.ts
 */

import * as fs from 'fs'
import * as path from 'path'
import { glob } from 'glob'

interface ComponentInfo {
  name: string
  path: string
  relativePath: string
  category: string
  exports: string[]
  description?: string
  isHook: boolean
  isComponent: boolean
}

const projectRoot = path.resolve(process.cwd())
const reactPackageRoot = path.join(projectRoot, 'packages/react')
const outputPath = path.join(projectRoot, 'docs/COMPONENT_INVENTORY.md')

/**
 * Extract exports from a TypeScript file
 */
function extractExports(content: string): string[] {
  const exports: string[] = []
  const exportRegex =
    /export\s+(?:const|function|class|interface|type|enum)\s+(\w+)/g
  const namedExportRegex = /export\s+\{([^}]+)\}/g
  const defaultExportRegex = /export\s+default\s+(?:function\s+)?(\w+)/

  let match

  // Named exports (const, function, class, etc.)
  while ((match = exportRegex.exec(content)) !== null) {
    exports.push(match[1])
  }

  // Export statements
  while ((match = namedExportRegex.exec(content)) !== null) {
    const names = match[1]
      .split(',')
      .map((name) => name.trim().split(/\s+as\s+/)[0])
      .filter(Boolean)
    exports.push(...names)
  }

  // Default export
  if ((match = defaultExportRegex.exec(content)) !== null) {
    exports.push(match[1])
  }

  return [...new Set(exports)] // Remove duplicates
}

/**
 * Extract JSDoc description from file
 */
function extractDescription(content: string): string | undefined {
  const jsdocRegex = /\/\*\*\s*\n([^*]|\*(?!\/))*\*\//
  const match = content.match(jsdocRegex)

  if (match) {
    const comment = match[0]
    const descRegex = /\*\s*(.+)/g
    const lines: string[] = []
    let lineMatch

    while ((lineMatch = descRegex.exec(comment)) !== null) {
      const line = lineMatch[1].trim()
      if (line && !line.startsWith('@')) {
        lines.push(line)
      }
    }

    return lines.join(' ').substring(0, 200)
  }

  return undefined
}

/**
 * Categorize file based on path
 */
function categorizeFile(relativePath: string): string {
  const parts = relativePath.split(path.sep)

  if (parts.includes('components')) {
    const categoryIndex = parts.indexOf('components') + 1
    return parts[categoryIndex] || 'components'
  }

  if (parts.includes('hooks')) {
    return 'hooks'
  }

  if (parts.includes('utils')) {
    return 'utils'
  }

  if (parts.includes('animations')) {
    return 'animations'
  }

  return 'other'
}

/**
 * Determine if file is a hook or component
 */
function classifyFile(
  filePath: string,
  exports: string[]
): { isHook: boolean; isComponent: boolean } {
  const fileName = path.basename(filePath, path.extname(filePath))
  const isHook =
    fileName.startsWith('use') || exports.some((e) => e.startsWith('use'))
  const isComponent =
    filePath.endsWith('.tsx') &&
    exports.some((e) => /^[A-Z]/.test(e) && !e.startsWith('use'))

  return { isHook, isComponent }
}

/**
 * Generate component inventory
 */
async function generateInventory() {
  console.log('📦 Generating component inventory...\n')

  const srcDir = path.join(reactPackageRoot, 'src')
  const files = await glob('**/*.{ts,tsx}', {
    cwd: srcDir,
    ignore: [
      '**/*.test.{ts,tsx}',
      '**/__tests__/**',
      '**/test-utils.tsx',
      '**/vitest.setup.ts',
    ],
    absolute: true,
  })

  const components: ComponentInfo[] = []

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8')
    const exports = extractExports(content)

    if (exports.length === 0) continue

    const relativePath = path.relative(srcDir, file)
    const name = path.basename(file, path.extname(file))
    const category = categorizeFile(relativePath)
    const description = extractDescription(content)
    const { isHook, isComponent } = classifyFile(file, exports)

    components.push({
      name,
      path: file,
      relativePath,
      category,
      exports,
      description,
      isHook,
      isComponent,
    })
  }

  // Sort by category, then name
  components.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category)
    }
    return a.name.localeCompare(b.name)
  })

  // Generate markdown
  let markdown = `# Clarity Chat Component Inventory

> Auto-generated inventory of all components, hooks, and utilities in the React package.
> Last updated: ${new Date().toISOString().split('T')[0]}

**Statistics:**
- Total files: ${components.length}
- Components: ${components.filter((c) => c.isComponent).length}
- Hooks: ${components.filter((c) => c.isHook).length}
- Utilities: ${components.filter((c) => !c.isComponent && !c.isHook).length}

---

## Table of Contents

`

  // Generate TOC
  const categories = [...new Set(components.map((c) => c.category))]
  categories.forEach((cat) => {
    markdown += `- [${cat.charAt(0).toUpperCase() + cat.slice(1)}](#${cat})\n`
  })

  markdown += '\n---\n\n'

  // Generate sections by category
  for (const category of categories) {
    const categoryComponents = components.filter((c) => c.category === category)

    markdown += `## ${category.charAt(0).toUpperCase() + category.slice(1)}\n\n`
    markdown += `**${categoryComponents.length} items**\n\n`

    for (const comp of categoryComponents) {
      const icon = comp.isComponent ? '🧩' : comp.isHook ? '🎣' : '🛠️'
      markdown += `### ${icon} ${comp.name}\n\n`

      if (comp.description) {
        markdown += `${comp.description}\n\n`
      }

      markdown += `**Path:** \`${comp.relativePath}\`\n\n`

      if (comp.exports.length > 0) {
        markdown += `**Exports:**\n\n`
        comp.exports.forEach((exp) => {
          markdown += `- \`${exp}\`\n`
        })
        markdown += '\n'
      }

      markdown += '---\n\n'
    }
  }

  // Write to file
  fs.writeFileSync(outputPath, markdown)
  console.log(
    `✅ Generated inventory at: ${path.relative(projectRoot, outputPath)}`
  )
  console.log(`📊 Processed ${components.length} files`)
  console.log(
    `   - ${components.filter((c) => c.isComponent).length} components`
  )
  console.log(`   - ${components.filter((c) => c.isHook).length} hooks`)
  console.log(
    `   - ${components.filter((c) => !c.isComponent && !c.isHook).length} utilities\n`
  )
}

// Run
generateInventory().catch((error) => {
  console.error('❌ Failed to generate inventory:', error)
  process.exit(1)
})
