import { logger } from '@clarity-chat/utils/logger';
/**
 * generate command - Generate code (component, hook, context, adapter, test)
 *
 * This command consolidates all code generators into a single, beautiful CLI experience.
 * It supports both interactive prompts and flag-based automation for CI/CD.
 *
 * Features:
 * - Component generation with tests and Storybook stories
 * - Hook generation with tests
 * - Context generation with provider and hook
 * - Model adapter generation for AI integrations
 * - Test file generation
 * - Dry-run mode to preview changes
 * - Full flag bypass for automation
 *
 * @example
 * ```bash
 * # Interactive mode
 * clarity-chat generate component
 *
 * # With flags (automation-friendly)
 * clarity-chat generate component --name ChatMessage --with-story --with-test
 *
 * # Dry run to preview
 * clarity-chat generate component --name ChatMessage --dry-run
 * ```
 */

import pc from 'picocolors'
import path from 'path'
import fs from 'fs-extra'
import Handlebars from 'handlebars'
import { getLogger } from '../utils/logger.js'
import { sectionHeader } from '../ui/banner.js'
import { table, type TableColumn } from '../ui/table.js'
import { errorBox, infoBox } from '../ui/box.js'
import {
  showFilesCreated,
  showNextSteps,
  promptText,
  promptSelect,
  promptConfirm,
  runTasks,
  setupCancelHandler,
  onCleanup,
  clearCleanup,
  log,
} from '../utils/prompts.js'
import { toPascalCase, toCamelCase, toKebabCase } from '../utils/case.js'
import { TEMPLATES } from '../templates/index.js'

const logger = getLogger('generate')

// ============================================================================
// Types
// ============================================================================

interface GenerateOptions {
  name?: string
  output?: string
  dryRun?: boolean
  withTest?: boolean
  withStory?: boolean
  type?: string
  package?: string
  dir?: string
  force?: boolean
  description?: string
  yes?: boolean
  provider?: 'openai' | 'anthropic' | 'google' | 'custom'
  withStreaming?: boolean
  withMemory?: boolean
}

interface GeneratorConfig {
  name: string
  icon: string
  description: string
  defaultDir: string
  files: (context: TemplateContext) => GeneratedFile[]
  prompts?: (options: GenerateOptions) => Promise<Partial<GenerateOptions>>
}

interface GeneratedFile {
  name: string
  template: string
  enabled?: boolean
}

interface TemplateContext {
  name: string
  pascalName: string
  camelName: string
  kebabName: string
  description: string
  withTest: boolean
  withStory: boolean
  componentDir: string
  package: string
  provider?: string
  withStreaming?: boolean
  withMemory?: boolean
  year: number
}

// ============================================================================
// Template Helpers (Handlebars already configured in templates/index.ts)
// ============================================================================

// Handlebars helpers are already registered in templates/index.ts
// Re-register for this module in case of separate Handlebars instances
Handlebars.registerHelper('pascalCase', (str: string) => toPascalCase(str))
Handlebars.registerHelper('camelCase', (str: string) => toCamelCase(str))
Handlebars.registerHelper('kebabCase', (str: string) => toKebabCase(str))
Handlebars.registerHelper('eq', (a: unknown, b: unknown) => a === b)

// ============================================================================
// Generator Configurations
// ============================================================================

const GENERATORS: Record<string, GeneratorConfig> = {
  component: {
    name: 'React Component',
    icon: '⚛️',
    description: 'Create a React component with TypeScript, tests, and story',
    defaultDir: './src/components',
    files: (ctx) => [
      {
        name: `${ctx.pascalName}/${ctx.pascalName}.tsx`,
        template: TEMPLATES.component,
      },
      {
        name: `${ctx.pascalName}/index.ts`,
        template: TEMPLATES.componentIndex,
      },
      {
        name: `${ctx.pascalName}/${ctx.pascalName}.test.tsx`,
        template: TEMPLATES.componentTest,
        enabled: ctx.withTest,
      },
      {
        name: `${ctx.pascalName}/${ctx.pascalName}.stories.tsx`,
        template: TEMPLATES.componentStory,
        enabled: ctx.withStory,
      },
    ],
    prompts: async (options) => {
      const result: Partial<GenerateOptions> = {}

      if (!options.type) {
        result.type = await promptSelect({
          message: 'Component type:',
          options: [
            {
              value: 'ui',
              label: 'UI Component',
              hint: 'Generic reusable component',
            },
            {
              value: 'chat',
              label: 'Chat Component',
              hint: 'AI chat specific component',
            },
            {
              value: 'layout',
              label: 'Layout Component',
              hint: 'Page layout component',
            },
          ],
          initialValue: 'ui',
        })
      }

      if (options.withTest === undefined) {
        result.withTest = await promptConfirm({
          message: 'Include test file?',
          initialValue: true,
        })
      }

      if (options.withStory === undefined) {
        result.withStory = await promptConfirm({
          message: 'Include Storybook story?',
          initialValue: true,
        })
      }

      return result
    },
  },

  hook: {
    name: 'React Hook',
    icon: '🪝',
    description: 'Create a custom React hook with TypeScript and tests',
    defaultDir: './src/hooks',
    files: (ctx) => [
      {
        name: `use${ctx.pascalName}.ts`,
        template: TEMPLATES.hook,
      },
      {
        name: `__tests__/use${ctx.pascalName}.test.ts`,
        template: TEMPLATES.hookTest,
        enabled: ctx.withTest,
      },
    ],
    prompts: async (options) => {
      const result: Partial<GenerateOptions> = {}

      if (options.withTest === undefined) {
        result.withTest = await promptConfirm({
          message: 'Include test file?',
          initialValue: true,
        })
      }

      return result
    },
  },

  context: {
    name: 'React Context',
    icon: '🔗',
    description: 'Create a React context with provider, hook, and tests',
    defaultDir: './src/contexts',
    files: (ctx) => [
      {
        name: `${ctx.pascalName}Context.tsx`,
        template: TEMPLATES.context,
      },
      {
        name: `__tests__/${ctx.pascalName}Context.test.tsx`,
        template: TEMPLATES.contextTest,
        enabled: ctx.withTest,
      },
    ],
    prompts: async (options) => {
      const result: Partial<GenerateOptions> = {}

      if (options.withTest === undefined) {
        result.withTest = await promptConfirm({
          message: 'Include test file?',
          initialValue: true,
        })
      }

      return result
    },
  },

  adapter: {
    name: 'Model Adapter',
    icon: '🔌',
    description: 'Create an AI model adapter for streaming responses',
    defaultDir: './src/lib/adapters',
    files: (ctx) => [
      {
        name: `${ctx.camelName}Adapter.ts`,
        template: TEMPLATES.adapter,
      },
    ],
  },

  test: {
    name: 'Test File',
    icon: '🧪',
    description: 'Create a test file with Vitest',
    defaultDir: './src/__tests__',
    files: (ctx) => [
      {
        name: `${ctx.pascalName}.test.ts`,
        template: TEMPLATES.test,
      },
    ],
  },

  'chat-component': {
    name: 'Chat Component',
    icon: '💬',
    description:
      'Create an AI chat component with streaming and memory support',
    defaultDir: './src/components/chat',
    files: (ctx) => [
      {
        name: `${ctx.pascalName}/${ctx.pascalName}.tsx`,
        template: TEMPLATES.chatComponent,
      },
      {
        name: `${ctx.pascalName}/index.ts`,
        template: TEMPLATES.chatComponentIndex,
      },
      {
        name: `${ctx.pascalName}/${ctx.pascalName}.test.tsx`,
        template: TEMPLATES.chatComponentTest,
        enabled: ctx.withTest,
      },
      {
        name: `${ctx.pascalName}/${ctx.pascalName}.stories.tsx`,
        template: TEMPLATES.chatComponentStory,
        enabled: ctx.withStory,
      },
    ],
    prompts: async (options) => {
      const result: Partial<GenerateOptions> = {}

      if (options.withStreaming === undefined) {
        result.withStreaming = await promptConfirm({
          message: 'Include streaming support?',
          initialValue: true,
        })
      }

      if (options.withMemory === undefined) {
        result.withMemory = await promptConfirm({
          message: 'Include conversation memory?',
          initialValue: false,
        })
      }

      if (options.withTest === undefined) {
        result.withTest = await promptConfirm({
          message: 'Include test file?',
          initialValue: true,
        })
      }

      if (options.withStory === undefined) {
        result.withStory = await promptConfirm({
          message: 'Include Storybook story?',
          initialValue: true,
        })
      }

      return result
    },
  },

  'api-route': {
    name: 'API Route',
    icon: '🌐',
    description: 'Create a Next.js API route for AI chat endpoints',
    defaultDir: './src/app/api',
    files: (ctx) => [
      {
        name: `${ctx.kebabName}/route.ts`,
        template: TEMPLATES.apiRoute,
      },
    ],
    prompts: async (options) => {
      const result: Partial<GenerateOptions> = {}

      if (!options.provider) {
        result.provider = (await promptSelect({
          message: 'AI provider:',
          options: [
            { value: 'openai', label: 'OpenAI', hint: 'GPT-4, GPT-3.5' },
            { value: 'anthropic', label: 'Anthropic', hint: 'Claude 3' },
            { value: 'google', label: 'Google', hint: 'Gemini Pro' },
            { value: 'custom', label: 'Custom', hint: 'Custom API endpoint' },
          ],
          initialValue: 'openai',
        })) as 'openai' | 'anthropic' | 'google' | 'custom'
      }

      if (options.withStreaming === undefined) {
        result.withStreaming = await promptConfirm({
          message: 'Include streaming support?',
          initialValue: true,
        })
      }

      return result
    },
  },
}

// ============================================================================
// Validation
// ============================================================================

function validateName(value: string): string | undefined {
  if (value.length < 2) {
    return 'Name must be at least 2 characters'
  }

  if (!/^[A-Za-z][A-Za-z0-9]*$/.test(value)) {
    return 'Name must start with a letter and contain only letters and numbers'
  }

  const reserved = [
    'component',
    'index',
    'utils',
    'types',
    'hooks',
    'use',
    'context',
  ]
  if (reserved.includes(value.toLowerCase())) {
    return `"${value}" is a reserved name`
  }

  return undefined
}

// ============================================================================
// Main Command
// ============================================================================

export async function generateCommand(type: string, options: GenerateOptions) {
  // Setup cancellation handler
  setupCancelHandler()

  const generator = GENERATORS[type]

  if (!generator) {
    logger.error(`Unknown generator type: ${type}`)

    // Display available generators in a beautiful table
    const columns: TableColumn[] = [
      { header: 'Type', width: 15, color: pc.yellow },
      { header: 'Name', width: 20 },
      { header: 'Description', width: 40 },
    ]

    const generatorData = Object.entries(GENERATORS).map(([key, value]) => [
      `${value.icon} ${key}`,
      value.name,
      value.description,
    ])

    console.log()
    console.log(sectionHeader('📦 Available Generators'))
    console.log()
    console.log(table(generatorData, columns))
    console.log()
    console.log(
      pc.gray('Example: clarity-chat generate component --name ChatMessage')
    )
    console.log()

    process.exit(1)
  }

  // Show header
  console.log()
  console.log(sectionHeader(`${generator.icon} Generate ${generator.name}`))
  console.log()

  // Get component name
  let name = options.name
  if (!name) {
    if (options.yes) {
      log.logger.error('--name is required when using --yes flag')
      process.exit(1)
    }
    name = await promptText({
      message: `${generator.name} name (PascalCase):`,
      placeholder:
        type === 'hook'
          ? 'ChatState'
          : type === 'context'
            ? 'Theme'
            : type === 'chat-component'
              ? 'MyChat'
              : type === 'api-route'
                ? 'chat'
                : 'ChatMessage',
      validate: validateName,
    })
  } else {
    const validation = validateName(name)
    if (validation) {
      log.logger.error(validation)
      process.exit(1)
    }
  }

  // Get description (skip if --yes is provided)
  let description = options.description
  if (!description && !options.dryRun && !options.yes) {
    description = await promptText({
      message: 'Brief description:',
      placeholder: `A ${type} for...`,
      defaultValue: `A ${generator.name.toLowerCase()}`,
    })
  }

  // Run generator-specific prompts (skip if --yes is provided)
  let additionalOptions: Partial<GenerateOptions> = {}
  if (generator.prompts && !options.dryRun && !options.yes) {
    additionalOptions = await generator.prompts(options)
  }

  // Merge options
  const finalOptions: GenerateOptions = {
    ...options,
    ...additionalOptions,
    name,
    description: description || `A ${generator.name.toLowerCase()}`,
    withTest: options.withTest ?? additionalOptions.withTest ?? true,
    withStory: options.withStory ?? additionalOptions.withStory ?? false,
  }

  // Determine output path
  const cwd = process.cwd()
  const outputPath = finalOptions.output || generator.defaultDir
  const fullPath = path.resolve(cwd, outputPath)

  // Create template context
  const pascalName = toPascalCase(name)
  const context: TemplateContext = {
    name,
    pascalName,
    camelName: toCamelCase(name),
    kebabName: toKebabCase(name),
    description:
      finalOptions.description || `A ${generator.name.toLowerCase()}`,
    withTest: finalOptions.withTest ?? true,
    withStory: finalOptions.withStory ?? false,
    componentDir: finalOptions.type || 'components',
    package: finalOptions.package || 'react',
    provider: finalOptions.provider,
    withStreaming: finalOptions.withStreaming ?? true,
    withMemory: finalOptions.withMemory ?? false,
    year: new Date().getFullYear(),
  }

  // Get files to generate
  const files = generator.files(context).filter((f) => f.enabled !== false)

  // Display generation info
  const infoContent = [
    `${generator.icon} ${generator.name}`,
    '',
    `Name: ${pc.cyan(pascalName)}`,
    `Path: ${pc.cyan(fullPath)}`,
    `Files: ${pc.cyan(files.length.toString())}`,
    ...(finalOptions.dryRun
      ? [pc.yellow('\n📋 Dry run - no files will be created')]
      : []),
  ].join('\n')

  console.log()
  console.log(infoBox(infoContent, 'Generation Info'))
  console.log()

  // Dry run - just show what would be created
  if (finalOptions.dryRun) {
    console.log(pc.bold('Files that would be created:'))
    console.log()
    for (const file of files) {
      console.log(pc.cyan(`  + ${path.join(outputPath, file.name)}`))
    }
    console.log()
    console.log(pc.gray('Run without --dry-run to create files.'))
    console.log()
    return
  }

  // Confirm generation (skip if --yes or --force is provided)
  if (!options.force && !options.yes) {
    const confirm = await promptConfirm({
      message: 'Generate files?',
      initialValue: true,
    })

    if (!confirm) {
      console.log(pc.gray('\nCancelled'))
      return
    }
  }

  // Track created files for cleanup on error
  const createdFiles: string[] = []
  const createdDirs: string[] = []

  onCleanup(async () => {
    // Clean up created files on cancellation
    for (const file of createdFiles) {
      await fs.remove(file).catch(() => {})
    }
    for (const dir of createdDirs) {
      await fs.remove(dir).catch(() => {})
    }
  })

  try {
    // Generate files
    await runTasks(
      files.map((file, index) => ({
        title: `Creating ${file.name}`,
        task: async () => {
          const filePath = path.join(fullPath, file.name)
          const fileDir = path.dirname(filePath)

          // Ensure directory exists
          if (!(await fs.pathExists(fileDir))) {
            await fs.ensureDir(fileDir)
            createdDirs.push(fileDir)
          }

          // Check if file exists
          if ((await fs.pathExists(filePath)) && !options.force) {
            throw new Error(`File already exists: ${file.name}`)
          }

          // Render template
          const template = Handlebars.compile(file.template)
          const content = template(context)

          // Write file
          await fs.writeFile(filePath, content, 'utf-8')
          createdFiles.push(filePath)
        },
      }))
    )

    // Clear cleanup since we succeeded
    clearCleanup()

    // Success output
    console.log()
    showFilesCreated(
      files.map((f) => path.join(outputPath, f.name)),
      cwd
    )

    // Next steps
    let importPath: string
    switch (type) {
      case 'hook':
        importPath = `import { use${pascalName} } from '${outputPath}/use${pascalName}'`
        break
      case 'context':
        importPath = `import { ${pascalName}Provider, use${pascalName} } from '${outputPath}/${pascalName}Context'`
        break
      case 'adapter':
        importPath = `import { create${pascalName}Adapter } from '${outputPath}/${context.camelName}Adapter'`
        break
      case 'chat-component':
        importPath = `import { ${pascalName} } from '${outputPath}/${pascalName}'`
        break
      case 'api-route':
        importPath = `API route created at: ${outputPath}/${context.kebabName}/route.ts`
        break
      default:
        importPath = `import { ${pascalName} } from '${outputPath}/${pascalName}'`
    }

    showNextSteps([
      `Import: ${pc.cyan(importPath)}`,
      ...(finalOptions.withTest
        ? [`Run tests: ${pc.cyan(`pnpm test ${pascalName}`)}`]
        : []),
      ...(finalOptions.withStory
        ? [`View story: ${pc.cyan('http://localhost:6006')}`]
        : []),
    ])

    console.log()
  } catch (error) {
    // Clean up on error
    await clearCleanup()

    log.logger.error(error instanceof Error ? error.message : String(error))
    console.log()
    console.log(
      errorBox('Failed to generate files. Check the error above.', '✗ Error')
    )
    console.log()
    process.exit(1)
  }
}
