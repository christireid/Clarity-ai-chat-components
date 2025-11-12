#!/usr/bin/env node
/**
 * Repository Catalog Script
 * Scans the entire repository and generates a comprehensive inventory
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = join(__dirname, '..');

function scanDirectory(dir, basePath = '') {
  const items = [];
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      const relPath = join(basePath, entry.name);
      
      // Skip node_modules, .git, dist, build, etc.
      if (entry.name.startsWith('.') || 
          entry.name === 'node_modules' || 
          entry.name === 'dist' || 
          entry.name === 'build' ||
          entry.name === '.next' ||
          entry.name === 'storybook-static') {
        continue;
      }
      
      if (entry.isDirectory()) {
        items.push({
          type: 'directory',
          path: relPath,
          fullPath
        });
        items.push(...scanDirectory(fullPath, relPath));
      } else {
        items.push({
          type: 'file',
          path: relPath,
          fullPath
        });
      }
    }
  } catch (e) {
    // Skip directories we can't read
  }
  return items;
}

function readPackageJson(path) {
  try {
    const content = readFileSync(path, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    return null;
  }
}

function findPackageJsonFiles() {
  const items = scanDirectory(repoRoot);
  return items
    .filter(item => item.path.endsWith('package.json'))
    .map(item => ({
      path: item.path,
      fullPath: item.fullPath,
      pkg: readPackageJson(item.fullPath)
    }))
    .filter(item => item.pkg !== null);
}

function categorizeFiles() {
  const items = scanDirectory(repoRoot);
  const categories = {
    statusReports: [],
    guides: [],
    changelogs: [],
    readmes: [],
    storybook: [],
    docs: [],
    examples: [],
    scripts: [],
    configs: []
  };
  
  for (const item of items) {
    const path = item.path.toLowerCase();
    
    if (path.includes('status') || path.includes('complete') || path.includes('summary')) {
      categories.statusReports.push(item.path);
    } else if (path.includes('guide') || path.includes('migration')) {
      categories.guides.push(item.path);
    } else if (path.includes('changelog')) {
      categories.changelogs.push(item.path);
    } else if (path === 'readme.md' || path.endsWith('/readme.md')) {
      categories.readmes.push(item.path);
    } else if (path.includes('storybook')) {
      categories.storybook.push(item.path);
    } else if (path.includes('docs') || path.includes('doc')) {
      categories.docs.push(item.path);
    } else if (path.includes('example')) {
      categories.examples.push(item.path);
    } else if (path.includes('script')) {
      categories.scripts.push(item.path);
    } else if (path.includes('config') || path.endsWith('.config.js') || path.endsWith('.config.ts')) {
      categories.configs.push(item.path);
    }
  }
  
  return categories;
}

// Main execution
const packages = findPackageJsonFiles();
const categories = categorizeFiles();

// Generate markdown report
let report = `# Repository Inventory Report\n\n`;
report += `Generated: ${new Date().toISOString()}\n\n`;
report += `## Overview\n\n`;
report += `- Total packages found: ${packages.length}\n`;
report += `- Status/report files: ${categories.statusReports.length}\n`;
report += `- Guide files: ${categories.guides.length}\n`;
report += `- README files: ${categories.readmes.length}\n`;
report += `- Storybook files: ${categories.storybook.length}\n`;
report += `- Documentation files: ${categories.docs.length}\n`;
report += `- Example files: ${categories.examples.length}\n\n`;

report += `## Package Inventory\n\n`;
report += `### Root Package\n\n`;
const rootPkg = packages.find(p => p.path === 'package.json');
if (rootPkg) {
  report += `- **Path**: \`${rootPkg.path}\`\n`;
  report += `- **Name**: ${rootPkg.pkg.name}\n`;
  report += `- **Version**: ${rootPkg.pkg.version}\n`;
  report += `- **Description**: ${rootPkg.pkg.description || 'N/A'}\n`;
  report += `- **Workspaces**: ${JSON.stringify(rootPkg.pkg.workspaces || [])}\n\n`;
}

report += `### Apps\n\n`;
const apps = packages.filter(p => p.path.startsWith('apps/'));
for (const app of apps) {
  report += `#### ${app.pkg.name || app.path}\n`;
  report += `- **Path**: \`${app.path}\`\n`;
  report += `- **Version**: ${app.pkg.version || 'N/A'}\n`;
  report += `- **Private**: ${app.pkg.private || false}\n`;
  if (app.pkg.description) {
    report += `- **Description**: ${app.pkg.description}\n`;
  }
  report += `\n`;
}

report += `### Packages\n\n`;
const pkgs = packages.filter(p => p.path.startsWith('packages/'));
for (const pkg of pkgs) {
  report += `#### ${pkg.pkg.name || pkg.path}\n`;
  report += `- **Path**: \`${pkg.path}\`\n`;
  report += `- **Version**: ${pkg.pkg.version || 'N/A'}\n`;
  report += `- **Private**: ${pkg.pkg.private !== false}\n`;
  if (pkg.pkg.description) {
    report += `- **Description**: ${pkg.pkg.description}\n`;
  }
  if (pkg.pkg.main || pkg.pkg.module) {
    report += `- **Exports**: ${pkg.pkg.main || 'N/A'} (CJS), ${pkg.pkg.module || 'N/A'} (ESM)\n`;
  }
  report += `\n`;
}

report += `### Examples\n\n`;
const examples = packages.filter(p => p.path.startsWith('examples/'));
for (const ex of examples) {
  report += `- **${ex.pkg.name || ex.path}**: \`${ex.path}\`\n`;
}

report += `\n### Other Packages\n\n`;
const others = packages.filter(p => 
  !p.path.startsWith('apps/') && 
  !p.path.startsWith('packages/') && 
  !p.path.startsWith('examples/') &&
  p.path !== 'package.json'
);
for (const other of others) {
  report += `- **${other.pkg.name || other.path}**: \`${other.path}\`\n`;
}

report += `\n## File Categories\n\n`;
report += `### Status/Report Files (${categories.statusReports.length})\n\n`;
for (const file of categories.statusReports.slice(0, 50)) {
  report += `- \`${file}\`\n`;
}
if (categories.statusReports.length > 50) {
  report += `\n... and ${categories.statusReports.length - 50} more\n`;
}

report += `\n### Guide Files (${categories.guides.length})\n\n`;
for (const file of categories.guides) {
  report += `- \`${file}\`\n`;
}

report += `\n### Changelog Files (${categories.changelogs.length})\n\n`;
for (const file of categories.changelogs) {
  report += `- \`${file}\`\n`;
}

report += `\n### Storybook Files (${categories.storybook.length})\n\n`;
for (const file of categories.storybook.slice(0, 20)) {
  report += `- \`${file}\`\n`;
}

console.log(report);
