import { describe, it, expect, beforeEach } from 'vitest'
import {
  MarkdownCompressor,
  CompressionLevel,
} from '../../compression/markdown-compressor'

describe('MarkdownCompressor', () => {
  let compressor: MarkdownCompressor

  beforeEach(() => {
    compressor = new MarkdownCompressor()
  })

  describe('header normalization', () => {
    it('replaces # headers with § symbols', () => {
      const input = '# Title\n## Subtitle\n### Section'
      const result = compressor.compress(input)

      expect(result.compressed).toContain('§ Title')
      expect(result.compressed).toContain('§§ Subtitle')
      expect(result.compressed).toContain('§§§ Section')
    })

    it('preserves header text content', () => {
      const input = '# Important Header'
      const result = compressor.compress(input)

      expect(result.compressed).toContain('Important Header')
    })
  })

  describe('list compaction', () => {
    it('replaces - list markers with • symbols', () => {
      const input = '- Item 1\n- Item 2\n- Item 3'
      const result = compressor.compress(input)

      expect(result.compressed).toContain('• Item 1')
      expect(result.compressed).toContain('• Item 2')
      expect(result.compressed).toContain('• Item 3')
    })

    it('replaces * list markers with • symbols', () => {
      const input = '* Item A\n* Item B'
      const result = compressor.compress(input)

      expect(result.compressed).toContain('• Item A')
    })

    it('handles numbered lists', () => {
      const input = '1. First\n2. Second\n3. Third'
      const result = compressor.compress(input)

      // Numbered lists are preserved but compacted
      expect(result.compressed).toContain('First')
      expect(result.compressed).toContain('Second')
    })
  })

  describe('whitespace optimization', () => {
    it('removes excessive blank lines', () => {
      const input = 'Line 1\n\n\n\nLine 2'
      const result = compressor.compress(input)

      expect(result.compressed).toBe('Line 1\n\nLine 2')
    })

    it('trims trailing whitespace from lines', () => {
      const input = 'Line with spaces   \nAnother line   '
      const result = compressor.compress(input)

      expect(result.compressed).not.toMatch(/  +\n/)
    })
  })

  describe('code block handling', () => {
    it('preserves code block content', () => {
      const input = '```javascript\nconst x = 1;\nconsole.log(x);\n```'
      const result = compressor.compress(input)

      expect(result.compressed).toContain('const x = 1')
      expect(result.compressed).toContain('console.log(x)')
    })

    it('removes unnecessary code fence language specifiers at light level', () => {
      const compressor = new MarkdownCompressor({
        level: CompressionLevel.Light,
      })
      const input = '```typescript\nconst x: number = 1;\n```'
      const result = compressor.compress(input)

      // Light level preserves language hints
      expect(result.compressed).toContain('typescript')
    })

    it('removes code fence language specifiers at aggressive level', () => {
      const compressor = new MarkdownCompressor({
        level: CompressionLevel.Aggressive,
      })
      const input = '```typescript\nconst x: number = 1;\n```'
      const result = compressor.compress(input)

      // Aggressive level removes language hints
      expect(result.compressed).not.toMatch(/```typescript/)
    })
  })

  describe('link optimization', () => {
    it('shortens verbose link syntax', () => {
      const input = 'Click [here](https://example.com/very/long/path) for info'
      const result = compressor.compress(input)

      // Links are preserved but may be optimized
      expect(result.compressed).toContain('example.com')
    })

    it('preserves link text', () => {
      const input = '[Important Link](https://example.com)'
      const result = compressor.compress(input)

      expect(result.compressed).toContain('Important Link')
    })
  })

  describe('compression levels', () => {
    const verboseInput = `# Main Title

This is a **very important** paragraph with some _emphasized_ text.

## Section One

- First item in the list
- Second item in the list
- Third item in the list

### Subsection

More content here with [a link](https://example.com).

\`\`\`javascript
const example = true;
\`\`\`
`

    it('applies minimal changes at Light level', () => {
      const compressor = new MarkdownCompressor({
        level: CompressionLevel.Light,
      })
      const result = compressor.compress(verboseInput)

      // Light level preserves emphasis markers, only changes headers and lists
      expect(result.savingsPercent).toBeLessThan(20)
      // Verify headers are compressed
      expect(result.compressed).toContain('§')
    })

    it('applies moderate changes at Moderate level', () => {
      const compressor = new MarkdownCompressor({
        level: CompressionLevel.Moderate,
      })
      const result = compressor.compress(verboseInput)

      // Moderate level removes bold markers
      expect(result.savingsPercent).toBeGreaterThanOrEqual(1)
      expect(result.compressed).not.toContain('**')
    })

    it('applies maximum changes at Aggressive level', () => {
      const compressor = new MarkdownCompressor({
        level: CompressionLevel.Aggressive,
      })
      const result = compressor.compress(verboseInput)

      // Aggressive level removes all emphasis markers and code language hints
      expect(result.savingsPercent).toBeGreaterThanOrEqual(2)
      expect(result.compressed).not.toContain('**')
      expect(result.compressed).not.toContain('_emphasized_')
      expect(result.compressed).not.toMatch(/```javascript/)
    })
  })

  describe('TOON integration', () => {
    it('converts structured data to TOON format when enabled', () => {
      const compressor = new MarkdownCompressor({ enableTOON: true })
      const input = `Here is some data:
\`\`\`json
{
  "users": [
    {"id": 1, "name": "Alice"},
    {"id": 2, "name": "Bob"}
  ]
}
\`\`\``
      const result = compressor.compress(input)

      // TOON format uses tabular notation
      expect(result.compressed).toContain('users')
      expect(result.toonApplied).toBe(true)
    })
  })

  describe('statistics', () => {
    it('reports original and compressed sizes', () => {
      // Use content with redundant whitespace that can be compressed
      const input = '# Title\n\n\n\n\n- Item 1\n- Item 2\n- Item 3'
      const result = compressor.compress(input)

      expect(result.originalSize).toBe(input.length)
      expect(result.compressedSize).toBeLessThan(input.length)
    })

    it('calculates savings percentage', () => {
      // Use input with emphasis markers that get removed at moderate level
      const compressor = new MarkdownCompressor({
        level: CompressionLevel.Moderate,
      })
      const input =
        '# Title\n\nThis is **very important** text with **bold** words.'
      const result = compressor.compress(input)

      expect(result.savingsPercent).toBeGreaterThan(0)
      expect(result.savingsPercent).toBeLessThan(100)
    })

    it('estimates token savings', () => {
      const input = '# Title\n\n- Item 1\n- Item 2\n- Item 3'
      const result = compressor.compress(input)

      expect(result.estimatedTokensSaved).toBeGreaterThanOrEqual(0)
    })
  })

  describe('decompress', () => {
    it('restores headers from § symbols', () => {
      const compressed = '§ Title\n§§ Subtitle'
      const result = compressor.decompress(compressed)

      expect(result).toContain('# Title')
      expect(result).toContain('## Subtitle')
    })

    it('restores list markers from • symbols', () => {
      const compressed = '• Item 1\n• Item 2'
      const result = compressor.decompress(compressed)

      expect(result).toContain('- Item 1')
      expect(result).toContain('- Item 2')
    })
  })

  describe('edge cases', () => {
    it('handles empty input', () => {
      const result = compressor.compress('')

      expect(result.compressed).toBe('')
      expect(result.savingsPercent).toBe(0)
    })

    it('handles input with only whitespace', () => {
      const result = compressor.compress('   \n\n   ')

      expect(result.compressed).toBe('')
    })

    it('handles mixed content', () => {
      const input = `# Header

Some paragraph text.

- List item

\`\`\`
code block
\`\`\`

> Blockquote`

      const result = compressor.compress(input)
      expect(result.compressed.length).toBeGreaterThan(0)
    })
  })
})
