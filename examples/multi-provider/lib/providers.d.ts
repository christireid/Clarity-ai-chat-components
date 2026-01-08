/**
 * Provider configuration and model definitions
 */
export type ProviderType = 'openai' | 'anthropic' | 'google';
export interface ModelInfo {
    id: string;
    name: string;
    provider: ProviderType;
    contextWindow: number;
    maxOutput: number;
    description: string;
    costPer1kInput: number;
    costPer1kOutput: number;
}
export declare const PROVIDERS: Record<ProviderType, {
    name: string;
    icon: string;
    color: string;
    description: string;
}>;
export declare const MODELS: ModelInfo[];
export declare function getModelsByProvider(provider: ProviderType): ModelInfo[];
export declare function getModelById(id: string): ModelInfo | undefined;
//# sourceMappingURL=providers.d.ts.map