/**
 * Function Schema Optimization Examples
 *
 * Complete examples showing how to optimize OpenAI/Anthropic function schemas
 * to reduce token usage.
 */

import React, { useState, useCallback } from 'react'
import {
  useSchemaOptimizer,
  useBatchSchemaOptimizer,
  useSchemaAnalysis,
  useQuickOptimize,
  useSchemaComparison,
  optimizeSchema,
  analyzeSchema,
  type FunctionSchema,
  type ToolSchema,
} from '@clarity-chat/token-optimization'

// ============================================================================
// Example 1: Basic Schema Optimization
// ============================================================================

export function BasicSchemaOptimization() {
  const [result, setResult] = useState<string>('')

  const handleOptimize = () => {
    const schema: FunctionSchema = {
      name: 'get_weather',
      description: 'Get the current weather for a given location (optional)',
      parameters: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'The city and state, e.g. San Francisco, CA',
            title: 'Location',
            examples: ['New York, NY', 'Los Angeles, CA'],
          },
          unit: {
            type: 'string',
            enum: ['celsius', 'fahrenheit'],
            default: 'fahrenheit',
            description: 'The temperature unit to use',
            title: 'Temperature Unit',
          },
        },
        required: ['location'],
        additionalProperties: false,
      },
    }

    const optimizationResult = optimizeSchema(schema, 'balanced')

    setResult(`
✅ Schema optimized successfully!

Before: ${optimizationResult.tokensBefore} tokens
After: ${optimizationResult.tokensAfter} tokens
Saved: ${optimizationResult.tokensSaved} tokens (${optimizationResult.percentageSaved.toFixed(1)}%)

Optimizations applied:
${optimizationResult.optimizations.map(o => `  • ${o}`).join('\n')}

Optimized schema:
${JSON.stringify(optimizationResult.schema, null, 2)}
    `)
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Basic Schema Optimization</h2>

      <button onClick={handleOptimize}>Optimize Schema</button>

      {result && (
        <pre
          style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            overflow: 'auto',
          }}
        >
          {result}
        </pre>
      )}
    </div>
  )
}

// ============================================================================
// Example 2: Schema Analysis
// ============================================================================

export function SchemaAnalysisExample() {
  const { analyze, analysis } = useSchemaAnalysis()

  const handleAnalyze = () => {
    const schema: FunctionSchema = {
      name: 'send_email',
      description:
        'Send an email message to one or more recipients with optional attachments',
      parameters: {
        type: 'object',
        properties: {
          to: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array of recipient email addresses',
            title: 'Recipients',
          },
          subject: {
            type: 'string',
            description: 'Email subject line',
            title: 'Subject',
            examples: ['Meeting Reminder', 'Project Update'],
          },
          body: {
            type: 'string',
            description: 'Email body content',
            title: 'Body',
          },
        },
        required: ['to', 'subject', 'body'],
      },
    }

    analyze(schema)
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Schema Analysis</h2>

      <button onClick={handleAnalyze}>Analyze Schema</button>

      {analysis && (
        <div style={{ marginTop: '20px' }}>
          <h3>Token Breakdown</h3>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <tbody>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  Total Tokens
                </td>
                <td
                  style={{
                    padding: '8px',
                    borderBottom: '1px solid #ddd',
                    fontWeight: 'bold',
                  }}
                >
                  {analysis.totalTokens}
                </td>
              </tr>
              {analysis.breakdown.map((item) => (
                <tr key={item.type}>
                  <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                    {item.tokens} ({item.percentage.toFixed(1)}%)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {analysis.recommendations.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h3>Recommendations</h3>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {analysis.recommendations.map((rec, i) => (
                  <li key={i} style={{ marginBottom: '5px' }}>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Example 3: Optimization with React Hook
// ============================================================================

export function OptimizationWithHook() {
  const { optimize, state } = useSchemaOptimizer({
    preset: 'balanced',
  })

  const handleOptimize = () => {
    const schema: FunctionSchema = {
      name: 'create_user',
      description: 'Create a new user account with the provided information',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            title: 'Name',
            description: 'User full name',
          },
          email: {
            type: 'string',
            title: 'Email',
            description: 'User email address',
            format: 'email',
          },
          age: {
            type: 'number',
            title: 'Age',
            description: 'User age in years',
            minimum: 18,
          },
        },
        required: ['name', 'email'],
      },
    }

    optimize(schema)
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Optimization with React Hook</h2>

      <button onClick={handleOptimize} disabled={state.isProcessing}>
        {state.isProcessing ? 'Optimizing...' : 'Optimize Schema'}
      </button>

      {state.optimizedSchema && (
        <div style={{ marginTop: '20px' }}>
          <div
            style={{
              padding: '15px',
              backgroundColor: '#d4edda',
              border: '1px solid #c3e6cb',
              borderRadius: '4px',
              marginBottom: '20px',
            }}
          >
            <h3 style={{ margin: '0 0 10px 0' }}>Results</h3>
            <p style={{ margin: '5px 0' }}>
              Before: {state.tokensBefore} tokens
            </p>
            <p style={{ margin: '5px 0' }}>After: {state.tokensAfter} tokens</p>
            <p style={{ margin: '5px 0', fontWeight: 'bold' }}>
              Saved: {state.tokensSaved} tokens ({state.percentageSaved.toFixed(1)}
              %)
            </p>
          </div>

          <h3>Optimizations Applied</h3>
          <ul>
            {state.optimizations.map((opt, i) => (
              <li key={i}>{opt}</li>
            ))}
          </ul>

          {state.analysis && (
            <>
              <h3>Recommendations</h3>
              <ul>
                {state.analysis.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Example 4: Batch Optimization
// ============================================================================

export function BatchOptimizationExample() {
  const { optimizeBatch, state } = useBatchSchemaOptimizer({
    preset: 'balanced',
  })

  const handleBatchOptimize = () => {
    const schemas: FunctionSchema[] = [
      {
        name: 'get_weather',
        description: 'Get current weather',
        parameters: {
          type: 'object',
          properties: {
            location: { type: 'string', title: 'Location' },
          },
          required: ['location'],
        },
      },
      {
        name: 'send_email',
        description: 'Send an email',
        parameters: {
          type: 'object',
          properties: {
            to: { type: 'string', title: 'To' },
            subject: { type: 'string', title: 'Subject' },
            body: { type: 'string', title: 'Body' },
          },
          required: ['to', 'subject'],
        },
      },
      {
        name: 'create_task',
        description: 'Create a new task',
        parameters: {
          type: 'object',
          properties: {
            title: { type: 'string', title: 'Title' },
            due_date: { type: 'string', title: 'Due Date', format: 'date' },
            priority: {
              type: 'string',
              title: 'Priority',
              enum: ['low', 'medium', 'high'],
            },
          },
          required: ['title'],
        },
      },
    ]

    optimizeBatch(schemas)
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Batch Optimization</h2>

      <button onClick={handleBatchOptimize} disabled={state.isProcessing}>
        {state.isProcessing ? 'Optimizing...' : 'Optimize 3 Schemas'}
      </button>

      {state.results.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <div
            style={{
              padding: '15px',
              backgroundColor: '#d4edda',
              border: '1px solid #c3e6cb',
              borderRadius: '4px',
              marginBottom: '20px',
            }}
          >
            <h3 style={{ margin: '0 0 10px 0' }}>Batch Results</h3>
            <p style={{ margin: '5px 0' }}>
              Schemas optimized: {state.results.length}
            </p>
            <p style={{ margin: '5px 0' }}>
              Total tokens before: {state.totalTokensBefore}
            </p>
            <p style={{ margin: '5px 0' }}>
              Total tokens after: {state.totalTokensAfter}
            </p>
            <p style={{ margin: '5px 0', fontWeight: 'bold' }}>
              Total saved: {state.totalTokensSaved} tokens (
              {state.averagePercentageSaved.toFixed(1)}% average)
            </p>
          </div>

          <h3>Individual Results</h3>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th
                  style={{
                    padding: '8px',
                    borderBottom: '2px solid #ddd',
                    textAlign: 'left',
                  }}
                >
                  Function
                </th>
                <th
                  style={{
                    padding: '8px',
                    borderBottom: '2px solid #ddd',
                    textAlign: 'right',
                  }}
                >
                  Before
                </th>
                <th
                  style={{
                    padding: '8px',
                    borderBottom: '2px solid #ddd',
                    textAlign: 'right',
                  }}
                >
                  After
                </th>
                <th
                  style={{
                    padding: '8px',
                    borderBottom: '2px solid #ddd',
                    textAlign: 'right',
                  }}
                >
                  Saved
                </th>
                <th
                  style={{
                    padding: '8px',
                    borderBottom: '2px solid #ddd',
                    textAlign: 'right',
                  }}
                >
                  %
                </th>
              </tr>
            </thead>
            <tbody>
              {state.results.map((result, i) => {
                const funcSchema = 'function' in result.schema
                  ? result.schema.function
                  : result.schema
                return (
                  <tr key={i}>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                      {funcSchema.name}
                    </td>
                    <td
                      style={{
                        padding: '8px',
                        borderBottom: '1px solid #ddd',
                        textAlign: 'right',
                      }}
                    >
                      {result.tokensBefore}
                    </td>
                    <td
                      style={{
                        padding: '8px',
                        borderBottom: '1px solid #ddd',
                        textAlign: 'right',
                      }}
                    >
                      {result.tokensAfter}
                    </td>
                    <td
                      style={{
                        padding: '8px',
                        borderBottom: '1px solid #ddd',
                        textAlign: 'right',
                      }}
                    >
                      {result.tokensSaved}
                    </td>
                    <td
                      style={{
                        padding: '8px',
                        borderBottom: '1px solid #ddd',
                        textAlign: 'right',
                      }}
                    >
                      {result.percentageSaved.toFixed(1)}%
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Example 5: Before/After Comparison
// ============================================================================

export function SchemaComparisonExample() {
  const { compare, comparison } = useSchemaComparison()

  const handleCompare = () => {
    const schema: FunctionSchema = {
      name: 'calculate_price',
      description: 'Calculate the total price including taxes and discounts',
      parameters: {
        type: 'object',
        properties: {
          base_price: {
            type: 'number',
            description: 'The base price before any calculations',
            title: 'Base Price',
            minimum: 0,
          },
          tax_rate: {
            type: 'number',
            description: 'The tax rate as a decimal (e.g., 0.08 for 8%)',
            title: 'Tax Rate',
            default: 0.08,
          },
          discount: {
            type: 'number',
            description: 'The discount amount in dollars',
            title: 'Discount',
            default: 0,
          },
        },
        required: ['base_price'],
      },
    }

    compare(schema, 'balanced')
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Before/After Comparison</h2>

      <button onClick={handleCompare}>Compare Schemas</button>

      {comparison && (
        <div style={{ marginTop: '20px' }}>
          <div
            style={{
              padding: '15px',
              backgroundColor: '#d4edda',
              border: '1px solid #c3e6cb',
              borderRadius: '4px',
              marginBottom: '20px',
            }}
          >
            <p style={{ margin: '5px 0', fontWeight: 'bold' }}>
              Saved {comparison.diff.tokensSaved} tokens (
              {comparison.diff.percentageSaved.toFixed(1)}%)
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
            }}
          >
            <div>
              <h3>Before ({comparison.diff.tokensBefore} tokens)</h3>
              <pre
                style={{
                  backgroundColor: '#fff3cd',
                  padding: '15px',
                  borderRadius: '4px',
                  overflow: 'auto',
                  fontSize: '11px',
                }}
              >
                {comparison.before}
              </pre>
            </div>

            <div>
              <h3>After ({comparison.diff.tokensAfter} tokens)</h3>
              <pre
                style={{
                  backgroundColor: '#d4edda',
                  padding: '15px',
                  borderRadius: '4px',
                  overflow: 'auto',
                  fontSize: '11px',
                }}
              >
                {comparison.after}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Example 6: Preset Comparison
// ============================================================================

export function PresetComparisonExample() {
  const [results, setResults] = useState<{
    conservative: any
    balanced: any
    aggressive: any
  } | null>(null)

  const handleCompare = () => {
    const schema: FunctionSchema = {
      name: 'search_products',
      description:
        'Search for products in the catalog based on various criteria including name, category, price range, and availability',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The search query string to match against product names',
            title: 'Search Query',
            examples: ['laptop', 'smartphone', 'headphones'],
          },
          category: {
            type: 'string',
            description: 'Filter by product category',
            title: 'Category',
            enum: ['electronics', 'clothing', 'books', 'home'],
            default: 'electronics',
          },
          min_price: {
            type: 'number',
            description: 'Minimum price filter in dollars',
            title: 'Minimum Price',
            minimum: 0,
          },
          max_price: {
            type: 'number',
            description: 'Maximum price filter in dollars',
            title: 'Maximum Price',
          },
        },
        required: ['query'],
        additionalProperties: false,
      },
    }

    const conservative = optimizeSchema(schema, 'conservative')
    const balanced = optimizeSchema(schema, 'balanced')
    const aggressive = optimizeSchema(schema, 'aggressive')

    setResults({ conservative, balanced, aggressive })
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Preset Comparison</h2>

      <button onClick={handleCompare}>Compare Presets</button>

      {results && (
        <div style={{ marginTop: '20px' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th
                  style={{
                    padding: '8px',
                    borderBottom: '2px solid #ddd',
                    textAlign: 'left',
                  }}
                >
                  Preset
                </th>
                <th
                  style={{
                    padding: '8px',
                    borderBottom: '2px solid #ddd',
                    textAlign: 'right',
                  }}
                >
                  Tokens Before
                </th>
                <th
                  style={{
                    padding: '8px',
                    borderBottom: '2px solid #ddd',
                    textAlign: 'right',
                  }}
                >
                  Tokens After
                </th>
                <th
                  style={{
                    padding: '8px',
                    borderBottom: '2px solid #ddd',
                    textAlign: 'right',
                  }}
                >
                  Saved
                </th>
                <th
                  style={{
                    padding: '8px',
                    borderBottom: '2px solid #ddd',
                    textAlign: 'right',
                  }}
                >
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(results).map(([preset, result]) => (
                <tr key={preset}>
                  <td
                    style={{
                      padding: '8px',
                      borderBottom: '1px solid #ddd',
                      fontWeight: 'bold',
                    }}
                  >
                    {preset.charAt(0).toUpperCase() + preset.slice(1)}
                  </td>
                  <td
                    style={{
                      padding: '8px',
                      borderBottom: '1px solid #ddd',
                      textAlign: 'right',
                    }}
                  >
                    {result.tokensBefore}
                  </td>
                  <td
                    style={{
                      padding: '8px',
                      borderBottom: '1px solid #ddd',
                      textAlign: 'right',
                    }}
                  >
                    {result.tokensAfter}
                  </td>
                  <td
                    style={{
                      padding: '8px',
                      borderBottom: '1px solid #ddd',
                      textAlign: 'right',
                    }}
                  >
                    {result.tokensSaved}
                  </td>
                  <td
                    style={{
                      padding: '8px',
                      borderBottom: '1px solid #ddd',
                      textAlign: 'right',
                      fontWeight: 'bold',
                      color:
                        result.percentageSaved > 50
                          ? '#28a745'
                          : result.percentageSaved > 30
                            ? '#ffc107'
                            : '#6c757d',
                    }}
                  >
                    {result.percentageSaved.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '20px' }}>
            <h3>Recommendation</h3>
            <p>
              {results.aggressive.percentageSaved > 60
                ? '✅ Aggressive preset provides significant savings and is recommended'
                : results.balanced.percentageSaved > 40
                  ? '✅ Balanced preset offers good savings with preserved functionality'
                  : '⚠️ Conservative preset is safest but provides minimal savings'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Main Demo App
// ============================================================================

export function SchemaOptimizationDemo() {
  const [activeExample, setActiveExample] = useState<number>(1)

  const examples = [
    { id: 1, name: 'Basic Optimization', component: <BasicSchemaOptimization /> },
    { id: 2, name: 'Schema Analysis', component: <SchemaAnalysisExample /> },
    { id: 3, name: 'React Hook', component: <OptimizationWithHook /> },
    { id: 4, name: 'Batch Optimization', component: <BatchOptimizationExample /> },
    { id: 5, name: 'Comparison View', component: <SchemaComparisonExample /> },
    { id: 6, name: 'Preset Comparison', component: <PresetComparisonExample /> },
  ]

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <div
        style={{
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #dee2e6',
        }}
      >
        <h1 style={{ margin: 0 }}>Function Schema Optimization Examples</h1>
        <p style={{ margin: '10px 0 0 0', color: '#6c757d' }}>
          Week 7: Reduce token usage in function calling by 30-60%
        </p>
      </div>

      <div style={{ display: 'flex' }}>
        <div
          style={{
            width: '250px',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRight: '1px solid #dee2e6',
            minHeight: 'calc(100vh - 100px)',
          }}
        >
          <h3 style={{ marginTop: 0 }}>Examples</h3>
          {examples.map((example) => (
            <button
              key={example.id}
              onClick={() => setActiveExample(example.id)}
              style={{
                display: 'block',
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                border: 'none',
                backgroundColor: activeExample === example.id ? '#007bff' : '#fff',
                color: activeExample === example.id ? '#fff' : '#000',
                borderRadius: '4px',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              {example.name}
            </button>
          ))}
        </div>

        <div style={{ flex: 1 }}>
          {examples.find((e) => e.id === activeExample)?.component}
        </div>
      </div>
    </div>
  )
}

export default SchemaOptimizationDemo
