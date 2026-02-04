#!/usr/bin/env node
/**
 * Bundle Size Check
 *
 * Ensures bundle size stays under limits to prevent bloat.
 *
 * Usage: node scripts/check-bundle-size.js
 * Exit: 0 if under limit, 1 if over
 */

const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, '../dist');
const MAX_SIZE_MB = 1.5; // 1.5 MB limit for main bundle
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch {
    return 0;
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

console.log('📦 Checking bundle sizes...\n');

// Try both CJS and ESM bundles
const cjsBundle = path.join(DIST_DIR, 'index.js');
const esmBundle = path.join(DIST_DIR, 'index.mjs');
const size = Math.max(getFileSize(cjsBundle), getFileSize(esmBundle));

console.log(`Main bundle: ${formatBytes(size)}`);
console.log(`Limit: ${formatBytes(MAX_SIZE_BYTES)}\n`);

if (size > MAX_SIZE_BYTES) {
  console.error(`❌ Bundle size exceeds limit!\n`);
  process.exit(1);
} else {
  const percentage = Math.round((size / MAX_SIZE_BYTES) * 100);
  console.log(`✅ Bundle size OK (${percentage}% of limit)\n`);
  process.exit(0);
}
