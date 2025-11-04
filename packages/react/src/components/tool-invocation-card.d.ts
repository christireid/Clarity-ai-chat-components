/**
 * Tool Invocation Card Component
 *
 * Displays function/tool calls with approval flow and result visualization
 *
 * @example
 * ```tsx
 * <ToolInvocationCard
 *   toolCall={toolCall}
 *   status="pending"
 *   requiresApproval
 *   onApprove={handleApprove}
 *   onReject={handleReject}
 * />
 * ```
 */
import type { ToolCall } from '../adapters/types';
export type ToolStatus = 'pending' | 'approved' | 'rejected' | 'executing' | 'success' | 'error';
export interface ToolInvocationCardProps {
    /** Tool call data */
    toolCall: ToolCall;
    /** Current status */
    status?: ToolStatus;
    /** Tool execution result */
    result?: any;
    /** Error message if execution failed */
    error?: string;
    /** Whether to show approval buttons */
    requiresApproval?: boolean;
    /** Callback when tool is approved */
    onApprove?: (toolCall: ToolCall) => void;
    /** Callback when tool is rejected */
    onReject?: (toolCall: ToolCall) => void;
    /** Callback to retry failed tool */
    onRetry?: (toolCall: ToolCall) => void;
    /** Show formatted JSON for arguments */
    formatArguments?: boolean;
    /** Show result in expandable section */
    expandableResult?: boolean;
    /** Additional CSS class */
    className?: string;
}
export declare function ToolInvocationCard({ toolCall, status, result, error, requiresApproval, onApprove, onReject, onRetry, formatArguments, expandableResult, className }: ToolInvocationCardProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=tool-invocation-card.d.ts.map