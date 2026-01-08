/**
 * Event Emitter for MCP Server
 *
 * Lightweight, type-safe event emitter for internal communication
 * and plugin system hooks.
 *
 * @module utils/events
 */
type EventHandler<T = unknown> = (data: T) => void | Promise<void>;
/**
 * Type-safe Event Emitter
 */
export declare class EventEmitter<EventMap extends {
    [K: string]: unknown;
} = Record<string, unknown>> {
    private listeners;
    private maxListeners;
    private maxTotalListeners;
    private subscriptionIdCounter;
    private handlerToSubscription;
    /**
     * Get total listener count across all events
     */
    private getTotalListenerCount;
    /**
     * Subscribe to an event
     * @returns Unsubscribe function
     */
    on<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): () => void;
    /**
     * Subscribe to an event (fires once then unsubscribes)
     * @returns Unsubscribe function
     */
    once<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): () => void;
    /**
     * Remove a specific handler from an event
     */
    offHandler<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): boolean;
    /**
     * Emit an event to all subscribers
     */
    emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void;
    /**
     * Emit an event and wait for all async handlers to complete
     */
    emitAsync<K extends keyof EventMap>(event: K, data: EventMap[K]): Promise<void>;
    /**
     * Remove all listeners for an event
     */
    off<K extends keyof EventMap>(event: K): void;
    /**
     * Remove all listeners
     */
    removeAllListeners(): void;
    /**
     * Get listener count for an event
     */
    listenerCount<K extends keyof EventMap>(event: K): number;
    /**
     * Set maximum listeners per event
     */
    setMaxListeners(max: number): void;
    /**
     * Get all event names with listeners
     */
    eventNames(): Array<keyof EventMap>;
}
/**
 * MCP Server event types
 */
export type MCPServerEvents = {
    'server:starting': {
        version: string;
    };
    'server:started': {
        tools: number;
        resources: number;
        prompts: number;
    };
    'server:stopping': {
        reason: string;
    };
    'server:stopped': {
        uptime: number;
    };
    'server:error': {
        error: Error;
        fatal: boolean;
    };
    'tool:called': {
        name: string;
        args: Record<string, unknown>;
        requestId: string;
    };
    'tool:success': {
        name: string;
        duration: number;
        requestId: string;
    };
    'tool:error': {
        name: string;
        error: Error;
        requestId: string;
    };
    'resource:read': {
        uri: string;
        requestId: string;
    };
    'resource:success': {
        uri: string;
        duration: number;
        requestId: string;
    };
    'resource:error': {
        uri: string;
        error: Error;
        requestId: string;
    };
    'prompt:get': {
        name: string;
        args: Record<string, string>;
        requestId: string;
    };
    'prompt:success': {
        name: string;
        duration: number;
        requestId: string;
    };
    'prompt:error': {
        name: string;
        error: Error;
        requestId: string;
    };
    'plugin:registered': {
        pluginId: string;
    };
    'plugin:enabled': {
        pluginId: string;
    };
    'plugin:disabled': {
        pluginId: string;
    };
    'plugin:unregistered': {
        pluginId: string;
    };
    'plugin:error': {
        pluginId: string;
        error: Error;
    };
    'cache:hit': {
        key: string;
        cache: string;
    };
    'cache:miss': {
        key: string;
        cache: string;
    };
    'cache:evicted': {
        key: string;
        cache: string;
    };
    'cache:cleared': {
        cache: string;
    };
    'ratelimit:exceeded': {
        clientId: string;
        limit: number;
    };
    'ratelimit:warning': {
        clientId: string;
        remaining: number;
    };
    [key: string]: unknown;
};
/**
 * Global MCP server event emitter
 */
export declare const serverEvents: EventEmitter<MCPServerEvents>;
/**
 * Create a middleware that emits events before and after an operation
 */
export declare function withEvents<T extends (...args: any[]) => Promise<any>>(operation: T, options: {
    before?: keyof MCPServerEvents;
    after?: keyof MCPServerEvents;
    error?: keyof MCPServerEvents;
    getContext: (...args: Parameters<T>) => Record<string, unknown>;
}): T;
export {};
//# sourceMappingURL=events.d.ts.map