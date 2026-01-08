import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Empty State Components
 *
 * Comprehensive empty state components for various scenarios:
 * - No data
 * - No search results
 * - No conversations
 * - Error states
 * - Success states
 */
import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@clarity-chat/primitives';
import { BotIcon, SearchIcon, FileIcon, AlertCircleIcon, CheckCircleIcon, InfoIcon, SparklesIcon, CodeIcon, MessageSquareIcon, LightbulbIcon, } from './icons';
import { InteractiveButton } from './interactive-card';
import { PromptSuggestions, } from '../prompt/prompt-suggestions';
import { useReducedMotion } from '@clarity-chat/primitives';
import { getMotionSafeDuration, getMotionSafeValue, } from '../../animations/motion-safe';
import { getSpring } from '../../animations/spring-presets';
import { DURATION_SECONDS as durations } from '../../animations/constants';
/**
 * Base Empty State Component
 *
 * @enhanced Framer Motion 12: Spring physics for organic entrance
 * - Smooth spring for container
 * - Smooth spring with rotation for icon
 * - Gentle spring for content
 * - Respects prefers-reduced-motion
 */
export function EmptyState({ icon, title, description, action, secondaryAction, className, }) {
    const prefersReducedMotion = useReducedMotion();
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 20, scale: 0.96 }, animate: { opacity: 1, y: 0, scale: 1 }, transition: getSpring('smooth', prefersReducedMotion), className: cn('flex flex-col items-center justify-center text-center px-6 py-12 space-y-8', className), children: [icon && (_jsx(motion.div, { initial: { scale: 0, rotate: -90 }, animate: { scale: 1, rotate: 0 }, transition: getSpring('smooth', prefersReducedMotion, { delay: 0.1 }), className: "inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/15 to-primary/5 shadow-lg ring-1 ring-primary/25", children: icon })), _jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: getSpring('gentle', prefersReducedMotion, { delay: 0.25 }), className: "space-y-3.5 max-w-lg", children: [_jsx("h3", { className: "text-2xl font-bold text-foreground leading-tight", children: title }), description && (_jsx("p", { className: "text-sm text-muted-foreground/90 leading-relaxed", children: description }))] }), (action || secondaryAction) && (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: getSpring('quick', prefersReducedMotion, { delay: 0.35 }), className: "flex flex-wrap gap-3 justify-center", children: [action && (_jsx(InteractiveButton, { variant: action.variant || 'primary', onClick: action.onClick, children: action.label })), secondaryAction && (_jsx(InteractiveButton, { variant: "ghost", onClick: secondaryAction.onClick, children: secondaryAction.label }))] }))] }));
}
EmptyState.displayName = 'EmptyState';
/**
 * Default starter prompts for empty chat state
 */
const DEFAULT_STARTER_PROMPTS = [
    {
        id: 'starter-help',
        text: 'Help me write code',
        label: 'Write Code',
        icon: _jsx(CodeIcon, { size: 16 }),
        description: 'Get help with coding tasks and debugging',
        type: 'starter',
        category: 'Development',
    },
    {
        id: 'starter-explain',
        text: 'Explain a concept to me',
        label: 'Explain Concept',
        icon: _jsx(LightbulbIcon, { size: 16 }),
        description: 'Learn about complex topics in simple terms',
        type: 'starter',
        category: 'Learning',
    },
    {
        id: 'starter-brainstorm',
        text: 'Help me brainstorm ideas',
        label: 'Brainstorm',
        icon: _jsx(SparklesIcon, { size: 16 }),
        description: 'Generate creative ideas and solutions',
        type: 'starter',
        category: 'Creativity',
    },
    {
        id: 'starter-chat',
        text: 'Just chat and answer questions',
        label: 'Chat',
        icon: _jsx(MessageSquareIcon, { size: 16 }),
        description: 'Have a conversation and get answers',
        type: 'starter',
        category: 'General',
    },
];
/**
 * Empty Chat State with Suggested Prompts
 */
export function EmptyChatState({ onStartChat, onSuggestionSelect, suggestions = DEFAULT_STARTER_PROMPTS, showSuggestions = true, className, }) {
    const prefersReducedMotion = useReducedMotion();
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 20, scale: 0.96 }, animate: { opacity: 1, y: 0, scale: 1 }, transition: {
            duration: getMotionSafeDuration(prefersReducedMotion, 0.5),
            ease: [0.25, 0.1, 0.25, 1],
        }, className: cn('flex flex-col items-center justify-center text-center px-6 py-12 space-y-8 max-w-3xl mx-auto', className), children: [_jsx(motion.div, { initial: { scale: 0, rotate: -90 }, animate: {
                    scale: 1,
                    rotate: 0,
                }, transition: {
                    duration: getMotionSafeDuration(prefersReducedMotion, 0.6),
                    ease: [0.25, 0.1, 0.25, 1],
                    delay: getMotionSafeDuration(prefersReducedMotion, 0.1),
                    type: 'spring',
                    stiffness: 280,
                    damping: 22,
                }, className: "inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/15 to-primary/5 shadow-lg ring-1 ring-primary/25", children: _jsx(BotIcon, { size: 40, className: "text-primary" }) }), _jsxs(motion.div, { initial: {
                    opacity: 0,
                    y: getMotionSafeValue(prefersReducedMotion, 10, 0),
                }, animate: { opacity: 1, y: 0 }, transition: {
                    duration: getMotionSafeDuration(prefersReducedMotion, 0.4),
                    ease: [0.25, 0.1, 0.25, 1],
                    delay: getMotionSafeDuration(prefersReducedMotion, 0.25),
                }, className: "space-y-3.5", children: [_jsx("h3", { className: "text-2xl font-bold text-foreground leading-tight", children: "Start a conversation" }), _jsx("p", { className: "text-sm text-muted-foreground/90 leading-relaxed max-w-md", children: showSuggestions
                            ? 'Choose a suggestion below or type your own message to begin chatting with the AI assistant.'
                            : "Send a message to begin chatting with the AI assistant. I'm here to help with your questions and tasks." })] }), showSuggestions && suggestions.length > 0 && (_jsx(motion.div, { initial: {
                    opacity: 0,
                    y: getMotionSafeValue(prefersReducedMotion, 10, 0),
                }, animate: { opacity: 1, y: 0 }, transition: {
                    duration: getMotionSafeDuration(prefersReducedMotion, 0.4),
                    ease: [0.25, 0.1, 0.25, 1],
                    delay: getMotionSafeDuration(prefersReducedMotion, 0.35),
                }, className: "w-full", children: _jsx(PromptSuggestions, { suggestions: suggestions, onSelect: onSuggestionSelect || (() => { }), suggestionType: "starter", layout: "cards", maxSuggestions: 6 }) })), onStartChat && !showSuggestions && (_jsx(motion.div, { initial: {
                    opacity: 0,
                    y: getMotionSafeValue(prefersReducedMotion, 10, 0),
                }, animate: { opacity: 1, y: 0 }, transition: {
                    duration: getMotionSafeDuration(prefersReducedMotion, 0.4),
                    ease: [0.25, 0.1, 0.25, 1],
                    delay: getMotionSafeDuration(prefersReducedMotion, 0.35),
                }, children: _jsx(InteractiveButton, { variant: "primary", onClick: onStartChat, children: "Start Chat" }) }))] }));
}
EmptyChatState.displayName = 'EmptyChatState';
/**
 * No Search Results State
 */
export function NoSearchResultsState({ searchQuery, onClearSearch, className, }) {
    return (_jsx(EmptyState, { icon: _jsx(SearchIcon, { size: 32, className: "text-muted-foreground" }), title: "No results found", description: searchQuery
            ? `No results for "${searchQuery}". Try different keywords.`
            : 'No results match your search criteria.', action: onClearSearch
            ? {
                label: 'Clear Search',
                onClick: onClearSearch,
            }
            : undefined, className: className }));
}
NoSearchResultsState.displayName = 'NoSearchResultsState';
/**
 * No Conversations State
 */
export function NoConversationsState({ onCreateConversation, className, }) {
    return (_jsx(EmptyState, { icon: _jsx(BotIcon, { size: 32, className: "text-muted-foreground" }), title: "No conversations yet", description: "Start your first conversation to see it here", action: onCreateConversation
            ? {
                label: 'New Conversation',
                onClick: onCreateConversation,
                variant: 'primary',
            }
            : undefined, className: className }));
}
NoConversationsState.displayName = 'NoConversationsState';
/**
 * No Files State
 */
export function NoFilesState({ onUpload, className, }) {
    return (_jsx(EmptyState, { icon: _jsx(FileIcon, { size: 32, className: "text-muted-foreground" }), title: "No files uploaded", description: "Upload files to attach them to your messages", action: onUpload
            ? {
                label: 'Upload Files',
                onClick: onUpload,
                variant: 'primary',
            }
            : undefined, className: className }));
}
NoFilesState.displayName = 'NoFilesState';
/**
 * Error State
 */
export function ErrorState({ title = 'Something went wrong', description = 'An error occurred. Please try again.', onRetry, onGoBack, className, }) {
    return (_jsx(EmptyState, { icon: _jsx(AlertCircleIcon, { size: 32, className: "text-destructive" }), title: title, description: description, action: onRetry
            ? {
                label: 'Try Again',
                onClick: onRetry,
                variant: 'destructive',
            }
            : undefined, secondaryAction: onGoBack
            ? {
                label: 'Go Back',
                onClick: onGoBack,
            }
            : undefined, className: className }));
}
ErrorState.displayName = 'ErrorState';
/**
 * Success State
 */
export function SuccessState({ title, description, onContinue, className, }) {
    return (_jsx(EmptyState, { icon: _jsx(CheckCircleIcon, { size: 32, className: "text-success" }), title: title, description: description, action: onContinue
            ? {
                label: 'Continue',
                onClick: onContinue,
                variant: 'success',
            }
            : undefined, className: className }));
}
SuccessState.displayName = 'SuccessState';
/**
 * Info State
 */
export function InfoState({ title, description, onAction, className, }) {
    return (_jsx(EmptyState, { icon: _jsx(InfoIcon, { size: 32, className: "text-info" }), title: title, description: description, action: onAction, className: className }));
}
InfoState.displayName = 'InfoState';
/**
 * Loading State (with animated icon)
 *
 * @enhanced Framer Motion 12: Spring entrance with continuous rotation
 */
export function LoadingState({ title = 'Loading...', description = 'Please wait while we load your content', className, }) {
    const prefersReducedMotion = useReducedMotion();
    return (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, transition: getSpring('quick', prefersReducedMotion), className: cn('flex flex-col items-center justify-center text-center p-8 space-y-6', className), children: [_jsx(motion.div, { animate: { rotate: prefersReducedMotion ? 0 : 360 }, transition: {
                    duration: durations.slower,
                    repeat: prefersReducedMotion ? 0 : Infinity,
                    ease: 'linear',
                }, className: "w-12 h-12 border-4 border-primary/60 border-t-primary rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)]" }), _jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: getSpring('quick', prefersReducedMotion, { delay: 0.1 }), className: "space-y-2 max-w-sm", children: [_jsx("h3", { className: "text-lg font-semibold text-foreground", children: title }), description && (_jsx("p", { className: "text-sm text-muted-foreground/80 leading-relaxed", children: description }))] })] }));
}
LoadingState.displayName = 'LoadingState';
/**
 * Offline State
 */
export function OfflineState({ onRetry, className, }) {
    return (_jsx(EmptyState, { icon: _jsx(AlertCircleIcon, { size: 32, className: "text-warning" }), title: "No internet connection", description: "Please check your connection and try again", action: onRetry
            ? {
                label: 'Retry',
                onClick: onRetry,
                variant: 'primary',
            }
            : undefined, className: className }));
}
OfflineState.displayName = 'OfflineState';
//# sourceMappingURL=empty-state.js.map