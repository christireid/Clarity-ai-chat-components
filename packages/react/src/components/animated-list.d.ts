/**
 * Animated List Components
 *
 * Pre-configured AnimatePresence wrappers for common list animation patterns.
 */
import * as React from 'react';
import type { AnimationDuration, StaggerTiming } from '../animations/constants';
export interface AnimatedListProps {
    /** Children to animate */
    children: React.ReactNode;
    /** Animation type */
    variant?: 'slide' | 'fade' | 'scale';
    /** Stagger timing between items */
    stagger?: StaggerTiming;
    /** Animation duration for each item */
    duration?: AnimationDuration;
    /** Additional className */
    className?: string;
    /** Delay before starting animations */
    delay?: number;
}
/**
 * Container for animated list items with stagger effect
 */
export declare const AnimatedList: React.FC<AnimatedListProps>;
export interface AnimatedListItemProps {
    /** Children to animate */
    children: React.ReactNode;
    /** Animation type - must match parent AnimatedList variant */
    variant?: 'slide' | 'fade' | 'scale';
    /** Animation duration */
    duration?: AnimationDuration;
    /** Additional className */
    className?: string;
    /** Layout animation when reordering */
    layout?: boolean;
}
/**
 * Individual list item with animation
 */
export declare const AnimatedListItem: React.FC<AnimatedListItemProps>;
/**
 * Fade in/out wrapper
 */
export declare const FadePresence: React.FC<{
    children: React.ReactNode;
    duration?: AnimationDuration;
    className?: string;
}>;
/**
 * Slide in/out wrapper
 */
export declare const SlidePresence: React.FC<{
    children: React.ReactNode;
    direction?: 'up' | 'down' | 'left' | 'right';
    distance?: number;
    duration?: AnimationDuration;
    className?: string;
}>;
/**
 * Scale in/out wrapper
 */
export declare const ScalePresence: React.FC<{
    children: React.ReactNode;
    initialScale?: number;
    duration?: AnimationDuration;
    className?: string;
}>;
/**
 * Conditional presence wrapper - only animates when condition is true
 */
export declare const ConditionalPresence: React.FC<{
    children: React.ReactNode;
    show: boolean;
    variant?: 'fade' | 'slide' | 'scale';
    direction?: 'up' | 'down' | 'left' | 'right';
    className?: string;
}>;
/**
 * Stagger children with configurable animation type
 */
export declare const StaggerContainer: React.FC<{
    children: React.ReactNode;
    stagger?: StaggerTiming;
    delay?: number;
    className?: string;
}>;
/**
 * Grid with stagger animation
 */
export declare const AnimatedGrid: React.FC<{
    children: React.ReactNode;
    columns?: number;
    gap?: number;
    stagger?: StaggerTiming;
    className?: string;
}>;
//# sourceMappingURL=animated-list.d.ts.map