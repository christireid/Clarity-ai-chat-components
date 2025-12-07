import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodePlayground } from '@/components/Playground/CodePlayground';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'StreamingTextRenderer - Clarity Chat Components',
    description: 'Render token streams with partial updates and cursor control.',
};
export default function StreamingTextRendererPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Component" }), _jsx("h1", { children: "StreamingTextRenderer" }), _jsx("p", { className: "docs-lead", children: "High-performance renderer for streaming LLM tokens." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Basic Usage" }), _jsx(CodePlayground, { initialCode: `function Example() {
  const [text, setText] = React.useState('')

  React.useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      i += 1
      setText((t) => t + ' ' + i)
      if (i === 10) clearInterval(id)
    }, 200)
  }, [])

  return (
    <div className="p-4">
      <StreamingTextRenderer text={text} />
    </div>
  )
}

render(<Example />)` })] })] }));
}
//# sourceMappingURL=page.js.map