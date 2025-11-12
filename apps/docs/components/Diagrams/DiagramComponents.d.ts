/**
 * Reusable SVG Diagram Components
 *
 * Consistent, brand-aligned visual elements for documentation
 */
import { ReactNode } from 'react';
declare const colors: {
    brand: string;
    brandLight: string;
    brandDark: string;
    success: string;
    warning: string;
    error: string;
    neutral: string;
    neutralLight: string;
    background: string;
    backgroundDark: string;
};
interface BoxNodeProps {
    x: number;
    y: number;
    width: number;
    height: number;
    label: string | ReactNode;
    color?: string;
    icon?: ReactNode;
    animate?: boolean;
    delay?: number;
}
export declare function BoxNode({ x, y, width, height, label, color, icon, animate, delay, }: BoxNodeProps): import("react/jsx-runtime").JSX.Element;
interface ArrowProps {
    from: {
        x: number;
        y: number;
    };
    to: {
        x: number;
        y: number;
    };
    color?: string;
    dashed?: boolean;
    animated?: boolean;
    label?: string;
    delay?: number;
}
export declare function Arrow({ from, to, color, dashed, animated, label, delay, }: ArrowProps): import("react/jsx-runtime").JSX.Element;
interface IconBadgeProps {
    icon: ReactNode;
    color?: string;
    size?: 'sm' | 'md' | 'lg';
}
export declare function IconBadge({ icon, color, size }: IconBadgeProps): import("react/jsx-runtime").JSX.Element;
interface StepIndicatorProps {
    steps: Array<{
        number: number;
        label: string;
        description?: string;
        complete?: boolean;
    }>;
    currentStep?: number;
    orientation?: 'horizontal' | 'vertical';
}
export declare function StepIndicator({ steps, currentStep, orientation, }: StepIndicatorProps): import("react/jsx-runtime").JSX.Element;
interface FeatureGridProps {
    features: Array<{
        icon: ReactNode;
        title: string;
        description: string;
        highlight?: boolean;
    }>;
    columns?: 2 | 3 | 4;
}
export declare function FeatureGrid({ features, columns }: FeatureGridProps): import("react/jsx-runtime").JSX.Element;
interface ComparisonTableProps {
    headers: string[];
    rows: Array<{
        label: string;
        values: Array<string | boolean | ReactNode>;
    }>;
}
export declare function ComparisonTable({ headers, rows }: ComparisonTableProps): import("react/jsx-runtime").JSX.Element;
interface FlowStepProps {
    steps: Array<{
        icon?: ReactNode;
        title: string;
        description?: string;
    }>;
    compact?: boolean;
}
export declare function FlowStep({ steps, compact }: FlowStepProps): import("react/jsx-runtime").JSX.Element;
interface PulsingDotProps {
    color?: string;
    size?: 'sm' | 'md' | 'lg';
}
export declare function PulsingDot({ color, size }: PulsingDotProps): import("react/jsx-runtime").JSX.Element;
interface HighlightBoxProps {
    children: ReactNode;
    color?: 'brand' | 'success' | 'warning' | 'error';
    icon?: ReactNode;
    title?: string;
}
export declare function HighlightBox({ children, color, icon, title }: HighlightBoxProps): import("react/jsx-runtime").JSX.Element;
interface AnimatedCounterProps {
    value: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
}
export declare function AnimatedCounter({ value, duration, suffix, prefix, }: AnimatedCounterProps): import("react/jsx-runtime").JSX.Element;
export { colors };
//# sourceMappingURL=DiagramComponents.d.ts.map