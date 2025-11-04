/**
 * Model Selector Component
 * Dropdown to select AI models with provider grouping
 */
interface Model {
    id: string;
    name: string;
    provider: string;
    description?: string;
}
interface ModelSelectorProps {
    models: Model[];
    selectedModel: string;
    onModelChange: (modelId: string) => void;
    className?: string;
}
export declare function ModelSelector({ models, selectedModel, onModelChange, className, }: ModelSelectorProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ModelSelector.d.ts.map