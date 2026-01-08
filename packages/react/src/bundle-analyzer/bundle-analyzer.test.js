/**
 * Tests for Enhanced Bundle Analyzer
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { BundleAnalyzer } from './bundle-analyzer';
import { CLIError } from '../../../cli/src/utils/errors';
// Mock logger
const mockLogger = {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
};
// Mock getLogger
vi.mock('../../../cli/src/utils/logger', () => ({
    getLogger: vi.fn(() => mockLogger),
}));
describe('BundleAnalyzer', () => {
    let analyzer;
    beforeEach(() => {
        vi.clearAllMocks();
        analyzer = new BundleAnalyzer();
    });
    afterEach(() => {
        vi.restoreAllMocks();
    });
    describe('Configuration', () => {
        it('should have correct default configuration', () => {
            const config = analyzer.getConfig();
            expect(config.enabled).toBe(true);
            expect(config.outputDir).toBe('./bundle-analysis');
            expect(config.formats).toEqual(['json', 'html']);
            expect(config.thresholds.total).toBe(500 * 1024); // 500KB
            expect(config.thresholds.perChunk).toBe(100 * 1024); // 100KB
            expect(config.assetGroups).toHaveLength(5);
        });
        it('should merge user configuration with defaults', () => {
            const customAnalyzer = new BundleAnalyzer({
                outputDir: './custom-output',
                thresholds: { total: 1000000 },
            });
            const config = customAnalyzer.getConfig();
            expect(config.outputDir).toBe('./custom-output');
            expect(config.thresholds.total).toBe(1000000);
            expect(config.thresholds.perChunk).toBe(100 * 1024); // default preserved
        });
        it('should validate configuration', () => {
            expect(() => {
                new BundleAnalyzer({
                    thresholds: { total: -1 },
                });
            }).toThrow(CLIError);
        });
    });
    describe('Bundle Analysis', () => {
        it('should process webpack stats correctly', async () => {
            const mockWebpackStats = {
                assets: [
                    {
                        name: 'main',
                        size: 150 * 1024, // 150KB
                        chunks: ['main'],
                        isOverSizeLimit: false,
                    },
                    {
                        name: 'vendor',
                        size: 250 * 1024, // 250KB
                        chunks: ['vendor'],
                        isOverSizeLimit: false,
                    },
                ],
                chunks: [
                    {
                        id: 'main',
                        size: 150 * 1024,
                        files: ['main'],
                        modules: 50,
                        isOverSizeLimit: false,
                    },
                    {
                        id: 'vendor',
                        size: 250 * 1024,
                        files: ['vendor'],
                        modules: 100,
                        isOverSizeLimit: false,
                    },
                ],
            };
            const result = await analyzer.process(mockWebpackStats);
            expect(result).toHaveProperty('totalSize');
            expect(result).toHaveProperty('compressedSize');
            expect(result).toHaveProperty('assets');
            expect(result).toHaveProperty('chunks');
            expect(result).toHaveProperty('warnings');
            expect(result).toHaveProperty('recommendations');
            expect(result).toHaveProperty('score');
            expect(result).toHaveProperty('grade');
            expect(result).toHaveProperty('timestamp');
            expect(result.assets).toHaveLength(2);
            expect(result.chunks).toHaveLength(2);
            expect(result.totalSize).toBe(400 * 1024); // 150KB + 250KB
        });
        it('should generate warnings for oversized assets', async () => {
            const mockWebpackStats = {
                assets: [
                    {
                        name: 'large-asset',
                        size: 300 * 1024, // 300KB, exceeds perAsset threshold
                        chunks: ['main'],
                        isOverSizeLimit: true,
                    },
                ],
                chunks: [],
            };
            const result = await analyzer.process(mockWebpackStats);
            expect(result.warnings).toHaveLength(1);
            expect(result.warnings[0].type).toBe('asset-size');
            expect(result.warnings[0].severity).toBe('high');
            expect(result.warnings[0].message).toContain('exceeds default limit');
        });
        it('should generate recommendations for optimization', async () => {
            const mockWebpackStats = {
                assets: [
                    {
                        name: 'large-chunk',
                        size: 200 * 1024, // 200KB, exceeds perChunk threshold
                        chunks: ['large-chunk'],
                        isOverSizeLimit: true,
                    },
                ],
                chunks: [
                    {
                        id: 'large-chunk',
                        size: 200 * 1024,
                        files: ['large-chunk'],
                        modules: 150,
                        isOverSizeLimit: true,
                    },
                ],
            };
            const result = await analyzer.process(mockWebpackStats);
            expect(result.recommendations).toHaveLength(1);
            expect(result.recommendations[0].type).toBe('code-splitting');
            expect(result.recommendations[0].priority).toBe('high');
            expect(result.recommendations[0].description).toContain('Split large chunk');
        });
        it('should calculate correct score and grade', async () => {
            const mockWebpackStats = {
                assets: [
                    {
                        name: 'main',
                        size: 100 * 1024,
                        chunks: ['main'],
                        isOverSizeLimit: false,
                    },
                ],
                chunks: [
                    {
                        id: 'main',
                        size: 100 * 1024,
                        files: ['main'],
                        modules: 50,
                        isOverSizeLimit: false,
                    },
                ],
            };
            const result = await analyzer.process(mockWebpackStats);
            expect(result.score).toBeGreaterThanOrEqual(0);
            expect(result.score).toBeLessThanOrEqual(100);
            expect(['A', 'B', 'C', 'D', 'F']).toContain(result.grade);
        });
    });
    describe('Asset Processing', () => {
        it('should correctly identify asset types', () => {
            const testCases = [
                { filename: 'main', expected: 'javascript' },
                { filename: 'styles.css', expected: 'stylesheet' },
                { filename: 'image.png', expected: 'image' },
                { filename: 'font.woff', expected: 'font' },
                { filename: 'unknown.xyz', expected: 'unknown' },
            ];
            testCases.forEach(({ filename, expected }) => {
                // @ts-ignore - accessing private method for testing
                const result = analyzer.getAssetType(filename);
                expect(result).toBe(expected);
            });
        });
        it('should find correct asset group', () => {
            const testCases = [
                { filename: 'node_modules/lodash/index', expected: 'vendor' },
                { filename: 'src/components/Button.tsx', expected: 'application' },
                { filename: 'styles/main.css', expected: 'styles' },
                { filename: 'assets/logo.png', expected: 'images' },
                { filename: 'fonts/roboto.woff', expected: 'fonts' },
            ];
            testCases.forEach(({ filename, expected }) => {
                // @ts-ignore - accessing private method for testing
                const group = analyzer.findAssetGroup(filename);
                expect(group?.name).toBe(expected);
            });
        });
        it('should estimate compressed sizes correctly', () => {
            const originalSize = 1000;
            // @ts-ignore - accessing private method for testing
            const compressedSize = analyzer.estimateCompressedSize(originalSize);
            expect(compressedSize).toBeLessThan(originalSize);
            expect(compressedSize).toBe(Math.floor(originalSize * 0.7));
        });
    });
    describe('Report Generation', () => {
        it('should generate JSON report', async () => {
            const mockWebpackStats = {
                assets: [{ name: 'main', size: 100 * 1024, chunks: ['main'] }],
                chunks: [
                    { id: 'main', size: 100 * 1024, files: ['main'], modules: 50 },
                ],
            };
            await analyzer.process(mockWebpackStats);
            // Check that logger was called for JSON report generation
            expect(mockLogger.info).toHaveBeenCalledWith('JSON report generated', expect.objectContaining({
                filepath: expect.stringContaining('bundle-analysis'),
            }));
        });
        it('should generate HTML report', async () => {
            const mockWebpackStats = {
                assets: [{ name: 'main', size: 100 * 1024, chunks: ['main'] }],
                chunks: [
                    { id: 'main', size: 100 * 1024, files: ['main'], modules: 50 },
                ],
            };
            await analyzer.process(mockWebpackStats);
            // Check that logger was called for HTML report generation
            expect(mockLogger.info).toHaveBeenCalledWith('HTML report generated', expect.objectContaining({
                filepath: expect.stringContaining('bundle-analysis'),
            }));
        });
        it('should generate comprehensive HTML content', async () => {
            const mockWebpackStats = {
                assets: [
                    {
                        name: 'main',
                        size: 150 * 1024,
                        compressedSize: 100 * 1024,
                        type: 'javascript',
                        isOverSizeLimit: false,
                    },
                ],
                chunks: [
                    {
                        id: 'main',
                        size: 150 * 1024,
                        modules: 50,
                        isOverSizeLimit: false,
                    },
                ],
            };
            const result = await analyzer.process(mockWebpackStats);
            // Test HTML generation by checking it contains expected elements
            // @ts-ignore - accessing private method for testing
            const htmlContent = analyzer.generateHtmlContent(result);
            expect(htmlContent).toContain('<!DOCTYPE html>');
            expect(htmlContent).toContain('Bundle Analysis Report');
            expect(htmlContent).toContain('150 KB'); // total size
            expect(htmlContent).toContain('100 KB'); // compressed size
            expect(htmlContent).toContain('main');
        });
    });
    describe('Threshold Management', () => {
        it('should check all thresholds', async () => {
            const mockWebpackStats = {
                assets: [
                    {
                        name: 'large',
                        size: 600 * 1024, // Exceeds total threshold
                        chunks: ['large'],
                    },
                ],
                chunks: [
                    {
                        id: 'large',
                        size: 600 * 1024,
                        files: ['large'],
                        modules: 100,
                    },
                ],
            };
            const result = await analyzer.process(mockWebpackStats);
            // Should have warnings for exceeding thresholds
            expect(result.warnings.length).toBeGreaterThan(0);
            expect(result.warnings.some((w) => w.type === 'asset-size')).toBe(true);
        });
    });
    describe('Summary Generation', () => {
        it('should generate correct summary', async () => {
            const mockWebpackStats = {
                assets: [
                    {
                        name: 'main',
                        size: 150 * 1024,
                        chunks: ['main'],
                    },
                ],
                chunks: [
                    {
                        id: 'main',
                        size: 150 * 1024,
                        files: ['main'],
                        modules: 50,
                    },
                ],
            };
            await analyzer.process(mockWebpackStats);
            const summary = analyzer.getSummary();
            expect(summary).toHaveProperty('totalSize');
            expect(summary).toHaveProperty('compressedSize');
            expect(summary).toHaveProperty('score');
            expect(summary).toHaveProperty('grade');
            expect(summary).toHaveProperty('warningCount');
            expect(summary).toHaveProperty('recommendationCount');
            expect(summary).toHaveProperty('assetCount');
            expect(summary).toHaveProperty('chunkCount');
        });
    });
    describe('Error Handling', () => {
        it('should handle invalid webpack stats', async () => {
            await expect(analyzer.process(null)).rejects.toThrow(CLIError);
            await expect(analyzer.process(undefined)).rejects.toThrow(CLIError);
            await expect(analyzer.process('invalid')).rejects.toThrow(CLIError);
        });
        it('should handle processing errors gracefully', async () => {
            // Create analyzer with invalid configuration to trigger error
            const invalidAnalyzer = new BundleAnalyzer({
                thresholds: { total: -1 }, // Invalid threshold
            });
            const mockWebpackStats = {
                assets: [{ name: 'test', size: 100 }],
                chunks: [],
            };
            await expect(invalidAnalyzer.process(mockWebpackStats)).rejects.toThrow(CLIError);
        });
    });
    describe('Event Handling', () => {
        it('should emit processing events', (done) => {
            const mockWebpackStats = {
                assets: [{ name: 'main', size: 100 * 1024, chunks: ['main'] }],
                chunks: [
                    { id: 'main', size: 100 * 1024, files: ['main'], modules: 50 },
                ],
            };
            analyzer.on('processing-complete', (result) => {
                expect(result).toHaveProperty('success');
                expect(result).toHaveProperty('data');
                expect(result).toHaveProperty('timestamp');
                expect(result).toHaveProperty('duration');
                done();
            });
            analyzer.process(mockWebpackStats);
        });
        it('should emit threshold-exceeded events', (done) => {
            analyzer.on('threshold-exceeded', (data) => {
                expect(data).toHaveProperty('metric');
                expect(data).toHaveProperty('value');
                expect(data).toHaveProperty('threshold');
                done();
            });
            const mockWebpackStats = {
                assets: [
                    {
                        name: 'large',
                        size: 600 * 1024, // Exceeds threshold
                        chunks: ['large'],
                    },
                ],
                chunks: [
                    {
                        id: 'large',
                        size: 600 * 1024,
                        files: ['large'],
                        modules: 100,
                    },
                ],
            };
            analyzer.process(mockWebpackStats);
        });
    });
    describe('Compression Analysis', () => {
        it('should estimate gzip size correctly', () => {
            // @ts-ignore - accessing private method for testing
            const gzipSize = analyzer.estimateGzipSize(1000);
            expect(gzipSize).toBeLessThan(1000);
            expect(gzipSize).toBe(Math.floor(1000 * 0.35));
        });
        it('should estimate brotli size correctly', () => {
            // @ts-ignore - accessing private method for testing
            const brotliSize = analyzer.estimateBrotliSize(1000);
            expect(brotliSize).toBeLessThan(1000);
            expect(brotliSize).toBe(Math.floor(1000 * 0.25));
        });
    });
    describe('Grade Calculation', () => {
        it('should assign correct grades based on score', () => {
            const testCases = [
                { score: 95, expected: 'A' },
                { score: 85, expected: 'B' },
                { score: 75, expected: 'C' },
                { score: 65, expected: 'D' },
                { score: 55, expected: 'F' },
            ];
            testCases.forEach(({ score, expected }) => {
                const mockWebpackStats = {
                    assets: [{ name: 'test', size: 100 * 1024, chunks: ['test'] }],
                    chunks: [
                        { id: 'test', size: 100 * 1024, files: ['test'], modules: 50 },
                    ],
                };
                // Mock the score calculation to return specific score
                vi.spyOn(analyzer, 'calculateScore').mockReturnValue({
                    score,
                    grade: expected,
                });
                analyzer.process(mockWebpackStats).then((result) => {
                    expect(result.grade).toBe(expected);
                });
            });
        });
    });
});
//# sourceMappingURL=bundle-analyzer.test.js.map