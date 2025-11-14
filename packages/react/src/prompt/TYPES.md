# Type Reference: Prompt & Token Optimization

Complete type reference for the prompt and token optimization layer.

## Core Types

### Prompt DSL Types

```typescript
interface PromptVariable {
  name: string
  description?: string
  defaultValue?: string
  required?: boolean
}

type PromptRole = 'system' | 'user' | 'assistant'

interface PromptSection {
  id: string
  content: string | ((vars: Record<string, any>) => string)
  variables?: PromptVariable[]
  role?: PromptRole
}

interface PromptTemplate {
  id: string
  name: string
  description?: string
  system?: PromptSection | string | ((vars: Record<string, any>) => string)
  user?: PromptSection | string | ((vars: Record<string, any>) => string)
  sections?: PromptSection[]
  variables?: PromptVariable[]
  tools?: Array<{
    name: string
    description: string
    parameters: Record<string, any>
  }>
}

interface ResolvedPrompt {
  system?: string
  user?: string
  messages: CoreMessage[]
  variables: Record<string, any>
}

interface PromptRecipe {
  build(variables: Record<string, any>): ResolvedPrompt
  getVariables(): PromptVariable[]
  getTemplate(): PromptTemplate
}
```

### Token Estimation Types

```typescript
interface TokenEstimationOptions {
  model?: string
  tokenizer?: (text: string) => number
}

interface ModelMetadata {
  id: string
  maxTokens: number
  inputPricePer1K?: number
  outputPricePer1K?: number
  tokensPerChar?: number
}
```

### Message Optimization Types

```typescript
type OptimizationStrategy = 
  | 'sliding-window'
  | 'summarize-old'
  | 'drop-low-priority'
  | 'hybrid'

type MessagePriority = 'critical' | 'high' | 'medium' | 'low'

interface PrioritizedMessage extends CoreMessage {
  priority?: MessagePriority
  importanceScore?: number
}

interface OptimizationDiagnostics {
  originalTokens: number
  optimizedTokens: number
  droppedMessages: number
  summarizedMessages: number
  strategy: OptimizationStrategy
  reason: string
  details?: string[]
}

type SummarizationFunction = (
  messages: CoreMessage[],
  targetTokens: number
) => Promise<CoreMessage>
```

### Build Model Prompt Types

```typescript
interface ToolDefinition {
  name: string
  description: string
  parameters: Record<string, any>
}

interface MemoryContext {
  memories?: Array<{
    content: string
    relevance?: number
  }>
  summary?: string
  preferences?: Record<string, any>
}

interface BuildModelPromptOptions {
  recipe?: PromptRecipe
  systemPrompt?: string
  userInput: string | CoreMessage
  tools?: ToolDefinition[]
  memory?: MemoryContext
  history?: CoreMessage[]
  variables?: Record<string, any>
  model?: ModelMetadata
}

interface BuiltModelPrompt {
  messages: CoreMessage[]
  tokens: number
  cost: number
  tokenBreakdown: {
    system: number
    history: number
    memory: number
    user: number
    tools: number
    total: number
  }
  metadata: {
    hasTools: boolean
    hasMemory: boolean
    historyLength: number
    memoryItems: number
  }
}
```

## React Hook Types

### usePromptRecipe

```typescript
interface UsePromptRecipeOptions {
  recipe: PromptRecipe
  initialVariables?: Record<string, any>
}

interface UsePromptRecipeReturn {
  buildPrompt: (variables?: Record<string, any>) => ResolvedPrompt
  getVariables: () => PromptVariable[]
  getTemplate: () => PromptTemplate
  currentPrompt?: ResolvedPrompt
}
```

### useTokenBudget

```typescript
interface UseTokenBudgetOptions {
  messages: CoreMessage[]
  model: ModelMetadata
  targetBudget: number
  budgetUnit?: 'tokens' | 'dollars'
  strategy?: OptimizationStrategy
}

interface UseTokenBudgetReturn {
  currentTokens: number
  currentCost: number
  remainingBudget: number
  isExceeded: boolean
  budgetUsagePercent: number
  optimize: (
    messages: CoreMessage[],
    strategy?: OptimizationStrategy
  ) => Promise<{
    messages: CoreMessage[]
    diagnostics: OptimizationDiagnostics
  }>
  stats: {
    tokens: number
    cost: number
    budget: number
    remaining: number
    usagePercent: number
  }
}
```

### useOptimizedChatContext

```typescript
interface UseOptimizedChatContextOptions {
  messages: CoreMessage[]
  model: ModelMetadata
  targetTokens: number
  strategy?: OptimizationStrategy
  enabled?: boolean
  onOptimize?: (diagnostics: OptimizationDiagnostics) => void
}

interface UseOptimizedChatContextReturn {
  optimizedMessages: CoreMessage[]
  tokenStats: {
    original: number
    optimized: number
    saved: number
    savedPercent: number
  }
  lastOptimizationReason?: string
  diagnostics?: OptimizationDiagnostics
  optimize: () => Promise<void>
  wasOptimized: boolean
}
```

### usePromptInspector

```typescript
interface UsePromptInspectorOptions {
  messages?: CoreMessage[]
  resolvedPrompt?: ResolvedPrompt
  model?: string
  enabled?: boolean
}

interface UsePromptInspectorReturn {
  inspection: PromptInspection | null
  enabled: boolean
  toggle: () => void
  refresh: () => void
}

interface PromptInspection {
  totalTokens: number
  messageBreakdown: MessageTokenBreakdown[]
  roleBreakdown: Record<string, number>
  resolvedPrompt?: ResolvedPrompt
  model?: string
}

interface MessageTokenBreakdown {
  message: CoreMessage
  tokens: number
  role: string
  contentPreview: string
}
```

## useClarityChat Integration Types

```typescript
interface PromptOptimizationOptions {
  enabled?: boolean
  targetTokens?: number
  strategy?: 'sliding-window' | 'summarize-old' | 'drop-low-priority' | 'hybrid'
  model?: {
    id: string
    maxTokens: number
    inputPricePer1K?: number
    outputPricePer1K?: number
  }
}

interface ClarityChatTokenStats {
  currentTokens: number
  targetTokens?: number
  remainingTokens?: number
  isExceeded?: boolean
  usagePercent?: number
  lastOptimizationReason?: string
}
```

## Import Paths

```typescript
// Core utilities (framework-agnostic)
import {
  createPromptRecipe,
  estimatePromptTokens,
  optimizeMessagesForBudget,
  // ... etc
} from '@clarity-chat/react/prompt'

// React hooks
import {
  usePromptRecipe,
  useTokenBudget,
  useOptimizedChatContext,
  usePromptInspector,
} from '@clarity-chat/react/prompt'

// Or from main package
import {
  usePromptRecipe,
  useTokenBudget,
} from '@clarity-chat/react'
```
