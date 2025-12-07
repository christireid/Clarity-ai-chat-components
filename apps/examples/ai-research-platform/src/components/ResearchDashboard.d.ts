interface Message {
    role: string;
    citations?: Array<{
        id: string;
        source: string;
    }>;
}
interface Metrics {
    tokensSaved?: number;
    totalTokens?: number;
    savingsPercent?: number;
}
interface ResearchDashboardProps {
    messages: Message[];
    metrics: Metrics;
    researchTopic: string;
}
export declare function ResearchDashboard({ messages, metrics, researchTopic }: ResearchDashboardProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=ResearchDashboard.d.ts.map