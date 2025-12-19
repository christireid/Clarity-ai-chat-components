import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { Pagination } from '@/components/Navigation/Pagination'

export const metadata: Metadata = {
  title: 'TOON Format Utilities | Clarity Chat',
  description:
    'Token-Oriented Object Notation (TOON) utilities for 30-60% token savings on structured data in LLM prompts.',
}

const jsonToToonProps: Prop[] = [
  {
    name: 'data',
    type: 'any',
    required: true,
    description: 'The JSON data to convert to TOON format.',
  },
  {
    name: 'options.indent',
    type: 'number',
    default: '2',
    description: 'Indent size for nested objects.',
  },
  {
    name: 'options.compact',
    type: 'boolean',
    default: 'false',
    description: 'Use compact format without extra spacing.',
  },
  {
    name: 'options.preserveNulls',
    type: 'boolean',
    default: 'true',
    description: 'Keep null values in output.',
  },
  {
    name: 'options.quoteStrings',
    type: 'boolean',
    default: 'false',
    description: 'Always quote string values.',
  },
]

const toonToJsonProps: Prop[] = [
  {
    name: 'toon',
    type: 'string',
    required: true,
    description: 'The TOON-formatted string to parse.',
  },
  {
    name: 'options.strict',
    type: 'boolean',
    default: 'false',
    description: 'Throw errors on parse failures instead of returning null.',
  },
  {
    name: 'options.typeHints',
    type: 'Record<string, "string" | "number" | "boolean" | "object" | "array">',
    description: 'Type hints for specific fields to ensure correct parsing.',
  },
]

const autoOptimizeProps: Prop[] = [
  {
    name: 'data',
    type: 'any',
    required: true,
    description: 'The data to optimize for LLM input.',
  },
  {
    name: 'options.minSavingsPercent',
    type: 'number',
    default: '20',
    description: 'Minimum savings threshold to use TOON format.',
  },
  {
    name: 'options.forceToon',
    type: 'boolean',
    default: 'false',
    description: 'Force TOON format regardless of savings.',
  },
  {
    name: 'options.forceJson',
    type: 'boolean',
    default: 'false',
    description: 'Force JSON format.',
  },
  {
    name: 'options.compact',
    type: 'boolean',
    default: 'true',
    description: 'Use compact TOON encoding.',
  },
]

const autoOptimizeReturnProps: Prop[] = [
  {
    name: 'format',
    type: '"json" | "toon"',
    description: 'The format that was used.',
  },
  {
    name: 'data',
    type: 'string',
    description: 'The encoded data string.',
  },
  {
    name: 'originalTokens',
    type: 'number',
    description: 'Token count of original JSON.',
  },
  {
    name: 'optimizedTokens',
    type: 'number',
    description: 'Token count of optimized output.',
  },
  {
    name: 'tokensSaved',
    type: 'number',
    description: 'Number of tokens saved.',
  },
  {
    name: 'savingsPercent',
    type: 'number',
    description: 'Percentage of tokens saved.',
  },
  {
    name: 'reason',
    type: 'string',
    description: 'Explanation for the format choice.',
  },
]

export default function ToonFormatPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>TOON Format Utilities</h1>

      <p className="lead">
        Token-Oriented Object Notation (TOON) is a compact data format that
        combines YAML&apos;s indentation for nested objects with CSV-style
        tabular layout for uniform arrays, achieving{' '}
        <strong>30-60% token savings</strong> on structured data.
      </p>

      <Callout type="info">
        <p>
          TOON is most effective for arrays of similar objects (like user lists,
          product catalogs, or search results). For deeply nested or non-uniform
          data, JSON may be more appropriate. The <code>autoOptimize</code>{' '}
          function automatically selects the best format.
        </p>
      </Callout>

      <section className="my-12">
        <h2 id="import">Import</h2>

        <EnhancedCodeBlock
          code={`import {
  jsonToToon,
  toonToJson,
  autoOptimize,
  estimateToonSavings,
  isSuitableForToon,
  TOON_INSTRUCTIONS
} from '@clarity-chat/react'`}
          language="tsx"
        />
      </section>

      <section className="my-12">
        <h2 id="quick-example">Quick Example</h2>

        <p>Convert a user array to TOON format:</p>

        <EnhancedCodeBlock
          code={`import { jsonToToon, toonToJson } from '@clarity-chat/react/internal'

// JSON data
const users = [
  { name: "Alice", age: 30, city: "New York" },
  { name: "Bob", age: 25, city: "San Francisco" },
  { name: "Carol", age: 35, city: "Seattle" }
]

// Convert to TOON (30-60% smaller)
const toon = jsonToToon(users)
// Output:
// name, age, city
// Alice, 30, New York
// Bob, 25, San Francisco
// Carol, 35, Seattle

// Convert back to JSON when needed
const parsed = toonToJson(toon)
// Returns original array structure`}
          language="tsx"
          showLineNumbers
        />

        <div className="mt-6 p-4 border rounded-lg bg-muted/20">
          <h3 className="font-semibold mb-2">Token Comparison</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>JSON:</strong>
              <pre className="mt-1 p-2 bg-muted rounded text-xs">
                {`[{"name":"Alice","age":30,"city":"New York"},
{"name":"Bob","age":25,"city":"San Francisco"},
{"name":"Carol","age":35,"city":"Seattle"}]`}
              </pre>
              <p className="text-muted-foreground mt-1">~65 tokens</p>
            </div>
            <div>
              <strong>TOON:</strong>
              <pre className="mt-1 p-2 bg-muted rounded text-xs">
                {`name, age, city
Alice, 30, New York
Bob, 25, San Francisco
Carol, 35, Seattle`}
              </pre>
              <p className="text-muted-foreground mt-1">
                ~25 tokens (62% savings)
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="my-12">
        <h2 id="auto-optimize">Auto-Optimization</h2>

        <p>
          Let the library automatically choose the best format based on your
          data:
        </p>

        <EnhancedCodeBlock
          code={`import { autoOptimize } from '@clarity-chat/react/internal'

const products = [
  { id: 1, name: "Widget", price: 9.99, inStock: true },
  { id: 2, name: "Gadget", price: 19.99, inStock: false },
  { id: 3, name: "Gizmo", price: 14.99, inStock: true },
]

const result = autoOptimize(products)

console.log(result.format)         // "toon"
console.log(result.savingsPercent) // ~45
console.log(result.reason)         // "TOON saves 45.2% tokens"

// Use the optimized data in your prompt
const prompt = \`
Here is the product catalog:
\${result.data}

Which products are in stock?
\``}
          language="tsx"
          showLineNumbers
        />

        <Callout type="tip">
          <p>
            <code>autoOptimize</code> returns metadata about the optimization,
            making it easy to log savings for monitoring and debugging.
          </p>
        </Callout>
      </section>

      <section className="my-12">
        <h2 id="with-hooks">Using with Chat Hooks</h2>

        <p>Integrate TOON optimization into your chat workflow:</p>

        <EnhancedCodeBlock
          code={`import { useClarityChat, autoOptimize, TOON_INSTRUCTIONS } from '@clarity-chat/react/internal'

function ChatWithData({ searchResults }) {
  const { sendMessage, messages } = useClarityChat({
    systemMessage: TOON_INSTRUCTIONS.system, // Help LLM understand TOON
  })

  const handleSearch = async (query) => {
    // Optimize search results for the prompt
    const optimized = autoOptimize(searchResults, {
      minSavingsPercent: 15 // Use TOON if saves 15%+ tokens
    })

    await sendMessage(\`
Based on these search results:
\${optimized.data}

Answer the following question: \${query}
    \`)

    console.log(\`Saved \${optimized.tokensSaved} tokens (\${optimized.savingsPercent.toFixed(1)}%)\`)
  }

  return (
    // ... your chat UI
  )
}`}
          language="tsx"
          showLineNumbers
        />
      </section>

      <section className="my-12">
        <h2 id="toon-instructions">LLM Instructions</h2>

        <p>
          Include instructions to help LLMs correctly parse TOON-formatted data:
        </p>

        <EnhancedCodeBlock
          code={`import { TOON_INSTRUCTIONS, jsonToToon } from '@clarity-chat/react/internal'

// Brief instruction (minimal tokens)
const prompt1 = \`
\${TOON_INSTRUCTIONS.brief}

\${jsonToToon(data)}
\`

// Detailed instruction (first message of conversation)
const prompt2 = \`
\${TOON_INSTRUCTIONS.detailed}

\${jsonToToon(data)}
\`

// System message (set once at conversation start)
const systemMessage = TOON_INSTRUCTIONS.system

// Inline instruction (minimal)
const prompt3 = \`
\${TOON_INSTRUCTIONS.inline}
\${jsonToToon(data)}
\``}
          language="tsx"
          showLineNumbers
        />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-lg">brief</h3>
            <p className="text-muted-foreground text-sm">
              One-line explanation for simple cases. ~20 tokens.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-lg">detailed</h3>
            <p className="text-muted-foreground text-sm">
              Full explanation with examples. Use once at conversation start.
              ~100 tokens.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-lg">system</h3>
            <p className="text-muted-foreground text-sm">
              System message version. Set at conversation initialization.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-lg">inline</h3>
            <p className="text-muted-foreground text-sm">
              Minimal inline marker. ~5 tokens.
            </p>
          </div>
        </div>
      </section>

      <section className="my-12">
        <h2 id="conversation-wrapper">Conversation-Aware Wrapper</h2>

        <p>
          Track whether instructions have been sent to avoid repetition across
          messages:
        </p>

        <EnhancedCodeBlock
          code={`import { createToonConversationWrapper, jsonToToon } from '@clarity-chat/react/internal'

// Create wrapper at conversation start
const wrapper = createToonConversationWrapper({
  instructionLevel: 'brief'
})

// First message - includes instructions
const first = wrapper.wrap(jsonToToon(users))
// "The data below is in TOON format...\\n\\nname, age, city\\n..."

// Second message - no instructions (already sent)
const second = wrapper.wrap(jsonToToon(products))
// "id, name, price\\n..."

// Reset if starting new conversation
wrapper.reset()

// Check state
console.log(wrapper.instructionsSent) // false after reset`}
          language="tsx"
          showLineNumbers
        />
      </section>

      <section className="my-12">
        <h2 id="estimate-savings">Estimate Savings</h2>

        <p>Check potential savings before optimizing:</p>

        <EnhancedCodeBlock
          code={`import { estimateToonSavings, isSuitableForToon } from '@clarity-chat/react/internal'

const data = getSearchResults()

// Check if data structure is good for TOON
if (isSuitableForToon(data)) {
  const savings = estimateToonSavings(data)

  console.log(\`JSON: \${savings.jsonTokens} tokens\`)
  console.log(\`TOON: \${savings.toonTokens} tokens\`)
  console.log(\`Savings: \${savings.savings} tokens (\${savings.savingsPercent.toFixed(1)}%)\`)

  if (savings.savingsPercent > 20) {
    // Worth using TOON
    const optimized = jsonToToon(data, { compact: true })
  }
} else {
  // Use JSON for this data
  console.log('Data not suitable for TOON (non-uniform structure)')
}`}
          language="tsx"
          showLineNumbers
        />
      </section>

      <section className="my-12">
        <h2 id="batch-optimize">Batch Optimization</h2>

        <p>Optimize multiple data items at once:</p>

        <EnhancedCodeBlock
          code={`import { batchOptimize, formatForLLM } from '@clarity-chat/react/internal'

// Optimize multiple datasets
const { results, totalSavings, totalSavingsPercent } = batchOptimize([
  users,
  products,
  orders,
], {
  minSavingsPercent: 15
})

console.log(\`Total savings: \${totalSavings} tokens (\${totalSavingsPercent.toFixed(1)}%)\`)

// Or use formatForLLM for a single item with metadata
const { formatted, metadata } = formatForLLM(searchResults)
console.log(\`Format: \${metadata.format}, saved \${metadata.tokensSaved} tokens\`)`}
          language="tsx"
          showLineNumbers
        />
      </section>

      <section className="my-12">
        <h2 id="parse-flexible">Flexible Parsing</h2>

        <p>Parse responses that might be in JSON or TOON format:</p>

        <EnhancedCodeBlock
          code={`import { parseFlexible } from '@clarity-chat/react/internal'

// Works with JSON
const json = parseFlexible('{"name": "Alice", "age": 30}')
// { name: "Alice", age: 30 }

// Works with TOON
const toon = parseFlexible(\`
name, age
Alice, 30
Bob, 25
\`)
// [{ name: "Alice", age: 30 }, { name: "Bob", age: 25 }]

// Returns raw string if neither format
const raw = parseFlexible('Hello, world!')
// "Hello, world!"`}
          language="tsx"
          showLineNumbers
        />
      </section>

      <section className="my-12">
        <h2 id="nested-objects">Nested Objects</h2>

        <p>TOON uses YAML-style indentation for nested structures:</p>

        <EnhancedCodeBlock
          code={`import { jsonToToon } from '@clarity-chat/react/internal'

const config = {
  app: "MyApp",
  version: "1.0.0",
  settings: {
    theme: "dark",
    language: "en",
    notifications: true
  },
  features: ["chat", "search", "analytics"]
}

const toon = jsonToToon(config)
// Output:
// app: MyApp
// version: 1.0.0
// settings:
//   theme: dark
//   language: en
//   notifications: true
// features: [chat, search, analytics]`}
          language="tsx"
          showLineNumbers
        />
      </section>

      <section className="my-12">
        <h2 id="json-to-toon-api">jsonToToon API</h2>
        <PropsTable props={jsonToToonProps} />
      </section>

      <section className="my-12">
        <h2 id="toon-to-json-api">toonToJson API</h2>
        <PropsTable props={toonToJsonProps} />
      </section>

      <section className="my-12">
        <h2 id="auto-optimize-api">autoOptimize API</h2>
        <h3 className="text-lg font-semibold mb-4">Parameters</h3>
        <PropsTable props={autoOptimizeProps} />

        <h3 className="text-lg font-semibold mb-4 mt-8">Return Value</h3>
        <PropsTable props={autoOptimizeReturnProps} />
      </section>

      <section className="my-12">
        <h2 id="type-definitions">Type Definitions</h2>

        <EnhancedCodeBlock
          code={`interface ToonOptions {
  indent?: number
  compact?: boolean
  preserveNulls?: boolean
  quoteStrings?: boolean
}

interface ToonDecodeOptions {
  strict?: boolean
  typeHints?: Record<string, 'string' | 'number' | 'boolean' | 'object' | 'array'>
}

interface AutoToonOptions {
  minSavingsPercent?: number
  forceToon?: boolean
  forceJson?: boolean
  compact?: boolean
}

interface ToonOptimizationResult {
  format: 'json' | 'toon'
  data: string
  originalTokens: number
  optimizedTokens: number
  tokensSaved: number
  savingsPercent: number
  reason: string
}

interface ToonMetadata {
  format: 'json' | 'toon'
  originalTokens: number
  optimizedTokens: number
  tokensSaved: number
  savingsPercent: number
  timestamp: number
}`}
          language="tsx"
          showLineNumbers
        />
      </section>

      <section className="my-12">
        <h2 id="when-to-use">When to Use TOON</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border rounded-lg border-green-500/30 bg-green-500/5">
            <h3 className="font-semibold text-lg text-green-600 dark:text-green-400 mb-3">
              ✓ Good for TOON
            </h3>
            <ul className="space-y-2 text-sm">
              <li>• Arrays of objects with similar keys</li>
              <li>• User lists, product catalogs, search results</li>
              <li>• Tabular data (database query results)</li>
              <li>• Simple nested objects with primitive values</li>
              <li>• Data with 3+ items that share structure</li>
            </ul>
          </div>
          <div className="p-4 border rounded-lg border-amber-500/30 bg-amber-500/5">
            <h3 className="font-semibold text-lg text-amber-600 dark:text-amber-400 mb-3">
              ⚠ Keep as JSON
            </h3>
            <ul className="space-y-2 text-sm">
              <li>• Deeply nested structures (3+ levels)</li>
              <li>• Non-uniform arrays (different object shapes)</li>
              <li>• Single objects (minimal savings)</li>
              <li>• Complex nested arrays</li>
              <li>• Data where structure varies significantly</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="my-12">
        <h2 id="best-practices">Best Practices</h2>

        <ul className="space-y-4">
          <li className="flex gap-3">
            <span className="text-green-500">✓</span>
            <div>
              <strong>Use autoOptimize for automatic format selection</strong>:
              Let the library decide based on data structure and savings
              threshold.
            </div>
          </li>
          <li className="flex gap-3">
            <span className="text-green-500">✓</span>
            <div>
              <strong>Include TOON instructions once per conversation</strong>:
              Use <code>createToonConversationWrapper</code> to track
              instruction state.
            </div>
          </li>
          <li className="flex gap-3">
            <span className="text-green-500">✓</span>
            <div>
              <strong>Set appropriate savings thresholds</strong>: Default 20%
              is good; lower to 10-15% for high-volume scenarios.
            </div>
          </li>
          <li className="flex gap-3">
            <span className="text-green-500">✓</span>
            <div>
              <strong>Log optimization metadata</strong>: Track{' '}
              <code>savingsPercent</code> to monitor cost reduction.
            </div>
          </li>
          <li className="flex gap-3">
            <span className="text-amber-500">⚠</span>
            <div>
              <strong>Don&apos;t force TOON on non-uniform data</strong>: Use{' '}
              <code>isSuitableForToon</code> to check first.
            </div>
          </li>
        </ul>
      </section>

      <section className="my-12">
        <h2 id="related">Related</h2>

        <ul>
          <li>
            <Link href="/reference/hooks/use-token-optimization">
              useTokenOptimization
            </Link>{' '}
            - Hook for token budget management
          </li>
          <li>
            <Link href="/guides/token-optimization">
              Token Optimization Guide
            </Link>{' '}
            - Comprehensive token optimization strategies
          </li>
          <li>
            <Link href="/guides/prompt-caching">Prompt Caching Guide</Link> -
            Cache prompts for additional savings
          </li>
          <li>
            <Link href="/reference/utilities/create-memory-store">
              createMemoryStore
            </Link>{' '}
            - Memory management with token limits
          </li>
        </ul>
      </section>

      <Pagination
        prev={{
          title: 'createMemoryStore',
          href: '/reference/utilities/create-memory-store',
        }}
        next={{
          title: 'Types',
          href: '/reference/api/types',
        }}
      />
    </>
  )
}
