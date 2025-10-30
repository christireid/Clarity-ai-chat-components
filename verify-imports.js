#!/usr/bin/env node

/**
 * Verify that all imports and exports are properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying imports and exports...\n');

// Track issues
const issues = [];

// Check if an import path exists
function checkImport(filePath, importPath, lineNum) {
  // Handle different import types
  if (importPath.startsWith('@clarity-chat/')) {
    // Internal package import
    const pkgName = importPath.split('/')[1];
    const pkgPath = path.join(__dirname, 'packages', pkgName);
    if (!fs.existsSync(pkgPath)) {
      issues.push({
        file: filePath,
        line: lineNum,
        type: 'missing-package',
        import: importPath
      });
    }
  } else if (importPath.startsWith('.')) {
    // Relative import
    const dir = path.dirname(filePath);
    const resolvedPath = path.resolve(dir, importPath);
    
    // Check with various extensions
    const extensions = ['.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx'];
    let found = false;
    
    for (const ext of extensions) {
      if (fs.existsSync(resolvedPath + ext) || fs.existsSync(resolvedPath)) {
        found = true;
        break;
      }
    }
    
    if (!found) {
      issues.push({
        file: filePath,
        line: lineNum,
        type: 'missing-file',
        import: importPath
      });
    }
  }
}

// Scan TypeScript/JavaScript files
function scanFile(filePath) {
  if (!filePath.includes('node_modules') && !filePath.includes('dist')) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      // Check import statements
      const importMatch = line.match(/import .* from ['"](.+)['"]/);
      if (importMatch) {
        checkImport(filePath, importMatch[1], index + 1);
      }
      
      // Check export statements
      const exportMatch = line.match(/export .* from ['"](.+)['"]/);
      if (exportMatch) {
        checkImport(filePath, exportMatch[1], index + 1);
      }
    });
  }
}

// Recursively scan directories
function scanDirectory(dir) {
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules' && item !== 'dist') {
      scanDirectory(fullPath);
    } else if (stat.isFile() && (item.endsWith('.ts') || item.endsWith('.tsx'))) {
      scanFile(fullPath);
    }
  });
}

// Scan packages
console.log('📦 Scanning packages...\n');
const packagesDir = path.join(__dirname, 'packages');
if (fs.existsSync(packagesDir)) {
  scanDirectory(packagesDir);
}

// Scan examples
console.log('📦 Scanning examples...\n');
const examplesDir = path.join(__dirname, 'examples');
if (fs.existsSync(examplesDir)) {
  scanDirectory(examplesDir);
}

// Report results
console.log('\n' + '='.repeat(50));
if (issues.length === 0) {
  console.log('\n✅ All imports and exports are valid!');
} else {
  console.log(`\n⚠️  Found ${issues.length} import issues:\n`);
  
  // Group by type
  const byType = {};
  issues.forEach(issue => {
    if (!byType[issue.type]) {
      byType[issue.type] = [];
    }
    byType[issue.type].push(issue);
  });
  
  Object.entries(byType).forEach(([type, typeIssues]) => {
    console.log(`\n${type === 'missing-package' ? '📦 Missing packages:' : '📄 Missing files:'}`);
    typeIssues.slice(0, 10).forEach(issue => {
      const shortPath = issue.file.replace(__dirname + '/', '');
      console.log(`  - ${shortPath}:${issue.line} → ${issue.import}`);
    });
    if (typeIssues.length > 10) {
      console.log(`  ... and ${typeIssues.length - 10} more`);
    }
  });
}
console.log('='.repeat(50) + '\n');

// Check for circular dependencies
console.log('🔄 Checking for circular dependencies...\n');

const dependencies = {};

function buildDependencyGraph(filePath) {
  if (!dependencies[filePath]) {
    dependencies[filePath] = new Set();
    
    if (fs.existsSync(filePath) && !filePath.includes('node_modules')) {
      const content = fs.readFileSync(filePath, 'utf8');
      const importMatches = content.matchAll(/import .* from ['"](.+)['"]/g);
      
      for (const match of importMatches) {
        const importPath = match[1];
        if (importPath.startsWith('.')) {
          const dir = path.dirname(filePath);
          const resolvedPath = path.resolve(dir, importPath);
          dependencies[filePath].add(resolvedPath);
        }
      }
    }
  }
}

// Build dependency graph for all TypeScript files
function buildFullGraph(dir) {
  if (fs.existsSync(dir) && !dir.includes('node_modules')) {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules' && item !== 'dist') {
        buildFullGraph(fullPath);
      } else if (stat.isFile() && (item.endsWith('.ts') || item.endsWith('.tsx'))) {
        buildDependencyGraph(fullPath);
      }
    });
  }
}

buildFullGraph(packagesDir);

// Simple circular dependency check
let hasCircular = false;
Object.entries(dependencies).forEach(([file, deps]) => {
  deps.forEach(dep => {
    if (dependencies[dep] && dependencies[dep].has(file)) {
      hasCircular = true;
      const shortFile = file.replace(__dirname + '/', '');
      const shortDep = dep.replace(__dirname + '/', '');
      console.log(`  ⚠️  Potential circular dependency: ${shortFile} ↔ ${shortDep}`);
    }
  });
});

if (!hasCircular) {
  console.log('  ✅ No circular dependencies detected');
}

console.log('\n' + '='.repeat(50));

process.exit(issues.length > 0 ? 1 : 0);