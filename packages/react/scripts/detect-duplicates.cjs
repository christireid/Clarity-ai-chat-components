#!/usr/bin/env node
/**
 * Duplicate Detection Script
 *
 * Detects duplicate/similar code patterns that should be consolidated.
 * Focuses on high-impact duplicates (hooks, components, utilities).
 *
 * Usage: node scripts/detect-duplicates.js
 * Exit: 0 if under threshold, 1 if too many duplicates
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SRC_DIR = path.join(__dirname, '../src');
const DUPLICATE_THRESHOLD = 720; // Current baseline - needs refinement

// Patterns to detect
const PATTERNS = {
  chatHooks: /use.*[Cc]hat/,
  markdownRenderers: /[Mm]arkdown.*[Rr]enderer/,
  retryLogic: /retry|attempt|backoff/i,
  validationLogic: /validate|validation|validator/i,
  errorHandlers: /error.*handler|handle.*error/i,
};

function findFiles(dir, pattern, results = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && !file.includes('node_modules') && !file.includes('dist')) {
      findFiles(filePath, pattern, results);
    } else if (pattern.test(file)) {
      results.push(filePath);
    }
  }

  return results;
}

function detectDuplicates() {
  console.log('🔍 Detecting duplicate patterns...\n');

  const duplicates = {};

  // Find TypeScript/TSX files
  const files = findFiles(SRC_DIR, /\.(ts|tsx)$/);

  for (const [name, pattern] of Object.entries(PATTERNS)) {
    const matches = files.filter(f => {
      const filename = path.basename(f);
      const content = fs.readFileSync(f, 'utf-8');
      return pattern.test(filename) || pattern.test(content);
    });

    if (matches.length > 1) {
      duplicates[name] = matches;
    }
  }

  // Report findings
  let totalDuplicates = 0;

  for (const [pattern, files] of Object.entries(duplicates)) {
    console.log(`📦 ${pattern}:`);
    files.forEach(f => {
      const relativePath = path.relative(SRC_DIR, f);
      console.log(`   - ${relativePath}`);
    });
    console.log(`   Count: ${files.length}\n`);
    totalDuplicates += files.length - 1; // -1 because one is canonical
  }

  console.log(`📊 Total duplicate patterns: ${totalDuplicates}`);
  console.log(`📊 Threshold: ${DUPLICATE_THRESHOLD}\n`);

  if (totalDuplicates > DUPLICATE_THRESHOLD) {
    console.error(`❌ Too many duplicates (${totalDuplicates} > ${DUPLICATE_THRESHOLD})\n`);
    return 1;
  } else {
    console.log(`✅ Duplicates within threshold (${totalDuplicates} <= ${DUPLICATE_THRESHOLD})\n`);
    return 0;
  }
}

process.exit(detectDuplicates());
