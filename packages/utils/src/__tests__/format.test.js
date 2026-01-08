import { describe, it, expect } from 'vitest';
import { formatBytes, formatDelta, formatDuration, formatNumber, formatPercent, } from '../format';
describe('formatBytes', () => {
    it('should format 0 bytes', () => {
        expect(formatBytes(0)).toBe('0 B');
    });
    it('should format bytes', () => {
        expect(formatBytes(500)).toBe('500 B');
    });
    it('should format kilobytes', () => {
        expect(formatBytes(1024)).toBe('1 KB');
        expect(formatBytes(1536)).toBe('1.5 KB');
    });
    it('should format megabytes', () => {
        expect(formatBytes(1048576)).toBe('1 MB');
        expect(formatBytes(1572864)).toBe('1.5 MB');
    });
    it('should format gigabytes', () => {
        expect(formatBytes(1073741824)).toBe('1 GB');
    });
    it('should respect decimals parameter', () => {
        expect(formatBytes(1536, 0)).toBe('2 KB');
        expect(formatBytes(1536, 1)).toBe('1.5 KB');
        expect(formatBytes(1536, 3)).toBe('1.5 KB');
    });
});
describe('formatDelta', () => {
    it('should format positive delta', () => {
        expect(formatDelta(110, 100)).toBe('110 (↑ +10)');
    });
    it('should format negative delta', () => {
        expect(formatDelta(90, 100)).toBe('90 (↓ -10)');
    });
    it('should format no change', () => {
        expect(formatDelta(100, 100)).toBe('100 (no change)');
    });
    it('should include unit suffix', () => {
        expect(formatDelta(110, 100, ' tokens')).toBe('110 tokens (↑ +10)');
    });
    it('should format large numbers with locale separators', () => {
        const result = formatDelta(1100000, 1000000);
        expect(result).toContain('1,100,000');
        expect(result).toContain('↑');
        expect(result).toContain('+100,000');
    });
});
describe('formatDuration', () => {
    it('should format milliseconds', () => {
        expect(formatDuration(500)).toBe('500ms');
        expect(formatDuration(0)).toBe('0ms');
    });
    it('should format seconds', () => {
        expect(formatDuration(1000)).toBe('1.0s');
        expect(formatDuration(1500)).toBe('1.5s');
    });
    it('should format minutes and seconds', () => {
        expect(formatDuration(60000)).toBe('1m');
        expect(formatDuration(90000)).toBe('1m 30s');
        expect(formatDuration(150000)).toBe('2m 30s');
    });
});
describe('formatNumber', () => {
    it('should format with locale separators', () => {
        const result = formatNumber(1234567);
        expect(result).toContain('1');
        expect(result).toContain('234');
        expect(result).toContain('567');
    });
    it('should respect options', () => {
        const result = formatNumber(1234.5678, { maximumFractionDigits: 2 });
        // Result includes locale separator, so check for decimal rounding
        expect(result).toContain('.57');
    });
});
describe('formatPercent', () => {
    it('should format percentage', () => {
        expect(formatPercent(75.5)).toBe('75.5%');
        expect(formatPercent(100)).toBe('100.0%');
    });
    it('should respect decimals', () => {
        expect(formatPercent(75.555, 2)).toBe('75.56%');
        expect(formatPercent(75.555, 0)).toBe('76%');
    });
    it('should handle decimal input', () => {
        expect(formatPercent(0.755, 1, true)).toBe('75.5%');
        expect(formatPercent(1, 0, true)).toBe('100%');
    });
});
//# sourceMappingURL=format.test.js.map