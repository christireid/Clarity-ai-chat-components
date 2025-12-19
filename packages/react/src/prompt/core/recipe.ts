/**
 * Prompt Recipe System
 *
 * Reusable prompt templates that can be parameterized and composed.
 */

import type { CoreMessage } from '../../hooks/chat/use-chat-enhanced'
import type { ToonNode } from './toon'
import { toonToMessages } from './toon'

/**
 * Prompt recipe definition
 */
export interface PromptRecipe {
  /** Unique recipe name */
  name: string
  /** Recipe description */
  description?: string
  /** System prompt template */
  systemPrompt?: string | ToonNode[]
  /** User message template */
  userMessage?: string | ToonNode[]
  /** Default variables */
  defaultVariables?: Record<string, unknown>
  /** Required variable names */
  requiredVariables?: string[]
  /** Optional metadata */
  metadata?: {
    author?: string
    version?: string
    tags?: string[]
  }
}

/**
 * Create a prompt recipe
 */
export function createPromptRecipe(recipe: PromptRecipe): PromptRecipe {
  return {
    ...recipe,
    defaultVariables: recipe.defaultVariables ?? {},
    requiredVariables: recipe.requiredVariables ?? [],
  }
}

/**
 * Build messages from a recipe
 */
export function buildMessagesFromRecipe(
  recipe: PromptRecipe,
  variables: Record<string, unknown> = {}
): CoreMessage[] {
  const messages: CoreMessage[] = []
  const mergedVariables = { ...recipe.defaultVariables, ...variables }

  // Validate required variables
  for (const required of recipe.requiredVariables ?? []) {
    if (
      !(required in mergedVariables) ||
      mergedVariables[required] === undefined
    ) {
      throw new Error(
        `Required variable "${required}" is missing for recipe "${recipe.name}"`
      )
    }
  }

  // Build system message
  if (recipe.systemPrompt) {
    if (typeof recipe.systemPrompt === 'string') {
      const content = interpolateTemplate(recipe.systemPrompt, mergedVariables)
      if (content) {
        messages.push({ role: 'system', content } as CoreMessage)
      }
    } else {
      const toonMessages = toonToMessages(recipe.systemPrompt, mergedVariables)
      // Ensure system role
      for (const msg of toonMessages) {
        messages.push({ ...msg, role: 'system' } as CoreMessage)
      }
    }
  }

  // Build user message
  if (recipe.userMessage) {
    if (typeof recipe.userMessage === 'string') {
      const content = interpolateTemplate(recipe.userMessage, mergedVariables)
      if (content) {
        messages.push({ role: 'user', content } as CoreMessage)
      }
    } else {
      const toonMessages = toonToMessages(recipe.userMessage, mergedVariables)
      // Ensure user role
      for (const msg of toonMessages) {
        messages.push({ ...msg, role: 'user' } as CoreMessage)
      }
    }
  }

  return messages
}

/**
 * Interpolate template variables
 */
function interpolateTemplate(
  template: string,
  variables: Record<string, unknown>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    if (key in variables && variables[key] !== undefined) {
      return String(variables[key])
    }
    return match
  })
}

/**
 * Built-in prompt recipes
 */
export const BUILT_IN_RECIPES: Record<string, PromptRecipe> = {
  /**
   * Simple chatbot recipe
   */
  chatbot: createPromptRecipe({
    name: 'chatbot',
    description: 'A friendly, helpful chatbot',
    systemPrompt: `You are a helpful, friendly assistant.
Your goal is to assist users with their questions and tasks.
Be concise but thorough in your responses.
{{personality}}`,
    defaultVariables: {
      personality: '',
    },
    metadata: {
      tags: ['chat', 'general'],
    },
  }),

  /**
   * Question-answering recipe
   */
  qa: createPromptRecipe({
    name: 'qa',
    description: 'Question answering with context',
    systemPrompt: `You are a knowledgeable assistant that answers questions based on provided context.
If the answer cannot be found in the context, say so honestly.

Context:
{{context}}`,
    userMessage: '{{question}}',
    requiredVariables: ['context', 'question'],
    metadata: {
      tags: ['qa', 'rag'],
    },
  }),

  /**
   * Tool-using agent recipe
   */
  toolAgent: createPromptRecipe({
    name: 'tool-agent',
    description: 'An agent that can use tools',
    systemPrompt: `You are an AI assistant with access to tools.
Use the available tools to help the user accomplish their goals.

Available tools:
{{tools}}

When you need to use a tool, respond with a tool call in the following format:
<tool_call>
{"name": "tool_name", "arguments": {...}}
</tool_call>

After receiving tool results, incorporate them into your response.`,
    requiredVariables: ['tools'],
    metadata: {
      tags: ['agent', 'tools'],
    },
  }),

  /**
   * Summarization recipe
   */
  summarizer: createPromptRecipe({
    name: 'summarizer',
    description: 'Summarize text content',
    systemPrompt: `You are a skilled summarizer. Create clear, concise summaries that capture the key points.
{{instructions}}`,
    userMessage: `Please summarize the following content:

{{content}}`,
    requiredVariables: ['content'],
    defaultVariables: {
      instructions: 'Focus on the main ideas and key takeaways.',
    },
    metadata: {
      tags: ['summarization'],
    },
  }),

  /**
   * Code assistant recipe
   */
  codeAssistant: createPromptRecipe({
    name: 'code-assistant',
    description: 'Programming and coding help',
    systemPrompt: `You are an expert programmer and software engineer.
Help users with coding questions, debugging, and best practices.
{{language}}
{{style}}`,
    defaultVariables: {
      language: 'You are proficient in all major programming languages.',
      style: 'Provide clean, well-documented code examples when appropriate.',
    },
    metadata: {
      tags: ['coding', 'programming'],
    },
  }),

  /**
   * Creative writing recipe
   */
  creativeWriter: createPromptRecipe({
    name: 'creative-writer',
    description: 'Creative writing assistance',
    systemPrompt: `You are a creative writing assistant with a talent for storytelling.
Help users develop their creative writing projects with imaginative and engaging content.
{{genre}}
{{tone}}`,
    defaultVariables: {
      genre: '',
      tone: 'Be creative and expressive while maintaining coherence.',
    },
    metadata: {
      tags: ['creative', 'writing'],
    },
  }),

  /**
   * Data analyst recipe
   */
  dataAnalyst: createPromptRecipe({
    name: 'data-analyst',
    description: 'Data analysis and insights',
    systemPrompt: `You are a data analyst who helps interpret data and provide insights.
Present findings clearly with supporting evidence from the data.
{{dataDescription}}`,
    userMessage: `Analyze the following data:

{{data}}

{{analysisRequest}}`,
    requiredVariables: ['data', 'analysisRequest'],
    defaultVariables: {
      dataDescription: '',
    },
    metadata: {
      tags: ['data', 'analysis'],
    },
  }),
}

/**
 * Get a built-in recipe by name
 */
export function getBuiltInRecipe(name: string): PromptRecipe | undefined {
  return BUILT_IN_RECIPES[name]
}

/**
 * Merge recipes (later recipes override earlier ones)
 */
export function mergeRecipes(...recipes: PromptRecipe[]): PromptRecipe {
  if (recipes.length === 0) {
    throw new Error('At least one recipe is required')
  }

  const base = recipes[0]
  const merged: PromptRecipe = {
    name: base.name,
    description: base.description,
    systemPrompt: base.systemPrompt,
    userMessage: base.userMessage,
    defaultVariables: { ...base.defaultVariables },
    requiredVariables: [...(base.requiredVariables ?? [])],
    metadata: { ...base.metadata },
  }

  for (let i = 1; i < recipes.length; i++) {
    const recipe = recipes[i]

    if (recipe.name) merged.name = recipe.name
    if (recipe.description) merged.description = recipe.description
    if (recipe.systemPrompt) merged.systemPrompt = recipe.systemPrompt
    if (recipe.userMessage) merged.userMessage = recipe.userMessage
    if (recipe.defaultVariables) {
      merged.defaultVariables = {
        ...merged.defaultVariables,
        ...recipe.defaultVariables,
      }
    }
    if (recipe.requiredVariables) {
      merged.requiredVariables = [
        ...new Set([
          ...(merged.requiredVariables ?? []),
          ...recipe.requiredVariables,
        ]),
      ]
    }
    if (recipe.metadata) {
      merged.metadata = { ...merged.metadata, ...recipe.metadata }
    }
  }

  return merged
}
