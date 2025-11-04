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
import { BotIcon, SearchIcon, FileIcon, AlertCircleIcon, CheckCircleIcon, InfoIcon, } from './icons';
import { InteractiveButton } from './interactive-card';
import { createScaleVariant } from '../animations';
/**
 * Base Empty State Component
 */
export const EmptyState = React.memo(function EmptyState({ icon, title, description, action, secondaryAction, className, }) {
    const scaleVariant = createScaleVariant(0.95, 'normal', 'spring');
    return (_jsxs(motion.div, { variants: scaleVariant, initial: "initial", animate: "animate", className: cn('flex flex-col items-center justify-center text-center p-8 space-y-6', className), children: [icon && (_jsx(motion.div, { initial: { scale: 0, rotate: -180 }, animate: { scale: 1, rotate: 0 }, transition: { duration: 0.5, ease: 'easeOut', delay: 0.1 }, className: "inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 shadow-sm border border-primary/10", children: icon })), _jsxs("div", { className: "space-y-3 max-w-md", children: [_jsx("h3", { className: "text-xl font-semibold", children: title }), description && (_jsx("p", { className: "text-base text-muted-foreground leading-relaxed", children: description }))] }), (action || secondaryAction) && (_jsxs("div", { className: "flex gap-3", children: [action && (_jsx(InteractiveButton, { variant: action.variant || 'primary', onClick: action.onClick, children: action.label })), secondaryAction && (_jsx(InteractiveButton, { variant: "ghost", onClick: secondaryAction.onClick, children: secondaryAction.label }))] }))] }));
});
EmptyState.displayName = 'EmptyState';
/**
 * Empty Chat State
 */
export const EmptyChatState = React.memo(function EmptyChatState({ onStartChat, className, }) {
    return (_jsx(EmptyState, { icon: _jsx(BotIcon, { size: 32, className: "text-primary" }), title: "Start a conversation", description: "Send a message to begin chatting with the AI assistant", action: onStartChat
            ? {
                label: 'Start Chat',
                onClick: onStartChat,
                variant: 'primary',
            }
            : undefined, className: className }));
});
EmptyChatState.displayName = 'EmptyChatState';
/**
 * No Search Results State
 */
export const NoSearchResultsState = React.memo(function NoSearchResultsState({ searchQuery, onClearSearch, className, }) {
    return (_jsx(EmptyState, { icon: _jsx(SearchIcon, { size: 32, className: "text-muted-foreground" }), title: "No results found", description: searchQuery
            ? `No results for "${searchQuery}". Try different keywords.`
            : 'No results match your search criteria.', action: onClearSearch
            ? {
                label: 'Clear Search',
                onClick: onClearSearch,
            }
            : undefined, className: className }));
});
NoSearchResultsState.displayName = 'NoSearchResultsState';
/**
 * No Conversations State
 */
export const NoConversationsState = React.memo(function NoConversationsState({ onCreateConversation, className, }) {
    return (_jsx(EmptyState, { icon: _jsx(BotIcon, { size: 32, className: "text-muted-foreground" }), title: "No conversations yet", description: "Start your first conversation to see it here", action: onCreateConversation
            ? {
                label: 'New Conversation',
                onClick: onCreateConversation,
                variant: 'primary',
            }
            : undefined, className: className }));
});
NoConversationsState.displayName = 'NoConversationsState';
/**
 * No Files State
 */
export const NoFilesState = React.memo(function NoFilesState({ onUpload, className, }) {
    return (_jsx(EmptyState, { icon: _jsx(FileIcon, { size: 32, className: "text-muted-foreground" }), title: "No files uploaded", description: "Upload files to attach them to your messages", action: onUpload
            ? {
                label: 'Upload Files',
                onClick: onUpload,
                variant: 'primary',
            }
            : undefined, className: className }));
});
NoFilesState.displayName = 'NoFilesState';
/**
 * Error State
 */
export const ErrorState = React.memo(function ErrorState({ title = 'Something went wrong', description = 'An error occurred. Please try again.', onRetry, onGoBack, className, }) {
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
});
ErrorState.displayName = 'ErrorState';
/**
 * Success State
 */
export const SuccessState = React.memo(function SuccessState({ title, description, onContinue, className, }) {
    return (_jsx(EmptyState, { icon: _jsx(CheckCircleIcon, { size: 32, className: "text-success" }), title: title, description: description, action: onContinue
            ? {
                label: 'Continue',
                onClick: onContinue,
                variant: 'success',
            }
            : undefined, className: className }));
});
SuccessState.displayName = 'SuccessState';
/**
 * Info State
 */
export const InfoState = React.memo(function InfoState({ title, description, onAction, className, }) {
    return (_jsx(EmptyState, { icon: _jsx(InfoIcon, { size: 32, className: "text-info" }), title: title, description: description, action: onAction, className: className }));
});
InfoState.displayName = 'InfoState';
/**
 * Loading State (with animated icon)
 */
export const LoadingState = React.memo(function LoadingState({ title = 'Loading...', description = 'Please wait while we load your content', className, }) {
    return (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: cn('flex flex-col items-center justify-center text-center p-8 space-y-6', className), children: [_jsx(motion.div, { animate: { rotate: 360 }, transition: { duration: 1, repeat: Infinity, ease: 'linear' }, className: "w-12 h-12 border-4 border-primary border-t-transparent rounded-full" }), _jsxs("div", { className: "space-y-2 max-w-sm", children: [_jsx("h3", { className: "text-lg font-semibold", children: title }), description && (_jsx("p", { className: "text-sm text-muted-foreground", children: description }))] })] }));
});
LoadingState.displayName = 'LoadingState';
/**
 * Offline State
 */
export const OfflineState = React.memo(function OfflineState({ onRetry, className, }) {
    return (_jsx(EmptyState, { icon: _jsx(AlertCircleIcon, { size: 32, className: "text-warning" }), title: "No internet connection", description: "Please check your connection and try again", action: onRetry
            ? {
                label: 'Retry',
                onClick: onRetry,
                variant: 'primary',
            }
            : undefined, className: className }));
});
OfflineState.displayName = 'OfflineState';
//# sourceMappingURL=empty-state.js.map