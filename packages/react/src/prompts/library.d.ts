/**
 * Prompt Library
 *
 * Optional collection management for prompt templates.
 * Users can build their own libraries or use this helper.
 */
import type { PromptTemplate, PromptVersion } from './types';
export declare class PromptTemplateLibrary {
    private templates;
    private versions;
    /**
     * Add a template to the library
     */
    add(template: PromptTemplate): void;
    /**
     * Get a template by ID
     */
    get(id: string): PromptTemplate | undefined;
    /**
     * Get template by name
     */
    getByName(name: string): PromptTemplate | undefined;
    /**
     * Get all templates
     */
    getAll(): PromptTemplate[];
    /**
     * Search templates by query
     */
    search(query: string): PromptTemplate[];
    /**
     * Get templates by tag
     */
    getByTag(tag: string): PromptTemplate[];
    /**
     * Remove a template
     */
    remove(id: string): boolean;
    /**
     * Save a version of a template
     */
    saveVersion(version: PromptVersion): void;
    /**
     * Get versions of a template
     */
    getVersions(templateId: string): PromptVersion[];
    /**
     * Get active version of a template
     */
    getActiveVersion(templateId: string): PromptVersion | undefined;
    /**
     * Export library to JSON
     */
    export(): string;
    /**
     * Import library from JSON
     */
    import(json: string): void;
    /**
     * Clear library
     */
    clear(): void;
}
//# sourceMappingURL=library.d.ts.map