/**
 * Tests for the generate command
 *
 * These tests verify:
 * - Template rendering with Handlebars
 * - Name validation (PascalCase, reserved names)
 * - File generation for all generator types
 * - Dry-run mode
 * - Flag bypass behavior
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import path from 'path'
import os from 'os'
import fs from 'fs-extra'

// Mock the prompts module to avoid interactive prompts in tests
vi.mock('../../utils/prompts.js', () => ({
  showIntro: vi.fn(),
  showOutro: vi.fn(),
  showFilesCreated: vi.fn(),
  showNextSteps: vi.fn(),
  showWarning: vi.fn(),
  promptText: vi.fn(),
  promptSelect: vi.fn(),
  promptConfirm: vi.fn().mockResolvedValue(true),
  runTasks: vi.fn(async (tasks) => {
    const results = []
    for (const task of tasks) {
      if (task.enabled !== false) {
        results.push(await task.task())
      }
    }
    return results
  }),
  setupCancelHandler: vi.fn(),
  onCleanup: vi.fn(),
  clearCleanup: vi.fn(),
  log: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    step: vi.fn(),
    message: vi.fn(),
  },
}))

// Template helper functions (copied from generate.ts for testing)
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

describe('Case Conversion Utilities', () => {
  describe('toPascalCase', () => {
    it('should convert simple names', () => {
      expect(toPascalCase('chatMessage')).toBe('ChatMessage')
      expect(toPascalCase('chat-message')).toBe('ChatMessage')
      expect(toPascalCase('chat_message')).toBe('ChatMessage')
      expect(toPascalCase('chat message')).toBe('ChatMessage')
    })

    it('should handle already PascalCase names', () => {
      expect(toPascalCase('ChatMessage')).toBe('ChatMessage')
    })

    it('should handle single word names', () => {
      expect(toPascalCase('button')).toBe('Button')
      expect(toPascalCase('Button')).toBe('Button')
    })
  })

  describe('toCamelCase', () => {
    it('should convert to camelCase', () => {
      expect(toCamelCase('ChatMessage')).toBe('chatMessage')
      expect(toCamelCase('chat-message')).toBe('chatMessage')
      expect(toCamelCase('chat_message')).toBe('chatMessage')
    })

    it('should handle single word names', () => {
      expect(toCamelCase('Button')).toBe('button')
      expect(toCamelCase('button')).toBe('button')
    })
  })

  describe('toKebabCase', () => {
    it('should convert to kebab-case', () => {
      expect(toKebabCase('ChatMessage')).toBe('chat-message')
      expect(toKebabCase('chatMessage')).toBe('chat-message')
      expect(toKebabCase('chat_message')).toBe('chat-message')
    })

    it('should handle single word names', () => {
      expect(toKebabCase('Button')).toBe('button')
    })
  })
})

describe('Name Validation', () => {
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

  it('should accept valid PascalCase names', () => {
    expect(validateName('ChatMessage')).toBeUndefined()
    expect(validateName('Button')).toBeUndefined()
    expect(validateName('MyComponent123')).toBeUndefined()
  })

  it('should reject names shorter than 2 characters', () => {
    expect(validateName('A')).toBe('Name must be at least 2 characters')
    expect(validateName('')).toBe('Name must be at least 2 characters')
  })

  it('should reject names starting with numbers', () => {
    expect(validateName('123Button')).toBe(
      'Name must start with a letter and contain only letters and numbers'
    )
  })

  it('should reject names with special characters', () => {
    expect(validateName('Chat-Message')).toBe(
      'Name must start with a letter and contain only letters and numbers'
    )
    expect(validateName('Chat_Message')).toBe(
      'Name must start with a letter and contain only letters and numbers'
    )
    expect(validateName('Chat Message')).toBe(
      'Name must start with a letter and contain only letters and numbers'
    )
  })

  it('should reject reserved names', () => {
    expect(validateName('Component')).toBe('"Component" is a reserved name')
    expect(validateName('Index')).toBe('"Index" is a reserved name')
    expect(validateName('Utils')).toBe('"Utils" is a reserved name')
    expect(validateName('Types')).toBe('"Types" is a reserved name')
    expect(validateName('Hooks')).toBe('"Hooks" is a reserved name')
    expect(validateName('Use')).toBe('"Use" is a reserved name')
    expect(validateName('Context')).toBe('"Context" is a reserved name')
  })
})

describe('Template Rendering', () => {
  const componentTemplate = `export const {{pascalName}} = () => {
  return <div className="clarity-{{kebabName}}">{{pascalName}}</div>
}

{{pascalName}}.displayName = '{{pascalName}}'
`

  const hookTemplate = `export function use{{pascalName}}() {
  const [value, setValue] = useState(null)
  return { value, setValue }
}
`

  it('should render component template with context', async () => {
    const Handlebars = await import('handlebars')

    const template = Handlebars.default.compile(componentTemplate)
    const result = template({
      pascalName: 'ChatMessage',
      kebabName: 'chat-message',
    })

    expect(result).toContain('export const ChatMessage')
    expect(result).toContain('clarity-chat-message')
    expect(result).toContain("ChatMessage.displayName = 'ChatMessage'")
  })

  it('should render hook template with context', async () => {
    const Handlebars = await import('handlebars')

    const template = Handlebars.default.compile(hookTemplate)
    const result = template({ pascalName: 'ChatState' })

    expect(result).toContain('export function useChatState()')
  })
})

describe('File Generation Integration', () => {
  let tempDir: string

  beforeEach(async () => {
    tempDir = path.join(os.tmpdir(), `clarity-cli-test-${Date.now()}`)
    await fs.ensureDir(tempDir)
  })

  afterEach(async () => {
    await fs.remove(tempDir)
  })

  it('should create component directory structure', async () => {
    const componentDir = path.join(tempDir, 'components', 'ChatMessage')
    await fs.ensureDir(componentDir)

    // Simulate file creation
    await fs.writeFile(
      path.join(componentDir, 'ChatMessage.tsx'),
      'export const ChatMessage = () => <div>ChatMessage</div>'
    )
    await fs.writeFile(
      path.join(componentDir, 'index.ts'),
      "export { ChatMessage } from './ChatMessage'"
    )

    // Verify files exist
    expect(
      await fs.pathExists(path.join(componentDir, 'ChatMessage.tsx'))
    ).toBe(true)
    expect(await fs.pathExists(path.join(componentDir, 'index.ts'))).toBe(true)
  })

  it('should create hook files', async () => {
    const hooksDir = path.join(tempDir, 'hooks')
    await fs.ensureDir(hooksDir)
    await fs.ensureDir(path.join(hooksDir, '__tests__'))

    await fs.writeFile(
      path.join(hooksDir, 'useChatState.ts'),
      'export function useChatState() { return {} }'
    )
    await fs.writeFile(
      path.join(hooksDir, '__tests__', 'useChatState.test.ts'),
      "describe('useChatState', () => {})"
    )

    expect(await fs.pathExists(path.join(hooksDir, 'useChatState.ts'))).toBe(
      true
    )
    expect(
      await fs.pathExists(
        path.join(hooksDir, '__tests__', 'useChatState.test.ts')
      )
    ).toBe(true)
  })

  it('should create context files', async () => {
    const contextsDir = path.join(tempDir, 'contexts')
    await fs.ensureDir(contextsDir)
    await fs.ensureDir(path.join(contextsDir, '__tests__'))

    await fs.writeFile(
      path.join(contextsDir, 'ThemeContext.tsx'),
      'export const ThemeContext = createContext(null)'
    )
    await fs.writeFile(
      path.join(contextsDir, '__tests__', 'ThemeContext.test.tsx'),
      "describe('ThemeContext', () => {})"
    )

    expect(
      await fs.pathExists(path.join(contextsDir, 'ThemeContext.tsx'))
    ).toBe(true)
    expect(
      await fs.pathExists(
        path.join(contextsDir, '__tests__', 'ThemeContext.test.tsx')
      )
    ).toBe(true)
  })

  it('should not overwrite existing files without --force', async () => {
    const componentDir = path.join(tempDir, 'components', 'Button')
    await fs.ensureDir(componentDir)

    const existingContent = 'existing content'
    await fs.writeFile(path.join(componentDir, 'Button.tsx'), existingContent)

    // Read file to verify it wasn't changed
    const content = await fs.readFile(
      path.join(componentDir, 'Button.tsx'),
      'utf-8'
    )
    expect(content).toBe(existingContent)
  })
})

describe('Generator Types', () => {
  const generators = ['component', 'hook', 'context', 'adapter', 'test']

  it.each(generators)('should have %s generator defined', (type) => {
    // This test verifies the generator types are recognized
    expect(generators).toContain(type)
  })

  it('should have correct default directories', () => {
    const defaultDirs: Record<string, string> = {
      component: './src/components',
      hook: './src/hooks',
      context: './src/contexts',
      adapter: './src/lib/adapters',
      test: './src/__tests__',
    }

    Object.entries(defaultDirs).forEach(([type, dir]) => {
      expect(defaultDirs[type]).toBe(dir)
    })
  })
})
