#!/usr/bin/env tsx
/**
 * React Import Fixer
 *
 * Automatically converts "import * as React from 'react'" to optimized imports.
 * This is safe because modern React with JSX transform doesn't require React in scope.
 *
 * @module scripts/fix-react-imports
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

interface FixResult {
  filesProcessed: number
  filesModified: number
  errors: string[]
}

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
  'DragEvent',
  'TouchEvent',
  'PointerEvent',
  'WheelEvent',
  'AnimationEvent',
  'TransitionEvent',
  'HTMLAttributes',
  'InputHTMLAttributes',
  'ButtonHTMLAttributes',
  'FormHTMLAttributes',
  'ImgHTMLAttributes',
  'AnchorHTMLAttributes',
])

const REACT_FUNCTIONS = new Set([
  'createElement',
  'forwardRef',
  'memo',
  'lazy',
  'Suspense',
  'Fragment',
  'StrictMode',
  'createContext',
  'Children',
  'cloneElement',
  'isValidElement',
  'startTransition',
])

function getAllTsFiles(dir: string, fileList: string[] = []): string[] {
  const files = readdirSync(dir)

  for (const file of files) {
    const filePath = join(dir, file)
    const stat = statSync(filePath)

    if (stat.isDirectory()) {
      if (
        file === 'node_modules' ||
        file === 'dist' ||
        file === '__tests__' ||
        file === '__benchmarks__' ||
        file === 'examples'
      ) {
        continue
      }
      getAllTsFiles(filePath, fileList)
    } else if (
      (file.endsWith('.ts') || file.endsWith('.tsx')) &&
      !file.endsWith('.test.ts') &&
      !file.endsWith('.test.tsx') &&
      !file.endsWith('.stories.ts') &&
      !file.endsWith('.stories.tsx')
    ) {
      fileList.push(filePath)
    }
  }

  return fileList
}

function extractReactUsage(
  content: string,
  namespace: string
): {
  hooks: Set<string>
  types: Set<string>
  functions: Set<string>
  shouldKeepNamespace: boolean
} {
  const usage = {
    hooks: new Set<string>(),
    types: new Set<string>(),
    functions: new Set<string>(),
    shouldKeepNamespace: false,
  }

  // Check for dynamic member access - if found, keep namespace
  const dynamicPattern = new RegExp(`${namespace}\\[`, 'g')
  if (dynamicPattern.test(content)) {
    usage.shouldKeepNamespace = true
    return usage
  }

  // Extract hooks
  REACT_HOOKS.forEach((hook) => {
    const pattern = new RegExp(`${namespace}\\.${hook}`, 'g')
    if (pattern.test(content)) {
      usage.hooks.add(hook)
    }
  })

  // Extract types
  REACT_TYPES.forEach((type) => {
    const pattern = new RegExp(`${namespace}\\.${type}`, 'g')
    if (pattern.test(content)) {
      usage.types.add(type)
    }
  })

  // Extract functions
  REACT_FUNCTIONS.forEach((fn) => {
    const pattern = new RegExp(`${namespace}\\.${fn}`, 'g')
    if (pattern.test(content)) {
      usage.functions.add(fn)
    }
  })

  // If using Component or PureComponent, keep namespace
  if (
    content.includes(`${namespace}.Component`) ||
    content.includes(`${namespace}.PureComponent`)
  ) {
    usage.shouldKeepNamespace = true
  }

  return usage
}

function fixReactImports(filePath: string): boolean {
  const content = readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')

  // Find React namespace import
  let namespaceImportLine = -1
  let namespace = ''

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^import \* as (\w+) from ['"]react['"]/)
    if (match) {
      namespaceImportLine = i
      namespace = match[1]
      break
    }
  }

  if (namespaceImportLine === -1) {
    return false // No React namespace import
  }

  // Analyze usage
  const usage = extractReactUsage(content, namespace)

  if (usage.shouldKeepNamespace) {
    return false // Keep namespace
  }

  // If no usage at all and file has JSX, it's using the new JSX transform
  if (
    usage.hooks.size === 0 &&
    usage.types.size === 0 &&
    usage.functions.size === 0
  ) {
    // Just remove the import
    lines.splice(namespaceImportLine, 1)
    writeFileSync(filePath, lines.join('\n'), 'utf-8')
    return true
  }

  // Build new imports
  const newImports: string[] = []

  if (usage.hooks.size > 0 || usage.functions.size > 0) {
    const combined = new Set([...usage.hooks, ...usage.functions])
    newImports.push(
      `import { ${Array.from(combined).sort().join(', ')} } from 'react'`
    )
  }

  if (usage.types.size > 0) {
    newImports.push(
      `import type { ${Array.from(usage.types).sort().join(', ')} } from 'react'`
    )
  }

  // Replace namespace import with new imports
  lines.splice(namespaceImportLine, 1, ...newImports)

  // Replace all namespace usages
  let newContent = lines.join('\n')

  // Replace hooks
  usage.hooks.forEach((hook) => {
    const pattern = new RegExp(`${namespace}\\.${hook}`, 'g')
    newContent = newContent.replace(pattern, hook)
  })

  // Replace types
  usage.types.forEach((type) => {
    const pattern = new RegExp(`${namespace}\\.${type}`, 'g')
    newContent = newContent.replace(pattern, type)
  })

  // Replace functions
  usage.functions.forEach((fn) => {
    const pattern = new RegExp(`${namespace}\\.${fn}`, 'g')
    newContent = newContent.replace(pattern, fn)
  })

  writeFileSync(filePath, newContent, 'utf-8')
  return true
}

async function main() {
  console.log('Fixing React namespace imports...\n')

  const result: FixResult = {
    filesProcessed: 0,
    filesModified: 0,
    errors: [],
  }

  const srcDir = join(process.cwd(), 'src')
  const files = getAllTsFiles(srcDir)

  console.log(`Found ${files.length} TypeScript files\n`)

  for (const file of files) {
    try {
      result.filesProcessed++
      const modified = fixReactImports(file)

      if (modified) {
        result.filesModified++
        const shortPath = file.replace(process.cwd(), '')
        console.log(`✓ ${shortPath}`)
      }

      if (result.filesProcessed % 100 === 0) {
        console.log(`  Processed ${result.filesProcessed}/${files.length}...`)
      }
    } catch (error) {
      result.errors.push(
        `${file}: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  console.log('\n' + '='.repeat(80))
  console.log('RESULTS')
  console.log('='.repeat(80))
  console.log(`Files processed: ${result.filesProcessed}`)
  console.log(`Files modified: ${result.filesModified}`)
  console.log(`Errors: ${result.errors.length}`)

  if (result.errors.length > 0) {
    console.log('\nErrors:')
    result.errors.forEach((err) => console.log(`  - ${err}`))
  }

  if (result.filesModified > 0) {
    console.log('\n✅ React imports optimized!')
    console.log('   Run `pnpm typecheck` to verify no errors were introduced.')
    console.log('   Run `pnpm build` to test the bundle.')
  } else {
    console.log('\n✅ No files needed modification.')
  }
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
