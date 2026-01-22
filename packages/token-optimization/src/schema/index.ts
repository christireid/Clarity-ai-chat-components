/**
 * Function Schema Optimization
 *
 * Week 7: Optimize OpenAI/Anthropic function schemas to reduce token usage
 * while maintaining functionality.
 *
 * Features:
 * - JSON schema optimization (remove unnecessary properties)
 * - Description shortening
 * - Nested schema flattening
 * - Token analysis and recommendations
 * - Batch optimization
 *
 * @module schema
 */

// ============================================================================
// Schema Optimizer
// ============================================================================

export {
  SchemaOptimizer,
  optimizeSchema,
  analyzeSchema,
  optimizeBatch,
  OPTIMIZATION_PRESETS,
} from './schema-optimizer'

export type {
  JSONSchema,
  JSONSchemaType,
  FunctionSchema,
  ToolSchema,
  SchemaOptimizationConfig,
  OptimizationResult,
  SchemaAnalysis,
} from './schema-optimizer'
