/**
 * Token Analytics Monitor
 * Tracks token usage and provides analytics
 */
class TokenAnalyticsMonitor {
    events = [];
    maxEvents = 1000;
    track(event) {
        this.events.push({
            ...event,
            timestamp: new Date(),
        });
        // Keep only recent events
        if (this.events.length > this.maxEvents) {
            this.events = this.events.slice(-this.maxEvents);
        }
    }
    getAnalytics() {
        const inputTokens = this.events
            .filter((e) => e.operation === 'input')
            .reduce((sum, e) => sum + e.tokens, 0);
        const outputTokens = this.events
            .filter((e) => e.operation === 'output')
            .reduce((sum, e) => sum + e.tokens, 0);
        return {
            totalTokens: inputTokens + outputTokens,
            inputTokens,
            outputTokens,
            eventCount: this.events.length,
        };
    }
    clear() {
        this.events = [];
    }
}
export const tokenAnalyticsMonitor = new TokenAnalyticsMonitor();
//# sourceMappingURL=token-analytics.js.map