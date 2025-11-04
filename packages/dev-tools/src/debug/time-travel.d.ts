/**
 * Time-Travel Debugging for AI Chat Applications
 * Record and replay conversation states for debugging
 */
export interface StateSnapshot {
    id: string;
    timestamp: Date;
    messages: any[];
    config: any;
    metadata: Record<string, any>;
    label?: string;
}
export interface StateTransition {
    from: string;
    to: string;
    action: string;
    timestamp: Date;
    diff: any;
}
/**
 * Time-travel debugger for chat state
 */
export declare class TimeTravelDebugger {
    private snapshots;
    private transitions;
    private currentIndex;
    private maxSnapshots;
    constructor(options?: {
        maxSnapshots?: number;
    });
    /**
     * Record a state snapshot
     */
    record(messages: any[], config: any, metadata?: Record<string, any>, label?: string): string;
    /**
     * Jump to a specific snapshot
     */
    jumpTo(snapshotId: string): StateSnapshot | null;
    /**
     * Go back N steps
     */
    goBack(steps?: number): StateSnapshot | null;
    /**
     * Go forward N steps
     */
    goForward(steps?: number): StateSnapshot | null;
    /**
     * Get current snapshot
     */
    getCurrent(): StateSnapshot | null;
    /**
     * Get all snapshots
     */
    getAll(): StateSnapshot[];
    /**
     * Get snapshot timeline
     */
    getTimeline(): Array<{
        snapshot: StateSnapshot;
        transition?: StateTransition;
        isCurrent: boolean;
    }>;
    /**
     * Search snapshots
     */
    search(query: string): StateSnapshot[];
    /**
     * Export session for sharing/analysis
     */
    export(): string;
    /**
     * Import session
     */
    import(data: string): void;
    /**
     * Clear all history
     */
    clear(): void;
    /**
     * Get statistics
     */
    getStats(): {
        totalSnapshots: number;
        totalTransitions: number;
        timeSpan: number;
        averageMessageCount: number;
        actionCounts: Record<string, number>;
    };
    /**
     * Private: Generate unique ID
     */
    private generateId;
    /**
     * Private: Infer action from state changes
     */
    private inferAction;
    /**
     * Private: Calculate diff between snapshots
     */
    private calculateDiff;
}
/**
 * React Hook for time-travel debugging
 */
export declare function createTimeTravelHook(timeTravel: TimeTravelDebugger): {
    record: (messages: any[], config: any, label?: string) => string;
    goBack: () => StateSnapshot | null;
    goForward: () => StateSnapshot | null;
    jumpTo: (id: string) => StateSnapshot | null;
    getCurrent: () => StateSnapshot | null;
    getTimeline: () => {
        snapshot: StateSnapshot;
        transition?: StateTransition;
        isCurrent: boolean;
    }[];
    export: () => string;
    import: (data: string) => void;
};
/**
 * Visual timeline renderer
 */
export declare function renderTimeline(timeTravel: TimeTravelDebugger): string;
//# sourceMappingURL=time-travel.d.ts.map