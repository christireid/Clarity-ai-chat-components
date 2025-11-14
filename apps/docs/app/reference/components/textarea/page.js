import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LiveDemo } from '@/components/Demo/LiveDemo';
import { ApiTable } from '@/components/Demo/ApiTable';
export const metadata = {
    title: 'Textarea Component - Clarity Chat Components',
    description: 'A multi-line text input component for longer text entry.',
};
export default function TextareaPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsx("header", { className: "docs-header", children: _jsxs("div", { children: [_jsx("h1", { children: "Textarea" }), _jsx("p", { className: "text-xl text-neutral-700 dark:text-neutral-300 mt-2", children: "A multi-line text input component for longer text entry." })] }) }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Basic Usage" }), _jsx(LiveDemo, { code: `import { Textarea } from '@clarity/chat-components';

export default function BasicTextarea() {
  return (
    <Textarea
      placeholder="Enter your message..."
      rows={4}
    />
  );
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Props" }), _jsx(ApiTable, { title: "Textarea Props", data: [
                            { name: 'value', type: 'string', default: 'undefined', description: 'Controlled value' },
                            { name: 'placeholder', type: 'string', default: 'undefined', description: 'Placeholder text' },
                            { name: 'rows', type: 'number', default: '3', description: 'Number of visible rows' },
                            { name: 'resize', type: "'none' | 'vertical' | 'horizontal' | 'both'", default: "'vertical'", description: 'Resize behavior' },
                            { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether textarea is disabled' },
                            { name: 'error', type: 'string | boolean', default: 'undefined', description: 'Error state' },
                            { name: 'onChange', type: '(e: ChangeEvent) => void', default: 'undefined', description: 'Change handler' }
                        ] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related Components" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("a", { href: "/reference/components/input", children: "Input" }), " - Single-line text input"] }), _jsxs("li", { children: [_jsx("a", { href: "/reference/components/message-input", children: "MessageInput" }), " - Chat message input"] })] })] })] }));
}
//# sourceMappingURL=page.js.map