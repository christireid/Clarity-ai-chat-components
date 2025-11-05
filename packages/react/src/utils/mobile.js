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
export function isMobile() {
    if (typeof window === 'undefined')
        return false;
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}
/**
 * Check if device is touch-enabled
 */
export function isTouchDevice() {
    if (typeof window === 'undefined')
        return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}
/**
 * Get viewport dimensions
 */
export function getViewportSize() {
    if (typeof window === 'undefined') {
        return { width: 0, height: 0 };
    }
    return {
        width: window.innerWidth,
        height: window.innerHeight,
    };
}
/**
 * Hook for mobile detection
 */
export function useIsMobile() {
    const [mobile, setMobile] = React.useState(() => isMobile());
    React.useEffect(() => {
        const checkMobile = () => {
            setMobile(isMobile());
        };
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    return mobile;
}
/**
 * Hook for touch device detection
 */
export function useIsTouchDevice() {
    const [touch, setTouch] = React.useState(() => isTouchDevice());
    React.useEffect(() => {
        setTouch(isTouchDevice());
    }, []);
    return touch;
}
/**
 * Hook for viewport size
 */
export function useViewportSize() {
    const [size, setSize] = React.useState(getViewportSize);
    React.useEffect(() => {
        const handleResize = () => {
            setSize(getViewportSize());
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return size;
}
/**
 * Touch target sizes for accessibility
 */
export const TOUCH_TARGET = {
    /** Minimum size for primary actions */
    minimum: 44,
    /** Recommended size for comfortable tapping */
    comfortable: 48,
    /** Large size for important actions */
    large: 56,
};
/**
 * Get appropriate touch target class
 */
export function getTouchTargetClass(size = 'comfortable') {
    const sizeMap = {
        minimum: 'min-h-[44px] min-w-[44px]',
        comfortable: 'min-h-[48px] min-w-[48px]',
        large: 'min-h-[56px] min-w-[56px]',
    };
    return sizeMap[size];
}
/**
 * Hook for swipe gesture detection
 */
export function useSwipe(onSwipe, threshold = 50, velocityThreshold = 0.3) {
    const touchStart = React.useRef(null);
    const handlers = React.useMemo(() => ({
        onTouchStart: (e) => {
            const touch = e.touches[0];
            touchStart.current = {
                x: touch.clientX,
                y: touch.clientY,
                time: Date.now(),
            };
        },
        onTouchEnd: (e) => {
            if (!touchStart.current)
                return;
            const touch = e.changedTouches[0];
            const deltaX = touch.clientX - touchStart.current.x;
            const deltaY = touch.clientY - touchStart.current.y;
            const duration = Date.now() - touchStart.current.time;
            const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
            const velocity = distance / duration;
            // Determine direction
            let direction;
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                direction = deltaX > 0 ? 'right' : 'left';
            }
            else {
                direction = deltaY > 0 ? 'down' : 'up';
            }
            // Check if swipe meets thresholds
            const primaryDelta = direction === 'left' || direction === 'right'
                ? Math.abs(deltaX)
                : Math.abs(deltaY);
            if (primaryDelta >= threshold && velocity >= velocityThreshold) {
                onSwipe?.({
                    direction,
                    distance,
                    velocity,
                    duration,
                });
            }
            touchStart.current = null;
        },
    }), [onSwipe, threshold, velocityThreshold]);
    return handlers;
}
/**
 * Hook for long press detection
 */
export function useLongPress(onLongPress, duration = 500) {
    const timerRef = React.useRef();
    const isLongPress = React.useRef(false);
    const start = React.useCallback(() => {
        isLongPress.current = false;
        timerRef.current = setTimeout(() => {
            isLongPress.current = true;
            onLongPress();
        }, duration);
    }, [onLongPress, duration]);
    const cancel = React.useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
    }, []);
    const handlers = React.useMemo(() => ({
        onTouchStart: start,
        onTouchEnd: cancel,
        onTouchMove: cancel,
        onMouseDown: start,
        onMouseUp: cancel,
        onMouseLeave: cancel,
    }), [start, cancel]);
    return {
        handlers,
        isLongPress: () => isLongPress.current,
    };
}
/**
 * Hook for pull-to-refresh
 */
export function usePullToRefresh(onRefresh, threshold = 80) {
    const [isPulling, setIsPulling] = React.useState(false);
    const [pullDistance, setPullDistance] = React.useState(0);
    const startY = React.useRef(0);
    const isRefreshing = React.useRef(false);
    const handlers = React.useMemo(() => ({
        onTouchStart: (e) => {
            if (window.scrollY === 0) {
                startY.current = e.touches[0].clientY;
                setIsPulling(true);
            }
        },
        onTouchMove: (e) => {
            if (!isPulling || isRefreshing.current)
                return;
            const currentY = e.touches[0].clientY;
            const distance = Math.max(0, currentY - startY.current);
            setPullDistance(distance);
        },
        onTouchEnd: async () => {
            if (!isPulling || isRefreshing.current)
                return;
            if (pullDistance >= threshold) {
                isRefreshing.current = true;
                try {
                    await onRefresh();
                }
                finally {
                    isRefreshing.current = false;
                }
            }
            setIsPulling(false);
            setPullDistance(0);
        },
    }), [isPulling, pullDistance, threshold, onRefresh]);
    return {
        handlers,
        isPulling,
        pullDistance,
        progress: Math.min(pullDistance / threshold, 1),
    };
}
/**
 * Prevent zoom on double-tap
 */
export function preventDoubleTapZoom(element) {
    let lastTap = 0;
    element.addEventListener('touchend', (e) => {
        const currentTime = Date.now();
        const tapLength = currentTime - lastTap;
        if (tapLength < 500 && tapLength > 0) {
            e.preventDefault();
        }
        lastTap = currentTime;
    });
}
/**
 * Safe area insets (for notch and home indicator)
 */
export function useSafeAreaInsets() {
    const [insets, setInsets] = React.useState({
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    });
    React.useEffect(() => {
        if (typeof window === 'undefined')
            return;
        const computedStyle = getComputedStyle(document.documentElement);
        setInsets({
            top: parseInt(computedStyle.getPropertyValue('--safe-area-inset-top') || '0'),
            right: parseInt(computedStyle.getPropertyValue('--safe-area-inset-right') || '0'),
            bottom: parseInt(computedStyle.getPropertyValue('--safe-area-inset-bottom') || '0'),
            left: parseInt(computedStyle.getPropertyValue('--safe-area-inset-left') || '0'),
        });
    }, []);
    return insets;
}
/**
 * Haptic feedback (if supported)
 */
export function hapticFeedback(type = 'medium') {
    if (typeof window === 'undefined' || !('vibrate' in navigator))
        return;
    const patterns = {
        light: [10],
        medium: [20],
        heavy: [30],
    };
    navigator.vibrate(patterns[type]);
}
/**
 * Hook for simple haptic feedback
 * @deprecated Use useHapticFeedback from hooks/use-haptic instead for more features
 */
export function useSimpleHapticFeedback() {
    return React.useCallback((type = 'medium') => {
        hapticFeedback(type);
    }, []);
}
//# sourceMappingURL=mobile.js.map