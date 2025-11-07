/**
 * Anthropic Model Adapter
 *
 * Adapter for Anthropic's Claude models
 */
import type { ModelAdapter } from './types';
export declare const anthropicAdapter: ModelAdapter;
export declare const anthropicModels: ({
    id: string;
    name: string;
    provider: "anthropic";
    speed: "medium";
    cost: "high";
    quality: "best";
    contextWindow: number;
    description: string;
    streaming: boolean;
    toolCalling: boolean;
    vision: boolean;
} | {
    id: string;
    name: string;
    provider: "anthropic";
    speed: "fast";
    cost: "medium";
    quality: "excellent";
    contextWindow: number;
    description: string;
    streaming: boolean;
    toolCalling: boolean;
    vision: boolean;
} | {
    id: string;
    name: string;
    provider: "anthropic";
    speed: "fast";
    cost: "low";
    quality: "good";
    contextWindow: number;
    description: string;
    streaming: boolean;
    toolCalling: boolean;
    vision: boolean;
})[];
//# sourceMappingURL=anthropic.d.ts.map