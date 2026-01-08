'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Accessible Chat Component
 *
 * Demonstrates WCAG 2.1 AA compliant chat interface:
 * - Keyboard navigation
 * - Screen reader announcements
 * - Focus management
 * - High contrast mode
 * - Reduced motion support
 * - Large font mode
 * - ARIA labels and live regions
 */
import { useState, useRef, useEffect, useCallback, FormEvent, KeyboardEvent, } from 'react';
// ============================================================================
// Accessibility Settings Panel
// ============================================================================
function AccessibilityPanel({ settings, onSettingsChange, }) {
    return (_jsxs("div", { className: "p-4 border-b", role: "region", "aria-label": "Accessibility settings", children: [_jsx("h2", { className: "text-sm font-semibold mb-3", children: "Accessibility Options" }), _jsxs("div", { className: "flex flex-wrap gap-4", children: [_jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: settings.highContrast, onChange: (e) => onSettingsChange({ ...settings, highContrast: e.target.checked }), className: "w-4 h-4 rounded border-2 border-current focus:ring-2 focus:ring-offset-2", "aria-describedby": "high-contrast-desc" }), _jsx("span", { className: "text-sm", children: "High Contrast" }), _jsx("span", { id: "high-contrast-desc", className: "sr-only", children: "Enable high contrast mode for better visibility" })] }), _jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: settings.largeFont, onChange: (e) => onSettingsChange({ ...settings, largeFont: e.target.checked }), className: "w-4 h-4 rounded border-2 border-current focus:ring-2 focus:ring-offset-2", "aria-describedby": "large-font-desc" }), _jsx("span", { className: "text-sm", children: "Large Font" }), _jsx("span", { id: "large-font-desc", className: "sr-only", children: "Increase text size for better readability" })] }), _jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: settings.reducedMotion, onChange: (e) => onSettingsChange({ ...settings, reducedMotion: e.target.checked }), className: "w-4 h-4 rounded border-2 border-current focus:ring-2 focus:ring-offset-2", "aria-describedby": "reduced-motion-desc" }), _jsx("span", { className: "text-sm", children: "Reduced Motion" }), _jsx("span", { id: "reduced-motion-desc", className: "sr-only", children: "Disable animations for users sensitive to motion" })] }), _jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: settings.announceMessages, onChange: (e) => onSettingsChange({
                                    ...settings,
                                    announceMessages: e.target.checked,
                                }), className: "w-4 h-4 rounded border-2 border-current focus:ring-2 focus:ring-offset-2", "aria-describedby": "announce-messages-desc" }), _jsx("span", { className: "text-sm", children: "Announce Messages" }), _jsx("span", { id: "announce-messages-desc", className: "sr-only", children: "Have new messages announced by screen reader" })] })] })] }));
}
// ============================================================================
// Screen Reader Announcer
// ============================================================================
function ScreenReaderAnnouncer({ message }) {
    return (_jsx("div", { role: "status", "aria-live": "polite", "aria-atomic": "true", className: "sr-only", children: message }));
}
// ============================================================================
// Message Component
// ============================================================================
function MessageItem({ message, isLatest, }) {
    const messageRef = useRef(null);
    // Focus latest message for screen readers
    useEffect(() => {
        if (isLatest && messageRef.current) {
            messageRef.current.focus();
        }
    }, [isLatest]);
    const time = new Date(message.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });
    return (_jsx("div", { ref: messageRef, tabIndex: isLatest ? 0 : -1, role: "article", "aria-label": `${message.role === 'user' ? 'You' : 'Assistant'} said at ${time}`, className: `flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} focus:outline-none focus:ring-2 focus:ring-ring rounded-lg`, children: _jsxs("div", { className: `max-w-[80%] p-4 ${message.role === 'user'
                ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-md'
                : 'bg-muted rounded-2xl rounded-bl-md'}`, children: [_jsxs("div", { className: "sr-only", children: [message.role === 'user' ? 'You' : 'Assistant', ":"] }), _jsx("p", { className: "whitespace-pre-wrap", children: message.content }), _jsx("time", { dateTime: new Date(message.timestamp).toISOString(), className: "block text-xs opacity-60 mt-2", children: time })] }) }));
}
// ============================================================================
// Main Component
// ============================================================================
export function AccessibleChat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [announcement, setAnnouncement] = useState('');
    const [settings, setSettings] = useState({
        highContrast: false,
        largeFont: false,
        reducedMotion: false,
        announceMessages: true,
    });
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const messagesContainerRef = useRef(null);
    // Load accessibility preferences
    useEffect(() => {
        const savedSettings = localStorage.getItem('a11y-settings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
        // Check system preferences
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setSettings((s) => ({ ...s, reducedMotion: true }));
        }
    }, []);
    // Save and apply settings
    useEffect(() => {
        localStorage.setItem('a11y-settings', JSON.stringify(settings));
        // Apply to document
        document.documentElement.classList.toggle('high-contrast', settings.highContrast);
        document.documentElement.classList.toggle('large-font', settings.largeFont);
    }, [settings]);
    // Auto-scroll
    useEffect(() => {
        if (!settings.reducedMotion) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
        else {
            messagesEndRef.current?.scrollIntoView();
        }
    }, [messages, settings.reducedMotion]);
    // Announce new messages
    const announceMessage = useCallback((role, content) => {
        if (settings.announceMessages) {
            const truncated = content.length > 100 ? content.slice(0, 100) + '...' : content;
            setAnnouncement(`${role === 'assistant' ? 'Assistant' : 'You'} said: ${truncated}`);
            setTimeout(() => setAnnouncement(''), 1000);
        }
    }, [settings.announceMessages]);
    // Send message
    const sendMessage = useCallback(async (content) => {
        if (!content.trim() || isLoading)
            return;
        setError(null);
        setAnnouncement('Sending message...');
        const userMessage = {
            id: `user-${Date.now()}`,
            role: 'user',
            content,
            timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        announceMessage('user', content);
        const assistantId = `assistant-${Date.now()}`;
        const assistantMessage = {
            id: assistantId,
            role: 'assistant',
            content: '',
            timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(true);
        setAnnouncement('Assistant is typing...');
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                }),
            });
            if (!response.ok)
                throw new Error('Failed to send message');
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            if (!reader)
                throw new Error('No response body');
            let fullContent = '';
            while (true) {
                const { done, value } = await reader.read();
                if (done)
                    break;
                const chunk = decoder.decode(value);
                const lines = chunk
                    .split('\n')
                    .filter((line) => line.startsWith('data:'));
                for (const line of lines) {
                    const data = line.slice(5).trim();
                    if (data === '[DONE]')
                        continue;
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.type === 'text-delta') {
                            fullContent += parsed.content;
                            setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, content: fullContent } : m));
                        }
                        else if (parsed.type === 'error') {
                            throw new Error(parsed.message);
                        }
                    }
                    catch {
                        // Skip invalid JSON
                    }
                }
            }
            setAnnouncement('Response complete');
            announceMessage('assistant', fullContent);
        }
        catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to send message';
            setError(errorMsg);
            setAnnouncement(`Error: ${errorMsg}`);
            setMessages((prev) => prev.filter((m) => m.id !== assistantId));
        }
        finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    }, [messages, isLoading, announceMessage]);
    // Form handlers
    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(input);
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    };
    // Keyboard navigation for message list
    const handleMessagesKeyDown = (e) => {
        const container = messagesContainerRef.current;
        if (!container)
            return;
        const focusableMessages = container.querySelectorAll('[role="article"]');
        const currentIndex = Array.from(focusableMessages).findIndex((el) => el === document.activeElement);
        if (e.key === 'ArrowDown' && currentIndex < focusableMessages.length - 1) {
            e.preventDefault();
            focusableMessages[currentIndex + 1].focus();
        }
        else if (e.key === 'ArrowUp' && currentIndex > 0) {
            e.preventDefault();
            focusableMessages[currentIndex - 1].focus();
        }
        else if (e.key === 'Home') {
            e.preventDefault();
            focusableMessages[0]?.focus();
        }
        else if (e.key === 'End') {
            e.preventDefault();
            focusableMessages[focusableMessages.length - 1]?.focus();
        }
    };
    return (_jsxs("div", { className: "flex flex-col h-screen max-w-3xl mx-auto", children: [_jsx(ScreenReaderAnnouncer, { message: announcement }), _jsxs("header", { className: "p-4 border-b", role: "banner", children: [_jsx("h1", { className: "text-xl font-semibold", children: "Accessible Chat" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "WCAG 2.1 AA compliant AI chat interface" })] }), _jsx(AccessibilityPanel, { settings: settings, onSettingsChange: setSettings }), _jsxs("main", { id: "main-content", ref: messagesContainerRef, className: "flex-1 overflow-y-auto p-4 space-y-4", role: "log", "aria-label": "Chat messages", "aria-live": settings.announceMessages ? 'polite' : 'off', "aria-relevant": "additions", tabIndex: 0, onKeyDown: handleMessagesKeyDown, children: [messages.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center h-full text-center", role: "status", children: [_jsx("div", { className: "w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center", children: _jsx("svg", { className: "w-8 h-8 text-primary", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", "aria-hidden": "true", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" }) }) }), _jsx("h2", { className: "text-lg font-medium mb-2", children: "Start a Conversation" }), _jsx("p", { className: "text-sm text-muted-foreground max-w-sm", children: "Type a message in the input field below or use keyboard shortcuts to navigate." }), _jsxs("div", { className: "mt-4 p-4 bg-muted rounded-lg text-sm text-left", children: [_jsx("h3", { className: "font-medium mb-2", children: "Keyboard Shortcuts:" }), _jsxs("ul", { className: "space-y-1 text-muted-foreground", children: [_jsxs("li", { children: [_jsx("kbd", { className: "px-1 py-0.5 bg-background rounded text-xs", children: "Enter" }), ' ', "- Send message"] }), _jsxs("li", { children: [_jsx("kbd", { className: "px-1 py-0.5 bg-background rounded text-xs", children: "Shift + Enter" }), ' ', "- New line"] }), _jsxs("li", { children: [_jsx("kbd", { className: "px-1 py-0.5 bg-background rounded text-xs", children: "Arrow Up/Down" }), ' ', "- Navigate messages"] }), _jsxs("li", { children: [_jsx("kbd", { className: "px-1 py-0.5 bg-background rounded text-xs", children: "Home/End" }), ' ', "- First/Last message"] })] })] })] })) : (messages.map((message, index) => (_jsx(MessageItem, { message: message, isLatest: index === messages.length - 1 }, message.id)))), isLoading && (_jsx("div", { role: "status", "aria-label": "Assistant is typing", className: "flex justify-start", children: _jsxs("div", { className: "bg-muted rounded-2xl rounded-bl-md px-4 py-3", children: [_jsxs("span", { className: "inline-flex gap-1", "aria-hidden": "true", children: [_jsx("span", { className: `w-2 h-2 bg-current rounded-full ${settings.reducedMotion ? '' : 'animate-bounce'}` }), _jsx("span", { className: `w-2 h-2 bg-current rounded-full ${settings.reducedMotion ? '' : 'animate-bounce'}`, style: { animationDelay: '150ms' } }), _jsx("span", { className: `w-2 h-2 bg-current rounded-full ${settings.reducedMotion ? '' : 'animate-bounce'}`, style: { animationDelay: '300ms' } })] }), _jsx("span", { className: "sr-only", children: "Assistant is typing" })] }) })), _jsx("div", { ref: messagesEndRef })] }), error && (_jsxs("div", { role: "alert", className: "mx-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm", children: [_jsx("strong", { children: "Error:" }), " ", error, _jsx("button", { onClick: () => setError(null), className: "ml-2 underline focus:ring-2 focus:ring-ring rounded", "aria-label": "Dismiss error", children: "Dismiss" })] })), _jsxs("form", { onSubmit: handleSubmit, className: "p-4 border-t", role: "form", "aria-label": "Send a message", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("label", { htmlFor: "message-input", className: "sr-only", children: "Type your message" }), _jsx("textarea", { id: "message-input", ref: inputRef, value: input, onChange: (e) => setInput(e.target.value), onKeyDown: handleKeyDown, placeholder: "Type a message... (Enter to send, Shift+Enter for new line)", disabled: isLoading, rows: 1, "aria-describedby": "input-instructions", className: "flex-1 px-4 py-3 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed" }), _jsx("span", { id: "input-instructions", className: "sr-only", children: "Press Enter to send your message, or Shift+Enter to add a new line." }), _jsx("button", { type: "submit", disabled: isLoading || !input.trim(), "aria-label": isLoading ? 'Sending message...' : 'Send message', className: "px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors", children: isLoading ? (_jsxs(_Fragment, { children: [_jsx("span", { className: `inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full ${settings.reducedMotion ? '' : 'animate-spin'}`, "aria-hidden": "true" }), _jsx("span", { className: "sr-only", children: "Sending..." })] })) : ('Send') })] }), _jsxs("div", { className: "mt-2 flex items-center justify-between text-xs text-muted-foreground", children: [_jsx("span", { children: "Press Enter to send, Shift+Enter for new line" }), _jsxs("span", { "aria-live": "polite", children: [input.length, " characters"] })] })] }), messages.length > 0 && (_jsx("div", { className: "p-4 pt-0", children: _jsx("button", { onClick: () => {
                        setMessages([]);
                        setAnnouncement('Chat cleared');
                    }, className: "w-full py-2 text-sm text-muted-foreground hover:text-foreground border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ring", children: "Clear conversation" }) }))] }));
}
export default AccessibleChat;
//# sourceMappingURL=accessible-chat.js.map