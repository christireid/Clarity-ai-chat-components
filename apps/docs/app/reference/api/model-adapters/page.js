import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodeBlock } from '@/components/MDX/CodeBlock';
export const metadata = {
    title: 'Model Adapters API Reference - Clarity Chat',
    description: 'Complete API reference for the model adapter system.',
};
export default function ModelAdaptersAPIPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "API Reference" }), _jsx("h1", { children: "Model Adapters API" }), _jsx("p", { className: "docs-lead", children: "Complete API reference for the model adapter system." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Overview" }), _jsx("p", { children: "Model adapters provide a unified interface for multiple AI providers, enabling easy switching between OpenAI, Anthropic, Google AI, and custom implementations." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Core Interfaces" }), _jsx("h3", { children: "ModelAdapter" }), _jsx("p", { children: "The base interface that all adapters implement:" }), _jsx(CodeBlock, { language: "typescript", code: `interface ModelAdapter {
  /** Adapter name */
  name: string
  
  /** Send a chat completion request */
  chat(messages: ChatMessage[], config: ModelConfig): Promise<ChatMessage>
  
  /** Stream chat completion tokens */
  stream(messages: ChatMessage[], config: ModelConfig): AsyncGenerator<StreamChunk>
  
  /** Estimate cost based on token usage */
  estimateCost(usage: TokenUsage, model: string): number
}` }), _jsx("h3", { children: "ModelConfig" }), _jsx(CodeBlock, { language: "typescript", code: `interface ModelConfig {
  /** Provider name */
  provider: 'openai' | 'anthropic' | 'google' | 'custom'
  
  /** Model ID */
  model: string
  
  /** API key (optional, can use env vars) */
  apiKey?: string
  
  /** Custom API base URL */
  baseURL?: string
  
  /** Sampling temperature (0-2) */
  temperature?: number
  
  /** Maximum tokens to generate */
  maxTokens?: number
  
  /** Top-p sampling parameter */
  topP?: number
  
  /** Frequency penalty (-2 to 2) */
  frequencyPenalty?: number
  
  /** Presence penalty (-2 to 2) */
  presencePenalty?: number
  
  /** Stop sequences */
  stop?: string[]
  
  /** Streaming callbacks */
  streamOptions?: StreamOptions
  
  /** AbortSignal for cancellation */
  signal?: AbortSignal
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Adapters" }), _jsx("h3", { children: "openAIAdapter" }), _jsx("p", { children: "OpenAI GPT models adapter:" }), _jsx(CodeBlock, { language: "typescript", code: `import { openAIAdapter } from '@clarity-chat/react'

const response = await openAIAdapter.chat(messages, {
  provider: 'openai',
  model: 'gpt-4-turbo',
  temperature: 0.7,
  maxTokens: 1000
})` }), _jsx("h3", { children: "anthropicAdapter" }), _jsx(CodeBlock, { language: "typescript", code: `import { anthropicAdapter } from '@clarity-chat/react'

const response = await anthropicAdapter.chat(messages, {
  provider: 'anthropic',
  model: 'claude-3-opus',
  apiKey: process.env.ANTHROPIC_API_KEY
})` }), _jsx("h3", { children: "googleAdapter" }), _jsx(CodeBlock, { language: "typescript", code: `import { googleAdapter } from '@clarity-chat/react'

const response = await googleAdapter.chat(messages, {
  provider: 'google',
  model: 'gemini-pro',
  apiKey: process.env.GOOGLE_API_KEY
})` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Next Steps" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("a", { href: "/guides/model-adapters", children: "Model Adapters Guide" }), " - Learn about adapters"] }), _jsxs("li", { children: [_jsx("a", { href: "/guides/streaming", children: "Streaming Guide" }), " - Learn about streaming"] }), _jsxs("li", { children: [_jsx("a", { href: "/reference/api/streaming-components", children: "Streaming Components API" }), " - Streaming components"] })] })] })] }));
}
//# sourceMappingURL=page.js.map