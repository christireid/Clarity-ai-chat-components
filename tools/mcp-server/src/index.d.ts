#!/usr/bin/env node
/**
 * Clarity Chat MCP Server - Enhanced Edition
 *
 * A world-class Model Context Protocol server that enables AI agents to interact
 * with Clarity Chat projects through standardized tools, resources, and prompts.
 *
 * Features:
 * - 28+ tools for component discovery, documentation, project management, and more
 * - 6+ resources for docs, examples, and model information
 * - 10+ prompt templates for common AI chat development tasks
 * - Comprehensive component registry with 150+ components and 95+ hooks
 * - Full accessibility (WCAG AA) documentation for all components
 * - Updated AI model pricing for 2024/2025 models
 * - Plugin system for extending functionality
 * - Event-driven architecture for monitoring
 * - Rate limiting and caching for optimal performance
 * - Health checks and diagnostics
 *
 * @module mcp-server
 * @version 2.0.0
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { pluginRegistry } from './plugins/index.js';
import { serverEvents } from './utils/events.js';
import { metrics, healthChecker } from './utils/health.js';
declare const SERVER_VERSION = "2.0.0";
declare const SERVER_NAME = "clarity-chat-mcp";
/**
 * Server configuration options
 */
interface ServerConfig {
    /** Enable rate limiting (default: true) */
    rateLimit: boolean;
    /** Enable metrics collection (default: true) */
    metrics: boolean;
    /** Enable plugin system (default: true) */
    plugins: boolean;
    /** Log level */
    logLevel: 'debug' | 'info' | 'warn' | 'error';
}
declare const config: ServerConfig;
/**
 * Get all available tools including core, enhanced, and plugin tools
 */
declare function getAllTools(): {
    inputSchema: {
        [x: string]: unknown;
        type: "object";
        properties?: {
            [x: string]: object;
        } | undefined;
        required?: string[] | undefined;
    };
    name: string;
    description?: string | undefined;
    outputSchema?: {
        [x: string]: unknown;
        type: "object";
        properties?: {
            [x: string]: object;
        } | undefined;
        required?: string[] | undefined;
    } | undefined;
    annotations?: {
        title?: string | undefined;
        readOnlyHint?: boolean | undefined;
        destructiveHint?: boolean | undefined;
        idempotentHint?: boolean | undefined;
        openWorldHint?: boolean | undefined;
    } | undefined;
    execution?: {
        taskSupport?: "required" | "optional" | "forbidden" | undefined;
    } | undefined;
    _meta?: {
        [x: string]: unknown;
    } | undefined;
    icons?: {
        src: string;
        mimeType?: string | undefined;
        sizes?: string[] | undefined;
    }[] | undefined;
    title?: string | undefined;
}[];
/**
 * Get all available resources including core and plugin resources
 */
declare function getAllResources(): {
    uri: string;
    name: string;
    description?: string | undefined;
    mimeType?: string | undefined;
    annotations?: {
        audience?: ("user" | "assistant")[] | undefined;
        priority?: number | undefined;
        lastModified?: string | undefined;
    } | undefined;
    _meta?: {
        [x: string]: unknown;
    } | undefined;
    icons?: {
        src: string;
        mimeType?: string | undefined;
        sizes?: string[] | undefined;
    }[] | undefined;
    title?: string | undefined;
}[];
/**
 * Get all available prompts including core and plugin prompts
 */
declare function getAllPrompts(): {
    name: string;
    description?: string | undefined;
    arguments?: {
        name: string;
        description?: string | undefined;
        required?: boolean | undefined;
    }[] | undefined;
    _meta?: {
        [x: string]: unknown;
    } | undefined;
    icons?: {
        src: string;
        mimeType?: string | undefined;
        sizes?: string[] | undefined;
    }[] | undefined;
    title?: string | undefined;
}[];
/**
 * Create and configure MCP server
 */
declare const server: Server<{
    method: string;
    params?: {
        [x: string]: unknown;
        task?: {
            [x: string]: unknown;
            ttl?: number | null | undefined;
            pollInterval?: number | undefined;
        } | undefined;
        _meta?: {
            [x: string]: unknown;
            progressToken?: string | number | undefined;
            "io.modelcontextprotocol/related-task"?: {
                [x: string]: unknown;
                taskId: string;
            } | undefined;
        } | undefined;
    } | undefined;
}, {
    method: string;
    params?: {
        [x: string]: unknown;
        _meta?: {
            [x: string]: unknown;
            "io.modelcontextprotocol/related-task"?: {
                [x: string]: unknown;
                taskId: string;
            } | undefined;
        } | undefined;
    } | undefined;
}, {
    [x: string]: unknown;
    _meta?: {
        [x: string]: unknown;
        "io.modelcontextprotocol/related-task"?: {
            [x: string]: unknown;
            taskId: string;
        } | undefined;
    } | undefined;
}>;
export { server, SERVER_VERSION, SERVER_NAME, config, getAllTools, getAllResources, getAllPrompts, pluginRegistry, serverEvents, metrics, healthChecker, };
//# sourceMappingURL=index.d.ts.map