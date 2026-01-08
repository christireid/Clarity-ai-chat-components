/**
 * Tool definitions for AI function calling
 */
import type { ChatCompletionTool } from 'openai/resources/chat/completions';
export declare const TOOLS: ChatCompletionTool[];
export interface ToolResult {
    success: boolean;
    data: unknown;
    error?: string;
}
export declare function executeTool(name: string, args: Record<string, unknown>): Promise<ToolResult>;
/**
 * Safe mathematical expression evaluator
 * Supports: +, -, *, /, %, parentheses, and decimal numbers
 * Does NOT use eval() - implements a proper tokenizer and parser
 * @exported for testing
 */
export declare function safeEvaluate(expression: string): number;
export declare const TOOL_INFO: Record<string, {
    icon: string;
    color: string;
    description: string;
}>;
//# sourceMappingURL=tools.d.ts.map