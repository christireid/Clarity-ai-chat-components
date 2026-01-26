#!/usr/bin/env node

/**
 * Automated script to wrap console statements in development checks
 * for the token-optimization package
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const SRC_DIR = path.join(__dirname, 'src');

// Find all TypeScript files
const files = glob.sync('**/*.{ts,tsx}', {
  cwd: SRC_DIR,
  absolute: true,
  ignore: ['**/*.d.ts', '**/node_modules/**']
});

console.log(`Found ${files.length} TypeScript files to process`);

let totalFixed = 0;
let filesModified = 0;

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  let fileFixed = 0;

  // Pattern 1: Single line console statements
  // console.log('message')
  const singleLinePattern = /^(\s*)(console\.(log|error|warn|info|debug)\([^)]*\))(\s*)$/gm;
  content = content.replace(singleLinePattern, (match, indent, consoleCall, method, trailing) => {
    fileFixed++;
    return `${indent}if (process.env.NODE_ENV === 'development') {\n${indent}  ${consoleCall}\n${indent}}${trailing}`;
  });

  // Pattern 2: Multi-line console statements (simple)
  // console.log(
  //   'message'
  // )
  const multiLinePattern = /^(\s*)(console\.(log|error|warn|info|debug)\(\n(?:.*\n)*?\s*\))(\s*)$/gm;
  content = content.replace(multiLinePattern, (match, indent, consoleCall) => {
    fileFixed++;
    const lines = consoleCall.split('\n');
    const wrappedLines = lines.map((line, i) => {
      if (i === 0) return line;
      return '  ' + line;
    }).join('\n');
    return `${indent}if (process.env.NODE_ENV === 'development') {\n${indent}  ${wrappedLines}\n${indent}}`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    filesModified++;
    totalFixed += fileFixed;
    const relativePath = path.relative(SRC_DIR, filePath);
    console.log(`✓ ${relativePath}: ${fileFixed} console statements wrapped`);
  }
});

console.log(`\n✅ Complete!`);
console.log(`   Files modified: ${filesModified}`);
console.log(`   Console statements fixed: ${totalFixed}`);
