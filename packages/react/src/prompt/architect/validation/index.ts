import { logger } from '@clarity-chat/utils/logger';
/**
 * Validation Module
 *
 * Provides runtime type validation using Zod schemas.
 *
 * @example
 * ```typescript
 * import { validators, safeValidators, SecurityFindingSchema } from '@clarity-chat/react/prompt/architect/validation'
 *
 * // Throw on invalid data
 * const finding = validators.securityFinding(data)
 *
 * // Safe validation with result
 * const result = safeValidators.securityFinding(data)
 * if (result.success) {
 *   logger.debug(result.data)
 * } else {
 *   logger.logger.error(result.error.getFormattedErrors())
 * }
 *
 * // Direct schema usage
 * const parsed = SecurityFindingSchema.parse(data)
 * ```
 *
 * @packageDocumentation
 */

// Re-export all schemas
export {
  // Enum schemas
  OWASPVulnerabilitySchema,
  CodeSmellTypeSchema,
  TechnicalDebtTypeSchema,
  DebtSeveritySchema,
  DesignPatternCategorySchema,
  DesignPatternSchema,
  TestStrategySchema,
  ProgrammingLanguageSchema,
  StyleGuideSchema,
  ComplexitySchema,
  RiskLevelSchema,
  PriorityLevelSchema,
  EffortEstimateSchema,
  InterestRateSchema,
  ADRStatusSchema,
  ArchitectPhaseSchema,

  // Phase 1: Audit schemas
  SecurityFindingSchema,
  CodeSmellFindingSchema,
  TechnicalDebtItemSchema,
  ContextRequirementSchema,
  AuditResultSchema,

  // Phase 2: Planning schemas
  PlanningStepSchema,
  PatternRecommendationSchema,
  RejectedAlternativeSchema,
  TestPlanItemSchema,
  StrategicPlanSchema,

  // Phase 3: Implementation schemas
  NamingConventionsSchema,
  StyleGuideRulesSchema,
  DocumentationRequirementsSchema,
  ImplementationOutputSchema,

  // Phase 4: Review schemas
  SelfCorrectionItemSchema,
  DuplicationSchema,
  DRYCheckResultSchema,
  ADRConsequencesSchema,
  ArchitectureDecisionRecordSchema,
  ReviewResultSchema,

  // Workflow schemas
  ArchitectWorkflowStateSchema,
  ArchitectConfigSchema,

  // Pattern schema
  PatternDefinitionSchema,

  // Inferred types
  type ValidatedSecurityFinding,
  type ValidatedCodeSmellFinding,
  type ValidatedTechnicalDebtItem,
  type ValidatedAuditResult,
  type ValidatedPlanningStep,
  type ValidatedStrategicPlan,
  type ValidatedImplementationOutput,
  type ValidatedReviewResult,
  type ValidatedArchitectConfig,
  type ValidatedPatternDefinition,

  // Utilities
  ValidationError,
  type SafeParseResult,
  validateOrThrow,
  validateSafe,
  validators,
  safeValidators,
} from './schemas'
