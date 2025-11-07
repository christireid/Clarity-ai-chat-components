/**
 * Prompt Injection Detection
 *
 * Simple heuristic-based detection for prompt injection attempts.
 * For production, consider more sophisticated approaches.
 */
export class PromptInjectionDetector {
    constructor() {
        this.suspiciousPatterns = [
            // Ignore previous instructions
            /ignore (all )?previous (instructions|commands|prompts)/i,
            /disregard (all )?previous (instructions|commands|prompts)/i,
            // System message override
            /you are now/i,
            /new (instructions|system prompt|role):/i,
            /act as if/i,
            /pretend (you are|to be)/i,
            // Output manipulation
            /print (your|the) (instructions|prompt|system message)/i,
            /reveal (your|the) (instructions|prompt)/i,
            /show me (your|the) (instructions|prompt)/i,
            // Role manipulation
            /you (must|should|will) (now )?follow/i,
            /override (previous|system|default)/i,
            // Common injection patterns
            /\[SYSTEM\]/i,
            /\[INST\]/i,
            /<\|im_start\|>/i,
        ];
    }
    /**
     * Detect potential prompt injection
     */
    detect(content) {
        const matches = [];
        for (const pattern of this.suspiciousPatterns) {
            if (pattern.test(content)) {
                const match = content.match(pattern);
                if (match) {
                    matches.push(match[0]);
                }
            }
        }
        // Calculate confidence based on number of matches
        const confidence = Math.min(matches.length * 0.3, 0.95);
        return {
            detected: matches.length > 0,
            matches,
            confidence,
        };
    }
    /**
     * Add custom suspicious pattern
     */
    addPattern(pattern) {
        this.suspiciousPatterns.push(pattern);
    }
}
/**
 * Prompt Injection Guardrail
 */
export class PromptInjectionGuardrail {
    constructor() {
        this.name = 'prompt-injection';
        this.detector = new PromptInjectionDetector();
    }
    check(content) {
        const result = this.detector.detect(content);
        return {
            name: this.name,
            passed: !result.detected,
            confidence: result.detected ? result.confidence : 1.0,
            details: result.detected
                ? `Potential prompt injection detected: ${result.matches[0]}`
                : 'No prompt injection detected',
            action: result.detected ? 'block' : 'allow',
        };
    }
}
//# sourceMappingURL=prompt-injection.js.map