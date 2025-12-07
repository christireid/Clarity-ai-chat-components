import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodePlayground } from '@/components/Playground/CodePlayground';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'PromptSuggestions - Clarity Chat Components',
    description: 'Suggest follow-up prompts to keep conversations moving.',
};
export default function PromptSuggestionsPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Component" }), _jsx("h1", { children: "PromptSuggestions" }), _jsx("p", { className: "docs-lead", children: "Inline suggestions that users can click to continue." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Basic Usage" }), _jsx(CodePlayground, { initialCode: `function Example() {
  const suggestions = ['Summarize that', 'Give me 3 options', 'Explain like I\'m 5']
  return (
    <div className="p-4">
      <PromptSuggestions suggestions={suggestions} />
    </div>
  )
}

render(<Example />)` })] })] }));
}
//# sourceMappingURL=page.js.map