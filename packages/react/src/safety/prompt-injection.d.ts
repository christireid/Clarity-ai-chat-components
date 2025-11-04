/**
 * Prompt Injection Detection
 *
 * Simple heuristic-based detection for prompt injection attempts.
 * For production, consider more sophisticated approaches.
 */
import type { SafetyCheck, SafetyGuardrail } from './types';
export declare class PromptInjectionDetector {
    private suspiciousPatterns;
    /**
     * Detect potential prompt injection
     */
    detect(content: string): {
        detected: boolean;
        matches: string[];
        confidence: number;
    };
    /**
     * Add custom suspicious pattern
     */
    addPattern(pattern: RegExp): void;
}
/**
 * Prompt Injection Guardrail
 */
export declare class PromptInjectionGuardrail implements SafetyGuardrail {
    name: string;
    private detector;
    check(content: string): SafetyCheck;
}
//# sourceMappingURL=prompt-injection.d.ts.map