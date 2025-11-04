/**
 * Mobile Optimization Utilities
 *
 * Utilities for mobile-specific optimizations:
 * - Touch target sizing
 * - Gesture detection
 * - Mobile-specific styles
 * - Viewport handling
 */
import * as React from 'react';
/**
 * Check if device is mobile
 */
export declare function isMobile(): boolean;
/**
 * Check if device is touch-enabled
 */
export declare function isTouchDevice(): boolean;
/**
 * Get viewport dimensions
 */
export declare function getViewportSize(): {
    width: number;
    height: number;
};
/**
 * Hook for mobile detection
 */
export declare function useIsMobile(): boolean;
/**
 * Hook for touch device detection
 */
export declare function useIsTouchDevice(): boolean;
/**
 * Hook for viewport size
 */
export declare function useViewportSize(): {
    width: number;
    height: number;
};
/**
 * Touch target sizes for accessibility
 */
export declare const TOUCH_TARGET: {
    /** Minimum size for primary actions */
    readonly minimum: 44;
    /** Recommended size for comfortable tapping */
    readonly comfortable: 48;
    /** Large size for important actions */
    readonly large: 56;
};
/**
 * Get appropriate touch target class
 */
export declare function getTouchTargetClass(size?: keyof typeof TOUCH_TARGET): string;
/**
 * Gesture detection types
 */
export type SwipeDirection = 'left' | 'right' | 'up' | 'down';
export interface SwipeEvent {
    direction: SwipeDirection;
    distance: number;
    velocity: number;
    duration: number;
}
/**
 * Hook for swipe gesture detection
 */
export declare function useSwipe(onSwipe?: (event: SwipeEvent) => void, threshold?: number, velocityThreshold?: number): {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
};
/**
 * Hook for long press detection
 */
export declare function useLongPress(onLongPress: () => void, duration?: number): {
    handlers: {
        onTouchStart: () => void;
        onTouchEnd: () => void;
        onTouchMove: () => void;
        onMouseDown: () => void;
        onMouseUp: () => void;
        onMouseLeave: () => void;
    };
    isLongPress: () => boolean;
};
/**
 * Hook for pull-to-refresh
 */
export declare function usePullToRefresh(onRefresh: () => void | Promise<void>, threshold?: number): {
    handlers: {
        onTouchStart: (e: React.TouchEvent) => void;
        onTouchMove: (e: React.TouchEvent) => void;
        onTouchEnd: () => Promise<void>;
    };
    isPulling: boolean;
    pullDistance: number;
    progress: number;
};
/**
 * Prevent zoom on double-tap
 */
export declare function preventDoubleTapZoom(element: HTMLElement): void;
/**
 * Safe area insets (for notch and home indicator)
 */
export declare function useSafeAreaInsets(): {
    top: number;
    right: number;
    bottom: number;
    left: number;
};
/**
 * Haptic feedback (if supported)
 */
export declare function hapticFeedback(type?: 'light' | 'medium' | 'heavy'): void;
/**
 * Hook for simple haptic feedback
 * @deprecated Use useHapticFeedback from hooks/use-haptic instead for more features
 */
export declare function useSimpleHapticFeedback(): (type?: "light" | "medium" | "heavy") => void;
//# sourceMappingURL=mobile.d.ts.map