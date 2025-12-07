/**
 * Configuration management with cosmiconfig
 * Supports multiple config file formats and sources
 */
import { cosmiconfig } from 'cosmiconfig';
import path from 'path';
import fs from 'fs-extra';
import { z } from 'zod';
import { ConfigError } from './errors.js';
import { validate } from './validation.js';
const CONFIG_NAME = 'clarity-chat';
// Configuration schema
export const ConfigSchema = z.object({
    framework: z.enum(['nextjs', 'remix', 'vite', 'astro']).optional(),
    components: z.array(z.string()).optional(),
    apiKeys: z.object({
        openai: z.string().optional(),
        anthropic: z.string().optional(),
        google: z.string().optional(),
    }).optional(),
    defaults: z.object({
        temperature: z.number().min(0).max(2).optional(),
        maxTokens: z.number().int().positive().optional(),
        streaming: z.boolean().optional(),
    }).optional(),
    paths: z.object({
        components: z.string().optional(),
        hooks: z.string().optional(),
        adapters: z.string().optional(),
    }).optional(),
});
const defaultConfig = {
    framework: 'nextjs',
    components: [],
    apiKeys: {},
    defaults: {
        temperature: 0.7,
        maxTokens: 1000,
        streaming: true,
    },
    paths: {
        components: './src/components',
        hooks: './src/hooks',
        adapters: './src/lib/adapters',
    },
};
let cachedConfig = null;
let configPath = null;
/**
 * Load configuration from file or return defaults
 */
export async function loadConfig(cwd = process.cwd()) {
    if (cachedConfig) {
        return cachedConfig;
    }
    try {
        const explorer = cosmiconfig(CONFIG_NAME, {
            searchPlaces: [
                'package.json',
                `.${CONFIG_NAME}rc`,
                `.${CONFIG_NAME}rc.json`,
                `.${CONFIG_NAME}rc.yaml`,
                `.${CONFIG_NAME}rc.yml`,
                `.${CONFIG_NAME}rc.js`,
                `.${CONFIG_NAME}rc.cjs`,
                `${CONFIG_NAME}.config.js`,
                `${CONFIG_NAME}.config.cjs`,
                `${CONFIG_NAME}.config.mjs`,
            ],
        });
        const result = await explorer.search(cwd);
        if (result) {
            configPath = result.filepath;
            const validated = validate(ConfigSchema, result.config, 'Invalid configuration file');
            cachedConfig = { ...defaultConfig, ...validated };
            return cachedConfig;
        }
    }
    catch (error) {
        if (error instanceof Error && !error.message.includes('Validation failed')) {
            throw new ConfigError(`Failed to load configuration: ${error.message}`, ['Check your config file syntax', 'Run: clarity-chat doctor --fix']);
        }
        throw error;
    }
    cachedConfig = defaultConfig;
    return cachedConfig;
}
/**
 * Save configuration to file
 */
export async function saveConfig(config, cwd = process.cwd()) {
    const currentConfig = await loadConfig(cwd);
    const mergedConfig = { ...currentConfig, ...config };
    const validated = validate(ConfigSchema, mergedConfig, 'Invalid configuration');
    const configFile = path.join(cwd, `${CONFIG_NAME}.config.js`);
    const content = `/** @type {import('@clarity-chat/cli').Config} */
module.exports = ${JSON.stringify(validated, null, 2)}
`;
    await fs.writeFile(configFile, content, 'utf-8');
    cachedConfig = null; // Clear cache
}
/**
 * Get config file path
 */
export function getConfigPath() {
    return configPath;
}
/**
 * Clear config cache
 */
export function clearConfigCache() {
    cachedConfig = null;
    configPath = null;
}
/**
 * Merge CLI options with config file values
 * Priority: CLI options > Config file > Defaults
 */
export function mergeConfigWithOptions(options, config) {
    return {
        ...defaultConfig,
        ...config,
        ...options,
    };
}
//# sourceMappingURL=config.js.map