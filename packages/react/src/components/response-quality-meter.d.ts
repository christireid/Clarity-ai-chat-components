import * as React from 'react';
export interface ResponseQualityMetric {
    id: string;
    label: string;
    score: number;
    target?: number;
    description?: string;
}
export interface ResponseQualityMeterProps {
    metrics: ResponseQualityMetric[];
    overallLabel?: string;
    overallScore?: number;
    className?: string;
    title?: string;
    subtitle?: string;
    scaleLabel?: string;
}
export declare const ResponseQualityMeter: React.FC<ResponseQualityMeterProps>;
//# sourceMappingURL=response-quality-meter.d.ts.map