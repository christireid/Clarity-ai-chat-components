import type { Metadata } from 'next'
import Link from 'next/link'
import { DocumentationPage } from '../../../../../components/Docs/DocumentationPage'
import { Section } from '../../../../../components/Docs/Section'
import { CodeBlock } from '../../../../../components/Docs/CodeBlock'
import { TocItem } from '../../../../../components/Docs/TableOfContents'

export const revalidate = 3600 // ISR: revalidate every hour

export const metadata: Metadata = {
  title: 'DEFAULTS - Token Optimization | Clarity AI Chat Components',
  description:
    'Complete reference for all default configurations and presets in the token optimization system including minimal, standard, production, and enterprise presets.',
  openGraph: {
    title: 'DEFAULTS - Token Optimization Configuration',
    description: 'Default configurations and presets for token optimization',
    type: 'article',
  },
}

const tableOfContents: TocItem[] = [
  { id: 'overview', title: 'Overview', level: 2 },
  { id: 'defaults-object', title: 'DEFAULTS Object', level: 2 },
  { id: 'presets', title: 'Preset Configurations', level: 2 },
  { id: 'model-defaults', title: 'Model Defaults', level: 2 },
  { id: 'cache-defaults', title: 'Cache Defaults', level: 2 },
  { id: 'compression-defaults', title: 'Compression Defaults', level: 2 },
  { id: 'routing-defaults', title: 'Routing Defaults', level: 2 },
  { id: 'security-defaults', title: 'Security Defaults', level: 2 },
  { id: 'budget-defaults', title: 'Budget Defaults', level: 2 },
  { id: 'hook-defaults', title: 'Hook Defaults', level: 2 },
  { id: 'customization', title: 'Customization Patterns', level: 2 },
]

export default function DefaultsPage() {
  return (
    <DocumentationPage
      title="DEFAULTS"
      description="Comprehensive reference for all default configurations, options, and presets"
      category="API Reference"
      icon="⚙️"
      badges={[
        { label: 'Configuration', variant: 'info' },
        { label: 'Reference', variant: 'secondary' },
      ]}
      tableOfContents={tableOfContents}
    >
      <Section id="overview" title="Overview">
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          The <code className="text-sm bg-muted px-2 py-1 rounded">DEFAULTS</code> object contains
          all default values and preset configurations for the token optimization system. This
          enables zero-configuration usage while providing full customization when needed.
        </p>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <span>💡</span>
            <span>Philosophy: Zero-Configuration</span>
          </h3>
          <p className="text-sm text-muted-foreground">
            The token optimization system is designed to work perfectly out-of-the-box for 90% of
            use cases. All defaults are carefully chosen based on production experience and best
            practices. Override only what you need.
          </p>
        </div>

        <CodeBlock
          language="typescript"
          code={`import { DEFAULTS } from '@clarity-chat/token-optimization'

// Access any default value
console.log(DEFAULTS.model) // 'gpt-4o'
console.log(DEFAULTS.debounceMs) // 150
console.log(DEFAULTS.tokenCounter.cacheSize) // 10000

// Access preset configurations
const prodPreset = DEFAULTS.presets.production
console.log(prodPreset.security.enablePIIRedaction) // true`}
        />
      </Section>

      <Section id="defaults-object" title="DEFAULTS Object">
        <p className="text-muted-foreground mb-6">
          The main DEFAULTS object provides centralized access to all default values organized by
          category.
        </p>

        <div className="bg-muted/30 border border-border rounded-xl p-6 mb-6">
          <h4 className="font-semibold mb-4">DEFAULTS Structure</h4>
          <CodeBlock
            language="typescript"
            code={`interface DEFAULTS {
  // Top-level defaults
  model: string                    // Default model: 'gpt-4o'
  debounceMs: number              // Default debounce: 150ms
  maxCacheSize: number            // Default cache size: 1000
  cacheTtlMs: number              // Default TTL: 3600000 (1 hour)
  similarityThreshold: number     // Default similarity: 0.92

  // Component-specific defaults
  tokenCounter: TokenCounterOptions
  count: CountOptions
  compression: CompressionOptions
  llmlingua: LLMLinguaOptions
  cache: CacheOptions
  routing: RoutingConfig
  security: SecurityConfig
  budget: BudgetOptions

  // Hook-specific defaults
  hooks: {
    tokenCount: UseTokenCountOptions
    tokenBudget: UseTokenBudgetOptions
    tokenOptimization: UseTokenOptimizationOptions
  }

  // Preset configurations
  presets: {
    minimal: PresetConfig
    standard: PresetConfig
    production: PresetConfig
    enterprise: PresetConfig
  }
}`}
          />
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-background border border-border rounded-lg">
            <div className="font-mono text-sm mb-2">DEFAULTS.model</div>
            <div className="text-sm text-muted-foreground">
              <strong>Value:</strong> <code>'gpt-4o'</code>
              <br />
              <strong>Reason:</strong> Most commonly used model in production with excellent
              balance of capability and cost
            </div>
          </div>

          <div className="p-4 bg-background border border-border rounded-lg">
            <div className="font-mono text-sm mb-2">DEFAULTS.debounceMs</div>
            <div className="text-sm text-muted-foreground">
              <strong>Value:</strong> <code>150</code>
              <br />
              <strong>Reason:</strong> Good balance between responsiveness and performance for
              real-time token counting
            </div>
          </div>

          <div className="p-4 bg-background border border-border rounded-lg">
            <div className="font-mono text-sm mb-2">DEFAULTS.maxCacheSize</div>
            <div className="text-sm text-muted-foreground">
              <strong>Value:</strong> <code>1000</code>
              <br />
              <strong>Reason:</strong> Balances memory usage with cache hit rates for typical
              applications
            </div>
          </div>

          <div className="p-4 bg-background border border-border rounded-lg">
            <div className="font-mono text-sm mb-2">DEFAULTS.cacheTtlMs</div>
            <div className="text-sm text-muted-foreground">
              <strong>Value:</strong> <code>3600000</code> (1 hour)
              <br />
              <strong>Reason:</strong> Reasonable default for most caching scenarios
            </div>
          </div>

          <div className="p-4 bg-background border border-border rounded-lg">
            <div className="font-mono text-sm mb-2">DEFAULTS.similarityThreshold</div>
            <div className="text-sm text-muted-foreground">
              <strong>Value:</strong> <code>0.92</code>
              <br />
              <strong>Reason:</strong> High confidence that cached responses are semantically
              equivalent
            </div>
          </div>
        </div>
      </Section>

      <Section id="presets" title="Preset Configurations">
        <p className="text-muted-foreground mb-6">
          Four carefully tuned presets cover common deployment scenarios from development to
          enterprise. Each preset configures cache sizes, security settings, compression levels,
          and routing strategies.
        </p>

        <div className="space-y-8">
          {/* Minimal Preset */}
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-gray-500/10 to-gray-600/10 p-6 border-b border-border">
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <span>🚀</span>
                <span>Minimal Preset</span>
              </h3>
              <p className="text-sm text-muted-foreground">
                Development - Lowest security overhead, fastest performance, suitable for local
                development
              </p>
            </div>
            <div className="p-6 space-y-4">
              <CodeBlock
                language="typescript"
                code={`const optimizer = createOptimizer({ preset: 'minimal' })

// Configuration applied:
{
  cache: {
    exact: { maxSize: 100, ttl: 300000 },    // 5 min
    smart: { maxSize: 50, ttl: 300000 }
  },
  compressionLevel: 'light',
  routingStrategy: 'cost-optimized',
  security: {
    enableSanitization: true,
    enablePIIRedaction: false,               // Disabled for dev
    enableAuditLogging: false,               // Disabled for dev
    complianceLevel: 'minimal',
    auditRetention: 7                        // 7 days
  }
}`}
              />
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-semibold mb-2 text-green-500">✓ Optimized For</div>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Local development</li>
                    <li>• Rapid prototyping</li>
                    <li>• Testing and debugging</li>
                    <li>• Minimal overhead</li>
                  </ul>
                </div>
                <div>
                  <div className="font-semibold mb-2 text-amber-500">⚠️ Not Recommended For</div>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Production deployments</li>
                    <li>• User-facing applications</li>
                    <li>• Compliance requirements</li>
                    <li>• High-volume usage</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Standard Preset */}
          <div className="border border-blue-500/30 rounded-xl overflow-hidden bg-blue-500/5">
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-6 border-b border-blue-500/30">
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <span>⭐</span>
                <span>Standard Preset</span>
                <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-500/20 text-blue-400">
                  DEFAULT
                </span>
              </h3>
              <p className="text-sm text-muted-foreground">
                Balanced defaults for most applications - recommended starting point
              </p>
            </div>
            <div className="p-6 space-y-4">
              <CodeBlock
                language="typescript"
                code={`const optimizer = createOptimizer({ preset: 'standard' })
// Or simply: createOptimizer() - standard is the default

// Configuration applied:
{
  cache: {
    exact: { maxSize: 500, ttl: 1800000 },   // 30 min
    smart: { maxSize: 200, ttl: 1800000 }
  },
  compressionLevel: 'moderate',
  routingStrategy: 'balanced',
  security: {
    enableSanitization: true,
    enablePIIRedaction: false,               // Opt-in
    enableAuditLogging: true,                // Enabled for accountability
    complianceLevel: 'standard',
    auditRetention: 30                       // 30 days
  }
}`}
              />
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-semibold mb-2 text-green-500">✓ Optimized For</div>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Most production applications</li>
                    <li>• Balanced cost and performance</li>
                    <li>• Medium-scale deployments</li>
                    <li>• General-purpose usage</li>
                  </ul>
                </div>
                <div>
                  <div className="font-semibold mb-2 text-blue-500">💡 Key Features</div>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Audit logging enabled</li>
                    <li>• Input sanitization active</li>
                    <li>• Moderate compression</li>
                    <li>• Balanced routing strategy</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Production Preset */}
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-6 border-b border-border">
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <span>🏭</span>
                <span>Production Preset</span>
              </h3>
              <p className="text-sm text-muted-foreground">
                Production workloads with enhanced security and PII redaction
              </p>
            </div>
            <div className="p-6 space-y-4">
              <CodeBlock
                language="typescript"
                code={`const optimizer = createOptimizer({ preset: 'production' })

// Configuration applied:
{
  cache: {
    exact: { maxSize: 1000, ttl: 3600000 },  // 1 hour
    smart: { maxSize: 500, ttl: 3600000 }
  },
  compressionLevel: 'moderate',
  routingStrategy: 'balanced',
  security: {
    enableSanitization: true,
    enablePIIRedaction: true,                // Enabled for production
    enableAuditLogging: true,
    complianceLevel: 'standard',
    auditRetention: 30                       // 30 days
  }
}`}
              />
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-semibold mb-2 text-green-500">✓ Optimized For</div>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Production environments</li>
                    <li>• User-facing applications</li>
                    <li>• Enhanced security needs</li>
                    <li>• PII protection required</li>
                  </ul>
                </div>
                <div>
                  <div className="font-semibold mb-2 text-green-500">🔒 Security Features</div>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• PII redaction enabled</li>
                    <li>• Full audit logging</li>
                    <li>• Input sanitization</li>
                    <li>• 30-day audit retention</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Enterprise Preset */}
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-6 border-b border-border">
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <span>🏢</span>
                <span>Enterprise Preset</span>
              </h3>
              <p className="text-sm text-muted-foreground">
                Maximum performance and compliance for high-volume applications
              </p>
            </div>
            <div className="p-6 space-y-4">
              <CodeBlock
                language="typescript"
                code={`const optimizer = createOptimizer({ preset: 'enterprise' })

// Configuration applied:
{
  cache: {
    exact: { maxSize: 5000, ttl: 7200000 },  // 2 hours
    smart: { maxSize: 2000, ttl: 7200000 }
  },
  compressionLevel: 'aggressive',
  routingStrategy: 'quality-first',
  security: {
    enableSanitization: true,
    enablePIIRedaction: true,                // Enabled for compliance
    enableAuditLogging: true,
    complianceLevel: 'strict',               // Strict compliance
    auditRetention: 90                       // 90 days
  }
}`}
              />
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-semibold mb-2 text-green-500">✓ Optimized For</div>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Enterprise deployments</li>
                    <li>• High-volume applications</li>
                    <li>• Strict compliance needs</li>
                    <li>• Maximum optimization</li>
                  </ul>
                </div>
                <div>
                  <div className="font-semibold mb-2 text-purple-500">⚡ Performance</div>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• 5x larger cache sizes</li>
                    <li>• Aggressive compression</li>
                    <li>• Quality-first routing</li>
                    <li>• 90-day audit retention</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
          <h4 className="font-semibold text-amber-500 mb-3 flex items-center gap-2">
            <span>💡</span>
            <span>Choosing a Preset</span>
          </h4>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Development:</strong> Use <code>minimal</code>{' '}
              for fastest iteration with minimal overhead
            </p>
            <p>
              <strong className="text-foreground">Most Applications:</strong> Use{' '}
              <code>standard</code> (default) for balanced production performance
            </p>
            <p>
              <strong className="text-foreground">Production with PII:</strong> Use{' '}
              <code>production</code> when handling sensitive user data
            </p>
            <p>
              <strong className="text-foreground">Enterprise/Compliance:</strong> Use{' '}
              <code>enterprise</code> for maximum performance and strict compliance
            </p>
          </div>
        </div>
      </Section>

      <Section id="model-defaults" title="Model Defaults">
        <p className="text-muted-foreground mb-6">
          Default configurations for token counting and model selection.
        </p>

        <CodeBlock
          language="typescript"
          code={`// Model configuration
DEFAULT_MODEL = 'gpt-4o'
DEFAULT_FALLBACK_MODEL = 'gpt-4o-mini'

// Token counter options
DEFAULT_TOKEN_COUNTER_OPTIONS = {
  model: 'gpt-4o',
  cacheSize: 10000,
  enableCaching: true,
  enableMonitoring: false,
}

// Count options
DEFAULT_COUNT_OPTIONS = {
  model: 'gpt-4o',
  includeSpecialTokens: false,
}`}
        />

        <div className="mt-6 space-y-4">
          <div className="p-4 bg-muted/30 border border-border rounded-lg">
            <h4 className="font-semibold mb-2">Why GPT-4o?</h4>
            <p className="text-sm text-muted-foreground">
              GPT-4o is chosen as the default model because it represents the most commonly used
              model in production environments, offers excellent balance between capability and
              cost, and has a generous 128K context window suitable for most applications.
            </p>
          </div>

          <div className="p-4 bg-muted/30 border border-border rounded-lg">
            <h4 className="font-semibold mb-2">Cache Size: 10,000 entries</h4>
            <p className="text-sm text-muted-foreground">
              The token counter maintains an internal cache of 10,000 string-to-token-count
              mappings. This provides excellent hit rates for typical applications while using
              minimal memory (~1-2 MB).
            </p>
          </div>
        </div>
      </Section>

      <Section id="cache-defaults" title="Cache Defaults">
        <p className="text-muted-foreground mb-6">
          Default cache configurations for semantic and tiered caching systems.
        </p>

        <CodeBlock
          language="typescript"
          code={`DEFAULT_CACHE_OPTIONS = {
  maxSize: 1000,                    // Max cached entries
  ttl: 3600000,                     // 1 hour
  similarityThreshold: 0.92,        // 92% similarity for cache hit
  enableExactMatch: true,           // Fastest: exact string matching
  enableSemanticMatch: true,        // Semantic similarity matching
}

// Tiered cache by preset
DEFAULT_TIERED_CACHE_BY_PRESET = {
  minimal: {
    exact: { maxSize: 100, ttl: 300000 },     // 5 min
    smart: { maxSize: 50, ttl: 300000 },
  },
  standard: {
    exact: { maxSize: 500, ttl: 1800000 },    // 30 min
    smart: { maxSize: 200, ttl: 1800000 },
  },
  production: {
    exact: { maxSize: 1000, ttl: 3600000 },   // 1 hour
    smart: { maxSize: 500, ttl: 3600000 },
  },
  enterprise: {
    exact: { maxSize: 5000, ttl: 7200000 },   // 2 hours
    smart: { maxSize: 2000, ttl: 7200000 },
  },
}`}
        />

        <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
          <h4 className="font-semibold mb-3">Cache Strategy</h4>
          <p className="text-sm text-muted-foreground mb-4">
            The tiered cache uses multiple strategies for optimal hit rates:
          </p>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">1. Exact Match:</strong> Instant lookup for
              identical prompts (fastest)
            </li>
            <li>
              <strong className="text-foreground">2. Smart Match:</strong> Normalized comparison
              with whitespace/case handling
            </li>
            <li>
              <strong className="text-foreground">3. Semantic Match:</strong> Embedding-based
              similarity for paraphrased queries
            </li>
          </ol>
        </div>
      </Section>

      <Section id="compression-defaults" title="Compression Defaults">
        <p className="text-muted-foreground mb-6">
          Default settings for text compression and token reduction strategies.
        </p>

        <CodeBlock
          language="typescript"
          code={`DEFAULT_COMPRESSION_OPTIONS = {
  strategy: 'auto',                 // Auto-select based on content
  preserveStart: 0,                 // Tokens to preserve at start
  preserveEnd: 0,                   // Tokens to preserve at end
  minQuality: 0.85,                 // Minimum quality threshold (0-1)
  targetRatio: 0.5,                 // Target 50% of original size
}

// LLMLingua compression (advanced)
DEFAULT_LLMLINGUA_OPTIONS = {
  preserveCode: true,               // Protect code blocks from compression
  preserveInstructions: true,       // Keep system instructions intact
  minQuality: 0.8,                  // Slightly lower quality for more compression
}`}
        />

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-muted/30 border border-border rounded-lg">
            <div className="font-semibold mb-2 text-green-500">Light</div>
            <div className="text-xs text-muted-foreground">
              Minimal compression, preserves formatting
            </div>
            <div className="mt-2 text-sm font-mono">~10-20% reduction</div>
          </div>
          <div className="p-4 bg-muted/30 border border-border rounded-lg">
            <div className="font-semibold mb-2 text-blue-500">Moderate</div>
            <div className="text-xs text-muted-foreground">
              Balanced compression with quality
            </div>
            <div className="mt-2 text-sm font-mono">~30-50% reduction</div>
          </div>
          <div className="p-4 bg-muted/30 border border-border rounded-lg">
            <div className="font-semibold mb-2 text-purple-500">Aggressive</div>
            <div className="text-xs text-muted-foreground">
              Maximum compression, may affect quality
            </div>
            <div className="mt-2 text-sm font-mono">~50-70% reduction</div>
          </div>
        </div>
      </Section>

      <Section id="routing-defaults" title="Routing Defaults">
        <p className="text-muted-foreground mb-6">
          Default model routing configuration for intelligent model selection based on prompt
          complexity.
        </p>

        <CodeBlock
          language="typescript"
          code={`DEFAULT_ROUTING_CONFIG = {
  models: {
    economy: ['gpt-3.5-turbo', 'claude-3-haiku'],
    standard: ['gpt-4o-mini', 'claude-3-sonnet'],
    premium: ['gpt-4o', 'claude-3-5-sonnet'],
    elite: ['gpt-4', 'claude-3-opus', 'o1'],
  },
  defaultTier: 'standard',
  strategy: 'balanced',
}`}
        />

        <div className="mt-6 space-y-4">
          <div className="p-4 bg-muted/30 border border-border rounded-lg">
            <h4 className="font-semibold mb-3">Routing Strategies</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div>
                <strong className="text-foreground">cost-optimized:</strong> Always choose cheapest
                capable model
              </div>
              <div>
                <strong className="text-foreground">balanced:</strong> Balance cost and quality
                (default)
              </div>
              <div>
                <strong className="text-foreground">quality-first:</strong> Prioritize quality over
                cost
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted/30 border border-border rounded-lg">
            <h4 className="font-semibold mb-3">Model Tiers</h4>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2">Tier</th>
                  <th className="text-left py-2">Use Case</th>
                  <th className="text-left py-2">Cost</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/50">
                  <td className="py-2 font-medium text-foreground">Economy</td>
                  <td className="py-2">Simple queries, classifications</td>
                  <td className="py-2">$0.50/M tokens</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 font-medium text-foreground">Standard</td>
                  <td className="py-2">General purpose, most queries</td>
                  <td className="py-2">$2-5/M tokens</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 font-medium text-foreground">Premium</td>
                  <td className="py-2">Complex reasoning, analysis</td>
                  <td className="py-2">$10-15/M tokens</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium text-foreground">Elite</td>
                  <td className="py-2">Research, critical decisions</td>
                  <td className="py-2">$30-60/M tokens</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <Section id="security-defaults" title="Security Defaults">
        <p className="text-muted-foreground mb-6">
          Default security configurations with opt-in PII redaction and enabled audit logging.
        </p>

        <CodeBlock
          language="typescript"
          code={`DEFAULT_SECURITY_CONFIG = {
  enableSanitization: true,         // Always sanitize inputs
  enablePIIRedaction: false,        // Opt-in for compliance
  enableAuditLogging: true,         // Enabled for accountability
  complianceLevel: 'standard',      // Standard compliance mode
  auditRetention: 30,               // 30 days retention
}`}
        />

        <div className="mt-6 bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
          <h4 className="font-semibold text-amber-500 mb-3 flex items-center gap-2">
            <span>⚠️</span>
            <span>Security Configuration</span>
          </h4>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">PII Redaction:</strong> DISABLED by default (opt-in
              for compliance needs). Enable in production or enterprise presets when handling
              sensitive data.
            </p>
            <p>
              <strong className="text-foreground">Audit Logging:</strong> ENABLED by default
              (required for security monitoring and accountability). Only disabled in minimal preset.
            </p>
            <p>
              <strong className="text-foreground">Sanitization:</strong> ALWAYS enabled to protect
              against injection attacks.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="p-4 bg-muted/30 border border-border rounded-lg">
            <h4 className="font-semibold mb-2">Compliance Levels</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div>
                <strong className="text-foreground">minimal:</strong> Basic sanitization only
              </div>
              <div>
                <strong className="text-foreground">standard:</strong> Sanitization + audit logging
              </div>
              <div>
                <strong className="text-foreground">strict:</strong> Full PII redaction + extended
                retention
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section id="budget-defaults" title="Budget Defaults">
        <p className="text-muted-foreground mb-6">
          Default token budget thresholds for context window management and cost control.
        </p>

        <CodeBlock
          language="typescript"
          code={`DEFAULT_BUDGET_OPTIONS = {
  maxTokens: 4096,                  // Maximum tokens per request
  reserveForOutput: 1000,           // Reserve for response
  warningThreshold: 0.8,            // Warn at 80% (3276 tokens)
  criticalThreshold: 0.95,          // Critical at 95% (3891 tokens)
}`}
        />

        <div className="mt-6 bg-muted/30 border border-border rounded-xl p-6">
          <h4 className="font-semibold mb-4">Budget Thresholds</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-24 h-8 bg-gradient-to-r from-green-500 to-yellow-500 rounded-lg relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-white/20"
                  style={{ width: '80%' }}
                ></div>
              </div>
              <div className="text-sm">
                <div className="font-semibold">Warning (80%)</div>
                <div className="text-muted-foreground">
                  Alert user to consider pruning old messages
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-24 h-8 bg-gradient-to-r from-yellow-500 to-red-500 rounded-lg relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-white/20"
                  style={{ width: '95%' }}
                ></div>
              </div>
              <div className="text-sm">
                <div className="font-semibold">Critical (95%)</div>
                <div className="text-muted-foreground">
                  Block submission or force pruning
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section id="hook-defaults" title="Hook Defaults">
        <p className="text-muted-foreground mb-6">
          Default options for React hooks in the token optimization system.
        </p>

        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">useTokenCount</h4>
            <CodeBlock
              language="typescript"
              code={`DEFAULT_USE_TOKEN_COUNT_OPTIONS = {
  model: 'gpt-4o',
  debounceMs: 150,
  enabled: true,
}`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">useTokenBudget</h4>
            <CodeBlock
              language="typescript"
              code={`DEFAULT_USE_TOKEN_BUDGET_OPTIONS = {
  model: 'gpt-4o',
  debounceMs: 150,
  maxTokens: 4096,
  reserveForOutput: 1000,
  warningThreshold: 0.8,
  criticalThreshold: 0.95,
}`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">useTokenOptimization</h4>
            <CodeBlock
              language="typescript"
              code={`DEFAULT_USE_TOKEN_OPTIMIZATION_OPTIONS = {
  preset: 'standard',
  model: 'gpt-4o',
  enableCache: true,
  enableCompression: true,
  enableRouting: true,
}`}
            />
          </div>
        </div>
      </Section>

      <Section id="customization" title="Customization Patterns">
        <p className="text-muted-foreground mb-6">
          Common patterns for customizing defaults while maintaining sensible fallbacks.
        </p>

        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">Pattern 1: Override Specific Values</h4>
            <CodeBlock
              language="typescript"
              code={`// Start with a preset, override specific values
const optimizer = createOptimizer({
  preset: 'standard',
  security: {
    enablePIIRedaction: true,  // Override preset
  },
})`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">Pattern 2: Use DEFAULTS as Fallback</h4>
            <CodeBlock
              language="typescript"
              code={`import { DEFAULTS } from '@clarity-chat/token-optimization'

// Use user config or fall back to defaults
const config = {
  model: userConfig.model ?? DEFAULTS.model,
  maxCacheSize: userConfig.cacheSize ?? DEFAULTS.maxCacheSize,
  debounceMs: userConfig.debounce ?? DEFAULTS.debounceMs,
}`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">Pattern 3: Environment-Based Presets</h4>
            <CodeBlock
              language="typescript"
              code={`const preset =
  process.env.NODE_ENV === 'production' ? 'production' :
  process.env.NODE_ENV === 'test' ? 'minimal' :
  'standard'

const optimizer = createOptimizer({ preset })`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">Pattern 4: Extend Preset Configuration</h4>
            <CodeBlock
              language="typescript"
              code={`import { DEFAULTS } from '@clarity-chat/token-optimization'

// Build on top of a preset
const customConfig = {
  ...DEFAULTS.presets.production,
  cache: {
    ...DEFAULTS.presets.production.cache,
    exact: {
      ...DEFAULTS.presets.production.cache.exact,
      maxSize: 2000,  // Custom cache size
    },
  },
}`}
            />
          </div>
        </div>

        <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <span>💡</span>
            <span>Best Practice: Progressive Enhancement</span>
          </h4>
          <p className="text-sm text-muted-foreground">
            Start with defaults (or a preset), then override only what you need. This approach
            ensures you benefit from future improvements to default values while maintaining your
            customizations.
          </p>
        </div>
      </Section>

      <div className="mt-12 pt-8 border-t border-border">
        <h3 className="text-xl font-semibold mb-4">Related Documentation</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/reference/components/token-optimization"
            className="p-4 bg-muted/30 border border-border hover:border-brand-500/30 rounded-xl transition-colors"
          >
            <div className="font-semibold mb-1">Token Optimization System</div>
            <div className="text-sm text-muted-foreground">
              Complete guide to the token optimization system
            </div>
          </Link>
          <Link
            href="/reference/components/token-cost-preview"
            className="p-4 bg-muted/30 border border-border hover:border-brand-500/30 rounded-xl transition-colors"
          >
            <div className="font-semibold mb-1">TokenCostPreview</div>
            <div className="text-sm text-muted-foreground">
              Real-time cost estimation component
            </div>
          </Link>
        </div>
      </div>
    </DocumentationPage>
  )
}
