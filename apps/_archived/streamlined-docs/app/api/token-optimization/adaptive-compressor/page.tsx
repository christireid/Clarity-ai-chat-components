import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AdaptiveCompressor | Token Optimization API',
  description:
    'Automatically selects the best compression strategy based on content analysis. Supports LLMLingua, Extractive, and Hybrid compression.',
}

export default function AdaptiveCompressorPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <header>
        <h1 className="text-4xl font-bold mb-4">AdaptiveCompressor</h1>
        <p className="text-xl text-muted-foreground">
          Intelligent compression that automatically selects the optimal strategy based on content
          type, length, and quality requirements.
        </p>
      </header>

      {/* Overview */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Overview</h2>
        <p className="mb-4">
          The <code>AdaptiveCompressor</code> analyzes your content and intelligently chooses
          between LLMLingua, Extractive, Hybrid, or Minimal compression strategies to achieve the
          best balance of compression ratio and quality.
        </p>
        <div className="bg-muted p-6 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold">Key Features</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Automatic strategy selection based on content analysis</li>
            <li>Support for 4 compression strategies (LLMLingua, Extractive, Hybrid, Minimal)</li>
            <li>Content type detection (prose, code, mixed, structured, etc.)</li>
            <li>Quality gates with configurable thresholds</li>
            <li>Comprehensive metrics and debug information</li>
            <li>Progressive quality improvement with automatic fallback</li>
          </ul>
        </div>
      </section>

      {/* Import */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Import</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code className="text-sm">
            {`import {
  AdaptiveCompressor,
  createAdaptiveCompressor,
  compressAdaptively,
  type AdaptiveOptions,
  type AdaptiveResult,
  type ContentAnalysis,
  type CompressionStrategyType,
} from '@clarity-chat/token-optimization'`}
          </code>
        </pre>
      </section>

      {/* Compression Strategies */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Compression Strategies</h2>
        <p className="mb-6">
          AdaptiveCompressor can select from four different compression strategies based on content
          analysis:
        </p>

        <div className="space-y-6">
          {/* LLMLingua */}
          <div className="border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">LLMLingua (Token-Level)</h3>
            <p className="mb-4">
              Statistical compression based on token importance scoring. Removes low-importance
              tokens while preserving semantic meaning.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-green-600 mb-2">Best For:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Prose and natural language text</li>
                  <li>Mixed content (text + code)</li>
                  <li>Aggressive compression (2-10x)</li>
                  <li>Medium-length text (100-5000 tokens)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-600 mb-2">Avoid For:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Pure code</li>
                  <li>Structured data (JSON, XML)</li>
                  <li>Very short text (&lt;50 tokens)</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 bg-muted/50 p-3 rounded">
              <p className="text-sm">
                <strong>Typical Ratio:</strong> 0.2-0.5 (2-5x compression) |{' '}
                <strong>Quality:</strong> 0.75-0.85
              </p>
            </div>
          </div>

          {/* Extractive */}
          <div className="border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Extractive (Sentence-Level)</h3>
            <p className="mb-4">
              Selects the most important sentences while maintaining grammatical coherence.
              Preserves complete thoughts.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-green-600 mb-2">Best For:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Long documents (&gt;20 sentences)</li>
                  <li>Technical documentation</li>
                  <li>High quality requirements</li>
                  <li>Moderate compression (1.5-3x)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-600 mb-2">Avoid For:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Short text (&lt;5 sentences)</li>
                  <li>Lists and enumerations</li>
                  <li>Aggressive compression needs</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 bg-muted/50 p-3 rounded">
              <p className="text-sm">
                <strong>Typical Ratio:</strong> 0.3-0.7 (1.5-3x compression) |{' '}
                <strong>Quality:</strong> 0.85-0.95
              </p>
            </div>
          </div>

          {/* Hybrid */}
          <div className="border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Hybrid (Two-Pass)</h3>
            <p className="mb-4">
              Combines Extractive (first pass) with LLMLingua (second pass) for maximum compression
              while maintaining quality.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-green-600 mb-2">Best For:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Very long documents (&gt;5000 tokens)</li>
                  <li>Complex content</li>
                  <li>Very high quality requirements</li>
                  <li>Aggressive compression with quality preservation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-600 mb-2">Avoid For:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Time-constrained scenarios</li>
                  <li>Simple content</li>
                  <li>Conservative compression (&gt;0.8 ratio)</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 bg-muted/50 p-3 rounded">
              <p className="text-sm">
                <strong>Typical Ratio:</strong> 0.15-0.4 (2.5-6x compression) |{' '}
                <strong>Quality:</strong> 0.8-0.9
              </p>
            </div>
          </div>

          {/* Minimal */}
          <div className="border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Minimal (Whitespace Only)</h3>
            <p className="mb-4">
              Conservative compression that only normalizes whitespace. Preserves nearly all content.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-green-600 mb-2">Best For:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Code and structured data</li>
                  <li>Very short text (&lt;50 tokens)</li>
                  <li>High quality requirements (&gt;0.95)</li>
                  <li>Conservative compression (&gt;0.8 ratio)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-600 mb-2">Avoid For:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Aggressive compression needs</li>
                  <li>Long documents</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 bg-muted/50 p-3 rounded">
              <p className="text-sm">
                <strong>Typical Ratio:</strong> 0.9-1.0 (minimal compression) |{' '}
                <strong>Quality:</strong> 0.99
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Strategy Comparison Table */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Strategy Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border p-3 text-left">Strategy</th>
                <th className="border border-border p-3 text-left">Level</th>
                <th className="border border-border p-3 text-left">Compression</th>
                <th className="border border-border p-3 text-left">Quality</th>
                <th className="border border-border p-3 text-left">Speed</th>
                <th className="border border-border p-3 text-left">Best Use Case</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border p-3 font-mono">llmlingua</td>
                <td className="border border-border p-3">Token</td>
                <td className="border border-border p-3">2-10x</td>
                <td className="border border-border p-3">0.75-0.85</td>
                <td className="border border-border p-3">Fast</td>
                <td className="border border-border p-3">Prose, mixed content</td>
              </tr>
              <tr className="bg-muted/50">
                <td className="border border-border p-3 font-mono">extractive</td>
                <td className="border border-border p-3">Sentence</td>
                <td className="border border-border p-3">1.5-3x</td>
                <td className="border border-border p-3">0.85-0.95</td>
                <td className="border border-border p-3">Fast</td>
                <td className="border border-border p-3">Long docs, high quality</td>
              </tr>
              <tr>
                <td className="border border-border p-3 font-mono">hybrid</td>
                <td className="border border-border p-3">Two-pass</td>
                <td className="border border-border p-3">2.5-6x</td>
                <td className="border border-border p-3">0.8-0.9</td>
                <td className="border border-border p-3">Slower</td>
                <td className="border border-border p-3">Complex, long content</td>
              </tr>
              <tr className="bg-muted/50">
                <td className="border border-border p-3 font-mono">minimal</td>
                <td className="border border-border p-3">Whitespace</td>
                <td className="border border-border p-3">1.0-1.1x</td>
                <td className="border border-border p-3">0.99</td>
                <td className="border border-border p-3">Instant</td>
                <td className="border border-border p-3">Code, structured data</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* compress() Method */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">compress() Method</h2>
        <p className="mb-4">
          The main method that analyzes content and applies the optimal compression strategy.
        </p>

        <div className="space-y-6">
          {/* Signature */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Signature</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">
                {`async compress(
  text: string,
  options?: AdaptiveOptions
): Promise<AdaptiveResult>`}
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
                <p className="text-sm">The input text to compress.</p>
              </div>
              <div className="border border-border rounded-lg p-4">
                <h4 className="font-semibold mb-2">
                  <code>options</code>{' '}
                  <span className="text-muted-foreground">(AdaptiveOptions, optional)</span>
                </h4>
                <p className="text-sm mb-3">Configuration options for compression.</p>
                <div className="bg-muted/50 p-3 rounded space-y-2 text-sm">
                  <div>
                    <code className="font-semibold">targetRatio?</code>: number (0.1-1.0) - Target
                    compression ratio. Default: 0.5
                  </div>
                  <div>
                    <code className="font-semibold">minQuality?</code>: number (0-1) - Minimum
                    acceptable quality. Default: 0.7
                  </div>
                  <div>
                    <code className="font-semibold">maxProcessingTime?</code>: number - Maximum
                    processing time in ms. Default: 5000
                  </div>
                  <div>
                    <code className="font-semibold">preferredStrategy?</code>:
                    CompressionStrategyType - Preferred strategy if suitable
                  </div>
                  <div>
                    <code className="font-semibold">forceStrategy?</code>: CompressionStrategyType -
                    Force a specific strategy
                  </div>
                  <div>
                    <code className="font-semibold">llmlinguaOptions?</code>:
                    Partial&lt;LLMLinguaOptions&gt; - LLMLingua-specific options
                  </div>
                  <div>
                    <code className="font-semibold">extractiveOptions?</code>:
                    Partial&lt;ExtractiveOptions&gt; - Extractive-specific options
                  </div>
                  <div>
                    <code className="font-semibold">debug?</code>: boolean - Enable debug output.
                    Default: false
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
                <code>Promise&lt;AdaptiveResult&gt;</code>
              </h4>
              <div className="bg-muted/50 p-3 rounded space-y-2 text-sm">
                <div>
                  <code className="font-semibold">original</code>: string - Original input text
                </div>
                <div>
                  <code className="font-semibold">compressed</code>: string - Compressed output text
                </div>
                <div>
                  <code className="font-semibold">compressionRatio</code>: number - Achieved
                  compression ratio
                </div>
                <div>
                  <code className="font-semibold">strategyUsed</code>: CompressionStrategyType -
                  Strategy that was used
                </div>
                <div>
                  <code className="font-semibold">strategyReason</code>: string - Why this strategy
                  was selected
                </div>
                <div>
                  <code className="font-semibold">quality</code>: AdaptiveQualityMetrics - Quality
                  metrics
                </div>
                <div>
                  <code className="font-semibold">contentAnalysis</code>: ContentAnalysis - Content
                  analysis results
                </div>
                <div>
                  <code className="font-semibold">processingTimeMs</code>: number - Processing time
                  in milliseconds
                </div>
                <div>
                  <code className="font-semibold">debug?</code>: AdaptiveDebugInfo - Debug
                  information (if enabled)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strategy Selection Logic */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Strategy Selection Logic</h2>
        <p className="mb-4">
          AdaptiveCompressor uses content analysis to score each strategy and select the best match:
        </p>

        <div className="space-y-6">
          {/* Content Analysis */}
          <div className="border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">1. Content Analysis</h3>
            <p className="mb-4">The compressor analyzes your content to determine:</p>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>
                <strong>Content Type:</strong> prose, code, mixed, structured, conversational,
                technical, or list
              </li>
              <li>
                <strong>Length Metrics:</strong> character count, estimated tokens, sentence count
              </li>
              <li>
                <strong>Code Percentage:</strong> ratio of code blocks to total content
              </li>
              <li>
                <strong>Complexity:</strong> based on word length and sentence structure
              </li>
              <li>
                <strong>Language Features:</strong> questions, instructions, lists, sections, etc.
              </li>
            </ul>
          </div>

          {/* Scoring System */}
          <div className="border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">2. Strategy Scoring</h3>
            <p className="mb-4">Each strategy receives a score (0-1) based on:</p>
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded">
                <h4 className="font-semibold mb-2">LLMLingua Scoring</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>+0.3 for prose content</li>
                  <li>+0.2 for mixed content</li>
                  <li>+0.2 for optimal length (100-5000 tokens)</li>
                  <li>+0.2 for aggressive compression targets (&lt;0.4)</li>
                  <li>-0.3 for structured data</li>
                  <li>-0.4 for code content</li>
                </ul>
              </div>

              <div className="bg-muted/50 p-4 rounded">
                <h4 className="font-semibold mb-2">Extractive Scoring</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>+0.3 for many sentences (&gt;20)</li>
                  <li>+0.2 for prose or technical content</li>
                  <li>+0.1 for moderate compression (0.3-0.7)</li>
                  <li>+0.2 for high quality requirements (&gt;0.8)</li>
                  <li>-0.3 for too few sentences (&lt;5)</li>
                  <li>-0.2 for list content</li>
                </ul>
              </div>

              <div className="bg-muted/50 p-4 rounded">
                <h4 className="font-semibold mb-2">Hybrid Scoring</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>+0.3 for complex content (complexity &gt;0.6)</li>
                  <li>+0.3 for mixed content types</li>
                  <li>+0.2 for very long documents (&gt;5000 tokens)</li>
                  <li>+0.2 for very high quality requirements (&gt;0.85)</li>
                  <li>-0.3 for time constraints (&lt;1000ms)</li>
                </ul>
              </div>

              <div className="bg-muted/50 p-4 rounded">
                <h4 className="font-semibold mb-2">Minimal Scoring</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>+0.4 for very short text (&lt;50 tokens)</li>
                  <li>+0.3 for structured data</li>
                  <li>+0.3 for code content</li>
                  <li>+0.2 for conservative compression (&gt;0.8)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Selection */}
          <div className="border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">3. Strategy Selection</h3>
            <p className="mb-4">The highest-scoring strategy is selected, with these rules:</p>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>
                If <code>forceStrategy</code> is set, it's always used (score = 1.0)
              </li>
              <li>
                If <code>preferredStrategy</code> is set and its score &gt; 0.5, it's used
              </li>
              <li>Otherwise, the strategy with the highest score is selected</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Quality Gates */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Quality Gates and minQuality</h2>
        <p className="mb-4">
          AdaptiveCompressor enforces quality thresholds to ensure compressed output meets your
          requirements.
        </p>

        <div className="space-y-6">
          {/* How it Works */}
          <div className="border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">How Quality Gates Work</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Compression is performed with the selected strategy</li>
              <li>Quality metrics are calculated (semantic similarity, key term retention, etc.)</li>
              <li>
                If <code>overallQuality</code> &lt; <code>minQuality</code>, compression is retried
                with a higher ratio (+0.1)
              </li>
              <li>This repeats until quality is met or ratio reaches 1.0</li>
              <li>If quality still isn't met, the best attempt is returned</li>
            </ol>
          </div>

          {/* Quality Thresholds */}
          <div className="border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Recommended Quality Thresholds</h3>
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="p-2 text-left">Use Case</th>
                  <th className="p-2 text-left">minQuality</th>
                  <th className="p-2 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="p-2">High Fidelity</td>
                  <td className="p-2">
                    <code>0.85-0.95</code>
                  </td>
                  <td className="p-2">Critical content, minimal quality loss acceptable</td>
                </tr>
                <tr className="border-t border-border bg-muted/50">
                  <td className="p-2">Balanced</td>
                  <td className="p-2">
                    <code>0.70-0.85</code>
                  </td>
                  <td className="p-2">Standard use, good compression with acceptable quality</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-2">Aggressive</td>
                  <td className="p-2">
                    <code>0.50-0.70</code>
                  </td>
                  <td className="p-2">Maximum compression, some quality loss acceptable</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Quality Metrics */}
          <div className="border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Quality Metrics Breakdown</h3>
            <div className="space-y-3 text-sm">
              <div>
                <strong className="block mb-1">semanticSimilarity (0-1)</strong>
                <p className="text-muted-foreground">
                  Cosine similarity of term vectors between original and compressed text. Higher
                  means more semantic preservation.
                </p>
              </div>
              <div>
                <strong className="block mb-1">keyTermRetention (0-1)</strong>
                <p className="text-muted-foreground">
                  Percentage of important terms preserved in compressed output. Critical for
                  maintaining meaning.
                </p>
              </div>
              <div>
                <strong className="block mb-1">sentenceRetention (0-1, extractive only)</strong>
                <p className="text-muted-foreground">
                  Percentage of original sentences kept. Only available for extractive strategy.
                </p>
              </div>
              <div>
                <strong className="block mb-1">overallQuality (0-1)</strong>
                <p className="text-muted-foreground">
                  Weighted combination of all quality metrics. This is compared against minQuality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Examples */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Usage Examples</h2>

        <div className="space-y-6">
          {/* Basic Usage */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Basic Usage</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">
                {`import { AdaptiveCompressor } from '@clarity-chat/token-optimization'

const compressor = new AdaptiveCompressor()

// Let it choose the best strategy automatically
const result = await compressor.compress(text)

console.log(\`Strategy used: \${result.strategyUsed}\`)
console.log(\`Reason: \${result.strategyReason}\`)
console.log(\`Compression ratio: \${result.compressionRatio}\`)
console.log(\`Quality: \${result.quality.overallQuality}\`)`}
              </code>
            </pre>
          </div>

          {/* Code Compression */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Example 1: Code Compression</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">
                {`const codeText = \`
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0)
}
\`

const result = await compressor.compress(codeText, {
  targetRatio: 0.5,
  minQuality: 0.9, // High quality for code
})

// Strategy: 'minimal' (code should not be aggressively compressed)
// Quality: ~0.99 (almost perfect preservation)`}
              </code>
            </pre>
          </div>

          {/* Article Compression */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Example 2: Long Article Compression</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">
                {`const article = \`
Artificial Intelligence is transforming how we work and live.
Machine learning models can now process vast amounts of data.
Deep learning has revolutionized image and speech recognition.
Natural language processing enables computers to understand text.
Researchers continue to push the boundaries of AI capabilities.
Ethical considerations are becoming increasingly important.
Privacy and bias must be carefully addressed in AI systems.
The future of AI holds both promise and challenges.
\`

const result = await compressor.compress(article, {
  targetRatio: 0.4, // Aggressive compression
  minQuality: 0.75, // Balanced quality
})

// Strategy: 'extractive' (long document with many sentences)
// Keeps: ~3-4 most important sentences
// Quality: ~0.80 (good semantic preservation)`}
              </code>
            </pre>
          </div>

          {/* Mixed Content */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Example 3: Mixed Content</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">
                {`const mixedContent = \`
Here's how to use the API:

First, import the required modules:
\\\`\\\`\\\`javascript
import { compress } from 'library'
\\\`\\\`\\\`

Then call the compress function with your text.
It will automatically select the best strategy.
You can also provide custom options for fine-tuning.
\`

const result = await compressor.compress(mixedContent, {
  targetRatio: 0.3,
  minQuality: 0.75,
  llmlinguaOptions: {
    preserveCode: true, // Keep code blocks intact
    preserveInstructions: true, // Keep instruction markers
  },
})

// Strategy: 'llmlingua' (mixed content with instructions)
// Preserves: code blocks and instruction markers
// Quality: ~0.80`}
              </code>
            </pre>
          </div>

          {/* Force Strategy */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Example 4: Force Specific Strategy</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">
                {`// Force extractive strategy regardless of content
const result = await compressor.compress(text, {
  forceStrategy: 'extractive',
  targetRatio: 0.5,
  extractiveOptions: {
    minSentences: 3,
    preserveFirst: true,
    preserveLast: true,
    boostQuestions: true,
  },
})

// Strategy: 'extractive' (forced)
// Reason: 'forced by options'`}
              </code>
            </pre>
          </div>

          {/* Debug Mode */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Example 5: Debug Mode</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">
                {`const result = await compressor.compress(text, {
  targetRatio: 0.5,
  debug: true, // Enable debug output
})

// Access debug information
if (result.debug) {
  console.log('Strategies considered:')
  result.debug.strategiesConsidered.forEach(({ strategy, score, reason }) => {
    console.log(\`  \${strategy}: \${score.toFixed(3)} - \${reason}\`)
  })

  console.log('Timing breakdown:')
  console.log(\`  Analysis: \${result.debug.timing.analysisMs}ms\`)
  console.log(\`  Compression: \${result.debug.timing.compressionMs}ms\`)
  console.log(\`  Total: \${result.debug.timing.totalMs}ms\`)
}`}
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* Content Type Detection */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Content Type Detection</h2>
        <p className="mb-4">
          The compressor automatically detects content types to inform strategy selection:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border p-3 text-left">Content Type</th>
                <th className="border border-border p-3 text-left">Detection Criteria</th>
                <th className="border border-border p-3 text-left">Preferred Strategy</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border p-3 font-mono">prose</td>
                <td className="border border-border p-3 text-sm">
                  Natural language text, &lt;30% code
                </td>
                <td className="border border-border p-3">LLMLingua</td>
              </tr>
              <tr className="bg-muted/50">
                <td className="border border-border p-3 font-mono">code</td>
                <td className="border border-border p-3 text-sm">&gt;70% code blocks</td>
                <td className="border border-border p-3">Minimal</td>
              </tr>
              <tr>
                <td className="border border-border p-3 font-mono">mixed</td>
                <td className="border border-border p-3 text-sm">30-70% code blocks</td>
                <td className="border border-border p-3">LLMLingua</td>
              </tr>
              <tr className="bg-muted/50">
                <td className="border border-border p-3 font-mono">structured</td>
                <td className="border border-border p-3 text-sm">JSON, XML, YAML detected</td>
                <td className="border border-border p-3">Minimal</td>
              </tr>
              <tr>
                <td className="border border-border p-3 font-mono">conversational</td>
                <td className="border border-border p-3 text-sm">
                  User/Assistant format, quotes
                </td>
                <td className="border border-border p-3">Extractive</td>
              </tr>
              <tr className="bg-muted/50">
                <td className="border border-border p-3 font-mono">technical</td>
                <td className="border border-border p-3 text-sm">
                  Sections + code blocks present
                </td>
                <td className="border border-border p-3">Extractive</td>
              </tr>
              <tr>
                <td className="border border-border p-3 font-mono">list</td>
                <td className="border border-border p-3 text-sm">
                  &gt;50% lines are list items
                </td>
                <td className="border border-border p-3">LLMLingua</td>
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
            <h3 className="font-semibold mb-2">Start with defaults</h3>
            <p className="text-sm text-muted-foreground">
              Let AdaptiveCompressor choose the strategy automatically. It's optimized for common
              use cases.
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-semibold mb-2">Set appropriate minQuality</h3>
            <p className="text-sm text-muted-foreground">
              Use 0.85+ for critical content, 0.7-0.85 for balanced use, 0.5-0.7 for aggressive
              compression.
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-semibold mb-2">Enable debug mode during development</h3>
            <p className="text-sm text-muted-foreground">
              Use <code>debug: true</code> to understand why strategies are selected and optimize
              your options.
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-semibold mb-2">Preserve code and instructions</h3>
            <p className="text-sm text-muted-foreground">
              For mixed content, set{' '}
              <code>llmlinguaOptions: {'{ preserveCode: true, preserveInstructions: true }'}</code>{' '}
              to keep important sections intact.
            </p>
          </div>

          <div className="border-l-4 border-yellow-500 pl-4">
            <h3 className="font-semibold mb-2">Avoid forceStrategy unless necessary</h3>
            <p className="text-sm text-muted-foreground">
              The automatic selection is usually optimal. Only force a strategy if you have specific
              requirements.
            </p>
          </div>

          <div className="border-l-4 border-yellow-500 pl-4">
            <h3 className="font-semibold mb-2">Monitor processing time</h3>
            <p className="text-sm text-muted-foreground">
              Hybrid strategy is slower. Set <code>maxProcessingTime</code> if you have time
              constraints.
            </p>
          </div>
        </div>
      </section>

      {/* Related APIs */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Related APIs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/api/token-optimization/llmlingua-compressor"
            className="border border-border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">LLMLinguaCompressor</h3>
            <p className="text-sm text-muted-foreground">
              Token-level compression with importance scoring
            </p>
          </a>
          <a
            href="/api/token-optimization/extractive-compressor"
            className="border border-border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">ExtractiveCompressor</h3>
            <p className="text-sm text-muted-foreground">
              Sentence-level compression with coherence preservation
            </p>
          </a>
          <a
            href="/api/token-optimization/quality-gate"
            className="border border-border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">QualityGate</h3>
            <p className="text-sm text-muted-foreground">
              Quality validation with fallback strategies
            </p>
          </a>
          <a
            href="/api/token-optimization/token-counter"
            className="border border-border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">TokenCounter</h3>
            <p className="text-sm text-muted-foreground">
              Accurate token counting for various models
            </p>
          </a>
        </div>
      </section>
    </div>
  )
}
