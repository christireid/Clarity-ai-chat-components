/**
 * Template Compiler Tests
 *
 * Comprehensive tests for the template compilation utilities.
 */
import { describe, it, expect } from 'vitest';
import { compileTemplate, compileTemplateWithResult, buildMessagesArray, buildMessagesFromTemplates, generateDiff, formatMessagesAsJson, formatMessagesAsText, validateRequiredVariables, getMissingVariables, STRUCTURED_OUTPUT_INSTRUCTION, } from '../utils/template-compiler';
describe('template-compiler', () => {
    describe('compileTemplate', () => {
        it('should substitute single variable', () => {
            const result = compileTemplate('Hello {{ name }}!', { name: 'Alice' });
            expect(result).toBe('Hello Alice!');
        });
        it('should substitute multiple variables', () => {
            const result = compileTemplate('{{ greeting }} {{ name }}!', {
                greeting: 'Hello',
                name: 'Alice',
            });
            expect(result).toBe('Hello Alice!');
        });
        it('should handle variables with no spaces', () => {
            const result = compileTemplate('Hello {{name}}!', { name: 'Alice' });
            expect(result).toBe('Hello Alice!');
        });
        it('should handle variables with extra spaces', () => {
            const result = compileTemplate('Hello {{  name  }}!', { name: 'Alice' });
            expect(result).toBe('Hello Alice!');
        });
        it('should keep unresolved variables by default', () => {
            const result = compileTemplate('Hello {{ name }}!', {});
            expect(result).toBe('Hello {{ name }}!');
        });
        it('should remove unresolved variables when keepUnresolved is false', () => {
            const result = compileTemplate('Hello {{ name }}!', {}, { keepUnresolved: false });
            expect(result).toBe('Hello !');
        });
        it('should use custom unresolved format', () => {
            const result = compileTemplate('Hello {{ name }}!', {}, {
                unresolvedFormat: (name) => `[MISSING: ${name}]`,
            });
            expect(result).toBe('Hello [MISSING: name]!');
        });
        it('should trim result when trim is true', () => {
            const result = compileTemplate('  Hello {{ name }}!  ', { name: 'Alice' }, { trim: true });
            expect(result).toBe('Hello Alice!');
        });
        it('should not trim by default', () => {
            const result = compileTemplate('  Hello  ', {});
            expect(result).toBe('  Hello  ');
        });
        it('should handle empty values', () => {
            const result = compileTemplate('Hello {{ name }}!', { name: '' });
            expect(result).toBe('Hello {{ name }}!');
        });
        it('should handle null values as unresolved', () => {
            const result = compileTemplate('Hello {{ name }}!', {
                name: null,
            });
            expect(result).toBe('Hello {{ name }}!');
        });
        it('should handle undefined values as unresolved', () => {
            const result = compileTemplate('Hello {{ name }}!', {
                name: undefined,
            });
            expect(result).toBe('Hello {{ name }}!');
        });
        it('should substitute same variable multiple times', () => {
            const result = compileTemplate('{{ x }} + {{ x }} = {{ result }}', {
                x: '2',
                result: '4',
            });
            expect(result).toBe('2 + 2 = 4');
        });
        it('should handle empty template', () => {
            const result = compileTemplate('', { name: 'Alice' });
            expect(result).toBe('');
        });
        it('should handle template with no variables', () => {
            const result = compileTemplate('Hello world!', { name: 'Alice' });
            expect(result).toBe('Hello world!');
        });
        it('should preserve newlines and whitespace in values', () => {
            const result = compileTemplate('Content: {{ text }}', {
                text: 'Line 1\nLine 2',
            });
            expect(result).toBe('Content: Line 1\nLine 2');
        });
        it('should handle special characters in values', () => {
            const result = compileTemplate('Code: {{ code }}', {
                code: 'const x = { a: 1 };',
            });
            expect(result).toBe('Code: const x = { a: 1 };');
        });
    });
    describe('compileTemplateWithResult', () => {
        it('should return compiled template and metadata', () => {
            const result = compileTemplateWithResult('Hello {{ name }}!', {
                name: 'Alice',
            });
            expect(result.compiled).toBe('Hello Alice!');
            expect(result.substituted).toEqual(['name']);
            expect(result.unresolved).toEqual([]);
            expect(result.success).toBe(true);
        });
        it('should track unresolved variables', () => {
            const result = compileTemplateWithResult('{{ a }} {{ b }} {{ c }}', {
                a: '1',
            });
            expect(result.substituted).toEqual(['a']);
            expect(result.unresolved).toEqual(['b', 'c']);
        });
        it('should deduplicate variable names in tracking', () => {
            const result = compileTemplateWithResult('{{ x }} + {{ x }}', { x: '2' });
            expect(result.substituted).toEqual(['x']);
            expect(result.substituted).toHaveLength(1);
        });
        it('should mark success when all required variables are resolved', () => {
            const result = compileTemplateWithResult('{{ a }} {{ b }}', { a: '1', b: '2' }, { requiredVariables: ['a'] });
            expect(result.success).toBe(true);
        });
        it('should mark failure when required variables are missing', () => {
            const result = compileTemplateWithResult('{{ a }} {{ b }}', { a: '1' }, { requiredVariables: ['b'] });
            expect(result.success).toBe(false);
        });
        it('should set error message in strict mode', () => {
            const result = compileTemplateWithResult('{{ a }} {{ b }}', {}, { strict: true, requiredVariables: ['a', 'b'] });
            expect(result.success).toBe(false);
            expect(result.error).toContain('Missing required variables');
            expect(result.error).toContain('a');
            expect(result.error).toContain('b');
        });
        it('should not set error when not strict', () => {
            const result = compileTemplateWithResult('{{ a }}', {}, { requiredVariables: ['a'] });
            expect(result.success).toBe(false);
            expect(result.error).toBeUndefined();
        });
        it('should support trim option', () => {
            const result = compileTemplateWithResult('  {{ name }}  ', { name: 'Alice' }, { trim: true });
            expect(result.compiled).toBe('Alice');
        });
    });
    describe('buildMessagesArray', () => {
        it('should build messages with system and user', () => {
            const messages = buildMessagesArray('You are a helpful assistant.', 'What is 2 + 2?');
            expect(messages).toHaveLength(2);
            expect(messages[0]).toEqual({
                role: 'system',
                content: 'You are a helpful assistant.',
            });
            expect(messages[1]).toEqual({
                role: 'user',
                content: 'What is 2 + 2?',
            });
        });
        it('should handle empty system prompt', () => {
            const messages = buildMessagesArray('', 'Hello');
            expect(messages).toHaveLength(1);
            expect(messages[0].role).toBe('user');
        });
        it('should handle empty user prompt', () => {
            const messages = buildMessagesArray('System prompt', '');
            expect(messages).toHaveLength(1);
            expect(messages[0].role).toBe('system');
        });
        it('should handle both empty', () => {
            const messages = buildMessagesArray('', '');
            expect(messages).toHaveLength(0);
        });
        it('should trim system prompt', () => {
            const messages = buildMessagesArray('  System  ', 'User');
            expect(messages[0].content).toBe('System');
        });
        it('should trim user prompt', () => {
            const messages = buildMessagesArray('System', '  User  ');
            expect(messages[1].content).toBe('User');
        });
        it('should add structured output instruction when enabled', () => {
            const messages = buildMessagesArray('System prompt', 'User prompt', true);
            expect(messages[0].content).toContain('You MUST respond with valid JSON');
            expect(messages[0].content).toContain('System prompt');
        });
        it('should use structured output as system when no system prompt', () => {
            const messages = buildMessagesArray('', 'User prompt', true);
            expect(messages).toHaveLength(2);
            expect(messages[0].role).toBe('system');
            expect(messages[0].content).toContain('JSON');
        });
        it('should handle whitespace-only prompts as empty', () => {
            const messages = buildMessagesArray('   ', '   ');
            expect(messages).toHaveLength(0);
        });
    });
    describe('buildMessagesFromTemplates', () => {
        it('should compile templates and build messages', () => {
            const messages = buildMessagesFromTemplates('You are {{ role }}.', 'Help me with {{ task }}.', { role: 'an assistant', task: 'coding' });
            expect(messages[0].content).toBe('You are an assistant.');
            expect(messages[1].content).toBe('Help me with coding.');
        });
        it('should remove unresolved variables', () => {
            const messages = buildMessagesFromTemplates('{{ prefix }} System', 'User {{ suffix }}', {});
            expect(messages[0].content).toBe('System');
            expect(messages[1].content).toBe('User');
        });
        it('should support structured output mode', () => {
            const messages = buildMessagesFromTemplates('System', 'User', {}, true);
            expect(messages[0].content).toContain('JSON');
        });
    });
    describe('generateDiff', () => {
        it('should generate diff for substituted variable', () => {
            const diff = generateDiff('Hello {{ name }}!', { name: 'Alice' });
            expect(diff).toHaveLength(3);
            expect(diff[0]).toEqual({ type: 'unchanged', content: 'Hello ' });
            expect(diff[1]).toEqual({
                type: 'value',
                content: 'Alice',
                variableName: 'name',
            });
            expect(diff[2]).toEqual({ type: 'unchanged', content: '!' });
        });
        it('should show unsubstituted variable as variable type', () => {
            const diff = generateDiff('Hello {{ name }}!', {});
            expect(diff[1]).toEqual({
                type: 'variable',
                content: '{{ name }}',
                variableName: 'name',
            });
        });
        it('should handle multiple variables', () => {
            const diff = generateDiff('{{ a }} and {{ b }}', { a: '1', b: '2' });
            expect(diff).toHaveLength(3);
            expect(diff[0]).toEqual({
                type: 'value',
                content: '1',
                variableName: 'a',
            });
            expect(diff[1]).toEqual({ type: 'unchanged', content: ' and ' });
            expect(diff[2]).toEqual({
                type: 'value',
                content: '2',
                variableName: 'b',
            });
        });
        it('should handle mixed resolved and unresolved', () => {
            const diff = generateDiff('{{ a }} {{ b }}', { a: '1' });
            expect(diff[0].type).toBe('value');
            expect(diff[2].type).toBe('variable');
        });
        it('should handle template with no variables', () => {
            const diff = generateDiff('Plain text', {});
            expect(diff).toHaveLength(1);
            expect(diff[0]).toEqual({ type: 'unchanged', content: 'Plain text' });
        });
        it('should handle empty template', () => {
            const diff = generateDiff('', {});
            expect(diff).toHaveLength(0);
        });
        it('should handle consecutive variables', () => {
            const diff = generateDiff('{{a}}{{b}}', { a: '1', b: '2' });
            expect(diff).toHaveLength(2);
            expect(diff[0].content).toBe('1');
            expect(diff[1].content).toBe('2');
        });
    });
    describe('formatMessagesAsJson', () => {
        it('should format messages as pretty JSON', () => {
            const messages = [{ role: 'user', content: 'Hello' }];
            const json = formatMessagesAsJson(messages);
            expect(json).toBe('[\n  {\n    "role": "user",\n    "content": "Hello"\n  }\n]');
        });
        it('should handle empty array', () => {
            const json = formatMessagesAsJson([]);
            expect(json).toBe('[]');
        });
    });
    describe('formatMessagesAsText', () => {
        it('should format messages with role headers', () => {
            const messages = [
                { role: 'system', content: 'System content' },
                { role: 'user', content: 'User content' },
            ];
            const text = formatMessagesAsText(messages);
            expect(text).toContain('SYSTEM');
            expect(text).toContain('System content');
            expect(text).toContain('USER');
            expect(text).toContain('User content');
        });
        it('should handle empty array', () => {
            const text = formatMessagesAsText([]);
            expect(text).toBe('');
        });
    });
    describe('validateRequiredVariables', () => {
        it('should return valid when all required are present', () => {
            const result = validateRequiredVariables(['a', 'b'], { a: '1', b: '2' });
            expect(result.valid).toBe(true);
            expect(result.missing).toEqual([]);
        });
        it('should return missing variables', () => {
            const result = validateRequiredVariables(['a', 'b', 'c'], { a: '1' });
            expect(result.valid).toBe(false);
            expect(result.missing).toEqual(['b', 'c']);
        });
        it('should treat empty string as missing', () => {
            const result = validateRequiredVariables(['a'], { a: '' });
            expect(result.valid).toBe(false);
            expect(result.missing).toEqual(['a']);
        });
        it('should treat whitespace-only as missing', () => {
            const result = validateRequiredVariables(['a'], { a: '   ' });
            expect(result.valid).toBe(false);
        });
        it('should handle empty required list', () => {
            const result = validateRequiredVariables([], {});
            expect(result.valid).toBe(true);
        });
    });
    describe('getMissingVariables', () => {
        it('should return missing variables from template', () => {
            const missing = getMissingVariables('{{ a }} {{ b }}', { a: '1' });
            expect(missing).toEqual(['b']);
        });
        it('should return empty when all have values', () => {
            const missing = getMissingVariables('{{ a }}', { a: '1' });
            expect(missing).toEqual([]);
        });
        it('should deduplicate repeated variables', () => {
            const missing = getMissingVariables('{{ a }} {{ a }}', {});
            expect(missing).toEqual(['a']);
        });
        it('should treat empty string as missing', () => {
            const missing = getMissingVariables('{{ a }}', { a: '' });
            expect(missing).toEqual(['a']);
        });
        it('should handle template with no variables', () => {
            const missing = getMissingVariables('Plain text', {});
            expect(missing).toEqual([]);
        });
    });
    describe('STRUCTURED_OUTPUT_INSTRUCTION', () => {
        it('should contain JSON instructions', () => {
            expect(STRUCTURED_OUTPUT_INSTRUCTION).toContain('JSON');
            expect(STRUCTURED_OUTPUT_INSTRUCTION).toContain('result');
            expect(STRUCTURED_OUTPUT_INSTRUCTION).toContain('thinking');
            expect(STRUCTURED_OUTPUT_INSTRUCTION).toContain('confidence');
        });
    });
});
//# sourceMappingURL=template-compiler.test.js.map