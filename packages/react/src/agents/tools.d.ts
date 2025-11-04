/**
 * Built-in Tools for Agents
 *
 * Common tools that agents can use for various tasks.
 */
import type { Tool } from './types';
/**
 * Calculator tool for mathematical operations
 */
export declare const calculatorTool: Tool;
/**
 * Web search tool (mock implementation)
 */
export declare const webSearchTool: Tool;
/**
 * Database query tool (mock implementation)
 */
export declare const databaseQueryTool: Tool;
/**
 * File system read tool
 */
export declare const fileReadTool: Tool;
/**
 * API call tool
 */
export declare const apiCallTool: Tool;
/**
 * Code execution tool (sandboxed)
 */
export declare const codeExecutionTool: Tool;
/**
 * Collection of all built-in tools
 */
export declare const builtInTools: Tool[];
/**
 * Tool registry for managing tools
 */
export declare class ToolRegistry {
    private tools;
    constructor(initialTools?: Tool[]);
    /**
     * Register a tool
     */
    register(tool: Tool): void;
    /**
     * Unregister a tool
     */
    unregister(name: string): boolean;
    /**
     * Get a tool by name
     */
    get(name: string): Tool | undefined;
    /**
     * Get all tools
     */
    getAll(): Tool[];
    /**
     * Get tools by category
     */
    getByCategory(category: string): Tool[];
    /**
     * Get tools by tag
     */
    getByTag(tag: string): Tool[];
    /**
     * Search tools by query
     */
    search(query: string): Tool[];
}
//# sourceMappingURL=tools.d.ts.map