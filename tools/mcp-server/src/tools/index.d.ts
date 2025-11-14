/**
 * MCP Tools for Clarity Chat
 *
 * Tools that AI agents can call to interact with Clarity Chat projects
 */
import { Tool } from '@modelcontextprotocol/sdk/types.js';
/**
 * Available tools
 */
export declare const tools: Tool[];
/**
 * Handle tool calls
 */
export declare function handleToolCall(name: string, args: Record<string, any>): Promise<any>;
//# sourceMappingURL=index.d.ts.map