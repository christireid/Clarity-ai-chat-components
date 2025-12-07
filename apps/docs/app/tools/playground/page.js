import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Callout } from '@/components/MDX/Callout';
import { CodeBlock } from '@/components/MDX/CodeBlock';
import Link from 'next/link';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Interactive Playground - Developer Tools',
    description: 'Experiment with Clarity Chat components live. Editable code, presets, responsive viewports, state inspector, accessibility panel, and code export.',
};
export default function PlaygroundToolsPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Tool" }), _jsx("h1", { children: "Interactive Playground" }), _jsx("p", { className: "docs-lead", children: "A Monaco-powered environment for tinkering with components. Adjust props, switch presets, view state, check accessibility, and export code without leaving the docs." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Features" }), _jsxs("ul", { children: [_jsx("li", { children: "\uD83C\uDF9B\uFE0F Prop controls for strings, numbers, booleans, selects, colours, ranges" }), _jsx("li", { children: "\uD83E\uDDE9 Preset selector with descriptions and best practices" }), _jsx("li", { children: "\uD83D\uDCF1 Responsive viewport switcher (mobile / tablet / desktop)" }), _jsx("li", { children: "\uD83D\uDC40 State inspector with live state tree + event log" }), _jsx("li", { children: "\u267F Accessibility panel (keyboard shortcuts, WCAG status, ARIA info)" }), _jsx("li", { children: "\uD83D\uDCE4 Quick actions: copy code, open CodeSandbox/StackBlitz, download file" }), _jsx("li", { children: "\uD83E\uDDEA TS/JS toggle + install command helper" })] }), _jsxs(Callout, { type: "info", children: ["The playground is used across the docs. Visit", ' ', _jsx(Link, { href: "/playground-demo", children: "/playground-demo" }), " for a guided tour."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Usage" }), _jsxs("ol", { children: [_jsxs("li", { children: ["Open any component page or ", _jsx(Link, { href: "/playground-demo", children: "Playground Demo" })] }), _jsx("li", { children: "Select a preset (e.g. \u201CSupport Agent\u201D, \u201CRAG Assistant\u201D)" }), _jsx("li", { children: "Adjust props using the controls panel or edit the live code" }), _jsx("li", { children: "View real-time state updates in the inspector" }), _jsx("li", { children: "Copy the snippet or open in CodeSandbox to integrate into your app" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Embedding Custom Components" }), _jsxs("p", { children: ["Expose the playground in your own docs or admin tools by importing the", _jsx("code", { children: "CodePlayground" }), " component."] }), _jsx(CodeBlock, { language: "tsx", code: `import { CodePlayground } from '@/components/Playground/CodePlayground'

export default function ButtonPlayground() {
  const initialCode = \`function Example() {
  return (
    <ChatWindow
      messages={messages}
      onSendMessage={handleSend}
    />
  )
}

render(<Example />)\`

  return (
    <CodePlayground
      initialCode={initialCode}
    />
  )
}
` }), _jsx(Callout, { type: "warning", children: "The playground depends on the Monaco editor (~2.5\u00A0MB). Lazy-load it or gate behind admin-only routes in production apps." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Keyboard Shortcuts" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("kbd", { children: "Cmd/Ctrl" }), " + ", _jsx("kbd", { children: "S" }), " \u2014 Copy code to clipboard"] }), _jsxs("li", { children: [_jsx("kbd", { children: "Cmd/Ctrl" }), " + ", _jsx("kbd", { children: "K" }), " \u2014 Toggle controls panel"] }), _jsxs("li", { children: [_jsx("kbd", { children: "Cmd/Ctrl" }), " + ", _jsx("kbd", { children: "P" }), " \u2014 Switch presets"] }), _jsxs("li", { children: [_jsx("kbd", { children: "Cmd/Ctrl" }), " + ", _jsx("kbd", { children: "/" }), " \u2014 Focus code editor"] })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Architecture" }), _jsxs("ul", { children: [_jsx("li", { children: "Monaco editor for code editing" }), _jsx("li", { children: "Sandpack for live bundling + preview" }), _jsx("li", { children: "Custom prop schema to auto-generate controls" }), _jsx("li", { children: "State inspector built with Zustand + Immer for diffing" }), _jsx("li", { children: "Accessibility panel powered by the same data used in audit reports" })] })] })] }));
}
//# sourceMappingURL=page.js.map