/**
 * Configuration Error Classes
 *
 * Errors for configuration issues including missing environment variables,
 * invalid config files, and missing dependencies.
 */
import { ClarityError } from './base.js';
/**
 * Error thrown when a required environment variable is missing
 *
 * @example
 * ```ts
 * if (!process.env.DATABASE_URL) {
 *   throw new EnvVarMissingError('DATABASE_URL', 'Database connection string')
 * }
 * ```
 */
export class EnvVarMissingError extends ClarityError {
    constructor(varName, description, originalError) {
        const solutions = [
            {
                description: `Add the ${varName} environment variable`,
                steps: [
                    'Create or edit .env.local in your project root',
                    `Add: ${varName}=your-value-here`,
                    'Restart your development server',
                ],
                example: `# .env.local\n${varName}=your-value-here`,
            },
            {
                description: 'For production, set the environment variable in your hosting platform',
                steps: [
                    'Go to your hosting platform settings',
                    'Find the environment variables section',
                    `Add ${varName} with the appropriate value`,
                    'Redeploy your application',
                ],
            },
        ];
        super('ENV_VAR_MISSING', `Missing required environment variable: ${varName}`, description || `The environment variable ${varName} is not set`, solutions, {
            action: 'Loading configuration',
            data: { varName },
        }, originalError);
    }
}
/**
 * Error thrown when configuration is invalid
 *
 * @example
 * ```ts
 * if (config.maxTokens < 0) {
 *   throw new InvalidConfigError('maxTokens', config.maxTokens, 'positive number')
 * }
 * ```
 */
export class InvalidConfigError extends ClarityError {
    constructor(field, value, expected, originalError) {
        super('INVALID_CONFIG', `Invalid configuration for ${field}`, `Expected ${expected}, received ${typeof value}: ${JSON.stringify(value)}`, [
            {
                description: 'Fix the configuration value',
                steps: [
                    `Check your configuration for the "${field}" setting`,
                    `Update it to match the expected format: ${expected}`,
                    'Restart your application',
                ],
            },
        ], {
            action: 'Validating configuration',
            data: { field, value, expected },
        }, originalError);
    }
}
/**
 * Error thrown when a port is already in use
 */
export class PortAlreadyInUseError extends ClarityError {
    constructor(port, originalError) {
        super('PORT_IN_USE', `Port ${port} is already in use`, 'Another process is using the requested port', [
            {
                description: 'Use a different port',
                steps: [
                    'Set a different port in your configuration',
                    'Or use the PORT environment variable',
                ],
                example: `PORT=3001 npm run dev`,
            },
            {
                description: 'Find and stop the process using the port',
                steps: [
                    `Run: lsof -i :${port} (Mac/Linux) or netstat -ano | findstr :${port} (Windows)`,
                    'Identify the process ID (PID)',
                    'Stop the process: kill <PID> (Mac/Linux) or taskkill /PID <PID> /F (Windows)',
                ],
            },
        ], {
            action: 'Starting server',
            data: { port },
        }, originalError);
    }
}
/**
 * Error thrown when a required file is not found
 */
export class FileNotFoundError extends ClarityError {
    constructor(filePath, description, originalError) {
        super('FILE_NOT_FOUND', `File not found: ${filePath}`, description || `The required file at "${filePath}" does not exist`, [
            {
                description: 'Create the missing file',
                steps: [
                    `Check if the file path is correct`,
                    `Create the file at: ${filePath}`,
                    'Add the required content',
                ],
            },
            {
                description: 'Check your configuration',
                steps: [
                    'Verify the file path in your configuration',
                    'Ensure relative paths are correct for your current directory',
                ],
            },
        ], {
            action: 'Loading file',
            data: { filePath },
        }, originalError);
    }
}
/**
 * Error thrown when a required dependency is missing
 */
export class DependencyMissingError extends ClarityError {
    constructor(packageName, version, originalError) {
        const installCmd = version
            ? `npm install ${packageName}@${version}`
            : `npm install ${packageName}`;
        super('DEPENDENCY_MISSING', `Missing required dependency: ${packageName}`, `The package "${packageName}"${version ? ` (version ${version})` : ''} is not installed`, [
            {
                description: 'Install the missing dependency',
                steps: [
                    `Run: ${installCmd}`,
                    'Or with yarn: yarn add ' +
                        (version ? `${packageName}@${version}` : packageName),
                    'Or with pnpm: pnpm add ' +
                        (version ? `${packageName}@${version}` : packageName),
                    'Restart your application',
                ],
                example: installCmd,
            },
        ], {
            action: 'Loading module',
            data: { packageName, version },
        }, originalError);
    }
}
/**
 * Error thrown when configuration file cannot be parsed
 */
export class ConfigParseError extends ClarityError {
    constructor(filePath, format, parseError, originalError) {
        super('CONFIG_PARSE_ERROR', `Failed to parse ${format} configuration`, `Error parsing "${filePath}": ${parseError}`, [
            {
                description: 'Fix the syntax error in your configuration file',
                steps: [
                    `Open ${filePath}`,
                    `Check for ${format} syntax errors`,
                    'Use a JSON/YAML validator to find issues',
                    'Common issues: missing commas, unquoted strings, trailing commas',
                ],
            },
        ], {
            action: 'Parsing configuration',
            data: { filePath, format, parseError },
        }, originalError);
    }
}
//# sourceMappingURL=config.js.map