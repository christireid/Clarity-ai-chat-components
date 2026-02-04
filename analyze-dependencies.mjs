#!/usr/bin/env node

/**
 * Dependency Consistency Analyzer
 * Checks for inconsistent version ranges, missing workspace references, and missing peerDependencies
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get all package.json files
const files = execSync(
  'find . -name "package.json" -not -path "*/node_modules/*" -not -path "*/.next/*" -type f',
  { cwd: __dirname, encoding: 'utf-8' }
)
  .trim()
  .split('\n')
  .filter(f => f);

console.log(`\n📦 Analyzing ${files.length} package.json files...\n`);

// Parse all package.json files
const packages = files.map(file => {
  const fullPath = join(__dirname, file);
  const content = JSON.parse(readFileSync(fullPath, 'utf-8'));
  return {
    path: file,
    name: content.name || 'unnamed',
    private: content.private || false,
    dependencies: content.dependencies || {},
    devDependencies: content.devDependencies || {},
    peerDependencies: content.peerDependencies || {},
    peerDependenciesMeta: content.peerDependenciesMeta || {},
  };
});

// Filter out .next build artifacts and focus on source packages
const sourcePackages = packages.filter(pkg =>
  !pkg.path.includes('/.next/') &&
  !pkg.path.includes('/node_modules/')
);

console.log(`✓ Found ${sourcePackages.length} source packages\n`);

// Track all dependency versions across packages
const dependencyVersions = new Map();
const workspacePackages = new Set();
const issues = {
  versionInconsistencies: [],
  missingWorkspaceRefs: [],
  missingPeerDeps: [],
  incorrectWorkspaceRefs: [],
};

// Identify workspace packages
sourcePackages.forEach(pkg => {
  if (pkg.name && pkg.name.startsWith('@clarity-chat/')) {
    workspacePackages.add(pkg.name);
  }
});

console.log(`📁 Workspace packages: ${workspacePackages.size}`);
workspacePackages.forEach(name => console.log(`   - ${name}`));
console.log();

// Analyze dependencies
sourcePackages.forEach(pkg => {
  const allDeps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
  };

  Object.entries(allDeps).forEach(([depName, version]) => {
    // Track version ranges for external dependencies
    if (!depName.startsWith('@clarity-chat/')) {
      if (!dependencyVersions.has(depName)) {
        dependencyVersions.set(depName, new Map());
      }
      const versions = dependencyVersions.get(depName);
      if (!versions.has(version)) {
        versions.set(version, []);
      }
      versions.get(version).push(pkg.name);
    }

    // Check for workspace packages that should use workspace:*
    if (workspacePackages.has(depName)) {
      if (version !== 'workspace:*' && !version.startsWith('file:')) {
        issues.missingWorkspaceRefs.push({
          package: pkg.name,
          path: pkg.path,
          dependency: depName,
          version: version,
          expected: 'workspace:*'
        });
      }
    }

    // Check for incorrect workspace references to non-workspace packages
    if (version === 'workspace:*' && !workspacePackages.has(depName)) {
      issues.incorrectWorkspaceRefs.push({
        package: pkg.name,
        path: pkg.path,
        dependency: depName,
        version: version
      });
    }
  });

  // Check for missing peerDependencies
  const deps = { ...pkg.dependencies };

  // React and react-dom should be peer dependencies for React component libraries
  if (pkg.name && pkg.name.startsWith('@clarity-chat/') && !pkg.private) {
    if (deps['react'] && !pkg.peerDependencies['react']) {
      issues.missingPeerDeps.push({
        package: pkg.name,
        path: pkg.path,
        dependency: 'react',
        found: 'dependencies',
        expected: 'peerDependencies'
      });
    }
    if (deps['react-dom'] && !pkg.peerDependencies['react-dom']) {
      issues.missingPeerDeps.push({
        package: pkg.name,
        path: pkg.path,
        dependency: 'react-dom',
        found: 'dependencies',
        expected: 'peerDependencies'
      });
    }
  }
});

// Find version inconsistencies
dependencyVersions.forEach((versions, depName) => {
  if (versions.size > 1) {
    // Filter out intentional differences (e.g., different major versions for different contexts)
    const versionList = Array.from(versions.entries());

    issues.versionInconsistencies.push({
      dependency: depName,
      versions: versionList.map(([ver, pkgs]) => ({
        version: ver,
        packages: pkgs
      }))
    });
  }
});

// Report findings
console.log('═══════════════════════════════════════════════════════════════');
console.log('📊 DEPENDENCY CONSISTENCY REPORT');
console.log('═══════════════════════════════════════════════════════════════\n');

// 1. Version Inconsistencies
if (issues.versionInconsistencies.length > 0) {
  console.log('⚠️  VERSION INCONSISTENCIES');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  issues.versionInconsistencies.forEach(({ dependency, versions }) => {
    console.log(`📦 ${dependency}`);
    versions.forEach(({ version, packages }) => {
      console.log(`   ${version}`);
      packages.slice(0, 3).forEach(pkg => console.log(`      - ${pkg}`));
      if (packages.length > 3) {
        console.log(`      ... and ${packages.length - 3} more`);
      }
    });
    console.log();
  });
} else {
  console.log('✅ VERSION CONSISTENCY: All dependencies have consistent versions\n');
}

// 2. Missing workspace:* references
if (issues.missingWorkspaceRefs.length > 0) {
  console.log('⚠️  MISSING WORKSPACE:* REFERENCES');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  issues.missingWorkspaceRefs.forEach(({ package: pkg, path, dependency, version, expected }) => {
    console.log(`❌ ${pkg}`);
    console.log(`   Path: ${path}`);
    console.log(`   Dependency: ${dependency}`);
    console.log(`   Current: ${version}`);
    console.log(`   Expected: ${expected}`);
    console.log();
  });
} else {
  console.log('✅ WORKSPACE REFERENCES: All internal dependencies use workspace:*\n');
}

// 3. Incorrect workspace references
if (issues.incorrectWorkspaceRefs.length > 0) {
  console.log('⚠️  INCORRECT WORKSPACE:* REFERENCES');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  issues.incorrectWorkspaceRefs.forEach(({ package: pkg, path, dependency, version }) => {
    console.log(`❌ ${pkg}`);
    console.log(`   Path: ${path}`);
    console.log(`   Dependency: ${dependency} (not a workspace package)`);
    console.log(`   Current: ${version}`);
    console.log();
  });
} else {
  console.log('✅ WORKSPACE REFERENCES: No incorrect workspace:* references\n');
}

// 4. Missing peerDependencies
if (issues.missingPeerDeps.length > 0) {
  console.log('⚠️  MISSING PEER DEPENDENCIES');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  issues.missingPeerDeps.forEach(({ package: pkg, path, dependency, found, expected }) => {
    console.log(`❌ ${pkg}`);
    console.log(`   Path: ${path}`);
    console.log(`   Dependency: ${dependency}`);
    console.log(`   Found in: ${found}`);
    console.log(`   Should be in: ${expected}`);
    console.log();
  });
} else {
  console.log('✅ PEER DEPENDENCIES: All peer dependencies correctly configured\n');
}

// Summary
console.log('═══════════════════════════════════════════════════════════════');
console.log('📋 SUMMARY');
console.log('═══════════════════════════════════════════════════════════════\n');

const totalIssues =
  issues.versionInconsistencies.length +
  issues.missingWorkspaceRefs.length +
  issues.incorrectWorkspaceRefs.length +
  issues.missingPeerDeps.length;

console.log(`Total Issues Found: ${totalIssues}`);
console.log(`  - Version Inconsistencies: ${issues.versionInconsistencies.length}`);
console.log(`  - Missing workspace:* refs: ${issues.missingWorkspaceRefs.length}`);
console.log(`  - Incorrect workspace:* refs: ${issues.incorrectWorkspaceRefs.length}`);
console.log(`  - Missing peer dependencies: ${issues.missingPeerDeps.length}`);
console.log();

if (totalIssues === 0) {
  console.log('🎉 All dependency consistency checks passed!\n');
  process.exit(0);
} else {
  console.log('⚠️  Issues found - please review and fix the inconsistencies above.\n');
  process.exit(1);
}
