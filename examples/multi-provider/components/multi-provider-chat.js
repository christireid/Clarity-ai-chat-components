'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Multi-Provider Chat Component
 *
 * Demonstrates switching between AI providers:
 * - OpenAI (GPT-4, GPT-3.5)
 * - Anthropic (Claude 3)
 * - Google (Gemini)
 *
 * Features:
 * - Provider selector with availability status
 * - Model selector per provider
 * - Cost estimation
 * - Context window visualization
 */
import { useState, useRef, useEffect, useCallback, FormEvent } from 'react';
import { PROVIDERS, MODELS, getModelsByProvider, getModelById, } from '@/lib/providers';
// ============================================================================
// Provider Selector Component
// ============================================================================
function ProviderSelector({ selected, onSelect, available, }) {
    return (_jsx("div", { className: "flex gap-2", children: Object.keys(PROVIDERS).map((provider) => {
            const info = PROVIDERS[provider];
            const isAvailable = available[provider];
            const isSelected = selected === provider;
            return (_jsxs("button", { onClick: () => isAvailable && onSelect(provider), disabled: !isAvailable, className: `
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
              transition-all duration-200
              ${isSelected
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : isAvailable
                        ? 'bg-muted hover:bg-muted/80'
                        : 'bg-muted/50 text-muted-foreground cursor-not-allowed opacity-50'}
            `, title: !isAvailable ? 'API key not configured' : info.description, children: [_jsx("span", { children: info.icon }), _jsx("span", { children: info.name }), !isAvailable && (_jsx("span", { className: "text-xs bg-destructive/20 text-destructive px-1.5 py-0.5 rounded", children: "No key" }))] }, provider));
        }) }));
}
// ============================================================================
// Model Selector Component
// ============================================================================
function ModelSelector({ provider, selected, onSelect, }) {
    const models = getModelsByProvider(provider);
    return (_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium text-muted-foreground", children: "Model" }), _jsx("div", { className: "grid gap-2", children: models.map((model) => (_jsxs("button", { onClick: () => onSelect(model.id), className: `
              text-left p-3 rounded-lg border transition-all
              ${selected === model.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'}
            `, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "font-medium", children: model.name }), _jsxs("span", { className: "text-xs text-muted-foreground", children: ["$", model.costPer1kInput, "/1K in"] })] }), _jsx("p", { className: "text-xs text-muted-foreground mt-1", children: model.description }), _jsxs("div", { className: "flex gap-3 mt-2 text-xs", children: [_jsxs("span", { className: "text-muted-foreground", children: ["Context: ", (model.contextWindow / 1000).toFixed(0), "K"] }), _jsxs("span", { className: "text-muted-foreground", children: ["Max out: ", (model.maxOutput / 1000).toFixed(0), "K"] })] })] }, model.id))) })] }));
}
// ============================================================================
// Main Component
// ============================================================================
export function MultiProviderChat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [provider, setProvider] = useState('openai');
    const [modelId, setModelId] = useState('gpt-4-turbo-preview');
    const [available, setAvailable] = useState({
        openai: false,
        anthropic: false,
        google: false,
    });
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    // Check available providers on mount
    useEffect(() => {
        fetch('/api/chat')
            .then((res) => res.json())
            .then((data) => {
            setAvailable(data.available);
            // Auto-select first available provider
            const firstAvailable = Object.keys(data.available).find((p) => data.available[p]);
            if (firstAvailable) {
                setProvider(firstAvailable);
                setModelId(getModelsByProvider(firstAvailable)[0].id);
            }
        })
            .catch(console.error);
    }, []);
    // Update model when provider changes
    useEffect(() => {
        const models = getModelsByProvider(provider);
        if (models.length > 0 && !models.find((m) => m.id === modelId)) {
            setModelId(models[0].id);
        }
    }, [provider, modelId]);
    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    // Send message
    const sendMessage = useCallback(async (content) => {
        if (!content.trim() || isLoading)
            return;
        setError(null);
        // Add user message
        const userMessage = {
            id: `user-${Date.now()}`,
            role: 'user',
            content,
        };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        // Create assistant placeholder
        const assistantId = `assistant-${Date.now()}`;
        const assistantMessage = {
            id: assistantId,
            role: 'assistant',
            content: '',
            provider,
            model: modelId,
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(true);
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                    provider,
                    model: modelId,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to send message');
            }
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
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send message');
            setMessages((prev) => prev.filter((m) => m.id !== assistantId));
        }
        finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    }, [messages, isLoading, provider, modelId]);
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
    const currentModel = getModelById(modelId);
    return (_jsxs("div", { className: "flex h-screen", children: [_jsxs("aside", { className: "w-80 border-r p-4 space-y-6 overflow-y-auto", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-semibold", children: "Multi-Provider Chat" }), _jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Switch between AI providers" })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium text-muted-foreground mb-2 block", children: "Provider" }), _jsx(ProviderSelector, { selected: provider, onSelect: setProvider, available: available })] }), _jsx(ModelSelector, { provider: provider, selected: modelId, onSelect: setModelId }), currentModel && (_jsxs("div", { className: "p-3 bg-muted/50 rounded-lg text-xs space-y-2", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Input cost" }), _jsxs("span", { children: ["$", currentModel.costPer1kInput, "/1K tokens"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Output cost" }), _jsxs("span", { children: ["$", currentModel.costPer1kOutput, "/1K tokens"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Context" }), _jsxs("span", { children: [(currentModel.contextWindow / 1000).toFixed(0), "K tokens"] })] })] }))] }), messages.length > 0 && (_jsx("button", { onClick: () => setMessages([]), className: "w-full text-sm text-muted-foreground hover:text-foreground py-2 border rounded-lg transition-colors", children: "Clear conversation" }))] }), _jsxs("div", { className: "flex-1 flex flex-col", children: [_jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", role: "log", "aria-label": "Chat messages", children: [messages.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center h-full text-center", children: [_jsx("div", { className: "text-4xl mb-4", children: PROVIDERS[provider].icon }), _jsxs("h2", { className: "text-lg font-medium", children: ["Chat with ", PROVIDERS[provider].name] }), _jsx("p", { className: "text-sm text-muted-foreground max-w-sm mt-1", children: currentModel?.description || 'Select a model to get started' })] })) : (messages.map((message) => {
                                const msgProvider = message.provider
                                    ? PROVIDERS[message.provider]
                                    : null;
                                return (_jsx("div", { className: `flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`, children: _jsxs("div", { className: `max-w-[70%] ${message.role === 'user'
                                            ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-3'
                                            : 'space-y-1'}`, children: [message.role === 'assistant' && msgProvider && (_jsxs("div", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [_jsx("span", { children: msgProvider.icon }), _jsx("span", { children: msgProvider.name }), message.model && (_jsxs(_Fragment, { children: [_jsx("span", { children: "\u00B7" }), _jsx("span", { children: getModelById(message.model)?.name })] }))] })), message.role === 'assistant' ? (_jsxs("div", { className: "bg-muted rounded-2xl rounded-bl-md px-4 py-3", children: [_jsx("p", { className: "whitespace-pre-wrap", children: message.content }), isLoading && message.content === '' && (_jsxs("span", { className: "inline-flex gap-1", children: [_jsx("span", { className: "w-2 h-2 bg-current rounded-full animate-bounce", style: { animationDelay: '0ms' } }), _jsx("span", { className: "w-2 h-2 bg-current rounded-full animate-bounce", style: { animationDelay: '150ms' } }), _jsx("span", { className: "w-2 h-2 bg-current rounded-full animate-bounce", style: { animationDelay: '300ms' } })] })), isLoading && message.content !== '' && (_jsx("span", { className: "inline-block w-2 h-4 ml-1 bg-current animate-blink" }))] })) : (_jsx("p", { className: "whitespace-pre-wrap", children: message.content }))] }) }, message.id));
                            })), _jsx("div", { ref: messagesEndRef })] }), error && (_jsx("div", { className: "mx-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm", children: error })), _jsx("form", { onSubmit: handleSubmit, className: "p-4 border-t", children: _jsxs("div", { className: "flex gap-2", children: [_jsx("textarea", { ref: inputRef, value: input, onChange: (e) => setInput(e.target.value), onKeyDown: handleKeyDown, placeholder: `Message ${PROVIDERS[provider].name}...`, disabled: isLoading || !available[provider], rows: 1, className: "flex-1 px-4 py-3 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50" }), _jsx("button", { type: "submit", disabled: isLoading || !input.trim() || !available[provider], className: "px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed transition-colors", children: isLoading ? (_jsxs("svg", { className: "w-5 h-5 animate-spin", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4", fill: "none" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] })) : ('Send') })] }) })] })] }));
}
export default MultiProviderChat;
//# sourceMappingURL=multi-provider-chat.js.map