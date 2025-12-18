/**
 * useSecurityAudit Hook
 *
 * React hook for performing security audits using the architect framework.
 *
 * @packageDocumentation
 */

import { useState, useCallback, useMemo } from 'react'
import type {
  SecurityFinding,
  OWASPVulnerability,
  DebtSeverity,
} from '../types'
import {
  OWASP_VULNERABILITIES,
  createSecurityFinding,
} from '../phases/phase1-audit'

/**
 * Security audit state
 */
export interface SecurityAuditState {
  /** Whether audit is in progress */
  isAuditing: boolean
  /** List of findings */
  findings: SecurityFinding[]
  /** Overall risk score */
  riskScore: number
  /** Last audit timestamp */
  lastAuditTime: Date | null
}

/**
 * Options for the security audit hook
 */
export interface UseSecurityAuditOptions {
  /** Callback when a finding is detected */
  onFindingDetected?: (finding: SecurityFinding) => void
  /** Callback when audit is complete */
  onAuditComplete?: (findings: SecurityFinding[], riskScore: number) => void
}

/**
 * Return type for the security audit hook
 */
export interface UseSecurityAuditReturn {
  /** Current audit state */
  state: SecurityAuditState
  /** Start a new audit */
  startAudit: () => void
  /** End the current audit */
  endAudit: () => void
  /** Add a security finding */
  addFinding: (
    type: OWASPVulnerability,
    severity: DebtSeverity,
    description: string,
    recommendation: string,
    options?: {
      location?: string
      cweId?: string
      cvssScore?: number
    }
  ) => void
  /** Remove a finding by index */
  removeFinding: (index: number) => void
  /** Clear all findings */
  clearFindings: () => void
  /** Get findings by severity */
  getFindingsBySeverity: (severity: DebtSeverity) => SecurityFinding[]
  /** Get findings by type */
  getFindingsByType: (type: OWASPVulnerability) => SecurityFinding[]
  /** Get OWASP vulnerability info */
  getVulnerabilityInfo: (type: OWASPVulnerability) => (typeof OWASP_VULNERABILITIES)[OWASPVulnerability]
  /** Check if has critical findings */
  hasCriticalFindings: boolean
  /** Severity counts */
  severityCounts: Record<DebtSeverity, number>
}

/**
 * Initial audit state
 */
const INITIAL_STATE: SecurityAuditState = {
  isAuditing: false,
  findings: [],
  riskScore: 0,
  lastAuditTime: null,
}

/**
 * Calculate risk score from findings
 */
function calculateSecurityRiskScore(findings: SecurityFinding[]): number {
  const severityWeights: Record<DebtSeverity, number> = {
    critical: 30,
    high: 20,
    medium: 10,
    low: 5,
    info: 1,
  }

  let score = 0
  for (const finding of findings) {
    score += severityWeights[finding.severity]
  }

  return Math.min(100, score)
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
export function useSecurityAudit(
  options: UseSecurityAuditOptions = {}
): UseSecurityAuditReturn {
  const { onFindingDetected, onAuditComplete } = options

  const [state, setState] = useState<SecurityAuditState>(INITIAL_STATE)

  /**
   * Start a new audit
   */
  const startAudit = useCallback(() => {
    setState({
      isAuditing: true,
      findings: [],
      riskScore: 0,
      lastAuditTime: null,
    })
  }, [])

  /**
   * End the current audit
   */
  const endAudit = useCallback(() => {
    setState((prev) => {
      const riskScore = calculateSecurityRiskScore(prev.findings)
      onAuditComplete?.(prev.findings, riskScore)
      return {
        ...prev,
        isAuditing: false,
        riskScore,
        lastAuditTime: new Date(),
      }
    })
  }, [onAuditComplete])

  /**
   * Add a security finding
   */
  const addFinding = useCallback(
    (
      type: OWASPVulnerability,
      severity: DebtSeverity,
      description: string,
      recommendation: string,
      additionalOptions?: {
        location?: string
        cweId?: string
        cvssScore?: number
      }
    ) => {
      const finding = createSecurityFinding(
        type,
        severity,
        description,
        recommendation,
        additionalOptions
      )

      setState((prev) => ({
        ...prev,
        findings: [...prev.findings, finding],
        riskScore: calculateSecurityRiskScore([...prev.findings, finding]),
      }))

      onFindingDetected?.(finding)
    },
    [onFindingDetected]
  )

  /**
   * Remove a finding by index
   */
  const removeFinding = useCallback((index: number) => {
    setState((prev) => {
      const newFindings = prev.findings.filter((_, i) => i !== index)
      return {
        ...prev,
        findings: newFindings,
        riskScore: calculateSecurityRiskScore(newFindings),
      }
    })
  }, [])

  /**
   * Clear all findings
   */
  const clearFindings = useCallback(() => {
    setState((prev) => ({
      ...prev,
      findings: [],
      riskScore: 0,
    }))
  }, [])

  /**
   * Get findings by severity
   */
  const getFindingsBySeverity = useCallback(
    (severity: DebtSeverity) => {
      return state.findings.filter((f) => f.severity === severity)
    },
    [state.findings]
  )

  /**
   * Get findings by type
   */
  const getFindingsByType = useCallback(
    (type: OWASPVulnerability) => {
      return state.findings.filter((f) => f.type === type)
    },
    [state.findings]
  )

  /**
   * Get vulnerability info
   */
  const getVulnerabilityInfo = useCallback(
    (type: OWASPVulnerability) => OWASP_VULNERABILITIES[type],
    []
  )

  /**
   * Check if has critical findings
   */
  const hasCriticalFindings = useMemo(
    () => state.findings.some((f) => f.severity === 'critical'),
    [state.findings]
  )

  /**
   * Calculate severity counts
   */
  const severityCounts = useMemo(() => {
    const counts: Record<DebtSeverity, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0,
    }

    for (const finding of state.findings) {
      counts[finding.severity]++
    }

    return counts
  }, [state.findings])

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
  }
}
