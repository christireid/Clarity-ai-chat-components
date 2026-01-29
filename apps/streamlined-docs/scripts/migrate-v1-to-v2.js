#!/usr/bin/env node

/**
 * Automated Migration Script: v1.x → v2.0
 *
 * This codemod automatically migrates Clarity Chat components from v1.x to v2.0.
 *
 * Usage:
 *   node migrate-v1-to-v2.js <directory>
 *   node migrate-v1-to-v2.js src/ --dry-run
 *   node migrate-v1-to-v2.js . --backup
 *
 * Options:
 *   --dry-run    Show changes without modifying files
 *   --backup     Create backup files before modifying
 *   --verbose    Show detailed transformation log
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  exclude: ['node_modules', 'dist', 'build', '.next', 'out'],
  backupExt: '.v1.backup',
};

// Migration transformations
const TRANSFORMATIONS = {
  // 1. Hook rename: useChat → useClarityChat
  useChatHook: {
    pattern: /import\s*{\s*useChat\s*}\s*from\s*['"]@clarity-chat\/react['"]/g,
    replacement: "import { useClarityChat } from '@clarity-chat/react'",
    description: 'Rename useChat to useClarityChat',
  },

  // 2. Hook usage: useChat() → useClarityChat()
  useChatCall: {
    pattern: /const\s+(\w+)\s*=\s*useChat\(/g,
    replacement: 'const $1 = useClarityChat(',
    description: 'Update useChat() calls to useClarityChat()',
  },

  // 3. Component props: Flatten nested props
  chatWindowProps: {
    pattern: /messageActions\s*=\s*{{\s*onCopy:\s*(\w+),/g,
    replacement: 'onMessageCopy={$1}',
    description: 'Flatten messageActions props',
  },

  // 4. Token optimization imports
  tokenOptimizationImports: {
    pattern: /from\s*['"]@clarity-chat\/react\/internal['"]/g,
    replacement: "from '@clarity-chat/token-optimization'",
    description: 'Update token optimization imports',
  },

  // 5. Deprecated component: Think
  thinkComponent: {
    pattern: /import\s*{\s*Think\s*}\s*from\s*['"]@clarity-chat\/react['"]/g,
    replacement: "import { ThinkingPill } from '@clarity-chat/react'",
    description: 'Replace deprecated Think component',
  },

  // 6. Component subpath imports
  componentSubpaths: {
    pattern: /from\s*['"]@clarity-chat\/react\/components\/ai\/(\w+)['"]/g,
    replacement: "from '@clarity-chat/react'",
    description: 'Consolidate component imports',
  },
};

// Statistics tracker
const stats = {
  filesProcessed: 0,
  filesModified: 0,
  transformations: {},
  errors: [],
};

// CLI options
const options = {
  dryRun: process.argv.includes('--dry-run'),
  backup: process.argv.includes('--backup'),
  verbose: process.argv.includes('--verbose'),
};

/**
 * Main migration function
 */
function migrate(directory) {
  console.log('🚀 Clarity Chat Migration Tool v1 → v2\n');
  console.log(`📁 Target directory: ${directory}`);
  console.log(`🔍 Mode: ${options.dryRun ? 'DRY RUN' : 'LIVE'}\n`);

  if (!fs.existsSync(directory)) {
    console.error(`❌ Directory not found: ${directory}`);
    process.exit(1);
  }

  // Initialize transformation stats
  Object.keys(TRANSFORMATIONS).forEach((key) => {
    stats.transformations[key] = 0;
  });

  // Process all files recursively
  processDirectory(directory);

  // Print summary
  printSummary();

  // Check if peer dependencies need updating
  checkPeerDependencies();
}

/**
 * Process directory recursively
 */
function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    // Skip excluded directories
    if (entry.isDirectory()) {
      if (!CONFIG.exclude.includes(entry.name)) {
        processDirectory(fullPath);
      }
      continue;
    }

    // Process files with matching extensions
    const ext = path.extname(entry.name);
    if (CONFIG.extensions.includes(ext)) {
      processFile(fullPath);
    }
  }
}

/**
 * Process individual file
 */
function processFile(filePath) {
  stats.filesProcessed++;

  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;
    const originalContent = content;

    // Apply all transformations
    for (const [key, transform] of Object.entries(TRANSFORMATIONS)) {
      const matches = content.match(transform.pattern);
      if (matches) {
        content = content.replace(transform.pattern, transform.replacement);
        stats.transformations[key] += matches.length;
        modified = true;

        if (options.verbose) {
          console.log(`  ✓ ${transform.description} (${matches.length}x) in ${filePath}`);
        }
      }
    }

    if (modified) {
      stats.filesModified++;

      if (!options.dryRun) {
        // Create backup if requested
        if (options.backup) {
          fs.writeFileSync(
            filePath + CONFIG.backupExt,
            originalContent,
            'utf-8'
          );
        }

        // Write modified content
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`✅ Modified: ${filePath}`);
      } else {
        console.log(`📝 Would modify: ${filePath}`);
      }
    }
  } catch (error) {
    stats.errors.push({ file: filePath, error: error.message });
    console.error(`❌ Error processing ${filePath}: ${error.message}`);
  }
}

/**
 * Print migration summary
 */
function printSummary() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 Migration Summary');
  console.log('='.repeat(60));
  console.log(`Files processed: ${stats.filesProcessed}`);
  console.log(`Files modified: ${stats.filesModified}`);
  console.log('\nTransformations applied:');

  Object.entries(stats.transformations).forEach(([key, count]) => {
    if (count > 0) {
      console.log(`  • ${TRANSFORMATIONS[key].description}: ${count}`);
    }
  });

  if (stats.errors.length > 0) {
    console.log(`\n⚠️  Errors encountered: ${stats.errors.length}`);
    stats.errors.forEach(({ file, error }) => {
      console.log(`  • ${file}: ${error}`);
    });
  }

  console.log('='.repeat(60) + '\n');
}

/**
 * Check and suggest peer dependency updates
 */
function checkPeerDependencies() {
  console.log('📦 Checking peer dependencies...\n');

  const packageJsonPath = path.join(process.cwd(), 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    console.log('⚠️  No package.json found in current directory');
    return;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

  const requiredPeers = {
    'framer-motion': '^12.23.25',
    'lucide-react': '^0.500.0',
    'zod': '^3.24.0',
  };

  const missingPeers = [];
  const outdatedPeers = [];

  for (const [pkg, version] of Object.entries(requiredPeers)) {
    if (!deps[pkg]) {
      missingPeers.push({ pkg, version });
    } else if (!deps[pkg].includes(version.split('.')[0].replace('^', ''))) {
      outdatedPeers.push({ pkg, current: deps[pkg], required: version });
    }
  }

  if (missingPeers.length > 0) {
    console.log('❌ Missing required peer dependencies:');
    missingPeers.forEach(({ pkg, version }) => {
      console.log(`  • ${pkg}@${version}`);
    });
    console.log('\nInstall with:');
    const packages = missingPeers.map(({ pkg, version }) => `${pkg}@${version}`).join(' ');
    console.log(`  npm install ${packages}`);
    console.log(`  # or`);
    console.log(`  pnpm add ${packages}\n`);
  }

  if (outdatedPeers.length > 0) {
    console.log('⚠️  Potentially outdated peer dependencies:');
    outdatedPeers.forEach(({ pkg, current, required }) => {
      console.log(`  • ${pkg}: ${current} (required: ${required})`);
    });
    console.log('\nConsider updating to ensure compatibility.\n');
  }

  if (missingPeers.length === 0 && outdatedPeers.length === 0) {
    console.log('✅ All required peer dependencies are installed!\n');
  }
}

/**
 * Generate migration report
 */
function generateReport() {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      filesProcessed: stats.filesProcessed,
      filesModified: stats.filesModified,
      transformations: stats.transformations,
    },
    errors: stats.errors,
    recommendations: [
      'Run your test suite to verify functionality',
      'Check for TypeScript errors: npm run typecheck',
      'Update peer dependencies if needed',
      'Review and commit changes',
    ],
  };

  const reportPath = path.join(process.cwd(), 'migration-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`📄 Full report saved to: ${reportPath}\n`);
}

// Run migration
const targetDir = process.argv[2] || '.';
migrate(targetDir);
generateReport();

// Next steps
console.log('📋 Next Steps:');
console.log('1. Review the changes (git diff)');
console.log('2. Install missing peer dependencies');
console.log('3. Run: npm run typecheck');
console.log('4. Run: npm test');
console.log('5. Test your application thoroughly');
console.log('6. Commit when ready\n');
