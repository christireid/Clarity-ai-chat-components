import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Configuration Builder Example
 *
 * Demonstrates the builder pattern for configuring Clarity Chat.
 * Shows how to create type-safe configurations with the ChatConfigBuilder.
 */
import * as React from 'react';
import { createChatConfig, getDefaultChatConfig } from '@clarity-chat/react';
export function ConfigBuilderExample() {
    const [config, setConfig] = React.useState(getDefaultChatConfig());
    // Example 1: Basic configuration
    const basicConfig = React.useMemo(() => createChatConfig()
        .withStreaming({
        provider: 'openai',
        endpoint: '/api/chat',
        retryPolicy: 'exponential',
    })
        .build(), []);
    // Example 2: Full configuration
    const fullConfig = React.useMemo(() => createChatConfig()
        .withStreaming({
        provider: 'openai',
        endpoint: '/api/chat/stream',
        retryPolicy: 'exponential',
        maxRetries: 5,
        initialDelay: 1000,
        maxDelay: 30000,
    })
        .withAccessibility({
        screenReader: true,
        highContrast: false,
        keyboardShortcuts: true,
        focusManagement: true,
        ariaLabels: true,
    })
        .withPersistence({
        storage: 'indexeddb',
        maxHistory: 1000,
        autoSave: true,
        saveInterval: 5000,
        encryption: false,
    })
        .withMarkdown({
        enableKaTeX: true,
        enableMermaid: true,
        enableSyntaxHighlight: true,
        codeTheme: 'dark',
    })
        .withSearch({
        enableFuzzySearch: true,
        enableAdvancedFilters: true,
        maxResults: 100,
    })
        .withExport({
        formats: ['pdf', 'markdown', 'json', 'html'],
        defaultFormat: 'markdown',
        includeMetadata: true,
        includeImages: true,
    })
        .build(), []);
    // Example 3: Custom configuration
    const customConfig = React.useMemo(() => createChatConfig()
        .withStreaming({
        provider: 'anthropic',
        endpoint: '/api/anthropic/chat',
        retryPolicy: 'exponential',
    })
        .withPersistence({
        storage: 'localstorage',
        maxHistory: 100,
    })
        .build(), []);
    return (_jsxs("div", { className: "p-8 space-y-8", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Configuration Builder Examples" }), _jsxs("section", { className: "space-y-4", children: [_jsx("h2", { className: "text-2xl font-semibold", children: "Basic Configuration" }), _jsx("pre", { className: "p-4 bg-muted rounded-lg overflow-x-auto", children: _jsx("code", { children: JSON.stringify(basicConfig, null, 2) }) })] }), _jsxs("section", { className: "space-y-4", children: [_jsx("h2", { className: "text-2xl font-semibold", children: "Full Configuration" }), _jsx("pre", { className: "p-4 bg-muted rounded-lg overflow-x-auto", children: _jsx("code", { children: JSON.stringify(fullConfig, null, 2) }) })] }), _jsxs("section", { className: "space-y-4", children: [_jsx("h2", { className: "text-2xl font-semibold", children: "Custom Configuration" }), _jsx("pre", { className: "p-4 bg-muted rounded-lg overflow-x-auto", children: _jsx("code", { children: JSON.stringify(customConfig, null, 2) }) })] }), _jsxs("section", { className: "space-y-4", children: [_jsx("h2", { className: "text-2xl font-semibold", children: "Interactive Builder" }), _jsxs("div", { className: "space-y-4", children: [_jsx("button", { onClick: () => setConfig(fullConfig), className: "px-4 py-2 bg-primary text-primary-foreground rounded-lg", children: "Use Full Config" }), _jsx("button", { onClick: () => setConfig(basicConfig), className: "px-4 py-2 bg-secondary text-secondary-foreground rounded-lg", children: "Use Basic Config" }), _jsx("pre", { className: "p-4 bg-muted rounded-lg overflow-x-auto", children: _jsx("code", { children: JSON.stringify(config, null, 2) }) })] })] })] }));
}
export default ConfigBuilderExample;
//# sourceMappingURL=config-builder-example.js.map