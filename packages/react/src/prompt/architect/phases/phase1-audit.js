/**
 * Phase 1: Analysis & Audit
 *
 * Utilities for the "Auditor" phase - context gathering, security scanning,
 * code smell detection, and technical debt assessment.
 *
 * @packageDocumentation
 */
// ============================================================================
// OWASP Top 10 Security Patterns
// ============================================================================
/**
 * OWASP vulnerability descriptions and detection hints
 */
export const OWASP_VULNERABILITIES = {
    A01_BROKEN_ACCESS_CONTROL: {
        name: 'Broken Access Control',
        description: 'Restrictions on what authenticated users are allowed to do are not properly enforced',
        patterns: [
            'Missing authorization checks',
            'Direct object references without validation',
            'CORS misconfiguration',
            'JWT tokens without expiration',
            'Elevation of privilege',
        ],
        recommendations: [
            'Implement proper access control checks',
            'Use role-based access control (RBAC)',
            'Deny by default',
            'Log access control failures',
            'Rate limit API access',
        ],
    },
    A02_CRYPTOGRAPHIC_FAILURES: {
        name: 'Cryptographic Failures',
        description: 'Failures related to cryptography that expose sensitive data',
        patterns: [
            'Weak or deprecated algorithms (MD5, SHA1, DES)',
            'Hardcoded encryption keys',
            'Missing encryption for sensitive data',
            'Improper certificate validation',
            'Using Math.random() for security',
        ],
        recommendations: [
            'Use strong algorithms (AES-256, SHA-256+)',
            'Store keys securely (HSM, KMS)',
            'Encrypt data at rest and in transit',
            'Use crypto.getRandomValues() for security',
            'Implement proper key rotation',
        ],
    },
    A03_INJECTION: {
        name: 'Injection',
        description: 'User-supplied data is not validated, filtered, or sanitized by the application',
        patterns: [
            'String concatenation in SQL queries',
            'eval() or Function() with user input',
            'dangerouslySetInnerHTML without sanitization',
            'Command execution with user input',
            'LDAP/XPath injection',
        ],
        recommendations: [
            'Use parameterized queries',
            'Validate and sanitize all inputs',
            'Use ORM/ODM for database queries',
            'Escape output based on context',
            'Implement Content Security Policy',
        ],
    },
    A04_INSECURE_DESIGN: {
        name: 'Insecure Design',
        description: 'Missing or ineffective control design. Different from implementation bugs',
        patterns: [
            'Missing rate limiting',
            'No defense in depth',
            'Trust boundaries not defined',
            'Missing input validation at boundaries',
            'No secure development lifecycle',
        ],
        recommendations: [
            'Use threat modeling',
            'Implement secure design patterns',
            'Add defense in depth',
            'Define clear trust boundaries',
            'Use security user stories',
        ],
    },
    A05_SECURITY_MISCONFIGURATION: {
        name: 'Security Misconfiguration',
        description: 'Missing or incorrect security hardening across application stack',
        patterns: [
            'Default credentials',
            'Unnecessary features enabled',
            'Error messages exposing stack traces',
            'Missing security headers',
            'Outdated software',
        ],
        recommendations: [
            'Harden all environments',
            'Remove unnecessary features',
            'Implement proper error handling',
            'Add security headers',
            'Regular security updates',
        ],
    },
    A06_VULNERABLE_COMPONENTS: {
        name: 'Vulnerable and Outdated Components',
        description: 'Using components with known vulnerabilities',
        patterns: [
            'Outdated dependencies',
            'Unmaintained libraries',
            'Known CVEs in dependencies',
            'Missing dependency scanning',
            'Unused dependencies',
        ],
        recommendations: [
            'Regular dependency updates',
            'Use automated scanning (Snyk, npm audit)',
            'Remove unused dependencies',
            'Subscribe to security advisories',
            'Use dependency pinning',
        ],
    },
    A07_AUTH_FAILURES: {
        name: 'Identification and Authentication Failures',
        description: 'Weaknesses in authentication and session management',
        patterns: [
            'Weak password requirements',
            'Missing multi-factor authentication',
            'Session tokens in URL',
            'Missing brute force protection',
            'Insecure password storage',
        ],
        recommendations: [
            'Implement strong password policies',
            'Add multi-factor authentication',
            'Use secure session management',
            'Implement account lockout',
            'Hash passwords with bcrypt/argon2',
        ],
    },
    A08_DATA_INTEGRITY_FAILURES: {
        name: 'Software and Data Integrity Failures',
        description: 'Code and infrastructure that does not protect against integrity violations',
        patterns: [
            'Insecure deserialization',
            'Using untrusted CDNs without SRI',
            'Auto-update without verification',
            'Unsigned code deployment',
            'CI/CD pipeline vulnerabilities',
        ],
        recommendations: [
            'Use Subresource Integrity (SRI)',
            'Verify digital signatures',
            'Secure CI/CD pipelines',
            'Use package-lock files',
            'Review code before merging',
        ],
    },
    A09_LOGGING_FAILURES: {
        name: 'Security Logging and Monitoring Failures',
        description: 'Insufficient logging, detection, monitoring, and active response',
        patterns: [
            'Login failures not logged',
            'Sensitive data in logs',
            'No alerting for attacks',
            'Logs not protected',
            'Missing audit trail',
        ],
        recommendations: [
            'Log all authentication events',
            'Sanitize log data',
            'Implement real-time alerting',
            'Secure and backup logs',
            'Create incident response plan',
        ],
    },
    A10_SSRF: {
        name: 'Server-Side Request Forgery (SSRF)',
        description: 'Application fetches remote resources without validating user-supplied URL',
        patterns: [
            'URL fetching from user input',
            'No URL whitelist',
            'Internal network access',
            'Cloud metadata endpoint access',
            'Redirect following without validation',
        ],
        recommendations: [
            'Validate and sanitize URLs',
            'Use URL whitelists',
            'Block internal network ranges',
            'Block cloud metadata endpoints',
            'Disable HTTP redirects',
        ],
    },
};
/**
 * Code smell descriptions and detection hints
 */
export const CODE_SMELL_PATTERNS = {
    HIGH_CYCLOMATIC_COMPLEXITY: {
        name: 'High Cyclomatic Complexity',
        description: 'Too many decision points in a single function',
        indicators: [
            'More than 10 decision points',
            'Deeply nested conditionals',
            'Multiple return statements',
            'Complex boolean expressions',
        ],
        refactoring: 'Extract Method - break into smaller functions',
    },
    HIGH_COGNITIVE_COMPLEXITY: {
        name: 'High Cognitive Complexity',
        description: 'Code that is hard to understand',
        indicators: [
            'Deep nesting (>3 levels)',
            'Multiple loops and conditions',
            'Breaks in linear flow',
            'Recursion within loops',
        ],
        refactoring: 'Guard Clauses - flatten nesting with early returns',
    },
    GOD_OBJECT: {
        name: 'God Object',
        description: 'Class that knows too much or does too much',
        indicators: [
            'More than 500 lines',
            'More than 20 methods',
            'High coupling to other classes',
            'Multiple responsibilities',
        ],
        refactoring: 'Extract Class - split responsibilities (SRP)',
    },
    LONG_METHOD: {
        name: 'Long Method',
        description: 'Method that is too long to understand easily',
        indicators: [
            'More than 20 lines',
            'Multiple abstraction levels',
            'Comments explaining sections',
            'Multiple indentation levels',
        ],
        refactoring: 'Extract Method - create well-named smaller methods',
    },
    LONG_PARAMETER_LIST: {
        name: 'Long Parameter List',
        description: 'Function with too many parameters',
        indicators: [
            'More than 4 parameters',
            'Related parameters often passed together',
            'Boolean flags as parameters',
            'Many optional parameters',
        ],
        refactoring: 'Introduce Parameter Object',
    },
    DUPLICATE_CODE: {
        name: 'Duplicate Code',
        description: 'Same code structure in multiple places',
        indicators: [
            'Copy-pasted code blocks',
            'Similar methods in sibling classes',
            'Conditionals with similar branches',
            'Same expressions repeated',
        ],
        refactoring: 'Extract Method/Class - centralize common logic',
    },
    DEAD_CODE: {
        name: 'Dead Code',
        description: 'Code that is never executed',
        indicators: [
            'Unreachable code after return',
            'Unused variables/functions',
            'Commented-out code',
            'Impossible conditions',
        ],
        refactoring: 'Remove - delete the dead code',
    },
    FEATURE_ENVY: {
        name: 'Feature Envy',
        description: 'Method that uses more features of another class',
        indicators: [
            'Frequent calls to another object',
            'Accessing many fields of another class',
            'Utility methods on wrong class',
            'Chain of method calls',
        ],
        refactoring: 'Move Method - relocate to appropriate class',
    },
    DATA_CLUMPS: {
        name: 'Data Clumps',
        description: 'Groups of data that appear together frequently',
        indicators: [
            'Same parameters in multiple methods',
            'Parallel arrays',
            'Objects with many fields passed together',
            'Related fields in classes',
        ],
        refactoring: 'Extract Class - create a class for the clump',
    },
    PRIMITIVE_OBSESSION: {
        name: 'Primitive Obsession',
        description: 'Over-use of primitives instead of small objects',
        indicators: [
            'Strings used for complex data',
            'Arrays instead of objects',
            'Type codes instead of classes',
            'Money as number instead of object',
        ],
        refactoring: 'Replace Primitive with Object',
    },
    SWITCH_STATEMENTS: {
        name: 'Switch Statements',
        description: 'Complex switch/case or if-else chains',
        indicators: [
            'Type codes triggering behavior',
            'Duplicated switches',
            'Long case blocks',
            'Missing default case',
        ],
        refactoring: 'Replace Conditional with Polymorphism',
    },
    PARALLEL_INHERITANCE: {
        name: 'Parallel Inheritance Hierarchies',
        description: 'Creating a subclass requires creating another in parallel',
        indicators: [
            'Similar class hierarchies',
            'Prefix/suffix naming patterns',
            'One-to-one mapping between hierarchies',
        ],
        refactoring: 'Move Method/Field - collapse hierarchies',
    },
    LAZY_CLASS: {
        name: 'Lazy Class',
        description: 'Class that does not do enough to justify its existence',
        indicators: [
            'Very few methods',
            'Mostly delegation',
            'No unique responsibility',
            'Created for future use',
        ],
        refactoring: 'Inline Class - merge with another class',
    },
    SPECULATIVE_GENERALITY: {
        name: 'Speculative Generality',
        description: 'Code created "just in case" it is needed',
        indicators: [
            'Unused parameters',
            'Abstract classes with one subclass',
            'Unused hooks',
            'Premature optimization',
        ],
        refactoring: 'Remove - YAGNI (You Ain\'t Gonna Need It)',
    },
    TEMPORARY_FIELD: {
        name: 'Temporary Field',
        description: 'Fields only set/used in certain circumstances',
        indicators: [
            'Fields sometimes null',
            'Complex null checks',
            'Fields for specific operations only',
        ],
        refactoring: 'Extract Class - for the temporary behavior',
    },
    MESSAGE_CHAINS: {
        name: 'Message Chains',
        description: 'Long chains of method calls',
        indicators: [
            'a.getB().getC().getD()',
            'Multiple dots in expressions',
            'Train wreck code',
            'Violates Law of Demeter',
        ],
        refactoring: 'Hide Delegate - introduce intermediary methods',
    },
    MIDDLE_MAN: {
        name: 'Middle Man',
        description: 'Class that only delegates to another class',
        indicators: [
            'Methods that just call another method',
            'No added value',
            'Pure delegation',
        ],
        refactoring: 'Remove Middle Man - talk directly to delegate',
    },
    INAPPROPRIATE_INTIMACY: {
        name: 'Inappropriate Intimacy',
        description: 'Classes that are too coupled to each other',
        indicators: [
            'Accessing private fields',
            'Bidirectional associations',
            'Subclasses knowing too much about parents',
        ],
        refactoring: 'Move Method/Field - reduce coupling',
    },
    ALTERNATIVE_CLASSES: {
        name: 'Alternative Classes with Different Interfaces',
        description: 'Similar classes with different method signatures',
        indicators: [
            'Same functionality, different names',
            'Parallel implementations',
            'Missing interface extraction',
        ],
        refactoring: 'Rename Method - unify interfaces',
    },
    INCOMPLETE_LIBRARY: {
        name: 'Incomplete Library Class',
        description: 'Library class missing needed functionality',
        indicators: [
            'Utility classes wrapping libraries',
            'Extending library classes',
            'Monkey patching',
        ],
        refactoring: 'Introduce Foreign Method or Local Extension',
    },
    DATA_CLASS: {
        name: 'Data Class',
        description: 'Class with only fields and getters/setters',
        indicators: [
            'No behavior methods',
            'Only accessors',
            'Data manipulated elsewhere',
        ],
        refactoring: 'Move Method - add behavior to the data class',
    },
    REFUSED_BEQUEST: {
        name: 'Refused Bequest',
        description: 'Subclass that does not use inherited members',
        indicators: [
            'Overriding to do nothing',
            'Throwing UnsupportedOperationException',
            'Unused inherited methods',
        ],
        refactoring: 'Replace Inheritance with Delegation',
    },
    COMMENTS: {
        name: 'Comments (as a smell)',
        description: 'Comments used to explain bad code instead of fixing it',
        indicators: [
            'Long explanatory comments',
            'Comments explaining what code does',
            'TODO comments for obvious fixes',
            'Commented-out code',
        ],
        refactoring: 'Extract Method - make code self-documenting',
    },
};
// ============================================================================
// Audit Functions
// ============================================================================
/**
 * Create a context requirement
 */
export function createContextRequirement(requirement, reason, priority = 'recommended') {
    return {
        requirement,
        reason,
        priority,
        fulfilled: false,
    };
}
/**
 * Create a security finding
 */
export function createSecurityFinding(type, severity, description, recommendation, options) {
    return {
        type,
        severity,
        description,
        recommendation,
        ...options,
    };
}
/**
 * Create a code smell finding
 */
export function createCodeSmellFinding(type, severity, description, refactoringSuggestion, options) {
    return {
        type,
        severity,
        description,
        refactoringSuggestion,
        ...options,
    };
}
/**
 * Create a technical debt item
 */
export function createTechnicalDebtItem(type, severity, description, impact, remediation, interestRate = 'medium') {
    return {
        type,
        severity,
        description,
        impact,
        interestRate,
        remediation,
    };
}
/**
 * Calculate risk score from audit findings
 */
export function calculateRiskScore(securityFindings, codeSmells, technicalDebt) {
    const severityWeights = {
        critical: 25,
        high: 15,
        medium: 8,
        low: 3,
        info: 1,
    };
    let score = 0;
    // Security findings have highest weight
    for (const finding of securityFindings) {
        score += severityWeights[finding.severity] * 2;
    }
    // Code smells have medium weight
    for (const smell of codeSmells) {
        score += severityWeights[smell.severity];
    }
    // Technical debt has standard weight
    for (const debt of technicalDebt) {
        score += severityWeights[debt.severity];
    }
    // Normalize to 0-100
    return Math.min(100, score);
}
/**
 * Create a complete audit result
 */
export function createAuditResult(params) {
    const contextRequirements = params.contextRequirements ?? [];
    const securityFindings = params.securityFindings ?? [];
    const codeSmells = params.codeSmells ?? [];
    const technicalDebt = params.technicalDebt ?? [];
    const riskScore = calculateRiskScore(securityFindings, codeSmells, technicalDebt);
    const summary = params.summary ??
        generateAuditSummary(securityFindings, codeSmells, technicalDebt, riskScore);
    return {
        contextRequirements,
        securityFindings,
        codeSmells,
        technicalDebt,
        riskScore,
        summary,
        timestamp: new Date(),
    };
}
/**
 * Generate a summary of audit findings
 */
function generateAuditSummary(securityFindings, codeSmells, technicalDebt, riskScore) {
    const parts = [];
    // Risk level
    let riskLevel;
    if (riskScore >= 75) {
        riskLevel = 'CRITICAL';
    }
    else if (riskScore >= 50) {
        riskLevel = 'HIGH';
    }
    else if (riskScore >= 25) {
        riskLevel = 'MEDIUM';
    }
    else {
        riskLevel = 'LOW';
    }
    parts.push(`Risk Level: ${riskLevel} (Score: ${riskScore}/100)`);
    // Security findings summary
    if (securityFindings.length > 0) {
        const critical = securityFindings.filter((f) => f.severity === 'critical').length;
        const high = securityFindings.filter((f) => f.severity === 'high').length;
        parts.push(`Security: ${securityFindings.length} findings (${critical} critical, ${high} high)`);
    }
    // Code smells summary
    if (codeSmells.length > 0) {
        parts.push(`Code Smells: ${codeSmells.length} detected`);
    }
    // Technical debt summary
    if (technicalDebt.length > 0) {
        parts.push(`Technical Debt: ${technicalDebt.length} items identified`);
    }
    return parts.join(' | ');
}
/**
 * Format audit result as markdown
 */
export function formatAuditResultAsMarkdown(result) {
    const lines = [];
    lines.push('# Audit Report');
    lines.push('');
    lines.push(`**Date:** ${result.timestamp.toISOString()}`);
    lines.push(`**Risk Score:** ${result.riskScore}/100`);
    lines.push('');
    lines.push(`## Summary`);
    lines.push(result.summary);
    lines.push('');
    // Context requirements
    if (result.contextRequirements.length > 0) {
        lines.push('## Missing Context');
        lines.push('');
        for (const req of result.contextRequirements) {
            const status = req.fulfilled ? '✅' : '❌';
            lines.push(`- ${status} **${req.requirement}** (${req.priority})`);
            lines.push(`  - Reason: ${req.reason}`);
        }
        lines.push('');
    }
    // Security findings
    if (result.securityFindings.length > 0) {
        lines.push('## Security Findings');
        lines.push('');
        lines.push('| Severity | Type | Description | Recommendation |');
        lines.push('|----------|------|-------------|----------------|');
        for (const finding of result.securityFindings) {
            lines.push(`| ${finding.severity.toUpperCase()} | ${finding.type} | ${finding.description} | ${finding.recommendation} |`);
        }
        lines.push('');
    }
    // Code smells
    if (result.codeSmells.length > 0) {
        lines.push('## Code Smells');
        lines.push('');
        for (const smell of result.codeSmells) {
            lines.push(`### ${CODE_SMELL_PATTERNS[smell.type].name}`);
            lines.push(`- **Severity:** ${smell.severity}`);
            lines.push(`- **Description:** ${smell.description}`);
            lines.push(`- **Suggestion:** ${smell.refactoringSuggestion}`);
            if (smell.location) {
                lines.push(`- **Location:** ${smell.location}`);
            }
            lines.push('');
        }
    }
    // Technical debt
    if (result.technicalDebt.length > 0) {
        lines.push('## Technical Debt');
        lines.push('');
        for (const debt of result.technicalDebt) {
            lines.push(`### ${debt.type}`);
            lines.push(`- **Severity:** ${debt.severity}`);
            lines.push(`- **Interest Rate:** ${debt.interestRate}`);
            lines.push(`- **Description:** ${debt.description}`);
            lines.push(`- **Impact:** ${debt.impact}`);
            lines.push(`- **Remediation:** ${debt.remediation}`);
            lines.push('');
        }
    }
    return lines.join('\n');
}
/**
 * Common context questions to ask
 */
export const COMMON_CONTEXT_QUESTIONS = [
    createContextRequirement('Project dependencies and versions', 'To check for known vulnerabilities and compatibility', 'required'),
    createContextRequirement('Target environment (browser, Node.js, etc.)', 'To ensure code works in the target runtime', 'required'),
    createContextRequirement('Existing test coverage', 'To understand what testing is needed', 'recommended'),
    createContextRequirement('Authentication/authorization requirements', 'To implement proper security controls', 'recommended'),
    createContextRequirement('Performance requirements', 'To make appropriate optimization decisions', 'optional'),
    createContextRequirement('Coding style guide in use', 'To maintain consistency with existing code', 'recommended'),
];
//# sourceMappingURL=phase1-audit.js.map