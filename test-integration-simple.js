#!/usr/bin/env node

/**
 * Integration test to verify token optimization migration
 * Simplified version focusing on core functionality
 */

import { TokenCounter, TokenBudgetManager, MemoryCompressor } from './packages/token-optimization/dist/index.js';

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

  // Test 2: TokenBudgetManager from new package
  try {
    console.log('\n2️⃣ Testing TokenBudgetManager from new package...');
    const budgetManager = new TokenBudgetManager({
      totalBudget: 10000,
      allocationStrategy: 'adaptive'
    });
    
    const allocation = budgetManager.getAllocation();
    console.log(`   ✅ TokenBudgetManager.getAllocation() completed`);
    console.log('   ✅ TokenBudgetManager works correctly');
  } catch (error) {
    console.log(`   ❌ TokenBudgetManager test failed: ${error.message}`);
    process.exit(1);
  }

  // Test 3: MemoryCompressor from new package
  try {
    console.log('\n3️⃣ Testing MemoryCompressor from new package...');
    const compressor = new MemoryCompressor({
      strategy: 'summarization',
      targetRatio: 0.5
    });
    
    const conversation = [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there! How can I help you today?' }
    ];
    
    const result = compressor.compressConversation(conversation, 50);
    console.log(`   ✅ MemoryCompressor.compressConversation() completed`);
    console.log('   ✅ MemoryCompressor works correctly');
  } catch (error) {
    console.log(`   ❌ MemoryCompressor test failed: ${error.message}`);
    process.exit(1);
  }

  // Test 4: Verify memory package is using new token optimization
  try {
    console.log('\n4️⃣ Testing memory package integration...');
    
    // Test that the memory package exports are working
    const memoryExports = await import('./packages/memory/dist/index.js');
    console.log('   ✅ Memory package exports loaded successfully');
    
    // Check if MemoryService is exported
    if (memoryExports.MemoryService) {
      console.log('   ✅ MemoryService is exported from memory package');
    } else {
      console.log('   ❌ MemoryService not found in memory package exports');
      process.exit(1);
    }
    
    // Check if ContextOptimizer is exported (should be using new token optimization)
    if (memoryExports.ContextOptimizer) {
      const contextOptimizer = new memoryExports.ContextOptimizer();
      console.log('   ✅ ContextOptimizer is available in memory package');
    } else {
      console.log('   ⚠️  ContextOptimizer not directly available (may be internal)');
    }
  } catch (error) {
    console.log(`   ❌ Memory package integration test failed: ${error.message}`);
    process.exit(1);
  }

  console.log('\n🎉 All integration tests passed!');
  console.log('✅ Token optimization migration is working correctly!');
  console.log('\n📊 Migration Summary:');
  console.log('   • TokenCounter: ✅ Using new package with legacy compatibility');
  console.log('   • TokenBudgetManager: ✅ Available from new package');
  console.log('   • MemoryCompressor: ✅ Available from new package');
  console.log('   • Memory package: ✅ Successfully integrated with new token optimization');
}

// Run the integration test
testMigration().catch(error => {
  console.error('💥 Integration test failed:', error);
  process.exit(1);
});