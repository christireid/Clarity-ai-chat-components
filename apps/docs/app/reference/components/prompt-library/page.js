import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodePlayground } from '@/components/Playground/CodePlayground';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'PromptLibrary - Clarity Chat Components',
    description: 'Manage reusable prompts and insert them into chats.',
};
export default function PromptLibraryPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Component" }), _jsx("h1", { children: "PromptLibrary" }), _jsx("p", { className: "docs-lead", children: "Organize and apply prompt templates with variables." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Basic Usage" }), _jsx(CodePlayground, { initialCode: `function Example() {
  const items = [
    { id: 'summarize', label: 'Summarize Selection' },
    { id: 'rewrite', label: 'Rewrite for Tone' },
  ]
  return (
    <div className="p-4">
      <PromptLibrary items={items} onApply={(id) => console.log(id)} />
    </div>
  )
}

render(<Example />)` })] })] }));
}
//# sourceMappingURL=page.js.map