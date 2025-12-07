/**
 * AI Model Pricing (per 1,000 tokens)
 * Updated: 2025-10-27
 */
import type { PricingInfo } from '../types/analytics';
export declare const PRICING_TABLE: Record<string, PricingInfo>;
/**
 * Calculate cost for a request
 */
export declare function calculateCost(promptTokens: number, completionTokens: number, model: string): number;
/**
 * Get pricing info for a model
 */
export declare function getPricing(model: string): PricingInfo | null;
/**
 * Get all models grouped by provider
 */
export declare function getModelsByProvider(): Record<string, string[]>;
//# sourceMappingURL=pricing.d.ts.map