/**
 * Basic Usage Example
 * Demonstrates the zero-config clarityMemory() API
 *
 * Run: npm run example:basic
 * or: npx tsx examples/basic-usage.ts
 */
import { clarityMemory } from '../src/core/memory';
async function main() {
    // Zero-config usage - works out of the box!
    const mem = clarityMemory();
    console.log('✅ Memory instance created');
    // Add some memories
    console.log('\n📝 Adding memories...');
    await mem.add("User prefers TypeScript over JavaScript", {
        type: 'semantic',
        importance: 0.9,
        tags: ['preferences', 'programming'],
    });
    await mem.add("User loves dark mode", {
        type: 'semantic',
        importance: 0.8,
        tags: ['preferences', 'ui'],
    });
    await mem.add("User asked about React hooks", {
        type: 'episodic',
        importance: 0.6,
    });
    console.log('✅ Memories added');
    // Search for relevant memories
    console.log('\n🔍 Searching memories...');
    const results = await mem.search("What are the user's preferences?", {
        limit: 5,
        minScore: 0.5,
    });
    console.log(`Found ${results.length} relevant memories:`);
    results.forEach((result, i) => {
        console.log(`  ${i + 1}. [${result.score.toFixed(2)}] ${result.memory.content}`);
    });
    // Get optimized context for LLM
    console.log('\n📦 Getting context bundle...');
    const context = await mem.context({
        maxTokens: 500,
        query: "user preferences",
        prioritizeRecent: true,
    });
    console.log(`Context bundle:`);
    console.log(`  Total tokens: ${context.totalTokens}`);
    console.log(`  Memories: ${context.memories.length}`);
    console.log(`  Strategy: ${context.metadata.strategy}`);
    console.log('\n  Memory contents:');
    context.memories.forEach((memory, i) => {
        console.log(`    ${i + 1}. ${memory.content}`);
    });
    // Get statistics
    console.log('\n📊 Statistics:');
    const stats = await mem.getStats();
    console.log(`  Total memories: ${stats.total}`);
    console.log(`  By type:`, stats.byType);
    console.log(`  Average importance: ${stats.averageImportance.toFixed(2)}`);
    console.log(`  Average tokens: ${stats.averageTokens.toFixed(0)}`);
    // Inspect system state
    console.log('\n🔍 System inspection:');
    const state = await mem.inspect();
    console.log(`  Total memories: ${state.totalMemories}`);
    console.log(`  Total tokens: ${state.totalTokens}`);
    console.log(`  Storage: ${state.storage.type} (${state.storage.size})`);
    console.log('\n✅ Example complete!');
}
main().catch(console.error);
//# sourceMappingURL=basic-usage.js.map