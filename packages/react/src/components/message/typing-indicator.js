'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion } from 'framer-motion';
import { cn, Avatar, useReducedMotion } from '@clarity-chat/primitives';
import { getMotionSafeDuration } from '../../animations/motion-safe';
import { AnimatedDots } from '../ui/animated-dots';
/**
 * TypingIndicator - Classic "typing..." indicator for chat interfaces
 *
 * Displays a lightweight typing indicator with animated dots, matching
 * modern chat application patterns (iMessage, Slack, Discord, etc.).
 *
 * **Features:**
 * - Three bouncing dots animation (classic)
 * - Optional avatar display
 * - Multiple animation variants
 * - Reduced motion support
 * - Accessible with aria-live
 *
 * **Use Cases:**
 * - Show when AI is generating a response
 * - Indicate active processing
 * - Provide visual feedback during streaming
 *
 * @example
 * ```tsx
 * // Basic usage
 * {isAITyping && <TypingIndicator />}
 *
 * // With custom label
 * <TypingIndicator label="Assistant is thinking" />
 *
 * // Without avatar
 * <TypingIndicator showAvatar={false} />
 *
 * // Different animation variant
 * <TypingIndicator variant="pulse" />
 * ```
 */
export function TypingIndicator({ showAvatar = true, avatarSrc, avatarFallback = 'AI', label = 'AI is typing', variant = 'dots', className, }) {
    const prefersReducedMotion = useReducedMotion();
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 10, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -10, scale: 0.95 }, transition: {
            // Framer Motion 12: Enhanced spring physics for smoother entrance
            type: 'spring',
            damping: 20,
            stiffness: 300,
            duration: getMotionSafeDuration(prefersReducedMotion, 0.2),
        }, className: cn('flex gap-3.5 p-4', className), role: "status", "aria-live": "polite", "aria-label": label, children: [showAvatar && (_jsx(motion.div, { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: {
                    // Framer Motion 12: Spring physics for avatar entrance
                    type: 'spring',
                    damping: 15,
                    stiffness: 200,
                    delay: getMotionSafeDuration(prefersReducedMotion, 0.05),
                }, children: _jsx(Avatar, { src: avatarSrc, alt: "AI Assistant", fallback: avatarFallback, className: "flex-shrink-0" }) })), _jsx(motion.div, { initial: { scale: 0.9, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: {
                    // Framer Motion 12: Smoother bubble entrance with spring
                    type: 'spring',
                    damping: 18,
                    stiffness: 250,
                    delay: getMotionSafeDuration(prefersReducedMotion, 0.1),
                }, className: cn('flex items-center gap-1.5 px-4 py-3 rounded-xl bg-muted/60 border border-border/40 shadow-md', 'min-w-[70px]'), children: _jsx(AnimatedDots, { variant: variant === 'dots' ? 'bounce' : variant, size: "md", className: "text-muted-foreground" }) })] }));
}
TypingIndicator.displayName = 'TypingIndicator';
//# sourceMappingURL=typing-indicator.js.map