'use client';
import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Chat Primitives
 *
 * Unstyled, accessible, composable building blocks for chat UIs.
 * These are headless components that handle accessibility and behavior
 * while leaving styling entirely to you.
 */
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
const ChatContext = React.createContext(null);
function useChatContext() {
    const context = React.useContext(ChatContext);
    if (!context) {
        throw new Error('Chat primitives must be used within ChatPrimitive.Root');
    }
    return context;
}
const MessageContext = React.createContext(null);
function useMessageContext() {
    const context = React.useContext(MessageContext);
    if (!context) {
        throw new Error('Message primitives must be used within ChatPrimitive.Message');
    }
    return context;
}
export const ChatRoot = React.forwardRef(({ children, messages = [], isLoading = false, onSend, asChild, className, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    return (_jsx(ChatContext.Provider, { value: { messages, isLoading, onSend }, children: _jsx(Comp, { ref: ref, className: className, role: "region", "aria-label": "Chat interface", ...props, children: children }) }));
});
ChatRoot.displayName = 'ChatPrimitive.Root';
export const ChatMessages = React.forwardRef(({ children, asChild, className, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    return (_jsx(Comp, { ref: ref, className: className, role: "log", "aria-label": "Chat messages", "aria-live": "polite", ...props, children: children }));
});
ChatMessages.displayName = 'ChatPrimitive.Messages';
export const ChatMessage = React.forwardRef(({ children, message, isStreaming = false, asChild, className, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    return (_jsx(MessageContext.Provider, { value: { message, isStreaming }, children: _jsx(Comp, { ref: ref, className: className, role: "article", "aria-label": `${message.role} message`, "data-role": message.role, "data-streaming": isStreaming, ...props, children: children }) }));
});
ChatMessage.displayName = 'ChatPrimitive.Message';
export const ChatMessageContent = React.forwardRef(({ asChild, className, children, ...props }, ref) => {
    const { message } = useMessageContext();
    const Comp = asChild ? Slot : 'div';
    const content = typeof message.content === 'string'
        ? message.content
        : Array.isArray(message.content)
            ? message.content
                .map((part) => (typeof part === 'string' ? part : ''))
                .join('')
            : '';
    return (_jsx(Comp, { ref: ref, className: className, ...props, children: children ?? content }));
});
ChatMessageContent.displayName = 'ChatPrimitive.MessageContent';
export const ChatMessageActions = React.forwardRef(({ children, asChild, className, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    return (_jsx(Comp, { ref: ref, className: className, role: "group", "aria-label": "Message actions", ...props, children: children }));
});
ChatMessageActions.displayName = 'ChatPrimitive.MessageActions';
export const ChatInput = React.forwardRef(({ onSubmit, asChild, onKeyDown, className, ...props }, ref) => {
    const { onSend } = useChatContext();
    const [value, setValue] = React.useState('');
    const handleSubmit = React.useCallback(() => {
        const trimmed = value.trim();
        if (trimmed) {
            ;
            (onSubmit ?? onSend)?.(trimmed);
            setValue('');
        }
    }, [value, onSubmit, onSend]);
    const handleKeyDown = React.useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
        onKeyDown?.(e);
    }, [handleSubmit, onKeyDown]);
    if (asChild) {
        return _jsx(Slot, { ref: ref, ...props });
    }
    return (_jsx("textarea", { ref: ref, value: value, onChange: (e) => setValue(e.target.value), onKeyDown: handleKeyDown, className: className, "aria-label": "Message input", placeholder: "Type a message...", rows: 1, ...props }));
});
ChatInput.displayName = 'ChatPrimitive.Input';
export const ChatCopyButton = React.forwardRef(({ onClick, onCopy, asChild, children, ...props }, ref) => {
    const { message } = useMessageContext();
    const Comp = asChild ? Slot : 'button';
    const handleClick = React.useCallback((e) => {
        const content = typeof message.content === 'string' ? message.content : '';
        navigator.clipboard.writeText(content);
        onCopy?.(content);
        onClick?.(e);
    }, [message.content, onCopy, onClick]);
    return (_jsx(Comp, { ref: ref, type: "button", onClick: handleClick, "aria-label": "Copy message", ...props, children: children ?? 'Copy' }));
});
ChatCopyButton.displayName = 'ChatPrimitive.CopyButton';
export const ChatRegenerateButton = React.forwardRef(({ onClick, onRegenerate, asChild, children, ...props }, ref) => {
    const { message } = useMessageContext();
    const Comp = asChild ? Slot : 'button';
    const handleClick = React.useCallback((e) => {
        if (message.id) {
            onRegenerate?.(message.id);
        }
        onClick?.(e);
    }, [message.id, onRegenerate, onClick]);
    return (_jsx(Comp, { ref: ref, type: "button", onClick: handleClick, "aria-label": "Regenerate message", ...props, children: children ?? 'Regenerate' }));
});
ChatRegenerateButton.displayName = 'ChatPrimitive.RegenerateButton';
export const ChatDeleteButton = React.forwardRef(({ onClick, onDelete, asChild, children, ...props }, ref) => {
    const { message } = useMessageContext();
    const Comp = asChild ? Slot : 'button';
    const handleClick = React.useCallback((e) => {
        if (message.id) {
            onDelete?.(message.id);
        }
        onClick?.(e);
    }, [message.id, onDelete, onClick]);
    return (_jsx(Comp, { ref: ref, type: "button", onClick: handleClick, "aria-label": "Delete message", ...props, children: children ?? 'Delete' }));
});
ChatDeleteButton.displayName = 'ChatPrimitive.DeleteButton';
export const ChatEmptyState = React.forwardRef(({ children, asChild, className, ...props }, ref) => {
    const { messages } = useChatContext();
    const Comp = asChild ? Slot : 'div';
    if (messages.length > 0) {
        return null;
    }
    return (_jsx(Comp, { ref: ref, className: className, role: "status", "aria-label": "No messages yet", ...props, children: children }));
});
ChatEmptyState.displayName = 'ChatPrimitive.EmptyState';
export const ChatLoadingIndicator = React.forwardRef(({ children, asChild, className, ...props }, ref) => {
    const { isLoading } = useChatContext();
    const Comp = asChild ? Slot : 'div';
    if (!isLoading) {
        return null;
    }
    return (_jsx(Comp, { ref: ref, className: className, role: "status", "aria-label": "Loading", "aria-live": "polite", ...props, children: children }));
});
ChatLoadingIndicator.displayName = 'ChatPrimitive.LoadingIndicator';
//# sourceMappingURL=chat-primitives.js.map