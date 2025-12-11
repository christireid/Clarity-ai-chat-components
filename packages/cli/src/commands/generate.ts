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
import { successBox, errorBox, infoBox } from '../ui/box.js'
import {
  showIntro,
  showOutro,
  showFilesCreated,
  showNextSteps,
  showWarning,
  promptText,
  promptSelect,
  promptConfirm,
  runTasks,
  setupCancelHandler,
  onCleanup,
  clearCleanup,
  log,
} from '../utils/prompts.js'
import { createSpinner } from '../ui/progress.js'

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
}

// ============================================================================
// Template Helpers
// ============================================================================

// Register Handlebars helpers
Handlebars.registerHelper('pascalCase', (str: string) => toPascalCase(str))
Handlebars.registerHelper('camelCase', (str: string) => toCamelCase(str))
Handlebars.registerHelper('kebabCase', (str: string) => toKebabCase(str))

function toPascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (_, c) => c.toUpperCase())
}

function toCamelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (_, c) => c.toLowerCase())
}

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

// ============================================================================
// Templates
// ============================================================================

const TEMPLATES = {
  component: `import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface {{pascalName}}Props {
  /** Additional CSS classes */
  className?: string
  /** Component children */
  children?: React.ReactNode
}

/**
 * {{pascalName}} - {{description}}
 *
 * @example
 * \`\`\`tsx
 * <{{pascalName}}>
 *   Content here
 * </{{pascalName}}>
 * \`\`\`
 */
export const {{pascalName}} = forwardRef<HTMLDivElement, {{pascalName}}Props>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'clarity-{{kebabName}}',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

{{pascalName}}.displayName = '{{pascalName}}'
`,

  componentIndex: `export { {{pascalName}} } from './{{pascalName}}'
export type { {{pascalName}}Props } from './{{pascalName}}'
`,

  componentTest: `import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { {{pascalName}} } from './{{pascalName}}'

describe('{{pascalName}}', () => {
  it('should render children correctly', () => {
    render(<{{pascalName}}>Test content</{{pascalName}}>)

    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    render(
      <{{pascalName}} className="custom-class">
        Content
      </{{pascalName}}>
    )

    const element = screen.getByText('Content').closest('div')
    expect(element).toHaveClass('custom-class')
    expect(element).toHaveClass('clarity-{{kebabName}}')
  })

  it('should forward ref correctly', () => {
    const ref = createRef<HTMLDivElement>()
    render(<{{pascalName}} ref={ref}>Content</{{pascalName}}>)

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
`,

  componentStory: `import type { Meta, StoryObj } from '@storybook/react'
import { {{pascalName}} } from './{{pascalName}}'

const meta: Meta<typeof {{pascalName}}> = {
  title: '{{componentDir}}/{{pascalName}}',
  component: {{pascalName}},
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '{{description}}',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    children: {
      control: 'text',
      description: 'Component children',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default state of the {{pascalName}} component.
 */
export const Default: Story = {
  args: {
    children: '{{pascalName}} content',
  },
}

/**
 * {{pascalName}} with custom styling.
 */
export const CustomStyle: Story = {
  args: {
    children: 'Custom styled content',
    className: 'bg-blue-100 p-4 rounded-lg',
  },
}
`,

  hook: `import { useState, useCallback, useEffect } from 'react'

export interface Use{{pascalName}}Options {
  /**
   * Initial value for the hook
   */
  initialValue?: unknown
}

export interface Use{{pascalName}}Return {
  /**
   * Current state value
   */
  value: unknown
  /**
   * Update the value
   */
  setValue: (value: unknown) => void
  /**
   * Reset to initial value
   */
  reset: () => void
}

/**
 * use{{pascalName}} - {{description}}
 *
 * @param options - Hook configuration options
 * @returns Hook state and methods
 *
 * @example
 * \`\`\`tsx
 * function MyComponent() {
 *   const { value, setValue, reset } = use{{pascalName}}()
 *
 *   return (
 *     <div>
 *       <span>{String(value)}</span>
 *       <button onClick={() => setValue('new value')}>Update</button>
 *       <button onClick={reset}>Reset</button>
 *     </div>
 *   )
 * }
 * \`\`\`
 */
export function use{{pascalName}}(
  options: Use{{pascalName}}Options = {}
): Use{{pascalName}}Return {
  const { initialValue = null } = options

  const [value, setValueState] = useState<unknown>(initialValue)

  const setValue = useCallback((newValue: unknown) => {
    setValueState(newValue)
  }, [])

  const reset = useCallback(() => {
    setValueState(initialValue)
  }, [initialValue])

  return {
    value,
    setValue,
    reset,
  }
}
`,

  hookTest: `import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { use{{pascalName}} } from './use{{pascalName}}'

describe('use{{pascalName}}', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => use{{pascalName}}())

    expect(result.current.value).toBe(null)
  })

  it('should initialize with custom initial value', () => {
    const { result } = renderHook(() =>
      use{{pascalName}}({ initialValue: 'test' })
    )

    expect(result.current.value).toBe('test')
  })

  it('should update value', () => {
    const { result } = renderHook(() => use{{pascalName}}())

    act(() => {
      result.current.setValue('new value')
    })

    expect(result.current.value).toBe('new value')
  })

  it('should reset to initial value', () => {
    const { result } = renderHook(() =>
      use{{pascalName}}({ initialValue: 'initial' })
    )

    act(() => {
      result.current.setValue('changed')
    })

    expect(result.current.value).toBe('changed')

    act(() => {
      result.current.reset()
    })

    expect(result.current.value).toBe('initial')
  })
})
`,

  context: `import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'

// === STATE TYPES ===

export interface {{pascalName}}State {
  /**
   * Current value in the context
   */
  value: unknown
  /**
   * Loading state
   */
  isLoading: boolean
  /**
   * Error state
   */
  error: Error | null
}

// === ACTION TYPES ===

export interface {{pascalName}}Actions {
  /**
   * Update the value
   */
  setValue: (value: unknown) => void
  /**
   * Reset the context to initial state
   */
  reset: () => void
  /**
   * Clear any errors
   */
  clearError: () => void
}

// === CONTEXT VALUE ===

export type {{pascalName}}ContextValue = {{pascalName}}State & {{pascalName}}Actions

// === CONTEXT ===

const {{pascalName}}Context = createContext<{{pascalName}}ContextValue | null>(null)

{{pascalName}}Context.displayName = '{{pascalName}}Context'

// === PROVIDER ===

export interface {{pascalName}}ProviderProps {
  /**
   * Child components
   */
  children: ReactNode
  /**
   * Initial value for the context
   */
  initialValue?: unknown
}

const defaultState: {{pascalName}}State = {
  value: null,
  isLoading: false,
  error: null,
}

/**
 * {{pascalName}}Provider - {{description}}
 *
 * @example
 * \`\`\`tsx
 * function App() {
 *   return (
 *     <{{pascalName}}Provider>
 *       <MyComponent />
 *     </{{pascalName}}Provider>
 *   )
 * }
 * \`\`\`
 */
export function {{pascalName}}Provider({
  children,
  initialValue,
}: {{pascalName}}ProviderProps) {
  const [state, setState] = useState<{{pascalName}}State>({
    ...defaultState,
    value: initialValue ?? defaultState.value,
  })

  const setValue = useCallback((value: unknown) => {
    setState((prev) => ({ ...prev, value }))
  }, [])

  const reset = useCallback(() => {
    setState({
      ...defaultState,
      value: initialValue ?? defaultState.value,
    })
  }, [initialValue])

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }))
  }, [])

  const contextValue = useMemo<{{pascalName}}ContextValue>(
    () => ({
      ...state,
      setValue,
      reset,
      clearError,
    }),
    [state, setValue, reset, clearError]
  )

  return (
    <{{pascalName}}Context.Provider value={contextValue}>
      {children}
    </{{pascalName}}Context.Provider>
  )
}

// === HOOK ===

/**
 * use{{pascalName}} - Access the {{pascalName}} context
 *
 * @throws Error if used outside of {{pascalName}}Provider
 *
 * @example
 * \`\`\`tsx
 * function MyComponent() {
 *   const { value, setValue, reset } = use{{pascalName}}()
 *
 *   return (
 *     <div>
 *       <span>{String(value)}</span>
 *       <button onClick={() => setValue('new')}>Update</button>
 *     </div>
 *   )
 * }
 * \`\`\`
 */
export function use{{pascalName}}(): {{pascalName}}ContextValue {
  const context = useContext({{pascalName}}Context)

  if (!context) {
    throw new Error(
      'use{{pascalName}} must be used within a {{pascalName}}Provider. ' +
      'Make sure to wrap your component tree with <{{pascalName}}Provider>.'
    )
  }

  return context
}

// === EXPORTS ===

export { {{pascalName}}Context }
`,

  contextTest: `import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { {{pascalName}}Provider, use{{pascalName}} } from './{{pascalName}}Context'

function TestConsumer() {
  const { value, setValue, reset } = use{{pascalName}}()

  return (
    <div>
      <span data-testid="value">{String(value)}</span>
      <button onClick={() => setValue('updated')}>Update</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}

describe('{{pascalName}}Context', () => {
  it('should provide default value', () => {
    render(
      <{{pascalName}}Provider>
        <TestConsumer />
      </{{pascalName}}Provider>
    )

    expect(screen.getByTestId('value')).toHaveTextContent('null')
  })

  it('should provide initial value', () => {
    render(
      <{{pascalName}}Provider initialValue="initial">
        <TestConsumer />
      </{{pascalName}}Provider>
    )

    expect(screen.getByTestId('value')).toHaveTextContent('initial')
  })

  it('should update value', () => {
    render(
      <{{pascalName}}Provider>
        <TestConsumer />
      </{{pascalName}}Provider>
    )

    fireEvent.click(screen.getByText('Update'))
    expect(screen.getByTestId('value')).toHaveTextContent('updated')
  })

  it('should reset to initial value', () => {
    render(
      <{{pascalName}}Provider initialValue="initial">
        <TestConsumer />
      </{{pascalName}}Provider>
    )

    fireEvent.click(screen.getByText('Update'))
    fireEvent.click(screen.getByText('Reset'))
    expect(screen.getByTestId('value')).toHaveTextContent('initial')
  })

  it('should throw error when used outside provider', () => {
    expect(() => render(<TestConsumer />)).toThrow(
      'use{{pascalName}} must be used within a {{pascalName}}Provider'
    )
  })
})
`,

  adapter: `import type { ChatMessage, ModelConfig, StreamChunk } from '@clarity-chat/types'

/**
 * {{pascalName}}Adapter - {{description}}
 *
 * @example
 * \`\`\`tsx
 * const adapter = create{{pascalName}}Adapter({ apiKey: 'your-key' })
 *
 * for await (const chunk of adapter.stream(messages)) {
 *   console.log(chunk.content)
 * }
 * \`\`\`
 */

export interface {{pascalName}}Config {
  apiKey: string
  baseUrl?: string
  model?: string
  temperature?: number
  maxTokens?: number
}

export interface {{pascalName}}Adapter {
  stream: (
    messages: ChatMessage[],
    config?: Partial<ModelConfig>
  ) => AsyncGenerator<StreamChunk>
}

export function create{{pascalName}}Adapter(
  config: {{pascalName}}Config
): {{pascalName}}Adapter {
  const {
    apiKey,
    baseUrl = 'https://api.example.com/v1',
    model = 'default-model',
    temperature = 0.7,
    maxTokens = 1000,
  } = config

  async function* stream(
    messages: ChatMessage[],
    overrides?: Partial<ModelConfig>
  ): AsyncGenerator<StreamChunk> {
    const response = await fetch(\`\${baseUrl}/chat/completions\`, {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${apiKey}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: overrides?.model || model,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        temperature: overrides?.temperature ?? temperature,
        max_tokens: overrides?.maxTokens ?? maxTokens,
        stream: true,
      }),
    })

    if (!response.ok) {
      throw new Error(\`API error: \${response.status} \${response.statusText}\`)
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) {
      throw new Error('No response body')
    }

    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim()
            if (data === '[DONE]') return

            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices?.[0]?.delta?.content

              if (content) {
                yield {
                  type: 'content' as const,
                  content,
                }
              }
            } catch {
              // Ignore parse errors
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  }

  return { stream }
}
`,

  test: `import { describe, it, expect, vi } from 'vitest'
import { {{pascalName}} } from './{{pascalName}}'

describe('{{pascalName}}', () => {
  it('should work correctly', () => {
    // Add your test implementation here
    expect(true).toBe(true)
  })

  it('should handle edge cases', () => {
    // Add edge case tests here
  })

  it.todo('should handle async operations')
  it.todo('should handle errors gracefully')
})
`,
}

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
    name = await promptText({
      message: `${generator.name} name (PascalCase):`,
      placeholder:
        type === 'hook'
          ? 'ChatState'
          : type === 'context'
            ? 'Theme'
            : 'ChatMessage',
      validate: validateName,
    })
  } else {
    const validation = validateName(name)
    if (validation) {
      log.error(validation)
      process.exit(1)
    }
  }

  // Get description
  let description = options.description
  if (!description && !options.dryRun) {
    description = await promptText({
      message: 'Brief description:',
      placeholder: `A ${type} for...`,
      defaultValue: `A ${generator.name.toLowerCase()}`,
    })
  }

  // Run generator-specific prompts
  let additionalOptions: Partial<GenerateOptions> = {}
  if (generator.prompts && !options.dryRun) {
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

  // Confirm generation
  if (!options.force) {
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
    const importPath =
      type === 'hook'
        ? `import { use${pascalName} } from '${outputPath}/use${pascalName}'`
        : type === 'context'
          ? `import { ${pascalName}Provider, use${pascalName} } from '${outputPath}/${pascalName}Context'`
          : type === 'adapter'
            ? `import { create${pascalName}Adapter } from '${outputPath}/${context.camelName}Adapter'`
            : `import { ${pascalName} } from '${outputPath}/${pascalName}'`

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

    log.error(error instanceof Error ? error.message : String(error))
    console.log()
    console.log(
      errorBox('Failed to generate files. Check the error above.', '✗ Error')
    )
    console.log()
    process.exit(1)
  }
}
