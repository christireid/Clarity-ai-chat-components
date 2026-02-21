/**
 * Tests for document chunker
 */

import { describe, it, expect } from 'vitest'
import { parseMarkdownDocument } from '../documentParser'
import { chunkDocument } from '../documentChunker'

describe('chunkDocument', () => {
  it('should create hierarchical chunks', () => {
    const markdown = `# Main Title

Introduction content.

## Section 1

Content of section 1.

## Section 2

Content of section 2.

### Subsection 2.1

Content of subsection 2.1.`

    const parsed = parseMarkdownDocument(markdown, '/test.md')
    const chunks = chunkDocument(parsed, {
      strategy: 'hierarchical',
      maxHeadingLevel: 3,
    })

    // Should have overview + sections
    expect(chunks.length).toBeGreaterThanOrEqual(4)

    // Check overview chunk
    const overview = chunks.find(c => c.type === 'overview')
    expect(overview).toBeDefined()
    expect(overview?.title).toBe(parsed.title)

    // Check section chunks
    const section1 = chunks.find(c => c.title === 'Section 1')
    expect(section1).toBeDefined()
    expect(section1?.type).toBe('section')

    const section2 = chunks.find(c => c.title === 'Section 2')
    expect(section2).toBeDefined()

    const subsection = chunks.find(c => c.title === 'Subsection 2.1')
    expect(subsection).toBeDefined()
  })

  it('should respect maxHeadingLevel', () => {
    const markdown = `# H1

## H2

### H3

#### H4`

    const parsed = parseMarkdownDocument(markdown, '/test.md')

    // With maxHeadingLevel: 2, should only chunk H1 and H2
    const chunks = chunkDocument(parsed, {
      strategy: 'hierarchical',
      maxHeadingLevel: 2,
    })

    const titles = chunks.map(c => c.title)
    expect(titles).toContain('H1')
    expect(titles).toContain('H2')
    // H3 and H4 should be included in H2's content, not as separate chunks
  })

  it('should create separate chunks for code blocks', () => {
    const markdown = `# Example Guide

Here's an example:

\`\`\`typescript
function example() {
  return 'hello'
}
\`\`\`

And another:

\`\`\`javascript
const x = 42
\`\`\``

    const parsed = parseMarkdownDocument(markdown, '/test.md')
    const chunks = chunkDocument(parsed, {
      strategy: 'hierarchical',
      separateCodeBlocks: true,
    })

    // Should have section chunk + code block chunks
    const codeChunks = chunks.filter(c => c.type === 'code-example')
    expect(codeChunks.length).toBe(2)

    expect(codeChunks[0].codeBlocks).toHaveLength(1)
    expect(codeChunks[0].metadata.languages).toContain('typescript')

    expect(codeChunks[1].codeBlocks).toHaveLength(1)
    expect(codeChunks[1].metadata.languages).toContain('javascript')
  })

  it('should not create separate chunks for small code blocks', () => {
    const markdown = `# Example

Small code: \`\`\`js\nconst x = 1\n\`\`\``

    const parsed = parseMarkdownDocument(markdown, '/test.md')
    const chunks = chunkDocument(parsed, {
      strategy: 'hierarchical',
      separateCodeBlocks: true,
      minChunkSize: 100,
    })

    // Should not create separate chunk for very small code
    const codeChunks = chunks.filter(c => c.type === 'code-example')
    expect(codeChunks).toHaveLength(0)
  })

  it('should include parent context when enabled', () => {
    const markdown = `# Parent Section

## Child Section

Child content.`

    const parsed = parseMarkdownDocument(markdown, '/test.md')
    const chunks = chunkDocument(parsed, {
      strategy: 'hierarchical',
      includeParentContext: true,
    })

    const childChunk = chunks.find(c => c.title === 'Child Section')
    expect(childChunk).toBeDefined()
    expect(childChunk?.content).toContain('Parent: Parent Section')
  })

  it('should preserve section hierarchy in chunks', () => {
    const markdown = `# Level 1

## Level 2

### Level 3

Content here.`

    const parsed = parseMarkdownDocument(markdown, '/test.md')
    const chunks = chunkDocument(parsed, {
      strategy: 'hierarchical',
      maxHeadingLevel: 3,
    })

    const level3Chunk = chunks.find(c => c.title === 'Level 3')
    expect(level3Chunk).toBeDefined()
    expect(level3Chunk?.sectionPath).toEqual(['Level 1', 'Level 2', 'Level 3'])
  })

  it('should use semantic chunking for large sections', () => {
    const markdown = `# Long Section

${'Paragraph 1.\n\n'.repeat(50)}

${'Paragraph 2.\n\n'.repeat(50)}`

    const parsed = parseMarkdownDocument(markdown, '/test.md')
    const chunks = chunkDocument(parsed, {
      strategy: 'semantic',
      maxChunkSize: 500,
    })

    // Should split into multiple chunks
    expect(chunks.length).toBeGreaterThan(1)

    // Each chunk should be under max size
    for (const chunk of chunks) {
      expect(chunk.content.length).toBeLessThanOrEqual(600) // Some buffer
    }
  })

  it('should use fixed-size chunking with overlap', () => {
    const content = 'A'.repeat(1000) + 'B'.repeat(1000)
    const markdown = `# Test\n\n${content}`

    const parsed = parseMarkdownDocument(markdown, '/test.md')
    const chunks = chunkDocument(parsed, {
      strategy: 'fixed-size',
      maxChunkSize: 500,
      overlapSize: 100,
    })

    expect(chunks.length).toBeGreaterThan(1)

    // Check overlap between consecutive chunks
    for (let i = 0; i < chunks.length - 1; i++) {
      const current = chunks[i].content
      const next = chunks[i + 1].content

      // Some content should overlap
      const currentEnd = current.slice(-50)
      expect(next).toContain(currentEnd.slice(0, 20))
    }
  })

  it('should use hybrid strategy', () => {
    const markdown = `# Section 1

${'Content '.repeat(300)}

## Subsection 1.1

${'More content '.repeat(300)}`

    const parsed = parseMarkdownDocument(markdown, '/test.md')
    const chunks = chunkDocument(parsed, {
      strategy: 'hybrid',
      maxChunkSize: 1000,
      maxHeadingLevel: 2,
    })

    // Should have multiple chunks (sections split when too large)
    expect(chunks.length).toBeGreaterThan(2)

    // All chunks should respect max size
    for (const chunk of chunks) {
      expect(chunk.content.length).toBeLessThanOrEqual(1200) // Some buffer
    }
  })

  it('should extract chunk metadata', () => {
    const markdown = `---
tags: [test, example]
---

# Example

\`\`\`typescript
const x = 42
\`\`\``

    const parsed = parseMarkdownDocument(markdown, '/test.md')
    const chunks = chunkDocument(parsed, {
      strategy: 'hierarchical',
    })

    const chunk = chunks[0]
    expect(chunk.metadata).toBeDefined()
    expect(chunk.metadata.tags).toContain('test')
    expect(chunk.metadata.tags).toContain('example')
    expect(chunk.metadata.wordCount).toBeGreaterThan(0)
    expect(chunk.metadata.estimatedTokens).toBeGreaterThan(0)
  })

  it('should detect chunk types correctly', () => {
    const markdown = `# Component API

## Props

| Prop | Type | Description |
|------|------|-------------|
| name | string | Component name |

## Example Usage

\`\`\`tsx
<MyComponent name="test" />
\`\`\`

## Concepts

Understanding the component lifecycle.`

    const parsed = parseMarkdownDocument(markdown, '/test.md')
    const chunks = chunkDocument(parsed, {
      strategy: 'hierarchical',
      maxHeadingLevel: 2,
    })

    // Find chunks by title
    const propsChunk = chunks.find(c => c.title === 'Props')
    expect(propsChunk?.type).toBe('api-reference')

    const exampleChunk = chunks.find(c => c.title === 'Example Usage')
    expect(exampleChunk?.type).toBe('code-example')

    const conceptChunk = chunks.find(c => c.title === 'Concepts')
    expect(conceptChunk?.type).toBe('conceptual')
  })

  it('should mark executable code in metadata', () => {
    const markdown = `# Examples

Complete example:

\`\`\`typescript
export function Component() {
  return <div>Hello</div>
}
\`\`\`

Incomplete example:

\`\`\`typescript
const x = (
\`\`\``

    const parsed = parseMarkdownDocument(markdown, '/test.md')
    const chunks = chunkDocument(parsed, {
      strategy: 'hierarchical',
      separateCodeBlocks: true,
    })

    const codeChunks = chunks.filter(c => c.type === 'code-example')
    expect(codeChunks).toHaveLength(2)

    // First should be marked as executable
    expect(codeChunks[0].metadata.hasExecutableCode).toBe(true)
    expect(codeChunks[0].metadata.isCompleteExample).toBe(true)

    // Second should not be
    expect(codeChunks[1].metadata.hasExecutableCode).toBe(false)
  })

  it('should extract keywords from chunk content', () => {
    const markdown = `# React Hooks Guide

Learn about useState and useEffect hooks in React.`

    const parsed = parseMarkdownDocument(markdown, '/test.md')
    const chunks = chunkDocument(parsed, {
      strategy: 'hierarchical',
    })

    const chunk = chunks.find(c => c.type === 'overview')
    expect(chunk).toBeDefined()
    expect(chunk?.keywords).toContain('react')
    expect(chunk?.keywords).toContain('hooks')
  })

  it('should include cross-references in chunks', () => {
    const markdown = `# Main Section

See [Related Doc](/docs/related).

Use the <Button /> component.`

    const parsed = parseMarkdownDocument(markdown, '/test.md')
    const chunks = chunkDocument(parsed, {
      strategy: 'hierarchical',
    })

    const chunk = chunks.find(c => c.title === 'Main Section')
    expect(chunk).toBeDefined()
    expect(chunk?.crossReferences).toHaveLength(2)

    const linkRef = chunk?.crossReferences.find(r => r.type === 'internal-link')
    expect(linkRef).toBeDefined()

    const compRef = chunk?.crossReferences.find(r => r.type === 'component-ref')
    expect(compRef).toBeDefined()
  })

  it('should generate correct chunk IDs', () => {
    const markdown = `# Section 1

## Section 2`

    const parsed = parseMarkdownDocument(markdown, '/test.md')
    const chunks = chunkDocument(parsed, {
      strategy: 'hierarchical',
    })

    // Each chunk should have a unique ID
    const ids = chunks.map(c => c.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('should set chunk URLs correctly', () => {
    const markdown = `# Main

## Section 1`

    const parsed = parseMarkdownDocument(markdown, '/docs/test.md')
    const chunks = chunkDocument(parsed, {
      strategy: 'hierarchical',
    })

    for (const chunk of chunks) {
      expect(chunk.url).toContain('/docs/test.md')
    }
  })

  it('should handle empty sections gracefully', () => {
    const markdown = `# Section 1

## Empty Section

## Section 3

Content here.`

    const parsed = parseMarkdownDocument(markdown, '/test.md')
    const chunks = chunkDocument(parsed, {
      strategy: 'hierarchical',
    })

    // Empty sections should be skipped
    const emptyChunk = chunks.find(c => c.title === 'Empty Section')
    expect(emptyChunk).toBeUndefined()
  })

  it('should preserve code blocks in section chunks', () => {
    const markdown = `# Example Section

Text content.

\`\`\`typescript
const example = true
\`\`\`

More text.`

    const parsed = parseMarkdownDocument(markdown, '/test.md')
    const chunks = chunkDocument(parsed, {
      strategy: 'hierarchical',
      separateCodeBlocks: false, // Keep code in section
    })

    const sectionChunk = chunks.find(c => c.type === 'section' || c.type === 'overview')
    expect(sectionChunk).toBeDefined()
    expect(sectionChunk?.codeBlocks).toHaveLength(1)
    expect(sectionChunk?.content).toContain('```typescript')
  })
})
