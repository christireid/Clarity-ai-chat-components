import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-python';
export interface CodeBlockProps {
    code: string;
    language?: string;
    filename?: string;
    showLineNumbers?: boolean;
    highlightLines?: number[];
    className?: string;
}
export declare function CodeBlock({ code, language, filename, showLineNumbers, highlightLines, className, }: CodeBlockProps): import("react/jsx-runtime").JSX.Element;
/**
 * Inline code snippet
 */
export declare function InlineCode({ children, className, }: {
    children: React.ReactNode;
    className?: string;
}): import("react/jsx-runtime").JSX.Element;
/**
 * Parse markdown code blocks from text
 */
export declare function parseCodeBlocks(text: string): Array<{
    type: 'code' | 'text';
    content: string;
    language?: string;
}>;
/**
 * Render text with code blocks
 */
export declare function RenderWithCodeBlocks({ content, className, }: {
    content: string;
    className?: string;
}): import("react/jsx-runtime").JSX.Element;
/**
 * Get language display name
 */
export declare function getLanguageDisplayName(lang: string): string;
//# sourceMappingURL=CodeBlock.d.ts.map