import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { MarkdownRendererEnhanced } from '@clarity-chat/react'

const meta: Meta<typeof MarkdownRendererEnhanced> = {
  title: 'Components/DataDisplay/MarkdownRendererEnhanced',
  component: MarkdownRendererEnhanced,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Extended markdown renderer with KaTeX, syntax highlighting, Mermaid diagrams, copy-to-clipboard, and rich error handling. Use when you need LaTeX, code previews, or richer markdown features than the base renderer.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof MarkdownRendererEnhanced>

const advancedMarkdown = `# Advanced Markdown Showcase

Clarity supports **GitHub-flavoured markdown**, tables, task lists, callouts, and embedded diagrams.

> _MarkdownRendererEnhanced_ unlocks KaTeX, Mermaid, and syntax-highlighted code blocks.

## ✅ Features

- KaTeX math support
- Syntax highlighting (powered by \`highlight.js\`)
- Mermaid diagrams
- GitHub-flavoured markdown (GFM)
- Copy-to-clipboard buttons

## 🧮 Math

Inline: $\\nabla \\cdot \\vec{E} = \\frac{\\rho}{\\varepsilon_0}$

Display:

$$
e^{i\\pi} + 1 = 0
$$

## 📊 Mermaid Diagram

\`\`\`mermaid
graph TD
  User -->|writes| Markdown
  Markdown -->|rendered by| Renderer[MarkdownRendererEnhanced]
  Renderer -->|uses| KaTeX
  Renderer -->|uses| HighlightJS
  Renderer -->|uses| Mermaid
\`\`\`

## 💻 Code Blocks

\`\`\`typescript
import { MarkdownRendererEnhanced } from '@clarity-chat/react'

export function MarkdownPreview({ content }: { content: string }) {
  return (
    <MarkdownRendererEnhanced
      content={content}
      enableMath
      enableHighlight
      enableGFM
      showLineNumbers
      enableCodeCopy
    />
  )
}
\`\`\`
`

const latexWithError = `# Error Handling Demo

The following expression has an intentional syntax issue:

$$
\\frac{\\sqrt{2}}{3  // missing closing brace
$$

When \`onMathError\` is provided, the renderer shows an accessible fallback block and reports the error upstream.
`

export const AllFeatures: Story = {
  args: {
    content: advancedMarkdown,
    enableMath: true,
    enableHighlight: true,
    enableGFM: true,
    allowHtml: false,
    showLineNumbers: true,
    enableCodeCopy: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Full experience with KaTeX, Mermaid, syntax highlighting, copy buttons, and line numbers. Ideal for technical documentation or AI explanations.',
      },
    },
  },
}

export const WithCustomComponents: Story = {
  render: (args) => (
    <MarkdownRendererEnhanced
      {...args}
      components={{
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-primary bg-primary/5 px-4 py-3 italic text-primary">
            {children}
          </blockquote>
        ),
        code: ({ inline, className, children, ...rest }: any) =>
          inline ? (
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs" {...rest}>
              {children}
            </code>
          ) : (
            <code className={className} {...rest}>
              {children}
            </code>
          ),
      }}
    />
  ),
  args: {
    content: advancedMarkdown,
    enableMath: true,
    enableHighlight: true,
    enableGFM: true,
    showLineNumbers: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Swap in your own component overrides (e.g., stylised block quotes, custom code blocks). Helpful when theming markdown content to match your brand.',
      },
    },
  },
}

export const WithMathErrorHandling: Story = {
  render: () => {
    const [errorLog, setErrorLog] = React.useState<string | null>(null)
    return (
      <div className="space-y-4">
        <MarkdownRendererEnhanced
          content={latexWithError}
          enableMath
          enableHighlight={false}
          enableGFM
          onMathError={(error, latex) => {
            setErrorLog(`Error: ${error.message} | LaTeX snippet: ${latex}`)
          }}
        />

        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
          <div className="font-semibold mb-1">Error log</div>
          <div>{errorLog ?? 'No math errors reported yet.'}</div>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates graceful degradation when LaTeX rendering fails. Use the `onMathError` callback to log issues or alert downstream monitoring systems.',
      },
    },
  },
}
