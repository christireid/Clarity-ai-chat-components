/**
 * Streaming Message Component
 *
 * Displays AI responses with support for:
 * - Token-by-token streaming
 * - Partial JSON rendering
 * - Tool call visualization
 * - Thinking steps
 * - Citations
 * - Error states
 */
import type { ToolCall, Citation } from '../adapters/types';
export interface StreamingMessageProps {
    /** Accumulated message content */
    content: string;
    /** Whether streaming is in progress */
    isStreaming?: boolean;
    /** Tool calls made during streaming */
    toolCalls?: ToolCall[];
    /** Citations/sources */
    citations?: Citation[];
    /** Thinking steps (chain-of-thought) */
    thinkingSteps?: string[];
    /** Current thinking step being processed */
    currentThinkingStep?: string;
    /** Error message if streaming failed */
    error?: string;
    /** Show thinking steps */
    showThinking?: boolean;
    /** Show citations inline */
    showCitations?: boolean;
    /** Show tool calls */
    showTools?: boolean;
    /** Callback when tool needs approval */
    onToolApprove?: (toolCall: ToolCall) => void;
    /** Callback when tool is rejected */
    onToolReject?: (toolCall: ToolCall) => void;
    /** Additional CSS class */
    className?: string;
}
export declare function StreamingMessage({ content, isStreaming, toolCalls, citations, thinkingSteps, currentThinkingStep, error, showThinking, showCitations, showTools, onToolApprove, onToolReject, className }: StreamingMessageProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=streaming-message.d.ts.map