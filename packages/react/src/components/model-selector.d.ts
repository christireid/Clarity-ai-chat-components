/**
 * Model Selector Component
 *
 * Dropdown to switch between AI models with metrics (speed, cost, quality)
 */
import type { ModelConfig, ModelInfo } from '../adapters/types';
export interface ModelSelectorProps {
    /** Available models */
    models: ModelInfo[];
    /** Currently selected model ID */
    value: string;
    /** Callback when model is selected */
    onChange: (modelId: string, config: ModelConfig) => void;
    /** Additional CSS class */
    className?: string;
    /** Show speed/cost/quality badges */
    showMetrics?: boolean;
    /** Disabled state */
    disabled?: boolean;
    /** Show extended info */
    showDescription?: boolean;
}
export declare function ModelSelector({ models, value, onChange, className, showMetrics, disabled, showDescription }: ModelSelectorProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=model-selector.d.ts.map