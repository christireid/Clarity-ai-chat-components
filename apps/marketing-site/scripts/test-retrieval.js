import { retrieveContext } from '../lib/search';
import { KnowledgeBase } from '../lib/search-config';
/* eslint-disable no-console */
// Mock Knowledge Base
const MOCK_KB = {
    chunks: [
        { title: 'Pricing > Pro Plan', content: 'The Pro plan costs $49/mo per developer.' },
        { title: 'Features > Streaming', content: 'Clarity Chat supports 60fps streaming for smooth text generation.' },
        { title: 'Getting Started > Installation', content: 'npm install @clarity-chat/react' },
        { title: 'Comparison > Vercel AI SDK', content: 'Clarity Chat works with Vercel AI SDK seamlessly.' },
        { title: 'Advanced > Voice Mode', content: 'Pro plan includes Voice Mode components.' }
    ],
    lastUpdated: new Date().toISOString()
};
// Test Cases
const TESTS = [
    { query: 'How much does the pro plan cost?', expected: 'Pricing > Pro Plan' },
    { query: 'Does it support streaming?', expected: 'Features > Streaming' },
    { query: 'How do I install it?', expected: 'Getting Started > Installation' },
    { query: 'What is the billing like?', expected: 'Pricing > Pro Plan' }, // "billing" -> "cost" -> "price" (Synonym Check)
    { query: 'Is it fast?', expected: 'Features > Streaming' }, // "fast" -> "streaming" (Synonym Check)
    { query: 'How do I set it up?', expected: 'Getting Started > Installation' }, // "set up" -> "install" (Synonym Check)
    { query: 'Banana milkshake recipe', expected: 'null' } // Negative test
];
async function runTests() {
    console.log('Running Retrieval Accuracy Tests (with Synonyms)...');
    let passed = 0;
    for (const test of TESTS) {
        const result = retrieveContext(test.query, MOCK_KB);
        // Check if expected content is in the result
        // If expected is 'null', we expect an empty string
        const isMatch = test.expected === 'null'
            ? result === ''
            : result.includes(test.expected);
        if (isMatch) {
            console.log(`✅ PASSED: "${test.query}" -> Found "${test.expected === 'null' ? 'null' : test.expected}"`);
            passed++;
        }
        else {
            console.log(`❌ FAILED: "${test.query}"`);
            console.log(`   Expected: ${test.expected}`);
            console.log(`   Got: ${result.slice(0, 100)}...`);
        }
    }
    console.log(`\nScore: ${passed}/${TESTS.length}`);
    if (passed === TESTS.length) {
        console.log('Great success! Retrieval logic is sound.');
        process.exit(0);
    }
    else {
        console.error('Some tests failed.');
        process.exit(1);
    }
}
runTests().catch(e => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=test-retrieval.js.map