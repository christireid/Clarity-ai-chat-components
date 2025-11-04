/**
 * Google AI Model Adapter
 *
 * Adapter for Google's Gemini models
 */
import type { ModelAdapter } from './types';
export declare const googleAdapter: ModelAdapter;
export declare const googleModels: ({
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
//# sourceMappingURL=google.d.ts.map