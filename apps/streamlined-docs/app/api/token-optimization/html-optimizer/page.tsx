import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HTMLOptimizer | Token Optimization API',
  description:
    'Convert HTML to text or markdown for token-efficient LLM processing. Reduce token usage while preserving semantic structure and readability.',
}

export default function HTMLOptimizerPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <header>
        <h1 className="text-4xl font-bold mb-4">HTMLOptimizer</h1>
        <p className="text-xl text-muted-foreground">
          Convert HTML content to plain text or markdown format for optimal token usage in LLM
          applications while preserving semantic meaning.
        </p>
      </header>

      {/* Overview */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Overview</h2>
        <p className="mb-4">
          The <code>HTMLOptimizer</code> transforms verbose HTML into concise text or markdown
          representations, dramatically reducing token usage when processing web content with LLMs.
          It intelligently extracts semantic information while removing unnecessary markup.
        </p>
        <div className="bg-muted p-6 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold">Key Features</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Convert HTML to plain text (removes all tags)</li>
            <li>Convert HTML to markdown (preserves semantic structure)</li>
            <li>Smart handling of common HTML elements (links, lists, tables, code)</li>
            <li>Automatic HTML entity decoding</li>
            <li>Whitespace normalization</li>
            <li>Configurable link and structure preservation</li>
          </ul>
        </div>
      </section>

      {/* Use Cases */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Common Use Cases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Web Scraping</h3>
            <p className="text-sm text-muted-foreground">
              Convert scraped HTML pages to clean text for LLM analysis, reducing token usage by
              60-80%.
            </p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Documentation Processing</h3>
            <p className="text-sm text-muted-foreground">
              Extract documentation from HTML sources while maintaining structure through markdown
              conversion.
            </p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Email Processing</h3>
            <p className="text-sm text-muted-foreground">
              Convert HTML emails to readable text for analysis, removing styling and tracking
              pixels.
            </p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Content Summarization</h3>
            <p className="text-sm text-muted-foreground">
              Prepare web articles for summarization by extracting core content without HTML
              verbosity.
            </p>
          </div>
        </div>
      </section>

      {/* Import */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Import</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code className="text-sm">
            {`import {
  HTMLOptimizer,
  htmlToText,
  htmlToMarkdown,
  type HTMLToTextOptions,
} from '@clarity-chat/token-optimization'`}
          </code>
        </pre>
      </section>

      {/* Quick Start */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Quick Start</h2>
        <div className="space-y-6">
          {/* Basic Usage */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Basic Usage</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">
                {`import { htmlToText, htmlToMarkdown } from '@clarity-chat/token-optimization'

// Convert to plain text
const text = htmlToText('<h1>Hello</h1><p>World</p>')
// Result: 'Hello\\n\\nWorld'

// Convert to markdown
const markdown = htmlToMarkdown('<h1>Hello</h1><p><strong>World</strong></p>')
// Result: '# Hello\\n\\n**World**'`}
              </code>
            </pre>
          </div>

          {/* Class Instance */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Using Class Instance</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">
                {`import { HTMLOptimizer } from '@clarity-chat/token-optimization'

const optimizer = new HTMLOptimizer()

// Convert with options
const text = optimizer.htmlToText(htmlContent, {
  preserveLinks: true,      // Keep URLs in output
  preserveStructure: true   // Maintain paragraphs and headers
})`}
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* Methods */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Methods</h2>
        <div className="space-y-8">
          {/* htmlToText */}
          <div className="border border-border rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-4">htmlToText()</h3>
            <p className="mb-4">
              Converts HTML to plain text, stripping all markup while preserving readability.
            </p>

            {/* Signature */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3">Signature</h4>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code className="text-sm">
                  {`htmlToText(html: string, options?: HTMLToTextOptions): string`}
                </code>
              </pre>
            </div>

            {/* Parameters */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3">Parameters</h4>
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded">
                  <code className="font-semibold">html</code>{' '}
                  <span className="text-muted-foreground">(string)</span>
                  <p className="text-sm mt-2">The HTML content to convert.</p>
                </div>
                <div className="bg-muted/50 p-4 rounded">
                  <code className="font-semibold">options</code>{' '}
                  <span className="text-muted-foreground">(HTMLToTextOptions, optional)</span>
                  <div className="mt-3 space-y-2 text-sm">
                    <div>
                      <code className="font-semibold">preserveLinks?</code>: boolean - Keep link URLs
                      in format "text (url)". Default: false
                    </div>
                    <div>
                      <code className="font-semibold">preserveStructure?</code>: boolean - Maintain
                      paragraph breaks and header emphasis. Default: true
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Return Value */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3">Return Value</h4>
              <div className="bg-muted/50 p-4 rounded">
                <code className="font-semibold">string</code>
                <p className="text-sm mt-2">Plain text representation of the HTML content.</p>
              </div>
            </div>

            {/* Examples */}
            <div>
              <h4 className="text-lg font-semibold mb-3">Examples</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Basic conversion:</p>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm">
                      {`const html = '<p>Hello <strong>World</strong>!</p>'
const text = optimizer.htmlToText(html)
// Result: 'Hello World!'`}
                    </code>
                  </pre>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">With structure preservation:</p>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm">
                      {`const html = \`
  <h1>Title</h1>
  <p>First paragraph.</p>
  <p>Second paragraph.</p>
\`
const text = optimizer.htmlToText(html, { preserveStructure: true })
// Result: 'Title\\n\\nFirst paragraph.\\n\\nSecond paragraph.'`}
                    </code>
                  </pre>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">With link preservation:</p>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm">
                      {`const html = '<a href="https://example.com">Visit site</a>'
const text = optimizer.htmlToText(html, { preserveLinks: true })
// Result: 'Visit site (https://example.com)'`}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* htmlToMarkdown */}
          <div className="border border-border rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-4">htmlToMarkdown()</h3>
            <p className="mb-4">
              Converts HTML to markdown format, preserving semantic structure while reducing
              verbosity.
            </p>

            {/* Signature */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3">Signature</h4>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code className="text-sm">{`htmlToMarkdown(html: string): string`}</code>
              </pre>
            </div>

            {/* Parameters */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3">Parameters</h4>
              <div className="bg-muted/50 p-4 rounded">
                <code className="font-semibold">html</code>{' '}
                <span className="text-muted-foreground">(string)</span>
                <p className="text-sm mt-2">The HTML content to convert to markdown.</p>
              </div>
            </div>

            {/* Return Value */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3">Return Value</h4>
              <div className="bg-muted/50 p-4 rounded">
                <code className="font-semibold">string</code>
                <p className="text-sm mt-2">Markdown representation of the HTML content.</p>
              </div>
            </div>

            {/* Examples */}
            <div>
              <h4 className="text-lg font-semibold mb-3">Examples</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Headers and emphasis:</p>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm">
                      {`const html = \`
  <h1>Getting Started</h1>
  <p>This guide covers the <em>basics</em> of our <strong>API</strong>.</p>
\`
const markdown = optimizer.htmlToMarkdown(html)
// Result: '# Getting Started\\n\\nThis guide covers the *basics* of our **API**.'`}
                    </code>
                  </pre>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Lists:</p>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm">
                      {`const html = \`
  <ul>
    <li>Import the package</li>
    <li>Initialize with config</li>
    <li>Call the methods</li>
  </ul>
\`
const markdown = optimizer.htmlToMarkdown(html)
// Result: '- Import the package\\n- Initialize with config\\n- Call the methods'`}
                    </code>
                  </pre>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Code blocks:</p>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm">
                      {`const html = '<pre><code>npm install my-package</code></pre>'
const markdown = optimizer.htmlToMarkdown(html)
// Result: '\`\`\`\\nnpm install my-package\\n\`\`\`'`}
                    </code>
                  </pre>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Links and images:</p>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm">
                      {`const html = \`
  <p>Visit <a href="https://example.com">our docs</a>.</p>
  <img src="logo.png" alt="Logo" />
\`
const markdown = optimizer.htmlToMarkdown(html)
// Result: 'Visit [our docs](https://example.com).\\n\\n![Logo](logo.png)'`}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Convenience Functions */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Convenience Functions</h2>
        <p className="mb-4">
          For one-off conversions, use the convenience functions instead of creating a class
          instance.
        </p>

        <div className="space-y-6">
          {/* htmlToText function */}
          <div className="border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">htmlToText()</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Quick function to convert HTML to plain text without creating an optimizer instance.
            </p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">
                {`import { htmlToText } from '@clarity-chat/token-optimization'

const text = htmlToText('<h1>Hello</h1><p>World</p>')
// Result: 'Hello\\n\\nWorld'`}
              </code>
            </pre>
          </div>

          {/* htmlToMarkdown function */}
          <div className="border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">htmlToMarkdown()</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Quick function to convert HTML to markdown without creating an optimizer instance.
            </p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">
                {`import { htmlToMarkdown } from '@clarity-chat/token-optimization'

const markdown = htmlToMarkdown('<h1>Hello</h1><p><strong>World</strong></p>')
// Result: '# Hello\\n\\n**World**'`}
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* Supported HTML Elements */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Supported HTML Elements</h2>
        <p className="mb-6">
          HTMLOptimizer intelligently handles a wide range of HTML elements to extract semantic
          meaning.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border p-3 text-left">Category</th>
                <th className="border border-border p-3 text-left">Elements</th>
                <th className="border border-border p-3 text-left">Text Output</th>
                <th className="border border-border p-3 text-left">Markdown Output</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border p-3 font-semibold">Headers</td>
                <td className="border border-border p-3 text-sm">
                  <code>h1</code>-<code>h6</code>
                </td>
                <td className="border border-border p-3 text-sm">Double newline separation</td>
                <td className="border border-border p-3 text-sm">
                  <code># ## ### #### ##### ######</code>
                </td>
              </tr>
              <tr className="bg-muted/50">
                <td className="border border-border p-3 font-semibold">Emphasis</td>
                <td className="border border-border p-3 text-sm">
                  <code>strong</code>, <code>b</code>, <code>em</code>, <code>i</code>
                </td>
                <td className="border border-border p-3 text-sm">Plain text</td>
                <td className="border border-border p-3 text-sm">
                  <code>**bold**</code>, <code>*italic*</code>
                </td>
              </tr>
              <tr>
                <td className="border border-border p-3 font-semibold">Lists</td>
                <td className="border border-border p-3 text-sm">
                  <code>ul</code>, <code>ol</code>, <code>li</code>
                </td>
                <td className="border border-border p-3 text-sm">
                  <code>- item</code>
                </td>
                <td className="border border-border p-3 text-sm">
                  <code>- item</code> or <code>1. item</code>
                </td>
              </tr>
              <tr className="bg-muted/50">
                <td className="border border-border p-3 font-semibold">Links</td>
                <td className="border border-border p-3 text-sm">
                  <code>a</code>
                </td>
                <td className="border border-border p-3 text-sm">
                  Text only (or <code>text (url)</code> with <code>preserveLinks</code>)
                </td>
                <td className="border border-border p-3 text-sm">
                  <code>[text](url)</code>
                </td>
              </tr>
              <tr>
                <td className="border border-border p-3 font-semibold">Images</td>
                <td className="border border-border p-3 text-sm">
                  <code>img</code>
                </td>
                <td className="border border-border p-3 text-sm">Alt text only</td>
                <td className="border border-border p-3 text-sm">
                  <code>![alt](src)</code>
                </td>
              </tr>
              <tr className="bg-muted/50">
                <td className="border border-border p-3 font-semibold">Code</td>
                <td className="border border-border p-3 text-sm">
                  <code>code</code>, <code>pre</code>
                </td>
                <td className="border border-border p-3 text-sm">Plain code text</td>
                <td className="border border-border p-3 text-sm">
                  <code>`inline`</code> or <code>```block```</code>
                </td>
              </tr>
              <tr>
                <td className="border border-border p-3 font-semibold">Quotes</td>
                <td className="border border-border p-3 text-sm">
                  <code>blockquote</code>
                </td>
                <td className="border border-border p-3 text-sm">
                  <code>&gt; text</code>
                </td>
                <td className="border border-border p-3 text-sm">
                  <code>&gt; text</code>
                </td>
              </tr>
              <tr className="bg-muted/50">
                <td className="border border-border p-3 font-semibold">Tables</td>
                <td className="border border-border p-3 text-sm">
                  <code>table</code>, <code>tr</code>, <code>th</code>, <code>td</code>
                </td>
                <td className="border border-border p-3 text-sm">
                  <code>cell | cell</code>
                </td>
                <td className="border border-border p-3 text-sm">
                  <code>| cell | cell |</code> with separators
                </td>
              </tr>
              <tr>
                <td className="border border-border p-3 font-semibold">Structural</td>
                <td className="border border-border p-3 text-sm">
                  <code>p</code>, <code>div</code>, <code>br</code>, <code>hr</code>
                </td>
                <td className="border border-border p-3 text-sm">Whitespace normalization</td>
                <td className="border border-border p-3 text-sm">Preserved with markdown syntax</td>
              </tr>
              <tr className="bg-muted/50">
                <td className="border border-border p-3 font-semibold">Removed</td>
                <td className="border border-border p-3 text-sm">
                  <code>script</code>, <code>style</code>, <code>noscript</code>
                </td>
                <td className="border border-border p-3 text-sm">Completely removed</td>
                <td className="border border-border p-3 text-sm">Completely removed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* HTML Entities */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">HTML Entity Handling</h2>
        <p className="mb-4">
          HTMLOptimizer automatically decodes HTML entities to their character representations.
        </p>

        <div className="space-y-4">
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Named Entities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              <div>
                <code>&amp;nbsp;</code> → space
              </div>
              <div>
                <code>&amp;amp;</code> → &amp;
              </div>
              <div>
                <code>&amp;lt;</code> → &lt;
              </div>
              <div>
                <code>&amp;gt;</code> → &gt;
              </div>
              <div>
                <code>&amp;quot;</code> → &quot;
              </div>
              <div>
                <code>&amp;apos;</code> → &apos;
              </div>
              <div>
                <code>&amp;mdash;</code> → --
              </div>
              <div>
                <code>&amp;ndash;</code> → -
              </div>
              <div>
                <code>&amp;hellip;</code> → ...
              </div>
              <div>
                <code>&amp;copy;</code> → (c)
              </div>
              <div>
                <code>&amp;reg;</code> → (R)
              </div>
              <div>
                <code>&amp;trade;</code> → (TM)
              </div>
            </div>
          </div>

          <div className="border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Numeric Entities</h3>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Decimal:</strong> <code>&amp;#8364;</code> → € (Euro symbol)
              </div>
              <div>
                <strong>Hexadecimal:</strong> <code>&amp;#x20AC;</code> → € (Euro symbol)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Token Savings */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Token Savings Analysis</h2>
        <p className="mb-6">
          Converting HTML to text or markdown can dramatically reduce token usage when processing
          web content with LLMs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-200 dark:border-red-800/50">
            <h3 className="text-lg font-semibold mb-3">Raw HTML</h3>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Token Count:</strong> ~2,500 tokens
              </div>
              <div className="text-muted-foreground">
                Includes all markup, styling, attributes, and semantic tags
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-200 dark:border-blue-800/50">
            <h3 className="text-lg font-semibold mb-3">Markdown Output</h3>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Token Count:</strong> ~800 tokens
              </div>
              <div className="text-green-600 dark:text-green-400 font-semibold">68% reduction</div>
              <div className="text-muted-foreground">Preserves structure and semantics</div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-200 dark:border-emerald-800/50">
            <h3 className="text-lg font-semibold mb-3">Plain Text Output</h3>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Token Count:</strong> ~500 tokens
              </div>
              <div className="text-emerald-600 dark:text-emerald-400 font-semibold">
                80% reduction
              </div>
              <div className="text-muted-foreground">Pure content extraction</div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-6 rounded-xl bg-muted/30 border border-border">
          <h3 className="font-semibold mb-3">Real-World Example</h3>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Input:</strong> Medium article (5 KB HTML, ~2,500 tokens)
            </div>
            <div>
              <strong>Output (Markdown):</strong> 1.6 KB (800 tokens) - 68% reduction
            </div>
            <div>
              <strong>Output (Plain Text):</strong> 1 KB (500 tokens) - 80% reduction
            </div>
            <div className="mt-4 text-emerald-600 dark:text-emerald-400">
              <strong>Cost Savings (GPT-4):</strong> $0.006/request → $0.002/request (68% cheaper)
            </div>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Best Practices</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-semibold mb-2">Use markdown for structured content</h3>
            <p className="text-sm text-muted-foreground">
              When processing documentation, articles, or any content where structure matters,
              prefer <code>htmlToMarkdown()</code> to preserve semantic meaning while reducing
              tokens.
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-semibold mb-2">Use plain text for pure extraction</h3>
            <p className="text-sm text-muted-foreground">
              For maximum token reduction when structure isn't critical, use{' '}
              <code>htmlToText()</code> to extract pure content.
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-semibold mb-2">Preserve links when URLs matter</h3>
            <p className="text-sm text-muted-foreground">
              Set <code>preserveLinks: true</code> when you need to maintain reference URLs for
              citation or verification purposes.
            </p>
          </div>

          <div className="border-l-4 border-yellow-500 pl-4">
            <h3 className="font-semibold mb-2">Sanitize HTML before processing</h3>
            <p className="text-sm text-muted-foreground">
              While HTMLOptimizer handles common cases, consider sanitizing untrusted HTML input
              before processing to remove potentially malicious content.
            </p>
          </div>

          <div className="border-l-4 border-yellow-500 pl-4">
            <h3 className="font-semibold mb-2">Cache class instance for repeated use</h3>
            <p className="text-sm text-muted-foreground">
              If converting multiple HTML documents, create one <code>HTMLOptimizer</code> instance
              and reuse it rather than using convenience functions repeatedly.
            </p>
          </div>
        </div>
      </section>

      {/* Integration Examples */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Integration Examples</h2>
        <div className="space-y-6">
          {/* Web Scraping */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Web Scraping Pipeline</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">
                {`import { htmlToMarkdown } from '@clarity-chat/token-optimization'

async function scrapeAndAnalyze(url: string) {
  // Fetch HTML
  const response = await fetch(url)
  const html = await response.text()

  // Convert to markdown for LLM processing
  const markdown = htmlToMarkdown(html)

  // Send to LLM for analysis
  const analysis = await llm.chat({
    messages: [
      {
        role: 'user',
        content: \`Analyze this article:\\n\\n\${markdown}\`
      }
    ]
  })

  return analysis
}`}
              </code>
            </pre>
          </div>

          {/* Documentation Processor */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Documentation Processor</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">
                {`import { HTMLOptimizer } from '@clarity-chat/token-optimization'

const optimizer = new HTMLOptimizer()

async function processDocumentation(htmlFiles: string[]) {
  const processed = htmlFiles.map(html => {
    // Convert HTML docs to markdown
    const markdown = optimizer.htmlToMarkdown(html)

    // Extract metadata
    const title = html.match(/<h1>(.*?)<\\/h1>/)?.[1] || 'Untitled'

    return {
      title,
      content: markdown,
      tokens: estimateTokens(markdown)
    }
  })

  return processed
}`}
              </code>
            </pre>
          </div>

          {/* Email Processing */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Email Content Extraction</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">
                {`import { htmlToText } from '@clarity-chat/token-optimization'

function extractEmailContent(htmlEmail: string) {
  // Convert HTML email to plain text
  const text = htmlToText(htmlEmail)

  // Send to LLM for classification or summarization
  return llm.chat({
    messages: [
      {
        role: 'system',
        content: 'You are a helpful email assistant.'
      },
      {
        role: 'user',
        content: \`Summarize this email:\\n\\n\${text}\`
      }
    ]
  })
}`}
              </code>
            </pre>
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
              Further compress extracted text using intelligent compression strategies
            </p>
          </a>
          <a
            href="/api/token-optimization/token-counter"
            className="border border-border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">TokenCounter</h3>
            <p className="text-sm text-muted-foreground">
              Count tokens in your converted text to measure savings
            </p>
          </a>
          <a
            href="/api/token-optimization/cost-tracker"
            className="border border-border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">CostTracker</h3>
            <p className="text-sm text-muted-foreground">
              Track cost savings from HTML optimization
            </p>
          </a>
          <a
            href="/api/token-optimization/model-pricing"
            className="border border-border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">ModelPricing</h3>
            <p className="text-sm text-muted-foreground">
              Calculate exact cost differences between raw HTML and optimized output
            </p>
          </a>
        </div>
      </section>
    </div>
  )
}
