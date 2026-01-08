/**
 * useSecurityAudit Hook
 *
 * React hook for performing security audits using the architect framework.
 *
 * @packageDocumentation
 */
import { useState, useCallback, useMemo } from 'react';
import { OWASP_VULNERABILITIES, createSecurityFinding, } from '../phases/phase1-audit';
/**
 * Initial audit state
 */
const INITIAL_STATE = {
    isAuditing: false,
    findings: [],
    riskScore: 0,
    lastAuditTime: null,
};
/**
 * Calculate risk score from findings
 */
function calculateSecurityRiskScore(findings) {
    const severityWeights = {
        critical: 30,
        high: 20,
        medium: 10,
        low: 5,
        info: 1,
    };
    let score = 0;
    for (const finding of findings) {
        score += severityWeights[finding.severity];
    }
    return Math.min(100, score);
}
/**
 * Hook for performing security audits
 *
 * @param options - Configuration options
 * @returns Audit state and actions
 *
 * @example
 * ```typescript
 * const audit = useSecurityAudit({
 *   onFindingDetected: (finding) => {
 *     console.log('Security issue found:', finding)
 *   },
 *   onAuditComplete: (findings, riskScore) => {
 *     console.log(`Audit complete. Risk score: ${riskScore}`)
 *   },
 * })
 *
 * // Start an audit
 * audit.startAudit()
 *
 * // Add findings
 * audit.addFinding(
 *   'A03_INJECTION',
 *   'high',
 *   'SQL injection vulnerability in user input',
 *   'Use parameterized queries'
 * )
 *
 * // End audit
 * audit.endAudit()
 * ```
 */
export function useSecurityAudit(options = {}) {
    const { onFindingDetected, onAuditComplete } = options;
    const [state, setState] = useState(INITIAL_STATE);
    /**
     * Start a new audit
     */
    const startAudit = useCallback(() => {
        setState({
            isAuditing: true,
            findings: [],
            riskScore: 0,
            lastAuditTime: null,
        });
    }, []);
    /**
     * End the current audit
     */
    const endAudit = useCallback(() => {
        setState((prev) => {
            const riskScore = calculateSecurityRiskScore(prev.findings);
            onAuditComplete?.(prev.findings, riskScore);
            return {
                ...prev,
                isAuditing: false,
                riskScore,
                lastAuditTime: new Date(),
            };
        });
    }, [onAuditComplete]);
    /**
     * Add a security finding
     */
    const addFinding = useCallback((type, severity, description, recommendation, additionalOptions) => {
        const finding = createSecurityFinding(type, severity, description, recommendation, additionalOptions);
        setState((prev) => ({
            ...prev,
            findings: [...prev.findings, finding],
            riskScore: calculateSecurityRiskScore([...prev.findings, finding]),
        }));
        onFindingDetected?.(finding);
    }, [onFindingDetected]);
    /**
     * Remove a finding by index
     */
    const removeFinding = useCallback((index) => {
        setState((prev) => {
            const newFindings = prev.findings.filter((_, i) => i !== index);
            return {
                ...prev,
                findings: newFindings,
                riskScore: calculateSecurityRiskScore(newFindings),
            };
        });
    }, []);
    /**
     * Clear all findings
     */
    const clearFindings = useCallback(() => {
        setState((prev) => ({
            ...prev,
            findings: [],
            riskScore: 0,
        }));
    }, []);
    /**
     * Get findings by severity
     */
    const getFindingsBySeverity = useCallback((severity) => {
        return state.findings.filter((f) => f.severity === severity);
    }, [state.findings]);
    /**
     * Get findings by type
     */
    const getFindingsByType = useCallback((type) => {
        return state.findings.filter((f) => f.type === type);
    }, [state.findings]);
    /**
     * Get vulnerability info
     */
    const getVulnerabilityInfo = useCallback((type) => OWASP_VULNERABILITIES[type], []);
    /**
     * Check if has critical findings
     */
    const hasCriticalFindings = useMemo(() => state.findings.some((f) => f.severity === 'critical'), [state.findings]);
    /**
     * Calculate severity counts
     */
    const severityCounts = useMemo(() => {
        const counts = {
            critical: 0,
            high: 0,
            medium: 0,
            low: 0,
            info: 0,
        };
        for (const finding of state.findings) {
            counts[finding.severity]++;
        }
        return counts;
    }, [state.findings]);
    return {
        state,
        startAudit,
        endAudit,
        addFinding,
        removeFinding,
        clearFindings,
        getFindingsBySeverity,
        getFindingsByType,
        getVulnerabilityInfo,
        hasCriticalFindings,
        severityCounts,
    };
}
//# sourceMappingURL=use-security-audit.js.map