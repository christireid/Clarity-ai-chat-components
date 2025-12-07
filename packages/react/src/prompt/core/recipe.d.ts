/**
 * Prompt Recipe System
 *
 * Reusable prompt templates that can be parameterized and composed.
 */
import type { CoreMessage } from '../../hooks/use-chat-enhanced';
import type { ToonNode } from './toon';
/**
 * Prompt recipe definition
 */
export interface PromptRecipe {
    /** Unique recipe name */
    name: string;
    /** Recipe description */
    description?: string;
    /** System prompt template */
    systemPrompt?: string | ToonNode[];
    /** User message template */
    userMessage?: string | ToonNode[];
    /** Default variables */
    defaultVariables?: Record<string, unknown>;
    /** Required variable names */
    requiredVariables?: string[];
    /** Optional metadata */
    metadata?: {
        author?: string;
        version?: string;
        tags?: string[];
    };
}
/**
 * Create a prompt recipe
 */
export declare function createPromptRecipe(recipe: PromptRecipe): PromptRecipe;
/**
 * Build messages from a recipe
 */
export declare function buildMessagesFromRecipe(recipe: PromptRecipe, variables?: Record<string, unknown>): CoreMessage[];
/**
 * Built-in prompt recipes
 */
export declare const BUILT_IN_RECIPES: Record<string, PromptRecipe>;
/**
 * Get a built-in recipe by name
 */
export declare function getBuiltInRecipe(name: string): PromptRecipe | undefined;
/**
 * Merge recipes (later recipes override earlier ones)
 */
export declare function mergeRecipes(...recipes: PromptRecipe[]): PromptRecipe;
//# sourceMappingURL=recipe.d.ts.map