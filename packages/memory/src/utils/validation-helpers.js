/**
 * Validation Helpers
 *
 * Input validation and sanitization utilities
 */
/**
 * Validate memory content
 */
export function validateMemoryContent(content) {
    if (!content || typeof content !== 'string') {
        return {
            valid: false,
            error: 'Memory content must be a non-empty string',
        };
    }
    if (content.trim().length === 0) {
        return {
            valid: false,
            error: 'Memory content cannot be empty or whitespace only',
        };
    }
    // Reasonable length limit (1MB)
    const maxLength = 1024 * 1024;
    if (content.length > maxLength) {
        return {
            valid: false,
            error: `Memory content exceeds maximum length of ${maxLength} characters`,
        };
    }
    return { valid: true };
}
/**
 * Validate memory ID
 */
export function validateMemoryId(id) {
    if (!id || typeof id !== 'string') {
        return {
            valid: false,
            error: 'Memory ID must be a non-empty string',
        };
    }
    if (id.trim().length === 0) {
        return {
            valid: false,
            error: 'Memory ID cannot be empty or whitespace only',
        };
    }
    // Reasonable length limit
    if (id.length > 255) {
        return {
            valid: false,
            error: 'Memory ID exceeds maximum length of 255 characters',
        };
    }
    return { valid: true };
}
/**
 * Validate importance score
 */
export function validateImportance(importance) {
    if (typeof importance !== 'number' || isNaN(importance)) {
        return {
            valid: false,
            error: 'Importance must be a number',
        };
    }
    if (importance < 0 || importance > 1) {
        return {
            valid: false,
            error: 'Importance must be between 0 and 1',
        };
    }
    return { valid: true };
}
/**
 * Validate TTL
 */
export function validateTTL(ttl) {
    if (typeof ttl !== 'number' || isNaN(ttl)) {
        return {
            valid: false,
            error: 'TTL must be a number',
        };
    }
    if (ttl < 0) {
        return {
            valid: false,
            error: 'TTL must be a positive number',
        };
    }
    return { valid: true };
}
/**
 * Sanitize memory content
 */
export function sanitizeMemoryContent(content) {
    // Trim whitespace
    let sanitized = content.trim();
    // Remove null bytes
    sanitized = sanitized.replace(/\0/g, '');
    // Normalize whitespace (collapse multiple spaces/newlines)
    sanitized = sanitized.replace(/\s+/g, ' ');
    return sanitized;
}
/**
 * Sanitize tags
 */
export function sanitizeTags(tags) {
    if (!Array.isArray(tags)) {
        return [];
    }
    return tags
        .filter(tag => typeof tag === 'string' && tag.trim().length > 0)
        .map(tag => tag.trim().toLowerCase())
        .filter((tag, index, self) => self.indexOf(tag) === index) // Remove duplicates
        .slice(0, 50); // Limit to 50 tags
}
//# sourceMappingURL=validation-helpers.js.map