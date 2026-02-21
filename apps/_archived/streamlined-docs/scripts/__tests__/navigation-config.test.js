/**
 * Tests for navigation configuration
 */
import { describe, it, expect } from 'vitest';
import { navigationConfig, projectDescription, BASE_URL, mcpServerConfig, mcpTools, } from '../navigation-config';
describe('navigationConfig', () => {
    it('should have all required sections', () => {
        const sectionTitles = navigationConfig.map((s) => s.title);
        expect(sectionTitles).toContain('Quick Start');
        expect(sectionTitles).toContain('Core Concepts');
        expect(sectionTitles).toContain('Main Components');
        expect(sectionTitles).toContain('Core Hooks');
        expect(sectionTitles).toContain('Guides');
        expect(sectionTitles).toContain('Examples');
        expect(sectionTitles).toContain('Cookbook Recipes');
    });
    it('should have items in each section', () => {
        for (const section of navigationConfig) {
            expect(section.items.length).toBeGreaterThan(0);
        }
    });
    it('should have valid hrefs starting with /', () => {
        for (const section of navigationConfig) {
            for (const item of section.items) {
                if (item.href) {
                    expect(item.href).toMatch(/^\//);
                }
            }
        }
    });
    it('should have descriptions for all items', () => {
        for (const section of navigationConfig) {
            for (const item of section.items) {
                expect(item.description).toBeDefined();
                expect(item.description?.length).toBeGreaterThan(0);
            }
        }
    });
    it('should mark Optional section as optional', () => {
        const optionalSection = navigationConfig.find((s) => s.title === 'Optional');
        expect(optionalSection).toBeDefined();
        expect(optionalSection?.isOptional).toBe(true);
    });
});
describe('projectDescription', () => {
    it('should contain key information', () => {
        expect(projectDescription).toContain('React');
        expect(projectDescription).toContain('TypeScript');
        expect(projectDescription).toContain('chat');
    });
    it('should be non-empty', () => {
        expect(projectDescription.length).toBeGreaterThan(100);
    });
});
describe('BASE_URL', () => {
    it('should be a valid HTTPS URL', () => {
        expect(BASE_URL).toMatch(/^https:\/\//);
    });
    it('should be the clarity-chat.dev domain', () => {
        expect(BASE_URL).toBe('https://clarity-chat.dev');
    });
});
describe('mcpServerConfig', () => {
    it('should be valid JSON', () => {
        expect(() => JSON.parse(mcpServerConfig)).not.toThrow();
    });
    it('should define clarity-chat server', () => {
        const config = JSON.parse(mcpServerConfig);
        expect(config.mcpServers['clarity-chat']).toBeDefined();
    });
});
describe('mcpTools', () => {
    it('should include essential tools', () => {
        expect(mcpTools).toContain('list_components');
        expect(mcpTools).toContain('get_component');
        expect(mcpTools).toContain('list_hooks');
        expect(mcpTools).toContain('get_hook');
        expect(mcpTools).toContain('search_docs');
    });
    it('should be an array of strings', () => {
        expect(Array.isArray(mcpTools)).toBe(true);
        for (const tool of mcpTools) {
            expect(typeof tool).toBe('string');
        }
    });
});
//# sourceMappingURL=navigation-config.test.js.map