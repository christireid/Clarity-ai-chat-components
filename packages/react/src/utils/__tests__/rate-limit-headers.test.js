/**
 * Tests for Rate Limit Header Parsing Utility
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { parseRateLimitHeaders, calculateRetryDelay, shouldThrottle, RateLimitInfoError, } from '../rate-limit-headers';
// Helper to create mock Response with headers
function createMockResponse(headers) {
    return {
        headers: new Headers(headers),
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
    };
}
describe('parseRateLimitHeaders', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2025-01-01T12:00:00Z'));
    });
    afterEach(() => {
        vi.useRealTimers();
    });
    describe('Retry-After header parsing', () => {
        it('should parse numeric Retry-After header', () => {
            const response = createMockResponse({
                'retry-after': '30',
            });
            const info = parseRateLimitHeaders(response);
            expect(info.retryAfter).toBe(30);
        });
        it('should parse date-based Retry-After header', () => {
            // Set system time to a known value
            const now = new Date('2025-01-01T12:00:00Z');
            vi.setSystemTime(now);
            const futureDate = new Date('2025-01-01T12:00:30Z'); // 30 seconds later
            const response = createMockResponse({
                'retry-after': futureDate.toUTCString(),
            });
            const info = parseRateLimitHeaders(response);
            expect(info.retryAfter).toBe(30);
        });
        it('should handle past date as 0 seconds', () => {
            const pastDate = new Date('2025-01-01T11:59:00Z'); // 1 minute ago
            const response = createMockResponse({
                'retry-after': pastDate.toUTCString(),
            });
            const info = parseRateLimitHeaders(response);
            expect(info.retryAfter).toBe(0);
        });
        it('should handle invalid Retry-After gracefully', () => {
            const response = createMockResponse({
                'retry-after': 'invalid',
            });
            const info = parseRateLimitHeaders(response);
            expect(info.retryAfter).toBeUndefined();
        });
    });
    describe('OpenAI headers', () => {
        it('should parse OpenAI rate limit headers', () => {
            const response = createMockResponse({
                'x-ratelimit-remaining-requests': '10',
                'x-ratelimit-limit-requests': '100',
                'x-ratelimit-reset-requests': '30s',
            });
            const info = parseRateLimitHeaders(response);
            expect(info.remaining).toBe(10);
            expect(info.limit).toBe(100);
            expect(info.provider).toBe('openai');
        });
        it('should parse OpenAI token limit headers', () => {
            const response = createMockResponse({
                'x-ratelimit-remaining-tokens': '50000',
                'x-ratelimit-limit-tokens': '100000',
                'x-ratelimit-reset-tokens': '1m',
            });
            const info = parseRateLimitHeaders(response);
            expect(info.remainingTokens).toBe(50000);
            expect(info.tokenLimit).toBe(100000);
        });
        it('should parse relative time strings', () => {
            const now = Date.now();
            const response = createMockResponse({
                'x-ratelimit-reset-requests': '500ms',
            });
            const info = parseRateLimitHeaders(response);
            expect(info.reset).toBeGreaterThanOrEqual(now + 500);
            expect(info.reset).toBeLessThanOrEqual(now + 600);
        });
        it('should parse minutes in relative time', () => {
            const now = Date.now();
            const response = createMockResponse({
                'x-ratelimit-reset-requests': '2m',
            });
            const info = parseRateLimitHeaders(response);
            expect(info.reset).toBeGreaterThanOrEqual(now + 120000);
        });
        it('should parse hours in relative time', () => {
            const now = Date.now();
            const response = createMockResponse({
                'x-ratelimit-reset-requests': '1h',
            });
            const info = parseRateLimitHeaders(response);
            expect(info.reset).toBeGreaterThanOrEqual(now + 3600000);
        });
    });
    describe('Anthropic detection', () => {
        it('should detect Anthropic provider', () => {
            const response = createMockResponse({
                'anthropic-version': '2023-06-01',
                'retry-after': '60',
            });
            const info = parseRateLimitHeaders(response);
            expect(info.provider).toBe('anthropic');
            expect(info.retryAfter).toBe(60);
        });
    });
    describe('Google detection', () => {
        it('should detect Google provider', () => {
            const response = createMockResponse({
                'x-goog-api-client': 'gl-js/1.0.0',
                'retry-after': '30',
            });
            const info = parseRateLimitHeaders(response);
            expect(info.provider).toBe('google');
            expect(info.retryAfter).toBe(30);
        });
    });
    describe('unknown provider', () => {
        it('should set provider to unknown if headers present but no provider detected', () => {
            const response = createMockResponse({
                'retry-after': '30',
            });
            const info = parseRateLimitHeaders(response);
            expect(info.provider).toBe('unknown');
        });
        it('should not set provider if no relevant headers', () => {
            const response = createMockResponse({
                'content-type': 'application/json',
            });
            const info = parseRateLimitHeaders(response);
            expect(info.provider).toBeUndefined();
        });
    });
    describe('edge cases', () => {
        it('should handle empty headers', () => {
            const response = createMockResponse({});
            const info = parseRateLimitHeaders(response);
            expect(info).toEqual({});
        });
        it('should handle invalid numeric values', () => {
            const response = createMockResponse({
                'x-ratelimit-remaining-requests': 'not-a-number',
                'x-ratelimit-limit-requests': '',
            });
            const info = parseRateLimitHeaders(response);
            expect(info.remaining).toBeUndefined();
            expect(info.limit).toBeUndefined();
        });
    });
});
describe('calculateRetryDelay', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2025-01-01T12:00:00Z'));
    });
    afterEach(() => {
        vi.useRealTimers();
    });
    it('should use retryAfter if available', () => {
        const info = {
            retryAfter: 30,
        };
        const delay = calculateRetryDelay(info);
        expect(delay).toBe(30000); // 30 seconds in ms
    });
    it('should calculate from reset time if no retryAfter', () => {
        const now = Date.now();
        const info = {
            reset: now + 5000, // 5 seconds from now
        };
        const delay = calculateRetryDelay(info);
        expect(delay).toBe(5000);
    });
    it('should use tokenReset if no other timing info', () => {
        const now = Date.now();
        const info = {
            tokenReset: now + 10000, // 10 seconds from now
        };
        const delay = calculateRetryDelay(info);
        expect(delay).toBe(10000);
    });
    it('should use default delay if no timing info', () => {
        const info = {};
        const delay = calculateRetryDelay(info);
        expect(delay).toBe(1000); // Default 1 second
    });
    it('should use custom default delay', () => {
        const info = {};
        const delay = calculateRetryDelay(info, 5000);
        expect(delay).toBe(5000);
    });
    it('should return 0 for past reset times', () => {
        const now = Date.now();
        const info = {
            reset: now - 5000, // 5 seconds ago
        };
        const delay = calculateRetryDelay(info);
        expect(delay).toBe(0);
    });
    it('should prefer retryAfter over reset', () => {
        const now = Date.now();
        const info = {
            retryAfter: 10,
            reset: now + 60000, // 60 seconds
        };
        const delay = calculateRetryDelay(info);
        expect(delay).toBe(10000); // Uses retryAfter
    });
});
describe('shouldThrottle', () => {
    it('should return true when remaining requests below threshold', () => {
        const info = {
            remaining: 3,
        };
        expect(shouldThrottle(info)).toBe(true);
    });
    it('should return false when remaining requests above threshold', () => {
        const info = {
            remaining: 10,
        };
        expect(shouldThrottle(info)).toBe(false);
    });
    it('should use custom threshold', () => {
        const info = {
            remaining: 8,
        };
        expect(shouldThrottle(info, 10)).toBe(true);
        expect(shouldThrottle(info, 5)).toBe(false);
    });
    it('should check remaining tokens', () => {
        const info = {
            remainingTokens: 500,
        };
        expect(shouldThrottle(info)).toBe(true);
    });
    it('should return false for high token remaining', () => {
        const info = {
            remainingTokens: 50000,
        };
        expect(shouldThrottle(info)).toBe(false);
    });
    it('should return false for empty info', () => {
        const info = {};
        expect(shouldThrottle(info)).toBe(false);
    });
});
describe('RateLimitInfoError', () => {
    it('should create error with rate limit info', () => {
        const info = {
            retryAfter: 30,
            provider: 'openai',
        };
        const error = new RateLimitInfoError('Rate limit exceeded', info);
        expect(error.message).toBe('Rate limit exceeded');
        expect(error.name).toBe('RateLimitInfoError');
        expect(error.rateLimitInfo).toEqual(info);
    });
    it('should be instanceof Error', () => {
        const error = new RateLimitInfoError('Rate limit exceeded', {});
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(RateLimitInfoError);
    });
});
//# sourceMappingURL=rate-limit-headers.test.js.map