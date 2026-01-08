/**
 * Tests for AnthropicSummarizer
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AnthropicSummarizer } from '../anthropic-summarizer';
// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;
describe('AnthropicSummarizer', () => {
    let summarizer;
    let noRetrySummarizer;
    beforeEach(() => {
        vi.clearAllMocks();
        summarizer = new AnthropicSummarizer({
            apiKey: 'test-api-key',
            model: 'claude-3-haiku-20240307',
            temperature: 0.3,
            maxRetries: 3,
        });
        // Summarizer with no retries for validation tests
        noRetrySummarizer = new AnthropicSummarizer({
            apiKey: 'test-api-key',
            maxRetries: 1,
        });
    });
    afterEach(() => {
        vi.restoreAllMocks();
    });
    describe('constructor', () => {
        it('should use default values when not provided', () => {
            const defaultSummarizer = new AnthropicSummarizer({
                apiKey: 'test-key',
            });
            expect(defaultSummarizer).toBeDefined();
        });
        it('should accept custom configuration', () => {
            const customSummarizer = new AnthropicSummarizer({
                apiKey: 'custom-key',
                model: 'claude-3-sonnet-20240229',
                temperature: 0.5,
                maxRetries: 5,
                maxConcurrency: 5,
            });
            expect(customSummarizer).toBeDefined();
        });
    });
    describe('summarize', () => {
        it('should successfully summarize text', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    content: [{ type: 'text', text: 'This is a summary.' }],
                }),
            });
            const result = await summarizer.summarize('Long text to summarize', 100);
            expect(result).toBe('This is a summary.');
            expect(mockFetch).toHaveBeenCalledTimes(1);
            expect(mockFetch).toHaveBeenCalledWith('https://api.anthropic.com/v1/messages', expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({
                    'Content-Type': 'application/json',
                    'x-api-key': 'test-api-key',
                    'anthropic-version': '2023-06-01',
                }),
            }));
        });
        it('should include correct request body', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    content: [{ type: 'text', text: 'Summary' }],
                }),
            });
            await summarizer.summarize('Test text', 200);
            const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
            expect(callBody.model).toBe('claude-3-haiku-20240307');
            expect(callBody.max_tokens).toBe(240); // 200 * 1.2 buffer
            expect(callBody.temperature).toBe(0.3);
            expect(callBody.messages).toHaveLength(1);
            expect(callBody.messages[0].role).toBe('user');
            expect(callBody.messages[0].content).toContain('200 tokens');
        });
        it('should throw on API error response', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 400,
                json: async () => ({ error: { message: 'Bad request' } }),
            });
            await expect(noRetrySummarizer.summarize('Test', 100)).rejects.toThrow('Anthropic summarization failed');
        });
        it('should retry on 529 overloaded error', async () => {
            mockFetch
                .mockResolvedValueOnce({
                ok: false,
                status: 529,
                json: async () => ({ error: 'Overloaded' }),
            })
                .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    content: [{ type: 'text', text: 'Success after retry' }],
                }),
            });
            const result = await summarizer.summarize('Test', 100);
            expect(result).toBe('Success after retry');
            expect(mockFetch).toHaveBeenCalledTimes(2);
        });
        it('should retry on 503 service unavailable', async () => {
            mockFetch
                .mockResolvedValueOnce({
                ok: false,
                status: 503,
                json: async () => ({ error: 'Service unavailable' }),
            })
                .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    content: [{ type: 'text', text: 'Recovered' }],
                }),
            });
            const result = await summarizer.summarize('Test', 100);
            expect(result).toBe('Recovered');
            expect(mockFetch).toHaveBeenCalledTimes(2);
        });
        it('should not retry on invalid request errors', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 400,
                json: async () => ({ error: { message: 'invalid api key' } }),
            });
            await expect(summarizer.summarize('Test', 100)).rejects.toThrow();
            expect(mockFetch).toHaveBeenCalledTimes(1);
        });
        it('should fail after max retries', async () => {
            mockFetch.mockResolvedValue({
                ok: false,
                status: 529,
                json: async () => ({ error: 'Overloaded' }),
            });
            // Use a summarizer with fewer retries for faster test
            const fastSummarizer = new AnthropicSummarizer({
                apiKey: 'test-key',
                maxRetries: 2,
            });
            await expect(fastSummarizer.summarize('Test', 100)).rejects.toThrow('temporarily unavailable');
            expect(mockFetch).toHaveBeenCalledTimes(2);
        });
    });
    describe('response validation', () => {
        it('should throw on null response', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => null,
            });
            await expect(noRetrySummarizer.summarize('Test', 100)).rejects.toThrow('Invalid Anthropic response: expected object');
        });
        it('should throw on missing content array', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ id: 'msg_123' }),
            });
            await expect(noRetrySummarizer.summarize('Test', 100)).rejects.toThrow('missing or empty content array');
        });
        it('should throw on empty content array', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ content: [] }),
            });
            await expect(noRetrySummarizer.summarize('Test', 100)).rejects.toThrow('missing or empty content array');
        });
        it('should throw on non-text content type', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    content: [{ type: 'image', data: 'base64...' }],
                }),
            });
            await expect(noRetrySummarizer.summarize('Test', 100)).rejects.toThrow('expected text content');
        });
        it('should throw on missing text property', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    content: [{ type: 'text' }],
                }),
            });
            await expect(noRetrySummarizer.summarize('Test', 100)).rejects.toThrow('expected text content');
        });
        it('should throw on non-string text', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    content: [{ type: 'text', text: 123 }],
                }),
            });
            await expect(noRetrySummarizer.summarize('Test', 100)).rejects.toThrow('expected text content');
        });
    });
    describe('summarizeBatch', () => {
        it('should return empty array for empty input', async () => {
            const result = await summarizer.summarizeBatch([], 100);
            expect(result).toEqual([]);
            expect(mockFetch).not.toHaveBeenCalled();
        });
        it('should summarize multiple texts', async () => {
            mockFetch
                .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    content: [{ type: 'text', text: 'Summary 1' }],
                }),
            })
                .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    content: [{ type: 'text', text: 'Summary 2' }],
                }),
            })
                .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    content: [{ type: 'text', text: 'Summary 3' }],
                }),
            });
            const results = await summarizer.summarizeBatch(['Text 1', 'Text 2', 'Text 3'], 100);
            expect(results).toEqual(['Summary 1', 'Summary 2', 'Summary 3']);
            expect(mockFetch).toHaveBeenCalledTimes(3);
        });
        it('should respect concurrency limit', async () => {
            const concurrentSummarizer = new AnthropicSummarizer({
                apiKey: 'test-key',
                maxConcurrency: 2,
            });
            let concurrentCalls = 0;
            let maxConcurrent = 0;
            mockFetch.mockImplementation(async () => {
                concurrentCalls++;
                maxConcurrent = Math.max(maxConcurrent, concurrentCalls);
                // Simulate API delay
                await new Promise((resolve) => setTimeout(resolve, 50));
                concurrentCalls--;
                return {
                    ok: true,
                    json: async () => ({
                        content: [{ type: 'text', text: 'Summary' }],
                    }),
                };
            });
            await concurrentSummarizer.summarizeBatch(['A', 'B', 'C', 'D', 'E'], 100);
            // With concurrency of 2, we should never have more than 2 concurrent calls
            expect(maxConcurrent).toBeLessThanOrEqual(2);
        });
        it('should preserve order of results', async () => {
            // Make responses return in reverse order to test ordering
            mockFetch
                .mockImplementationOnce(async () => {
                await new Promise((resolve) => setTimeout(resolve, 30));
                return {
                    ok: true,
                    json: async () => ({
                        content: [{ type: 'text', text: 'First' }],
                    }),
                };
            })
                .mockImplementationOnce(async () => {
                await new Promise((resolve) => setTimeout(resolve, 10));
                return {
                    ok: true,
                    json: async () => ({
                        content: [{ type: 'text', text: 'Second' }],
                    }),
                };
            });
            const results = await summarizer.summarizeBatch(['Text 1', 'Text 2'], 100);
            expect(results[0]).toBe('First');
            expect(results[1]).toBe('Second');
        });
        it('should handle partial failures', async () => {
            mockFetch
                .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    content: [{ type: 'text', text: 'Success' }],
                }),
            })
                .mockResolvedValueOnce({
                ok: false,
                status: 400,
                json: async () => ({ error: 'Bad request' }),
            });
            await expect(noRetrySummarizer.summarizeBatch(['Good', 'Bad'], 100)).rejects.toThrow();
        });
    });
    describe('error handling', () => {
        it('should handle network errors', async () => {
            mockFetch.mockRejectedValueOnce(new Error('Network error'));
            // Should retry on network errors
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    content: [{ type: 'text', text: 'Recovered' }],
                }),
            });
            const result = await summarizer.summarize('Test', 100);
            expect(result).toBe('Recovered');
        });
        it('should handle JSON parse errors', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => {
                    throw new SyntaxError('Unexpected token');
                },
            });
            await expect(noRetrySummarizer.summarize('Test', 100)).rejects.toThrow();
        });
        it('should handle error response JSON parse failure gracefully', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 400,
                json: async () => {
                    throw new Error('Not JSON');
                },
            });
            await expect(noRetrySummarizer.summarize('Test', 100)).rejects.toThrow('Unknown error');
        });
    });
});
//# sourceMappingURL=anthropic-summarizer.test.js.map