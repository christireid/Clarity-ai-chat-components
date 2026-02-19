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
export declare const projectDescription = "Enterprise-grade React component library for building beautiful, accessible AI chat interfaces. Features 150+ robust components, 95+ custom hooks, 15 themes, and comprehensive token optimization. Built with TypeScript, React 19, and Tailwind CSS.\n\nClarity Chat is the most complete open-source solution for building AI chat interfaces in React. It provides everything you need from basic chat windows to enterprise features like SSO, multi-tenancy, and advanced analytics.";
/**
 * MCP Server configuration for llms.txt
 */
export declare const mcpServerConfig = "{\n  \"mcpServers\": {\n    \"clarity-chat\": {\n      \"command\": \"npx\",\n      \"args\": [\"tsx\", \"apps/docs/mcp-server/index.ts\"]\n    }\n  }\n}";
export declare const mcpTools: string[];
//# sourceMappingURL=navigation-config.d.ts.map