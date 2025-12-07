import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodeBlock } from '@/components/MDX/CodeBlock';
export const metadata = {
    title: 'Primitives API Reference - Clarity Chat',
    description: 'Comprehensive API documentation for all primitive components in the Clarity Chat component library.',
};
export default function PrimitivesAPIPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "API Reference" }), _jsx("h1", { children: "Primitives API Documentation" }), _jsx("p", { className: "docs-lead", children: "Comprehensive API documentation for all primitive components in the Clarity Chat component library." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Button" }), _jsx("p", { children: "A versatile button component with enhanced UX through microanimations and state management." }), _jsx("h3", { children: "Import" }), _jsx(CodeBlock, { language: "tsx", code: `import { Button } from '@clarity-chat/primitives'` }), _jsx("h3", { children: "Props" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: "border border-border p-4 text-left", children: "Prop" }), _jsx("th", { className: "border border-border p-4 text-left", children: "Type" }), _jsx("th", { className: "border border-border p-4 text-left", children: "Default" }), _jsx("th", { className: "border border-border p-4 text-left", children: "Description" })] }) }), _jsxs("tbody", { children: [_jsxs("tr", { children: [_jsx("td", { className: "border border-border p-4", children: _jsx("code", { children: "variant" }) }), _jsx("td", { className: "border border-border p-4", children: _jsx("code", { children: "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'" }) }), _jsx("td", { className: "border border-border p-4", children: _jsx("code", { children: "'default'" }) }), _jsx("td", { className: "border border-border p-4", children: "Button visual style" })] }), _jsxs("tr", { children: [_jsx("td", { className: "border border-border p-4", children: _jsx("code", { children: "size" }) }), _jsx("td", { className: "border border-border p-4", children: _jsx("code", { children: "'default' | 'sm' | 'lg' | 'icon'" }) }), _jsx("td", { className: "border border-border p-4", children: _jsx("code", { children: "'default'" }) }), _jsx("td", { className: "border border-border p-4", children: "Button size" })] }), _jsxs("tr", { children: [_jsx("td", { className: "border border-border p-4", children: _jsx("code", { children: "loading" }) }), _jsx("td", { className: "border border-border p-4", children: _jsx("code", { children: "boolean" }) }), _jsx("td", { className: "border border-border p-4", children: _jsx("code", { children: "false" }) }), _jsx("td", { className: "border border-border p-4", children: "Show loading spinner" })] }), _jsxs("tr", { children: [_jsx("td", { className: "border border-border p-4", children: _jsx("code", { children: "disabled" }) }), _jsx("td", { className: "border border-border p-4", children: _jsx("code", { children: "boolean" }) }), _jsx("td", { className: "border border-border p-4", children: _jsx("code", { children: "false" }) }), _jsx("td", { className: "border border-border p-4", children: "Disable button" })] })] })] }) }), _jsx("h3", { children: "Examples" }), _jsx(CodeBlock, { language: "tsx", code: `// Default button
<Button>Click me</Button>

// Loading state
<Button loading>Processing...</Button>

// Destructive action
<Button variant="destructive">Delete</Button>

// Icon button
<Button size="icon">
  <Icon />
</Button>` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Input" }), _jsx("p", { children: "Text input component with support for various types and states." }), _jsx("h3", { children: "Import" }), _jsx(CodeBlock, { language: "tsx", code: `import { Input } from '@clarity-chat/primitives'` }), _jsx("h3", { children: "Examples" }), _jsx(CodeBlock, { language: "tsx", code: `// Basic input
<Input placeholder="Enter text..." />

// Error state
<Input variant="error" placeholder="Invalid email" />

// Controlled input
<Input value={value} onChange={(e) => setValue(e.target.value)} />` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Textarea" }), _jsx("p", { children: "Multi-line text input component with auto-resize support." }), _jsx("h3", { children: "Import" }), _jsx(CodeBlock, { language: "tsx", code: `import { Textarea } from '@clarity-chat/primitives'` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Next Steps" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("a", { href: "/reference/api/react-components", children: "React Components API" }), " - Full component reference"] }), _jsxs("li", { children: [_jsx("a", { href: "/reference/components", children: "Components Overview" }), " - Browse all components"] })] })] })] }));
}
//# sourceMappingURL=page.js.map