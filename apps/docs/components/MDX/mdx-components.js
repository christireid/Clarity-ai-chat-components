import { jsx as _jsx } from "react/jsx-runtime";
import Link from 'next/link';
import { CodeBlock } from './CodeBlock';
import { Callout } from './Callout';
import clsx from 'clsx';
// Custom components to use in MDX files
export const mdxComponents = {
    // Headings with anchor links
    h1: ({ className, ...props }) => (_jsx("h1", { className: clsx('scroll-mt-20 text-4xl font-bold mb-4 mt-8 first:mt-0', className), ...props })),
    h2: ({ className, ...props }) => (_jsx("h2", { className: clsx('scroll-mt-20 text-3xl font-bold mb-3 mt-8 border-b border-border pb-2', className), ...props })),
    h3: ({ className, ...props }) => (_jsx("h3", { className: clsx('scroll-mt-20 text-2xl font-semibold mb-3 mt-6', className), ...props })),
    h4: ({ className, ...props }) => (_jsx("h4", { className: clsx('scroll-mt-20 text-xl font-semibold mb-2 mt-4', className), ...props })),
    h5: ({ className, ...props }) => (_jsx("h5", { className: clsx('scroll-mt-20 text-lg font-semibold mb-2 mt-4', className), ...props })),
    h6: ({ className, ...props }) => (_jsx("h6", { className: clsx('scroll-mt-20 text-base font-semibold mb-2 mt-4', className), ...props })),
    // Paragraphs
    p: ({ className, ...props }) => (_jsx("p", { className: clsx('leading-7 [&:not(:first-child)]:mt-4', className), ...props })),
    // Links
    a: ({ className, href, ...props }) => {
        const isExternal = href?.startsWith('http');
        const Component = isExternal ? 'a' : Link;
        return (_jsx(Component, { className: clsx('font-medium text-brand-500 hover:text-brand-600 underline underline-offset-4', className), href: href || '#', ...(isExternal && {
                target: '_blank',
                rel: 'noopener noreferrer',
            }), ...props }));
    },
    // Lists
    ul: ({ className, ...props }) => (_jsx("ul", { className: clsx('my-6 ml-6 list-disc [&>li]:mt-2', className), ...props })),
    ol: ({ className, ...props }) => (_jsx("ol", { className: clsx('my-6 ml-6 list-decimal [&>li]:mt-2', className), ...props })),
    li: ({ className, ...props }) => (_jsx("li", { className: clsx('leading-7', className), ...props })),
    // Blockquote
    blockquote: ({ className, ...props }) => (_jsx("blockquote", { className: clsx('mt-6 border-l-4 border-brand-500 pl-6 italic text-text-secondary [&>p]:my-2', className), ...props })),
    // Tables
    table: ({ className, ...props }) => (_jsx("div", { className: "my-6 w-full overflow-x-auto", children: _jsx("table", { className: clsx('w-full border-collapse border border-border', className), ...props }) })),
    thead: ({ className, ...props }) => (_jsx("thead", { className: clsx('bg-bg-secondary', className), ...props })),
    tbody: ({ className, ...props }) => (_jsx("tbody", { className: clsx('[&_tr:last-child]:border-0', className), ...props })),
    tr: ({ className, ...props }) => (_jsx("tr", { className: clsx('border-b border-border transition-colors hover:bg-bg-secondary', className), ...props })),
    th: ({ className, ...props }) => (_jsx("th", { className: clsx('px-4 py-3 text-left font-semibold text-text-primary [&[align=center]]:text-center [&[align=right]]:text-right', className), ...props })),
    td: ({ className, ...props }) => (_jsx("td", { className: clsx('px-4 py-3 text-text-secondary [&[align=center]]:text-center [&[align=right]]:text-right', className), ...props })),
    // Horizontal rule
    hr: ({ className, ...props }) => (_jsx("hr", { className: clsx('my-8 border-border', className), ...props })),
    // Code blocks
    pre: ({ className, children, ...props }) => {
        // Extract code content and language from children
        const child = children;
        const code = child?.props?.children || '';
        const language = child?.props?.className?.replace('language-', '') || 'text';
        return (_jsx(CodeBlock, { code: typeof code === 'string' ? code : '', language: language, className: className }));
    },
    // Inline code
    code: ({ className, ...props }) => (_jsx("code", { className: clsx('relative rounded bg-bg-tertiary px-[0.3rem] py-[0.2rem] font-mono text-sm', className), ...props })),
    // Custom components
    CodeBlock,
    Callout,
};
//# sourceMappingURL=mdx-components.js.map