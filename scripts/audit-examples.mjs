#!/usr/bin/env node

/**
 * Audit script for example apps
 * Analyzes each example to determine:
 * - Features used
 * - Required peer dependencies
 * - Bundle size estimates
 */

import { readdirSync, existsSync, readFileSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const examplesDir = resolve(__dirname, '../apps/examples');

// Core peer dependencies (always required)
const CORE_PEERS = {
  'react': '^18.0.0 || ^19.0.0',
  'react-dom': '^18.0.0 || ^19.0.0',
  'framer-motion': '^12.23.25',
  'lucide-react': '^0.500.0',
  'zod': '^3.24.0',
};

// Optional peer dependencies (feature-based)
const OPTIONAL_PEERS = {
  'flowtoken': { version: '^1.0.0', features: ['token-counting', 'token-optimization'] },
  'mermaid': { version: '^11.0.0', features: ['diagrams', 'mermaid'] },
  'pdfjs-dist': { version: '^3.0.0 || ^4.0.0', features: ['pdf', 'document-loader'] },
  'mammoth': { version: '^1.0.0', features: ['docx', 'document-loader'] },
  'cohere-ai': { version: '^7.0.0', features: ['reranking', 'embeddings'] },
  'shiki': { version: '^3.0.0', features: ['syntax-highlighting', 'code-block'] },
  'jszip': { version: '^3.10.0', features: ['export', 'batch-export'] },
  'prismjs': { version: '^1.29.0', features: ['syntax-highlighting', 'code-block'] },
  'react-markdown': { version: '^10.0.0', features: ['markdown'] },
  'remark-gfm': { version: '^4.0.0', features: ['markdown'] },
  'rehype-highlight': { version: '^7.0.0', features: ['markdown', 'syntax-highlighting'] },
};

// Feature detection patterns
const FEATURE_PATTERNS = {
  'token-counting': [/useTokenTracker/g, /TokenCounter/g, /countTokens/g],
  'token-optimization': [/useTokenBudgetMonitor/g, /TokenBudgetValidator/g],
  'diagrams': [/mermaid/gi, /diagram/gi],
  'pdf': [/pdf/gi, /document.*loader/gi],
  'docx': [/docx/gi, /mammoth/gi],
  'reranking': [/rerank/gi, /cohere/gi],
  'embeddings': [/embedding/gi, /vector/gi],
  'syntax-highlighting': [/CodeBlock/g, /SyntaxHighlight/g, /Prism/g, /Shiki/g],
  'code-block': [/CodeBlock/g, /<code>/g],
  'markdown': [/markdown/gi, /ReactMarkdown/g],
  'export': [/export/gi, /download/gi, /BatchExport/g],
  'batch-export': [/BatchExport/g, /jszip/gi],
  'rag': [/RAG/g, /retrieval/gi, /vectorStore/gi],
  'streaming': [/useStream/g, /StreamingMessage/g, /stream/gi],
  'voice-input': [/VoiceInput/g, /speech/gi, /microphone/gi],
  'file-upload': [/FileUpload/g, /file.*input/gi, /upload/gi],
  'chat-history': [/history/gi, /conversation.*list/gi],
  'theming': [/ThemeProvider/g, /theme/gi, /dark.*mode/gi],
};

// Bundle size estimates (KB, gzipped)
const BUNDLE_SIZES = {
  'react': 45,
  'react-dom': 130,
  'framer-motion': 60,
  'lucide-react': 8, // only imports used icons
  'zod': 14,
  'flowtoken': 5,
  'mermaid': 380,
  'pdfjs-dist': 650,
  'mammoth': 180,
  'cohere-ai': 120,
  'shiki': 250,
  'jszip': 25,
  'prismjs': 12,
  'react-markdown': 35,
  'remark-gfm': 15,
  'rehype-highlight': 20,
};

function isDirectory(path) {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}

function readFileContent(filePath) {
  try {
    return readFileSync(filePath, 'utf-8');
  } catch {
    return '';
  }
}

function scanDirectory(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  let content = '';

  if (!existsSync(dir)) return content;

  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);

    // Skip node_modules, .next, dist, etc.
    if (entry === 'node_modules' || entry === '.next' || entry === 'dist' || entry === 'out' || entry.startsWith('.')) {
      continue;
    }

    if (isDirectory(fullPath)) {
      content += scanDirectory(fullPath, extensions);
    } else if (extensions.some(ext => entry.endsWith(ext))) {
      content += readFileContent(fullPath) + '\n';
    }
  }

  return content;
}

function detectFeatures(content) {
  const features = new Set();

  for (const [feature, patterns] of Object.entries(FEATURE_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(content)) {
        features.add(feature);
        break;
      }
    }
  }

  return Array.from(features);
}

function getRequiredPeers(features) {
  const peers = { ...CORE_PEERS };

  for (const [pkg, config] of Object.entries(OPTIONAL_PEERS)) {
    const hasFeature = config.features.some(f => features.includes(f));
    if (hasFeature) {
      peers[pkg] = config.version;
    }
  }

  return peers;
}

function calculateBundleSize(peers) {
  let totalSize = 0;

  for (const pkg of Object.keys(peers)) {
    totalSize += BUNDLE_SIZES[pkg] || 0;
  }

  return totalSize;
}

function getExampleType(examplePath) {
  const nextConfig = existsSync(join(examplePath, 'next.config.js')) ||
                     existsSync(join(examplePath, 'next.config.ts'));
  const viteConfig = existsSync(join(examplePath, 'vite.config.js')) ||
                     existsSync(join(examplePath, 'vite.config.ts'));

  if (nextConfig) return 'Next.js';
  if (viteConfig) return 'Vite';
  return 'Unknown';
}

function analyzeExample(exampleName, examplePath) {
  console.log(`\nAnalyzing: ${exampleName}`);

  const packageJsonPath = join(examplePath, 'package.json');
  const srcPath = join(examplePath, 'src');
  const appPath = join(examplePath, 'app');

  // Check if it's a valid example
  if (!existsSync(packageJsonPath)) {
    console.log(`  ⚠️  No package.json found, skipping`);
    return null;
  }

  // Skip internal/shared directories
  if (exampleName.startsWith('_') || exampleName === 'node_modules') {
    console.log(`  ⏭️  Internal directory, skipping`);
    return null;
  }

  const packageJson = JSON.parse(readFileContent(packageJsonPath));
  const type = getExampleType(examplePath);

  // Scan source code
  let content = '';
  if (existsSync(srcPath)) content += scanDirectory(srcPath);
  if (existsSync(appPath)) content += scanDirectory(appPath);

  const features = detectFeatures(content);
  const requiredPeers = getRequiredPeers(features);
  const bundleSize = calculateBundleSize(requiredPeers);

  // Check for missing dependencies
  const currentDeps = {
    ...packageJson.dependencies || {},
    ...packageJson.devDependencies || {},
  };

  const missingPeers = Object.keys(requiredPeers).filter(
    pkg => !currentDeps[pkg]
  );

  console.log(`  Type: ${type}`);
  console.log(`  Features: ${features.length > 0 ? features.join(', ') : 'basic'}`);
  console.log(`  Bundle size: ~${bundleSize}KB (gzipped)`);
  if (missingPeers.length > 0) {
    console.log(`  ⚠️  Missing peers: ${missingPeers.join(', ')}`);
  } else {
    console.log(`  ✓ All peer dependencies present`);
  }

  return {
    name: exampleName,
    path: examplePath,
    type,
    features,
    requiredPeers,
    missingPeers,
    bundleSize,
    currentPackageJson: packageJson,
  };
}

function generateReport(results) {
  console.log('\n' + '='.repeat(80));
  console.log('AUDIT SUMMARY');
  console.log('='.repeat(80));

  const validResults = results.filter(r => r !== null);

  console.log(`\nTotal examples: ${validResults.length}`);
  console.log(`Examples with missing peers: ${validResults.filter(r => r.missingPeers.length > 0).length}`);

  const byType = validResults.reduce((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1;
    return acc;
  }, {});

  console.log('\nBy type:');
  for (const [type, count] of Object.entries(byType)) {
    console.log(`  ${type}: ${count}`);
  }

  console.log('\nBundle size distribution:');
  const sizes = validResults.map(r => r.bundleSize).sort((a, b) => a - b);
  console.log(`  Min: ${sizes[0]}KB`);
  console.log(`  Max: ${sizes[sizes.length - 1]}KB`);
  console.log(`  Avg: ${Math.round(sizes.reduce((a, b) => a + b, 0) / sizes.length)}KB`);

  console.log('\nExamples needing updates:');
  for (const result of validResults.filter(r => r.missingPeers.length > 0)) {
    console.log(`  - ${result.name}: missing ${result.missingPeers.join(', ')}`);
  }

  return validResults;
}

// Main execution
async function main() {
  console.log('Auditing example apps...');
  console.log(`Examples directory: ${examplesDir}`);

  const examples = readdirSync(examplesDir).filter(name => {
    const fullPath = join(examplesDir, name);
    return isDirectory(fullPath);
  });

  const results = [];

  for (const example of examples) {
    const examplePath = join(examplesDir, example);
    const result = analyzeExample(example, examplePath);
    if (result) {
      results.push(result);
    }
  }

  const report = generateReport(results);

  // Save results to JSON for processing
  const outputPath = resolve(__dirname, '../.cleanup-results/example-audit.json');
  const { writeFileSync, mkdirSync } = await import('fs');
  const { dirname } = await import('path');
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, JSON.stringify(report, null, 2));

  console.log(`\nResults saved to: ${outputPath}`);
}

main().catch(console.error);
