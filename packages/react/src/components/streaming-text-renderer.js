'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@clarity-chat/primitives';
export function StreamingTextRenderer({ text, isStreaming = false, typingSpeed = 30, displayMode = 'character', chunkSize = 5, showCursor = true, cursorChar = '▋', className, onStreamingComplete, onCharacterDisplayed, }) {
    const [displayedText, setDisplayedText] = React.useState('');
    const [isAnimating, setIsAnimating] = React.useState(false);
    const animationRef = React.useRef(undefined);
    const previousTextRef = React.useRef('');
    // Handle streaming updates
    React.useEffect(() => {
        if (!isStreaming) {
            // When streaming stops, display remaining text instantly
            if (text !== displayedText) {
                setDisplayedText(text);
                setIsAnimating(false);
                onStreamingComplete?.();
            }
            return;
        }
        // Detect new content
        const newContent = text.slice(displayedText.length);
        if (!newContent)
            return;
        setIsAnimating(true);
        if (displayMode === 'instant') {
            // Instant display
            setDisplayedText(text);
            setIsAnimating(false);
            return;
        }
        if (displayMode === 'chunk') {
            // Chunk-based display
            const chunks = [];
            for (let i = 0; i < newContent.length; i += chunkSize) {
                chunks.push(newContent.slice(i, i + chunkSize));
            }
            let chunkIndex = 0;
            const displayChunk = () => {
                if (chunkIndex < chunks.length) {
                    const chunk = chunks[chunkIndex];
                    if (!chunk)
                        return;
                    setDisplayedText((prev) => {
                        const updated = prev + chunk;
                        chunk.split('').forEach((char, idx) => {
                            onCharacterDisplayed?.(char, prev.length + idx);
                        });
                        return updated;
                    });
                    chunkIndex++;
                    animationRef.current = window.setTimeout(displayChunk, typingSpeed * chunkSize);
                }
                else {
                    setIsAnimating(false);
                }
            };
            displayChunk();
        }
        else {
            // Character-by-character display
            let charIndex = 0;
            const displayChar = () => {
                if (charIndex < newContent.length && text.length > displayedText.length + charIndex) {
                    const char = newContent[charIndex];
                    if (!char)
                        return;
                    setDisplayedText((prev) => {
                        const updated = prev + char;
                        onCharacterDisplayed?.(char, prev.length);
                        return updated;
                    });
                    charIndex++;
                    animationRef.current = window.setTimeout(displayChar, typingSpeed);
                }
                else {
                    setIsAnimating(false);
                }
            };
            displayChar();
        }
        return () => {
            if (animationRef.current) {
                clearTimeout(animationRef.current);
            }
        };
    }, [text, isStreaming, displayMode, typingSpeed, chunkSize, displayedText, onCharacterDisplayed, onStreamingComplete]);
    // Reset when text changes completely (new message)
    React.useEffect(() => {
        if (text.length < previousTextRef.current.length) {
            // Text was reset
            setDisplayedText('');
        }
        previousTextRef.current = text;
    }, [text]);
    return (_jsxs("span", { className: cn('inline-block', className), children: [displayedText, isStreaming && showCursor && (_jsx(motion.span, { animate: {
                    opacity: [1, 0.3, 1],
                }, transition: {
                    duration: 0.8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }, className: "inline-block ml-0.5 text-current", "aria-hidden": "true", children: cursorChar }))] }));
}
StreamingTextRenderer.displayName = 'StreamingTextRenderer';
export function useStreamingTextConfig(options = {}) {
    const { defaultTypingSpeed = 30, defaultDisplayMode = 'character', defaultChunkSize = 5, defaultShowCursor = true, } = options;
    return {
        typingSpeed: defaultTypingSpeed,
        displayMode: defaultDisplayMode,
        chunkSize: defaultChunkSize,
        showCursor: defaultShowCursor,
    };
}
//# sourceMappingURL=streaming-text-renderer.js.map