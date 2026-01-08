/**
 * Security utilities for path validation and sanitization
 */
import * as path from 'path';
import { PermissionError } from './errors.js';
/**
 * Check if paths start with base path (case-sensitive on Unix, case-insensitive on Windows)
 */
function pathStartsWith(resolved, base) {
    // On Windows, use case-insensitive comparison
    if (process.platform === 'win32') {
        return resolved.toLowerCase().startsWith(base.toLowerCase());
    }
    return resolved.startsWith(base);
}
/**
 * Validate and resolve file path, preventing directory traversal
 */
export function validatePath(userPath, baseDir = process.cwd()) {
    // Sanitize null bytes and control characters first
    // eslint-disable-next-line no-control-regex
    const sanitized = userPath.replace(/\0/g, '').replace(/[\x00-\x1F\x7F]/g, '');
    // Normalize the path
    const normalized = path.normalize(sanitized);
    // Resolve relative to base directory
    const resolved = path.resolve(baseDir, normalized);
    // Ensure the resolved path is within the base directory
    const baseResolved = path.resolve(baseDir);
    // Use platform-aware comparison
    if (!pathStartsWith(resolved, baseResolved)) {
        throw new PermissionError('Invalid path: directory traversal detected', {
            userPath,
            baseDir,
            resolved,
            baseResolved,
        });
    }
    // Ensure the path separator follows the resolved path
    // This prevents /base/path from matching /base/pathfoo
    if (resolved !== baseResolved &&
        !pathStartsWith(resolved, baseResolved + path.sep)) {
        throw new PermissionError('Invalid path: directory traversal detected', {
            userPath,
            baseDir,
            resolved,
            baseResolved,
        });
    }
    return resolved;
}
/**
 * Sanitize string input to prevent injection attacks
 */
export function sanitizeString(input) {
    // Remove null bytes and control characters
    return input
        .replace(/\0/g, '')
        .replace(/[\x00-\x1F\x7F]/g, '') // eslint-disable-line no-control-regex
        .trim();
}
/**
 * Validate project path is safe for file operations
 */
export function validateProjectPath(projectPath) {
    const sanitized = sanitizeString(projectPath);
    // Check for directory traversal patterns more precisely
    // path.normalize resolves ".." segments, so we check if result starts with ".."
    // or contains "..\" or "../" which indicate parent directory references
    const normalized = path.normalize(sanitized);
    if (normalized.startsWith('..') ||
        normalized.includes('..' + path.sep) ||
        sanitized.includes('../') ||
        sanitized.includes('..\\')) {
        throw new PermissionError('Invalid project path: contains parent directory reference');
    }
    // Validate path doesn't contain system directories
    const dangerousPaths = [
        '/etc',
        '/usr',
        '/bin',
        '/sbin',
        '/var',
        '/sys',
        '/proc',
        'C:\\Windows',
        'C:\\System32',
    ];
    const lowerPath = sanitized.toLowerCase();
    for (const dangerous of dangerousPaths) {
        if (lowerPath.includes(dangerous.toLowerCase())) {
            throw new PermissionError(`Invalid project path: cannot use system directory`);
        }
    }
    return sanitized;
}
//# sourceMappingURL=security.js.map