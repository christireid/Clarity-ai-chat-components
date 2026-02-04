/**
 * Chain-of-Thought (CoT) Prompting
 *
 * Implements zero-shot and few-shot chain-of-thought prompting
 * to improve reasoning quality for complex queries
 */

import { QueryComplexity } from './query-complexity-classifier'

export interface CoTPrompt {
  systemPrompt: string
  userPrompt: string
}

/**
 * Generate Chain-of-Thought prompt based on query complexity
 *
 * - Simple queries: Direct answering without CoT
 * - Moderate queries: Structured thinking
 * - Complex queries: Full step-by-step reasoning
 *
 * @param query - The user's query
 * @param complexity - Query complexity level
 * @param context - Retrieved context chunks
 * @returns CoT prompt configuration
 */
export function generateCoTPrompt(
  query: string,
  complexity: QueryComplexity,
  context: string[]
): CoTPrompt {
  if (complexity === QueryComplexity.SIMPLE) {
    // Simple queries don't need Chain-of-Thought
    return {
      systemPrompt: `You are a helpful documentation assistant for Clarity AI Chat Components. Provide clear, concise answers based on the provided context.

RULES:
- Answer directly and concisely
- Use only information from the context
- If the answer isn't in the context, say "I don't have information about that in the documentation"`,
      userPrompt: `Context:\n${context.join('\n\n')}\n\nQuestion: ${query}`,
    }
  }

  if (complexity === QueryComplexity.MODERATE) {
    // Moderate queries benefit from structured thinking
    return {
      systemPrompt: `You are a helpful documentation assistant for Clarity AI Chat Components. For each question:
1. Identify the key concepts involved
2. Explain each concept clearly
3. Provide a direct answer

RULES:
- Base your response only on the provided context
- Structure your answer with clear sections
- Use examples from the context when available`,
      userPrompt: `Context:\n${context.join('\n\n')}\n\nQuestion: ${query}`,
    }
  }

  // Complex queries use full Chain-of-Thought
  return {
    systemPrompt: `You are a helpful documentation assistant for Clarity AI Chat Components. For complex questions, think step by step:

1. Break down the question into sub-questions
2. Answer each sub-question using the provided context
3. Synthesize the answers into a comprehensive response
4. Identify any trade-offs or considerations

RULES:
- Let's think step by step
- Show your reasoning process
- Base all claims on the provided context
- Acknowledge limitations if context is insufficient`,
    userPrompt: `Context:\n${context.join('\n\n')}\n\nQuestion: ${query}\n\nLet's approach this systematically:`,
  }
}

/**
 * Generate Few-Shot Chain-of-Thought prompt with examples
 *
 * Includes demonstration examples to guide reasoning
 *
 * @param query - The user's query
 * @param context - Retrieved context chunks
 * @returns CoT prompt with examples
 */
export function generateFewShotCoTPrompt(query: string, context: string[]): CoTPrompt {
  return {
    systemPrompt: `You are a helpful documentation assistant. Follow this reasoning pattern:

Example 1:
Q: "What is the difference between useClarity and useChatStream?"
A: Let me break this down:
1. First, let's identify what useClarity does...
2. Next, let's examine useChatStream...
3. Now I can compare them directly...
4. The key differences are...

Follow this structured reasoning approach for all questions.`,
    userPrompt: `Context:\n${context.join('\n\n')}\n\nQuestion: ${query}\n\nThinking step by step:`,
  }
}

/**
 * Generate Self-Consistency CoT prompt
 *
 * Prompts for multiple reasoning paths to improve reliability
 *
 * @param query - The user's query
 * @param context - Retrieved context chunks
 * @returns Self-consistency prompt
 */
export function generateSelfConsistencyPrompt(query: string, context: string[]): CoTPrompt {
  return {
    systemPrompt: `You are a documentation assistant that considers multiple perspectives before answering.

For each question:
1. Consider different ways to interpret the question
2. Explore multiple reasoning paths
3. Identify the most consistent answer across paths
4. Present the final answer with high confidence`,
    userPrompt: `Context:\n${context.join('\n\n')}\n\nQuestion: ${query}\n\nConsider multiple approaches:`,
  }
}
