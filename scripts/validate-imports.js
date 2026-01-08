#!/usr/bin/env tsx
/**
 * Import Path Validation Script
 *
 * Validates that all import paths in the React package can be resolved.
 * Prevents broken imports from reaching production.
 *
 * Usage: pnpm tsx scripts/validate-imports.ts
 */
import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
const errors = [];
const warnings = [];
// Resolve project root
const projectRoot = path.resolve(process.cwd());
const reactPackageRoot = path.join(projectRoot, 'packages/react');
/**
 * Extract import statements from a TypeScript/TSX file
 */
function extractImports(filePath, content) {
    const imports = [];
    const lines = content.split('\n');
    const importRegex = /from\s+['"]([^'"]+)['"]/g;
    const dynamicImportRegex = /import\s*\(['"]([^'"]+)['"]\)/g;
    lines.forEach((line, index) => {
        let match;
        // Static imports
        while ((match = importRegex.exec(line)) !== null) {
            imports.push({ path: match[1], line: index + 1 });
        }
        // Dynamic imports
        while ((match = dynamicImportRegex.exec(line)) !== null) {
            imports.push({ path: match[1], line: index + 1 });
        }
    });
    return imports;
}
/**
 * Check if an import path can be resolved
 */
function canResolveImport(importPath, fromFile) {
    // Skip external packages
    if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
        return true;
    }
    // Skip CSS/asset imports
    if (importPath.endsWith('.css') || importPath.endsWith('.scss')) {
        return true;
    }
    const fromDir = path.dirname(fromFile);
    let resolvedPath = path.resolve(fromDir, importPath);
    // Try with various extensions
    const extensions = ['', '.ts', '.tsx', '.js', '.jsx', '.d.ts'];
    for (const ext of extensions) {
        const testPath = resolvedPath + ext;
        if (fs.existsSync(testPath)) {
            return true;
        }
    }
    // Try as directory with index file
    for (const ext of extensions) {
        const indexPath = path.join(resolvedPath, `index${ext}`);
        if (fs.existsSync(indexPath)) {
            return true;
        }
    }
    return false;
}
/**
 * Validate all imports in the React package
 */
async function validateImports() {
    console.log('🔍 Validating import paths in React package...\n');
    const srcDir = path.join(reactPackageRoot, 'src');
    if (!fs.existsSync(srcDir)) {
        console.error('❌ React package src directory not found!');
        process.exit(1);
    }
    // Find all TypeScript files
    const files = await glob('**/*.{ts,tsx}', {
        cwd: srcDir,
        ignore: ['**/*.test.{ts,tsx}', '**/__tests__/**', '**/node_modules/**'],
        absolute: true,
    });
    console.log(`📦 Found ${files.length} files to validate\n`);
    let fileCount = 0;
    let importCount = 0;
    for (const file of files) {
        const content = fs.readFileSync(file, 'utf-8');
        const imports = extractImports(file, content);
        fileCount++;
        importCount += imports.length;
        for (const { path: importPath, line } of imports) {
            if (!canResolveImport(importPath, file)) {
                const relativePath = path.relative(reactPackageRoot, file);
                errors.push({
                    file: relativePath,
                    importPath,
                    line,
                });
            }
        }
    }
    // Report results
    console.log(`✅ Validated ${importCount} imports in ${fileCount} files\n`);
    if (errors.length > 0) {
        console.error(`❌ Found ${errors.length} unresolvable imports:\n`);
        errors.forEach(({ file, importPath, line }) => {
            console.error(`  ${file}:${line}`);
            console.error(`    Cannot resolve: "${importPath}"`);
            console.error('');
        });
        process.exit(1);
    }
    if (warnings.length > 0) {
        console.warn(`⚠️  Found ${warnings.length} warnings:\n`);
        warnings.forEach((warning) => console.warn(`  ${warning}`));
        console.warn('');
    }
    console.log('✅ All imports are valid!\n');
    process.exit(0);
}
// Run validation
validateImports().catch((error) => {
    console.error('❌ Validation failed:', error);
    process.exit(1);
});
//# sourceMappingURL=validate-imports.js.map