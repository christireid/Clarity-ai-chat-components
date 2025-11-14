# Type Reference - Prompt & Token Optimization

Complete type reference for the prompt and token optimization layer.

## Toon DSL Types

```tsx
// Base node type
type ToonNode = ToonText | ToonVariable | ToonSection | ToonRole | ToonSequence | ToonConditional

interface ToonText {
  type: 'text'
  content: string
  metadata?: Record<string, any>
}

interface ToonVariable {
  type: 'variable'
  name: string
  defaultValue?: string
  required?: boolean
  metadata?: Record<string, any>
}

interface ToonSection {
  type: 'section'
  name: string
  content: ToonNode[]
  metadata?: Record<string, any>
}

interface ToonRole {
  type: 'role'
  role: 'system' | 'user' | 'assistant'
  content: ToonNode[]
  metadata?: Record<string, any>
}

interface ToonSequence {
  type: 'sequence'
  nodes: ToonNode[]
  separator?: string
  metadata?: Record<string, any>
}

interface ToonConditional {
  type: 'conditional'
  condition: string
  then: ToonNode[]
  else?: ToonNode[]
  metadata?: Record<string, any>
}
```

## Token Estimation Types

```tsx
interface Tokenizer {
  count(text: string): number
  getModel(): string
}

interface ModelMetadata {
  model: string
  maxTokens: number
  inputPricePer1K?: number
  outputPricePer1K?: number
  tokenizer?: Tokenizer
}
```

## Recipe Types

```tsx
interface PromptRecipe {
  id: string
  name: string
  description?: string
  systemPrompt?: ToonNode[]
  userMessage?: ToonNode[]
  assistantMessage?: ToonNode[]
  toolMessage?: ToonNode[]
  metadata?: Record<string, any>
}

interface RecipeBuilderOptions {
  systemPrompt?: ToonNode[] | ((builder: ToonBuilder) => ToonBuilder)
  userMessage?: ToonNode[] | ((builder: ToonBuilder) => ToonBuilder)
  assistantMessage?: ToonNode[] | ((builder: ToonBuilder) => ToonBuilder)
  toolMessage?: ToonNode[] | ((builder: ToonBuilder) => ToonBuilder)
}
```

## Optimization Types

```tsx
type OptimizationStrategy =
  | 'sliding-window'
  | 'summarize-old'
  | 'drop-low-priority'
  | 'hybrid'

interface MessagePriority {
  messageId: string
  priority: number  // 0-1, higher = more important
  reason?: string
}

interface OptimizationDiagnostics {
  originalTokens: number
  optimizedTokens: number
  messagesRemoved: number
  messagesSummarized: number
  strategy: OptimizationStrategy
  details: string[]
}

interface OptimizeMessagesOptions {
  targetTokens: number
  strategy?: OptimizationStrategy
  modelMetadata?: ModelMetadata
  tokenizer?: Tokenizer
  priorities?: MessagePriority[]
  summarizeFn?: (messages: CoreMessage[]) => Promise<string> | string
  keepRecent?: number
}
```

## Builder Types

```tsx
interface BuildModelPromptOptions {
  recipe?: PromptRecipe
  toonNodes?: ToonNode[]
  variables?: Record<string, any>
  memoryContext?: string | CoreMessage[]
  userInput?: string
  modelMetadata: ModelMetadata
  targetTokens?: number
  optimization?: {
    enabled?: boolean
    strategy?: OptimizationStrategy
    priorities?: MessagePriority[]
    summarizeFn?: (messages: CoreMessage[]) => Promise<string> | string
    keepRecent?: number
  }
}

interface BuildModelPromptResult {
  messages: CoreMessage[]
  tokenStats: {
    inputTokens: number
    outputTokens?: number
    remainingBudget: number
    utilization: number
  }
  costEstimate?: {
    inputCost: number
    outputCost: number
    totalCost: number
  }
  optimizationDiagnostics?: OptimizationDiagnostics
}
```

## Hook Types

### usePromptRecipe

```tsx
interface UsePromptRecipeOptions {
  recipe?: PromptRecipe
  toonNodes?: ToonNode[]
  variables?: Record<string, any>
  debug?: boolean
}

interface UsePromptRecipeReturn {
  buildPrompt: (overrideVariables?: Record<string, any>) => CoreMessage[]
  estimateTokens: (overrideVariables?: Record<string, any>) => number
  debugView?: {
    rendered: string
    variables: Record<string, any>
    messages: CoreMessage[]
  }
}
```

### useTokenBudget

```tsx
interface UseTokenBudgetOptions {
  messages: CoreMessage[]
  modelMetadata?: ModelMetadata | string
  targetBudget?: number
  targetBudgetDollars?: number
  priorities?: MessagePriority[]
  summarizeFn?: (messages: CoreMessage[]) => Promise<string> | string
}

interface UseTokenBudgetReturn {
  currentTokens: number
  remainingBudget: number
  utilization: number
  isExceeded: boolean
  estimatedCost?: {
    inputCost: number
    outputCost: number
    totalCost: number
  }
  optimize: (
    strategy?: OptimizationStrategy,
    customTarget?: number
  ) => Promise<{
    optimizedMessages: CoreMessage[]
    diagnostics: OptimizationDiagnostics
  }>
}
```

### useOptimizedChatContext

```tsx
interface UseOptimizedChatContextOptions {
  messages: CoreMessage[]
  memoryContext?: string | CoreMessage[]
  userInput?: string
  modelMetadata?: ModelMetadata | string
  targetTokens?: number
  strategy?: OptimizationStrategy
  priorities?: MessagePriority[]
  summarizeFn?: (messages: CoreMessage[]) => Promise<string> | string
  keepRecent?: number
  autoOptimize?: boolean
}

interface UseOptimizedChatContextReturn {
  optimizedMessages: CoreMessage[]
  tokenStats: {
    inputTokens: number
    remainingBudget: number
    utilization: number
  }
  lastOptimizationReason?: string
  wasOptimized: boolean
  optimize: () => Promise<void>
}
```

### usePromptInspector

```tsx
interface UsePromptInspectorOptions {
  messages: CoreMessage[]
  modelMetadata?: ModelMetadata | string
  detailed?: boolean
}

interface MessageBreakdown {
  id: string
  role: string
  tokens: number
  content: string
  percentage: number
}

interface UsePromptInspectorReturn {
  totalTokens: number
  breakdown: MessageBreakdown[]
  byRole: Record<string, { tokens: number; count: number; percentage: number }>
  formattedView: {
    summary: string
    details: string[]
  }
}
```

## useClarityChat Integration Types

```tsx
interface ClarityPromptOptimizationOptions {
  enabled?: boolean
  targetTokens?: number
  strategy?: OptimizationStrategy
  model?: string
  priorities?: MessagePriority[]
  summarizeFn?: (messages: CoreMessage[]) => Promise<string> | string
  keepRecent?: number
}

interface ClarityChatTokenStats {
  inputTokens: number
  remainingBudget: number
  utilization: number
  lastOptimizationReason?: string
  wasOptimized: boolean
}

// Added to UseClarityChatOptions
interface UseClarityChatOptions {
  // ... existing options
  promptOptimization?: ClarityPromptOptimizationOptions
}

// Added to UseClarityChatReturn
interface UseClarityChatReturn {
  // ... existing return values
  tokenStats?: ClarityChatTokenStats
}
```

## Utility Types

```tsx
// From utils.ts
function formatTokenCount(tokens: number): string
function formatCost(cost: number): string
function calculateUtilization(current: number, max: number): number
function getUtilizationColor(utilization: number): string
function estimateConversationTokens(
  messages: CoreMessage[],
  modelMetadata?: ModelMetadata | string
): number
function exceedsTokenBudget(
  messages: CoreMessage[],
  budget: number,
  modelMetadata?: ModelMetadata | string
): boolean
function getTokenBreakdownByRole(
  messages: CoreMessage[],
  modelMetadata?: ModelMetadata | string
): Record<string, { tokens: number; count: number; percentage: number }>
function getOptimizationRecommendation(
  currentTokens: number,
  maxTokens: number,
  messageCount: number
): {
  recommended: boolean
  strategy?: OptimizationStrategy
  reason: string
}
function createSimpleSummarizer(
  apiEndpoint?: string
): (messages: CoreMessage[]) => Promise<string>
```
