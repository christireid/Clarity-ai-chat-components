/**
 * Comprehensive Test Suite for MessageRenderer Component
 *
 * Tests plugin matching, custom plugins, render output,
 * accessibility, and content processing.
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { axe, toHaveNoViolations } from 'jest-axe'

import MessageRenderer, {
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
  type MessagePlugin,
  type PluginMatch,
  type ComponentOverrides,
} from '../MessageRenderer'

expect.extend(toHaveNoViolations)

// ============================================================================
// Mock framer-motion
// ============================================================================

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => (
      <div {...props} data-testid="motion-div">
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useReducedMotion: () => false,
}))

// ============================================================================
// Plugin Matching Tests
// ============================================================================

describe('MessageRenderer - Plugin Matching', () => {
  test('code block plugin matches code blocks', () => {
    const { container } = render(
      <MessageRenderer content="```javascript\nconst x = 1;\n```" />
    )

    expect(container).toHaveTextContent('javascript')
    expect(container).toHaveTextContent('const x = 1;')
    expect(container.querySelector('.message-renderer-code-block')).toBeInTheDocument()
  })

  test('inline code plugin matches backticks', () => {
    const { container } = render(
      <MessageRenderer content="Use `const x = 1;` in your code" />
    )

    expect(container.querySelector('.message-renderer-inline-code')).toBeInTheDocument()
  })

  test('citation plugin matches [1], [2] format', () => {
    const { container } = render(
      <MessageRenderer content="This is cited[1] and this too[2]." />
    )

    const citations = container.querySelectorAll('.message-renderer-citation')
    expect(citations.length).toBe(2)
    expect(citations[0]).toHaveAttribute('data-citation-index', '1')
  })

  test('link plugin matches markdown links', () => {
    const { container } = render(
      <MessageRenderer content="Check out [this link](https://example.com)" />
    )

    const link = container.querySelector('.message-renderer-link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://example.com')
  })

  test('link plugin matches raw URLs', () => {
    const { container } = render(
      <MessageRenderer content="Visit https://example.com for more info" />
    )

    const link = container.querySelector('.message-renderer-link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://example.com')
  })

  test('image plugin matches image syntax', () => {
    const { container } = render(
      <MessageRenderer content="![Alt text](https://example.com/image.png)" />
    )

    const image = container.querySelector('.message-renderer-image')
    expect(image).toBeInTheDocument()
    expect(container.querySelector('img')).toHaveAttribute(
      'src',
      'https://example.com/image.png'
    )
  })

  test('table plugin matches markdown tables', () => {
    const content = `| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |`

    const { container } = render(<MessageRenderer content={content} />)

    expect(container.querySelector('.message-renderer-table')).toBeInTheDocument()
    expect(container.querySelector('thead')).toBeInTheDocument()
    expect(container.querySelector('tbody')).toBeInTheDocument()
  })

  test('bold plugin matches **text** format', () => {
    const { container } = render(<MessageRenderer content="This is **bold** text" />)

    const bold = container.querySelector('strong')
    expect(bold).toHaveTextContent('bold')
  })

  test('italic plugin matches *text* format', () => {
    const { container } = render(<MessageRenderer content="This is *italic* text" />)

    const italic = container.querySelector('em')
    expect(italic).toHaveTextContent('italic')
  })

  test('strikethrough plugin matches ~~text~~ format', () => {
    const { container } = render(<MessageRenderer content="This is ~~strikethrough~~ text" />)

    const strikethrough = container.querySelector('del')
    expect(strikethrough).toHaveTextContent('strikethrough')
  })

  test('heading plugin matches heading syntax', () => {
    const { container } = render(<MessageRenderer content="# Main Heading\n## Subheading" />)

    expect(container.querySelector('h1')).toHaveTextContent('Main Heading')
    expect(container.querySelector('h2')).toHaveTextContent('Subheading')
  })

  test('list plugin matches unordered lists', () => {
    const content = `- Item 1
- Item 2
- Item 3`

    const { container } = render(<MessageRenderer content={content} />)

    const list = container.querySelector('ul.message-renderer-list')
    expect(list).toBeInTheDocument()
    expect(list?.querySelectorAll('li').length).toBe(3)
  })

  test('list plugin matches ordered lists', () => {
    const content = `1. First
2. Second
3. Third`

    const { container } = render(<MessageRenderer content={content} />)

    const list = container.querySelector('ol.message-renderer-list')
    expect(list).toBeInTheDocument()
  })

  test('blockquote plugin matches quote syntax', () => {
    const { container } = render(<MessageRenderer content="> This is a quote" />)

    expect(container.querySelector('.message-renderer-blockquote')).toBeInTheDocument()
  })

  test('horizontal rule plugin matches hr syntax', () => {
    const { container } = render(<MessageRenderer content="---" />)

    expect(container.querySelector('.message-renderer-hr')).toBeInTheDocument()
  })

  test('tool result plugin matches tool result format', () => {
    const content = '<tool_result name="search" status="success">{"result": "success"}</tool_result>'
    const { container } = render(<MessageRenderer content={content} />)

    expect(container.querySelector('.message-renderer-tool-result')).toBeInTheDocument()
    expect(container).toHaveTextContent('search')
  })

  test('file plugin matches file syntax', () => {
    const content = '<file name="document.pdf" type="application/pdf" size="1024" url="https://example.com/doc.pdf" />'
    const { container } = render(<MessageRenderer content={content} />)

    expect(container.querySelector('.message-renderer-file-card')).toBeInTheDocument()
    expect(container).toHaveTextContent('document.pdf')
  })
})

// ============================================================================
// Custom Plugin Tests
// ============================================================================

describe('MessageRenderer - Custom Plugins', () => {
  test('custom plugin works with regex', () => {
    const customPlugin: MessagePlugin = {
      name: 'emoji',
      priority: 50,
      match: /:([\w]+):/g,
      render: (match) => <span key={match.start}>😊</span>,
    }

    const { container } = render(
      <MessageRenderer
        content="Hello :smile: world :heart:"
        plugins={[customPlugin]}
        includeDefaultPlugins={false}
      />
    )

    expect(container).toHaveTextContent('😊')
  })

  test('createPlugin helper creates custom plugin', () => {
    const customPlugin = createPlugin(
      'custom',
      /\{\{([\w]+)\}\}/g,
      (match) => <strong key={match.start}>{match.text}</strong>
    )

    expect(customPlugin.name).toBe('custom')
    expect(customPlugin.priority).toBeUndefined()
  })

  test('createReplacementPlugin helper creates replacement plugin', () => {
    const plugin = createReplacementPlugin('uppercase', /([A-Z]+)/, (match) => match.toUpperCase())

    expect(plugin.name).toBe('uppercase')
    expect(typeof plugin.render).toBe('function')
  })

  test('custom plugin with function matcher', () => {
    const customPlugin: MessagePlugin = {
      name: 'custom',
      match: (content: string): PluginMatch[] => {
        const matches: PluginMatch[] = []
        const regex = /test/g
        let result

        while ((result = regex.exec(content)) !== null) {
          matches.push({
            start: result.index,
            end: result.index + result[0].length,
            text: result[0],
          })
        }
        return matches
      },
      render: (match) => <span key={match.start}>CUSTOM</span>,
    }

    const { container } = render(
      <MessageRenderer
        content="test test test"
        plugins={[customPlugin]}
        includeDefaultPlugins={false}
      />
    )

    expect(container.textContent).toContain('CUSTOMCUSTOMCUSTOM')
  })

  test('plugin with exclusive flag prevents other matches', () => {
    const exclusivePlugin: MessagePlugin = {
      name: 'exclusive',
      exclusive: true,
      match: /`[^`]+`/g,
      render: (match) => <strong key={match.start}>{match.text}</strong>,
    }

    const { container } = render(
      <MessageRenderer
        content="`test`"
        plugins={[exclusivePlugin]}
        includeDefaultPlugins={false}
      />
    )

    expect(container.querySelector('strong')).toBeInTheDocument()
  })

  test('plugin with preprocessing', () => {
    const preprocessPlugin: MessagePlugin = {
      name: 'preprocess',
      preprocess: (content) => content.replace(/\n/g, '<br>'),
      match: /test/g,
      render: (match) => <span key={match.start}>TEST</span>,
    }

    const { container } = render(
      <MessageRenderer
        content="test\ntest"
        plugins={[preprocessPlugin]}
        includeDefaultPlugins={false}
      />
    )

    expect(container).toHaveTextContent('TESTTEST')
  })

  test('extendPlugins helper merges custom and default plugins', () => {
    const customPlugin: MessagePlugin = {
      name: 'custom',
      priority: 150,
      match: /test/g,
      render: (match) => <span key={match.start}>CUSTOM</span>,
    }

    const merged = extendPlugins([customPlugin], true)
    expect(merged.some((p) => p.name === 'custom')).toBe(true)
    expect(merged.some((p) => p.name === 'codeBlock')).toBe(true)
  })
})

// ============================================================================
// Component Override Tests
// ============================================================================

describe('MessageRenderer - Component Overrides', () => {
  test('custom CodeBlock component is used', () => {
    const CustomCodeBlock = ({ language, code }: any) => (
      <div data-testid="custom-code-block">
        Language: {language}, Code: {code}
      </div>
    )

    const components: ComponentOverrides = {
      CodeBlock: CustomCodeBlock,
    }

    const { getByTestId } = render(
      <MessageRenderer
        content="```javascript\nconst x = 1;\n```"
        components={components}
      />
    )

    expect(getByTestId('custom-code-block')).toBeInTheDocument()
  })

  test('custom Link component is used', () => {
    const CustomLink = ({ href, children }: any) => (
      <a data-testid="custom-link" href={href}>
        CUSTOM: {children}
      </a>
    )

    const components: ComponentOverrides = {
      Link: CustomLink,
    }

    const { getByTestId } = render(
      <MessageRenderer
        content="[click here](https://example.com)"
        components={components}
      />
    )

    expect(getByTestId('custom-link')).toHaveTextContent('CUSTOM: click here')
  })

  test('custom Citation component is used', () => {
    const CustomCitation = ({ index, source }: any) => (
      <sup data-testid="custom-citation">
        Citation {index}: {source}
      </sup>
    )

    const components: ComponentOverrides = {
      Citation: CustomCitation,
    }

    const { getByTestId } = render(
      <MessageRenderer
        content="Text[1]"
        components={components}
        metadata={{
          citations: [{ source: 'Source 1', url: 'https://example.com' }],
        }}
      />
    )

    expect(getByTestId('custom-citation')).toBeInTheDocument()
  })
})

// ============================================================================
// Rendering Output Tests
// ============================================================================

describe('MessageRenderer - Rendering Output', () => {
  test('renders plain text without plugins', () => {
    const { container } = render(
      <MessageRenderer
        content="This is plain text"
        includeDefaultPlugins={false}
      />
    )

    expect(container).toHaveTextContent('This is plain text')
  })

  test('renders mixed content with multiple plugins', () => {
    const content = `# Title

This is **bold** and *italic* text.

\`\`\`javascript
const x = 1;
\`\`\`

Check out [link](https://example.com)`

    const { container } = render(<MessageRenderer content={content} />)

    expect(container.querySelector('h1')).toBeInTheDocument()
    expect(container.querySelector('strong')).toBeInTheDocument()
    expect(container.querySelector('em')).toBeInTheDocument()
    expect(container.querySelector('.message-renderer-code-block')).toBeInTheDocument()
    expect(container.querySelector('.message-renderer-link')).toBeInTheDocument()
  })

  test('streaming indicator shows when isStreaming is true', () => {
    const { container } = render(
      <MessageRenderer content="Content" isStreaming={true} />
    )

    expect(container.querySelector('.message-renderer-cursor')).toBeInTheDocument()
  })

  test('streaming indicator hidden when isStreaming is false', () => {
    const { container } = render(
      <MessageRenderer content="Content" isStreaming={false} />
    )

    expect(container.querySelector('.message-renderer-cursor')).not.toBeInTheDocument()
  })

  test('custom className is applied', () => {
    const { container } = render(
      <MessageRenderer content="Content" className="custom-class" />
    )

    expect(container.querySelector('.custom-class')).toBeInTheDocument()
  })

  test('custom styles are applied', () => {
    const { container } = render(
      <MessageRenderer
        content="Content"
        style={{ color: 'red', fontSize: '16px' }}
      />
    )

    const renderer = container.querySelector('.message-renderer')
    expect(renderer).toHaveStyle('color: red')
    expect(renderer).toHaveStyle('font-size: 16px')
  })

  test('animate prop controls animation', () => {
    const { container } = render(
      <MessageRenderer content="Content" animate={false} />
    )

    expect(container.querySelector('[data-testid="motion-div"]')).toBeInTheDocument()
  })

  test('empty content renders null', () => {
    const { container } = render(<MessageRenderer content="" />)

    expect(container.textContent).toBe('')
  })
})

// ============================================================================
// Plugin Priority Tests
// ============================================================================

describe('MessageRenderer - Plugin Priority', () => {
  test('higher priority plugins are processed first', () => {
    const lowPriorityPlugin: MessagePlugin = {
      name: 'low',
      priority: 10,
      match: /test/g,
      render: (match) => <span key={match.start}>LOW</span>,
    }

    const highPriorityPlugin: MessagePlugin = {
      name: 'high',
      priority: 100,
      match: /test/g,
      render: (match) => <span key={match.start}>HIGH</span>,
    }

    const { container } = render(
      <MessageRenderer
        content="test test"
        plugins={[lowPriorityPlugin, highPriorityPlugin]}
        includeDefaultPlugins={false}
      />
    )

    // High priority should win
    expect(container.textContent).toContain('HIGH')
    expect(container.textContent).not.toContain('LOW')
  })

  test('default plugins have correct priority order', () => {
    let prevPriority = Infinity
    for (const plugin of defaultPlugins) {
      const priority = plugin.priority || 0
      expect(priority).toBeLessThanOrEqual(prevPriority)
      prevPriority = priority
    }
  })
})

// ============================================================================
// Metadata Tests
// ============================================================================

describe('MessageRenderer - Metadata', () => {
  test('citation metadata is used for rendering', () => {
    const { container } = render(
      <MessageRenderer
        content="Text[1] and more[2]"
        metadata={{
          citations: [
            { source: 'First Source', url: 'https://first.com' },
            { source: 'Second Source', url: 'https://second.com' },
          ],
        }}
      />
    )

    const citations = container.querySelectorAll('.message-renderer-citation')
    expect(citations[0]).toHaveAttribute('title', 'First Source')
    expect(citations[0]).toHaveAttribute('href', 'https://first.com')
  })

  test('metadata is passed to plugin context', () => {
    const plugin: MessagePlugin = {
      name: 'test',
      match: /test/g,
      render: (match, context) => (
        <span key={match.start}>
          {context.metadata?.custom as string}
        </span>
      ),
    }

    const { container } = render(
      <MessageRenderer
        content="test"
        plugins={[plugin]}
        includeDefaultPlugins={false}
        metadata={{ custom: 'custom-value' }}
      />
    )

    expect(container).toHaveTextContent('custom-value')
  })
})

// ============================================================================
// Snapshot Tests
// ============================================================================

describe('MessageRenderer - Snapshots', () => {
  test('renders code block correctly', () => {
    const { container } = render(
      <MessageRenderer content="```javascript\nconst x = 1;\n```" />
    )

    expect(container.querySelector('.message-renderer-code-block')).toMatchSnapshot()
  })

  test('renders mixed content snapshot', () => {
    const content = `# Heading

This is **bold** and *italic* text with [link](https://example.com).`

    const { container } = render(<MessageRenderer content={content} />)

    expect(container.firstChild).toMatchSnapshot()
  })
})

// ============================================================================
// Accessibility Tests
// ============================================================================

describe('MessageRenderer - Accessibility', () => {
  test('has no accessibility violations', async () => {
    const { container } = render(
      <MessageRenderer content="# Heading\n\nThis is **bold** text with [link](https://example.com)" />
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  test('links have proper rel attribute', () => {
    const { container } = render(
      <MessageRenderer content="[external link](https://example.com)" />
    )

    const link = container.querySelector('a')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  test('images have alt text', () => {
    const { container } = render(
      <MessageRenderer content="![alt description](https://example.com/img.png)" />
    )

    const img = container.querySelector('img')
    expect(img).toHaveAttribute('alt', 'alt description')
  })

  test('code block has proper semantic markup', () => {
    const { container } = render(
      <MessageRenderer content="```javascript\nconst x = 1;\n```" />
    )

    expect(container.querySelector('pre')).toBeInTheDocument()
    expect(container.querySelector('code')).toBeInTheDocument()
  })

  test('headings are properly marked', () => {
    const { container } = render(
      <MessageRenderer content="# H1\n## H2\n### H3" />
    )

    expect(container.querySelector('h1')).toBeInTheDocument()
    expect(container.querySelector('h2')).toBeInTheDocument()
    expect(container.querySelector('h3')).toBeInTheDocument()
  })

  test('lists are properly semantic', () => {
    const { container } = render(
      <MessageRenderer content="- Item 1\n- Item 2" />
    )

    expect(container.querySelector('ul')).toBeInTheDocument()
    expect(container.querySelectorAll('li').length).toBe(2)
  })
})

// ============================================================================
// Edge Cases
// ============================================================================

describe('MessageRenderer - Edge Cases', () => {
  test('handles zero-width matches', () => {
    const { container } = render(<MessageRenderer content="test" />)
    expect(container).toHaveTextContent('test')
  })

  test('handles overlapping matches gracefully', () => {
    const { container } = render(
      <MessageRenderer content="**_bold and italic_**" />
    )

    expect(container.querySelector('strong')).toBeInTheDocument()
  })

  test('handles special characters', () => {
    const { container } = render(
      <MessageRenderer content="Test with special chars: @#$%^&*()" />
    )

    expect(container).toHaveTextContent('@#$%^&*()')
  })

  test('handles very long content', () => {
    const longContent = 'word '.repeat(1000)
    const { container } = render(<MessageRenderer content={longContent} />)

    expect(container).toHaveTextContent('word')
  })
})
