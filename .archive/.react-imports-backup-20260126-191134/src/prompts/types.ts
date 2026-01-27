/**
 * Prompt Template System - Types
 *
 * Flexible prompt management with variables, versioning, and A/B testing.
 * Fully optional and composable.
 */

export interface PromptVariable {
  /** Variable name */
  name: string
  /** Variable description */
  description?: string
  /** Variable type */
  type?: 'string' | 'number' | 'boolean' | 'array' | 'object'
  /** Default value */
  default?: unknown
  /** Whether variable is required */
  required?: boolean
  /** Validation function */
  validate?: (value: unknown) => boolean | string
}

export interface PromptTemplate {
  /** Template ID */
  readonly id: string
  /** Template name */
  readonly name: string
  /** Template description */
  readonly description?: string
  /** Template content with variables */
  readonly template: string
  /** Variables used in template */
  readonly variables?: readonly PromptVariable[]
  /** Template version */
  readonly version?: string
  /** Template category/tags */
  readonly tags?: readonly string[]
  /** Metadata */
  readonly metadata?: Readonly<Record<string, unknown>>
}

export interface PromptVersion {
  /** Version ID */
  readonly id: string
  /** Template ID */
  readonly templateId: string
  /** Version number */
  readonly version: string
  /** Template content */
  readonly template: string
  /** When this version was created */
  readonly createdAt: number
  /** Version notes/changelog */
  readonly notes?: string
  /** Whether this is the active version */
  readonly isActive?: boolean
}

export interface PromptVariant {
  /** Variant ID */
  id: string
  /** Variant name */
  name: string
  /** Template content */
  template: string
  /** Variant weight for A/B testing (0-1) */
  weight?: number
  /** Performance metrics */
  metrics?: {
    uses: number
    successRate?: number
    averageScore?: number
  }
}

export interface RenderPromptOptions {
  /** Variable values */
  variables: Record<string, unknown>
  /** Escape HTML/special characters */
  escape?: boolean
  /** Trim whitespace */
  trim?: boolean
  /** Validation mode */
  validate?: boolean
  /** Custom variable delimiter (default: {{variable}}) */
  delimiter?: { start: string; end: string }
}

export interface PromptRenderResult {
  /** Rendered prompt */
  readonly prompt: string
  /** Variables that were used */
  readonly usedVariables: readonly string[]
  /** Missing required variables */
  readonly missingVariables?: readonly string[]
  /** Validation errors */
  readonly errors?: readonly string[]
  /** Whether render was successful */
  readonly success: boolean
}

/**
 * Prompt environment for deployment management
 */
export type PromptEnvironment = 'development' | 'staging' | 'production'

/**
 * Prompt deployment configuration
 */
export interface PromptDeployment {
  /** Deployment ID */
  id: string
  /** Template ID */
  templateId: string
  /** Version ID being deployed */
  versionId: string
  /** Target environment */
  environment: PromptEnvironment
  /** Deployment status */
  status: 'pending' | 'active' | 'rolled-back' | 'archived'
  /** When deployed */
  deployedAt: number
  /** Who deployed (user ID or system) */
  deployedBy: string
  /** Rollback target (previous version ID) */
  rollbackTarget?: string
  /** Traffic percentage (for gradual rollouts) */
  trafficPercentage?: number
}

/**
 * Prompt analytics data
 */
export interface PromptAnalytics {
  /** Template ID */
  templateId: string
  /** Version ID (optional, for version-specific analytics) */
  versionId?: string
  /** Time period */
  period: {
    start: number
    end: number
  }
  /** Usage metrics */
  usage: {
    /** Total number of times used */
    totalUses: number
    /** Unique users */
    uniqueUsers: number
    /** Uses per day */
    usesPerDay: number[]
  }
  /** Performance metrics */
  performance: {
    /** Average latency in ms */
    averageLatency: number
    /** P95 latency in ms */
    p95Latency: number
    /** Average token count */
    averageTokens: number
    /** Total cost estimate */
    totalCost: number
  }
  /** Quality metrics */
  quality: {
    /** Success rate (0-1) */
    successRate: number
    /** User satisfaction score (0-5) */
    satisfactionScore?: number
    /** Error rate (0-1) */
    errorRate: number
    /** Feedback count */
    feedbackCount: number
  }
}

/**
 * A/B test configuration
 */
export interface PromptABTest {
  /** Test ID */
  id: string
  /** Test name */
  name: string
  /** Test description */
  description?: string
  /** Template ID being tested */
  templateId: string
  /** Test status */
  status: 'draft' | 'running' | 'paused' | 'completed' | 'archived'
  /** Variants in the test */
  variants: PromptABTestVariant[]
  /** Test configuration */
  config: {
    /** Traffic allocation method */
    allocationMethod: 'random' | 'user-based' | 'session-based'
    /** Minimum sample size per variant */
    minSampleSize: number
    /** Statistical significance threshold (0-1) */
    significanceThreshold: number
    /** Primary metric to optimize */
    primaryMetric:
      | 'success_rate'
      | 'latency'
      | 'cost'
      | 'satisfaction'
      | 'custom'
    /** Custom metric name if primaryMetric is 'custom' */
    customMetricName?: string
  }
  /** Test results */
  results?: PromptABTestResults
  /** When the test was created */
  createdAt: number
  /** When the test started */
  startedAt?: number
  /** When the test ended */
  endedAt?: number
}

/**
 * A/B test variant with extended metrics
 */
export interface PromptABTestVariant extends PromptVariant {
  /** Traffic percentage (0-100) */
  trafficPercentage: number
  /** Is this the control variant */
  isControl: boolean
  /** Variant-specific metrics */
  metrics: {
    uses: number
    successRate: number
    averageLatency?: number
    averageScore?: number
    conversionRate?: number
  }
}

/**
 * A/B test results
 */
export interface PromptABTestResults {
  /** Winning variant ID (if determined) */
  winnerId?: string
  /** Statistical significance achieved */
  isSignificant: boolean
  /** Confidence level (0-1) */
  confidence: number
  /** Lift percentage of winner vs control */
  lift?: number
  /** Per-variant results */
  variantResults: Record<
    string,
    {
      sampleSize: number
      conversionRate: number
      averageMetric: number
      confidenceInterval: [number, number]
    }
  >
  /** Recommendation */
  recommendation?:
    | 'deploy-winner'
    | 'continue-testing'
    | 'no-significant-difference'
}

/**
 * Prompt collaboration features
 */
export interface PromptComment {
  /** Comment ID */
  id: string
  /** Template or version ID */
  targetId: string
  /** Target type */
  targetType: 'template' | 'version'
  /** Comment author */
  author: {
    id: string
    name: string
    avatar?: string
  }
  /** Comment content */
  content: string
  /** When created */
  createdAt: number
  /** When updated */
  updatedAt?: number
  /** Parent comment ID for replies */
  parentId?: string
  /** Whether resolved (for review comments) */
  resolved?: boolean
}

/**
 * Prompt change history entry
 */
export interface PromptChangeHistoryEntry {
  /** Entry ID */
  id: string
  /** Template ID */
  templateId: string
  /** Type of change */
  changeType:
    | 'created'
    | 'updated'
    | 'version-created'
    | 'deployed'
    | 'rolled-back'
    | 'deleted'
  /** Change description */
  description: string
  /** Who made the change */
  changedBy: {
    id: string
    name: string
  }
  /** When the change occurred */
  changedAt: number
  /** Previous value (for updates) */
  previousValue?: string
  /** New value (for updates) */
  newValue?: string
  /** Related version ID */
  versionId?: string
  /** Related environment */
  environment?: PromptEnvironment
}

/**
 * Prompt library state for usePromptLibrary hook
 */
export interface PromptLibraryState {
  /** All templates */
  templates: PromptTemplate[]
  /** All versions by template ID */
  versions: Record<string, PromptVersion[]>
  /** Active deployments by environment */
  deployments: Record<PromptEnvironment, PromptDeployment[]>
  /** Active A/B tests */
  abTests: PromptABTest[]
  /** Analytics data */
  analytics: Record<string, PromptAnalytics>
  /** Change history */
  history: PromptChangeHistoryEntry[]
  /** Loading state */
  isLoading: boolean
  /** Error state */
  error?: string
}

/**
 * Prompt playground state
 */
export interface PromptPlaygroundState {
  /** Current template being edited */
  template: string
  /** Current variable values */
  variables: Record<string, unknown>
  /** Rendered output */
  output: string
  /** Token count estimate */
  tokenCount: number
  /** Cost estimate */
  costEstimate: number
  /** Validation errors */
  errors: string[]
  /** Is currently rendering */
  isRendering: boolean
}
