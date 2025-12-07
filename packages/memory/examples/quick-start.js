/**
 * Quick Start Example
 * The simplest possible usage of Clarity Memory
 *
 * Run: npm run example:basic
 * or: npx tsx examples/quick-start.ts
 */
import { clarityMemory } from '../src/core/memory';
async function main() {
    console.log('🚀 Clarity Memory Quick Start\n');
    // Step 1: Create memory instance (zero config!)
    const mem = clarityMemory();
    console.log('✅ Memory instance created\n');
    // Step 2: Add some memories
    console.log('📝 Adding memories...');
    await mem.add("User prefers TypeScript over JavaScript", {
        type: 'semantic',
        importance: 0.9,
        tags: ['preferences', 'programming']
    });
    await mem.add("User is a frontend developer", {
        type: 'profile',
        importance: 1.0
    });
    await mem.add("User asked about React hooks today", {
        type: 'episodic',
        importance: 0.5
    });
    console.log('✅ Memories added\n');
    // Step 3: Search for memories
    console.log('🔍 Searching for "user preferences"...');
    const results = await mem.search("user preferences", {
        limit: 5
    });
    console.log(`Found ${results.length} results:`);
    results.forEach((result, i) => {
        console.log(`  ${i + 1}. [${result.score.toFixed(2)}] ${result.memory.content}`);
    });
    console.log();
    // Step 4: Get optimized context for LLM
    console.log('📦 Getting optimized context...');
    const context = await mem.context({
        maxTokens: 500,
        query: "user preferences"
    });
    console.log(`Context (${context.tokens} tokens):`);
    console.log(context.text);
    console.log();
    // Step 5: Check statistics
    console.log('📊 Statistics:');
    const stats = await mem.getStats();
    console.log(`  Total memories: ${stats.total}`);
    console.log(`  By type:`, stats.byType);
    console.log(`  Total tokens: ${stats.totalTokens}`);
    console.log();
    // Cleanup
    await mem.close();
    console.log('✅ Example complete!');
}
main().catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
});
//# sourceMappingURL=quick-start.js.map