import * as React from 'react';
import { ResponseQualityMeter } from '../response-quality-meter';
export interface EvaluationMetricItem {
    id: string;
    label: string;
    value: string;
    trend?: 'up' | 'down' | 'flat';
    change?: string;
}
export interface EvaluationSparkline {
    id: string;
    label: string;
    percentage: number;
    objective?: number;
}
export interface EvaluationDashboardProps {
    metrics: EvaluationMetricItem[];
    sparklines?: EvaluationSparkline[];
    quality?: React.ComponentProps<typeof ResponseQualityMeter>;
    className?: string;
}
export declare const EvaluationDashboard: React.FC<EvaluationDashboardProps>;
//# sourceMappingURL=EvaluationDashboard.d.ts.map