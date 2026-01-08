/**
 * Clarity Chat - Security Utilities
 *
 * Comprehensive security layer providing:
 * - Input validation and sanitization
 * - XSS prevention (via isomorphic-dompurify for SSR support)
 * - Content Security Policy helpers
 * - Encryption utilities
 * - Rate limiting
 * - Security headers
 *
 * @see https://github.com/cure53/DOMPurify
 * @license MIT (DOMPurify)
 */
import * as React from 'react';
import DOMPurify from 'isomorphic-dompurify';
export const defaultSecurityConfig = {
    enableXSS: true,
    enableValidation: true,
    enableEncryption: false,
    enableRateLimit: true,
    maxInputLength: 10000,
    allowedTags: ['b', 'i', 'em', 'strong', 'code', 'pre', 'a'],
    allowedAttributes: ['href', 'target', 'rel'],
};
/**
 * XSS Prevention and Input Sanitization
 */
export class SecurityManager {
    config;
    rateLimitMap = new Map();
    constructor(config = {}) {
        this.config = { ...defaultSecurityConfig, ...config };
    }
    /**
     * Sanitize user input to prevent XSS attacks
     */
    sanitizeInput(input) {
        if (!this.config.enableXSS)
            return input;
        if (typeof input !== 'string') {
            return '';
        }
        // Use DOMPurify for HTML sanitization
        const clean = DOMPurify.sanitize(input, {
            ALLOWED_TAGS: this.config.allowedTags,
            ALLOWED_ATTR: this.config.allowedAttributes,
            KEEP_CONTENT: true,
        });
        return clean;
    }
    /**
     * Validate and sanitize chat input
     */
    validateChatInput(input) {
        if (!this.config.enableValidation) {
            return { isValid: true, sanitized: input };
        }
        const warnings = [];
        // Check for empty input
        if (!input || input.trim().length === 0) {
            return {
                isValid: false,
                error: 'Input cannot be empty',
            };
        }
        // Check length
        if (input.length > this.config.maxInputLength) {
            return {
                isValid: false,
                error: `Input exceeds maximum length of ${this.config.maxInputLength} characters`,
            };
        }
        // Check for potential XSS patterns
        const xssPatterns = [
            /<script[^>]*>.*?<\/script>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi,
            /data:text\/html/gi,
            /vbscript:/gi,
            /onclick/gi,
            /onload/gi,
            /onerror/gi,
        ];
        for (const pattern of xssPatterns) {
            if (pattern.test(input)) {
                warnings.push('Potential XSS pattern detected');
                break;
            }
        }
        // Check for SQL injection patterns
        const sqlPatterns = [
            /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\s)/gi,
            /(--|\/\*|\*\/)/g,
            /(\b(or|and)\s+\d+\s*=\s*\d+)/gi,
        ];
        for (const pattern of sqlPatterns) {
            if (pattern.test(input)) {
                warnings.push('Potential SQL injection pattern detected');
                break;
            }
        }
        // Sanitize the input
        const sanitized = this.sanitizeInput(input);
        return {
            isValid: true,
            sanitized,
            warnings: warnings.length > 0 ? warnings : undefined,
        };
    }
    /**
     * Validate file uploads
     */
    validateFileUpload(file) {
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'application/pdf',
            'text/plain',
        ];
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (!allowedTypes.includes(file.type)) {
            return {
                isValid: false,
                error: `File type ${file.type} is not allowed`,
            };
        }
        if (file.size > maxSize) {
            return {
                isValid: false,
                error: 'File size exceeds 10MB limit',
            };
        }
        return { isValid: true };
    }
    /**
     * Rate limiting for user actions
     */
    checkRateLimit(userId, action, limit = 10, windowMs = 60000) {
        if (!this.config.enableRateLimit)
            return true;
        const key = `${userId}:${action}`;
        const now = Date.now();
        const windowStart = now - windowMs;
        const attempts = this.rateLimitMap.get(key) || [];
        const recentAttempts = attempts.filter((timestamp) => timestamp > windowStart);
        if (recentAttempts.length >= limit) {
            return false;
        }
        recentAttempts.push(now);
        this.rateLimitMap.set(key, recentAttempts);
        return true;
    }
    /**
     * Generate Content Security Policy header
     */
    generateCSP() {
        const policies = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: https:",
            "connect-src 'self' https: wss:",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
        ];
        return policies.join('; ');
    }
    /**
     * Generate security headers
     */
    generateSecurityHeaders() {
        return {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
            'Content-Security-Policy': this.generateCSP(),
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
        };
    }
    /**
     * Encrypt sensitive data (placeholder for real encryption)
     */
    encryptData(data) {
        if (!this.config.enableEncryption)
            return data;
        // In a real implementation, use proper encryption like AES-256-GCM
        // This is a placeholder that base64 encodes the data
        return btoa(data);
    }
    /**
     * Decrypt sensitive data (placeholder for real decryption)
     */
    decryptData(encryptedData) {
        if (!this.config.enableEncryption)
            return encryptedData;
        // In a real implementation, use proper decryption
        return atob(encryptedData);
    }
    /**
     * Validate URL to prevent open redirects
     */
    validateUrl(url) {
        try {
            const parsed = new URL(url);
            const allowedProtocols = ['http:', 'https:'];
            if (!allowedProtocols.includes(parsed.protocol)) {
                return false;
            }
            // Prevent javascript: and data: URLs (using regex to avoid ESLint no-script-url)
            const dangerousProtocols = /^(java|vb)script:|^data:/i;
            if (dangerousProtocols.test(url)) {
                return false;
            }
            return true;
        }
        catch {
            return false;
        }
    }
    /**
     * Sanitize filename to prevent directory traversal
     */
    sanitizeFilename(filename) {
        return filename
            .replace(/[^a-zA-Z0-9.-]/g, '_')
            .replace(/\.{2,}/g, '.')
            .substring(0, 255);
    }
    /**
     * Check for potential CSRF token
     */
    validateCSRFToken(token, sessionToken) {
        return token === sessionToken && token.length >= 32;
    }
    /**
     * Generate secure random token
     */
    generateSecureToken(length = 32) {
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
    }
}
/**
 * Global security manager instance
 */
export const securityManager = new SecurityManager();
/**
 * React hook for security validation
 */
export function useSecurity(config) {
    const [security] = React.useState(() => new SecurityManager(config));
    return {
        validateInput: security.validateChatInput.bind(security),
        sanitize: security.sanitizeInput.bind(security),
        checkRateLimit: security.checkRateLimit.bind(security),
        validateFile: security.validateFileUpload.bind(security),
        validateUrl: security.validateUrl.bind(security),
        generateToken: security.generateSecureToken.bind(security),
    };
}
//# sourceMappingURL=security.js.map