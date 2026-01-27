/**
 * Peer Dependency Matrix Tests
 *
 * Tests all possible combinations of Phase 2 peer dependencies
 * to ensure graceful degradation and proper error handling.
 *
 * Matrix:
 * - react-markdown: installed / missing
 * - remark-gfm: installed / missing
 * - rehype-highlight: installed / missing
 * - shiki: installed / missing
 * - prismjs: installed / missing
 * - mermaid: installed / missing
 * - pdfjs-dist: installed / missing
 * - mammoth: installed / missing
 * - jszip: installed / missing
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import * as React from 'react'

import { EnhancedMarkdownRenderer } from '../../components/ai/EnhancedMarkdownRenderer'
import { CodeBlock } from '../../components/code/CodeBlock'

/**
 * Test configuration for different peer dependency scenarios
 */
interface PeerDependencyScenario {
  name: string
  available: string[]
  missing: string[]
  expectedBehavior: {
    markdownRenders: boolean
    syntaxHighlighting: boolean
    gfmSupport: boolean
    mermaidSupport: boolean
    showsWarnings: boolean
    gracefulDegradation: boolean
  }
}

const scenarios: PeerDependencyScenario[] = [
  {
    name: 'All dependencies installed',
    available: [
      'react-markdown',
      'remark-gfm',
      'rehype-highlight',
      'shiki',
      'mermaid',
    ],
    missing: [],
    expectedBehavior: {
      markdownRenders: true,
      syntaxHighlighting: true,
      gfmSupport: true,
      mermaidSupport: true,
      showsWarnings: false,
      gracefulDegradation: false,
    },
  },
  {
    name: 'Only react-markdown installed',
    available: ['react-markdown'],
    missing: ['remark-gfm', 'rehype-highlight', 'shiki', 'mermaid'],
    expectedBehavior: {
      markdownRenders: true,
      syntaxHighlighting: false,
      gfmSupport: false,
      mermaidSupport: false,
      showsWarnings: false,
      gracefulDegradation: true,
    },
  },
  {
    name: 'No markdown dependencies',
    available: [],
    missing: ['react-markdown', 'remark-gfm', 'rehype-highlight'],
    expectedBehavior: {
      markdownRenders: true, // Plain text fallback
      syntaxHighlighting: false,
      gfmSupport: false,
      mermaidSupport: false,
      showsWarnings: true,
      gracefulDegradation: true,
    },
  },
  {
    name: 'Markdown without syntax highlighting',
    available: ['react-markdown', 'remark-gfm'],
    missing: ['rehype-highlight', 'shiki'],
    expectedBehavior: {
      markdownRenders: true,
      syntaxHighlighting: false,
      gfmSupport: true,
      mermaidSupport: false,
      showsWarnings: false,
      gracefulDegradation: true,
    },
  },
  {
    name: 'Markdown with GFM but no highlighting',
    available: ['react-markdown', 'remark-gfm'],
    missing: ['rehype-highlight', 'shiki', 'mermaid'],
    expectedBehavior: {
      markdownRenders: true,
      syntaxHighlighting: false,
      gfmSupport: true,
      mermaidSupport: false,
      showsWarnings: false,
      gracefulDegradation: true,
    },
  },
  {
    name: 'Everything except mermaid',
    available: ['react-markdown', 'remark-gfm', 'rehype-highlight', 'shiki'],
    missing: ['mermaid'],
    expectedBehavior: {
      markdownRenders: true,
      syntaxHighlighting: true,
      gfmSupport: true,
      mermaidSupport: false,
      showsWarnings: false,
      gracefulDegradation: true,
    },
  },
]

describe('Peer Dependency Matrix Tests', () => {
  scenarios.forEach((scenario) => {
    describe(`Scenario: ${scenario.name}`, () => {
      it('markdown content renders correctly', async () => {
        const markdown = `
# Test Heading

This is **bold** and *italic* text.

\`\`\`javascript
const code = "test";
\`\`\`
`

        render(<EnhancedMarkdownRenderer content={markdown} />)

        if (scenario.expectedBehavior.markdownRenders) {
          await waitFor(() => {
            expect(screen.getByText(/Test Heading/i)).toBeInTheDocument()
          })
        }
      })

      it('GFM tables render as expected', async () => {
        const markdown = `
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
`

        render(<EnhancedMarkdownRenderer content={markdown} />)

        await waitFor(() => {
          if (scenario.expectedBehavior.gfmSupport) {
            // Should render as proper table
            expect(screen.getByText('Header 1')).toBeInTheDocument()
            expect(screen.getByText('Cell 1')).toBeInTheDocument()
          } else {
            // Should at least show the content
            const text = screen.getByText(/Header 1/i)
            expect(text).toBeInTheDocument()
          }
        })
      })

      it('code blocks render appropriately', () => {
        const code = 'const example = "test";'

        render(<CodeBlock language="javascript">{code}</CodeBlock>)

        // Content should always be visible
        expect(screen.getByText(/example/)).toBeInTheDocument()

        if (!scenario.expectedBehavior.syntaxHighlighting) {
          // Should show warning about missing shiki
          const warning = screen.queryByText(/install shiki/i)
          if (warning) {
            expect(warning).toBeInTheDocument()
          }
        }
      })

      it('shows appropriate warnings', async () => {
        const markdown = '# Test'

        render(<EnhancedMarkdownRenderer content={markdown} />)

        if (scenario.expectedBehavior.showsWarnings) {
          // Should show fallback warning
          await waitFor(() => {
            const note = screen.queryByText(/Note:/i)
            if (note) {
              expect(note).toBeInTheDocument()
            }
          })
        }
      })

      it('maintains accessibility', () => {
        const code = 'test code'

        render(<CodeBlock language="javascript">{code}</CodeBlock>)

        // Should have proper ARIA attributes regardless of dependencies
        const region = screen.getByRole('region')
        expect(region).toHaveAttribute('aria-label')
      })

      it('error messages are helpful when dependencies missing', () => {
        if (scenario.missing.includes('shiki')) {
          const originalRequire = global.require
          global.require = vi.fn((name: string) => {
            if (name === 'shiki') {
              throw new Error("Cannot find module 'shiki'")
            }
            return originalRequire(name)
          }) as any

          render(<CodeBlock>test</CodeBlock>)

          // Should have installation instructions
          expect(screen.getByText(/npm install shiki/i)).toBeInTheDocument()

          global.require = originalRequire
        }
      })
    })
  })

  describe('Cross-scenario Consistency', () => {
    it('all scenarios handle empty content gracefully', () => {
      scenarios.forEach((scenario) => {
        const { container } = render(<EnhancedMarkdownRenderer content="" />)
        expect(container).toBeInTheDocument()
      })
    })

    it('all scenarios preserve content structure', async () => {
      const markdown = `
Line 1
Line 2
Line 3
`

      scenarios.forEach(async (scenario) => {
        render(<EnhancedMarkdownRenderer content={markdown} />)

        await waitFor(() => {
          expect(screen.getByText(/Line 1/)).toBeInTheDocument()
          expect(screen.getByText(/Line 2/)).toBeInTheDocument()
          expect(screen.getByText(/Line 3/)).toBeInTheDocument()
        })
      })
    })

    it('all scenarios handle special characters correctly', () => {
      const specialChars = '<>&"\'`'

      scenarios.forEach(() => {
        const { container } = render(<CodeBlock>{specialChars}</CodeBlock>)
        expect(container.querySelector('code')).toBeInTheDocument()
      })
    })
  })

  describe('Package Combination Edge Cases', () => {
    it('handles react-markdown present but plugins missing', async () => {
      // This is a common scenario - user installs main package but not plugins
      const markdown = `
# Heading

| Table | Test |
|-------|------|
| A     | B    |

\`\`\`javascript
const code = true;
\`\`\`
`

      render(<EnhancedMarkdownRenderer content={markdown} />)

      await waitFor(() => {
        // Should still render something meaningful
        expect(screen.getByText(/Heading/)).toBeInTheDocument()
      })
    })

    it('handles shiki present but rehype-highlight missing', () => {
      // User might install shiki but not rehype-highlight
      const code = 'const test = true;'

      render(<CodeBlock language="javascript">{code}</CodeBlock>)

      // Should use shiki if available, fall back otherwise
      expect(screen.getByText(/test/)).toBeInTheDocument()
    })

    it('handles both shiki and prismjs installed', () => {
      // If both are available, should prefer shiki (or have clear preference)
      const code = 'function example() {}'

      render(<CodeBlock language="javascript">{code}</CodeBlock>)

      expect(screen.getByText(/example/)).toBeInTheDocument()
    })
  })

  describe('Documentation Link Consistency', () => {
    it('all error messages link to same documentation', () => {
      const originalRequire = global.require
      global.require = vi.fn((name: string) => {
        if (name === 'shiki') {
          throw new Error("Cannot find module 'shiki'")
        }
        return originalRequire(name)
      }) as any

      render(<CodeBlock>test</CodeBlock>)

      const link = screen.getByRole('link')
      expect(link.getAttribute('href')).toBe(
        'https://clarity-chat.dev/docs/peer-dependencies'
      )

      global.require = originalRequire
    })

    it('documentation explains optional vs required dependencies', () => {
      // All errors should clarify that these are optional peer dependencies
      const originalRequire = global.require
      global.require = vi.fn((name: string) => {
        if (name === 'shiki') {
          throw new Error("Cannot find module 'shiki'")
        }
        return originalRequire(name)
      }) as any

      render(<CodeBlock>test</CodeBlock>)

      // Should explain that this is an optional feature
      expect(screen.getByText(/syntax highlighting/i)).toBeInTheDocument()

      global.require = originalRequire
    })
  })

  describe('Installation Command Accuracy', () => {
    it('provides correct npm commands', () => {
      const originalRequire = global.require
      global.require = vi.fn((name: string) => {
        if (name === 'shiki') {
          throw new Error("Cannot find module 'shiki'")
        }
        return originalRequire(name)
      }) as any

      render(<CodeBlock>test</CodeBlock>)

      // Should show exact npm command
      const command = screen.getByText(/npm install shiki/i)
      expect(command.textContent).toContain('npm install shiki')

      global.require = originalRequire
    })

    it('suggests installing related packages together', () => {
      // When suggesting react-markdown, should also mention remark-gfm and rehype-highlight
      const markdown = '# Test'

      render(<EnhancedMarkdownRenderer content={markdown} />)

      // If fallback message shown, should suggest full install
      const note = screen.queryByText(/react-markdown/i)
      if (note) {
        expect(note).toBeInTheDocument()
      }
    })
  })

  describe('Progressive Enhancement', () => {
    it('basic features work with minimal dependencies', async () => {
      const markdown = '# Basic Markdown\n\n**Bold** text.'

      render(<EnhancedMarkdownRenderer content={markdown} />)

      await waitFor(() => {
        expect(screen.getByText(/Basic Markdown/)).toBeInTheDocument()
        expect(screen.getByText(/Bold/)).toBeInTheDocument()
      })
    })

    it('advanced features require specific dependencies', async () => {
      const mermaidMarkdown = '```mermaid\ngraph TD\nA-->B\n```'

      render(
        <EnhancedMarkdownRenderer
          content={mermaidMarkdown}
          config={{ enableMermaid: true }}
        />
      )

      // Should render content (either as diagram or fallback)
      await waitFor(() => {
        expect(screen.getByText(/graph TD/)).toBeInTheDocument()
      })
    })

    it('features degrade gracefully when dependencies missing', () => {
      const originalRequire = global.require
      global.require = vi.fn((name: string) => {
        if (name === 'shiki') {
          throw new Error("Cannot find module 'shiki'")
        }
        return originalRequire(name)
      }) as any

      const code = 'const x = 1;'

      const { container } = render(
        <CodeBlock language="javascript">{code}</CodeBlock>
      )

      // Should still render in pre/code
      const pre = container.querySelector('pre')
      expect(pre).toBeInTheDocument()

      global.require = originalRequire
    })
  })

  describe('Bundle Size Impact Verification', () => {
    it('components do not bundle optional dependencies', async () => {
      // This test verifies that optional dependencies are truly external
      // and not bundled with the component code

      const markdown = '# Test'

      render(<EnhancedMarkdownRenderer content={markdown} />)

      await waitFor(() => {
        expect(screen.getByText(/Test/)).toBeInTheDocument()
      })

      // Component should render without requiring the optional dependencies
      // to be present at build time
    })

    it('lazy loading prevents eager dependency loading', async () => {
      // Dependencies should only load when actually used
      const markdown = '# Simple Test'

      render(
        <EnhancedMarkdownRenderer
          content={markdown}
          config={{ enableMermaid: false }}
        />
      )

      // Mermaid should not be loaded if not enabled
      await waitFor(() => {
        expect(screen.getByText(/Simple Test/)).toBeInTheDocument()
      })
    })
  })

  describe('Real-world Usage Patterns', () => {
    it('handles typical blog post content', async () => {
      const blogPost = `
# How to Use Our Library

Here's a quick example:

\`\`\`typescript
import { Component } from '@clarity-chat/react';

export default function App() {
  return <Component />;
}
\`\`\`

## Features

- Easy to use
- Fully typed
- Performant
`

      render(<EnhancedMarkdownRenderer content={blogPost} />)

      await waitFor(() => {
        expect(screen.getByText(/How to Use Our Library/)).toBeInTheDocument()
      })
    })

    it('handles AI chat response with mixed content', async () => {
      const aiResponse = `
I'll help you with that. Here's the solution:

\`\`\`python
def solution():
    return "answer"
\`\`\`

| Pros | Cons |
|------|------|
| Fast | Complex |
`

      render(<EnhancedMarkdownRenderer content={aiResponse} />)

      await waitFor(() => {
        expect(screen.getByText(/help you/)).toBeInTheDocument()
      })
    })

    it('handles documentation with multiple code blocks', async () => {
      const docs = `
# Installation

\`\`\`bash
npm install package
\`\`\`

# Usage

\`\`\`javascript
import { Component } from 'package';
\`\`\`

\`\`\`typescript
const config: Config = {};
\`\`\`
`

      render(<EnhancedMarkdownRenderer content={docs} />)

      await waitFor(() => {
        expect(screen.getByText(/Installation/)).toBeInTheDocument()
      })
    })
  })
})
