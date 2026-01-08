/**
 * Zod Runtime Validation Schemas
 *
 * Provides runtime type validation for the architect framework.
 * Use these schemas to validate data at system boundaries
 * (API responses, user input, external data sources).
 *
 * @packageDocumentation
 */
import { z } from 'zod';
// ============================================================================
// Enum Schemas
// ============================================================================
/**
 * OWASP Top 10 vulnerability types
 */
export const OWASPVulnerabilitySchema = z.enum([
    'A01_BROKEN_ACCESS_CONTROL',
    'A02_CRYPTOGRAPHIC_FAILURES',
    'A03_INJECTION',
    'A04_INSECURE_DESIGN',
    'A05_SECURITY_MISCONFIGURATION',
    'A06_VULNERABLE_COMPONENTS',
    'A07_AUTH_FAILURES',
    'A08_DATA_INTEGRITY_FAILURES',
    'A09_LOGGING_FAILURES',
    'A10_SSRF',
]);
/**
 * Code smell types
 */
export const CodeSmellTypeSchema = z.enum([
    'HIGH_CYCLOMATIC_COMPLEXITY',
    'HIGH_COGNITIVE_COMPLEXITY',
    'GOD_OBJECT',
    'LONG_METHOD',
    'LONG_PARAMETER_LIST',
    'DUPLICATE_CODE',
    'DEAD_CODE',
    'FEATURE_ENVY',
    'DATA_CLUMPS',
    'PRIMITIVE_OBSESSION',
    'SWITCH_STATEMENTS',
    'PARALLEL_INHERITANCE',
    'LAZY_CLASS',
    'SPECULATIVE_GENERALITY',
    'TEMPORARY_FIELD',
    'MESSAGE_CHAINS',
    'MIDDLE_MAN',
    'INAPPROPRIATE_INTIMACY',
    'ALTERNATIVE_CLASSES',
    'INCOMPLETE_LIBRARY',
    'DATA_CLASS',
    'REFUSED_BEQUEST',
    'COMMENTS',
]);
/**
 * Technical debt types
 */
export const TechnicalDebtTypeSchema = z.enum([
    'CODE_DEBT',
    'DESIGN_DEBT',
    'ARCHITECTURAL_DEBT',
    'TEST_DEBT',
    'DOCUMENTATION_DEBT',
    'INFRASTRUCTURE_DEBT',
]);
/**
 * Severity levels
 */
export const DebtSeveritySchema = z.enum([
    'critical',
    'high',
    'medium',
    'low',
    'info',
]);
/**
 * Design pattern categories
 */
export const DesignPatternCategorySchema = z.enum([
    'creational',
    'structural',
    'behavioral',
]);
/**
 * All 23 GoF design patterns
 */
export const DesignPatternSchema = z.enum([
    // Creational
    'SINGLETON',
    'FACTORY_METHOD',
    'ABSTRACT_FACTORY',
    'BUILDER',
    'PROTOTYPE',
    // Structural
    'ADAPTER',
    'BRIDGE',
    'COMPOSITE',
    'DECORATOR',
    'FACADE',
    'FLYWEIGHT',
    'PROXY',
    // Behavioral
    'CHAIN_OF_RESPONSIBILITY',
    'COMMAND',
    'INTERPRETER',
    'ITERATOR',
    'MEDIATOR',
    'MEMENTO',
    'OBSERVER',
    'STATE',
    'STRATEGY',
    'TEMPLATE_METHOD',
    'VISITOR',
]);
/**
 * Test strategy types
 */
export const TestStrategySchema = z.enum([
    'UNIT',
    'INTEGRATION',
    'E2E',
    'PROPERTY_BASED',
    'SNAPSHOT',
    'CONTRACT',
    'PERFORMANCE',
    'SECURITY',
    'ACCESSIBILITY',
]);
/**
 * Programming languages
 */
export const ProgrammingLanguageSchema = z.enum([
    'typescript',
    'javascript',
    'python',
    'java',
    'csharp',
    'go',
    'rust',
    'ruby',
    'php',
    'swift',
    'kotlin',
]);
/**
 * Style guide options
 */
export const StyleGuideSchema = z.enum([
    'google',
    'airbnb',
    'standard',
    'prettier',
    'custom',
]);
/**
 * Complexity levels
 */
export const ComplexitySchema = z.enum([
    'trivial',
    'simple',
    'moderate',
    'complex',
    'very_complex',
]);
/**
 * Risk levels
 */
export const RiskLevelSchema = z.enum(['low', 'medium', 'high']);
/**
 * Priority levels
 */
export const PriorityLevelSchema = z.enum(['critical', 'high', 'medium', 'low']);
/**
 * Effort estimates
 */
export const EffortEstimateSchema = z.enum([
    'trivial',
    'minor',
    'major',
    'significant',
]);
/**
 * Interest rate levels
 */
export const InterestRateSchema = z.enum(['low', 'medium', 'high', 'critical']);
/**
 * ADR status
 */
export const ADRStatusSchema = z.enum([
    'proposed',
    'accepted',
    'deprecated',
    'superseded',
]);
/**
 * Workflow phases
 */
export const ArchitectPhaseSchema = z.enum([
    'analysis',
    'planning',
    'implementation',
    'review',
]);
// ============================================================================
// Phase 1: Audit Schemas
// ============================================================================
/**
 * Security finding schema
 */
export const SecurityFindingSchema = z.object({
    type: OWASPVulnerabilitySchema,
    severity: DebtSeveritySchema,
    description: z.string().min(1, 'Description is required'),
    location: z.string().optional(),
    recommendation: z.string().min(1, 'Recommendation is required'),
    cweId: z.string().regex(/^CWE-\d+$/, 'CWE ID must be in format CWE-XXX').optional(),
    cvssScore: z.number().min(0).max(10).optional(),
});
/**
 * Code smell finding schema
 */
export const CodeSmellFindingSchema = z.object({
    type: CodeSmellTypeSchema,
    severity: DebtSeveritySchema,
    description: z.string().min(1, 'Description is required'),
    location: z.string().optional(),
    refactoringSuggestion: z.string().min(1, 'Refactoring suggestion is required'),
    estimatedEffort: EffortEstimateSchema.optional(),
});
/**
 * Technical debt item schema
 */
export const TechnicalDebtItemSchema = z.object({
    type: TechnicalDebtTypeSchema,
    severity: DebtSeveritySchema,
    description: z.string().min(1, 'Description is required'),
    impact: z.string().min(1, 'Impact assessment is required'),
    interestRate: InterestRateSchema,
    remediation: z.string().min(1, 'Remediation plan is required'),
});
/**
 * Context requirement schema
 */
export const ContextRequirementSchema = z.object({
    requirement: z.string().min(1, 'Requirement is required'),
    reason: z.string().min(1, 'Reason is required'),
    priority: z.enum(['required', 'recommended', 'optional']),
    fulfilled: z.boolean(),
});
/**
 * Complete audit result schema
 */
export const AuditResultSchema = z.object({
    contextRequirements: z.array(ContextRequirementSchema),
    securityFindings: z.array(SecurityFindingSchema),
    codeSmells: z.array(CodeSmellFindingSchema),
    technicalDebt: z.array(TechnicalDebtItemSchema),
    riskScore: z.number().min(0).max(100),
    summary: z.string().min(1, 'Summary is required'),
    timestamp: z.coerce.date(),
});
// ============================================================================
// Phase 2: Planning Schemas
// ============================================================================
/**
 * Planning step schema
 */
export const PlanningStepSchema = z.object({
    stepNumber: z.number().int().positive(),
    title: z.string().min(1, 'Step title is required'),
    description: z.string().min(1, 'Step description is required'),
    expectedOutcome: z.string().min(1, 'Expected outcome is required'),
    dependencies: z.array(z.number().int().nonnegative()),
    complexity: ComplexitySchema,
    riskLevel: RiskLevelSchema,
});
/**
 * Pattern recommendation schema
 */
export const PatternRecommendationSchema = z.object({
    pattern: DesignPatternSchema,
    category: DesignPatternCategorySchema,
    rationale: z.string().min(1, 'Rationale is required'),
    tradeoffs: z.array(z.string()),
    implementationNotes: z.string().optional(),
});
/**
 * Rejected alternative schema
 */
export const RejectedAlternativeSchema = z.object({
    name: z.string().min(1, 'Alternative name is required'),
    description: z.string().min(1, 'Description is required'),
    rejectionReason: z.string().min(1, 'Rejection reason is required'),
    preferredWhen: z.string().optional(),
});
/**
 * Test plan item schema
 */
export const TestPlanItemSchema = z.object({
    strategy: TestStrategySchema,
    target: z.string().min(1, 'Test target is required'),
    coverage: z.string().optional(),
    priority: PriorityLevelSchema,
    description: z.string().min(1, 'Description is required'),
});
/**
 * Complete strategic plan schema
 */
export const StrategicPlanSchema = z.object({
    chainOfThought: z.string().min(1, 'Chain of thought reasoning is required'),
    steps: z.array(PlanningStepSchema).min(1, 'At least one step is required'),
    patternRecommendations: z.array(PatternRecommendationSchema),
    rejectedAlternatives: z.array(RejectedAlternativeSchema),
    testPlan: z.array(TestPlanItemSchema),
    approachSummary: z.string().min(1, 'Approach summary is required'),
    totalComplexity: ComplexitySchema,
});
// ============================================================================
// Phase 3: Implementation Schemas
// ============================================================================
/**
 * Naming conventions schema
 */
export const NamingConventionsSchema = z.object({
    variables: z.enum(['camelCase', 'snake_case', 'PascalCase', 'SCREAMING_SNAKE_CASE']),
    functions: z.enum(['camelCase', 'snake_case', 'PascalCase']),
    classes: z.enum(['PascalCase', 'snake_case']),
    constants: z.enum(['SCREAMING_SNAKE_CASE', 'camelCase']),
    files: z.enum(['kebab-case', 'snake_case', 'camelCase', 'PascalCase']),
});
/**
 * Style guide rules schema
 */
export const StyleGuideRulesSchema = z.object({
    language: ProgrammingLanguageSchema,
    styleGuide: StyleGuideSchema,
    naming: NamingConventionsSchema,
    preferImmutability: z.boolean(),
    strictTyping: z.boolean(),
    maxLineLength: z.number().int().positive().optional(),
    indentation: z.enum(['spaces', 'tabs']),
    indentSize: z.number().int().positive().max(8),
});
/**
 * Documentation requirements schema
 */
export const DocumentationRequirementsSchema = z.object({
    requirePublicDocs: z.boolean(),
    requireParamDocs: z.boolean(),
    requireReturnDocs: z.boolean(),
    requireThrowsDocs: z.boolean(),
    requireExamples: z.boolean(),
});
/**
 * Implementation output schema
 */
export const ImplementationOutputSchema = z.object({
    code: z.string().min(1, 'Code is required'),
    language: ProgrammingLanguageSchema,
    suggestedFilePath: z.string().optional(),
    boyScoutRuleApplied: z.boolean(),
    legacyImprovements: z.array(z.string()).optional(),
    dependenciesAdded: z.array(z.string()).optional(),
});
// ============================================================================
// Phase 4: Review Schemas
// ============================================================================
/**
 * Self-correction item schema
 */
export const SelfCorrectionItemSchema = z.object({
    constraint: z.string().min(1, 'Constraint is required'),
    passed: z.boolean(),
    details: z.string().optional(),
    correctionApplied: z.string().optional(),
});
/**
 * Duplication item schema
 */
export const DuplicationSchema = z.object({
    description: z.string().min(1, 'Description is required'),
    locations: z.array(z.string()),
    suggestion: z.string().min(1, 'Suggestion is required'),
});
/**
 * DRY check result schema
 */
export const DRYCheckResultSchema = z.object({
    isDRY: z.boolean(),
    duplications: z.array(DuplicationSchema),
});
/**
 * ADR consequences schema
 */
export const ADRConsequencesSchema = z.object({
    positive: z.array(z.string()),
    negative: z.array(z.string()),
    neutral: z.array(z.string()).optional(),
});
/**
 * Architecture Decision Record schema
 */
export const ArchitectureDecisionRecordSchema = z.object({
    title: z.string().min(1, 'ADR title is required'),
    date: z.coerce.date(),
    status: ADRStatusSchema,
    context: z.string().min(1, 'Context is required'),
    decision: z.string().min(1, 'Decision is required'),
    consequences: ADRConsequencesSchema,
    alternativesConsidered: z.array(z.string()),
    relatedADRs: z.array(z.string()).optional(),
});
/**
 * Complete review result schema
 */
export const ReviewResultSchema = z.object({
    selfCorrections: z.array(SelfCorrectionItemSchema),
    dryCheck: DRYCheckResultSchema,
    securityRecheck: z.array(SecurityFindingSchema),
    adr: ArchitectureDecisionRecordSchema.optional(),
    qualityScore: z.number().min(0).max(100),
    recommendations: z.array(z.string()),
});
// ============================================================================
// Workflow Schemas
// ============================================================================
/**
 * Architect workflow state schema
 */
export const ArchitectWorkflowStateSchema = z.object({
    currentPhase: ArchitectPhaseSchema,
    auditResult: AuditResultSchema.optional(),
    strategicPlan: StrategicPlanSchema.optional(),
    implementationOutput: ImplementationOutputSchema.optional(),
    reviewResult: ReviewResultSchema.optional(),
    isComplete: z.boolean(),
    errors: z.array(z.string()),
});
/**
 * Architect configuration schema
 */
export const ArchitectConfigSchema = z.object({
    styleGuide: StyleGuideRulesSchema,
    documentation: DocumentationRequirementsSchema,
    enableSecurityScan: z.boolean(),
    enableCodeSmellDetection: z.boolean(),
    enableDebtAssessment: z.boolean(),
    strictMode: z.boolean(),
    customRules: z.record(z.unknown()).optional(),
});
// ============================================================================
// Pattern Definition Schema
// ============================================================================
/**
 * Pattern definition schema
 */
export const PatternDefinitionSchema = z.object({
    id: DesignPatternSchema,
    name: z.string().min(1, 'Pattern name is required'),
    category: DesignPatternCategorySchema,
    intent: z.string().min(1, 'Intent is required'),
    useCases: z.array(z.string()).min(1, 'At least one use case is required'),
    tradeoffs: z.object({
        pros: z.array(z.string()),
        cons: z.array(z.string()),
    }),
    implementation: z.string().min(1, 'Implementation example is required'),
});
// ============================================================================
// Validation Utilities
// ============================================================================
/**
 * Validation error with detailed information
 */
export class ValidationError extends Error {
    errors;
    path;
    constructor(message, errors, path) {
        super(message);
        this.errors = errors;
        this.path = path;
        this.name = 'ValidationError';
    }
    /**
     * Get formatted error messages
     */
    getFormattedErrors() {
        return this.errors.map((err) => {
            const path = err.path.join('.');
            return path ? `${path}: ${err.message}` : err.message;
        });
    }
}
/**
 * Create a validated instance with error handling
 */
export function validateOrThrow(schema, data, entityName) {
    const result = schema.safeParse(data);
    if (result.success) {
        return result.data;
    }
    throw new ValidationError(`Invalid ${entityName}: ${result.error.errors.map((e) => e.message).join(', ')}`, result.error.errors);
}
/**
 * Create a validated instance with safe result
 */
export function validateSafe(schema, data, entityName) {
    const result = schema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    return {
        success: false,
        error: new ValidationError(`Invalid ${entityName}`, result.error.errors),
    };
}
// ============================================================================
// Pre-bound Validators
// ============================================================================
/**
 * Validators for common types
 */
export const validators = {
    securityFinding: (data) => validateOrThrow(SecurityFindingSchema, data, 'SecurityFinding'),
    codeSmellFinding: (data) => validateOrThrow(CodeSmellFindingSchema, data, 'CodeSmellFinding'),
    technicalDebtItem: (data) => validateOrThrow(TechnicalDebtItemSchema, data, 'TechnicalDebtItem'),
    auditResult: (data) => validateOrThrow(AuditResultSchema, data, 'AuditResult'),
    planningStep: (data) => validateOrThrow(PlanningStepSchema, data, 'PlanningStep'),
    strategicPlan: (data) => validateOrThrow(StrategicPlanSchema, data, 'StrategicPlan'),
    implementationOutput: (data) => validateOrThrow(ImplementationOutputSchema, data, 'ImplementationOutput'),
    reviewResult: (data) => validateOrThrow(ReviewResultSchema, data, 'ReviewResult'),
    architectConfig: (data) => validateOrThrow(ArchitectConfigSchema, data, 'ArchitectConfig'),
    patternDefinition: (data) => validateOrThrow(PatternDefinitionSchema, data, 'PatternDefinition'),
};
/**
 * Safe validators for common types
 */
export const safeValidators = {
    securityFinding: (data) => validateSafe(SecurityFindingSchema, data, 'SecurityFinding'),
    codeSmellFinding: (data) => validateSafe(CodeSmellFindingSchema, data, 'CodeSmellFinding'),
    technicalDebtItem: (data) => validateSafe(TechnicalDebtItemSchema, data, 'TechnicalDebtItem'),
    auditResult: (data) => validateSafe(AuditResultSchema, data, 'AuditResult'),
    planningStep: (data) => validateSafe(PlanningStepSchema, data, 'PlanningStep'),
    strategicPlan: (data) => validateSafe(StrategicPlanSchema, data, 'StrategicPlan'),
    implementationOutput: (data) => validateSafe(ImplementationOutputSchema, data, 'ImplementationOutput'),
    reviewResult: (data) => validateSafe(ReviewResultSchema, data, 'ReviewResult'),
    architectConfig: (data) => validateSafe(ArchitectConfigSchema, data, 'ArchitectConfig'),
    patternDefinition: (data) => validateSafe(PatternDefinitionSchema, data, 'PatternDefinition'),
};
//# sourceMappingURL=schemas.js.map