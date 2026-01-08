/**
 * Prompt Structure Optimization
 *
 * Implements optimal prompt structuring based on LLM attention patterns.
 * Research shows LLMs pay most attention to the beginning and end of prompts,
 * with less attention to the middle ("lost in the middle" phenomenon).
 *
 * Key strategies:
 * 1. Place instructions/questions at the END of prompts
 * 2. Put critical context at the BEGINNING
 * 3. Place reference material (less critical) in the MIDDLE
 *
 * @module utils/prompt-structure
 */
import { estimateTokens } from '../tokenization/estimator';
/**
 * Optimal placement rules for different section types
 * Based on LLM attention pattern research
 */
const PLACEMENT_RULES = {
    // Instructions go at the end for better attention
    instruction: 'end',
    // Questions MUST go at the end
    question: 'end',
    // Constraints go at the end (close to action)
    constraint: 'end',
    // Critical context goes at the beginning
    context: 'beginning',
    // Reference material can go in the middle
    reference: 'middle',
    // Examples at the beginning (few-shot learning)
    example: 'beginning',
};
/**
 * Build an optimally structured prompt from sections
 *
 * Uses the "Question at End" structure to optimize for LLM attention:
 * - Beginning: Context, examples (primacy effect)
 * - Middle: Reference material (lowest attention)
 * - End: Instructions, questions, constraints (recency effect)
 *
 * @example
 * ```ts
 * const prompt = buildStructuredPrompt([
 *   { content: 'You are a helpful assistant.', type: 'context', priority: 'critical' },
 *   { content: 'Here is a document...', type: 'reference', priority: 'medium' },
 *   { content: 'Summarize the key points.', type: 'question', priority: 'critical' },
 * ])
 * // Result: context at start, reference in middle, question at end
 * ```
 */
export function buildStructuredPrompt(sections, options = {}) {
    const { includeSectionHeaders = false, maxTokens, separator = '\n\n', forceQuestionAtEnd = true, } = options;
    // Sort sections by optimal placement
    const beginning = [];
    const middle = [];
    const end = [];
    for (const section of sections) {
        const placement = forceQuestionAtEnd && section.type === 'question'
            ? 'end'
            : PLACEMENT_RULES[section.type];
        switch (placement) {
            case 'beginning':
                beginning.push(section);
                break;
            case 'middle':
                middle.push(section);
                break;
            case 'end':
                end.push(section);
                break;
        }
    }
    // Sort within each group by priority
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    const sortByPriority = (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority];
    beginning.sort(sortByPriority);
    middle.sort(sortByPriority);
    // End sections: put questions LAST (after instructions and constraints)
    end.sort((a, b) => {
        if (a.type === 'question' && b.type !== 'question')
            return 1;
        if (a.type !== 'question' && b.type === 'question')
            return -1;
        return sortByPriority(a, b);
    });
    // Build the prompt
    const allSections = [...beginning, ...middle, ...end];
    const sectionContents = [];
    const sectionBreakdown = [];
    for (const section of allSections) {
        let content = section.content;
        if (includeSectionHeaders && section.label) {
            content = `## ${section.label}\n${content}`;
        }
        // Determine position for breakdown
        let position;
        if (beginning.includes(section))
            position = 'beginning';
        else if (middle.includes(section))
            position = 'middle';
        else
            position = 'end';
        sectionContents.push(content);
        sectionBreakdown.push({
            label: section.label,
            type: section.type,
            position,
            tokens: estimateTokens(content),
        });
    }
    const userContent = sectionContents.join(separator);
    const userTokens = estimateTokens(userContent);
    // Enforce max tokens if specified
    if (maxTokens && userTokens > maxTokens) {
        return buildTruncatedPrompt(allSections, maxTokens, options);
    }
    return {
        user: userContent,
        tokens: {
            system: 0,
            user: userTokens,
            total: userTokens,
        },
        sections: sectionBreakdown,
    };
}
/**
 * Build a truncated prompt that fits within token budget
 * Preserves critical sections, trims low-priority middle sections
 */
function buildTruncatedPrompt(sections, maxTokens, options) {
    // Sort by priority to know what to keep
    const sorted = [...sections].sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    // Always keep critical and high priority, plus any questions
    const mustKeep = sorted.filter((s) => s.priority === 'critical' ||
        s.priority === 'high' ||
        s.type === 'question');
    // Try to fit remaining sections
    const remaining = sorted.filter((s) => !mustKeep.includes(s));
    let currentSections = [...mustKeep];
    let currentTokens = currentSections.reduce((sum, s) => sum + estimateTokens(s.content), 0);
    for (const section of remaining) {
        const sectionTokens = estimateTokens(section.content);
        if (currentTokens + sectionTokens <= maxTokens) {
            currentSections.push(section);
            currentTokens += sectionTokens;
        }
    }
    // Rebuild with remaining sections
    return buildStructuredPrompt(currentSections, {
        ...options,
        maxTokens: undefined,
    });
}
/**
 * Restructure an existing prompt to optimize for LLM attention
 *
 * Takes a flat prompt and reorganizes it using heuristics to detect
 * different section types.
 *
 * @example
 * ```ts
 * const optimized = restructurePrompt(
 *   "Here's some context... [long document] What should I do about X?"
 * )
 * // Moves the question to the end, context to beginning
 * ```
 */
export function restructurePrompt(prompt, options = {}) {
    const sections = detectSections(prompt);
    return buildStructuredPrompt(sections, options);
}
/**
 * Detect sections in a prompt using heuristics
 */
function detectSections(prompt) {
    const sections = [];
    const paragraphs = prompt.split(/\n\n+/);
    for (const paragraph of paragraphs) {
        if (!paragraph.trim())
            continue;
        const section = classifyParagraph(paragraph);
        sections.push(section);
    }
    return sections;
}
/**
 * Classify a paragraph into a prompt section
 */
function classifyParagraph(text) {
    const lower = text.toLowerCase().trim();
    // Question detection
    if (lower.endsWith('?') ||
        lower.startsWith('what ') ||
        lower.startsWith('how ') ||
        lower.startsWith('why ') ||
        lower.startsWith('when ') ||
        lower.startsWith('where ') ||
        lower.startsWith('who ') ||
        lower.startsWith('which ') ||
        lower.startsWith('can you ') ||
        lower.startsWith('could you ') ||
        lower.startsWith('would you ') ||
        lower.startsWith('please ')) {
        return {
            content: text,
            type: 'question',
            priority: 'critical',
        };
    }
    // Instruction detection
    if (lower.startsWith('you are ') ||
        lower.startsWith('act as ') ||
        lower.startsWith('behave as ') ||
        lower.startsWith('respond as ') ||
        lower.includes('your task is') ||
        lower.includes('you should') ||
        lower.includes('you must') ||
        lower.includes('make sure to')) {
        return {
            content: text,
            type: 'instruction',
            priority: 'high',
        };
    }
    // Constraint detection
    if (lower.startsWith('do not ') ||
        lower.startsWith("don't ") ||
        lower.startsWith('never ') ||
        lower.startsWith('always ') ||
        lower.startsWith('only ') ||
        lower.includes('must not') ||
        lower.includes('should not') ||
        lower.includes('avoid ')) {
        return {
            content: text,
            type: 'constraint',
            priority: 'high',
        };
    }
    // Example detection
    if (lower.startsWith('example:') ||
        lower.startsWith('for example') ||
        lower.startsWith('e.g.') ||
        lower.startsWith('such as:') ||
        lower.includes('here is an example') ||
        lower.includes('for instance')) {
        return {
            content: text,
            type: 'example',
            priority: 'medium',
        };
    }
    // Context detection (short, high-level statements)
    if (text.length < 200) {
        return {
            content: text,
            type: 'context',
            priority: 'medium',
        };
    }
    // Reference detection (long blocks, likely documents/data)
    return {
        content: text,
        type: 'reference',
        priority: 'low',
    };
}
/**
 * Create a RAG-optimized prompt structure
 *
 * For retrieval-augmented generation, places retrieved documents
 * in the middle with the question at the end.
 *
 * @example
 * ```ts
 * const prompt = createRAGPrompt({
 *   systemContext: 'You are a helpful assistant.',
 *   retrievedDocuments: [doc1, doc2, doc3],
 *   userQuestion: 'What is the main topic?'
 * })
 * ```
 */
export function createRAGPrompt(params) {
    const { systemContext, retrievedDocuments, userQuestion, maxDocumentTokens } = params;
    const sections = [];
    // System context at beginning
    if (systemContext) {
        sections.push({
            content: systemContext,
            type: 'context',
            priority: 'critical',
            label: 'Context',
        });
    }
    // Documents in middle (reference material)
    for (let i = 0; i < retrievedDocuments.length; i++) {
        let doc = retrievedDocuments[i];
        // Truncate if needed
        if (maxDocumentTokens) {
            const docTokens = estimateTokens(doc);
            if (docTokens > maxDocumentTokens) {
                const ratio = maxDocumentTokens / docTokens;
                doc = doc.substring(0, Math.floor(doc.length * ratio)) + '...';
            }
        }
        sections.push({
            content: doc,
            type: 'reference',
            priority: 'medium',
            label: `Document ${i + 1}`,
        });
    }
    // User question at end
    sections.push({
        content: userQuestion,
        type: 'question',
        priority: 'critical',
        label: 'Question',
    });
    return buildStructuredPrompt(sections, {
        includeSectionHeaders: true,
        forceQuestionAtEnd: true,
    });
}
/**
 * Create a few-shot prompt with examples at the beginning
 *
 * @example
 * ```ts
 * const prompt = createFewShotPrompt({
 *   instruction: 'Classify the sentiment',
 *   examples: [
 *     { input: 'I love this!', output: 'positive' },
 *     { input: 'This is terrible', output: 'negative' }
 *   ],
 *   query: 'Not bad at all'
 * })
 * ```
 */
export function createFewShotPrompt(params) {
    const { instruction, examples, query, exampleFormat = (i, o) => `Input: ${i}\nOutput: ${o}`, } = params;
    const sections = [];
    // Instruction at beginning (for few-shot, instruction before examples works well)
    sections.push({
        content: instruction,
        type: 'instruction',
        priority: 'critical',
        label: 'Task',
    });
    // Examples at beginning (primacy for pattern learning)
    const exampleContent = examples
        .map(({ input, output }) => exampleFormat(input, output))
        .join('\n\n');
    sections.push({
        content: exampleContent,
        type: 'example',
        priority: 'high',
        label: 'Examples',
    });
    // Query at end
    sections.push({
        content: `Input: ${query}\nOutput:`,
        type: 'question',
        priority: 'critical',
        label: 'Query',
    });
    return buildStructuredPrompt(sections, {
        includeSectionHeaders: true,
        forceQuestionAtEnd: true,
    });
}
/**
 * Estimate attention distribution across prompt sections
 *
 * Based on "Lost in the Middle" research, LLMs allocate attention:
 * - ~40% to beginning (primacy effect)
 * - ~20% to middle
 * - ~40% to end (recency effect)
 */
export function estimateAttentionDistribution(prompt) {
    const beginning = prompt.sections.filter((s) => s.position === 'beginning');
    const middle = prompt.sections.filter((s) => s.position === 'middle');
    const end = prompt.sections.filter((s) => s.position === 'end');
    const beginningTokens = beginning.reduce((sum, s) => sum + s.tokens, 0);
    const middleTokens = middle.reduce((sum, s) => sum + s.tokens, 0);
    const endTokens = end.reduce((sum, s) => sum + s.tokens, 0);
    const totalTokens = beginningTokens + middleTokens + endTokens;
    // Attention weights based on research
    const BEGINNING_ATTENTION = 0.4;
    const MIDDLE_ATTENTION = 0.2;
    const END_ATTENTION = 0.4;
    return {
        beginning: {
            tokens: beginningTokens,
            attention: totalTokens > 0
                ? BEGINNING_ATTENTION * (beginningTokens / totalTokens)
                : 0,
            sections: beginning.map((s) => s.label || s.type),
        },
        middle: {
            tokens: middleTokens,
            attention: totalTokens > 0 ? MIDDLE_ATTENTION * (middleTokens / totalTokens) : 0,
            sections: middle.map((s) => s.label || s.type),
        },
        end: {
            tokens: endTokens,
            attention: totalTokens > 0 ? END_ATTENTION * (endTokens / totalTokens) : 0,
            sections: end.map((s) => s.label || s.type),
        },
    };
}
//# sourceMappingURL=prompt-structure.js.map