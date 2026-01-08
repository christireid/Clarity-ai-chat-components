/**
 * Model Prompt Builder
 *
 * High-level API for building optimized, model-ready prompts.
 * Integrates recipes, memory, user input, and optimization.
 */
import { toonToMessages } from './toon';
import { buildMessagesFromRecipe } from './recipe';
import { estimateMessageTokens, getTokenizerForModel, MODEL_PRESETS, estimateCost, } from './tokenizer';
import { optimizeMessagesForBudget } from './optimizer';
import { getModelProfileOrDefault } from './model-profiles';
/**
 * Build a model-ready prompt with optional optimization
 */
export async function buildModelPrompt(options) {
    const { toonNodes, recipe, variables = {}, messages: existingMessages = [], memoryContext, userInput, modelMetadata, targetTokens, optimization, } = options;
    // Resolve model metadata
    const resolvedMetadata = resolveModelMetadata(modelMetadata);
    const tokenizer = getTokenizerForModel(resolvedMetadata?.model ?? 'gpt-4', resolvedMetadata?.tokenizer);
    const maxTokens = resolvedMetadata?.maxTokens ?? 8192;
    const effectiveTargetTokens = targetTokens ?? Math.floor(maxTokens * 0.8);
    // Build initial messages
    let messages = [];
    // Add messages from toon or recipe
    if (toonNodes) {
        messages.push(...toonToMessages(toonNodes, variables));
    }
    else if (recipe) {
        messages.push(...buildMessagesFromRecipe(recipe, variables));
    }
    // Add memory context
    if (memoryContext) {
        if (typeof memoryContext === 'string') {
            messages.push({
                role: 'system',
                content: `Relevant context from memory:\n${memoryContext}`,
            });
        }
        else {
            // Memory context as messages
            messages.push(...memoryContext);
        }
    }
    // Add existing messages
    messages.push(...existingMessages);
    // Add user input
    if (userInput) {
        messages.push({
            role: 'user',
            content: userInput,
        });
    }
    // Apply optimization if enabled
    let optimizationDiagnostics;
    if (optimization?.enabled) {
        const originalTokens = estimateMessageTokens(messages, tokenizer);
        if (originalTokens > effectiveTargetTokens) {
            const optimizationResult = await optimizeMessagesForBudget(messages, {
                targetTokens: effectiveTargetTokens,
                strategy: optimization.strategy ?? 'hybrid',
                modelMetadata: resolvedMetadata,
                tokenizer,
                priorities: optimization.priorities,
                summarizeFn: optimization.summarizeFn,
                keepRecent: optimization.keepRecent ?? 2,
            });
            messages = optimizationResult.optimizedMessages;
            optimizationDiagnostics = optimizationResult.diagnostics;
        }
    }
    // Calculate final token stats
    const inputTokens = estimateMessageTokens(messages, tokenizer);
    const remainingBudget = Math.max(0, effectiveTargetTokens - inputTokens);
    const utilization = Math.min(1, inputTokens / effectiveTargetTokens);
    // Calculate cost estimate
    let costEstimate;
    if (resolvedMetadata?.inputPricePer1K) {
        // Estimate output as 30% of input for cost calculation
        const estimatedOutputTokens = Math.floor(inputTokens * 0.3);
        costEstimate = estimateCost(inputTokens, estimatedOutputTokens, resolvedMetadata);
    }
    return {
        messages,
        tokenStats: {
            inputTokens,
            remainingBudget,
            utilization,
        },
        costEstimate,
        optimizationDiagnostics,
    };
}
/**
 * Resolve model metadata from various input types
 */
function resolveModelMetadata(input) {
    if (!input)
        return undefined;
    if (typeof input === 'string') {
        // Try to get from presets
        if (MODEL_PRESETS[input]) {
            return MODEL_PRESETS[input];
        }
        // Try to get from model profiles
        const profile = getModelProfileOrDefault(input);
        return {
            model: profile.name,
            maxTokens: profile.maxTokens,
            maxOutputTokens: profile.maxOutputTokens,
            tokenizer: profile.tokenizer,
            inputPricePer1K: profile.costPer1K,
            outputPricePer1K: profile.outputCostPer1K,
        };
    }
    // Check if it's a ModelProfile
    if ('displayName' in input && 'family' in input) {
        const profile = input;
        return {
            model: profile.name,
            maxTokens: profile.maxTokens,
            maxOutputTokens: profile.maxOutputTokens,
            tokenizer: profile.tokenizer,
            inputPricePer1K: profile.costPer1K,
            outputPricePer1K: profile.outputCostPer1K,
        };
    }
    // Already ModelMetadata
    return input;
}
/**
 * Simple prompt builder for quick usage
 */
export function buildPrompt(systemPrompt, userMessage, options) {
    const messages = [];
    // Add system prompt
    if (systemPrompt) {
        messages.push({
            role: 'system',
            content: systemPrompt,
        });
    }
    // Add memory context
    if (options?.memoryContext) {
        messages.push({
            role: 'system',
            content: `Context:\n${options.memoryContext}`,
        });
    }
    // Add user message
    if (userMessage) {
        messages.push({
            role: 'user',
            content: userMessage,
        });
    }
    return messages;
}
/**
 * Append a message to an existing conversation
 */
export function appendToConversation(messages, newMessage, role = 'user') {
    const message = typeof newMessage === 'string'
        ? { role, content: newMessage }
        : newMessage;
    return [...messages, message];
}
/**
 * Create a conversation from alternating messages
 */
export function createConversation(systemPrompt, ...exchanges) {
    const messages = [
        { role: 'system', content: systemPrompt },
    ];
    for (const exchange of exchanges) {
        messages.push({ role: 'user', content: exchange.user });
        if (exchange.assistant) {
            messages.push({
                role: 'assistant',
                content: exchange.assistant,
            });
        }
    }
    return messages;
}
//# sourceMappingURL=builder.js.map