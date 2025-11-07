import type { Meta, StoryObj } from '@storybook/react'
import { EnhancedMarkdownRenderer } from '@clarity-chat/react'

/**
 * **EnhancedMarkdownRenderer Component**
 * 
 * Enhanced markdown renderer with LaTeX math support,
 * Mermaid diagrams, syntax highlighting, and more.
 * 
 * **Key Features:**
 * - Standard markdown rendering
 * - LaTeX math support (inline and block)
 * - Mermaid diagram rendering
 * - Syntax highlighting for code blocks
 * - Table support
 * - Link handling
 * - Customizable styling
 * 
 * **Use Cases:**
 * - AI chat responses with markdown
 * - Documentation rendering
 * - Technical content display
 * - Educational content
 */
const meta: Meta<typeof EnhancedMarkdownRenderer> = {
  title: 'Components/EnhancedMarkdownRenderer',
  component: EnhancedMarkdownRenderer,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Enhanced markdown renderer with LaTeX math support,
Mermaid diagrams, syntax highlighting, and more.

## Features

- ✅ Standard markdown rendering
- ✅ LaTeX math support (inline and block)
- ✅ Mermaid diagram rendering
- ✅ Syntax highlighting for code blocks
- ✅ Table support
- ✅ Link handling
- ✅ Customizable styling
- ✅ Dark mode support

## Basic Usage

\`\`\`tsx
<EnhancedMarkdownRenderer
  content={markdownContent}
  enableMath={true}
  enableMermaid={true}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    content: {
      description: 'Markdown content to render',
      control: 'text',
    },
    enableMath: {
      description: 'Enable LaTeX math rendering',
      control: 'boolean',
    },
    enableMermaid: {
      description: 'Enable Mermaid diagram rendering',
      control: 'boolean',
    },
    className: {
      description: 'Additional CSS classes',
      control: 'text',
    },
  },
}

export default meta
type Story = StoryObj<typeof EnhancedMarkdownRenderer>

const basicMarkdown = `# Hello World

This is a **markdown** example with *formatting*.

## Code Block

\`\`\`typescript
function greet(name: string) {
  return \`Hello, \${name}!\`
}
\`\`\`

## Lists

- Item 1
- Item 2
- Item 3

## Table

| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |
| Data 3   | Data 4   |
`

const markdownWithMath = `# Mathematical Formulas

Inline math: $E = mc^2$

Block math:

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

$$
\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}
$$
`

const markdownWithMermaid = `# Flowchart Example

\`\`\`mermaid
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E
\`\`\`

## Sequence Diagram

\`\`\`mermaid
sequenceDiagram
    participant User
    participant API
    participant Database
    
    User->>API: Request Data
    API->>Database: Query
    Database-->>API: Results
    API-->>User: Response
\`\`\`
`

const streamingMarkdown = `# Streaming Content

This content is being streamed character by character...

\`\`\`typescript
// Code is also streaming
const example = 'Hello'
\`\`\`

`

export const Default: Story = {
  args: {
    content: basicMarkdown,
    config: {
      enableSyntaxHighlight: true,
    },
  },
}

export const WithSyntaxHighlighting: Story = {
  args: {
    content: basicMarkdown,
    config: {
      enableSyntaxHighlight: true,
      codeTheme: 'dark',
    },
  },
}

export const WithKaTeX: Story = {
  args: {
    content: markdownWithMath,
    config: {
      enableKaTeX: true,
      enableSyntaxHighlight: true,
    },
  },
}

export const WithMermaid: Story = {
  args: {
    content: markdownWithMermaid,
    config: {
      enableMermaid: true,
      enableSyntaxHighlight: true,
    },
  },
}

export const StreamingContent: Story = {
  args: {
    content: streamingMarkdown,
    isStreaming: true,
    config: {
      enableSyntaxHighlight: true,
    },
  },
}

export const AllFeatures: Story = {
  args: {
    content: `${basicMarkdown}\n\n${markdownWithMath}\n\n${markdownWithMermaid}`,
    config: {
      enableKaTeX: true,
      enableMermaid: true,
      enableSyntaxHighlight: true,
      codeTheme: 'dark',
    },
  },
}
