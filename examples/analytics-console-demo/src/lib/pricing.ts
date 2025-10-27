/**
 * AI Model Pricing (per 1,000 tokens)
 * Updated: 2025-10-27
 */

import type { PricingInfo } from '../types/analytics'

export const PRICING_TABLE: Record<string, PricingInfo> = {
  // OpenAI
  'gpt-4-turbo': { input: 0.01, output: 0.03 },
  'gpt-4': { input: 0.03, output: 0.06 },
  'gpt-3.5-turbo': { input: 0.0015, output: 0.002 },
  
  // Anthropic
  'claude-3-opus': { input: 0.015, output: 0.075 },
  'claude-3-sonnet': { input: 0.003, output: 0.015 },
  'claude-3-haiku': { input: 0.00025, output: 0.00125 },
  'claude-3-5-sonnet': { input: 0.003, output: 0.015 },
  
  // Google
  'gemini-pro': { input: 0.00025, output: 0.0005 },
  'gemini-1.5-pro': { input: 0.00125, output: 0.00375 },
  'gemini-1.5-flash': { input: 0.000075, output: 0.0003 },
}

/**
 * Calculate cost for a request
 */
export function calculateCost(
  promptTokens: number,
  completionTokens: number,
  model: string
): number {
  const pricing = PRICING_TABLE[model] || { input: 0.001, output: 0.002 }
  
  const inputCost = (promptTokens * pricing.input) / 1000
  const outputCost = (completionTokens * pricing.output) / 1000
  
  return inputCost + outputCost
}

/**
 * Get pricing info for a model
 */
export function getPricing(model: string): PricingInfo | null {
  return PRICING_TABLE[model] || null
}

/**
 * Get all models grouped by provider
 */
export function getModelsByProvider(): Record<string, string[]> {
  return {
    openai: ['gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'],
    anthropic: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku', 'claude-3-5-sonnet'],
    google: ['gemini-pro', 'gemini-1.5-pro', 'gemini-1.5-flash'],
  }
}
