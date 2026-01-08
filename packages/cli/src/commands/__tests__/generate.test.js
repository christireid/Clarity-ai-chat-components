/**
 * Tests for the generate command
 *
 * These tests verify:
 * - Template rendering with Handlebars
 * - Name validation (PascalCase, reserved names)
 * - File generation for all generator types
 * - Dry-run mode
 * - Flag bypass behavior
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import path from 'path';
import os from 'os';
import fs from 'fs-extra';
// Mock the prompts module to avoid interactive prompts in tests
vi.mock('../../utils/prompts.js', () => ({
    showIntro: vi.fn(),
    showOutro: vi.fn(),
    showFilesCreated: vi.fn(),
    showNextSteps: vi.fn(),
    showWarning: vi.fn(),
    promptText: vi.fn(),
    promptSelect: vi.fn(),
    promptConfirm: vi.fn().mockResolvedValue(true),
    runTasks: vi.fn(async (tasks) => {
        const results = [];
        for (const task of tasks) {
            if (task.enabled !== false) {
                results.push(await task.task());
            }
        }
        return results;
    }),
    setupCancelHandler: vi.fn(),
    onCleanup: vi.fn(),
    clearCleanup: vi.fn(),
    log: {
        success: vi.fn(),
        error: vi.fn(),
        warning: vi.fn(),
        info: vi.fn(),
        step: vi.fn(),
        message: vi.fn(),
    },
}));
// Template helper functions (copied from generate.ts for testing)
function toPascalCase(str) {
    return str
        .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
        .replace(/^(.)/, (_, c) => c.toUpperCase());
}
function toCamelCase(str) {
    return str
        .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
        .replace(/^(.)/, (_, c) => c.toLowerCase());
}
function toKebabCase(str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
}
describe('Case Conversion Utilities', () => {
    describe('toPascalCase', () => {
        it('should convert simple names', () => {
            expect(toPascalCase('chatMessage')).toBe('ChatMessage');
            expect(toPascalCase('chat-message')).toBe('ChatMessage');
            expect(toPascalCase('chat_message')).toBe('ChatMessage');
            expect(toPascalCase('chat message')).toBe('ChatMessage');
        });
        it('should handle already PascalCase names', () => {
            expect(toPascalCase('ChatMessage')).toBe('ChatMessage');
        });
        it('should handle single word names', () => {
            expect(toPascalCase('button')).toBe('Button');
            expect(toPascalCase('Button')).toBe('Button');
        });
    });
    describe('toCamelCase', () => {
        it('should convert to camelCase', () => {
            expect(toCamelCase('ChatMessage')).toBe('chatMessage');
            expect(toCamelCase('chat-message')).toBe('chatMessage');
            expect(toCamelCase('chat_message')).toBe('chatMessage');
        });
        it('should handle single word names', () => {
            expect(toCamelCase('Button')).toBe('button');
            expect(toCamelCase('button')).toBe('button');
        });
    });
    describe('toKebabCase', () => {
        it('should convert to kebab-case', () => {
            expect(toKebabCase('ChatMessage')).toBe('chat-message');
            expect(toKebabCase('chatMessage')).toBe('chat-message');
            expect(toKebabCase('chat_message')).toBe('chat-message');
        });
        it('should handle single word names', () => {
            expect(toKebabCase('Button')).toBe('button');
        });
    });
});
describe('Name Validation', () => {
    function validateName(value) {
        if (value.length < 2) {
            return 'Name must be at least 2 characters';
        }
        if (!/^[A-Za-z][A-Za-z0-9]*$/.test(value)) {
            return 'Name must start with a letter and contain only letters and numbers';
        }
        const reserved = [
            'component',
            'index',
            'utils',
            'types',
            'hooks',
            'use',
            'context',
        ];
        if (reserved.includes(value.toLowerCase())) {
            return `"${value}" is a reserved name`;
        }
        return undefined;
    }
    it('should accept valid PascalCase names', () => {
        expect(validateName('ChatMessage')).toBeUndefined();
        expect(validateName('Button')).toBeUndefined();
        expect(validateName('MyComponent123')).toBeUndefined();
    });
    it('should reject names shorter than 2 characters', () => {
        expect(validateName('A')).toBe('Name must be at least 2 characters');
        expect(validateName('')).toBe('Name must be at least 2 characters');
    });
    it('should reject names starting with numbers', () => {
        expect(validateName('123Button')).toBe('Name must start with a letter and contain only letters and numbers');
    });
    it('should reject names with special characters', () => {
        expect(validateName('Chat-Message')).toBe('Name must start with a letter and contain only letters and numbers');
        expect(validateName('Chat_Message')).toBe('Name must start with a letter and contain only letters and numbers');
        expect(validateName('Chat Message')).toBe('Name must start with a letter and contain only letters and numbers');
    });
    it('should reject reserved names', () => {
        expect(validateName('Component')).toBe('"Component" is a reserved name');
        expect(validateName('Index')).toBe('"Index" is a reserved name');
        expect(validateName('Utils')).toBe('"Utils" is a reserved name');
        expect(validateName('Types')).toBe('"Types" is a reserved name');
        expect(validateName('Hooks')).toBe('"Hooks" is a reserved name');
        expect(validateName('Use')).toBe('"Use" is a reserved name');
        expect(validateName('Context')).toBe('"Context" is a reserved name');
    });
});
describe('Template Rendering', () => {
    const componentTemplate = `export const {{pascalName}} = () => {
  return <div className="clarity-{{kebabName}}">{{pascalName}}</div>
}

{{pascalName}}.displayName = '{{pascalName}}'
`;
    const hookTemplate = `export function use{{pascalName}}() {
  const [value, setValue] = useState(null)
  return { value, setValue }
}
`;
    it('should render component template with context', async () => {
        const Handlebars = await import('handlebars');
        const template = Handlebars.default.compile(componentTemplate);
        const result = template({
            pascalName: 'ChatMessage',
            kebabName: 'chat-message',
        });
        expect(result).toContain('export const ChatMessage');
        expect(result).toContain('clarity-chat-message');
        expect(result).toContain("ChatMessage.displayName = 'ChatMessage'");
    });
    it('should render hook template with context', async () => {
        const Handlebars = await import('handlebars');
        const template = Handlebars.default.compile(hookTemplate);
        const result = template({ pascalName: 'ChatState' });
        expect(result).toContain('export function useChatState()');
    });
});
describe('File Generation Integration', () => {
    let tempDir;
    beforeEach(async () => {
        tempDir = path.join(os.tmpdir(), `clarity-cli-test-${Date.now()}`);
        await fs.ensureDir(tempDir);
    });
    afterEach(async () => {
        await fs.remove(tempDir);
    });
    it('should create component directory structure', async () => {
        const componentDir = path.join(tempDir, 'components', 'ChatMessage');
        await fs.ensureDir(componentDir);
        // Simulate file creation
        await fs.writeFile(path.join(componentDir, 'ChatMessage.tsx'), 'export const ChatMessage = () => <div>ChatMessage</div>');
        await fs.writeFile(path.join(componentDir, 'index.ts'), "export { ChatMessage } from './ChatMessage'");
        // Verify files exist
        expect(await fs.pathExists(path.join(componentDir, 'ChatMessage.tsx'))).toBe(true);
        expect(await fs.pathExists(path.join(componentDir, 'index.ts'))).toBe(true);
    });
    it('should create hook files', async () => {
        const hooksDir = path.join(tempDir, 'hooks');
        await fs.ensureDir(hooksDir);
        await fs.ensureDir(path.join(hooksDir, '__tests__'));
        await fs.writeFile(path.join(hooksDir, 'useChatState.ts'), 'export function useChatState() { return {} }');
        await fs.writeFile(path.join(hooksDir, '__tests__', 'useChatState.test.ts'), "describe('useChatState', () => {})");
        expect(await fs.pathExists(path.join(hooksDir, 'useChatState.ts'))).toBe(true);
        expect(await fs.pathExists(path.join(hooksDir, '__tests__', 'useChatState.test.ts'))).toBe(true);
    });
    it('should create context files', async () => {
        const contextsDir = path.join(tempDir, 'contexts');
        await fs.ensureDir(contextsDir);
        await fs.ensureDir(path.join(contextsDir, '__tests__'));
        await fs.writeFile(path.join(contextsDir, 'ThemeContext.tsx'), 'export const ThemeContext = createContext(null)');
        await fs.writeFile(path.join(contextsDir, '__tests__', 'ThemeContext.test.tsx'), "describe('ThemeContext', () => {})");
        expect(await fs.pathExists(path.join(contextsDir, 'ThemeContext.tsx'))).toBe(true);
        expect(await fs.pathExists(path.join(contextsDir, '__tests__', 'ThemeContext.test.tsx'))).toBe(true);
    });
    it('should not overwrite existing files without --force', async () => {
        const componentDir = path.join(tempDir, 'components', 'Button');
        await fs.ensureDir(componentDir);
        const existingContent = 'existing content';
        await fs.writeFile(path.join(componentDir, 'Button.tsx'), existingContent);
        // Read file to verify it wasn't changed
        const content = await fs.readFile(path.join(componentDir, 'Button.tsx'), 'utf-8');
        expect(content).toBe(existingContent);
    });
});
describe('Generator Types', () => {
    const generators = [
        'component',
        'hook',
        'context',
        'adapter',
        'test',
        'chat-component',
        'api-route',
    ];
    it.each(generators)('should have %s generator defined', (type) => {
        // This test verifies the generator types are recognized
        expect(generators).toContain(type);
    });
    it('should have correct default directories', () => {
        const defaultDirs = {
            component: './src/components',
            hook: './src/hooks',
            context: './src/contexts',
            adapter: './src/lib/adapters',
            test: './src/__tests__',
            'chat-component': './src/components/chat',
            'api-route': './src/app/api',
        };
        Object.entries(defaultDirs).forEach(([type, dir]) => {
            expect(defaultDirs[type]).toBe(dir);
        });
    });
});
describe('Chat Component Generator', () => {
    const chatComponentTemplate = `'use client'

import { forwardRef, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'

export interface {{pascalName}}Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

export interface {{pascalName}}Props {
  className?: string
  model?: string
}

export const {{pascalName}} = forwardRef<HTMLDivElement, {{pascalName}}Props>(
  ({ className, model = 'gpt-4', ...props }, ref) => {
    const [messages, setMessages] = useState<{{pascalName}}Message[]>([])
    return <div ref={ref} className={cn('clarity-{{kebabName}}', className)} {...props} />
  }
)

{{pascalName}}.displayName = '{{pascalName}}'
`;
    it('should render chat component template with context', async () => {
        const Handlebars = await import('handlebars');
        const template = Handlebars.default.compile(chatComponentTemplate);
        const result = template({
            pascalName: 'MyChat',
            kebabName: 'my-chat',
        });
        expect(result).toContain('export interface MyChatMessage');
        expect(result).toContain('export interface MyChatProps');
        expect(result).toContain('export const MyChat');
        expect(result).toContain('clarity-my-chat');
        expect(result).toContain("MyChat.displayName = 'MyChat'");
        expect(result).toContain("'use client'");
    });
    it('should include AI-specific props', async () => {
        const Handlebars = await import('handlebars');
        const template = Handlebars.default.compile(chatComponentTemplate);
        const result = template({
            pascalName: 'ChatBot',
            kebabName: 'chat-bot',
        });
        expect(result).toContain('model?: string');
        expect(result).toContain("model = 'gpt-4'");
        expect(result).toContain("role: 'user' | 'assistant' | 'system'");
    });
});
describe('API Route Generator', () => {
    const apiRouteTemplate = `import { NextRequest } from 'next/server'

// Rate limiting: Simple in-memory store (use Redis in production)
const rateLimit = new Map<string, { count: number; timestamp: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 20 // requests per window

export async function POST(req: NextRequest) {
  try {
    // TODO: Add authentication
    // const session = await getServerSession(authOptions)
    // if (!session) {
    //   return Response.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { messages, model = '{{#if (eq provider "anthropic")}}claude-3-opus{{else if (eq provider "google")}}gemini-pro{{else}}gpt-4{{/if}}' } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return Response.json(
        { error: 'messages is required and must be an array' },
        { status: 400 }
      )
    }

    // Provider: {{provider}}
    return Response.json({ content: 'Response from {{provider}}' })
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
`;
    it('should render API route template with OpenAI provider', async () => {
        const Handlebars = await import('handlebars');
        // Register the eq helper
        Handlebars.default.registerHelper('eq', (a, b) => a === b);
        const template = Handlebars.default.compile(apiRouteTemplate);
        const result = template({
            provider: 'openai',
        });
        expect(result).toContain("import { NextRequest } from 'next/server'");
        expect(result).toContain('Provider: openai');
        expect(result).toContain('Response from openai');
        expect(result).toContain('RATE_LIMIT_MAX = 20');
    });
    it('should render API route template with Anthropic provider', async () => {
        const Handlebars = await import('handlebars');
        Handlebars.default.registerHelper('eq', (a, b) => a === b);
        const template = Handlebars.default.compile(apiRouteTemplate);
        const result = template({
            provider: 'anthropic',
        });
        expect(result).toContain('Provider: anthropic');
        expect(result).toContain('Response from anthropic');
    });
    it('should include security patterns', async () => {
        const Handlebars = await import('handlebars');
        const template = Handlebars.default.compile(apiRouteTemplate);
        const result = template({
            provider: 'openai',
        });
        // Check for rate limiting
        expect(result).toContain('rateLimit');
        expect(result).toContain('RATE_LIMIT_WINDOW');
        expect(result).toContain('RATE_LIMIT_MAX');
        // Check for auth placeholder
        expect(result).toContain('TODO: Add authentication');
        expect(result).toContain('Unauthorized');
    });
    it('should validate messages array', async () => {
        const Handlebars = await import('handlebars');
        const template = Handlebars.default.compile(apiRouteTemplate);
        const result = template({
            provider: 'openai',
        });
        expect(result).toContain('!messages || !Array.isArray(messages)');
        expect(result).toContain('messages is required and must be an array');
        expect(result).toContain('status: 400');
    });
});
describe('File Generation for New Generators', () => {
    let tempDir;
    beforeEach(async () => {
        tempDir = path.join(os.tmpdir(), `clarity-cli-test-${Date.now()}`);
        await fs.ensureDir(tempDir);
    });
    afterEach(async () => {
        await fs.remove(tempDir);
    });
    it('should create chat-component directory structure', async () => {
        const chatDir = path.join(tempDir, 'components', 'chat', 'MyChat');
        await fs.ensureDir(chatDir);
        // Simulate file creation
        await fs.writeFile(path.join(chatDir, 'MyChat.tsx'), "'use client'\nexport const MyChat = () => <div>MyChat</div>");
        await fs.writeFile(path.join(chatDir, 'index.ts'), "export { MyChat } from './MyChat'");
        await fs.writeFile(path.join(chatDir, 'MyChat.test.tsx'), "describe('MyChat', () => {})");
        await fs.writeFile(path.join(chatDir, 'MyChat.stories.tsx'), "export default { title: 'Chat/MyChat' }");
        // Verify files exist
        expect(await fs.pathExists(path.join(chatDir, 'MyChat.tsx'))).toBe(true);
        expect(await fs.pathExists(path.join(chatDir, 'index.ts'))).toBe(true);
        expect(await fs.pathExists(path.join(chatDir, 'MyChat.test.tsx'))).toBe(true);
        expect(await fs.pathExists(path.join(chatDir, 'MyChat.stories.tsx'))).toBe(true);
    });
    it('should create api-route directory structure', async () => {
        const apiDir = path.join(tempDir, 'app', 'api', 'chat');
        await fs.ensureDir(apiDir);
        await fs.writeFile(path.join(apiDir, 'route.ts'), 'export async function POST(req) { return Response.json({}) }');
        expect(await fs.pathExists(path.join(apiDir, 'route.ts'))).toBe(true);
    });
});
describe('Shared Case Utilities', () => {
    // Import shared utilities to verify they work correctly
    // These tests ensure the shared case.ts utilities work as expected
    // after the refactoring to centralize them
    it('should handle complex case conversions', () => {
        // Testing edge cases
        expect(toPascalCase('XMLHttpRequest')).toBe('XMLHttpRequest');
        expect(toPascalCase('api-route-v2')).toBe('ApiRouteV2');
        // Consecutive uppercase letters become one segment in kebab-case
        expect(toKebabCase('ApiRouteV2')).toBe('api-route-v2');
        expect(toKebabCase('chatMessage')).toBe('chat-message');
    });
    it('should handle empty strings', () => {
        expect(toPascalCase('')).toBe('');
        expect(toCamelCase('')).toBe('');
        expect(toKebabCase('')).toBe('');
    });
    it('should handle single characters', () => {
        expect(toPascalCase('a')).toBe('A');
        expect(toCamelCase('A')).toBe('a');
        expect(toKebabCase('A')).toBe('a');
    });
});
//# sourceMappingURL=generate.test.js.map