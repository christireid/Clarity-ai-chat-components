/**
 * Error Recovery Tracker for Clarity Chat Developer Tools
 *
 * Comprehensive error tracking and recovery monitoring:
 * - Error boundary tracking
 * - Recovery attempt logging
 * - Error categorization and grouping
 * - Stack trace analysis
 * - Error frequency monitoring
 * - Recovery success rates
 * - Automated recommendations
 */
import chalk from 'chalk';
import { infoBox, errorBox, warningBox, successBox } from '../ui/box';
import { table, keyValueTable } from '../ui/table';
/**
 * Error Recovery Tracker
 * Track errors and recovery attempts
 */
export class ErrorTracker {
    events = [];
    groups = new Map();
    maxEvents = 500;
    enabled = true;
    listeners = new Set();
    severityThresholds = {
        network: 'medium',
        rendering: 'high',
        state: 'high',
        validation: 'low',
        authentication: 'critical',
        api: 'medium',
        timeout: 'medium',
        memory: 'critical',
        unknown: 'medium',
    };
    constructor(options = {}) {
        this.enabled = options.enabled ?? true;
        this.maxEvents = options.maxEvents ?? 500;
        if (options.severityThresholds) {
            this.severityThresholds = { ...this.severityThresholds, ...options.severityThresholds };
        }
    }
    /**
     * Track an error
     */
    track(options) {
        const category = options.category ?? this.categorizeError(options.error);
        const severity = options.severity ?? this.severityThresholds[category];
        const fingerprint = this.generateFingerprint(options.error, category);
        const event = {
            id: this.generateId(),
            timestamp: new Date(),
            error: options.error,
            severity,
            category,
            component: options.component,
            context: options.context,
            stackTrace: options.error.stack ?? '',
            recoveryAttempts: [],
            resolved: false,
            fingerprint,
            metadata: options.metadata,
        };
        if (this.enabled) {
            this.events.push(event);
            this.updateGroup(event);
            // Maintain max events
            if (this.events.length > this.maxEvents) {
                this.events.shift();
            }
            // Notify listeners
            this.listeners.forEach(listener => listener(event));
            // Log to console
            this.logError(event);
        }
        return event;
    }
    /**
     * Track a recovery attempt
     */
    trackRecovery(eventId, options) {
        const event = this.events.find(e => e.id === eventId);
        if (!event)
            return null;
        const attempt = {
            id: this.generateId(),
            timestamp: new Date(),
            strategy: options.strategy,
            successful: options.successful,
            duration: options.duration,
            error: options.error,
        };
        event.recoveryAttempts.push(attempt);
        if (options.successful) {
            event.resolved = true;
            event.resolvedAt = new Date();
        }
        // Update group recovery rate
        const group = this.groups.get(event.fingerprint);
        if (group) {
            const totalAttempts = group.events.reduce((sum, e) => sum + e.recoveryAttempts.length, 0);
            const successfulAttempts = group.events.reduce((sum, e) => sum + e.recoveryAttempts.filter(a => a.successful).length, 0);
            group.recoveryRate = totalAttempts > 0 ? successfulAttempts / totalAttempts : 0;
        }
        return attempt;
    }
    /**
     * Mark an error as resolved
     */
    resolve(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event)
            return false;
        event.resolved = true;
        event.resolvedAt = new Date();
        return true;
    }
    /**
     * Get error by ID
     */
    getError(id) {
        return this.events.find(e => e.id === id);
    }
    /**
     * Get all errors
     */
    getErrors(filter) {
        let errors = [...this.events];
        if (filter) {
            if (filter.category) {
                errors = errors.filter(e => e.category === filter.category);
            }
            if (filter.severity) {
                errors = errors.filter(e => e.severity === filter.severity);
            }
            if (filter.component) {
                errors = errors.filter(e => e.component === filter.component);
            }
            if (filter.resolved !== undefined) {
                errors = errors.filter(e => e.resolved === filter.resolved);
            }
            if (filter.startTime) {
                errors = errors.filter(e => e.timestamp >= filter.startTime);
            }
            if (filter.endTime) {
                errors = errors.filter(e => e.timestamp <= filter.endTime);
            }
        }
        return errors;
    }
    /**
     * Get error groups
     */
    getGroups() {
        return Array.from(this.groups.values())
            .sort((a, b) => b.count - a.count);
    }
    /**
     * Get statistics
     */
    getStats() {
        const events = this.events;
        const totalRecoveryAttempts = events.reduce((sum, e) => sum + e.recoveryAttempts.length, 0);
        const successfulRecoveries = events.reduce((sum, e) => sum + e.recoveryAttempts.filter(a => a.successful).length, 0);
        const errorsByCategory = {
            network: 0,
            rendering: 0,
            state: 0,
            validation: 0,
            authentication: 0,
            api: 0,
            timeout: 0,
            memory: 0,
            unknown: 0,
        };
        const errorsBySeverity = {
            low: 0,
            medium: 0,
            high: 0,
            critical: 0,
        };
        const errorsByComponent = {};
        events.forEach(e => {
            errorsByCategory[e.category]++;
            errorsBySeverity[e.severity]++;
            if (e.component) {
                errorsByComponent[e.component] = (errorsByComponent[e.component] ?? 0) + 1;
            }
        });
        const recoveryTimes = events
            .filter(e => e.resolved && e.resolvedAt)
            .map(e => e.resolvedAt.getTime() - e.timestamp.getTime());
        return {
            totalErrors: events.length,
            resolvedErrors: events.filter(e => e.resolved).length,
            activeErrors: events.filter(e => !e.resolved).length,
            recoveryAttempts: totalRecoveryAttempts,
            successfulRecoveries,
            recoveryRate: totalRecoveryAttempts > 0
                ? successfulRecoveries / totalRecoveryAttempts
                : 0,
            errorsByCategory,
            errorsBySeverity,
            errorsByComponent,
            avgRecoveryTime: recoveryTimes.length > 0
                ? recoveryTimes.reduce((a, b) => a + b, 0) / recoveryTimes.length
                : 0,
            topErrors: this.getGroups().slice(0, 5),
        };
    }
    /**
     * Get recommendations based on errors
     */
    getRecommendations() {
        const recommendations = [];
        const stats = this.getStats();
        // Check for high network errors
        if (stats.errorsByCategory.network > stats.totalErrors * 0.3) {
            recommendations.push('High network error rate detected. Consider implementing retry logic with exponential backoff.');
        }
        // Check for rendering errors
        if (stats.errorsByCategory.rendering > 0) {
            recommendations.push('Rendering errors detected. Wrap components with Error Boundaries and use Suspense for async operations.');
        }
        // Check for low recovery rate
        if (stats.recoveryRate < 0.5 && stats.recoveryAttempts > 10) {
            recommendations.push('Low recovery success rate. Review recovery strategies and consider adding fallback options.');
        }
        // Check for critical errors
        if (stats.errorsBySeverity.critical > 0) {
            recommendations.push(`${stats.errorsBySeverity.critical} critical error(s) detected. These require immediate attention.`);
        }
        // Check for repeated errors
        const frequentErrors = this.getGroups().filter(g => g.count > 5);
        if (frequentErrors.length > 0) {
            recommendations.push(`${frequentErrors.length} error(s) occur frequently. Address root causes to improve stability.`);
        }
        // Check for authentication errors
        if (stats.errorsByCategory.authentication > 0) {
            recommendations.push('Authentication errors detected. Implement token refresh and session recovery mechanisms.');
        }
        // Check for timeout errors
        if (stats.errorsByCategory.timeout > stats.totalErrors * 0.2) {
            recommendations.push('High timeout error rate. Consider increasing timeout limits or optimizing server response times.');
        }
        if (recommendations.length === 0) {
            recommendations.push('No major issues detected. Error handling appears to be working well.');
        }
        return recommendations;
    }
    /**
     * Add listener for new errors
     */
    addListener(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }
    /**
     * Clear all errors
     */
    clear() {
        this.events = [];
        this.groups.clear();
    }
    /**
     * Enable/disable tracking
     */
    setEnabled(enabled) {
        this.enabled = enabled;
    }
    /**
     * Export data
     */
    export() {
        return JSON.stringify({
            events: this.events.map(e => ({
                ...e,
                error: {
                    name: e.error.name,
                    message: e.error.message,
                    stack: e.error.stack,
                },
            })),
            groups: Array.from(this.groups.entries()),
            stats: this.getStats(),
            recommendations: this.getRecommendations(),
            exportedAt: new Date().toISOString(),
        }, null, 2);
    }
    /**
     * Categorize error based on message and type
     */
    categorizeError(error) {
        const message = error.message.toLowerCase();
        const name = error.name.toLowerCase();
        if (message.includes('network') || message.includes('fetch') || name.includes('network')) {
            return 'network';
        }
        if (message.includes('render') || message.includes('component') || name.includes('react')) {
            return 'rendering';
        }
        if (message.includes('state') || message.includes('reducer') || message.includes('context')) {
            return 'state';
        }
        if (message.includes('valid') || message.includes('schema') || message.includes('type')) {
            return 'validation';
        }
        if (message.includes('auth') || message.includes('token') || message.includes('session')) {
            return 'authentication';
        }
        if (message.includes('api') || message.includes('endpoint') || message.includes('response')) {
            return 'api';
        }
        if (message.includes('timeout') || message.includes('timed out')) {
            return 'timeout';
        }
        if (message.includes('memory') || message.includes('heap') || message.includes('allocation')) {
            return 'memory';
        }
        return 'unknown';
    }
    /**
     * Generate fingerprint for error grouping
     */
    generateFingerprint(error, category) {
        // Use error message and first stack frame for fingerprint
        const stackLines = (error.stack ?? '').split('\n');
        const firstFrame = stackLines[1] ?? '';
        const key = `${category}:${error.name}:${error.message}:${firstFrame}`;
        return this.hashString(key);
    }
    /**
     * Simple hash function
     */
    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(36);
    }
    /**
     * Update error group
     */
    updateGroup(event) {
        let group = this.groups.get(event.fingerprint);
        if (!group) {
            group = {
                fingerprint: event.fingerprint,
                category: event.category,
                message: event.error.message,
                count: 0,
                firstSeen: event.timestamp,
                lastSeen: event.timestamp,
                events: [],
                recoveryRate: 0,
            };
            this.groups.set(event.fingerprint, group);
        }
        group.count++;
        group.lastSeen = event.timestamp;
        group.events.push(event);
        // Keep only last 50 events per group
        if (group.events.length > 50) {
            group.events.shift();
        }
    }
    /**
     * Log error to console
     */
    logError(event) {
        const severityColors = {
            low: chalk.gray,
            medium: chalk.yellow,
            high: chalk.red,
            critical: chalk.bgRed.white,
        };
        const color = severityColors[event.severity];
        const icon = event.severity === 'critical' ? '💀' : event.severity === 'high' ? '🔥' : event.severity === 'medium' ? '⚠️' : 'ℹ️';
        console.log('');
        console.log(color(`${icon} [${event.severity.toUpperCase()}] ${event.category}: ${event.error.message}`));
        if (event.component) {
            console.log(chalk.gray(`   Component: ${event.component}`));
        }
        console.log('');
    }
    /**
     * Generate unique ID
     */
    generateId() {
        return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    /**
     * Print report
     */
    printReport() {
        const stats = this.getStats();
        console.log('');
        console.log(errorBox('Error Recovery Dashboard', '🛡️ Error Tracker'));
        console.log('');
        // Overview
        const overviewData = {
            'Total Errors': chalk.cyan(stats.totalErrors.toString()),
            'Active': stats.activeErrors > 0
                ? chalk.red(stats.activeErrors.toString())
                : chalk.green('0'),
            'Resolved': chalk.green(stats.resolvedErrors.toString()),
            'Recovery Rate': stats.recoveryRate >= 0.8
                ? chalk.green((stats.recoveryRate * 100).toFixed(1) + '%')
                : stats.recoveryRate >= 0.5
                    ? chalk.yellow((stats.recoveryRate * 100).toFixed(1) + '%')
                    : chalk.red((stats.recoveryRate * 100).toFixed(1) + '%'),
            'Avg Recovery Time': chalk.cyan(stats.avgRecoveryTime.toFixed(0) + 'ms'),
        };
        console.log(keyValueTable(overviewData));
        console.log('');
        // By severity
        console.log(infoBox('Errors by Severity', '📊 Severity'));
        const severityData = {};
        if (stats.errorsBySeverity.critical > 0) {
            severityData['💀 Critical'] = chalk.red(stats.errorsBySeverity.critical.toString());
        }
        if (stats.errorsBySeverity.high > 0) {
            severityData['🔥 High'] = chalk.red(stats.errorsBySeverity.high.toString());
        }
        if (stats.errorsBySeverity.medium > 0) {
            severityData['⚠️ Medium'] = chalk.yellow(stats.errorsBySeverity.medium.toString());
        }
        if (stats.errorsBySeverity.low > 0) {
            severityData['ℹ️ Low'] = chalk.gray(stats.errorsBySeverity.low.toString());
        }
        if (Object.keys(severityData).length > 0) {
            console.log(keyValueTable(severityData));
        }
        else {
            console.log(chalk.green('  No errors!'));
        }
        console.log('');
        // Top errors
        if (stats.topErrors.length > 0) {
            console.log(warningBox('Top Recurring Errors', '🔄 Frequent'));
            console.log('');
            const columns = [
                { header: 'Category', width: 15, color: chalk.yellow },
                { header: 'Message', width: 40 },
                { header: 'Count', width: 8, align: 'right', color: chalk.cyan },
                { header: 'Recovery', width: 10, align: 'right' },
            ];
            const tableData = stats.topErrors.map(g => [
                g.category,
                g.message.substring(0, 40),
                g.count.toString(),
                (g.recoveryRate * 100).toFixed(0) + '%',
            ]);
            console.log(table(tableData, columns));
            console.log('');
        }
        // Recommendations
        const recommendations = this.getRecommendations();
        console.log(successBox('Recommendations', '💡 Tips'));
        console.log('');
        recommendations.forEach((rec, i) => {
            console.log(chalk.cyan(`  ${i + 1}. ${rec}`));
        });
        console.log('');
    }
}
// Global instance
let globalTracker = null;
/**
 * Get the global error tracker instance
 */
export function getErrorTracker() {
    if (!globalTracker) {
        globalTracker = new ErrorTracker({
            enabled: process.env.NODE_ENV === 'development',
        });
    }
    return globalTracker;
}
/**
 * Create a new error tracker instance
 */
export function createErrorTracker(options) {
    return new ErrorTracker(options);
}
export default ErrorTracker;
//# sourceMappingURL=error-tracker.js.map