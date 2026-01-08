/**
 * useArchitectChat Hook
 *
 * React hook that integrates the architect workflow with useClarityChat
 * for AI-powered software engineering conversations.
 *
 * @packageDocumentation
 */
import { useCallback, useMemo, useState } from 'react';
import { useClarityChat, } from '../../../hooks/chat/use-clarity-chat';
import { useArchitectWorkflow, } from './use-architect-workflow';
import { renderMasterSystemPrompt, ARCHITECT_RECIPES, getArchitectRecipe, } from '../master-prompt';
import { DEFAULT_ARCHITECT_CONFIG } from '../types';
/**
 * Parse XML-like blocks from AI response
 */
export function parseResponseBlocks(content) {
    const blocks = [];
    // Match <PLANNING>...</PLANNING>
    const planningRegex = /<PLANNING>([\s\S]*?)<\/PLANNING>/gi;
    let match;
    while ((match = planningRegex.exec(content)) !== null) {
        blocks.push({
            type: 'planning',
            content: match[1].trim(),
        });
    }
    // Match <CODE language="...">...</CODE> or <CODE>...</CODE>
    const codeRegex = /<CODE(?:\s+language="([^"]*)")?>([\s\S]*?)<\/CODE>/gi;
    while ((match = codeRegex.exec(content)) !== null) {
        blocks.push({
            type: 'code',
            content: match[2].trim(),
            language: match[1] || 'typescript',
        });
    }
    // Match ```language ... ``` code blocks
    const markdownCodeRegex = /```(\w+)?\n([\s\S]*?)```/g;
    while ((match = markdownCodeRegex.exec(content)) !== null) {
        // Skip if already captured by CODE tags
        if (!blocks.some((b) => b.type === 'code' && b.content === match[2].trim())) {
            blocks.push({
                type: 'code',
                content: match[2].trim(),
                language: match[1] || 'text',
            });
        }
    }
    // Match <REVIEW>...</REVIEW>
    const reviewRegex = /<REVIEW>([\s\S]*?)<\/REVIEW>/gi;
    while ((match = reviewRegex.exec(content)) !== null) {
        blocks.push({
            type: 'review',
            content: match[1].trim(),
        });
    }
    // Match <ADR>...</ADR>
    const adrRegex = /<ADR>([\s\S]*?)<\/ADR>/gi;
    while ((match = adrRegex.exec(content)) !== null) {
        blocks.push({
            type: 'adr',
            content: match[1].trim(),
        });
    }
    // If no blocks found, treat entire content as text
    if (blocks.length === 0) {
        blocks.push({
            type: 'text',
            content: content.trim(),
        });
    }
    return blocks;
}
/**
 * Hook for AI-powered architect conversations
 *
 * Combines the architect workflow with useClarityChat to enable
 * structured AI-assisted software engineering conversations.
 *
 * @param options - Configuration options
 * @returns Chat and workflow state and actions
 *
 * @example
 * ```typescript
 * const architect = useArchitectChat({
 *   api: '/api/chat',
 *   recipe: 'masterArchitect',
 *   onBlocksParsed: (blocks) => {
 *     const codeBlocks = blocks.filter(b => b.type === 'code')
 *     console.log('Generated code:', codeBlocks)
 *   },
 * })
 *
 * // Send a message
 * await architect.sendMessage('Review this code for security issues: ...')
 *
 * // Check workflow progress
 * console.log(`Phase: ${architect.currentPhase}, Progress: ${architect.progress}%`)
 *
 * // Get parsed content
 * const code = architect.getCodeBlocks()
 * const reviews = architect.getReviewBlocks()
 * ```
 */
export function useArchitectChat(options) {
    const { api, recipe: initialRecipe = 'masterArchitect', customSystemPrompt, architectConfig, workflow: workflowOptions, chatOptions, autoParseBlocks = true, onBlocksParsed, } = options;
    // State
    const [currentRecipe, setCurrentRecipe] = useState(initialRecipe);
    const [lastParsedBlocks, setLastParsedBlocks] = useState([]);
    // Build system prompt
    const systemPrompt = useMemo(() => {
        if (customSystemPrompt) {
            return customSystemPrompt;
        }
        if (currentRecipe === 'masterArchitect') {
            return renderMasterSystemPrompt(architectConfig);
        }
        const recipeObj = getArchitectRecipe(currentRecipe);
        return typeof recipeObj.systemPrompt === 'string'
            ? recipeObj.systemPrompt
            : renderMasterSystemPrompt(architectConfig);
    }, [currentRecipe, customSystemPrompt, architectConfig]);
    // Workflow hook
    const workflow = useArchitectWorkflow({
        config: architectConfig,
        ...workflowOptions,
    });
    // Chat hook with architect system prompt
    const chat = useClarityChat({
        api,
        ...chatOptions,
        initialMessages: chatOptions?.initialMessages ?? [
            {
                id: 'system-architect',
                role: 'system',
                content: systemPrompt,
            },
        ],
    });
    /**
     * Send a message and optionally parse the response
     */
    const sendMessage = useCallback(async (content) => {
        await chat.append({
            role: 'user',
            content,
        });
        // Parse blocks from the latest assistant message after response completes
        if (autoParseBlocks && chat.messages.length > 0) {
            const lastMessage = chat.messages[chat.messages.length - 1];
            if (lastMessage?.role === 'assistant' &&
                typeof lastMessage.content === 'string') {
                const blocks = parseResponseBlocks(lastMessage.content);
                setLastParsedBlocks(blocks);
                onBlocksParsed?.(blocks);
            }
        }
    }, [chat, autoParseBlocks, onBlocksParsed]);
    /**
     * Clear messages and reset to system prompt
     */
    const clearMessages = useCallback(() => {
        chat.setMessages([
            {
                id: 'system-architect',
                role: 'system',
                content: systemPrompt,
            },
        ]);
        setLastParsedBlocks([]);
    }, [chat, systemPrompt]);
    /**
     * Reset everything
     */
    const reset = useCallback(() => {
        clearMessages();
        workflow.resetWorkflow();
    }, [clearMessages, workflow]);
    /**
     * Advance to next phase
     */
    const advancePhase = useCallback(() => {
        switch (workflow.state.currentPhase) {
            case 'analysis':
                workflow.completeAudit({
                    contextRequirements: [],
                    securityFindings: [],
                    codeSmells: [],
                    technicalDebt: [],
                    riskScore: 0,
                    summary: 'Audit completed via chat',
                    timestamp: new Date(),
                });
                break;
            case 'planning':
                workflow.completePlanning({
                    chainOfThought: 'Planning completed via chat',
                    steps: [],
                    patternRecommendations: [],
                    rejectedAlternatives: [],
                    testPlan: [],
                    approachSummary: 'Plan completed',
                    totalComplexity: 'moderate',
                });
                break;
            case 'implementation':
                workflow.completeImplementation({
                    code: '',
                    language: 'typescript',
                    boyScoutRuleApplied: false,
                });
                break;
            case 'review':
                workflow.completeReview({
                    selfCorrections: [],
                    dryCheck: { isDRY: true, duplications: [] },
                    securityRecheck: [],
                    qualityScore: 100,
                    recommendations: [],
                });
                break;
        }
    }, [workflow]);
    /**
     * Switch to a different recipe
     */
    const switchRecipe = useCallback((recipe) => {
        setCurrentRecipe(recipe);
        // Update system message
        const newSystemPrompt = recipe === 'masterArchitect'
            ? renderMasterSystemPrompt(architectConfig)
            : getArchitectRecipe(recipe).systemPrompt;
        if (typeof newSystemPrompt === 'string') {
            const messages = chat.messages.filter((m) => m.role !== 'system');
            chat.setMessages([
                {
                    id: 'system-architect',
                    role: 'system',
                    content: newSystemPrompt,
                },
                ...messages,
            ]);
        }
    }, [chat, architectConfig]);
    /**
     * Get planning blocks from all messages
     */
    const getPlanningBlocks = useCallback(() => {
        const blocks = [];
        for (const message of chat.messages) {
            if (message.role === 'assistant' && typeof message.content === 'string') {
                blocks.push(...parseResponseBlocks(message.content).filter((b) => b.type === 'planning'));
            }
        }
        return blocks;
    }, [chat.messages]);
    /**
     * Get code blocks from all messages
     */
    const getCodeBlocks = useCallback(() => {
        const blocks = [];
        for (const message of chat.messages) {
            if (message.role === 'assistant' && typeof message.content === 'string') {
                blocks.push(...parseResponseBlocks(message.content).filter((b) => b.type === 'code'));
            }
        }
        return blocks;
    }, [chat.messages]);
    /**
     * Get review blocks from all messages
     */
    const getReviewBlocks = useCallback(() => {
        const blocks = [];
        for (const message of chat.messages) {
            if (message.role === 'assistant' && typeof message.content === 'string') {
                blocks.push(...parseResponseBlocks(message.content).filter((b) => b.type === 'review'));
            }
        }
        return blocks;
    }, [chat.messages]);
    return {
        // Chat functionality
        messages: chat.messages,
        sendMessage,
        clearMessages,
        isLoading: chat.isLoading,
        error: chat.error ?? null,
        // Workflow state
        currentPhase: workflow.state.currentPhase,
        progress: workflow.progress,
        isComplete: workflow.state.isComplete,
        // Workflow actions
        reset,
        advancePhase,
        // Parsed content
        lastParsedBlocks,
        getPlanningBlocks,
        getCodeBlocks,
        getReviewBlocks,
        // Recipe management
        currentRecipe,
        switchRecipe,
        // Raw access
        chat,
        workflow,
    };
}
//# sourceMappingURL=use-architect-chat.js.map