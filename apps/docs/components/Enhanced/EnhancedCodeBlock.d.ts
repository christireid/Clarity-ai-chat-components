interface EnhancedCodeBlockProps {
    code: string;
    language: string;
    title?: string;
    showLineNumbers?: boolean;
    highlightLines?: number[];
    className?: string;
    filename?: string;
    sandboxUrl?: string;
    editable?: boolean;
    showCopyButton?: boolean;
}
export declare function EnhancedCodeBlock({ code, language, title, showLineNumbers, highlightLines, className, filename, sandboxUrl, editable, showCopyButton, }: EnhancedCodeBlockProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=EnhancedCodeBlock.d.ts.map