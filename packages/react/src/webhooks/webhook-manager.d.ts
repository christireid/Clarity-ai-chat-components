/**
 * Webhook Manager
 *
 * Manage webhook endpoints and deliver events.
 * Simple, flexible, and production-ready.
 */
import type { WebhookEvent, WebhookEndpoint, WebhookDelivery, WebhookConfig, WebhookHandler } from './types';
export declare class WebhookManager implements WebhookHandler {
    private endpoints;
    private config;
    private deliveryQueue;
    constructor(config?: WebhookConfig);
    /**
     * Register a webhook endpoint
     */
    register(endpoint: WebhookEndpoint): void;
    /**
     * Unregister a webhook endpoint
     */
    unregister(endpointId: string): boolean;
    /**
     * Get endpoint by ID
     */
    getEndpoint(id: string): WebhookEndpoint | undefined;
    /**
     * Get all endpoints
     */
    getAllEndpoints(): WebhookEndpoint[];
    /**
     * Emit an event to all subscribed endpoints
     */
    emit(event: WebhookEvent): Promise<WebhookDelivery[]>;
    /**
     * Deliver event to specific endpoint
     */
    deliver(event: WebhookEvent, endpoint: WebhookEndpoint): Promise<WebhookDelivery>;
    /**
     * Generate HMAC signature for webhook payload
     */
    private generateSignature;
    /**
     * Verify webhook signature
     */
    verifySignature(payload: string, signature: string, secret: string): boolean;
    private generateId;
    private sleep;
    /**
     * Get delivery statistics
     */
    getStats(): {
        totalEndpoints: number;
        activeEndpoints: number;
        totalDeliveries: number;
        failedDeliveries: number;
    };
}
//# sourceMappingURL=webhook-manager.d.ts.map