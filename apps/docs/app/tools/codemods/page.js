import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Callout } from '@/components/MDX/Callout';
import { CodeBlock } from '@/components/MDX/CodeBlock';
export const metadata = {
    title: '@clarity-chat/codemods - Developer Tools',
    description: 'Automated jscodeshift transforms for upgrading Clarity Chat projects safely.',
};
export default function CodemodsToolsPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Package" }), _jsx("h1", { children: "@clarity-chat/codemods" }), _jsx("p", { className: "docs-lead", children: "Upgrade across major versions without manually touching hundreds of files. These codemods are the same ones we run internally during releases." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Installation" }), _jsx(CodeBlock, { language: "bash", code: `npm install -D @clarity-chat/codemods
# or run without installing
npx @clarity-chat/codemods` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Common Commands" }), _jsx(CodeBlock, { language: "bash", code: `# List available codemods
clarity-codemod list

# Preview v1 -> v2 migration (no changes written)
clarity-codemod run v1-to-v2 ./src --dry --print

# Apply migration
clarity-codemod run v1-to-v2 ./src

# Chain multiple migrations (v1 -> v3)
clarity-codemod migrate 1 3 ./src --dry
clarity-codemod migrate 1 3 ./src` }), _jsxs(Callout, { type: "warning", children: ["Always commit before running codemods and start with ", _jsx("code", { children: "--dry" }), " +", _jsx("code", { children: "--print" }), ". The tool preserves formatting/comments, but version control is your safety net."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Transforms Included" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("strong", { children: "v1-to-v2" }), " \u2014 renames props, updates component names, adjusts config schema"] }), _jsxs("li", { children: [_jsx("strong", { children: "v2-to-v3" }), " \u2014 (example) reorganises streaming APIs, updates token helpers"] }), _jsxs("li", { children: [_jsx("strong", { children: "Custom" }), " \u2014 add your own by registering transforms in ", _jsx("code", { children: "src/transforms" })] })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Before & After Preview" }), _jsx(CodeBlock, { language: "tsx", code: `// Before (v1)
import { ChatWindow } from '@clarity-chat/react'

<ChatWindow
  onMessage={(msg) => console.log(msg)}
  config={{ apiKey: process.env.CLARITY_KEY }}
/>

// After (v2)
import { ChatInterface } from '@clarity-chat/react'

<ChatInterface
  onSend={(msg) => console.log(msg)}
  config={{ credentials: { apiKey: process.env.CLARITY_KEY } }}
/>
` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Tips" }), _jsxs("ul", { children: [_jsx("li", { children: "Run lint and tests after applying transforms" }), _jsxs("li", { children: ["Use ", _jsx("code", { children: "--parser" }), " to switch between ", _jsx("code", { children: "babel" }), ", ", _jsx("code", { children: "ts" }), ", and ", _jsx("code", { children: "tsx" }), " as needed"] }), _jsxs("li", { children: ["Add ", _jsx("code", { children: "--verbose" }), " for detailed logs when debugging"] })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Extending" }), _jsxs("p", { children: ["Codemods are powered by jscodeshift. Create a new transform file, export a", _jsx("code", { children: "Transform" }), ", and register it in ", _jsx("code", { children: "src/transforms/index.ts" }), ". Use the provided tests as a template for coverage."] })] })] }));
}
//# sourceMappingURL=page.js.map