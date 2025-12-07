/**
 * MCP Prompts for Clarity Chat
 *
 * Prompt templates that AI agents can use for common tasks
 */
import { Prompt } from '@modelcontextprotocol/sdk/types.js';
/**
 * Available prompts
 */
export declare const prompts: Prompt[];
/**
 * Handle prompt generation with validation
 */
export declare function handlePromptGet(name: string, args: Record<string, string>): Promise<string>;
//# sourceMappingURL=index.d.ts.map