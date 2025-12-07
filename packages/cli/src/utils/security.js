/**
 * Security utilities for CLI
 * Path validation, credential handling, etc.
 */
import path from 'path';
import { PermissionError, ValidationError } from './errors.js';
import { PathSchema, validate } from './validation.js';
/**
 * Validate and normalize file path
 * Prevents directory traversal attacks
 */
export function validatePath(userPath, baseDir = process.cwd()) {
    // Validate path format
    validate(PathSchema, userPath, 'Invalid path format');
    // Resolve to absolute path
    const resolvedPath = path.resolve(baseDir, userPath);
    const resolvedBase = path.resolve(baseDir);
    // Ensure path is within base directory
    if (!resolvedPath.startsWith(resolvedBase)) {
        throw new ValidationError(`Path outside of project directory: ${userPath}`, ['Use relative paths within your project', 'Check for directory traversal attempts']);
    }
    return resolvedPath;
}
/**
 * Validate project path (must be a directory)
 */
export async function validateProjectPath(projectPath) {
    const fs = await import('fs-extra');
    const validatedPath = validatePath(projectPath);
    if (!await fs.pathExists(validatedPath)) {
        throw new ValidationError(`Project path does not exist: ${projectPath}`, ['Check if the path is correct', 'Create the directory if needed']);
    }
    const stats = await fs.stat(validatedPath);
    if (!stats.isDirectory()) {
        throw new ValidationError(`Path is not a directory: ${projectPath}`, ['Provide a directory path, not a file']);
    }
    return validatedPath;
}
/**
 * Sanitize string input to prevent injection
 */
export function sanitizeString(input) {
    // Remove null bytes
    let sanitized = input.replace(/\0/g, '');
    // Remove control characters except newlines and tabs
    // eslint-disable-next-line no-control-regex
    sanitized = sanitized.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
    // Limit length (prevent DoS)
    if (sanitized.length > 10000) {
        sanitized = sanitized.slice(0, 10000);
    }
    return sanitized;
}
/**
 * Mask sensitive data (API keys, tokens, etc.)
 */
export function maskSensitive(value, visibleChars = 4) {
    if (value.length <= visibleChars * 2) {
        return '*'.repeat(value.length);
    }
    const start = value.slice(0, visibleChars);
    const end = value.slice(-visibleChars);
    const middle = '*'.repeat(Math.max(8, value.length - visibleChars * 2));
    return `${start}${middle}${end}`;
}
/**
 * Check file permissions
 */
export async function checkFilePermissions(filePath, mode) {
    const fs = await import('fs-extra');
    const { constants } = await import('fs');
    try {
        if (mode === 'read') {
            await fs.access(filePath, constants.R_OK);
        }
        else {
            await fs.access(filePath, constants.W_OK);
        }
    }
    catch (error) {
        throw new PermissionError(`No ${mode} permission for: ${filePath}`, [
            `Check file permissions: chmod +${mode === 'read' ? 'r' : 'w'} ${filePath}`,
            'Run with appropriate permissions'
        ]);
    }
}
/**
 * Ensure .env.local is in .gitignore
 */
export async function ensureEnvInGitignore(cwd = process.cwd()) {
    const fs = await import('fs-extra');
    const gitignorePath = path.join(cwd, '.gitignore');
    if (!await fs.pathExists(gitignorePath)) {
        await fs.writeFile(gitignorePath, '.env.local\n', 'utf-8');
        return;
    }
    const gitignoreContent = await fs.readFile(gitignorePath, 'utf-8');
    if (!gitignoreContent.includes('.env.local')) {
        await fs.appendFile(gitignorePath, '\n# Clarity Chat\n.env.local\n', 'utf-8');
    }
}
/**
 * Validate API key format (basic check)
 */
export function validateApiKeyFormat(key, provider) {
    if (!key || key.length < 10) {
        return false;
    }
    // Basic format validation
    const patterns = {
        openai: /^sk-[a-zA-Z0-9]{32,}$/,
        anthropic: /^sk-ant-[a-zA-Z0-9-]{32,}$/,
        google: /^AIza[a-zA-Z0-9_-]{35}$/,
    };
    return patterns[provider].test(key);
}
//# sourceMappingURL=security.js.map