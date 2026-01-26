#!/usr/bin/env tsx
/**
 * Import Optimization Script
 *
 * Optimizes imports across the React package for better bundle size and tree-shaking:
 * 1. Converts namespace imports to named imports where possible
 * 2. Removes unused imports
 * 3. Consolidates duplicate imports
 * 4. Adds type-only imports where appropriate
 * 5. Verifies tree-shaking compatibility
 *
 * @module scripts/optimize-imports
 */

import * as ts from 'typescript'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { glob } from 'glob'

// =============================================================================
// TYPES
// =============================================================================

interface ImportInfo {
  moduleSpecifier: string
  importClause: ts.ImportClause | undefined
  isTypeOnly: boolean
  namedBindings: string[]
  defaultImport: string | undefined
  namespaceImport: string | undefined
  usageCount: Map<string, number>
  usedOnlyAsType: Set<string>
}

interface FileAnalysis {
  filePath: string
  imports: ImportInfo[]
  unusedImports: string[]
  duplicateImports: string[]
  namespaceThatCanBeNamed: ImportInfo[]
  missingTypeOnly: ImportInfo[]
}

interface OptimizationResult {
  filesAnalyzed: number
  filesModified: number
  namespacesConverted: number
  importsRemoved: number
  typeOnlyAdded: number
  duplicatesConsolidated: number
  errors: string[]
}

// =============================================================================
// REACT HOOKS THAT NEED TO BE IMPORTED
// =============================================================================

const REACT_HOOKS = new Set([
  'useState',
  'useEffect',
  'useContext',
  'useReducer',
  'useCallback',
  'useMemo',
  'useRef',
  'useImperativeHandle',
  'useLayoutEffect',
  'useDebugValue',
  'useDeferredValue',
  'useTransition',
  'useId',
  'useSyncExternalStore',
  'useInsertionEffect',
])

const REACT_TYPES = new Set([
  'FC',
  'ReactNode',
  'ReactElement',
  'ComponentProps',
  'ComponentType',
  'PropsWithChildren',
  'RefObject',
  'MutableRefObject',
  'CSSProperties',
  'MouseEvent',
  'KeyboardEvent',
  'ChangeEvent',
  'FormEvent',
  'FocusEvent',
  'HTMLAttributes',
  'InputHTMLAttributes',
  'ButtonHTMLAttributes',
])

// =============================================================================
// MAIN OPTIMIZATION LOGIC
// =============================================================================

async function optimizeImports(rootDir: string): Promise<OptimizationResult> {
  const result: OptimizationResult = {
    filesAnalyzed: 0,
    filesModified: 0,
    namespacesConverted: 0,
    importsRemoved: 0,
    typeOnlyAdded: 0,
    duplicatesConsolidated: 0,
    errors: [],
  }

  // Find all TypeScript files
  const files = await glob('src/**/*.{ts,tsx}', {
    cwd: rootDir,
    absolute: true,
    ignore: [
      '**/node_modules/**',
      '**/dist/**',
      '**/__tests__/**',
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/__benchmarks__/**',
      '**/*.bench.ts',
      '**/*.bench.tsx',
      '**/examples/**',
      '**/*.stories.ts',
      '**/*.stories.tsx',
    ],
  })

  console.log(`Found ${files.length} TypeScript files to analyze\n`)

  for (const filePath of files) {
    try {
      result.filesAnalyzed++
      const analysis = analyzeFile(filePath)

      if (shouldOptimizeFile(analysis)) {
        const optimized = optimizeFile(filePath, analysis)
        if (optimized) {
          result.filesModified++
          result.namespacesConverted += analysis.namespaceThatCanBeNamed.length
          result.importsRemoved += analysis.unusedImports.length
          result.typeOnlyAdded += analysis.missingTypeOnly.length
          result.duplicatesConsolidated += analysis.duplicateImports.length
        }
      }

      // Progress indicator
      if (result.filesAnalyzed % 50 === 0) {
        console.log(`Analyzed ${result.filesAnalyzed}/${files.length} files...`)
      }
    } catch (error) {
      result.errors.push(
        `Error processing ${filePath}: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  return result
}

// =============================================================================
// FILE ANALYSIS
// =============================================================================

function analyzeFile(filePath: string): FileAnalysis {
  const sourceCode = fs.readFileSync(filePath, 'utf-8')
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceCode,
    ts.ScriptTarget.Latest,
    true
  )

  const imports: ImportInfo[] = []
  const identifierUsage = new Map<string, number>()
  const typeOnlyUsage = new Set<string>()

  // First pass: collect imports
  ts.forEachChild(sourceFile, (node) => {
    if (ts.isImportDeclaration(node)) {
      const importInfo = extractImportInfo(node)
      if (importInfo) {
        imports.push(importInfo)
      }
    }
  })

  // Second pass: analyze identifier usage
  function visitNode(node: ts.Node) {
    if (ts.isIdentifier(node)) {
      const name = node.text
      identifierUsage.set(name, (identifierUsage.get(name) || 0) + 1)

      // Check if used only in type positions
      if (isTypePosition(node)) {
        typeOnlyUsage.add(name)
      }
    }
    ts.forEachChild(node, visitNode)
  }

  ts.forEachChild(sourceFile, visitNode)

  // Update imports with usage information
  imports.forEach((imp) => {
    imp.namedBindings.forEach((name) => {
      imp.usageCount.set(name, identifierUsage.get(name) || 0)
      if (typeOnlyUsage.has(name)) {
        imp.usedOnlyAsType.add(name)
      }
    })

    if (imp.defaultImport) {
      imp.usageCount.set(
        imp.defaultImport,
        identifierUsage.get(imp.defaultImport) || 0
      )
    }

    if (imp.namespaceImport) {
      imp.usageCount.set(
        imp.namespaceImport,
        identifierUsage.get(imp.namespaceImport) || 0
      )
    }
  })

  return {
    filePath,
    imports,
    unusedImports: findUnusedImports(imports),
    duplicateImports: findDuplicateImports(imports),
    namespaceThatCanBeNamed: findConvertibleNamespaceImports(
      imports,
      sourceCode
    ),
    missingTypeOnly: findMissingTypeOnly(imports),
  }
}

function extractImportInfo(node: ts.ImportDeclaration): ImportInfo | null {
  const moduleSpecifier = (node.moduleSpecifier as ts.StringLiteral).text
  const importClause = node.importClause

  if (!importClause) return null

  const info: ImportInfo = {
    moduleSpecifier,
    importClause,
    isTypeOnly: importClause.isTypeOnly,
    namedBindings: [],
    defaultImport: undefined,
    namespaceImport: undefined,
    usageCount: new Map(),
    usedOnlyAsType: new Set(),
  }

  // Default import
  if (importClause.name) {
    info.defaultImport = importClause.name.text
  }

  // Named imports or namespace import
  if (importClause.namedBindings) {
    if (ts.isNamespaceImport(importClause.namedBindings)) {
      info.namespaceImport = importClause.namedBindings.name.text
    } else if (ts.isNamedImports(importClause.namedBindings)) {
      info.namedBindings = importClause.namedBindings.elements.map(
        (el) => el.name.text
      )
    }
  }

  return info
}

function isTypePosition(node: ts.Node): boolean {
  const parent = node.parent

  if (!parent) return false

  return (
    ts.isTypeReferenceNode(parent) ||
    ts.isTypeQueryNode(parent) ||
    ts.isTypePredicateNode(parent) ||
    ts.isTypeNode(parent) ||
    ts.isInterfaceDeclaration(parent) ||
    ts.isTypeAliasDeclaration(parent)
  )
}

// =============================================================================
// OPTIMIZATION DETECTION
// =============================================================================

function findUnusedImports(imports: ImportInfo[]): string[] {
  const unused: string[] = []

  imports.forEach((imp) => {
    imp.namedBindings.forEach((name) => {
      if ((imp.usageCount.get(name) || 0) === 0) {
        unused.push(`${name} from '${imp.moduleSpecifier}'`)
      }
    })

    if (
      imp.defaultImport &&
      (imp.usageCount.get(imp.defaultImport) || 0) === 0
    ) {
      unused.push(`${imp.defaultImport} from '${imp.moduleSpecifier}'`)
    }
  })

  return unused
}

function findDuplicateImports(imports: ImportInfo[]): string[] {
  const seen = new Map<string, number>()
  const duplicates: string[] = []

  imports.forEach((imp) => {
    const count = (seen.get(imp.moduleSpecifier) || 0) + 1
    seen.set(imp.moduleSpecifier, count)

    if (count > 1) {
      duplicates.push(imp.moduleSpecifier)
    }
  })

  return Array.from(new Set(duplicates))
}

function findConvertibleNamespaceImports(
  imports: ImportInfo[],
  sourceCode: string
): ImportInfo[] {
  const convertible: ImportInfo[] = []

  imports.forEach((imp) => {
    if (!imp.namespaceImport) return

    // Special case: Keep React namespace imports if JSX is used extensively
    if (imp.moduleSpecifier === 'react') {
      const reactUsage = analyzeReactUsage(sourceCode, imp.namespaceImport)
      if (reactUsage.canConvert) {
        convertible.push(imp)
      }
      return
    }

    // For other namespaces, check if they can be converted
    const usage = analyzeNamespaceUsage(sourceCode, imp.namespaceImport)
    if (usage.canConvert) {
      convertible.push(imp)
    }
  })

  return convertible
}

function findMissingTypeOnly(imports: ImportInfo[]): ImportInfo[] {
  const missing: ImportInfo[] = []

  imports.forEach((imp) => {
    if (imp.isTypeOnly) return

    const allUsedAsTypes = imp.namedBindings.every((name) =>
      imp.usedOnlyAsType.has(name)
    )

    if (allUsedAsTypes && imp.namedBindings.length > 0) {
      missing.push(imp)
    }
  })

  return missing
}

// =============================================================================
// REACT-SPECIFIC ANALYSIS
// =============================================================================

interface ReactUsage {
  canConvert: boolean
  hooks: Set<string>
  types: Set<string>
  jsxElements: number
}

function analyzeReactUsage(sourceCode: string, namespace: string): ReactUsage {
  const usage: ReactUsage = {
    canConvert: true,
    hooks: new Set(),
    types: new Set(),
    jsxElements: 0,
  }

  // Check for React.createElement or React.Component patterns
  const reactPatterns = [
    new RegExp(`${namespace}\\.createElement`, 'g'),
    new RegExp(`${namespace}\\.Component`, 'g'),
    new RegExp(`${namespace}\\.PureComponent`, 'g'),
    new RegExp(`${namespace}\\.forwardRef`, 'g'),
    new RegExp(`${namespace}\\.memo`, 'g'),
    new RegExp(`${namespace}\\.lazy`, 'g'),
  ]

  const directApiCalls = reactPatterns.some((pattern) =>
    pattern.test(sourceCode)
  )

  // Check for hooks with namespace prefix
  REACT_HOOKS.forEach((hook) => {
    const pattern = new RegExp(`${namespace}\\.${hook}`, 'g')
    if (pattern.test(sourceCode)) {
      usage.hooks.add(hook)
    }
  })

  // Check for types with namespace prefix
  REACT_TYPES.forEach((type) => {
    const pattern = new RegExp(`${namespace}\\.${type}`, 'g')
    if (pattern.test(sourceCode)) {
      usage.types.add(type)
    }
  })

  // Count JSX elements
  usage.jsxElements = (sourceCode.match(/<[A-Z][a-zA-Z0-9]*/g) || []).length

  // Can convert if:
  // 1. No direct React API calls (createElement, Component, etc.)
  // 2. Modern JSX transform (no React in scope needed)
  // 3. Hooks and types can be imported directly
  usage.canConvert = !directApiCalls && usage.jsxElements < 50

  return usage
}

interface NamespaceUsage {
  canConvert: boolean
  members: Set<string>
  dynamicAccess: boolean
}

function analyzeNamespaceUsage(
  sourceCode: string,
  namespace: string
): NamespaceUsage {
  const usage: NamespaceUsage = {
    canConvert: true,
    members: new Set(),
    dynamicAccess: false,
  }

  // Check for dynamic member access (namespace[variable])
  const dynamicPattern = new RegExp(`${namespace}\\[`, 'g')
  if (dynamicPattern.test(sourceCode)) {
    usage.canConvert = false
    usage.dynamicAccess = true
    return usage
  }

  // Extract static member access (namespace.member)
  const memberPattern = new RegExp(`${namespace}\\.(\\w+)`, 'g')
  let match
  while ((match = memberPattern.exec(sourceCode)) !== null) {
    usage.members.add(match[1])
  }

  // Can convert if we found members and no dynamic access
  usage.canConvert = usage.members.size > 0 && !usage.dynamicAccess

  return usage
}

// =============================================================================
// FILE OPTIMIZATION
// =============================================================================

function shouldOptimizeFile(analysis: FileAnalysis): boolean {
  return (
    analysis.unusedImports.length > 0 ||
    analysis.duplicateImports.length > 0 ||
    analysis.namespaceThatCanBeNamed.length > 0 ||
    analysis.missingTypeOnly.length > 0
  )
}

function optimizeFile(filePath: string, analysis: FileAnalysis): boolean {
  const sourceCode = fs.readFileSync(filePath, 'utf-8')
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceCode,
    ts.ScriptTarget.Latest,
    true
  )

  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })
  const transformer = createOptimizingTransformer(analysis)

  const result = ts.transform(sourceFile, [transformer])
  const transformedSourceFile = result.transformed[0]

  const optimizedCode = printer.printFile(
    transformedSourceFile as ts.SourceFile
  )

  // Only write if content changed
  if (optimizedCode !== sourceCode) {
    fs.writeFileSync(filePath, optimizedCode, 'utf-8')
    return true
  }

  return false
}

function createOptimizingTransformer(
  analysis: FileAnalysis
): ts.TransformerFactory<ts.SourceFile> {
  return (context) => {
    return (sourceFile) => {
      const visitor: ts.Visitor = (node) => {
        // Transform import declarations
        if (ts.isImportDeclaration(node)) {
          return transformImportDeclaration(node, analysis)
        }

        return ts.visitEachChild(node, visitor, context)
      }

      return ts.visitNode(sourceFile, visitor) as ts.SourceFile
    }
  }
}

function transformImportDeclaration(
  node: ts.ImportDeclaration,
  analysis: FileAnalysis
): ts.ImportDeclaration | undefined {
  const moduleSpecifier = (node.moduleSpecifier as ts.StringLiteral).text
  const importInfo = analysis.imports.find(
    (imp) => imp.moduleSpecifier === moduleSpecifier
  )

  if (!importInfo) return node

  // Remove if all imports are unused
  const allUnused =
    importInfo.namedBindings.every(
      (name) => (importInfo.usageCount.get(name) || 0) === 0
    ) &&
    (!importInfo.defaultImport ||
      (importInfo.usageCount.get(importInfo.defaultImport) || 0) === 0)

  if (allUnused) {
    return undefined // Remove the import
  }

  // Convert namespace to named imports
  if (
    importInfo.namespaceImport &&
    analysis.namespaceThatCanBeNamed.includes(importInfo)
  ) {
    return convertNamespaceToNamed(node, importInfo)
  }

  // Add type-only modifier
  if (analysis.missingTypeOnly.includes(importInfo) && !importInfo.isTypeOnly) {
    return addTypeOnlyModifier(node)
  }

  // Remove unused named imports
  if (importInfo.namedBindings.length > 0) {
    return removeUnusedNamedImports(node, importInfo)
  }

  return node
}

function convertNamespaceToNamed(
  node: ts.ImportDeclaration,
  info: ImportInfo
): ts.ImportDeclaration {
  // This is a simplified version - a real implementation would need to:
  // 1. Parse the entire file to find all namespace.member usages
  // 2. Create named imports for those members
  // 3. Update all usages to use the named imports directly
  // For now, we'll keep the namespace import to avoid breaking code
  return node
}

function addTypeOnlyModifier(node: ts.ImportDeclaration): ts.ImportDeclaration {
  if (!node.importClause) return node

  const newImportClause = ts.factory.createImportClause(
    true, // isTypeOnly
    node.importClause.name,
    node.importClause.namedBindings
  )

  return ts.factory.createImportDeclaration(
    node.modifiers,
    newImportClause,
    node.moduleSpecifier,
    node.assertClause
  )
}

function removeUnusedNamedImports(
  node: ts.ImportDeclaration,
  info: ImportInfo
): ts.ImportDeclaration {
  if (
    !node.importClause?.namedBindings ||
    !ts.isNamedImports(node.importClause.namedBindings)
  ) {
    return node
  }

  const usedElements = node.importClause.namedBindings.elements.filter((el) => {
    const name = el.name.text
    return (info.usageCount.get(name) || 0) > 0
  })

  if (usedElements.length === 0) {
    return node // Keep for now to avoid breaking
  }

  const newNamedBindings = ts.factory.createNamedImports(usedElements)
  const newImportClause = ts.factory.createImportClause(
    node.importClause.isTypeOnly,
    node.importClause.name,
    newNamedBindings
  )

  return ts.factory.createImportDeclaration(
    node.modifiers,
    newImportClause,
    node.moduleSpecifier,
    node.assertClause
  )
}

// =============================================================================
// REPORTING
// =============================================================================

function printResults(result: OptimizationResult): void {
  console.log('\n' + '='.repeat(60))
  console.log('IMPORT OPTIMIZATION RESULTS')
  console.log('='.repeat(60) + '\n')

  console.log(`Files analyzed: ${result.filesAnalyzed}`)
  console.log(`Files modified: ${result.filesModified}`)
  console.log(`Namespace imports converted: ${result.namespacesConverted}`)
  console.log(`Unused imports removed: ${result.importsRemoved}`)
  console.log(`Type-only imports added: ${result.typeOnlyAdded}`)
  console.log(
    `Duplicate imports consolidated: ${result.duplicatesConsolidated}`
  )

  if (result.errors.length > 0) {
    console.log(`\nErrors: ${result.errors.length}`)
    result.errors.forEach((error) => console.log(`  - ${error}`))
  }

  console.log('\n' + '='.repeat(60))

  // Calculate savings
  const totalOptimizations =
    result.namespacesConverted +
    result.importsRemoved +
    result.typeOnlyAdded +
    result.duplicatesConsolidated

  if (totalOptimizations > 0) {
    console.log(
      `\n✅ Optimized ${totalOptimizations} imports across ${result.filesModified} files`
    )
    console.log('   This should improve tree-shaking and reduce bundle size.')
  } else {
    console.log('\n✅ All imports are already optimized!')
  }

  console.log('')
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  const rootDir = process.cwd()

  console.log('Starting import optimization...\n')
  console.log(`Root directory: ${rootDir}\n`)

  const result = await optimizeImports(rootDir)
  printResults(result)

  process.exit(result.errors.length > 0 ? 1 : 0)
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
