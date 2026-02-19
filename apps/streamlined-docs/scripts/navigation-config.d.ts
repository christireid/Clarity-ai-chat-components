/**
 * Navigation configuration for llms.txt generation
 * This defines the documentation structure and descriptions for AI indexing
 */
import type { NavigationSection } from './types';
export declare const BASE_URL = "https://clarity-chat.dev";
/**
 * Documentation navigation structure
 * Used to generate llms.txt with proper organization and descriptions
 */
export declare const navigationConfig: NavigationSection[];
/**
 * Project description for llms.txt header
 */
export declare const projectDescription = "React component library for building accessible AI chat interfaces. Features 150+ components, 70+ custom hooks, 15 themes, and token optimization. Built with TypeScript, React 19, and Tailwind CSS.\n\nClarity Chat provides components for building AI chat interfaces in React, from basic chat windows to advanced features like streaming, token optimization, and accessibility (WCAG AA with AAA targets).";
/**
 * MCP Server configuration for llms.txt
 */
export declare const mcpServerConfig = "{\n  \"mcpServers\": {\n    \"clarity-chat\": {\n      \"command\": \"npx\",\n      \"args\": [\"tsx\", \"apps/docs/mcp-server/index.ts\"]\n    }\n  }\n}";
export declare const mcpTools: string[];
//# sourceMappingURL=navigation-config.d.ts.map