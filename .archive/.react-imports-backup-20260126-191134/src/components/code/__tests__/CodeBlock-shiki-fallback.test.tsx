/**
 * Test CodeBlock fallback behavior when shiki is not available
 */

import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock shiki module to simulate it being unavailable
vi.mock('shiki', () => {
  throw new Error('Cannot find module shiki')
})

describe('CodeBlock - Shiki Fallback', () => {
  beforeEach(() => {
    // Suppress console warnings during tests
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should display warning message when shiki is not installed', async () => {
    // Import CodeBlock after mocking shiki
    const { CodeBlock } = await import('../CodeBlock')

    render(
      <CodeBlock language="typescript">
        {`const greeting = "Hello, World!"`}
      </CodeBlock>
    )

    // Check for warning message
    expect(
      screen.getByText(/CodeBlock requires 'shiki' for syntax highlighting/i)
    ).toBeInTheDocument()
  })

  it('should display installation command in warning', async () => {
    const { CodeBlock } = await import('../CodeBlock')

    render(
      <CodeBlock language="typescript">
        {`const greeting = "Hello, World!"`}
      </CodeBlock>
    )

    // Check for npm install command
    expect(screen.getByText(/npm install shiki/i)).toBeInTheDocument()
  })

  it('should display documentation link in warning', async () => {
    const { CodeBlock } = await import('../CodeBlock')

    render(
      <CodeBlock language="typescript">
        {`const greeting = "Hello, World!"`}
      </CodeBlock>
    )

    // Check for documentation link
    const link = screen.getByRole('link', {
      name: /clarity-chat.dev\/docs\/peer-dependencies/i,
    })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute(
      'href',
      'https://clarity-chat.dev/docs/peer-dependencies'
    )
  })

  it('should still render code in fallback mode', async () => {
    const { CodeBlock } = await import('../CodeBlock')
    const code = `const greeting = "Hello, World!"`

    render(<CodeBlock language="typescript">{code}</CodeBlock>)

    // Code should still be visible (in a code element)
    expect(screen.getByText(code)).toBeInTheDocument()
  })

  it('should display alert role for accessibility', async () => {
    const { CodeBlock } = await import('../CodeBlock')

    render(
      <CodeBlock language="typescript">
        {`const greeting = "Hello, World!"`}
      </CodeBlock>
    )

    // Check for alert role
    const alert = screen.getByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveTextContent(/CodeBlock requires 'shiki'/i)
  })

  it('should still show copy button in fallback mode', async () => {
    const { CodeBlock } = await import('../CodeBlock')

    render(
      <CodeBlock language="typescript" showCopyButton>
        {`const greeting = "Hello, World!"`}
      </CodeBlock>
    )

    // Copy button should still work
    expect(screen.getByLabelText(/copy code/i)).toBeInTheDocument()
  })

  it('should still show line numbers in fallback mode', async () => {
    const { CodeBlock } = await import('../CodeBlock')

    render(
      <CodeBlock language="typescript" showLineNumbers>
        {`const greeting = "Hello, World!"\nlogger.debug(greeting)`}
      </CodeBlock>
    )

    // Line numbers should be visible
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })
})
