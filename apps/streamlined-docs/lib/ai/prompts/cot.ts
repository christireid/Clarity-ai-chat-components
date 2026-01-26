/**
 * Chain-of-Thought (CoT) Prompting
 *
 * Implements zero-shot Chain-of-Thought prompting for complex queries.
 * Simple queries get direct answers, complex queries get step-by-step reasoning.
 *
 * Research: "Let's think step by step" significantly improves reasoning accuracy
 * (Kojima et al., 2022 - Large Language Models are Zero-Shot Reasoners)
 */

import { QueryComplexity } from '../complexity'

export interface CoTPrompt {
  systemPrompt: string
  userPrompt: string
  temperature: number
}

/**
 * Generate Chain-of-Thought prompt based on query complexity
 *
 * @param query - User's question
 * @param complexity - Classified complexity level
 * @param context - Retrieved documentation chunks
 * @returns Optimized prompt with appropriate CoT strategy
 */
export function generateCoTPrompt(
  query: string,
  complexity: QueryComplexity,
  context: string[]
): CoTPrompt {
  const formattedContext = context.join('\n\n---\n\n')

  if (complexity === QueryComplexity.SIMPLE) {
    // Simple queries: Direct, concise answers
    return {
      systemPrompt: `You are a helpful documentation assistant for Clarity AI Chat Components.

INSTRUCTIONS:
1. Provide clear, concise answers based ONLY on the provided context
2. If the answer is not in the context, say "I don't have information about that in the documentation"
3. Use simple, direct language
4. Keep responses brief and to the point`,

      userPrompt: `Context from documentation:
${formattedContext}

Question: ${query}

Answer:`,

      temperature: 0.3, // Lower temperature for deterministic, focused responses
    }
  }

  if (complexity === QueryComplexity.MODERATE) {
    // Moderate queries: Structured thinking with clear steps
    return {
      systemPrompt: `You are a helpful documentation assistant for Clarity AI Chat Components.

INSTRUCTIONS:
1. Identify the key concepts in the question
2. Explain each concept clearly using the provided context
3. Provide a direct answer with examples if available
4. Use ONLY information from the provided context
5. If information is missing, clearly state what you don't know`,

      userPrompt: `Context from documentation:
${formattedContext}

Question: ${query}

Let me address this step by step:`,

      temperature: 0.5, // Moderate temperature for balanced responses
    }
  }

  // Complex queries: Full Chain-of-Thought reasoning
  return {
    systemPrompt: `You are a helpful documentation assistant for Clarity AI Chat Components.

INSTRUCTIONS - Think step by step:
1. Break down the question into sub-questions
2. Answer each sub-question using the provided context
3. Synthesize the answers into a comprehensive response
4. Identify trade-offs, best practices, or considerations
5. Provide code examples when relevant
6. Use ONLY information from the provided context
7. If you need to make inferences, clearly label them as such

Base all responses on the documentation context. Let's think step by step.`,

    userPrompt: `Context from documentation:
${formattedContext}

Question: ${query}

Let me approach this systematically:

Step 1: Understanding the question
Step 2: Analyzing the documentation
Step 3: Providing a comprehensive answer`,

    temperature: 0.7, // Higher temperature for creative synthesis
  }
}

/**
 * Enhanced CoT prompt with self-reflection for critical queries
 *
 * @param query - User's question
 * @param context - Retrieved documentation chunks
 * @returns Prompt with reflection step to verify answer quality
 */
export function generateReflectiveCoTPrompt(
  query: string,
  context: string[]
): CoTPrompt {
  const formattedContext = context.join('\n\n---\n\n')

  return {
    systemPrompt: `You are a helpful documentation assistant for Clarity AI Chat Components.

INSTRUCTIONS - Use reflective Chain-of-Thought:
1. Provide an initial answer based on the documentation
2. Reflect on your answer: Is it complete? Is it accurate? Are there edge cases?
3. Revise your answer if needed
4. Provide the final, refined answer

This ensures high-quality, well-considered responses.`,

    userPrompt: `Context from documentation:
${formattedContext}

Question: ${query}

Initial reasoning:
[Think through the answer]

Reflection:
[Check for completeness and accuracy]

Final answer:
[Provide the refined answer]`,

    temperature: 0.6,
  }
}
