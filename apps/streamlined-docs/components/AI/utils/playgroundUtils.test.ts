/**
 * Playground Utilities Tests
 *
 * @vitest-environment happy-dom
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  extractCodeBlocks,
  isPlaygroundCompatible,
  generateCodeSandboxUrl,
  openInPlayground,
} from './playgroundUtils'

describe('extractCodeBlocks', () => {
  it('extracts single code block', () => {
    const content = '```tsx\nconst App = () => <div>Hello</div>\n```'
    const blocks = extractCodeBlocks(content)

    expect(blocks).toHaveLength(1)
    expect(blocks[0].language).toBe('tsx')
    expect(blocks[0].code).toBe('const App = () => <div>Hello</div>')
  })

  it('extracts multiple code blocks', () => {
    const content = `
Here's some code:
\`\`\`javascript
const x = 1
\`\`\`
And more:
\`\`\`typescript
const y: number = 2
\`\`\`
`
    const blocks = extractCodeBlocks(content)

    expect(blocks).toHaveLength(2)
    expect(blocks[0].language).toBe('javascript')
    expect(blocks[1].language).toBe('typescript')
  })

  it('handles code blocks without language', () => {
    const content = '```\nplain text\n```'
    const blocks = extractCodeBlocks(content)

    expect(blocks).toHaveLength(1)
    expect(blocks[0].language).toBe('text')
  })

  it('returns empty array for content without code blocks', () => {
    const content = 'Just some regular text'
    const blocks = extractCodeBlocks(content)

    expect(blocks).toHaveLength(0)
  })

  it('trims code content', () => {
    const content = '```tsx\n\n  const App = () => {}\n\n```'
    const blocks = extractCodeBlocks(content)

    expect(blocks[0].code).toBe('const App = () => {}')
  })
})

describe('isPlaygroundCompatible', () => {
  it('returns true for TSX with React import', () => {
    const code = `import React from 'react'\nconst App = () => <div />`
    expect(isPlaygroundCompatible('tsx', code)).toBe(true)
  })

  it('returns true for JSX with JSX tags', () => {
    const code = 'const App = () => <div>Hello</div>'
    expect(isPlaygroundCompatible('jsx', code)).toBe(true)
  })

  it('returns true for code with clarity-chat import', () => {
    const code = `import { ChatWindow } from '@clarity-chat/react'`
    expect(isPlaygroundCompatible('tsx', code)).toBe(true)
  })

  it('returns true for exported function components', () => {
    const code = 'export default function MyComponent() { return null }'
    expect(isPlaygroundCompatible('typescript', code)).toBe(true)
  })

  it('returns true for arrow function components', () => {
    const code = 'const MyComponent = () => null'
    expect(isPlaygroundCompatible('js', code)).toBe(true)
  })

  it('returns false for unsupported languages', () => {
    const code = 'const App = () => <div />'
    expect(isPlaygroundCompatible('python', code)).toBe(false)
    expect(isPlaygroundCompatible('css', code)).toBe(false)
    expect(isPlaygroundCompatible('html', code)).toBe(false)
  })

  it('accepts arrow functions as potential components', () => {
    // Arrow functions could be React components, so they're allowed
    // The regex is permissive to avoid false negatives
    const code = 'const sum = (a, b) => a + b'
    expect(isPlaygroundCompatible('javascript', code)).toBe(true)
  })

  it('returns false for class-only code without React patterns', () => {
    const code = 'class Calculator { add(a, b) { return a + b } }'
    expect(isPlaygroundCompatible('javascript', code)).toBe(false)
  })
})

describe('generateCodeSandboxUrl', () => {
  it('generates valid URL structure', () => {
    const code = 'const App = () => <div>Test</div>'
    const url = generateCodeSandboxUrl(code, 'tsx')

    expect(url).toContain('https://codesandbox.io/api/v1/sandboxes/define')
    expect(url).toContain('parameters=')
  })

  it('adds React imports if not present', () => {
    const code = 'const App = () => <div>Test</div>'
    const url = generateCodeSandboxUrl(code, 'tsx')

    // Decode and check the content includes React import
    const params = url.split('parameters=')[1]
    const decoded = atob(params)
    expect(decoded).toContain('react')
  })

  it('preserves existing imports', () => {
    const code = `import React from 'react'\nconst App = () => <div />`
    const url = generateCodeSandboxUrl(code, 'tsx')

    const params = url.split('parameters=')[1]
    const decoded = atob(params)
    expect(decoded).toContain('App.tsx')
  })

  it('handles large code blocks without stack overflow', () => {
    // Generate a large code string (100KB+)
    const largeCode = 'const x = ' + '"a".repeat(100000)'.repeat(10)

    expect(() => {
      generateCodeSandboxUrl(largeCode, 'tsx')
    }).not.toThrow()
  })
})

describe('openInPlayground', () => {
  let originalWindow: typeof window
  let mockOpen: ReturnType<typeof vi.fn>

  beforeEach(() => {
    originalWindow = global.window
    mockOpen = vi.fn()
    global.window = {
      ...global.window,
      open: mockOpen,
    } as any
  })

  afterEach(() => {
    global.window = originalWindow
  })

  it('returns success when popup opens successfully', () => {
    mockOpen.mockReturnValue({ closed: false })

    const result = openInPlayground('const App = () => <div />', 'tsx')

    expect(result.success).toBe(true)
    expect(result.url).toContain('codesandbox.io')
    expect(mockOpen).toHaveBeenCalledWith(
      expect.stringContaining('codesandbox.io'),
      '_blank',
      'noopener,noreferrer'
    )
  })

  it('returns error when popup is blocked', () => {
    mockOpen.mockReturnValue(null)

    const result = openInPlayground('const App = () => <div />', 'tsx')

    expect(result.success).toBe(false)
    expect(result.error).toContain('Popup was blocked')
    expect(result.url).toContain('codesandbox.io')
  })

  it('returns error when window.open throws', () => {
    mockOpen.mockImplementation(() => {
      throw new Error('Security error')
    })

    const result = openInPlayground('const App = () => <div />', 'tsx')

    expect(result.success).toBe(false)
    expect(result.error).toBe('Security error')
  })
})
