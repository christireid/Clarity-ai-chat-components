'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { cn } from '@clarity-chat/primitives';
// Dynamic import of Prism to handle cases where it's not available
let Prism = null;
let prismLoaded = false;
let prismLoadPromise = null;
// Lazy load Prism only when needed
async function loadPrism() {
    if (prismLoaded)
        return Prism;
    // Avoid multiple concurrent loads
    if (prismLoadPromise)
        return prismLoadPromise;
    prismLoadPromise = (async () => {
        try {
            // Import prismjs core first
            const prismModule = await import('prismjs');
            Prism = prismModule.default || prismModule;
            // Set Prism as a global for language component compatibility
            // Language components like prism-tsx expect window.Prism to exist
            if (typeof window !== 'undefined') {
                window.Prism = Prism;
            }
            // Load language support sequentially to ensure dependencies are met
            // typescript and javascript must load before jsx/tsx
            await import('prismjs/components/prism-javascript');
            await import('prismjs/components/prism-typescript');
            await import('prismjs/components/prism-jsx');
            await import('prismjs/components/prism-tsx');
            // Load other languages in parallel
            await Promise.all([
                import('prismjs/components/prism-json'),
                import('prismjs/components/prism-bash'),
                import('prismjs/components/prism-css'),
                import('prismjs/components/prism-markdown'),
                import('prismjs/components/prism-python'),
            ]);
            prismLoaded = true;
            return Prism;
        }
        catch (error) {
            console.warn('Prism.js not available, syntax highlighting disabled:', error);
            prismLoadPromise = null;
            return null;
        }
    })();
    return prismLoadPromise;
}
// Helper function to extract text content from React children
function getTextContent(children) {
    if (typeof children === 'string') {
        return children;
    }
    if (typeof children === 'number') {
        return String(children);
    }
    if (Array.isArray(children)) {
        return children.map(getTextContent).join('');
    }
    if (React.isValidElement(children) && children.props.children) {
        return getTextContent(children.props.children);
    }
    return '';
}
/**
 * Code block component for markdown rendering with syntax highlighting
 * Extracted from Message component for better organization
 */
export const MarkdownCodeBlock = React.memo(({ inline, className, children, ...rest }) => {
    const [highlightedCode, setHighlightedCode] = useState('');
    // Extract language from className (format: language-xxx)
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : 'typescript';
    // Extract text content from React children
    const codeString = getTextContent(children).replace(/\n$/, '');
    // Highlight code with Prism (lazy loaded)
    useEffect(() => {
        if (!inline && codeString) {
            loadPrism().then((prism) => {
                if (prism && prism.languages) {
                    try {
                        const grammar = prism.languages[language] || prism.languages.typescript;
                        const highlighted = prism.highlight(codeString, grammar, language);
                        setHighlightedCode(highlighted);
                    }
                    catch (error) {
                        console.error('Prism highlighting error:', error);
                        setHighlightedCode(codeString);
                    }
                }
                else {
                    // Fallback to plain code if Prism is not available
                    setHighlightedCode(codeString);
                }
            }).catch((error) => {
                console.warn('Failed to load Prism:', error);
                setHighlightedCode(codeString);
            });
        }
    }, [codeString, language, inline]);
    if (inline) {
        return (_jsx("code", { className: "bg-muted px-1 py-0.5 rounded text-sm font-mono", ...rest, children: children }));
    }
    // For block code, just render the code element
    // The wrapping structure (div/pre) is handled by the pre component in message.tsx
    return (_jsx("code", { className: cn('block text-sm font-mono', className), dangerouslySetInnerHTML: { __html: highlightedCode || codeString }, "data-code-string": codeString, ...rest }));
});
MarkdownCodeBlock.displayName = 'MarkdownCodeBlock';
//# sourceMappingURL=markdown-code-block.js.map