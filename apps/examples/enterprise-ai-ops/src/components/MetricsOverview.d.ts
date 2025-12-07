interface MetricsOverviewProps {
    metrics: {
        totalRequests: number;
        successRate: number;
        avgLatency: number;
        p95Latency: number;
        errorRate: number;
        activeUsers: number;
        tokensUsed: number;
        tokensSaved: number;
        costSaved: number;
        safetyViolations: number;
        qualityScore: number;
    };
}
export declare function MetricsOverview({ metrics }: MetricsOverviewProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=MetricsOverview.d.ts.map