/**
 * Architect Framework Type Definitions
 *
 * This module contains types for the Principal Software Architect
 * AI prompt engineering framework, including security scanning,
 * code analysis, design patterns, and workflow management.
 *
 * @packageDocumentation
 */

// ============================================================================
// Security Types
// ============================================================================

/**
 * OWASP Top 10 vulnerability categories (2021)
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
 * Security finding from vulnerability scan
 */
export interface SecurityFinding {
  /** Vulnerability type from OWASP Top 10 */
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
  /** CVSS score (0-10) if applicable */
  cvssScore?: number
}

// ============================================================================
// Code Quality Types
// ============================================================================

/**
 * Code smell categories from Martin Fowler's catalog
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

// ============================================================================
// Technical Debt Types
// ============================================================================

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
 * Severity levels for findings
 */
export type DebtSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info'

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

// ============================================================================
// Design Pattern Types
// ============================================================================

/**
 * Design pattern categories
 */
export type DesignPatternCategory = 'creational' | 'structural' | 'behavioral'

/**
 * All 23 Gang of Four design patterns
 */
export type DesignPattern =
  // Creational (5)
  | 'SINGLETON'
  | 'FACTORY_METHOD'
  | 'ABSTRACT_FACTORY'
  | 'BUILDER'
  | 'PROTOTYPE'
  // Structural (7)
  | 'ADAPTER'
  | 'BRIDGE'
  | 'COMPOSITE'
  | 'DECORATOR'
  | 'FACADE'
  | 'FLYWEIGHT'
  | 'PROXY'
  // Behavioral (11)
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
 * Complete design pattern definition
 */
export interface PatternDefinition {
  /** Pattern identifier */
  id: DesignPattern
  /** Human-readable name */
  name: string
  /** Pattern category */
  category: DesignPatternCategory
  /** Description of intent */
  intent: string
  /** Common use cases */
  useCases: string[]
  /** Trade-offs */
  tradeoffs: {
    pros: string[]
    cons: string[]
  }
  /** Implementation example */
  implementation: string
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

// ============================================================================
// Audit Result Types
// ============================================================================

/**
 * Context requirement for analysis
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
// Strategic Planning Types
// ============================================================================

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
// Implementation Types
// ============================================================================

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
export type StyleGuide = 'google' | 'airbnb' | 'standard' | 'prettier' | 'custom'

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
// Review Types
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
 * DRY check result
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
 * Architecture Decision Record (ADR)
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
// Workflow Types
// ============================================================================

/**
 * Architect workflow phase
 */
export type ArchitectPhase = 'analysis' | 'planning' | 'implementation' | 'review'

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
