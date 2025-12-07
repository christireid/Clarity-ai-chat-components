import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodeBlock } from '@/components/MDX/CodeBlock';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Best Practices Guide - Clarity Chat',
    description: 'Best practices for using Clarity Chat components effectively.',
};
export default function BestPracticesPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Guide" }), _jsx("h1", { children: "Best Practices Guide" }), _jsx("p", { className: "docs-lead", children: "Best practices for using Clarity Chat components effectively." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Component Usage" }), _jsx("h3", { children: "1. Always Use Controlled Components" }), _jsx("p", { children: _jsx("strong", { children: "\u2705 Good:" }) }), _jsx(CodeBlock, { language: "tsx", code: `const [value, setValue] = useState('')

<Input
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>` }), _jsx("p", { children: _jsx("strong", { children: "\u274C Bad:" }) }), _jsx(CodeBlock, { language: "tsx", code: `<Input defaultValue="initial" /> // Uncontrolled` }), _jsx("h3", { children: "2. Provide Proper Error Handling" }), _jsx("p", { children: _jsx("strong", { children: "\u2705 Good:" }) }), _jsx(CodeBlock, { language: "tsx", code: `const [error, setError] = useState('')

const handleSubmit = async () => {
  try {
    await submitForm()
  } catch (err) {
    setError(err.message)
  }
}

<Input error={error} />` }), _jsx("p", { children: _jsx("strong", { children: "\u274C Bad:" }) }), _jsx(CodeBlock, { language: "tsx", code: `const handleSubmit = async () => {
  await submitForm() // No error handling
}` }), _jsx("h3", { children: "3. Use Loading States" }), _jsx("p", { children: _jsx("strong", { children: "\u2705 Good:" }) }), _jsx(CodeBlock, { language: "tsx", code: `const [loading, setLoading] = useState(false)

const handleSubmit = async () => {
  setLoading(true)
  try {
    await submit()
  } finally {
    setLoading(false)
  }
}

<Button loading={loading}>Submit</Button>` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Performance" }), _jsx("h3", { children: "1. Memoize Expensive Components" }), _jsx("p", { children: _jsx("strong", { children: "\u2705 Good:" }) }), _jsx(CodeBlock, { language: "tsx", code: `const MessageList = React.memo(({ messages }) => {
  return messages.map((msg) => <Message key={msg.id} message={msg} />)
})` }), _jsx("p", { children: _jsx("strong", { children: "\u274C Bad:" }) }), _jsx(CodeBlock, { language: "tsx", code: `function MessageList({ messages }) {
  return messages.map((msg) => <Message key={msg.id} message={msg} />)
} // Re-renders on every parent update` }), _jsx("h3", { children: "2. Use useCallback for Event Handlers" }), _jsx("p", { children: _jsx("strong", { children: "\u2705 Good:" }) }), _jsx(CodeBlock, { language: "tsx", code: `const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies])` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Next Steps" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("a", { href: "/guides/getting-started", children: "Getting Started" }), " - Learn the basics"] }), _jsxs("li", { children: [_jsx("a", { href: "/guides/components", children: "Components Guide" }), " - Component usage"] }), _jsxs("li", { children: [_jsx("a", { href: "/guides/integration", children: "Integration Guide" }), " - Integration patterns"] })] })] })] }));
}
//# sourceMappingURL=page.js.map