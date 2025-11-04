/**
 * Prompt Template Engine
 *
 * Simple, flexible templating system for AI prompts.
 * No dependencies, fully customizable.
 */
import type { PromptTemplate, RenderPromptOptions, PromptRenderResult } from './types';
export declare class PromptTemplateEngine {
    private delimiter;
    constructor(delimiter?: {
        start: string;
        end: string;
    });
    /**
     * Render a prompt template with variables
     */
    render(template: string | PromptTemplate, options: RenderPromptOptions): PromptRenderResult;
    /**
     * Extract variables from a template
     */
    extractVariables(template: string): string[];
    /**
     * Check if template is valid
     */
    validate(template: string | PromptTemplate): {
        valid: boolean;
        errors?: string[];
    };
    private resolveVariable;
    private valueToString;
    private escapeRegExp;
    private escapeHtml;
}
/**
 * Quick render helper
 */
export declare function renderPrompt(template: string | PromptTemplate, variables: Record<string, any>, options?: Partial<RenderPromptOptions>): string;
//# sourceMappingURL=template.d.ts.map