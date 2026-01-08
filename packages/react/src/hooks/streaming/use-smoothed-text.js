'use client';
/**
 * useSmoothedText - Render streaming text at 60fps
 *
 * Inspired by llm-ui's streaming smoothing approach.
 * Buffers incoming text and renders it character-by-character
 * at the display's native frame rate for a premium reading experience.
 *
 * Key benefits:
 * - Eliminates jarring text jumps from chunked responses
 * - Consistent reading pace regardless of network conditions
 * - Makes responses feel faster through animation perception
 * - Reduces cognitive load when reading streaming text
 *
 * @example
 * ```tsx
 * function StreamingMessage({ text, isStreaming }) {
 *   const { displayText, isAnimating } = useSmoothedText(text, {
 *     enabled: isStreaming,
 *     charsPerFrame: 2,
 *   })
 *
 *   return <p>{displayText}</p>
 * }
 * ```
 */
import * as React from 'react';
export function useSmoothedText(text, options = {}) {
    const { enabled = true, charsPerFrame = 2, frameDelay = 16, maxBuffer = 100, catchUpCharsPerFrame = 8, onComplete, } = options;
    // Current display position in the text
    const [displayIndex, setDisplayIndex] = React.useState(0);
    // Track if animation is running
    const [isAnimating, setIsAnimating] = React.useState(false);
    // Refs for animation frame
    const rafRef = React.useRef(null);
    const lastFrameTimeRef = React.useRef(0);
    const targetIndexRef = React.useRef(0);
    const onCompleteRef = React.useRef(onComplete);
    // Keep onComplete ref up to date
    React.useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);
    // When text changes, update target
    React.useEffect(() => {
        targetIndexRef.current = text.length;
    }, [text]);
    // When disabled, immediately show all text
    React.useEffect(() => {
        if (!enabled && displayIndex < text.length) {
            setDisplayIndex(text.length);
            setIsAnimating(false);
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
        }
    }, [enabled, displayIndex, text.length]);
    // Animation loop
    React.useEffect(() => {
        if (!enabled)
            return;
        const animate = (timestamp) => {
            // Throttle to frameDelay
            if (timestamp - lastFrameTimeRef.current < frameDelay) {
                rafRef.current = requestAnimationFrame(animate);
                return;
            }
            lastFrameTimeRef.current = timestamp;
            setDisplayIndex((currentIndex) => {
                const target = targetIndexRef.current;
                const buffered = target - currentIndex;
                if (buffered <= 0) {
                    // Caught up
                    setIsAnimating(false);
                    onCompleteRef.current?.();
                    return currentIndex;
                }
                setIsAnimating(true);
                // Calculate chars to reveal this frame
                // Speed up if buffer is getting large
                const speedMultiplier = buffered > maxBuffer ? catchUpCharsPerFrame : charsPerFrame;
                const charsToReveal = Math.min(speedMultiplier, buffered);
                return currentIndex + charsToReveal;
            });
            rafRef.current = requestAnimationFrame(animate);
        };
        rafRef.current = requestAnimationFrame(animate);
        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
        };
    }, [enabled, charsPerFrame, frameDelay, maxBuffer, catchUpCharsPerFrame]);
    // Calculate display text
    const displayText = React.useMemo(() => {
        if (!enabled)
            return text;
        return text.slice(0, displayIndex);
    }, [text, displayIndex, enabled]);
    // Calculate buffered chars
    const bufferedChars = text.length - displayIndex;
    // Flush (skip animation)
    const flush = React.useCallback(() => {
        setDisplayIndex(text.length);
        setIsAnimating(false);
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
        onCompleteRef.current?.();
    }, [text.length]);
    // Reset
    const reset = React.useCallback(() => {
        setDisplayIndex(0);
        setIsAnimating(false);
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
    }, []);
    return {
        displayText,
        isAnimating,
        bufferedChars,
        flush,
        reset,
    };
}
/**
 * Preset configurations for common use cases
 */
export const smoothingPresets = {
    /**
     * Default smooth reading experience
     */
    default: {
        charsPerFrame: 2,
        frameDelay: 16,
        maxBuffer: 100,
        catchUpCharsPerFrame: 8,
    },
    /**
     * Faster for code output where speed matters
     */
    fast: {
        charsPerFrame: 4,
        frameDelay: 16,
        maxBuffer: 200,
        catchUpCharsPerFrame: 16,
    },
    /**
     * Slower, more dramatic reveal for important content
     */
    typewriter: {
        charsPerFrame: 1,
        frameDelay: 32,
        maxBuffer: 50,
        catchUpCharsPerFrame: 4,
    },
    /**
     * No smoothing (immediate display)
     */
    instant: {
        charsPerFrame: Infinity,
        frameDelay: 0,
        maxBuffer: 0,
        catchUpCharsPerFrame: Infinity,
    },
};
//# sourceMappingURL=use-smoothed-text.js.map