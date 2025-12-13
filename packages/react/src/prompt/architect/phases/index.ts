/**
 * Architect Framework Phases
 *
 * Re-exports all phase utilities for the 4-phase architect workflow.
 *
 * @packageDocumentation
 */

// Phase 1: Analysis & Audit
export {
  OWASP_VULNERABILITIES,
  CODE_SMELL_PATTERNS,
  COMMON_CONTEXT_QUESTIONS,
  createContextRequirement,
  createSecurityFinding,
  createCodeSmellFinding,
  createTechnicalDebtItem,
  calculateRiskScore,
  createAuditResult,
  formatAuditResultAsMarkdown,
} from './phase1-audit'

// Phase 2: Strategic Planning
export {
  DESIGN_PATTERN_CATALOG,
  createPlanningStep,
  createPatternRecommendation,
  createRejectedAlternative,
  createTestPlanItem,
  calculateTotalComplexity,
  createStrategicPlan,
  formatStrategicPlanAsMarkdown,
  generatePlanningBlockTemplate,
  getPatternInfo,
  suggestPatternsForUseCase,
} from './phase2-planning'

// Phase 3: Implementation
export {
  STYLE_GUIDE_PRESETS,
  DOCUMENTATION_TEMPLATES,
  LEGACY_IMPROVEMENT_PATTERNS,
  getStyleGuidePreset,
  createLegacyImprovement,
  createImplementationOutput,
  formatImplementationAsMarkdown,
  generateCodeBlockTemplate,
  validateAgainstStyleGuide,
  getDocumentationRequirements,
  generateDocTemplate,
} from './phase3-implementation'
export type { LegacyImprovement, LegacyImprovementType } from './phase3-implementation'

// Phase 4: Review & Reflection
export {
  STANDARD_CONSTRAINTS,
  DRY_VIOLATION_PATTERNS,
  ADR_TEMPLATE,
  ADR_CATEGORIES,
  createSelfCorrectionItem,
  generateSelfCorrectionChecklist,
  createDefaultSelfCorrection,
  createDRYCheckResult,
  generateDRYSuggestions,
  createADR,
  formatADRAsMarkdown,
  calculateQualityScore,
  generateRecommendations,
  createReviewResult,
  formatReviewResultAsMarkdown,
  generateReviewBlockTemplate,
  isADRNeeded,
} from './phase4-review'
export type { DRYViolationType } from './phase4-review'
