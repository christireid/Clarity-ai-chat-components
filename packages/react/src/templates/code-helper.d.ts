/**
 * Code Helper Template
 *
 * AI assistant specialized for programming help
 */
export interface CodeHelperTemplateProps {
    apiKeys?: {
        openai?: string;
        anthropic?: string;
        google?: string;
    };
    languages?: string[];
}
/**
 * Code Helper Template
 *
 * Features:
 * - Syntax highlighting
 * - Code execution examples
 * - Language-specific help
 * - Dark theme optimized for code
 * - File upload for code review
 *
 * @example
 * ```tsx
 * <CodeHelperTemplate
 *   apiKeys={{ openai: process.env.OPENAI_API_KEY }}
 *   languages={['typescript', 'python', 'react']}
 * />
 * ```
 */
export declare function CodeHelperTemplate({ apiKeys, languages, }: CodeHelperTemplateProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=code-helper.d.ts.map