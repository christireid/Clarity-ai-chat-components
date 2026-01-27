/**
 * Enhanced Embeddings Tests
 *
 * Validates the improved chunking, metadata enrichment, and embedding generation.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  SemanticChunker,
  normalizeText,
  extractCodeBlocks,
  extractSymbols,
  extractImports,
  extractKeywords,
  generateFingerprint,
  deduplicateChunks,
  EMBEDDING_CONFIGS,
  type EnhancedChunk,
} from '../embeddings-enhanced'

describe('Text Preprocessing', () => {
  describe('normalizeText', () => {
    it('removes excessive whitespace', () => {
      const input = 'Hello    world   test'
      const result = normalizeText(input)
      expect(result).toBe('Hello world test')
    })

    it('normalizes newlines (max 2 consecutive)', () => {
      const input = 'Line 1\n\n\n\n\nLine 2'
      const result = normalizeText(input)
      expect(result).toBe('Line 1\n\nLine 2')
    })

    it('normalizes unicode quotes', () => {
      const input = '"Hello" and 'world''
      const result = normalizeText(input)
      expect(result).toBe('"Hello" and \'world\'')
    })

    it('removes zero-width characters', () => {
      const input = 'Hello\u200Bworld\uFEFF'
      const result = normalizeText(input)
      expect(result).toBe('Helloworld')
    })

    it('trims whitespace', () => {
      const input = '  Hello world  '
      const result = normalizeText(input)
      expect(result).toBe('Hello world')
    })
  })

  describe('extractCodeBlocks', () => {
    it('extracts single code block', () => {
      const input = 'Some text\n```typescript\nconst x = 1\n```\nMore text'
      const blocks = extractCodeBlocks(input)

      expect(blocks).toHaveLength(1)
      expect(blocks[0].language).toBe('typescript')
      expect(blocks[0].code).toBe('const x = 1')
    })

    it('extracts multiple code blocks', () => {
      const input = '```js\ncode1\n```\ntext\n```ts\ncode2\n```'
      const blocks = extractCodeBlocks(input)

      expect(blocks).toHaveLength(2)
      expect(blocks[0].language).toBe('js')
      expect(blocks[1].language).toBe('ts')
    })

    it('handles blocks without language', () => {
      const input = '```\nplain code\n```'
      const blocks = extractCodeBlocks(input)

      expect(blocks).toHaveLength(1)
      expect(blocks[0].language).toBe('text')
    })
  })

  describe('extractSymbols', () => {
    it('extracts function declarations', () => {
      const code = 'function handleClick() {}\nfunction getData() {}'
      const symbols = extractSymbols(code, 'typescript')

      expect(symbols).toContain('handleClick')
      expect(symbols).toContain('getData')
    })

    it('extracts arrow functions', () => {
      const code = 'const onClick = () => {}\nexport const useData = () => {}'
      const symbols = extractSymbols(code, 'typescript')

      expect(symbols).toContain('onClick')
      expect(symbols).toContain('useData')
    })

    it('extracts class declarations', () => {
      const code = 'class ChatWindow {}\nexport class MessageList {}'
      const symbols = extractSymbols(code, 'typescript')

      expect(symbols).toContain('ChatWindow')
      expect(symbols).toContain('MessageList')
    })

    it('extracts interface declarations', () => {
      const code = 'interface User {}\nexport interface Message {}'
      const symbols = extractSymbols(code, 'typescript')

      expect(symbols).toContain('User')
      expect(symbols).toContain('Message')
    })

    it('extracts type declarations', () => {
      const code = 'type Role = string\nexport type Status = "active" | "idle"'
      const symbols = extractSymbols(code, 'typescript')

      expect(symbols).toContain('Role')
      expect(symbols).toContain('Status')
    })

    it('deduplicates symbols', () => {
      const code = 'function test() {}\nfunction test() {}'
      const symbols = extractSymbols(code, 'typescript')

      expect(symbols).toHaveLength(1)
      expect(symbols[0]).toBe('test')
    })
  })

  describe('extractImports', () => {
    it('extracts named imports', () => {
      const code = "import { useState, useEffect } from 'react'"
      const imports = extractImports(code)

      expect(imports).toContain('react')
    })

    it('extracts default imports', () => {
      const code = "import React from 'react'"
      const imports = extractImports(code)

      expect(imports).toContain('react')
    })

    it('extracts multiple imports', () => {
      const code = `
        import React from 'react'
        import { ChatWindow } from '@clarity-chat/react'
        import './styles.css'
      `
      const imports = extractImports(code)

      expect(imports).toContain('react')
      expect(imports).toContain('@clarity-chat/react')
      expect(imports).toContain('./styles.css')
    })
  })

  describe('extractKeywords', () => {
    it('extracts domain-specific terms', () => {
      const text = 'This ChatWindow component uses streaming with React hooks'
      const keywords = extractKeywords(text)

      expect(keywords).toContain('chat')
      expect(keywords).toContain('component')
      expect(keywords).toContain('streaming')
      expect(keywords).toContain('react')
      expect(keywords).toContain('hooks')
    })

    it('extracts component names (PascalCase)', () => {
      const text = 'Use ChatWindow and MessageList components'
      const keywords = extractKeywords(text)

      expect(keywords).toContain('chatwindow')
      expect(keywords).toContain('messagelist')
    })

    it('limits to maxKeywords', () => {
      const text = 'chat message stream component hook react typescript api'
      const keywords = extractKeywords(text, 3)

      expect(keywords.length).toBeLessThanOrEqual(3)
    })

    it('deduplicates keywords', () => {
      const text = 'chat chat chat message message'
      const keywords = extractKeywords(text)

      expect(keywords.filter(k => k === 'chat')).toHaveLength(1)
    })
  })

  describe('generateFingerprint', () => {
    it('generates consistent fingerprint for same content', () => {
      const content = 'Hello world'
      const fp1 = generateFingerprint(content)
      const fp2 = generateFingerprint(content)

      expect(fp1).toBe(fp2)
    })

    it('generates different fingerprints for different content', () => {
      const fp1 = generateFingerprint('Hello world')
      const fp2 = generateFingerprint('Hello world!')

      expect(fp1).not.toBe(fp2)
    })

    it('ignores whitespace differences', () => {
      const fp1 = generateFingerprint('Hello world')
      const fp2 = generateFingerprint('Hello  world')
      const fp3 = generateFingerprint(' Hello world ')

      // Should be similar due to normalization
      expect(fp1).toBe(fp2)
      expect(fp1).toBe(fp3)
    })
  })
})

describe('Semantic Chunking', () => {
  describe('Prose Chunking', () => {
    it('chunks text by sentences', () => {
      const chunker = new SemanticChunker({
        ...EMBEDDING_CONFIGS.prose,
        maxChunkTokens: 20, // Small for testing
      })

      const text = 'First sentence. Second sentence. Third sentence. Fourth sentence.'
      const chunks = chunker.chunk(text, {
        title: 'Test',
        url: '/test',
        category: 'guide',
        tags: [],
        headings: [],
        lastUpdated: new Date().toISOString(),
      })

      expect(chunks.length).toBeGreaterThan(1)
      chunks.forEach(chunk => {
        expect(chunk.tokenCount).toBeLessThanOrEqual(20)
      })
    })

    it('preserves metadata across chunks', () => {
      const chunker = new SemanticChunker(EMBEDDING_CONFIGS.prose)

      const metadata = {
        title: 'Test Document',
        url: '/test',
        category: 'guide' as const,
        tags: ['test', 'example'],
        headings: ['Heading 1', 'Heading 2'],
        lastUpdated: new Date().toISOString(),
      }

      const text = 'A'.repeat(3000) // Long text to force chunking
      const chunks = chunker.chunk(text, metadata)

      chunks.forEach(chunk => {
        expect(chunk.metadata.title).toBe(metadata.title)
        expect(chunk.metadata.url).toBe(metadata.url)
        expect(chunk.metadata.category).toBe(metadata.category)
        expect(chunk.metadata.tags).toEqual(metadata.tags)
      })
    })

    it('creates overlapping chunks', () => {
      const chunker = new SemanticChunker({
        ...EMBEDDING_CONFIGS.prose,
        maxChunkTokens: 50,
        overlapTokens: 10,
      })

      const text = 'Sentence one. Sentence two. Sentence three. Sentence four. Sentence five. Sentence six.'
      const chunks = chunker.chunk(text, {
        title: 'Test',
        url: '/test',
        category: 'guide',
        tags: [],
        headings: [],
        lastUpdated: new Date().toISOString(),
      })

      if (chunks.length > 1) {
        // Check that chunks have some overlap
        const chunk1End = chunks[0].content.slice(-20)
        const chunk2Start = chunks[1].content.slice(0, 50)
        expect(chunk2Start.includes(chunk1End.split(' ').pop()!)).toBe(true)
      }
    })
  })

  describe('Code Chunking', () => {
    it('preserves code blocks', () => {
      const chunker = new SemanticChunker(EMBEDDING_CONFIGS.code)

      const text = `
Some text before.

\`\`\`typescript
function example() {
  return true
}
\`\`\`

Some text after.
      `.trim()

      const chunks = chunker.chunk(text, {
        title: 'Code Example',
        url: '/example',
        category: 'example',
        tags: [],
        headings: [],
        lastUpdated: new Date().toISOString(),
      })

      // Should have code block in one of the chunks
      const hasCodeBlock = chunks.some(c => c.content.includes('```typescript'))
      expect(hasCodeBlock).toBe(true)
    })

    it('extracts code metadata', () => {
      const chunker = new SemanticChunker(EMBEDDING_CONFIGS.code)

      const text = `
\`\`\`typescript
import React from 'react'

export function ChatWindow() {
  return <div>Chat</div>
}

export const useChat = () => {
  return {}
}
\`\`\`
      `.trim()

      const chunks = chunker.chunk(text, {
        title: 'Code',
        url: '/code',
        category: 'example',
        tags: [],
        headings: [],
        lastUpdated: new Date().toISOString(),
      })

      const codeChunk = chunks.find(c => c.metadata.language)
      expect(codeChunk).toBeDefined()
      expect(codeChunk!.metadata.language).toBe('typescript')
      expect(codeChunk!.metadata.symbols).toContain('ChatWindow')
      expect(codeChunk!.metadata.symbols).toContain('useChat')
      expect(codeChunk!.metadata.imports).toContain('react')
    })

    it('includes prose context around code', () => {
      const chunker = new SemanticChunker(EMBEDDING_CONFIGS.code)

      const text = `
This is important context before the code.

\`\`\`typescript
const x = 1
\`\`\`

This is important context after the code.
      `.trim()

      const chunks = chunker.chunk(text, {
        title: 'Code with Context',
        url: '/code',
        category: 'example',
        tags: [],
        headings: [],
        lastUpdated: new Date().toISOString(),
      })

      const codeChunk = chunks.find(c => c.content.includes('```typescript'))
      expect(codeChunk).toBeDefined()
      // Should include surrounding context
      expect(codeChunk!.content.toLowerCase()).toMatch(/context/)
    })
  })

  describe('Chunk Metadata', () => {
    it('assigns sequential chunk indices', () => {
      const chunker = new SemanticChunker({
        ...EMBEDDING_CONFIGS.prose,
        maxChunkTokens: 20,
      })

      const text = 'A'.repeat(1000)
      const chunks = chunker.chunk(text, {
        title: 'Test',
        url: '/test',
        category: 'guide',
        tags: [],
        headings: [],
        lastUpdated: new Date().toISOString(),
      })

      chunks.forEach((chunk, i) => {
        expect(chunk.metadata.chunkIndex).toBe(i)
      })
    })

    it('sets total chunk count', () => {
      const chunker = new SemanticChunker({
        ...EMBEDDING_CONFIGS.prose,
        maxChunkTokens: 20,
      })

      const text = 'A'.repeat(1000)
      const chunks = chunker.chunk(text, {
        title: 'Test',
        url: '/test',
        category: 'guide',
        tags: [],
        headings: [],
        lastUpdated: new Date().toISOString(),
      })

      chunks.forEach(chunk => {
        expect(chunk.metadata.totalChunks).toBe(chunks.length)
      })
    })

    it('generates unique IDs', () => {
      const chunker = new SemanticChunker(EMBEDDING_CONFIGS.prose)

      const chunks = chunker.chunk('Test content', {
        title: 'Test',
        url: '/test',
        category: 'guide',
        tags: [],
        headings: [],
        lastUpdated: new Date().toISOString(),
      })

      const ids = chunks.map(c => c.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('estimates complexity correctly', () => {
      const chunker = new SemanticChunker(EMBEDDING_CONFIGS.mixed)

      // Simple prose
      const simple = chunker.chunk('This is simple text.', {
        title: 'Simple',
        url: '/simple',
        category: 'guide',
        tags: [],
        headings: [],
        lastUpdated: new Date().toISOString(),
      })
      expect(simple[0].metadata.complexity).toBe(1)

      // Complex code
      const complex = chunker.chunk(`
\`\`\`typescript
async function fetchData<T>(api: string): Promise<T> {
  const result = await fetch(api).then(r => r.json())
  return result as T
}
\`\`\`
      `, {
        title: 'Complex',
        url: '/complex',
        category: 'example',
        tags: [],
        headings: [],
        lastUpdated: new Date().toISOString(),
      })
      expect(complex[0].metadata.complexity).toBeGreaterThan(2)
    })

    it('extracts keywords automatically', () => {
      const chunker = new SemanticChunker(EMBEDDING_CONFIGS.prose)

      const chunks = chunker.chunk(
        'The ChatWindow component uses React hooks for streaming',
        {
          title: 'ChatWindow',
          url: '/components/chat-window',
          category: 'component',
          tags: [],
          headings: [],
          lastUpdated: new Date().toISOString(),
        }
      )

      expect(chunks[0].keywords.length).toBeGreaterThan(0)
      expect(chunks[0].keywords).toContain('chat')
      expect(chunks[0].keywords).toContain('react')
      expect(chunks[0].keywords).toContain('hooks')
      expect(chunks[0].keywords).toContain('streaming')
    })

    it('generates content fingerprints', () => {
      const chunker = new SemanticChunker(EMBEDDING_CONFIGS.prose)

      const chunks = chunker.chunk('Test content', {
        title: 'Test',
        url: '/test',
        category: 'guide',
        tags: [],
        headings: [],
        lastUpdated: new Date().toISOString(),
      })

      expect(chunks[0].metadata.fingerprint).toBeDefined()
      expect(typeof chunks[0].metadata.fingerprint).toBe('string')
      expect(chunks[0].metadata.fingerprint.length).toBeGreaterThan(0)
    })
  })
})

describe('Deduplication', () => {
  it('removes duplicate chunks', () => {
    const chunks: EnhancedChunk[] = [
      {
        id: '1',
        content: 'Same content',
        tokenCount: 2,
        keywords: [],
        metadata: {
          title: 'Test 1',
          url: '/test1',
          category: 'guide',
          headings: [],
          tags: [],
          chunkIndex: 0,
          totalChunks: 1,
          lastUpdated: new Date().toISOString(),
          fingerprint: generateFingerprint('Same content'),
        },
      },
      {
        id: '2',
        content: 'Same content',
        tokenCount: 2,
        keywords: [],
        metadata: {
          title: 'Test 2',
          url: '/test2',
          category: 'guide',
          headings: [],
          tags: [],
          chunkIndex: 0,
          totalChunks: 1,
          lastUpdated: new Date().toISOString(),
          fingerprint: generateFingerprint('Same content'),
        },
      },
      {
        id: '3',
        content: 'Different content',
        tokenCount: 2,
        keywords: [],
        metadata: {
          title: 'Test 3',
          url: '/test3',
          category: 'guide',
          headings: [],
          tags: [],
          chunkIndex: 0,
          totalChunks: 1,
          lastUpdated: new Date().toISOString(),
          fingerprint: generateFingerprint('Different content'),
        },
      },
    ]

    const unique = deduplicateChunks(chunks)
    expect(unique).toHaveLength(2)
  })

  it('preserves first occurrence', () => {
    const chunks: EnhancedChunk[] = [
      {
        id: 'first',
        content: 'Same',
        tokenCount: 1,
        keywords: [],
        metadata: {
          title: 'First',
          url: '/first',
          category: 'guide',
          headings: [],
          tags: [],
          chunkIndex: 0,
          totalChunks: 1,
          lastUpdated: new Date().toISOString(),
          fingerprint: generateFingerprint('Same'),
        },
      },
      {
        id: 'second',
        content: 'Same',
        tokenCount: 1,
        keywords: [],
        metadata: {
          title: 'Second',
          url: '/second',
          category: 'guide',
          headings: [],
          tags: [],
          chunkIndex: 0,
          totalChunks: 1,
          lastUpdated: new Date().toISOString(),
          fingerprint: generateFingerprint('Same'),
        },
      },
    ]

    const unique = deduplicateChunks(chunks)
    expect(unique[0].id).toBe('first')
  })
})

describe('Config Selection', () => {
  it('has appropriate configs for each content type', () => {
    expect(EMBEDDING_CONFIGS['api-reference'].model).toBe('text-embedding-3-large')
    expect(EMBEDDING_CONFIGS.code.model).toBe('text-embedding-3-large')
    expect(EMBEDDING_CONFIGS.prose.model).toBe('text-embedding-3-small')
    expect(EMBEDDING_CONFIGS.mixed.model).toBe('text-embedding-3-small')
  })

  it('api-reference has smaller chunks for precision', () => {
    expect(EMBEDDING_CONFIGS['api-reference'].maxChunkTokens).toBe(512)
    expect(EMBEDDING_CONFIGS.code.maxChunkTokens).toBeGreaterThan(
      EMBEDDING_CONFIGS['api-reference'].maxChunkTokens
    )
  })

  it('code config has larger chunks for context', () => {
    expect(EMBEDDING_CONFIGS.code.maxChunkTokens).toBe(1024)
  })
})
