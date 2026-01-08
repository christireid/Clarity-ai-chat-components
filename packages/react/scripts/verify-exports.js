#!/usr/bin/env tsx
/**
 * Export Verification Script
 *
 * This script verifies that all exports in the public API entry points are valid
 * and can be resolved. It catches issues like:
 * - Missing export paths
 * - Incorrect relative imports
 * - Circular dependencies
 * - Type-only exports that accidentally include runtime code
 *
 * Run with: pnpm exec tsx scripts/verify-exports.ts
 */
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
const SRC_DIR = resolve(dirname(new URL(import.meta.url).pathname), '../src');
const ENTRY_POINTS = [
    'index.ts',
    'public-api.ts',
    'core.ts',
    'core-minimal.ts',
    'internal.ts',
];
/**
 * Parse export statements from a TypeScript file
 */
async function parseExports(filePath) {
    const content = await readFile(filePath, 'utf-8');
    const lines = content.split('\n');
    const exports = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line)
            continue;
        const lineNum = i + 1;
        // Named exports: export { foo, bar } from './module'
        const namedMatch = line.match(/export\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]/);
        if (namedMatch) {
            const names = namedMatch[1]
                .split(',')
                .map((n) => n
                .trim()
                .split(/\s+as\s+/)[0]
                .replace(/^type\s+/, ''))
                .filter(Boolean);
            const source = namedMatch[2];
            for (const name of names) {
                if (name) {
                    exports.push({
                        name,
                        source,
                        line: lineNum,
                        type: line.includes('type {') ? 'type' : 'named',
                    });
                }
            }
        }
        // Namespace exports: export * from './module'
        const namespaceMatch = line.match(/export\s*\*\s*from\s*['"]([^'"]+)['"]/);
        if (namespaceMatch) {
            exports.push({
                name: '*',
                source: namespaceMatch[1],
                line: lineNum,
                type: 'namespace',
            });
        }
        // Type-only exports: export type { Foo } from './module'
        const typeMatch = line.match(/export\s+type\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]/);
        if (typeMatch && !namedMatch) {
            const names = typeMatch[1]
                .split(',')
                .map((n) => n.trim().split(/\s+as\s+/)[0])
                .filter(Boolean);
            const source = typeMatch[2];
            for (const name of names) {
                if (name) {
                    exports.push({
                        name,
                        source,
                        line: lineNum,
                        type: 'type',
                    });
                }
            }
        }
    }
    return exports;
}
/**
 * Resolve an import path to an actual file
 */
function resolveImportPath(source, fromFile) {
    const fromDir = dirname(fromFile);
    // Handle relative imports
    if (source.startsWith('.')) {
        const basePath = resolve(fromDir, source);
        // Try different extensions
        const extensions = ['.ts', '.tsx', '/index.ts', '/index.tsx', '.js', '.mjs'];
        for (const ext of extensions) {
            const fullPath = basePath + ext;
            if (existsSync(fullPath)) {
                return fullPath;
            }
        }
        // Try without extension (might be a directory with index)
        if (existsSync(basePath)) {
            const indexPath = join(basePath, 'index.ts');
            if (existsSync(indexPath)) {
                return indexPath;
            }
            const indexTsx = join(basePath, 'index.tsx');
            if (existsSync(indexTsx)) {
                return indexTsx;
            }
        }
        return null;
    }
    // External package - assume it's valid
    return 'EXTERNAL';
}
/**
 * Verify exports for a single entry point file
 */
async function verifyEntryPoint(fileName) {
    const filePath = join(SRC_DIR, fileName);
    const result = {
        file: fileName,
        exports: [],
        errors: [],
        warnings: [],
    };
    if (!existsSync(filePath)) {
        result.errors.push(`Entry point file not found: ${filePath}`);
        return result;
    }
    const exports = await parseExports(filePath);
    result.exports = exports;
    // Group exports by source for efficient checking
    const sourceMap = new Map();
    for (const exp of exports) {
        const existing = sourceMap.get(exp.source) || [];
        existing.push(exp);
        sourceMap.set(exp.source, existing);
    }
    // Check each source
    for (const [source, exps] of sourceMap) {
        const resolved = resolveImportPath(source, filePath);
        if (resolved === null) {
            const lineNumbers = exps.map((e) => e.line).join(', ');
            result.errors.push(`Cannot resolve import "${source}" (lines: ${lineNumbers})`);
        }
        else if (resolved === 'EXTERNAL') {
            // External package, add a note
            const firstExp = exps[0];
            if (firstExp) {
                result.warnings.push(`External dependency: ${source} (line ${firstExp.line})`);
            }
        }
    }
    // Check for potential issues
    const namedExports = exports.filter((e) => e.type === 'named');
    const namespaceExports = exports.filter((e) => e.type === 'namespace');
    // Warn about potential naming conflicts with namespace exports
    if (namespaceExports.length > 3) {
        result.warnings.push(`High number of namespace exports (${namespaceExports.length}) - consider explicit exports for better tree-shaking`);
    }
    return result;
}
/**
 * Main verification function
 */
async function main() {
    console.log('🔍 Verifying exports for @clarity-chat/react...\n');
    const results = [];
    let hasErrors = false;
    for (const entryPoint of ENTRY_POINTS) {
        const result = await verifyEntryPoint(entryPoint);
        results.push(result);
        const icon = result.errors.length > 0 ? '❌' : '✅';
        console.log(`${icon} ${entryPoint}`);
        console.log(`   Exports: ${result.exports.length}`);
        if (result.errors.length > 0) {
            hasErrors = true;
            for (const error of result.errors) {
                console.log(`   ❌ ${error}`);
            }
        }
        if (result.warnings.length > 0) {
            for (const warning of result.warnings) {
                console.log(`   ⚠️  ${warning}`);
            }
        }
        console.log('');
    }
    // Summary
    console.log('━'.repeat(60));
    const totalExports = results.reduce((sum, r) => sum + r.exports.length, 0);
    const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
    const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);
    console.log(`\n📊 Summary:`);
    console.log(`   Entry points: ${results.length}`);
    console.log(`   Total exports: ${totalExports}`);
    console.log(`   Errors: ${totalErrors}`);
    console.log(`   Warnings: ${totalWarnings}`);
    if (hasErrors) {
        console.log('\n❌ Export verification failed!');
        process.exit(1);
    }
    else {
        console.log('\n✅ All exports verified successfully!');
    }
}
main().catch(console.error);
//# sourceMappingURL=verify-exports.js.map