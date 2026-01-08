/**
 * Tests for usePromptLibrary hook
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePromptLibrary } from '../use-prompt-library';
describe('usePromptLibrary', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Clear localStorage
        if (typeof window !== 'undefined') {
            localStorage.clear();
        }
    });
    describe('initialization', () => {
        it('should initialize with empty state', () => {
            const { result } = renderHook(() => usePromptLibrary());
            expect(result.current.state.templates).toEqual([]);
            expect(result.current.state.versions).toEqual({});
            expect(result.current.state.history).toEqual([]);
            expect(result.current.state.isLoading).toBe(false);
        });
        it('should initialize with provided templates', () => {
            const initialTemplates = [
                {
                    id: 'test-1',
                    name: 'Test Template',
                    template: 'Hello {{name}}',
                },
            ];
            const { result } = renderHook(() => usePromptLibrary({ initialTemplates }));
            expect(result.current.state.templates).toHaveLength(1);
            expect(result.current.state.templates[0]?.name).toBe('Test Template');
        });
    });
    describe('template operations', () => {
        it('should add a template', () => {
            const { result } = renderHook(() => usePromptLibrary());
            act(() => {
                result.current.templates.add({
                    name: 'New Template',
                    template: 'Hello {{name}}',
                });
            });
            expect(result.current.state.templates).toHaveLength(1);
            expect(result.current.state.templates[0]?.name).toBe('New Template');
            expect(result.current.state.templates[0]?.id).toBeDefined();
        });
        it('should update a template', () => {
            const { result } = renderHook(() => usePromptLibrary());
            let templateId;
            act(() => {
                const template = result.current.templates.add({
                    name: 'Original',
                    template: 'Hello',
                });
                templateId = template.id;
            });
            act(() => {
                result.current.templates.update(templateId, { name: 'Updated' });
            });
            expect(result.current.templates.get(templateId)?.name).toBe('Updated');
        });
        it('should remove a template', () => {
            const { result } = renderHook(() => usePromptLibrary());
            let templateId;
            act(() => {
                const template = result.current.templates.add({
                    name: 'To Remove',
                    template: 'Hello',
                });
                templateId = template.id;
            });
            expect(result.current.state.templates).toHaveLength(1);
            act(() => {
                result.current.templates.remove(templateId);
            });
            expect(result.current.state.templates).toHaveLength(0);
        });
        it('should duplicate a template', () => {
            const { result } = renderHook(() => usePromptLibrary());
            let templateId;
            act(() => {
                const template = result.current.templates.add({
                    name: 'Original',
                    template: 'Hello {{name}}',
                });
                templateId = template.id;
            });
            act(() => {
                result.current.templates.duplicate(templateId, 'Duplicated');
            });
            expect(result.current.state.templates).toHaveLength(2);
            expect(result.current.templates.getByName('Duplicated')).toBeDefined();
        });
        it('should search templates', () => {
            const { result } = renderHook(() => usePromptLibrary());
            act(() => {
                result.current.templates.add({ name: 'Code Review', template: 'Review code' });
                result.current.templates.add({ name: 'Bug Report', template: 'Report bug' });
                result.current.templates.add({ name: 'Code Analysis', template: 'Analyze' });
            });
            const results = result.current.templates.search('code');
            expect(results).toHaveLength(2);
        });
        it('should filter by tag', () => {
            const { result } = renderHook(() => usePromptLibrary());
            act(() => {
                result.current.templates.add({
                    name: 'Template 1',
                    template: 'Hello',
                    tags: ['code', 'review'],
                });
                result.current.templates.add({
                    name: 'Template 2',
                    template: 'World',
                    tags: ['docs'],
                });
            });
            const results = result.current.templates.getByTag('code');
            expect(results).toHaveLength(1);
            expect(results[0]?.name).toBe('Template 1');
        });
    });
    describe('version operations', () => {
        it('should create a version', () => {
            const { result } = renderHook(() => usePromptLibrary());
            let templateId;
            act(() => {
                const template = result.current.templates.add({
                    name: 'Versioned Template',
                    template: 'v1',
                });
                templateId = template.id;
            });
            act(() => {
                result.current.versions.create(templateId, 'v1 content', 'Initial version');
            });
            const versions = result.current.versions.getAll(templateId);
            expect(versions).toHaveLength(1);
            expect(versions[0]?.version).toBe('1.0.0');
            expect(versions[0]?.notes).toBe('Initial version');
        });
        it('should increment version numbers', () => {
            const { result } = renderHook(() => usePromptLibrary());
            let templateId;
            act(() => {
                const template = result.current.templates.add({
                    name: 'Template',
                    template: 'Hello',
                });
                templateId = template.id;
            });
            act(() => {
                result.current.versions.create(templateId, 'v1', 'First');
            });
            act(() => {
                result.current.versions.create(templateId, 'v2', 'Second');
            });
            const versions = result.current.versions.getAll(templateId);
            expect(versions).toHaveLength(2);
            expect(versions[0]?.version).toBe('1.0.0');
            expect(versions[1]?.version).toBe('1.0.1');
        });
        it('should get active version', () => {
            const { result } = renderHook(() => usePromptLibrary());
            let templateId;
            act(() => {
                const template = result.current.templates.add({
                    name: 'Template',
                    template: 'Hello',
                });
                templateId = template.id;
            });
            act(() => {
                result.current.versions.create(templateId, 'v1', 'First');
                result.current.versions.create(templateId, 'v2', 'Second');
            });
            const active = result.current.versions.getActive(templateId);
            expect(active?.template).toBe('v2');
            expect(active?.isActive).toBe(true);
        });
        it('should compare versions', () => {
            const { result } = renderHook(() => usePromptLibrary());
            let templateId;
            let version1Id;
            let version2Id;
            act(() => {
                const template = result.current.templates.add({
                    name: 'Template',
                    template: 'Hello',
                });
                templateId = template.id;
            });
            act(() => {
                const v1 = result.current.versions.create(templateId, 'Hello World', 'v1');
                version1Id = v1.id;
            });
            act(() => {
                const v2 = result.current.versions.create(templateId, 'Hello Universe', 'v2');
                version2Id = v2.id;
            });
            const comparison = result.current.versions.compare(templateId, version1Id, version2Id);
            expect(comparison).toBeDefined();
            expect(comparison?.diff).toBeDefined();
            expect(comparison?.diff.some((line) => line.startsWith('-'))).toBe(true);
            expect(comparison?.diff.some((line) => line.startsWith('+'))).toBe(true);
        });
    });
    describe('deployment operations', () => {
        it('should deploy to environment', () => {
            const { result } = renderHook(() => usePromptLibrary());
            let templateId;
            let versionId;
            act(() => {
                const template = result.current.templates.add({
                    name: 'Template',
                    template: 'Hello',
                });
                templateId = template.id;
            });
            act(() => {
                const version = result.current.versions.create(templateId, 'content', 'v1');
                versionId = version.id;
            });
            act(() => {
                result.current.deployments.deploy(templateId, versionId, 'production');
            });
            const deployment = result.current.deployments.getActive(templateId, 'production');
            expect(deployment).toBeDefined();
            expect(deployment?.status).toBe('active');
            expect(deployment?.environment).toBe('production');
        });
        it('should support traffic percentage', () => {
            const { result } = renderHook(() => usePromptLibrary());
            let templateId;
            let versionId;
            act(() => {
                const template = result.current.templates.add({
                    name: 'Template',
                    template: 'Hello',
                });
                templateId = template.id;
            });
            act(() => {
                const version = result.current.versions.create(templateId, 'content', 'v1');
                versionId = version.id;
            });
            act(() => {
                result.current.deployments.deploy(templateId, versionId, 'staging', 50);
            });
            const deployment = result.current.deployments.getActive(templateId, 'staging');
            expect(deployment?.trafficPercentage).toBe(50);
        });
    });
    describe('history operations', () => {
        it('should track changes', () => {
            const { result } = renderHook(() => usePromptLibrary({
                currentUser: { id: 'user-1', name: 'Test User' },
            }));
            act(() => {
                result.current.templates.add({ name: 'Template', template: 'Hello' });
            });
            const history = result.current.history.getAll();
            expect(history).toHaveLength(1);
            expect(history[0]?.changeType).toBe('created');
            expect(history[0]?.changedBy.name).toBe('Test User');
        });
        it('should get history for template', () => {
            const { result } = renderHook(() => usePromptLibrary());
            let templateId;
            act(() => {
                const template = result.current.templates.add({
                    name: 'Template',
                    template: 'Hello',
                });
                templateId = template.id;
            });
            act(() => {
                result.current.templates.update(templateId, { name: 'Updated' });
            });
            const history = result.current.history.getForTemplate(templateId);
            expect(history).toHaveLength(2);
        });
    });
    describe('export/import', () => {
        it('should export library', () => {
            const { result } = renderHook(() => usePromptLibrary());
            act(() => {
                result.current.templates.add({ name: 'Template', template: 'Hello' });
            });
            const exported = result.current.export();
            const parsed = JSON.parse(exported);
            expect(parsed.templates).toHaveLength(1);
            expect(parsed.exportedAt).toBeDefined();
        });
        it('should import library', () => {
            const { result } = renderHook(() => usePromptLibrary());
            const importData = JSON.stringify({
                templates: [{ id: 'imported-1', name: 'Imported', template: 'Hello' }],
                versions: {},
            });
            let success;
            act(() => {
                success = result.current.import(importData);
            });
            expect(success).toBe(true);
            expect(result.current.state.templates).toHaveLength(1);
            expect(result.current.state.templates[0]?.name).toBe('Imported');
        });
        it('should reject invalid import', () => {
            const { result } = renderHook(() => usePromptLibrary());
            let success;
            act(() => {
                success = result.current.import('invalid json');
            });
            expect(success).toBe(false);
        });
    });
    describe('reset', () => {
        it('should reset to initial state', () => {
            const initialTemplates = [
                { id: 'initial', name: 'Initial', template: 'Hello' },
            ];
            const { result } = renderHook(() => usePromptLibrary({ initialTemplates }));
            act(() => {
                result.current.templates.add({ name: 'Added', template: 'World' });
            });
            expect(result.current.state.templates).toHaveLength(2);
            act(() => {
                result.current.reset();
            });
            expect(result.current.state.templates).toHaveLength(1);
            expect(result.current.state.templates[0]?.name).toBe('Initial');
        });
    });
});
//# sourceMappingURL=use-prompt-library.test.js.map