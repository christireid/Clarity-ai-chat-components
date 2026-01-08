/**
 * MCP Resources for Clarity Chat
 *
 * Resources that AI agents can read to understand the project
 */
import { Resource } from '@modelcontextprotocol/sdk/types.js';
/**
 * Available resources
 */
export declare const resources: Resource[];
/**
 * Handle resource reads with caching
 */
export declare function handleResourceRead(uri: string): Promise<string>;
//# sourceMappingURL=index.d.ts.map