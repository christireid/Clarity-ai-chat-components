/**
 * Security utilities for path validation and sanitization
 */
import * as path from 'path';
import { PermissionError } from './errors.js';
/**
 * Validate and resolve file path, preventing directory traversal
 */
export function validatePath(userPath, baseDir = process.cwd()) {
    // Normalize the path
    const normalized = path.normalize(userPath);
    // Resolve relative to base directory
    const resolved = path.resolve(baseDir, normalized);
    // Ensure the resolved path is within the base directory
    const baseResolved = path.resolve(baseDir);
    if (!resolved.startsWith(baseResolved)) {
        throw new PermissionError('Invalid path: directory traversal detected', { userPath, baseDir, resolved, baseResolved });
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
        .replace(/[\x00-\x1F\x7F]/g, '')
        .trim();
}
/**
 * Validate project path is safe for file operations
 */
export function validateProjectPath(projectPath) {
    const sanitized = sanitizeString(projectPath);
    // Check for dangerous patterns
    if (sanitized.includes('..')) {
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
        'C:\\System32'
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