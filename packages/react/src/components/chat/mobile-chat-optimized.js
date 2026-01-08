'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Card, CardContent, Button, cn } from '@clarity-chat/primitives';
import { DURATION_SECONDS } from '../../animations/constants';
import { useReducedMotion } from '@clarity-chat/primitives';
import { getMotionSafeDuration, getMotionSafeValue, } from '../../animations/motion-safe';
const defaultConfig = {
    enableSwipe: true,
    enablePullToRefresh: true,
    largeTapTargets: true,
    enableHaptics: true,
    swipeThreshold: 80,
    pullThreshold: 100,
};
/**
 * MobileOptimizedMessage Component
 *
 * Touch-optimized message with:
 * - Swipe-to-reveal actions
 * - Long-press menu
 * - Haptic feedback
 * - Large tap targets
 */
export function MobileOptimizedMessage({ message, swipeActions: customSwipeActions, config: userConfig, onDelete, onReply, onCopy, className, }) {
    const config = { ...defaultConfig, ...userConfig };
    const prefersReducedMotion = useReducedMotion();
    const x = useMotionValue(0);
    const [isLongPressing, setIsLongPressing] = React.useState(false);
    const [showActions, setShowActions] = React.useState(false);
    const longPressTimer = React.useRef(undefined);
    // Default swipe actions
    const defaultSwipeActions = [
        {
            id: 'reply',
            icon: '↩️',
            label: 'Reply',
            color: 'bg-blue-500',
            threshold: 80,
            onAction: (msg) => onReply?.(msg),
        },
        {
            id: 'copy',
            icon: '📋',
            label: 'Copy',
            color: 'bg-green-500',
            threshold: 160,
            onAction: (msg) => onCopy?.(msg),
        },
        {
            id: 'delete',
            icon: '🗑️',
            label: 'Delete',
            color: 'bg-red-500',
            threshold: 240,
            onAction: (msg) => onDelete?.(msg),
        },
    ];
    const swipeActions = customSwipeActions || defaultSwipeActions;
    // Background color based on swipe distance
    const backgroundColor = useTransform(x, [-240, -160, -80, 0], [
        'rgb(239, 68, 68)', // red
        'rgb(34, 197, 94)', // green
        'rgb(59, 130, 246)', // blue
        'transparent',
    ]);
    // Trigger haptic feedback
    const triggerHaptic = (intensity = 'light') => {
        if (!config.enableHaptics)
            return;
        if (typeof window === 'undefined')
            return;
        try {
            // Haptic API
            if (navigator.vibrate) {
                const pattern = {
                    light: [10],
                    medium: [20],
                    heavy: [30],
                };
                navigator.vibrate(pattern[intensity]);
            }
        }
        catch (error) {
            // Haptics not supported
        }
    };
    // Handle swipe drag
    const handleDrag = (_, info) => {
        if (!config.enableSwipe)
            return;
        // Find which action threshold we've crossed
        const distance = Math.abs(info.offset.x);
        const crossedAction = swipeActions.find((action) => distance >= action.threshold);
        if (crossedAction) {
            triggerHaptic('medium');
        }
    };
    // Handle swipe end
    const handleDragEnd = (_, info) => {
        if (!config.enableSwipe)
            return;
        const distance = Math.abs(info.offset.x);
        const velocity = Math.abs(info.velocity.x);
        // Find action to trigger
        const triggeredAction = swipeActions
            .filter((action) => distance >= action.threshold)
            .sort((a, b) => b.threshold - a.threshold)[0];
        if (triggeredAction || velocity > 500) {
            triggerHaptic('heavy');
            if (triggeredAction) {
                triggeredAction.onAction(message);
            }
        }
        // Reset position
        x.set(0);
    };
    // Long press handling
    const handleTouchStart = () => {
        longPressTimer.current = setTimeout(() => {
            setIsLongPressing(true);
            setShowActions(true);
            triggerHaptic('medium');
        }, 500);
    };
    const handleTouchEnd = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }
        setIsLongPressing(false);
    };
    return (_jsxs("div", { className: cn('relative overflow-hidden', className), children: [config.enableSwipe && (_jsx(motion.div, { className: "absolute inset-0 flex items-center justify-end px-4 gap-2", style: { backgroundColor }, children: swipeActions.map((action) => {
                    const distance = Math.abs(x.get());
                    const isActive = distance >= action.threshold;
                    return (_jsx(motion.div, { initial: {
                            scale: getMotionSafeValue(prefersReducedMotion, 0, 1),
                        }, animate: {
                            scale: isActive
                                ? 1
                                : getMotionSafeValue(prefersReducedMotion, 0.5, 1),
                        }, transition: {
                            duration: getMotionSafeDuration(prefersReducedMotion, DURATION_SECONDS.fast),
                        }, className: cn('flex items-center justify-center w-12 h-12 rounded-full', action.color), children: _jsx("span", { className: "text-2xl", children: action.icon }) }, action.id));
                }) })), _jsx(motion.div, { drag: config.enableSwipe ? 'x' : false, dragConstraints: { left: -280, right: 0 }, dragElastic: 0.2, style: { x }, onDrag: handleDrag, onDragEnd: handleDragEnd, onTouchStart: handleTouchStart, onTouchEnd: handleTouchEnd, className: cn('relative bg-background', isLongPressing && 'ring-2 ring-primary'), children: _jsx(Card, { children: _jsx(CardContent, { className: cn('p-4', config.largeTapTargets && 'min-h-[60px]'), children: _jsx("div", { className: "flex items-start gap-3", children: _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "text-sm font-medium mb-1", children: message.role === 'user' ? 'You' : 'Assistant' }), _jsx("div", { className: "text-sm", children: message.content }), _jsx("div", { className: "text-xs text-muted-foreground mt-2", children: message.timestamp &&
                                            new Date(message.timestamp).toLocaleTimeString() })] }) }) }) }) }), showActions && (_jsx(motion.div, { initial: {
                    opacity: 0,
                    y: getMotionSafeValue(prefersReducedMotion, 10, 0),
                }, animate: { opacity: 1, y: 0 }, exit: {
                    opacity: 0,
                    y: getMotionSafeValue(prefersReducedMotion, 10, 0),
                }, transition: {
                    duration: getMotionSafeDuration(prefersReducedMotion, DURATION_SECONDS.fast),
                }, className: "absolute bottom-full left-0 right-0 mb-2 p-2 bg-background border rounded-lg shadow-lg z-10", children: _jsx("div", { className: "flex gap-2 justify-around", children: swipeActions.map((action) => (_jsxs(Button, { variant: "ghost", size: "sm", onClick: () => {
                            action.onAction(message);
                            setShowActions(false);
                        }, className: "flex flex-col items-center gap-1", children: [_jsx("span", { className: "text-xl", children: action.icon }), _jsx("span", { className: "text-xs", children: action.label })] }, action.id))) }) })), showActions && (_jsx("div", { className: "fixed inset-0 z-0", onClick: () => setShowActions(false) }))] }));
}
/**
 * MobileChatWindow Component
 *
 * Complete mobile-optimized chat with:
 * - Pull-to-refresh
 * - Swipeable messages
 * - Touch-optimized scrolling
 * - Large tap targets
 */
export function MobileChatWindow({ messages, config: userConfig, onRefresh, onDelete, onReply, onCopy, className, }) {
    const config = { ...defaultConfig, ...userConfig };
    const prefersReducedMotion = useReducedMotion();
    const scrollRef = React.useRef(null);
    const [isPulling, setIsPulling] = React.useState(false);
    const [pullDistance, setPullDistance] = React.useState(0);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const touchStartY = React.useRef(0);
    const isAtTop = React.useRef(true);
    // Check if at top of scroll
    React.useEffect(() => {
        const handleScroll = () => {
            if (scrollRef.current) {
                isAtTop.current = scrollRef.current.scrollTop === 0;
            }
        };
        const ref = scrollRef.current;
        ref?.addEventListener('scroll', handleScroll);
        return () => ref?.removeEventListener('scroll', handleScroll);
    }, []);
    // Pull-to-refresh handling
    const handleTouchStart = (e) => {
        if (!config.enablePullToRefresh || !isAtTop.current || !e.touches[0])
            return;
        touchStartY.current = e.touches[0].clientY;
    };
    const handleTouchMove = (e) => {
        if (!config.enablePullToRefresh || !isAtTop.current || !e.touches[0])
            return;
        const currentY = e.touches[0].clientY;
        const distance = currentY - touchStartY.current;
        if (distance > 0) {
            setIsPulling(true);
            setPullDistance(Math.min(distance, config.pullThreshold * 1.5));
        }
    };
    const handleTouchEnd = async () => {
        if (!config.enablePullToRefresh)
            return;
        if (pullDistance >= config.pullThreshold) {
            setIsRefreshing(true);
            try {
                await onRefresh?.();
            }
            finally {
                setIsRefreshing(false);
            }
        }
        setIsPulling(false);
        setPullDistance(0);
    };
    return (_jsxs("div", { className: cn('relative h-full flex flex-col', className), children: [config.enablePullToRefresh && isPulling && (_jsxs(motion.div, { style: { height: pullDistance }, className: "flex items-center justify-center bg-accent", children: [_jsx(motion.div, { animate: {
                            rotate: isRefreshing && !prefersReducedMotion ? 360 : 0,
                        }, transition: {
                            duration: getMotionSafeDuration(prefersReducedMotion, DURATION_SECONDS.slower),
                            repeat: isRefreshing && !prefersReducedMotion ? Infinity : 0,
                        }, children: pullDistance >= config.pullThreshold ? '↻' : '↓' }), _jsx("span", { className: "ml-2 text-sm", children: isRefreshing
                            ? 'Refreshing...'
                            : pullDistance >= config.pullThreshold
                                ? 'Release to refresh'
                                : 'Pull to refresh' })] })), _jsx("div", { ref: scrollRef, className: "flex-1 overflow-y-auto overscroll-contain", onTouchStart: handleTouchStart, onTouchMove: handleTouchMove, onTouchEnd: handleTouchEnd, style: {
                    WebkitOverflowScrolling: 'touch',
                }, children: _jsx("div", { className: "space-y-2 p-4", children: messages.map((message) => (_jsx(MobileOptimizedMessage, { message: message, config: config, onDelete: onDelete, onReply: onReply, onCopy: onCopy }, message.id))) }) })] }));
}
/**
 * Hook for mobile-specific utilities
 */
export function useMobileOptimization() {
    const [isMobile, setIsMobile] = React.useState(false);
    const [viewportHeight, setViewportHeight] = React.useState(0);
    const [keyboardHeight, setKeyboardHeight] = React.useState(0);
    React.useEffect(() => {
        // Detect mobile
        const checkMobile = () => {
            const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            setIsMobile(mobile || window.innerWidth < 768);
        };
        // Track viewport height (for mobile keyboard)
        const updateHeight = () => {
            const vh = window.visualViewport?.height || window.innerHeight;
            setViewportHeight(vh);
            // Estimate keyboard height
            const diff = window.innerHeight - vh;
            setKeyboardHeight(diff > 100 ? diff : 0);
        };
        checkMobile();
        updateHeight();
        window.addEventListener('resize', checkMobile);
        window.addEventListener('resize', updateHeight);
        window.visualViewport?.addEventListener('resize', updateHeight);
        return () => {
            window.removeEventListener('resize', checkMobile);
            window.removeEventListener('resize', updateHeight);
            window.visualViewport?.removeEventListener('resize', updateHeight);
        };
    }, []);
    const lockScroll = () => {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
    };
    const unlockScroll = () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
    };
    const triggerHaptic = (intensity = 'light') => {
        if (typeof window === 'undefined')
            return;
        try {
            // Haptic API
            if (navigator.vibrate) {
                const pattern = {
                    light: [10],
                    medium: [20],
                    heavy: [30],
                };
                navigator.vibrate(pattern[intensity]);
            }
        }
        catch (error) {
            // Haptics not supported
        }
    };
    const isPortrait = () => {
        return window.innerHeight > window.innerWidth;
    };
    const isLandscape = () => {
        return window.innerWidth > window.innerHeight;
    };
    return {
        isMobile,
        viewportHeight,
        keyboardHeight,
        isKeyboardVisible: keyboardHeight > 100,
        lockScroll,
        unlockScroll,
        triggerHaptic,
        isPortrait: isPortrait(),
        isLandscape: isLandscape(),
    };
}
/**
 * TouchFriendlyButton Component
 *
 * Button with large tap target and haptic feedback
 */
export function TouchFriendlyButton({ children, onClick, variant = 'default', haptic = true, className, }) {
    const { triggerHaptic } = useMobileOptimization();
    const handleClick = () => {
        if (haptic) {
            triggerHaptic('light');
        }
        onClick?.();
    };
    return (_jsx(Button, { onClick: handleClick, variant: variant, className: cn('min-h-[48px] min-w-[48px] text-base', className), children: children }));
}
//# sourceMappingURL=mobile-chat-optimized.js.map