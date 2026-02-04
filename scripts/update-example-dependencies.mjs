#!/usr/bin/env node

/**
 * Update example app package.json files with peer dependencies
 * Based on audit results from audit-examples.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const auditResultsPath = resolve(__dirname, '../.cleanup-results/example-audit.json');

// Read audit results
const auditResults = JSON.parse(readFileSync(auditResultsPath, 'utf-8'));

console.log('Updating example app package.json files...\n');

let successCount = 0;
let errorCount = 0;

for (const example of auditResults) {
  console.log(`Updating: ${example.name}`);

  try {
    const packageJsonPath = `${example.path}/package.json`;
    const packageJson = example.currentPackageJson;

    // Skip if no missing peers
    if (example.missingPeers.length === 0) {
      console.log(`  ✓ Already has all peer dependencies\n`);
      successCount++;
      continue;
    }

    // Ensure dependencies object exists
    if (!packageJson.dependencies) {
      packageJson.dependencies = {};
    }

    // Add missing peer dependencies
    for (const peer of example.missingPeers) {
      const version = example.requiredPeers[peer];

      // Skip if already in dependencies or devDependencies
      if (packageJson.dependencies[peer] || packageJson.devDependencies?.[peer]) {
        console.log(`  - ${peer}: already present`);
        continue;
      }

      packageJson.dependencies[peer] = version;
      console.log(`  + ${peer}@${version}`);
    }

    // Sort dependencies alphabetically
    const sortedDeps = {};
    for (const key of Object.keys(packageJson.dependencies).sort()) {
      sortedDeps[key] = packageJson.dependencies[key];
    }
    packageJson.dependencies = sortedDeps;

    // Write updated package.json
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

    console.log(`  ✓ Updated successfully\n`);
    successCount++;

  } catch (error) {
    console.error(`  ✗ Error: ${error.message}\n`);
    errorCount++;
  }
}

console.log('='.repeat(80));
console.log('SUMMARY');
console.log('='.repeat(80));
console.log(`Total examples: ${auditResults.length}`);
console.log(`Successfully updated: ${successCount}`);
console.log(`Errors: ${errorCount}`);
console.log('\nNext steps:');
console.log('  1. Run: pnpm install (from monorepo root)');
console.log('  2. Run: node scripts/update-example-readmes.mjs');
console.log('  3. Test each example: cd apps/examples/<example> && pnpm dev');
