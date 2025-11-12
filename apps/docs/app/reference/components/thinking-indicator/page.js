import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const metadata = {
    title: 'Thinking Indicator | Clarity Chat',
    description: 'AI thinking indicator with animated stages and progress tracking.'
};
export default function ThinkingIndicatorPage() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "Thinking Indicator" }), _jsx("p", { className: "text-xl text-muted-foreground mb-8", children: "Animated AI thinking indicator showing processing stages, progress, and estimated completion time." }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Features" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Stage-based status display (thinking, researching, compiling, etc.)" }), _jsx("li", { children: "Animated icon for current stage" }), _jsx("li", { children: "Pulsing dot animation" }), _jsx("li", { children: "Progress bar with smooth animation" }), _jsx("li", { children: "Estimated completion time" }), _jsx("li", { children: "Optional topic/detail text" }), _jsx("li", { children: "Smooth enter/exit transitions" })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Usage" }), _jsx("pre", { className: "bg-muted p-4 rounded-lg overflow-x-auto", children: _jsx("code", { children: `import { ThinkingIndicator } from '@clarity-chat/react'
import type { AIStatus } from '@clarity-chat/types'

function ChatMessages() {
  const [aiStatus, setAIStatus] = useState<AIStatus>({
    stage: 'thinking',
    topic: 'Analyzing your question',
    progress: 25,
    estimatedCompletion: new Date(Date.now() + 5000)
  })

  return (
    <>
      {messages.map(msg => <Message key={msg.id} {...msg} />)}
      {isAIProcessing && <ThinkingIndicator status={aiStatus} />}
    </>
  )
}` }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Props" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b", children: [_jsx("th", { className: "p-2 font-semibold", children: "Prop" }), _jsx("th", { className: "p-2 font-semibold", children: "Type" }), _jsx("th", { className: "p-2 font-semibold", children: "Default" }), _jsx("th", { className: "p-2 font-semibold", children: "Description" })] }) }), _jsxs("tbody", { className: "text-muted-foreground", children: [_jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "status" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "AIStatus" }), _jsx("td", { className: "p-2", children: "-" }), _jsx("td", { className: "p-2", children: "AI processing status object" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "className" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "string" }), _jsx("td", { className: "p-2", children: "-" }), _jsx("td", { className: "p-2", children: "Additional CSS classes" })] })] })] }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "AIStatus Interface" }), _jsx("pre", { className: "bg-muted p-4 rounded-lg overflow-x-auto", children: _jsx("code", { children: `interface AIStatus {
  stage: 'thinking' | 'researching' | 'compiling' | 'generating' | 'finalizing'
  topic?: string                // Description of current task
  progress?: number             // 0-100 completion percentage
  estimatedCompletion?: Date    // Expected completion time
}` }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Processing Stages" }), _jsxs("div", { className: "space-y-4 text-muted-foreground", children: [_jsxs("div", { children: [_jsx("strong", { className: "text-foreground", children: "\uD83E\uDD16 Thinking:" }), " Initial processing and understanding"] }), _jsxs("div", { children: [_jsx("strong", { className: "text-foreground", children: "\uD83D\uDD0D Researching:" }), " Searching knowledge base or web"] }), _jsxs("div", { children: [_jsx("strong", { className: "text-foreground", children: "\uD83D\uDCC4 Compiling:" }), " Gathering and organizing information"] }), _jsxs("div", { children: [_jsx("strong", { className: "text-foreground", children: "\u2728 Generating:" }), " Creating response content"] }), _jsxs("div", { children: [_jsx("strong", { className: "text-foreground", children: "\u2713 Finalizing:" }), " Final formatting and review"] })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Examples" }), _jsx("h3", { className: "text-2xl font-semibold mb-3", children: "With Progress" }), _jsx("pre", { className: "bg-muted p-4 rounded-lg overflow-x-auto mb-6", children: _jsx("code", { children: `<ThinkingIndicator
  status={{
    stage: 'researching',
    topic: 'Searching documentation',
    progress: 60
  }}
/>` }) }), _jsx("h3", { className: "text-2xl font-semibold mb-3", children: "Simple Usage" }), _jsx("pre", { className: "bg-muted p-4 rounded-lg overflow-x-auto", children: _jsx("code", { children: `<ThinkingIndicator 
  status={{ stage: 'thinking' }}
/>` }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Best Practices" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Update status in real-time as AI progresses" }), _jsx("li", { children: "Provide meaningful topic descriptions" }), _jsx("li", { children: "Show progress bar for long-running operations" }), _jsx("li", { children: "Use appropriate stages for your workflow" }), _jsx("li", { children: "Remove indicator when AI completes" }), _jsx("li", { children: "Consider accessibility with ARIA labels" })] })] }), _jsxs("section", { children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Related Components" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsxs("li", { children: [_jsx("a", { href: "/reference/components/streaming-message", className: "text-primary hover:underline", children: "Streaming Message" }), " - Display AI responses"] }), _jsxs("li", { children: [_jsx("a", { href: "/reference/components/message-list", className: "text-primary hover:underline", children: "Message List" }), " - Message container"] })] })] })] }));
}
//# sourceMappingURL=page.js.map