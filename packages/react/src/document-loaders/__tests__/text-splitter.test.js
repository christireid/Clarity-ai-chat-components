import { describe, it, expect, beforeEach } from 'vitest';
import { RecursiveTextSplitter, CharacterTextSplitter, TokenTextSplitter, } from '../text-splitter';
describe('RecursiveTextSplitter', () => {
    let splitter;
    beforeEach(() => {
        splitter = new RecursiveTextSplitter();
    });
    describe('split', () => {
        it('should split text into chunks', () => {
            const text = 'A'.repeat(2000);
            const chunks = splitter.split(text, {
                chunkSize: 500,
                chunkOverlap: 0,
            });
            expect(chunks.length).toBeGreaterThan(1);
            expect(chunks[0].content.length).toBeLessThanOrEqual(500);
        });
        it('should respect chunk overlap', () => {
            const text = 'ABCDEFGHIJ';
            const chunks = splitter.split(text, {
                chunkSize: 5,
                chunkOverlap: 2,
            });
            expect(chunks.length).toBeGreaterThan(1);
            // Check overlap
            const firstEnd = chunks[0].content.slice(-2);
            const secondStart = chunks[1].content.slice(0, 2);
            expect(firstEnd).toBe(secondStart);
        });
        it('should preserve sentence boundaries', () => {
            const text = 'First sentence. Second sentence. Third sentence.';
            const chunks = splitter.split(text, {
                chunkSize: 30,
                chunkOverlap: 0,
                splitBySentence: true,
            });
            expect(chunks.length).toBeGreaterThan(0);
        });
        it('should return correct metadata', () => {
            const text = 'Hello world';
            const chunks = splitter.split(text);
            expect(chunks[0].id).toBeDefined();
            expect(chunks[0].index).toBe(0);
            expect(chunks[0].start).toBeDefined();
            expect(chunks[0].end).toBeDefined();
        });
    });
    describe('splitDocuments', () => {
        it('should split multiple documents', () => {
            const docs = [
                {
                    content: 'A'.repeat(1000),
                    metadata: { source: 'doc1' },
                },
                {
                    content: 'B'.repeat(1000),
                    metadata: { source: 'doc2' },
                },
            ];
            const chunks = splitter.splitDocuments(docs, {
                chunkSize: 500,
                chunkOverlap: 0,
            });
            expect(chunks.length).toBeGreaterThan(2);
            expect(chunks[0].metadata.source).toBe('doc1');
        });
    });
});
describe('CharacterTextSplitter', () => {
    let splitter;
    beforeEach(() => {
        splitter = new CharacterTextSplitter();
    });
    it('should split by character count', () => {
        const text = 'A'.repeat(1000);
        const chunks = splitter.split(text, {
            chunkSize: 100,
            chunkOverlap: 0,
        });
        expect(chunks).toHaveLength(10);
        expect(chunks[0].content.length).toBe(100);
    });
    it('should handle overlap', () => {
        const text = 'ABCDEFGHIJ';
        const chunks = splitter.split(text, {
            chunkSize: 5,
            chunkOverlap: 2,
        });
        expect(chunks[1].content.slice(0, 2)).toBe(chunks[0].content.slice(-2));
    });
});
describe('TokenTextSplitter', () => {
    const simpleTokenizer = (text) => text.split('');
    it('should split by token count', () => {
        const splitter = new TokenTextSplitter(simpleTokenizer);
        const text = 'ABCDEFGHIJ';
        const chunks = splitter.split(text, {
            chunkSize: 3,
            chunkOverlap: 0,
        });
        expect(chunks.length).toBeGreaterThan(1);
    });
    it('should track token count in metadata', () => {
        const splitter = new TokenTextSplitter(simpleTokenizer);
        const text = 'ABCDE';
        const chunks = splitter.split(text, {
            chunkSize: 3,
            chunkOverlap: 0,
        });
        expect(chunks[0].metadata.tokens).toBe(3);
    });
});
//# sourceMappingURL=text-splitter.test.js.map