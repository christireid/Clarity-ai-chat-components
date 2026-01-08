/**
 * Token Optimization Test Scenarios
 *
 * Comprehensive suite of 30 scenarios for rigorous token optimization testing.
 * - 20 deterministic scenarios
 * - 5 adversarial "token bomb" scenarios
 * - 5 replay/regression scenarios
 */
// ============================================================================
// SHORT CONVERSATION SCENARIOS (1-3 turns)
// ============================================================================
const shortScenarios = [
    {
        id: 'short-01-greeting',
        name: 'Simple Greeting',
        category: 'short',
        description: 'Basic greeting exchange',
        turns: [{ role: 'user', content: 'Hello!' }],
        qualityGates: { instructionFollowing: true },
        optimizationAllowed: {
            canTruncateHistory: false,
            canCompressPrompt: false,
        },
    },
    {
        id: 'short-02-simple-question',
        name: 'Simple Question',
        category: 'short',
        description: 'One-shot factual question',
        turns: [{ role: 'user', content: 'What is the capital of France?' }],
        qualityGates: { factualAccuracy: true },
        optimizationAllowed: { canCompressPrompt: false },
    },
    {
        id: 'short-03-followup',
        name: 'Question with Follow-up',
        category: 'short',
        description: 'Initial question with one follow-up',
        turns: [
            { role: 'user', content: 'Explain photosynthesis in simple terms.' },
            {
                role: 'assistant',
                content: "Photosynthesis is the process by which plants convert sunlight, water, and carbon dioxide into glucose and oxygen. Think of it as the plant's way of making food using sunlight as energy.",
            },
            {
                role: 'user',
                content: "What happens at night when there's no sunlight?",
            },
        ],
        qualityGates: { factualAccuracy: true, instructionFollowing: true },
        optimizationAllowed: { canTruncateHistory: false },
    },
    {
        id: 'short-04-with-system',
        name: 'Short with System Prompt',
        category: 'short',
        description: 'Short query with system prompt',
        turns: [
            {
                role: 'system',
                content: 'You are a helpful assistant that responds concisely.',
            },
            { role: 'user', content: 'List 3 benefits of exercise.' },
        ],
        qualityGates: { preserveElements: ['You are a helpful'] },
        optimizationAllowed: { canCompressPrompt: true },
    },
    {
        id: 'short-05-translation',
        name: 'Translation Request',
        category: 'short',
        description: 'Simple translation task',
        turns: [
            { role: 'user', content: 'Translate "Hello, how are you?" to Spanish.' },
        ],
        qualityGates: { instructionFollowing: true },
        optimizationAllowed: { canCompressPrompt: false },
    },
];
// ============================================================================
// LONG CONVERSATION SCENARIOS (10+ turns)
// ============================================================================
const longScenarios = [
    {
        id: 'long-01-customer-support',
        name: 'Customer Support Conversation',
        category: 'long',
        description: 'Multi-turn customer support interaction',
        turns: [
            {
                role: 'system',
                content: 'You are a helpful customer support agent for an e-commerce company. Be professional and empathetic.',
            },
            { role: 'user', content: 'Hi, I have a problem with my order.' },
            {
                role: 'assistant',
                content: "I'm sorry to hear that. I'd be happy to help. Could you please provide your order number?",
            },
            { role: 'user', content: "Sure, it's ORDER-12345." },
            {
                role: 'assistant',
                content: 'Thank you. I can see your order for a wireless keyboard placed on December 15th. What issue are you experiencing?',
            },
            {
                role: 'user',
                content: "The keyboard I received is damaged. Some keys don't work.",
            },
            {
                role: 'assistant',
                content: 'I apologize for the inconvenience. We can offer you a replacement or a full refund. Which would you prefer?',
            },
            { role: 'user', content: "I'd like a replacement please." },
            {
                role: 'assistant',
                content: "I've initiated a replacement order. It will arrive within 3-5 business days. Would you like me to send a prepaid return label for the damaged item?",
            },
            {
                role: 'user',
                content: 'Yes please. Can you also expedite the shipping?',
            },
            {
                role: 'assistant',
                content: "I've upgraded your shipping to express delivery at no extra cost. The replacement should arrive within 1-2 business days. Is there anything else I can help you with?",
            },
            { role: 'user', content: 'Will I get a notification when it ships?' },
        ],
        qualityGates: {
            preserveElements: ['ORDER-12345'],
            instructionFollowing: true,
        },
        optimizationAllowed: { canTruncateHistory: true, canCompressPrompt: true },
    },
    {
        id: 'long-02-tutoring-session',
        name: 'Math Tutoring Session',
        category: 'long',
        description: 'Educational tutoring with multiple explanations',
        turns: [
            {
                role: 'system',
                content: 'You are a patient math tutor helping a high school student. Explain concepts step by step.',
            },
            { role: 'user', content: "I don't understand quadratic equations." },
            {
                role: 'assistant',
                content: "No worries! Let's start with the basics. A quadratic equation is any equation of the form ax² + bx + c = 0, where a, b, and c are constants and a ≠ 0. For example: x² + 5x + 6 = 0.",
            },
            { role: 'user', content: 'What does the x² mean?' },
            {
                role: 'assistant',
                content: 'Great question! x² means "x squared" or "x times x". So if x = 3, then x² = 3 × 3 = 9. The "2" is called an exponent and tells us how many times to multiply x by itself.',
            },
            { role: 'user', content: 'How do I solve x² + 5x + 6 = 0?' },
            {
                role: 'assistant',
                content: "There are several methods, but let's use factoring. We need to find two numbers that: 1) Multiply to give 6 (the c value), and 2) Add up to 5 (the b value). Those numbers are 2 and 3: 2 × 3 = 6 and 2 + 3 = 5.",
            },
            { role: 'user', content: 'So the answer is 2 and 3?' },
            {
                role: 'assistant',
                content: 'Almost! We factor the equation as (x + 2)(x + 3) = 0. For this to equal zero, either (x + 2) = 0 or (x + 3) = 0. Solving these: x = -2 or x = -3. So the answers are -2 and -3.',
            },
            {
                role: 'user',
                content: 'Let me check: (-2)² + 5(-2) + 6 = 4 - 10 + 6 = 0. It works!',
            },
            {
                role: 'assistant',
                content: 'Excellent work! You verified the solution correctly. This is called "checking your answer" and it\'s a great habit. Would you like to try another problem?',
            },
            { role: 'user', content: 'Yes, give me a harder one.' },
            {
                role: 'assistant',
                content: "Here's one: 2x² + 7x + 3 = 0. Try to factor it! Hint: look for numbers that multiply to 6 (because a×c = 2×3 = 6) and add to 7.",
            },
            { role: 'user', content: 'Is it (2x + 1)(x + 3) = 0?' },
        ],
        qualityGates: {
            factualAccuracy: true,
            preserveElements: ['ax² + bx + c = 0'],
        },
        optimizationAllowed: { canTruncateHistory: true, canCompressPrompt: true },
    },
    {
        id: 'long-03-debugging-session',
        name: 'Code Debugging Session',
        category: 'long',
        description: 'Multi-turn code debugging with context retention',
        turns: [
            {
                role: 'system',
                content: 'You are a senior software engineer helping debug code. Be thorough and explain your reasoning.',
            },
            {
                role: 'user',
                content: "My Python function isn't working:\n\ndef calculate_average(numbers):\n    total = 0\n    for num in numbers:\n        total += num\n    return total / len(numbers)",
            },
            {
                role: 'assistant',
                content: 'The function looks correct for basic cases. What error are you seeing? Also, this will fail if `numbers` is empty (division by zero). What input causes the issue?',
            },
            { role: 'user', content: "I'm getting 0 when I pass [1, 2, 3, 4]" },
            {
                role: 'assistant',
                content: "That's strange - it should return 2.5. Can you show me how you're calling the function? Also, are you using Python 2 or 3? In Python 2, integer division could cause issues.",
            },
            {
                role: 'user',
                content: "I'm using Python 3. I call it like: result = calculate_average([1, 2, 3, 4]) and print(result)",
            },
            {
                role: 'assistant',
                content: 'That should work correctly in Python 3. Let me ask: is the function definition exactly as you showed? Are there any other calculate_average functions defined elsewhere that might be shadowing this one?',
            },
            {
                role: 'user',
                content: 'Oh wait, I found it! I had an old version of the function earlier in the file that was returning 0.',
            },
            {
                role: 'assistant',
                content: "Classic issue! When Python encounters multiple function definitions with the same name, it uses the last one. But if you imported the old one, it might have been cached. Try restarting your interpreter or using `importlib.reload()` if it's in a module.",
            },
            {
                role: 'user',
                content: 'Fixed! Now I want to add error handling for empty lists.',
            },
            {
                role: 'assistant',
                content: 'Here\'s how you can handle that:\n\n```python\ndef calculate_average(numbers):\n    if not numbers:\n        return None  # or raise ValueError("Cannot calculate average of empty list")\n    return sum(numbers) / len(numbers)\n```\n\nI also simplified using `sum()` - it\'s more Pythonic.',
            },
            { role: 'user', content: 'Should I return None or raise an exception?' },
            {
                role: 'assistant',
                content: 'It depends on your use case:\n- Return `None` if empty input is expected and the caller will handle it\n- Raise `ValueError` if empty input is a bug that should be caught immediately\n- Return `0.0` if that makes sense for your domain\n\nWhat will the caller do with this result?',
            },
            {
                role: 'user',
                content: "It's for calculating student grade averages. Empty would mean no grades entered yet.",
            },
        ],
        qualityGates: {
            preserveElements: ['calculate_average', 'def '],
            instructionFollowing: true,
        },
        optimizationAllowed: { canTruncateHistory: true, canCompressPrompt: true },
    },
];
// ============================================================================
// CODE-HEAVY SCENARIOS
// ============================================================================
const codeScenarios = [
    {
        id: 'code-01-large-function',
        name: 'Large Code Block Analysis',
        category: 'code',
        description: 'Analyzing a large code block',
        turns: [
            {
                role: 'user',
                content: `Review this code and suggest improvements:

\`\`\`typescript
export class TokenOptimizer {
  private cache: Map<string, { tokens: number; timestamp: number }> = new Map();
  private maxCacheSize: number = 1000;
  private cacheTimeout: number = 3600000;

  constructor(config?: { maxCacheSize?: number; cacheTimeout?: number }) {
    if (config?.maxCacheSize) this.maxCacheSize = config.maxCacheSize;
    if (config?.cacheTimeout) this.cacheTimeout = config.cacheTimeout;
  }

  public countTokens(text: string): number {
    const cached = this.cache.get(text);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.tokens;
    }

    const tokens = this.estimateTokens(text);
    this.addToCache(text, tokens);
    return tokens;
  }

  private estimateTokens(text: string): number {
    // Approximate: 4 chars per token for English
    return Math.ceil(text.length / 4);
  }

  private addToCache(key: string, tokens: number): void {
    if (this.cache.size >= this.maxCacheSize) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, { tokens, timestamp: Date.now() });
  }

  public clearCache(): void {
    this.cache.clear();
  }

  public getCacheStats(): { size: number; hitRate: number } {
    return { size: this.cache.size, hitRate: 0 }; // TODO: track hits
  }
}
\`\`\``,
            },
        ],
        qualityGates: {
            preserveElements: ['TokenOptimizer', 'estimateTokens', 'addToCache'],
        },
        optimizationAllowed: { canCompressPrompt: false }, // Don't compress code
    },
    {
        id: 'code-02-multi-file',
        name: 'Multi-file Code Context',
        category: 'code',
        description: 'Code with multiple file context',
        turns: [
            {
                role: 'system',
                content: 'You are a code reviewer. Review code for bugs, performance issues, and best practices.',
            },
            {
                role: 'user',
                content: `I have two files that need to work together:

types.ts:
\`\`\`typescript
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface UserService {
  getUser(id: string): Promise<User | null>;
  createUser(data: Omit<User, 'id' | 'createdAt'>): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<boolean>;
}
\`\`\`

userService.ts:
\`\`\`typescript
import { User, UserService } from './types';

export class UserServiceImpl implements UserService {
  private users: Map<string, User> = new Map();

  async getUser(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async createUser(data: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const user: User = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error('User not found');
    const updated = { ...user, ...data };
    this.users.set(id, updated);
    return updated;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }
}
\`\`\`

Are there any issues?`,
            },
        ],
        qualityGates: {
            preserveElements: ['UserService', 'UserServiceImpl', 'interface User'],
        },
        optimizationAllowed: { canCompressPrompt: false },
    },
];
// ============================================================================
// TOOL-HEAVY SCENARIOS
// ============================================================================
const toolScenarios = [
    {
        id: 'tool-01-function-calling',
        name: 'Function Calling Scenario',
        category: 'tool-heavy',
        description: 'Scenario with function/tool definitions',
        turns: [
            {
                role: 'system',
                content: 'You are an assistant with access to tools. Use them when appropriate.',
            },
            { role: 'user', content: "What's the weather in San Francisco?" },
        ],
        qualityGates: { instructionFollowing: true },
        optimizationAllowed: { canTruncateHistory: false },
    },
    {
        id: 'tool-02-multi-tool',
        name: 'Multi-tool Orchestration',
        category: 'tool-heavy',
        description: 'Using multiple tools in sequence',
        turns: [
            {
                role: 'system',
                content: 'You are an assistant with access to weather, calendar, and email tools.',
            },
            {
                role: 'user',
                content: 'Check my calendar for tomorrow and if I have outdoor events, tell me the weather forecast.',
            },
            {
                role: 'assistant',
                content: "I'll check your calendar first to find any outdoor events for tomorrow.",
            },
            {
                role: 'user',
                content: 'The calendar shows: 10am - Morning run at the park, 2pm - Team lunch at outdoor restaurant',
            },
            {
                role: 'assistant',
                content: 'You have two outdoor events tomorrow. Let me check the weather forecast for your area.',
            },
            {
                role: 'user',
                content: 'Weather shows: Partly cloudy, high of 72°F, 20% chance of rain in the afternoon.',
            },
        ],
        qualityGates: { preserveElements: ['Morning run', 'Team lunch', '72°F'] },
        optimizationAllowed: { canTruncateHistory: true },
    },
];
// ============================================================================
// ADVERSARIAL "TOKEN BOMB" SCENARIOS
// ============================================================================
const adversarialScenarios = [
    {
        id: 'adversarial-01-huge-paste',
        name: 'Huge Text Paste',
        category: 'adversarial',
        description: 'User pastes massive text block',
        turns: [
            {
                role: 'user',
                content: `Summarize this document:\n\n${generateLoremIpsum(5000)}`,
            },
        ],
        qualityGates: {},
        optimizationAllowed: { canCompressPrompt: true, canTruncateHistory: true },
    },
    {
        id: 'adversarial-02-repeated-content',
        name: 'Highly Repeated Content',
        category: 'adversarial',
        description: 'Same phrase repeated many times',
        turns: [
            {
                role: 'user',
                content: `I need help! `.repeat(500) + ' What should I do?',
            },
        ],
        qualityGates: {},
        optimizationAllowed: { canCompressPrompt: true },
    },
    {
        id: 'adversarial-03-json-dump',
        name: 'Large JSON Dump',
        category: 'adversarial',
        description: 'User dumps large JSON for analysis',
        turns: [
            {
                role: 'user',
                content: `Analyze this data:\n${JSON.stringify(generateLargeJSON(200))}`,
            },
        ],
        qualityGates: {},
        optimizationAllowed: { canCompressPrompt: true, canChangeToon: true },
    },
    {
        id: 'adversarial-04-context-explosion',
        name: 'Context Window Explosion',
        category: 'adversarial',
        description: 'Very long conversation that would exceed context',
        turns: generateLongConversation(50),
        qualityGates: {},
        optimizationAllowed: { canTruncateHistory: true, canCompressPrompt: true },
    },
    {
        id: 'adversarial-05-mixed-chaos',
        name: 'Mixed Content Chaos',
        category: 'adversarial',
        description: 'Mix of code, markdown, JSON, and prose',
        turns: [
            {
                role: 'user',
                content: `Help me understand this:

# Header
${generateLoremIpsum(200)}

\`\`\`javascript
function mess() {
  return ${JSON.stringify(generateLargeJSON(20))};
}
\`\`\`

More text: ${'blah '.repeat(100)}

| Col1 | Col2 | Col3 |
|------|------|------|
${'| data | data | data |\n'.repeat(50)}

Final question: What is this?`,
            },
        ],
        qualityGates: {},
        optimizationAllowed: { canCompressPrompt: true },
    },
];
// ============================================================================
// EDGE CASE SCENARIOS
// ============================================================================
const edgeCaseScenarios = [
    {
        id: 'edge-01-empty-input',
        name: 'Empty Input',
        category: 'edge-case',
        description: 'Empty or minimal input',
        turns: [{ role: 'user', content: '' }],
        qualityGates: {},
        optimizationAllowed: {},
    },
    {
        id: 'edge-02-unicode-heavy',
        name: 'Unicode Heavy',
        category: 'edge-case',
        description: 'Content with many unicode characters',
        turns: [
            {
                role: 'user',
                content: '你好世界！这是中文测试。🌍🚀💻 Привет мир! مرحبا بالعالم 日本語テスト',
            },
        ],
        qualityGates: {},
        optimizationAllowed: {},
    },
    {
        id: 'edge-03-only-system',
        name: 'System Message Only',
        category: 'edge-case',
        description: 'Only system message, no user',
        turns: [{ role: 'system', content: 'You are a helpful assistant.' }],
        qualityGates: {},
        optimizationAllowed: {},
    },
    {
        id: 'edge-04-special-chars',
        name: 'Special Characters',
        category: 'edge-case',
        description: 'Many special characters and escapes',
        turns: [
            {
                role: 'user',
                content: 'Parse this: \\n\\t\\r "quotes" \'apostrophe\' <tags> &entities; $variables {{template}}',
            },
        ],
        qualityGates: {},
        optimizationAllowed: {},
    },
    {
        id: 'edge-05-whitespace',
        name: 'Whitespace Heavy',
        category: 'edge-case',
        description: 'Content with excessive whitespace',
        turns: [
            {
                role: 'user',
                content: 'Hello     world\n\n\n\n\nHow    are   you?\t\t\tFine.',
            },
        ],
        qualityGates: {},
        optimizationAllowed: { canCompressPrompt: true },
    },
];
// ============================================================================
// REPLAY/REGRESSION SCENARIOS
// ============================================================================
const replayScenarios = [
    {
        id: 'replay-01-known-baseline',
        name: 'Known Token Baseline',
        category: 'replay',
        description: 'Fixed content with known token count',
        turns: [
            {
                role: 'user',
                content: 'Hello, this is a test message with exactly the same content every time for regression testing.',
            },
        ],
        qualityGates: {},
        optimizationAllowed: {},
    },
    {
        id: 'replay-02-structured-data',
        name: 'Known Structured Data',
        category: 'replay',
        description: 'Fixed JSON for TOON testing',
        turns: [
            {
                role: 'user',
                content: `Process this data: ${JSON.stringify([
                    { name: 'Alice', age: 30, city: 'NYC' },
                    { name: 'Bob', age: 25, city: 'LA' },
                    { name: 'Charlie', age: 35, city: 'Chicago' },
                ])}`,
            },
        ],
        qualityGates: { preserveElements: ['Alice', 'Bob', 'Charlie'] },
        optimizationAllowed: { canChangeToon: true },
    },
    {
        id: 'replay-03-compression-target',
        name: 'Compression Target',
        category: 'replay',
        description: 'Text designed to be compressible',
        turns: [
            {
                role: 'user',
                content: 'I really really want to know, you know, like, what the weather is, um, basically going to be like today, you know, sort of.',
            },
        ],
        qualityGates: {},
        optimizationAllowed: { canCompressPrompt: true },
    },
    {
        id: 'replay-04-system-heavy',
        name: 'System Prompt Heavy',
        category: 'replay',
        description: 'Large system prompt, small user input',
        turns: [
            {
                role: 'system',
                content: `You are an expert assistant with deep knowledge in multiple domains. Follow these guidelines:
1. Always be helpful and accurate
2. Provide detailed explanations when asked
3. Use examples to illustrate points
4. Break down complex topics into simple terms
5. Acknowledge uncertainty when appropriate
6. Cite sources when possible
7. Respect user privacy
8. Be concise but thorough
9. Use proper formatting
10. Ask clarifying questions when needed`,
            },
            { role: 'user', content: 'Hi' },
        ],
        qualityGates: { preserveElements: ['You are an expert assistant'] },
        optimizationAllowed: { canCompressPrompt: true },
    },
    {
        id: 'replay-05-history-pruning',
        name: 'History Pruning Target',
        category: 'replay',
        description: 'Long history that should be pruned',
        turns: [
            { role: 'system', content: 'You are a helpful assistant.' },
            ...Array.from({ length: 10 }, (_, i) => [
                {
                    role: 'user',
                    content: `Message ${i + 1}: This is turn number ${i + 1}.`,
                },
                {
                    role: 'assistant',
                    content: `Response to turn ${i + 1}. Acknowledged.`,
                },
            ]).flat(),
            { role: 'user', content: 'What was my first message about?' },
        ],
        qualityGates: { preserveElements: ['Message 1'] },
        optimizationAllowed: { canTruncateHistory: true },
    },
];
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function generateLoremIpsum(words) {
    const lorem = 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(' ');
    const result = [];
    for (let i = 0; i < words; i++) {
        result.push(lorem[i % lorem.length]);
    }
    return result.join(' ');
}
function generateLargeJSON(items) {
    return Array.from({ length: items }, (_, i) => ({
        id: `item-${i}`,
        name: `Item Number ${i}`,
        value: Math.random() * 1000,
        active: i % 2 === 0,
        tags: [`tag${i % 5}`, `category${i % 3}`],
        metadata: {
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            version: i + 1,
        },
    }));
}
function generateLongConversation(turns) {
    const conversation = [
        { role: 'system', content: 'You are a helpful assistant.' },
    ];
    for (let i = 0; i < turns; i++) {
        conversation.push({
            role: 'user',
            content: `Turn ${i + 1}: ${generateLoremIpsum(20)}`,
        });
        conversation.push({
            role: 'assistant',
            content: `Response ${i + 1}: ${generateLoremIpsum(30)}`,
        });
    }
    conversation.push({
        role: 'user',
        content: 'Can you summarize our entire conversation?',
    });
    return conversation;
}
// ============================================================================
// EXPORT ALL SCENARIOS
// ============================================================================
export const ALL_SCENARIOS = [
    ...shortScenarios,
    ...longScenarios,
    ...codeScenarios,
    ...toolScenarios,
    ...adversarialScenarios,
    ...edgeCaseScenarios,
    ...replayScenarios,
];
export const SCENARIO_BY_ID = new Map(ALL_SCENARIOS.map((s) => [s.id, s]));
export function getScenariosByCategory(category) {
    return ALL_SCENARIOS.filter((s) => s.category === category);
}
export function getDeterministicScenarios() {
    return ALL_SCENARIOS.filter((s) => ['short', 'long', 'code', 'tool-heavy', 'edge-case'].includes(s.category));
}
export function getAdversarialScenarios() {
    return ALL_SCENARIOS.filter((s) => s.category === 'adversarial');
}
export function getReplayScenarios() {
    return ALL_SCENARIOS.filter((s) => s.category === 'replay');
}
// Summary
console.log(`[Scenarios] Loaded ${ALL_SCENARIOS.length} scenarios:`);
console.log(`  - Short: ${shortScenarios.length}`);
console.log(`  - Long: ${longScenarios.length}`);
console.log(`  - Code: ${codeScenarios.length}`);
console.log(`  - Tool-heavy: ${toolScenarios.length}`);
console.log(`  - Adversarial: ${adversarialScenarios.length}`);
console.log(`  - Edge-case: ${edgeCaseScenarios.length}`);
console.log(`  - Replay: ${replayScenarios.length}`);
//# sourceMappingURL=scenarios.js.map