import type { Metadata } from 'next'
import { DocumentationPage } from '../../../../../components/Docs/DocumentationPage'
import { Section } from '../../../../../components/Docs/Section'
import { PropsTable, PropDefinition } from '../../../../../components/Docs/PropsTable'
import { LiveDemoContainer } from '../../../../../components/Docs/LiveDemoContainer'
import { CodeBlock } from '../../../../../components/Docs/CodeBlock'
import { TocItem } from '../../../../../components/Docs/TableOfContents'

export const revalidate = 3600 // ISR: revalidate every hour

export const metadata: Metadata = {
  title: 'TokenizationResult Type | Clarity AI Chat Components',
  description:
    'Comprehensive API reference for the TokenizationResult type. Understand token usage with accurate cost tracking, provider-specific differences, and optimization insights.',
  openGraph: {
    title: 'TokenizationResult Type',
    description: 'Token counting and cost tracking type definition',
    type: 'article',
  },
}

const tableOfContents: TocItem[] = [
  { id: 'overview', title: 'Overview', level: 2 },
  { id: 'type-definition', title: 'Type Definition', level: 2 },
  { id: 'properties', title: 'Properties Reference', level: 2 },
  { id: 'token-breakdown', title: 'Token Count & Breakdown', level: 2 },
  { id: 'provider-differences', title: 'Provider-Specific Differences', level: 2 },
  { id: 'cost-impact', title: 'Cost Impact & Tracking', level: 2 },
  { id: 'usage-examples', title: 'Usage Examples', level: 2 },
  { id: 'streaming', title: 'Streaming Tokenization', level: 2 },
  { id: 'patterns', title: 'Common Patterns', level: 2 },
  { id: 'utilities', title: 'Utility Functions', level: 2 },
  { id: 'optimization', title: 'Token Optimization', level: 2 },
  { id: 'related', title: 'Related APIs', level: 2 },
]

// Type properties definition
const typeProperties: PropDefinition[] = [
  {
    name: 'total',
    type: 'number',
    required: true,
    description: 'Total number of tokens in the text/message',
  },
  {
    name: 'input',
    type: 'number',
    description: 'Number of input/prompt tokens (for messages)',
  },
  {
    name: 'output',
    type: 'number',
    description: 'Number of output/completion tokens (for messages)',
  },
  {
    name: 'model',
    type: 'string',
    required: true,
    description: 'Model identifier used for tokenization (e.g., "gpt-4", "claude-3-opus")',
  },
  {
    name: 'method',
    type: "'accurate' | 'estimated' | 'fallback'",
    required: true,
    description: 'Tokenization method used: accurate (tiktoken), estimated (heuristic), or fallback (error recovery)',
  },
  {
    name: 'encoding',
    type: 'string',
    description: 'Tokenizer encoding used (e.g., "cl100k_base", "o200k_base")',
  },
  {
    name: 'provider',
    type: "'openai' | 'anthropic' | 'google' | 'deepseek' | 'meta' | 'mistral'",
    description: 'Model provider for context-specific handling',
  },
  {
    name: 'cost',
    type: 'number',
    description: 'Estimated cost in USD based on current pricing',
  },
  {
    name: 'cached',
    type: 'boolean',
    description: 'Whether the result was retrieved from cache',
  },
  {
    name: 'timestamp',
    type: 'number',
    description: 'Unix timestamp (ms) when tokenization was performed',
  },
]

export default function TokenizationResultPage() {
  return (
    <DocumentationPage
      title="TokenizationResult"
      description="Type definition for token counting results with cost tracking"
      category="Types"
      icon="📋"
      badges={[
        { label: 'Core Type', variant: 'primary' },
        { label: 'Cost Tracking', variant: 'info' },
        { label: 'Multi-Provider', variant: 'success' },
      ]}
      features={[
        'Accurate token counting for all major LLM providers',
        'Input/output token breakdown for cost calculation',
        'Provider-specific encoding detection',
        'Multiple tokenization methods (accurate, estimated, fallback)',
        'Built-in cost estimation based on current pricing',
        'Cache hit tracking for performance monitoring',
        'Timestamp tracking for analytics',
        'Model-specific metadata for optimization',
        'Streaming tokenization support',
        'Integration with Token Optimization utilities',
      ]}
      tableOfContents={tableOfContents}
    >
      <Section id="overview" title="Overview">
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          TokenizationResult is the core type returned by all tokenization functions in Clarity
          Chat Components. It provides comprehensive information about token counts, encoding
          methods, costs, and metadata for accurate budget tracking and optimization.
        </p>

        <div className="bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-2xl">💡</span>
            <span>Why TokenizationResult Matters</span>
          </h3>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl shrink-0">✓</span>
              <span>
                <strong className="text-foreground">Accurate Cost Tracking:</strong> Understand
                exact token usage for precise billing and budget management
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl shrink-0">✓</span>
              <span>
                <strong className="text-foreground">Provider Flexibility:</strong> Works across
                OpenAI, Anthropic, Google, and other providers with consistent interface
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl shrink-0">✓</span>
              <span>
                <strong className="text-foreground">Optimization Insights:</strong> Method field
                helps identify when estimation vs. accurate counting is used
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl shrink-0">✓</span>
              <span>
                <strong className="text-foreground">Performance Monitoring:</strong> Cache tracking
                and timestamps enable performance analysis
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-muted/30 border border-border rounded-xl p-6">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <span>🎯</span>
            <span>Use Cases</span>
          </h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <div className="font-medium text-foreground mb-1">Budget Management</div>
              <p>Track token usage to prevent cost overruns and enforce budget limits</p>
            </div>
            <div>
              <div className="font-medium text-foreground mb-1">Cost Estimation</div>
              <p>Calculate accurate costs before sending requests to LLM APIs</p>
            </div>
            <div>
              <div className="font-medium text-foreground mb-1">Analytics</div>
              <p>Monitor token consumption patterns and optimization opportunities</p>
            </div>
            <div>
              <div className="font-medium text-foreground mb-1">Context Management</div>
              <p>Manage context window limits by tracking token counts across conversations</p>
            </div>
          </div>
        </div>
      </Section>

      <Section id="type-definition" title="Type Definition">
        <p className="text-muted-foreground mb-6">
          Full TypeScript interface definition for TokenizationResult.
        </p>

        <CodeBlock
          language="typescript"
          code={`/**
 * Result of tokenization operation
 *
 * Returned by all token counting functions including:
 * - countTokens()
 * - countConversationTokens()
 * - useTokenCounter hook
 * - TokenCounter component
 */
export interface TokenizationResult {
  /** Total number of tokens */
  total: number

  /** Input/prompt tokens (for messages) */
  input?: number

  /** Output/completion tokens (for messages) */
  output?: number

  /** Model identifier used for tokenization */
  model: string

  /** Tokenization method used */
  method: 'accurate' | 'estimated' | 'fallback'

  /** Tokenizer encoding (e.g., "cl100k_base") */
  encoding?: string

  /** Model provider */
  provider?: 'openai' | 'anthropic' | 'google' | 'deepseek' | 'meta' | 'mistral'

  /** Estimated cost in USD */
  cost?: number

  /** Whether result was from cache */
  cached?: boolean

  /** Unix timestamp (ms) of tokenization */
  timestamp?: number
}`}
          filename="types.ts"
        />

        <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
          <div className="font-semibold text-blue-500 mb-2 flex items-center gap-2">
            <span>💡</span>
            <span>Import Path</span>
          </div>
          <CodeBlock
            language="typescript"
            code={`// From accurate-counter utilities
import type { TokenCount as TokenizationResult } from '@clarity-chat/react/tokenization'

// Or from specific utility files
import type { TokenCount } from '@clarity-chat/react/utils/tokenization/accurate-counter'`}
            filename="imports.ts"
          />
        </div>
      </Section>

      <Section id="properties" title="Properties Reference">
        <p className="text-muted-foreground mb-6">
          Detailed reference for all TokenizationResult properties.
        </p>
        <PropsTable props={typeProperties} />
      </Section>

      <Section id="token-breakdown" title="Token Count & Breakdown">
        <p className="text-muted-foreground mb-6">
          Understanding the different token count fields and when each is populated.
        </p>

        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-4">Total Tokens</h4>
            <CodeBlock
              language="typescript"
              code={`import { countTokens } from '@clarity-chat/react/tokenization'

// Count tokens in plain text
const result = await countTokens("Hello, world!", { model: 'gpt-4' })
console.log(result.total) // 4 tokens

// total is always populated for all tokenization results
console.log({
  total: result.total,      // 4
  model: result.model,      // "gpt-4"
  method: result.method     // "accurate"
})`}
              filename="total-tokens.ts"
            />
          </div>

          <div>
            <h4 className="font-semibold mb-4">Input/Output Breakdown</h4>
            <p className="text-sm text-muted-foreground mb-4">
              For conversation messages, input and output fields provide granular cost breakdown.
            </p>
            <CodeBlock
              language="typescript"
              code={`import { countConversationTokens } from '@clarity-chat/react/tokenization'

const messages = [
  { role: 'user', content: 'What is the capital of France?' },
  { role: 'assistant', content: 'The capital of France is Paris.' }
]

const result = await countConversationTokens(messages, { model: 'gpt-4' })

console.log({
  total: result.total,      // 22 tokens (input + output + overhead)
  input: result.input,      // 8 tokens (user message)
  output: result.output,    // 10 tokens (assistant response)
  model: result.model       // "gpt-4"
})

// Calculate cost with different input/output pricing
const inputCost = (result.input / 1000) * 0.03   // $0.03 per 1K input tokens
const outputCost = (result.output / 1000) * 0.06 // $0.06 per 1K output tokens
const totalCost = inputCost + outputCost          // $0.00084`}
              filename="input-output-breakdown.ts"
            />
          </div>

          <div className="bg-muted/30 border border-border rounded-xl p-6">
            <h4 className="font-semibold mb-4">Overhead Tokens</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Conversation tokenization includes overhead for message formatting:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• <strong className="text-foreground">~4 tokens per message</strong> for role, separators, and formatting</li>
              <li>• <strong className="text-foreground">+1 token</strong> if message includes a name field</li>
              <li>• <strong className="text-foreground">+2 tokens</strong> for priming the assistant response</li>
            </ul>
            <div className="mt-4 p-4 bg-background rounded-lg">
              <div className="text-xs font-mono">
                total = sum(content_tokens) + (num_messages × 4) + 2
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section id="provider-differences" title="Provider-Specific Differences">
        <p className="text-muted-foreground mb-6">
          Different LLM providers use different tokenization schemes. Understanding these
          differences is crucial for accurate cost estimation and context window management.
        </p>

        <div className="space-y-6">
          {/* Provider comparison table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Provider</th>
                  <th className="text-left py-3 px-4 font-semibold">Encoding</th>
                  <th className="text-left py-3 px-4 font-semibold">Chars/Token</th>
                  <th className="text-left py-3 px-4 font-semibold">Example Models</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium text-foreground">OpenAI</td>
                  <td className="py-3 px-4 font-mono">cl100k_base</td>
                  <td className="py-3 px-4">~4.0</td>
                  <td className="py-3 px-4">GPT-4, GPT-3.5 Turbo</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium text-foreground">OpenAI</td>
                  <td className="py-3 px-4 font-mono">o200k_base</td>
                  <td className="py-3 px-4">~4.0</td>
                  <td className="py-3 px-4">GPT-4o, O1, O3</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium text-foreground">Anthropic</td>
                  <td className="py-3 px-4 font-mono">claude</td>
                  <td className="py-3 px-4">~3.8</td>
                  <td className="py-3 px-4">Claude 3/4 (all variants)</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium text-foreground">Google</td>
                  <td className="py-3 px-4 font-mono">gemini</td>
                  <td className="py-3 px-4">~4.0</td>
                  <td className="py-3 px-4">Gemini 1.5/2.0</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium text-foreground">DeepSeek</td>
                  <td className="py-3 px-4 font-mono">deepseek</td>
                  <td className="py-3 px-4">~4.0</td>
                  <td className="py-3 px-4">DeepSeek Chat/Coder/R1</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium text-foreground">Meta</td>
                  <td className="py-3 px-4 font-mono">llama3</td>
                  <td className="py-3 px-4">~4.0</td>
                  <td className="py-3 px-4">Llama 3/3.1/3.2/3.3</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-foreground">Mistral</td>
                  <td className="py-3 px-4 font-mono">mistral</td>
                  <td className="py-3 px-4">~4.0</td>
                  <td className="py-3 px-4">Mistral Large/Medium/Small</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Provider Detection Example</h4>
            <CodeBlock
              language="typescript"
              code={`import { countTokens } from '@clarity-chat/react/tokenization'

// Different providers automatically use correct encoding
const results = await Promise.all([
  countTokens("Hello, world!", { model: 'gpt-4' }),
  countTokens("Hello, world!", { model: 'claude-3-opus' }),
  countTokens("Hello, world!", { model: 'gemini-1.5-pro' })
])

results.forEach(result => {
  console.log({
    model: result.model,
    provider: result.provider,
    encoding: result.encoding,
    tokens: result.total
  })
})

// Output:
// { model: 'gpt-4', provider: 'openai', encoding: 'cl100k_base', tokens: 4 }
// { model: 'claude-3-opus', provider: 'anthropic', encoding: 'claude', tokens: 3 }
// { model: 'gemini-1.5-pro', provider: 'google', encoding: 'gemini', tokens: 4 }`}
              filename="provider-detection.ts"
            />
          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-xl border border-yellow-500/20 rounded-xl p-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <span>⚠️</span>
              <span>Provider-Specific Considerations</span>
            </h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div>
                <strong className="text-foreground">Anthropic Claude:</strong> Uses ~5% fewer tokens
                per character than OpenAI models. Same English text may count as fewer tokens.
              </div>
              <div>
                <strong className="text-foreground">OpenAI O1/O3:</strong> Reasoning models include
                internal reasoning tokens in the count, which can be 2-5x the visible output.
              </div>
              <div>
                <strong className="text-foreground">Non-English Text:</strong> Token counts vary
                significantly by language. Asian languages typically use 2-3x more tokens per character.
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section id="cost-impact" title="Cost Impact & Tracking">
        <p className="text-muted-foreground mb-6">
          Understand token usage for accurate cost tracking and budget management.
        </p>

        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-4">Automatic Cost Calculation</h4>
            <CodeBlock
              language="typescript"
              code={`import { countTokens } from '@clarity-chat/react/tokenization'
import { calculateCost } from '@clarity-chat/react/utils/token-pricing'

const text = "Analyze the sentiment of customer feedback and provide insights."
const result = await countTokens(text, { model: 'gpt-4-turbo' })

// Manual cost calculation
const inputPrice = 0.01 / 1000  // $0.01 per 1K input tokens
const cost = result.total * inputPrice

console.log({
  tokens: result.total,           // 14
  cost: cost,                     // $0.00014
  costFormatted: \`$\${cost.toFixed(6)}\`  // "$0.000140"
})

// Or use built-in cost calculation
const costInfo = calculateCost({
  tokens: result.total,
  model: 'gpt-4-turbo',
  type: 'input'
})

console.log({
  tokens: costInfo.tokens,        // 14
  cost: costInfo.cost,            // $0.00014
  pricePerToken: costInfo.pricePerToken,  // $0.00001
  model: costInfo.model           // "gpt-4-turbo"
})`}
              filename="cost-tracking.ts"
            />
          </div>

          <div>
            <h4 className="font-semibold mb-4">Different Input/Output Pricing</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Most models charge different rates for input vs. output tokens.
            </p>
            <CodeBlock
              language="typescript"
              code={`import { countConversationTokens } from '@clarity-chat/react/tokenization'

const messages = [
  { role: 'user', content: 'Summarize this article...' },
  { role: 'assistant', content: 'The article discusses...' }
]

const result = await countConversationTokens(messages, { model: 'gpt-4' })

// GPT-4 pricing (as of 2026)
const INPUT_PRICE = 0.03 / 1000   // $0.03 per 1K input tokens
const OUTPUT_PRICE = 0.06 / 1000  // $0.06 per 1K output tokens

const inputCost = result.input * INPUT_PRICE
const outputCost = result.output * OUTPUT_PRICE
const totalCost = inputCost + outputCost

console.log({
  inputTokens: result.input,      // 5 tokens
  outputTokens: result.output,    // 6 tokens
  totalTokens: result.total,      // 17 tokens (includes overhead)
  inputCost: inputCost,           // $0.00015
  outputCost: outputCost,         // $0.00036
  totalCost: totalCost            // $0.00051
})

// Cost breakdown
console.log(\`Input:  \${result.input} tokens × $\${INPUT_PRICE * 1000}/1K = $\${inputCost.toFixed(6)}\`)
console.log(\`Output: \${result.output} tokens × $\${OUTPUT_PRICE * 1000}/1K = $\${outputCost.toFixed(6)}\`)
console.log(\`Total:  $\${totalCost.toFixed(6)}\`)`}
              filename="input-output-pricing.ts"
            />
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-500/20 rounded-xl p-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <span>💰</span>
              <span>Cost Optimization Opportunities</span>
            </h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-background rounded-lg border border-border">
                <div className="font-medium mb-1">Model Selection</div>
                <div className="text-xs text-muted-foreground">
                  GPT-4 Turbo ($0.01/1K) costs 66% less than GPT-4 ($0.03/1K) for similar quality
                </div>
              </div>
              <div className="p-3 bg-background rounded-lg border border-border">
                <div className="font-medium mb-1">Prompt Engineering</div>
                <div className="text-xs text-muted-foreground">
                  Concise prompts can reduce token usage by 30-50% with same results
                </div>
              </div>
              <div className="p-3 bg-background rounded-lg border border-border">
                <div className="font-medium mb-1">Context Pruning</div>
                <div className="text-xs text-muted-foreground">
                  Summarize old messages instead of full history (80%+ token reduction)
                </div>
              </div>
              <div className="p-3 bg-background rounded-lg border border-border">
                <div className="font-medium mb-1">Caching</div>
                <div className="text-xs text-muted-foreground">
                  Anthropic Claude offers 90% discount on cached input tokens
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section id="usage-examples" title="Usage Examples with Different Models">
        <p className="text-muted-foreground mb-6">
          Practical examples of using TokenizationResult across different model families.
        </p>

        <div className="space-y-8">
          <div>
            <h4 className="font-semibold mb-4">OpenAI Models</h4>
            <CodeBlock
              language="typescript"
              code={`import { countTokens } from '@clarity-chat/react/tokenization'

// GPT-4 Turbo (128K context window)
const gpt4Result = await countTokens(
  "Explain quantum computing in simple terms",
  { model: 'gpt-4-turbo' }
)

console.log({
  model: gpt4Result.model,        // "gpt-4-turbo"
  encoding: gpt4Result.encoding,  // "cl100k_base"
  tokens: gpt4Result.total,       // 8
  method: gpt4Result.method       // "accurate"
})

// GPT-4o (uses newer encoding)
const gpt4oResult = await countTokens(
  "Explain quantum computing in simple terms",
  { model: 'gpt-4o' }
)

console.log({
  model: gpt4oResult.model,       // "gpt-4o"
  encoding: gpt4oResult.encoding, // "o200k_base"
  tokens: gpt4oResult.total,      // 8
  method: gpt4oResult.method      // "accurate"
})`}
              filename="openai-example.ts"
            />
          </div>

          <div>
            <h4 className="font-semibold mb-4">Anthropic Claude Models</h4>
            <CodeBlock
              language="typescript"
              code={`import { countConversationTokens } from '@clarity-chat/react/tokenization'

const messages = [
  { role: 'user', content: 'What is machine learning?' },
  { role: 'assistant', content: 'Machine learning is a subset of AI...' }
]

// Claude 3 Opus (200K context window)
const claudeResult = await countConversationTokens(messages, {
  model: 'claude-3-opus'
})

console.log({
  model: claudeResult.model,        // "claude-3-opus"
  provider: claudeResult.provider,  // "anthropic"
  encoding: claudeResult.encoding,  // "claude"
  total: claudeResult.total,        // 20 (slightly fewer than OpenAI)
  input: claudeResult.input,        // 6
  output: claudeResult.output       // 10
})

// Claude typically uses 5-10% fewer tokens for same English text
// due to more efficient tokenization`}
              filename="claude-example.ts"
            />
          </div>

          <div>
            <h4 className="font-semibold mb-4">Google Gemini Models</h4>
            <CodeBlock
              language="typescript"
              code={`import { countTokens } from '@clarity-chat/react/tokenization'

// Gemini 2.0 Flash (1M context window)
const geminiResult = await countTokens(
  "Write a haiku about technology",
  { model: 'gemini-2.0-flash' }
)

console.log({
  model: geminiResult.model,        // "gemini-2.0-flash"
  provider: geminiResult.provider,  // "google"
  encoding: geminiResult.encoding,  // "gemini"
  tokens: geminiResult.total,       // 7
  method: geminiResult.method       // "accurate"
})`}
              filename="gemini-example.ts"
            />
          </div>

          <div>
            <h4 className="font-semibold mb-4">Multi-Model Comparison</h4>
            <CodeBlock
              language="typescript"
              code={`import { countTokens } from '@clarity-chat/react/tokenization'

const text = "Analyze customer sentiment from feedback data"

// Compare token counts across providers
const models = [
  'gpt-4-turbo',
  'gpt-3.5-turbo',
  'claude-3-opus',
  'claude-3-sonnet',
  'gemini-2.0-flash'
]

const results = await Promise.all(
  models.map(model => countTokens(text, { model }))
)

// Display comparison
results.forEach((result, i) => {
  const pricing = getModelPricing(result.model)
  const cost = (result.total / 1000) * pricing.inputPer1M

  console.log({
    model: result.model,
    provider: result.provider,
    tokens: result.total,
    cost: \`$\${cost.toFixed(6)}\`,
    encoding: result.encoding
  })
})

// Sample output:
// gpt-4-turbo:     8 tokens, $0.000080, cl100k_base
// gpt-3.5-turbo:   8 tokens, $0.000016, cl100k_base
// claude-3-opus:   7 tokens, $0.000105, claude
// claude-3-sonnet: 7 tokens, $0.000021, claude
// gemini-2.0-flash: 8 tokens, $0.000004, gemini`}
              filename="multi-model-comparison.ts"
            />
          </div>
        </div>
      </Section>

      <Section id="streaming" title="Streaming Tokenization">
        <p className="text-muted-foreground mb-6">
          Track token usage during streaming responses for real-time cost monitoring.
        </p>

        <CodeBlock
          language="typescript"
          code={`import { countTokens } from '@clarity-chat/react/tokenization'
import { useState, useEffect } from 'react'

export function StreamingTokenTracker() {
  const [streamedContent, setStreamedContent] = useState('')
  const [currentTokens, setCurrentTokens] = useState<TokenizationResult | null>(null)
  const [totalCost, setTotalCost] = useState(0)

  // Update token count as stream progresses
  useEffect(() => {
    if (!streamedContent) return

    countTokens(streamedContent, { model: 'gpt-4-turbo' })
      .then(result => {
        setCurrentTokens(result)

        // Calculate cost
        const OUTPUT_PRICE = 0.03 / 1000
        const cost = result.total * OUTPUT_PRICE
        setTotalCost(cost)
      })
  }, [streamedContent])

  // Simulate streaming (in real app, this comes from API)
  useEffect(() => {
    const chunks = [
      "The answer",
      " to your",
      " question is",
      " based on",
      " analyzing the",
      " provided context."
    ]

    let currentChunk = 0
    const interval = setInterval(() => {
      if (currentChunk < chunks.length) {
        setStreamedContent(prev => prev + chunks[currentChunk])
        currentChunk++
      } else {
        clearInterval(interval)
      }
    }, 200)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted/30 border border-border rounded-xl">
        <div className="text-sm font-medium mb-2">Streamed Response:</div>
        <div className="text-sm text-muted-foreground">
          {streamedContent}
          <span className="animate-pulse">|</span>
        </div>
      </div>

      {currentTokens && (
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <div className="text-xs text-muted-foreground mb-1">Tokens</div>
            <div className="text-lg font-bold">{currentTokens.total}</div>
          </div>
          <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl">
            <div className="text-xs text-muted-foreground mb-1">Cost</div>
            <div className="text-lg font-bold">\${totalCost.toFixed(6)}</div>
          </div>
          <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl">
            <div className="text-xs text-muted-foreground mb-1">Method</div>
            <div className="text-lg font-bold">{currentTokens.method}</div>
          </div>
        </div>
      )}
    </div>
  )
}`}
          filename="streaming-tracker.tsx"
        />

        <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
          <div className="font-semibold text-blue-500 mb-2">💡 Performance Tip</div>
          <p className="text-sm text-muted-foreground">
            For streaming, throttle token counting to every 100-200ms or every N chunks to avoid
            excessive re-renders. Use the cached property to check if result came from cache.
          </p>
        </div>
      </Section>

      <Section id="patterns" title="Common Patterns & Utilities">
        <p className="text-muted-foreground mb-6">
          Common patterns for working with TokenizationResult in real applications.
        </p>

        <div className="space-y-8">
          <div>
            <h4 className="font-semibold mb-4">Budget Enforcement</h4>
            <CodeBlock
              language="typescript"
              code={`import { countTokens } from '@clarity-chat/react/tokenization'

interface BudgetConfig {
  maxTokens: number
  maxCost: number
  model: string
}

async function enforceTokenBudget(
  text: string,
  config: BudgetConfig
): Promise<{ allowed: boolean; result: TokenizationResult; reason?: string }> {
  const result = await countTokens(text, { model: config.model })

  // Check token limit
  if (result.total > config.maxTokens) {
    return {
      allowed: false,
      result,
      reason: \`Exceeds token limit: \${result.total} > \${config.maxTokens}\`
    }
  }

  // Check cost limit
  const pricing = getModelPricing(config.model)
  const cost = (result.total / 1000) * pricing.inputPer1M

  if (cost > config.maxCost) {
    return {
      allowed: false,
      result,
      reason: \`Exceeds cost limit: $\${cost.toFixed(4)} > $\${config.maxCost.toFixed(4)}\`
    }
  }

  return { allowed: true, result }
}

// Usage
const budget: BudgetConfig = {
  maxTokens: 1000,
  maxCost: 0.05,
  model: 'gpt-4-turbo'
}

const { allowed, result, reason } = await enforceTokenBudget(userPrompt, budget)

if (!allowed) {
  console.error('Budget exceeded:', reason)
  alert(reason)
} else {
  // Proceed with request
  await sendToLLM(userPrompt)
}`}
              filename="budget-enforcement.ts"
            />
          </div>

          <div>
            <h4 className="font-semibold mb-4">Analytics Tracking</h4>
            <CodeBlock
              language="typescript"
              code={`import { countConversationTokens } from '@clarity-chat/react/tokenization'

interface TokenAnalytics {
  totalTokens: number
  totalCost: number
  messageCount: number
  avgTokensPerMessage: number
  timestamp: number
  model: string
}

async function trackConversationAnalytics(
  messages: Array<{ role: string; content: string }>,
  model: string
): Promise<TokenAnalytics> {
  const result = await countConversationTokens(messages, { model })

  const pricing = getModelPricing(model)
  const inputCost = (result.input / 1000) * pricing.inputPer1M
  const outputCost = (result.output / 1000) * pricing.outputPer1M
  const totalCost = inputCost + outputCost

  const analytics: TokenAnalytics = {
    totalTokens: result.total,
    totalCost,
    messageCount: messages.length,
    avgTokensPerMessage: Math.round(result.total / messages.length),
    timestamp: Date.now(),
    model: result.model
  }

  // Send to analytics service
  await sendAnalytics('conversation_tokens', analytics)

  return analytics
}

// Usage
const analytics = await trackConversationAnalytics(conversationMessages, 'gpt-4')

console.log(\`
  Conversation Analytics:
  - Messages: \${analytics.messageCount}
  - Total Tokens: \${analytics.totalTokens}
  - Avg Tokens/Message: \${analytics.avgTokensPerMessage}
  - Total Cost: $\${analytics.totalCost.toFixed(4)}
  - Model: \${analytics.model}
\`)`}
              filename="analytics-tracking.ts"
            />
          </div>

          <div>
            <h4 className="font-semibold mb-4">Context Window Management</h4>
            <CodeBlock
              language="typescript"
              code={`import { countConversationTokens } from '@clarity-chat/react/tokenization'

interface ContextManager {
  maxTokens: number
  reservedTokens: number  // For system prompt + response
  model: string
}

async function pruneConversationToFit(
  messages: Array<{ role: string; content: string; id: string }>,
  config: ContextManager
): Promise<{
  prunedMessages: Array<{ role: string; content: string; id: string }>
  tokensRemoved: number
  messagesRemoved: number
}> {
  const availableTokens = config.maxTokens - config.reservedTokens
  let currentMessages = [...messages]

  // Count current usage
  let result = await countConversationTokens(currentMessages, {
    model: config.model
  })

  let tokensRemoved = 0
  let messagesRemoved = 0

  // Prune oldest messages until we fit
  while (result.total > availableTokens && currentMessages.length > 1) {
    // Keep system message (first) and most recent user message
    if (currentMessages.length <= 2) break

    // Remove second-oldest message (oldest non-system)
    const removed = currentMessages.splice(1, 1)[0]
    messagesRemoved++

    // Recalculate
    const newResult = await countConversationTokens(currentMessages, {
      model: config.model
    })
    tokensRemoved += result.total - newResult.total
    result = newResult
  }

  return {
    prunedMessages: currentMessages,
    tokensRemoved,
    messagesRemoved
  }
}

// Usage
const manager: ContextManager = {
  maxTokens: 4096,
  reservedTokens: 1000,  // Reserve for system + response
  model: 'gpt-3.5-turbo'
}

const { prunedMessages, tokensRemoved, messagesRemoved } =
  await pruneConversationToFit(conversationHistory, manager)

console.log(\`Pruned \${messagesRemoved} messages, removed \${tokensRemoved} tokens\`)`}
              filename="context-management.ts"
            />
          </div>
        </div>
      </Section>

      <Section id="utilities" title="Utility Functions">
        <p className="text-muted-foreground mb-6">
          Helper functions for working with TokenizationResult.
        </p>

        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-4">Cost Calculation Helper</h4>
            <CodeBlock
              language="typescript"
              code={`import type { TokenizationResult } from '@clarity-chat/react/tokenization'

interface CostBreakdown {
  inputCost: number
  outputCost: number
  totalCost: number
  inputTokens: number
  outputTokens: number
  totalTokens: number
  model: string
  currency: string
}

function calculateDetailedCost(
  result: TokenizationResult,
  pricing: { inputPer1M: number; outputPer1M: number }
): CostBreakdown {
  const inputTokens = result.input || 0
  const outputTokens = result.output || 0

  const inputCost = (inputTokens / 1_000_000) * pricing.inputPer1M
  const outputCost = (outputTokens / 1_000_000) * pricing.outputPer1M
  const totalCost = inputCost + outputCost

  return {
    inputCost,
    outputCost,
    totalCost,
    inputTokens,
    outputTokens,
    totalTokens: result.total,
    model: result.model,
    currency: 'USD'
  }
}

// Usage
const result = await countConversationTokens(messages, { model: 'gpt-4' })
const pricing = { inputPer1M: 30, outputPer1M: 60 }  // $30/$60 per 1M tokens
const breakdown = calculateDetailedCost(result, pricing)

console.log(\`
  Input:  \${breakdown.inputTokens} tokens @ $\${pricing.inputPer1M}/1M = $\${breakdown.inputCost.toFixed(6)}
  Output: \${breakdown.outputTokens} tokens @ $\${pricing.outputPer1M}/1M = $\${breakdown.outputCost.toFixed(6)}
  Total:  \${breakdown.totalTokens} tokens = $\${breakdown.totalCost.toFixed(6)}
\`)`}
              filename="cost-helper.ts"
            />
          </div>

          <div>
            <h4 className="font-semibold mb-4">Format Display Helper</h4>
            <CodeBlock
              language="typescript"
              code={`import type { TokenizationResult } from '@clarity-chat/react/tokenization'

function formatTokenizationResult(result: TokenizationResult): string {
  const parts: string[] = []

  // Token count
  if (result.input && result.output) {
    parts.push(\`\${result.total} tokens (\${result.input} in / \${result.output} out)\`)
  } else {
    parts.push(\`\${result.total} tokens\`)
  }

  // Model info
  parts.push(\`model: \${result.model}\`)

  // Method indicator
  if (result.method === 'estimated') {
    parts.push('(estimated)')
  } else if (result.method === 'fallback') {
    parts.push('(fallback)')
  }

  // Cost if available
  if (result.cost !== undefined) {
    parts.push(\`cost: $\${result.cost.toFixed(6)}\`)
  }

  return parts.join(' • ')
}

// Usage
const result = await countConversationTokens(messages, { model: 'gpt-4-turbo' })
console.log(formatTokenizationResult(result))
// Output: "142 tokens (45 in / 85 out) • model: gpt-4-turbo • cost: $0.001450"`}
              filename="format-helper.ts"
            />
          </div>
        </div>
      </Section>

      <Section id="optimization" title="Token Optimization">
        <p className="text-muted-foreground mb-6">
          Link to comprehensive token optimization guide and related tools.
        </p>

        <div className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span>Achieve 50-90% Cost Savings</span>
          </h3>
          <p className="text-muted-foreground mb-6">
            TokenizationResult is the foundation for comprehensive token optimization. Learn
            advanced techniques to dramatically reduce costs while maintaining quality.
          </p>
          <a
            href="/guides/token-optimization"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
          >
            <span>View Token Optimization Guide</span>
            <span>→</span>
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-6 bg-muted/30 border border-border rounded-xl">
            <div className="text-sm font-semibold mb-3 flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full">
                ⚡ 50-90% Savings
              </span>
            </div>
            <h4 className="font-semibold mb-2">Smart Pruning</h4>
            <p className="text-sm text-muted-foreground">
              Use TokenizationResult to identify which messages to remove from context while
              preserving conversation quality.
            </p>
          </div>

          <div className="p-6 bg-muted/30 border border-border rounded-xl">
            <div className="text-sm font-semibold mb-3 flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full">
                ⚡ 50-90% Savings
              </span>
            </div>
            <h4 className="font-semibold mb-2">Model Selection</h4>
            <p className="text-sm text-muted-foreground">
              Compare token counts across models to choose the most cost-effective option for
              your use case.
            </p>
          </div>

          <div className="p-6 bg-muted/30 border border-border rounded-xl">
            <div className="text-sm font-semibold mb-3 flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full">
                ⚡ 50-90% Savings
              </span>
            </div>
            <h4 className="font-semibold mb-2">Caching Strategy</h4>
            <p className="text-sm text-muted-foreground">
              Track which tokens are cacheable to leverage provider caching discounts (up to 90%
              off).
            </p>
          </div>

          <div className="p-6 bg-muted/30 border border-border rounded-xl">
            <div className="text-sm font-semibold mb-3 flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full">
                ⚡ 50-90% Savings
              </span>
            </div>
            <h4 className="font-semibold mb-2">Real-Time Monitoring</h4>
            <p className="text-sm text-muted-foreground">
              Use timestamp and method fields to track tokenization performance and identify
              optimization opportunities.
            </p>
          </div>
        </div>
      </Section>

      <Section id="related" title="Related APIs">
        <div className="grid md:grid-cols-2 gap-4">
          <a
            href="/reference/utils/count-tokens"
            className="group p-6 bg-muted/30 border border-border hover:border-primary/50 rounded-xl transition-all"
          >
            <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
              countTokens() Function →
            </h4>
            <p className="text-sm text-muted-foreground">
              Main function for counting tokens in text, returns TokenizationResult
            </p>
          </a>

          <a
            href="/reference/utils/count-conversation-tokens"
            className="group p-6 bg-muted/30 border border-border hover:border-primary/50 rounded-xl transition-all"
          >
            <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
              countConversationTokens() →
            </h4>
            <p className="text-sm text-muted-foreground">
              Count tokens in conversation messages with input/output breakdown
            </p>
          </a>

          <a
            href="/reference/components/token-counter"
            className="group p-6 bg-muted/30 border border-border hover:border-primary/50 rounded-xl transition-all"
          >
            <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
              TokenCounter Component →
            </h4>
            <p className="text-sm text-muted-foreground">
              Visual component displaying TokenizationResult with progress bars and warnings
            </p>
          </a>

          <a
            href="/reference/components/token-cost-preview"
            className="group p-6 bg-muted/30 border border-border hover:border-primary/50 rounded-xl transition-all"
          >
            <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
              TokenCostPreview Component →
            </h4>
            <p className="text-sm text-muted-foreground">
              Real-time cost estimation using TokenizationResult
            </p>
          </a>

          <a
            href="/reference/hooks/use-token-counter"
            className="group p-6 bg-muted/30 border border-border hover:border-primary/50 rounded-xl transition-all"
          >
            <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
              useTokenCounter Hook →
            </h4>
            <p className="text-sm text-muted-foreground">
              React hook for reactive token counting, returns TokenizationResult
            </p>
          </a>

          <a
            href="/guides/token-optimization"
            className="group p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 hover:border-purple-500/50 rounded-xl transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold">
                ⚡ 50-90% Savings
              </span>
            </div>
            <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
              Token Optimization Guide →
            </h4>
            <p className="text-sm text-muted-foreground">
              Comprehensive guide to reducing costs with advanced token optimization techniques
            </p>
          </a>
        </div>
      </Section>
    </DocumentationPage>
  )
}
