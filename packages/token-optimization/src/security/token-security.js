/**
 * Token Security Manager
 *
 * Comprehensive security framework for token optimization
 * Implements OWASP LLM Top 10 security measures
 */
// Multi-layer injection detection patterns - defined as strings to avoid RegExp state issues
const INJECTION_PATTERNS = [
    {
        pattern: 'ignore.*previous.*instructions',
        type: 'instruction_override',
        severity: 'high'
    },
    {
        pattern: 'unicode.*bypass',
        type: 'encoding_bypass',
        severity: 'high'
    },
    {
        pattern: '\\[encoded:.*\\]',
        type: 'encoding_bypass',
        severity: 'high'
    },
    {
        pattern: 'system:\\s*.*',
        type: 'system_prompt_injection',
        severity: 'high'
    },
    {
        pattern: 'you\\s+are\\s+now',
        type: 'role_manipulation',
        severity: 'high'
    },
    {
        pattern: 'disregard.*above',
        type: 'context_override',
        severity: 'medium'
    },
    {
        pattern: 'translate.*to.*system',
        type: 'indirect_injection',
        severity: 'medium'
    },
    {
        pattern: 'pretend.*you.*are',
        type: 'roleplay_injection',
        severity: 'medium'
    },
    {
        pattern: 'base64.*instruction',
        type: 'encoding_injection',
        severity: 'high'
    },
    {
        pattern: 'compression.*ratio.*leak',
        type: 'side_channel',
        severity: 'medium'
    },
    {
        pattern: 'token.*count.*attack',
        type: 'timing_attack',
        severity: 'medium'
    }
];
export class TokenSecurityManager {
    config;
    auditLog = [];
    constructor(config) {
        this.config = config;
        // console.log("I AM ALIVE: TokenSecurityManager constructor")
        this.setupAuditCleanup();
    }
    /**
     * OWASP LLM01: Prompt Injection Prevention
     */
    sanitizeInput(text) {
        if (!this.config.enableSanitization) {
            return {
                original: text || '',
                sanitized: text || '',
                threats: [],
                riskLevel: 'low'
            };
        }
        // Handle null/undefined input
        if (text === null || text === undefined) {
            return {
                original: null,
                sanitized: null,
                threats: [],
                riskLevel: 'low'
            };
        }
        try {
            return this.performSanitization(text);
        }
        catch (error) {
            console.error('[SANITIZATION ERROR]:', error);
            // Fail-safe: return original text with no threats detected
            return {
                original: text,
                sanitized: text,
                threats: [{
                        type: 'sanitization_error',
                        severity: 'low',
                        pattern: '',
                        detected: false
                    }],
                riskLevel: 'low'
            };
        }
    }
    performSanitization(text) {
        let sanitized = text;
        const detectedThreats = [];
        // First normalize the text to handle obfuscated injections
        const normalizedText = text.replace(/\s+/g, '').toLowerCase();
        // Use robust RegExp creation from string patterns
        INJECTION_PATTERNS.forEach(({ pattern, type, severity }) => {
            // Create fresh regex instances to prevent state pollution
            const regex = new RegExp(pattern, 'gi');
            // Check original text
            const matchSanitized = regex.test(sanitized);
            // Reset lastIndex
            regex.lastIndex = 0;
            // Check normalized text
            const matchNormalized = regex.test(normalizedText);
            if (matchSanitized || matchNormalized) {
                // Replace with safe placeholder using fresh regex
                const replaceRegex = new RegExp(pattern, 'gi');
                sanitized = sanitized.replace(replaceRegex, `[INJECTION_ATTEMPT:${type}]`);
                detectedThreats.push({
                    type,
                    severity: severity,
                    pattern,
                    detected: true
                });
            }
        });
        // Additional sanitization
        sanitized = this.additionalSanitization(sanitized);
        const riskLevel = this.calculateRiskLevel(detectedThreats);
        return {
            original: text,
            sanitized,
            threats: detectedThreats,
            riskLevel
        };
    }
    /**
     * OWASP LLM02: Sensitive Information Disclosure Prevention
     */
    protectSensitiveData(text) {
        if (!this.config.enablePIIRedaction) {
            return {
                original: text || '',
                protected: text || '',
                redactedTypes: [],
                riskLevel: 'low'
            };
        }
        // Handle null/undefined input
        if (text === null || text === undefined) {
            return {
                original: '',
                protected: '',
                redactedTypes: [],
                riskLevel: 'low'
            };
        }
        let protectedText = text;
        const redactedTypes = [];
        // PII Detection and Redaction
        // Simplified robust patterns defined as strings
        const piiPatterns = [
            { pattern: '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b', type: 'email', replacement: '[EMAIL]' },
            { pattern: '\\b(?:\\+?1[-.\\s]?)?\\(?([0-9]{3})\\)?[-.\\s]?([0-9]{3})[-.\\s]?([0-9]{4})\\b', type: 'phone', replacement: '[PHONE]' },
            { pattern: '\\b\\d{3}-\\d{2}-\\d{4}\\b', type: 'ssn', replacement: '[SSN]' },
            { pattern: '\\b\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}\\b', type: 'credit_card', replacement: '[CREDIT_CARD]' },
            { pattern: '\\b[a-zA-Z0-9]{32,}\\b', type: 'api_key', replacement: '[API_KEY]' },
            { pattern: '\\b(password|pwd|pass)\\s*[:=]\\s*[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};\':"\\\\|,.<>\\/?]{8,}\\b', type: 'password', replacement: '[PASSWORD]' },
            { pattern: '\\b[A-Z]{1,2}\\d{6,8}\\b', type: 'passport', replacement: '[PASSPORT]' },
            { pattern: '\\b[A-Z]{2}\\d{6,8}\\b', type: 'license_plate', replacement: '[LICENSE]' }
        ];
        piiPatterns.forEach(({ pattern, type, replacement }) => {
            const regex = new RegExp(pattern, 'gi'); // Global, Case-insensitive
            if (regex.test(protectedText)) {
                const replaceRegex = new RegExp(pattern, 'gi');
                protectedText = protectedText.replace(replaceRegex, replacement);
                redactedTypes.push(type);
            }
        });
        // Additional data protection - moved after PII patterns
        protectedText = this.additionalDataProtection(protectedText);
        const riskLevel = redactedTypes.length > 0 ? 'medium' : 'low';
        return {
            original: text,
            protected: protectedText,
            redactedTypes: [...new Set(redactedTypes)], // Remove duplicates
            riskLevel
        };
    }
    /**
     * Compression ratio protection against side-channel attacks
     */
    protectCompressionRatio(originalTokens, compressedTokens) {
        if (!this.config.enableCompressionObfuscation) {
            return {
                compressionRatio: compressedTokens / originalTokens,
                originalTokens,
                compressedTokens,
                noiseLevel: 0,
                protectionLevel: 'none'
            };
        }
        const noiseLevel = this.config.noiseLevel || 0.1; // ±10% noise by default
        // Add controlled noise to prevent information leakage
        const noise = (Math.random() - 0.5) * noiseLevel;
        let protectedRatio = (compressedTokens / originalTokens) + noise;
        // Clamp to reasonable bounds
        protectedRatio = Math.max(0.1, Math.min(0.95, protectedRatio));
        // Additional protection based on compliance level
        if (this.config.complianceLevel === 'government') {
            // Add time-based obfuscation for government level
            const timeNoise = Math.sin(Date.now() / 3600000) * 0.05; // ±5% time-based
            protectedRatio += timeNoise;
            protectedRatio = Math.max(0.1, Math.min(0.95, protectedRatio));
        }
        // Obfuscate token counts
        const obfuscatedOriginal = this.obfuscateTokenCount(originalTokens);
        const obfuscatedCompressed = this.obfuscateTokenCount(compressedTokens);
        return {
            compressionRatio: protectedRatio,
            originalTokens: obfuscatedOriginal,
            compressedTokens: obfuscatedCompressed,
            noiseLevel,
            protectionLevel: this.config.complianceLevel || 'basic'
        };
    }
    /**
     * Comprehensive security audit logging
     */
    logSecurityEvent(event) {
        if (!this.config.enableAuditLogging)
            return;
        // Add to audit log
        this.auditLog.push(event);
        // Limit audit log size
        const maxSize = 10000;
        if (this.auditLog.length > maxSize) {
            this.auditLog = this.auditLog.slice(-maxSize);
        }
        // Real-time security alert for high-risk events
        if (event.riskLevel === 'high') {
            this.sendSecurityAlert(event);
        }
        // Detailed audit entry
        const auditEntry = {
            timestamp: event.timestamp.toISOString(),
            type: event.type,
            riskLevel: event.riskLevel,
            originalLength: event.originalLength,
            processedLength: event.processedLength,
            checks: event.checks,
            userId: event.userId,
            sessionId: event.sessionId
        };
        // In production, this would go to a secure audit system
        console.log('[SECURITY AUDIT]', auditEntry);
    }
    /**
     * Generate security compliance report
     */
    generateComplianceReport() {
        const recentEvents = this.auditLog.filter(event => Date.now() - event.timestamp.getTime() < 24 * 60 * 60 * 1000);
        const riskLevels = {
            low: recentEvents.filter(e => e.riskLevel === 'low').length,
            medium: recentEvents.filter(e => e.riskLevel === 'medium').length,
            high: recentEvents.filter(e => e.riskLevel === 'high').length
        };
        const complianceChecks = {
            sanitization: this.config.enableSanitization,
            piiProtection: this.config.enablePIIRedaction,
            auditLogging: this.config.enableAuditLogging,
            compressionObfuscation: this.config.enableCompressionObfuscation
        };
        return {
            timestamp: new Date().toISOString(),
            complianceLevel: this.config.complianceLevel || 'basic',
            totalEvents: this.auditLog.length,
            recentEvents: recentEvents.length,
            riskLevels,
            complianceChecks,
            recommendations: this.generateRecommendations(recentEvents)
        };
    }
    setupAuditCleanup() {
        // Clean up old audit logs daily
        setInterval(() => {
            const retentionDays = this.config.auditRetention || 30;
            const cutoffTime = Date.now() - (retentionDays * 24 * 60 * 60 * 1000);
            this.auditLog = this.auditLog.filter(event => event.timestamp.getTime() > cutoffTime);
        }, 24 * 60 * 60 * 1000);
    }
    additionalSanitization(text) {
        // Additional sanitization steps
        return text
            .replace(/[<>]/g, '') // Remove potential HTML
            .replace(/javascript:/gi, '') // Remove JavaScript protocol
            .replace(/on\w+\s*=/gi, ''); // Remove event handlers
    }
    additionalDataProtection(text) {
        // Additional data protection - just basic sanitization, no acronym replacement
        return text
            .replace(/[<>]/g, '') // Remove potential HTML
            .replace(/javascript:/gi, '') // Remove JavaScript protocol
            .replace(/on\w+\s*=/gi, ''); // Remove event handlers
    }
    calculateRiskLevel(threats) {
        if (threats.length === 0)
            return 'low';
        const hasHighSeverity = threats.some(t => t.severity === 'high');
        const hasMediumSeverity = threats.some(t => t.severity === 'medium');
        if (hasHighSeverity)
            return 'high';
        if (hasMediumSeverity)
            return 'medium';
        return 'low';
    }
    obfuscateTokenCount(tokenCount) {
        // Round to nearest 5 to prevent precise inference
        return Math.round(tokenCount / 5) * 5;
    }
    sendSecurityAlert(event) {
        // In production, this would send alerts to security team
        console.warn('[SECURITY ALERT]', {
            type: event.type,
            riskLevel: event.riskLevel,
            timestamp: event.timestamp.toISOString(),
            userId: event.userId
        });
    }
    generateRecommendations(events) {
        const recommendations = [];
        const highRiskEvents = events.filter(e => e.riskLevel === 'high');
        const mediumRiskEvents = events.filter(e => e.riskLevel === 'medium');
        if (highRiskEvents.length > 0) {
            recommendations.push('Review and strengthen input validation');
            recommendations.push('Consider implementing rate limiting');
        }
        if (mediumRiskEvents.length > 5) {
            recommendations.push('Monitor for patterns in medium-risk events');
            recommendations.push('Consider additional security training');
        }
        if (events.some(e => e.type === 'compression')) {
            recommendations.push('Review compression ratio protection settings');
        }
        return recommendations;
    }
}
//# sourceMappingURL=token-security.js.map