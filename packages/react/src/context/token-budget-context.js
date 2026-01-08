'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { useTokenBudgetMonitor, createModelBudgetMonitor, isValidBudgetMonitorModel, } from '../hooks/token/use-token-budget-monitor';
// Split contexts to prevent re-renders
const TokenConfigContext = React.createContext(null);
const TokenStateContext = React.createContext(null);
/**
 * TokenBudgetProvider - Provides token budget state to child components
 *
 * Use this provider to share token budget state across multiple components
 * without prop drilling.
 *
 * **Performance Note**: This provider splits state and configuration internally.
 * Use `useTokenConfig()` for stable setters and `useTokenState()` for volatile usage data.
 *
 * @example
 * ```tsx
 * <TokenBudgetProvider model="gpt-4o">
 *   <ChatInterface />
 * </TokenBudgetProvider>
 * ```
 */
export function TokenBudgetProvider({ config: initialConfig, model: initialModel, configOverrides, children, }) {
    // Track current model
    const [currentModel, setCurrentModel] = React.useState(initialModel);
    // Build configuration from model or use provided config
    const [config, setConfig] = React.useState(() => {
        if (initialModel && isValidBudgetMonitorModel(initialModel)) {
            return {
                ...createModelBudgetMonitor(initialModel),
                ...configOverrides,
            };
        }
        return (initialConfig ?? {
            maxInputTokens: 128000,
            reservedForOutput: 4096,
        });
    });
    // Use the underlying hook
    const budgetMonitor = useTokenBudgetMonitor(config);
    // Handle model change
    const setModel = React.useCallback((newModel) => {
        if (!isValidBudgetMonitorModel(newModel)) {
            console.warn(`[TokenBudgetProvider] Invalid model: "${newModel}". Ignoring.`);
            return;
        }
        setCurrentModel(newModel);
        setConfig({
            ...createModelBudgetMonitor(newModel),
            ...configOverrides,
        });
    }, [configOverrides]);
    // Handle config update
    const updateConfig = React.useCallback((updates) => {
        setConfig((prev) => ({
            ...prev,
            ...updates,
        }));
    }, []);
    // Memoize config context (Stable)
    const configContextValue = React.useMemo(() => ({
        model: currentModel,
        setModel,
        updateConfig,
        config,
    }), [currentModel, setModel, updateConfig, config]);
    // Memoize state context (Volatile)
    const stateContextValue = React.useMemo(() => ({
        ...budgetMonitor,
    }), [budgetMonitor]);
    return (_jsx(TokenConfigContext.Provider, { value: configContextValue, children: _jsx(TokenStateContext.Provider, { value: stateContextValue, children: children }) }));
}
TokenBudgetProvider.displayName = 'TokenBudgetProvider';
/**
 * Hook to access token budget configuration and setters.
 * This hook is STABLE and will not re-render when token usage changes.
 */
export function useTokenConfig() {
    const context = React.useContext(TokenConfigContext);
    if (!context) {
        throw new Error('[useTokenConfig] must be used within a TokenBudgetProvider');
    }
    return context;
}
/**
 * Hook to access token usage statistics.
 * This hook is VOLATILE and will re-render whenever token counts update.
 */
export function useTokenState() {
    const context = React.useContext(TokenStateContext);
    if (!context) {
        throw new Error('[useTokenState] must be used within a TokenBudgetProvider');
    }
    return context;
}
/**
 * Legacy hook to access all token budget context.
 * **Warning**: Using this hook will cause re-renders on every token update.
 * Prefer `useTokenConfig()` or `useTokenState()` for better performance.
 */
export function useTokenBudget() {
    const config = useTokenConfig();
    const state = useTokenState();
    return React.useMemo(() => ({
        ...config,
        ...state,
    }), [config, state]);
}
/**
 * Hook to access token budget context with a fallback
 */
export function useTokenBudgetOptional() {
    const config = React.useContext(TokenConfigContext);
    const state = React.useContext(TokenStateContext);
    if (!config || !state)
        return null;
    return { ...config, ...state };
}
//# sourceMappingURL=token-budget-context.js.map