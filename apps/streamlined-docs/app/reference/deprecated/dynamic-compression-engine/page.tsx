'use client'

import { AlertTriangle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'

export default function DynamicCompressionEngineDeprecatedPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4 py-8">
      {/* Deprecation banner */}
      <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-lg">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
          <div>
            <h1 className="text-2xl font-bold text-red-900 dark:text-red-100 mb-2">
              DynamicCompressionEngine (Deprecated)
            </h1>
            <p className="text-red-800 dark:text-red-200">
              <strong>Deprecated in v1.0.0</strong> - Will be removed in v2.0.0
            </p>
            <p className="text-sm text-red-700 dark:text-red-300 mt-2">
              Use <code className="px-1.5 py-0.5 rounded bg-red-900/20">LLMLinguaCompressor</code>,{' '}
              <code className="px-1.5 py-0.5 rounded bg-red-900/20">ExtractiveCompressor</code>, or{' '}
              <code className="px-1.5 py-0.5 rounded bg-red-900/20">AdaptiveCompressor</code> instead.
            </p>
          </div>
        </div>
      </div>

      {/* Reason for deprecation */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Reason for Deprecation</h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          The original <code>DynamicCompressionEngine</code> claimed "70-85% compression"
          but delivered only 10-30% (mostly whitespace removal). The new strategy-based
          compressors achieve <strong>2-20x real compression</strong> with quality monitoring.
        </p>
        <div className="mt-4 p-4 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <h3 className="font-semibold mb-2">Performance Comparison</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-300 dark:border-neutral-700">
                <th className="text-left py-2">Approach</th>
                <th className="text-right py-2">Compression</th>
                <th className="text-right py-2">Quality</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="py-2 text-red-600 dark:text-red-400">DynamicCompressionEngine (old)</td>
                <td className="text-right py-2 font-mono">10-30%</td>
                <td className="text-right py-2">N/A</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="py-2 text-emerald-600 dark:text-emerald-400">LLMLinguaCompressor</td>
                <td className="text-right py-2 font-mono">2-20x</td>
                <td className="text-right py-2">0.7-0.9</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="py-2 text-emerald-600 dark:text-emerald-400">ExtractiveCompressor</td>
                <td className="text-right py-2 font-mono">2-10x</td>
                <td className="text-right py-2">0.8-0.95</td>
              </tr>
              <tr>
                <td className="py-2 text-emerald-600 dark:text-emerald-400">AdaptiveCompressor</td>
                <td className="text-right py-2 font-mono">2-15x</td>
                <td className="text-right py-2">Auto</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Migration guide */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Migration Guide</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          Follow our comprehensive{' '}
          <Link href="/guides/compression-strategies" className="text-brand-600 hover:underline">
            Compression Strategies Guide
          </Link>{' '}
          for step-by-step migration instructions.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Old API */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-red-600 dark:text-red-400">
              ❌ Old API (Deprecated)
            </h3>
            <CodeBlock
              code={`// ❌ Old (deprecated):
import { DynamicCompressionEngine } from '@clarity-chat/token-optimization'

const engine = new DynamicCompressionEngine({
  targetRatio: 0.5
})
const result = await engine.compress(text)
console.log(result) // Just a string`}
              language="typescript"
            />
          </div>

          {/* New API */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              ✅ New API (Recommended)
            </h3>
            <CodeBlock
              code={`// ✅ New (recommended):
import { compressWithLLMLingua } from '@clarity-chat/token-optimization'

const result = await compressWithLLMLingua(text, {
  targetRatio: 0.5,
  qualityThreshold: 0.7,
})
console.log(result.compressed)
console.log(result.quality) // 0.82`}
              language="typescript"
            />
          </div>
        </div>
      </section>

      {/* Breaking changes */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Breaking Changes</h2>
        <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400">
          <li>
            Return type changed from <code>string</code> to{' '}
            <code>CompressionResult</code> with quality metrics
          </li>
          <li>Quality metrics now included in result (quality score, compression ratio)</li>
          <li>Error handling improved with typed errors (<code>CompressionError</code>)</li>
          <li>Synchronous API removed (all compression is async)</li>
          <li>Configuration options expanded (quality thresholds, preserve options)</li>
        </ul>
      </section>

      {/* Example migration */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Complete Migration Example</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          Here's a complete before/after example showing how to migrate your code:
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="text-base font-semibold mb-2 text-red-600 dark:text-red-400">Before (Old API)</h3>
            <CodeBlock
              code={`import { DynamicCompressionEngine } from '@clarity-chat/token-optimization'

async function compressDocument(text: string) {
  const engine = new DynamicCompressionEngine({
    targetRatio: 0.5,
    preserveFormatting: true
  })

  try {
    const compressed = await engine.compress(text)
    return compressed
  } catch (error) {
    console.error('Compression failed:', error)
    return text // Fallback to original
  }
}`}
              language="typescript"
            />
          </div>

          <div>
            <h3 className="text-base font-semibold mb-2 text-emerald-600 dark:text-emerald-400">After (New API)</h3>
            <CodeBlock
              code={`import { compressWithLLMLingua } from '@clarity-chat/token-optimization'
import type { CompressionResult } from '@clarity-chat/token-optimization'

async function compressDocument(text: string): Promise<string> {
  try {
    const result: CompressionResult = await compressWithLLMLingua(text, {
      targetRatio: 0.5,
      qualityThreshold: 0.7, // Ensure quality >= 0.7
      preserveStructure: true
    })

    // Check quality before using compressed version
    if (result.quality >= 0.7) {
      console.log(\`Compressed \${result.originalTokens} → \${result.compressedTokens} tokens\`)
      console.log(\`Quality score: \${result.quality}\`)
      return result.compressed
    } else {
      console.warn('Quality too low, using original')
      return text
    }
  } catch (error) {
    console.error('Compression failed:', error)
    return text // Fallback to original
  }
}`}
              language="typescript"
            />
          </div>
        </div>
      </section>

      {/* Next steps */}
      <section className="bg-brand-500/10 border border-brand-500/30 p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Next Steps</h2>
        <div className="space-y-3">
          <Link
            href="/guides/compression-strategies"
            className="flex items-center gap-2 text-brand-600 hover:underline"
          >
            <ArrowRight className="w-4 h-4" />
            Read Compression Strategies Guide
          </Link>
          <Link
            href="/reference/classes/llmlingua-compressor"
            className="flex items-center gap-2 text-brand-600 hover:underline"
          >
            <ArrowRight className="w-4 h-4" />
            LLMLinguaCompressor API Reference
          </Link>
          <Link
            href="/reference/classes/extractive-compressor"
            className="flex items-center gap-2 text-brand-600 hover:underline"
          >
            <ArrowRight className="w-4 h-4" />
            ExtractiveCompressor API Reference
          </Link>
          <Link
            href="/reference/classes/adaptive-compressor"
            className="flex items-center gap-2 text-brand-600 hover:underline"
          >
            <ArrowRight className="w-4 h-4" />
            AdaptiveCompressor API Reference
          </Link>
          <Link
            href="/cookbook/achieving-50-percent-reduction"
            className="flex items-center gap-2 text-brand-600 hover:underline"
          >
            <ArrowRight className="w-4 h-4" />
            Achieving 50-70% Cost Reduction Cookbook
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
              When will DynamicCompressionEngine be removed?
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              The API will be removed in v2.0.0. We recommend migrating as soon as possible to benefit
              from improved compression and quality monitoring.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
              Which compressor should I use?
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Start with <code>AdaptiveCompressor</code> which automatically selects the best strategy.
              For fine-grained control, use <code>LLMLinguaCompressor</code> for prompts or{' '}
              <code>ExtractiveCompressor</code> for documents.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
              Can I still use DynamicCompressionEngine in v1.x?
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Yes, it remains available in v1.x but is not recommended. The new compressors provide
              significantly better results with quality monitoring.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
              How do I handle quality scores?
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Quality scores range from 0-1. Set a <code>qualityThreshold</code> (e.g., 0.7) and
              fall back to the original text if quality is too low. This ensures compression doesn't
              harm readability.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
