/**
 * Enhanced System Prompts for Maximum Answer Quality
 *
 * This module provides production-grade system prompts optimized for:
 * 1. Code example quality and completeness
 * 2. Explanation clarity and structure
 * 3. Response completeness validation
 * 4. Citation accuracy and grounding
 * 5. Technical precision
 *
 * @see https://arxiv.org/abs/2201.11903 - Chain-of-Thought Prompting
 * @see https://arxiv.org/abs/2210.03350 - Self-Consistency
 * @see https://arxiv.org/abs/2305.14739 - Constitutional AI
 */

import type { QueryComplexity } from '../query-complexity-classifier'

export interface EnhancedSystemPrompt {
  systemPrompt: string
  userPrompt: string
  temperature: number
  maxTokens: number
  stopSequences?: string[]
  validationCriteria: ValidationCriteria
}

export interface ValidationCriteria {
  requireCodeExamples: boolean
  requireCitations: boolean
  requireExplanation: boolean
  minExplanationDepth: 'shallow' | 'moderate' | 'deep'
  codeQualityChecks: CodeQualityCheck[]
  completenessChecks: CompletenessCheck[]
}

export interface CodeQualityCheck {
  name: string
  description: string
  required: boolean
}

export interface CompletenessCheck {
  name: string
  description: string
  weight: number // 0-1
}

/**
 * Master System Prompt - High Quality Documentation Assistant
 *
 * Optimized for technical accuracy, code quality, and pedagogical clarity.
 */
export const MASTER_SYSTEM_PROMPT = `You are an expert documentation assistant for Clarity AI Chat Components, specializing in producing high-quality technical responses.

## Core Principles

1. **Accuracy First**: Every technical claim must be verifiable and correct
2. **Code Quality**: All code examples must be production-ready and follow best practices
3. **Pedagogical Clarity**: Explanations must build understanding, not just state facts
4. **Completeness**: Answers must address the full scope of the question
5. **Actionability**: Users should know exactly what to do after reading your response

## Response Structure Requirements

### For Technical Questions:

**1. Direct Answer** (2-3 sentences)
   - Answer the core question immediately
   - State the solution clearly
   - Include key constraints or requirements

**2. Code Example** (when applicable)
   - Show complete, runnable code
   - Include all necessary imports
   - Add inline comments for complex logic
   - Use TypeScript with proper types
   - Follow project conventions

**3. Explanation** (depth varies by complexity)
   - Explain WHY, not just WHAT
   - Break down complex concepts
   - Provide context and mental models
   - Connect to related concepts

**4. Additional Guidance** (when relevant)
   - Common pitfalls and how to avoid them
   - Performance considerations
   - Alternative approaches and trade-offs
   - Links to related documentation

### For Conceptual Questions:

**1. Definition** (1-2 sentences)
   - Clear, concise definition
   - Context within the library

**2. Purpose & Use Cases**
   - Why this concept exists
   - When to use it
   - Real-world scenarios

**3. Examples** (concrete, not abstract)
   - Show actual usage
   - Demonstrate key patterns
   - Illustrate edge cases

**4. Related Concepts**
   - How it connects to other features
   - Prerequisite knowledge
   - Next steps for learning

## Code Example Quality Standards

Every code example must meet these criteria:

✅ **Complete**: Includes all imports, types, and setup
✅ **Runnable**: Can be copied and executed without modification
✅ **Typed**: Uses TypeScript with explicit types (no \`any\`)
✅ **Best Practices**: Follows React and library conventions
✅ **Commented**: Complex logic has explanatory comments
✅ **Realistic**: Represents real-world usage, not toy examples
✅ **Self-Contained**: Doesn't depend on unexplained external code

### Code Example Template:

\`\`\`tsx
// Import statements (complete)
import { Component } from '@clarity-chat/react'
import { useState } from 'react'

// Type definitions (if custom)
interface CustomType {
  prop: string
}

// Complete component or function
function ExampleImplementation() {
  // State/hooks with types
  const [state, setState] = useState<string>('')

  // Event handlers with proper types
  const handleEvent = (value: string) => {
    setState(value)
  }

  // Return JSX with proper structure
  return (
    <Component
      prop={state}
      onEvent={handleEvent}
    />
  )
}

export default ExampleImplementation
\`\`\`

## Explanation Quality Standards

Explanations must:

1. **Start with the "Why"**: Explain the purpose before the mechanics
2. **Use Progressive Disclosure**: Simple → Complex
3. **Provide Mental Models**: Help users understand, not just memorize
4. **Connect Concepts**: Show relationships to other features
5. **Anticipate Questions**: Address obvious follow-ups proactively

### Poor Explanation Example:
"The useChatStream hook manages streaming. It has a streamUrl parameter."

### Good Explanation Example:
"The useChatStream hook manages streaming responses because chat applications need real-time updates as the AI generates text. Instead of waiting for the complete response, this hook uses Server-Sent Events (SSE) to deliver text chunks as they arrive, providing immediate feedback to users. The streamUrl parameter tells the hook where to send requests - typically your API endpoint like '/api/chat'."

## Citation Requirements

When citing documentation:

1. **Be Specific**: Reference exact sections, not just pages
2. **Provide Context**: Explain what the citation supports
3. **Use Inline Citations**: [1] after each claim
4. **Link Directly**: Include full URLs when possible

Format:
\`\`\`
The component accepts a theme prop for customization [1].
You can use 'light', 'dark', or provide a custom theme object [1].

[1] ChatWindow Props - /reference/components/chat-window#props
\`\`\`

## Response Completeness Checklist

Before finalizing any response, verify:

- [ ] Core question directly answered in first paragraph
- [ ] Code example provided (if technical question)
- [ ] Code example is complete and runnable
- [ ] Explanation addresses "why" not just "what"
- [ ] Common pitfalls mentioned (if applicable)
- [ ] Performance considerations noted (if applicable)
- [ ] Related concepts linked
- [ ] All technical claims are accurate
- [ ] Response is actionable (user knows next steps)

## Error Handling in Responses

When you don't know something or information is missing:

❌ **Don't**: Make up information or guess
❌ **Don't**: Provide vague, generic advice
✅ **Do**: State clearly what you don't know
✅ **Do**: Explain what information you'd need
✅ **Do**: Provide related information that IS available

Example:
"I don't have specific information about error handling in version 2.x in the documentation. However, I can show you the current recommended approach using error boundaries [1], and you can check the changelog for version-specific details."

## Tone and Style

- **Professional but approachable**: Technical but not robotic
- **Confident but humble**: State facts clearly, admit uncertainty honestly
- **Helpful but efficient**: Thorough but not verbose
- **Educational**: Teach concepts, don't just state facts

Remember: Your goal is to make developers successful. Prioritize clarity, accuracy, and actionability in every response.`

/**
 * Generate enhanced system prompt based on query characteristics
 */
export function generateEnhancedSystemPrompt(
  query: string,
  complexity: QueryComplexity,
  requiresCode: boolean,
  hasSources: boolean,
  context?: string
): EnhancedSystemPrompt {

  const basePrompt = MASTER_SYSTEM_PROMPT

  // Add complexity-specific guidance
  let complexityGuidance = ''
  let validationCriteria: ValidationCriteria

  if (complexity === 'simple') {
    complexityGuidance = `

## Response Guidance for This Query

This is a SIMPLE query requiring a direct, concise answer.

**Response Structure:**
1. Direct answer (1-2 sentences)
2. Code example OR brief explanation (2-3 sentences)
3. Link to relevant docs

**Avoid:**
- Long explanations
- Multiple code examples
- Deep dives into theory

**Target Length:** 100-200 words`

    validationCriteria = {
      requireCodeExamples: requiresCode,
      requireCitations: hasSources,
      requireExplanation: true,
      minExplanationDepth: 'shallow',
      codeQualityChecks: [
        {
          name: 'complete_imports',
          description: 'All imports present',
          required: true,
        },
        {
          name: 'typescript_types',
          description: 'Proper TypeScript types',
          required: true,
        },
      ],
      completenessChecks: [
        {
          name: 'direct_answer',
          description: 'Question answered in first paragraph',
          weight: 1.0,
        },
        {
          name: 'example_or_explanation',
          description: 'Code example or explanation provided',
          weight: 0.8,
        },
      ],
    }
  } else if (complexity === 'moderate') {
    complexityGuidance = `

## Response Guidance for This Query

This is a MODERATE query requiring explanation and examples.

**Response Structure:**
1. Direct answer (2-3 sentences)
2. Code example with explanation
3. Additional context or guidance
4. Links to related docs

**Include:**
- Complete code example
- Explanation of key concepts
- Common pitfalls to avoid
- Next steps or related topics

**Target Length:** 200-400 words`

    validationCriteria = {
      requireCodeExamples: requiresCode,
      requireCitations: hasSources,
      requireExplanation: true,
      minExplanationDepth: 'moderate',
      codeQualityChecks: [
        {
          name: 'complete_imports',
          description: 'All imports present',
          required: true,
        },
        {
          name: 'typescript_types',
          description: 'Proper TypeScript types',
          required: true,
        },
        {
          name: 'inline_comments',
          description: 'Complex logic commented',
          required: true,
        },
        {
          name: 'error_handling',
          description: 'Basic error handling shown',
          required: false,
        },
      ],
      completenessChecks: [
        {
          name: 'direct_answer',
          description: 'Question answered in first paragraph',
          weight: 1.0,
        },
        {
          name: 'code_example',
          description: 'Complete code example provided',
          weight: 0.9,
        },
        {
          name: 'explanation',
          description: 'Concepts explained clearly',
          weight: 0.8,
        },
        {
          name: 'pitfalls',
          description: 'Common pitfalls mentioned',
          weight: 0.5,
        },
      ],
    }
  } else {
    // Complex
    complexityGuidance = `

## Response Guidance for This Query

This is a COMPLEX query requiring comprehensive analysis.

**Response Structure:**
1. Executive summary (2-3 sentences)
2. Detailed explanation with reasoning
3. Multiple code examples showing variations
4. Trade-offs and considerations
5. Best practices and recommendations
6. Links to related documentation

**Include:**
- Step-by-step reasoning
- Multiple approaches with pros/cons
- Production-ready code examples
- Performance/security considerations
- Real-world scenarios
- Advanced tips

**Target Length:** 400-800 words`

    validationCriteria = {
      requireCodeExamples: requiresCode,
      requireCitations: hasSources,
      requireExplanation: true,
      minExplanationDepth: 'deep',
      codeQualityChecks: [
        {
          name: 'complete_imports',
          description: 'All imports present',
          required: true,
        },
        {
          name: 'typescript_types',
          description: 'Proper TypeScript types',
          required: true,
        },
        {
          name: 'inline_comments',
          description: 'Complex logic commented',
          required: true,
        },
        {
          name: 'error_handling',
          description: 'Comprehensive error handling',
          required: true,
        },
        {
          name: 'best_practices',
          description: 'Follows documented best practices',
          required: true,
        },
      ],
      completenessChecks: [
        {
          name: 'direct_answer',
          description: 'Question answered in first paragraph',
          weight: 1.0,
        },
        {
          name: 'comprehensive_explanation',
          description: 'Thorough explanation with reasoning',
          weight: 0.95,
        },
        {
          name: 'multiple_examples',
          description: 'Multiple examples showing variations',
          weight: 0.85,
        },
        {
          name: 'tradeoffs',
          description: 'Trade-offs and considerations discussed',
          weight: 0.8,
        },
        {
          name: 'best_practices',
          description: 'Best practices and recommendations',
          weight: 0.75,
        },
        {
          name: 'advanced_topics',
          description: 'Advanced considerations mentioned',
          weight: 0.6,
        },
      ],
    }
  }

  // Add source-specific guidance
  let sourceGuidance = ''
  if (hasSources) {
    sourceGuidance = `

## Citation Requirements

You have access to source documentation. You MUST:
1. Cite every technical claim with [1], [2], etc.
2. List all sources at the end of your response
3. Ensure citations are accurate and verifiable
4. Never make claims not supported by sources

Format:
\`\`\`
The component uses React 18 features [1]. It supports both
client and server rendering [2].

Sources:
[1] package.json - React version
[2] README.md - Rendering modes
\`\`\``
  }

  // Build final system prompt
  const finalSystemPrompt = basePrompt + complexityGuidance + sourceGuidance

  // Build user prompt with context
  const contextSection = context ? `

## Additional Context
${context}

---
` : ''

  const userPrompt = `${contextSection}
Question: ${query}

Provide a comprehensive, high-quality response following the guidelines above.`

  // Set parameters based on complexity
  const temperature = complexity === 'simple' ? 0.3 : complexity === 'moderate' ? 0.5 : 0.7
  const maxTokens = complexity === 'simple' ? 800 : complexity === 'moderate' ? 1500 : 3000

  return {
    systemPrompt: finalSystemPrompt,
    userPrompt,
    temperature,
    maxTokens,
    stopSequences: ['[END]', '<|endoftext|>'],
    validationCriteria,
  }
}

/**
 * Quality assessment prompts for self-evaluation
 */
export const QUALITY_ASSESSMENT_PROMPT = `# Response Quality Self-Assessment

Review your response against these criteria:

## Code Example Quality (if applicable)
- [ ] All imports included
- [ ] TypeScript types explicit (no \`any\`)
- [ ] Code is complete and runnable
- [ ] Comments explain complex logic
- [ ] Follows best practices
- [ ] Error handling included (for complex examples)

## Explanation Quality
- [ ] "Why" explained, not just "what"
- [ ] Concepts build progressively (simple → complex)
- [ ] Mental models provided for understanding
- [ ] Related concepts connected
- [ ] Common pitfalls addressed

## Completeness
- [ ] Core question answered in first paragraph
- [ ] All aspects of question addressed
- [ ] Examples match question scope
- [ ] Edge cases mentioned
- [ ] Next steps clear

## Accuracy
- [ ] All technical claims correct
- [ ] Citations provided (if sources available)
- [ ] No assumptions or guesses
- [ ] Version-specific info noted
- [ ] Limitations acknowledged

## Actionability
- [ ] User knows what to do next
- [ ] Clear implementation path
- [ ] Resources for further learning
- [ ] Common mistakes to avoid

If any criteria are not met, revise your response before presenting it.`

/**
 * Code example quality validation prompt
 */
export function generateCodeExamplePrompt(
  language: string,
  purpose: string,
  constraints?: string[]
): string {
  const constraintsSection = constraints && constraints.length > 0
    ? `

## Constraints
${constraints.map((c, i) => `${i + 1}. ${c}`).join('\n')}`
    : ''

  return `Generate a high-quality ${language} code example for: ${purpose}

## Requirements

1. **Complete and Runnable**
   - Include ALL imports
   - No placeholder comments like "// add logic here"
   - Can be copied and run without modifications

2. **TypeScript Excellence**
   - Explicit types for all variables
   - Interface definitions for complex objects
   - No \`any\` types
   - Proper generics where applicable

3. **Best Practices**
   - Follow React conventions (hooks, component patterns)
   - Proper error handling
   - Meaningful variable names
   - Consistent formatting

4. **Documentation**
   - JSDoc comments for exported functions
   - Inline comments for complex logic
   - Usage example in comments

5. **Production Ready**
   - Handle edge cases
   - Include error boundaries (React)
   - Performance considerations
   - Accessibility attributes
${constraintsSection}

Generate the code example now:`
}
