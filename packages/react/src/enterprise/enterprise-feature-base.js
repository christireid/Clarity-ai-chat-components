/**
 * Enhanced Enterprise Feature Base Class
 * Provides comprehensive enterprise functionality with browser-compatible implementations
 */
import { EventEmitter } from 'events';
import { formatBytes, calculatePercentage } from '../internal/helpers';
/**
 * Exit codes for enterprise errors
 */
export var ExitCode;
(function (ExitCode) {
    ExitCode[ExitCode["SUCCESS"] = 0] = "SUCCESS";
    ExitCode[ExitCode["GENERAL_ERROR"] = 1] = "GENERAL_ERROR";
    ExitCode[ExitCode["CONFIG_ERROR"] = 2] = "CONFIG_ERROR";
    ExitCode[ExitCode["PERMISSION_ERROR"] = 3] = "PERMISSION_ERROR";
    ExitCode[ExitCode["NOT_FOUND"] = 4] = "NOT_FOUND";
    ExitCode[ExitCode["VALIDATION_ERROR"] = 5] = "VALIDATION_ERROR";
})(ExitCode || (ExitCode = {}));
/**
 * Enterprise CLI error class
 */
export class CLIError extends Error {
    code;
    suggestions;
    constructor(message, code = ExitCode.GENERAL_ERROR, suggestions = []) {
        super(message);
        this.name = 'CLIError';
        this.code = code;
        this.suggestions = suggestions;
    }
}
function createLogger(namespace) {
    let currentLevel = 'info';
    const levels = { debug: 0, info: 1, warn: 2, error: 3 };
    const shouldLog = (level) => {
        return levels[level] >= levels[currentLevel];
    };
    return {
        debug: (message, ...args) => {
            if (shouldLog('debug'))
                console.debug(`[${namespace}] ${message}`, ...args);
        },
        info: (message, ...args) => {
            if (shouldLog('info'))
                console.info(`[${namespace}] ${message}`, ...args);
        },
        warn: (message, ...args) => {
            if (shouldLog('warn'))
                console.warn(`[${namespace}] ${message}`, ...args);
        },
        error: (message, ...args) => {
            if (shouldLog('error'))
                console.error(`[${namespace}] ${message}`, ...args);
        },
        setLevel: (level) => {
            currentLevel = level;
        },
    };
}
/**
 * Generate unique filename with timestamp
 */
function generateUniqueFilename(prefix, extension = 'json') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `${prefix}-${timestamp}.${extension}`;
}
/**
 * Ensure directories exist (stub for browser compatibility)
 */
function ensureDirectories(_directories) {
    // In browser context, this is a no-op
    // In Node.js context, this would create directories
}
/**
 * Enhanced enterprise feature base class
 */
export class EnhancedEnterpriseFeature extends EventEmitter {
    config;
    logger;
    metrics = new Map();
    maxMetricsHistory = 100;
    startTime = null;
    constructor(config = {}, namespace) {
        super();
        // Initialize with enhanced default config
        this.config = this.mergeWithDefaults(config);
        // Initialize logger with configured level
        this.logger = createLogger(namespace);
        this.logger.setLevel(this.config.logLevel);
        // Setup feature
        this.setupFeature();
        this.logger.info('Enhanced enterprise feature initialized', {
            namespace,
            enabled: this.config.enabled,
            outputDir: this.config.outputDir,
        });
    }
    /**
     * Merge configuration with enhanced defaults
     */
    mergeWithDefaults(userConfig) {
        const defaults = this.getEnhancedDefaultConfig();
        return { ...defaults, ...userConfig };
    }
    /**
     * Get enhanced default configuration
     */
    getEnhancedDefaultConfig() {
        return {
            enabled: true,
            outputDir: './enterprise-reports',
            formats: ['json', 'html'],
            thresholds: {},
            failOnThreshold: false,
            generateReports: true,
            includeGzip: true,
            generateTrends: true,
            logLevel: 'info',
        };
    }
    /**
     * Setup feature infrastructure
     */
    setupFeature() {
        try {
            // Ensure directories exist
            this.ensureDirectories();
            // Setup event handlers
            this.setupEventHandlers();
            // Validate configuration
            this.validateConfig();
            this.logger.debug('Feature setup completed');
        }
        catch (error) {
            this.logger.error('Feature setup failed', error);
            throw new CLIError(`Failed to setup enterprise feature: ${error instanceof Error ? error.message : String(error)}`, ExitCode.CONFIG_ERROR, [
                'Check configuration values',
                'Ensure output directory is writable',
                'Verify dependencies are installed',
            ]);
        }
    }
    /**
     * Get enhanced default configuration
     */
    getEnhancedDefaults() {
        return this.getEnhancedDefaultConfig();
    }
    /**
     * Ensure required directories exist
     */
    ensureDirectories() {
        if (!this.config.outputDir)
            return;
        const directories = [this.config.outputDir];
        // Add format-specific directories
        this.config.formats.forEach((format) => {
            if (format !== 'json') {
                // JSON goes to main output dir
                directories.push(join(this.config.outputDir, format));
            }
        });
        try {
            ensureDirectories(directories);
            this.logger.debug('Directories ensured', { directories });
        }
        catch (error) {
            throw new CLIError(`Failed to create directories: ${error instanceof Error ? error.message : String(error)}`, ExitCode.PERMISSION_ERROR, [
                'Check directory permissions',
                'Ensure parent directories exist',
                'Verify disk space',
            ]);
        }
    }
    /**
     * Setup event handlers
     */
    setupEventHandlers() {
        // Error handling
        this.on('error', (error) => {
            this.logger.error('Feature error occurred', error);
            this.handleError(error);
        });
        // Threshold handling
        this.on('threshold-exceeded', (data) => {
            this.logger.warn('Threshold exceeded', data);
            this.handleThresholdExceeded(data);
        });
        // Processing events
        this.on('processing-start', () => {
            this.startTime = new Date();
            this.logger.info('Processing started');
        });
        this.on('processing-complete', (result) => {
            const duration = this.startTime
                ? Date.now() - this.startTime.getTime()
                : 0;
            this.logger.info('Processing completed', {
                success: result.success,
                duration: `${duration}ms`,
                warnings: result.warnings.length,
                errors: result.errors.length,
            });
            this.startTime = null;
        });
        // Debug logging
        if (this.config.logLevel === 'debug') {
            this.on('metrics-updated', (metrics) => {
                this.logger.debug('Metrics updated', metrics);
            });
            this.on('config-updated', (data) => {
                this.logger.debug('Configuration updated', data);
            });
        }
    }
    /**
     * Handle errors with proper logging and error classification
     */
    handleError(error) {
        const errorInfo = this.classifyError(error);
        this.logger.error('Error handled', {
            message: error.message,
            type: errorInfo.type,
            severity: errorInfo.severity,
            shouldExit: errorInfo.shouldExit,
        });
        if (errorInfo.shouldExit) {
            throw error;
        }
    }
    /**
     * Classify error type and severity
     */
    classifyError(error) {
        if (error instanceof CLIError) {
            return {
                type: error.constructor.name,
                severity: error.code === ExitCode.GENERAL_ERROR ? 'high' : 'medium',
                shouldExit: true,
            };
        }
        // Configuration errors are high severity
        if (error.message.includes('config') ||
            error.message.includes('configuration')) {
            return {
                type: 'ConfigurationError',
                severity: 'high',
                shouldExit: true,
            };
        }
        // Processing errors are medium severity
        if (error.message.includes('processing') ||
            error.message.includes('process')) {
            return {
                type: 'ProcessingError',
                severity: 'medium',
                shouldExit: false,
            };
        }
        // Default classification
        return {
            type: 'UnknownError',
            severity: 'medium',
            shouldExit: false,
        };
    }
    /**
     * Handle threshold exceeded events
     */
    handleThresholdExceeded(data) {
        const { metric, value, threshold } = data;
        this.logger.warn('Threshold exceeded', {
            metric,
            value: this.formatMetricValue(metric, value),
            threshold: this.formatMetricValue(metric, threshold),
            percentage: calculatePercentage(value, threshold),
        });
        if (this.config.failOnThreshold) {
            throw new CLIError(`${metric} threshold exceeded: ${this.formatMetricValue(metric, value)} > ${this.formatMetricValue(metric, threshold)}`, ExitCode.GENERAL_ERROR, [
                `Increase the ${metric} threshold`,
                'Review the current configuration',
                'Check if the threshold is appropriate for your use case',
            ]);
        }
    }
    /**
     * Format metric value based on metric type
     */
    formatMetricValue(metric, value) {
        const lowerMetric = metric.toLowerCase();
        if (lowerMetric.includes('size') || lowerMetric.includes('bytes')) {
            return formatBytes(value);
        }
        if (lowerMetric.includes('time') || lowerMetric.includes('duration')) {
            return `${value}ms`;
        }
        if (lowerMetric.includes('percentage') || lowerMetric.includes('pct')) {
            return `${value.toFixed(1)}%`;
        }
        return value.toString();
    }
    /**
     * Check thresholds with enhanced error handling
     */
    checkThresholds(metric, value, threshold) {
        try {
            const actualThreshold = threshold ?? this.config.thresholds[metric];
            if (actualThreshold !== undefined && value > actualThreshold) {
                this.emit('threshold-exceeded', {
                    metric,
                    value,
                    threshold: actualThreshold,
                });
            }
        }
        catch (error) {
            this.logger.error('Error checking thresholds', error);
            // Don't throw here - threshold checking shouldn't break processing
        }
    }
    /**
     * Update metrics with validation and cleanup
     */
    updateMetrics(metricName, metricData) {
        try {
            if (!this.metrics.has(metricName)) {
                this.metrics.set(metricName, []);
            }
            const metricHistory = this.metrics.get(metricName);
            metricHistory.push({
                ...metricData,
                timestamp: new Date(),
            });
            // Keep only recent metrics
            if (metricHistory.length > this.maxMetricsHistory) {
                this.metrics.set(metricName, metricHistory.slice(-this.maxMetricsHistory));
            }
            this.emit('metrics-updated', { metricName, metricData });
        }
        catch (error) {
            this.logger.error('Error updating metrics', error);
        }
    }
    /**
     * Get metrics for a specific metric name
     */
    getMetrics(metricName) {
        if (metricName) {
            return [...(this.metrics.get(metricName) || [])];
        }
        // Return all metrics flattened
        const allMetrics = [];
        for (const [name, history] of this.metrics.entries()) {
            allMetrics.push(...history.map((m) => ({ ...m, metricName: name })));
        }
        return allMetrics;
    }
    /**
     * Get current configuration
     */
    getConfig() {
        return { ...this.config };
    }
    /**
     * Update configuration with validation
     */
    updateConfig(newConfig) {
        try {
            const oldConfig = { ...this.config };
            // Validate new config before applying
            this.validatePartialConfig(newConfig);
            this.config = { ...this.config, ...newConfig };
            this.emit('config-updated', {
                oldConfig,
                newConfig: this.config,
                changes: Object.keys(newConfig),
            });
            this.logger.info('Configuration updated successfully', {
                changes: Object.keys(newConfig),
                logLevel: this.config.logLevel,
            });
        }
        catch (error) {
            this.logger.error('Configuration update failed', error);
            throw new CLIError(`Failed to update configuration: ${error instanceof Error ? error.message : String(error)}`, ExitCode.CONFIG_ERROR, [
                'Check configuration values are valid',
                'Ensure all required fields are provided',
                'Review configuration schema',
            ]);
        }
    }
    /**
     * Validate partial configuration update
     */
    validatePartialConfig(partialConfig) {
        // Basic validation - subclasses can override for specific validation
        if (partialConfig.thresholds &&
            typeof partialConfig.thresholds !== 'object') {
            throw new Error('thresholds must be an object');
        }
        if (partialConfig.formats && !Array.isArray(partialConfig.formats)) {
            throw new Error('formats must be an array');
        }
        if (partialConfig.logLevel &&
            !['debug', 'info', 'warn', 'error'].includes(partialConfig.logLevel)) {
            throw new Error('logLevel must be one of: debug, info, warn, error');
        }
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
        this.logger.info('Feature enabled successfully');
    }
    /**
     * Disable feature
     */
    disable() {
        this.config.enabled = false;
        this.emit('disabled');
        this.logger.info('Feature disabled successfully');
    }
    /**
     * Get feature status
     */
    getStatus() {
        const uptime = this.startTime ? Date.now() - this.startTime.getTime() : null;
        return {
            enabled: this.config.enabled,
            config: this.getConfig(),
            metricsCount: this.getMetrics().length,
            uptime,
        };
    }
    /**
     * Generate unique filename for reports
     */
    generateReportFilename(prefix, extension = 'json') {
        return generateUniqueFilename(`${prefix}-report`, extension);
    }
    /**
     * Save report (browser-compatible stub - stores in memory)
     * In a real implementation, this could use IndexedDB or localStorage
     */
    reportStorage = new Map();
    saveReport(filename, data, format = 'json') {
        try {
            const filepath = `${this.config.outputDir}/${filename}`;
            this.reportStorage.set(filepath, { data, format });
            this.logger.info('Report saved', { filepath, format });
            return filepath;
        }
        catch (error) {
            throw new CLIError(`Failed to save report: ${error instanceof Error ? error.message : String(error)}`, ExitCode.PERMISSION_ERROR, ['Check storage availability', 'Ensure quota is not exceeded']);
        }
    }
    /**
     * Load report (browser-compatible stub - loads from memory)
     */
    loadReport(filename) {
        const filepath = `${this.config.outputDir}/${filename}`;
        try {
            const stored = this.reportStorage.get(filepath);
            if (!stored) {
                throw new Error(`Report file not found: ${filepath}`);
            }
            return stored.data;
        }
        catch (error) {
            throw new CLIError(`Failed to load report: ${error instanceof Error ? error.message : String(error)}`, ExitCode.NOT_FOUND, ['Check if the report was saved', 'Verify the filename is correct']);
        }
    }
}
//# sourceMappingURL=enterprise-feature-base.js.map