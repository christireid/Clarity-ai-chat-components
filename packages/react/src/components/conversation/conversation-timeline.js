'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge, Card, CardContent, CardHeader, CardTitle, CardDescription, cn, } from '@clarity-chat/primitives';
import { BotIcon, UserIcon, SearchIcon, SparklesIcon, FileIcon, } from '../ui/icons';
import { EASING_FRAMER, DURATION_SECONDS as durations, } from '../../animations/constants';
const typeStyles = {
    user: {
        bg: 'from-primary/12 via-primary/5 to-transparent',
        border: 'border-primary/40',
        icon: _jsx(UserIcon, { size: 16, className: "text-primary" }),
    },
    assistant: {
        bg: 'from-sky-500/12 via-sky-500/5 to-transparent',
        border: 'border-sky-500/40',
        icon: _jsx(BotIcon, { size: 16, className: "text-sky-500" }),
    },
    tool: {
        bg: 'from-amber-500/12 via-amber-500/5 to-transparent',
        border: 'border-amber-500/40',
        icon: _jsx(SparklesIcon, { size: 16, className: "text-amber-500" }),
    },
    system: {
        bg: 'from-emerald-500/12 via-emerald-500/5 to-transparent',
        border: 'border-emerald-500/40',
        icon: _jsx(SearchIcon, { size: 16, className: "text-emerald-500" }),
    },
    note: {
        bg: 'from-purple-500/12 via-purple-500/5 to-transparent',
        border: 'border-purple-500/40',
        icon: _jsx(FileIcon, { size: 16, className: "text-purple-500" }),
    },
};
const statusText = {
    pending: 'Pending',
    complete: 'Complete',
    error: 'Needs attention',
};
const statusVariant = {
    pending: 'warning',
    complete: 'success',
    error: 'destructive',
};
const defaultTitle = 'Conversation timeline';
const defaultSubtitle = 'Inspect how the session evolved across user input, model responses, and tool calls.';
export const ConversationTimeline = ({ events, onJumpToEvent, showStatusIndicators = true, className, title = defaultTitle, subtitle = defaultSubtitle, }) => {
    const sortedEvents = React.useMemo(() => [...events].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()), [events]);
    const formatTime = (date) => date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });
    return (_jsxs(Card, { className: cn('border-border/60 bg-[hsl(var(--surface-elevated))] shadow-[0_24px_54px_rgba(15,23,42,0.18)]', className), children: [_jsx(CardHeader, { className: "space-y-3", children: _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx(CardTitle, { className: "text-lg font-semibold text-foreground", children: title }), _jsx(CardDescription, { className: "text-sm text-muted-foreground/80", children: subtitle })] }) }), _jsx(CardContent, { children: _jsx("ol", { className: "relative space-y-4 before:absolute before:left-[15px] before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-border/70", children: _jsx(AnimatePresence, { initial: false, children: sortedEvents.map((event, index) => {
                            const style = typeStyles[event.type];
                            const isLast = index === sortedEvents.length - 1;
                            const timelineDotClasses = cn('absolute left-0 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border bg-[hsl(var(--surface-elevated))] shadow-[0_6px_16px_rgba(15,23,42,0.16)]', style.border);
                            return (_jsxs(motion.li, { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -12 }, transition: {
                                    duration: durations.normal,
                                    ease: EASING_FRAMER.default,
                                }, className: "relative pl-12", children: [_jsx("span", { className: timelineDotClasses, children: event.icon ?? style.icon }), _jsxs("div", { className: cn('group flex flex-col gap-2 rounded-lg border bg-gradient-to-br p-4 text-sm shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1),0_2px_4px_-2px_rgb(0_0_0_/_0.1)] backdrop-blur-sm transition-all duration-150 ease-out hover:-translate-y-px hover:border-primary/40', style.bg, style.border), children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("h3", { className: "text-base font-semibold text-foreground", children: event.title }), _jsx("span", { className: "text-xs font-medium text-muted-foreground/70", children: formatTime(event.timestamp) }), event.durationMs !== undefined && (_jsxs("span", { className: "text-xs font-medium text-muted-foreground/70", children: ["\u2022 ", (event.durationMs / 1000).toFixed(1), "s"] }))] }), showStatusIndicators && event.status && (_jsx(Badge, { variant: statusVariant[event.status], children: statusText[event.status] }))] }), event.summary && (_jsx("p", { className: "text-sm text-muted-foreground/85", children: event.summary })), event.metadata && event.metadata.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-3 text-xs text-muted-foreground/70", children: event.metadata.map(({ label, value }) => (_jsxs("div", { className: "flex items-center gap-1", children: [_jsxs("span", { className: "font-medium text-muted-foreground/90", children: [label, ":"] }), _jsx("span", { children: value })] }, `${event.id}-${label}`))) })), onJumpToEvent && (_jsx("button", { type: "button", onClick: () => onJumpToEvent(event), className: "self-start text-xs font-semibold text-primary transition-all hover:text-primary/80", children: "Jump to moment \u2192" }))] }), !isLast && (_jsx("span", { className: "sr-only", children: "Continues to next event" }))] }, event.id));
                        }) }) }) })] }));
};
ConversationTimeline.displayName = 'ConversationTimeline';
//# sourceMappingURL=conversation-timeline.js.map