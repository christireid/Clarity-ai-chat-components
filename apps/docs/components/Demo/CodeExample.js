'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { CodeBlock } from '../MDX/CodeBlock';
export function CodeExample({ title, code, language, showLineNumbers = true, highlightLines, }) {
    return (_jsx("div", { className: "max-w-4xl mx-auto", children: _jsx(CodeBlock, { code: code, language: language, title: title, showLineNumbers: showLineNumbers, highlightLines: highlightLines }) }));
}
//# sourceMappingURL=CodeExample.js.map