/**
 * Enterprise Error Classes
 * Standardized error handling for enterprise features
 */
/**
 * Base enterprise error
 */
export class EnterpriseError extends Error {
    code;
    severity;
    details;
    constructor(message, code, severity = 'medium', details) {
        super(message);
        this.code = code;
        this.severity = severity;
        this.details = details;
        this.name = 'EnterpriseError';
    }
}
/**
 * Threshold exceeded error
 */
export class ThresholdExceededError extends EnterpriseError {
    threshold;
    actual;
    metric;
    constructor(threshold, actual, metric) {
        super(`${metric} threshold exceeded: ${actual} > ${threshold}`, 'THRESHOLD_EXCEEDED', 'high', { threshold, actual, metric });
        this.threshold = threshold;
        this.actual = actual;
        this.metric = metric;
        this.name = 'ThresholdExceededError';
    }
}
/**
 * Configuration error
 */
export class ConfigurationError extends EnterpriseError {
    configKey;
    expected;
    received;
    constructor(message, configKey, expected, received) {
        super(`Configuration error: ${message}`, 'CONFIG_ERROR', 'high', { configKey, expected, received });
        this.configKey = configKey;
        this.expected = expected;
        this.received = received;
        this.name = 'ConfigurationError';
    }
}
/**
 * Processing error
 */
export class ProcessingError extends EnterpriseError {
    stage;
    cause;
    constructor(message, stage, cause) {
        super(`Processing error: ${message}`, 'PROCESSING_ERROR', 'high', { stage, cause: cause?.message });
        this.stage = stage;
        this.cause = cause;
        this.name = 'ProcessingError';
    }
}
/**
 * Validation error
 */
export class ValidationError extends EnterpriseError {
    field;
    value;
    constraints;
    constructor(message, field, value, constraints) {
        super(`Validation error: ${message}`, 'VALIDATION_ERROR', 'medium', { field, value, constraints });
        this.field = field;
        this.value = value;
        this.constraints = constraints;
        this.name = 'ValidationError';
    }
}
/**
 * Resource error
 */
export class ResourceError extends EnterpriseError {
    resource;
    operation;
    reason;
    constructor(resource, operation, reason) {
        super(`Resource error: ${operation} failed for ${resource}${reason ? `: ${reason}` : ''}`, 'RESOURCE_ERROR', 'high', { resource, operation, reason });
        this.resource = resource;
        this.operation = operation;
        this.reason = reason;
        this.name = 'ResourceError';
    }
}
//# sourceMappingURL=enterprise-errors.js.map