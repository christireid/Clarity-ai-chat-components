/**
 * Typing stage configuration
 */
export interface TypingStage {
    /** Duration in milliseconds */
    duration: number;
    /** Stage label (e.g., 'Reading...', 'Thinking...') */
    label: string;
}
/**
 * Realistic typing options
 */
export interface UseRealisticTypingOptions {
    /** Minimum delay before showing response (ms, default: 800) */
    minDelay?: number;
    /** Maximum delay before showing response (ms, default: 2000) */
    maxDelay?: number;
    /** Words per minute reading speed (default: 400) */
    wordsPerMinute?: number;
    /** Characters per minute typing speed (default: 200) */
    charactersPerMinute?: number;
    /** Custom typing stages */
    stages?: TypingStage[];
    /** Show typing indicator after this delay (ms, default: 1000) */
    showIndicatorAfter?: number;
    /** Callback when typing starts */
    onTypingStart?: () => void;
    /** Callback when typing stage changes */
    onStageChange?: (stage: TypingStage) => void;
    /** Callback when typing ends */
    onTypingEnd?: () => void;
}
/**
 * Realistic typing return type
 */
export interface UseRealisticTypingReturn {
    /** Whether currently simulating typing */
    isTyping: boolean;
    /** Current typing stage */
    currentStage: TypingStage | null;
    /** Progress through current stage (0-1) */
    stageProgress: number;
    /** Total elapsed time */
    elapsedTime: number;
    /** Start typing simulation */
    startTyping: (inputText?: string, responseLength?: number) => void;
    /** Stop typing simulation */
    stopTyping: () => void;
    /** Calculate realistic delay for input */
    calculateDelay: (inputText: string, responseLength?: number) => number;
    /** Apply delay before showing response */
    delayResponse: <T>(response: T, inputText?: string) => Promise<T>;
}
/**
 * Production-ready Realistic Typing hook for natural AI responses.
 *
 * **Features:**
 * - Simulates human reading/thinking time
 * - Adjusts delay based on input length
 * - Multi-stage typing indicators
 * - Progress tracking through stages
 * - Prevents instant responses (uncanny valley)
 * - Prevents overly long waits
 *
 * **Use Cases:**
 * - Make AI responses feel more natural
 * - Show realistic "thinking" indicators
 * - Adjust timing based on message complexity
 * - Improve perceived response quality
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { isTyping, startTyping, stopTyping } = useRealisticTyping({
 *   minDelay: 800,
 *   maxDelay: 2000,
 * })
 *
 * const handleSendMessage = async (message: string) => {
 *   startTyping(message)
 *
 *   const response = await sendToAI(message)
 *
 *   stopTyping()
 *   displayResponse(response)
 * }
 *
 * // With custom stages
 * const { currentStage, stageProgress } = useRealisticTyping({
 *   stages: [
 *     { duration: 1500, label: 'Reading...' },
 *     { duration: 3000, label: 'Analyzing context...' },
 *     { duration: 2000, label: 'Generating response...' },
 *   ],
 * })
 *
 * // Delayed response
 * const { delayResponse } = useRealisticTyping({
 *   wordsPerMinute: 400,
 * })
 *
 * const handleSend = async (message: string) => {
 *   const response = await sendToAI(message)
 *
 *   // Add realistic delay based on input length
 *   const delayedResponse = await delayResponse(response, message)
 *
 *   displayResponse(delayedResponse)
 * }
 *
 * // Calculate delay for manual control
 * const { calculateDelay } = useRealisticTyping()
 *
 * const delay = calculateDelay('Long user message here...', 500) // Expected response length
 * await new Promise(resolve => setTimeout(resolve, delay))
 * ```
 */
export declare function useRealisticTyping(options?: UseRealisticTypingOptions): UseRealisticTypingReturn;
//# sourceMappingURL=use-realistic-typing.d.ts.map