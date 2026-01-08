/**
 * Enterprise Feature Base Class
 * Provides common functionality for all enterprise features
 */
import { EventEmitter } from 'events';
import { getLogger, LogLevel } from '../cli/src/utils/logger';
import { EnterpriseError, ThresholdExceededError } from './enterprise-errors';
import { formatBytes, formatTimestamp, ensureDirectories, } from '../primitives/src/lib/enterprise-utils';
/**
 * Abstract base class for enterprise features
 */
export class EnterpriseFeature extends EventEmitter {
    config;
    logger;
    metrics = [];
    maxMetricsHistory = 100;
    constructor(config = {}, namespace) {
        super();
        // Merge with default config
        this.config = { ...this.getDefaultConfig(), ...config };
        // Initialize logger
        this.logger = getLogger(namespace);
        // Ensure directories exist
        this.ensureDirectories();
        // Setup event handlers
        this.setupEventHandlers();
        this.logger.info('Enterprise feature initialized', {
            namespace,
            enabled: this.config.enabled,
        });
    }
    /**
     * Ensure required directories exist
     */
    ensureDirectories() {
        if (!this.config.outputDir)
            return;
        const directories = [this.config.outputDir];
        ensureDirectories(directories);
        this.logger.debug('Directories ensured', { directories });
    }
    /**
     * Setup event handlers
     */
    setupEventHandlers() {
        // Log all events in debug mode
        if (process.env.DEBUG) {
            this.on('error', (error) => {
                this.logger.error('Feature error', error);
            });
            this.on('threshold-exceeded', (data) => {
                this.logger.warn('Threshold exceeded', data);
            });
            this.on('processing-complete', (data) => {
                this.logger.info('Processing complete', data);
            });
        }
    }
    /**
     * Check thresholds
     */
    checkThresholds(metric, value, threshold) {
        const actualThreshold = threshold ?? this.config.thresholds[metric];
        if (actualThreshold && value > actualThreshold) {
            const error = new ThresholdExceededError(actualThreshold, value, metric);
            this.emit('threshold-exceeded', {
                metric,
                value,
                threshold: actualThreshold,
                error: error.message,
            });
            if (this.config.failOnThreshold) {
                throw error;
            }
        }
    }
    /**
     * Update metrics
     */
    updateMetrics(metric) {
        this.metrics.push({
            ...metric,
            timestamp: new Date(),
        });
        // Keep only recent metrics
        if (this.metrics.length > this.maxMetricsHistory) {
            this.metrics = this.metrics.slice(-this.maxMetricsHistory);
        }
        this.emit('metrics-updated', metric);
    }
    /**
     * Get current configuration
     */
    getConfig() {
        return { ...this.config };
    }
    /**
     * Update configuration
     */
    updateConfig(newConfig) {
        const oldConfig = { ...this.config };
        this.config = { ...this.config, ...newConfig };
        this.emit('config-updated', {
            oldConfig,
            newConfig: this.config,
        });
        this.logger.info('Configuration updated', {
            changes: Object.keys(newConfig),
        });
    }
    /**
     * Get metrics history
     */
    getMetrics() {
        return [...this.metrics];
    }
    /**
     * Is feature enabled
     */
    isEnabled() {
        return this.config.enabled;
    }
    /**
     * Enable feature
     */
    enable() {
        this.config.enabled = true;
        this.emit('enabled');
        this.logger.info('Feature enabled');
    }
    /**
     * Disable feature
     */
    disable() {
        this.config.enabled = false;
        this.emit('disabled');
        this.logger.info('Feature disabled');
    }
}
/**
 * Enterprise feature factory
 */
export function createEnterpriseFeature(name, config) {
    return class extends EnterpriseFeature {
        getDefaultConfig() {
            return config.defaultConfig;
        }
        validateConfig() {
            config.validator(this.config);
        }
        async process(data) {
            return config.processor(data, this.config);
        }
    };
}
//# sourceMappingURL=enterprise-feature.js.map