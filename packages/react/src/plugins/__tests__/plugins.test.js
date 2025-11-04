import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PluginManager } from '../plugin-manager';
describe('PluginManager', () => {
    let manager;
    beforeEach(() => {
        manager = new PluginManager();
    });
    describe('register', () => {
        it('should register a plugin', async () => {
            const plugin = {
                name: 'test-plugin',
                version: '1.0.0',
            };
            await manager.register({ plugin });
            expect(manager.getPlugin('test-plugin')).toBeDefined();
        });
        it('should initialize plugin if autoInitialize is true', async () => {
            const initSpy = vi.fn();
            const plugin = {
                name: 'test-plugin',
                version: '1.0.0',
                initialize: initSpy,
            };
            await manager.register({ plugin });
            expect(initSpy).toHaveBeenCalled();
        });
        it('should not initialize disabled plugins', async () => {
            const initSpy = vi.fn();
            const plugin = {
                name: 'test-plugin',
                version: '1.0.0',
                initialize: initSpy,
            };
            await manager.register({ plugin, enabled: false });
            expect(initSpy).not.toHaveBeenCalled();
        });
        it('should check dependencies', async () => {
            const plugin = {
                name: 'dependent-plugin',
                version: '1.0.0',
                dependencies: ['missing-plugin'],
            };
            await expect(manager.register({ plugin })).rejects.toThrow();
        });
    });
    describe('unregister', () => {
        it('should unregister plugin', async () => {
            const plugin = {
                name: 'test-plugin',
                version: '1.0.0',
            };
            await manager.register({ plugin });
            await manager.unregister('test-plugin');
            expect(manager.getPlugin('test-plugin')).toBeUndefined();
        });
        it('should call cleanup', async () => {
            const cleanupSpy = vi.fn();
            const plugin = {
                name: 'test-plugin',
                version: '1.0.0',
                cleanup: cleanupSpy,
            };
            await manager.register({ plugin });
            await manager.unregister('test-plugin');
            expect(cleanupSpy).toHaveBeenCalled();
        });
    });
    describe('callHook', () => {
        it('should call hooks on all plugins', async () => {
            const hook1 = vi.fn().mockResolvedValue('result1');
            const hook2 = vi.fn().mockResolvedValue('result2');
            await manager.register({
                plugin: {
                    name: 'plugin1',
                    version: '1.0.0',
                    hooks: { testHook: hook1 },
                },
            });
            await manager.register({
                plugin: {
                    name: 'plugin2',
                    version: '1.0.0',
                    hooks: { testHook: hook2 },
                },
            });
            const results = await manager.callHook('testHook', 'arg1', 'arg2');
            expect(hook1).toHaveBeenCalledWith('arg1', 'arg2');
            expect(hook2).toHaveBeenCalledWith('arg1', 'arg2');
            expect(results).toEqual(['result1', 'result2']);
        });
        it('should skip disabled plugins', async () => {
            const hook = vi.fn();
            await manager.register({
                plugin: {
                    name: 'plugin1',
                    version: '1.0.0',
                    hooks: { testHook: hook },
                },
                enabled: false,
            });
            await manager.callHook('testHook');
            expect(hook).not.toHaveBeenCalled();
        });
    });
    describe('enable and disable', () => {
        it('should enable plugin', async () => {
            const plugin = {
                name: 'test-plugin',
                version: '1.0.0',
            };
            await manager.register({ plugin, enabled: false });
            await manager.enable('test-plugin');
            const config = manager.getPlugin('test-plugin');
            expect(config).toBeDefined();
        });
        it('should disable plugin', async () => {
            const plugin = {
                name: 'test-plugin',
                version: '1.0.0',
            };
            await manager.register({ plugin });
            await manager.disable('test-plugin');
            // Plugin should not respond to hooks when disabled
            const hook = vi.fn();
            await manager.register({
                plugin: { name: 'test2', version: '1.0.0', hooks: { test: hook } },
            });
            await manager.disable('test2');
            await manager.callHook('test');
            expect(hook).not.toHaveBeenCalled();
        });
    });
    describe('event system', () => {
        it('should emit and listen to events', () => {
            const handler = vi.fn();
            manager.on('test-event', handler);
            manager.emit('test-event', { data: 'value' });
            expect(handler).toHaveBeenCalledWith({ data: 'value' });
        });
        it('should support unsubscribe', () => {
            const handler = vi.fn();
            const unsubscribe = manager.on('test-event', handler);
            unsubscribe();
            manager.emit('test-event', {});
            expect(handler).not.toHaveBeenCalled();
        });
    });
    describe('shared state', () => {
        it('should manage shared state', () => {
            manager.setState('key1', 'value1');
            const state = manager.getState();
            expect(state.key1).toBe('value1');
        });
    });
});
//# sourceMappingURL=plugins.test.js.map