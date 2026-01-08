/**
 * TypeScript Declaration Validator Tests
 * Comprehensive test suite for TypeScript declaration validation
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { TypeScriptDeclarationValidator, DeclarationGenerator, BundleSizeAnalyzer, } from './typescript-declaration-validator';
// Mock filesystem operations
vi.mock('fs', () => ({
    readFileSync: vi.fn((path) => {
        if (path.includes('tsconfig.json')) {
            return JSON.stringify({
                compilerOptions: {
                    declaration: true,
                    declarationMap: true,
                    outDir: './dist',
                    stripInternal: true,
                    emitDeclarationOnly: false,
                },
            });
        }
        return 'mock content';
    }),
    writeFileSync: vi.fn(),
    existsSync: vi.fn((path) => {
        return path.includes('tsconfig.json') || path.includes('dist');
    }),
    statSync: vi.fn(() => ({ size: 1024 })),
    mkdirSync: vi.fn(),
}));
// Mock child_process
vi.mock('child_process', () => ({
    execSync: vi.fn(() => 'mock output'),
}));
describe('TypeScriptDeclarationValidator', () => {
    let validator;
    let events;
    beforeEach(() => {
        events = [];
        validator = new TypeScriptDeclarationValidator({
            enabled: true,
            memoryLimit: 512,
            bundleSizeLimit: 500,
            declarationTimeout: 5000,
            validationTimeout: 3000,
            maxRetries: 2,
            retryDelay: 100,
        });
        // Capture events
        validator.on('validation-started', () => events.push({ type: 'validation-started' }));
        validator.on('validation-completed', (data) => events.push({ type: 'validation-completed', data }));
        validator.on('validation-failed', (error) => events.push({ type: 'validation-failed', error }));
        validator.on('memory-analysis-complete', (data) => events.push({ type: 'memory-analysis-complete', data }));
        validator.on('config-updated', (config) => events.push({ type: 'config-updated', config }));
    });
    afterEach(() => {
        vi.clearAllMocks();
    });
    describe('constructor', () => {
        it('should initialize with default config', () => {
            const defaultValidator = new TypeScriptDeclarationValidator();
            const config = defaultValidator.getConfig();
            expect(config.enabled).toBe(true);
            expect(config.memoryLimit).toBe(512);
            expect(config.bundleSizeLimit).toBe(500);
            expect(config.declarationTimeout).toBe(60000);
        });
        it('should merge custom config with defaults', () => {
            const customValidator = new TypeScriptDeclarationValidator({
                memoryLimit: 1024,
                bundleSizeLimit: 1000,
                maxRetries: 5,
            });
            const config = customValidator.getConfig();
            expect(config.memoryLimit).toBe(1024);
            expect(config.bundleSizeLimit).toBe(1000);
            expect(config.maxRetries).toBe(5);
            expect(config.declarationTimeout).toBe(60000); // Default value
        });
        it('should handle disabled validator', () => {
            const disabledValidator = new TypeScriptDeclarationValidator({
                enabled: false,
            });
            expect(disabledValidator.getConfig().enabled).toBe(false);
        });
    });
    describe('validate', () => {
        it('should validate successfully with valid configuration', async () => {
            const result = await validator.validate();
            expect(result).toBeDefined();
            expect(result.success).toBe(true);
            expect(result.issues).toBeDefined();
            expect(result.recommendations).toBeDefined();
            expect(result.score).toBeGreaterThanOrEqual(0);
            expect(result.score).toBeLessThanOrEqual(100);
            expect(result.grade).toMatch(/^[A-F]$/);
            // Check events
            expect(events).toHaveLength(2); // validation-started and validation-completed
            expect(events[0].type).toBe('validation-started');
            expect(events[1].type).toBe('validation-completed');
        });
        it('should handle disabled validation', async () => {
            const disabledValidator = new TypeScriptDeclarationValidator({
                enabled: false,
            });
            const result = await disabledValidator.validate();
            expect(result.success).toBe(true);
            expect(result.issues).toHaveLength(0);
            expect(result.recommendations).toContain('Validation is disabled');
            expect(result.score).toBe(100);
            expect(result.grade).toBe('A');
        });
        it('should handle validation errors gracefully', async () => {
            // Mock a failing scenario
            vi.spyOn(validator, 'validateTypeScriptConfig').mockRejectedValue(new Error('Config validation failed'));
            const result = await validator.validate();
            expect(result.success).toBe(false);
            expect(result.issues).toHaveLength(1);
            expect(result.issues[0].severity).toBe('critical');
            expect(result.issues[0].type).toBe('declaration');
            expect(result.score).toBe(0);
            expect(result.grade).toBe('F');
            const failedEvent = events.find((e) => e.type === 'validation-failed');
            expect(failedEvent).toBeDefined();
        });
        it('should detect bundle size issues', async () => {
            // Mock large bundle size
            vi.spyOn(validator, 'analyzeBundle').mockResolvedValue({
                totalSize: 1000 * 1024, // 1000KB (exceeds 500KB limit)
                gzippedSize: 300 * 1024,
                declarationFiles: [],
                dependencies: {
                    totalDependencies: 10,
                    sizeByDependency: {},
                    unusedDependencies: [],
                    circularDependencies: [],
                    duplicateDependencies: [],
                },
                treeShaking: {
                    effectiveness: 70, // Below 80% threshold
                    removedModules: [],
                    retainedModules: [],
                    potentialSavings: 50 * 1024,
                    issues: [],
                },
                codeSplitting: {
                    chunks: [],
                    splittingEffectiveness: 80,
                    loadTimeImprovement: 20,
                    bundleOverlap: 0,
                    recommendations: [],
                },
                performance: {
                    buildTime: 1000,
                    declarationTime: 500,
                    memoryUsage: {
                        peak: 200,
                        average: 150,
                        current: 180,
                        limit: 512,
                        exceeded: false,
                    },
                    cpuUsage: 40,
                    diskUsage: 1000 * 1024,
                },
            });
            const result = await validator.validate();
            expect(result.success).toBe(true); // Not critical, so still successful
            // Should have bundle size issue
            const bundleSizeIssue = result.issues.find((i) => i.type === 'bundle-size');
            expect(bundleSizeIssue).toBeDefined();
            expect(bundleSizeIssue?.severity).toBe('high');
            expect(bundleSizeIssue?.message).toContain('Bundle size');
            expect(bundleSizeIssue?.message).toContain('exceeds limit');
            // Should have tree shaking issue
            const treeShakingIssue = result.issues.find((i) => i.type === 'performance' &&
                i.message.includes('Tree shaking effectiveness'));
            expect(treeShakingIssue).toBeDefined();
            expect(treeShakingIssue?.severity).toBe('medium');
        });
    });
    describe('TypeScript configuration validation', () => {
        it('should validate valid TypeScript configuration', async () => {
            const tsConfig = await validator.validateTypeScriptConfig();
            expect(tsConfig).toBeDefined();
            expect(tsConfig.isValid).toBe(true);
            expect(tsConfig.configPath).toContain('tsconfig.json');
            expect(tsConfig.declarationSettings.declaration).toBe(true);
            expect(tsConfig.declarationSettings.declarationMap).toBe(true);
            expect(tsConfig.errors).toHaveLength(0);
        });
        it('should handle missing TypeScript configuration', async () => {
            // Mock missing config file
            vi.mocked(existsSync).mockReturnValue(false);
            const tsConfig = await validator.validateTypeScriptConfig();
            expect(tsConfig.isValid).toBe(false);
            expect(tsConfig.errors).toContain('TypeScript configuration file not found');
            expect(tsConfig.suggestions).toContain('Create a tsconfig.json file with proper declaration settings');
        });
        it('should handle invalid TypeScript configuration', async () => {
            // Mock invalid config content
            vi.mocked(readFileSync).mockReturnValue('invalid json content');
            const tsConfig = await validator.validateTypeScriptConfig();
            expect(tsConfig.isValid).toBe(false);
            expect(tsConfig.errors.length).toBeGreaterThan(0);
            expect(tsConfig.errors[0]).toContain('Failed to parse TypeScript configuration');
        });
        it('should detect declaration generation disabled', async () => {
            // Mock config with declaration disabled
            vi.mocked(readFileSync).mockReturnValue(JSON.stringify({
                compilerOptions: {
                    declaration: false,
                    declarationMap: false,
                },
            }));
            const tsConfig = await validator.validateTypeScriptConfig();
            expect(tsConfig.isValid).toBe(false);
            expect(tsConfig.errors).toContain('Declaration generation is disabled in TypeScript configuration');
        });
    });
    describe('bundle analysis', () => {
        it('should analyze bundle successfully', async () => {
            const bundleAnalysis = await validator.analyzeBundle();
            expect(bundleAnalysis).toBeDefined();
            expect(bundleAnalysis.totalSize).toBeGreaterThan(0);
            expect(bundleAnalysis.gzippedSize).toBeGreaterThan(0);
            expect(bundleAnalysis.declarationFiles).toBeDefined();
            expect(bundleAnalysis.dependencies).toBeDefined();
            expect(bundleAnalysis.treeShaking).toBeDefined();
            expect(bundleAnalysis.codeSplitting).toBeDefined();
            expect(bundleAnalysis.performance).toBeDefined();
        });
        it('should detect tree shaking issues', async () => {
            // Mock low tree shaking effectiveness
            vi.spyOn(validator, 'analyzeBundle').mockResolvedValue({
                totalSize: 400 * 1024,
                gzippedSize: 120 * 1024,
                declarationFiles: [],
                dependencies: {
                    totalDependencies: 10,
                    sizeByDependency: {},
                    unusedDependencies: [],
                    circularDependencies: [],
                    duplicateDependencies: [],
                },
                treeShaking: {
                    effectiveness: 60, // Below 80% threshold
                    removedModules: [],
                    retainedModules: [],
                    potentialSavings: 30 * 1024,
                    issues: ['Some modules cannot be tree-shaken'],
                },
                codeSplitting: {
                    chunks: [],
                    splittingEffectiveness: 80,
                    loadTimeImprovement: 30,
                    bundleOverlap: 0,
                    recommendations: [],
                },
                performance: {
                    buildTime: 2000,
                    declarationTime: 1000,
                    memoryUsage: {
                        peak: 200,
                        average: 150,
                        current: 180,
                        limit: 512,
                        exceeded: false,
                    },
                    cpuUsage: 35,
                    diskUsage: 400 * 1024,
                },
            });
            const result = await validator.validate();
            const treeShakingIssue = result.issues.find((i) => i.type === 'performance' &&
                i.message.includes('Tree shaking effectiveness is low'));
            expect(treeShakingIssue).toBeDefined();
            expect(treeShakingIssue?.severity).toBe('medium');
            expect(treeShakingIssue?.details?.effectiveness).toBe(60);
        });
        it('should detect declaration file issues', async () => {
            // Mock declaration files with errors and warnings
            vi.spyOn(validator, 'analyzeBundle').mockResolvedValue({
                totalSize: 300 * 1024,
                gzippedSize: 90 * 1024,
                declarationFiles: [
                    {
                        path: 'index.d.ts',
                        size: 10240,
                        exports: ['MemoryService'],
                        imports: [],
                        complexity: 3,
                        errors: ['Syntax error', 'Type error'],
                        warnings: ['Large declaration file'],
                    },
                ],
                dependencies: {
                    totalDependencies: 5,
                    sizeByDependency: {},
                    unusedDependencies: [],
                    circularDependencies: [],
                    duplicateDependencies: [],
                },
                treeShaking: {
                    effectiveness: 85,
                    removedModules: [],
                    retainedModules: [],
                    potentialSavings: 20 * 1024,
                    issues: [],
                },
                codeSplitting: {
                    chunks: [],
                    splittingEffectiveness: 85,
                    loadTimeImprovement: 25,
                    bundleOverlap: 0,
                    recommendations: [],
                },
                performance: {
                    buildTime: 1500,
                    declarationTime: 800,
                    memoryUsage: {
                        peak: 180,
                        average: 140,
                        current: 160,
                        limit: 512,
                        exceeded: false,
                    },
                    cpuUsage: 30,
                    diskUsage: 300 * 1024,
                },
            });
            const result = await validator.validate();
            const errorIssue = result.issues.find((i) => i.type === 'declaration' &&
                i.message.includes('Declaration file index.d.ts has errors'));
            expect(errorIssue).toBeDefined();
            expect(errorIssue?.severity).toBe('medium');
            expect(errorIssue?.details?.errors).toEqual([
                'Syntax error',
                'Type error',
            ]);
            const warningIssue = result.issues.find((i) => i.type === 'declaration' &&
                i.message.includes('Declaration file index.d.ts has warnings'));
            expect(warningIssue).toBeDefined();
            expect(warningIssue?.severity).toBe('low');
            expect(warningIssue?.details?.warnings).toContain('Large declaration file');
        });
    });
    describe('score calculation', () => {
        it('should calculate perfect score for ideal conditions', () => {
            const bundleAnalysis = {
                totalSize: 300 * 1024, // Within limit
                gzippedSize: 90 * 1024,
                declarationFiles: [],
                dependencies: {
                    totalDependencies: 5,
                    sizeByDependency: {},
                    unusedDependencies: [],
                    circularDependencies: [],
                    duplicateDependencies: [],
                },
                treeShaking: {
                    effectiveness: 95, // High effectiveness
                    removedModules: [],
                    retainedModules: [],
                    potentialSavings: 15 * 1024,
                    issues: [],
                },
                codeSplitting: {
                    chunks: [],
                    splittingEffectiveness: 90,
                    loadTimeImprovement: 30,
                    bundleOverlap: 0,
                    recommendations: [],
                },
                performance: {
                    buildTime: 1000,
                    declarationTime: 500,
                    memoryUsage: {
                        peak: 150,
                        average: 120,
                        current: 140,
                        limit: 512,
                        exceeded: false,
                    },
                    cpuUsage: 25,
                    diskUsage: 300 * 1024,
                },
            };
            const issues = []; // No issues
            const score = validator.calculateScore(bundleAnalysis, issues);
            expect(score).toBe(100); // Perfect score
        });
        it('should deduct points for issues', () => {
            const bundleAnalysis = {
                totalSize: 300 * 1024,
                gzippedSize: 90 * 1024,
                declarationFiles: [],
                dependencies: {
                    totalDependencies: 5,
                    sizeByDependency: {},
                    unusedDependencies: [],
                    circularDependencies: [],
                    duplicateDependencies: [],
                },
                treeShaking: {
                    effectiveness: 85,
                    removedModules: [],
                    retainedModules: [],
                    potentialSavings: 15 * 1024,
                    issues: [],
                },
                codeSplitting: {
                    chunks: [],
                    splittingEffectiveness: 85,
                    loadTimeImprovement: 25,
                    bundleOverlap: 0,
                    recommendations: [],
                },
                performance: {
                    buildTime: 1000,
                    declarationTime: 500,
                    memoryUsage: {
                        peak: 150,
                        average: 120,
                        current: 140,
                        limit: 512,
                        exceeded: false,
                    },
                    cpuUsage: 25,
                    diskUsage: 300 * 1024,
                },
            };
            const issues = [
                { severity: 'high' },
                { severity: 'medium' },
                { severity: 'low' },
            ];
            const score = validator.calculateScore(bundleAnalysis, issues);
            expect(score).toBeLessThan(100);
            expect(score).toBeGreaterThan(0);
        });
        it('should calculate grade correctly', () => {
            const testCases = [
                { score: 95, expectedGrade: 'A' },
                { score: 85, expectedGrade: 'B' },
                { score: 75, expectedGrade: 'C' },
                { score: 65, expectedGrade: 'D' },
                { score: 55, expectedGrade: 'F' },
            ];
            testCases.forEach(({ score, expectedGrade }) => {
                const grade = validator.calculateGrade(score);
                expect(grade).toBe(expectedGrade);
            });
        });
    });
    describe('memory constraint analysis', () => {
        it('should analyze memory constraints', () => {
            const memoryConstraints = validator.getMemoryConstraints();
            expect(memoryConstraints).toBeDefined();
            expect(memoryConstraints).toHaveProperty('inDevelopmentMode');
            expect(memoryConstraints).toHaveProperty('memoryLimit');
            expect(memoryConstraints).toHaveProperty('currentUsage');
            expect(memoryConstraints).toHaveProperty('declarationGeneration');
            expect(memoryConstraints).toHaveProperty('optimizationStrategies');
            expect(memoryConstraints).toHaveProperty('recommendations');
            const memoryEvent = events.find((e) => e.type === 'memory-analysis-complete');
            expect(memoryEvent).toBeDefined();
            expect(memoryEvent.data).toBe(memoryConstraints);
        });
        it('should reanalyze memory constraints', () => {
            const initialConstraints = validator.getMemoryConstraints();
            validator.reanalyzeMemoryConstraints();
            const newConstraints = validator.getMemoryConstraints();
            expect(newConstraints).toBeDefined();
            expect(newConstraints).not.toBe(initialConstraints); // Should be a new analysis
        });
    });
    describe('configuration management', () => {
        it('should update configuration', () => {
            const newConfig = {
                memoryLimit: 1024,
                bundleSizeLimit: 1000,
                maxRetries: 5,
            };
            validator.updateConfig(newConfig);
            const config = validator.getConfig();
            expect(config.memoryLimit).toBe(1024);
            expect(config.bundleSizeLimit).toBe(1000);
            expect(config.maxRetries).toBe(5);
        });
        it('should preserve existing config when updating partially', () => {
            validator.updateConfig({ bundleSizeLimit: 750 });
            const config = validator.getConfig();
            expect(config.bundleSizeLimit).toBe(750);
            expect(config.memoryLimit).toBe(512); // Should preserve original value
            expect(config.maxRetries).toBe(2); // Should preserve original value
        });
        it('should emit config-updated event', () => {
            const configSpy = vi.fn();
            validator.on('config-updated', configSpy);
            validator.updateConfig({ declarationTimeout: 30000 });
            expect(configSpy).toHaveBeenCalledWith(expect.objectContaining({
                declarationTimeout: 30000,
            }));
        });
    });
});
describe('DeclarationGenerator', () => {
    let generator;
    let events;
    beforeEach(() => {
        events = [];
        generator = new DeclarationGenerator({
            enabled: true,
            projectPath: '/test/project',
            outputPath: '/test/output',
            memoryLimit: 512,
            bundleSizeLimit: 500,
            declarationTimeout: 5000,
            validationTimeout: 3000,
            maxRetries: 2,
            retryDelay: 100,
        });
        generator.on('generation-started', (data) => events.push({ type: 'generation-started', data }));
        generator.on('generation-completed', (data) => events.push({ type: 'generation-completed', data }));
        generator.on('generation-failed', (error) => events.push({ type: 'generation-failed', error }));
    });
    describe('generateDeclarations', () => {
        it('should generate declarations successfully', async () => {
            await generator.generateDeclarations('/test/project', '/test/output');
            expect(events).toHaveLength(2); // generation-started and generation-completed
            expect(events[0].type).toBe('generation-started');
            expect(events[1].type).toBe('generation-completed');
            expect(events[1].data.success).toBe(true);
        });
        it('should handle generation failures', async () => {
            // Mock a failing scenario
            vi.spyOn(generator, 'runTypeScriptCompiler').mockRejectedValue(new Error('Generation failed'));
            await expect(generator.generateDeclarations('/test/project', '/test/output')).rejects.toThrow('Generation failed');
            const failedEvent = events.find((e) => e.type === 'generation-failed');
            expect(failedEvent).toBeDefined();
            expect(failedEvent.error).toBeDefined();
        });
    });
});
describe('BundleSizeAnalyzer', () => {
    let analyzer;
    let events;
    beforeEach(() => {
        events = [];
        analyzer = new BundleSizeAnalyzer({
            enabled: true,
            projectPath: '/test/project',
            outputPath: '/test/output',
            memoryLimit: 512,
            bundleSizeLimit: 500,
            declarationTimeout: 5000,
            validationTimeout: 3000,
            maxRetries: 2,
            retryDelay: 100,
        });
        analyzer.on('analysis-started', (data) => events.push({ type: 'analysis-started', data }));
        analyzer.on('analysis-completed', (data) => events.push({ type: 'analysis-completed', data }));
        analyzer.on('analysis-failed', (error) => events.push({ type: 'analysis-failed', error }));
    });
    describe('analyzeBundleSize', () => {
        it('should analyze bundle size successfully', async () => {
            const result = await analyzer.analyzeBundleSize('/test/output');
            expect(result).toBeDefined();
            expect(result.totalSize).toBeGreaterThan(0);
            expect(result.gzippedSize).toBeGreaterThan(0);
            expect(result.files).toBeDefined();
            expect(result.analysis).toBeDefined();
            expect(events).toHaveLength(2); // analysis-started and analysis-completed
            expect(events[0].type).toBe('analysis-started');
            expect(events[1].type).toBe('analysis-completed');
        });
        it('should handle analysis failures', async () => {
            // Mock a failing scenario
            vi.spyOn(analyzer, 'analyzeBundleSize').mockRejectedValue(new Error('Analysis failed'));
            await expect(analyzer.analyzeBundleSize('/test/output')).rejects.toThrow('Analysis failed');
            const failedEvent = events.find((e) => e.type === 'analysis-failed');
            expect(failedEvent).toBeDefined();
            expect(failedEvent.error).toBeDefined();
        });
    });
});
describe('Integration Tests', () => {
    let validator;
    beforeEach(() => {
        validator = new TypeScriptDeclarationValidator({
            enabled: true,
            memoryLimit: 512,
            bundleSizeLimit: 500,
            declarationTimeout: 10000,
            validationTimeout: 5000,
            maxRetries: 3,
            retryDelay: 500,
        });
    });
    it('should handle realistic validation scenarios', async () => {
        // Mock realistic bundle analysis
        vi.spyOn(validator, 'analyzeBundle').mockResolvedValue({
            totalSize: 450 * 1024, // 450KB (within 500KB limit)
            gzippedSize: 135 * 1024, // 135KB
            declarationFiles: [
                {
                    path: 'index.d.ts',
                    size: 15360, // 15KB
                    exports: ['MemoryService', 'MemoryItem'],
                    imports: ['EventEmitter'],
                    complexity: 4,
                    errors: [],
                    warnings: [],
                },
                {
                    path: 'types.d.ts',
                    size: 8192, // 8KB
                    exports: ['MemoryType', 'MemoryScope'],
                    imports: [],
                    complexity: 2,
                    errors: [],
                    warnings: [],
                },
            ],
            dependencies: {
                totalDependencies: 12,
                sizeByDependency: {
                    react: 45056,
                    zod: 20480,
                    dompurify: 15360,
                },
                unusedDependencies: [],
                circularDependencies: [],
                duplicateDependencies: [],
            },
            treeShaking: {
                effectiveness: 88, // Good effectiveness
                removedModules: ['unused-module'],
                retainedModules: ['core-module', 'validation-module'],
                potentialSavings: 20 * 1024,
                issues: [],
            },
            codeSplitting: {
                chunks: [
                    {
                        name: 'main',
                        size: 250 * 1024,
                        dependencies: ['vendor'],
                        isEntry: true,
                        isAsync: false,
                        loadPriority: 1,
                    },
                    {
                        name: 'vendor',
                        size: 200 * 1024,
                        dependencies: [],
                        isEntry: false,
                        isAsync: false,
                        loadPriority: 2,
                    },
                ],
                splittingEffectiveness: 85,
                loadTimeImprovement: 35,
                bundleOverlap: 5 * 1024,
                recommendations: ['Optimize vendor chunk'],
            },
            performance: {
                buildTime: 8000,
                declarationTime: 3000,
                memoryUsage: {
                    peak: 220,
                    average: 170,
                    current: 190,
                    limit: 512,
                    exceeded: false,
                },
                cpuUsage: 42,
                diskUsage: 450 * 1024,
            },
        });
        const result = await validator.validate();
        expect(result.success).toBe(true);
        expect(result.issues).toHaveLength(0); // Should have no issues with this configuration
        expect(result.score).toBeGreaterThan(80); // Should have good score
        expect(result.grade).toMatch(/^[A-B]$/); // Should be A or B grade
        expect(result.bundleAnalysis.totalSize).toBe(450 * 1024);
    });
    it('should handle edge cases in validation', async () => {
        // Test with minimal configuration
        const minimalValidator = new TypeScriptDeclarationValidator({
            enabled: true,
            memoryLimit: 256,
            bundleSizeLimit: 200,
            declarationTimeout: 5000,
            validationTimeout: 2000,
        });
        // Mock bundle that exceeds limits
        vi.spyOn(minimalValidator, 'analyzeBundle').mockResolvedValue({
            totalSize: 300 * 1024, // Exceeds 200KB limit
            gzippedSize: 90 * 1024,
            declarationFiles: [],
            dependencies: {
                totalDependencies: 3,
                sizeByDependency: {},
                unusedDependencies: ['unused-pkg'],
                circularDependencies: [],
                duplicateDependencies: [],
            },
            treeShaking: {
                effectiveness: 65, // Below threshold
                removedModules: [],
                retainedModules: [],
                potentialSavings: 40 * 1024,
                issues: ['Low effectiveness'],
            },
            codeSplitting: {
                chunks: [],
                splittingEffectiveness: 70,
                loadTimeImprovement: 15,
                bundleOverlap: 10 * 1024,
                recommendations: ['Improve splitting'],
            },
            performance: {
                buildTime: 15000, // Long build time
                declarationTime: 8000,
                memoryUsage: {
                    peak: 240,
                    average: 200,
                    current: 220,
                    limit: 256,
                    exceeded: true,
                },
                cpuUsage: 65,
                diskUsage: 300 * 1024,
            },
        });
        const result = await minimalValidator.validate();
        expect(result.success).toBe(false); // Should fail due to critical issues
        expect(result.issues.length).toBeGreaterThan(0); // Should have multiple issues
        expect(result.score).toBeLessThan(70); // Should have lower score due to issues
        expect(result.grade).toMatch(/^[C-F]$/); // Should be C, D, or F grade
    });
    it('should handle large numbers of declaration files', async () => {
        // Create many declaration files
        const manyDeclarationFiles = Array.from({ length: 50 }, (_, i) => ({
            path: `module-${i}.d.ts`,
            size: 1024 + i * 100, // Varying sizes
            exports: [`export${i}`, `type${i}`],
            imports: i > 0 ? [`module-${i - 1}`] : [],
            complexity: 1 + (i % 5),
            errors: i % 10 === 0 ? [`Error in module ${i}`] : [],
            warnings: i % 5 === 0 ? [`Warning in module ${i}`] : [],
        }));
        vi.spyOn(validator, 'analyzeBundle').mockResolvedValue({
            totalSize: 800 * 1024, // 800KB
            gzippedSize: 240 * 1024,
            declarationFiles: manyDeclarationFiles,
            dependencies: {
                totalDependencies: 20,
                sizeByDependency: {},
                unusedDependencies: [],
                circularDependencies: [],
                duplicateDependencies: [],
            },
            treeShaking: {
                effectiveness: 82,
                removedModules: [],
                retainedModules: [],
                potentialSavings: 60 * 1024,
                issues: [],
            },
            codeSplitting: {
                chunks: [],
                splittingEffectiveness: 88,
                loadTimeImprovement: 40,
                bundleOverlap: 15 * 1024,
                recommendations: [],
            },
            performance: {
                buildTime: 12000,
                declarationTime: 5000,
                memoryUsage: {
                    peak: 350,
                    average: 280,
                    current: 320,
                    limit: 512,
                    exceeded: false,
                },
                cpuUsage: 55,
                diskUsage: 800 * 1024,
            },
        });
        const startTime = Date.now();
        const result = await validator.validate();
        const endTime = Date.now();
        expect(result).toBeDefined();
        expect(result.bundleAnalysis.declarationFiles).toHaveLength(50);
        expect(endTime - startTime).toBeLessThan(15000); // Should complete within 15 seconds
    });
});
describe('Performance Benchmarks', () => {
    it('should handle high-frequency validation requests efficiently', async () => {
        const validator = new TypeScriptDeclarationValidator({
            enabled: true,
            memoryLimit: 512,
            bundleSizeLimit: 500,
            declarationTimeout: 3000,
            validationTimeout: 2000,
            maxRetries: 1,
            retryDelay: 100,
        });
        const iterations = 25;
        const startTime = Date.now();
        // Execute multiple validations concurrently
        const validationPromises = Array.from({ length: iterations }, (_, i) => validator.validate());
        await Promise.all(validationPromises);
        const endTime = Date.now();
        const totalTime = endTime - startTime;
        const avgTimePerValidation = totalTime / iterations;
        // Should complete reasonably quickly
        expect(avgTimePerValidation).toBeLessThan(500); // Average less than 500ms per validation
        expect(totalTime).toBeLessThan(15000); // Complete all iterations within 15 seconds
    });
    it('should efficiently manage memory during validation', async () => {
        const validator = new TypeScriptDeclarationValidator({
            enabled: true,
            memoryLimit: 512,
            bundleSizeLimit: 500,
            declarationTimeout: 5000,
            validationTimeout: 3000,
        });
        const initialMemory = process.memoryUsage().heapUsed;
        // Execute many validations
        for (let i = 0; i < 30; i++) {
            await validator.validate();
        }
        const finalMemory = process.memoryUsage().heapUsed;
        const memoryIncrease = finalMemory - initialMemory;
        // Memory increase should be reasonable (less than 25MB for 30 validations)
        expect(memoryIncrease).toBeLessThan(25 * 1024 * 1024);
    });
});
//# sourceMappingURL=typescript-declaration-validator.test.js.map