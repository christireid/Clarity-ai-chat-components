/**
 * Toon Prompt DSL
 *
 * A composable, type-safe DSL for building prompts.
 * Toon nodes can be combined to create complex prompt structures.
 */
/**
 * Toon Builder - Fluent API for constructing prompts
 */
export class ToonBuilder {
    nodes = [];
    /**
     * Add plain text
     */
    text(content, options) {
        this.nodes.push({
            type: 'text',
            content,
            importance: options?.importance,
        });
        return this;
    }
    /**
     * Add text with high importance
     */
    importantText(content, importance = 8) {
        return this.text(content, { importance });
    }
    /**
     * Add a variable placeholder
     */
    variable(name, options) {
        this.nodes.push({
            type: 'variable',
            name,
            required: options?.required,
            defaultValue: options?.defaultValue,
            importance: options?.importance,
        });
        return this;
    }
    /**
     * Add a section with title and content
     */
    section(title, builder, options) {
        const sectionBuilder = new ToonBuilder();
        builder(sectionBuilder);
        this.nodes.push({
            type: 'section',
            title,
            children: sectionBuilder.getNodes(),
            importance: options?.importance,
            scope: options?.scope,
        });
        return this;
    }
    /**
     * Add a scoped section (section with scope identifier)
     */
    scopedSection(scope, title, builder, options) {
        return this.section(title, builder, { ...options, scope });
    }
    /**
     * Add a role block (system, user, or assistant)
     */
    role(role, builder, options) {
        const roleBuilder = new ToonBuilder();
        builder(roleBuilder);
        this.nodes.push({
            type: 'role',
            role,
            children: roleBuilder.getNodes(),
            importance: options?.importance,
            compressStrategy: options?.compressStrategy,
        });
        return this;
    }
    /**
     * Add a role with metadata
     */
    roleWithMetadata(role, builder, metadata) {
        const roleBuilder = new ToonBuilder();
        builder(roleBuilder);
        this.nodes.push({
            type: 'role',
            role,
            children: roleBuilder.getNodes(),
            ...metadata,
        });
        return this;
    }
    /**
     * Add a sequence of nodes
     */
    sequence(builder) {
        const seqBuilder = new ToonBuilder();
        builder(seqBuilder);
        this.nodes.push({
            type: 'sequence',
            children: seqBuilder.getNodes(),
        });
        return this;
    }
    /**
     * Add conditional content
     */
    conditional(condition, thenBuilder, elseBuilder) {
        const thenB = new ToonBuilder();
        thenBuilder(thenB);
        let elseNodes;
        if (elseBuilder) {
            const elseB = new ToonBuilder();
            elseBuilder(elseB);
            elseNodes = elseB.getNodes();
        }
        this.nodes.push({
            type: 'conditional',
            condition,
            then: thenB.getNodes(),
            else: elseNodes,
        });
        return this;
    }
    /**
     * Mark content for long response handling
     */
    longResponse(builder) {
        const lrBuilder = new ToonBuilder();
        builder(lrBuilder);
        // Mark all children with summarize compression strategy
        const nodes = lrBuilder.getNodes();
        for (const node of nodes) {
            node.compressStrategy = 'summarize';
        }
        this.nodes.push(...nodes);
        return this;
    }
    /**
     * Get the constructed nodes
     */
    getNodes() {
        return [...this.nodes];
    }
    /**
     * Build and return the nodes
     */
    build() {
        return this.getNodes();
    }
}
/**
 * Create a new toon builder
 */
export function toon() {
    return new ToonBuilder();
}
/**
 * Render toon nodes to a string
 */
export function renderToon(nodes, variables = {}) {
    const parts = [];
    for (const node of nodes) {
        const rendered = renderNode(node, variables);
        if (rendered) {
            parts.push(rendered);
        }
    }
    return parts.join('\n');
}
/**
 * Render a single toon node
 */
function renderNode(node, variables) {
    switch (node.type) {
        case 'text':
            return node.content;
        case 'variable': {
            const value = variables[node.name];
            if (value !== undefined && value !== null) {
                return String(value);
            }
            if (node.required) {
                throw new Error(`Required variable "${node.name}" is not defined`);
            }
            return node.defaultValue ?? '';
        }
        case 'section': {
            const childContent = renderToon(node.children, variables);
            if (node.title) {
                return `## ${node.title}\n${childContent}`;
            }
            return childContent;
        }
        case 'role':
            return renderToon(node.children, variables);
        case 'sequence':
            return renderToon(node.children, variables);
        case 'conditional': {
            const conditionMet = Boolean(variables[node.condition]);
            const branch = conditionMet ? node.then : node.else;
            return branch ? renderToon(branch, variables) : '';
        }
        default:
            return '';
    }
}
/**
 * Convert toon nodes to CoreMessage array
 */
export function toonToMessages(nodes, variables = {}) {
    const messages = [];
    for (const node of nodes) {
        if (node.type === 'role') {
            const content = renderToon(node.children, variables);
            if (content) {
                messages.push({
                    role: node.role,
                    content,
                });
            }
        }
        else if (node.type === 'sequence') {
            // Recursively process sequence children
            messages.push(...toonToMessages(node.children, variables));
        }
        else if (node.type === 'conditional') {
            const conditionMet = Boolean(variables[node.condition]);
            const branch = conditionMet ? node.then : node.else;
            if (branch) {
                messages.push(...toonToMessages(branch, variables));
            }
        }
    }
    return messages;
}
/**
 * Extract importance tags from toon nodes
 */
export function extractImportanceTags(nodes) {
    const tags = [];
    function extract(node) {
        if (node.importance !== undefined && node.importance > 0) {
            if (node.type === 'text') {
                tags.push({ content: node.content, importance: node.importance });
            }
            else if (node.type === 'section' && node.title) {
                tags.push({ content: node.title, importance: node.importance });
            }
        }
        // Recursively extract from children
        if ('children' in node && Array.isArray(node.children)) {
            for (const child of node.children) {
                extract(child);
            }
        }
        if (node.type === 'conditional') {
            for (const child of node.then) {
                extract(child);
            }
            if (node.else) {
                for (const child of node.else) {
                    extract(child);
                }
            }
        }
    }
    for (const node of nodes) {
        extract(node);
    }
    return tags;
}
//# sourceMappingURL=toon.js.map