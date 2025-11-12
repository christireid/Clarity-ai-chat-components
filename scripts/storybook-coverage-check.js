#!/usr/bin/env node

/**
 * Storybook Coverage Check
 * 
 * Analyzes the codebase to check which components, hooks, and utilities
 * have corresponding Storybook stories.
 * 
 * Usage:
 *   node scripts/storybook-coverage-check.js
 *   node scripts/storybook-coverage-check.js --json (for JSON output)
 *   node scripts/storybook-coverage-check.js --verbose (for detailed output)
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const config = {
  componentsDir: path.join(__dirname, '../packages/react/src/components'),
  hooksDir: path.join(__dirname, '../packages/react/src/hooks'),
  utilsDir: path.join(__dirname, '../packages/react/src/utils'),
  storiesDir: path.join(__dirname, '../apps/storybook/stories'),
};

// Parse command line arguments
const args = process.argv.slice(2);
const isJsonOutput = args.includes('--json');
const isVerbose = args.includes('--verbose');

/**
 * Get all component files
 */
function getComponents() {
  const pattern = path.join(config.componentsDir, '**/*.{tsx,ts}');
  const files = glob.sync(pattern, {
    ignore: [
      '**/*.test.{ts,tsx}',
      '**/*.spec.{ts,tsx}',
      '**/*.d.ts',
      '**/index.ts',
      '**/__tests__/**',
    ],
  });

  return files.map(file => {
    const relativePath = path.relative(config.componentsDir, file);
    const name = path.basename(file, path.extname(file));
    return {
      name,
      path: relativePath,
      type: 'component',
    };
  });
}

/**
 * Get all hook files
 */
function getHooks() {
  const pattern = path.join(config.hooksDir, '**/*.{tsx,ts}');
  const files = glob.sync(pattern, {
    ignore: [
      '**/*.test.{ts,tsx}',
      '**/*.spec.{ts,tsx}',
      '**/*.d.ts',
      '**/index.ts',
      '**/__tests__/**',
    ],
  });

  return files.map(file => {
    const relativePath = path.relative(config.hooksDir, file);
    const name = path.basename(file, path.extname(file));
    return {
      name,
      path: relativePath,
      type: 'hook',
    };
  });
}

/**
 * Get all utility files
 */
function getUtils() {
  const pattern = path.join(config.utilsDir, '**/*.{tsx,ts}');
  const files = glob.sync(pattern, {
    ignore: [
      '**/*.test.{ts,tsx}',
      '**/*.spec.{ts,tsx}',
      '**/*.d.ts',
      '**/index.ts',
      '**/__tests__/**',
    ],
  });

  return files.map(file => {
    const relativePath = path.relative(config.utilsDir, file);
    const name = path.basename(file, path.extname(file));
    return {
      name,
      path: relativePath,
      type: 'utility',
    };
  });
}

/**
 * Get all story files
 */
function getStories() {
  const pattern = path.join(config.storiesDir, '**/*.stories.{tsx,ts}');
  const files = glob.sync(pattern);

  return files.map(file => {
    const name = path.basename(file).replace(/\.stories\.(tsx|ts)$/, '');
    return {
      name,
      path: path.relative(config.storiesDir, file),
    };
  });
}

/**
 * Convert name to various formats for matching
 */
function getNameVariations(name) {
  const variations = new Set([name]);
  
  // kebab-case to PascalCase
  const pascalCase = name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  variations.add(pascalCase);
  
  // PascalCase to kebab-case
  const kebabCase = name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
  variations.add(kebabCase);
  
  // Remove common prefixes/suffixes
  const withoutUse = name.replace(/^use-?/i, '');
  if (withoutUse !== name) {
    variations.add(withoutUse);
    variations.add(withoutUse.charAt(0).toUpperCase() + withoutUse.slice(1));
  }
  
  return Array.from(variations);
}

/**
 * Check if item has a story
 */
function hasStory(item, stories) {
  const variations = getNameVariations(item.name);
  
  return stories.some(story => {
    const storyVariations = getNameVariations(story.name);
    return variations.some(v => storyVariations.includes(v));
  });
}

/**
 * Calculate coverage
 */
function calculateCoverage(items, stories) {
  const withStories = items.filter(item => hasStory(item, stories));
  const withoutStories = items.filter(item => !hasStory(item, stories));
  
  const total = items.length;
  const covered = withStories.length;
  const percentage = total > 0 ? Math.round((covered / total) * 100) : 0;
  
  return {
    total,
    covered,
    uncovered: total - covered,
    percentage,
    withStories,
    withoutStories,
  };
}

/**
 * Print results
 */
function printResults(components, hooks, utils, stories) {
  const componentCoverage = calculateCoverage(components, stories);
  const hookCoverage = calculateCoverage(hooks, stories);
  const utilCoverage = calculateCoverage(utils, stories);
  
  const totalItems = components.length + hooks.length + utils.length;
  const totalCovered = componentCoverage.covered + hookCoverage.covered + utilCoverage.covered;
  const overallPercentage = Math.round((totalCovered / totalItems) * 100);
  
  if (isJsonOutput) {
    console.log(JSON.stringify({
      overall: {
        total: totalItems,
        covered: totalCovered,
        uncovered: totalItems - totalCovered,
        percentage: overallPercentage,
      },
      components: {
        total: componentCoverage.total,
        covered: componentCoverage.covered,
        uncovered: componentCoverage.uncovered,
        percentage: componentCoverage.percentage,
        missing: isVerbose ? componentCoverage.withoutStories.map(c => c.name) : undefined,
      },
      hooks: {
        total: hookCoverage.total,
        covered: hookCoverage.covered,
        uncovered: hookCoverage.uncovered,
        percentage: hookCoverage.percentage,
        missing: isVerbose ? hookCoverage.withoutStories.map(h => h.name) : undefined,
      },
      utilities: {
        total: utilCoverage.total,
        covered: utilCoverage.covered,
        uncovered: utilCoverage.uncovered,
        percentage: utilCoverage.percentage,
        missing: isVerbose ? utilCoverage.withoutStories.map(u => u.name) : undefined,
      },
      stories: {
        total: stories.length,
      },
    }, null, 2));
    return;
  }
  
  console.log('\n📊 Storybook Coverage Report\n');
  console.log('═'.repeat(60));
  
  // Overall
  console.log('\n📈 Overall Coverage');
  console.log(`   Total Items:    ${totalItems}`);
  console.log(`   With Stories:   ${totalCovered}`);
  console.log(`   Missing Stories: ${totalItems - totalCovered}`);
  console.log(`   Coverage:       ${overallPercentage}%`);
  printBar(overallPercentage);
  
  // Components
  console.log('\n🧩 Components');
  console.log(`   Total:          ${componentCoverage.total}`);
  console.log(`   With Stories:   ${componentCoverage.covered}`);
  console.log(`   Missing:        ${componentCoverage.uncovered}`);
  console.log(`   Coverage:       ${componentCoverage.percentage}%`);
  printBar(componentCoverage.percentage);
  
  if (isVerbose && componentCoverage.uncovered > 0) {
    console.log('\n   Missing Stories:');
    componentCoverage.withoutStories.forEach(item => {
      console.log(`   - ${item.name} (${item.path})`);
    });
  }
  
  // Hooks
  console.log('\n🎣 Hooks');
  console.log(`   Total:          ${hookCoverage.total}`);
  console.log(`   With Stories:   ${hookCoverage.covered}`);
  console.log(`   Missing:        ${hookCoverage.uncovered}`);
  console.log(`   Coverage:       ${hookCoverage.percentage}%`);
  printBar(hookCoverage.percentage);
  
  if (isVerbose && hookCoverage.uncovered > 0) {
    console.log('\n   Missing Stories:');
    hookCoverage.withoutStories.forEach(item => {
      console.log(`   - ${item.name} (${item.path})`);
    });
  }
  
  // Utilities
  console.log('\n🛠️  Utilities');
  console.log(`   Total:          ${utilCoverage.total}`);
  console.log(`   With Stories:   ${utilCoverage.covered}`);
  console.log(`   Missing:        ${utilCoverage.uncovered}`);
  console.log(`   Coverage:       ${utilCoverage.percentage}%`);
  printBar(utilCoverage.percentage);
  
  if (isVerbose && utilCoverage.uncovered > 0) {
    console.log('\n   Missing Stories:');
    utilCoverage.withoutStories.forEach(item => {
      console.log(`   - ${item.name} (${item.path})`);
    });
  }
  
  // Stories
  console.log('\n📚 Stories');
  console.log(`   Total Stories:  ${stories.length}`);
  
  console.log('\n' + '═'.repeat(60));
  
  // Status
  if (overallPercentage >= 90) {
    console.log('\n✅ Excellent coverage! Keep it up!\n');
  } else if (overallPercentage >= 75) {
    console.log('\n👍 Good coverage, but room for improvement.\n');
  } else {
    console.log('\n⚠️  Coverage needs improvement. Consider adding more stories.\n');
  }
  
  if (!isVerbose && (componentCoverage.uncovered > 0 || hookCoverage.uncovered > 0 || utilCoverage.uncovered > 0)) {
    console.log('💡 Run with --verbose to see missing items\n');
  }
}

/**
 * Print progress bar
 */
function printBar(percentage) {
  const width = 40;
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;
  
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  const color = percentage >= 90 ? '\x1b[32m' : percentage >= 75 ? '\x1b[33m' : '\x1b[31m';
  const reset = '\x1b[0m';
  
  console.log(`   ${color}${bar}${reset} ${percentage}%`);
}

/**
 * Main
 */
function main() {
  try {
    console.log('🔍 Analyzing codebase...\n');
    
    const components = getComponents();
    const hooks = getHooks();
    const utils = getUtils();
    const stories = getStories();
    
    printResults(components, hooks, utils, stories);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  getComponents,
  getHooks,
  getUtils,
  getStories,
  calculateCoverage,
};
