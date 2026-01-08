/**
 * API Differ Tests
 */
import { describe, it, expect } from 'vitest';
import { diffAPIs, formatDiffAsText, formatDiffForChangelog, } from '../api-differ.js';
// Helper to create mock APIs
function createMockAPI(overrides) {
    return {
        name: 'TestAPI',
        kind: 'function',
        signature: '() => void',
        description: 'Test API',
        filePath: 'src/test.ts',
        exportedFrom: '@test/package',
        isDefault: false,
        line: 1,
        ...overrides,
    };
}
describe('API Differ', () => {
    describe('diffAPIs', () => {
        it('should detect added APIs', () => {
            const oldAPIs = [];
            const newAPIs = [createMockAPI({ name: 'NewAPI' })];
            const result = diffAPIs(oldAPIs, newAPIs);
            expect(result.summary.totalAdded).toBe(1);
            expect(result.added).toHaveLength(1);
            expect(result.added[0].name).toBe('NewAPI');
        });
        it('should detect removed APIs', () => {
            const oldAPIs = [createMockAPI({ name: 'OldAPI' })];
            const newAPIs = [];
            const result = diffAPIs(oldAPIs, newAPIs);
            expect(result.summary.totalRemoved).toBe(1);
            expect(result.removed).toHaveLength(1);
            expect(result.removed[0].name).toBe('OldAPI');
            expect(result.removed[0].isBreaking).toBe(true);
        });
        it('should detect modified APIs with signature changes', () => {
            const oldAPIs = [
                createMockAPI({ name: 'MyAPI', signature: '(a: string) => void' }),
            ];
            const newAPIs = [
                createMockAPI({
                    name: 'MyAPI',
                    signature: '(a: string, b: number) => void',
                }),
            ];
            const result = diffAPIs(oldAPIs, newAPIs);
            expect(result.summary.totalModified).toBe(1);
            expect(result.modified[0].description).toContain('Signature changed');
        });
        it('should detect breaking changes when required props are added', () => {
            const oldAPIs = [
                createMockAPI({
                    name: 'MyComponent',
                    kind: 'component',
                    props: [
                        { name: 'title', type: 'string', required: false, description: '' },
                    ],
                }),
            ];
            const newAPIs = [
                createMockAPI({
                    name: 'MyComponent',
                    kind: 'component',
                    props: [
                        { name: 'title', type: 'string', required: false, description: '' },
                        { name: 'id', type: 'string', required: true, description: '' },
                    ],
                }),
            ];
            const result = diffAPIs(oldAPIs, newAPIs);
            expect(result.summary.hasBreakingChanges).toBe(true);
            expect(result.breaking.length).toBeGreaterThan(0);
        });
        it('should not flag adding optional props as breaking', () => {
            const oldAPIs = [
                createMockAPI({
                    name: 'MyComponent',
                    kind: 'component',
                    props: [],
                }),
            ];
            const newAPIs = [
                createMockAPI({
                    name: 'MyComponent',
                    kind: 'component',
                    props: [
                        {
                            name: 'optional',
                            type: 'string',
                            required: false,
                            description: '',
                        },
                    ],
                }),
            ];
            const result = diffAPIs(oldAPIs, newAPIs);
            expect(result.summary.hasBreakingChanges).toBe(false);
        });
        it('should ignore internal APIs when configured', () => {
            const oldAPIs = [createMockAPI({ name: '_internalAPI' })];
            const newAPIs = [];
            const result = diffAPIs(oldAPIs, newAPIs, { ignoreInternal: true });
            expect(result.summary.totalRemoved).toBe(0);
        });
        it('should include internal APIs when configured', () => {
            const oldAPIs = [createMockAPI({ name: '_internalAPI' })];
            const newAPIs = [];
            const result = diffAPIs(oldAPIs, newAPIs, { ignoreInternal: false });
            expect(result.summary.totalRemoved).toBe(1);
        });
    });
    describe('formatDiffAsText', () => {
        it('should format empty diff', () => {
            const result = diffAPIs([], []);
            const text = formatDiffAsText(result);
            expect(text).toContain('API Diff Report');
            expect(text).toContain('Added: 0');
            expect(text).toContain('Removed: 0');
        });
        it('should format diff with changes', () => {
            const oldAPIs = [createMockAPI({ name: 'OldAPI' })];
            const newAPIs = [createMockAPI({ name: 'NewAPI' })];
            const result = diffAPIs(oldAPIs, newAPIs);
            const text = formatDiffAsText(result);
            expect(text).toContain('Added: 1');
            expect(text).toContain('Removed: 1');
            expect(text).toContain('NewAPI');
            expect(text).toContain('OldAPI');
        });
    });
    describe('formatDiffForChangelog', () => {
        it('should format breaking changes section', () => {
            const oldAPIs = [createMockAPI({ name: 'RemovedAPI' })];
            const newAPIs = [];
            const result = diffAPIs(oldAPIs, newAPIs);
            const changelog = formatDiffForChangelog(result);
            expect(changelog).toContain('Breaking Changes');
            expect(changelog).toContain('RemovedAPI');
        });
        it('should format new APIs section', () => {
            const oldAPIs = [];
            const newAPIs = [createMockAPI({ name: 'NewAPI' })];
            const result = diffAPIs(oldAPIs, newAPIs);
            const changelog = formatDiffForChangelog(result);
            expect(changelog).toContain('New APIs');
            expect(changelog).toContain('NewAPI');
        });
    });
});
//# sourceMappingURL=api-differ.test.js.map