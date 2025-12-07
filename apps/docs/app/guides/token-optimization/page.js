import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodePlayground } from '@/components/Playground/CodePlayground';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Token Optimization Guide',
    description: 'Reduce tokens with compression, chunking, reranking, and memory policies.',
};
export default function TokenOptimizationGuide() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Guide" }), _jsx("h1", { children: "Token Optimization" }), _jsx("p", { className: "docs-lead", children: "Cut costs and latency without losing quality." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Overview" }), _jsx("p", { children: "Use prompt compression, semantic chunking, hybrid search, reranking, and sliding context windows to keep context inside model limits and reduce spend." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Quick Start" }), _jsx(CodePlayground, { initialCode: `function App({ children }) {
  return (
    <TokenOptimizerProvider
      compression={{ algorithm: 'llmlingua', targetRatio: 0.6 }}
      chunking={{ size: 800, overlap: 120 }}
      reranking={{ k: 12, topK: 6 }}
      slidingContext={{ maxTokens: 12000 }}
    >
      {children}
    </TokenOptimizerProvider>
  )
}

render(<App />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Techniques" }), _jsxs("ul", { children: [_jsx("li", { children: "Prompt compression with LLM-Lingua style summarization" }), _jsx("li", { children: "Semantic chunking and vector retrieval with hybrid search" }), _jsx("li", { children: "Reranking to select highest-signal chunks" }), _jsx("li", { children: "Sliding window to trim oldest low-signal messages" })] }), _jsxs("p", { children: ["See also: ", _jsx("a", { href: "/reference/components/token-optimization-panel", children: "Optimization Panel" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Monitoring" }), _jsxs("ul", { children: [_jsx("li", { children: _jsx("a", { href: "/reference/components/token-optimization-dashboard", children: "Optimization Dashboard" }) }), _jsx("li", { children: _jsx("a", { href: "/reference/components/token-optimization-badge", children: "Savings Badge" }) }), _jsx("li", { children: _jsx("a", { href: "/reference/components/usage-dashboard", children: "Usage Dashboard" }) })] })] })] }));
}
//# sourceMappingURL=page.js.map