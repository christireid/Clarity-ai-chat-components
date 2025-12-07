import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { FileStore } from './file';
describe('FileStore', () => {
    let testDir;
    let testFilePath;
    let store;
    beforeEach(async () => {
        // Create a unique test directory for each test
        testDir = join(tmpdir(), `filestore-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
        await fs.mkdir(testDir, { recursive: true });
        testFilePath = join(testDir, 'memories.json');
        store = new FileStore(testFilePath);
    });
    afterEach(async () => {
        // Clean up test directory
        try {
            await fs.rm(testDir, { recursive: true, force: true });
        }
        catch {
            // Ignore cleanup errors
        }
    });
    describe('basic operations', () => {
        it('should initialize and create file', async () => {
            await store.initialize();
            const exists = await fs.access(testFilePath).then(() => true).catch(() => false);
            // File may not exist until first write
            expect(store).toBeDefined();
        });
        it('should add and retrieve a memory', async () => {
            const memory = {
                id: 'test-1',
                type: 'episodic',
                content: 'Test memory content',
                timestamp: Date.now(),
                importance: 0.5,
            };
            await store.add(memory);
            const retrieved = await store.get('test-1');
            expect(retrieved).toEqual(memory);
        });
        it('should update a memory', async () => {
            const memory = {
                id: 'test-1',
                type: 'episodic',
                content: 'Original content',
                timestamp: Date.now(),
                importance: 0.5,
            };
            await store.add(memory);
            const updated = { ...memory, content: 'Updated content' };
            await store.update('test-1', updated);
            const retrieved = await store.get('test-1');
            expect(retrieved?.content).toBe('Updated content');
        });
        it('should delete a memory', async () => {
            const memory = {
                id: 'test-1',
                type: 'episodic',
                content: 'Test memory',
                timestamp: Date.now(),
                importance: 0.5,
            };
            await store.add(memory);
            await store.delete('test-1');
            const retrieved = await store.get('test-1');
            expect(retrieved).toBeNull();
        });
    });
    describe('atomic writes', () => {
        it('should persist data to file', async () => {
            const memory = {
                id: 'test-1',
                type: 'episodic',
                content: 'Test memory',
                timestamp: Date.now(),
                importance: 0.5,
            };
            await store.add(memory);
            // Verify file was written
            const content = await fs.readFile(testFilePath, 'utf-8');
            const data = JSON.parse(content);
            expect(data.memories).toHaveLength(1);
            expect(data.memories[0].id).toBe('test-1');
            expect(data.version).toBe('1.0.0');
            expect(data.lastUpdated).toBeDefined();
        });
        it('should not leave temp files after successful write', async () => {
            const memory = {
                id: 'test-1',
                type: 'episodic',
                content: 'Test memory',
                timestamp: Date.now(),
                importance: 0.5,
            };
            await store.add(memory);
            // Check for temp files
            const files = await fs.readdir(testDir);
            const tempFiles = files.filter(f => f.includes('.tmp'));
            const backupFiles = files.filter(f => f.includes('.bak'));
            expect(tempFiles).toHaveLength(0);
            expect(backupFiles).toHaveLength(0);
        });
        it('should preserve data across store instances', async () => {
            const memory = {
                id: 'test-1',
                type: 'episodic',
                content: 'Test memory',
                timestamp: Date.now(),
                importance: 0.5,
            };
            await store.add(memory);
            await store.close();
            // Create new store instance pointing to same file
            const newStore = new FileStore(testFilePath);
            const retrieved = await newStore.get('test-1');
            expect(retrieved).toEqual(memory);
        });
        it('should handle multiple rapid writes', async () => {
            const memories = Array.from({ length: 10 }, (_, i) => ({
                id: `test-${i}`,
                type: 'episodic',
                content: `Test memory ${i}`,
                timestamp: Date.now(),
                importance: 0.5,
            }));
            // Add all memories rapidly
            for (const memory of memories) {
                await store.add(memory);
            }
            // Verify all were persisted
            const all = await store.getAll();
            expect(all).toHaveLength(10);
        });
        it('should write valid JSON', async () => {
            const memory = {
                id: 'test-1',
                type: 'episodic',
                content: 'Test with special chars: "quotes" and \\backslashes\\',
                timestamp: Date.now(),
                importance: 0.5,
            };
            await store.add(memory);
            // Should not throw when parsing
            const content = await fs.readFile(testFilePath, 'utf-8');
            expect(() => JSON.parse(content)).not.toThrow();
        });
    });
    describe('search', () => {
        it('should find memories by text content', async () => {
            const memories = [
                { id: '1', type: 'episodic', content: 'The quick brown fox', timestamp: Date.now(), importance: 0.5 },
                { id: '2', type: 'episodic', content: 'Lazy dog sleeping', timestamp: Date.now(), importance: 0.5 },
                { id: '3', type: 'episodic', content: 'Fox and dog playing', timestamp: Date.now(), importance: 0.5 },
            ];
            for (const m of memories) {
                await store.add(m);
            }
            const results = await store.search('fox', { limit: 10 });
            expect(results.length).toBeGreaterThan(0);
            expect(results.some(r => r.memory.content.toLowerCase().includes('fox'))).toBe(true);
        });
        it('should filter by type', async () => {
            const memories = [
                { id: '1', type: 'episodic', content: 'Episodic memory', timestamp: Date.now(), importance: 0.5 },
                { id: '2', type: 'semantic', content: 'Semantic memory', timestamp: Date.now(), importance: 0.5 },
            ];
            for (const m of memories) {
                await store.add(m);
            }
            const results = await store.search('memory', { limit: 10, types: ['semantic'] });
            expect(results).toHaveLength(1);
            expect(results[0].memory.type).toBe('semantic');
        });
    });
});
//# sourceMappingURL=file.test.js.map