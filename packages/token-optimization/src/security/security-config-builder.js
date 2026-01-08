/**
 * Type-safe configuration builder for security settings
 * Provides compile-time safety and runtime validation
 */
export class TypeSafeSecurityConfigBuilder {
    config = {};
    constructor() {
        // Set secure defaults
        this.config = {
            enableSanitization: true,
            enablePIIRedaction: true,
            enableAuditLogging: true,
            enableCompressionObfuscation: true,
            enableRateLimiting: true,
            maxRequestsPerMinute: 60,
            maxRequestsPerHour: 1000,
            enableEncryption: true,
            enableMLThreatDetection: true,
            threatDetectionThreshold: 0.7,
            enableZeroTrust: true,
            authenticationRequired: true,
            enableRealTimeMonitoring: true,
            complianceStandards: ['SOC2', 'GDPR'],
            enableAutoQuarantine: true,
            quarantineThreshold: 0.8
        };
    }
    withRateLimiting(maxPerMinute = 60, maxPerHour = 1000) {
        if (maxPerMinute <= 0 || maxPerHour <= 0) {
            throw new Error('Rate limiting values must be positive');
        }
        if (maxPerMinute > maxPerHour) {
            throw new Error('Per-minute rate cannot exceed per-hour rate');
        }
        this.config.enableRateLimiting = true;
        this.config.maxRequestsPerMinute = maxPerMinute;
        this.config.maxRequestsPerHour = maxPerHour;
        return this;
    }
    withEncryption(enable = true, key) {
        if (enable && !key) {
            throw new Error('Encryption key required when encryption is enabled');
        }
        this.config.enableEncryption = enable;
        this.config.encryptionKey = key;
        return this;
    }
    withThreatDetection(threshold = 0.7) {
        if (threshold < 0 || threshold > 1) {
            throw new Error('Threat detection threshold must be between 0 and 1');
        }
        this.config.enableMLThreatDetection = true;
        this.config.threatDetectionThreshold = threshold;
        return this;
    }
    withZeroTrust(authRequired = true) {
        this.config.enableZeroTrust = true;
        this.config.authenticationRequired = authRequired;
        return this;
    }
    withCompliance(standards = ['SOC2', 'GDPR']) {
        const validStandards = ['SOC2', 'HIPAA', 'GDPR', 'PCI-DSS', 'ISO27001'];
        const invalidStandards = standards.filter(s => !validStandards.includes(s));
        if (invalidStandards.length > 0) {
            throw new Error(`Invalid compliance standards: ${invalidStandards.join(', ')}`);
        }
        this.config.complianceStandards = standards;
        return this;
    }
    withAutoQuarantine(threshold = 0.8) {
        if (threshold < 0 || threshold > 1) {
            throw new Error('Quarantine threshold must be between 0 and 1');
        }
        this.config.enableAutoQuarantine = true;
        this.config.quarantineThreshold = threshold;
        return this;
    }
    withRedisStore(url = 'redis://localhost:6379', prefix = 'security:') {
        this.config.redisStore = {
            enabled: true,
            redisUrl: url,
            keyPrefix: prefix
        };
        return this;
    }
    build() {
        const finalConfig = this.config;
        // Runtime validation
        this.validateConfig(finalConfig);
        return finalConfig;
    }
    validateConfig(config) {
        if (config.enableRateLimiting) {
            if (config.maxRequestsPerMinute <= 0 || config.maxRequestsPerHour <= 0) {
                throw new Error('Rate limiting values must be positive');
            }
            if (config.maxRequestsPerMinute > config.maxRequestsPerHour) {
                throw new Error('Per-minute rate cannot exceed per-hour rate');
            }
        }
        if (config.enableEncryption && !config.encryptionKey) {
            throw new Error('Encryption key required when encryption is enabled');
        }
        if (config.threatDetectionThreshold < 0 || config.threatDetectionThreshold > 1) {
            throw new Error('Threat detection threshold must be between 0 and 1');
        }
        if (config.quarantineThreshold < 0 || config.quarantineThreshold > 1) {
            throw new Error('Quarantine threshold must be between 0 and 1');
        }
    }
}
export function createSecurityConfig() {
    return new TypeSafeSecurityConfigBuilder();
}
// Predefined configuration profiles
export const SecurityProfiles = {
    HIGH_SECURITY: createSecurityConfig()
        .withRateLimiting(30, 500)
        .withEncryption(!!process.env.ENCRYPTION_KEY, process.env.ENCRYPTION_KEY)
        .withThreatDetection(0.5)
        .withZeroTrust(true)
        .withCompliance(['SOC2', 'HIPAA', 'GDPR'])
        .withAutoQuarantine(0.6)
        .withRedisStore()
        .build(),
    STANDARD_SECURITY: createSecurityConfig()
        .withRateLimiting(60, 1000)
        .withEncryption(!!process.env.ENCRYPTION_KEY, process.env.ENCRYPTION_KEY)
        .withThreatDetection(0.7)
        .withZeroTrust(true)
        .withCompliance(['SOC2', 'GDPR'])
        .withAutoQuarantine(0.8)
        .build(),
    MINIMAL_SECURITY: createSecurityConfig()
        .withRateLimiting(120, 2000)
        .withEncryption(false)
        .withThreatDetection(0.9)
        .withZeroTrust(false)
        .withCompliance(['GDPR'])
        .withAutoQuarantine(0.95)
        .build(),
    DEVELOPMENT: createSecurityConfig()
        .withRateLimiting(1000, 10000)
        .withEncryption(false)
        .withThreatDetection(0.95)
        .withZeroTrust(false)
        .withCompliance([])
        .withAutoQuarantine(1.0)
        .build()
};
//# sourceMappingURL=security-config-builder.js.map