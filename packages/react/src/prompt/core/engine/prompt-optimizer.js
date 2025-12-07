/**
 * Prompt Optimization Engine
 *
 * Compiler-like pipeline for optimizing prompts:
 * 1. Lexing - Convert inputs to messages
 * 2. Structuring - Apply prompt style transformation
 * 3. Analysis - Semantic prioritization
 * 4. Optimization - Compression and pruning
 * 5. Emission - Final optimized prompt
 */
import { toonToMessages } from '../toon';
import { getModelProfileOrDefault } from '../model-profiles';
import { estimateMessageTokens, getTokenizerForModel, estimateCost } from '../tokenizer';
import { optimizeMessagesForBudget } from '../optimizer';
import { compressContext } from '../compression-chain';
import { chooseOptimizationStrategy } from '../strategy-router';
/**
 * Main optimization function - compiler-like pipeline
 */
export async function optimizePrompt(options) {
    const { toonDefinition, variables = {}, messages: inputMessages = [], memoryContext, modelProfile: modelProfileInput, targetTokens: targetTokensInput, strategies: _strategies, userIntent, applyStyleTransformation = true, summarizeFn, getEmbedding, debug = false, } = options;
    // Resolve model profile
    const modelProfile = typeof modelProfileInput === 'string'
        ? getModelProfileOrDefault(modelProfileInput)
        : modelProfileInput;
    const tokenizer = getTokenizerForModel(modelProfile.name, modelProfile.tokenizer);
    const targetTokens = targetTokensInput ?? Math.floor(modelProfile.maxTokens * modelProfile.compressionThreshold);
    const stages = [];
    // Stage 1: Lexing - Convert inputs to messages
    let messages = await lexingStage(toonDefinition, variables, inputMessages, memoryContext);
    const originalTokens = estimateMessageTokens(messages, tokenizer);
    let currentTokens = originalTokens;
    if (debug) {
        console.log(`[OptimizePrompt] Initial tokens: ${originalTokens}, target: ${targetTokens}`);
    }
    // Check if optimization is needed
    if (currentTokens <= targetTokens) {
        return createResult(messages, originalTokens, targetTokens, modelProfile, tokenizer, stages, false, 'Already within budget');
    }
    // Determine optimization strategy
    const strategySelection = chooseOptimizationStrategy(currentTokens, targetTokens, modelProfile);
    if (debug) {
        console.log(`[OptimizePrompt] Selected strategy: ${strategySelection.strategy}`);
    }
    // Stage 2: Structuring - Apply style transformation
    if (applyStyleTransformation) {
        const beforeTokens = currentTokens;
        messages = await structuringStage(messages, modelProfile);
        currentTokens = estimateMessageTokens(messages, tokenizer);
        if (currentTokens < beforeTokens) {
            stages.push({
                name: 'structuring',
                tokensBefore: beforeTokens,
                tokensAfter: currentTokens,
                tokensSaved: beforeTokens - currentTokens,
                details: [`Applied ${modelProfile.optimalPromptStyle} style transformation`],
            });
        }
        if (currentTokens <= targetTokens) {
            return createResult(messages, originalTokens, targetTokens, modelProfile, tokenizer, stages, true, 'Style transformation was sufficient');
        }
    }
    // Stage 3: Analysis - Semantic prioritization (if embedding function provided)
    if (getEmbedding && userIntent) {
        const beforeTokens = currentTokens;
        messages = await analysisStage(messages, userIntent, getEmbedding, tokenizer);
        currentTokens = estimateMessageTokens(messages, tokenizer);
        if (currentTokens < beforeTokens) {
            stages.push({
                name: 'analysis',
                tokensBefore: beforeTokens,
                tokensAfter: currentTokens,
                tokensSaved: beforeTokens - currentTokens,
                details: ['Applied semantic prioritization'],
            });
        }
        if (currentTokens <= targetTokens) {
            return createResult(messages, originalTokens, targetTokens, modelProfile, tokenizer, stages, true, 'Semantic prioritization was sufficient');
        }
    }
    // Stage 4: Optimization - Compression and pruning
    const beforeTokens = currentTokens;
    // Apply compression chain first
    const compressionResult = await compressContext(messages, {
        targetTokens,
        tokenizer,
        strategies: strategySelection.compressionStrategies,
        summarizeFn,
        keepRecentMessages: 3,
        maxToolOutputTokens: 500,
    });
    messages = compressionResult.messages;
    currentTokens = estimateMessageTokens(messages, tokenizer);
    if (currentTokens < beforeTokens) {
        stages.push({
            name: 'compression',
            tokensBefore: beforeTokens,
            tokensAfter: currentTokens,
            tokensSaved: beforeTokens - currentTokens,
            details: compressionResult.logs.map((l) => `${l.strategy}: ${l.description}`),
        });
    }
    // If still over budget, apply message optimization
    if (currentTokens > targetTokens) {
        const optimizationBeforeTokens = currentTokens;
        const optimizationResult = await optimizeMessagesForBudget(messages, {
            targetTokens,
            strategy: strategySelection.strategy,
            tokenizer,
            summarizeFn,
            keepRecent: 2,
        });
        messages = optimizationResult.optimizedMessages;
        currentTokens = estimateMessageTokens(messages, tokenizer);
        if (currentTokens < optimizationBeforeTokens) {
            stages.push({
                name: 'optimization',
                tokensBefore: optimizationBeforeTokens,
                tokensAfter: currentTokens,
                tokensSaved: optimizationBeforeTokens - currentTokens,
                details: optimizationResult.diagnostics.details,
            });
        }
    }
    // Stage 5: Emission - Return final result
    return createResult(messages, originalTokens, targetTokens, modelProfile, tokenizer, stages, true, strategySelection.reasoning);
}
/**
 * Stage 1: Lexing - Convert inputs to messages
 */
async function lexingStage(toonDefinition, variables, inputMessages, memoryContext) {
    const messages = [];
    // Convert toon to messages
    if (toonDefinition) {
        messages.push(...toonToMessages(toonDefinition, variables));
    }
    // Add memory context
    if (memoryContext) {
        if (typeof memoryContext === 'string') {
            messages.push({
                role: 'system',
                content: `Relevant context:\n${memoryContext}`,
            });
        }
        else {
            messages.push(...memoryContext);
        }
    }
    // Add input messages
    messages.push(...inputMessages);
    return messages;
}
/**
 * Stage 2: Structuring - Apply prompt style transformation
 */
async function structuringStage(messages, modelProfile) {
    const style = modelProfile.optimalPromptStyle;
    return messages.map((msg) => {
        if (msg.role !== 'system' && msg.role !== 'user')
            return msg;
        const content = typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content);
        let transformedContent = content;
        switch (style) {
            case 'concise':
                // Remove redundant whitespace and shorten verbose phrases
                transformedContent = content
                    .replace(/\s+/g, ' ')
                    .replace(/please note that/gi, 'note:')
                    .replace(/it is important to/gi, 'important:')
                    .replace(/in order to/gi, 'to')
                    .trim();
                break;
            case 'dense':
                // Merge short lines
                transformedContent = content
                    .split('\n')
                    .filter((line) => line.trim().length > 0)
                    .join(' ')
                    .replace(/\s+/g, ' ')
                    .trim();
                break;
            case 'structured':
                // Keep as-is, already structured
                break;
            case 'verbose':
                // Keep as-is
                break;
        }
        if (transformedContent !== content) {
            return { ...msg, content: transformedContent };
        }
        return msg;
    });
}
/**
 * Stage 3: Analysis - Semantic prioritization
 */
async function analysisStage(messages, userIntent, getEmbedding, tokenizer) {
    // Simple implementation - could be expanded with actual embeddings
    // For now, prioritize messages that contain words from the user intent
    const intentWords = new Set(userIntent
        .toLowerCase()
        .split(/\W+/)
        .filter((w) => w.length > 3));
    const scoredMessages = messages.map((msg) => {
        const content = typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content);
        const words = content.toLowerCase().split(/\W+/);
        const matchCount = words.filter((w) => intentWords.has(w)).length;
        const score = matchCount / Math.max(1, words.length);
        return {
            message: msg,
            score,
            tokens: tokenizer.estimate(content),
        };
    });
    // Sort by score (keep high-scoring messages)
    // But preserve relative order within same score
    return scoredMessages
        .sort((a, b) => {
        // System messages always first
        if (a.message.role === 'system' && b.message.role !== 'system')
            return -1;
        if (b.message.role === 'system' && a.message.role !== 'system')
            return 1;
        // Then by score (higher is better)
        return b.score - a.score;
    })
        .map((s) => s.message);
}
/**
 * Create the final result object
 */
function createResult(messages, originalTokens, targetTokens, modelProfile, tokenizer, stages, wasOptimized, reason) {
    const finalTokens = estimateMessageTokens(messages, tokenizer);
    const totalTokensSaved = originalTokens - finalTokens;
    // Calculate cost estimate
    const estimatedOutputTokens = Math.floor(finalTokens * 0.3);
    const costEstimate = estimateCost(finalTokens, estimatedOutputTokens, {
        model: modelProfile.name,
        maxTokens: modelProfile.maxTokens,
        inputPricePer1K: modelProfile.costPer1K,
        outputPricePer1K: modelProfile.outputCostPer1K,
    });
    return {
        optimizedMessages: messages,
        tokenStats: {
            inputTokens: finalTokens,
            remainingBudget: Math.max(0, targetTokens - finalTokens),
            utilization: Math.min(1, finalTokens / targetTokens),
        },
        costEstimate,
        diagnostics: {
            originalTokens,
            finalTokens,
            totalTokensSaved,
            wasOptimized,
            reason,
            stages,
        },
    };
}
//# sourceMappingURL=prompt-optimizer.js.map