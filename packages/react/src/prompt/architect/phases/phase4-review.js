/**
 * Phase 4: Review & Reflection
 *
 * Utilities for the "Mentor" phase - self-correction, DRY verification,
 * security re-verification, and ADR (Architecture Decision Record) generation.
 *
 * @packageDocumentation
 */
// ============================================================================
// Self-Correction Checklist
// ============================================================================
/**
 * Standard constraint checks for self-correction
 */
export const STANDARD_CONSTRAINTS = [
    'All required functionality implemented',
    'Code is DRY (no duplication)',
    'Single Responsibility Principle followed',
    'Error handling is comprehensive',
    'Edge cases are handled',
    'Types are strict and complete',
    'No hardcoded secrets or credentials',
    'Input validation present',
    'Output properly sanitized/escaped',
    'Tests are defined',
    'Documentation complete',
    'Follows style guide',
];
/**
 * Create a self-correction item
 */
export function createSelfCorrectionItem(constraint, passed, details, correctionApplied) {
    return {
        constraint,
        passed,
        details,
        correctionApplied,
    };
}
/**
 * Generate a self-correction checklist result
 */
export function generateSelfCorrectionChecklist(checks) {
    return checks.map((check) => createSelfCorrectionItem(check.constraint, check.passed, check.details, check.correctionApplied));
}
/**
 * Create default self-correction checklist (all passed)
 */
export function createDefaultSelfCorrection() {
    return STANDARD_CONSTRAINTS.map((constraint) => ({
        constraint,
        passed: true,
        details: undefined,
        correctionApplied: undefined,
    }));
}
/**
 * Create a DRY check result
 */
export function createDRYCheckResult(params) {
    return {
        isDRY: params.isDRY,
        duplications: params.duplications ?? [],
    };
}
/**
 * Common DRY violation patterns to check for
 */
export const DRY_VIOLATION_PATTERNS = {
    DUPLICATE_CODE_BLOCK: {
        description: 'Identical code blocks appearing in multiple places',
        suggestion: 'Extract into a shared function or method',
    },
    DUPLICATE_LOGIC: {
        description: 'Same logical flow with different variables',
        suggestion: 'Create a parameterized function',
    },
    DUPLICATE_DATA: {
        description: 'Same data structure defined multiple times',
        suggestion: 'Create a shared constant or configuration',
    },
    COPY_PASTE_DETECTION: {
        description: 'Near-identical code with minor variations',
        suggestion: 'Use template method pattern or higher-order functions',
    },
    SIMILAR_METHODS: {
        description: 'Methods with similar signatures doing related things',
        suggestion: 'Consider combining or using strategy pattern',
    },
};
/**
 * Generate DRY check suggestions
 */
export function generateDRYSuggestions(violations) {
    return violations.map((type) => ({
        type,
        description: DRY_VIOLATION_PATTERNS[type].description,
        suggestion: DRY_VIOLATION_PATTERNS[type].suggestion,
    }));
}
// ============================================================================
// Architecture Decision Record (ADR)
// ============================================================================
/**
 * ADR templates
 */
export const ADR_TEMPLATE = `# ADR-{number}: {title}

## Status
{status}

## Date
{date}

## Context
{context}

## Decision
{decision}

## Consequences

### Positive
{positive_consequences}

### Negative
{negative_consequences}

### Neutral
{neutral_consequences}

## Alternatives Considered
{alternatives}

## Related ADRs
{related_adrs}
`;
/**
 * Create an Architecture Decision Record
 */
export function createADR(params) {
    return {
        title: params.title,
        date: new Date(),
        status: params.status ?? 'proposed',
        context: params.context,
        decision: params.decision,
        consequences: {
            positive: params.consequences.positive,
            negative: params.consequences.negative,
            neutral: params.consequences.neutral,
        },
        alternativesConsidered: params.alternativesConsidered ?? [],
        relatedADRs: params.relatedADRs,
    };
}
/**
 * Format ADR as markdown
 */
export function formatADRAsMarkdown(adr, adrNumber) {
    const lines = [];
    lines.push(`# ADR-${adrNumber ?? 'XXX'}: ${adr.title}`);
    lines.push('');
    lines.push(`## Status`);
    lines.push(adr.status.charAt(0).toUpperCase() + adr.status.slice(1));
    lines.push('');
    lines.push(`## Date`);
    lines.push(adr.date.toISOString().split('T')[0]);
    lines.push('');
    lines.push(`## Context`);
    lines.push(adr.context);
    lines.push('');
    lines.push(`## Decision`);
    lines.push(adr.decision);
    lines.push('');
    lines.push(`## Consequences`);
    lines.push('');
    lines.push(`### Positive`);
    for (const pos of adr.consequences.positive) {
        lines.push(`- ${pos}`);
    }
    lines.push('');
    lines.push(`### Negative`);
    for (const neg of adr.consequences.negative) {
        lines.push(`- ${neg}`);
    }
    if (adr.consequences.neutral && adr.consequences.neutral.length > 0) {
        lines.push('');
        lines.push(`### Neutral`);
        for (const neu of adr.consequences.neutral) {
            lines.push(`- ${neu}`);
        }
    }
    lines.push('');
    if (adr.alternativesConsidered.length > 0) {
        lines.push(`## Alternatives Considered`);
        for (const alt of adr.alternativesConsidered) {
            lines.push(`- ${alt}`);
        }
        lines.push('');
    }
    if (adr.relatedADRs && adr.relatedADRs.length > 0) {
        lines.push(`## Related ADRs`);
        for (const related of adr.relatedADRs) {
            lines.push(`- ${related}`);
        }
        lines.push('');
    }
    return lines.join('\n');
}
/**
 * Common ADR categories
 */
export const ADR_CATEGORIES = {
    ARCHITECTURE: 'Architecture & Structure',
    TECHNOLOGY: 'Technology Selection',
    PATTERNS: 'Design Patterns',
    SECURITY: 'Security & Compliance',
    PERFORMANCE: 'Performance & Scalability',
    DATA: 'Data Management',
    INTEGRATION: 'Integration & APIs',
    TESTING: 'Testing Strategy',
    DEPLOYMENT: 'Deployment & Operations',
};
// ============================================================================
// Review Result
// ============================================================================
/**
 * Calculate quality score from review results
 */
export function calculateQualityScore(selfCorrections, dryCheck, securityRecheck) {
    let score = 100;
    // Deduct for failed self-corrections
    const failedChecks = selfCorrections.filter((c) => !c.passed).length;
    score -= failedChecks * 5;
    // Deduct for DRY violations
    if (!dryCheck.isDRY) {
        score -= dryCheck.duplications.length * 3;
    }
    // Deduct for security findings
    for (const finding of securityRecheck) {
        switch (finding.severity) {
            case 'critical':
                score -= 25;
                break;
            case 'high':
                score -= 15;
                break;
            case 'medium':
                score -= 8;
                break;
            case 'low':
                score -= 3;
                break;
            case 'info':
                score -= 1;
                break;
        }
    }
    return Math.max(0, Math.min(100, score));
}
/**
 * Generate recommendations based on review results
 */
export function generateRecommendations(selfCorrections, dryCheck, securityRecheck) {
    const recommendations = [];
    // Add recommendations for failed checks
    for (const check of selfCorrections) {
        if (!check.passed) {
            recommendations.push(`Address constraint: ${check.constraint}`);
        }
    }
    // Add DRY recommendations
    if (!dryCheck.isDRY) {
        for (const dup of dryCheck.duplications) {
            recommendations.push(`DRY violation: ${dup.suggestion}`);
        }
    }
    // Add security recommendations
    for (const finding of securityRecheck) {
        if (finding.severity === 'critical' || finding.severity === 'high') {
            recommendations.push(`SECURITY: ${finding.recommendation}`);
        }
    }
    return recommendations;
}
/**
 * Create a complete review result
 */
export function createReviewResult(params) {
    const qualityScore = calculateQualityScore(params.selfCorrections, params.dryCheck, params.securityRecheck);
    const recommendations = generateRecommendations(params.selfCorrections, params.dryCheck, params.securityRecheck);
    return {
        selfCorrections: params.selfCorrections,
        dryCheck: params.dryCheck,
        securityRecheck: params.securityRecheck,
        adr: params.adr,
        qualityScore,
        recommendations,
    };
}
/**
 * Format review result as markdown
 */
export function formatReviewResultAsMarkdown(result) {
    const lines = [];
    lines.push('# Code Review Report');
    lines.push('');
    lines.push(`**Quality Score:** ${result.qualityScore}/100`);
    lines.push('');
    // Self-correction checklist
    lines.push('## Self-Correction Checklist');
    lines.push('');
    for (const check of result.selfCorrections) {
        const status = check.passed ? '✅' : '❌';
        lines.push(`- ${status} ${check.constraint}`);
        if (!check.passed && check.details) {
            lines.push(`  - Issue: ${check.details}`);
        }
        if (check.correctionApplied) {
            lines.push(`  - Correction: ${check.correctionApplied}`);
        }
    }
    lines.push('');
    // DRY check
    lines.push('## DRY Analysis');
    lines.push('');
    if (result.dryCheck.isDRY) {
        lines.push('✅ Code follows DRY principle - no significant duplication detected.');
    }
    else {
        lines.push('❌ DRY violations found:');
        lines.push('');
        for (const dup of result.dryCheck.duplications) {
            lines.push(`### ${dup.description}`);
            lines.push(`**Locations:** ${dup.locations.join(', ')}`);
            lines.push(`**Suggestion:** ${dup.suggestion}`);
            lines.push('');
        }
    }
    lines.push('');
    // Security re-check
    lines.push('## Security Re-verification');
    lines.push('');
    if (result.securityRecheck.length === 0) {
        lines.push('✅ No security issues detected in generated code.');
    }
    else {
        lines.push('⚠️ Security findings:');
        lines.push('');
        lines.push('| Severity | Type | Description | Recommendation |');
        lines.push('|----------|------|-------------|----------------|');
        for (const finding of result.securityRecheck) {
            lines.push(`| ${finding.severity.toUpperCase()} | ${finding.type} | ${finding.description} | ${finding.recommendation} |`);
        }
    }
    lines.push('');
    // Recommendations
    if (result.recommendations.length > 0) {
        lines.push('## Recommendations');
        lines.push('');
        for (const rec of result.recommendations) {
            lines.push(`- ${rec}`);
        }
        lines.push('');
    }
    // ADR
    if (result.adr) {
        lines.push('## Architecture Decision Record');
        lines.push('');
        lines.push(formatADRAsMarkdown(result.adr));
    }
    return lines.join('\n');
}
/**
 * Generate a REVIEW block template
 */
export function generateReviewBlockTemplate() {
    return `<REVIEW>
## Self-Correction Checklist
- [ ] All required functionality implemented
- [ ] Code is DRY (no duplication)
- [ ] Single Responsibility Principle followed
- [ ] Error handling is comprehensive
- [ ] Edge cases are handled
- [ ] Types are strict and complete

## DRY Analysis
[Analysis of code duplication]

## Security Re-verification
[Security findings in generated code]

## Quality Score
[Score]/100

## Recommendations
- [Recommendation 1]
- [Recommendation 2]
</REVIEW>`;
}
/**
 * Determine if ADR is needed based on decision type
 */
export function isADRNeeded(decisionType) {
    const adrTriggers = [
        'new technology',
        'new framework',
        'architecture change',
        'database selection',
        'api design',
        'authentication',
        'authorization',
        'caching strategy',
        'deployment strategy',
        'testing approach',
        'dependency addition',
        'pattern selection',
        'breaking change',
    ];
    const normalizedType = decisionType.toLowerCase();
    return adrTriggers.some((trigger) => normalizedType.includes(trigger));
}
// ============================================================================
// Phases Index Export
// ============================================================================
export { createSecurityFinding, formatAuditResultAsMarkdown } from './phase1-audit';
//# sourceMappingURL=phase4-review.js.map