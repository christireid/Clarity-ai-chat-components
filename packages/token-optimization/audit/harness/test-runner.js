/**
 * Token Optimization Test Runner
 *
 * Executes test scenarios in baseline and optimized modes,
 * captures measurements, and generates comparison reports.
 */
import { randomUUID } from 'crypto';
import { TokenMeasurementHarness, createMeasurementHarness, } from './measurement-harness';
import { ALL_SCENARIOS, SCENARIO_BY_ID } from './scenarios';
import { createPayloadSnapshot, estimateTokens } from './token-estimator';
/**
 * Filler patterns to remove (RUTHLESS comprehensive list)
 */
const FILLER_PATTERNS = [
    // Single words - expanded
    /\b(um|uh|hmm|like|actually|basically|literally|really|very|quite|rather|pretty|somewhat|just|only|simply|merely|perhaps|maybe|certainly|definitely|absolutely|obviously|clearly|frankly|honestly|truly|surely|probably|possibly|likely|unlikely|hopefully|thankfully|unfortunately|interestingly|surprisingly|amazingly|incredibly|extremely|totally|completely|entirely|wholly|fully|perfectly|exactly|precisely|specifically|especially|particularly|generally|typically|usually|normally|often|frequently|occasionally|sometimes|always|never|everywhere|anywhere|everywhere|somewhere|meanwhile|furthermore|moreover|however|therefore|consequently|nevertheless|nonetheless|otherwise|accordingly|hence|thus|indeed|namely|specifically)\b/gi,
    // Multi-word phrases - expanded
    /\b(you know|sort of|kind of|a bit|a little|in order to|as well as|in spite of the fact that|due to the fact that|for the purpose of|at this point in time|in the event that|prior to|subsequent to|with regard to|in regard to|with respect to|in terms of|as a matter of fact|at the end of the day|by the way|in fact|in reality|in truth|to be honest|to tell you the truth|as you can see|as I mentioned|as I said|needless to say|it goes without saying|as a result|for example|for instance|on the other hand|on the contrary|in addition|in contrast|in comparison|in conclusion|in summary|to sum up|to conclude|first of all|last but not least|more or less|sooner or later|by and large|all in all|take into account|take into consideration|make a decision|come to a conclusion|give consideration to|have an effect on|have an impact on|play a role in|in the process of|on a daily basis|on a regular basis|in the near future|at some point|up until now|as of now|at the present time|at the moment|for the time being|in the meantime|as soon as possible|in a timely manner|in the case of|in the event of|with the exception of|regardless of the fact that)\b/gi,
    // Redundant starters
    /^(well,?\s*|so,?\s*|okay,?\s*|alright,?\s*|right,?\s*|now,?\s*|look,?\s*|see,?\s*|listen,?\s*|hey,?\s*|hi,?\s*)/gim,
    // Excessive politeness
    /(\bplease\b.*?\bplease\b)/gi,
    // Repeated words
    /\b(\w+)\s+\1\b/gi,
    // Redundant punctuation
    /([!?])\1+/g,
    // Multiple spaces (cleanup)
    /\s{2,}/g,
    // Empty parentheses and brackets
    /\(\s*\)|\[\s*\]|\{\s*\}/g,
    // Ellipsis abuse
    /\.{4,}/g,
    // "I think" / "I believe" hedging
    /\b(I think|I believe|I feel|I guess|I suppose|in my opinion|from my perspective|if you ask me)\s*(that\s*)?/gi,
    // Thanks/please combos
    /\b(thanks|thank you|please)\s+(so\s+)?(very\s+)?(much|a lot)\b/gi,
];
/**
 * URL shortening - replace verbose URLs with placeholders
 */
function shortenURLs(text) {
    // Match URLs
    const urlRegex = /(https?:\/\/[^\s<>"{}|\\^`[\]]+)/gi;
    let shortened = text.replace(urlRegex, (url) => {
        try {
            const parsed = new URL(url);
            // Keep just domain + first path segment
            const pathParts = parsed.pathname.split('/').filter(Boolean);
            const shortPath = pathParts.length > 0 ? `/${pathParts[0]}` : '';
            return `<URL:${parsed.hostname}${shortPath}>`;
        }
        catch {
            return '<URL>';
        }
    });
    return shortened;
}
/**
 * Strip markdown formatting (keep content, remove syntax)
 */
function stripMarkdown(text) {
    let result = text;
    // Remove headers (keep text)
    result = result.replace(/^#{1,6}\s+(.+)$/gm, '$1');
    // Remove bold/italic
    result = result.replace(/\*\*(.+?)\*\*/g, '$1');
    result = result.replace(/\*(.+?)\*/g, '$1');
    result = result.replace(/__(.+?)__/g, '$1');
    result = result.replace(/_(.+?)_/g, '$1');
    result = result.replace(/~~(.+?)~~/g, '$1');
    // Remove links (keep text, drop URL)
    result = result.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    // Remove inline code backticks (keep code)
    result = result.replace(/`([^`]+)`/g, '$1');
    // Remove horizontal rules
    result = result.replace(/^[-*_]{3,}$/gm, '');
    // Remove blockquotes marker
    result = result.replace(/^>\s?/gm, '');
    // Simplify list markers
    result = result.replace(/^[\s]*[-*+]\s+/gm, '• ');
    result = result.replace(/^[\s]*\d+\.\s+/gm, '• ');
    return result;
}
/**
 * Extract code from code blocks (remove explanation wrapper)
 */
function extractCodeBlocks(text) {
    // Replace verbose code block explanations with just the code
    const codeBlockRegex = /```(\w+)?\s*\n([\s\S]*?)\n```/g;
    return text.replace(codeBlockRegex, (match, lang, code) => {
        const trimmedCode = code.trim();
        // If code is short, just return it inline
        if (trimmedCode.length < 200) {
            return `[${lang || 'code'}]: ${trimmedCode}`;
        }
        // For longer code, keep but compress whitespace
        return `[${lang || 'code'}]:\n${trimmedCode}`;
    });
}
/**
 * Summarize/truncate assistant messages in history (aggressive)
 */
function truncateAssistantHistory(text, maxLength, preserveCodeBlocks = true) {
    if (text.length <= maxLength)
        return text;
    // If preserving code, extract it first
    const codeBlocks = [];
    let textWithoutCode = text;
    if (preserveCodeBlocks) {
        textWithoutCode = text.replace(/```[\s\S]*?```/g, (match) => {
            codeBlocks.push(match);
            return `<CODE_BLOCK_${codeBlocks.length - 1}>`;
        });
    }
    // Truncate prose
    const sentences = textWithoutCode.split(/[.!?]+/).filter((s) => s.trim());
    let result = '';
    for (const sentence of sentences) {
        if (result.length + sentence.length > maxLength * 0.8)
            break;
        result += sentence.trim() + '. ';
    }
    // Restore code blocks if they fit
    if (preserveCodeBlocks && codeBlocks.length > 0) {
        for (let i = 0; i < codeBlocks.length && result.length < maxLength; i++) {
            result = result.replace(`<CODE_BLOCK_${i}>`, codeBlocks[i]);
        }
        // Remove any remaining placeholders
        result = result.replace(/<CODE_BLOCK_\d+>/g, '[code omitted]');
    }
    if (result.length < text.length * 0.95) {
        return result.trim() + '...';
    }
    return text.slice(0, maxLength) + '...';
}
/**
 * Compress system prompts ruthlessly
 */
function compressSystemPrompt(text, level) {
    let result = text;
    // Apply filler removal
    for (const pattern of FILLER_PATTERNS) {
        result = result.replace(pattern, ' ');
    }
    // Strip markdown in system prompts (formatting doesn't matter to model)
    result = stripMarkdown(result);
    // URL shortening
    result = shortenURLs(result);
    // Aggressive: more compression
    if (level === 'aggressive') {
        // Remove example sections (keep instructions)
        result = result.replace(/\bexample[s]?:[\s\S]*?(?=\n\n|$)/gi, '');
        result = result.replace(/\bfor instance[,:][\s\S]*?(?=\n\n|\.\s|$)/gi, '');
        // Compress numbered lists to single line
        result = result.replace(/^\s*\d+\.\s*(.+)$/gm, '• $1');
        // Remove redundant whitespace and newlines
        result = result.replace(/\n{3,}/g, '\n\n');
        result = result.replace(/\s{2,}/g, ' ');
    }
    return result.trim();
}
/**
 * Deduplicate repeated content within a message
 */
function deduplicateContent(text) {
    // Find repeated sentences
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const seen = new Set();
    const unique = [];
    for (const sentence of sentences) {
        const normalized = sentence.trim().toLowerCase();
        if (!seen.has(normalized) || normalized.length < 20) {
            seen.add(normalized);
            unique.push(sentence.trim());
        }
    }
    // Find repeated phrases (3+ words repeated)
    let result = unique.join('. ');
    const words = result.split(/\s+/);
    if (words.length > 10) {
        // Look for repeated n-grams
        for (let n = 3; n <= 6; n++) {
            const ngrams = new Map();
            for (let i = 0; i <= words.length - n; i++) {
                const ngram = words
                    .slice(i, i + n)
                    .join(' ')
                    .toLowerCase();
                ngrams.set(ngram, (ngrams.get(ngram) || 0) + 1);
            }
            // Replace repeated n-grams with single instance
            for (const [ngram, count] of ngrams) {
                if (count > 2 && ngram.length > 15) {
                    const regex = new RegExp(`(${ngram.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s,.!?]*){2,}`, 'gi');
                    result = result.replace(regex, ngram + ' ');
                }
            }
        }
    }
    return result.trim();
}
/**
 * Apply optimization techniques to messages - RUTHLESS VERSION
 */
function applyOptimizations(messages, config, model) {
    let optimizedMessages = [...messages];
    const techniques = [];
    // Track original tokens
    const originalSnapshot = createPayloadSnapshot(messages, model);
    const originalTokens = originalSnapshot.totalEstimatedTokens;
    // Determine aggressiveness level
    const isAggressive = config.compressionLevel === 'aggressive';
    const isBalanced = config.compressionLevel === 'balanced';
    // 1. SYSTEM PROMPT COMPRESSION - NEW! (applies first for max impact)
    {
        let systemCompressed = false;
        const beforeSystem = createPayloadSnapshot(optimizedMessages, model);
        optimizedMessages = optimizedMessages.map((msg) => {
            if (msg.role === 'system' && msg.content.length > 50) {
                const compressed = compressSystemPrompt(msg.content, config.compressionLevel || 'balanced');
                if (compressed.length < msg.content.length * 0.95) {
                    systemCompressed = true;
                    return { ...msg, content: compressed };
                }
            }
            return msg;
        });
        if (systemCompressed) {
            const afterSystem = createPayloadSnapshot(optimizedMessages, model);
            techniques.push({
                name: 'system-prompt-compression',
                applied: true,
                inputTokens: beforeSystem.totalEstimatedTokens,
                outputTokens: afterSystem.totalEstimatedTokens,
                tokensSaved: beforeSystem.totalEstimatedTokens - afterSystem.totalEstimatedTokens,
                savingsPercent: ((beforeSystem.totalEstimatedTokens -
                    afterSystem.totalEstimatedTokens) /
                    beforeSystem.totalEstimatedTokens) *
                    100,
            });
        }
    }
    // 2. History limiting (ULTRA-AGGRESSIVE thresholds)
    if (config.enableHistoryLimiting && config.maxHistoryMessages) {
        const systemMessage = optimizedMessages.find((m) => m.role === 'system');
        const nonSystemMessages = optimizedMessages.filter((m) => m.role !== 'system');
        const keepCount = config.maxHistoryMessages * 2; // pairs of user/assistant
        if (nonSystemMessages.length > keepCount) {
            const keptMessages = nonSystemMessages.slice(-keepCount);
            optimizedMessages = systemMessage
                ? [systemMessage, ...keptMessages]
                : keptMessages;
            const afterSnapshot = createPayloadSnapshot(optimizedMessages, model);
            techniques.push({
                name: 'history-limiting',
                applied: true,
                inputTokens: originalTokens,
                outputTokens: afterSnapshot.totalEstimatedTokens,
                tokensSaved: originalTokens - afterSnapshot.totalEstimatedTokens,
                savingsPercent: ((originalTokens - afterSnapshot.totalEstimatedTokens) /
                    originalTokens) *
                    100,
                config: { maxMessages: config.maxHistoryMessages },
            });
        }
        else {
            techniques.push({ name: 'history-limiting', applied: false });
        }
    }
    // 3. AGGRESSIVE ASSISTANT TRUNCATION IN HISTORY - NEW!
    if (isAggressive || isBalanced) {
        let assistantTruncated = false;
        const beforeTrunc = createPayloadSnapshot(optimizedMessages, model);
        const maxAssistantLength = isAggressive ? 300 : 500;
        // Find the last user message index
        const lastUserIndex = optimizedMessages.reduce((acc, msg, i) => (msg.role === 'user' ? i : acc), -1);
        optimizedMessages = optimizedMessages.map((msg, i) => {
            // Only truncate assistant messages in history (not the most recent exchange)
            if (msg.role === 'assistant' &&
                i < lastUserIndex &&
                msg.content.length > maxAssistantLength) {
                const truncated = truncateAssistantHistory(msg.content, maxAssistantLength, isBalanced);
                if (truncated.length < msg.content.length) {
                    assistantTruncated = true;
                    return { ...msg, content: truncated };
                }
            }
            return msg;
        });
        if (assistantTruncated) {
            const afterTrunc = createPayloadSnapshot(optimizedMessages, model);
            techniques.push({
                name: 'assistant-history-truncation',
                applied: true,
                inputTokens: beforeTrunc.totalEstimatedTokens,
                outputTokens: afterTrunc.totalEstimatedTokens,
                tokensSaved: beforeTrunc.totalEstimatedTokens - afterTrunc.totalEstimatedTokens,
                savingsPercent: ((beforeTrunc.totalEstimatedTokens -
                    afterTrunc.totalEstimatedTokens) /
                    beforeTrunc.totalEstimatedTokens) *
                    100,
            });
        }
    }
    // 4. Content deduplication (high impact on repetitive content)
    {
        let deduplicationApplied = false;
        const beforeDedup = createPayloadSnapshot(optimizedMessages, model);
        optimizedMessages = optimizedMessages.map((msg) => {
            if ((msg.role === 'user' || msg.role === 'assistant') &&
                msg.content.length > 50) {
                const deduplicated = deduplicateContent(msg.content);
                if (deduplicated.length < msg.content.length * 0.95) {
                    deduplicationApplied = true;
                    return { ...msg, content: deduplicated };
                }
            }
            return msg;
        });
        if (deduplicationApplied) {
            const afterDedup = createPayloadSnapshot(optimizedMessages, model);
            techniques.push({
                name: 'content-deduplication',
                applied: true,
                inputTokens: beforeDedup.totalEstimatedTokens,
                outputTokens: afterDedup.totalEstimatedTokens,
                tokensSaved: beforeDedup.totalEstimatedTokens - afterDedup.totalEstimatedTokens,
                savingsPercent: ((beforeDedup.totalEstimatedTokens -
                    afterDedup.totalEstimatedTokens) /
                    beforeDedup.totalEstimatedTokens) *
                    100,
            });
        }
    }
    // 5. URL SHORTENING - NEW!
    {
        let urlsShortened = false;
        const beforeUrls = createPayloadSnapshot(optimizedMessages, model);
        optimizedMessages = optimizedMessages.map((msg) => {
            if (msg.content.includes('http://') || msg.content.includes('https://')) {
                const shortened = shortenURLs(msg.content);
                if (shortened.length < msg.content.length) {
                    urlsShortened = true;
                    return { ...msg, content: shortened };
                }
            }
            return msg;
        });
        if (urlsShortened) {
            const afterUrls = createPayloadSnapshot(optimizedMessages, model);
            techniques.push({
                name: 'url-shortening',
                applied: true,
                inputTokens: beforeUrls.totalEstimatedTokens,
                outputTokens: afterUrls.totalEstimatedTokens,
                tokensSaved: beforeUrls.totalEstimatedTokens - afterUrls.totalEstimatedTokens,
                savingsPercent: ((beforeUrls.totalEstimatedTokens - afterUrls.totalEstimatedTokens) /
                    beforeUrls.totalEstimatedTokens) *
                    100,
            });
        }
    }
    // 6. MARKDOWN STRIPPING - NEW! (in aggressive/balanced modes)
    if (isAggressive || isBalanced) {
        let markdownStripped = false;
        const beforeMd = createPayloadSnapshot(optimizedMessages, model);
        optimizedMessages = optimizedMessages.map((msg) => {
            // Don't strip markdown from recent user message (might be intentional)
            if (msg.role !== 'system') {
                const stripped = stripMarkdown(msg.content);
                if (stripped.length < msg.content.length * 0.98) {
                    markdownStripped = true;
                    return { ...msg, content: stripped };
                }
            }
            return msg;
        });
        if (markdownStripped) {
            const afterMd = createPayloadSnapshot(optimizedMessages, model);
            techniques.push({
                name: 'markdown-stripping',
                applied: true,
                inputTokens: beforeMd.totalEstimatedTokens,
                outputTokens: afterMd.totalEstimatedTokens,
                tokensSaved: beforeMd.totalEstimatedTokens - afterMd.totalEstimatedTokens,
                savingsPercent: ((beforeMd.totalEstimatedTokens - afterMd.totalEstimatedTokens) /
                    beforeMd.totalEstimatedTokens) *
                    100,
            });
        }
    }
    // 7. CODE BLOCK EXTRACTION - NEW! (compresses verbose code explanations)
    if (isAggressive) {
        let codeExtracted = false;
        const beforeCode = createPayloadSnapshot(optimizedMessages, model);
        optimizedMessages = optimizedMessages.map((msg) => {
            if (msg.content.includes('```')) {
                const extracted = extractCodeBlocks(msg.content);
                if (extracted.length < msg.content.length * 0.95) {
                    codeExtracted = true;
                    return { ...msg, content: extracted };
                }
            }
            return msg;
        });
        if (codeExtracted) {
            const afterCode = createPayloadSnapshot(optimizedMessages, model);
            techniques.push({
                name: 'code-block-extraction',
                applied: true,
                inputTokens: beforeCode.totalEstimatedTokens,
                outputTokens: afterCode.totalEstimatedTokens,
                tokensSaved: beforeCode.totalEstimatedTokens - afterCode.totalEstimatedTokens,
                savingsPercent: ((beforeCode.totalEstimatedTokens - afterCode.totalEstimatedTokens) /
                    beforeCode.totalEstimatedTokens) *
                    100,
            });
        }
    }
    // 8. Enhanced prompt compression (applies to all messages)
    if (config.enablePromptCompression) {
        let compressionApplied = false;
        const beforeCompression = createPayloadSnapshot(optimizedMessages, model);
        const targetRatio = isAggressive ? 0.5 : isBalanced ? 0.7 : 0.85;
        optimizedMessages = optimizedMessages.map((msg) => {
            // Apply to ALL messages (user, assistant, and now system too)
            if (msg.content.length > 20) {
                let compressed = msg.content;
                // Apply all filler patterns
                for (const pattern of FILLER_PATTERNS) {
                    compressed = compressed.replace(pattern, ' ');
                }
                // Normalize whitespace
                compressed = compressed.replace(/\s+/g, ' ').trim();
                // For aggressive mode, truncate long content
                if (isAggressive && compressed.length > 150) {
                    const targetLength = Math.floor(compressed.length * targetRatio);
                    const truncated = compressed.slice(0, targetLength);
                    const lastPeriod = truncated.lastIndexOf('.');
                    const lastQuestion = truncated.lastIndexOf('?');
                    const lastBoundary = Math.max(lastPeriod, lastQuestion);
                    if (lastBoundary > targetLength * 0.6) {
                        compressed = truncated.slice(0, lastBoundary + 1);
                    }
                    else {
                        compressed = truncated + '...';
                    }
                }
                if (compressed !== msg.content &&
                    compressed.length < msg.content.length) {
                    compressionApplied = true;
                    return { ...msg, content: compressed };
                }
            }
            return msg;
        });
        const afterCompression = createPayloadSnapshot(optimizedMessages, model);
        techniques.push({
            name: 'prompt-compression',
            applied: compressionApplied,
            inputTokens: beforeCompression.totalEstimatedTokens,
            outputTokens: afterCompression.totalEstimatedTokens,
            tokensSaved: compressionApplied
                ? beforeCompression.totalEstimatedTokens -
                    afterCompression.totalEstimatedTokens
                : 0,
            savingsPercent: compressionApplied
                ? ((beforeCompression.totalEstimatedTokens -
                    afterCompression.totalEstimatedTokens) /
                    beforeCompression.totalEstimatedTokens) *
                    100
                : 0,
            config: { compressionLevel: config.compressionLevel },
        });
    }
    // 9. TOON format (for JSON content)
    if (config.enableToon) {
        let toonApplied = false;
        const beforeToon = createPayloadSnapshot(optimizedMessages, model);
        optimizedMessages = optimizedMessages.map((msg) => {
            if (msg.role === 'user') {
                // Check if content contains JSON
                const jsonMatch = msg.content.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
                if (jsonMatch) {
                    try {
                        const parsed = JSON.parse(jsonMatch[0]);
                        if (Array.isArray(parsed) &&
                            parsed.length > 0 &&
                            typeof parsed[0] === 'object') {
                            // Convert array of objects to TOON format
                            const keys = Object.keys(parsed[0]);
                            const toon = keys.join(', ') +
                                '\n' +
                                parsed
                                    .map((item) => keys.map((k) => item[k]).join(', '))
                                    .join('\n');
                            if (toon.length < jsonMatch[0].length * 0.85) {
                                // Apply if savings > 15%
                                toonApplied = true;
                                return {
                                    ...msg,
                                    content: msg.content.replace(jsonMatch[0], toon),
                                };
                            }
                        }
                    }
                    catch {
                        // Not valid JSON, skip
                    }
                }
            }
            return msg;
        });
        if (toonApplied) {
            const afterToon = createPayloadSnapshot(optimizedMessages, model);
            techniques.push({
                name: 'toon-format',
                applied: true,
                inputTokens: beforeToon.totalEstimatedTokens,
                outputTokens: afterToon.totalEstimatedTokens,
                tokensSaved: beforeToon.totalEstimatedTokens - afterToon.totalEstimatedTokens,
                savingsPercent: ((beforeToon.totalEstimatedTokens - afterToon.totalEstimatedTokens) /
                    beforeToon.totalEstimatedTokens) *
                    100,
            });
        }
        else {
            techniques.push({ name: 'toon-format', applied: false });
        }
    }
    // 10. PII Redaction
    if (config.enablePIIRedaction) {
        let piiRedacted = false;
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const phoneRegex = /(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g;
        const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
        const ccRegex = /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g;
        optimizedMessages = optimizedMessages.map((msg) => {
            let content = msg.content;
            const hasEmail = emailRegex.test(content);
            const hasPhone = phoneRegex.test(content);
            const hasSSN = ssnRegex.test(content);
            const hasCC = ccRegex.test(content);
            if (hasEmail || hasPhone || hasSSN || hasCC) {
                content = content
                    .replace(emailRegex, '<EMAIL>')
                    .replace(phoneRegex, '<PHONE>')
                    .replace(ssnRegex, '<SSN>')
                    .replace(ccRegex, '<CC>');
                piiRedacted = true;
            }
            return { ...msg, content };
        });
        techniques.push({ name: 'pii-redaction', applied: piiRedacted });
    }
    // Calculate total savings
    const finalSnapshot = createPayloadSnapshot(optimizedMessages, model);
    const estimatedTotalSaved = originalTokens - finalSnapshot.totalEstimatedTokens;
    return {
        optimizedMessages,
        optimization: {
            enabled: true,
            techniques,
            estimatedTotalSaved,
            preset: config.compressionLevel,
        },
    };
}
/**
 * Test Runner class
 */
export class TokenOptimizationTestRunner {
    harness;
    provider = null;
    model = 'gpt-4';
    providerName = 'openai';
    constructor(config) {
        this.harness = createMeasurementHarness({
            outputDir: config?.outputDir,
            verbose: config?.verbose ?? true,
            model: this.model,
            provider: this.providerName,
        });
    }
    /**
     * Set the LLM provider for actual API calls
     */
    setProvider(provider, providerName = 'openai') {
        this.provider = provider;
        this.providerName = providerName;
    }
    /**
     * Set the model to use
     */
    setModel(model) {
        this.model = model;
    }
    /**
     * Run baseline measurements (no optimization)
     */
    async runBaseline(scenarioIds, trialsPerScenario = 1) {
        const scenarios = scenarioIds
            ? scenarioIds
                .map((id) => SCENARIO_BY_ID.get(id))
                .filter(Boolean)
            : ALL_SCENARIOS;
        const runConfig = {
            runId: `baseline-${randomUUID().slice(0, 8)}`,
            timestamp: new Date().toISOString(),
            mode: 'baseline',
            scenarioIds: scenarios.map((s) => s.id),
            trialsPerScenario,
            model: this.model,
            provider: this.providerName,
        };
        this.harness.startRun(runConfig);
        for (const scenario of scenarios) {
            for (let trial = 0; trial < trialsPerScenario; trial++) {
                await this.executeScenario(scenario, {}, `${scenario.id}-trial-${trial}`);
            }
        }
        return this.harness.endRun();
    }
    /**
     * Run optimized measurements
     */
    async runOptimized(optimizationConfig, scenarioIds, trialsPerScenario = 1) {
        const scenarios = scenarioIds
            ? scenarioIds
                .map((id) => SCENARIO_BY_ID.get(id))
                .filter(Boolean)
            : ALL_SCENARIOS;
        const runConfig = {
            runId: `optimized-${randomUUID().slice(0, 8)}`,
            timestamp: new Date().toISOString(),
            mode: 'optimized',
            optimizationConfig,
            scenarioIds: scenarios.map((s) => s.id),
            trialsPerScenario,
            model: this.model,
            provider: this.providerName,
        };
        this.harness.startRun(runConfig);
        for (const scenario of scenarios) {
            for (let trial = 0; trial < trialsPerScenario; trial++) {
                await this.executeScenario(scenario, optimizationConfig, `${scenario.id}-trial-${trial}`);
            }
        }
        return this.harness.endRun();
    }
    /**
     * Run A/B comparison
     */
    async runComparison(optimizationConfig, scenarioIds, trialsPerScenario = 1) {
        console.log('\n========== BASELINE RUN ==========');
        const baseline = await this.runBaseline(scenarioIds, trialsPerScenario);
        console.log('\n========== OPTIMIZED RUN ==========');
        const optimized = await this.runOptimized(optimizationConfig, scenarioIds, trialsPerScenario);
        const comparison = this.compareRuns(baseline, optimized);
        this.printComparisonReport(comparison);
        return comparison;
    }
    /**
     * Execute a single scenario
     */
    async executeScenario(scenario, optimizationConfig, _runId) {
        const messages = [];
        for (let i = 0; i < scenario.turns.length; i++) {
            const turn = scenario.turns[i];
            // Add message to history
            messages.push({
                role: turn.role,
                content: turn.content,
            });
            // Only measure on user turns (when we would send to LLM)
            if (turn.role === 'user') {
                // Start measurement
                const measurementId = this.harness.beginMeasurement(scenario.id, Math.floor(i / 2) + 1, // Turn number
                messages);
                // Apply optimizations (if enabled)
                let optimizedMessages = messages;
                let optimization = {
                    enabled: false,
                    techniques: [],
                    estimatedTotalSaved: 0,
                };
                if (Object.keys(optimizationConfig).length > 0) {
                    const result = applyOptimizations(messages, optimizationConfig, this.model);
                    optimizedMessages = result.optimizedMessages;
                    optimization = result.optimization;
                }
                // Record optimized payload
                this.harness.recordOptimizedPayload(measurementId, optimizedMessages, optimization, turn.tools, { temperature: 0.7, maxTokens: 1000 });
                // Call LLM if provider available, otherwise mock
                let result;
                if (this.provider) {
                    try {
                        result = await this.provider.chat(optimizedMessages, {
                            model: this.model,
                            temperature: 0.7,
                            maxTokens: 1000,
                        });
                    }
                    catch (error) {
                        this.harness.completeMeasurement(measurementId, null, {
                            success: false,
                            error: error instanceof Error ? error.message : 'Unknown error',
                        });
                        continue;
                    }
                }
                else {
                    // Mock response
                    result = this.mockLLMResponse(optimizedMessages);
                }
                // Complete measurement with provider usage
                const providerUsage = result.usage
                    ? {
                        promptTokens: result.usage.prompt_tokens,
                        completionTokens: result.usage.completion_tokens,
                        totalTokens: result.usage.total_tokens,
                    }
                    : null;
                this.harness.completeMeasurement(measurementId, providerUsage, {
                    success: true,
                    responseChars: result.content.length,
                    finishReason: result.finish_reason,
                });
                // Add assistant response to history for next turn
                if (i < scenario.turns.length - 1 &&
                    scenario.turns[i + 1]?.role === 'assistant') {
                    // Use the pre-defined assistant response from scenario
                    messages.push(scenario.turns[i + 1]);
                    i++; // Skip the assistant turn in the loop
                }
                else {
                    // Use the actual/mocked response
                    messages.push({ role: 'assistant', content: result.content });
                }
            }
        }
    }
    /**
     * Mock LLM response for testing without API calls
     */
    mockLLMResponse(messages) {
        const lastUserMessage = [...messages]
            .reverse()
            .find((m) => m.role === 'user');
        const responseContent = `This is a mock response to: "${lastUserMessage?.content.slice(0, 50)}..."`;
        // Simulate provider token counting
        const promptTokens = messages.reduce((sum, m) => {
            return sum + estimateTokens(m.content, this.model).tokens + 4; // +4 for message overhead
        }, 3); // +3 for reply priming
        const completionTokens = estimateTokens(responseContent, this.model).tokens;
        return {
            content: responseContent,
            usage: {
                prompt_tokens: promptTokens,
                completion_tokens: completionTokens,
                total_tokens: promptTokens + completionTokens,
            },
            finish_reason: 'stop',
        };
    }
    /**
     * Compare baseline and optimized runs
     */
    compareRuns(baseline, optimized) {
        const meanInputReductionEstimated = baseline.tokens.meanEstimatedInput - optimized.tokens.meanEstimatedInput;
        const meanInputReductionActual = baseline.tokens.meanActualInput !== undefined &&
            optimized.tokens.meanActualInput !== undefined
            ? baseline.tokens.meanActualInput - optimized.tokens.meanActualInput
            : undefined;
        const percentReductionEstimated = baseline.tokens.meanEstimatedInput > 0
            ? (meanInputReductionEstimated / baseline.tokens.meanEstimatedInput) *
                100
            : 0;
        const percentReductionActual = baseline.tokens.meanActualInput !== undefined &&
            optimized.tokens.meanActualInput !== undefined &&
            baseline.tokens.meanActualInput > 0
            ? ((baseline.tokens.meanActualInput -
                optimized.tokens.meanActualInput) /
                baseline.tokens.meanActualInput) *
                100
            : undefined;
        const isEffective = percentReductionActual !== undefined
            ? percentReductionActual > 0
            : percentReductionEstimated > 0;
        const notes = [];
        if (percentReductionActual !== undefined) {
            if (percentReductionActual >= 10) {
                notes.push('✅ Significant token reduction achieved');
            }
            else if (percentReductionActual > 0) {
                notes.push('⚠️ Minor token reduction - may not be cost-effective');
            }
            else {
                notes.push('❌ No actual token reduction - optimization is PLACEBO');
            }
        }
        else {
            notes.push('⚠️ No provider usage data - cannot verify actual savings');
        }
        if (optimized.timing.meanLatencyMs > baseline.timing.meanLatencyMs + 100) {
            notes.push('⚠️ Optimization adds significant latency overhead');
        }
        return {
            baseline,
            optimized,
            tokenDelta: {
                meanInputReductionEstimated,
                meanInputReductionActual,
                percentReductionEstimated,
                percentReductionActual,
            },
            latencyImpact: {
                meanLatencyDeltaMs: optimized.timing.meanLatencyMs - baseline.timing.meanLatencyMs,
                optimizationOverheadMs: optimized.timing.meanOptimizationMs,
            },
            verdict: {
                isEffective,
                confidence: percentReductionActual !== undefined
                    ? percentReductionActual >= 10
                        ? 'high'
                        : 'medium'
                    : 'low',
                notes,
            },
        };
    }
    /**
     * Print comparison report
     */
    printComparisonReport(comparison) {
        console.log('\n' + '='.repeat(60));
        console.log('TOKEN OPTIMIZATION A/B COMPARISON REPORT');
        console.log('='.repeat(60));
        console.log('\n--- TOKEN METRICS ---');
        console.log(`Baseline mean input tokens (estimated): ${comparison.baseline.tokens.meanEstimatedInput.toFixed(1)}`);
        console.log(`Optimized mean input tokens (estimated): ${comparison.optimized.tokens.meanEstimatedInput.toFixed(1)}`);
        console.log(`Estimated reduction: ${comparison.tokenDelta.meanInputReductionEstimated.toFixed(1)} tokens (${comparison.tokenDelta.percentReductionEstimated.toFixed(1)}%)`);
        if (comparison.baseline.tokens.meanActualInput !== undefined) {
            console.log(`\nBaseline mean input tokens (actual): ${comparison.baseline.tokens.meanActualInput.toFixed(1)}`);
            console.log(`Optimized mean input tokens (actual): ${comparison.optimized.tokens.meanActualInput?.toFixed(1) ?? 'N/A'}`);
            console.log(`Actual reduction: ${comparison.tokenDelta.meanInputReductionActual?.toFixed(1) ?? 'N/A'} tokens (${comparison.tokenDelta.percentReductionActual?.toFixed(1) ?? 'N/A'}%)`);
        }
        console.log('\n--- LATENCY IMPACT ---');
        console.log(`Baseline mean latency: ${comparison.baseline.timing.meanLatencyMs.toFixed(1)}ms`);
        console.log(`Optimized mean latency: ${comparison.optimized.timing.meanLatencyMs.toFixed(1)}ms`);
        console.log(`Delta: ${comparison.latencyImpact.meanLatencyDeltaMs.toFixed(1)}ms`);
        console.log('\n--- VERDICT ---');
        console.log(`Effective: ${comparison.verdict.isEffective ? 'YES' : 'NO'}`);
        console.log(`Confidence: ${comparison.verdict.confidence.toUpperCase()}`);
        console.log('Notes:');
        comparison.verdict.notes.forEach((note) => console.log(`  ${note}`));
        console.log('\n' + '='.repeat(60));
    }
    /**
     * Export measurements to CSV
     */
    exportToCSV(outputPath) {
        this.harness.exportToCSV(outputPath);
    }
    /**
     * Get all measurements
     */
    getMeasurements() {
        return this.harness.getMeasurements();
    }
}
/**
 * Create a test runner instance
 */
export function createTestRunner(config) {
    return new TokenOptimizationTestRunner(config);
}
//# sourceMappingURL=test-runner.js.map