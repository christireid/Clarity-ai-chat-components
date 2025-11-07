/**
 * Animation Constants
 *
 * Centralized animation timing and easing values for consistent motion design.
 */
/**
 * Animation durations in milliseconds
 */
export declare const ANIMATION_DURATION: {
    /** Ultra fast - 100ms - Micro-interactions, hover states */
    readonly instant: 100;
    /** Fast - 150ms - Button presses, simple transitions */
    readonly fast: 150;
    /** Normal - 250ms - Standard transitions, fades */
    readonly normal: 250;
    /** Slow - 350ms - Complex transitions, slides */
    readonly slow: 350;
    /** Slower - 500ms - Page transitions, reveals */
    readonly slower: 500;
    /** Very slow - 700ms - Special effects, dramatic reveals */
    readonly slowest: 700;
};
/**
 * Animation easing functions
 */
export declare const ANIMATION_EASING: {
    /** Default ease - Smooth in and out */
    readonly default: "cubic-bezier(0.4, 0, 0.2, 1)";
    /** Ease in - Starts slow, ends fast */
    readonly in: "cubic-bezier(0.4, 0, 1, 1)";
    /** Ease out - Starts fast, ends slow */
    readonly out: "cubic-bezier(0, 0, 0.2, 1)";
    /** Ease in-out - Smooth start and end */
    readonly inOut: "cubic-bezier(0.4, 0, 0.2, 1)";
    /** Spring - Bouncy, energetic feel */
    readonly spring: "cubic-bezier(0.34, 1.56, 0.64, 1)";
    /** Sharp - Quick, decisive movement */
    readonly sharp: "cubic-bezier(0.4, 0, 0.6, 1)";
    /** Emphasized - Attention-grabbing */
    readonly emphasized: "cubic-bezier(0.25, 0.46, 0.45, 0.94)";
};
/**
 * Stagger timing for list animations
 */
export declare const STAGGER_TIMING: {
    /** Very fast stagger - 30ms between items */
    readonly fast: 0.03;
    /** Normal stagger - 50ms between items */
    readonly normal: 0.05;
    /** Slow stagger - 80ms between items */
    readonly slow: 0.08;
    /** Very slow stagger - 120ms between items */
    readonly slower: 0.12;
};
/**
 * Common animation variants for framer-motion
 */
export declare const ANIMATION_VARIANTS: {
    /** Fade in/out */
    readonly fade: {
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
    /** Fade and slide up */
    readonly fadeSlideUp: {
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
    /** Fade and slide down */
    readonly fadeSlideDown: {
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
    /** Scale and fade */
    readonly scaleFade: {
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
    /** Slide from left */
    readonly slideLeft: {
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
    /** Slide from right */
    readonly slideRight: {
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
    /** List container with stagger */
    readonly listContainer: {
        readonly initial: {};
        readonly animate: {
            readonly transition: {
                readonly staggerChildren: 0.05;
                readonly delayChildren: 0.1;
            };
        };
        readonly exit: {
            readonly transition: {
                readonly staggerChildren: 0.03;
                readonly staggerDirection: -1;
            };
        };
    };
    /** List item */
    readonly listItem: {
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
};
/**
 * Hover and tap animations
 */
export declare const INTERACTION_VARIANTS: {
    /** Button hover/tap */
    readonly button: {
        readonly hover: {
            readonly scale: 1.02;
        };
        readonly tap: {
            readonly scale: 0.98;
        };
        readonly transition: {
            readonly duration: number;
        };
    };
    /** Icon button hover/tap */
    readonly iconButton: {
        readonly hover: {
            readonly scale: 1.1;
            readonly rotate: 5;
        };
        readonly tap: {
            readonly scale: 0.9;
        };
        readonly transition: {
            readonly duration: number;
        };
    };
    /** Card hover */
    readonly card: {
        readonly hover: {
            readonly y: -4;
            readonly boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)";
        };
        readonly transition: {
            readonly duration: number;
        };
    };
    /** Subtle lift on hover */
    readonly lift: {
        readonly hover: {
            readonly y: -2;
        };
        readonly transition: {
            readonly duration: number;
        };
    };
    /** Glow effect on hover */
    readonly glow: {
        readonly hover: {
            readonly boxShadow: "0 0 20px rgba(var(--primary), 0.3)";
        };
        readonly transition: {
            readonly duration: number;
        };
    };
};
/**
 * Loading and skeleton animation
 */
export declare const LOADING_ANIMATION: {
    readonly pulse: {
        readonly animate: {
            readonly opacity: readonly [0.5, 0.8, 0.5];
        };
        readonly transition: {
            readonly duration: 1.5;
            readonly repeat: number;
            readonly ease: "cubic-bezier(0.4, 0, 0.2, 1)";
        };
    };
    readonly shimmer: {
        readonly animate: {
            readonly backgroundPosition: readonly ["200% 0", "-200% 0"];
        };
        readonly transition: {
            readonly duration: 2;
            readonly repeat: number;
            readonly ease: "linear";
        };
    };
    readonly spinner: {
        readonly animate: {
            readonly rotate: readonly [0, 360];
        };
        readonly transition: {
            readonly duration: 1;
            readonly repeat: number;
            readonly ease: "linear";
        };
    };
    readonly dots: {
        readonly animate: {
            readonly opacity: readonly [0.3, 1, 0.3];
            readonly scale: readonly [0.8, 1, 0.8];
        };
        readonly transition: {
            readonly duration: 1.5;
            readonly repeat: number;
        };
    };
};
/**
 * Type exports
 */
export type AnimationDuration = keyof typeof ANIMATION_DURATION;
export type AnimationEasing = keyof typeof ANIMATION_EASING;
export type StaggerTiming = keyof typeof STAGGER_TIMING;
export type AnimationVariant = keyof typeof ANIMATION_VARIANTS;
export type InteractionVariant = keyof typeof INTERACTION_VARIANTS;
//# sourceMappingURL=constants.d.ts.map