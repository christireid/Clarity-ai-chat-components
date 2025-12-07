/**
 * Config Errors Tests
 */
import { describe, it, expect } from 'vitest';
import { EnvVarMissingError, InvalidConfigError, PortAlreadyInUseError, FileNotFoundError, DependencyMissingError } from '../config-errors';
import { ClarityError } from '../base-error';
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
    it('should suggest copying from example file', () => {
        const error = new EnvVarMissingError('CONFIG_VALUE');
        const copyExample = error.solutions.find((s) => s.description.includes('Copy from'));
        expect(copyExample).toBeDefined();
        expect(copyExample?.steps?.some((s) => s.includes('cp'))).toBe(true);
    });
    it('should set context correctly', () => {
        const error = new EnvVarMissingError('MY_VAR');
        expect(error.context.location).toBe('Environment configuration');
        expect(error.context.data?.varName).toBe('MY_VAR');
    });
    it('should be instance of ClarityError', () => {
        const error = new EnvVarMissingError('TEST');
        expect(error).toBeInstanceOf(ClarityError);
    });
});
describe('InvalidConfigError', () => {
    it('should create error with config details', () => {
        const error = new InvalidConfigError('port', 'number', 'abc');
        expect(error.code).toBe('INVALID_CONFIG');
        expect(error.userMessage).toContain('port');
        expect(error.technicalMessage).toContain('number');
        expect(error.technicalMessage).toContain('string');
    });
    it('should include actual value in technical message', () => {
        const error = new InvalidConfigError('timeout', 'number', 'not-a-number');
        expect(error.technicalMessage).toContain('not-a-number');
    });
    it('should handle object values', () => {
        const error = new InvalidConfigError('options', 'object', [1, 2, 3]);
        expect(error.technicalMessage).toContain('[1,2,3]');
    });
    it('should provide config examples', () => {
        const error = new InvalidConfigError('port', 'number', 'abc');
        expect(error.solutions[0].example).toContain('port');
        expect(error.solutions[0].example).toContain('3000');
    });
    it('should provide string example', () => {
        const error = new InvalidConfigError('name', 'string', 123);
        expect(error.solutions[0].example).toContain('"value"');
    });
    it('should provide boolean example', () => {
        const error = new InvalidConfigError('enabled', 'boolean', 'yes');
        expect(error.solutions[0].example).toContain('true');
    });
    it('should include config in context', () => {
        const error = new InvalidConfigError('key', 'string', 42);
        expect(error.context.data?.configKey).toBe('key');
        expect(error.context.data?.expectedType).toBe('string');
        expect(error.context.data?.actualValue).toBe(42);
    });
});
describe('PortAlreadyInUseError', () => {
    it('should create error with port number', () => {
        const error = new PortAlreadyInUseError(3000);
        expect(error.code).toBe('PORT_IN_USE');
        expect(error.userMessage).toContain('3000');
        expect(error.technicalMessage).toContain('3000');
    });
    it('should suggest killing the process', () => {
        const error = new PortAlreadyInUseError(8080);
        const killSolution = error.solutions.find((s) => s.description.includes('Kill'));
        expect(killSolution).toBeDefined();
        expect(killSolution?.steps?.some((s) => s.includes('lsof'))).toBe(true);
        expect(killSolution?.example).toContain('8080');
    });
    it('should suggest using different port', () => {
        const error = new PortAlreadyInUseError(3000);
        const alternateSolution = error.solutions.find((s) => s.description.includes('different port'));
        expect(alternateSolution).toBeDefined();
        expect(alternateSolution?.example).toContain('3001');
    });
    it('should include port in context', () => {
        const error = new PortAlreadyInUseError(5000);
        expect(error.context.data?.port).toBe(5000);
        expect(error.context.action).toContain('5000');
    });
});
describe('FileNotFoundError', () => {
    it('should create error with file path', () => {
        const error = new FileNotFoundError('/path/to/file.ts');
        expect(error.code).toBe('FILE_NOT_FOUND');
        expect(error.userMessage).toContain('/path/to/file.ts');
        expect(error.technicalMessage).toContain('/path/to/file.ts');
    });
    it('should include expected location when provided', () => {
        const error = new FileNotFoundError('/config/settings.json', '/config/settings.example.json');
        expect(error.solutions[0].steps?.some((s) => s.includes('example'))).toBe(true);
        expect(error.solutions[0].example).toContain('settings.example.json');
    });
    it('should suggest creating the file', () => {
        const error = new FileNotFoundError('/app/config.ts');
        expect(error.solutions[0].description).toContain('Create');
        expect(error.solutions[0].steps?.some((s) => s.includes('/app/config.ts'))).toBe(true);
    });
    it('should suggest checking path', () => {
        const error = new FileNotFoundError('/some/path.js');
        const pathSolution = error.solutions.find((s) => s.description.includes('Check the file path'));
        expect(pathSolution).toBeDefined();
        expect(pathSolution?.steps?.some((s) => s.includes('typos'))).toBe(true);
    });
    it('should include file path in context', () => {
        const error = new FileNotFoundError('/test/file.ts', '/test/file.example.ts');
        expect(error.context.data?.filePath).toBe('/test/file.ts');
        expect(error.context.data?.expectedLocation).toBe('/test/file.example.ts');
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
        expect(error.solutions[0].example).toContain('@latest');
    });
    it('should suggest clean install', () => {
        const error = new DependencyMissingError('typescript');
        const cleanInstall = error.solutions.find((s) => s.description.includes('Install all'));
        expect(cleanInstall).toBeDefined();
        expect(cleanInstall?.example).toContain('rm -rf node_modules');
    });
    it('should include package in context', () => {
        const error = new DependencyMissingError('@types/node');
        expect(error.context.data?.packageName).toBe('@types/node');
        expect(error.context.action).toContain('@types/node');
    });
    it('should preserve original error', () => {
        const originalError = new Error("Cannot find module 'missing-pkg'");
        const error = new DependencyMissingError('missing-pkg', originalError);
        expect(error.originalError).toBe(originalError);
    });
});
//# sourceMappingURL=config-errors.test.js.map