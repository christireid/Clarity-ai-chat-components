#!/usr/bin/env tsx
/**
 * Documentation Generator
 *
 * Reads library source files to extract component/hook metadata (JSDoc, props
 * interfaces, @example blocks) and generates the data/docs/*.ts files consumed
 * by the showcase app's DocPanel component.
 *
 * Props and descriptions are always regenerated from source so that changes
 * to the library are automatically reflected. Curated fields (usageCode,
 * notes, commonlyUsed markers) are preserved from existing doc files.
 *
 * Usage:
 *   pnpm --filter component-showcase generate-docs
 *   pnpm tsx apps/component-showcase/scripts/generate-docs.ts
 */

import * as fs from 'fs'
import * as path from 'path'
import { glob } from 'glob'
import * as prettier from 'prettier'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ExtractedProp {
  name: string
  type: string
  required: boolean
  default?: string
  description: string
}

interface ExtractedInterface {
  name: string
  file: string
  props: ExtractedProp[]
}

interface ExtractedComponent {
  name: string
  file: string
  description: string
  example?: string
  notes?: string[]
}

interface ComponentDoc {
  name: string
  description: string
  importPath: string
  importName?: string
  usageCode: string
  props: Array<{
    name: string
    type: string
    required?: boolean
    default?: string
    description: string
    commonlyUsed?: boolean
  }>
  notes?: string[]
  sourceFile?: string
}

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const PROJECT_ROOT = path.resolve(__dirname, '../../..')
const REACT_SRC = path.join(PROJECT_ROOT, 'packages/react/src')
const DOCS_DIR = path.join(PROJECT_ROOT, 'apps/component-showcase/data/docs')

// ---------------------------------------------------------------------------
// Prettier Formatting
// ---------------------------------------------------------------------------

let prettierConfig: prettier.Options | null = null

/**
 * Load the project's prettier config once.
 */
async function loadPrettierConfig(): Promise<prettier.Options> {
  if (prettierConfig) return prettierConfig
  const resolved = await prettier.resolveConfig(
    path.join(PROJECT_ROOT, 'src/index.ts')
  )
  prettierConfig = {
    ...resolved,
    parser: 'typescript',
    // Slightly narrower for code examples shown in doc panels
    printWidth: 60,
  }
  return prettierConfig
}

/**
 * Strip ASI-protection semicolons that prettier adds in semi:false mode.
 * These appear as leading `;` on lines starting with `(`, `[`, `/`, `<`, or `` ` ``.
 */
function stripLeadingSemicolons(code: string): string {
  return code.replace(/^;/gm, '').trim()
}

/**
 * Format a code snippet with prettier.
 * Handles partial snippets (e.g. function bodies without a wrapping function)
 * by attempting multiple strategies and falling back to the original string.
 */
async function formatCode(code: string): Promise<string> {
  const trimmed = code.trim()
  if (!trimmed) return trimmed

  const config = await loadPrettierConfig()

  // Strategy 1: Format as-is (works for complete modules/statements)
  try {
    const result = await prettier.format(trimmed, config)
    return stripLeadingSemicolons(result)
  } catch {
    // Fall through to next strategy
  }

  // Strategy 2: Wrap in a function body (handles JSX returns, hooks, etc.)
  try {
    const wrapped = `function __fmt__() {\n${trimmed}\n}`
    const result = await prettier.format(wrapped, config)
    // Extract the body between the first { and the last }
    const bodyMatch = result.match(/^function __fmt__\(\) \{\n([\s\S]*)\n\}$/m)
    if (bodyMatch) {
      // Remove 2-space indent that prettier adds inside function body
      const body = bodyMatch[1]
        .split('\n')
        .map((line) => (line.startsWith('  ') ? line.slice(2) : line))
        .join('\n')
      return stripLeadingSemicolons(body)
    }
  } catch {
    // Fall through to next strategy
  }

  // Strategy 3: Wrap as JSX expression (handles bare JSX fragments)
  try {
    const wrapped = `const __fmt__ = (\n${trimmed}\n)`
    const result = await prettier.format(wrapped, config)
    const bodyMatch = result.match(/^const __fmt__ = \(\n?([\s\S]*)\n?\)$/m)
    if (bodyMatch) {
      return stripLeadingSemicolons(bodyMatch[1])
    }
  } catch {
    // Fall through
  }

  // All strategies failed — return original code unchanged
  return trimmed
}

/**
 * Format all usageCode strings in a doc entries map.
 */
async function formatAllUsageCode(
  entries: Map<string, ComponentDoc | ComponentDoc[]>
): Promise<number> {
  let formatted = 0
  for (const [, docs] of entries) {
    for (const doc of toDocArray(docs)) {
      if (!doc.usageCode) continue
      const original = doc.usageCode
      const result = await formatCode(original)
      if (result !== original.trim()) {
        doc.usageCode = result
        formatted++
      }
    }
  }
  return formatted
}

// ---------------------------------------------------------------------------
// Source Parsing Utilities
// ---------------------------------------------------------------------------

/**
 * Extract all exported interfaces and their properties from a TS file.
 */
function extractInterfaces(
  content: string,
  filePath: string
): ExtractedInterface[] {
  const interfaces: ExtractedInterface[] = []

  // Match: export interface Name (extends ...)? { ... }
  // Use a manual brace-matching approach for reliability
  const interfaceStartRegex =
    /export\s+interface\s+(\w+)(?:\s+extends\s+[^{]*)?\s*\{/g
  let startMatch: RegExpExecArray | null

  while ((startMatch = interfaceStartRegex.exec(content)) !== null) {
    const name = startMatch[1]
    const openBraceIdx = startMatch.index + startMatch[0].length - 1
    const body = extractBraceBlock(content, openBraceIdx)
    if (!body) continue

    const props = parseInterfaceProps(body)
    interfaces.push({ name, file: filePath, props })
  }

  return interfaces
}

/**
 * Extract content between matching braces starting at `startIdx`.
 */
function extractBraceBlock(content: string, startIdx: number): string | null {
  if (content[startIdx] !== '{') return null
  let depth = 1
  let i = startIdx + 1
  while (i < content.length && depth > 0) {
    if (content[i] === '{') depth++
    else if (content[i] === '}') depth--
    i++
  }
  if (depth !== 0) return null
  return content.slice(startIdx + 1, i - 1)
}

/**
 * Parse a single-line or multi-line JSDoc comment starting at index `i`.
 * Returns the extracted description text and advances the index.
 */
function parseJSDocComment(
  lines: string[],
  startIdx: number
): { doc: string; nextIdx: number } {
  const firstLine = lines[startIdx].trim()

  // Single-line JSDoc: /** text */
  if (firstLine.endsWith('*/')) {
    const doc = firstLine
      .replace(/^\/\*\*\s*/, '')
      .replace(/\s*\*\/$/, '')
      .trim()
    return { doc, nextIdx: startIdx + 1 }
  }

  // Multi-line JSDoc
  const docLines: string[] = []
  let i = startIdx + 1
  while (i < lines.length) {
    const docLine = lines[i].trim()
    if (docLine === '*/') {
      i++
      break
    }
    docLines.push(docLine.replace(/^\*\s?/, '').trim())
    i++
  }

  let doc = docLines
    .filter((l) => !l.startsWith('@') || l.startsWith('@default'))
    .join(' ')
    .trim()
  // Strip @default inline from description
  doc = doc.replace(/@default\s+\S+/, '').trim()
  return { doc, nextIdx: i }
}

/** Check whether a type expression has unbalanced brackets. */
function hasUnbalancedBrackets(type: string): boolean {
  return (
    countChar(type, '(') > countChar(type, ')') ||
    countChar(type, '<') > countChar(type, '>') ||
    countChar(type, '{') > countChar(type, '}')
  )
}

/** Read continuation lines for a multi-line type expression. */
function readMultiLineType(
  lines: string[],
  startIdx: number,
  initial: string
): { type: string; nextIdx: number } {
  let type = initial
  let i = startIdx
  while (i < lines.length) {
    const nextLine = lines[i].trim()
    if (!nextLine || nextLine.startsWith('/**') || nextLine.startsWith('//'))
      break
    type += ' ' + nextLine.replace(/[;,]\s*$/, '').trim()
    i++
    if (!hasUnbalancedBrackets(type)) break
  }
  return { type, nextIdx: i }
}

/**
 * Parse interface body into property definitions.
 */
function parseInterfaceProps(body: string): ExtractedProp[] {
  const props: ExtractedProp[] = []
  const lines = body.split('\n')

  let currentDoc = ''
  let i = 0

  while (i < lines.length) {
    const line = lines[i].trim()

    // Accumulate JSDoc comments
    if (line.startsWith('/**')) {
      const result = parseJSDocComment(lines, i)
      currentDoc = result.doc
      i = result.nextIdx
      continue
    }

    // Skip empty lines and comments
    if (!line || line.startsWith('//') || line.startsWith('*')) {
      if (!line) currentDoc = ''
      i++
      continue
    }

    // Try to match a property definition
    const propMatch = line.match(
      /^['"]?(\w[\w-]*)['"]?\s*(\??):\s*([\s\S]*?)(?:$)/
    )
    if (!propMatch) {
      currentDoc = ''
      i++
      continue
    }

    const [, propName, optional, rawType] = propMatch
    let type = rawType.replace(/[;,]\s*$/, '').trim()

    // Handle multi-line types
    if (hasUnbalancedBrackets(type)) {
      const result = readMultiLineType(lines, i + 1, type)
      type = result.type
      i = result.nextIdx
    } else {
      i++
    }

    // Extract @default from doc if present
    let defaultValue: string | undefined
    const defaultInDoc = currentDoc.match(/@default\s+(\S+)/)
    if (defaultInDoc) {
      defaultValue = defaultInDoc[1].replace(/['"]/g, '')
      currentDoc = currentDoc.replace(/@default\s+\S+/, '').trim()
    }

    props.push({
      name: propName,
      type,
      required: optional !== '?',
      default: defaultValue,
      description: currentDoc || `The ${propName} prop.`,
    })
    currentDoc = ''
  }

  return props
}

function countChar(s: string, c: string): number {
  let n = 0
  for (const ch of s) if (ch === c) n++
  return n
}

/**
 * Extract the first JSDoc block above an export (function or const).
 */
function extractExportJSDoc(
  content: string,
  exportName: string
): {
  description: string
  example?: string
  notes?: string[]
} {
  // Find the export declaration
  const exportPatterns = [
    new RegExp(`export\\s+(?:function|const)\\s+${exportName}\\b`),
    new RegExp(`export\\s+\\{[^}]*\\b${exportName}\\b[^}]*\\}`),
  ]

  let exportIdx = -1
  for (const pat of exportPatterns) {
    const m = content.match(pat)
    if (m?.index !== undefined) {
      exportIdx = m.index
      break
    }
  }

  if (exportIdx < 0) return { description: '' }

  // Look backwards for the JSDoc block
  const before = content.slice(0, exportIdx)
  const jsdocMatch = before.match(/\/\*\*([\s\S]*?)\*\/\s*$/)
  if (!jsdocMatch) return { description: '' }

  const jsdocBody = jsdocMatch[1]
  return parseJSDoc(jsdocBody)
}

/**
 * Parse a JSDoc body into description, example, and notes.
 */
function parseJSDoc(body: string): {
  description: string
  example?: string
  notes?: string[]
} {
  const lines = body.split('\n').map((l) => l.replace(/^\s*\*\s?/, ''))

  let description = ''
  let example: string | undefined
  const notes: string[] = []
  let inExample = false
  let exampleLines: string[] = []
  let inCodeBlock = false

  for (const line of lines) {
    if (line.startsWith('@example')) {
      inExample = true
      continue
    }
    if (inExample) {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // End of code block
          inCodeBlock = false
          inExample = false
          example = exampleLines.join('\n').trim()
          exampleLines = []
          continue
        }
        inCodeBlock = true
        continue
      }
      if (inCodeBlock) {
        exampleLines.push(line)
      }
      continue
    }
    if (
      line.startsWith('@param') ||
      line.startsWith('@returns') ||
      line.startsWith('@see')
    ) {
      continue
    }
    if (line.startsWith('@')) continue

    // Regular description lines
    if (line.startsWith('- ')) {
      notes.push(line.slice(2).trim())
    } else if (line.trim()) {
      if (description) description += ' '
      description += line.trim()
    }
  }

  return {
    description: description.trim(),
    example,
    notes: notes.length > 0 ? notes : undefined,
  }
}

// ---------------------------------------------------------------------------
// Source Index Builder
// ---------------------------------------------------------------------------

interface SourceEntry {
  name: string
  file: string
  description: string
  example?: string
  notes?: string[]
  propsInterface?: string
  props?: ExtractedProp[]
}

async function buildSourceIndex(): Promise<Map<string, SourceEntry>> {
  const index = new Map<string, SourceEntry>()

  // Find all TypeScript source files
  const files = await glob('**/*.{ts,tsx}', {
    cwd: REACT_SRC,
    ignore: [
      '**/*.test.*',
      '**/__tests__/**',
      '**/__benchmarks__/**',
      '**/test-*',
    ],
    absolute: true,
  })

  // First pass: collect all interfaces
  const allInterfaces = new Map<string, ExtractedInterface>()

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8')
    const interfaces = extractInterfaces(content, file)
    for (const iface of interfaces) {
      allInterfaces.set(iface.name, iface)
    }
  }

  // Second pass: collect all exports and link to interfaces
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8')

    // Find exported functions and components
    const exportFuncRegex = /export\s+function\s+(\w+)/g
    let match: RegExpExecArray | null

    while ((match = exportFuncRegex.exec(content)) !== null) {
      const name = match[1]

      // Skip private/internal names
      if (name.startsWith('_') || name.startsWith('internal')) continue

      const jsdoc = extractExportJSDoc(content, name)

      // Convention-based interface matching
      let propsInterfaceName: string | undefined
      let props: ExtractedProp[] | undefined

      if (name.startsWith('use')) {
        // Hook: look for UseXxxOptions
        const pascalName = name.charAt(0).toUpperCase() + name.slice(1)
        const optionsName = `${pascalName}Options`
        const iface = allInterfaces.get(optionsName)
        if (iface) {
          propsInterfaceName = optionsName
          props = iface.props
        }
      } else {
        // Component: look for XxxProps
        const propsName = `${name}Props`
        const iface = allInterfaces.get(propsName)
        if (iface) {
          propsInterfaceName = propsName
          props = iface.props
        }
      }

      index.set(name, {
        name,
        file: path.relative(REACT_SRC, file),
        description: jsdoc.description,
        example: jsdoc.example,
        notes: jsdoc.notes,
        propsInterface: propsInterfaceName,
        props,
      })
    }

    // Also find exported const components (arrow functions)
    const exportConstRegex = /export\s+const\s+(\w+)\s*[=:]/g
    while ((match = exportConstRegex.exec(content)) !== null) {
      const name = match[1]
      if (name.startsWith('_') || /^[a-z]/.test(name)) continue // skip non-component consts
      if (index.has(name)) continue // already found as function

      const propsName = `${name}Props`
      const iface = allInterfaces.get(propsName)

      index.set(name, {
        name,
        file: path.relative(REACT_SRC, file),
        description: '',
        propsInterface: propsName,
        props: iface?.props,
      })
    }
  }

  return index
}

// ---------------------------------------------------------------------------
// Doc File Reader / Writer
// ---------------------------------------------------------------------------

interface ExistingDocEntry {
  key: string
  docs: ComponentDoc | ComponentDoc[]
}

/**
 * Read an existing doc data file and return its entries.
 * Uses dynamic import() (supported by tsx) to load the TS module.
 */
async function readExistingDocFile(
  filePath: string
): Promise<Map<string, ComponentDoc | ComponentDoc[]> | null> {
  if (!fs.existsSync(filePath)) return null

  try {
    // tsx supports dynamic import of .ts files
    const mod = await import(filePath)

    // Find the exported record (e.g. coreChatDocs, hooksDocs, etc.)
    const exportName = Object.keys(mod).find((k) => k.endsWith('Docs'))
    if (!exportName) return null

    const record = mod[exportName] as Record<
      string,
      ComponentDoc | ComponentDoc[]
    >
    return new Map(Object.entries(record))
  } catch {
    console.warn(
      `  Could not load ${path.basename(filePath)}, will regenerate from scratch`
    )
    return null
  }
}

/**
 * Merge source-extracted props with existing curated doc entry.
 * Source props take priority for: type, required, description (if source has one)
 * Existing doc preserves: commonlyUsed, custom descriptions, usageCode, notes
 */
function mergeDocEntry(
  existing: ComponentDoc,
  sourceEntry: SourceEntry | undefined
): ComponentDoc {
  if (!sourceEntry?.props || sourceEntry.props.length === 0) {
    // No source data found - keep existing as-is but add source marker
    return existing
  }

  // Build a lookup of existing props to preserve commonlyUsed and custom descriptions
  const existingPropsMap = new Map(existing.props.map((p) => [p.name, p]))

  // Start with source-extracted props (authoritative for type and required)
  const mergedProps = sourceEntry.props.map((sourceProp) => {
    const existingProp = existingPropsMap.get(sourceProp.name)

    return {
      name: sourceProp.name,
      type: sourceProp.type,
      required: sourceProp.required ? true : undefined,
      default: sourceProp.default ?? existingProp?.default,
      description: existingProp?.description || sourceProp.description,
      commonlyUsed: existingProp?.commonlyUsed,
    }
  })

  // Add any existing props not in source (may be from extended interfaces)
  for (const [name, existingProp] of existingPropsMap) {
    if (!sourceEntry.props.find((p) => p.name === name)) {
      mergedProps.push({
        name: existingProp.name,
        type: existingProp.type,
        required: existingProp.required ? true : undefined,
        default: existingProp.default,
        description: existingProp.description,
        commonlyUsed: existingProp.commonlyUsed,
      })
    }
  }

  return {
    name: existing.name,
    description: existing.description || sourceEntry.description,
    importPath: existing.importPath,
    importName: existing.importName,
    usageCode: existing.usageCode || sourceEntry.example || '',
    props: mergedProps,
    notes: existing.notes,
    sourceFile: sourceEntry.file || existing.sourceFile,
  }
}

/**
 * Generate a doc entry purely from source data (for new/undocumented components).
 */
function generateDocFromSource(
  sourceEntry: SourceEntry,
  importPath: string = '@clarity-chat/react'
): ComponentDoc {
  return {
    name: sourceEntry.name,
    description: sourceEntry.description || `${sourceEntry.name} component.`,
    importPath,
    usageCode:
      sourceEntry.example ||
      `import { ${sourceEntry.name} } from '${importPath}'`,
    props: (sourceEntry.props || []).map((p) => ({
      name: p.name,
      type: p.type,
      required: p.required ? true : undefined,
      default: p.default,
      description: p.description,
    })),
    notes: sourceEntry.notes,
    sourceFile: sourceEntry.file,
  }
}

// ---------------------------------------------------------------------------
// Doc File Generator
// ---------------------------------------------------------------------------

function serializeDocEntry(doc: ComponentDoc, indent: string = '    '): string {
  const lines: string[] = []
  lines.push(`${indent}{`)
  lines.push(`${indent}  name: ${JSON.stringify(doc.name)},`)
  lines.push(`${indent}  description:`)
  lines.push(`${indent}    ${JSON.stringify(doc.description)},`)
  lines.push(`${indent}  importPath: ${JSON.stringify(doc.importPath)},`)
  if (doc.importName) {
    lines.push(`${indent}  importName: ${JSON.stringify(doc.importName)},`)
  }

  // Usage code - use template literal for readability
  lines.push(
    `${indent}  usageCode: \`${doc.usageCode.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`,`
  )

  // Props
  lines.push(`${indent}  props: [`)
  for (const prop of doc.props) {
    const parts: string[] = []
    parts.push(`name: ${JSON.stringify(prop.name)}`)
    parts.push(`type: ${JSON.stringify(prop.type)}`)
    if (prop.required) parts.push('required: true')
    if (prop.default !== undefined)
      parts.push(`default: ${JSON.stringify(prop.default)}`)
    parts.push(`description: ${JSON.stringify(prop.description)}`)
    if (prop.commonlyUsed) parts.push('commonlyUsed: true')

    lines.push(`${indent}    { ${parts.join(', ')} },`)
  }
  lines.push(`${indent}  ],`)

  // Notes
  if (doc.notes && doc.notes.length > 0) {
    lines.push(`${indent}  notes: [`)
    for (const note of doc.notes) {
      lines.push(`${indent}    ${JSON.stringify(note)},`)
    }
    lines.push(`${indent}  ],`)
  }

  // Source file path (relative to packages/react/src)
  if (doc.sourceFile) {
    lines.push(`${indent}  sourceFile: ${JSON.stringify(doc.sourceFile)},`)
  }

  lines.push(`${indent}}`)
  return lines.join('\n')
}

function generateDocFile(
  exportName: string,
  entries: Map<string, ComponentDoc | ComponentDoc[]>
): string {
  const lines: string[] = []

  lines.push("import type { ComponentDoc } from '@/components/doc-panel'")
  lines.push('')
  lines.push(
    `export const ${exportName}: Record<string, ComponentDoc | ComponentDoc[]> = {`
  )

  for (const [key, docs] of entries) {
    lines.push('')
    lines.push(`  // ${'='.repeat(75)}`)
    lines.push(`  // ${key}`)
    lines.push(`  // ${'='.repeat(75)}`)

    if (Array.isArray(docs)) {
      lines.push(`  ${JSON.stringify(key)}: [`)
      for (const doc of docs) {
        lines.push(serializeDocEntry(doc, '    ') + ',')
      }
      lines.push('  ],')
    } else {
      lines.push(`  ${JSON.stringify(key)}: ${serializeDocEntry(docs, '  ')},`)
    }
  }

  lines.push('}')
  lines.push('')

  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// Doc Sync Helpers
// ---------------------------------------------------------------------------

/** Sync a single ComponentDoc entry against source data. Returns true if changed. */
function syncDocEntry(
  doc: ComponentDoc,
  sourceIndex: Map<string, SourceEntry>
): boolean {
  const lookupName = doc.importName || doc.name
  const sourceEntry = sourceIndex.get(lookupName)
  if (!sourceEntry) return false

  // Always set sourceFile from the source index
  let changed = false
  if (sourceEntry.file && doc.sourceFile !== sourceEntry.file) {
    doc.sourceFile = sourceEntry.file
    changed = true
  }

  if (!sourceEntry.props || sourceEntry.props.length === 0) return changed

  const oldPropCount = doc.props.length
  const merged = mergeDocEntry(doc, sourceEntry)
  if (
    merged.props.length !== oldPropCount ||
    merged.description !== doc.description
  ) {
    changed = true
  }

  // Apply merged data
  doc.name = merged.name
  doc.description = merged.description
  doc.props = merged.props
  if (!doc.usageCode && merged.usageCode) doc.usageCode = merged.usageCode

  return changed
}

/** Check if a doc entry is linked to a source export. */
function isLinked(
  doc: ComponentDoc,
  sourceIndex: Map<string, SourceEntry>
): boolean {
  return sourceIndex.has(doc.importName || doc.name)
}

/** Flatten a doc record value into an array. */
function toDocArray(docs: ComponentDoc | ComponentDoc[]): ComponentDoc[] {
  return Array.isArray(docs) ? docs : [docs]
}

/** Print the final sync report. */
function printReport(
  totalSections: number,
  linkedSections: number,
  updatedProps: number,
  formattedCode: number,
  unlinkDetails: Array<{ file: string; key: string; name: string }>
) {
  console.log('\n' + '='.repeat(60))
  console.log('Documentation Sync Report')
  console.log('='.repeat(60))
  console.log(`Total doc sections:    ${totalSections}`)
  console.log(`Linked to source:      ${linkedSections}`)
  console.log(`Not linked:            ${totalSections - linkedSections}`)
  console.log(`Props updated:         ${updatedProps}`)
  console.log(`Code examples formatted: ${formattedCode}`)
  console.log('')

  if (unlinkDetails.length > 0) {
    console.log('Unlinked sections (no matching library export found):')
    for (const detail of unlinkDetails) {
      console.log(`  - ${detail.file}: "${detail.key}" → ${detail.name}`)
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('Building source index from library...')
  const sourceIndex = await buildSourceIndex()
  console.log(`  Found ${sourceIndex.size} exported components/hooks\n`)

  // Load prettier config once
  console.log('Loading prettier config...')
  await loadPrettierConfig()

  const docFiles = await glob('*-docs.ts', { cwd: DOCS_DIR, absolute: true })
  docFiles.sort()

  let totalSections = 0
  let linkedSections = 0
  let updatedProps = 0
  let formattedCode = 0
  const unlinkDetails: Array<{ file: string; key: string; name: string }> = []

  for (const docFile of docFiles) {
    const basename = path.basename(docFile, '.ts')
    const exportName = basename.replace(/-([a-z])/g, (_, c: string) =>
      c.toUpperCase()
    )
    console.log(`Processing ${basename}...`)

    const existing = await readExistingDocFile(docFile)
    if (!existing) {
      console.log('  Skipped (could not load)')
      continue
    }

    let fileUpdated = false

    for (const [key, docs] of existing) {
      totalSections++
      for (const doc of toDocArray(docs)) {
        if (isLinked(doc, sourceIndex)) {
          linkedSections++
          if (syncDocEntry(doc, sourceIndex)) {
            updatedProps++
            fileUpdated = true
          }
        } else {
          unlinkDetails.push({
            file: basename,
            key,
            name: doc.importName || doc.name,
          })
        }
      }
    }

    // Format all usageCode strings with prettier
    const fmtCount = await formatAllUsageCode(existing)
    if (fmtCount > 0) {
      formattedCode += fmtCount
      fileUpdated = true
      console.log(`  Formatted ${fmtCount} code examples`)
    }

    if (fileUpdated) {
      fs.writeFileSync(docFile, generateDocFile(exportName, existing))
      console.log(`  Updated ${basename}`)
    } else {
      console.log(`  No changes needed`)
    }
  }

  printReport(
    totalSections,
    linkedSections,
    updatedProps,
    formattedCode,
    unlinkDetails
  )
}

main().catch((error) => {
  console.error('Failed to generate docs:', error)
  process.exit(1)
})
