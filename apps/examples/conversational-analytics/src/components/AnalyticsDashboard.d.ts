interface ChartData {
    title: string;
    data: Array<{
        region: string;
        sales: number;
    }>;
}
interface Insight {
    text: string;
    confidence?: number;
}
interface AnalyticsDashboardProps {
    charts: ChartData[];
    insights: Insight[];
    currentQuery: string;
}
export declare function AnalyticsDashboard({ charts, insights, currentQuery }: AnalyticsDashboardProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=AnalyticsDashboard.d.ts.map