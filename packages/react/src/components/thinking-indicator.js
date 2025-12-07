'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@clarity-chat/primitives';
import { BotIcon, SearchIcon, FileIcon, SparklesIcon, CheckCircleIcon, } from './icons';
import { ANIMATION_DURATION, ANIMATION_EASING } from '../animations/constants';
export function ThinkingIndicator({ status, className, }) {
    // Memoize icon and label getters to prevent recreation on every render
    const getStageIcon = useCallback((stage) => {
        const iconProps = { size: 18 };
        switch (stage) {
            case 'thinking':
                return _jsx(BotIcon, { ...iconProps });
            case 'researching':
                return _jsx(SearchIcon, { ...iconProps });
            case 'compiling':
                return _jsx(FileIcon, { ...iconProps });
            case 'generating':
                return _jsx(SparklesIcon, { ...iconProps });
            case 'finalizing':
                return _jsx(CheckCircleIcon, { ...iconProps });
            default:
                return _jsx(BotIcon, { ...iconProps });
        }
    }, []);
    const getStageLabel = useCallback((stage) => {
        switch (stage) {
            case 'thinking':
                return 'Thinking';
            case 'researching':
                return 'Researching';
            case 'compiling':
                return 'Compiling';
            case 'generating':
                return 'Generating';
            case 'finalizing':
                return 'Finalizing';
            default:
                return 'Processing';
        }
    }, []);
    // Compute values from status
    const stageIcon = useMemo(() => getStageIcon(status?.stage || 'thinking'), [status?.stage, getStageIcon]);
    const stageLabel = useMemo(() => getStageLabel(status?.stage || 'thinking'), [status?.stage, getStageLabel]);
    const estimatedSeconds = useMemo(() => {
        if (!status?.estimatedCompletion)
            return null;
        const now = Date.now();
        const completion = status.estimatedCompletion.getTime();
        return Math.max(0, Math.round((completion - now) / 1000));
    }, [status?.estimatedCompletion]);
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: {
            duration: ANIMATION_DURATION.normal / 1000,
            ease: ANIMATION_EASING.out,
        }, className: cn('flex items-center gap-3.5 rounded-lg border border-border/40 bg-muted/40 px-5 py-4 shadow-md', className), children: [_jsx(motion.div, { animate: {
                    scale: [1, 1.15, 1],
                    rotate: [0, 3, -3, 0],
                }, transition: {
                    duration: 2,
                    repeat: Infinity,
                    ease: ANIMATION_EASING.inOut,
                }, className: "text-primary", children: stageIcon }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("span", { className: "font-semibold text-sm", children: stageLabel }), _jsx("div", { className: "flex gap-1", children: [0, 1, 2].map((i) => (_jsx(motion.div, { animate: {
                                        opacity: [0.3, 1, 0.3],
                                        scale: [0.8, 1, 0.8],
                                    }, transition: {
                                        duration: 1.5,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                        ease: ANIMATION_EASING.inOut,
                                    }, className: "w-1 h-1 rounded-full bg-current" }, i))) })] }), status?.topic && (_jsx(motion.p, { initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 }, transition: {
                            duration: ANIMATION_DURATION.fast / 1000,
                            ease: ANIMATION_EASING.out,
                        }, className: "text-xs text-muted-foreground/90 mt-1.5", children: status.topic })), status?.progress !== undefined && (_jsx("div", { className: "mt-2.5 h-1.5 overflow-hidden rounded-full bg-[hsl(var(--surface-muted))]", children: _jsx(motion.div, { initial: { width: 0 }, animate: { width: `${status.progress}%` }, transition: {
                                duration: ANIMATION_DURATION.slow / 1000,
                                ease: ANIMATION_EASING.out,
                            }, className: "h-full bg-primary rounded-full" }) }))] }), estimatedSeconds !== null && (_jsxs(motion.span, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, className: "text-xs font-medium text-muted-foreground/90", children: ["~", estimatedSeconds, "s"] }))] }));
}
ThinkingIndicator.displayName = 'ThinkingIndicator';
//# sourceMappingURL=thinking-indicator.js.map