/**
 * AI Safety Types
 *
 * Optional utilities for content moderation, PII detection, and guardrails.
 * Bring your own detection logic or use simple pattern-based helpers.
 */
export interface SafetyCheck {
    /** Check name */
    name: string;
    /** Whether check passed */
    passed: boolean;
    /** Confidence score (0-1) */
    confidence?: number;
    /** Details about the issue */
    details?: string;
    /** Suggested action */
    action?: 'allow' | 'block' | 'review' | 'redact';
}
export interface SafetyResult {
    /** Overall safety status */
    safe: boolean;
    /** Individual check results */
    checks: SafetyCheck[];
    /** Redacted/cleaned content (if applicable) */
    cleanedContent?: string;
    /** Detected issues */
    issues: string[];
    /** Recommended action */
    action: 'allow' | 'block' | 'review';
}
export interface PIIDetection {
    /** Type of PII detected */
    type: 'email' | 'phone' | 'ssn' | 'credit_card' | 'ip_address' | 'custom';
    /** Matched text */
    match: string;
    /** Position in text */
    start: number;
    end: number;
    /** Confidence (0-1) */
    confidence: number;
}
export interface ContentModerationResult {
    /** Whether content is safe */
    safe: boolean;
    /** Categories detected */
    categories: string[];
    /** Category scores */
    scores: Record<string, number>;
    /** Flagged content */
    flagged: boolean;
}
export interface SafetyGuardrail {
    /** Guardrail name */
    name: string;
    /** Check if content passes guardrail */
    check(content: string, context?: Record<string, any>): Promise<SafetyCheck> | SafetyCheck;
}
//# sourceMappingURL=types.d.ts.map