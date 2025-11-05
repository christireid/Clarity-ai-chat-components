/**
 * Feedback Animations
 *
 * Visual feedback components for success, error, and state changes.
 * Provides delightful animations for user actions.
 */
import * as React from 'react';
export type FeedbackType = 'success' | 'error' | 'warning' | 'info';
export interface FeedbackAnimationProps {
    /** Type of feedback */
    type: FeedbackType;
    /** Show the animation */
    show: boolean;
    /** Custom message */
    message?: string;
    /** Duration before auto-hide (0 for no auto-hide) */
    duration?: number;
    /** Callback when animation completes */
    onComplete?: () => void;
    /** Additional className */
    className?: string;
}
/**
 * Animated feedback overlay
 */
export declare const FeedbackAnimation: React.FC<FeedbackAnimationProps>;
/**
 * Success checkmark animation
 */
export declare const SuccessCheckmark: React.FC<{
    show: boolean;
    size?: number;
    className?: string;
}>;
/**
 * Error shake animation wrapper
 */
export declare const ErrorShake: React.FC<{
    trigger: boolean;
    children: React.ReactNode;
    className?: string;
}>;
/**
 * Pulse animation for attention
 */
export declare const PulseAttention: React.FC<{
    active: boolean;
    children: React.ReactNode;
    className?: string;
}>;
/**
 * Ripple effect animation
 */
export declare const RippleEffect: React.FC<{
    trigger: boolean;
    color?: string;
    className?: string;
}>;
/**
 * Confetti animation for celebrations
 */
export declare const ConfettiEffect: React.FC<{
    trigger: boolean;
    count?: number;
    className?: string;
}>;
/**
 * Glow effect animation
 */
export declare const GlowEffect: React.FC<{
    active: boolean;
    color?: string;
    children: React.ReactNode;
    className?: string;
}>;
/**
 * Bounce animation for success feedback
 */
export declare const BounceIn: React.FC<{
    show: boolean;
    children: React.ReactNode;
    className?: string;
}>;
/**
 * Slide and fade notification
 */
export declare const SlideNotification: React.FC<{
    show: boolean;
    message: string;
    type?: FeedbackType;
    position?: 'top' | 'bottom';
    className?: string;
}>;
//# sourceMappingURL=feedback-animation.d.ts.map