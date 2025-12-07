/**
 * Input validation utilities using Zod
 */
import { z } from 'zod';
import { ValidationError } from './errors.js';
// Common validation schemas
export const FrameworkSchema = z.enum(['nextjs', 'remix', 'vite', 'astro'], {
    errorMap: () => ({ message: 'Framework must be one of: nextjs, remix, vite, astro' })
});
export const TemplateSchema = z.enum(['basic', 'chat', 'rag', 'analytics'], {
    errorMap: () => ({ message: 'Template must be one of: basic, chat, rag, analytics' })
});
export const ComponentSchema = z.enum([
    'chat-interface',
    'model-selector',
    'token-counter',
    'cost-estimator',
    'streaming-handler'
], {
    errorMap: () => ({ message: 'Invalid component name' })
});
export const ProviderSchema = z.enum(['openai', 'anthropic', 'google'], {
    errorMap: () => ({ message: 'Provider must be one of: openai, anthropic, google' })
});
export const GenerateTypeSchema = z.enum(['component', 'hook', 'adapter', 'test'], {
    errorMap: () => ({ message: 'Type must be one of: component, hook, adapter, test' })
});
export const PortSchema = z.coerce.number().int().min(1).max(65535);
export const PathSchema = z.string().min(1).refine((path) => !path.includes('..'), { message: 'Path cannot contain ".." (directory traversal)' });
/**
 * Validate and parse input with Zod schema
 */
export function validate(schema, data, errorMessage) {
    try {
        return schema.parse(data);
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            const messages = error.errors.map(e => e.message);
            throw new ValidationError(errorMessage || `Validation failed: ${messages.join(', ')}`, messages);
        }
        throw error;
    }
}
/**
 * Validate required fields
 */
export function validateRequired(obj, required) {
    const missing = [];
    for (const key of required) {
        if (obj[key] === undefined || obj[key] === null || obj[key] === '') {
            missing.push(String(key));
        }
    }
    if (missing.length > 0) {
        throw new ValidationError(`Missing required fields: ${missing.join(', ')}`, [`Provide values for: ${missing.join(', ')}`]);
    }
}
/**
 * Validate file path exists
 */
export async function validatePathExists(path) {
    const fs = await import('fs-extra');
    if (!await fs.pathExists(path)) {
        throw new ValidationError(`Path does not exist: ${path}`, [`Check if the path is correct: ${path}`, 'Create the file/directory if needed']);
    }
}
/**
 * Validate component name (PascalCase or kebab-case)
 */
export function validateComponentName(name) {
    if (!/^[A-Z][a-zA-Z0-9]*$|^[a-z][a-z0-9-]*$/.test(name)) {
        throw new ValidationError(`Invalid component name: ${name}`, [
            'Component names should be PascalCase (e.g., ChatInterface) or kebab-case (e.g., chat-interface)',
            'Names must start with a letter'
        ]);
    }
    return name;
}
//# sourceMappingURL=validation.js.map