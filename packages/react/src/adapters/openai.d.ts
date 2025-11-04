/**
 * OpenAI Model Adapter
 *
 * Adapter for OpenAI's GPT models (GPT-4, GPT-3.5, etc.)
 */
import type { ModelAdapter } from './types';
export declare const openAIAdapter: ModelAdapter;
export declare const openAIModels: ({
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
})[];
//# sourceMappingURL=openai.d.ts.map