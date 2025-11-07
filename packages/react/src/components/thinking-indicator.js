import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@clarity-chat/primitives';
import { BotIcon, SearchIcon, FileIcon, SparklesIcon, CheckCircleIcon, } from './icons';
import { ANIMATION_DURATION, ANIMATION_EASING } from '../animations/constants';
export const ThinkingIndicator = React.memo(function ThinkingIndicator({ status, className, }) {
    const getStageIcon = (stage) => {
        const iconProps = { size: 20 };
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
    };
    const getStageLabel = (stage) => {
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
    };
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: {
            duration: ANIMATION_DURATION.normal / 1000,
            ease: ANIMATION_EASING.out,
        }, className: cn('flex items-center gap-3 rounded-2xl border border-border/60 bg-[hsl(var(--surface-muted))] px-5 py-4 shadow-[0_12px_28px_rgba(15,23,42,0.12)]', className), children: [_jsx(motion.div, { animate: {
                    scale: [1, 1.15, 1],
                    rotate: [0, 3, -3, 0],
                }, transition: {
                    duration: 2,
                    repeat: Infinity,
                    ease: ANIMATION_EASING.inOut,
                }, className: "text-primary", children: status ? getStageIcon(status.stage) : _jsx(BotIcon, { size: 20 }) }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-medium text-sm", children: status ? getStageLabel(status.stage) : 'Processing' }), _jsx("div", { className: "flex gap-1", children: [0, 1, 2].map((i) => (_jsx(motion.div, { animate: {
                                        opacity: [0.3, 1, 0.3],
                                        scale: [0.8, 1, 0.8],
                                    }, transition: {
                                        duration: 1.5,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                        ease: ANIMATION_EASING.inOut,
                                    }, className: "w-1.5 h-1.5 rounded-full bg-current" }, i))) })] }), status?.topic && (_jsx(motion.p, { initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 }, transition: {
                            duration: ANIMATION_DURATION.fast / 1000,
                            ease: ANIMATION_EASING.out,
                        }, className: "text-xs text-muted-foreground mt-1", children: status.topic })), status?.progress !== undefined && (_jsx("div", { className: "mt-2 h-1 overflow-hidden rounded-full bg-[hsl(var(--surface-muted))]", children: _jsx(motion.div, { initial: { width: 0 }, animate: { width: `${status.progress}%` }, transition: {
                                duration: ANIMATION_DURATION.slow / 1000,
                                ease: ANIMATION_EASING.out,
                            }, className: "h-full bg-primary rounded-full" }) }))] }), status?.estimatedCompletion && (_jsxs(motion.span, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, className: "text-xs text-muted-foreground", children: ["~", Math.ceil((status.estimatedCompletion.getTime() - Date.now()) / 1000), "s"] }))] }));
});
ThinkingIndicator.displayName = 'ThinkingIndicator';
//# sourceMappingURL=thinking-indicator.js.map