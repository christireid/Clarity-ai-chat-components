/**
 * Tests for MCP resources
 */
import { describe, it, expect } from 'vitest';
import { handleResourceRead } from '../index.js';
describe('handleResourceRead', () => {
    it('should return getting started guide', async () => {
        const content = await handleResourceRead('clarity://docs/getting-started');
        expect(content).toContain('Getting Started');
        expect(content).toContain('Clarity Chat');
    });
    it('should return architecture overview', async () => {
        const content = await handleResourceRead('clarity://docs/architecture');
        expect(content).toContain('Architecture');
        expect(content).toContain('Components');
    });
    it('should return API reference', async () => {
        const content = await handleResourceRead('clarity://docs/api-reference');
        expect(content).toContain('API Reference');
        expect(content).toContain('OpenAI');
    });
    it('should return examples list as JSON', async () => {
        const content = await handleResourceRead('clarity://examples/list');
        const parsed = JSON.parse(content);
        expect(parsed.examples).toBeDefined();
        expect(Array.isArray(parsed.examples)).toBe(true);
    });
    it('should return model pricing as JSON', async () => {
        const content = await handleResourceRead('clarity://models/pricing');
        const parsed = JSON.parse(content);
        expect(parsed.models).toBeDefined();
        expect(parsed.models['gpt-4-turbo']).toBeDefined();
    });
    it('should return model capabilities as JSON', async () => {
        const content = await handleResourceRead('clarity://models/capabilities');
        const parsed = JSON.parse(content);
        expect(parsed.models).toBeDefined();
        expect(parsed.models['gpt-4-turbo']).toBeDefined();
    });
    it('should throw NotFoundError for unknown resource', async () => {
        await expect(handleResourceRead('clarity://unknown/resource')).rejects.toThrow();
    });
    it('should cache resources', async () => {
        const content1 = await handleResourceRead('clarity://docs/getting-started');
        const content2 = await handleResourceRead('clarity://docs/getting-started');
        expect(content1).toBe(content2);
    });
});
//# sourceMappingURL=index.test.js.map