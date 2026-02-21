import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MarkdownOptimizer | Token Optimization API',
  description:
    'Markdown-aware compression with structure preservation. Strip formatting, compress content, and extract code blocks while maintaining readability.',
}

export default function MarkdownOptimizerPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <header>
        <h1 className="text-4xl font-bold mb-4">MarkdownOptimizer</h1>
        <p className="text-xl text-muted-foreground">
          Optimize markdown content for token reduction while preserving structure and readability.
          Reduce token usage by 10-20% through intelligent formatting removal.
        </p>
      </header>

      {/* Overview */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Overview</h2>
        <p className="mb-4">
          The <code>MarkdownOptimizer</code> provides utilities for reducing token usage in markdown
          content. It can strip all formatting to plain text, selectively compress while preserving
          important structure, or extract code blocks for separate processing.
        </p>
        <div className="bg-muted p-6 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold">Key Features</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Strip markdown to plain text (10-20% token reduction)</li>
            <li>Selective compression with structure preservation</li>
            <li>Extract and analyze code blocks with metadata</li>
            <li>Estimate token savings before processing</li>
            <li>Configurable compression levels</li>
            <li>Remove or preserve specific markdown elements</li>
          </ul>
        </div>
      </section>

      {/* Import */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Import</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code className="text-sm">
            {`import {
  MarkdownOptimizer,
  stripMarkdown,
  compressMarkdown,
  type MarkdownCompressOptions,
  type CodeBlock,
  type SavingsEstimate,
} from '@clarity-chat/token-optimization'`}
          </code>
        </pre>
      </section>

      {/* Optimization Methods */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Optimization Methods</h2>
        <p className="mb-6">
          MarkdownOptimizer provides three main approaches to reducing markdown token usage:
        </p>

        <div className="space-y-6">
          {/* Strip Markdown */}
          <div className="border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Strip Markdown (Complete Removal)</h3>
            <p className="mb-4">
              Remove all markdown formatting and convert to plain text. This provides the maximum
              token reduction (10-20%) but removes all visual structure.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-green-600 mb-2">Best For:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>LLM input where formatting doesn't matter</li>
                  <li>Cost-sensitive applications</li>
                  <li>Content analysis and extraction</li>
                  <li>Maximum token reduction</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-600 mb-2">Avoid For:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>User-facing display</li>
                  <li>When structure is important</li>
                  <li>Code-heavy documents</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 bg-muted/50 p-3 rounded">
              <p className="text-sm">
                <strong>Typical Reduction:</strong> 10-20% tokens | <strong>Method:</strong>{' '}
                <code>stripMarkdown(text)</code>
              </p>
            </div>
          </div>

          {/* Compress Markdown */}
          <div className="border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Compress Markdown (Selective Removal)</h3>
            <p className="mb-4">
              Selectively remove markdown formatting while preserving important structural elements
              like headers and code blocks. Balances token reduction with readability.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-green-600 mb-2">Best For:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Documentation summaries</li>
                  <li>Preserving document hierarchy</li>
                  <li>Readable compressed content</li>
                  <li>Balanced token/quality trade-off</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-600 mb-2">Avoid For:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>When all formatting must be preserved</li>
                  <li>Highly styled content</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 bg-muted/50 p-3 rounded">
              <p className="text-sm">
                <strong>Typical Reduction:</strong> 5-15% tokens | <strong>Method:</strong>{' '}
                <code>compressMarkdown(text, options)</code>
              </p>
            </div>
          </div>

          {/* Extract Code Blocks */}
          <div className="border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Extract Code Blocks</h3>
            <p className="mb-4">
              Extract all code blocks with metadata for separate processing. Useful for analyzing
              code separately from prose or processing code blocks differently.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-green-600 mb-2">Best For:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Code analysis and extraction</li>
                  <li>Separating code from documentation</li>
                  <li>Language-specific processing</li>
                  <li>Token counting by content type</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-600 mb-2">Avoid For:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Simple markdown processing</li>
                  <li>Documents without code blocks</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 bg-muted/50 p-3 rounded">
              <p className="text-sm">
                <strong>Returns:</strong> Array of code blocks with language and line numbers |{' '}
                <strong>Method:</strong> <code>extractCodeBlocks(text)</code>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* stripMarkdown() Method */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">stripMarkdown() Method</h2>
        <p className="mb-4">
          Remove all markdown formatting and convert to plain text. Provides maximum token reduction.
        </p>

        <div className="space-y-6">
          {/* Signature */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Signature</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">{`stripMarkdown(text: string): string`}</code>
            </pre>
          </div>

          {/* Parameters */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Parameters</h3>
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">
                <code>text</code> <span className="text-muted-foreground">(string)</span>
              </h4>
              <p className="text-sm">The markdown text to strip of formatting.</p>
            </div>
          </div>

          {/* Return Value */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Return Value</h3>
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">
                <code>string</code>
              </h4>
              <p className="text-sm">Plain text with all markdown formatting removed.</p>
            </div>
          </div>

          {/* What Gets Removed */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Formatting Removed</h3>
            <div className="bg-muted/50 p-4 rounded space-y-2 text-sm">
              <div>• Headers (# ## ###) → Plain text</div>
              <div>• Bold (**text**) → text</div>
              <div>• Italic (*text*) → text</div>
              <div>• Links [text](url) → text</div>
              <div>• Images ![alt](url) → alt text</div>
              <div>• Code blocks ```lang...``` → code content only</div>
              <div>• Inline code `code` → code</div>
              <div>• Lists (- * 1.) → Plain text lines</div>
              <div>• Blockquotes (&gt;) → Plain text</div>
              <div>• Horizontal rules (---) → Removed</div>
              <div>• Tables → Simplified text</div>
            </div>
          </div>
        </div>
      </section>

      {/* compressMarkdown() Method */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">compressMarkdown() Method</h2>
        <p className="mb-4">
          Selectively compress markdown while preserving important structural elements based on
          configuration options.
        </p>

        <div className="space-y-6">
          {/* Signature */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Signature</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">
                {`compressMarkdown(
  text: string,
  options?: MarkdownCompressOptions
): string`}
              </code>
            </pre>
          </div>

          {/* Parameters */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Parameters</h3>
            <div className="space-y-4">
              <div className="border border-border rounded-lg p-4">
                <h4 className="font-semibold mb-2">
                  <code>text</code> <span className="text-muted-foreground">(string)</span>
                </h4>
                <p className="text-sm">The markdown text to compress.</p>
              </div>
              <div className="border border-border rounded-lg p-4">
                <h4 className="font-semibold mb-2">
                  <code>options</code>{' '}
                  <span className="text-muted-foreground">(MarkdownCompressOptions, optional)</span>
                </h4>
                <p className="text-sm mb-3">Configuration for selective compression.</p>
                <div className="bg-muted/50 p-3 rounded space-y-2 text-sm">
                  <div>
                    <code className="font-semibold">preserveHeaders?</code>: boolean - Keep header
                    formatting (# ## ###). Default: true
                  </div>
                  <div>
                    <code className="font-semibold">preserveLinks?</code>: boolean - Keep link
                    formatting [text](url). Default: false
                  </div>
                  <div>
                    <code className="font-semibold">preserveCodeBlocks?</code>: boolean - Keep code
                    blocks with fences. Default: true
                  </div>
                  <div>
                    <code className="font-semibold">preserveEmphasis?</code>: boolean - Keep bold and
                    italic formatting. Default: false
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Return Value */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Return Value</h3>
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">
                <code>string</code>
              </h4>
              <p className="text-sm">
                Compressed markdown with selective formatting preserved based on options.
              </p>
            </div>
          </div>

          {/* Compression Presets */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Common Compression Presets</h3>
            <div className="space-y-4">
              <div className="border border-border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Maximum Compression</h4>
                <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                  <code>
                    {`{
  preserveHeaders: false,
  preserveLinks: false,
  preserveCodeBlocks: false,
  preserveEmphasis: false
}`}
                  </code>
                </pre>
                <p className="text-sm text-muted-foreground mt-2">
                  Removes almost everything, similar to stripMarkdown() but with whitespace
                  normalization
                </p>
              </div>

              <div className="border border-border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Balanced (Default)</h4>
                <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                  <code>
                    {`{
  preserveHeaders: true,
  preserveLinks: false,
  preserveCodeBlocks: true,
  preserveEmphasis: false
}`}
                  </code>
                </pre>
                <p className="text-sm text-muted-foreground mt-2">
                  Keeps document structure (headers, code) but removes decorative formatting
                </p>
              </div>

              <div className="border border-border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Conservative</h4>
                <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                  <code>
                    {`{
  preserveHeaders: true,
  preserveLinks: true,
  preserveCodeBlocks: true,
  preserveEmphasis: true
}`}
                  </code>
                </pre>
                <p className="text-sm text-muted-foreground mt-2">
                  Only normalizes whitespace, preserves all formatting
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* extractCodeBlocks() Method */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">extractCodeBlocks() Method</h2>
        <p className="mb-4">
          Extract all fenced code blocks from markdown with metadata including language and line
          numbers.
        </p>

        <div className="space-y-6">
          {/* Signature */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Signature</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">{`extractCodeBlocks(text: string): CodeBlock[]`}</code>
            </pre>
          </div>

          {/* Parameters */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Parameters</h3>
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">
                <code>text</code> <span className="text-muted-foreground">(string)</span>
              </h4>
              <p className="text-sm">The markdown text containing code blocks.</p>
            </div>
          </div>

          {/* Return Value */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Return Value</h3>
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">
                <code>CodeBlock[]</code>
              </h4>
              <p className="text-sm mb-3">
                Array of extracted code blocks with metadata. Each block contains:
              </p>
              <div className="bg-muted/50 p-3 rounded space-y-2 text-sm">
                <div>
                  <code className="font-semibold">language</code>: string - Programming language
                  identifier (e.g., 'typescript', 'python', or empty string)
                </div>
                <div>
                  <code className="font-semibold">code</code>: string - The code content without fence
                  markers
                </div>
                <div>
                  <code className="font-semibold">startLine</code>: number - Starting line number in
                  original document (1-indexed)
                </div>
                <div>
                  <code className="font-semibold">endLine</code>: number - Ending line number in
                  original document (1-indexed)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* estimateSavings() Method */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">estimateSavings() Method</h2>
        <p className="mb-4">
          Calculate the potential token savings from stripping markdown formatting. Useful for
          deciding whether optimization is worthwhile.
        </p>

        <div className="space-y-6">
          {/* Signature */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Signature</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">{`estimateSavings(text: string): SavingsEstimate`}</code>
            </pre>
          </div>

          {/* Parameters */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Parameters</h3>
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">
                <code>text</code> <span className="text-muted-foreground">(string)</span>
              </h4>
              <p className="text-sm">The markdown text to analyze for potential savings.</p>
            </div>
          </div>

          {/* Return Value */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Return Value</h3>
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">
                <code>SavingsEstimate</code>
              </h4>
              <div className="bg-muted/50 p-3 rounded space-y-2 text-sm">
                <div>
                  <code className="font-semibold">originalTokens</code>: number - Estimated token count
                  for original markdown
                </div>
                <div>
                  <code className="font-semibold">strippedTokens</code>: number - Estimated token count
                  after stripping
                </div>
                <div>
                  <code className="font-semibold">savingsPercent</code>: number - Percentage of tokens
                  saved (0-100)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Examples */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Usage Examples</h2>

        <div className="space-y-6">
          {/* Basic Strip */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Example 1: Strip Formatting (Quick)</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">
                {`import { stripMarkdown } from '@clarity-chat/token-optimization'

const markdown = \`
# Welcome to the Guide

This is **important** information with a [link](https://example.com).

\\\`\\\`\\\`javascript
console.log('Hello World')
\\\`\\\`\\\`
\`

const plainText = stripMarkdown(markdown)
// Result:
// 'Welcome to the Guide
//
// This is important information with a link.
//
// console.log('Hello World')'`}
              </code>
            </pre>
          </div>

          {/* Class Instance */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Example 2: Using Class Instance</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">
                {`import { MarkdownOptimizer } from '@clarity-chat/token-optimization'

const optimizer = new MarkdownOptimizer()

// Strip all formatting
const plain = optimizer.stripMarkdown(markdown)

// Estimate savings first
const savings = optimizer.estimateSavings(markdown)
console.log(\`Can save \${savings.savingsPercent}% tokens\`)

if (savings.savingsPercent > 15) {
  // Worth stripping for this content
  const stripped = optimizer.stripMarkdown(markdown)
}`}
              </code>
            </pre>
          </div>

          {/* Selective Compression */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Example 3: Selective Compression</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">
                {`import { compressMarkdown } from '@clarity-chat/token-optimization'

const markdown = \`
# Documentation

## Setup

First, install the package:

\\\`\\\`\\\`bash
npm install package
\\\`\\\`\\\`

Then **import** it in your code.

Visit [our site](https://example.com) for more details.
\`

// Keep headers and code, remove other formatting
const compressed = compressMarkdown(markdown, {
  preserveHeaders: true,
  preserveCodeBlocks: true,
  preserveLinks: false,
  preserveEmphasis: false
})

// Result:
// '# Documentation
//
// ## Setup
//
// First, install the package:
//
// \`\`\`bash
// npm install package
// \`\`\`
//
// Then import it in your code.
//
// Visit our site for more details.'`}
              </code>
            </pre>
          </div>

          {/* Extract Code Blocks */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Example 4: Extract Code Blocks</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">
                {`import { MarkdownOptimizer } from '@clarity-chat/token-optimization'

const optimizer = new MarkdownOptimizer()

const markdown = \`
# API Examples

TypeScript example:
\\\`\\\`\\\`typescript
const greeting: string = 'Hello'
console.log(greeting)
\\\`\\\`\\\`

Python example:
\\\`\\\`\\\`python
greeting = "Hello"
print(greeting)
\\\`\\\`\\\`
\`

const blocks = optimizer.extractCodeBlocks(markdown)

blocks.forEach(block => {
  console.log(\`Language: \${block.language}\`)
  console.log(\`Lines: \${block.startLine}-\${block.endLine}\`)
  console.log(\`Code: \${block.code}\`)
})

// Output:
// Language: typescript
// Lines: 5-8
// Code: const greeting: string = 'Hello'
// console.log(greeting)
//
// Language: python
// Lines: 12-15
// Code: greeting = "Hello"
// print(greeting)`}
              </code>
            </pre>
          </div>

          {/* Remove Code Blocks */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Example 5: Remove Code Blocks</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">
                {`import { MarkdownOptimizer } from '@clarity-chat/token-optimization'

const optimizer = new MarkdownOptimizer()

// Remove code blocks entirely (useful for token counting prose only)
const withoutCode = optimizer.removeCodeBlocks(markdown)

// Or extract prose and code separately
const blocks = optimizer.extractCodeBlocks(markdown)
const proseOnly = optimizer.removeCodeBlocks(markdown)

// Count tokens separately
const proseTokens = tokenCounter.count(proseOnly)
const codeTokens = blocks.reduce((sum, block) =>
  sum + tokenCounter.count(block.code), 0
)

console.log(\`Prose: \${proseTokens} tokens\`)
console.log(\`Code: \${codeTokens} tokens\`)
console.log(\`Total: \${proseTokens + codeTokens} tokens\`)`}
              </code>
            </pre>
          </div>

          {/* Conditional Optimization */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Example 6: Conditional Optimization</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">
                {`import { MarkdownOptimizer } from '@clarity-chat/token-optimization'

const optimizer = new MarkdownOptimizer()

function optimizeForContext(markdown: string, contextLimit: number) {
  const savings = optimizer.estimateSavings(markdown)

  // Check if we need optimization
  if (savings.originalTokens < contextLimit) {
    // Within limit, no optimization needed
    return markdown
  }

  // Try compression first
  const compressed = optimizer.compressMarkdown(markdown)
  const compressedTokens = tokenCounter.count(compressed)

  if (compressedTokens < contextLimit) {
    return compressed
  }

  // Still too large, strip all formatting
  const stripped = optimizer.stripMarkdown(markdown)
  return stripped
}

// Use in chat context
const optimized = optimizeForContext(userMessage, 4096)`}
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* Token Savings Guide */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Token Savings by Content Type</h2>
        <p className="mb-4">
          Token savings vary based on how heavily formatted your markdown content is:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border p-3 text-left">Content Type</th>
                <th className="border border-border p-3 text-left">Formatting Level</th>
                <th className="border border-border p-3 text-left">Typical Savings</th>
                <th className="border border-border p-3 text-left">Best Method</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border p-3">Plain text</td>
                <td className="border border-border p-3 text-sm">Minimal markdown</td>
                <td className="border border-border p-3">2-5%</td>
                <td className="border border-border p-3">Not worth optimizing</td>
              </tr>
              <tr className="bg-muted/50">
                <td className="border border-border p-3">Documentation</td>
                <td className="border border-border p-3 text-sm">Headers, code blocks, links</td>
                <td className="border border-border p-3">10-15%</td>
                <td className="border border-border p-3">compressMarkdown</td>
              </tr>
              <tr>
                <td className="border border-border p-3">Blog posts</td>
                <td className="border border-border p-3 text-sm">Heavy emphasis, many links</td>
                <td className="border border-border p-3">15-20%</td>
                <td className="border border-border p-3">stripMarkdown</td>
              </tr>
              <tr className="bg-muted/50">
                <td className="border border-border p-3">Technical docs</td>
                <td className="border border-border p-3 text-sm">
                  Headers, lists, code blocks
                </td>
                <td className="border border-border p-3">12-18%</td>
                <td className="border border-border p-3">compressMarkdown</td>
              </tr>
              <tr>
                <td className="border border-border p-3">README files</td>
                <td className="border border-border p-3 text-sm">Badges, tables, sections</td>
                <td className="border border-border p-3">18-25%</td>
                <td className="border border-border p-3">stripMarkdown</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Best Practices */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Best Practices</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-semibold mb-2">Estimate savings first</h3>
            <p className="text-sm text-muted-foreground">
              Use <code>estimateSavings()</code> to check if optimization is worthwhile. Don't
              optimize content that only saves 2-3% tokens.
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-semibold mb-2">Use compression for user-facing content</h3>
            <p className="text-sm text-muted-foreground">
              When displaying compressed markdown to users, use <code>compressMarkdown()</code> to
              maintain readability with headers and code blocks.
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-semibold mb-2">Strip for LLM input</h3>
            <p className="text-sm text-muted-foreground">
              When sending markdown to LLMs that don't need formatting (like for analysis),
              use <code>stripMarkdown()</code> for maximum token savings.
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-semibold mb-2">Extract code blocks separately</h3>
            <p className="text-sm text-muted-foreground">
              For documents with code examples, extract code blocks to process them with different
              compression strategies or token counting.
            </p>
          </div>

          <div className="border-l-4 border-yellow-500 pl-4">
            <h3 className="font-semibold mb-2">Don't optimize code-heavy documents</h3>
            <p className="text-sm text-muted-foreground">
              Documents that are mostly code blocks won't see significant savings from markdown
              optimization. Consider code-specific optimization instead.
            </p>
          </div>

          <div className="border-l-4 border-yellow-500 pl-4">
            <h3 className="font-semibold mb-2">Preserve structure for complex documents</h3>
            <p className="text-sm text-muted-foreground">
              For technical documentation with important hierarchy, use compression with{' '}
              <code>preserveHeaders: true</code> rather than complete stripping.
            </p>
          </div>
        </div>
      </section>

      {/* Related APIs */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Related APIs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/api/token-optimization/adaptive-compressor"
            className="border border-border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">AdaptiveCompressor</h3>
            <p className="text-sm text-muted-foreground">
              Intelligent compression with automatic strategy selection
            </p>
          </a>
          <a
            href="/api/token-optimization/model-pricing"
            className="border border-border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">ModelPricing</h3>
            <p className="text-sm text-muted-foreground">
              Calculate cost savings from token reduction
            </p>
          </a>
          <a
            href="/api/token-optimization/cost-tracker"
            className="border border-border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">CostTracker</h3>
            <p className="text-sm text-muted-foreground">Track token usage and optimization impact</p>
          </a>
          <a
            href="/api/token-optimization"
            className="border border-border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Token Optimization Overview</h3>
            <p className="text-sm text-muted-foreground">Complete token optimization system guide</p>
          </a>
        </div>
      </section>
    </div>
  )
}
