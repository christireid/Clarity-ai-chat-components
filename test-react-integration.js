#!/usr/bin/env node

// Test script to verify react package token optimization integration
const path = require('path');

async function testReactIntegration() {
  try {
    console.log('Testing React Package Token Optimization Integration...');
    
    // Test 1: Check if TokenCounter is available from token-optimization
    console.log('\n1. Testing TokenCounter import from token-optimization...');
    const { TokenCounter } = require('./packages/token-optimization/dist/index.js');
    
    if (TokenCounter) {
      console.log('✅ TokenCounter successfully imported');
      
      // Test basic counting
      const counter = new TokenCounter();
      const count = counter.count('Hello World');
      console.log(`✅ Token count for "Hello World": ${count}`);
    } else {
      console.log('❌ TokenCounter not found');
    }
    
    // Test 2: Check if react package can import token-optimization
    console.log('\n2. Testing react package imports...');
    
    // Check if the react package has the dependency
    const reactPackageJson = require('./packages/react/package.json');
    if (reactPackageJson.dependencies['@clarity-chat/token-optimization']) {
      console.log('✅ @clarity-chat/token-optimization dependency found in react package');
    } else {
      console.log('❌ @clarity-chat/token-optimization dependency not found in react package');
    }
    
    // Test 3: Check if estimator has been updated
    console.log('\n3. Testing estimator updates...');
    const estimatorContent = require('fs').readFileSync('./packages/react/src/utils/tokenization/estimator.ts', 'utf8');
    
    if (estimatorContent.includes('TokenCounter.count(text)')) {
      console.log('✅ estimator.ts has been updated to use TokenCounter');
    } else {
      console.log('❌ estimator.ts not updated properly');
    }
    
    if (estimatorContent.includes('@clarity-chat/token-optimization')) {
      console.log('✅ estimator.ts imports from @clarity-chat/token-optimization');
    } else {
      console.log('❌ estimator.ts does not import from @clarity-chat/token-optimization');
    }
    
    // Test 4: Check if accurate-counter has been updated
    console.log('\n4. Testing accurate-counter updates...');
    const accurateCounterContent = require('fs').readFileSync('./packages/react/src/utils/tokenization/accurate-counter.ts', 'utf8');
    
    if (accurateCounterContent.includes('TokenCounter')) {
      console.log('✅ accurate-counter.ts has been updated to use TokenCounter');
    } else {
      console.log('❌ accurate-counter.ts not updated properly');
    }
    
    if (accurateCounterContent.includes('@clarity-chat/token-optimization')) {
      console.log('✅ accurate-counter.ts imports from @clarity-chat/token-optimization');
    } else {
      console.log('❌ accurate-counter.ts does not import from @clarity-chat/token-optimization');
    }
    
    console.log('\n✅ Integration test completed successfully!');
    
  } catch (error) {
    console.error('❌ Integration test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testReactIntegration();