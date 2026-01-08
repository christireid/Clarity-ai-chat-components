/**
 * usePromptRecipe Hook
 *
 * React hook for building prompts from recipes using the toon DSL.
 */
import { useMemo, useCallback } from 'react';
import { buildMessagesFromRecipe } from '../core/recipe';
import { toonToMessages } from '../core/toon';
import { estimatePromptTokens } from '../core/tokenizer';
/**
 * Hook for building prompts from recipes
 */
export function usePromptRecipe(options = {}) {
    const { recipe, toonNodes, variables = {}, debug = false } = options;
    const buildPrompt = useCallback((overrideVariables = {}) => {
        const mergedVariables = { ...variables, ...overrideVariables };
        if (recipe) {
            return buildMessagesFromRecipe(recipe, mergedVariables);
        }
        else if (toonNodes) {
            return toonToMessages(toonNodes, mergedVariables);
        }
        return [];
    }, [recipe, toonNodes, variables]);
    const estimateTokens = useCallback((overrideVariables = {}) => {
        const mergedVariables = { ...variables, ...overrideVariables };
        if (recipe) {
            if (recipe.systemPrompt) {
                return estimatePromptTokens(recipe.systemPrompt, mergedVariables);
            }
            if (recipe.userMessage) {
                return estimatePromptTokens(recipe.userMessage, mergedVariables);
            }
            return 0;
        }
        else if (toonNodes) {
            return estimatePromptTokens(toonNodes, mergedVariables);
        }
        return 0;
    }, [recipe, toonNodes, variables]);
    const debugView = useMemo(() => {
        if (!debug)
            return undefined;
        const messages = buildPrompt();
        const mergedVariables = { ...variables };
        return {
            rendered: messages
                .map((m) => `${m.role}: ${typeof m.content === 'string' ? m.content : JSON.stringify(m.content)}`)
                .join('\n\n'),
            variables: mergedVariables,
            messages,
        };
    }, [debug, buildPrompt, variables]);
    return {
        buildPrompt,
        estimateTokens,
        debugView,
    };
}
//# sourceMappingURL=use-prompt-recipe.js.map