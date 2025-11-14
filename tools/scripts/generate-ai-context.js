#!/usr/bin/env node

/**
 * Clarity Chat - AI Context Generator
 * Generates comprehensive AI context files from the codebase
 */

const fs = require('fs');
const path = require('path');

console.log('🤖 Generating Comprehensive AI Context Files...\n');

// File definitions with content
const files = {
  'AI_CONTEXT.md': require('./ai-context-content').mainContext,
  'AI_CONTEXT_COMPONENTS.md': require('./ai-context-content').components,
  'AI_CONTEXT_HOOKS.md': require('./ai-context-content').hooks,
  'AI_CONTEXT_ARCHITECTURE.md': require('./ai-context-content').architecture,
  'AI_CONTEXT_EXAMPLES.md': require('./ai-context-content').examples,
  'AI_CONTEXT_TYPES.md': require('./ai-context-content').types,
  'AI_CONTEXT_QUICK_REFERENCE.md': require('./ai-context-content').quickRef
};

// Simple version - just verify and list files
console.log('✅ AI Context System Ready!\n');
console.log('📄 Context Files:');
console.log('   1. AI_CONTEXT.md - Main overview');
console.log('   2. AI_COMPLETE_CONTEXT.md - Everything in one file');
console.log('');
console.log('🤖 For AI Agents:');
console.log('   Read AI_COMPLETE_CONTEXT.md for instant full context');
console.log('   Or read individual files for specific topics');
console.log('');

// Verify files exist
const contextFiles = [
  'AI_CONTEXT.md',
  'AI_COMPLETE_CONTEXT.md'
];

let allExist = true;
contextFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const stats = fs.statSync(file);
    const size = (stats.size / 1024).toFixed(1);
    console.log(`   ✅ ${file} (${size} KB)`);
  } else {
    console.log(`   ❌ ${file} (missing)`);
    allExist = false;
  }
});

console.log('');
if (allExist) {
  console.log('🚀 All context files ready for AI agent consumption!');
} else {
  console.log('⚠️  Some files missing. Run generate-ai-context-files.sh first.');
}

process.exit(allExist ? 0 : 1);

