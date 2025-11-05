/**
 * Model Adapters
 *
 * Export all model adapters and utilities
 */
export * from './types';
export { openAIAdapter, openAIModels } from './openai';
export { anthropicAdapter, anthropicModels } from './anthropic';
export { googleAdapter, googleModels } from './google';
export declare const allModels: ({
    id: string;
    name: string;
    provider: "openai";
    speed: "fast";
    cost: "medium";
    quality: "best";
    contextWindow: number;
    description: string;
    streaming: boolean;
    toolCalling: boolean;
    vision: boolean;
} | {
    id: string;
    name: string;
    provider: "openai";
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
    provider: "openai";
    speed: "fast";
    cost: "low";
    quality: "good";
    contextWindow: number;
    description: string;
    streaming: boolean;
    toolCalling: boolean;
    vision: boolean;
} | {
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
} | {
    id: string;
    name: string;
    provider: "google";
    speed: "medium";
    cost: "medium";
    quality: "best";
    contextWindow: number;
    description: string;
    streaming: boolean;
    toolCalling: boolean;
    vision: boolean;
} | {
    id: string;
    name: string;
    provider: "google";
    speed: "fast";
    cost: "low";
    quality: "good";
    contextWindow: number;
    description: string;
    streaming: boolean;
    toolCalling: boolean;
    vision: boolean;
})[];
import type { ModelAdapter } from './types';
export declare function getAdapter(provider: string): ModelAdapter;
//# sourceMappingURL=index.d.ts.map