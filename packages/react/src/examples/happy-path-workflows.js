import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Happy Path Workflows - Real-World Usage Examples
 *
 * These examples demonstrate the primary workflows that real users
 * of this library care about, using the layered architecture.
 */
import * as React from 'react';
import '@clarity-chat/react/styles.css';
// ============================================================================
// SAFE MATH EXPRESSION EVALUATOR
// ============================================================================
/**
 * Safe math expression evaluator using a recursive descent parser.
 * Only supports: numbers (including decimals/negatives), +, -, *, /, parentheses
 * Does NOT use eval() or Function() - completely safe from code injection.
 */
function safeEvaluateMath(expression) {
    // Guard against DoS via extremely long expressions
    if (expression.length > 1000) {
        throw new Error('Expression too long (max 1000 characters)');
    }
    const tokens = tokenizeMath(expression);
    const result = parseMathExpression(tokens);
    return result.value;
}
const MAX_DEPTH = 100; // Prevent stack overflow from deeply nested expressions
function tokenizeMath(expr) {
    const tokens = [];
    let i = 0;
    while (i < expr.length) {
        const char = expr.charAt(i);
        // Skip whitespace
        if (/\s/.test(char)) {
            i++;
            continue;
        }
        // Number (including decimals)
        if (/\d/.test(char) || (char === '.' && i + 1 < expr.length && /\d/.test(expr.charAt(i + 1)))) {
            let num = '';
            let hasDecimal = false;
            while (i < expr.length) {
                const c = expr.charAt(i);
                if (!/\d/.test(c) && c !== '.')
                    break;
                if (c === '.') {
                    if (hasDecimal) {
                        throw new Error('Invalid number: multiple decimal points');
                    }
                    hasDecimal = true;
                }
                num += c;
                i++;
            }
            tokens.push(num);
            continue;
        }
        // Operators and parentheses
        if (/[+\-*/()]/.test(char)) {
            tokens.push(char);
            i++;
            continue;
        }
        throw new Error(`Invalid character in expression: "${char}"`);
    }
    return tokens;
}
function parseMathExpression(tokens) {
    let state = { tokens, pos: 0, value: 0, depth: 0 };
    state = parseAddSubtract(state);
    if (state.pos < tokens.length) {
        throw new Error(`Unexpected token: "${tokens[state.pos]}"`);
    }
    if (!isFinite(state.value)) {
        throw new Error('Result is not a finite number');
    }
    return state;
}
function parseAddSubtract(state) {
    state = parseMultiplyDivide(state);
    while (state.pos < state.tokens.length) {
        const op = state.tokens[state.pos];
        if (op !== '+' && op !== '-')
            break;
        state.pos++;
        const right = parseMultiplyDivide(state);
        state.pos = right.pos;
        state.value = op === '+' ? state.value + right.value : state.value - right.value;
    }
    return state;
}
function parseMultiplyDivide(state) {
    state = parseUnary(state);
    while (state.pos < state.tokens.length) {
        const op = state.tokens[state.pos];
        if (op !== '*' && op !== '/')
            break;
        state.pos++;
        const right = parseUnary(state);
        state.pos = right.pos;
        if (op === '/') {
            if (right.value === 0) {
                throw new Error('Division by zero');
            }
            state.value = state.value / right.value;
        }
        else {
            state.value = state.value * right.value;
        }
    }
    return state;
}
function parseUnary(state) {
    // Check depth to prevent stack overflow
    if (state.depth >= MAX_DEPTH) {
        throw new Error('Expression too deeply nested (max 100 levels)');
    }
    const token = state.tokens[state.pos];
    const newState = { ...state, depth: state.depth + 1 };
    // Handle unary minus
    if (token === '-') {
        newState.pos++;
        const result = parseUnary(newState);
        return { ...result, value: -result.value };
    }
    // Handle unary plus (just skip it)
    if (token === '+') {
        newState.pos++;
        return parseUnary(newState);
    }
    return parsePrimary(newState);
}
function parsePrimary(state) {
    const token = state.tokens[state.pos];
    if (token === undefined) {
        throw new Error('Unexpected end of expression');
    }
    // Parenthesized expression
    if (token === '(') {
        state.pos++; // consume '('
        state = parseAddSubtract(state);
        if (state.tokens[state.pos] !== ')') {
            throw new Error('Missing closing parenthesis');
        }
        state.pos++; // consume ')'
        return state;
    }
    // Number
    const num = parseFloat(token);
    if (isNaN(num)) {
        throw new Error(`Invalid number: "${token}"`);
    }
    state.pos++;
    return { ...state, value: num };
}
// ============================================================================
// WORKFLOW 1: Simple Chat UI (3 lines)
// ============================================================================
/**
 * Goal: Add a production-ready chat interface in 3 lines
 * APIs Used: ClarityChat (Top-level)
 * Lines of Code: 3
 * Why Enterprise-Grade: Includes error handling, loading states, accessibility,
 * responsive design, streaming support, and more out of the box.
 */
export function SimpleChatWorkflow() {
    return _jsx(ClarityChat, { api: "/api/chat" });
}
// ============================================================================
// WORKFLOW 2: Chat with Memory (5-10 lines)
// ============================================================================
/**
 * Goal: Add context-aware chat with memory management
 * APIs Used: ClarityChatPresets.WithMemory (Top-level)
 * Lines of Code: 5-10
 * Why Enterprise-Grade: Includes memory management, context window optimization,
 * semantic search, and vector store integration.
 */
export function ChatWithMemoryWorkflow() {
    return (_jsx(ClarityChatPresets.WithMemory, { api: "/api/chat", memoryStrategy: "vector-store" }));
}
// Alternative: Using hook + provider for more control
export function ChatWithMemoryWorkflowAdvanced() {
    const { MemoryProvider } = require('@clarity-chat/react');
    const { ClarityChat } = require('@clarity-chat/react');
    return (_jsx(MemoryProvider, { config: { maxTokens: 10000 }, children: _jsx(ClarityChat, { api: "/api/chat", memory: {
                enabled: true,
                strategy: 'vector-store',
                maxTokens: 10000,
            } }) }));
}
// ============================================================================
// WORKFLOW 3: Custom Chat with Tools (20-30 lines)
// ============================================================================
/**
 * Goal: Build a custom chat interface with tool calling
 * APIs Used: useClarityChat (Top-level), useChatHandlers (Mid-level),
 * ChatWindow (Mid-level), useClarityChatWithTools (Mid-level)
 * Lines of Code: 20-30
 * Why Enterprise-Grade: Full control over UI, tool integration, error handling,
 * and extensibility while maintaining type safety.
 */
export function CustomChatWithToolsWorkflow() {
    const { useClarityChat, useChatHandlers, ChatWindow, useClarityChatWithTools } = require('@clarity-chat/react');
    // Define tools
    const searchTool = {
        name: 'web_search',
        description: 'Search the web for information',
        parameters: {
            type: 'object',
            properties: {
                query: { type: 'string', description: 'Search query' },
            },
            required: ['query'],
        },
        execute: async (args) => {
            const response = await fetch(`/api/search?q=${encodeURIComponent(args.query)}`);
            return await response.json();
        },
    };
    const calculatorTool = {
        name: 'calculator',
        description: 'Perform mathematical calculations (supports +, -, *, /, parentheses)',
        parameters: {
            type: 'object',
            properties: {
                expression: { type: 'string', description: 'Mathematical expression (e.g., "2 + 3 * 4")' },
            },
            required: ['expression'],
        },
        execute: async (args) => {
            // Using safe math evaluator - no eval() or code injection risk
            try {
                const result = safeEvaluateMath(args.expression);
                return { result };
            }
            catch (error) {
                return { error: error instanceof Error ? error.message : 'Invalid expression' };
            }
        },
    };
    // Top-level hook for chat state
    const chat = useClarityChat({
        api: '/api/chat',
    });
    // Mid-level hook for handlers
    const handlers = useChatHandlers({
        chat,
        onMessageSent: (content) => {
            logger.debug('Message sent:', content);
        },
        onMessageError: (error) => {
            logger.logger.error('Failed to send message:', error);
        },
    });
    // Mid-level hook for tool integration
    const tools = useClarityChatWithTools({
        tools: [searchTool, calculatorTool],
    });
    // Mid-level component for UI
    return (_jsx(ChatWindow, { messages: chat.messages, isLoading: chat.isLoading, onSendMessage: handlers.onSendMessage, onClear: handlers.onClear, onMessageRetry: handlers.onRetry }));
}
// ============================================================================
// WORKFLOW 4: Enterprise Application (15-25 lines)
// ============================================================================
/**
 * Goal: Full-featured enterprise chat with analytics, quotas, and RBAC
 * APIs Used: ClarityChatPresets.Enterprise (Top-level), AnalyticsProvider,
 * QuotaProvider, RBACProvider (Top-level)
 * Lines of Code: 15-25
 * Why Enterprise-Grade: Complete observability, usage tracking, access control,
 * and audit logging built-in.
 */
export function EnterpriseApplicationWorkflow() {
    const { ClarityChatPresets, AnalyticsProvider, QuotaProvider, RBACProvider, } = require('@clarity-chat/react');
    const analyticsConfig = {
        provider: 'console', // or 'google-analytics', 'mixpanel', etc.
        enabled: true,
    };
    const quotaConfig = {
        limits: {
            messagesPerDay: 1000,
            tokensPerMonth: 1000000,
        },
    };
    const rbacConfig = {
        roles: ['user', 'admin'],
        permissions: {
            user: ['chat:send', 'chat:view'],
            admin: ['chat:*', 'admin:*'],
        },
    };
    return (_jsx(AnalyticsProvider, { config: analyticsConfig, children: _jsx(QuotaProvider, { config: quotaConfig, children: _jsx(RBACProvider, { config: rbacConfig, children: _jsx(ClarityChatPresets.Enterprise, { api: "/api/chat", sessionTitle: "Enterprise Assistant", showHeader: true }) }) }) }));
}
export function StructuredOutputWorkflow() {
    const { useClarityObject } = require('@clarity-chat/react');
    const { data, isLoading, error, generate } = useClarityObject({
        api: '/api/chat',
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                email: { type: 'string', format: 'email' },
                age: { type: 'number' },
                interests: {
                    type: 'array',
                    items: { type: 'string' },
                },
            },
            required: ['name', 'email', 'age'],
        },
    });
    const handleGenerate = async () => {
        await generate({
            prompt: 'Create a user profile for a software engineer interested in AI',
        });
    };
    return (_jsxs("div", { children: [_jsx("button", { onClick: handleGenerate, disabled: isLoading, children: "Generate Profile" }), isLoading && _jsx("p", { children: "Generating..." }), error && _jsxs("p", { children: ["Error: ", error.message] }), data && (_jsxs("div", { children: [_jsx("h3", { children: data.name }), _jsx("p", { children: data.email }), _jsxs("p", { children: ["Age: ", data.age] }), _jsxs("p", { children: ["Interests: ", data.interests.join(', ')] })] }))] }));
}
// ============================================================================
// WORKFLOW 6: Custom Composition (30-50 lines)
// ============================================================================
/**
 * Goal: Build a completely custom chat experience using mid-level APIs
 * APIs Used: useChatEnhanced (Mid-level), ChatWindow (Mid-level),
 * useMemoryContext (Mid-level), various low-level utilities
 * Lines of Code: 30-50
 * Why Enterprise-Grade: Full control while leveraging battle-tested components
 * and hooks, maintaining type safety and best practices.
 */
export function CustomCompositionWorkflow() {
    const { useChatEnhanced, ChatWindow, useMemoryContext, createUserMessage, normalizeMessages, } = require('@clarity-chat/react');
    // Mid-level hook for chat state (Vercel-compatible)
    const chat = useChatEnhanced({
        api: '/api/chat',
        initialMessages: [
            createUserMessage('Hello!'),
        ],
    });
    // Mid-level hook for memory
    const memory = useMemoryContext();
    // Custom logic using low-level utilities
    const normalizedMessages = React.useMemo(() => normalizeMessages(chat.messages), [chat.messages]);
    const handleSend = async (content) => {
        // Add to memory before sending
        if (memory?.addMemory) {
            await memory.addMemory(content, 'conversation', 'session', { timestamp: Date.now() });
        }
        // Send message
        await chat.append(createUserMessage(content));
    };
    return (_jsxs("div", { className: "custom-chat-container", children: [_jsx(ChatWindow, { messages: normalizedMessages, isLoading: chat.isLoading, onSendMessage: handleSend, showHeader: true, sessionTitle: "Custom Chat" }), memory && (_jsx("div", { className: "memory-info", children: _jsxs("p", { children: ["Memory: ", memory.stats?.totalItems || 0, " items"] }) }))] }));
}
// Component imports (used as values)
import { ClarityChat } from '../components/clarity-chat';
import { ClarityChatPresets } from '../components/clarity-chat-presets';
//# sourceMappingURL=happy-path-workflows.js.map