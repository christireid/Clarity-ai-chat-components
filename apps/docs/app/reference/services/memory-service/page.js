import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs';
import { CodeBlock } from '@/components/MDX/CodeBlock';
import { Callout } from '@/components/MDX/Callout';
export const metadata = {
    title: 'MemoryService',
    description: 'Framework-agnostic memory and context management utilities for AI applications.',
};
export default function MemoryServicePage() {
    return (_jsxs(_Fragment, { children: [_jsx(Breadcrumbs, {}), _jsx("h1", { children: "MemoryService (`@clarity-chat/memory`)" }), _jsx("p", { className: "lead", children: "Manage semantic memory, episodic history, and token budgets across any JavaScript runtime. Works with React, Node.js, serverless functions, or other frameworks." }), _jsx(Callout, { type: "info", children: _jsxs("p", { children: ["Install with ", _jsx("code", { children: "npm install @clarity-chat/memory" }), ". The package has zero runtime dependencies and ships full TypeScript definitions."] }) }), _jsx("h2", { id: "quick-start", children: "Quick Start" }), _jsx(CodeBlock, { language: "ts", code: `import { MemoryService } from '@clarity-chat/memory'

const memory = new MemoryService({
  tokenOptimization: {
    maxContextWindow: 4096,
    allocation: {
      systemPrompt: 0.1,
      userPreferences: 0.15,
      recentContext: 0.3,
      semanticMemory: 0.25,
      episodicMemory: 0.15,
      responseReserve: 0.05,
    },
    dynamicAllocation: true,
    enableCompression: true,
    enableChunking: true,
  },
  persistence: {
    useVectorStore: false,
    useCache: true,
    useDatabase: false,
  },
})` }), _jsx("h2", { id: "core-api", children: "Core API" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsxs("li", { children: [_jsx("code", { children: "addMemory(content, type, scope, metadata?)" }), " \u2013 Store semantic, episodic, or session memories."] }), _jsxs("li", { children: [_jsxs("code", { children: ["query(", '{', " query, limit, userId ", '}', ")"] }), " \u2013 Retrieve relevant memories using semantic scoring."] }), _jsxs("li", { children: [_jsx("code", { children: "getOptimizer()" }), " \u2013 Access context optimizer for building prompts with token budgets."] }), _jsxs("li", { children: [_jsx("code", { children: "promoteMemory(id, scope)" }), " \u2013 Move important items to higher retention tiers."] }), _jsxs("li", { children: [_jsx("code", { children: "compressMemory(id, ratio)" }), " \u2013 Apply abstraction/compression to reduce storage."] })] }), _jsx("h2", { id: "optimizers", children: "Context Optimizer" }), _jsx(CodeBlock, { language: "ts", code: `const optimizer = memory.getOptimizer()

const context = optimizer.optimizeContext({
  systemPrompt: 'You are a helpful assistant.',
  userPreferences: { tone: 'friendly' },
  recentMessages: transcript.slice(-8),
  semanticMemories: await memory.query({ query: lastUserMessage, limit: 5 }),
  episodicMemories: await memory.query({ query: userId, limit: 10, scope: 'session' }),
})` }), _jsx("h2", { id: "framework-examples", children: "Framework Examples" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Node.js/Express \u2013 store conversation history and retrieve context before hitting the LLM." }), _jsxs("li", { children: ["React \u2013 instantiate ", _jsx("code", { children: "MemoryService" }), " once per app and reuse across hooks."] }), _jsx("li", { children: "Vue/Svelte \u2013 import the class directly; the API is framework agnostic." }), _jsx("li", { children: "Serverless functions \u2013 instantiate inside handler or reuse via warm global state." })] }), _jsx("h2", { id: "token-tools", children: "Token Tools" }), _jsx(CodeBlock, { language: "ts", code: `import { TokenCounter, TokenBudgetManager } from '@clarity-chat/memory'

const tokens = TokenCounter.count('Hello world')
const manager = new TokenBudgetManager({ maxContextWindow: 16_000 })
const allocation = manager.getAllocation()` })] }));
}
//# sourceMappingURL=page.js.map