import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TextChunker | Token Optimization API',
  description:
    'High-performance text chunking with token-aware splitting. Supports multiple strategies for optimal chunking in LLM applications.',
}

export default function TextChunkerPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <header>
        <h1 className="text-4xl font-bold mb-4">TextChunker</h1>
        <p className="text-xl text-muted-foreground">
          High-performance text chunking using llm-splitter. Intelligently splits text into
          token-aware chunks with configurable overlap for optimal retrieval and context
          preservation.
        </p>
      </header>

      {/* Overview */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Overview</h2>
        <p className="mb-4">
          The <code>TextChunker</code> uses llm-splitter to efficiently split long texts into
          smaller, manageable chunks. It provides three preset strategies (Precise, Balanced,
          Context) optimized for different use cases, with full control over chunk size and overlap.
        </p>
        <div className="bg-muted p-6 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold">Key Features</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Lightweight alternative to LangChain text splitters</li>
            <li>Single-pass greedy algorithm for optimal performance</li>
            <li>Paragraph-aware chunking preserves semantic boundaries</li>
            <li>Rich metadata with character positions and token counts</li>
            <li>Three preset strategies with customizable configuration</li>
            <li>Overlap support for context continuity between chunks</li>
            <li>Built on llm-splitter for production-ready performance</li>
          </ul>
        </div>
      </section>

      {/* Import */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Import</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code className="text-sm">
            {`import {
  TextChunker,
  ChunkingStrategy,
  type ChunkingConfig,
  type TextChunk,
  type ChunkingResult,
} from '@clarity-chat/token-optimization'`}
          </code>
        </pre>
      </section>

      {/* Chunking Strategies */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Chunking Strategies</h2>
        <p className="mb-6">
          TextChunker provides three preset strategies optimized for different use cases:
        </p>

        <div className="space-y-6">
          {/* Precise */}
          <div className="border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Precise (256 tokens, 10% overlap)</h3>
            <p className="mb-4">
              Small chunks for precise retrieval. Ideal when you need fine-grained control over
              retrieved content.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-green-600 mb-2">Best For:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Semantic search with high precision</li>
                  <li>Dense retrieval systems (RAG)</li>
                  <li>Question answering over documents</li>
                  <li>Fine-grained context control</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-600 mb-2">Avoid For:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Long-form context preservation</li>
                  <li>Narrative or flow-dependent content</li>
                  <li>Very large documents (creates many chunks)</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 bg-muted/50 p-3 rounded">
              <p className="text-sm">
                <strong>Chunk Size:</strong> 256 tokens | <strong>Overlap:</strong> ~26 tokens
                (10%)
              </p>
            </div>
          </div>

          {/* Balanced */}
          <div className="border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">
              Balanced (512 tokens, 15% overlap) - Default
            </h3>
            <p className="mb-4">
              Medium chunks for general use. Balances retrieval precision with context preservation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-green-600 mb-2">Best For:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>General document processing</li>
                  <li>Mixed content (prose + code + data)</li>
                  <li>Vector embeddings (typical model context)</li>
                  <li>Most LLM applications</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-600 mb-2">Trade-offs:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>May split related concepts across chunks</li>
                  <li>Moderate storage overhead from overlap</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 bg-muted/50 p-3 rounded">
              <p className="text-sm">
                <strong>Chunk Size:</strong> 512 tokens | <strong>Overlap:</strong> ~77 tokens
                (15%)
              </p>
            </div>
          </div>

          {/* Context */}
          <div className="border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Context (1024 tokens, 20% overlap)</h3>
            <p className="mb-4">
              Large chunks for maximum context preservation. Best when semantic coherence is
              critical.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-green-600 mb-2">Best For:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Long-form content (articles, reports)</li>
                  <li>Narrative preservation</li>
                  <li>Code files with function context</li>
                  <li>Technical documentation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-600 mb-2">Avoid For:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Small model context windows (&lt;4K tokens)</li>
                  <li>Highly specific queries</li>
                  <li>Storage-constrained systems</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 bg-muted/50 p-3 rounded">
              <p className="text-sm">
                <strong>Chunk Size:</strong> 1024 tokens | <strong>Overlap:</strong> ~205 tokens
                (20%)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Strategy Comparison */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Strategy Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border p-3 text-left">Strategy</th>
                <th className="border border-border p-3 text-left">Tokens/Chunk</th>
                <th className="border border-border p-3 text-left">Overlap</th>
                <th className="border border-border p-3 text-left">Precision</th>
                <th className="border border-border p-3 text-left">Context</th>
                <th className="border border-border p-3 text-left">Best Use Case</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border p-3 font-mono">PRECISE</td>
                <td className="border border-border p-3">256</td>
                <td className="border border-border p-3">10% (~26)</td>
                <td className="border border-border p-3 text-green-600">High</td>
                <td className="border border-border p-3 text-orange-600">Low</td>
                <td className="border border-border p-3">RAG, semantic search</td>
              </tr>
              <tr className="bg-muted/50">
                <td className="border border-border p-3 font-mono">BALANCED</td>
                <td className="border border-border p-3">512</td>
                <td className="border border-border p-3">15% (~77)</td>
                <td className="border border-border p-3 text-yellow-600">Medium</td>
                <td className="border border-border p-3 text-yellow-600">Medium</td>
                <td className="border border-border p-3">General document processing</td>
              </tr>
              <tr>
                <td className="border border-border p-3 font-mono">CONTEXT</td>
                <td className="border border-border p-3">1024</td>
                <td className="border border-border p-3">20% (~205)</td>
                <td className="border border-border p-3 text-orange-600">Low</td>
                <td className="border border-border p-3 text-green-600">High</td>
                <td className="border border-border p-3">Long-form, technical docs</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Basic Usage */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Basic Usage</h2>

        <h3 className="text-2xl font-semibold mb-3">Quick Start</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-6">
          <code className="text-sm">
            {`import { TextChunker, ChunkingStrategy } from '@clarity-chat/token-optimization'

// Create chunker with balanced strategy (default)
const chunker = new TextChunker({
  strategy: ChunkingStrategy.BALANCED,
})

// Chunk a long document
const result = chunker.chunk(longDocument)

console.log(\`Created \${result.totalChunks} chunks\`)
console.log(\`Total tokens: \${result.totalTokens}\`)
console.log(\`Overhead: \${result.overheadPercentage}%\`)

// Process each chunk
for (const chunk of result.chunks) {
  console.log(\`Chunk \${chunk.index}: \${chunk.tokenCount} tokens\`)
  // Process chunk.text...
}`}
          </code>
        </pre>

        <h3 className="text-2xl font-semibold mb-3">Factory Methods</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-6">
          <code className="text-sm">
            {`// Use preset strategies with factory methods
const preciseChunker = TextChunker.precise()   // 256 tokens, 10% overlap
const balancedChunker = TextChunker.balanced() // 512 tokens, 15% overlap
const contextChunker = TextChunker.context()   // 1024 tokens, 20% overlap

const result = preciseChunker.chunk(text)`}
          </code>
        </pre>

        <h3 className="text-2xl font-semibold mb-3">Custom Configuration</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code className="text-sm">
            {`// Custom chunking configuration
const chunker = new TextChunker({
  strategy: ChunkingStrategy.CUSTOM,
  maxTokens: 768,              // Custom chunk size
  overlapPercentage: 0.12,     // 12% overlap
  includeTokenCount: true,     // Include token counts (default)
})

const result = chunker.chunk(text)

// Or update configuration
const newChunker = chunker.withConfig({
  maxTokens: 1024,
  overlapPercentage: 0.25,
})`}
          </code>
        </pre>
      </section>

      {/* API Reference */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">API Reference</h2>

        <h3 className="text-2xl font-semibold mb-3">Constructor</h3>
        <div className="bg-muted p-4 rounded-lg mb-6">
          <p className="font-mono text-sm mb-3">
            new TextChunker(config?: ChunkingConfig)
          </p>
          <p className="text-sm mb-3">Creates a new text chunker with the specified configuration.</p>
          <div className="text-sm">
            <strong>Parameters:</strong>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>
                <code>config</code> (optional): Chunking configuration object
              </li>
            </ul>
          </div>
        </div>

        <h3 className="text-2xl font-semibold mb-3">Methods</h3>

        <div className="space-y-6">
          {/* chunk() */}
          <div className="border border-border rounded-lg p-4">
            <h4 className="font-mono text-lg mb-2">chunk(text: string): ChunkingResult</h4>
            <p className="text-sm mb-3">
              Chunks text into smaller pieces with overlap and returns detailed results.
            </p>
            <div className="bg-muted/50 p-3 rounded text-sm">
              <strong>Returns:</strong> ChunkingResult with chunks array, metadata, and statistics
            </div>
          </div>

          {/* chunkToStrings() */}
          <div className="border border-border rounded-lg p-4">
            <h4 className="font-mono text-lg mb-2">chunkToStrings(text: string): string[]</h4>
            <p className="text-sm mb-3">
              Convenience method that returns just the chunk text strings without metadata.
            </p>
            <div className="bg-muted/50 p-3 rounded text-sm">
              <strong>Returns:</strong> Array of chunk text strings
            </div>
          </div>

          {/* estimateChunkCount() */}
          <div className="border border-border rounded-lg p-4">
            <h4 className="font-mono text-lg mb-2">
              estimateChunkCount(text: string): number
            </h4>
            <p className="text-sm mb-3">
              Estimates the number of chunks without performing the actual chunking. Useful for
              pre-allocation or UI feedback.
            </p>
            <div className="bg-muted/50 p-3 rounded text-sm">
              <strong>Returns:</strong> Estimated number of chunks
            </div>
          </div>

          {/* needsChunking() */}
          <div className="border border-border rounded-lg p-4">
            <h4 className="font-mono text-lg mb-2">
              needsChunking(text: string, maxTokens?: number): boolean
            </h4>
            <p className="text-sm mb-3">
              Checks if text exceeds the token limit and requires chunking.
            </p>
            <div className="bg-muted/50 p-3 rounded text-sm">
              <strong>Parameters:</strong> maxTokens (optional) - Override configured maxTokens
              <br />
              <strong>Returns:</strong> true if text needs chunking, false otherwise
            </div>
          </div>

          {/* getConfig() */}
          <div className="border border-border rounded-lg p-4">
            <h4 className="font-mono text-lg mb-2">
              getConfig(): Required&lt;ChunkingConfig&gt;
            </h4>
            <p className="text-sm mb-3">Returns the current chunking configuration.</p>
            <div className="bg-muted/50 p-3 rounded text-sm">
              <strong>Returns:</strong> Complete configuration with all defaults applied
            </div>
          </div>

          {/* withConfig() */}
          <div className="border border-border rounded-lg p-4">
            <h4 className="font-mono text-lg mb-2">
              withConfig(config: Partial&lt;ChunkingConfig&gt;): TextChunker
            </h4>
            <p className="text-sm mb-3">
              Creates a new chunker instance with updated configuration (immutable).
            </p>
            <div className="bg-muted/50 p-3 rounded text-sm">
              <strong>Returns:</strong> New TextChunker instance with merged configuration
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-semibold mb-3 mt-8">Static Factory Methods</h3>

        <div className="space-y-4">
          <div className="border border-border rounded-lg p-4">
            <h4 className="font-mono text-lg mb-2">TextChunker.precise(): TextChunker</h4>
            <p className="text-sm">Creates a chunker with the PRECISE strategy preset.</p>
          </div>

          <div className="border border-border rounded-lg p-4">
            <h4 className="font-mono text-lg mb-2">TextChunker.balanced(): TextChunker</h4>
            <p className="text-sm">Creates a chunker with the BALANCED strategy preset.</p>
          </div>

          <div className="border border-border rounded-lg p-4">
            <h4 className="font-mono text-lg mb-2">TextChunker.context(): TextChunker</h4>
            <p className="text-sm">Creates a chunker with the CONTEXT strategy preset.</p>
          </div>
        </div>
      </section>

      {/* Types */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">TypeScript Types</h2>

        <h3 className="text-2xl font-semibold mb-3">ChunkingConfig</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-6">
          <code className="text-sm">
            {`interface ChunkingConfig {
  /** Maximum tokens per chunk (default: 512) */
  maxTokens?: number

  /** Overlap between chunks as percentage (0-1) (default: 0.15) */
  overlapPercentage?: number

  /** Chunking strategy preset (default: BALANCED) */
  strategy?: ChunkingStrategy

  /** Include token count in metadata (default: true) */
  includeTokenCount?: boolean
}`}
          </code>
        </pre>

        <h3 className="text-2xl font-semibold mb-3">TextChunk</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-6">
          <code className="text-sm">
            {`interface TextChunk {
  /** Chunk content */
  text: string

  /** Chunk index (0-based) */
  index: number

  /** Start character position in original text */
  startPosition: number

  /** End character position in original text */
  endPosition: number

  /** Token count for this chunk */
  tokenCount: number

  /** Metadata */
  metadata: {
    /** Whether this chunk starts a new paragraph */
    startsNewParagraph?: boolean

    /** Overlap tokens from previous chunk */
    overlapTokens?: number
  }
}`}
          </code>
        </pre>

        <h3 className="text-2xl font-semibold mb-3">ChunkingResult</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-6">
          <code className="text-sm">
            {`interface ChunkingResult {
  /** Array of chunks */
  chunks: TextChunk[]

  /** Total number of chunks */
  totalChunks: number

  /** Total tokens across all chunks (includes overlap) */
  totalTokens: number

  /** Original text token count */
  originalTokens: number

  /** Overhead from overlapping chunks (percentage) */
  overheadPercentage: number

  /** Configuration used */
  config: Required<ChunkingConfig>
}`}
          </code>
        </pre>

        <h3 className="text-2xl font-semibold mb-3">ChunkingStrategy</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code className="text-sm">
            {`enum ChunkingStrategy {
  /** Small chunks for precise retrieval (256 tokens, 10% overlap) */
  PRECISE = 'precise',

  /** Balanced chunks for general use (512 tokens, 15% overlap) */
  BALANCED = 'balanced',

  /** Large chunks for context preservation (1024 tokens, 20% overlap) */
  CONTEXT = 'context',

  /** Custom configuration */
  CUSTOM = 'custom',
}`}
          </code>
        </pre>
      </section>

      {/* Advanced Examples */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Advanced Examples</h2>

        <h3 className="text-2xl font-semibold mb-3">RAG Pipeline Integration</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-6">
          <code className="text-sm">
            {`import { TextChunker } from '@clarity-chat/token-optimization'

// Create chunker optimized for RAG
const chunker = TextChunker.precise()

// Process documents for vector storage
async function processDocument(doc: string) {
  const result = chunker.chunk(doc)

  // Generate embeddings for each chunk
  const chunksWithEmbeddings = await Promise.all(
    result.chunks.map(async (chunk) => ({
      text: chunk.text,
      embedding: await generateEmbedding(chunk.text),
      metadata: {
        index: chunk.index,
        tokens: chunk.tokenCount,
        position: [chunk.startPosition, chunk.endPosition],
      },
    }))
  )

  // Store in vector database
  await vectorDB.insert(chunksWithEmbeddings)

  return result.totalChunks
}`}
          </code>
        </pre>

        <h3 className="text-2xl font-semibold mb-3">Conditional Chunking</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-6">
          <code className="text-sm">
            {`const chunker = TextChunker.balanced()

function processText(text: string, contextWindow: number = 4096) {
  // Only chunk if necessary
  if (chunker.needsChunking(text, contextWindow)) {
    const result = chunker.chunk(text)

    console.log(\`Chunked into \${result.totalChunks} pieces\`)
    console.log(\`Overhead: \${result.overheadPercentage}%\`)

    return result.chunks.map(c => c.text)
  }

  // Text fits in context window
  return [text]
}`}
          </code>
        </pre>

        <h3 className="text-2xl font-semibold mb-3">Dynamic Strategy Selection</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code className="text-sm">
            {`import { TextChunker, ChunkingStrategy } from '@clarity-chat/token-optimization'
import { encode } from 'gpt-tokenizer'

function selectOptimalChunker(text: string): TextChunker {
  const tokens = encode(text).length

  // Small documents: precise chunking for better retrieval
  if (tokens < 2000) {
    return TextChunker.precise()
  }

  // Large documents: context preservation
  if (tokens > 10000) {
    return TextChunker.context()
  }

  // Medium documents: balanced approach
  return TextChunker.balanced()
}

// Usage
const chunker = selectOptimalChunker(document)
const result = chunker.chunk(document)`}
          </code>
        </pre>
      </section>

      {/* Performance Considerations */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Performance Considerations</h2>

        <div className="space-y-6">
          <div className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-4">
            <h3 className="font-semibold mb-2">Single-Pass Algorithm</h3>
            <p className="text-sm">
              TextChunker uses llm-splitter's single-pass greedy algorithm, which processes text
              once from start to finish. This is significantly faster than multiple-pass approaches.
            </p>
          </div>

          <div className="border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 p-4">
            <h3 className="font-semibold mb-2">Paragraph-Aware Splitting</h3>
            <p className="text-sm">
              The chunker respects paragraph boundaries when possible, creating more semantically
              coherent chunks without sacrificing performance.
            </p>
          </div>

          <div className="border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 p-4">
            <h3 className="font-semibold mb-2">Token Counting Overhead</h3>
            <p className="text-sm mb-2">
              Token counting adds minimal overhead. Set <code>includeTokenCount: false</code> to
              skip token counting if you don't need exact counts:
            </p>
            <pre className="bg-white dark:bg-gray-800 p-2 rounded text-xs">
              {`const chunker = new TextChunker({
  includeTokenCount: false  // Faster, no token counting
})`}
            </pre>
          </div>

          <div className="border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20 p-4">
            <h3 className="font-semibold mb-2">Overlap Trade-offs</h3>
            <p className="text-sm">
              Higher overlap percentages improve context continuity but increase storage and
              processing overhead. The overhead is tracked in <code>overheadPercentage</code>:
            </p>
            <ul className="list-disc list-inside text-sm mt-2 space-y-1">
              <li>10% overlap: ~10% storage overhead</li>
              <li>15% overlap: ~15% storage overhead</li>
              <li>20% overlap: ~20% storage overhead</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Best Practices</h2>

        <div className="space-y-4">
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-2">1. Choose Strategy Based on Use Case</h3>
            <p className="text-sm">
              Use PRECISE for RAG/search, BALANCED for general use, and CONTEXT for long-form
              documents where narrative flow matters.
            </p>
          </div>

          <div className="border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-2">2. Monitor Overhead Percentage</h3>
            <p className="text-sm">
              Check <code>result.overheadPercentage</code> to understand storage costs. High
              overhead (20%+) may indicate you should reduce overlap or increase chunk size.
            </p>
          </div>

          <div className="border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-2">3. Use Estimation for UI Feedback</h3>
            <p className="text-sm">
              Call <code>estimateChunkCount()</code> before chunking to show progress indicators or
              pre-allocate storage.
            </p>
          </div>

          <div className="border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-2">4. Preserve Chunk Metadata</h3>
            <p className="text-sm">
              Store <code>startPosition</code> and <code>endPosition</code> to highlight retrieved
              chunks in the original document.
            </p>
          </div>

          <div className="border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-2">5. Test with Representative Content</h3>
            <p className="text-sm">
              Different content types (prose, code, structured data) may chunk differently. Test
              with your actual content to validate strategy selection.
            </p>
          </div>

          <div className="border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-2">6. Consider Model Context Windows</h3>
            <p className="text-sm">
              Match chunk size to your target model's context window. For models with 4K context,
              use PRECISE (256) or BALANCED (512). For 8K+, CONTEXT (1024) is viable.
            </p>
          </div>
        </div>
      </section>

      {/* Related */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Related APIs</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="/api/token-optimization/adaptive-compressor"
              className="text-blue-600 hover:underline"
            >
              AdaptiveCompressor
            </a>{' '}
            - Intelligent content compression with multiple strategies
          </li>
          <li>
            <a
              href="/api/reference/hooks/use-token-budget-monitor"
              className="text-blue-600 hover:underline"
            >
              useTokenBudgetMonitor
            </a>{' '}
            - Monitor token usage with threshold-based warnings
          </li>
          <li>
            <a href="/build/token-optimization" className="text-blue-600 hover:underline">
              Token Optimization Guide
            </a>{' '}
            - Comprehensive token management strategies
          </li>
        </ul>
      </section>

      {/* Footer */}
      <footer className="border-t border-border pt-8 mt-12">
        <p className="text-sm text-muted-foreground">
          TextChunker is part of the @clarity-chat/token-optimization package. Built on{' '}
          <a
            href="https://github.com/nearform/llm-splitter"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            llm-splitter
          </a>{' '}
          for production-ready performance.
        </p>
      </footer>
    </div>
  )
}
