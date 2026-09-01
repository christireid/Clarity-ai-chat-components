import type { ComponentDoc } from '@/components/doc-panel'

export const dashboardsDocs: Record<string, ComponentDoc | ComponentDoc[]> = {
  'Token Optimization': [
    {
      name: 'UsageDashboard',
      description:
        'Displays comprehensive usage statistics including credit balance, usage metrics by category, cost breakdowns with per-item pricing, and limit warnings with animated progress bars.',
      importPath: '@clarity-chat/react',
      usageCode: `<UsageDashboard
  balance={{ total: 10000, used: 3000, available: 7000 }}
  stats={{
    period: 'month',
    startDate: new Date(),
    endDate: new Date(),
    metrics: { messagesCount: 150, tokensUsed: 25000 },
    costs: { total: 15.50, breakdown: [] },
  }}
  limits={[{ metric: 'tokensUsed', current: 25000, limit: 100000 }]}
  onPurchaseCredits={() => navigate('/billing')}
/>`,
      props: [
        {
          name: 'balance',
          type: 'CreditBalance',
          required: true,
          description:
            'Credit balance object containing total, used, and available credits plus optional nextRefillDate and autoRefill fields.',
          commonlyUsed: true,
        },
        {
          name: 'stats',
          type: 'UsageStats',
          required: true,
          description:
            'Usage statistics object including period, startDate, endDate, metrics (messagesCount, tokensUsed, filesUploaded, exportsGenerated, storageUsed, apiCalls), and costs (total + breakdown array).',
          commonlyUsed: true,
        },
        {
          name: 'limits',
          type: 'UsageLimit[]',
          default: '[]',
          description:
            'Array of usage limits. Each limit has metric, current, limit, and optional resetDate. Metrics approaching 80% are highlighted with warnings.',
          commonlyUsed: true,
        },
        {
          name: 'onPurchaseCredits',
          type: '() => void',
          description:
            'Callback invoked when the "Buy Credits" button is clicked. When provided, the button appears in the header.',
          commonlyUsed: true,
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names for the root Card element.',
        },
      ],
      notes: [
        'Progress bars animate using Framer Motion spring physics and respect prefers-reduced-motion.',
        'Metrics approaching 80% of their limit display amber warning styling and a dedicated "Approaching Limits" alert.',
        'The cost breakdown section shows per-item pricing with quantity and unit price.',
        'Types CreditBalance, UsageStats, UsageLimit, and UsageMetrics are imported from @clarity-chat/types.',
      ],
    },
    {
      name: 'SavingsDashboard',
      description:
        'A comprehensive dashboard for tracking optimization metrics with time-period selectors, cost savings breakdowns, strategy analysis, trend charts, cache hit rate monitoring, and CSV/JSON export.',
      importPath: '@clarity-chat/react',
      usageCode: `<SavingsDashboard
  metrics={{
    daily: dailyMetrics,
    weekly: weeklyMetrics,
    monthly: monthlyMetrics,
    allTime: allTimeMetrics,
  }}
  historicalData={trendData}
  onExport={(format) => handleExport(format)}
  realTime
  showCharts
  showBreakdown
/>`,
      props: [
        {
          name: 'metrics',
          type: 'TimePeriodMetrics',
          required: true,
          description:
            'Current metrics keyed by time period (daily, weekly, monthly, allTime). Each period contains SavingsMetrics with totalTokens, tokensSaved, costSaved, requestCount, costPerRequest, cacheHitRate, savingsPercent, and strategyBreakdown.',
          commonlyUsed: true,
        },
        {
          name: 'historicalData',
          type: 'TrendDataPoint[]',
          default: '[]',
          description:
            'Historical trend data array for rendering sparkline charts. Each point has timestamp, tokensSaved, costSaved, savingsPercent, cacheHitRate, and requestCount.',
          commonlyUsed: true,
        },
        {
          name: 'showCharts',
          type: 'boolean',
          default: 'true',
          description:
            'Show SVG sparkline trend charts for cost savings and token savings over time.',
          commonlyUsed: true,
        },
        {
          name: 'showBreakdown',
          type: 'boolean',
          default: 'true',
          description:
            'Show the optimization strategy breakdown section with per-strategy savings and progress bars.',
          commonlyUsed: true,
        },
        {
          name: 'realTime',
          type: 'boolean',
          default: 'false',
          description:
            'Enable real-time metric updates at the configured refreshInterval. Displays a pulsing "Live" indicator.',
          commonlyUsed: true,
        },
        {
          name: 'refreshInterval',
          type: 'number',
          default: '5000',
          description:
            'Refresh interval in milliseconds for real-time updates. Only active when realTime is true.',
        },
        {
          name: 'onExport',
          type: '(format: ExportFormat) => void',
          description:
            'Custom export handler. When omitted, a default implementation downloads data as CSV or JSON files.',
          commonlyUsed: true,
        },
        {
          name: 'onTimePeriodChange',
          type: '(period: TimePeriod) => void',
          description:
            'Callback invoked when the user switches between daily, weekly, monthly, or allTime views.',
        },
        {
          name: 'defaultPeriod',
          type: "'daily' | 'weekly' | 'monthly' | 'allTime'",
          default: "'daily'",
          description:
            'Initial time period selected when the dashboard mounts.',
        },
        {
          name: 'className',
          type: 'string',
          default: "''",
          description: 'Additional CSS class names for the root container.',
        },
        {
          name: 'isLoading',
          type: 'boolean',
          default: 'false',
          description:
            'When true, displays an animated skeleton loading state instead of the dashboard content.',
        },
        {
          name: 'error',
          type: 'Error | string | null',
          default: 'null',
          description:
            'When provided, displays an error state with a retry button instead of the dashboard content.',
        },
      ],
      notes: [
        'Strategy breakdown covers six optimization strategies: providerCaching, compression, smartRouting, responseLimiting, batching, and throttling.',
        'The default export implementation generates timestamped CSV or JSON files with full metrics and historical data.',
        'ExportFormat is "csv" | "json" and TimePeriod is "daily" | "weekly" | "monthly" | "allTime".',
        'Uses glass morphism styling via glassVariants and getSemanticGradient from @clarity-chat/primitives.',
        'Types SavingsDashboardProps, SavingsMetrics, TimePeriodMetrics, TrendDataPoint, ExportFormat, and TimePeriod are all co-exported.',
      ],
    },
  ],

  'Prompt Library': {
    name: 'AnalyticsDashboard',
    description:
      'Displays comprehensive analytics including key metric cards with change indicators, pipeline and win-rate summaries, a top performers leaderboard, an activity feed, and an AI-generated insights panel.',
    importPath: '@clarity-chat/react',
    usageCode: `<AnalyticsDashboard
  metrics={{
    totalRevenue: 125000,
    conversionRate: 12.5,
    averageDealSize: 2500,
    averageSalesCycle: 30,
    pipelineValue: 450000,
    winRate: 68.5,
  }}
  previousMetrics={{
    totalRevenue: 100000,
    conversionRate: 10.0,
  }}
  leaderboard={[
    { label: 'Code Review Assistant', value: 234, change: 12, trend: 'up' },
    { label: 'Technical Writer', value: 189, change: 5, trend: 'up' },
  ]}
  insights={[
    { title: 'Top performer', description: 'Code Review prompt usage up 23%', type: 'positive' },
    'Consider adding more templates for data analysis workflows',
  ]}
  recentActivities={activities}
  title="Prompt Library Analytics"
  subtitle="Performance overview of your prompt templates"
/>`,
    props: [
      {
        name: 'metrics',
        type: 'AnalyticsDashboardMetrics',
        required: true,
        description:
          'Metrics object with optional fields: totalRevenue, conversionRate, averageDealSize, averageSalesCycle, pipelineValue, and winRate. Displayed as metric cards with formatting.',
        commonlyUsed: true,
      },
      {
        name: 'previousMetrics',
        type: 'Partial<AnalyticsDashboardMetrics>',
        description:
          'Previous period metrics for calculating percentage changes. Each metric with a corresponding previous value shows an up/down trend indicator.',
        commonlyUsed: true,
      },
      {
        name: 'leaderboard',
        type: 'AnalyticsLeaderboardEntry[]',
        description:
          'Array of leaderboard entries. Each entry has label (string), value (number), optional change (number percent), and optional trend ("up" | "down").',
        commonlyUsed: true,
      },
      {
        name: 'insights',
        type: 'Array<AnalyticsInsight | string>',
        description:
          'Array of AI-generated insights. Each item is either a plain string or an object with title (optional), description, and type ("positive" | "risk" | "neutral").',
        commonlyUsed: true,
      },
      {
        name: 'recentActivities',
        type: 'AnalyticsActivity[]',
        description:
          'Array of recent activity events. Each activity has id, timestamp (Date | string), description, optional owner, optional impact ("positive" | "negative" | "neutral"), and optional metadata record.',
      },
      {
        name: 'title',
        type: 'string',
        default: "'Analytics Overview'",
        description:
          'Dashboard heading text. Also used for the aria-label of the root region.',
        commonlyUsed: true,
      },
      {
        name: 'subtitle',
        type: 'string',
        description: 'Optional subtitle displayed below the title.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class names for the root container.',
      },
    ],
    notes: [
      'Metric cards automatically calculate percentage changes between current and previous values.',
      'When pipelineValue is provided, a progress bar targeting $1M is rendered. When winRate is provided, won/lost deal counts are derived.',
      'The leaderboard and activity feed are rendered side-by-side on large screens, or stacked if no leaderboard is provided.',
      'Insight items of type "positive" render in emerald, "risk" in red, and "neutral" in the default foreground color.',
      'All sub-components (MetricCard, PipelineSummary, WinRateSummary, Leaderboard, ActivityList, InsightsPanel) have displayName set for DevTools.',
    ],
  },

  'Conversation History': {
    name: 'ConversationAnalyticsDashboard',
    description:
      'AI-powered conversation analytics dashboard providing topic extraction, sentiment analysis over time, quality scoring with engagement/coherence/depth/efficiency factors, key moment detection, and automatic summarization.',
    importPath: '@clarity-chat/react',
    usageCode: `<ConversationAnalyticsDashboard
  messages={messages}
  autoGenerate
  updateInterval={30000}
  detailed
  onGenerateAnalytics={async (messages) => {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ messages }),
    })
    return response.json()
  }}
  onAnalyticsGenerated={(analytics) => {
    console.log('Topics:', analytics.topics)
    console.log('Sentiment:', analytics.sentiment.overall)
  }}
/>`,
    props: [
      {
        name: 'messages',
        type: 'Message[]',
        required: true,
        description:
          'Array of conversation messages to analyze. An empty array renders a placeholder prompting the user to start a conversation.',
        commonlyUsed: true,
      },
      {
        name: 'analytics',
        type: 'ConversationAnalytics',
        description:
          'Pre-computed analytics data. When provided, the dashboard displays this data directly instead of generating analytics. Contains topics, sentiment, quality, keyMoments, summary, and metadata.',
        commonlyUsed: true,
      },
      {
        name: 'onGenerateAnalytics',
        type: '(messages: Message[]) => Promise<ConversationAnalytics>',
        description:
          'Custom async function for generating analytics from messages. Called when the Refresh button is clicked or when autoGenerate triggers.',
        commonlyUsed: true,
      },
      {
        name: 'autoGenerate',
        type: 'boolean',
        default: 'false',
        description:
          'Enable automatic analytics generation at the configured updateInterval.',
        commonlyUsed: true,
      },
      {
        name: 'updateInterval',
        type: 'number',
        default: '30000',
        description:
          'Interval in milliseconds for automatic analytics regeneration. Only active when autoGenerate is true.',
      },
      {
        name: 'onAnalyticsGenerated',
        type: '(analytics: ConversationAnalytics) => void',
        description:
          'Callback invoked after analytics are successfully generated, receiving the full ConversationAnalytics object.',
      },
      {
        name: 'detailed',
        type: 'boolean',
        default: 'false',
        description:
          'Show the detailed breakdown including key moments detection and expanded sentiment timeline.',
        commonlyUsed: true,
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class names for the root container.',
      },
      {
        name: 'isLoading',
        type: 'boolean',
        default: 'false',
        description:
          'External loading state control. When true with no analytics, shows a spinner.',
      },
      {
        name: 'externalError',
        type: 'Error | string | null',
        default: 'null',
        description:
          'External error state. When provided, displays an error message card.',
      },
    ],
    notes: [
      'ConversationAnalytics contains topics (TopicCluster[]), sentiment (timeline + overall + confidence), quality (QualityMetrics with score and factors), keyMoments (KeyMoment[]), summary (ConversationSummary), and metadata.',
      'QualityMetrics factors include engagement, coherence, depth, and efficiency, each scored 0-100.',
      'KeyMoment types are: "breakthrough", "confusion", "question", "decision", and "insight".',
      'ConversationSummary includes keyPoints, nextSteps, openQuestions, optional decisions, and optional actionItems arrays.',
      'Renders sub-components: QualityScoreCard, TopicsCard, SentimentCard, KeyMomentsCard (detailed only), and SummaryCard.',
      'Animations use Framer Motion with reduced-motion support via useReducedMotion hook.',
    ],
  },

  'Agent Observability': {
    name: 'UserInteractionAnalytics',
    description:
      'Tracks and visualizes user interaction patterns including click heatmaps, feature discovery tracking, user journey timelines, session analytics, and engagement scoring. Supports real-time event collection with configurable sampling.',
    importPath: '@clarity-chat/react',
    usageCode: `<UserInteractionAnalytics
  config={{
    trackClicks: true,
    trackHover: true,
    trackScroll: true,
    trackFeatureDiscovery: true,
    samplingRate: 1.0,
  }}
  initialEvents={existingEvents}
  onEventTracked={(event) => sendToAnalytics(event)}
  onAnalyticsGenerated={(metrics) => {
    console.log('Engagement score:', metrics.engagementScore)
  }}
  realtime
  updateInterval={5000}
  detailed
/>`,
    props: [
      {
        name: 'config',
        type: 'Partial<AnalyticsConfig>',
        description:
          'Analytics configuration merged with defaults. Controls trackClicks, trackHover, trackScroll, trackFeatureDiscovery (all default true), samplingRate (default 1.0), sessionTimeout (default 30min), and heatmapResolution (default 10).',
        commonlyUsed: true,
      },
      {
        name: 'initialEvents',
        type: 'InteractionEvent[]',
        default: '[]',
        description:
          'Pre-existing interaction events to seed the analytics. Each event has id, type, target, optional element, timestamp, optional metadata, optional position, optional sessionId, and optional userId.',
      },
      {
        name: 'onEventTracked',
        type: '(event: InteractionEvent) => void',
        description:
          'Callback invoked each time a new interaction event is tracked. Useful for forwarding events to an external analytics service.',
        commonlyUsed: true,
      },
      {
        name: 'onAnalyticsGenerated',
        type: '(analytics: EngagementMetrics) => void',
        description:
          'Callback invoked when engagement metrics are computed. Receives totalSessions, avgSessionDuration, avgInteractionsPerSession, bounceRate, conversionRate, topFeatures, returnRate, and engagementScore.',
        commonlyUsed: true,
      },
      {
        name: 'realtime',
        type: 'boolean',
        default: 'true',
        description:
          'Enable real-time analytics regeneration at the configured updateInterval.',
        commonlyUsed: true,
      },
      {
        name: 'updateInterval',
        type: 'number',
        default: '5000',
        description:
          'Interval in milliseconds for regenerating analytics from collected events.',
      },
      {
        name: 'detailed',
        type: 'boolean',
        default: 'false',
        description:
          'Show detailed view with a manual Refresh button for regenerating analytics on demand.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class names for the root Card element.',
      },
    ],
    notes: [
      'InteractionEventType includes: "click", "hover", "scroll", "input", "submit", "copy", "select", "feature_discovery", and "navigation".',
      'The dashboard has four views selectable via tabs: Overview (session stats and engagement score), Features (top discovered features), Journey (last 10 interactions timeline), and Heatmap (click position log).',
      'Engagement score is computed from session duration (20pts), interactions per session (30pts), inverse bounce rate (30pts), and feature diversity (20pts), capped at 100.',
      'Bounce is defined as sessions with fewer than 2 interactions or duration under 10 seconds.',
      'Also exports useInteractionTracking hook for programmatic event tracking with trackInteraction, trackFeatureDiscovery, and clearEvents methods.',
      'Event listeners for clicks and scrolls are automatically attached to the document/window and cleaned up on unmount.',
    ],
  },

  'SDK DevTools': [
    {
      name: 'PerformanceAnalyticsDashboard',
      description:
        'Displays real-time performance analytics including Core Web Vitals (LCP, FID, CLS, FCP), component render metrics, network request tracking, memory usage monitoring, and an FPS counter. Automatically collects metrics via PerformanceObserver.',
      importPath: '@clarity-chat/react',
      usageCode: `<PerformanceAnalyticsDashboard
  updateInterval={1000}
  showWebVitals
  showComponentMetrics
  showNetworkMetrics
  showMemoryUsage
  showFPS
  onDataUpdate={(data) => {
    console.debug('Performance:', data)
  }}
/>`,
      props: [
        {
          name: 'data',
          type: 'PerformanceAnalytics',
          description:
            'External performance data to display. When omitted, the component auto-collects metrics via PerformanceObserver, requestAnimationFrame, and performance.memory.',
          commonlyUsed: true,
        },
        {
          name: 'updateInterval',
          type: 'number',
          default: '1000',
          description:
            'Interval in milliseconds for collecting memory usage metrics.',
        },
        {
          name: 'showWebVitals',
          type: 'boolean',
          default: 'true',
          description:
            'Show the Core Web Vitals section with LCP, FID, CLS, FCP, TTFB, and INP metrics. Each vital displays a color-coded rating badge (good/needs-improvement/poor).',
          commonlyUsed: true,
        },
        {
          name: 'showComponentMetrics',
          type: 'boolean',
          default: 'true',
          description:
            'Show the component performance section listing render counts, average render times, and last render time with color-coded badges.',
          commonlyUsed: true,
        },
        {
          name: 'showNetworkMetrics',
          type: 'boolean',
          default: 'false',
          description:
            'Show the network performance section listing tracked HTTP requests with URL, method, size, status, and duration.',
        },
        {
          name: 'showMemoryUsage',
          type: 'boolean',
          default: 'true',
          description:
            'Show the memory usage section with an animated progress bar displaying used, total, and limit heap sizes.',
          commonlyUsed: true,
        },
        {
          name: 'showFPS',
          type: 'boolean',
          default: 'true',
          description:
            'Show the FPS counter badge in the header. Color-coded green (>=50), yellow (>=30), or red (<30).',
        },
        {
          name: 'onDataUpdate',
          type: '(data: PerformanceAnalytics) => void',
          description:
            'Callback invoked whenever performance data updates, receiving the full PerformanceAnalytics snapshot.',
          commonlyUsed: true,
        },
        {
          name: 'compact',
          type: 'boolean',
          default: 'false',
          description:
            'Enable compact mode which reduces the grid to 2 columns for Web Vitals and limits component/network lists to 3 entries.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names for the root container.',
        },
      ],
      notes: [
        'PerformanceAnalytics contains webVitals (WebVital[]), componentMetrics (ComponentMetric[]), networkMetrics (NetworkMetric[]), optional memoryUsage, optional fps, and timestamp.',
        'WebVital rating thresholds: LCP good < 2500ms, FID good < 100ms, FCP good < 1800ms.',
        'ComponentMetric includes name, renderCount, averageRenderTime, maxRenderTime, minRenderTime, lastRenderTime, and optional memoryUsage.',
        'Memory usage relies on the non-standard performance.memory API available in Chromium browsers.',
        'FPS is measured via requestAnimationFrame counting over 1-second intervals.',
      ],
    },
    {
      name: 'PerformanceDashboard',
      description:
        'Simple performance metrics display showing operation count, average time, and total time from the UnifiedPerformanceMonitor. Supports auto-refresh at a configurable interval.',
      importPath: '@clarity-chat/react',
      usageCode: `<PerformanceDashboard
  autoRefresh
  refreshInterval={5000}
/>`,
      props: [
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names for the root container.',
        },
        {
          name: 'autoRefresh',
          type: 'boolean',
          default: 'false',
          description:
            'Enable automatic metric refresh at the configured interval.',
          commonlyUsed: true,
        },
        {
          name: 'refreshInterval',
          type: 'number',
          default: '5000',
          description:
            'Refresh interval in milliseconds when autoRefresh is enabled.',
          commonlyUsed: true,
        },
      ],
      notes: [
        'This component is marked as @deprecated and needs refactoring for the new UnifiedPerformanceMonitor API.',
        'Reads metrics from UnifiedPerformanceMonitor.getMetrics() which returns operationCount, averageTime, and totalTime.',
        'Consider using PerformanceAnalyticsDashboard for a more comprehensive performance view.',
      ],
    },
    {
      name: 'ResponseQualityMeter',
      description:
        'Displays response quality metrics with animated progress bars, optional target thresholds, and an overall confidence score. Designed for evaluating AI response groundedness, coverage, and other scoring signals.',
      importPath: '@clarity-chat/react',
      usageCode: `<ResponseQualityMeter
  metrics={[
    { id: 'groundedness', label: 'Groundedness', score: 0.85, target: 0.75, description: 'How well-grounded in source material' },
    { id: 'coverage', label: 'Coverage', score: 0.72, target: 0.80, description: 'Topic coverage completeness' },
    { id: 'coherence', label: 'Coherence', score: 0.91, description: 'Response logical consistency' },
  ]}
  overallScore={0.83}
  overallLabel="Overall quality"
  title="Response Quality Insights"
/>`,
      props: [
        {
          name: 'metrics',
          type: 'ResponseQualityMetric[]',
          required: true,
          description:
            'Array of quality metrics. Each metric has id (string), label (string), score (number 0-1), optional target (number 0-1), and optional description.',
          commonlyUsed: true,
        },
        {
          name: 'overallScore',
          type: 'number',
          description:
            'Overall quality score (0-1). When provided, displays a summary banner with a color-coded badge: Excellent (>=0.75), Needs review (>=0.5), or Low confidence (<0.5).',
          commonlyUsed: true,
        },
        {
          name: 'overallLabel',
          type: 'string',
          default: "'Overall score'",
          description: 'Label text displayed next to the overall score badge.',
        },
        {
          name: 'title',
          type: 'string',
          default: "'Response quality insights'",
          description: 'Card title heading.',
          commonlyUsed: true,
        },
        {
          name: 'subtitle',
          type: 'string',
          default:
            "'Track groundedness, coverage, and other evaluation signals generated by your scoring pipeline.'",
          description: 'Card subtitle/description text.',
        },
        {
          name: 'scaleLabel',
          type: 'string',
          default: "'Confidence index'",
          description:
            'Label for the confidence scale shown in the footer. The scale defines 0-40% (low trust), 40-75% (needs review), 75-100% (ship with confidence).',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names for the root Card element.',
        },
      ],
      notes: [
        'All scores are clamped to the 0-1 range internally.',
        'When a metric has a target, a green vertical line indicator is drawn on the progress bar at the target position.',
        'Progress bars animate using Framer Motion spring physics with damping 25 and stiffness 200, respecting prefers-reduced-motion.',
        'The overall score badge uses the success, warning, or destructive Badge variant based on the score threshold.',
      ],
    },
  ],
}
