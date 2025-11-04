/**
 * Network connection status
 */
export type NetworkConnectionStatus = 'online' | 'offline' | 'slow' | 'unstable';
/**
 * Network status props
 */
export interface NetworkStatusProps {
    /** Current connection status (auto-detected if not provided) */
    status?: NetworkConnectionStatus;
    /** Show status indicator (default: true) */
    show?: boolean;
    /** Position of the indicator (default: 'top-right') */
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    /** Show detailed connection info (default: false) */
    showDetails?: boolean;
    /** Callback when status changes */
    onStatusChange?: (status: NetworkConnectionStatus) => void;
    /** Custom ping endpoint for connectivity check (default: '/api/ping') */
    pingEndpoint?: string;
    /** Ping interval in ms (default: 30000) */
    pingInterval?: number;
    /** Threshold for slow connection in ms (default: 1000) */
    slowThreshold?: number;
    /** Custom CSS class */
    className?: string;
}
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
export declare function NetworkStatus({ status: externalStatus, show, position, showDetails, onStatusChange, pingEndpoint, pingInterval, slowThreshold, className, }: NetworkStatusProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=network-status.d.ts.map