/**
 * Tests for Component Discovery Tools
 *
 * Comprehensive tests for all 8 component discovery tool handlers.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { handleToolCall } from '../index.js';
import { ValidationError, NotFoundError } from '../../utils/errors.js';
// Mock fs module (inherited from index.test.ts pattern)
vi.mock('fs/promises', () => ({
    default: {
        mkdir: vi.fn(),
        writeFile: vi.fn(),
        readFile: vi.fn(),
        readdir: vi.fn(),
        access: vi.fn(),
    },
    mkdir: vi.fn(),
    writeFile: vi.fn(),
    readFile: vi.fn(),
    readdir: vi.fn(),
    access: vi.fn(),
}));
describe('Component Discovery Tools', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // ===========================================================================
    // clarity_discover_components
    // ===========================================================================
    describe('clarity_discover_components', () => {
        it('should discover components by search query', async () => {
            const result = await handleToolCall('clarity_discover_components', {
                query: 'chat',
            });
            expect(result.query).toBe('chat');
            expect(result.resultCount).toBeGreaterThan(0);
            expect(Array.isArray(result.components)).toBe(true);
            expect(result.components[0]).toHaveProperty('name');
            expect(result.components[0]).toHaveProperty('description');
            expect(result.components[0]).toHaveProperty('category');
        });
        it('should filter by category', async () => {
            const result = await handleToolCall('clarity_discover_components', {
                query: 'message',
                category: 'message',
            });
            expect(result.components.every((c) => c.category === 'message')).toBe(true);
        });
        it('should respect limit parameter', async () => {
            const result = await handleToolCall('clarity_discover_components', {
                query: 'a',
                limit: 3,
            });
            expect(result.components.length).toBeLessThanOrEqual(3);
        });
        it('should return empty array for no matches', async () => {
            const result = await handleToolCall('clarity_discover_components', {
                query: 'xyznonexistent123',
            });
            expect(result.resultCount).toBe(0);
            expect(result.components).toEqual([]);
        });
        it('should validate required query parameter', async () => {
            await expect(handleToolCall('clarity_discover_components', {})).rejects.toThrow();
        });
        it('should validate query is not empty', async () => {
            await expect(handleToolCall('clarity_discover_components', { query: '' })).rejects.toThrow();
        });
        it('should validate category enum if provided', async () => {
            await expect(handleToolCall('clarity_discover_components', {
                query: 'chat',
                category: 'invalid-category',
            })).rejects.toThrow();
        });
        it('should validate limit is positive', async () => {
            await expect(handleToolCall('clarity_discover_components', {
                query: 'chat',
                limit: 0,
            })).rejects.toThrow();
        });
        it('should validate limit maximum', async () => {
            await expect(handleToolCall('clarity_discover_components', {
                query: 'chat',
                limit: 100,
            })).rejects.toThrow();
        });
    });
    // ===========================================================================
    // clarity_get_component_docs
    // ===========================================================================
    describe('clarity_get_component_docs', () => {
        it('should return full documentation for a component', async () => {
            const result = await handleToolCall('clarity_get_component_docs', {
                componentName: 'ClarityChat',
            });
            expect(result.name).toBe('ClarityChat');
            expect(result.displayName).toBeDefined();
            expect(result.description).toBeDefined();
            expect(result.category).toBeDefined();
            expect(result.package).toBe('@clarity-chat/react');
            expect(Array.isArray(result.props)).toBe(true);
            expect(Array.isArray(result.examples)).toBe(true);
            expect(result.accessibility).toBeDefined();
        });
        it('should include props with complete metadata', async () => {
            const result = await handleToolCall('clarity_get_component_docs', {
                componentName: 'ClarityChat',
            });
            expect(result.props.length).toBeGreaterThan(0);
            const prop = result.props[0];
            expect(prop).toHaveProperty('name');
            expect(prop).toHaveProperty('type');
            expect(prop).toHaveProperty('required');
            expect(prop).toHaveProperty('description');
        });
        it('should include accessibility metadata', async () => {
            const result = await handleToolCall('clarity_get_component_docs', {
                componentName: 'ClarityChat',
            });
            expect(result.accessibility).toHaveProperty('wcagLevel');
            expect(result.accessibility).toHaveProperty('keyboardSupport');
            expect(result.accessibility).toHaveProperty('ariaAttributes');
            expect(result.accessibility).toHaveProperty('screenReaderNotes');
        });
        it('should throw NotFoundError for unknown component', async () => {
            await expect(handleToolCall('clarity_get_component_docs', {
                componentName: 'NonExistentComponent',
            })).rejects.toThrow();
        });
        it('should validate required componentName parameter', async () => {
            await expect(handleToolCall('clarity_get_component_docs', {})).rejects.toThrow();
        });
        it('should handle case-insensitive component names', async () => {
            const result = await handleToolCall('clarity_get_component_docs', {
                componentName: 'claritychat',
            });
            expect(result.name).toBe('ClarityChat');
        });
    });
    // ===========================================================================
    // clarity_discover_hooks
    // ===========================================================================
    describe('clarity_discover_hooks', () => {
        it('should discover hooks by search query', async () => {
            const result = await handleToolCall('clarity_discover_hooks', {
                query: 'chat',
            });
            expect(result.query).toBe('chat');
            expect(result.resultCount).toBeGreaterThanOrEqual(0);
            expect(Array.isArray(result.hooks)).toBe(true);
        });
        it('should return hook metadata in results', async () => {
            const result = await handleToolCall('clarity_discover_hooks', {
                query: 'use',
            });
            if (result.hooks.length > 0) {
                const hook = result.hooks[0];
                expect(hook).toHaveProperty('name');
                expect(hook).toHaveProperty('description');
                expect(hook.name.startsWith('use')).toBe(true);
            }
        });
        it('should respect limit parameter', async () => {
            const result = await handleToolCall('clarity_discover_hooks', {
                query: 'use',
                limit: 2,
            });
            expect(result.hooks.length).toBeLessThanOrEqual(2);
        });
        it('should validate required query parameter', async () => {
            await expect(handleToolCall('clarity_discover_hooks', {})).rejects.toThrow();
        });
        it('should validate query is not empty', async () => {
            await expect(handleToolCall('clarity_discover_hooks', { query: '' })).rejects.toThrow();
        });
    });
    // ===========================================================================
    // clarity_get_hook_docs
    // ===========================================================================
    describe('clarity_get_hook_docs', () => {
        it('should return full documentation for a hook', async () => {
            const result = await handleToolCall('clarity_get_hook_docs', {
                hookName: 'useClarityChat',
            });
            expect(result.name).toBe('useClarityChat');
            expect(result.displayName).toBeDefined();
            expect(result.description).toBeDefined();
            expect(result.package).toBe('@clarity-chat/react');
            expect(Array.isArray(result.parameters)).toBe(true);
            expect(result.returns).toBeDefined();
            expect(Array.isArray(result.examples)).toBe(true);
        });
        it('should include parameter metadata', async () => {
            const result = await handleToolCall('clarity_get_hook_docs', {
                hookName: 'useClarityChat',
            });
            if (result.parameters.length > 0) {
                const param = result.parameters[0];
                expect(param).toHaveProperty('name');
                expect(param).toHaveProperty('type');
                expect(param).toHaveProperty('required');
                expect(param).toHaveProperty('description');
            }
        });
        it('should include return type information', async () => {
            const result = await handleToolCall('clarity_get_hook_docs', {
                hookName: 'useClarityChat',
            });
            expect(result.returns).toHaveProperty('type');
            expect(result.returns).toHaveProperty('description');
        });
        it('should throw NotFoundError for unknown hook', async () => {
            await expect(handleToolCall('clarity_get_hook_docs', {
                hookName: 'useNonExistent',
            })).rejects.toThrow();
        });
        it('should validate required hookName parameter', async () => {
            await expect(handleToolCall('clarity_get_hook_docs', {})).rejects.toThrow();
        });
        it('should handle case-insensitive hook names', async () => {
            const result = await handleToolCall('clarity_get_hook_docs', {
                hookName: 'useclaritychat',
            });
            expect(result.name).toBe('useClarityChat');
        });
    });
    // ===========================================================================
    // clarity_get_accessibility
    // ===========================================================================
    describe('clarity_get_accessibility', () => {
        it('should return accessibility info for a component', async () => {
            const result = await handleToolCall('clarity_get_accessibility', {
                componentName: 'ClarityChat',
            });
            expect(result.componentName).toBe('ClarityChat');
            expect(result.wcagLevel).toBeDefined();
            expect(['A', 'AA', 'AAA']).toContain(result.wcagLevel);
            expect(Array.isArray(result.keyboardSupport)).toBe(true);
            expect(Array.isArray(result.ariaAttributes)).toBe(true);
            expect(result.screenReaderNotes).toBeDefined();
            expect(result.focusManagement).toBeDefined();
        });
        it('should include keyboard navigation details', async () => {
            const result = await handleToolCall('clarity_get_accessibility', {
                componentName: 'ClarityChat',
            });
            expect(result.keyboardSupport.length).toBeGreaterThan(0);
        });
        it('should include ARIA attribute recommendations', async () => {
            const result = await handleToolCall('clarity_get_accessibility', {
                componentName: 'ClarityChat',
            });
            expect(result.ariaAttributes.length).toBeGreaterThan(0);
        });
        it('should throw NotFoundError for unknown component', async () => {
            await expect(handleToolCall('clarity_get_accessibility', {
                componentName: 'NonExistentComponent',
            })).rejects.toThrow();
        });
        it('should validate required componentName parameter', async () => {
            await expect(handleToolCall('clarity_get_accessibility', {})).rejects.toThrow();
        });
    });
    // ===========================================================================
    // clarity_generate_code
    // ===========================================================================
    describe('clarity_generate_code', () => {
        it('should generate basic code snippet', async () => {
            const result = await handleToolCall('clarity_generate_code', {
                componentName: 'ClarityChat',
                variant: 'basic',
            });
            expect(result.componentName).toBe('ClarityChat');
            expect(result.variant).toBe('basic');
            expect(result.code).toBeDefined();
            expect(result.code).toContain('import');
            expect(result.code).toContain('ClarityChat');
        });
        it('should generate TypeScript code', async () => {
            const result = await handleToolCall('clarity_generate_code', {
                componentName: 'ClarityChat',
                variant: 'typescript',
            });
            expect(result.variant).toBe('typescript');
            expect(result.code).toContain(':');
        });
        it('should generate complete code with all props', async () => {
            const result = await handleToolCall('clarity_generate_code', {
                componentName: 'ClarityChat',
                variant: 'complete',
            });
            expect(result.variant).toBe('complete');
            expect(result.code.length).toBeGreaterThan(100);
        });
        it('should include import statements', async () => {
            const result = await handleToolCall('clarity_generate_code', {
                componentName: 'ClarityChat',
                variant: 'basic',
            });
            expect(result.imports).toBeDefined();
            expect(result.imports).toContain('@clarity-chat/react');
        });
        it('should throw NotFoundError for unknown component', async () => {
            await expect(handleToolCall('clarity_generate_code', {
                componentName: 'NonExistentComponent',
                variant: 'basic',
            })).rejects.toThrow();
        });
        it('should validate required parameters', async () => {
            await expect(handleToolCall('clarity_generate_code', {
                componentName: 'ClarityChat',
            })).rejects.toThrow();
        });
        it('should validate variant enum', async () => {
            await expect(handleToolCall('clarity_generate_code', {
                componentName: 'ClarityChat',
                variant: 'invalid',
            })).rejects.toThrow();
        });
    });
    // ===========================================================================
    // clarity_get_related_components
    // ===========================================================================
    describe('clarity_get_related_components', () => {
        it('should return related components', async () => {
            const result = await handleToolCall('clarity_get_related_components', {
                componentName: 'ClarityChat',
            });
            expect(result.componentName).toBe('ClarityChat');
            expect(Array.isArray(result.relatedComponents)).toBe(true);
        });
        it('should include metadata for related components', async () => {
            const result = await handleToolCall('clarity_get_related_components', {
                componentName: 'ClarityChat',
            });
            if (result.relatedComponents.length > 0) {
                const related = result.relatedComponents[0];
                expect(related).toHaveProperty('name');
                expect(related).toHaveProperty('description');
                expect(related).toHaveProperty('relationship');
            }
        });
        it('should throw NotFoundError for unknown component', async () => {
            await expect(handleToolCall('clarity_get_related_components', {
                componentName: 'NonExistentComponent',
            })).rejects.toThrow();
        });
        it('should validate required componentName parameter', async () => {
            await expect(handleToolCall('clarity_get_related_components', {})).rejects.toThrow();
        });
    });
    // ===========================================================================
    // clarity_list_categories
    // ===========================================================================
    describe('clarity_list_categories', () => {
        it('should return all component categories', async () => {
            const result = await handleToolCall('clarity_list_categories', {});
            expect(Array.isArray(result.categories)).toBe(true);
            expect(result.categories.length).toBeGreaterThan(0);
        });
        it('should include category metadata', async () => {
            const result = await handleToolCall('clarity_list_categories', {});
            const category = result.categories[0];
            expect(category).toHaveProperty('name');
            expect(category).toHaveProperty('displayName');
            expect(category).toHaveProperty('description');
            expect(category).toHaveProperty('componentCount');
        });
        it('should include component counts per category', async () => {
            const result = await handleToolCall('clarity_list_categories', {});
            const totalComponents = result.categories.reduce((sum, cat) => sum + cat.componentCount, 0);
            expect(totalComponents).toBeGreaterThan(0);
        });
        it('should include total statistics', async () => {
            const result = await handleToolCall('clarity_list_categories', {});
            expect(result.totalComponents).toBeDefined();
            expect(result.totalComponents).toBeGreaterThan(0);
        });
    });
});
//# sourceMappingURL=component-tools.test.js.map