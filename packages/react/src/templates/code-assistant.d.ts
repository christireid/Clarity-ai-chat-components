/**
 * Code assistant configuration
 */
export interface CodeAssistantConfig {
    /** Assistant name */
    assistantName?: string;
    /** Assistant avatar URL */
    assistantAvatar?: string;
    /** Programming languages to support */
    supportedLanguages?: string[];
    /** Initial code context */
    codeContext?: string;
    /** Enable code execution preview */
    enableExecution?: boolean;
    /** Enable code suggestions */
    enableSuggestions?: boolean;
    /** Callback when code is executed */
    onExecuteCode?: (code: string, language: string) => Promise<string>;
    /** Callback when code is copied */
    onCopyCode?: (code: string) => void;
    /** Custom CSS class */
    className?: string;
}
/**
 * Production-ready Code Assistant Template.
 *
 * **Features:**
 * - Specialized for coding tasks
 * - Syntax highlighting for code blocks
 * - Quick actions (explain, debug, optimize)
 * - Code execution preview
 * - Multi-language support
 * - Copy code functionality
 * - Code context awareness
 *
 * **Use Cases:**
 * - IDE coding assistants
 * - Code review tools
 * - Learning platforms
 * - Developer documentation
 *
 * @example
 * ```tsx
 * // Basic usage
 * <CodeAssistant />
 *
 * // With code context
 * <CodeAssistant
 *   codeContext={`
 *     function calculateTotal(items) {
 *       return items.reduce((sum, item) => sum + item.price, 0)
 *     }
 *   `}
 * />
 *
 * // With execution support
 * <CodeAssistant
 *   enableExecution={true}
 *   onExecuteCode={async (code, lang) => {
 *     // Run code in sandbox
 *     const result = await runCode(code, lang)
 *     return result.output
 *   }}
 * />
 *
 * // Custom languages
 * <CodeAssistant
 *   supportedLanguages={['javascript', 'python', 'rust']}
 *   assistantName="RustBot"
 * />
 * ```
 */
export declare function CodeAssistant({ assistantName, assistantAvatar: _assistantAvatar, // Reserved for future use
supportedLanguages, codeContext, enableExecution: _enableExecution, // Reserved for future use
enableSuggestions, onExecuteCode: _onExecuteCode, // Reserved for future use
onCopyCode: _onCopyCode, // Reserved for future use
className, }: CodeAssistantConfig): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=code-assistant.d.ts.map