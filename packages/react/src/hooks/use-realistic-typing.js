import * as React from 'react';
/**
 * Default typing stages
 */
const DEFAULT_STAGES = [
    { duration: 1000, label: 'Reading your message...' },
    { duration: 2000, label: 'Thinking...' },
    { duration: 1500, label: 'Crafting response...' },
];
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
export function useRealisticTyping(options = {}) {
    const { minDelay = 800, maxDelay = 2000, wordsPerMinute = 400, charactersPerMinute = 200, stages = DEFAULT_STAGES, showIndicatorAfter = 1000, onTypingStart, onStageChange, onTypingEnd, } = options;
    const [isTyping, setIsTyping] = React.useState(false);
    const [currentStage, setCurrentStage] = React.useState(null);
    const [stageProgress, setStageProgress] = React.useState(0);
    const [elapsedTime, setElapsedTime] = React.useState(0);
    const stageTimeoutRef = React.useRef(null);
    const progressIntervalRef = React.useRef(null);
    const startTimeRef = React.useRef(0);
    /**
     * Calculate realistic delay based on input
     */
    const calculateDelay = React.useCallback((inputText, responseLength = 100) => {
        // Calculate reading time (words per minute)
        const wordCount = inputText.split(/\s+/).length;
        const readingTime = (wordCount / wordsPerMinute) * 60 * 1000;
        // Calculate thinking time (based on complexity)
        const thinkingTime = Math.min(responseLength * 10, 3000);
        // Calculate typing time (characters per minute)
        const typingTime = (responseLength / charactersPerMinute) * 60 * 1000;
        // Total delay
        const totalDelay = readingTime + thinkingTime + typingTime;
        // Clamp between min and max
        return Math.max(minDelay, Math.min(maxDelay, totalDelay));
    }, [minDelay, maxDelay, wordsPerMinute, charactersPerMinute]);
    /**
     * Clean up timers
     */
    const cleanup = React.useCallback(() => {
        if (stageTimeoutRef.current) {
            clearTimeout(stageTimeoutRef.current);
            stageTimeoutRef.current = null;
        }
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }
    }, []);
    /**
     * Start typing simulation
     */
    const startTyping = React.useCallback((inputText, responseLength) => {
        cleanup();
        const delay = inputText
            ? calculateDelay(inputText, responseLength)
            : minDelay;
        // Don't show indicator for very fast responses
        if (delay < showIndicatorAfter) {
            return;
        }
        setIsTyping(true);
        setElapsedTime(0);
        startTimeRef.current = Date.now();
        onTypingStart?.();
        let currentStageIndex = 0;
        // Start progress tracking
        progressIntervalRef.current = setInterval(() => {
            const elapsed = Date.now() - startTimeRef.current;
            setElapsedTime(elapsed);
            if (currentStage) {
                const stageElapsed = elapsed - (stages.slice(0, currentStageIndex).reduce((sum, s) => sum + s.duration, 0));
                const progress = Math.min(stageElapsed / currentStage.duration, 1);
                setStageProgress(progress);
            }
        }, 100);
        // Cycle through stages
        const nextStage = () => {
            if (currentStageIndex >= stages.length) {
                return;
            }
            const stage = stages[currentStageIndex];
            setCurrentStage(stage);
            setStageProgress(0);
            onStageChange?.(stage);
            stageTimeoutRef.current = setTimeout(() => {
                currentStageIndex++;
                nextStage();
            }, stage.duration);
        };
        nextStage();
    }, [
        calculateDelay,
        minDelay,
        showIndicatorAfter,
        stages,
        cleanup,
        onTypingStart,
        onStageChange,
    ]);
    /**
     * Stop typing simulation
     */
    const stopTyping = React.useCallback(() => {
        cleanup();
        setIsTyping(false);
        setCurrentStage(null);
        setStageProgress(0);
        setElapsedTime(0);
        onTypingEnd?.();
    }, [cleanup, onTypingEnd]);
    /**
     * Apply delay before returning response
     */
    const delayResponse = React.useCallback(async (response, inputText) => {
        const delay = inputText ? calculateDelay(inputText) : minDelay;
        if (delay >= showIndicatorAfter) {
            startTyping(inputText);
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
        if (isTyping) {
            stopTyping();
        }
        return response;
    }, [calculateDelay, minDelay, showIndicatorAfter, startTyping, stopTyping, isTyping]);
    /**
     * Cleanup on unmount
     */
    React.useEffect(() => {
        return () => {
            cleanup();
        };
    }, [cleanup]);
    return {
        isTyping,
        currentStage,
        stageProgress,
        elapsedTime,
        startTyping,
        stopTyping,
        calculateDelay,
        delayResponse,
    };
}
//# sourceMappingURL=use-realistic-typing.js.map