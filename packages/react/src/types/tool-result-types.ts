/**
 * TypeScript Type Definitions for Common Tool Results
 * 
 * Provides type-safe interfaces for common tool result shapes.
 * Use these types when creating tool UI components.
 */

/**
 * Weather Tool Result
 */
export interface WeatherToolResult {
  location: string
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  feelsLike?: number
  icon?: string
  forecast?: Array<{
    date: string
    high: number
    low: number
    condition: string
  }>
}

/**
 * Search Tool Result
 */
export interface SearchToolResult {
  query: string
  results: Array<{
    title: string
    snippet: string
    url: string
    relevance?: number
  }>
  totalResults?: number
  searchTime?: number
}

/**
 * Calculator Tool Result
 */
export interface CalculatorToolResult {
  expression: string
  result: number
  steps?: string[]
  error?: string
}

/**
 * Database Query Tool Result
 */
export interface DatabaseQueryToolResult {
  query: string
  rows: Record<string, any>[]
  rowCount: number
  columns?: string[]
  executionTime?: number
}

/**
 * API Call Tool Result
 */
export interface APICallToolResult {
  url: string
  method: string
  status: number
  statusText: string
  data: unknown
  headers?: Record<string, string>
  responseTime?: number
}

/**
 * Code Execution Tool Result
 */
export interface CodeExecutionToolResult {
  code: string
  language: string
  output?: string
  error?: string
  executionTime?: number
  memoryUsage?: number
}

/**
 * Price Comparison Tool Result
 */
export interface PriceComparisonToolResult {
  productId: string
  comparisons: Array<{
    store: string
    price: number
    availability: boolean
    url?: string
    shippingCost?: number
  }>
}

/**
 * Review Summary Tool Result
 */
export interface ReviewSummaryToolResult {
  productId: string
  averageRating: number
  totalReviews: number
  summary: string
  topPros: string[]
  topCons: string[]
  ratingDistribution?: Record<number, number>
}

/**
 * FAQ Search Tool Result
 */
export interface FAQSearchToolResult {
  query: string
  results: Array<{
    question: string
    answer: string
    relevance: number
    category?: string
  }>
}

/**
 * File Read Tool Result
 */
export interface FileReadToolResult {
  path: string
  content: string
  size: number
  encoding: string
  mimeType?: string
}

/**
 * Generic Tool Result
 * 
 * Use this for tools that don't have a specific type defined.
 */
export interface GenericToolResult {
  toolName: string
  data: unknown
  success: boolean
  error?: string
  metadata?: Record<string, unknown>
}

/**
 * Type guard to check if result matches a specific tool result type
 */
export function isWeatherToolResult(result: unknown): result is WeatherToolResult {
  return (
    typeof result === 'object' &&
    result !== null &&
    typeof result.location === 'string' &&
    typeof result.temperature === 'number' &&
    typeof result.condition === 'string'
  )
}

export function isSearchToolResult(result: unknown): result is SearchToolResult {
  return (
    typeof result === 'object' &&
    result !== null &&
    typeof result.query === 'string' &&
    Array.isArray(result.results)
  )
}

export function isCalculatorToolResult(result: unknown): result is CalculatorToolResult {
  return (
    typeof result === 'object' &&
    result !== null &&
    typeof result.expression === 'string' &&
    typeof result.result === 'number'
  )
}

/**
 * Extract tool name from tool call
 */
export function getToolName(toolCall: { function: { name: string } }): string {
  return toolCall.function.name
}

/**
 * Parse tool arguments safely
 */
export function parseToolArguments(toolCall: { function: { arguments: string } }): Record<string, unknown> {
  try {
    const parsed = JSON.parse(toolCall.function.arguments)
    return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)
      ? parsed as Record<string, unknown>
      : {}
  } catch {
    return {}
  }
}

/**
 * Validate tool result structure
 */
export function validateToolResult(
  result: unknown,
  requiredFields: string[]
): { valid: boolean; missingFields?: string[] } {
  if (typeof result !== 'object' || result === null) {
    return { valid: false, missingFields: requiredFields }
  }

  const missingFields = requiredFields.filter((field) => !(field in result))

  return {
    valid: missingFields.length === 0,
    missingFields: missingFields.length > 0 ? missingFields : undefined,
  }
}
