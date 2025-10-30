#!/usr/bin/env node

/**
 * Test build script to verify package structure and basic functionality
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Clarity Chat - Package Structure Verification\n');

// Define packages to check
const packages = [
  { name: 'react', path: 'packages/react' },
  { name: 'types', path: 'packages/types' },
  { name: 'primitives', path: 'packages/primitives' },
  { name: 'error-handling', path: 'packages/error-handling' },
  { name: 'cli', path: 'packages/cli' },
];

// Define examples to check
const examples = [
  'basic-chat',
  'streaming-chat',
  'ai-assistant',
  'customer-support',
  'multi-user-chat',
  'model-comparison-demo',
  'rag-workbench-demo',
  'analytics-console-demo',
];

let hasErrors = false;

// Check packages
console.log('📦 Checking packages...\n');
packages.forEach(pkg => {
  const pkgPath = path.join(__dirname, pkg.path);
  const packageJsonPath = path.join(pkgPath, 'package.json');
  const srcPath = path.join(pkgPath, 'src');
  
  console.log(`  📁 ${pkg.name}:`);
  
  // Check package.json
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    console.log(`    ✅ package.json found (v${packageJson.version})`);
    console.log(`    📋 Name: ${packageJson.name}`);
  } else {
    console.log(`    ❌ package.json missing`);
    hasErrors = true;
  }
  
  // Check src directory
  if (fs.existsSync(srcPath)) {
    const files = fs.readdirSync(srcPath);
    console.log(`    ✅ src/ directory found (${files.length} items)`);
    
    // Check for index file
    const indexFile = files.find(f => f.startsWith('index.'));
    if (indexFile) {
      console.log(`    ✅ Entry point: ${indexFile}`);
    } else {
      console.log(`    ⚠️  No index file found`);
    }
  } else {
    console.log(`    ❌ src/ directory missing`);
    hasErrors = true;
  }
  
  // Check tsconfig
  const tsconfigPath = path.join(pkgPath, 'tsconfig.json');
  if (fs.existsSync(tsconfigPath)) {
    console.log(`    ✅ tsconfig.json found`);
  } else {
    console.log(`    ⚠️  tsconfig.json missing`);
  }
  
  console.log('');
});

// Check examples
console.log('🎯 Checking examples...\n');
examples.forEach(example => {
  const examplePath = path.join(__dirname, 'examples', example);
  
  if (fs.existsSync(examplePath)) {
    const packageJsonPath = path.join(examplePath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      console.log(`  ✅ ${example}: ${packageJson.name || 'unnamed'}`);
    } else {
      console.log(`  ⚠️  ${example}: no package.json`);
    }
  } else {
    console.log(`  ❌ ${example}: not found`);
    hasErrors = true;
  }
});

// Check root configuration
console.log('\n⚙️  Root configuration:\n');

const rootConfigs = [
  'package.json',
  'turbo.json',
  'eslint.config.js',
  'tailwind.config.js',
  '.gitignore',
  '.prettierrc',
];

rootConfigs.forEach(config => {
  const configPath = path.join(__dirname, config);
  if (fs.existsSync(configPath)) {
    console.log(`  ✅ ${config}`);
  } else {
    console.log(`  ❌ ${config} missing`);
    if (config === 'package.json' || config === 'turbo.json') {
      hasErrors = true;
    }
  }
});

// Check workspace configuration
console.log('\n🔧 Workspace configuration:\n');
const rootPackageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
if (rootPackageJson.workspaces) {
  console.log('  ✅ Workspaces configured:');
  rootPackageJson.workspaces.forEach(ws => {
    console.log(`    - ${ws}`);
  });
} else {
  console.log('  ❌ No workspaces configured');
  hasErrors = true;
}

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('\n⚠️  Some issues found, but structure is mostly correct.');
  console.log('   Run "npm install" to set up dependencies.');
} else {
  console.log('\n✅ All checks passed! Package structure is correct.');
  console.log('   Run "npm install" to set up dependencies.');
}
console.log('='.repeat(50) + '\n');

process.exit(hasErrors ? 1 : 0);