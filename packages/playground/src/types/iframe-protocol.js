/**
 * Type-Safe Iframe Message Protocol
 *
 * Defines a strict contract for communication between the playground
 * and the preview iframe, enabling compile-time safety and IDE support.
 */
/**
 * Type guard to validate if unknown data is a valid IframeMessage
 */
export function isIframeMessage(data) {
    if (typeof data !== 'object' || data === null) {
        return false;
    }
    const obj = data;
    if (typeof obj.type !== 'string') {
        return false;
    }
    switch (obj.type) {
        case 'playground-status':
            return (typeof obj.status === 'string' &&
                ['idle', 'compiling', 'rendering', 'success', 'error'].includes(obj.status));
        case 'playground-console':
            return (typeof obj.level === 'string' &&
                ['log', 'info', 'warn', 'error'].includes(obj.level) &&
                typeof obj.message === 'string' &&
                Array.isArray(obj.args));
        case 'playground-error':
            return (typeof obj.error === 'object' &&
                obj.error !== null &&
                typeof obj.error.message === 'string');
        case 'playground-render-success':
            return true;
        default:
            return false;
    }
}
//# sourceMappingURL=iframe-protocol.js.map