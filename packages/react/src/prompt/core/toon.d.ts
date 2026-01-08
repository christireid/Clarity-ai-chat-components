/**
 * Toon Prompt DSL
 *
 * A composable, type-safe DSL for building prompts.
 * Toon nodes can be combined to create complex prompt structures.
 */
import type { CoreMessage } from '../../hooks/chat/use-chat-enhanced';
/**
 * Base toon node type
 */
export interface ToonNodeBase {
    type: string;
    /** Optional importance score (0-10) for prioritization */
    importance?: number;
    /** Optional compression hint */
    compressStrategy?: 'keep' | 'summarize' | 'drop';
    /** Optional semantic signature for embedding-based matching */
    semanticSignature?: string;
}
/**
 * Plain text node
 */
export interface ToonText extends ToonNodeBase {
    type: 'text';
    content: string;
}
/**
 * Variable placeholder node
 */
export interface ToonVariable extends ToonNodeBase {
    type: 'variable';
    name: string;
    required?: boolean;
    defaultValue?: string;
}
/**
 * Section node (groups content with optional title)
 */
export interface ToonSection extends ToonNodeBase {
    type: 'section';
    title?: string;
    children: ToonNode[];
    /** Optional scope identifier for scoped sections */
    scope?: string;
}
/**
 * Role node (system, user, assistant)
 */
export interface ToonRole extends ToonNodeBase {
    type: 'role';
    role: 'system' | 'user' | 'assistant';
    children: ToonNode[];
}
/**
 * Sequence node (ordered list of nodes)
 */
export interface ToonSequence extends ToonNodeBase {
    type: 'sequence';
    children: ToonNode[];
}
/**
 * Conditional node
 */
export interface ToonConditional extends ToonNodeBase {
    type: 'conditional';
    condition: string;
    then: ToonNode[];
    else?: ToonNode[];
}
/**
 * Union of all toon node types
 */
export type ToonNode = ToonText | ToonVariable | ToonSection | ToonRole | ToonSequence | ToonConditional;
/**
 * Toon Builder - Fluent API for constructing prompts
 */
export declare class ToonBuilder {
    private nodes;
    /**
     * Add plain text
     */
    text(content: string, options?: {
        importance?: number;
    }): this;
    /**
     * Add text with high importance
     */
    importantText(content: string, importance?: number): this;
    /**
     * Add a variable placeholder
     */
    variable(name: string, options?: {
        required?: boolean;
        defaultValue?: string;
        importance?: number;
    }): this;
    /**
     * Add a section with title and content
     */
    section(title: string | undefined, builder: (b: ToonBuilder) => ToonBuilder, options?: {
        importance?: number;
        scope?: string;
    }): this;
    /**
     * Add a scoped section (section with scope identifier)
     */
    scopedSection(scope: string, title: string | undefined, builder: (b: ToonBuilder) => ToonBuilder, options?: {
        importance?: number;
    }): this;
    /**
     * Add a role block (system, user, or assistant)
     */
    role(role: 'system' | 'user' | 'assistant', builder: (b: ToonBuilder) => ToonBuilder, options?: {
        importance?: number;
        compressStrategy?: 'keep' | 'summarize' | 'drop';
    }): this;
    /**
     * Add a role with metadata
     */
    roleWithMetadata(role: 'system' | 'user' | 'assistant', builder: (b: ToonBuilder) => ToonBuilder, metadata: {
        importance?: number;
        compressStrategy?: 'keep' | 'summarize' | 'drop';
        semanticSignature?: string;
    }): this;
    /**
     * Add a sequence of nodes
     */
    sequence(builder: (b: ToonBuilder) => ToonBuilder): this;
    /**
     * Add conditional content
     */
    conditional(condition: string, thenBuilder: (b: ToonBuilder) => ToonBuilder, elseBuilder?: (b: ToonBuilder) => ToonBuilder): this;
    /**
     * Mark content for long response handling
     */
    longResponse(builder: (b: ToonBuilder) => ToonBuilder): this;
    /**
     * Get the constructed nodes
     */
    getNodes(): ToonNode[];
    /**
     * Build and return the nodes
     */
    build(): ToonNode[];
}
/**
 * Create a new toon builder
 */
export declare function toon(): ToonBuilder;
/**
 * Render toon nodes to a string
 */
export declare function renderToon(nodes: ToonNode[], variables?: Record<string, unknown>): string;
/**
 * Convert toon nodes to CoreMessage array
 */
export declare function toonToMessages(nodes: ToonNode[], variables?: Record<string, unknown>): CoreMessage[];
/**
 * Extract importance tags from toon nodes
 */
export declare function extractImportanceTags(nodes: ToonNode[]): Array<{
    content: string;
    importance: number;
}>;
//# sourceMappingURL=toon.d.ts.map