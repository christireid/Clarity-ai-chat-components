import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const metadata = {
    title: 'Copy Button | Clarity Chat',
    description: 'One-click copy to clipboard button with success feedback.'
};
export default function CopyButtonPage() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "Copy Button" }), _jsx("p", { className: "text-xl text-muted-foreground mb-8", children: "Accessible copy-to-clipboard button with visual success feedback using the useClipboard hook." }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Features" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "One-click copy to clipboard" }), _jsx("li", { children: "Visual success feedback (icon change)" }), _jsx("li", { children: "Customizable timeout (default 2s)" }), _jsx("li", { children: "Icon-only or text mode" }), _jsx("li", { children: "Custom copy/copied labels" }), _jsx("li", { children: "Success callback on copy" }), _jsx("li", { children: "Built on accessible Button component" })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Usage" }), _jsx("pre", { className: "bg-muted p-4 rounded-lg overflow-x-auto", children: _jsx("code", { children: `import { CopyButton } from '@clarity-chat/react'

<CopyButton 
  text="Hello, world!" 
  onCopy={() => console.log('Copied!')}
/>

// Icon only
<CopyButton 
  text={codeSnippet} 
  iconOnly 
/>

// Custom labels
<CopyButton
  text={data}
  copyText="Copy Code"
  copiedText="Code Copied!"
/>` }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Props" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b", children: [_jsx("th", { className: "p-2", children: "Prop" }), _jsx("th", { className: "p-2", children: "Type" }), _jsx("th", { className: "p-2", children: "Default" })] }) }), _jsxs("tbody", { className: "text-muted-foreground", children: [_jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "text" }), _jsx("td", { className: "p-2", children: "string" }), _jsx("td", { className: "p-2", children: "-" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "onCopy" }), _jsx("td", { className: "p-2", children: "() => void" }), _jsx("td", { className: "p-2", children: "-" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "iconOnly" }), _jsx("td", { className: "p-2", children: "boolean" }), _jsx("td", { className: "p-2", children: "false" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "copyText" }), _jsx("td", { className: "p-2", children: "string" }), _jsx("td", { className: "p-2", children: "\"Copy\"" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "copiedText" }), _jsx("td", { className: "p-2", children: "string" }), _jsx("td", { className: "p-2", children: "\"Copied!\"" })] })] })] }) })] }), _jsxs("section", { children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Related" }), _jsx("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: _jsx("li", { children: _jsx("a", { href: "/reference/hooks/use-clipboard", className: "text-primary hover:underline", children: "useClipboard Hook" }) }) })] })] }));
}
//# sourceMappingURL=page.js.map