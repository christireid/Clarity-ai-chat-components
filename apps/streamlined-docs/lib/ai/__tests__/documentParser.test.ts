/**
 * Tests for document parser
 */

import { describe, it, expect } from 'vitest'
import { parseMarkdownDocument } from '../documentParser'

describe('parseMarkdownDocument', () => {
  it('should parse frontmatter', () => {
    const markdown = `---
title: Test Document
category: guide
tags: [testing, example]
---

# Content Here`

    const parsed = parseMarkdownDocument(markdown, '/test.md')

    expect(parsed.frontmatter.title).toBe('Test Document')
    expect(parsed.frontmatter.category).toBe('guide')
    expect(parsed.frontmatter.tags).toEqual(['testing', 'example'])
  })

  it('should parse hierarchical sections', () => {
    const markdown = `# Main Heading

Content of main section.

## Subsection 1

Content of subsection 1.

### Nested Subsection

Content of nested subsection.

## Subsection 2

Content of subsection 2.`

    const parsed = parseMarkdownDocument(markdown, '/test.md')

    expect(parsed.sections).toHaveLength(4)

    // Check main heading
    expect(parsed.sections[0].heading).toBe('Main Heading')
    expect(parsed.sections[0].level).toBe(1)
    expect(parsed.sections[0].parentId).toBeUndefined()

    // Check subsection 1
    expect(parsed.sections[1].heading).toBe('Subsection 1')
    expect(parsed.sections[1].level).toBe(2)
    expect(parsed.sections[1].parentId).toBe(parsed.sections[0].id)

    // Check nested subsection
    expect(parsed.sections[2].heading).toBe('Nested Subsection')
    expect(parsed.sections[2].level).toBe(3)
    expect(parsed.sections[2].parentId).toBe(parsed.sections[1].id)

    // Check parent-child relationships
    expect(parsed.sections[0].childIds).toContain(parsed.sections[1].id)
    expect(parsed.sections[1].childIds).toContain(parsed.sections[2].id)
  })

  it('should extract code blocks', () => {
    const markdown = `# Example

Here's a code example:

\`\`\`typescript
function hello() {
  return 'world'
}
\`\`\`

Another example:

\`\`\`javascript
const x = 42
\`\`\``

    const parsed = parseMarkdownDocument(markdown, '/test.md')

    expect(parsed.codeBlocks).toHaveLength(2)

    // Check first code block
    expect(parsed.codeBlocks[0].language).toBe('typescript')
    expect(parsed.codeBlocks[0].code).toContain('function hello()')
    expect(parsed.codeBlocks[0].isExecutable).toBe(true)

    // Check second code block
    expect(parsed.codeBlocks[1].language).toBe('javascript')
    expect(parsed.codeBlocks[1].code).toContain('const x = 42')
  })

  it('should extract code keywords', () => {
    const markdown = `# React Component

\`\`\`tsx
import React from 'react'

export function MyComponent() {
  const [count, setCount] = React.useState(0)

  return <div>{count}</div>
}
\`\`\``

    const parsed = parseMarkdownDocument(markdown, '/test.md')

    expect(parsed.codeBlocks).toHaveLength(1)

    const keywords = parsed.codeBlocks[0].keywords
    expect(keywords).toContain('MyComponent')
    expect(keywords).toContain('React')
    expect(keywords).toContain('useState')
  })

  it('should detect cross-references', () => {
    const markdown = `# Documentation

See the [API Reference](/docs/api) for details.

Use the <ChatMessage /> component.

Call useChat() to manage state.

import { Button } from '@clarity-chat/primitives'

See also: Authentication Guide`

    const parsed = parseMarkdownDocument(markdown, '/test.md')

    expect(parsed.crossReferences.length).toBeGreaterThanOrEqual(5)

    // Check link reference
    const linkRef = parsed.crossReferences.find(r => r.type === 'internal-link')
    expect(linkRef).toBeDefined()
    expect(linkRef?.text).toBe('API Reference')
    expect(linkRef?.target).toBe('/docs/api')

    // Check component reference
    const compRef = parsed.crossReferences.find(r => r.type === 'component-ref')
    expect(compRef).toBeDefined()
    expect(compRef?.text).toBe('ChatMessage')

    // Check hook reference
    const hookRef = parsed.crossReferences.find(r => r.type === 'hook-ref')
    expect(hookRef).toBeDefined()
    expect(hookRef?.text).toBe('useChat')

    // Check import reference
    const importRef = parsed.crossReferences.find(r => r.type === 'import-ref')
    expect(importRef).toBeDefined()
    expect(importRef?.target).toBe('@clarity-chat/primitives')

    // Check see-also reference
    const seeAlsoRef = parsed.crossReferences.find(r => r.type === 'see-also')
    expect(seeAlsoRef).toBeDefined()
    expect(seeAlsoRef?.text).toContain('Authentication Guide')
  })

  it('should generate tags from content', () => {
    const markdown = `---
tags: [custom-tag]
---

# React Component Guide

Learn about React hooks and components.

\`\`\`typescript
import { useState } from 'react'
\`\`\``

    const parsed = parseMarkdownDocument(markdown, '/test.md')

    // Should include frontmatter tags
    expect(parsed.tags).toContain('custom-tag')

    // Should include detected terms
    expect(parsed.tags).toContain('react')
    expect(parsed.tags).toContain('typescript')
  })

  it('should infer document category from path', () => {
    const markdown = '# Test'

    // Component path
    const comp = parseMarkdownDocument(markdown, '/docs/components/Button.md')
    expect(comp.category).toBe('component')

    // Hook path
    const hook = parseMarkdownDocument(markdown, '/docs/hooks/useChat.md')
    expect(hook.category).toBe('hook')

    // Guide path
    const guide = parseMarkdownDocument(markdown, '/docs/guides/getting-started.md')
    expect(guide.category).toBe('guide')
  })

  it('should infer category from content', () => {
    const markdownWithProps = `# MyComponent

## Props

| Prop | Type | Description |
|------|------|-------------|
| title | string | The title |`

    const parsed = parseMarkdownDocument(markdownWithProps, '/test.md')
    expect(parsed.category).toBe('component')
  })

  it('should determine title from frontmatter, heading, or filename', () => {
    // From frontmatter
    const withFrontmatter = `---
title: Custom Title
---

# Different Heading`

    const parsed1 = parseMarkdownDocument(withFrontmatter, '/test.md')
    expect(parsed1.title).toBe('Custom Title')

    // From H1 heading
    const withH1 = '# Main Heading\n\nContent'
    const parsed2 = parseMarkdownDocument(withH1, '/test.md')
    expect(parsed2.title).toBe('Main Heading')

    // From filename
    const noTitleOrH1 = 'Just some content'
    const parsed3 = parseMarkdownDocument(noTitleOrH1, '/docs/my-document.md')
    expect(parsed3.title).toBe('my document')
  })

  it('should handle code blocks without breaking section parsing', () => {
    const markdown = `# Section 1

\`\`\`typescript
// Code with # symbols
const comment = "# This is not a heading"
\`\`\`

## Section 2

More content`

    const parsed = parseMarkdownDocument(markdown, '/test.md')

    // Should have 2 sections, not confused by # in code
    expect(parsed.sections).toHaveLength(2)
    expect(parsed.sections[0].heading).toBe('Section 1')
    expect(parsed.sections[1].heading).toBe('Section 2')
  })

  it('should extract code captions', () => {
    const markdown = `# Example

**Example implementation:**

\`\`\`typescript
function example() {}
\`\`\``

    const parsed = parseMarkdownDocument(markdown, '/test.md')

    expect(parsed.codeBlocks).toHaveLength(1)
    expect(parsed.codeBlocks[0].caption).toBe('Example implementation:')
  })

  it('should detect executable vs incomplete code', () => {
    const markdown = `# Examples

Complete example:

\`\`\`typescript
export function Component() {
  return <div>Hello</div>
}
\`\`\`

Incomplete example:

\`\`\`typescript
const result = someFunction(
\`\`\``

    const parsed = parseMarkdownDocument(markdown, '/test.md')

    expect(parsed.codeBlocks).toHaveLength(2)

    // First should be executable (complete function)
    expect(parsed.codeBlocks[0].isExecutable).toBe(true)

    // Second should not be executable (incomplete)
    expect(parsed.codeBlocks[1].isExecutable).toBe(false)
  })

  it('should link code blocks to sections', () => {
    const markdown = `# Main Section

Text content.

\`\`\`typescript
const code1 = 'test'
\`\`\`

## Subsection

More text.

\`\`\`javascript
const code2 = 'test'
\`\`\``

    const parsed = parseMarkdownDocument(markdown, '/test.md')

    expect(parsed.sections).toHaveLength(2)
    expect(parsed.codeBlocks).toHaveLength(2)

    // First code block should be in first section
    expect(parsed.sections[0].codeBlockIds).toContain(parsed.codeBlocks[0].id)

    // Second code block should be in second section
    expect(parsed.sections[1].codeBlockIds).toContain(parsed.codeBlocks[1].id)
  })

  it('should link cross-references to sections', () => {
    const markdown = `# Main Section

See [Link 1](/path1).

## Subsection

See [Link 2](/path2).`

    const parsed = parseMarkdownDocument(markdown, '/test.md')

    expect(parsed.sections).toHaveLength(2)
    expect(parsed.crossReferences).toHaveLength(2)

    // First reference should be in first section
    const ref1 = parsed.crossReferences[0]
    expect(parsed.sections[0].crossReferenceIds).toContain(ref1.id)

    // Second reference should be in second section
    const ref2 = parsed.crossReferences[1]
    expect(parsed.sections[1].crossReferenceIds).toContain(ref2.id)
  })
})
