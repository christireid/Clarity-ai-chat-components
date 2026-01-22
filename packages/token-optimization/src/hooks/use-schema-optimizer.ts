/**
 * useSchemaOptimizer Hook
 *
 * React hooks for optimizing function schemas to reduce token usage.
 */

import { useState, useCallback, useMemo } from 'react'
import {
  SchemaOptimizer,
  optimizeSchema,
  analyzeSchema,
  optimizeBatch,
  type FunctionSchema,
  type ToolSchema,
  type SchemaOptimizationConfig,
  type OptimizationResult,
  type SchemaAnalysis,
} from '../schema'

/**
 * Hook configuration
 */
export interface UseSchemaOptimizerConfig extends SchemaOptimizationConfig {
  /** Preset to use */
  preset?: 'conservative' | 'balanced' | 'aggressive'
  /** Auto-optimize on schema change */
  autoOptimize?: boolean
}

/**
 * Optimization state
 */
export interface SchemaOptimizationState {
  /** Optimized schema */
  optimizedSchema: FunctionSchema | ToolSchema | null
  /** Original tokens */
  tokensBefore: number
  /** Optimized tokens */
  tokensAfter: number
  /** Tokens saved */
  tokensSaved: number
  /** Percentage saved */
  percentageSaved: number
  /** Applied optimizations */
  optimizations: string[]
  /** Schema analysis */
  analysis: SchemaAnalysis | null
  /** Is processing */
  isProcessing: boolean
}

/**
 * Main schema optimizer hook
 *
 * Provides schema optimization with analysis and recommendations.
 *
 * @example
 * ```tsx
 * function SchemaManager() {
 *   const {
 *     optimize,
 *     state,
 *     analyze,
 *     reset,
 *   } = useSchemaOptimizer({
 *     preset: 'balanced',
 *   })
 *
 *   const handleOptimize = () => {
 *     const result = optimize(mySchema)
 *     console.log(`Saved ${result.tokensSaved} tokens`)
 *   }
 *
 *   return (
 *     <div>
 *       <button onClick={handleOptimize}>Optimize</button>
 *       <p>Tokens: {state.tokensBefore} → {state.tokensAfter}</p>
 *       <p>Saved: {state.percentageSaved.toFixed(1)}%</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useSchemaOptimizer(config: UseSchemaOptimizerConfig = {}) {
  const [state, setState] = useState<SchemaOptimizationState>({
    optimizedSchema: null,
    tokensBefore: 0,
    tokensAfter: 0,
    tokensSaved: 0,
    percentageSaved: 0,
    optimizations: [],
    analysis: null,
    isProcessing: false,
  })

  // Create optimizer instance
  const optimizer = useMemo(() => {
    if (config.preset) {
      return new SchemaOptimizer(
        require('../schema').OPTIMIZATION_PRESETS[config.preset]
      )
    }
    return new SchemaOptimizer(config)
  }, [
    config.preset,
    config.removeDescriptions,
    config.shortenDescriptions,
    config.maxDescriptionLength,
    config.removeTitles,
    config.removeExamples,
    config.removeDefaults,
    config.removeMetadata,
    config.flattenNested,
    config.removeAdditionalProperties,
    config.removeFormats,
    config.removePatterns,
    config.simplifyEnums,
    config.minPropertiesForObject,
  ])

  /**
   * Optimize a schema
   */
  const optimize = useCallback(
    (schema: FunctionSchema | ToolSchema): OptimizationResult => {
      setState((prev) => ({ ...prev, isProcessing: true }))

      try {
        const result = optimizer.optimize(schema)
        const analysis = analyzeSchema(schema)

        setState({
          optimizedSchema: result.schema,
          tokensBefore: result.tokensBefore,
          tokensAfter: result.tokensAfter,
          tokensSaved: result.tokensSaved,
          percentageSaved: result.percentageSaved,
          optimizations: result.optimizations,
          analysis,
          isProcessing: false,
        })

        return result
      } catch (error) {
        setState((prev) => ({ ...prev, isProcessing: false }))
        throw error
      }
    },
    [optimizer]
  )

  /**
   * Analyze a schema without optimizing
   */
  const analyze = useCallback(
    (schema: FunctionSchema | ToolSchema): SchemaAnalysis => {
      const analysis = analyzeSchema(schema)

      setState((prev) => ({
        ...prev,
        analysis,
      }))

      return analysis
    },
    []
  )

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setState({
      optimizedSchema: null,
      tokensBefore: 0,
      tokensAfter: 0,
      tokensSaved: 0,
      percentageSaved: 0,
      optimizations: [],
      analysis: null,
      isProcessing: false,
    })
  }, [])

  return {
    optimize,
    analyze,
    reset,
    state,
  }
}

/**
 * Batch schema optimizer hook
 *
 * Optimize multiple schemas at once.
 *
 * @example
 * ```tsx
 * function BatchOptimizer() {
 *   const { optimizeBatch, state } = useBatchSchemaOptimizer({
 *     preset: 'balanced',
 *   })
 *
 *   const handleBatchOptimize = () => {
 *     optimizeBatch([schema1, schema2, schema3])
 *   }
 *
 *   return (
 *     <div>
 *       <button onClick={handleBatchOptimize}>Optimize All</button>
 *       <p>Total saved: {state.totalTokensSaved} tokens</p>
 *       <p>Average: {state.averagePercentageSaved.toFixed(1)}%</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useBatchSchemaOptimizer(config: UseSchemaOptimizerConfig = {}) {
  const [state, setState] = useState<{
    results: OptimizationResult[]
    totalTokensBefore: number
    totalTokensAfter: number
    totalTokensSaved: number
    averagePercentageSaved: number
    isProcessing: boolean
  }>({
    results: [],
    totalTokensBefore: 0,
    totalTokensAfter: 0,
    totalTokensSaved: 0,
    averagePercentageSaved: 0,
    isProcessing: false,
  })

  const optimizeBatchSchemas = useCallback(
    (schemas: (FunctionSchema | ToolSchema)[]) => {
      setState((prev) => ({ ...prev, isProcessing: true }))

      try {
        const result = optimizeBatch(schemas, config)

        setState({
          ...result,
          isProcessing: false,
        })

        return result
      } catch (error) {
        setState((prev) => ({ ...prev, isProcessing: false }))
        throw error
      }
    },
    [config]
  )

  const reset = useCallback(() => {
    setState({
      results: [],
      totalTokensBefore: 0,
      totalTokensAfter: 0,
      totalTokensSaved: 0,
      averagePercentageSaved: 0,
      isProcessing: false,
    })
  }, [])

  return {
    optimizeBatch: optimizeBatchSchemas,
    reset,
    state,
  }
}

/**
 * Schema analysis hook
 *
 * Analyze schema token usage with recommendations.
 *
 * @example
 * ```tsx
 * function SchemaAnalyzer() {
 *   const { analyze, analysis } = useSchemaAnalysis()
 *
 *   const handleAnalyze = () => {
 *     analyze(mySchema)
 *   }
 *
 *   return (
 *     <div>
 *       <button onClick={handleAnalyze}>Analyze</button>
 *       {analysis && (
 *         <div>
 *           <p>Total Tokens: {analysis.totalTokens}</p>
 *           <h3>Recommendations</h3>
 *           <ul>
 *             {analysis.recommendations.map((rec, i) => (
 *               <li key={i}>{rec}</li>
 *             ))}
 *           </ul>
 *         </div>
 *       )}
 *     </div>
 *   )
 * }
 * ```
 */
export function useSchemaAnalysis() {
  const [analysis, setAnalysis] = useState<SchemaAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyze = useCallback(
    (schema: FunctionSchema | ToolSchema): SchemaAnalysis => {
      setIsAnalyzing(true)

      try {
        const result = analyzeSchema(schema)
        setAnalysis(result)
        return result
      } finally {
        setIsAnalyzing(false)
      }
    },
    []
  )

  const reset = useCallback(() => {
    setAnalysis(null)
  }, [])

  return {
    analyze,
    reset,
    analysis,
    isAnalyzing,
  }
}

/**
 * Quick optimization hook
 *
 * Simple hook with preset-based optimization.
 *
 * @example
 * ```tsx
 * function QuickOptimizer() {
 *   const optimize = useQuickOptimize('aggressive')
 *
 *   const handleOptimize = () => {
 *     const result = optimize(mySchema)
 *     console.log(`Saved ${result.percentageSaved}%`)
 *   }
 * }
 * ```
 */
export function useQuickOptimize(
  preset: 'conservative' | 'balanced' | 'aggressive' = 'balanced'
) {
  return useCallback(
    (schema: FunctionSchema | ToolSchema): OptimizationResult => {
      return optimizeSchema(schema, preset)
    },
    [preset]
  )
}

/**
 * Schema comparison hook
 *
 * Compare original and optimized schemas side by side.
 *
 * @example
 * ```tsx
 * function SchemaComparison() {
 *   const { compare, comparison } = useSchemaComparison()
 *
 *   const handleCompare = () => {
 *     compare(originalSchema, 'balanced')
 *   }
 *
 *   return (
 *     <div>
 *       <div>
 *         <h3>Before</h3>
 *         <pre>{comparison?.before}</pre>
 *       </div>
 *       <div>
 *         <h3>After</h3>
 *         <pre>{comparison?.after}</pre>
 *       </div>
 *     </div>
 *   )
 * }
 * ```
 */
export function useSchemaComparison() {
  const [comparison, setComparison] = useState<{
    before: string
    after: string
    diff: {
      tokensBefore: number
      tokensAfter: number
      tokensSaved: number
      percentageSaved: number
    }
  } | null>(null)

  const compare = useCallback(
    (
      schema: FunctionSchema | ToolSchema,
      preset: 'conservative' | 'balanced' | 'aggressive' = 'balanced'
    ) => {
      const result = optimizeSchema(schema, preset)

      const funcSchema =
        'function' in schema ? schema.function : (schema as FunctionSchema)
      const optimizedFunc =
        'function' in result.schema
          ? result.schema.function
          : (result.schema as FunctionSchema)

      setComparison({
        before: JSON.stringify(funcSchema, null, 2),
        after: JSON.stringify(optimizedFunc, null, 2),
        diff: {
          tokensBefore: result.tokensBefore,
          tokensAfter: result.tokensAfter,
          tokensSaved: result.tokensSaved,
          percentageSaved: result.percentageSaved,
        },
      })

      return result
    },
    []
  )

  const reset = useCallback(() => {
    setComparison(null)
  }, [])

  return {
    compare,
    reset,
    comparison,
  }
}
