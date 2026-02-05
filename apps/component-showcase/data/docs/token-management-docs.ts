import type { ComponentDoc } from '@/components/doc-panel'

export const tokenManagementDocs: Record<
  string,
  ComponentDoc | ComponentDoc[]
> = {
  // ===========================================================================
  // Token Counter
  // ===========================================================================
  'Token Counter': {
    name: 'TokenCounter',
    description:
      'Production-ready token counter with real-time display, cost estimation, color-coded thresholds, warning alerts, and smart pruning suggestions.',
    importPath: '@clarity-chat/react',
    usageCode: `<TokenCounter
  currentTokens={1250}
  maxTokens={4096}
  costPerToken={0.000002}
  showWarning={true}
  warningThreshold={0.8}
  criticalThreshold={0.95}
  suggestPruning={true}
  onWarning={() => console.log('Approaching limit')}
  onCritical={() => console.log('Critical limit!')}
  onPruneSuggested={() => pruneOldMessages()}
  size="md"
/>`,
    props: [
      {
        name: 'currentTokens',
        type: 'number',
        required: true,
        description: 'Current token count in conversation.',
        commonlyUsed: true,
      },
      {
        name: 'maxTokens',
        type: 'number',
        required: true,
        description: 'Maximum tokens allowed by the model.',
        commonlyUsed: true,
      },
      {
        name: 'costPerToken',
        type: 'number',
        description:
          'Cost per token in dollars (e.g., 0.000002 for $0.002 per 1K tokens).',
        commonlyUsed: true,
      },
      {
        name: 'showWarning',
        type: 'boolean',
        default: 'true',
        description: 'Show warning alert when approaching the token limit.',
        commonlyUsed: true,
      },
      {
        name: 'warningThreshold',
        type: 'number',
        default: '0.8',
        description: 'Warning threshold as a percentage (0.8 = 80%).',
      },
      {
        name: 'criticalThreshold',
        type: 'number',
        default: '0.95',
        description: 'Critical threshold as a percentage (0.95 = 95%).',
      },
      {
        name: 'showCost',
        type: 'boolean',
        default: 'true',
        description: 'Show cost estimate based on costPerToken.',
      },
      {
        name: 'showBar',
        type: 'boolean',
        default: 'true',
        description: 'Show the visual percentage progress bar.',
      },
      {
        name: 'onWarning',
        type: '() => void',
        description: 'Callback fired when the warning threshold is exceeded.',
      },
      {
        name: 'onCritical',
        type: '() => void',
        description: 'Callback fired when the critical threshold is exceeded.',
      },
      {
        name: 'suggestPruning',
        type: 'boolean',
        default: 'false',
        description: 'Show a suggestion to prune old messages when critical.',
      },
      {
        name: 'onPruneSuggested',
        type: '() => void',
        description: 'Callback fired when the prune suggestion is clicked.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description:
          'Size variant controlling text size, bar height, and icon dimensions.',
        commonlyUsed: true,
      },
      {
        name: 'className',
        type: 'string',
        default: "''",
        description: 'Custom CSS class applied to the root element.',
      },
    ],
    notes: [
      'Warning callbacks fire only once per threshold crossing and reset when usage drops below the warning level.',
      'The progress bar is color-coded: green (safe), yellow/warning (>=80%), red/critical (>=95%).',
      'Fully accessible with ARIA role="status", role="alert" for warnings, and role="progressbar" for the bar.',
    ],
  },

  // ===========================================================================
  // Token Budget
  // ===========================================================================
  'Token Budget': [
    {
      name: 'TokenBudgetBar',
      description:
        'Visual progress bar showing current token budget utilization with color-coded status states (green, yellow, orange, red), animated transitions, cost estimation, and detailed tooltip breakdown.',
      importPath: '@clarity-chat/react',
      usageCode: `const { usage, isCalculating } = useTokenBudgetMonitor({
  maxInputTokens: 128000,
})

<TokenBudgetBar
  usage={usage}
  isCalculating={isCalculating}
  showTooltip
  showLabel
  animated
  model={{ id: 'gpt-4o', inputCostPer1K: 0.005, outputCostPer1K: 0.015 }}
  showCost
  size="md"
  onClick={() => openBudgetSettings()}
/>`,
      props: [
        {
          name: 'usage',
          type: 'TokenUsage',
          required: true,
          description: 'Current token usage object from useTokenBudgetMonitor.',
          commonlyUsed: true,
        },
        {
          name: 'isCalculating',
          type: 'boolean',
          default: 'false',
          description:
            'Whether token calculation is in progress (shows shimmer effect).',
          commonlyUsed: true,
        },
        {
          name: 'showTooltip',
          type: 'boolean',
          default: 'true',
          description:
            'Show a detailed tooltip with budget breakdown on hover/focus.',
          commonlyUsed: true,
        },
        {
          name: 'showLabel',
          type: 'boolean',
          default: 'true',
          description:
            'Show text labels (token count, status badge) above the bar.',
        },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg'",
          default: "'md'",
          description:
            'Size variant controlling bar height, text size, padding, and gap.',
          commonlyUsed: true,
        },
        {
          name: 'compact',
          type: 'boolean',
          default: 'false',
          description:
            'Compact mode renders only the bare progress bar without labels.',
        },
        {
          name: 'className',
          type: 'string',
          description:
            'Additional CSS class names applied to the root element.',
        },
        {
          name: 'onClick',
          type: '() => void',
          description:
            'Called when the bar is clicked (e.g., to trigger trim). Makes the bar interactive with button role.',
        },
        {
          name: 'animated',
          type: 'boolean',
          default: 'true',
          description: 'Animate bar width transitions using framer-motion.',
        },
        {
          name: 'model',
          type: 'BudgetMonitorModel',
          description:
            'Model configuration for cost estimation. Enables cost display when provided.',
        },
        {
          name: 'showCost',
          type: 'boolean',
          default: 'false',
          description:
            'Show estimated cost (requires the model prop to be set).',
        },
        {
          name: 'ariaLabel',
          type: 'string',
          default: "'Token Budget'",
          description: 'Accessible label for the progress bar element.',
        },
        {
          name: 'id',
          type: 'string',
          description:
            'ID for the component, used for ARIA relationships between elements.',
        },
      ],
      notes: [
        'The bar color changes automatically based on usage status: safe (green), warning (yellow), critical (orange), exceeded (red).',
        'Respects prefers-reduced-motion: disables framer-motion animations and uses CSS transitions instead.',
        'The tooltip shows a full breakdown including current, max, reserved for output, effective max, and available tokens.',
        'When exceeded, an alert banner with "over budget" messaging appears with a suggestion to trim context.',
      ],
    },
    {
      name: 'TokenBudgetIndicator',
      description:
        'Compact inline token indicator showing a colored dot and utilization percentage for space-constrained UIs.',
      importPath: '@clarity-chat/react',
      usageCode: `<TokenBudgetIndicator
  usage={usage}
  ariaLabel="Token usage"
/>`,
      props: [
        {
          name: 'usage',
          type: 'TokenUsage',
          required: true,
          description: 'Current token usage from useTokenBudgetMonitor.',
          commonlyUsed: true,
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names.',
        },
        {
          name: 'ariaLabel',
          type: 'string',
          default: "'Token usage'",
          description: 'Accessible label for the indicator.',
        },
      ],
      notes: [
        'Renders as an inline-flex element with a status-colored dot and percentage text.',
        'Ideal for headers, toolbars, or anywhere a compact token status is needed.',
      ],
    },
  ],

  // ===========================================================================
  // Token Optimization
  // ===========================================================================
  'Token Optimization': [
    {
      name: 'TokenOptimizationPanel',
      description:
        'Displays real-time token optimization statistics and controls including savings, cache performance, model routing, and cost metrics. Features premium glassmorphism design.',
      importPath: '@clarity-chat/token-optimization',
      usageCode: `const { stats } = useTokenOptimization({ enableCaching: true })

<TokenOptimizationPanel
  stats={stats}
  showDetails={true}
  showCacheStats={true}
  showRoutingStats={true}
  size="md"
/>`,
      props: [
        {
          name: 'stats',
          type: 'TokenOptimizationStats',
          required: true,
          description:
            'Statistics object containing tokensSaved, costSavings, cacheHits, cacheMisses, and more.',
          commonlyUsed: true,
        },
        {
          name: 'showDetails',
          type: 'boolean',
          default: 'true',
          description:
            'Show the detailed breakdown section with cache performance, throttling, routing, and cost savings.',
          commonlyUsed: true,
        },
        {
          name: 'showCacheStats',
          type: 'boolean',
          default: 'true',
          description: 'Show cache hit rate and hit/miss counts.',
        },
        {
          name: 'showRoutingStats',
          type: 'boolean',
          default: 'true',
          description:
            'Show model routing statistics (simple vs. complex routes).',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Custom CSS class applied to the root element.',
        },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg'",
          default: "'md'",
          description: 'Size variant controlling text size.',
        },
      ],
      notes: [
        'TokenOptimizationStats includes: tokensSaved, costSavings, percentageSaved, cacheHits, cacheMisses, requestsThrottled, simpleModelRoutes, complexModelRoutes.',
        'Use createEmptyStats() from the same package to initialize a default stats object.',
        'Applies premium glassmorphism styling with animated purple gradient.',
      ],
    },
    {
      name: 'TokenOptimizationBadge',
      description:
        'Compact badge showing token savings and optimization status. Ideal for headers, toolbars, or compact UIs with subtle glassmorphism and animated glow.',
      importPath: '@clarity-chat/token-optimization',
      usageCode: `<TokenOptimizationBadge
  stats={stats}
  showCost={true}
  size="md"
/>`,
      props: [
        {
          name: 'stats',
          type: 'TokenOptimizationStats',
          required: true,
          description: 'Statistics object with tokensSaved and costSavings.',
          commonlyUsed: true,
        },
        {
          name: 'showCost',
          type: 'boolean',
          default: 'false',
          description: 'Show cost savings alongside the token count.',
          commonlyUsed: true,
        },
        {
          name: 'className',
          type: 'string',
          description: 'Custom CSS class applied to the root element.',
        },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg'",
          default: "'md'",
          description: 'Size variant controlling text size and padding.',
        },
      ],
      notes: [
        'Renders as a pill-shaped badge with a success-colored gradient and animated glow.',
        'Displays the number of tokens saved with an optional cost savings indicator.',
      ],
    },
    {
      name: 'TokenOptimizationDashboard',
      description:
        'Comprehensive dashboard displaying token optimization metrics with detailed breakdowns by technique (compression, caching, routing, batching, throttling, referencing). Supports real-time updates, loading, and error states.',
      importPath: '@clarity-chat/token-optimization',
      usageCode: `<TokenOptimizationDashboard
  metrics={{
    totalTokens: 50000,
    tokensSaved: 15000,
    costSaved: 0.45,
    breakdown: {
      promptCompression: { tokens: 4000, percent: 27 },
      caching: { hits: 120, savings: 5000 },
      modelRouting: { savings: 3000, percent: 40 },
      responseLimiting: { tokens: 2000, percent: 15 },
      batching: { requests: 50, savings: 800 },
      throttling: { callsSaved: 200 },
      referencing: { bytesSaved: 50000, percent: 60 },
    },
    savingsPercent: 30,
  }}
  showBreakdown={true}
  realTime={false}
/>`,
      props: [
        {
          name: 'metrics',
          type: 'OptimizationMetrics',
          required: true,
          description:
            'Current optimization metrics including totalTokens, tokensSaved, costSaved, breakdown, and savingsPercent.',
          commonlyUsed: true,
        },
        {
          name: 'showBreakdown',
          type: 'boolean',
          default: 'true',
          description:
            'Show the detailed breakdown of savings by optimization technique.',
          commonlyUsed: true,
        },
        {
          name: 'realTime',
          type: 'boolean',
          default: 'false',
          description: 'Enable real-time metric updates on a polling interval.',
          commonlyUsed: true,
        },
        {
          name: 'refreshInterval',
          type: 'number',
          default: '5000',
          description:
            'Refresh interval in milliseconds when realTime is enabled.',
        },
        {
          name: 'costPerToken',
          type: 'number',
          default: '0.000002',
          description: 'Cost per token used for additional calculations.',
        },
        {
          name: 'className',
          type: 'string',
          default: "''",
          description: 'Custom CSS class applied to the root element.',
        },
        {
          name: 'onClick',
          type: '() => void',
          description:
            'Callback when the dashboard is clicked. Enables hover lift effect.',
        },
        {
          name: 'isLoading',
          type: 'boolean',
          default: 'false',
          description: 'Render a skeleton loading state instead of metrics.',
        },
        {
          name: 'error',
          type: 'Error | string | null',
          default: 'null',
          description:
            'Error to display. Renders an error state when provided.',
        },
      ],
      notes: [
        'The breakdown section shows per-technique metrics: Prompt Compression, Smart Caching, Model Routing, Response Limiting, Request Batching, Smart Throttling, and Reference Handling.',
        'Each breakdown item only renders when its corresponding metric is non-zero.',
        'Loading state shows an animated skeleton. Error state shows a destructive alert with the error message.',
        'Uses glassmorphism styling with an analytics-themed gradient.',
      ],
    },
  ],

  // ===========================================================================
  // Cost Tracking
  // ===========================================================================
  'Cost Tracking': [
    {
      name: 'TokenCostPreview',
      description:
        'Real-time token cost estimation component that displays live estimates of token count and API cost as users type. Provides transparency into costs before messages are sent.',
      importPath: '@clarity-chat/token-optimization',
      usageCode: `<TokenCostPreview
  text={inputValue}
  model="gpt-4"
  showTokenCount
  showCost
  variant="inline"
  onCostChange={(cost, tokens) => {
    if (cost > 0.10) showWarning('Message will cost more than $0.10')
  }}
/>`,
      props: [
        {
          name: 'text',
          type: 'string',
          required: true,
          description: 'The text to estimate tokens for.',
          commonlyUsed: true,
        },
        {
          name: 'model',
          type: 'ModelId | string',
          default: "'gpt-4'",
          description:
            'Model name for estimation (determines pricing and tokenization).',
          commonlyUsed: true,
        },
        {
          name: 'showTokenCount',
          type: 'boolean',
          default: 'true',
          description: 'Show the estimated token count.',
          commonlyUsed: true,
        },
        {
          name: 'showCost',
          type: 'boolean',
          default: 'true',
          description: 'Show the estimated cost.',
          commonlyUsed: true,
        },
        {
          name: 'minDisplayCost',
          type: 'number',
          default: '0.0001',
          description: 'Minimum cost threshold before the cost is displayed.',
        },
        {
          name: 'variant',
          type: "'inline' | 'card'",
          default: "'inline'",
          description:
            "Display variant: 'inline' for text display or 'card' for a glassmorphic panel.",
          commonlyUsed: true,
        },
        {
          name: 'className',
          type: 'string',
          description: 'Custom CSS class for styling the root element.',
        },
        {
          name: 'onCostChange',
          type: '(cost: number, tokens: number) => void',
          description:
            'Callback fired when the cost or token estimate changes.',
          commonlyUsed: true,
        },
        {
          name: 'onError',
          type: '(error: Error) => void',
          description: 'Callback fired when an estimation error occurs.',
        },
        {
          name: 'formatCost',
          type: '(cost: number) => string',
          description: 'Custom format function for the cost display.',
        },
        {
          name: 'formatTokens',
          type: '(tokens: number) => string',
          description: 'Custom format function for the token count display.',
        },
        {
          name: 'throttleMs',
          type: 'number',
          default: '100',
          description:
            'Throttle interval in milliseconds for estimation updates.',
        },
        {
          name: 'ariaLabel',
          type: 'string',
          default: "'Token and cost estimate'",
          description: 'Accessible label for the component.',
        },
        {
          name: 'id',
          type: 'string',
          description: 'ID for the component (useful for aria-describedby).',
        },
        {
          name: 'showLoading',
          type: 'boolean',
          default: 'false',
          description: 'Show a loading indicator during the first calculation.',
        },
        {
          name: 'loadingText',
          type: 'string',
          default: "'Calculating...'",
          description: 'Custom loading text shown during initial estimation.',
        },
        {
          name: 'showError',
          type: 'boolean',
          default: 'true',
          description: 'Show an error message when estimation fails.',
        },
        {
          name: 'renderError',
          type: '(error: Error) => React.ReactNode',
          description:
            'Custom error renderer replacing the default "Unable to estimate" message.',
        },
      ],
      notes: [
        'The companion useTokenEstimate hook is also exported for headless usage.',
        'Estimation is throttled by default to 100ms to avoid excessive recalculations during rapid typing.',
        'The component returns null when both showTokenCount and showCost are false, or when there are no tokens and cost is below minDisplayCost.',
        'Respects prefers-reduced-motion for opacity transitions.',
      ],
    },
    {
      name: 'TokenROICalculator',
      description:
        'Comprehensive calculator for analyzing return on investment from token optimization. Includes cost savings analysis, break-even calculations, scenario comparisons, interactive sliders, and visual reports.',
      importPath: '@clarity-chat/react',
      usageCode: `<TokenROICalculator
  requestsPerDay={1000}
  tokensPerRequest={500}
  costPerInputToken={0.00001}
  costPerOutputToken={0.00003}
  optimizationPercent={30}
  implementationCost={500}
  maintenanceCost={50}
  period="yearly"
  showBreakdown
  showBreakEven
  enableSliders
  onCalculate={(results) => console.log('Savings:', results.savingsPerYear)}
/>`,
      props: [
        {
          name: 'requestsPerDay',
          type: 'number',
          default: '1000',
          description: 'Number of API requests per day.',
          commonlyUsed: true,
        },
        {
          name: 'tokensPerRequest',
          type: 'number',
          default: '500',
          description: 'Average tokens per request before optimization.',
          commonlyUsed: true,
        },
        {
          name: 'costPerInputToken',
          type: 'number',
          default: '0.00001',
          description: 'Cost per input token in dollars.',
          commonlyUsed: true,
        },
        {
          name: 'costPerOutputToken',
          type: 'number',
          default: '0.00003',
          description: 'Cost per output token in dollars.',
          commonlyUsed: true,
        },
        {
          name: 'optimizationPercent',
          type: 'number',
          default: '30',
          description:
            'Optimization percentage (0-100) representing expected token reduction.',
          commonlyUsed: true,
        },
        {
          name: 'implementationCost',
          type: 'number',
          default: '500',
          description: 'One-time implementation cost in dollars.',
        },
        {
          name: 'maintenanceCost',
          type: 'number',
          default: '50',
          description: 'Monthly maintenance cost in dollars.',
        },
        {
          name: 'period',
          type: "'daily' | 'weekly' | 'monthly' | 'yearly'",
          default: "'yearly'",
          description: 'Time period for ROI calculations.',
        },
        {
          name: 'showBreakdown',
          type: 'boolean',
          default: 'true',
          description:
            'Show the detailed annual cost breakdown with before/after comparison.',
        },
        {
          name: 'showChart',
          type: 'boolean',
          default: 'true',
          description: 'Show the comparison chart visualization.',
        },
        {
          name: 'showBreakEven',
          type: 'boolean',
          default: 'true',
          description: 'Show the break-even timeline analysis.',
        },
        {
          name: 'enableSliders',
          type: 'boolean',
          default: 'true',
          description:
            'Enable interactive sliders for adjusting parameters in real-time.',
          commonlyUsed: true,
        },
        {
          name: 'scenarios',
          type: 'OptimizationScenario[]',
          default: '[]',
          description: 'Custom optimization scenarios to compare.',
        },
        {
          name: 'onCalculate',
          type: '(results: ROIResults) => void',
          description: 'Callback fired when calculation results update.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Custom CSS class applied to the root element.',
        },
        {
          name: 'disableAnimations',
          type: 'boolean',
          default: 'false',
          description:
            'Disable framer-motion animations throughout the calculator.',
        },
      ],
      notes: [
        'Calculations assume a 70% input / 30% output token split for cost estimation.',
        'The break-even timeline shows milestones at 1 week, 1 month, 3 months, 6 months, and 1 year.',
        'Displays a success indicator when ROI is positive and break-even is under 365 days.',
        'All slider values update calculations in real-time via React state.',
        'The component is wrapped in React.memo for performance.',
      ],
    },
  ],

  // ===========================================================================
  // Token Metrics
  // ===========================================================================
  'Token Metrics': {
    name: 'TokenUsageMeter',
    description:
      'Real-time token usage display for streaming AI responses. Shows live token consumption during streaming with optional cost estimation, input/output breakdown, and multiple display variants.',
    importPath: '@clarity-chat/token-optimization',
    usageCode: `<TokenUsageMeter
  usage={{ promptTokens: 150, completionTokens: 47, totalTokens: 197 }}
  isStreaming={true}
  pricing={MODEL_PRICING_PRESETS['gpt-4o']}
  showCost
  showBreakdown
  variant="detailed"
/>`,
    props: [
      {
        name: 'usage',
        type: 'TokenUsage | null',
        required: true,
        description:
          'Current token usage object with promptTokens, completionTokens, and totalTokens. Returns null when no usage data.',
        commonlyUsed: true,
      },
      {
        name: 'isStreaming',
        type: 'boolean',
        default: 'false',
        description:
          'Whether the response is currently streaming. Shows a live pulse indicator.',
        commonlyUsed: true,
      },
      {
        name: 'pricing',
        type: 'ModelPricing',
        description:
          'Model pricing configuration with modelId, inputCostPer1K, and outputCostPer1K for cost calculation.',
        commonlyUsed: true,
      },
      {
        name: 'showCost',
        type: 'boolean',
        default: 'true',
        description:
          'Show cost estimate (requires the pricing prop to be set).',
        commonlyUsed: true,
      },
      {
        name: 'showBreakdown',
        type: 'boolean',
        default: 'true',
        description: 'Show the input/output/total token breakdown grid.',
      },
      {
        name: 'compact',
        type: 'boolean',
        default: 'false',
        description: 'Compact mode with smaller padding, text, and gaps.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Custom CSS class applied to the root element.',
      },
      {
        name: 'variant',
        type: "'minimal' | 'detailed' | 'inline'",
        default: "'detailed'",
        description:
          "Display variant: 'detailed' shows full panel with breakdown, 'minimal' shows a compact bar, 'inline' shows a single-line display.",
        commonlyUsed: true,
      },
    ],
    notes: [
      'Use MODEL_PRICING_PRESETS (exported alongside the component) for common model pricing configurations.',
      'The TokenUsage interface has: promptTokens (input), completionTokens (output), totalTokens (sum).',
      'The ModelPricing interface has: modelId, inputCostPer1K, outputCostPer1K.',
      'Animations respect prefers-reduced-motion. The component uses framer-motion AnimatePresence for token count transitions.',
      'Returns null when usage is null, making it safe to always render.',
    ],
  },
}
