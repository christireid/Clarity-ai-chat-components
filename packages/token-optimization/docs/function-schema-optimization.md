# Function Schema Optimization

**Week 7** - Optimize OpenAI/Anthropic function schemas to reduce token usage while maintaining functionality.

## Overview

Function calling (also known as tool use) is a powerful feature in modern LLMs, but function schemas can consume significant tokens. This module provides automatic schema optimization to reduce token costs by 30-60% without affecting functionality.

### Key Features

- **Automatic Optimization**: Remove unnecessary schema properties
- **Description Shortening**: Intelligently shorten verbose descriptions
- **Nested Flattening**: Flatten unnecessary nested objects
- **Token Analysis**: Detailed breakdown of schema token usage
- **Batch Processing**: Optimize multiple schemas at once
- **Preset Levels**: Conservative, balanced, and aggressive optimization
- **React Hooks**: Easy integration with React applications

### Benefits

- **Cost Reduction**: Save 30-60% on function calling tokens
- **Faster Processing**: Smaller schemas = faster API responses
- **Maintained Functionality**: Optimizations preserve schema validity
- **Easy Integration**: Drop-in replacement for existing schemas

## Quick Start

### Basic Usage

```typescript
import { optimizeSchema } from '@clarity-chat/token-optimization'

const originalSchema = {
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

// Optimize with balanced preset
const result = optimizeSchema(originalSchema, 'balanced')

console.log(`Tokens saved: ${result.tokensSaved}`)
console.log(`Percentage saved: ${result.percentageSaved.toFixed(1)}%`)
console.log(`Optimizations: ${result.optimizations.join(', ')}`)

// Use optimized schema
const optimizedSchema = result.schema
```

### React Hook Usage

```tsx
import { useSchemaOptimizer } from '@clarity-chat/token-optimization'

function SchemaManager() {
  const { optimize, state } = useSchemaOptimizer({
    preset: 'balanced',
  })

  const handleOptimize = () => {
    const result = optimize(mySchema)
    console.log(`Saved ${result.percentageSaved.toFixed(1)}%`)
  }

  return (
    <div>
      <button onClick={handleOptimize}>Optimize Schema</button>
      {state.optimizedSchema && (
        <div>
          <p>Tokens: {state.tokensBefore} → {state.tokensAfter}</p>
          <p>Saved: {state.percentageSaved.toFixed(1)}%</p>
        </div>
      )}
    </div>
  )
}
```

## What Gets Optimized

### 1. Title Fields (Safe to Remove)

**Before:**
```json
{
  "type": "string",
  "description": "User's email address",
  "title": "Email Address"
}
```

**After:**
```json
{
  "type": "string",
  "description": "User's email address"
}
```

**Tokens saved**: ~3-5 per property

### 2. Examples (Safe to Remove)

**Before:**
```json
{
  "type": "string",
  "description": "City and state",
  "examples": ["New York, NY", "Los Angeles, CA", "Chicago, IL"]
}
```

**After:**
```json
{
  "type": "string",
  "description": "City and state"
}
```

**Tokens saved**: Varies by example count/length

### 3. Default Values (Consider Carefully)

**Before:**
```json
{
  "type": "string",
  "enum": ["celsius", "fahrenheit"],
  "default": "fahrenheit"
}
```

**After:**
```json
{
  "type": "string",
  "enum": ["celsius", "fahrenheit"]
}
```

**Tokens saved**: ~2-4 per property
**Note**: Only remove if default behavior is acceptable

### 4. Long Descriptions (Shortened)

**Before:**
```json
{
  "description": "The temperature unit to use for the weather data. Can be either celsius or fahrenheit. Defaults to fahrenheit if not specified (optional)."
}
```

**After:**
```json
{
  "description": "Temperature unit (celsius or fahrenheit)"
}
```

**Tokens saved**: 15-30 per verbose description

### 5. additionalProperties (Safe to Remove)

**Before:**
```json
{
  "type": "object",
  "properties": { ... },
  "additionalProperties": false
}
```

**After:**
```json
{
  "type": "object",
  "properties": { ... }
}
```

**Tokens saved**: ~2-3 per object

### 6. Format Constraints (Context Dependent)

**Before:**
```json
{
  "type": "string",
  "format": "email",
  "pattern": "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$"
}
```

**After (Aggressive):**
```json
{
  "type": "string"
}
```

**Tokens saved**: ~3-8 per property
**Note**: Only remove if validation isn't critical

## Optimization Presets

### Conservative (Safest)

```typescript
const result = optimizeSchema(schema, 'conservative')
```

**What it does:**
- ✅ Remove titles
- ✅ Remove examples
- ✅ Shorten descriptions (max 100 chars)
- ✅ Remove metadata ($schema, $id)
- ✅ Remove additionalProperties
- ❌ Keep default values
- ❌ Keep formats
- ❌ No flattening

**Typical savings**: 20-35%

### Balanced (Recommended)

```typescript
const result = optimizeSchema(schema, 'balanced')
```

**What it does:**
- ✅ Remove titles
- ✅ Remove examples
- ✅ Remove defaults
- ✅ Shorten descriptions (max 50 chars)
- ✅ Remove metadata
- ✅ Flatten minimal nested objects
- ✅ Remove additionalProperties
- ✅ Remove formats
- ✅ Simplify enums

**Typical savings**: 40-55%

### Aggressive (Maximum Savings)

```typescript
const result = optimizeSchema(schema, 'aggressive')
```

**What it does:**
- ✅ Remove ALL descriptions
- ✅ Remove titles, examples, defaults
- ✅ Remove metadata
- ✅ Flatten nested objects aggressively
- ✅ Remove additionalProperties
- ✅ Remove formats and patterns
- ✅ Simplify enums

**Typical savings**: 50-70%
**Warning**: May reduce model understanding

## API Reference

### optimizeSchema

Quick optimization helper function.

```typescript
function optimizeSchema(
  schema: FunctionSchema | ToolSchema,
  preset?: 'conservative' | 'balanced' | 'aggressive'
): OptimizationResult
```

**Parameters:**
- `schema` - Function or tool schema to optimize
- `preset` - Optimization level (default: 'balanced')

**Returns:**
```typescript
interface OptimizationResult {
  schema: FunctionSchema | ToolSchema  // Optimized schema
  tokensBefore: number                 // Original token count
  tokensAfter: number                  // Optimized token count
  tokensSaved: number                  // Tokens saved
  percentageSaved: number              // Percentage saved
  optimizations: string[]              // Applied optimizations
}
```

**Example:**
```typescript
const result = optimizeSchema(mySchema, 'balanced')
console.log(`Saved ${result.tokensSaved} tokens (${result.percentageSaved}%)`)
```

### SchemaOptimizer Class

Advanced optimizer with custom configuration.

```typescript
class SchemaOptimizer {
  constructor(config?: SchemaOptimizationConfig)
  optimize(schema: FunctionSchema | ToolSchema): OptimizationResult
}
```

**Config Options:**

```typescript
interface SchemaOptimizationConfig {
  removeDescriptions?: boolean          // Remove all descriptions
  shortenDescriptions?: boolean         // Shorten long descriptions
  maxDescriptionLength?: number         // Max description length
  removeTitles?: boolean                // Remove title fields
  removeExamples?: boolean              // Remove examples
  removeDefaults?: boolean              // Remove default values
  removeMetadata?: boolean              // Remove $schema, $id
  flattenNested?: boolean               // Flatten nested objects
  removeAdditionalProperties?: boolean  // Remove additionalProperties
  removeFormats?: boolean               // Remove format constraints
  removePatterns?: boolean              // Remove pattern constraints
  simplifyEnums?: boolean               // Simplify enum values
  minPropertiesForObject?: number       // Min properties to keep object
}
```

**Example:**
```typescript
const optimizer = new SchemaOptimizer({
  shortenDescriptions: true,
  maxDescriptionLength: 40,
  removeTitles: true,
  removeExamples: true,
  flattenNested: false,  // Custom: don't flatten
})

const result = optimizer.optimize(mySchema)
```

### analyzeSchema

Analyze schema token usage and get recommendations.

```typescript
function analyzeSchema(
  schema: FunctionSchema | ToolSchema
): SchemaAnalysis
```

**Returns:**
```typescript
interface SchemaAnalysis {
  totalTokens: number                 // Total token count
  functionNameTokens: number          // Tokens in function name
  descriptionTokens: number           // Tokens in description
  parametersTokens: number            // Tokens in parameters
  breakdown: {                        // Percentage breakdown
    type: string
    tokens: number
    percentage: number
  }[]
  recommendations: string[]           // Optimization suggestions
}
```

**Example:**
```typescript
const analysis = analyzeSchema(mySchema)

console.log(`Total tokens: ${analysis.totalTokens}`)
console.log(`Description uses ${analysis.descriptionTokens} tokens`)
console.log('Recommendations:')
analysis.recommendations.forEach(rec => console.log(`- ${rec}`))
```

**Sample Output:**
```
Total tokens: 142
Description uses 28 tokens

Recommendations:
- Description is verbose - shorten to <100 characters
- Schema contains title fields - these can be removed
- Schema contains examples - these can be removed
- 2 optional parameters - consider removing unused ones
```

### optimizeBatch

Optimize multiple schemas at once.

```typescript
function optimizeBatch(
  schemas: (FunctionSchema | ToolSchema)[],
  config?: SchemaOptimizationConfig
): BatchOptimizationResult
```

**Returns:**
```typescript
interface BatchOptimizationResult {
  results: OptimizationResult[]      // Individual results
  totalTokensBefore: number          // Total original tokens
  totalTokensAfter: number           // Total optimized tokens
  totalTokensSaved: number           // Total tokens saved
  averagePercentageSaved: number     // Average % saved
}
```

**Example:**
```typescript
const schemas = [schema1, schema2, schema3]
const result = optimizeBatch(schemas, { preset: 'balanced' })

console.log(`Optimized ${schemas.length} schemas`)
console.log(`Total saved: ${result.totalTokensSaved} tokens`)
console.log(`Average: ${result.averagePercentageSaved.toFixed(1)}%`)
```

## React Hooks

### useSchemaOptimizer

Main optimization hook with full features.

```typescript
function useSchemaOptimizer(config?: UseSchemaOptimizerConfig): {
  optimize: (schema: FunctionSchema | ToolSchema) => OptimizationResult
  analyze: (schema: FunctionSchema | ToolSchema) => SchemaAnalysis
  reset: () => void
  state: SchemaOptimizationState
}
```

**Example:**
```tsx
function SchemaOptimizer() {
  const { optimize, analyze, state } = useSchemaOptimizer({
    preset: 'balanced',
  })

  const handleOptimize = () => {
    const analysis = analyze(mySchema)
    console.log('Recommendations:', analysis.recommendations)

    const result = optimize(mySchema)
    console.log(`Saved ${result.percentageSaved}%`)
  }

  return (
    <div>
      <button onClick={handleOptimize}>Optimize</button>
      {state.optimizedSchema && (
        <div>
          <p>Before: {state.tokensBefore} tokens</p>
          <p>After: {state.tokensAfter} tokens</p>
          <p>Saved: {state.percentageSaved.toFixed(1)}%</p>

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
```

### useBatchSchemaOptimizer

Optimize multiple schemas.

```typescript
function useBatchSchemaOptimizer(config?: UseSchemaOptimizerConfig): {
  optimizeBatch: (schemas: (FunctionSchema | ToolSchema)[]) => BatchOptimizationResult
  reset: () => void
  state: {
    results: OptimizationResult[]
    totalTokensBefore: number
    totalTokensAfter: number
    totalTokensSaved: number
    averagePercentageSaved: number
    isProcessing: boolean
  }
}
```

### useSchemaAnalysis

Analyze schemas without optimizing.

```typescript
function useSchemaAnalysis(): {
  analyze: (schema: FunctionSchema | ToolSchema) => SchemaAnalysis
  reset: () => void
  analysis: SchemaAnalysis | null
  isAnalyzing: boolean
}
```

### useQuickOptimize

Simple optimization hook.

```typescript
function useQuickOptimize(
  preset?: 'conservative' | 'balanced' | 'aggressive'
): (schema: FunctionSchema | ToolSchema) => OptimizationResult
```

**Example:**
```tsx
function QuickOptimizer() {
  const optimize = useQuickOptimize('balanced')

  const handleOptimize = () => {
    const result = optimize(mySchema)
    // Use result.schema
  }
}
```

### useSchemaComparison

Compare before/after schemas.

```typescript
function useSchemaComparison(): {
  compare: (schema: FunctionSchema | ToolSchema, preset?: string) => OptimizationResult
  reset: () => void
  comparison: {
    before: string
    after: string
    diff: {
      tokensBefore: number
      tokensAfter: number
      tokensSaved: number
      percentageSaved: number
    }
  } | null
}
```

**Example:**
```tsx
function SchemaComparison() {
  const { compare, comparison } = useSchemaComparison()

  return (
    <div>
      <button onClick={() => compare(mySchema, 'balanced')}>
        Compare
      </button>

      {comparison && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h3>Before ({comparison.diff.tokensBefore} tokens)</h3>
            <pre>{comparison.before}</pre>
          </div>
          <div>
            <h3>After ({comparison.diff.tokensAfter} tokens)</h3>
            <pre>{comparison.after}</pre>
          </div>
        </div>
      )}
    </div>
  )
}
```

## Complete Examples

### Example 1: OpenAI Function Calling

```typescript
import { optimizeSchema } from '@clarity-chat/token-optimization'
import OpenAI from 'openai'

const openai = new OpenAI()

// Original schema (verbose)
const originalSchema = {
  name: 'get_current_weather',
  description: 'Get the current weather in a given location. This function returns temperature, conditions, humidity, and wind speed.',
  parameters: {
    type: 'object',
    properties: {
      location: {
        type: 'string',
        description: 'The city and state, for example: San Francisco, CA',
        title: 'Location',
        examples: ['New York, NY', 'Los Angeles, CA'],
      },
      unit: {
        type: 'string',
        enum: ['celsius', 'fahrenheit'],
        description: 'The temperature unit to use. Defaults to fahrenheit if not specified.',
        default: 'fahrenheit',
        title: 'Temperature Unit',
      },
    },
    required: ['location'],
    additionalProperties: false,
  },
}

// Optimize
const result = optimizeSchema(originalSchema, 'balanced')
console.log(`Saved ${result.tokensSaved} tokens (${result.percentageSaved.toFixed(1)}%)`)

// Use optimized schema
const completion = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'What's the weather in Boston?' }],
  tools: [{
    type: 'function',
    function: result.schema,  // Use optimized schema
  }],
})
```

### Example 2: Batch Optimization

```typescript
import { optimizeBatch } from '@clarity-chat/token-optimization'

const schemas = [
  {
    name: 'create_user',
    description: 'Create a new user account with the provided information',
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string', title: 'Name', description: 'User full name' },
        email: { type: 'string', title: 'Email', description: 'User email address', format: 'email' },
        age: { type: 'number', title: 'Age', description: 'User age in years', minimum: 18 },
      },
      required: ['name', 'email'],
    },
  },
  {
    name: 'update_user',
    description: 'Update an existing user account with new information',
    parameters: {
      type: 'object',
      properties: {
        id: { type: 'string', title: 'ID', description: 'User unique identifier' },
        name: { type: 'string', title: 'Name', description: 'Updated user name' },
        email: { type: 'string', title: 'Email', description: 'Updated email address' },
      },
      required: ['id'],
    },
  },
]

const result = optimizeBatch(schemas)

console.log(`Optimized ${schemas.length} schemas`)
console.log(`Total tokens saved: ${result.totalTokensSaved}`)
console.log(`Average savings: ${result.averagePercentageSaved.toFixed(1)}%`)

// Use optimized schemas
const optimizedSchemas = result.results.map(r => r.schema)
```

### Example 3: Analysis and Recommendations

```typescript
import { analyzeSchema, optimizeSchema } from '@clarity-chat/token-optimization'

const schema = {
  name: 'send_email',
  description: 'Send an email message to one or more recipients with optional attachments and CC/BCC recipients. This function supports HTML formatting and can handle multiple attachments up to 10MB each.',
  parameters: {
    type: 'object',
    properties: {
      to: {
        type: 'array',
        items: { type: 'string', format: 'email' },
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
        description: 'Email body content (supports HTML)',
        title: 'Body',
      },
    },
    required: ['to', 'subject', 'body'],
  },
}

// Analyze first
const analysis = analyzeSchema(schema)

console.log('Token Breakdown:')
console.log(`- Function name: ${analysis.functionNameTokens} tokens`)
console.log(`- Description: ${analysis.descriptionTokens} tokens`)
console.log(`- Parameters: ${analysis.parametersTokens} tokens`)
console.log(`- Total: ${analysis.totalTokens} tokens`)

console.log('\nRecommendations:')
analysis.recommendations.forEach(rec => {
  console.log(`- ${rec}`)
})

// Then optimize based on recommendations
const result = optimizeSchema(schema, 'balanced')
console.log(`\nOptimization saved ${result.tokensSaved} tokens`)
```

### Example 4: React Component with Full Features

```tsx
import { useState } from 'react'
import { useSchemaOptimizer, useSchemaAnalysis } from '@clarity-chat/token-optimization'

function SchemaOptimizerUI() {
  const [schema, setSchema] = useState('')
  const { optimize, state } = useSchemaOptimizer({ preset: 'balanced' })
  const { analyze, analysis } = useSchemaAnalysis()

  const handleOptimize = () => {
    try {
      const parsed = JSON.parse(schema)

      // Analyze first
      const analysisResult = analyze(parsed)

      // Then optimize
      const result = optimize(parsed)

      console.log('Optimized successfully')
    } catch (error) {
      console.error('Invalid JSON schema')
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Function Schema Optimizer</h2>

      <div style={{ marginBottom: '20px' }}>
        <h3>Paste your function schema (JSON):</h3>
        <textarea
          value={schema}
          onChange={(e) => setSchema(e.target.value)}
          rows={15}
          style={{ width: '100%', fontFamily: 'monospace', fontSize: '12px' }}
        />
      </div>

      <button
        onClick={handleOptimize}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Optimize Schema
      </button>

      {analysis && (
        <div style={{ marginTop: '30px' }}>
          <h3>Analysis</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  Total Tokens
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  {analysis.totalTokens}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  Function Name
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  {analysis.functionNameTokens} ({analysis.breakdown[0].percentage.toFixed(1)}%)
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  Description
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  {analysis.descriptionTokens} ({analysis.breakdown[1].percentage.toFixed(1)}%)
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  Parameters
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  {analysis.parametersTokens} ({analysis.breakdown[2].percentage.toFixed(1)}%)
                </td>
              </tr>
            </tbody>
          </table>

          {analysis.recommendations.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h4>Recommendations</h4>
              <ul>
                {analysis.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {state.optimizedSchema && (
        <div style={{ marginTop: '30px' }}>
          <h3>Optimization Results</h3>

          <div
            style={{
              padding: '15px',
              backgroundColor: '#d4edda',
              border: '1px solid #c3e6cb',
              borderRadius: '4px',
              marginBottom: '20px',
            }}
          >
            <p style={{ margin: 0 }}>
              <strong>Tokens saved: {state.tokensSaved}</strong> ({state.percentageSaved.toFixed(1)}% reduction)
            </p>
            <p style={{ margin: '5px 0 0 0' }}>
              {state.tokensBefore} tokens → {state.tokensAfter} tokens
            </p>
          </div>

          <h4>Optimizations Applied</h4>
          <ul>
            {state.optimizations.map((opt, i) => (
              <li key={i}>{opt}</li>
            ))}
          </ul>

          <h4>Optimized Schema</h4>
          <pre
            style={{
              backgroundColor: '#f5f5f5',
              padding: '15px',
              borderRadius: '4px',
              overflow: 'auto',
            }}
          >
            {JSON.stringify(state.optimizedSchema, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export default SchemaOptimizerUI
```

## Best Practices

### 1. Start Conservative

Begin with the conservative preset to ensure functionality isn't affected:

```typescript
const result = optimizeSchema(schema, 'conservative')
```

Test thoroughly, then move to balanced or aggressive if needed.

### 2. Analyze Before Optimizing

Use `analyzeSchema()` to understand where tokens are being used:

```typescript
const analysis = analyzeSchema(schema)
console.log('Recommendations:', analysis.recommendations)
```

This helps you make informed decisions about optimization level.

### 3. Preserve Critical Descriptions

For complex functions, keep descriptions for required parameters:

```typescript
const optimizer = new SchemaOptimizer({
  shortenDescriptions: true,  // Shorten, don't remove
  maxDescriptionLength: 60,
  // ... other config
})
```

### 4. Test Optimized Schemas

Always test optimized schemas with your LLM to ensure they still work correctly:

```typescript
const result = optimizeSchema(schema, 'balanced')

// Test with your LLM
const response = await llm.call({
  tools: [result.schema],
  // ...
})
```

### 5. Batch Process for Efficiency

When optimizing multiple schemas, use batch processing:

```typescript
const result = optimizeBatch(allSchemas)
// Apply all at once
```

### 6. Monitor Token Savings

Track optimization impact over time:

```typescript
const result = optimizeSchema(schema, 'balanced')

metrics.record({
  originalTokens: result.tokensBefore,
  optimizedTokens: result.tokensAfter,
  savings: result.tokensSaved,
  percentage: result.percentageSaved,
})
```

## Troubleshooting

### Issue: Model doesn't understand optimized schema

**Solution**: Use a less aggressive preset

```typescript
// Instead of 'aggressive'
const result = optimizeSchema(schema, 'balanced')
```

Or preserve descriptions:

```typescript
const optimizer = new SchemaOptimizer({
  ...OPTIMIZATION_PRESETS.balanced,
  removeDescriptions: false,  // Keep descriptions
  shortenDescriptions: true,
})
```

### Issue: Required parameters not working

**Solution**: Check that required array is preserved

```typescript
const optimized = result.schema
console.log(optimized.parameters.required)  // Should match original
```

### Issue: Enums not recognized

**Solution**: Don't simplify enums

```typescript
const optimizer = new SchemaOptimizer({
  ...OPTIMIZATION_PRESETS.balanced,
  simplifyEnums: false,  // Keep original enum values
})
```

## What's Next?

- **Week 8**: Final Polish & QA

Continue to [Final Polish & QA](./final-polish-qa.md) →
