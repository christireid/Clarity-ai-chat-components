import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodeBlock } from '@/components/MDX/CodeBlock';
export const metadata = {
    title: 'Streaming Components API Reference - Clarity Chat',
    description: 'Complete API reference for streaming components: StreamingMessage, ToolInvocationCard, CitationCard, and ModelSelector.',
};
export default function StreamingComponentsAPIPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "API Reference" }), _jsx("h1", { children: "Streaming Components API" }), _jsx("p", { className: "docs-lead", children: "Complete API reference for streaming components: StreamingMessage, ToolInvocationCard, CitationCard, and ModelSelector." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "StreamingMessage" }), _jsx("p", { children: "Renders AI responses with real-time streaming, tool calls, citations, and thinking steps." }), _jsx("h3", { children: "Props" }), _jsx(CodeBlock, { language: "typescript", code: `interface StreamingMessageProps {
  /** Message content (plain text or JSON) */
  content: string
  
  /** Whether currently streaming */
  isStreaming?: boolean
  
  /** Tool/function calls */
  toolCalls?: ToolCall[]
  
  /** RAG citations */
  citations?: Citation[]
  
  /** Chain-of-thought thinking steps */
  thinkingSteps?: string[]
  
  /** Error message */
  error?: Error | string
  
  /** Show thinking steps section */
  showThinking?: boolean
  
  /** Show citations section */
  showCitations?: boolean
  
  /** Show tool calls section */
  showTools?: boolean
  
  /** Retry callback for errors */
  onRetry?: () => void
  
  /** Additional CSS classes */
  className?: string
}` }), _jsx("h3", { children: "Example" }), _jsx(CodeBlock, { language: "tsx", code: `import { StreamingMessage } from '@clarity-chat/react'

<StreamingMessage
  content={streamingText}
  isStreaming={true}
  toolCalls={toolCalls}
  citations={citations}
  thinkingSteps={thinkingSteps}
  showThinking
  showTools
  showCitations
/>` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "ToolInvocationCard" }), _jsx("p", { children: "Displays function/tool invocations with approval workflow." }), _jsx("h3", { children: "Props" }), _jsx(CodeBlock, { language: "typescript", code: `interface ToolInvocationCardProps {
  /** Tool call data */
  toolCall: ToolCall
  
  /** Current status */
  status?: ToolStatus
  
  /** Execution result */
  result?: unknown
  
  /** Error if execution failed */
  error?: Error | string
  
  /** Requires user approval */
  requiresApproval?: boolean
  
  /** Approval callback */
  onApprove?: (tool: ToolCall) => void | Promise<void>
  
  /** Rejection callback */
  onReject?: (tool: ToolCall) => void
  
  /** Retry callback for errors */
  onRetry?: (tool: ToolCall) => void
  
  /** Additional CSS classes */
  className?: string
}

type ToolStatus = 
  | 'pending'    // Waiting for approval
  | 'approved'   // Approved, not yet executed
  | 'rejected'   // User rejected
  | 'executing'  // Currently running
  | 'success'    // Completed successfully
  | 'error'      // Failed with error` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "CitationCard" }), _jsx("p", { children: "Displays RAG sources with confidence scores and metadata." }), _jsx("h3", { children: "Props" }), _jsx(CodeBlock, { language: "typescript", code: `interface CitationCardProps {
  /** Citation data */
  citation: Citation
  
  /** Start expanded */
  defaultExpanded?: boolean
  
  /** Preview text length */
  previewLength?: number
  
  /** Show confidence badge */
  showConfidence?: boolean
  
  /** Additional CSS classes */
  className?: string
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "ModelSelector" }), _jsx("p", { children: "Visual selector for switching between AI models." }), _jsx("h3", { children: "Props" }), _jsx(CodeBlock, { language: "typescript", code: `interface ModelSelectorProps {
  /** Available models */
  models: ModelMetadata[]
  
  /** Selected model ID */
  value: string
  
  /** Selection callback */
  onChange: (modelId: string, config: ModelConfig) => void
  
  /** Show speed/cost/quality badges */
  showMetrics?: boolean
  
  /** Disabled state */
  disabled?: boolean
  
  /** Additional CSS classes */
  className?: string
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Next Steps" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("a", { href: "/guides/streaming", children: "Streaming Guide" }), " - Learn about streaming"] }), _jsxs("li", { children: [_jsx("a", { href: "/reference/api/model-adapters", children: "Model Adapters API" }), " - Adapter reference"] }), _jsxs("li", { children: [_jsx("a", { href: "/examples/streaming", children: "Examples" }), " - See streaming in action"] })] })] })] }));
}
//# sourceMappingURL=page.js.map