import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import {
  MessageRenderer,
  type MessagePlugin,
  type ComponentOverrides,
  codeBlockPlugin,
  inlineCodePlugin,
  citationPlugin,
  linkPlugin,
  imagePlugin,
  tablePlugin,
  toolResultPlugin,
  filePlugin,
  boldPlugin,
  italicPlugin,
  strikethroughPlugin,
  headingPlugin,
  listPlugin,
  blockquotePlugin,
  hrPlugin,
  defaultPlugins,
  createPlugin,
  createReplacementPlugin,
  extendPlugins,
} from '../components/ai/MessageRenderer'

const meta: Meta<typeof MessageRenderer> = {
  title: 'Components/AI/MessageRenderer',
  component: MessageRenderer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Plugin-Based Message Rendering - An extensible message renderer that parses content and applies
plugins to render rich content like code blocks, citations, tool results, links, images, tables, and more.

## Features
- **Plugin Architecture**: Extensible rendering with priority-based plugin system
- **Built-in Plugins**: Code blocks, inline code, citations, links, images, tables, tool results, formatting
- **Component Overrides**: Customize rendering of specific content types
- **Streaming Support**: Handles streaming content with loading states
- **Markdown Extensions**: Custom extensions for special content types
- **Performance**: Optimized matching and rendering with overlap detection

## Built-in Plugins
- **codeBlockPlugin**: Render code blocks with syntax highlighting
- **inlineCodePlugin**: Render inline code snippets
- **citationPlugin**: Render citations with index references
- **linkPlugin**: Render markdown links and raw URLs
- **imagePlugin**: Render markdown images
- **tablePlugin**: Render markdown tables
- **toolResultPlugin**: Render tool execution results
- **filePlugin**: Render file cards and downloads
- **boldPlugin**: Render bold text (**text** or __text__)
- **italicPlugin**: Render italic text (*text* or _text_)
- **strikethroughPlugin**: Render strikethrough (~~text~~)
- **headingPlugin**: Render markdown headings (#, ##, etc.)
- **listPlugin**: Render unordered and ordered lists
- **blockquotePlugin**: Render blockquotes (> text)
- **hrPlugin**: Render horizontal rules (---, ***, etc.)

## Custom Plugins
Create custom plugins for specialized content rendering with regex matching or custom matching functions.

## Component Overrides
Override the rendering of specific components like CodeBlock, Citation, Link, etc. for full customization.
        `,
      },
    },
  },
  argTypes: {
    content: {
      control: 'text',
      description: 'Content to render with plugin processing',
    },
    isStreaming: {
      control: 'boolean',
      description: 'Whether content is still streaming',
    },
    animate: {
      control: 'boolean',
      description: 'Enable animation on render',
    },
    includeDefaultPlugins: {
      control: 'boolean',
      description: 'Include default plugins in rendering',
    },
  },
}

export default meta
type Story = StoryObj<typeof MessageRenderer>

// ============================================================================
// Basic Content Stories
// ============================================================================

export const PlainText: Story = {
  args: {
    content: 'This is plain text with no special formatting.',
    includeDefaultPlugins: true,
  },
}

export const InlineCode: Story = {
  args: {
    content: 'Use the `map()` function to transform arrays. The `filter()` function removes elements.',
    includeDefaultPlugins: true,
  },
}

export const CodeBlock: Story = {
  args: {
    content: `\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(10);
console.log(result);
\`\`\``,
    includeDefaultPlugins: true,
  },
}

export const MultipleCodeBlocks: Story = {
  args: {
    content: `Here's a Python example:

\`\`\`python
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))
\`\`\`

And a TypeScript example:

\`\`\`typescript
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));
\`\`\``,
    includeDefaultPlugins: true,
  },
}

// ============================================================================
// Formatting Stories
// ============================================================================

export const BoldText: Story = {
  args: {
    content: 'This is **bold text** and this is __also bold__.',
    includeDefaultPlugins: true,
  },
}

export const ItalicText: Story = {
  args: {
    content: 'This is *italic text* and this is _also italic_.',
    includeDefaultPlugins: true,
  },
}

export const StrikethroughText: Story = {
  args: {
    content: 'This is ~~strikethrough~~ text and this is **bold** and *italic*.',
    includeDefaultPlugins: true,
  },
}

export const MixedFormatting: Story = {
  args: {
    content: 'This text has **bold**, *italic*, and ~~strikethrough~~ formatting. It also has `inline code`.',
    includeDefaultPlugins: true,
  },
}

// ============================================================================
// Heading and Structure Stories
// ============================================================================

export const Headings: Story = {
  args: {
    content: `# Main Heading
This is the content under the main heading.

## Sub Heading
More content here.

### Sub-Sub Heading
Even more detailed information.`,
    includeDefaultPlugins: true,
  },
}

export const Lists: Story = {
  args: {
    content: `Here are the steps:
- First item
- Second item
- Third item with **bold** text

Numbered list:
1. First step
2. Second step
3. Final step`,
    includeDefaultPlugins: true,
  },
}

export const Blockquote: Story = {
  args: {
    content: `This is a regular paragraph.

> This is a blockquote with important information
> It can span multiple lines

Back to regular text.`,
    includeDefaultPlugins: true,
  },
}

export const HorizontalRule: Story = {
  args: {
    content: `First section
---
Second section
***
Third section`,
    includeDefaultPlugins: true,
  },
}

// ============================================================================
// Link and Image Stories
// ============================================================================

export const Links: Story = {
  args: {
    content: `Check out [React documentation](https://react.dev) for more info.

Visit https://example.com for more details.

Multiple links: [GitHub](https://github.com) and [Google](https://google.com)`,
    includeDefaultPlugins: true,
  },
}

export const Images: Story = {
  args: {
    content: `Here's an image:

![Alt text](https://via.placeholder.com/200)

And another one:

![Logo](https://via.placeholder.com/100x100)`,
    includeDefaultPlugins: true,
  },
}

// ============================================================================
// Table Stories
// ============================================================================

export const SimpleTable: Story = {
  args: {
    content: `Here's a comparison table:

| Language | Type | Use Case |
|----------|------|----------|
| JavaScript | Dynamic | Web Development |
| Python | Interpreted | Data Science |
| TypeScript | Compiled | Type-Safe JS |`,
    includeDefaultPlugins: true,
  },
}

export const MultiRowTable: Story = {
  args: {
    content: `Product comparison:

| Product | Price | Stock | Rating |
|---------|-------|-------|--------|
| Item A | $10 | Yes | ⭐⭐⭐⭐⭐ |
| Item B | $20 | No | ⭐⭐⭐⭐ |
| Item C | $15 | Yes | ⭐⭐⭐ |`,
    includeDefaultPlugins: true,
  },
}

// ============================================================================
// Citation Stories
// ============================================================================

export const Citations: Story = {
  args: {
    content: 'React is a JavaScript library [1] created by Facebook [2] for building user interfaces [3].',
    includeDefaultPlugins: true,
    metadata: {
      citations: [
        { source: 'React Official Docs', url: 'https://react.dev' },
        { source: 'Meta Open Source', url: 'https://opensource.fb.com' },
        { source: 'React Learning Path', url: 'https://react.dev/learn' },
      ],
    },
  },
}

export const CitationsWithContext: Story = {
  args: {
    content: `Machine Learning is transforming industries [1]. Deep learning [2] is a subset that uses neural networks [3]. Applications range from computer vision [4] to natural language processing [5].`,
    includeDefaultPlugins: true,
    metadata: {
      citations: [
        { source: 'MIT Technology Review', url: 'https://www.technologyreview.com' },
        { source: 'Deep Learning Book', url: 'https://www.deeplearningbook.org' },
        { source: 'Neural Networks Paper', url: 'https://arxiv.org' },
        { source: 'Computer Vision Course', url: 'https://cs231n.stanford.edu' },
        { source: 'NLP Guide', url: 'https://nlp.stanford.edu' },
      ],
    },
  },
}

// ============================================================================
// Tool Result Stories
// ============================================================================

export const ToolResult: Story = {
  args: {
    content: `I executed a search tool:

<tool_result name="search_web" status="success">{"results": [{"title": "Example", "url": "https://example.com", "snippet": "This is an example result"}]}</tool_result>

The search completed successfully.`,
    includeDefaultPlugins: true,
  },
}

export const MultipleToolResults: Story = {
  args: {
    content: `First I called search:

<tool_result name="search" status="success">{"query": "React hooks", "results": 5}</tool_result>

Then I called analyze:

<tool_result name="analyze_content" status="success">{"summary": "React hooks allow functional components to use state", "keywords": ["hooks", "state", "functional"]}</tool_result>

Finally, I called store:

<tool_result name="store_result" status="success">{"stored": true, "id": "abc123"}</tool_result>`,
    includeDefaultPlugins: true,
  },
}

// ============================================================================
// File Stories
// ============================================================================

export const FileCard: Story = {
  args: {
    content: `I've prepared a document for you:

<file name="report.pdf" type="PDF" size="1048576" url="https://example.com/report.pdf" />

And a spreadsheet:

<file name="data.xlsx" type="Excel" size="524288" url="https://example.com/data.xlsx" />`,
    includeDefaultPlugins: true,
  },
}

// ============================================================================
// Complex Content Stories
// ============================================================================

export const FullMarkdownDocument: Story = {
  args: {
    content: `# React Hooks Guide

React Hooks are functions that let you "hook into" React state and lifecycle features [1].

## Introduction

Introduced in React 16.8, hooks allow you to use state and other React features **without writing a class**.

## Common Hooks

- **useState**: Manage component state
- **useEffect**: Perform side effects
- **useContext**: Access context values
- **useReducer**: Complex state management

### Example Usage

Here's how to use \`useState\`:

\`\`\`jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
\`\`\`

## Comparison Table

| Hook | Purpose | Example |
|------|---------|---------|
| useState | State management | \`const [state, setState]\` |
| useEffect | Side effects | \`useEffect(() => {...}, [])\` |
| useContext | Context access | \`const value = useContext(MyContext)\` |

---

> Hooks are fully backward compatible with classes and **don't require any breaking changes**.

For more information, visit [React Hooks Documentation](https://react.dev/reference/react/hooks) [2].`,
    includeDefaultPlugins: true,
    metadata: {
      citations: [
        { source: 'React Official Docs', url: 'https://react.dev' },
        { source: 'Hooks Reference', url: 'https://react.dev/reference/react/hooks' },
      ],
    },
  },
}

export const MixedContentWithTools: Story = {
  args: {
    content: `I'll help you analyze this code:

\`\`\`typescript
async function fetchUserData(userId: string) {
  const response = await fetch(\`/api/users/\${userId}\`);
  return response.json();
}
\`\`\`

<tool_result name="code_analyzer" status="success">{"complexity": "low", "issues": 0, "performance": "good"}</tool_result>

The code is **well-structured** and *efficient*. Key points:

1. Uses \`async/await\` for clean code
2. Proper error handling recommended
3. Type-safe with TypeScript

See [MDN Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) [1] for more details.`,
    includeDefaultPlugins: true,
    metadata: {
      citations: [
        { source: 'MDN Web Docs', url: 'https://developer.mozilla.org' },
      ],
    },
  },
}

// ============================================================================
// Streaming Content Stories
// ============================================================================

export const StreamingContent: Story = {
  args: {
    content: 'This is streaming content that is still being generated. Watch for the cursor at the end...',
    isStreaming: true,
    includeDefaultPlugins: true,
  },
}

export const StreamingWithFormatting: Story = {
  args: {
    content: `I'm writing in **bold** and using \`code\` as I think of examples...

Here's the beginning of a code block:

\`\`\`python
def hello():
    print("World")
\`\`\`

More content coming...`,
    isStreaming: true,
    includeDefaultPlugins: true,
  },
}

// ============================================================================
// Custom Plugin Stories
// ============================================================================

export const CustomPluginHighlight: Story = {
  args: {
    content: `This text has ==highlighted== content that needs special formatting.

This is also ==important== information.`,
    includeDefaultPlugins: true,
    plugins: [
      createPlugin(
        'highlight',
        /==(.*?)==/g,
        (match) => (
          <mark style={{ backgroundColor: 'yellow', padding: '2px 4px' }} key={match.start}>
            {match.text.replace(/==/g, '')}
          </mark>
        ),
        { priority: 90 }
      ),
    ],
  },
}

export const CustomPluginMention: Story = {
  args: {
    content: `Great job, @john! Please review this with @sarah and @mike. Let's discuss at @project-team channel.`,
    includeDefaultPlugins: true,
    plugins: [
      createPlugin(
        'mention',
        /@(\w+)/g,
        (match) => (
          <span
            style={{
              backgroundColor: '#e3f2fd',
              color: '#1976d2',
              padding: '2px 6px',
              borderRadius: '3px',
              fontWeight: 'bold',
            }}
            key={match.start}
          >
            {match.text}
          </span>
        ),
        { priority: 85 }
      ),
    ],
  },
}

export const CustomPluginEmoji: Story = {
  args: {
    content: `This is great! :smile: Let's celebrate :tada: The team did :rocket: work!`,
    includeDefaultPlugins: true,
    plugins: [
      createReplacementPlugin(
        'emoji',
        /:(\w+):/g,
        (match, name) => {
          const emojiMap: Record<string, string> = {
            smile: '😊',
            tada: '🎉',
            rocket: '🚀',
            heart: '❤️',
            fire: '🔥',
            thumbsup: '👍',
          }
          return emojiMap[name] || match
        },
        100
      ),
    ],
  },
}

// ============================================================================
// Component Override Stories
// ============================================================================

function CustomCodeBlock({ language, code, filename }: any) {
  return (
    <div
      style={{
        backgroundColor: '#1e1e1e',
        color: '#d4d4d4',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '12px',
        fontFamily: 'monospace',
      }}
    >
      {filename && (
        <div style={{ marginBottom: '8px', color: '#6a9955', fontSize: '12px' }}>
          📄 {filename}
        </div>
      )}
      {language && (
        <div style={{ marginBottom: '8px', color: '#858585', fontSize: '12px' }}>
          {language}
        </div>
      )}
      <pre style={{ margin: 0, overflow: 'auto' }}>{code}</pre>
    </div>
  )
}

function CustomLink({ href, children }: any) {
  return (
    <a
      href={href}
      style={{
        color: '#2196f3',
        textDecoration: 'none',
        borderBottom: '2px dotted #2196f3',
        cursor: 'pointer',
      }}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children} ↗
    </a>
  )
}

function CustomCitation({ index, source }: any) {
  return (
    <sup
      style={{
        color: '#ff9800',
        fontWeight: 'bold',
        cursor: 'pointer',
      }}
      title={source}
    >
      [{index}]
    </sup>
  )
}

export const CustomComponentOverrides: Story = {
  args: {
    content: `Here's a custom code example:

\`\`\`typescript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

Check [this link](https://example.com) for more info [1].`,
    includeDefaultPlugins: true,
    components: {
      CodeBlock: CustomCodeBlock,
      Link: CustomLink,
      Citation: CustomCitation,
    },
    metadata: {
      citations: [
        { source: 'Example Source', url: 'https://example.com' },
      ],
    },
  },
}

// ============================================================================
// Extended Plugins Stories
// ============================================================================

export const ExtendedWithCustom: Story = {
  args: {
    content: `Standard formatting with **bold** and [links](https://example.com).

Custom highlight: ==important==
Custom mention: @team`,
    includeDefaultPlugins: true,
    plugins: [
      createPlugin(
        'highlight',
        /==(.*?)==/g,
        (match) => (
          <mark style={{ backgroundColor: 'yellow', padding: '2px 4px' }} key={match.start}>
            {match.text.replace(/==/g, '')}
          </mark>
        ),
        { priority: 90 }
      ),
      createPlugin(
        'mention',
        /@(\w+)/g,
        (match) => (
          <span
            style={{
              backgroundColor: '#e3f2fd',
              color: '#1976d2',
              padding: '2px 6px',
              borderRadius: '3px',
            }}
            key={match.start}
          >
            {match.text}
          </span>
        ),
        { priority: 85 }
      ),
    ],
  },
}

// ============================================================================
// No Plugins Story
// ============================================================================

export const NoPlugins: Story = {
  args: {
    content: `This is **bold** text but it won't be processed.
This is a [link](https://example.com) but it will show raw.
\`\`\`javascript
code blocks won't be formatted
\`\`\``,
    includeDefaultPlugins: false,
    plugins: [],
  },
}

// ============================================================================
// Performance/Edge Cases
// ============================================================================

export const LongContent: Story = {
  args: {
    content: `# Comprehensive Guide

${Array.from({ length: 5 }, (_, i) => `## Section ${i + 1}

This is paragraph ${i + 1} with some content. Here's **bold** text and \`inline code\` and a [link](https://example.com).

\`\`\`javascript
const example${i} = () => {
  console.log("Example ${i}");
};
\`\`\`
`).join('\n')}`,
    includeDefaultPlugins: true,
  },
}

export const ManyPluginsMatches: Story = {
  args: {
    content: `**Bold**, *italic*, ~~strikethrough~~, \`code\`, [link](https://example.com), **more bold**, *more italic*, ***bold and italic***.`,
    includeDefaultPlugins: true,
  },
}

export const SpecialCharacters: Story = {
  args: {
    content: `Text with special characters: <, >, &, ", ', and various symbols: @ # $ % ^ & * ( ) [ ] { } | \\ / ? .`,
    includeDefaultPlugins: true,
  },
}

// ============================================================================
// No Animation Story
// ============================================================================

export const NoAnimation: Story = {
  args: {
    content: `This content renders without animation.

- Item 1
- Item 2
- Item 3

**Bold text** and [link](https://example.com).`,
    includeDefaultPlugins: true,
    animate: false,
  },
}
