/**
 * Tests for Phase 3: Implementation utilities
 */
import { describe, it, expect } from 'vitest';
import { STYLE_GUIDE_PRESETS, DOCUMENTATION_TEMPLATES, LEGACY_IMPROVEMENT_PATTERNS, getStyleGuidePreset, createLegacyImprovement, createImplementationOutput, formatImplementationAsMarkdown, generateCodeBlockTemplate, validateAgainstStyleGuide, getDocumentationRequirements, generateDocTemplate, } from '../phases/phase3-implementation';
describe('Phase 3: Implementation', () => {
    describe('STYLE_GUIDE_PRESETS', () => {
        it('should have TypeScript presets', () => {
            expect(STYLE_GUIDE_PRESETS['typescript-airbnb']).toBeDefined();
            expect(STYLE_GUIDE_PRESETS['typescript-google']).toBeDefined();
        });
        it('should have Python presets', () => {
            expect(STYLE_GUIDE_PRESETS['python-google']).toBeDefined();
            expect(STYLE_GUIDE_PRESETS['python-pep8']).toBeDefined();
        });
        it('should have correct naming conventions', () => {
            const tsAirbnb = STYLE_GUIDE_PRESETS['typescript-airbnb'];
            expect(tsAirbnb.naming.variables).toBe('camelCase');
            expect(tsAirbnb.naming.classes).toBe('PascalCase');
            expect(tsAirbnb.naming.constants).toBe('SCREAMING_SNAKE_CASE');
        });
        it('should have Python snake_case conventions', () => {
            const python = STYLE_GUIDE_PRESETS['python-google'];
            expect(python.naming.variables).toBe('snake_case');
            expect(python.naming.functions).toBe('snake_case');
            expect(python.naming.classes).toBe('PascalCase');
        });
    });
    describe('getStyleGuidePreset', () => {
        it('should return typescript-airbnb preset', () => {
            const preset = getStyleGuidePreset('typescript', 'airbnb');
            expect(preset.language).toBe('typescript');
            expect(preset.styleGuide).toBe('airbnb');
        });
        it('should return python-google preset', () => {
            const preset = getStyleGuidePreset('python', 'google');
            expect(preset.language).toBe('python');
            expect(preset.indentSize).toBe(4);
        });
        it('should fallback to language default if style not found', () => {
            const preset = getStyleGuidePreset('typescript', 'custom');
            expect(preset.language).toBe('typescript');
        });
        it('should fallback to typescript-airbnb as ultimate default', () => {
            // @ts-expect-error Testing invalid input
            const preset = getStyleGuidePreset('unknown', 'unknown');
            expect(preset).toBeDefined();
            expect(preset.language).toBe('typescript');
        });
    });
    describe('DOCUMENTATION_TEMPLATES', () => {
        describe('jsdoc', () => {
            it('should generate JSDoc comment', () => {
                const doc = DOCUMENTATION_TEMPLATES.jsdoc({
                    description: 'Calculates the sum',
                    params: [
                        { name: 'a', type: 'number', description: 'First number' },
                        { name: 'b', type: 'number', description: 'Second number' },
                    ],
                    returns: { type: 'number', description: 'The sum' },
                });
                expect(doc).toContain('/**');
                expect(doc).toContain('*/');
                expect(doc).toContain('Calculates the sum');
                expect(doc).toContain('@param {number} a');
                expect(doc).toContain('@returns {number}');
            });
            it('should include throws when provided', () => {
                const doc = DOCUMENTATION_TEMPLATES.jsdoc({
                    description: 'Test function',
                    throws: [
                        { type: 'Error', description: 'When input is invalid' },
                    ],
                });
                expect(doc).toContain('@throws {Error}');
            });
            it('should include example when provided', () => {
                const doc = DOCUMENTATION_TEMPLATES.jsdoc({
                    description: 'Test',
                    example: 'const result = test()',
                });
                expect(doc).toContain('@example');
                expect(doc).toContain('const result = test()');
            });
        });
        describe('tsdoc', () => {
            it('should generate TSDoc comment', () => {
                const doc = DOCUMENTATION_TEMPLATES.tsdoc({
                    description: 'A TypeScript function',
                    params: [
                        { name: 'input', description: 'The input value' },
                    ],
                    returns: 'The processed output',
                });
                expect(doc).toContain('/**');
                expect(doc).toContain('@param input');
                expect(doc).toContain('@returns');
            });
            it('should include code fence in example', () => {
                const doc = DOCUMENTATION_TEMPLATES.tsdoc({
                    description: 'Test',
                    example: 'const x = 1',
                });
                expect(doc).toContain('```typescript');
                expect(doc).toContain('```');
            });
        });
        describe('pythonDocstring', () => {
            it('should generate Google-style docstring', () => {
                const doc = DOCUMENTATION_TEMPLATES.pythonDocstring({
                    description: 'A Python function',
                    args: [
                        { name: 'value', type: 'int', description: 'The value to process' },
                    ],
                    returns: { type: 'str', description: 'The result' },
                });
                expect(doc).toContain('"""');
                expect(doc).toContain('Args:');
                expect(doc).toContain('value (int):');
                expect(doc).toContain('Returns:');
                expect(doc).toContain('str:');
            });
            it('should include Raises section', () => {
                const doc = DOCUMENTATION_TEMPLATES.pythonDocstring({
                    description: 'Test',
                    raises: [
                        { type: 'ValueError', description: 'When value is negative' },
                    ],
                });
                expect(doc).toContain('Raises:');
                expect(doc).toContain('ValueError:');
            });
        });
    });
    describe('LEGACY_IMPROVEMENT_PATTERNS', () => {
        it('should have all improvement types', () => {
            const types = [
                'ADD_TYPES',
                'EXTRACT_CONSTANTS',
                'ADD_ERROR_HANDLING',
                'IMPROVE_NAMING',
                'REMOVE_DEAD_CODE',
                'ADD_DOCUMENTATION',
                'SIMPLIFY_LOGIC',
                'FIX_FORMATTING',
            ];
            for (const type of types) {
                expect(LEGACY_IMPROVEMENT_PATTERNS[type]).toBeDefined();
            }
        });
        it('should have descriptions and suggestions', () => {
            for (const pattern of Object.values(LEGACY_IMPROVEMENT_PATTERNS)) {
                expect(pattern.name).toBeTruthy();
                expect(pattern.description).toBeTruthy();
                expect(pattern.indicators.length).toBeGreaterThan(0);
                expect(pattern.suggestion).toBeTruthy();
            }
        });
    });
    describe('createLegacyImprovement', () => {
        it('should create a legacy improvement with defaults', () => {
            const improvement = createLegacyImprovement('ADD_TYPES', 'Added TypeScript types to function');
            expect(improvement.type).toBe('ADD_TYPES');
            expect(improvement.description).toBe('Added TypeScript types to function');
            expect(improvement.priority).toBe('medium');
        });
        it('should include before/after when provided', () => {
            const improvement = createLegacyImprovement('EXTRACT_CONSTANTS', 'Extracted magic number', {
                before: 'const timeout = 3600',
                after: 'const HOUR_IN_SECONDS = 3600',
                priority: 'high',
            });
            expect(improvement.before).toBe('const timeout = 3600');
            expect(improvement.after).toBe('const HOUR_IN_SECONDS = 3600');
            expect(improvement.priority).toBe('high');
        });
    });
    describe('createImplementationOutput', () => {
        it('should create implementation output', () => {
            const output = createImplementationOutput({
                code: 'function test() {}',
                language: 'typescript',
            });
            expect(output.code).toBe('function test() {}');
            expect(output.language).toBe('typescript');
            expect(output.boyScoutRuleApplied).toBe(false);
        });
        it('should include all optional fields', () => {
            const output = createImplementationOutput({
                code: 'const x = 1',
                language: 'typescript',
                suggestedFilePath: 'src/utils.ts',
                boyScoutRuleApplied: true,
                legacyImprovements: ['Added types', 'Fixed naming'],
                dependenciesAdded: ['lodash'],
            });
            expect(output.suggestedFilePath).toBe('src/utils.ts');
            expect(output.boyScoutRuleApplied).toBe(true);
            expect(output.legacyImprovements).toEqual(['Added types', 'Fixed naming']);
            expect(output.dependenciesAdded).toEqual(['lodash']);
        });
    });
    describe('formatImplementationAsMarkdown', () => {
        it('should format implementation as markdown', () => {
            const output = createImplementationOutput({
                code: 'const x = 1',
                language: 'typescript',
                suggestedFilePath: 'src/test.ts',
            });
            const markdown = formatImplementationAsMarkdown(output);
            expect(markdown).toContain('# Implementation Output');
            expect(markdown).toContain('src/test.ts');
            expect(markdown).toContain('```typescript');
            expect(markdown).toContain('const x = 1');
        });
        it('should include Boy Scout improvements', () => {
            const output = createImplementationOutput({
                code: 'const x = 1',
                language: 'typescript',
                boyScoutRuleApplied: true,
                legacyImprovements: ['Added types'],
            });
            const markdown = formatImplementationAsMarkdown(output);
            expect(markdown).toContain('Boy Scout Rule');
            expect(markdown).toContain('Added types');
        });
        it('should include dependencies added', () => {
            const output = createImplementationOutput({
                code: 'import _ from "lodash"',
                language: 'typescript',
                dependenciesAdded: ['lodash', 'axios'],
            });
            const markdown = formatImplementationAsMarkdown(output);
            expect(markdown).toContain('Dependencies Added');
            expect(markdown).toContain('lodash');
            expect(markdown).toContain('axios');
        });
    });
    describe('generateCodeBlockTemplate', () => {
        it('should generate code block with language', () => {
            const template = generateCodeBlockTemplate('typescript');
            expect(template).toContain('<CODE language="typescript">');
            expect(template).toContain('</CODE>');
        });
        it('should work for different languages', () => {
            const pythonTemplate = generateCodeBlockTemplate('python');
            expect(pythonTemplate).toContain('language="python"');
        });
    });
    describe('validateAgainstStyleGuide', () => {
        it('should detect lines exceeding max length', () => {
            const code = 'const x = ' + 'a'.repeat(150);
            const rules = getStyleGuidePreset('typescript', 'airbnb');
            const issues = validateAgainstStyleGuide(code, rules);
            expect(issues.length).toBeGreaterThan(0);
            expect(issues[0].issue).toContain('exceeds');
        });
        it('should detect tab characters when spaces required', () => {
            const code = '\tconst x = 1';
            const rules = getStyleGuidePreset('typescript', 'airbnb');
            const issues = validateAgainstStyleGuide(code, rules);
            const tabIssue = issues.find((i) => i.issue.includes('Tab'));
            expect(tabIssue).toBeDefined();
        });
        it('should detect any type in strict TypeScript', () => {
            const code = 'const x: any = 1';
            const rules = getStyleGuidePreset('typescript', 'airbnb');
            const issues = validateAgainstStyleGuide(code, rules);
            const anyIssue = issues.find((i) => i.issue.includes('any'));
            expect(anyIssue).toBeDefined();
        });
        it('should detect var keyword when immutability preferred', () => {
            const code = 'var x = 1';
            const rules = getStyleGuidePreset('typescript', 'airbnb');
            const issues = validateAgainstStyleGuide(code, rules);
            const varIssue = issues.find((i) => i.issue.includes('var'));
            expect(varIssue).toBeDefined();
        });
        it('should return empty for valid code', () => {
            const code = 'const x = 1';
            const rules = getStyleGuidePreset('typescript', 'airbnb');
            const issues = validateAgainstStyleGuide(code, rules);
            expect(issues.length).toBe(0);
        });
    });
    describe('getDocumentationRequirements', () => {
        it('should return requirements for TypeScript', () => {
            const reqs = getDocumentationRequirements('typescript');
            expect(reqs.requirePublicDocs).toBe(true);
            expect(reqs.requireParamDocs).toBe(true);
            expect(reqs.requireReturnDocs).toBe(true);
        });
        it('should require examples for Python', () => {
            const reqs = getDocumentationRequirements('python');
            expect(reqs.requireExamples).toBe(true);
        });
    });
    describe('generateDocTemplate', () => {
        it('should generate TSDoc for TypeScript', () => {
            const doc = generateDocTemplate('typescript', {
                name: 'calculate',
                description: 'Calculates a value',
                params: [
                    { name: 'x', type: 'number', description: 'Input value' },
                ],
                returnType: 'number',
                returnDescription: 'The result',
            });
            expect(doc).toContain('@param x');
            expect(doc).toContain('@returns');
        });
        it('should generate docstring for Python', () => {
            const doc = generateDocTemplate('python', {
                name: 'calculate',
                description: 'Calculates a value',
                params: [
                    { name: 'x', type: 'int', description: 'Input value' },
                ],
                returnType: 'int',
                returnDescription: 'The result',
            });
            expect(doc).toContain('"""');
            expect(doc).toContain('Args:');
            expect(doc).toContain('Returns:');
        });
    });
});
//# sourceMappingURL=phase3-implementation.test.js.map