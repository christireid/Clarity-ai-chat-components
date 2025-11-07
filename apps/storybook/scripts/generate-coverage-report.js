#!/usr/bin/env node

/**
 * Storybook Coverage Report Generator
 *
 * Scans @clarity-chat/react exports and Storybook stories to determine which
 * components, hooks, utilities, and SDK modules have interactive coverage.
 */

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '../../..');
const sourceRoot = path.join(repoRoot, 'packages', 'react', 'src');
const storiesRoot = path.join(repoRoot, 'apps', 'storybook', 'stories');
const outputDir = path.join(repoRoot, 'apps', 'storybook', 'coverage');

function readFileIfExists(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    return null;
  }
}

function stripComments(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '') // block comments
    .replace(/\/\/.*$/gm, ''); // line comments
}

function resolveModuleFile(modulePath) {
  const base = path.join(sourceRoot, modulePath);
  const candidates = [
    `${base}.ts`,
    `${base}.tsx`,
    `${base}.mts`,
    `${base}.mjs`,
    `${base}.js`,
    `${base}.cts`,
    `${base}.cjs`,
    path.join(base, 'index.ts'),
    path.join(base, 'index.tsx'),
    path.join(base, 'index.mts'),
    path.join(base, 'index.mjs'),
    path.join(base, 'index.js'),
    path.join(base, 'index.cjs'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

function extractRuntimeExports(modulePath, visited = new Set()) {
  if (visited.has(modulePath)) {
    return { exports: new Set(), filePath: null };
  }
  visited.add(modulePath);

  const filePath = resolveModuleFile(modulePath);
  if (!filePath) {
    return { exports: new Set(), filePath: null };
  }

  const rawContent = readFileIfExists(filePath);
  if (!rawContent) {
    return { exports: new Set(), filePath };
  }

  const content = stripComments(rawContent);
  const runtimeExports = new Set();

  const addName = (name) => {
    if (!name) return;
    if (/^_+$/.test(name)) return;
    runtimeExports.add(name.trim());
  };

  const functionRegex = /export\s+function\s+([A-Za-z0-9_]+)/g;
  let match;
  while ((match = functionRegex.exec(content)) !== null) {
    addName(match[1]);
  }

  const constRegex = /export\s+const\s+([A-Za-z0-9_]+)/g;
  while ((match = constRegex.exec(content)) !== null) {
    addName(match[1]);
  }

  const classRegex = /export\s+class\s+([A-Za-z0-9_]+)/g;
  while ((match = classRegex.exec(content)) !== null) {
    addName(match[1]);
  }

  const defaultFuncRegex = /export\s+default\s+function\s+([A-Za-z0-9_]+)/g;
  while ((match = defaultFuncRegex.exec(content)) !== null) {
    addName(match[1]);
  }

  const defaultConstRegex = /export\s+default\s+([A-Za-z0-9_]+)/g;
  while ((match = defaultConstRegex.exec(content)) !== null) {
    addName(match[1]);
  }

  const namedExportRegex = /export\s+\{([\s\S]+?)\}/g;
  while ((match = namedExportRegex.exec(content)) !== null) {
    const spec = match[1];
    const pieces = spec
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    for (const piece of pieces) {
      if (/^type\s+/i.test(piece)) continue;
      if (/^interface\s+/i.test(piece)) continue;
      const parts = piece.split(/\s+as\s+/i);
      const exportedName = (parts[parts.length - 1] || '').trim();
      addName(exportedName);
    }
  }

  const moduleDirRelative = path
    .relative(sourceRoot, path.dirname(filePath))
    .replace(/\\/g, '/');

  const starReExportRegex = /export\s*\*\s*from\s*['"](.+?)['"]/g;
  while ((match = starReExportRegex.exec(content)) !== null) {
    const specifier = match[1];
    if (!specifier.startsWith('.') && !specifier.startsWith('..')) {
      continue;
    }
    const targetModule = path.posix.normalize(
      path.posix.join(moduleDirRelative, specifier)
    );
    const { exports: nestedExports } = extractRuntimeExports(targetModule, visited);
    for (const name of nestedExports) {
      addName(name);
    }
  }

  return { exports: runtimeExports, filePath };
}

function parseNamedExports(spec) {
  return spec
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((entry) => {
      const isType = /^type\s+/i.test(entry) || /^interface\s+/i.test(entry);
      const cleaned = entry.replace(/^(type|interface)\s+/i, '').trim();
      const parts = cleaned.split(/\s+as\s+/i);
      const exportedName = (parts[parts.length - 1] || '').trim();
      const sourceName = (parts[0] || '').trim();
      return {
        exportedName,
        sourceName,
        isType,
      };
    })
    .filter((item) => item.exportedName && !item.isType);
}

function categorizeModule(modulePath) {
  const firstSegment = modulePath.split('/')[0];
  if (firstSegment === 'components') return 'components';
  if (firstSegment === 'hooks') return 'hooks';
  if (firstSegment === 'utils') return 'utilities';
  return 'sdk';
}

function collectExportsFromIndex() {
  const indexPath = path.join(sourceRoot, 'index.ts');
  const indexContent = readFileIfExists(indexPath);
  if (!indexContent) {
    throw new Error(`Unable to read ${indexPath}`);
  }

  const modules = new Map();

  function getOrCreateModule(modulePath, category) {
    const key = `${category}:${modulePath}`;
    if (!modules.has(key)) {
      modules.set(key, {
        modulePath,
        category,
        exports: new Set(),
        needsSourceScan: false,
      });
    }
    return modules.get(key);
  }

  const starExportRegex = /export\s*\*\s*from\s*['"](.+?)['"]/g;
  let match;
  while ((match = starExportRegex.exec(indexContent)) !== null) {
    const modulePath = match[1].replace(/^\.\//, '');
    const category = categorizeModule(modulePath);
    const moduleEntry = getOrCreateModule(modulePath, category);
    moduleEntry.needsSourceScan = true;
  }

  const namedExportRegex = /export\s*\{([\s\S]+?)\}\s*from\s*['"](.+?)['"]/g;
  while ((match = namedExportRegex.exec(indexContent)) !== null) {
    const spec = match[1];
    const modulePath = match[2].replace(/^\.\//, '');
    const category = categorizeModule(modulePath);
    const moduleEntry = getOrCreateModule(modulePath, category);
    const names = parseNamedExports(spec);
    for (const name of names) {
      moduleEntry.exports.add(name.exportedName);
    }
  }

  // After parsing index exports, fill in any modules that require scanning
  for (const moduleEntry of modules.values()) {
    if (moduleEntry.needsSourceScan) {
      const { exports: runtimeExports } = extractRuntimeExports(moduleEntry.modulePath);
      for (const name of runtimeExports) {
        moduleEntry.exports.add(name);
      }
    }
  }

  return Array.from(modules.values());
}

function collectStoryImports() {
  const storyImports = new Map();
  const moduleImports = new Map();

  const registerModuleImport = (specifier, storyPath) => {
    if (!specifier) return;
    const modulePath = specifier.replace(/^@clarity-chat\/react\/?/, '');
    if (!moduleImports.has(modulePath)) {
      moduleImports.set(modulePath, new Set());
    }
    moduleImports.get(modulePath).add(storyPath);
  };

  function registerImport(symbol, storyPath) {
    if (!symbol) return;
    if (!storyImports.has(symbol)) {
      storyImports.set(symbol, new Set());
    }
    storyImports.get(symbol).add(storyPath);
  }

  function traverse(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (
        /\.stories\.(?:tsx|ts|jsx|js)$/.test(entry.name) ||
        /\.mdx$/.test(entry.name)
      ) {
        const relativePath = path.relative(storiesRoot, fullPath);
        const content = readFileIfExists(fullPath) || '';

        const importRegex =
          /import\s+(?:type\s+)?\{\s*([^}]+)\s*\}\s+from\s+['"](@clarity-chat\/react[^'"]*)['"]/g;
        let match;
        while ((match = importRegex.exec(content)) !== null) {
          const spec = match[1];
          const specifier = match[2];
          registerModuleImport(specifier, relativePath);
          const pieces = spec
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);

          for (const piece of pieces) {
            if (piece.startsWith('type ')) continue;
            const parts = piece.split(/\s+as\s+/i);
            const exportedName = (parts[0] || '').trim();
            registerImport(exportedName, relativePath);
          }
        }

        const defaultImportRegex =
          /import\s+([A-Za-z0-9_]+)\s+from\s+['"](@clarity-chat\/react[^'"]*)['"]/g;
        while ((match = defaultImportRegex.exec(content)) !== null) {
          const specifier = match[2];
          registerModuleImport(specifier, relativePath);
          registerImport(match[1], relativePath);
        }

        const namespaceImportRegex =
          /import\s+\*\s+as\s+[A-Za-z0-9_]+\s+from\s+['"](@clarity-chat\/react[^'"]*)['"]/g;
        while ((match = namespaceImportRegex.exec(content)) !== null) {
          registerModuleImport(match[1], relativePath);
        }
      }
    }
  }

  traverse(storiesRoot);
  return { storyImports, moduleImports };
}

function summarizeCoverage(modules, storyImports, moduleImports) {
  const categorized = {
    components: [],
    hooks: [],
    utilities: [],
    sdk: [],
  };

  for (const moduleEntry of modules) {
    const { modulePath, category, exports } = moduleEntry;
    const symbols = Array.from(exports).sort((a, b) => a.localeCompare(b));
    const covered = [];
    const uncovered = [];
    const storyFiles = new Set();
    const moduleStories =
      moduleImports.get(modulePath) ??
      moduleImports.get(modulePath.replace(/\/index$/, '')) ??
      new Set();

    for (const symbol of symbols) {
      if (storyImports.has(symbol)) {
        covered.push(symbol);
        for (const story of storyImports.get(symbol)) {
          storyFiles.add(story);
        }
      } else {
        uncovered.push(symbol);
      }
    }

    for (const story of moduleStories) {
      storyFiles.add(story);
    }

    let documented = covered.length > 0;
    if (category === 'utilities' || category === 'sdk' || category === 'hooks') {
      documented = documented || moduleStories.size > 0;
    }

    categorized[category].push({
      modulePath,
      exports: symbols,
      coveredExports: covered.sort((a, b) => a.localeCompare(b)),
      uncoveredExports: uncovered.sort((a, b) => a.localeCompare(b)),
      storyFiles: Array.from(storyFiles).sort(),
      documented,
    });
  }

  return categorized;
}

function computeTotals(items) {
  const total = items.length;
  const documented = items.filter((item) => item.documented).length;
  const missing = total - documented;
  return { total, documented, missing };
}

function main() {
  const modules = collectExportsFromIndex();
  const { storyImports, moduleImports } = collectStoryImports();
  const coverage = summarizeCoverage(modules, storyImports, moduleImports);

  const report = {
    generatedAt: new Date().toISOString(),
    totals: {
      components: computeTotals(coverage.components),
      hooks: computeTotals(coverage.hooks),
      utilities: computeTotals(coverage.utilities),
      sdk: computeTotals(coverage.sdk),
    },
    coverage,
  };

  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, 'coverage-report.json');
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
  console.log(`Storybook coverage report written to ${path.relative(repoRoot, outputPath)}`);
  console.log('Summary:');
  for (const [category, stats] of Object.entries(report.totals)) {
    console.log(
      `  ${category}: ${stats.documented} / ${stats.total} documented (${stats.missing} missing)`
    );
  }
}

main();
