/**
 * Config Errors Tests
 */
import { describe, it, expect } from 'vitest';
import { EnvVarMissingError, InvalidConfigError, PortAlreadyInUseError, FileNotFoundError, DependencyMissingError, ConfigParseError, } from '../config.js';
import { ClarityError } from '../base.js';
describe('EnvVarMissingError', () => {
    it('should create error with variable name', () => {
        const error = new EnvVarMissingError('DATABASE_URL');
        expect(error.code).toBe('ENV_VAR_MISSING');
        expect(error.userMessage).toContain('DATABASE_URL');
        expect(error.technicalMessage).toContain('DATABASE_URL');
    });
    it('should include setup instructions', () => {
        const error = new EnvVarMissingError('API_KEY');
        expect(error.solutions.length).toBeGreaterThan(0);
        expect(error.solutions[0].steps?.some((s) => s.includes('.env'))).toBe(true);
    });
    it('should include example', () => {
        const error = new EnvVarMissingError('SECRET_KEY');
        expect(error.solutions[0].example).toContain('SECRET_KEY');
        expect(error.solutions[0].example).toContain('.env');
    });
    it('should include description if provided', () => {
        const error = new EnvVarMissingError('MY_VAR', 'This variable is used for authentication');
        expect(error.technicalMessage).toContain('authentication');
    });
    it('should set context correctly', () => {
        const error = new EnvVarMissingError('MY_VAR');
        expect(error.context.action).toBe('Loading configuration');
        expect(error.context.data?.varName).toBe('MY_VAR');
    });
    it('should be instance of ClarityError', () => {
        const error = new EnvVarMissingError('TEST');
        expect(error).toBeInstanceOf(ClarityError);
    });
});
describe('InvalidConfigError', () => {
    it('should create error with config details', () => {
        const error = new InvalidConfigError('port', 'abc', 'number');
        expect(error.code).toBe('INVALID_CONFIG');
        expect(error.userMessage).toContain('port');
        expect(error.technicalMessage).toContain('number');
    });
    it('should include actual value in technical message', () => {
        const error = new InvalidConfigError('timeout', 'not-a-number', 'number');
        expect(error.technicalMessage).toContain('not-a-number');
    });
    it('should handle object values', () => {
        const error = new InvalidConfigError('options', [1, 2, 3], 'object');
        expect(error.technicalMessage).toContain('[1,2,3]');
    });
    it('should include config in context', () => {
        const error = new InvalidConfigError('key', 42, 'string');
        expect(error.context.data?.field).toBe('key');
        expect(error.context.data?.expected).toBe('string');
        expect(error.context.data?.value).toBe(42);
    });
    it('should be instance of ClarityError', () => {
        const error = new InvalidConfigError('test', 'value', 'expected');
        expect(error).toBeInstanceOf(ClarityError);
    });
});
describe('PortAlreadyInUseError', () => {
    it('should create error with port number', () => {
        const error = new PortAlreadyInUseError(3000);
        expect(error.code).toBe('PORT_IN_USE');
        expect(error.userMessage).toContain('3000');
    });
    it('should suggest finding the process', () => {
        const error = new PortAlreadyInUseError(8080);
        const findSolution = error.solutions.find((s) => s.description.includes('Find'));
        expect(findSolution).toBeDefined();
        expect(findSolution?.steps?.some((s) => s.includes('lsof'))).toBe(true);
    });
    it('should suggest using different port', () => {
        const error = new PortAlreadyInUseError(3000);
        const alternateSolution = error.solutions.find((s) => s.description.includes('different port'));
        expect(alternateSolution).toBeDefined();
        expect(alternateSolution?.example).toContain('PORT');
    });
    it('should include port in context', () => {
        const error = new PortAlreadyInUseError(5000);
        expect(error.context.data?.port).toBe(5000);
        expect(error.context.action).toContain('server');
    });
});
describe('FileNotFoundError', () => {
    it('should create error with file path', () => {
        const error = new FileNotFoundError('/path/to/file.ts');
        expect(error.code).toBe('FILE_NOT_FOUND');
        expect(error.userMessage).toContain('/path/to/file.ts');
        expect(error.technicalMessage).toContain('/path/to/file.ts');
    });
    it('should include description if provided', () => {
        const error = new FileNotFoundError('/config/settings.json', 'Configuration file is required');
        expect(error.technicalMessage).toContain('Configuration file');
    });
    it('should suggest creating the file', () => {
        const error = new FileNotFoundError('/app/config.ts');
        expect(error.solutions[0].description).toContain('Create');
        expect(error.solutions[0].steps?.some((s) => s.includes('/app/config.ts'))).toBe(true);
    });
    it('should suggest checking configuration', () => {
        const error = new FileNotFoundError('/some/path.js');
        const configSolution = error.solutions.find((s) => s.description.includes('configuration'));
        expect(configSolution).toBeDefined();
    });
    it('should include file path in context', () => {
        const error = new FileNotFoundError('/test/file.ts');
        expect(error.context.data?.filePath).toBe('/test/file.ts');
    });
});
describe('DependencyMissingError', () => {
    it('should create error with package name', () => {
        const error = new DependencyMissingError('lodash');
        expect(error.code).toBe('DEPENDENCY_MISSING');
        expect(error.userMessage).toContain('lodash');
        expect(error.technicalMessage).toContain('lodash');
    });
    it('should suggest installing the package', () => {
        const error = new DependencyMissingError('express');
        expect(error.solutions[0].steps?.some((s) => s.includes('npm install express'))).toBe(true);
    });
    it('should include install example', () => {
        const error = new DependencyMissingError('react');
        expect(error.solutions[0].example).toContain('npm install react');
    });
    it('should include version when provided', () => {
        const error = new DependencyMissingError('typescript', '5.0.0');
        expect(error.technicalMessage).toContain('5.0.0');
        expect(error.solutions[0].example).toContain('typescript@5.0.0');
    });
    it('should include package in context', () => {
        const error = new DependencyMissingError('@types/node');
        expect(error.context.data?.packageName).toBe('@types/node');
        expect(error.context.action).toContain('module');
    });
    it('should preserve original error', () => {
        const originalError = new Error("Cannot find module 'missing-pkg'");
        const error = new DependencyMissingError('missing-pkg', undefined, originalError);
        expect(error.originalError).toBe(originalError);
    });
});
describe('ConfigParseError', () => {
    it('should create error with file and parsing info', () => {
        const error = new ConfigParseError('config.json', 'JSON', 'Unexpected token');
        expect(error.code).toBe('CONFIG_PARSE_ERROR');
        expect(error.userMessage).toContain('JSON');
        expect(error.technicalMessage).toContain('config.json');
        expect(error.technicalMessage).toContain('Unexpected token');
    });
    it('should include format in user message', () => {
        const error = new ConfigParseError('tsconfig.json', 'JSON', 'Invalid syntax');
        expect(error.userMessage).toContain('JSON');
    });
    it('should include parse error in context', () => {
        const error = new ConfigParseError('package.json', 'JSON', 'Parse error');
        expect(error.context.data?.filePath).toBe('package.json');
        expect(error.context.data?.format).toBe('JSON');
        expect(error.context.data?.parseError).toBe('Parse error');
    });
    it('should suggest validation', () => {
        const error = new ConfigParseError('package.json', 'JSON', 'Parse error');
        const validateSolution = error.solutions.find((s) => s.steps?.some((step) => step.toLowerCase().includes('valid')));
        expect(validateSolution).toBeDefined();
    });
    it('should be instance of ClarityError', () => {
        const error = new ConfigParseError('file.json', 'JSON', 'error');
        expect(error).toBeInstanceOf(ClarityError);
    });
});
//# sourceMappingURL=config.test.js.map