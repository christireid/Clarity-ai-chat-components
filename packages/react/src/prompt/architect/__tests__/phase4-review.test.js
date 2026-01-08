/**
 * Tests for Phase 4: Review & Reflection utilities
 */
import { describe, it, expect } from 'vitest';
import { STANDARD_CONSTRAINTS, DRY_VIOLATION_PATTERNS, ADR_TEMPLATE, ADR_CATEGORIES, createSelfCorrectionItem, generateSelfCorrectionChecklist, createDefaultSelfCorrection, createDRYCheckResult, generateDRYSuggestions, createADR, formatADRAsMarkdown, calculateQualityScore, generateRecommendations, createReviewResult, formatReviewResultAsMarkdown, generateReviewBlockTemplate, isADRNeeded, } from '../phases/phase4-review';
import { createSecurityFinding } from '../phases/phase1-audit';
describe('Phase 4: Review & Reflection', () => {
    describe('STANDARD_CONSTRAINTS', () => {
        it('should have common constraint checks', () => {
            expect(STANDARD_CONSTRAINTS.length).toBeGreaterThan(0);
            expect(STANDARD_CONSTRAINTS).toContain('Code is DRY (no duplication)');
            expect(STANDARD_CONSTRAINTS).toContain('Single Responsibility Principle followed');
        });
    });
    describe('DRY_VIOLATION_PATTERNS', () => {
        it('should have all violation types', () => {
            const types = [
                'DUPLICATE_CODE_BLOCK',
                'DUPLICATE_LOGIC',
                'DUPLICATE_DATA',
                'COPY_PASTE_DETECTION',
                'SIMILAR_METHODS',
            ];
            for (const type of types) {
                expect(DRY_VIOLATION_PATTERNS[type]).toBeDefined();
            }
        });
        it('should have descriptions and suggestions', () => {
            for (const pattern of Object.values(DRY_VIOLATION_PATTERNS)) {
                expect(pattern.description).toBeTruthy();
                expect(pattern.suggestion).toBeTruthy();
            }
        });
    });
    describe('ADR_CATEGORIES', () => {
        it('should have common categories', () => {
            expect(ADR_CATEGORIES.ARCHITECTURE).toBe('Architecture & Structure');
            expect(ADR_CATEGORIES.SECURITY).toBe('Security & Compliance');
            expect(ADR_CATEGORIES.TECHNOLOGY).toBe('Technology Selection');
        });
    });
    describe('createSelfCorrectionItem', () => {
        it('should create a passed self-correction item', () => {
            const item = createSelfCorrectionItem('Code is DRY', true);
            expect(item.constraint).toBe('Code is DRY');
            expect(item.passed).toBe(true);
            expect(item.details).toBeUndefined();
        });
        it('should create a failed item with details', () => {
            const item = createSelfCorrectionItem('Error handling', false, 'Missing try-catch in async function', 'Added try-catch block');
            expect(item.passed).toBe(false);
            expect(item.details).toBe('Missing try-catch in async function');
            expect(item.correctionApplied).toBe('Added try-catch block');
        });
    });
    describe('generateSelfCorrectionChecklist', () => {
        it('should convert checks to items', () => {
            const checks = [
                { constraint: 'Test 1', passed: true },
                { constraint: 'Test 2', passed: false, details: 'Failed' },
            ];
            const items = generateSelfCorrectionChecklist(checks);
            expect(items.length).toBe(2);
            expect(items[0].passed).toBe(true);
            expect(items[1].passed).toBe(false);
            expect(items[1].details).toBe('Failed');
        });
    });
    describe('createDefaultSelfCorrection', () => {
        it('should create checklist from standard constraints', () => {
            const items = createDefaultSelfCorrection();
            expect(items.length).toBe(STANDARD_CONSTRAINTS.length);
            expect(items.every((i) => i.passed)).toBe(true);
        });
    });
    describe('createDRYCheckResult', () => {
        it('should create a passing DRY check', () => {
            const result = createDRYCheckResult({ isDRY: true });
            expect(result.isDRY).toBe(true);
            expect(result.duplications).toEqual([]);
        });
        it('should include duplications', () => {
            const result = createDRYCheckResult({
                isDRY: false,
                duplications: [
                    {
                        description: 'Similar validation logic',
                        locations: ['src/a.ts:10', 'src/b.ts:20'],
                        suggestion: 'Extract to shared validator',
                    },
                ],
            });
            expect(result.isDRY).toBe(false);
            expect(result.duplications.length).toBe(1);
            expect(result.duplications[0].locations.length).toBe(2);
        });
    });
    describe('generateDRYSuggestions', () => {
        it('should generate suggestions for violations', () => {
            const suggestions = generateDRYSuggestions([
                'DUPLICATE_CODE_BLOCK',
                'SIMILAR_METHODS',
            ]);
            expect(suggestions.length).toBe(2);
            expect(suggestions[0].type).toBe('DUPLICATE_CODE_BLOCK');
            expect(suggestions[0].description).toBeTruthy();
            expect(suggestions[0].suggestion).toBeTruthy();
        });
    });
    describe('createADR', () => {
        it('should create an ADR with defaults', () => {
            const adr = createADR({
                title: 'Use React for UI',
                context: 'Need a UI framework',
                decision: 'Use React',
                consequences: {
                    positive: ['Large ecosystem'],
                    negative: ['Learning curve'],
                },
            });
            expect(adr.title).toBe('Use React for UI');
            expect(adr.status).toBe('proposed');
            expect(adr.date).toBeInstanceOf(Date);
            expect(adr.consequences.positive).toContain('Large ecosystem');
            expect(adr.alternativesConsidered).toEqual([]);
        });
        it('should include all optional fields', () => {
            const adr = createADR({
                title: 'Database Selection',
                status: 'accepted',
                context: 'Need a database',
                decision: 'Use PostgreSQL',
                consequences: {
                    positive: ['ACID compliance'],
                    negative: ['Scaling complexity'],
                    neutral: ['Standard SQL'],
                },
                alternativesConsidered: ['MongoDB', 'MySQL'],
                relatedADRs: ['ADR-001', 'ADR-002'],
            });
            expect(adr.status).toBe('accepted');
            expect(adr.consequences.neutral).toContain('Standard SQL');
            expect(adr.alternativesConsidered).toEqual(['MongoDB', 'MySQL']);
            expect(adr.relatedADRs).toEqual(['ADR-001', 'ADR-002']);
        });
    });
    describe('formatADRAsMarkdown', () => {
        it('should format ADR as markdown', () => {
            const adr = createADR({
                title: 'Test ADR',
                context: 'We need to decide',
                decision: 'We decided X',
                consequences: {
                    positive: ['Good thing'],
                    negative: ['Bad thing'],
                },
            });
            const markdown = formatADRAsMarkdown(adr, 42);
            expect(markdown).toContain('# ADR-42: Test ADR');
            expect(markdown).toContain('## Status');
            expect(markdown).toContain('Proposed');
            expect(markdown).toContain('## Context');
            expect(markdown).toContain('We need to decide');
            expect(markdown).toContain('## Decision');
            expect(markdown).toContain('## Consequences');
            expect(markdown).toContain('### Positive');
            expect(markdown).toContain('Good thing');
            expect(markdown).toContain('### Negative');
        });
        it('should use XXX for unknown ADR number', () => {
            const adr = createADR({
                title: 'Test',
                context: 'C',
                decision: 'D',
                consequences: { positive: [], negative: [] },
            });
            const markdown = formatADRAsMarkdown(adr);
            expect(markdown).toContain('# ADR-XXX: Test');
        });
    });
    describe('calculateQualityScore', () => {
        it('should return 100 for perfect code', () => {
            const score = calculateQualityScore(createDefaultSelfCorrection(), createDRYCheckResult({ isDRY: true }), []);
            expect(score).toBe(100);
        });
        it('should deduct for failed self-corrections', () => {
            const corrections = [
                createSelfCorrectionItem('Test 1', false),
                createSelfCorrectionItem('Test 2', true),
            ];
            const score = calculateQualityScore(corrections, createDRYCheckResult({ isDRY: true }), []);
            expect(score).toBeLessThan(100);
        });
        it('should deduct for DRY violations', () => {
            const dryCheck = createDRYCheckResult({
                isDRY: false,
                duplications: [
                    { description: 'Dup 1', locations: [], suggestion: '' },
                    { description: 'Dup 2', locations: [], suggestion: '' },
                ],
            });
            const score = calculateQualityScore(createDefaultSelfCorrection(), dryCheck, []);
            expect(score).toBeLessThan(100);
        });
        it('should deduct heavily for critical security findings', () => {
            const securityFindings = [
                createSecurityFinding('A03_INJECTION', 'critical', 'Test', 'Fix'),
            ];
            const score = calculateQualityScore(createDefaultSelfCorrection(), createDRYCheckResult({ isDRY: true }), securityFindings);
            expect(score).toBeLessThanOrEqual(75);
        });
        it('should not go below 0', () => {
            const manyFindings = Array(20)
                .fill(null)
                .map(() => createSecurityFinding('A03_INJECTION', 'critical', 'T', 'F'));
            const score = calculateQualityScore([], createDRYCheckResult({ isDRY: false, duplications: Array(10).fill({ description: '', locations: [], suggestion: '' }) }), manyFindings);
            expect(score).toBeGreaterThanOrEqual(0);
        });
    });
    describe('generateRecommendations', () => {
        it('should recommend fixing failed constraints', () => {
            const corrections = [
                createSelfCorrectionItem('Error handling', false),
            ];
            const recs = generateRecommendations(corrections, createDRYCheckResult({ isDRY: true }), []);
            expect(recs.some((r) => r.includes('Error handling'))).toBe(true);
        });
        it('should recommend DRY fixes', () => {
            const dryCheck = createDRYCheckResult({
                isDRY: false,
                duplications: [
                    { description: 'Dup', locations: [], suggestion: 'Extract method' },
                ],
            });
            const recs = generateRecommendations([], dryCheck, []);
            expect(recs.some((r) => r.includes('Extract method'))).toBe(true);
        });
        it('should highlight critical security issues', () => {
            const findings = [
                createSecurityFinding('A03_INJECTION', 'critical', 'SQL injection', 'Use params'),
            ];
            const recs = generateRecommendations([], createDRYCheckResult({ isDRY: true }), findings);
            expect(recs.some((r) => r.includes('SECURITY'))).toBe(true);
        });
    });
    describe('createReviewResult', () => {
        it('should create a review result with calculated score', () => {
            const result = createReviewResult({
                selfCorrections: createDefaultSelfCorrection(),
                dryCheck: createDRYCheckResult({ isDRY: true }),
                securityRecheck: [],
            });
            expect(result.qualityScore).toBe(100);
            expect(result.recommendations).toEqual([]);
        });
        it('should include ADR when provided', () => {
            const adr = createADR({
                title: 'Test',
                context: 'C',
                decision: 'D',
                consequences: { positive: [], negative: [] },
            });
            const result = createReviewResult({
                selfCorrections: [],
                dryCheck: createDRYCheckResult({ isDRY: true }),
                securityRecheck: [],
                adr,
            });
            expect(result.adr).toBeDefined();
            expect(result.adr?.title).toBe('Test');
        });
    });
    describe('formatReviewResultAsMarkdown', () => {
        it('should format review result as markdown', () => {
            const result = createReviewResult({
                selfCorrections: [
                    createSelfCorrectionItem('DRY', true),
                    createSelfCorrectionItem('Security', false, 'Missing validation'),
                ],
                dryCheck: createDRYCheckResult({ isDRY: true }),
                securityRecheck: [],
            });
            const markdown = formatReviewResultAsMarkdown(result);
            expect(markdown).toContain('# Code Review Report');
            expect(markdown).toContain('Quality Score');
            expect(markdown).toContain('Self-Correction Checklist');
            expect(markdown).toContain('✅');
            expect(markdown).toContain('❌');
            expect(markdown).toContain('DRY Analysis');
        });
        it('should include security findings section', () => {
            const result = createReviewResult({
                selfCorrections: [],
                dryCheck: createDRYCheckResult({ isDRY: true }),
                securityRecheck: [
                    createSecurityFinding('A03_INJECTION', 'high', 'SQL injection', 'Fix it'),
                ],
            });
            const markdown = formatReviewResultAsMarkdown(result);
            expect(markdown).toContain('Security Re-verification');
            expect(markdown).toContain('SQL injection');
        });
        it('should include ADR when present', () => {
            const result = createReviewResult({
                selfCorrections: [],
                dryCheck: createDRYCheckResult({ isDRY: true }),
                securityRecheck: [],
                adr: createADR({
                    title: 'Important Decision',
                    context: 'Context',
                    decision: 'Decision',
                    consequences: { positive: ['Good'], negative: ['Bad'] },
                }),
            });
            const markdown = formatReviewResultAsMarkdown(result);
            expect(markdown).toContain('Architecture Decision Record');
            expect(markdown).toContain('Important Decision');
        });
    });
    describe('generateReviewBlockTemplate', () => {
        it('should generate review block template', () => {
            const template = generateReviewBlockTemplate();
            expect(template).toContain('<REVIEW>');
            expect(template).toContain('</REVIEW>');
            expect(template).toContain('Self-Correction Checklist');
            expect(template).toContain('DRY Analysis');
            expect(template).toContain('Security Re-verification');
            expect(template).toContain('Quality Score');
        });
    });
    describe('isADRNeeded', () => {
        it('should return true for architectural decisions', () => {
            expect(isADRNeeded('architecture change')).toBe(true);
            expect(isADRNeeded('new technology selection')).toBe(true);
            expect(isADRNeeded('database selection')).toBe(true);
            expect(isADRNeeded('authentication strategy')).toBe(true);
        });
        it('should return false for minor changes', () => {
            expect(isADRNeeded('fix typo')).toBe(false);
            expect(isADRNeeded('update readme')).toBe(false);
            expect(isADRNeeded('rename variable')).toBe(false);
        });
        it('should be case insensitive', () => {
            expect(isADRNeeded('NEW TECHNOLOGY')).toBe(true);
            expect(isADRNeeded('Architecture Change')).toBe(true);
        });
    });
});
//# sourceMappingURL=phase4-review.test.js.map