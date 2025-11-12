/**
 * Time-Travel Debugging for AI Chat Applications
 * Record and replay conversation states for debugging
 */
/**
 * Time-travel debugger for chat state
 */
export class TimeTravelDebugger {
    constructor(options) {
        this.snapshots = [];
        this.transitions = [];
        this.currentIndex = -1;
        this.maxSnapshots = 100;
        if (options?.maxSnapshots) {
            this.maxSnapshots = options.maxSnapshots;
        }
    }
    /**
     * Record a state snapshot
     */
    record(messages, config, metadata, label) {
        const snapshot = {
            id: this.generateId(),
            timestamp: new Date(),
            messages: JSON.parse(JSON.stringify(messages)), // Deep clone
            config: JSON.parse(JSON.stringify(config)),
            metadata: metadata || {},
            label,
        };
        // Record transition if there's a previous state
        if (this.currentIndex >= 0) {
            const previousSnapshot = this.snapshots[this.currentIndex];
            const transition = {
                from: previousSnapshot.id,
                to: snapshot.id,
                action: this.inferAction(previousSnapshot, snapshot),
                timestamp: new Date(),
                diff: this.calculateDiff(previousSnapshot, snapshot),
            };
            this.transitions.push(transition);
        }
        this.snapshots.push(snapshot);
        this.currentIndex = this.snapshots.length - 1;
        // Maintain max snapshots limit
        if (this.snapshots.length > this.maxSnapshots) {
            this.snapshots.shift();
            this.currentIndex--;
        }
        return snapshot.id;
    }
    /**
     * Jump to a specific snapshot
     */
    jumpTo(snapshotId) {
        const index = this.snapshots.findIndex(s => s.id === snapshotId);
        if (index === -1)
            return null;
        this.currentIndex = index;
        return this.snapshots[index];
    }
    /**
     * Go back N steps
     */
    goBack(steps = 1) {
        const newIndex = Math.max(0, this.currentIndex - steps);
        this.currentIndex = newIndex;
        return this.snapshots[newIndex];
    }
    /**
     * Go forward N steps
     */
    goForward(steps = 1) {
        const newIndex = Math.min(this.snapshots.length - 1, this.currentIndex + steps);
        this.currentIndex = newIndex;
        return this.snapshots[newIndex];
    }
    /**
     * Get current snapshot
     */
    getCurrent() {
        return this.currentIndex >= 0 ? this.snapshots[this.currentIndex] : null;
    }
    /**
     * Get all snapshots
     */
    getAll() {
        return [...this.snapshots];
    }
    /**
     * Get snapshot timeline
     */
    getTimeline() {
        return this.snapshots.map((snapshot, index) => ({
            snapshot,
            transition: this.transitions.find(t => t.to === snapshot.id),
            isCurrent: index === this.currentIndex,
        }));
    }
    /**
     * Search snapshots
     */
    search(query) {
        return this.snapshots.filter(snapshot => {
            const searchString = JSON.stringify(snapshot).toLowerCase();
            return searchString.includes(query.toLowerCase());
        });
    }
    /**
     * Export session for sharing/analysis
     */
    export() {
        return JSON.stringify({
            snapshots: this.snapshots,
            transitions: this.transitions,
            currentIndex: this.currentIndex,
            exportedAt: new Date().toISOString(),
        }, null, 2);
    }
    /**
     * Import session
     */
    import(data) {
        try {
            const parsed = JSON.parse(data);
            this.snapshots = parsed.snapshots;
            this.transitions = parsed.transitions;
            this.currentIndex = parsed.currentIndex;
        }
        catch (error) {
            throw new Error('Invalid import data');
        }
    }
    /**
     * Clear all history
     */
    clear() {
        this.snapshots = [];
        this.transitions = [];
        this.currentIndex = -1;
    }
    /**
     * Get statistics
     */
    getStats() {
        const actionCounts = {};
        this.transitions.forEach(t => {
            actionCounts[t.action] = (actionCounts[t.action] || 0) + 1;
        });
        const timeSpan = this.snapshots.length > 1
            ? this.snapshots[this.snapshots.length - 1].timestamp.getTime() -
                this.snapshots[0].timestamp.getTime()
            : 0;
        const averageMessageCount = this.snapshots.length > 0
            ? this.snapshots.reduce((sum, s) => sum + s.messages.length, 0) / this.snapshots.length
            : 0;
        return {
            totalSnapshots: this.snapshots.length,
            totalTransitions: this.transitions.length,
            timeSpan,
            averageMessageCount,
            actionCounts,
        };
    }
    /**
     * Private: Generate unique ID
     */
    generateId() {
        return `snapshot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    /**
     * Private: Infer action from state changes
     */
    inferAction(prev, curr) {
        if (curr.messages.length > prev.messages.length) {
            return 'MESSAGE_ADDED';
        }
        if (curr.messages.length < prev.messages.length) {
            return 'MESSAGE_REMOVED';
        }
        if (JSON.stringify(curr.config) !== JSON.stringify(prev.config)) {
            return 'CONFIG_CHANGED';
        }
        return 'STATE_UPDATED';
    }
    /**
     * Private: Calculate diff between snapshots
     */
    calculateDiff(prev, curr) {
        const diff = {};
        // Message diff
        if (curr.messages.length !== prev.messages.length) {
            diff.messages = {
                added: curr.messages.length - prev.messages.length,
                total: curr.messages.length,
            };
        }
        // Config diff
        const prevConfig = JSON.stringify(prev.config);
        const currConfig = JSON.stringify(curr.config);
        if (prevConfig !== currConfig) {
            diff.config = {
                changed: true,
                keys: Object.keys(curr.config).filter(key => JSON.stringify(curr.config[key]) !== JSON.stringify(prev.config[key])),
            };
        }
        return diff;
    }
}
/**
 * React Hook for time-travel debugging
 */
export function createTimeTravelHook(timeTravel) {
    return {
        record: (messages, config, label) => {
            return timeTravel.record(messages, config, {}, label);
        },
        goBack: () => timeTravel.goBack(),
        goForward: () => timeTravel.goForward(),
        jumpTo: (id) => timeTravel.jumpTo(id),
        getCurrent: () => timeTravel.getCurrent(),
        getTimeline: () => timeTravel.getTimeline(),
        export: () => timeTravel.export(),
        import: (data) => timeTravel.import(data),
    };
}
/**
 * Visual timeline renderer
 */
export function renderTimeline(timeTravel) {
    const timeline = timeTravel.getTimeline();
    const lines = [];
    lines.push('═'.repeat(80));
    lines.push('TIME-TRAVEL DEBUGGER TIMELINE');
    lines.push('═'.repeat(80));
    lines.push('');
    timeline.forEach((entry, index) => {
        const { snapshot, transition, isCurrent } = entry;
        const marker = isCurrent ? '▶' : ' ';
        const time = snapshot.timestamp.toLocaleTimeString();
        const label = snapshot.label || snapshot.id.substr(0, 12);
        lines.push(`${marker} [${index}] ${time} - ${label}`);
        lines.push(`   Messages: ${snapshot.messages.length} | Config: ${Object.keys(snapshot.config).length} keys`);
        if (transition) {
            lines.push(`   Action: ${transition.action}`);
            if (transition.diff.messages) {
                lines.push(`   └─ +${transition.diff.messages.added} messages`);
            }
            if (transition.diff.config) {
                lines.push(`   └─ Config changed: ${transition.diff.config.keys.join(', ')}`);
            }
        }
        lines.push('');
    });
    const stats = timeTravel.getStats();
    lines.push('─'.repeat(80));
    lines.push(`Total Snapshots: ${stats.totalSnapshots} | Time Span: ${Math.round(stats.timeSpan / 1000)}s`);
    lines.push(`Average Messages: ${stats.averageMessageCount.toFixed(1)}`);
    lines.push('');
    return lines.join('\n');
}
//# sourceMappingURL=time-travel.js.map