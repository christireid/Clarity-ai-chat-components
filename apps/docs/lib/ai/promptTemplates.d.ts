/**
 * System Prompt Templates
 *
 * Multiple AI personality modes for different user preferences and use cases.
 * Users can switch between modes to customize the assistant's behavior.
 */
export interface PromptTemplate {
    id: string;
    name: string;
    description: string;
    emoji: string;
    prompt: string;
    tags: string[];
}
/**
 * All available prompt templates
 */
export declare const PROMPT_TEMPLATES: PromptTemplate[];
/**
 * Get prompt template by ID
 */
export declare function getPromptTemplate(id: string): PromptTemplate | undefined;
/**
 * Get default prompt template
 */
export declare function getDefaultPromptTemplate(): PromptTemplate;
/**
 * Get prompt content by ID, fallback to default
 */
export declare function getPromptById(id: string): string;
/**
 * Search prompt templates by tags
 */
export declare function searchPromptTemplates(tags: string[]): PromptTemplate[];
//# sourceMappingURL=promptTemplates.d.ts.map