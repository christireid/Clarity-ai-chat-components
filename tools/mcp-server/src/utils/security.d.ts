/**
 * Security utilities for path validation and sanitization
 */
/**
 * Validate and resolve file path, preventing directory traversal
 */
export declare function validatePath(userPath: string, baseDir?: string): string;
/**
 * Sanitize string input to prevent injection attacks
 */
export declare function sanitizeString(input: string): string;
/**
 * Validate project path is safe for file operations
 */
export declare function validateProjectPath(projectPath: string): string;
//# sourceMappingURL=security.d.ts.map