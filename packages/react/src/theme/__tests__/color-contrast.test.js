import { describe, it, expect } from 'vitest';
import { parseHSL, hslToRgb, getRelativeLuminance, getContrastRatio, checkContrast, validateAllColors, generateContrastReport, } from '../color-contrast';
describe('Color Contrast Utilities', () => {
    describe('parseHSL', () => {
        it('should parse space-separated HSL format', () => {
            const result = parseHSL('142.1 76.2% 36.3%');
            expect(result).toEqual({ h: 142.1, s: 76.2, l: 36.3 });
        });
        it('should parse functional HSL format', () => {
            const result = parseHSL('hsl(142.1, 76.2%, 36.3%)');
            expect(result).toEqual({ h: 142.1, s: 76.2, l: 36.3 });
        });
        it('should return null for invalid format', () => {
            expect(parseHSL('invalid')).toBeNull();
            expect(parseHSL('rgb(255, 0, 0)')).toBeNull();
        });
        it('should handle zero values', () => {
            const result = parseHSL('0 0% 0%');
            expect(result).toEqual({ h: 0, s: 0, l: 0 });
        });
        it('should handle white', () => {
            const result = parseHSL('0 0% 100%');
            expect(result).toEqual({ h: 0, s: 0, l: 100 });
        });
    });
    describe('hslToRgb', () => {
        it('should convert black correctly', () => {
            const result = hslToRgb(0, 0, 0);
            expect(result).toEqual({ r: 0, g: 0, b: 0 });
        });
        it('should convert white correctly', () => {
            const result = hslToRgb(0, 0, 100);
            expect(result).toEqual({ r: 255, g: 255, b: 255 });
        });
        it('should convert pure red correctly', () => {
            const result = hslToRgb(0, 100, 50);
            expect(result).toEqual({ r: 255, g: 0, b: 0 });
        });
        it('should convert pure green correctly', () => {
            const result = hslToRgb(120, 100, 50);
            expect(result).toEqual({ r: 0, g: 255, b: 0 });
        });
        it('should convert pure blue correctly', () => {
            const result = hslToRgb(240, 100, 50);
            expect(result).toEqual({ r: 0, g: 0, b: 255 });
        });
    });
    describe('getRelativeLuminance', () => {
        it('should return 0 for black', () => {
            const result = getRelativeLuminance(0, 0, 0);
            expect(result).toBe(0);
        });
        it('should return 1 for white', () => {
            const result = getRelativeLuminance(255, 255, 255);
            expect(result).toBe(1);
        });
        it('should return ~0.2126 for pure red', () => {
            const result = getRelativeLuminance(255, 0, 0);
            expect(result).toBeCloseTo(0.2126, 4);
        });
    });
    describe('getContrastRatio', () => {
        it('should return 21:1 for black on white', () => {
            const black = { r: 0, g: 0, b: 0 };
            const white = { r: 255, g: 255, b: 255 };
            const ratio = getContrastRatio(black, white);
            expect(ratio).toBeCloseTo(21, 0);
        });
        it('should return 1:1 for same colors', () => {
            const color = { r: 128, g: 128, b: 128 };
            const ratio = getContrastRatio(color, color);
            expect(ratio).toBe(1);
        });
    });
    describe('checkContrast', () => {
        it('should pass AAA for black on white', () => {
            const result = checkContrast('0 0% 0%', '0 0% 100%');
            expect(result.aaa).toBe(true);
            expect(result.aa).toBe(true);
            expect(result.ratio).toBeCloseTo(21, 0);
        });
        it('should check success color contrast', () => {
            // Success: white text on green background
            const result = checkContrast('0 0% 100%', '142.1 76.2% 36.3%');
            expect(result.aa).toBe(true);
            expect(result.ratio).toBeGreaterThan(4.5);
        });
        it('should check warning color contrast', () => {
            // Warning: black text on yellow background
            const result = checkContrast('0 0% 0%', '45.4 93.4% 47.5%');
            expect(result.aa).toBe(true);
            expect(result.ratio).toBeGreaterThan(4.5);
        });
        it('should throw for invalid HSL', () => {
            expect(() => checkContrast('invalid', '0 0% 100%')).toThrow();
        });
    });
    describe('validateAllColors', () => {
        it('should return reports for all semantic color pairs', () => {
            const reports = validateAllColors();
            expect(reports.length).toBeGreaterThan(0);
            expect(reports[0]).toHaveProperty('pair');
            expect(reports[0]).toHaveProperty('result');
            expect(reports[0]).toHaveProperty('passes');
            expect(reports[0]).toHaveProperty('level');
        });
        it('should have valid contrast levels', () => {
            const reports = validateAllColors();
            for (const report of reports) {
                expect(['AAA', 'AA', 'AA Large', 'Fail']).toContain(report.level);
            }
        });
    });
    describe('generateContrastReport', () => {
        it('should generate a formatted report string', () => {
            const report = generateContrastReport();
            expect(report).toContain('Color Contrast Validation Report');
            expect(report).toContain('WCAG 2.1');
            expect(report).toContain('Summary:');
        });
        it('should include all color pairs', () => {
            const report = generateContrastReport();
            expect(report).toContain('success');
            expect(report).toContain('warning');
            expect(report).toContain('info');
        });
    });
});
//# sourceMappingURL=color-contrast.test.js.map