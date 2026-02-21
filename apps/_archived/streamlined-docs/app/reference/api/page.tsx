'use client'

/**
 * API Reference - Token Optimization Index
 *
 * Comprehensive directory of all 87 token optimization APIs
 * organized by category with search, filtering, and quick navigation.
 *
 * Categories:
 * 1. Token Counting (5 APIs)
 * 2. Caching (11 APIs)
 * 3. Provider-Native Caching (6 APIs) - HERO FEATURE
 * 4. Compression (15 APIs)
 * 5. Routing (4 APIs)
 * 6. Cost Optimization (3 APIs)
 * 7. React Hooks (11 APIs)
 * 8. React Components (3 APIs)
 * 9. Format Optimizers (6 APIs)
 * 10. Observability (12 APIs)
 * 11. Security (3 APIs)
 * 12. Budget Management (2 APIs)
 * 13. Accessibility (10 APIs)
 * 14. Model Registry (22 APIs)
 * 15. Defaults & Presets (13 APIs)
 */

import * as React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Filter,
  Zap,
  DollarSign,
  Database,
  Activity,
  Shield,
  Gauge,
  Eye,
  Sparkles,
  BarChart3,
  Lock,
  Wallet,
  Accessibility,
  BookOpen,
  Settings,
  ArrowRight,
  Star,
  TrendingDown,
  CheckCircle2,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { durations } from '@/lib/animations'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface APIInfo {
  name: string
  slug: string
  description: string
  category: string
  isHeroFeature?: boolean
  isNew?: boolean
  savingsPercent?: string
  complexity?: 'beginner' | 'intermediate' | 'advanced'
  type: 'function' | 'hook' | 'component' | 'class' | 'type' | 'config'
}

// ============================================================================
// API CATALOG - 87 APIs
// ============================================================================

const apis: APIInfo[] = [
  // ====== 1. TOKEN COUNTING (5 APIs) ======
  {
    name: 'countTokens',
    slug: 'count-tokens',
    description: 'Fast token counting with model-specific encoders. Supports GPT-4, Claude, and custom models.',
    category: 'Token Counting',
    complexity: 'beginner',
    type: 'function',
  },
  {
    name: 'estimateTokens',
    slug: 'estimate-tokens',
    description: 'Quick estimation using character-based heuristics. 5x faster than exact counting.',
    category: 'Token Counting',
    complexity: 'beginner',
    type: 'function',
  },
  {
    name: 'batchCountTokens',
    slug: 'batch-count-tokens',
    description: 'Count tokens for multiple messages simultaneously with parallel processing.',
    category: 'Token Counting',
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'streamingTokenCounter',
    slug: 'streaming-token-counter',
    description: 'Real-time token counting for streaming responses with chunk-by-chunk updates.',
    category: 'Token Counting',
    complexity: 'advanced',
    type: 'class',
  },
  {
    name: 'createTokenCounter',
    slug: 'create-token-counter',
    description: 'Factory function for creating custom token counters with model-specific configurations.',
    category: 'Token Counting',
    complexity: 'advanced',
    type: 'function',
  },

  // ====== 2. CACHING (11 APIs) ======
  {
    name: 'createCacheManager',
    slug: 'create-cache-manager',
    description: 'Initialize intelligent caching system with LRU eviction and TTL support.',
    category: 'Caching',
    savingsPercent: '40-60%',
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'cacheMessage',
    slug: 'cache-message',
    description: 'Cache individual messages with automatic deduplication and compression.',
    category: 'Caching',
    savingsPercent: '20-40%',
    complexity: 'beginner',
    type: 'function',
  },
  {
    name: 'getCachedResponse',
    slug: 'get-cached-response',
    description: 'Retrieve cached responses with semantic similarity matching for fuzzy lookups.',
    category: 'Caching',
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'invalidateCache',
    slug: 'invalidate-cache',
    description: 'Manually invalidate cache entries with pattern matching and selective clearing.',
    category: 'Caching',
    complexity: 'beginner',
    type: 'function',
  },
  {
    name: 'setCacheStrategy',
    slug: 'set-cache-strategy',
    description: 'Configure caching behavior: aggressive, balanced, or conservative modes.',
    category: 'Caching',
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'getCacheStats',
    slug: 'get-cache-stats',
    description: 'Real-time cache analytics including hit rate, size, and savings metrics.',
    category: 'Caching',
    complexity: 'beginner',
    type: 'function',
  },
  {
    name: 'prefetchCache',
    slug: 'prefetch-cache',
    description: 'Pre-populate cache with common queries for zero-latency responses.',
    category: 'Caching',
    savingsPercent: '30-50%',
    complexity: 'advanced',
    type: 'function',
  },
  {
    name: 'mergeCaches',
    slug: 'merge-caches',
    description: 'Combine multiple cache instances with conflict resolution strategies.',
    category: 'Caching',
    complexity: 'advanced',
    type: 'function',
  },
  {
    name: 'exportCache',
    slug: 'export-cache',
    description: 'Serialize cache to disk for persistence across sessions.',
    category: 'Caching',
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'importCache',
    slug: 'import-cache',
    description: 'Load cached data from disk with validation and version compatibility checks.',
    category: 'Caching',
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'warmCache',
    slug: 'warm-cache',
    description: 'Initialize cache with historical data for immediate availability.',
    category: 'Caching',
    savingsPercent: '25-45%',
    complexity: 'advanced',
    type: 'function',
  },

  // ====== 3. PROVIDER-NATIVE CACHING (6 APIs) - HERO FEATURE ======
  {
    name: 'enableAnthropicCaching',
    slug: 'enable-anthropic-caching',
    description: 'Activate Anthropic Prompt Caching for 90% cost reduction on repeated contexts.',
    category: 'Provider-Native Caching',
    isHeroFeature: true,
    savingsPercent: '90%',
    isNew: true,
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'configureOpenAICaching',
    slug: 'configure-openai-caching',
    description: 'Setup OpenAI-compatible caching with automatic cache key generation.',
    category: 'Provider-Native Caching',
    isHeroFeature: true,
    savingsPercent: '50-70%',
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'createCacheBreakpoints',
    slug: 'create-cache-breakpoints',
    description: 'Define optimal cache boundaries for maximum savings with provider-native caching.',
    category: 'Provider-Native Caching',
    isHeroFeature: true,
    savingsPercent: '60-80%',
    isNew: true,
    complexity: 'advanced',
    type: 'function',
  },
  {
    name: 'detectCachableContent',
    slug: 'detect-cachable-content',
    description: 'Automatically identify system prompts and static content for caching.',
    category: 'Provider-Native Caching',
    isHeroFeature: true,
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'getProviderCacheStats',
    slug: 'get-provider-cache-stats',
    description: 'Track provider-native cache hits, savings, and optimization opportunities.',
    category: 'Provider-Native Caching',
    isHeroFeature: true,
    complexity: 'beginner',
    type: 'function',
  },
  {
    name: 'optimizeCacheBoundaries',
    slug: 'optimize-cache-boundaries',
    description: 'AI-powered suggestions for optimal cache breakpoint placement.',
    category: 'Provider-Native Caching',
    isHeroFeature: true,
    savingsPercent: '70-90%',
    isNew: true,
    complexity: 'advanced',
    type: 'function',
  },

  // ====== 4. COMPRESSION (15 APIs) ======
  {
    name: 'compressPrompt',
    slug: 'compress-prompt',
    description: 'Intelligent prompt compression preserving semantic meaning while reducing tokens by 30-50%.',
    category: 'Compression',
    savingsPercent: '30-50%',
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'compressConversation',
    slug: 'compress-conversation',
    description: 'Summarize long conversations into compact context with key points extraction.',
    category: 'Compression',
    savingsPercent: '40-70%',
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'removeRedundancy',
    slug: 'remove-redundancy',
    description: 'Eliminate duplicate information and verbose phrasing automatically.',
    category: 'Compression',
    savingsPercent: '20-40%',
    complexity: 'beginner',
    type: 'function',
  },
  {
    name: 'abbreviateText',
    slug: 'abbreviate-text',
    description: 'Smart abbreviation system preserving readability and meaning.',
    category: 'Compression',
    savingsPercent: '15-25%',
    complexity: 'beginner',
    type: 'function',
  },
  {
    name: 'extractKeyPoints',
    slug: 'extract-key-points',
    description: 'AI-powered extraction of essential information from verbose content.',
    category: 'Compression',
    savingsPercent: '50-70%',
    complexity: 'advanced',
    type: 'function',
  },
  {
    name: 'simplifyLanguage',
    slug: 'simplify-language',
    description: 'Convert complex phrasing to simpler alternatives reducing token count.',
    category: 'Compression',
    savingsPercent: '10-20%',
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'pruneContext',
    slug: 'prune-context',
    description: 'Remove low-relevance context while maintaining conversation coherence.',
    category: 'Compression',
    savingsPercent: '30-60%',
    complexity: 'advanced',
    type: 'function',
  },
  {
    name: 'summarizeDocuments',
    slug: 'summarize-documents',
    description: 'Extract summaries from long documents for RAG and context inclusion.',
    category: 'Compression',
    savingsPercent: '60-80%',
    complexity: 'advanced',
    type: 'function',
  },
  {
    name: 'adaptiveCompression',
    slug: 'adaptive-compression',
    description: 'Dynamic compression ratio based on context window utilization.',
    category: 'Compression',
    savingsPercent: '25-55%',
    complexity: 'advanced',
    type: 'function',
  },
  {
    name: 'preserveSemantics',
    slug: 'preserve-semantics',
    description: 'Compression with semantic similarity validation ensuring quality.',
    category: 'Compression',
    complexity: 'advanced',
    type: 'function',
  },
  {
    name: 'compressCodeSnippets',
    slug: 'compress-code-snippets',
    description: 'Specialized compression for code blocks preserving syntax and logic.',
    category: 'Compression',
    savingsPercent: '20-40%',
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'compressJSON',
    slug: 'compress-json',
    description: 'Optimize JSON payloads with whitespace removal and key shortening.',
    category: 'Compression',
    savingsPercent: '30-50%',
    complexity: 'beginner',
    type: 'function',
  },
  {
    name: 'batchCompress',
    slug: 'batch-compress',
    description: 'Compress multiple messages in parallel with shared context optimization.',
    category: 'Compression',
    savingsPercent: '35-60%',
    complexity: 'advanced',
    type: 'function',
  },
  {
    name: 'getCompressionStats',
    slug: 'get-compression-stats',
    description: 'Analyze compression effectiveness and semantic similarity metrics.',
    category: 'Compression',
    complexity: 'beginner',
    type: 'function',
  },
  {
    name: 'configureCompression',
    slug: 'configure-compression',
    description: 'Fine-tune compression strategies with quality-vs-savings trade-offs.',
    category: 'Compression',
    complexity: 'intermediate',
    type: 'function',
  },

  // ====== 5. ROUTING (4 APIs) ======
  {
    name: 'routeToCheapestModel',
    slug: 'route-to-cheapest-model',
    description: 'Automatically route requests to the most cost-effective model meeting quality requirements.',
    category: 'Routing',
    savingsPercent: '40-70%',
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'routeByComplexity',
    slug: 'route-by-complexity',
    description: 'Classify query complexity and route to appropriately-sized models.',
    category: 'Routing',
    savingsPercent: '30-60%',
    complexity: 'advanced',
    type: 'function',
  },
  {
    name: 'createFallbackChain',
    slug: 'create-fallback-chain',
    description: 'Define fallback sequence: cheap model first, expensive only if needed.',
    category: 'Routing',
    savingsPercent: '50-80%',
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'configureRoutingRules',
    slug: 'configure-routing-rules',
    description: 'Set custom routing logic based on user, context, or business rules.',
    category: 'Routing',
    complexity: 'advanced',
    type: 'function',
  },

  // ====== 6. COST OPTIMIZATION (3 APIs) ======
  {
    name: 'calculateCost',
    slug: 'calculate-cost',
    description: 'Precise cost calculation for any model with input/output token breakdown.',
    category: 'Cost Optimization',
    complexity: 'beginner',
    type: 'function',
  },
  {
    name: 'predictCost',
    slug: 'predict-cost',
    description: 'Forecast costs before sending requests with confidence intervals.',
    category: 'Cost Optimization',
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'optimizeCostPerformance',
    slug: 'optimize-cost-performance',
    description: 'Find optimal model and settings for target cost-performance ratio.',
    category: 'Cost Optimization',
    savingsPercent: '40-75%',
    complexity: 'advanced',
    type: 'function',
  },

  // ====== 7. REACT HOOKS (11 APIs) ======
  {
    name: 'useTokenCount',
    slug: 'use-token-count',
    description: 'React hook for real-time token counting with automatic updates.',
    category: 'React Hooks',
    complexity: 'beginner',
    type: 'hook',
  },
  {
    name: 'useTokenBudget',
    slug: 'use-token-budget',
    description: 'Manage token budgets with warnings and automatic enforcement.',
    category: 'React Hooks',
    complexity: 'intermediate',
    type: 'hook',
  },
  {
    name: 'useOptimization',
    slug: 'use-optimization',
    description: 'Access optimization statistics and controls in React components.',
    category: 'React Hooks',
    complexity: 'intermediate',
    type: 'hook',
  },
  {
    name: 'useCostEstimation',
    slug: 'use-cost-estimation',
    description: 'Real-time cost estimation as users type with live updates.',
    category: 'React Hooks',
    complexity: 'beginner',
    type: 'hook',
  },
  {
    name: 'useProviderCaching',
    slug: 'use-provider-caching',
    description: 'Manage provider-native caching in React with automatic invalidation.',
    category: 'React Hooks',
    isNew: true,
    complexity: 'intermediate',
    type: 'hook',
  },
  {
    name: 'useCompressionStats',
    slug: 'use-compression-stats',
    description: 'Monitor compression effectiveness and token savings in real-time.',
    category: 'React Hooks',
    complexity: 'beginner',
    type: 'hook',
  },
  {
    name: 'useModelRouter',
    slug: 'use-model-router',
    description: 'Intelligent model routing with React state integration.',
    category: 'React Hooks',
    complexity: 'intermediate',
    type: 'hook',
  },
  {
    name: 'useOptimizationPreset',
    slug: 'use-optimization-preset',
    description: 'Apply predefined optimization presets (aggressive, balanced, conservative).',
    category: 'React Hooks',
    complexity: 'beginner',
    type: 'hook',
  },
  {
    name: 'useSavingsMetrics',
    slug: 'use-savings-metrics',
    description: 'Track cumulative savings and ROI across sessions.',
    category: 'React Hooks',
    complexity: 'beginner',
    type: 'hook',
  },
  {
    name: 'useContextPruning',
    slug: 'use-context-pruning',
    description: 'Automatic context window management with smart pruning.',
    category: 'React Hooks',
    complexity: 'advanced',
    type: 'hook',
  },
  {
    name: 'useAdaptiveOptimization',
    slug: 'use-adaptive-optimization',
    description: 'ML-powered optimization that learns from usage patterns.',
    category: 'React Hooks',
    isNew: true,
    complexity: 'advanced',
    type: 'hook',
  },

  // ====== 8. REACT COMPONENTS (3 APIs) ======
  {
    name: 'TokenCounter',
    slug: 'token-counter-component',
    description: 'Visual token counter with progress bars and threshold warnings.',
    category: 'React Components',
    complexity: 'beginner',
    type: 'component',
  },
  {
    name: 'TokenCostPreview',
    slug: 'token-cost-preview-component',
    description: 'Live cost preview showing estimated spend as users type.',
    category: 'React Components',
    complexity: 'beginner',
    type: 'component',
  },
  {
    name: 'TokenOptimizationPanel',
    slug: 'token-optimization-panel-component',
    description: 'Comprehensive optimization dashboard with analytics and controls.',
    category: 'React Components',
    complexity: 'intermediate',
    type: 'component',
  },

  // ====== 9. FORMAT OPTIMIZERS (6 APIs) ======
  {
    name: 'optimizeMarkdown',
    slug: 'optimize-markdown',
    description: 'Compress markdown while preserving formatting and readability.',
    category: 'Format Optimizers',
    savingsPercent: '15-30%',
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'optimizeJSON',
    slug: 'optimize-json',
    description: 'Minimize JSON payloads with intelligent key shortening.',
    category: 'Format Optimizers',
    savingsPercent: '25-45%',
    complexity: 'beginner',
    type: 'function',
  },
  {
    name: 'optimizeCode',
    slug: 'optimize-code',
    description: 'Remove comments and optimize code snippets for token efficiency.',
    category: 'Format Optimizers',
    savingsPercent: '20-40%',
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'optimizeHTML',
    slug: 'optimize-html',
    description: 'Strip HTML to semantic content preserving structure.',
    category: 'Format Optimizers',
    savingsPercent: '40-60%',
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'optimizeXML',
    slug: 'optimize-xml',
    description: 'Compress XML documents with whitespace and attribute optimization.',
    category: 'Format Optimizers',
    savingsPercent: '30-50%',
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'autoDetectFormat',
    slug: 'auto-detect-format',
    description: 'Automatically detect content format and apply optimal compression.',
    category: 'Format Optimizers',
    complexity: 'advanced',
    type: 'function',
  },

  // ====== 10. OBSERVABILITY (12 APIs) ======
  {
    name: 'trackTokenUsage',
    slug: 'track-token-usage',
    description: 'Detailed token usage tracking with per-request granularity.',
    category: 'Observability',
    complexity: 'beginner',
    type: 'function',
  },
  {
    name: 'trackCostMetrics',
    slug: 'track-cost-metrics',
    description: 'Real-time cost tracking with trend analysis and alerts.',
    category: 'Observability',
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'trackCacheHitRate',
    slug: 'track-cache-hit-rate',
    description: 'Monitor cache effectiveness with hit/miss ratios and trends.',
    category: 'Observability',
    complexity: 'beginner',
    type: 'function',
  },
  {
    name: 'trackCompressionRatio',
    slug: 'track-compression-ratio',
    description: 'Measure compression effectiveness across different content types.',
    category: 'Observability',
    complexity: 'beginner',
    type: 'function',
  },
  {
    name: 'generateUsageReport',
    slug: 'generate-usage-report',
    description: 'Comprehensive usage reports with visualizations and insights.',
    category: 'Observability',
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'exportMetrics',
    slug: 'export-metrics',
    description: 'Export metrics to monitoring platforms (Datadog, Grafana, etc.).',
    category: 'Observability',
    complexity: 'advanced',
    type: 'function',
  },
  {
    name: 'setMetricsCallbacks',
    slug: 'set-metrics-callbacks',
    description: 'Custom callbacks for metrics collection and alerting.',
    category: 'Observability',
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'getOptimizationInsights',
    slug: 'get-optimization-insights',
    description: 'AI-powered recommendations for improvement opportunities.',
    category: 'Observability',
    complexity: 'advanced',
    type: 'function',
  },
  {
    name: 'compareOptimizations',
    slug: 'compare-optimizations',
    description: 'A/B test different optimization strategies with statistical analysis.',
    category: 'Observability',
    complexity: 'advanced',
    type: 'function',
  },
  {
    name: 'trackPerformanceMetrics',
    slug: 'track-performance-metrics',
    description: 'Monitor latency impact of optimization techniques.',
    category: 'Observability',
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'alertOnAnomalies',
    slug: 'alert-on-anomalies',
    description: 'Automatic alerts for unusual usage patterns or cost spikes.',
    category: 'Observability',
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'trackProviderMetrics',
    slug: 'track-provider-metrics',
    description: 'Provider-specific metrics including cache hits and rate limits.',
    category: 'Observability',
    complexity: 'intermediate',
    type: 'function',
  },

  // ====== 11. SECURITY (3 APIs) ======
  {
    name: 'sanitizeInput',
    slug: 'sanitize-input',
    description: 'Remove sensitive information before token optimization.',
    category: 'Security',
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'validateOptimizationSafety',
    slug: 'validate-optimization-safety',
    description: 'Ensure compressed content maintains security requirements.',
    category: 'Security',
    complexity: 'advanced',
    type: 'function',
  },
  {
    name: 'encryptCachedData',
    slug: 'encrypt-cached-data',
    description: 'End-to-end encryption for cached responses with key rotation.',
    category: 'Security',
    complexity: 'advanced',
    type: 'function',
  },

  // ====== 12. BUDGET MANAGEMENT (2 APIs) ======
  {
    name: 'setBudgetLimits',
    slug: 'set-budget-limits',
    description: 'Define hard limits on token usage and costs with enforcement.',
    category: 'Budget Management',
    complexity: 'beginner',
    type: 'function',
  },
  {
    name: 'trackBudgetUtilization',
    slug: 'track-budget-utilization',
    description: 'Monitor budget consumption with projections and alerts.',
    category: 'Budget Management',
    complexity: 'intermediate',
    type: 'function',
  },

  // ====== 13. ACCESSIBILITY (10 APIs) ======
  {
    name: 'announceTokenCount',
    slug: 'announce-token-count',
    description: 'Screen reader announcements for token usage updates.',
    category: 'Accessibility',
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'provideCostGuidance',
    slug: 'provide-cost-guidance',
    description: 'Accessible cost guidance with plain language explanations.',
    category: 'Accessibility',
    complexity: 'beginner',
    type: 'function',
  },
  {
    name: 'keyboardOptimizationControls',
    slug: 'keyboard-optimization-controls',
    description: 'Full keyboard navigation for optimization settings.',
    category: 'Accessibility',
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'highContrastMetrics',
    slug: 'high-contrast-metrics',
    description: 'Accessible visualization of token and cost metrics.',
    category: 'Accessibility',
    complexity: 'beginner',
    type: 'function',
  },
  {
    name: 'reducedMotionOptimization',
    slug: 'reduced-motion-optimization',
    description: 'Respect prefers-reduced-motion for optimization UI.',
    category: 'Accessibility',
    complexity: 'beginner',
    type: 'function',
  },
  {
    name: 'screenReaderSummaries',
    slug: 'screen-reader-summaries',
    description: 'Concise summaries of optimization statistics for assistive tech.',
    category: 'Accessibility',
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'focusManagement',
    slug: 'focus-management',
    description: 'Proper focus handling for dynamic optimization updates.',
    category: 'Accessibility',
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'colorBlindSafePalette',
    slug: 'color-blind-safe-palette',
    description: 'Color-blind friendly visualization for savings and costs.',
    category: 'Accessibility',
    complexity: 'beginner',
    type: 'function',
  },
  {
    name: 'textScalingSupport',
    slug: 'text-scaling-support',
    description: 'Support for browser text scaling up to 200%.',
    category: 'Accessibility',
    complexity: 'beginner',
    type: 'function',
  },
  {
    name: 'ariaLiveRegions',
    slug: 'aria-live-regions',
    description: 'Dynamic ARIA live regions for real-time optimization updates.',
    category: 'Accessibility',
    complexity: 'intermediate',
    type: 'function',
  },

  // ====== 14. MODEL REGISTRY (22 APIs) ======
  {
    name: 'registerModel',
    slug: 'register-model',
    description: 'Add custom model with pricing and capabilities metadata.',
    category: 'Model Registry',
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'getModelInfo',
    slug: 'get-model-info',
    description: 'Retrieve model metadata including pricing and limits.',
    category: 'Model Registry',
    complexity: 'beginner',
    type: 'function',
  },
  {
    name: 'listModels',
    slug: 'list-models',
    description: 'Get all registered models with filtering and sorting.',
    category: 'Model Registry',
    complexity: 'beginner',
    type: 'function',
  },
  {
    name: 'compareModels',
    slug: 'compare-models',
    description: 'Side-by-side comparison of cost, performance, and capabilities.',
    category: 'Model Registry',
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'updateModelPricing',
    slug: 'update-model-pricing',
    description: 'Update pricing information for registered models.',
    category: 'Model Registry',
    complexity: 'beginner',
    type: 'function',
  },
  {
    name: 'setDefaultModel',
    slug: 'set-default-model',
    description: 'Configure default model for optimization strategies.',
    category: 'Model Registry',
    complexity: 'beginner',
    type: 'function',
  },
  {
    name: 'getModelCapabilities',
    slug: 'get-model-capabilities',
    description: 'Query model features (streaming, function calling, vision).',
    category: 'Model Registry',
    complexity: 'beginner',
    type: 'function',
  },
  {
    name: 'validateModelCompatibility',
    slug: 'validate-model-compatibility',
    description: 'Check if a model supports required features for optimization.',
    category: 'Model Registry',
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'rankModelsByCost',
    slug: 'rank-models-by-cost',
    description: 'Sort models by cost-effectiveness for given use case.',
    category: 'Model Registry',
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'getModelLimits',
    slug: 'get-model-limits',
    description: 'Retrieve context window and rate limit information.',
    category: 'Model Registry',
    complexity: 'beginner',
    type: 'function',
  },
  {
    name: 'checkModelAvailability',
    slug: 'check-model-availability',
    description: 'Verify model is accessible with current credentials.',
    category: 'Model Registry',
    complexity: 'beginner',
    type: 'function',
  },
  {
    name: 'getRecommendedModel',
    slug: 'get-recommended-model',
    description: 'AI-powered model recommendation based on requirements.',
    category: 'Model Registry',
    complexity: 'advanced',
    type: 'function',
  },
  {
    name: 'configureModelAliases',
    slug: 'configure-model-aliases',
    description: 'Create aliases for easier model reference.',
    category: 'Model Registry',
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'trackModelPerformance',
    slug: 'track-model-performance',
    description: 'Monitor real-world performance metrics per model.',
    category: 'Model Registry',
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'setModelPriority',
    slug: 'set-model-priority',
    description: 'Define fallback priority for multi-model strategies.',
    category: 'Model Registry',
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'getModelVersions',
    slug: 'get-model-versions',
    description: 'List available versions of a specific model.',
    category: 'Model Registry',
    complexity: 'beginner',
    type: 'function',
  },
  {
    name: 'deprecateModel',
    slug: 'deprecate-model',
    description: 'Mark model as deprecated with migration guidance.',
    category: 'Model Registry',
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'importModelCatalog',
    slug: 'import-model-catalog',
    description: 'Bulk import models from JSON configuration.',
    category: 'Model Registry',
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'exportModelCatalog',
    slug: 'export-model-catalog',
    description: 'Export registered models for backup or sharing.',
    category: 'Model Registry',
    complexity: 'beginner',
    type: 'function',
  },
  {
    name: 'validateModelConfig',
    slug: 'validate-model-config',
    description: 'Validate model configuration against schema.',
    category: 'Model Registry',
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'getProviderModels',
    slug: 'get-provider-models',
    description: 'List all models from specific provider (OpenAI, Anthropic, etc.).',
    category: 'Model Registry',
    complexity: 'beginner',
    type: 'function',
  },
  {
    name: 'syncModelCatalog',
    slug: 'sync-model-catalog',
    description: 'Auto-sync with provider APIs for latest model information.',
    category: 'Model Registry',
    complexity: 'advanced',
    type: 'function',
  },

  // ====== 15. DEFAULTS & PRESETS (13 APIs) ======
  {
    name: 'createPreset',
    slug: 'create-preset',
    description: 'Define custom optimization preset with named configuration.',
    category: 'Defaults & Presets',
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'applyPreset',
    slug: 'apply-preset',
    description: 'Apply saved preset to optimization configuration.',
    category: 'Defaults & Presets',
    complexity: 'beginner',
    type: 'function',
  },
  {
    name: 'listPresets',
    slug: 'list-presets',
    description: 'Get all available presets with descriptions.',
    category: 'Defaults & Presets',
    complexity: 'beginner',
    type: 'function',
  },
  {
    name: 'updatePreset',
    slug: 'update-preset',
    description: 'Modify existing preset configuration.',
    category: 'Defaults & Presets',
    complexity: 'beginner',
    type: 'function',
  },
  {
    name: 'deletePreset',
    slug: 'delete-preset',
    description: 'Remove custom preset from registry.',
    category: 'Defaults & Presets',
    complexity: 'beginner',
    type: 'function',
  },
  {
    name: 'setDefaultPreset',
    slug: 'set-default-preset',
    description: 'Configure which preset to apply by default.',
    category: 'Defaults & Presets',
    complexity: 'beginner',
    type: 'function',
  },
  {
    name: 'getPresetRecommendation',
    slug: 'get-preset-recommendation',
    description: 'AI suggestion for optimal preset based on usage patterns.',
    category: 'Defaults & Presets',
    complexity: 'advanced',
    type: 'function',
  },
  {
    name: 'exportPresets',
    slug: 'export-presets',
    description: 'Export presets for sharing or backup.',
    category: 'Defaults & Presets',
    complexity: 'beginner',
    type: 'function',
  },
  {
    name: 'importPresets',
    slug: 'import-presets',
    description: 'Import presets from JSON configuration.',
    category: 'Defaults & Presets',
    complexity: 'beginner',
    type: 'function',
  },
  {
    name: 'validatePreset',
    slug: 'validate-preset',
    description: 'Validate preset configuration against schema.',
    category: 'Defaults & Presets',
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'clonePreset',
    slug: 'clone-preset',
    description: 'Duplicate existing preset as starting point.',
    category: 'Defaults & Presets',
    complexity: 'beginner',
    type: 'function',
  },
  {
    name: 'comparePresets',
    slug: 'compare-presets',
    description: 'Side-by-side comparison of preset configurations.',
    category: 'Defaults & Presets',
    complexity: 'intermediate',
    type: 'function',
  },
  {
    name: 'mergePresets',
    slug: 'merge-presets',
    description: 'Combine multiple presets with conflict resolution.',
    category: 'Defaults & Presets',
    complexity: 'advanced',
    type: 'function',
  },
]

// ============================================================================
// CATEGORY METADATA
// ============================================================================

const categoryMeta: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>
    color: string
    description: string
  }
> = {
  'Token Counting': {
    icon: Activity,
    color: 'blue',
    description: 'Accurate token counting with model-specific encoders',
  },
  Caching: {
    icon: Database,
    color: 'purple',
    description: 'Intelligent caching for 40-60% cost reduction',
  },
  'Provider-Native Caching': {
    icon: Sparkles,
    color: 'pink',
    description: 'Provider-specific caching for up to 90% savings',
  },
  Compression: {
    icon: TrendingDown,
    color: 'orange',
    description: 'Smart compression preserving semantic meaning',
  },
  Routing: {
    icon: Gauge,
    color: 'green',
    description: 'Intelligent model routing for cost optimization',
  },
  'Cost Optimization': {
    icon: DollarSign,
    color: 'emerald',
    description: 'Calculate, predict, and optimize costs',
  },
  'React Hooks': {
    icon: Zap,
    color: 'cyan',
    description: 'React hooks for optimization integration',
  },
  'React Components': {
    icon: Zap,
    color: 'cyan',
    description: 'Pre-built UI components for optimization',
  },
  'Format Optimizers': {
    icon: Settings,
    color: 'indigo',
    description: 'Format-specific optimization strategies',
  },
  Observability: {
    icon: Eye,
    color: 'violet',
    description: 'Metrics, tracking, and analytics',
  },
  Security: {
    icon: Shield,
    color: 'red',
    description: 'Secure optimization with data protection',
  },
  'Budget Management': {
    icon: Wallet,
    color: 'amber',
    description: 'Set limits and track budget utilization',
  },
  Accessibility: {
    icon: Accessibility,
    color: 'teal',
    description: 'WCAG-compliant optimization interfaces',
  },
  'Model Registry': {
    icon: BookOpen,
    color: 'slate',
    description: 'Manage model metadata and configurations',
  },
  'Defaults & Presets': {
    icon: Settings,
    color: 'gray',
    description: 'Reusable optimization configurations',
  },
}

const categoryOrder = [
  'Token Counting',
  'Caching',
  'Provider-Native Caching',
  'Compression',
  'Routing',
  'Cost Optimization',
  'React Hooks',
  'React Components',
  'Format Optimizers',
  'Observability',
  'Security',
  'Budget Management',
  'Accessibility',
  'Model Registry',
  'Defaults & Presets',
]

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function getComplexityColor(complexity: APIInfo['complexity']) {
  switch (complexity) {
    case 'beginner':
      return 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
    case 'intermediate':
      return 'text-amber-600 dark:text-amber-400 bg-amber-500/10'
    case 'advanced':
      return 'text-red-600 dark:text-red-400 bg-red-500/10'
    default:
      return 'text-gray-600 dark:text-gray-400 bg-gray-500/10'
  }
}

function getTypeIcon(type: APIInfo['type']) {
  switch (type) {
    case 'function':
      return '𝑓'
    case 'hook':
      return '⚛'
    case 'component':
      return '◼'
    case 'class':
      return 'C'
    case 'type':
      return 'T'
    case 'config':
      return '⚙'
    default:
      return '•'
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function APIReferencePage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)
  const [selectedComplexity, setSelectedComplexity] = React.useState<
    'all' | 'beginner' | 'intermediate' | 'advanced'
  >('all')
  const [selectedType, setSelectedType] = React.useState<'all' | APIInfo['type']>('all')

  // Filter APIs
  const filteredAPIs = React.useMemo(() => {
    return apis.filter((api) => {
      const matchesSearch =
        !searchQuery ||
        api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        api.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        api.category.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = !selectedCategory || api.category === selectedCategory

      const matchesComplexity =
        selectedComplexity === 'all' || api.complexity === selectedComplexity

      const matchesType = selectedType === 'all' || api.type === selectedType

      return matchesSearch && matchesCategory && matchesComplexity && matchesType
    })
  }, [searchQuery, selectedCategory, selectedComplexity, selectedType])

  // Group by category
  const groupedAPIs = React.useMemo(() => {
    const groups: Record<string, APIInfo[]> = {}
    categoryOrder.forEach((cat) => {
      groups[cat] = filteredAPIs.filter((api) => api.category === cat)
    })
    return groups
  }, [filteredAPIs])

  const totalCount = apis.length
  const filteredCount = filteredAPIs.length

  return (
    <div className="min-h-screen">
      <Breadcrumbs />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: durations.moderate,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              <Zap className="w-6 h-6" aria-hidden="true" />
            </div>
            <span className="text-sm text-muted-foreground">API Reference</span>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-4">
            Token Optimization APIs
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mb-6">
            Comprehensive directory of all {totalCount} token optimization APIs. Reduce costs by
            50-90% with intelligent caching, compression, and routing strategies.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-200 dark:border-purple-800">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {totalCount}
              </div>
              <div className="text-sm text-muted-foreground">Total APIs</div>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-200 dark:border-emerald-800">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                50-90%
              </div>
              <div className="text-sm text-muted-foreground">Cost Savings</div>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-200 dark:border-blue-800">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">15</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-200 dark:border-pink-800">
              <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">6</div>
              <div className="text-sm text-muted-foreground">
                Provider Caching
              </div>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-200 dark:border-amber-800">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                11
              </div>
              <div className="text-sm text-muted-foreground">React Hooks</div>
            </div>
          </div>
        </motion.header>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: durations.moderate,
            delay: 0.1,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mb-8"
        >
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search APIs by name, description, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'w-full pl-12 pr-4 py-3 rounded-lg',
                'bg-card text-foreground',
                'border border-border focus:border-brand-500',
                'focus:outline-none focus:ring-2 focus:ring-brand-500/20',
                'transition-all duration-200'
              )}
              aria-label="Search token optimization APIs"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Filters:</span>
            </div>

            {/* Complexity Filter */}
            <div className="flex gap-2">
              {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedComplexity(level)}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200',
                    selectedComplexity === level
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'bg-card text-muted-foreground hover:bg-accent hover:text-foreground border border-border'
                  )}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>

            {/* Type Filter */}
            <div className="flex gap-2">
              {(['all', 'function', 'hook', 'component', 'class'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200',
                    selectedType === type
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'bg-card text-muted-foreground hover:bg-accent hover:text-foreground border border-border'
                  )}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            {/* Results Count */}
            <div className="ml-auto text-sm text-muted-foreground">
              {filteredCount === totalCount
                ? `${totalCount} APIs`
                : `${filteredCount} of ${totalCount} APIs`}
            </div>
          </div>

          {/* Active Category Filter */}
          {selectedCategory && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Category:</span>
              <button
                onClick={() => setSelectedCategory(null)}
                className="px-3 py-1.5 rounded-md text-sm font-medium bg-brand-500 text-white shadow-sm hover:bg-brand-600 transition-colors"
              >
                {selectedCategory} ×
              </button>
            </div>
          )}
        </motion.div>

        {/* API Categories */}
        <div className="space-y-12">
          {categoryOrder.map((category, categoryIndex) => {
            const categoryAPIs = groupedAPIs[category]
            if (categoryAPIs.length === 0) return null

            const meta = categoryMeta[category]
            const Icon = meta.icon

            return (
              <motion.section
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: durations.slow,
                  delay: categoryIndex * 0.05,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                id={category.toLowerCase().replace(/\s+/g, '-')}
              >
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={cn(
                      'p-2.5 rounded-lg border',
                      `bg-${meta.color}-500/10 text-${meta.color}-600 dark:text-${meta.color}-400`,
                      `border-${meta.color}-200 dark:border-${meta.color}-800`
                    )}
                  >
                    <Icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-foreground">{category}</h2>
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-accent text-foreground">
                        {categoryAPIs.length} API{categoryAPIs.length !== 1 ? 's' : ''}
                      </span>
                      {category === 'Provider-Native Caching' && (
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm">
                          Hero Feature
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{meta.description}</p>
                  </div>
                  <button
                    onClick={() =>
                      setSelectedCategory(selectedCategory === category ? null : category)
                    }
                    className="px-4 py-2 rounded-md text-sm font-medium bg-accent text-foreground hover:bg-accent/80 transition-colors"
                    aria-label={`Filter by ${category} category`}
                  >
                    Filter
                  </button>
                </div>

                {/* API Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {categoryAPIs.map((api, index) => (
                    <Link
                      key={api.slug}
                      href={`/reference/api/${api.slug}`}
                      className={cn(
                        'group relative rounded-xl border bg-card text-card-foreground p-5',
                        'shadow-sm hover:shadow-lg transition-all duration-300',
                        'border-border/50 hover:border-brand-500/30',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
                      )}
                    >
                      {/* Gradient glow on hover */}
                      <div
                        className={cn(
                          'absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none',
                          api.isHeroFeature
                            ? 'bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-rose-500/10'
                            : 'bg-gradient-to-br from-brand-500/10 via-transparent to-accent-500/10'
                        )}
                      />

                      <div className="relative">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className="text-lg font-mono text-muted-foreground"
                                aria-hidden="true"
                              >
                                {getTypeIcon(api.type)}
                              </span>
                              <h3 className="text-base font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
                                {api.name}
                              </h3>
                            </div>
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="flex items-center gap-2 flex-wrap mb-3">
                          {api.isHeroFeature && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm">
                              <Star className="w-3 h-3" />
                              Hero
                            </span>
                          )}
                          {api.isNew && (
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                              New
                            </span>
                          )}
                          {api.savingsPercent && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm">
                              <TrendingDown className="w-3 h-3" />
                              {api.savingsPercent}
                            </span>
                          )}
                          {api.complexity && (
                            <span
                              className={cn(
                                'px-2 py-0.5 text-xs font-medium rounded-full',
                                getComplexityColor(api.complexity)
                              )}
                            >
                              {api.complexity}
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {api.description}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-muted-foreground">
                            {api.type}
                          </span>
                          <div className="flex items-center text-sm font-medium text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">
                            View docs
                            <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.section>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredCount === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent mb-4">
              <Info className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No APIs found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory(null)
                setSelectedComplexity('all')
                setSelectedType('all')
              }}
              className="px-4 py-2 rounded-md font-medium bg-brand-500 text-white hover:bg-brand-600 transition-colors"
            >
              Clear filters
            </button>
          </motion.div>
        )}

        {/* Quick Navigation */}
        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: durations.moderate,
            delay: 0.2,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mt-16 p-6 rounded-xl bg-gradient-to-br from-brand-500/5 to-accent-500/5 border border-brand-200 dark:border-brand-800"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            Quick Navigation
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {categoryOrder.map((category) => {
              const meta = categoryMeta[category]
              const Icon = meta.icon
              const count = apis.filter((api) => api.category === category).length

              return (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category)
                    document
                      .getElementById(category.toLowerCase().replace(/\s+/g, '-'))
                      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                  className={cn(
                    'p-3 rounded-lg border text-left transition-all duration-200',
                    'hover:shadow-md hover:scale-105',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                    'bg-card border-border hover:border-brand-500/30'
                  )}
                >
                  <Icon className="w-5 h-5 text-brand-600 dark:text-brand-400 mb-2" />
                  <div className="text-xs font-medium text-foreground line-clamp-2 mb-1">
                    {category}
                  </div>
                  <div className="text-xs text-muted-foreground">{count} APIs</div>
                </button>
              )
            })}
          </div>
        </motion.aside>
      </div>
    </div>
  )
}
