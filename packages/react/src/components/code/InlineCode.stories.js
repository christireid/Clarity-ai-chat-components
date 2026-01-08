import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { InlineCode } from './InlineCode';
const meta = {
    title: 'Components/Code/InlineCode',
    component: InlineCode,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: `
Styled inline code component for displaying code snippets within text.

## Features
- **Three Variants**: Default, subtle, and highlighted styles
- **Monospace Font**: Proper code typography
- **Seamless Integration**: Blends naturally with surrounding text
- **Accessible**: Proper semantic HTML with \`<code>\` element
        `,
            },
        },
    },
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'subtle', 'highlighted'],
            description: 'Visual style variant',
        },
    },
};
export default meta;
export const Default = {
    args: {
        children: 'npm install',
    },
};
export const Subtle = {
    args: {
        children: 'useState',
        variant: 'subtle',
    },
};
export const Highlighted = {
    args: {
        children: 'useEffect',
        variant: 'highlighted',
    },
};
export const InParagraph = {
    render: () => (_jsxs("p", { className: "text-base leading-relaxed", children: ["To get started, run", ' ', _jsx(InlineCode, { children: "npm install @clarity-chat/react" }), " in your project directory. Then import the", ' ', _jsx(InlineCode, { variant: "subtle", children: "CodeBlock" }), " component and use it in your JSX. For streaming responses, use the", ' ', _jsx(InlineCode, { variant: "highlighted", children: "StreamingCodeBlock" }), ' ', "component instead."] })),
    parameters: {
        docs: {
            description: {
                story: 'Inline code naturally integrates with surrounding text.',
            },
        },
    },
};
export const VariantComparison = {
    render: () => (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("span", { className: "text-sm font-medium mr-2", children: "Default:" }), _jsx(InlineCode, { variant: "default", children: "const x = 1" })] }), _jsxs("div", { children: [_jsx("span", { className: "text-sm font-medium mr-2", children: "Subtle:" }), _jsx(InlineCode, { variant: "subtle", children: "const x = 1" })] }), _jsxs("div", { children: [_jsx("span", { className: "text-sm font-medium mr-2", children: "Highlighted:" }), _jsx(InlineCode, { variant: "highlighted", children: "const x = 1" })] })] })),
};
export const Commands = {
    render: () => (_jsxs("div", { className: "space-y-2", children: [_jsxs("p", { children: ["Install: ", _jsx(InlineCode, { children: "pnpm add @clarity-chat/react" })] }), _jsxs("p", { children: ["Build: ", _jsx(InlineCode, { children: "pnpm build" })] }), _jsxs("p", { children: ["Test: ", _jsx(InlineCode, { children: "pnpm test" })] })] })),
};
//# sourceMappingURL=InlineCode.stories.js.map