'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
/**
 * Status colors and labels using design tokens
 */
const STATUS_CONFIG = {
    online: {
        color: 'bg-[hsl(var(--success))]',
        textColor: 'text-[hsl(var(--success))]',
        label: 'Online',
    },
    offline: {
        color: 'bg-destructive',
        textColor: 'text-destructive',
        label: 'Offline',
    },
    slow: {
        color: 'bg-[hsl(var(--warning))]',
        textColor: 'text-[hsl(var(--warning))]',
        label: 'Slow Connection',
    },
    unstable: {
        color: 'bg-amber-500',
        textColor: 'text-amber-600 dark:text-amber-400',
        label: 'Unstable',
    },
};
/**
 * Production-ready Network Status indicator component.
 *
 * **Features:**
 * - Auto-detection of network status using Navigator API
 * - Periodic connectivity checks via ping endpoint
 * - Connection quality measurement (fast/slow/unstable)
 * - Visual indicator with status colors
 * - Optional detailed connection info (RTT, downlink speed)
 * - Customizable position and appearance
 * - Accessibility support (ARIA live regions)
 *
 * **Use Cases:**
 * - Show connection status during chat streaming
 * - Warn users before sending messages on poor connection
 * - Auto-pause streaming on network loss
 * - Display reconnection status
 *
 * @example
 * ```tsx
 * // Basic usage (auto-detection)
 * <NetworkStatus />
 *
 * // Custom position and details
 * <NetworkStatus
 *   position="bottom-right"
 *   showDetails={true}
 *   onStatusChange={(status) => {
 *     if (status === 'offline') {
 *       pauseStreaming()
 *     }
 *   }}
 * />
 *
 * // With custom ping endpoint
 * <NetworkStatus
 *   pingEndpoint="/api/health"
 *   pingInterval={10000} // Check every 10s
 *   slowThreshold={500}  // >500ms = slow
 * />
 *
 * // Controlled status
 * const [status, setStatus] = useState<NetworkConnectionStatus>('online')
 *
 * <NetworkStatus
 *   status={status}
 *   show={status !== 'online'} // Only show when not online
 * />
 * ```
 */
export function NetworkStatus({ status: externalStatus, show = true, position = 'top-right', showDetails = false, onStatusChange, pingEndpoint = '/api/ping', pingInterval = 30000, slowThreshold = 1000, className = '', }) {
    const [internalStatus, setInternalStatus] = React.useState('online');
    const [latency, setLatency] = React.useState(null);
    const [downlinkSpeed, setDownlinkSpeed] = React.useState(null);
    const pingIntervalRef = React.useRef(null);
    const status = externalStatus ?? internalStatus;
    /**
     * Check connection quality via ping
     */
    const checkConnection = React.useCallback(async () => {
        const startTime = performance.now();
        try {
            const response = await fetch(pingEndpoint, {
                method: 'HEAD',
                cache: 'no-cache',
            });
            const endTime = performance.now();
            const rtt = endTime - startTime;
            setLatency(rtt);
            // Determine status based on response time
            if (response.ok) {
                if (rtt > slowThreshold) {
                    setInternalStatus('slow');
                }
                else {
                    setInternalStatus('online');
                }
            }
            else {
                setInternalStatus('unstable');
            }
        }
        catch (error) {
            console.error('[NetworkStatus] Ping failed:', error);
            setInternalStatus('offline');
            setLatency(null);
        }
    }, [pingEndpoint, slowThreshold]);
    /**
     * Handle online event
     */
    const handleOnline = React.useCallback(() => {
        setInternalStatus('online');
        checkConnection();
    }, [checkConnection]);
    /**
     * Handle offline event
     */
    const handleOffline = React.useCallback(() => {
        setInternalStatus('offline');
        setLatency(null);
    }, []);
    /**
     * Get connection info from Navigator API
     */
    const updateConnectionInfo = React.useCallback(() => {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            if (connection) {
                setDownlinkSpeed(connection.downlink ?? null);
                // Check effective connection type
                const effectiveType = connection.effectiveType;
                if (effectiveType === 'slow-2g' ||
                    effectiveType === '2g') {
                    setInternalStatus('slow');
                }
                else if (effectiveType === '3g') {
                    setInternalStatus('unstable');
                }
            }
        }
    }, []);
    /**
     * Initialize network monitoring
     */
    React.useEffect(() => {
        // Initial check
        updateConnectionInfo();
        checkConnection();
        // Listen to online/offline events
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        // Listen to connection changes (if supported)
        if ('connection' in navigator) {
            const connection = navigator.connection;
            if (connection && 'addEventListener' in connection) {
                connection.addEventListener('change', updateConnectionInfo);
            }
        }
        // Start periodic ping checks
        pingIntervalRef.current = setInterval(checkConnection, pingInterval);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            if ('connection' in navigator) {
                const connection = navigator.connection;
                if (connection && 'removeEventListener' in connection) {
                    connection.removeEventListener('change', updateConnectionInfo);
                }
            }
            if (pingIntervalRef.current) {
                clearInterval(pingIntervalRef.current);
            }
        };
    }, [
        checkConnection,
        handleOnline,
        handleOffline,
        updateConnectionInfo,
        pingInterval,
    ]);
    /**
     * Notify status changes
     */
    React.useEffect(() => {
        onStatusChange?.(status);
    }, [status, onStatusChange]);
    // Don't render if show is false
    if (!show) {
        return null;
    }
    const config = STATUS_CONFIG[status];
    // Position classes
    const positionClasses = {
        'top-left': 'top-4 left-4',
        'top-right': 'top-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'bottom-right': 'bottom-4 right-4',
    };
    return (_jsx("div", { className: `fixed ${positionClasses[position]} z-[var(--z-toast)] ${className}`, role: "status", "aria-live": "polite", "aria-label": `Network status: ${config.label}`, children: _jsxs("div", { className: "flex items-center gap-2.5 px-3.5 py-2.5 bg-card rounded-lg shadow-md border border-border/40 backdrop-blur-md", children: [_jsxs("div", { className: "relative flex h-3 w-3", children: [_jsx("div", { className: `absolute h-3 w-3 ${config.color} rounded-full ${status === 'online' ? 'animate-ping opacity-75' : ''}` }), _jsx("div", { className: `relative h-3 w-3 ${config.color} rounded-full` })] }), _jsx("span", { className: `text-sm font-bold ${config.textColor}`, children: config.label }), showDetails && (latency !== null || downlinkSpeed !== null) && (_jsxs("div", { className: "flex items-center gap-2.5 text-xs text-muted-foreground/90 border-l pl-2.5", children: [latency !== null && (_jsxs("span", { className: "font-mono", children: [latency.toFixed(0), "ms"] })), downlinkSpeed !== null && (_jsxs("span", { className: "font-mono", children: [downlinkSpeed.toFixed(1), " Mbps"] }))] }))] }) }));
}
//# sourceMappingURL=network-status.js.map