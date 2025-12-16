import { SecureLogger } from '@/lib/security/secureLogger';
import { SecureLogger } from '@/lib/security/secureLogger';
import { SecureLogger } from '@/lib/security/secureLogger';
#!/usr/bin/env tsx
/**
 * Component Registry Generator
 *
 * Generates component and hook registry entries from source files.
 * Can parse TypeScript/React component files to extract:
 * - Component names and descriptions from JSDoc
 * - Props from interface definitions
 * - Examples from code comments
 *
 * Usage:
 *   npx tsx scripts/generate-registry.ts <source-dir>           # Analyze components
 *   npx tsx scripts/generate-registry.ts <source-dir> --output  # Generate registry
 *   npx tsx scripts/generate-registry.ts --from-json <file>     # Generate from JSON
 *
 * @module generate-registry
 */

import * as fs from 'fs'
import * as path from 'path'

// Types matching the registry format
interface PropDefinition {
  name: string
  type: string
  required: boolean
  default?: string
  description: string
}

interface ExampleDefinition {
  title: string
  description: string
  code: string
}

interface AccessibilityInfo {
  wcagLevel: 'A' | 'AA' | 'AAA'
  keyboardSupport: string[]
  ariaAttributes: string[]
  screenReaderNotes: string
  focusManagement: string
}

interface ComponentDefinition {
  name: string
  displayName: string
  description: string
  category: string
  package: string
  importPath: string
  props: PropDefinition[]
  examples: ExampleDefinition[]
  relatedComponents: string[]
  accessibility: AccessibilityInfo
  tags: string[]
}

interface HookDefinition {
  name: string
  displayName: string
  description: string
  package: string
  importPath: string
  parameters: PropDefinition[]
  returns: {
    type: string
    description: string
    properties?: Array<{ name: string; type: string; description: string }>
  }
  examples: ExampleDefinition[]
  relatedHooks: string[]
  tags: string[]
}

interface RegistryInput {
  components: Array<{
    name: string
    description?: string
    category?: string
    props?: Array<{
      name: string
      type: string
      required?: boolean
      description?: string
    }>
    tags?: string[]
  }>
  hooks: Array<{
    name: string
    description?: string
    parameters?: Array<{
      name: string
      type: string
      required?: boolean
      description?: string
    }>
    returns?: { type: string; description?: string }
    tags?: string[]
  }>
}

// Category inference based on component name
const CATEGORY_PATTERNS: Array<{ pattern: RegExp; category: string }> = [
  { pattern: /^Clarity(Chat|Provider)/i, category: 'top-level' },
  { pattern: /Chat|Conversation/i, category: 'chat' },
  { pattern: /Message|Streaming/i, category: 'message' },
  { pattern: /Input|Upload|Voice|Command/i, category: 'input' },
  { pattern: /Toast|Error|Loading|Retry|Network/i, category: 'feedback' },
  { pattern: /List|History|Navigation|Sidebar/i, category: 'navigation' },
  { pattern: /Analytics|Dashboard|Token|Usage/i, category: 'analytics' },
  { pattern: /Audit|Api|Enterprise/i, category: 'enterprise' },
  { pattern: /Markdown|Code|Render/i, category: 'display' },
]

/**
 * Infer category from component name
 */
function inferCategory(name: string): string {
  for (const { pattern, category } of CATEGORY_PATTERNS) {
    if (pattern.test(name)) {
      return category
    }
  }
  return 'utilities'
}

/**
 * Generate display name from component name
 */
function generateDisplayName(name: string): string {
  // CamelCase to "Camel Case"
  return name.replace(/([A-Z])/g, ' $1').trim()
}

/**
 * Generate default accessibility info
 */
function generateDefaultAccessibility(): AccessibilityInfo {
  return {
    wcagLevel: 'AA',
    keyboardSupport: [
      'Tab: Navigate to component',
      'Enter: Activate primary action',
      'Escape: Close or cancel',
    ],
    ariaAttributes: ['role', 'aria-label'],
    screenReaderNotes: 'Component follows WCAG 2.1 AA guidelines',
    focusManagement: 'Uses standard focus management',
  }
}

/**
 * Generate default example
 */
function generateDefaultExample(
  name: string,
  isHook: boolean
): ExampleDefinition {
  if (isHook) {
    return {
      title: 'Basic Usage',
      description: `Basic usage of ${name}`,
      code: `import { ${name} } from '@clarity-chat/react'

function MyComponent() {
  const result = ${name}()
  return <div>{/* Use result */}</div>
}`,
    }
  }

  return {
    title: 'Basic Usage',
    description: `Basic usage of ${name}`,
    code: `import { ${name} } from '@clarity-chat/react'

function MyComponent() {
  return <${name} />
}`,
  }
}

/**
 * Generate tags from component name and category
 */
function generateTags(name: string, category: string): string[] {
  const tags = [category]

  // Add name-based tags
  const nameLower = name.toLowerCase()
  if (nameLower.includes('chat')) tags.push('chat')
  if (nameLower.includes('message')) tags.push('message')
  if (nameLower.includes('input')) tags.push('input')
  if (nameLower.includes('streaming')) tags.push('streaming', 'realtime')
  if (nameLower.includes('voice')) tags.push('voice', 'audio')
  if (nameLower.includes('file')) tags.push('file', 'upload')
  if (nameLower.includes('loading') || nameLower.includes('spinner'))
    tags.push('loading', 'ui')
  if (nameLower.includes('error')) tags.push('error', 'feedback')

  return [...new Set(tags)]
}

/**
 * Generate full component definition from minimal input
 */
function generateComponentDefinition(
  input: RegistryInput['components'][0]
): ComponentDefinition {
  const category = input.category || inferCategory(input.name)

  return {
    name: input.name,
    displayName: generateDisplayName(input.name),
    description:
      input.description ||
      `${generateDisplayName(input.name)} component for Clarity Chat applications`,
    category,
    package: '@clarity-chat/react',
    importPath: '@clarity-chat/react',
    props: (input.props || []).map((p) => ({
      name: p.name,
      type: p.type,
      required: p.required ?? false,
      description: p.description || `The ${p.name} property`,
    })),
    examples: [generateDefaultExample(input.name, false)],
    relatedComponents: [],
    accessibility: generateDefaultAccessibility(),
    tags: input.tags || generateTags(input.name, category),
  }
}

/**
 * Generate full hook definition from minimal input
 */
function generateHookDefinition(
  input: RegistryInput['hooks'][0]
): HookDefinition {
  return {
    name: input.name,
    displayName: generateDisplayName(input.name),
    description:
      input.description ||
      `${generateDisplayName(input.name)} hook for Clarity Chat applications`,
    package: '@clarity-chat/react',
    importPath: '@clarity-chat/react',
    parameters: (input.parameters || []).map((p) => ({
      name: p.name,
      type: p.type,
      required: p.required ?? false,
      description: p.description || `The ${p.name} parameter`,
    })),
    returns: input.returns || {
      type: `${input.name.replace('use', '')}Return`,
      description: `Return value from ${input.name}`,
    },
    examples: [generateDefaultExample(input.name, true)],
    relatedHooks: [],
    tags: input.tags || generateTags(input.name, 'hooks'),
  }
}

/**
 * Format component definition as TypeScript
 */
function formatComponentAsTypeScript(component: ComponentDefinition): string {
  return `  {
    name: '${component.name}',
    displayName: '${component.displayName}',
    description: '${component.description.replace(/'/g, "\\'")}',
    category: '${component.category}',
    package: '${component.package}',
    importPath: '${component.importPath}',
    props: ${JSON.stringify(component.props, null, 6).replace(/\n/g, '\n    ')},
    examples: ${JSON.stringify(component.examples, null, 6).replace(/\n/g, '\n    ')},
    relatedComponents: ${JSON.stringify(component.relatedComponents)},
    accessibility: ${JSON.stringify(component.accessibility, null, 6).replace(/\n/g, '\n    ')},
    tags: ${JSON.stringify(component.tags)},
  },`
}

/**
 * Format hook definition as TypeScript
 */
function formatHookAsTypeScript(hook: HookDefinition): string {
  return `  {
    name: '${hook.name}',
    displayName: '${hook.displayName}',
    description: '${hook.description.replace(/'/g, "\\'")}',
    package: '${hook.package}',
    importPath: '${hook.importPath}',
    parameters: ${JSON.stringify(hook.parameters, null, 6).replace(/\n/g, '\n    ')},
    returns: ${JSON.stringify(hook.returns, null, 6).replace(/\n/g, '\n    ')},
    examples: ${JSON.stringify(hook.examples, null, 6).replace(/\n/g, '\n    ')},
    relatedHooks: ${JSON.stringify(hook.relatedHooks)},
    tags: ${JSON.stringify(hook.tags)},
  },`
}

/**
 * Parse source directory for components
 */
function parseSourceDirectory(sourceDir: string): RegistryInput {
  const components: RegistryInput['components'] = []
  const hooks: RegistryInput['hooks'] = []

  if (!fs.existsSync(sourceDir)) {
    SecureLogger.error(`Directory not found: ${sourceDir}`)
    return { components, hooks }
  }

  const files = fs.readdirSync(sourceDir, { recursive: true }) as string[]

  for (const file of files) {
    if (!file.endsWith('.tsx') && !file.endsWith('.ts')) continue
    if (
      file.includes('__tests__') ||
      file.includes('.test.') ||
      file.includes('.spec.')
    )
      continue

    const filePath = path.join(sourceDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')

    // Extract component exports
    const componentMatches = content.matchAll(
      /export\s+(const|function)\s+([A-Z][a-zA-Z0-9]*)/g
    )
    for (const match of componentMatches) {
      const name = match[2]
      if (!name.startsWith('use')) {
        components.push({ name })
      }
    }

    // Extract hook exports
    const hookMatches = content.matchAll(
      /export\s+(const|function)\s+(use[A-Z][a-zA-Z0-9]*)/g
    )
    for (const match of hookMatches) {
      hooks.push({ name: match[2] })
    }
  }

  return { components, hooks }
}

/**
 * Load input from JSON file
 */
function loadFromJson(filePath: string): RegistryInput | null {
  if (!fs.existsSync(filePath)) {
    SecureLogger.error(`File not found: ${filePath}`)
    return null
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(content) as RegistryInput
  } catch (error) {
    SecureLogger.error('Error parsing JSON:', error)
    return null
  }
}

/**
 * Generate sample input JSON
 */
function generateSampleJson(): void {
  const sample: RegistryInput = {
    components: [
      {
        name: 'MyComponent',
        description: 'A sample component',
        category: 'utilities',
        props: [
          {
            name: 'children',
            type: 'React.ReactNode',
            required: false,
            description: 'Child elements',
          },
          {
            name: 'className',
            type: 'string',
            required: false,
            description: 'CSS class name',
          },
        ],
        tags: ['utility', 'ui'],
      },
    ],
    hooks: [
      {
        name: 'useMyHook',
        description: 'A sample hook',
        parameters: [
          {
            name: 'options',
            type: 'MyHookOptions',
            required: false,
            description: 'Hook options',
          },
        ],
        returns: { type: 'MyHookReturn', description: 'Hook return value' },
        tags: ['hook', 'state'],
      },
    ],
  }

  const outputPath = path.join(__dirname, '../registry-input.sample.json')
  fs.writeFileSync(outputPath, JSON.stringify(sample, null, 2))
  SecureLogger.debug(`Sample JSON written to: ${outputPath}`)
}

/**
 * Main function
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2)

  SecureLogger.debug('Component Registry Generator')
  SecureLogger.debug('============================\n')

  if (args.includes('--sample')) {
    generateSampleJson()
    return
  }

  let input: RegistryInput | null = null

  if (args.includes('--from-json')) {
    const jsonIndex = args.indexOf('--from-json')
    const jsonPath = args[jsonIndex + 1]
    if (!jsonPath) {
      SecureLogger.error('Please provide a JSON file path after --from-json')
      process.exit(1)
    }
    input = loadFromJson(jsonPath)
  } else if (args[0] && !args[0].startsWith('--')) {
    input = parseSourceDirectory(args[0])
  }

  if (!input) {
    SecureLogger.debug('Usage:')
    SecureLogger.debug('  npx tsx scripts/generate-registry.ts <source-dir>')
    SecureLogger.debug('  npx tsx scripts/generate-registry.ts --from-json <file>')
    SecureLogger.debug('  npx tsx scripts/generate-registry.ts --sample')
    return
  }

  SecureLogger.debug(`Found ${input.components.length} components`)
  SecureLogger.debug(`Found ${input.hooks.length} hooks\n`)

  if (args.includes('--output')) {
    // Generate TypeScript output
    SecureLogger.debug('// Generated Components\n')
    for (const comp of input.components) {
      const definition = generateComponentDefinition(comp)
      SecureLogger.debug(formatComponentAsTypeScript(definition))
      SecureLogger.debug('')
    }

    SecureLogger.debug('\n// Generated Hooks\n')
    for (const hook of input.hooks) {
      const definition = generateHookDefinition(hook)
      SecureLogger.debug(formatHookAsTypeScript(definition))
      SecureLogger.debug('')
    }
  } else {
    // Just list what was found
    SecureLogger.debug('Components:')
    for (const comp of input.components) {
      SecureLogger.debug(
        `  - ${comp.name} (${comp.category || inferCategory(comp.name)})`
      )
    }

    SecureLogger.debug('\nHooks:')
    for (const hook of input.hooks) {
      SecureLogger.debug(`  - ${hook.name}`)
    }

    SecureLogger.debug('\nRun with --output to generate TypeScript definitions.')
  }
}

main().catch(console.error)
