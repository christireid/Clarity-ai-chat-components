#!/usr/bin/env node

/**
 * Generate AI Component/Hook Data from Source Files
 *
 * This script parses the actual TypeScript source files to extract
 * component props, hook parameters, return types, and examples.
 *
 * Usage: node scripts/generate-ai-component-data.mjs
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const REACT_PKG = path.resolve(__dirname, '../../../packages/react/src')

/**
 * Extract interface/type definitions from content
 */
function extractInterfaces(content, filename) {
  const interfaces = []

  // Match export interface declarations
  const interfaceRegex = /export\s+interface\s+(\w+)(?:<[^>]+>)?\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/gs
  let match

  while ((match = interfaceRegex.exec(content)) !== null) {
    const name = match[1]
    const body = match[2]

    // Parse props from interface body
    const props = parseInterfaceBody(body)

    interfaces.push({
      name,
      props,
      source: filename
    })
  }

  return interfaces
}

/**
 * Parse interface body to extract property definitions
 */
function parseInterfaceBody(body) {
  const props = []
  const lines = body.split('\n')

  let currentComment = ''

  for (const line of lines) {
    const trimmed = line.trim()

    // Capture JSDoc comments
    if (trimmed.startsWith('/**') || trimmed.startsWith('*')) {
      if (trimmed.startsWith('/**')) {
        currentComment = trimmed.replace('/**', '').replace('*/', '').trim()
      } else if (trimmed.startsWith('*/')) {
        // End of comment
      } else {
        currentComment += ' ' + trimmed.replace(/^\*\s*/, '').trim()
      }
      continue
    }

    // Match property definition: name?: Type
    const propMatch = trimmed.match(/^(\w+)(\?)?:\s*(.+?);?\s*$/)
    if (propMatch) {
      const [, name, optional, type] = propMatch
      props.push({
        name,
        type: type.replace(/;$/, '').trim(),
        required: !optional,
        description: currentComment.trim()
      })
      currentComment = ''
    }
  }

  return props
}

/**
 * Extract JSDoc description for a function/component
 */
function extractJSDoc(content, functionName) {
  // Look for JSDoc comment before function/const declaration
  const pattern = new RegExp(
    `/\\*\\*[\\s\\S]*?\\*/\\s*(?:export\\s+)?(?:function|const)\\s+${functionName}`,
    'm'
  )

  const match = content.match(pattern)
  if (!match) return { description: '', examples: [] }

  const jsDoc = match[0]

  // Extract description (first paragraph before @)
  const descMatch = jsDoc.match(/\/\*\*\s*\n?\s*\*?\s*([^@*][^@]*?)(?=\n\s*\*\s*@|\n\s*\*\/)/s)
  const description = descMatch
    ? descMatch[1].replace(/\n\s*\*\s*/g, ' ').replace(/\s+/g, ' ').trim()
    : ''

  // Extract @example blocks
  const examples = []
  const exampleRegex = /@example(?:\s+([^\n]*))?\s*\n\s*\*?\s*```[a-z]*\s*\n([\s\S]*?)```/g
  let exMatch

  while ((exMatch = exampleRegex.exec(jsDoc)) !== null) {
    const title = exMatch[1]?.trim() || ''
    const code = exMatch[2]
      .split('\n')
      .map(line => line.replace(/^\s*\*?\s?/, ''))
      .join('\n')
      .trim()

    examples.push({ title, code })
  }

  return { description, examples }
}

/**
 * Scan component files
 */
function scanComponents() {
  const componentsDir = path.join(REACT_PKG, 'components')
  const components = []

  if (!fs.existsSync(componentsDir)) {
    console.warn('Components directory not found:', componentsDir)
    return components
  }

  const files = fs.readdirSync(componentsDir)
    .filter(f => f.endsWith('.tsx') && !f.endsWith('.test.tsx') && !f.startsWith('__'))

  for (const file of files) {
    const filePath = path.join(componentsDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')

    // Extract component name from file
    const baseName = file.replace('.tsx', '')
    const componentName = baseName
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('')

    // Look for Props interface
    const interfaces = extractInterfaces(content, file)
    const propsInterface = interfaces.find(i =>
      i.name.endsWith('Props') || i.name === `${componentName}Props`
    )

    // Extract JSDoc for main export
    const jsDoc = extractJSDoc(content, componentName)

    if (propsInterface || jsDoc.description) {
      components.push({
        name: componentName,
        file: file,
        description: jsDoc.description,
        props: propsInterface?.props || [],
        examples: jsDoc.examples.map(e => e.code),
        importPath: '@clarity-chat/react'
      })
    }
  }

  return components
}

/**
 * Scan hook files
 */
function scanHooks() {
  const hooksDir = path.join(REACT_PKG, 'hooks')
  const hooks = []

  if (!fs.existsSync(hooksDir)) {
    console.warn('Hooks directory not found:', hooksDir)
    return hooks
  }

  const files = fs.readdirSync(hooksDir)
    .filter(f => f.endsWith('.ts') && !f.endsWith('.test.ts') && !f.startsWith('__') && f.startsWith('use-'))

  for (const file of files) {
    const filePath = path.join(hooksDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')

    // Extract hook name from file
    const baseName = file.replace('.ts', '')
    const hookName = baseName
      .split('-')
      .map((part, i) => i === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1))
      .join('')

    // Look for Options and Return interfaces
    const interfaces = extractInterfaces(content, file)
    const optionsInterface = interfaces.find(i =>
      i.name.includes('Options') || i.name.includes('Config')
    )
    const returnInterface = interfaces.find(i =>
      i.name.includes('Return') || i.name.includes('Result')
    )

    // Extract JSDoc for main export
    const jsDoc = extractJSDoc(content, hookName)

    // Determine if deprecated
    const isDeprecated = content.includes('@deprecated')

    if (optionsInterface || returnInterface || jsDoc.description) {
      hooks.push({
        name: hookName,
        file: file,
        description: jsDoc.description,
        deprecated: isDeprecated,
        parameters: optionsInterface?.props || [],
        returns: returnInterface?.props || [],
        examples: jsDoc.examples.map(e => e.code),
        importPath: '@clarity-chat/react'
      })
    }
  }

  return hooks
}

/**
 * Main function
 */
async function main() {
  console.log('🔍 Scanning source files...\n')

  const components = scanComponents()
  const hooks = scanHooks()

  console.log(`Found ${components.length} components`)
  console.log(`Found ${hooks.length} hooks\n`)

  // Generate TypeScript data file
  const outputPath = path.join(__dirname, '../lib/ai/generated-data.ts')
  const outputDir = path.dirname(outputPath)

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  const content = `/**
 * Auto-generated Component and Hook Data
 *
 * Generated from source files at: ${new Date().toISOString()}
 *
 * DO NOT EDIT MANUALLY - Run 'node scripts/generate-ai-component-data.mjs' to regenerate
 */

export interface GeneratedProp {
  name: string
  type: string
  required: boolean
  description: string
}

export interface GeneratedComponent {
  name: string
  file: string
  description: string
  props: GeneratedProp[]
  examples: string[]
  importPath: string
}

export interface GeneratedHook {
  name: string
  file: string
  description: string
  deprecated: boolean
  parameters: GeneratedProp[]
  returns: GeneratedProp[]
  examples: string[]
  importPath: string
}

export const generatedComponents: GeneratedComponent[] = ${JSON.stringify(components, null, 2)}

export const generatedHooks: GeneratedHook[] = ${JSON.stringify(hooks, null, 2)}

export const generationMetadata = {
  generatedAt: '${new Date().toISOString()}',
  componentCount: ${components.length},
  hookCount: ${hooks.length},
  sourcePackage: '@clarity-chat/react'
}
`

  fs.writeFileSync(outputPath, content)

  console.log('✅ Generated data saved to:', outputPath)
  console.log(`\n📊 Statistics:`)
  console.log(`   Components: ${components.length}`)
  console.log(`   Hooks: ${hooks.length}`)

  // Show sample of extracted data
  if (components.length > 0) {
    console.log(`\n📦 Sample Component:`)
    const sample = components[0]
    console.log(`   Name: ${sample.name}`)
    console.log(`   Props: ${sample.props.length}`)
    console.log(`   Description: ${sample.description?.substring(0, 80) || 'N/A'}...`)
  }

  if (hooks.length > 0) {
    console.log(`\n🪝 Sample Hook:`)
    const sample = hooks[0]
    console.log(`   Name: ${sample.name}`)
    console.log(`   Parameters: ${sample.parameters.length}`)
    console.log(`   Returns: ${sample.returns.length}`)
  }
}

main().catch(console.error)
