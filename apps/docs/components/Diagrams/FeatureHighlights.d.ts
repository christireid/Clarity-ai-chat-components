/**
 * Feature Highlights Infographic
 *
 * Visual showcase of key features
 */
interface Feature {
    icon: React.ReactNode;
    title: string;
    description: string;
    stat?: string;
    color: string;
}
interface FeatureHighlightsProps {
    features: Feature[];
    title?: string;
    subtitle?: string;
    columns?: 2 | 3 | 4;
}
export declare function FeatureHighlights({ features, title, subtitle, columns, }: FeatureHighlightsProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=FeatureHighlights.d.ts.map