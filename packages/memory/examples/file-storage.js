/**
 * File Storage Example
 * Demonstrates using file-based persistence
 *
 * Run: npm run example:file
 * or: npx tsx examples/file-storage.ts
 */
import { clarityMemory } from '../src/core/memory';
async function main() {
    console.log('📁 File Storage Example\n');
    // Create memory instance with file storage
    const mem = clarityMemory({
        vectorStore: {
            type: 'file',
            path: './example-memories.json',
        },
    });
    console.log('✅ Memory instance created with file storage');
    // Add some memories
    console.log('\n📝 Adding memories...');
    await mem.add("User prefers TypeScript", {
        type: 'semantic',
        importance: 0.9,
        tags: ['preferences'],
    });
    await mem.add("User works as a software engineer", {
        type: 'profile',
        importance: 1.0,
    });
    await mem.add("User asked about React hooks", {
        type: 'episodic',
    });
    console.log('✅ Memories added and persisted to file');
    // Close and recreate to test persistence
    await mem.close();
    console.log('\n🔄 Closed memory instance');
    // Recreate with same file path
    const mem2 = clarityMemory({
        vectorStore: {
            type: 'file',
            path: './example-memories.json',
        },
    });
    console.log('✅ Recreated memory instance');
    // Verify memories persisted
    const stats = await mem2.getStats();
    console.log(`\n📊 Loaded ${stats.total} memories from file`);
    console.log(`   By type:`, stats.byType);
    // Search for memories
    const results = await mem2.search("user preferences", {
        limit: 5,
    });
    console.log(`\n🔍 Found ${results.length} relevant memories:`);
    results.forEach((result, i) => {
        console.log(`   ${i + 1}. [${result.score.toFixed(2)}] ${result.memory.content}`);
    });
    await mem2.close();
    console.log('\n✅ Example complete!');
    console.log('   Check ./example-memories.json to see persisted data');
}
main().catch(console.error);
//# sourceMappingURL=file-storage.js.map