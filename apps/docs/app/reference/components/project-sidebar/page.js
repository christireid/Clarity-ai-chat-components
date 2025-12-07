import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodePlayground } from '@/components/Playground/CodePlayground';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'ProjectSidebar - Clarity Chat Components',
    description: 'Sidebar for navigating conversations, documents, and tools.',
};
export default function ProjectSidebarPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Component" }), _jsx("h1", { children: "ProjectSidebar" }), _jsx("p", { className: "docs-lead", children: "A structured sidebar for AI projects showing threads, files, and quick actions." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Basic Usage" }), _jsx(CodePlayground, { initialCode: `function Example() {
  return (
    <div className="h-[420px] border rounded overflow-hidden">
      <ProjectSidebar />
    </div>
  )
}

render(<Example />)` })] })] }));
}
//# sourceMappingURL=page.js.map