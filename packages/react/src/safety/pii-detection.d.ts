/**
 * PII Detection Utilities
 *
 * Simple pattern-based PII detection. For production, integrate with
 * services like Google DLP, Microsoft Presidio, or AWS Comprehend.
 */
import type { PIIDetection, SafetyCheck, SafetyGuardrail } from './types';
export declare class PIIDetector {
    private patterns;
    /**
     * Detect PII in text
     */
    detect(text: string): PIIDetection[];
    /**
     * Redact PII from text
     */
    redact(text: string, replacement?: string): string;
    /**
     * Check if text contains PII
     */
    hasPII(text: string): boolean;
    /**
     * Get confidence score for detection
     */
    private getConfidence;
    /**
     * Add custom PII pattern
     */
    addPattern(name: string, pattern: RegExp): void;
}
/**
 * PII Detection Guardrail
 */
export declare class PIIGuardrail implements SafetyGuardrail {
    name: string;
    private detector;
    private action;
    constructor(options?: {
        action?: 'allow' | 'block' | 'redact';
    });
    check(content: string): SafetyCheck;
}
//# sourceMappingURL=pii-detection.d.ts.map