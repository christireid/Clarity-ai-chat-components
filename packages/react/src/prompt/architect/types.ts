/**
 * Architect Framework Types
 *
 * Type definitions for the Principal Software Architect & Engineering Lead
 * AI prompt engineering framework.
 *
 * @packageDocumentation
 */

/**
 * OWASP Top 10 vulnerability categories
 */
export type OWASPVulnerability =
  | 'A01_BROKEN_ACCESS_CONTROL'
  | 'A02_CRYPTOGRAPHIC_FAILURES'
  | 'A03_INJECTION'
  | 'A04_INSECURE_DESIGN'
  | 'A05_SECURITY_MISCONFIGURATION'
  | 'A06_VULNERABLE_COMPONENTS'
  | 'A07_AUTH_FAILURES'
  | 'A08_DATA_INTEGRITY_FAILURES'
  | 'A09_LOGGING_FAILURES'
  | 'A10_SSRF'

/**
 * Code smell categories
 */
export type CodeSmellType =
  | 'HIGH_CYCLOMATIC_COMPLEXITY'
  | 'HIGH_COGNITIVE_COMPLEXITY'
  | 'GOD_OBJECT'
  | 'LONG_METHOD'
  | 'LONG_PARAMETER_LIST'
  | 'DUPLICATE_CODE'
  | 'DEAD_CODE'
  | 'FEATURE_ENVY'
  | 'DATA_CLUMPS'
  | 'PRIMITIVE_OBSESSION'
  | 'SWITCH_STATEMENTS'
  | 'PARALLEL_INHERITANCE'
  | 'LAZY_CLASS'
  | 'SPECULATIVE_GENERALITY'
  | 'TEMPORARY_FIELD'
  | 'MESSAGE_CHAINS'
  | 'MIDDLE_MAN'
  | 'INAPPROPRIATE_INTIMACY'
  | 'ALTERNATIVE_CLASSES'
  | 'INCOMPLETE_LIBRARY'
  | 'DATA_CLASS'
  | 'REFUSED_BEQUEST'
  | 'COMMENTS'

/**
 * Technical debt classification
 */
export type TechnicalDebtType =
  | 'CODE_DEBT'
  | 'DESIGN_DEBT'
  | 'ARCHITECTURAL_DEBT'
  | 'TEST_DEBT'
  | 'DOCUMENTATION_DEBT'
  | 'INFRASTRUCTURE_DEBT'

/**
 * Technical debt severity levels
 */
export type DebtSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info'

/**
 * Design pattern categories
 */
export type DesignPatternCategory =
  | 'creational'
  | 'structural'
  | 'behavioral'

/**
 * Common design patterns
 */
export type DesignPattern =
  // Creational
  | 'SINGLETON'
  | 'FACTORY_METHOD'
  | 'ABSTRACT_FACTORY'
  | 'BUILDER'
  | 'PROTOTYPE'
  // Structural
  | 'ADAPTER'
  | 'BRIDGE'
  | 'COMPOSITE'
  | 'DECORATOR'
  | 'FACADE'
  | 'FLYWEIGHT'
  | 'PROXY'
  // Behavioral
  | 'CHAIN_OF_RESPONSIBILITY'
  | 'COMMAND'
  | 'INTERPRETER'
  | 'ITERATOR'
  | 'MEDIATOR'
  | 'MEMENTO'
  | 'OBSERVER'
  | 'STATE'
  | 'STRATEGY'
  | 'TEMPLATE_METHOD'
  | 'VISITOR'

/**
 * Test strategy types
 */
export type TestStrategy =
  | 'UNIT'
  | 'INTEGRATION'
  | 'E2E'
  | 'PROPERTY_BASED'
  | 'SNAPSHOT'
  | 'CONTRACT'
  | 'PERFORMANCE'
  | 'SECURITY'
  | 'ACCESSIBILITY'

/**
 * Programming language for style guide adherence
 */
export type ProgrammingLanguage =
  | 'typescript'
  | 'javascript'
  | 'python'
  | 'java'
  | 'csharp'
  | 'go'
  | 'rust'
  | 'ruby'
  | 'php'
  | 'swift'
  | 'kotlin'

/**
 * Style guide convention
 */
export type StyleGuide =
  | 'google'
  | 'airbnb'
  | 'standard'
  | 'prettier'
  | 'custom'

// ============================================================================
// Phase 1: Analysis & Audit Types
// ============================================================================

/**
 * Security scan finding
 */
export interface SecurityFinding {
  /** Vulnerability type */
  type: OWASPVulnerability
  /** Severity level */
  severity: DebtSeverity
  /** Description of the vulnerability */
  description: string
  /** Location in code (file:line) */
  location?: string
  /** Recommended fix */
  recommendation: string
  /** CWE ID if applicable */
  cweId?: string
  /** CVSS score if applicable */
  cvssScore?: number
}

/**
 * Code smell detection result
 */
export interface CodeSmellFinding {
  /** Type of code smell */
  type: CodeSmellType
  /** Severity level */
  severity: DebtSeverity
  /** Description of the issue */
  description: string
  /** Location in code */
  location?: string
  /** Suggested refactoring */
  refactoringSuggestion: string
  /** Estimated effort to fix */
  estimatedEffort?: 'trivial' | 'minor' | 'major' | 'significant'
}

/**
 * Technical debt assessment item
 */
export interface TechnicalDebtItem {
  /** Type of debt */
  type: TechnicalDebtType
  /** Severity level */
  severity: DebtSeverity
  /** Description of the debt */
  description: string
  /** Impact on system */
  impact: string
  /** Interest rate (how fast it grows) */
  interestRate: 'low' | 'medium' | 'high' | 'critical'
  /** Recommended remediation */
  remediation: string
}

/**
 * Context requirements for analysis
 */
export interface ContextRequirement {
  /** What information is needed */
  requirement: string
  /** Why it's needed */
  reason: string
  /** Priority level */
  priority: 'required' | 'recommended' | 'optional'
  /** Whether it has been provided */
  fulfilled: boolean
}

/**
 * Complete audit result from Phase 1
 */
export interface AuditResult {
  /** Context requirements identified */
  contextRequirements: ContextRequirement[]
  /** Security findings */
  securityFindings: SecurityFinding[]
  /** Code smell findings */
  codeSmells: CodeSmellFinding[]
  /** Technical debt items */
  technicalDebt: TechnicalDebtItem[]
  /** Overall risk score (0-100) */
  riskScore: number
  /** Summary of findings */
  summary: string
  /** Timestamp of audit */
  timestamp: Date
}

// ============================================================================
// Phase 2: Strategic Planning Types
// ============================================================================

/**
 * Planning step
 */
export interface PlanningStep {
  /** Step number */
  stepNumber: number
  /** Step title */
  title: string
  /** Detailed description */
  description: string
  /** Expected outcome */
  expectedOutcome: string
  /** Dependencies on other steps */
  dependencies: number[]
  /** Estimated complexity */
  complexity: 'trivial' | 'simple' | 'moderate' | 'complex' | 'very_complex'
  /** Risk level */
  riskLevel: 'low' | 'medium' | 'high'
}

/**
 * Design pattern recommendation
 */
export interface PatternRecommendation {
  /** Recommended pattern */
  pattern: DesignPattern
  /** Category of pattern */
  category: DesignPatternCategory
  /** Why this pattern fits */
  rationale: string
  /** Trade-offs to consider */
  tradeoffs: string[]
  /** Implementation notes */
  implementationNotes?: string
}

/**
 * Alternative approach that was considered but rejected
 */
export interface RejectedAlternative {
  /** Name of the alternative */
  name: string
  /** Brief description */
  description: string
  /** Why it was rejected */
  rejectionReason: string
  /** Conditions under which it would be preferred */
  preferredWhen?: string
}

/**
 * Test plan item
 */
export interface TestPlanItem {
  /** Test strategy type */
  strategy: TestStrategy
  /** What to test */
  target: string
  /** Expected coverage */
  coverage?: string
  /** Priority */
  priority: 'critical' | 'high' | 'medium' | 'low'
  /** Description */
  description: string
}

/**
 * Complete strategic plan from Phase 2
 */
export interface StrategicPlan {
  /** Chain of thought reasoning */
  chainOfThought: string
  /** Step-by-step plan */
  steps: PlanningStep[]
  /** Design pattern recommendations */
  patternRecommendations: PatternRecommendation[]
  /** Rejected alternatives */
  rejectedAlternatives: RejectedAlternative[]
  /** Test strategy */
  testPlan: TestPlanItem[]
  /** Overall approach summary */
  approachSummary: string
  /** Estimated total complexity */
  totalComplexity: 'trivial' | 'simple' | 'moderate' | 'complex' | 'very_complex'
}

// ============================================================================
// Phase 3: Implementation Types
// ============================================================================

/**
 * Style guide rules
 */
export interface StyleGuideRules {
  /** Language being used */
  language: ProgrammingLanguage
  /** Style guide to follow */
  styleGuide: StyleGuide
  /** Naming conventions */
  naming: {
    variables: 'camelCase' | 'snake_case' | 'PascalCase' | 'SCREAMING_SNAKE_CASE'
    functions: 'camelCase' | 'snake_case' | 'PascalCase'
    classes: 'PascalCase' | 'snake_case'
    constants: 'SCREAMING_SNAKE_CASE' | 'camelCase'
    files: 'kebab-case' | 'snake_case' | 'camelCase' | 'PascalCase'
  }
  /** Prefer immutability */
  preferImmutability: boolean
  /** Strict typing required */
  strictTyping: boolean
  /** Maximum line length */
  maxLineLength?: number
  /** Indentation style */
  indentation: 'spaces' | 'tabs'
  /** Indentation size */
  indentSize: number
}

/**
 * Documentation requirements
 */
export interface DocumentationRequirements {
  /** Require JSDoc/docstrings for public interfaces */
  requirePublicDocs: boolean
  /** Require parameter documentation */
  requireParamDocs: boolean
  /** Require return value documentation */
  requireReturnDocs: boolean
  /** Require error/throws documentation */
  requireThrowsDocs: boolean
  /** Require usage examples */
  requireExamples: boolean
}

/**
 * Implementation output
 */
export interface ImplementationOutput {
  /** Generated code */
  code: string
  /** Language of the code */
  language: ProgrammingLanguage
  /** File path suggestion */
  suggestedFilePath?: string
  /** Whether Boy Scout Rule was applied */
  boyScoutRuleApplied: boolean
  /** Legacy code improvements made */
  legacyImprovements?: string[]
  /** Dependencies added */
  dependenciesAdded?: string[]
}

// ============================================================================
// Phase 4: Review & Reflection Types
// ============================================================================

/**
 * Self-correction item
 */
export interface SelfCorrectionItem {
  /** What was checked */
  constraint: string
  /** Whether it passed */
  passed: boolean
  /** Details */
  details?: string
  /** Correction applied if failed */
  correctionApplied?: string
}

/**
 * DRY (Don't Repeat Yourself) check result
 */
export interface DRYCheckResult {
  /** Whether code is DRY */
  isDRY: boolean
  /** Duplications found */
  duplications: Array<{
    description: string
    locations: string[]
    suggestion: string
  }>
}

/**
 * Architecture Decision Record
 */
export interface ArchitectureDecisionRecord {
  /** ADR title */
  title: string
  /** Decision date */
  date: Date
  /** Status */
  status: 'proposed' | 'accepted' | 'deprecated' | 'superseded'
  /** Context - why this decision was needed */
  context: string
  /** Decision - what was decided */
  decision: string
  /** Consequences - positive and negative impacts */
  consequences: {
    positive: string[]
    negative: string[]
    neutral?: string[]
  }
  /** Alternatives considered */
  alternativesConsidered: string[]
  /** Related ADRs */
  relatedADRs?: string[]
}

/**
 * Complete review result from Phase 4
 */
export interface ReviewResult {
  /** Self-correction checks */
  selfCorrections: SelfCorrectionItem[]
  /** DRY check result */
  dryCheck: DRYCheckResult
  /** Security re-verification */
  securityRecheck: SecurityFinding[]
  /** ADR if significant decision made */
  adr?: ArchitectureDecisionRecord
  /** Overall quality score (0-100) */
  qualityScore: number
  /** Final recommendations */
  recommendations: string[]
}

// ============================================================================
// Complete Workflow Types
// ============================================================================

/**
 * Architect workflow phase
 */
export type ArchitectPhase =
  | 'analysis'
  | 'planning'
  | 'implementation'
  | 'review'

/**
 * Architect workflow state
 */
export interface ArchitectWorkflowState {
  /** Current phase */
  currentPhase: ArchitectPhase
  /** Phase 1 result */
  auditResult?: AuditResult
  /** Phase 2 result */
  strategicPlan?: StrategicPlan
  /** Phase 3 result */
  implementationOutput?: ImplementationOutput
  /** Phase 4 result */
  reviewResult?: ReviewResult
  /** Whether workflow is complete */
  isComplete: boolean
  /** Any errors encountered */
  errors: string[]
}

/**
 * Architect configuration
 */
export interface ArchitectConfig {
  /** Style guide rules to enforce */
  styleGuide: StyleGuideRules
  /** Documentation requirements */
  documentation: DocumentationRequirements
  /** Security scanning enabled */
  enableSecurityScan: boolean
  /** Code smell detection enabled */
  enableCodeSmellDetection: boolean
  /** Technical debt assessment enabled */
  enableDebtAssessment: boolean
  /** Strict mode - fail on any issues */
  strictMode: boolean
  /** Custom rules */
  customRules?: Record<string, unknown>
}

/**
 * Default architect configuration
 */
export const DEFAULT_ARCHITECT_CONFIG: ArchitectConfig = {
  styleGuide: {
    language: 'typescript',
    styleGuide: 'airbnb',
    naming: {
      variables: 'camelCase',
      functions: 'camelCase',
      classes: 'PascalCase',
      constants: 'SCREAMING_SNAKE_CASE',
      files: 'kebab-case',
    },
    preferImmutability: true,
    strictTyping: true,
    maxLineLength: 100,
    indentation: 'spaces',
    indentSize: 2,
  },
  documentation: {
    requirePublicDocs: true,
    requireParamDocs: true,
    requireReturnDocs: true,
    requireThrowsDocs: true,
    requireExamples: false,
  },
  enableSecurityScan: true,
  enableCodeSmellDetection: true,
  enableDebtAssessment: true,
  strictMode: false,
}
