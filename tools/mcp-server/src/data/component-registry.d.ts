/**
 * Clarity Chat Component Registry
 *
 * Comprehensive metadata for all 70+ React components and 35+ hooks.
 * This data powers component discovery, documentation lookup, and code generation.
 */
import type { ComponentCategory } from '../utils/schemas.js';
export interface ComponentMeta {
    name: string;
    displayName: string;
    description: string;
    category: ComponentCategory;
    package: string;
    importPath: string;
    props: PropMeta[];
    examples: ExampleMeta[];
    relatedComponents: string[];
    accessibility: AccessibilityMeta;
    tags: string[];
}
export interface PropMeta {
    name: string;
    type: string;
    required: boolean;
    default?: string;
    description: string;
}
export interface ExampleMeta {
    title: string;
    description: string;
    code: string;
}
export interface AccessibilityMeta {
    wcagLevel: 'A' | 'AA' | 'AAA';
    keyboardSupport: string[];
    ariaAttributes: string[];
    screenReaderNotes: string;
    focusManagement: string;
}
export interface HookMeta {
    name: string;
    displayName: string;
    description: string;
    package: string;
    importPath: string;
    parameters: ParameterMeta[];
    returns: ReturnMeta;
    examples: ExampleMeta[];
    relatedHooks: string[];
    tags: string[];
}
export interface ParameterMeta {
    name: string;
    type: string;
    required: boolean;
    default?: string;
    description: string;
}
export interface ReturnMeta {
    type: string;
    description: string;
    properties?: {
        name: string;
        type: string;
        description: string;
    }[];
}
export declare const COMPONENTS: ComponentMeta[];
export declare const HOOKS: HookMeta[];
/**
 * Search components with fuzzy matching and relevance scoring
 */
export declare function searchComponents(query: string, options?: {
    category?: ComponentCategory;
    limit?: number;
}): ComponentMeta[];
/**
 * Search hooks with fuzzy matching and relevance scoring
 */
export declare function searchHooks(query: string, options?: {
    limit?: number;
}): HookMeta[];
/**
 * Get component by name
 */
export declare function getComponent(name: string): ComponentMeta | undefined;
/**
 * Get hook by name
 */
export declare function getHook(name: string): HookMeta | undefined;
/**
 * Get related components
 */
export declare function getRelatedComponents(componentName: string): ComponentMeta[];
/**
 * Get components by category
 */
export declare function getComponentsByCategory(category: ComponentCategory): ComponentMeta[];
/**
 * Get all categories with counts
 */
export declare function getCategoryStats(): {
    category: ComponentCategory;
    count: number;
}[];
//# sourceMappingURL=component-registry.d.ts.map