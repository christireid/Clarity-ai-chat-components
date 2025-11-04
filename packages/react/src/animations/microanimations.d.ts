/**
 * Microanimations Library
 *
 * Delightful microanimations for enhanced user experience.
 * These are small, subtle animations that provide feedback and delight.
 */
import { type Variants } from 'framer-motion';
/**
 * Feedback Animations
 * Provide immediate visual feedback for user actions
 */
export declare const FeedbackAnimations: {
    /** Shake animation for errors or invalid input */
    readonly shake: {
        readonly x: readonly [-10, 10, -10, 10, -5, 5, 0];
        readonly transition: {
            readonly duration: 0.5;
            readonly ease: "cubic-bezier(0.4, 0, 0.6, 1)";
        };
    };
    /** Bounce animation for success or emphasis */
    readonly bounce: {
        readonly y: readonly [0, -10, 0, -5, 0];
        readonly transition: {
            readonly duration: 0.6;
            readonly ease: "cubic-bezier(0, 0, 0.2, 1)";
        };
    };
    /** Heartbeat pulse for active/alive elements */
    readonly heartbeat: {
        readonly scale: readonly [1, 1.1, 1, 1.05, 1];
        readonly transition: {
            readonly duration: 1;
            readonly repeat: number;
            readonly ease: "cubic-bezier(0.4, 0, 0.2, 1)";
        };
    };
    /** Gentle pulse for subtle attention */
    readonly pulse: {
        readonly scale: readonly [1, 1.05, 1];
        readonly transition: {
            readonly duration: 1.5;
            readonly repeat: number;
            readonly ease: "cubic-bezier(0.4, 0, 0.2, 1)";
        };
    };
    /** Wiggle for playful attention-grabbing */
    readonly wiggle: {
        readonly rotate: readonly [-3, 3, -3, 3, -2, 2, 0];
        readonly transition: {
            readonly duration: 0.5;
            readonly ease: "cubic-bezier(0.4, 0, 0.2, 1)";
        };
    };
    /** Tada - celebratory animation */
    readonly tada: {
        readonly scale: readonly [1, 0.9, 1.1, 1.1, 1.05, 1];
        readonly rotate: readonly [-3, 3, -3, 3, -2, 2, 0];
        readonly transition: {
            readonly duration: 0.8;
            readonly ease: "cubic-bezier(0.34, 1.56, 0.64, 1)";
        };
    };
    /** Flash for urgent attention */
    readonly flash: {
        readonly opacity: readonly [1, 0, 1, 0, 1];
        readonly transition: {
            readonly duration: 0.75;
            readonly ease: "linear";
        };
    };
    /** Rubber band stretch effect */
    readonly rubberBand: {
        readonly scaleX: readonly [1, 1.25, 0.75, 1.15, 0.95, 1.05, 1];
        readonly scaleY: readonly [1, 0.75, 1.25, 0.85, 1.05, 0.95, 1];
        readonly transition: {
            readonly duration: 0.8;
            readonly ease: "cubic-bezier(0.4, 0, 0.2, 1)";
        };
    };
};
/**
 * Success/Error State Animations
 */
export declare const StateAnimations: {
    /** Success checkmark animation */
    readonly successCheck: {
        readonly scale: readonly [0, 1.2, 1];
        readonly rotate: readonly [0, 5, 0];
        readonly opacity: readonly [0, 1, 1];
        readonly transition: {
            readonly duration: 0.5;
            readonly ease: "cubic-bezier(0.34, 1.56, 0.64, 1)";
        };
    };
    /** Error shake with color */
    readonly errorShake: {
        readonly x: readonly [-8, 8, -8, 8, -4, 4, 0];
        readonly transition: {
            readonly duration: 0.4;
            readonly ease: "cubic-bezier(0.4, 0, 0.6, 1)";
        };
    };
    /** Success glow effect */
    readonly successGlow: {
        readonly boxShadow: readonly ["0 0 0 0 rgba(34, 197, 94, 0)", "0 0 0 10px rgba(34, 197, 94, 0.3)", "0 0 0 20px rgba(34, 197, 94, 0)"];
        readonly transition: {
            readonly duration: 0.6;
            readonly ease: "cubic-bezier(0, 0, 0.2, 1)";
        };
    };
    /** Error glow effect */
    readonly errorGlow: {
        readonly boxShadow: readonly ["0 0 0 0 rgba(239, 68, 68, 0)", "0 0 0 10px rgba(239, 68, 68, 0.3)", "0 0 0 20px rgba(239, 68, 68, 0)"];
        readonly transition: {
            readonly duration: 0.6;
            readonly ease: "cubic-bezier(0, 0, 0.2, 1)";
        };
    };
    /** Warning pulse */
    readonly warningPulse: {
        readonly scale: readonly [1, 1.05, 1];
        readonly backgroundColor: readonly ["hsl(var(--warning))", "hsl(var(--warning) / 0.8)", "hsl(var(--warning))"];
        readonly transition: {
            readonly duration: 1;
            readonly repeat: 3;
            readonly ease: "cubic-bezier(0.4, 0, 0.2, 1)";
        };
    };
};
/**
 * Loading Animations
 */
export declare const LoadingAnimations: {
    /** Spinner rotation */
    readonly spinner: {
        readonly rotate: 360;
        readonly transition: {
            readonly duration: 1;
            readonly repeat: number;
            readonly ease: "linear";
        };
    };
    /** Pulsing loader */
    readonly pulse: {
        readonly opacity: readonly [0.5, 1, 0.5];
        readonly scale: readonly [0.95, 1, 0.95];
        readonly transition: {
            readonly duration: 1.5;
            readonly repeat: number;
            readonly ease: "cubic-bezier(0.4, 0, 0.2, 1)";
        };
    };
    /** Shimmer effect */
    readonly shimmer: {
        readonly backgroundPosition: readonly ["200% 0", "-200% 0"];
        readonly transition: {
            readonly duration: 2;
            readonly repeat: number;
            readonly ease: "linear";
        };
    };
    /** Bouncing dots wave */
    readonly dotsWave: (index: number) => {
        y: number[];
        transition: {
            duration: number;
            repeat: number;
            ease: "cubic-bezier(0.4, 0, 0.2, 1)";
            delay: number;
        };
    };
    /** Elastic dots */
    readonly dotsElastic: (index: number) => {
        scale: number[];
        opacity: number[];
        transition: {
            duration: number;
            repeat: number;
            ease: "cubic-bezier(0.34, 1.56, 0.64, 1)";
            delay: number;
        };
    };
    /** Progress bar fill */
    readonly progressFill: {
        readonly scaleX: readonly [0, 1];
        readonly transition: {
            readonly duration: 1;
            readonly ease: "cubic-bezier(0, 0, 0.2, 1)";
        };
    };
    /** Skeleton shimmer */
    readonly skeletonShimmer: {
        readonly backgroundPosition: readonly ["200% 0", "-200% 0"];
        readonly transition: {
            readonly duration: 2;
            readonly repeat: number;
            readonly ease: "linear";
        };
    };
};
/**
 * Hover & Focus Animations
 */
export declare const InteractionAnimations: {
    /** Lift on hover */
    readonly lift: {
        readonly hover: {
            readonly y: -4;
            readonly boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)";
            readonly transition: {
                readonly duration: number;
            };
        };
    };
    /** Glow on hover */
    readonly glow: {
        readonly hover: {
            readonly boxShadow: "0 0 20px var(--primary-glow, rgba(102, 126, 234, 0.4))";
            readonly transition: {
                readonly duration: number;
            };
        };
    };
    /** Scale on hover */
    readonly scale: {
        readonly hover: {
            readonly scale: 1.05;
        };
        readonly tap: {
            readonly scale: 0.95;
        };
        readonly transition: {
            readonly duration: number;
        };
    };
    /** Rotate on hover */
    readonly rotate: {
        readonly hover: {
            readonly rotate: 5;
        };
        readonly transition: {
            readonly duration: number;
        };
    };
    /** Brightness on hover */
    readonly brighten: {
        readonly hover: {
            readonly filter: "brightness(1.1)";
        };
        readonly transition: {
            readonly duration: number;
        };
    };
    /** Focus ring pulse */
    readonly focusPulse: {
        readonly boxShadow: readonly ["0 0 0 0 rgba(var(--primary-rgb), 0)", "0 0 0 4px rgba(var(--primary-rgb), 0.3)", "0 0 0 4px rgba(var(--primary-rgb), 0)"];
        readonly transition: {
            readonly duration: 0.6;
            readonly ease: "cubic-bezier(0, 0, 0.2, 1)";
        };
    };
};
/**
 * Entry & Exit Animations
 */
export declare const TransitionAnimations: {
    /** Fade in */
    readonly fadeIn: {
        readonly initial: {
            readonly opacity: 0;
        };
        readonly animate: {
            readonly opacity: 1;
        };
        readonly exit: {
            readonly opacity: 0;
        };
        readonly transition: {
            readonly duration: number;
        };
    };
    /** Slide up */
    readonly slideUp: {
        readonly initial: {
            readonly opacity: 0;
            readonly y: 20;
        };
        readonly animate: {
            readonly opacity: 1;
            readonly y: 0;
        };
        readonly exit: {
            readonly opacity: 0;
            readonly y: -20;
        };
        readonly transition: {
            readonly duration: number;
            readonly ease: "cubic-bezier(0, 0, 0.2, 1)";
        };
    };
    /** Slide down */
    readonly slideDown: {
        readonly initial: {
            readonly opacity: 0;
            readonly y: -20;
        };
        readonly animate: {
            readonly opacity: 1;
            readonly y: 0;
        };
        readonly exit: {
            readonly opacity: 0;
            readonly y: 20;
        };
        readonly transition: {
            readonly duration: number;
            readonly ease: "cubic-bezier(0, 0, 0.2, 1)";
        };
    };
    /** Slide left */
    readonly slideLeft: {
        readonly initial: {
            readonly opacity: 0;
            readonly x: 20;
        };
        readonly animate: {
            readonly opacity: 1;
            readonly x: 0;
        };
        readonly exit: {
            readonly opacity: 0;
            readonly x: -20;
        };
        readonly transition: {
            readonly duration: number;
            readonly ease: "cubic-bezier(0, 0, 0.2, 1)";
        };
    };
    /** Slide right */
    readonly slideRight: {
        readonly initial: {
            readonly opacity: 0;
            readonly x: -20;
        };
        readonly animate: {
            readonly opacity: 1;
            readonly x: 0;
        };
        readonly exit: {
            readonly opacity: 0;
            readonly x: 20;
        };
        readonly transition: {
            readonly duration: number;
            readonly ease: "cubic-bezier(0, 0, 0.2, 1)";
        };
    };
    /** Zoom in */
    readonly zoomIn: {
        readonly initial: {
            readonly opacity: 0;
            readonly scale: 0.9;
        };
        readonly animate: {
            readonly opacity: 1;
            readonly scale: 1;
        };
        readonly exit: {
            readonly opacity: 0;
            readonly scale: 0.95;
        };
        readonly transition: {
            readonly duration: number;
            readonly ease: "cubic-bezier(0.34, 1.56, 0.64, 1)";
        };
    };
    /** Zoom out */
    readonly zoomOut: {
        readonly initial: {
            readonly opacity: 0;
            readonly scale: 1.1;
        };
        readonly animate: {
            readonly opacity: 1;
            readonly scale: 1;
        };
        readonly exit: {
            readonly opacity: 0;
            readonly scale: 1.05;
        };
        readonly transition: {
            readonly duration: number;
            readonly ease: "cubic-bezier(0, 0, 0.2, 1)";
        };
    };
    /** Pop in with spring */
    readonly popIn: {
        readonly initial: {
            readonly opacity: 0;
            readonly scale: 0.5;
        };
        readonly animate: {
            readonly opacity: 1;
            readonly scale: 1;
        };
        readonly exit: {
            readonly opacity: 0;
            readonly scale: 0.8;
        };
        readonly transition: {
            readonly duration: number;
            readonly ease: "cubic-bezier(0.34, 1.56, 0.64, 1)";
        };
    };
    /** Flip in */
    readonly flipIn: {
        readonly initial: {
            readonly opacity: 0;
            readonly rotateX: -90;
        };
        readonly animate: {
            readonly opacity: 1;
            readonly rotateX: 0;
        };
        readonly exit: {
            readonly opacity: 0;
            readonly rotateX: 90;
        };
        readonly transition: {
            readonly duration: number;
            readonly ease: "cubic-bezier(0, 0, 0.2, 1)";
        };
    };
    /** Rotate in */
    readonly rotateIn: {
        readonly initial: {
            readonly opacity: 0;
            readonly rotate: -180;
        };
        readonly animate: {
            readonly opacity: 1;
            readonly rotate: 0;
        };
        readonly exit: {
            readonly opacity: 0;
            readonly rotate: 180;
        };
        readonly transition: {
            readonly duration: number;
            readonly ease: "cubic-bezier(0, 0, 0.2, 1)";
        };
    };
};
/**
 * List Animations
 */
export declare const ListAnimations: {
    /** Staggered container */
    readonly container: (staggerDelay?: number) => Variants;
    /** List item */
    readonly item: {
        readonly initial: {
            readonly opacity: 0;
            readonly y: 10;
        };
        readonly animate: {
            readonly opacity: 1;
            readonly y: 0;
        };
        readonly exit: {
            readonly opacity: 0;
            readonly y: -10;
        };
        readonly transition: {
            readonly duration: number;
        };
    };
    /** Cascade from left */
    readonly cascadeLeft: (index: number) => {
        initial: {
            opacity: number;
            x: number;
        };
        animate: {
            opacity: number;
            x: number;
        };
        transition: {
            delay: number;
            duration: number;
            ease: "cubic-bezier(0, 0, 0.2, 1)";
        };
    };
    /** Cascade from right */
    readonly cascadeRight: (index: number) => {
        initial: {
            opacity: number;
            x: number;
        };
        animate: {
            opacity: number;
            x: number;
        };
        transition: {
            delay: number;
            duration: number;
            ease: "cubic-bezier(0, 0, 0.2, 1)";
        };
    };
};
/**
 * Attention Seekers
 * Use sparingly for important notifications
 */
export declare const AttentionAnimations: {
    /** Gentle bounce */
    readonly bounce: {
        readonly y: readonly [0, -20, 0, -10, 0, -5, 0];
        readonly transition: {
            readonly duration: 1;
            readonly ease: "cubic-bezier(0, 0, 0.2, 1)";
        };
    };
    /** Swing */
    readonly swing: {
        readonly rotate: readonly [0, 15, -15, 10, -10, 5, -5, 0];
        readonly transition: {
            readonly duration: 1;
            readonly ease: "cubic-bezier(0.4, 0, 0.2, 1)";
        };
    };
    /** Jello */
    readonly jello: {
        readonly skewX: readonly [0, -12.5, 6.25, -3.125, 1.5625, -0.78125, 0];
        readonly skewY: readonly [0, -12.5, 6.25, -3.125, 1.5625, -0.78125, 0];
        readonly transition: {
            readonly duration: 1;
            readonly ease: "cubic-bezier(0.4, 0, 0.2, 1)";
        };
    };
    /** Head shake */
    readonly headShake: {
        readonly x: readonly [0, -8, 8, -6, 6, -4, 4, 0];
        readonly rotate: readonly [0, -5, 5, -3, 3, -2, 2, 0];
        readonly transition: {
            readonly duration: 1;
            readonly ease: "cubic-bezier(0.4, 0, 0.2, 1)";
        };
    };
};
/**
 * Typography Animations
 */
export declare const TypographyAnimations: {
    /** Character reveal */
    readonly revealChar: (index: number) => {
        opacity: number[];
        y: number[];
        transition: {
            delay: number;
            duration: number;
            ease: "cubic-bezier(0, 0, 0.2, 1)";
        };
    };
    /** Typing cursor */
    readonly typingCursor: {
        readonly opacity: readonly [1, 1, 0, 0];
        readonly transition: {
            readonly duration: 1;
            readonly repeat: number;
            readonly ease: "step-end";
        };
    };
    /** Text gradient shimmer */
    readonly textShimmer: {
        readonly backgroundPosition: readonly ["200% 0", "-200% 0"];
        readonly transition: {
            readonly duration: 3;
            readonly repeat: number;
            readonly ease: "linear";
        };
    };
};
/**
 * Helper function to create ripple effect
 * Returns an object with ripple animation properties
 */
export declare const createRipple: (x: number, y: number, size: number) => {
    x: number;
    y: number;
    width: number;
    height: number;
    borderRadius: string;
    position: "absolute";
    transform: string;
    backgroundColor: string;
    opacity: number;
    pointerEvents: "none";
    animation: {
        scale: number[];
        opacity: number[];
    };
    transition: {
        duration: number;
        ease: "cubic-bezier(0, 0, 0.2, 1)";
    };
};
/**
 * Type exports
 */
export type FeedbackAnimation = keyof typeof FeedbackAnimations;
export type StateAnimation = keyof typeof StateAnimations;
export type LoadingAnimation = keyof typeof LoadingAnimations;
export type InteractionAnimation = keyof typeof InteractionAnimations;
export type TransitionAnimation = keyof typeof TransitionAnimations;
export type AttentionAnimation = keyof typeof AttentionAnimations;
//# sourceMappingURL=microanimations.d.ts.map