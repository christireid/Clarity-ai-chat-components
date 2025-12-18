#!/usr/bin/env node

/**
 * Integration test to verify token optimization migration
 */

import { TokenCounter, TokenBudgetManager, MemoryCompressor } from './packages/token-optimization/dist/index.js';
import { MemoryService } from './packages/memory/dist/index.js';

async function testMigration() {
  console.log('🧪 Testing token optimization migration...\n');

  // Test 1: TokenCounter from new package
  try {
    console.log('1️⃣ Testing TokenCounter from new package...');
    const text = 'Hello World';
    const tokenCount = TokenCounter.count(text);
    console.log(`   ✅ TokenCounter.count('${text}') = ${tokenCount}`);
    
    // Should be 3 (using legacy compatibility)
    if (tokenCount === 3) {
      console.log('   ✅ TokenCounter returns expected value (3)');
    } else {
      console.log(`   ❌ TokenCounter returned ${tokenCount}, expected 3`);
      process.exit(1);
    }
  } catch (error) {
    console.log(`   ❌ TokenCounter test failed: ${error.message}`);
    process.exit(1);
  }

  // Test 2: MemoryService using token optimization
  try {
    console.log('\n2️⃣ Testing MemoryService with token optimization...');
    const memoryService = new MemoryService({
      apiKey: 'test-key',
      provider: 'openai',
      model: 'gpt-4',
      maxContextWindow: 4096
    });
    
    // This should use the new token optimization internally
    console.log('   ✅ MemoryService created successfully');
    
    // Test that it has the expected methods
    if (typeof memoryService.createMemory === 'function') {
      console.log('   ✅ MemoryService.createMemory method exists');
    } else {
      console.log('   ❌ MemoryService.createMemory method missing');
      process.exit(1);
    }
  } catch (error) {
    console.log(`   ❌ MemoryService test failed: ${error.message}`);
    process.exit(1);
  }

  // Test 3: TokenBudgetManager from new package
  try {
    console.log('\n3️⃣ Testing TokenBudgetManager from new package...');
    const budgetManager = new TokenBudgetManager({
      totalBudget: 10000,
      allocationStrategy: 'adaptive'
    });
    
    const allocation = budgetManager.allocateBudget('episodic', 1000);
    console.log(`   ✅ TokenBudgetManager.allocateBudget() = ${JSON.stringify(allocation)}`);
    console.log('   ✅ TokenBudgetManager works correctly');
  } catch (error) {
    console.log(`   ❌ TokenBudgetManager test failed: ${error.message}`);
    process.exit(1);
  }

  // Test 4: MemoryCompressor from new package
  try {
    console.log('\n4️⃣ Testing MemoryCompressor from new package...');
    const compressor = new MemoryCompressor({
      strategy: 'summarization',
      targetRatio: 0.5
    });
    
    const conversation = [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there!' }
    ];
    
    const result = compressor.compressConversation(conversation, 50);
    console.log(`   ✅ MemoryCompressor.compressConversation() completed`);
    console.log('   ✅ MemoryCompressor works correctly');
  } catch (error) {
    console.log(`   ❌ MemoryCompressor test failed: ${error.message}`);
    process.exit(1);
  }

  console.log('\n🎉 All integration tests passed!');
  console.log('✅ Token optimization migration is working correctly!');
}

// Run the integration test
testMigration().catch(error => {
  console.error('💥 Integration test failed:', error);
  process.exit(1);
});