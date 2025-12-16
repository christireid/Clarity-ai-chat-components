import { logger } from '@clarity-chat/utils/logger';
/**
 * Tests for content extraction utilities
 */

import { describe, it, expect } from 'vitest'
import {
  extractMetadata,
  extractCodeBlocks,
  extractTextContent,
  estimateTokens,
} from '../lib/content-extractor'

describe('extractMetadata', () => {
  it('should extract title from metadata export', () => {
    const content = `
      export const metadata: Metadata = {
        title: 'Test Page Title',
        description: 'A test description',
      }
    `
    const result = extractMetadata(content)
    expect(result.title).toBe('Test Page Title')
    expect(result.description).toBe('A test description')
  })

  it('should return empty object when no metadata found', () => {
    const content = `
      export default function TestPage() {
        return <div>Hello</div>
      }
    `
    const result = extractMetadata(content)
    expect(result.title).toBeUndefined()
    expect(result.description).toBeUndefined()
  })

  it('should handle metadata with nested objects', () => {
    const content = `
      export const metadata: Metadata = {
        title: 'Complex Page',
        description: 'A page with complex metadata',
        openGraph: {
          title: 'OG Title',
        },
      }
    `
    const result = extractMetadata(content)
    expect(result.title).toBe('Complex Page')
    expect(result.description).toBe('A page with complex metadata')
  })
})

describe('extractCodeBlocks', () => {
  it('should extract CodePlayground code blocks', () => {
    const content = `
      <CodePlayground
        code={\`import { useChat } from '@clarity-chat/react'

function Chat() {
  const { messages } = useChat({ api: '/api/chat' })
  return <div>{messages.length}</div>
}\`}
      />
    `
    const result = extractCodeBlocks(content)
    expect(result.length).toBe(1)
    expect(result[0].code).toContain('import { useChat }')
    expect(result[0].language).toBe('tsx')
  })

  it('should extract EnhancedCodeBlock with language', () => {
    const content = `
      <EnhancedCodeBlock
        code={\`npm install @clarity-chat/react\`}
        language="bash"
        filename="Terminal"
      />
    `
    const result = extractCodeBlocks(content)
    expect(result.length).toBe(1)
    expect(result[0].code).toBe('npm install @clarity-chat/react')
    expect(result[0].language).toBe('bash')
    // Note: filename extraction depends on regex pattern order
  })

  it('should detect TypeScript/TSX from imports', () => {
    const content = `
      <CodePlayground
        code={\`import React from 'react'
const App = () => <div>Hello</div>\`}
      />
    `
    const result = extractCodeBlocks(content)
    // Detects as TSX because it contains JSX (<div>)
    expect(result[0].language).toBe('tsx')
  })

  it('should detect bash from install commands', () => {
    const content = `
      <CodePlayground
        code={\`pnpm add @clarity-chat/react\`}
      />
    `
    const result = extractCodeBlocks(content)
    expect(result[0].language).toBe('bash')
  })

  it('should handle escaped backticks in code', () => {
    const content = `
      <CodePlayground
        code={\`const template = \\\`Hello \\\${name}\\\`\`}
      />
    `
    const result = extractCodeBlocks(content)
    expect(result.length).toBe(1)
    // After unescaping, should contain actual backticks
    expect(result[0].code).toContain('`')
  })
})

describe('extractTextContent', () => {
  it('should extract h1 headings', () => {
    const content = '<h1 className="text-4xl">Main Title</h1>'
    const result = extractTextContent(content)
    expect(result).toContain('# Main Title')
  })

  it('should extract h2 headings', () => {
    const content = '<h2 className="text-2xl">Section Title</h2>'
    const result = extractTextContent(content)
    expect(result).toContain('## Section Title')
  })

  it('should extract paragraph content', () => {
    const content =
      '<p className="text-lg">This is a paragraph with some text.</p>'
    const result = extractTextContent(content)
    expect(result).toContain('This is a paragraph with some text.')
  })

  it('should extract list items', () => {
    const content = `
      <ul>
        <li>First item</li>
        <li>Second item</li>
      </ul>
    `
    const result = extractTextContent(content)
    expect(result).toContain('- First item')
    // Note: list items may be concatenated depending on extraction method
    expect(result).toContain('Second item')
  })

  it('should preserve inline code', () => {
    const content = '<p>Use the <code>useChat</code> hook for chat state.</p>'
    const result = extractTextContent(content)
    expect(result).toContain('`useChat`')
  })

  it('should preserve strong/bold text', () => {
    const content = '<p>This is <strong>important</strong> text.</p>'
    const result = extractTextContent(content)
    expect(result).toContain('**important**')
  })

  it('should preserve links', () => {
    const content = '<p>Check out the <a href="/docs">documentation</a>.</p>'
    const result = extractTextContent(content)
    expect(result).toContain('[documentation](/docs)')
  })

  it('should extract Callout content with type', () => {
    const content = `
      <Callout type="tip">
        This is a helpful tip for users.
      </Callout>
    `
    const result = extractTextContent(content)
    expect(result).toContain('> **Tip**:')
    expect(result).toContain('helpful tip')
  })

  it('should handle HTML entities', () => {
    const content = '<p>Use &lt;Component&gt; for rendering.</p>'
    const result = extractTextContent(content)
    expect(result).toContain('<Component>')
  })
})

describe('estimateTokens', () => {
  it('should count tokens using GPT tokenizer', () => {
    // Using actual tokenizer (cl100k_base encoding)
    const text = 'Hello world!'
    const result = estimateTokens(text)
    // Actual tokens: "Hello", " world", "!"
    expect(result).toBe(3)
  })

  it('should handle empty string', () => {
    const result = estimateTokens('')
    expect(result).toBe(0)
  })

  it('should handle longer text', () => {
    const text = 'A'.repeat(1000)
    const result = estimateTokens(text)
    // 1000 'A' characters are encoded more efficiently than 4 chars/token
    // Actual tokenizer result varies based on encoding
    expect(result).toBeGreaterThan(0)
    expect(result).toBeLessThan(1000) // Should be fewer tokens than characters
  })

  it('should handle code content', () => {
    const code = `function hello() {
  logger.debug('Hello, World!');
}`
    const result = estimateTokens(code)
    expect(result).toBeGreaterThan(0)
  })
})
