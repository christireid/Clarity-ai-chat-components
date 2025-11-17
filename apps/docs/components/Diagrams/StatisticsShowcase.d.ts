/**
 * Statistics Showcase
 *
 * Animated statistics display with counters
 */
interface Stat {
    value: number;
    suffix?: string;
    prefix?: string;
    label: string;
    description?: string;
    color?: string;
}
interface StatisticsShowcaseProps {
    stats: Stat[];
    title?: string;
    columns?: 2 | 3 | 4;
}
export declare function StatisticsShowcase({ stats, title, columns }: StatisticsShowcaseProps): import("react/jsx-runtime").JSX.Element;
export declare function LibraryStats(): import("react/jsx-runtime").JSX.Element;
export declare function PerformanceStats(): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=StatisticsShowcase.d.ts.map