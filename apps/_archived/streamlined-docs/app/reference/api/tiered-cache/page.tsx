import type { Metadata } from 'next'
import Link from 'next/link'
import { DocumentationPage } from '../../../../components/Docs/DocumentationPage'
import { Section } from '../../../../components/Docs/Section'
import { CodeBlock } from '../../../../components/Docs/CodeBlock'
import { TocItem } from '../../../../components/Docs/TableOfContents'

export const revalidate = 3600 // ISR: revalidate every hour

export const metadata: Metadata = {
  title: 'TieredCache API | Clarity AI Chat Components',
  description:
    'Multi-tier caching orchestrator achieving 30-60% cost reduction through intelligent prompt caching with exact, pattern, and semantic matching.',
  openGraph: {
    title: 'TieredCache API - Multi-Tier Prompt Caching',
    description: 'Reduce LLM costs by 30-60% with intelligent 3-tier caching',
    type: 'article',
  },
}

const tableOfContents: TocItem[] = [
  { id: 'overview', title: 'Overview', level: 2 },
  { id: 'architecture', title: 'Architecture', level: 2 },
  { id: 'tier-breakdown', title: 'Three-Tier Breakdown', level: 2 },
  { id: 'api-reference', title: 'API Reference', level: 2 },
  { id: 'configuration', title: 'Configuration', level: 2 },
  { id: 'performance', title: 'Performance Characteristics', level: 2 },
  { id: 'optimization', title: 'Cache Hit Rate Optimization', level: 2 },
  { id: 'production', title: 'Production Deployment', level: 2 },
  { id: 'monitoring', title: 'Monitoring & Metrics', level: 2 },
  { id: 'examples', title: 'Usage Examples', level: 2 },
  { id: 'troubleshooting', title: 'Troubleshooting', level: 2 },
]

export default function TieredCachePage() {
  return (
    <DocumentationPage
      title="TieredCache API"
      description="Multi-tier caching orchestrator for optimal prompt hit rates and cost reduction"
      category="Token Optimization"
      icon="🎯"
      badges={[
        { label: 'Stable', variant: 'success' },
        { label: '30-60% Cost Reduction', variant: 'primary' },
        { label: 'Sub-50ms Latency', variant: 'info' },
      ]}
      features={[
        '3-tier architecture: Exact, Smart, and Semantic matching',
        'Progressive lookup cascade for maximum hit rate',
        'Sub-millisecond exact matching (<1ms)',
        'Fast pattern matching (<5ms)',
        'Semantic similarity search (<50ms)',
        'Comprehensive analytics and metrics',
        'LRU eviction with TTL support',
        'Prefetch and warm-up capabilities',
      ]}
      tableOfContents={tableOfContents}
    >
      <Section id="overview" title="Overview">
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          The TieredCache is a robust multi-tier caching orchestrator designed to maximize
          cache hit rates for LLM prompts while minimizing lookup latency. By combining three
          complementary caching strategies, it achieves 30-60% cost reduction in typical production
          scenarios.
        </p>

        <div className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-2xl">💰</span>
            <span>Cost Reduction Impact</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2 text-foreground">Without Caching</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Every prompt hits the LLM API</p>
                <p>• 100% token consumption</p>
                <p>• Full latency on every request (1-5 seconds)</p>
                <p className="font-semibold text-red-500">Example: $1,000/month for 100K requests</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-foreground">With TieredCache</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• 40-60% cache hit rate (typical)</p>
                <p>• 40-60% token savings</p>
                <p>• Sub-50ms response for cached queries</p>
                <p className="font-semibold text-green-500">Example: $400-600/month (40-60% savings)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-8">
          <h4 className="font-semibold text-blue-500 mb-3">Key Benefits</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              • <strong className="text-foreground">Cost Efficiency</strong>: Reduce API costs by
              30-60% through intelligent caching
            </li>
            <li>
              • <strong className="text-foreground">Low Latency</strong>: Sub-50ms response times for
              all cache hits
            </li>
            <li>
              • <strong className="text-foreground">High Hit Rate</strong>: Multi-tier approach catches
              exact, similar, and semantically equivalent queries
            </li>
            <li>
              • <strong className="text-foreground">Stable</strong>: Built-in TTL, LRU
              eviction, and comprehensive metrics
            </li>
            <li>
              • <strong className="text-foreground">Zero Configuration</strong>: Sensible defaults work
              out of the box
            </li>
          </ul>
        </div>
      </Section>

      <Section id="architecture" title="Architecture Overview">
        <p className="text-muted-foreground mb-6">
          TieredCache orchestrates three specialized cache tiers, each optimized for different query
          patterns. Lookups cascade through tiers in order of speed, maximizing both hit rate and
          performance.
        </p>

        <div className="bg-muted/30 border border-border rounded-xl p-8 mb-8">
          <div className="space-y-6">
            {/* Tier flow diagram */}
            <div className="text-center space-y-4">
              <div className="inline-block p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl">
                <div className="font-semibold">Incoming Query</div>
              </div>

              <div className="text-muted-foreground">↓</div>

              <div className="grid md:grid-cols-3 gap-4 text-sm">
                {/* Tier 1 */}
                <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl">
                  <div className="text-2xl mb-2">⚡</div>
                  <div className="font-semibold mb-1">Tier 1: Exact</div>
                  <div className="text-xs text-muted-foreground mb-3">O(1) hash lookup</div>
                  <div className="text-xs space-y-1">
                    <div className="text-green-500">✓ &lt;1ms latency</div>
                    <div className="text-green-500">✓ 100% precision</div>
                  </div>
                </div>

                {/* Tier 2 */}
                <div className="p-4 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="font-semibold mb-1">Tier 2: Smart</div>
                  <div className="text-xs text-muted-foreground mb-3">Pattern matching</div>
                  <div className="text-xs space-y-1">
                    <div className="text-amber-500">✓ &lt;5ms latency</div>
                    <div className="text-amber-500">✓ Parameterized queries</div>
                  </div>
                </div>

                {/* Tier 3 */}
                <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl">
                  <div className="text-2xl mb-2">🧠</div>
                  <div className="font-semibold mb-1">Tier 3: Semantic</div>
                  <div className="text-xs text-muted-foreground mb-3">Embedding similarity</div>
                  <div className="text-xs space-y-1">
                    <div className="text-purple-500">✓ &lt;50ms latency</div>
                    <div className="text-purple-500">✓ Paraphrase matching</div>
                  </div>
                </div>
              </div>

              <div className="text-muted-foreground">↓</div>

              <div className="inline-block p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl">
                <div className="font-semibold text-green-500">Cache Hit</div>
                <div className="text-xs text-muted-foreground mt-1">
                  or miss if all tiers fail
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
          <h4 className="font-semibold text-amber-600 mb-3">Design Philosophy</h4>
          <p className="text-sm text-muted-foreground mb-4">
            The three-tier architecture balances precision, flexibility, and intelligence:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              • <strong className="text-foreground">Exact tier</strong> handles repeated queries
              (highest precision, lowest latency)
            </li>
            <li>
              • <strong className="text-foreground">Smart tier</strong> handles parameterized
              variations (e.g., "weather in Paris" → "weather in London")
            </li>
            <li>
              • <strong className="text-foreground">Semantic tier</strong> handles paraphrases (e.g.,
              "What's the weather?" → "Tell me the forecast")
            </li>
          </ul>
        </div>
      </Section>

      <Section id="tier-breakdown" title="Three-Tier Breakdown">
        <div className="space-y-8">
          {/* Tier 1: Exact */}
          <div className="border border-green-500/30 rounded-xl p-6 bg-green-500/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">⚡</div>
              <div>
                <h3 className="text-xl font-semibold">Tier 1: ExactCache</h3>
                <p className="text-sm text-muted-foreground">
                  FNV-1a hash-based lookup with LRU eviction
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">How It Works</h4>
                <p className="text-sm text-muted-foreground">
                  Hashes the exact prompt string using FNV-1a algorithm and performs O(1) Map lookup.
                  Identical prompts always hit this tier.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Best For</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Repeated identical queries</li>
                  <li>• FAQ systems</li>
                  <li>• Common user questions</li>
                  <li>• Template-based prompts</li>
                </ul>
              </div>

              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Latency</div>
                  <div className="font-semibold text-green-500">&lt;1ms</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Precision</div>
                  <div className="font-semibold">100%</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Hit Rate</div>
                  <div className="font-semibold">10-30%</div>
                </div>
              </div>

              <CodeBlock
                language="typescript"
                code={`// Example: Exact match
cache.set('What is 2+2?', '4')

await cache.get('What is 2+2?')
// { hit: true, tier: 'exact', data: '4', latency: 0.3 }`}
              />
            </div>
          </div>

          {/* Tier 2: Smart */}
          <div className="border border-amber-500/30 rounded-xl p-6 bg-amber-500/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">🎯</div>
              <div>
                <h3 className="text-xl font-semibold">Tier 2: SmartCache</h3>
                <p className="text-sm text-muted-foreground">
                  Pattern-based matching with entity extraction
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">How It Works</h4>
                <p className="text-sm text-muted-foreground">
                  Normalizes prompts by replacing entities (locations, dates, numbers) with
                  placeholders, then matches on the resulting pattern. Handles parameterized queries.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Entity Normalization</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Locations → {'{location}'} (Paris, London, New York, etc.)</li>
                  <li>• Dates → {'{date}'} (2024-01-15, January 15, etc.)</li>
                  <li>• Numbers → {'{number}'} (42, 100, etc.)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Best For</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Location-based queries (weather, time zones)</li>
                  <li>• Date-based queries (historical events)</li>
                  <li>• Number variations (top N results)</li>
                  <li>• Entity substitution patterns</li>
                </ul>
              </div>

              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Latency</div>
                  <div className="font-semibold text-amber-500">&lt;5ms</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Precision</div>
                  <div className="font-semibold">90-95%</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Hit Rate</div>
                  <div className="font-semibold">15-35%</div>
                </div>
              </div>

              <CodeBlock
                language="typescript"
                code={`// Example: Pattern match
cache.set('What is the weather in Paris?', 'Sunny, 22°C')

await cache.get('What is the weather in London?')
// { hit: true, tier: 'smart', data: 'Sunny, 22°C', latency: 2.1 }
// Pattern: "What is the weather in {location}?"`}
              />
            </div>
          </div>

          {/* Tier 3: Semantic */}
          <div className="border border-purple-500/30 rounded-xl p-6 bg-purple-500/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">🧠</div>
              <div>
                <h3 className="text-xl font-semibold">Tier 3: AdvancedSemanticCache</h3>
                <p className="text-sm text-muted-foreground">
                  Embedding-based similarity matching
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">How It Works</h4>
                <p className="text-sm text-muted-foreground">
                  Generates embeddings for prompts and computes cosine similarity against cached
                  entries. Matches semantically equivalent queries regardless of exact wording.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Similarity Threshold</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Configurable threshold (0.7-0.95) controls precision vs. recall:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 0.92+ (recommended): High precision, conservative matching</li>
                  <li>• 0.85-0.92: Balanced precision and recall</li>
                  <li>• 0.70-0.85: More aggressive, may have false positives</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Best For</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Paraphrased questions</li>
                  <li>• Different phrasings of same intent</li>
                  <li>• Multi-language support (with multilingual embeddings)</li>
                  <li>• Conversational queries</li>
                </ul>
              </div>

              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Latency</div>
                  <div className="font-semibold text-purple-500">&lt;50ms</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Precision</div>
                  <div className="font-semibold">80-90%</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Hit Rate</div>
                  <div className="font-semibold">10-20%</div>
                </div>
              </div>

              <CodeBlock
                language="typescript"
                code={`// Example: Semantic match
cache.set('What is the weather in Paris?', 'Sunny, 22°C')

await cache.get('Tell me the weather for Paris')
// {
//   hit: true,
//   tier: 'semantic',
//   data: 'Sunny, 22°C',
//   similarity: 0.94,
//   latency: 28.5
// }`}
              />
            </div>
          </div>
        </div>
      </Section>

      <Section id="api-reference" title="API Reference">
        <div className="space-y-8">
          {/* Constructor */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Constructor</h3>
            <CodeBlock
              language="typescript"
              code={`new TieredCache(config: TieredCacheConfig)`}
            />
            <p className="text-sm text-muted-foreground mt-2">
              Creates a new TieredCache instance with the specified configuration.
            </p>
          </div>

          {/* get() */}
          <div>
            <h3 className="text-lg font-semibold mb-3">get()</h3>
            <CodeBlock
              language="typescript"
              code={`async get(
  prompt: string,
  context?: CacheContext
): Promise<TieredCacheResult>`}
            />
            <div className="mt-4 space-y-2">
              <p className="text-sm font-semibold">Parameters</p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>
                  • <code className="text-xs bg-muted px-1 py-0.5 rounded">prompt</code> - The prompt
                  to look up
                </li>
                <li>
                  • <code className="text-xs bg-muted px-1 py-0.5 rounded">context</code> (optional) -
                  Context for semantic matching (domain, user, session)
                </li>
              </ul>
              <p className="text-sm font-semibold mt-3">Returns</p>
              <CodeBlock
                language="typescript"
                code={`interface TieredCacheResult {
  hit: boolean              // Whether any tier had a cache hit
  tier?: 'exact' | 'smart' | 'semantic'  // Which tier provided the hit
  data?: string             // The cached response data
  similarity?: number       // Similarity score (for semantic hits)
  latency?: number         // Lookup latency in milliseconds
}`}
              />
            </div>
          </div>

          {/* set() */}
          <div>
            <h3 className="text-lg font-semibold mb-3">set()</h3>
            <CodeBlock
              language="typescript"
              code={`async set(
  prompt: string,
  response: string,
  metadata?: Record<string, unknown>
): Promise<void>`}
            />
            <div className="mt-4 space-y-2">
              <p className="text-sm font-semibold">Parameters</p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>
                  • <code className="text-xs bg-muted px-1 py-0.5 rounded">prompt</code> - The prompt
                </li>
                <li>
                  • <code className="text-xs bg-muted px-1 py-0.5 rounded">response</code> - The
                  response to cache
                </li>
                <li>
                  • <code className="text-xs bg-muted px-1 py-0.5 rounded">metadata</code> (optional) -
                  Additional metadata
                </li>
              </ul>
              <p className="text-sm text-muted-foreground mt-3">
                Populates all three cache tiers for maximum hit potential.
              </p>
            </div>
          </div>

          {/* invalidate() */}
          <div>
            <h3 className="text-lg font-semibold mb-3">invalidate()</h3>
            <CodeBlock
              language="typescript"
              code={`async invalidate(prompt: string): Promise<void>`}
            />
            <p className="text-sm text-muted-foreground mt-2">
              Invalidates a specific prompt from the cache. Note: Only exact cache supports direct
              invalidation. Smart and semantic caches rely on TTL and LRU eviction.
            </p>
          </div>

          {/* prefetch() */}
          <div>
            <h3 className="text-lg font-semibold mb-3">prefetch()</h3>
            <CodeBlock
              language="typescript"
              code={`async prefetch(items: PrefetchItem[]): Promise<void>

interface PrefetchItem {
  key: string
  value: string
  metadata?: Record<string, unknown>
}`}
            />
            <p className="text-sm text-muted-foreground mt-2">
              Prefetches multiple items into the cache. Useful for warming up the cache with known
              common queries.
            </p>
          </div>

          {/* clear() */}
          <div>
            <h3 className="text-lg font-semibold mb-3">clear()</h3>
            <CodeBlock language="typescript" code={`clear(): void`} />
            <p className="text-sm text-muted-foreground mt-2">
              Clears all cache tiers and resets statistics.
            </p>
          </div>

          {/* getStats() */}
          <div>
            <h3 className="text-lg font-semibold mb-3">getStats()</h3>
            <CodeBlock language="typescript" code={`getStats(): CacheStats`} />
            <div className="mt-4">
              <p className="text-sm font-semibold mb-2">Returns</p>
              <CodeBlock
                language="typescript"
                code={`interface CacheStats {
  hitRate: number          // Overall cache hit rate (0-1)
  totalHits: number        // Total hits across all tiers
  totalMisses: number      // Total misses (no hit in any tier)
  exactSize: number        // Size of exact cache
  smartSize: number        // Size of smart cache
  semanticSize: number     // Size of semantic cache
  tierStats: {
    exact: TierStats
    smart: TierStats
    semantic: TierStats
  }
}

interface TierStats {
  hits: number
  misses: number
  size: number
}`}
              />
            </div>
          </div>
        </div>
      </Section>

      <Section id="configuration" title="Configuration Options">
        <div className="space-y-6">
          <CodeBlock
            language="typescript"
            code={`interface TieredCacheConfig {
  exact: ExactCacheConfig
  smart: SmartCacheConfig
  semantic: SemanticCacheConfig
}

interface ExactCacheConfig {
  maxSize: number  // Maximum number of entries
  ttl: number      // Time-to-live in milliseconds
}

interface SmartCacheConfig {
  maxSize: number  // Maximum number of patterns to store
  ttl: number      // Time-to-live in milliseconds
}

interface SemanticCacheConfig {
  maxSize: number                 // Maximum number of cached entries
  maxAge: number                  // Maximum age in milliseconds
  similarityThreshold: number     // Minimum similarity score (0.7-0.95)
  enableEmbeddingCache: boolean   // Cache embeddings for performance
  enableContextAwareness: boolean // Use context for matching
  enablePredictiveCaching: boolean // Pre-cache predicted content
  embeddingModel?: string         // Optional custom embedding model
  compressionThreshold: number    // Compress if larger than this size
}`}
          />

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <h4 className="font-semibold text-blue-500 mb-3">Recommended Configuration</h4>
            <CodeBlock
              language="typescript"
              code={`const cache = new TieredCache({
  exact: {
    maxSize: 1000,      // Store top 1000 exact queries
    ttl: 3600000,       // 1 hour TTL
  },
  smart: {
    maxSize: 500,       // Store 500 patterns
    ttl: 3600000,       // 1 hour TTL
  },
  semantic: {
    maxSize: 200,       // Smaller due to embedding overhead
    maxAge: 3600000,    // 1 hour max age
    similarityThreshold: 0.92,  // High precision
    enableEmbeddingCache: true,
    enableContextAwareness: false,  // Disable for simplicity
    enablePredictiveCaching: false, // Disable for simplicity
    compressionThreshold: 10000,    // 10KB compression threshold
  },
})`}
            />
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
            <h4 className="font-semibold text-amber-600 mb-3">Configuration Guidelines</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                • <strong className="text-foreground">Exact Cache Size</strong>: Set based on total
                unique queries. Start with 1000, monitor size in production.
              </li>
              <li>
                • <strong className="text-foreground">Smart Cache Size</strong>: Smaller than exact
                (typically 50% of exact size) since patterns compress many queries.
              </li>
              <li>
                • <strong className="text-foreground">Semantic Cache Size</strong>: Smallest tier due
                to embedding overhead. 200-500 entries typical.
              </li>
              <li>
                • <strong className="text-foreground">TTL</strong>: Balance freshness vs. hit rate.
                1-hour typical for dynamic content, 24-hours for stable content.
              </li>
              <li>
                • <strong className="text-foreground">Similarity Threshold</strong>: 0.92+ for
                production (high precision). Lower for experimentation.
              </li>
            </ul>
          </div>
        </div>
      </Section>

      <Section id="performance" title="Performance Characteristics">
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-xl">
              <div className="text-2xl mb-2">⚡</div>
              <h4 className="font-semibold mb-2">Tier 1: Exact</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Latency</span>
                  <span className="font-semibold text-green-500">&lt;1ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Algorithm</span>
                  <span className="font-medium">O(1) hash</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Memory</span>
                  <span className="font-medium">~200B/entry</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <div className="text-2xl mb-2">🎯</div>
              <h4 className="font-semibold mb-2">Tier 2: Smart</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Latency</span>
                  <span className="font-semibold text-amber-500">&lt;5ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Algorithm</span>
                  <span className="font-medium">O(n) pattern match</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Memory</span>
                  <span className="font-medium">~300B/pattern</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-purple-500/10 border border-purple-500/30 rounded-xl">
              <div className="text-2xl mb-2">🧠</div>
              <h4 className="font-semibold mb-2">Tier 3: Semantic</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Latency</span>
                  <span className="font-semibold text-purple-500">&lt;50ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Algorithm</span>
                  <span className="font-medium">O(n) cosine sim</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Memory</span>
                  <span className="font-medium">~600B/entry</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 border border-border rounded-xl p-6">
            <h4 className="font-semibold mb-4">Latency Breakdown</h4>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Scenario</th>
                  <th className="text-left py-3 px-4 font-semibold">Latency</th>
                  <th className="text-left py-3 px-4 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">Exact hit</td>
                  <td className="py-3 px-4 font-medium text-green-500">&lt;1ms</td>
                  <td className="py-3 px-4">Fastest path</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">Smart hit (after exact miss)</td>
                  <td className="py-3 px-4 font-medium text-amber-500">1-5ms</td>
                  <td className="py-3 px-4">Includes exact lookup time</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">Semantic hit (after exact + smart miss)</td>
                  <td className="py-3 px-4 font-medium text-purple-500">5-50ms</td>
                  <td className="py-3 px-4">Includes all tier lookups</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Complete miss (all tiers)</td>
                  <td className="py-3 px-4 font-medium">5-50ms</td>
                  <td className="py-3 px-4">Falls through all tiers</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <h4 className="font-semibold text-blue-500 mb-3">Performance vs. LLM API</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Cache Hit (worst case)</div>
                <div className="text-2xl font-bold text-green-500">50ms</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">LLM API Call (typical)</div>
                <div className="text-2xl font-bold text-red-500">1,000-5,000ms</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Cache hits are 20-100x faster than LLM API calls, even in the worst case (semantic
              tier).
            </p>
          </div>
        </div>
      </Section>

      <Section id="optimization" title="Cache Hit Rate Optimization">
        <div className="space-y-6">
          <p className="text-muted-foreground">
            Maximize cache hit rate through strategic configuration, prefetching, and query
            normalization.
          </p>

          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6">
            <h4 className="font-semibold text-green-500 mb-3">Strategy 1: Prefetch Common Queries</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Warm up the cache with frequently asked questions and common patterns.
            </p>
            <CodeBlock
              language="typescript"
              code={`// Prefetch FAQ responses
await cache.prefetch([
  {
    key: 'What are your business hours?',
    value: 'We are open Monday-Friday, 9am-5pm EST.'
  },
  {
    key: 'How do I reset my password?',
    value: 'Click "Forgot Password" on the login page...'
  },
  {
    key: 'What is your refund policy?',
    value: 'We offer 30-day money-back guarantee...'
  },
])

// Result: Instant responses for common questions`}
            />
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-6">
            <h4 className="font-semibold text-blue-500 mb-3">
              Strategy 2: Normalize User Input
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Preprocess queries to increase exact and smart tier hits.
            </p>
            <CodeBlock
              language="typescript"
              code={`function normalizeQuery(query: string): string {
  return query
    .toLowerCase()
    .trim()
    .replace(/\\s+/g, ' ')  // Normalize whitespace
    .replace(/[?.!,]+$/, '')  // Remove trailing punctuation
}

// Before caching
const normalized = normalizeQuery(userInput)
const result = await cache.get(normalized)

// Example:
// "What's the weather?" → "what's the weather"
// "What's   the weather??" → "what's the weather"`}
            />
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6">
            <h4 className="font-semibold text-purple-500 mb-3">Strategy 3: Tune Similarity Threshold</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Balance precision vs. recall based on your use case.
            </p>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-background rounded-lg border border-border">
                <div className="font-medium mb-1">High Precision (0.92+)</div>
                <div className="text-xs text-muted-foreground">
                  Best for: FAQ, customer support, factual queries
                </div>
                <div className="text-xs text-muted-foreground">
                  Trade-off: Lower hit rate, but high confidence
                </div>
              </div>
              <div className="p-3 bg-background rounded-lg border border-border">
                <div className="font-medium mb-1">Balanced (0.85-0.92)</div>
                <div className="text-xs text-muted-foreground">
                  Best for: General purpose, conversational AI
                </div>
                <div className="text-xs text-muted-foreground">
                  Trade-off: Good hit rate with acceptable precision
                </div>
              </div>
              <div className="p-3 bg-background rounded-lg border border-border">
                <div className="font-medium mb-1">High Recall (0.70-0.85)</div>
                <div className="text-xs text-muted-foreground">
                  Best for: Creative content, recommendations
                </div>
                <div className="text-xs text-muted-foreground">
                  Trade-off: High hit rate, but may have false positives
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-6">
            <h4 className="font-semibold text-amber-600 mb-3">Strategy 4: Monitor and Adjust</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Use cache statistics to identify optimization opportunities.
            </p>
            <CodeBlock
              language="typescript"
              code={`// Regularly check cache stats
setInterval(() => {
  const stats = cache.getStats()

  console.log(\`Overall hit rate: \${(stats.hitRate * 100).toFixed(1)}%\`)
  console.log(\`Exact hits: \${stats.tierStats.exact.hits}\`)
  console.log(\`Smart hits: \${stats.tierStats.smart.hits}\`)
  console.log(\`Semantic hits: \${stats.tierStats.semantic.hits}\`)

  // If exact hit rate is low, consider prefetching more
  if (stats.tierStats.exact.hits / stats.totalHits < 0.3) {
    console.warn('Low exact hit rate - consider prefetching common queries')
  }

  // If semantic tier is unused, consider lowering threshold
  if (stats.tierStats.semantic.hits === 0) {
    console.warn('No semantic hits - threshold may be too high')
  }
}, 300000) // Every 5 minutes`}
            />
          </div>
        </div>
      </Section>

      <Section id="production" title="Production Deployment Guide">
        <div className="space-y-6">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
            <h4 className="font-semibold text-red-500 mb-3">🚨 Production Checklist</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" />
                <span>
                  Configure appropriate cache sizes based on expected query volume (start conservative)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" />
                <span>Set TTL based on data freshness requirements (1 hour typical)</span>
              </li>
              <li className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" />
                <span>
                  Enable metrics collection and set up monitoring dashboards (see Monitoring section)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" />
                <span>Prefetch top 20-50 most common queries during startup</span>
              </li>
              <li className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" />
                <span>
                  Test semantic threshold in staging to find optimal precision/recall balance
                </span>
              </li>
              <li className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" />
                <span>Set up cache invalidation strategy for data updates</span>
              </li>
              <li className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" />
                <span>Configure alerts for low hit rates or performance degradation</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Production Configuration Template</h4>
            <CodeBlock
              language="typescript"
              code={`import { TieredCache } from '@clarity-chat/token-optimization'

// Robust configuration
const cache = new TieredCache({
  exact: {
    maxSize: 5000,      // Scale based on traffic
    ttl: 3600000,       // 1 hour for most use cases
  },
  smart: {
    maxSize: 2500,      // ~50% of exact cache
    ttl: 3600000,
  },
  semantic: {
    maxSize: 500,       // Conservative for memory efficiency
    maxAge: 3600000,
    similarityThreshold: 0.92,  // High precision for production
    enableEmbeddingCache: true,
    enableContextAwareness: false,  // Simplicity > features initially
    enablePredictiveCaching: false,
    compressionThreshold: 10000,
  },
})

// Prefetch common queries on startup
async function warmUpCache() {
  const commonQueries = await fetchCommonQueries() // From analytics
  await cache.prefetch(commonQueries)
  console.log(\`Warmed up cache with \${commonQueries.length} queries\`)
}

// Initialize
await warmUpCache()

// Metrics collection (see Monitoring section)
setInterval(() => {
  const stats = cache.getStats()
  metrics.gauge('cache.hit_rate', stats.hitRate)
  metrics.gauge('cache.exact.size', stats.exactSize)
  metrics.gauge('cache.smart.size', stats.smartSize)
  metrics.gauge('cache.semantic.size', stats.semanticSize)
}, 60000) // Every minute`}
            />
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <h4 className="font-semibold text-blue-500 mb-3">Scaling Considerations</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                • <strong className="text-foreground">Memory Usage</strong>: Plan for ~1KB per cached
                entry (including embeddings). 5000 entries ≈ 5MB RAM.
              </li>
              <li>
                • <strong className="text-foreground">CPU Usage</strong>: Semantic tier is most
                intensive. Consider reducing semantic cache size if CPU is constrained.
              </li>
              <li>
                • <strong className="text-foreground">Multi-Instance</strong>: Each server instance
                has its own cache. Consider distributed caching (Redis) for shared state.
              </li>
              <li>
                • <strong className="text-foreground">Cold Start</strong>: First queries after
                deployment will miss cache. Use prefetch to minimize impact.
              </li>
            </ul>
          </div>
        </div>
      </Section>

      <Section id="monitoring" title="Monitoring & Metrics">
        <div className="space-y-6">
          <p className="text-muted-foreground">
            Track cache performance and optimize based on real-world usage patterns.
          </p>

          <div className="bg-muted/30 border border-border rounded-xl p-6">
            <h4 className="font-semibold mb-4">Key Metrics to Monitor</h4>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Metric</th>
                  <th className="text-left py-3 px-4 font-semibold">Target</th>
                  <th className="text-left py-3 px-4 font-semibold">Action If Below Target</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium text-foreground">Overall Hit Rate</td>
                  <td className="py-3 px-4">40-60%</td>
                  <td className="py-3 px-4">Increase cache sizes, prefetch more queries</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium text-foreground">Exact Tier Hit Rate</td>
                  <td className="py-3 px-4">20-40% of total</td>
                  <td className="py-3 px-4">Prefetch common queries, normalize input</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium text-foreground">Smart Tier Hit Rate</td>
                  <td className="py-3 px-4">15-30% of total</td>
                  <td className="py-3 px-4">Verify entity patterns match your domain</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium text-foreground">Semantic Tier Hit Rate</td>
                  <td className="py-3 px-4">5-15% of total</td>
                  <td className="py-3 px-4">Lower similarity threshold (cautiously)</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium text-foreground">Average Latency</td>
                  <td className="py-3 px-4">&lt;10ms</td>
                  <td className="py-3 px-4">Check semantic cache size, optimize embeddings</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-foreground">Cache Size Growth</td>
                  <td className="py-3 px-4">Stable at maxSize</td>
                  <td className="py-3 px-4">LRU eviction working, no action needed</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Metrics Collection Example</h4>
            <CodeBlock
              language="typescript"
              code={`// Collect and export cache metrics
function collectCacheMetrics() {
  const stats = cache.getStats()

  return {
    // Overall metrics
    'cache.hit_rate': stats.hitRate,
    'cache.total_hits': stats.totalHits,
    'cache.total_misses': stats.totalMisses,

    // Tier-specific metrics
    'cache.exact.hits': stats.tierStats.exact.hits,
    'cache.exact.misses': stats.tierStats.exact.misses,
    'cache.exact.size': stats.tierStats.exact.size,
    'cache.exact.hit_rate':
      stats.tierStats.exact.hits /
      (stats.tierStats.exact.hits + stats.tierStats.exact.misses),

    'cache.smart.hits': stats.tierStats.smart.hits,
    'cache.smart.misses': stats.tierStats.smart.misses,
    'cache.smart.size': stats.tierStats.smart.size,
    'cache.smart.hit_rate':
      stats.tierStats.smart.hits /
      (stats.tierStats.smart.hits + stats.tierStats.smart.misses),

    'cache.semantic.hits': stats.tierStats.semantic.hits,
    'cache.semantic.misses': stats.tierStats.semantic.misses,
    'cache.semantic.size': stats.tierStats.semantic.size,
    'cache.semantic.hit_rate':
      stats.tierStats.semantic.hits /
      (stats.tierStats.semantic.hits + stats.tierStats.semantic.misses),
  }
}

// Export to your metrics system
setInterval(() => {
  const metrics = collectCacheMetrics()

  // Datadog
  // dogstatsd.gauge('cache.hit_rate', metrics['cache.hit_rate'])

  // Prometheus
  // prometheusRegistry.gauge('cache_hit_rate', metrics['cache.hit_rate'])

  // Custom logging
  console.log('Cache Metrics:', JSON.stringify(metrics, null, 2))
}, 60000) // Every minute`}
            />
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
            <h4 className="font-semibold text-green-500 mb-3">Cost Savings Calculation</h4>
            <CodeBlock
              language="typescript"
              code={`function calculateCostSavings(
  stats: CacheStats,
  avgTokensPerQuery: number = 1000,
  costPer1kTokens: number = 0.03  // GPT-4 pricing
): {
  monthlySavings: number
  annualSavings: number
  savingsPercentage: number
} {
  const totalQueries = stats.totalHits + stats.totalMisses
  const cachedQueries = stats.totalHits

  // Cost without caching
  const totalCostWithoutCache =
    (totalQueries * avgTokensPerQuery / 1000) * costPer1kTokens

  // Cost with caching (only pay for misses)
  const totalCostWithCache =
    (stats.totalMisses * avgTokensPerQuery / 1000) * costPer1kTokens

  const savings = totalCostWithoutCache - totalCostWithCache
  const savingsPercentage = (savings / totalCostWithoutCache) * 100

  // Project monthly/annual (assuming metrics from 1 hour)
  const hoursPerMonth = 730  // ~30 days
  const hoursPerYear = 8760  // 365 days

  return {
    monthlySavings: savings * hoursPerMonth,
    annualSavings: savings * hoursPerYear,
    savingsPercentage,
  }
}

// Example usage
const savings = calculateCostSavings(cache.getStats())
console.log(\`Projected monthly savings: $\${savings.monthlySavings.toFixed(2)}\`)
console.log(\`Projected annual savings: $\${savings.annualSavings.toFixed(2)}\`)
console.log(\`Cost reduction: \${savings.savingsPercentage.toFixed(1)}%\`)`}
            />
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <h4 className="font-semibold text-blue-500 mb-3">Dashboard Widgets</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Recommended widgets for your monitoring dashboard:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                • <strong className="text-foreground">Hit Rate Gauge</strong>: Overall cache hit rate
                with 40-60% target zone
              </li>
              <li>
                • <strong className="text-foreground">Tier Distribution</strong>: Pie chart showing
                hits by tier
              </li>
              <li>
                • <strong className="text-foreground">Latency Histogram</strong>: Distribution of
                lookup latencies
              </li>
              <li>
                • <strong className="text-foreground">Cache Size Timeline</strong>: Growth of each
                tier over time
              </li>
              <li>
                • <strong className="text-foreground">Cost Savings</strong>: Projected monthly/annual
                savings
              </li>
              <li>
                • <strong className="text-foreground">Miss Rate Alert</strong>: Alert if hit rate
                drops below 30%
              </li>
            </ul>
          </div>
        </div>
      </Section>

      <Section id="examples" title="Usage Examples">
        <div className="space-y-8">
          {/* Basic Usage */}
          <div>
            <h4 className="font-semibold mb-3">Basic Usage</h4>
            <CodeBlock
              language="typescript"
              code={`import { TieredCache } from '@clarity-chat/token-optimization'

// Initialize cache
const cache = new TieredCache({
  exact: { maxSize: 1000, ttl: 3600000 },
  smart: { maxSize: 500, ttl: 3600000 },
  semantic: {
    maxSize: 200,
    maxAge: 3600000,
    similarityThreshold: 0.92,
    enableEmbeddingCache: true,
    enableContextAwareness: false,
    enablePredictiveCaching: false,
    compressionThreshold: 10000,
  },
})

// Store a response
await cache.set(
  'What is the weather in Paris?',
  'Sunny with a high of 22°C'
)

// Retrieve (exact match)
const result = await cache.get('What is the weather in Paris?')
console.log(result)
// {
//   hit: true,
//   tier: 'exact',
//   data: 'Sunny with a high of 22°C',
//   latency: 0.5
// }`}
            />
          </div>

          {/* Integration with LLM */}
          <div>
            <h4 className="font-semibold mb-3">Integration with LLM API</h4>
            <CodeBlock
              language="typescript"
              code={`async function getChatResponse(prompt: string): Promise<string> {
  // Try cache first
  const cached = await cache.get(prompt)

  if (cached.hit) {
    console.log(\`Cache hit (\${cached.tier} tier) - saved API call!\`)
    return cached.data!
  }

  // Cache miss - call LLM API
  console.log('Cache miss - calling LLM API')
  const response = await callLLMAPI(prompt)

  // Store in cache for future requests
  await cache.set(prompt, response)

  return response
}

// Usage
const answer1 = await getChatResponse('What is 2+2?')
// Cache miss - calling LLM API
// Returns: "4"

const answer2 = await getChatResponse('What is 2+2?')
// Cache hit (exact tier) - saved API call!
// Returns: "4" (from cache, <1ms)

const answer3 = await getChatResponse('Tell me 2 plus 2')
// Cache hit (semantic tier) - saved API call!
// Returns: "4" (from cache, ~30ms)`}
            />
          </div>

          {/* Prefetching FAQ */}
          <div>
            <h4 className="font-semibold mb-3">Prefetching Common Queries</h4>
            <CodeBlock
              language="typescript"
              code={`// Warm up cache on application startup
async function initializeCache() {
  const faqData = [
    {
      key: 'What are your business hours?',
      value: 'We are open Monday-Friday, 9am-5pm EST.',
    },
    {
      key: 'How do I reset my password?',
      value: 'Click "Forgot Password" on the login page and follow the email instructions.',
    },
    {
      key: 'What payment methods do you accept?',
      value: 'We accept Visa, Mastercard, American Express, and PayPal.',
    },
    {
      key: 'How long does shipping take?',
      value: 'Standard shipping takes 5-7 business days. Express shipping is 2-3 days.',
    },
  ]

  await cache.prefetch(faqData)
  console.log(\`Prefetched \${faqData.length} FAQ responses\`)
}

// Call during app initialization
await initializeCache()

// Now FAQ queries will hit cache immediately
const response = await getChatResponse('What are your business hours?')
// Instant response from exact cache tier`}
            />
          </div>

          {/* Monitoring Integration */}
          <div>
            <h4 className="font-semibold mb-3">Monitoring Integration</h4>
            <CodeBlock
              language="typescript"
              code={`import { TieredCache } from '@clarity-chat/token-optimization'

// Track cache performance per request
async function getCachedResponse(prompt: string) {
  const startTime = Date.now()
  const result = await cache.get(prompt)
  const duration = Date.now() - startTime

  // Log metrics
  if (result.hit) {
    metrics.increment('cache.hit', 1, { tier: result.tier })
    metrics.histogram('cache.latency', duration, { tier: result.tier })
  } else {
    metrics.increment('cache.miss', 1)
  }

  return result
}

// Periodic stats reporting
setInterval(() => {
  const stats = cache.getStats()

  console.log(\`
    Cache Performance Report
    ========================
    Overall Hit Rate: \${(stats.hitRate * 100).toFixed(1)}%
    Total Hits: \${stats.totalHits}
    Total Misses: \${stats.totalMisses}

    Tier Breakdown:
    - Exact: \${stats.tierStats.exact.hits} hits (\${stats.tierStats.exact.size} entries)
    - Smart: \${stats.tierStats.smart.hits} hits (\${stats.tierStats.smart.size} patterns)
    - Semantic: \${stats.tierStats.semantic.hits} hits (\${stats.tierStats.semantic.size} entries)
  \`)
}, 300000) // Every 5 minutes`}
            />
          </div>

          {/* Context-Aware Caching */}
          <div>
            <h4 className="font-semibold mb-3">Context-Aware Caching (Advanced)</h4>
            <CodeBlock
              language="typescript"
              code={`// Use context for multi-tenant or personalized caching
async function getCachedResponseWithContext(
  prompt: string,
  userId: string,
  domain: string
) {
  const context = {
    userContext: userId,
    domain: domain,
    sessionContext: getCurrentSession(),
  }

  const result = await cache.get(prompt, context)

  if (result.hit) {
    return result.data
  }

  // Generate response
  const response = await generateResponse(prompt, context)
  await cache.set(prompt, response, context)

  return response
}

// Different users can get different cached responses
await getCachedResponseWithContext('Show my orders', 'user123', 'ecommerce')
await getCachedResponseWithContext('Show my orders', 'user456', 'ecommerce')`}
            />
          </div>
        </div>
      </Section>

      <Section id="troubleshooting" title="Troubleshooting">
        <div className="space-y-6">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
            <h4 className="font-semibold text-red-500 mb-3">Problem: Low Hit Rate (&lt;30%)</h4>
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                <strong className="text-foreground">Symptoms:</strong> Overall hit rate below 30%,
                most queries missing cache
              </p>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Possible Causes:</strong>
              </p>
              <ul className="space-y-1 ml-4 text-muted-foreground">
                <li>• High query diversity (each query is unique)</li>
                <li>• Cache sizes too small for query volume</li>
                <li>• Semantic threshold too high (missing semantic hits)</li>
                <li>• Input not normalized (whitespace, punctuation variations)</li>
              </ul>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Solutions:</strong>
              </p>
              <ul className="space-y-1 ml-4 text-muted-foreground">
                <li>
                  • Increase cache sizes (exact to 5000+, smart to 2500+, semantic to 1000+)
                </li>
                <li>• Lower semantic threshold to 0.85-0.90 (test impact on precision)</li>
                <li>• Implement query normalization (lowercase, trim, remove punctuation)</li>
                <li>• Prefetch common queries based on analytics</li>
              </ul>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
            <h4 className="font-semibold text-amber-600 mb-3">Problem: High Latency (&gt;50ms)</h4>
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                <strong className="text-foreground">Symptoms:</strong> Cache lookups taking longer
                than expected
              </p>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Possible Causes:</strong>
              </p>
              <ul className="space-y-1 ml-4 text-muted-foreground">
                <li>• Semantic cache too large (slow embedding comparisons)</li>
                <li>• Heavy memory pressure causing GC pauses</li>
                <li>• Embedding generation bottleneck</li>
              </ul>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Solutions:</strong>
              </p>
              <ul className="space-y-1 ml-4 text-muted-foreground">
                <li>• Reduce semantic cache size (200-500 entries typical)</li>
                <li>• Ensure embedding cache is enabled (enableEmbeddingCache: true)</li>
                <li>• Monitor memory usage and increase if needed</li>
                <li>• Consider disabling semantic tier if not needed</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <h4 className="font-semibold text-blue-500 mb-3">Problem: Memory Usage Too High</h4>
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                <strong className="text-foreground">Symptoms:</strong> Application using excessive
                RAM
              </p>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Possible Causes:</strong>
              </p>
              <ul className="space-y-1 ml-4 text-muted-foreground">
                <li>• Cache sizes set too large</li>
                <li>• Large responses being cached</li>
                <li>• Embedding cache growing unbounded</li>
              </ul>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Solutions:</strong>
              </p>
              <ul className="space-y-1 ml-4 text-muted-foreground">
                <li>
                  • Reduce cache sizes (start with exact: 1000, smart: 500, semantic: 200)
                </li>
                <li>• Enable compression for large responses (compressionThreshold: 5000)</li>
                <li>• Monitor cache.size metrics and adjust maxSize accordingly</li>
                <li>• Consider truncating very long responses before caching</li>
              </ul>
            </div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
            <h4 className="font-semibold text-purple-500 mb-3">
              Problem: Semantic Tier Never Hits
            </h4>
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                <strong className="text-foreground">Symptoms:</strong> No hits in semantic tier
                (stats.tierStats.semantic.hits = 0)
              </p>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Possible Causes:</strong>
              </p>
              <ul className="space-y-1 ml-4 text-muted-foreground">
                <li>• Similarity threshold too high (0.95+)</li>
                <li>• Queries too diverse for semantic matching</li>
                <li>• Smart tier catching all variations first</li>
              </ul>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Solutions:</strong>
              </p>
              <ul className="space-y-1 ml-4 text-muted-foreground">
                <li>• Lower threshold to 0.85-0.90 and monitor precision</li>
                <li>• Check if smart tier is too aggressive (consider reducing patterns)</li>
                <li>
                  • Verify semantic tier is needed for your use case (may not be for structured
                  queries)
                </li>
                <li>• Disable semantic tier if not providing value (saves memory)</li>
              </ul>
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
            <h4 className="font-semibold text-green-500 mb-3">Problem: False Positive Cache Hits</h4>
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                <strong className="text-foreground">Symptoms:</strong> Cached responses don't match
                the query intent
              </p>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Possible Causes:</strong>
              </p>
              <ul className="space-y-1 ml-4 text-muted-foreground">
                <li>• Similarity threshold too low (semantic tier)</li>
                <li>• Smart tier matching overly broad patterns</li>
              </ul>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Solutions:</strong>
              </p>
              <ul className="space-y-1 ml-4 text-muted-foreground">
                <li>• Increase semantic threshold to 0.92+ for higher precision</li>
                <li>• Review smart cache patterns and ensure they're specific enough</li>
                <li>• Consider adding validation to check semantic similarity score</li>
                <li>
                  • Implement feedback mechanism to remove bad matches from cache
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      <div className="mt-12 pt-8 border-t border-border">
        <div className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-4">Ready to Reduce Costs?</h3>
          <p className="text-muted-foreground mb-6">
            TieredCache is robust and battle-tested. Start saving 30-60% on LLM costs
            today with intelligent multi-tier caching.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/examples/token-optimization"
              className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium transition-colors"
            >
              View Live Examples
            </Link>
            <Link
              href="/guides/token-optimization"
              className="px-6 py-3 bg-muted hover:bg-muted/80 rounded-lg font-medium transition-colors"
            >
              Complete Integration Guide
            </Link>
          </div>
        </div>
      </div>
    </DocumentationPage>
  )
}
