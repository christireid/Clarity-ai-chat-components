/**
 * Component Registry
 *
 * Centralized registry for all Clarity Chat components.
 * This provides a single source of truth for:
 * - Available components
 * - Component metadata (dependencies, files, descriptions)
 * - Template configurations
 *
 * Inspired by shadcn/ui's registry-driven approach.
 */
// ============================================================================
// Component Registry - Available components for `clarity-chat add`
// ============================================================================
export const COMPONENT_REGISTRY = {
    'chat-interface': {
        name: 'Chat Interface',
        slug: 'chat-interface',
        description: 'Full-featured chat UI with message list, input, and streaming support',
        icon: '💬',
        category: 'chat',
        files: [
            'ChatInterface.tsx',
            'ChatMessage.tsx',
            'ChatInput.tsx',
            'index.ts',
        ],
        dependencies: ['@clarity-chat/react', '@clarity-chat/primitives'],
        devDependencies: [],
        peerDependencies: ['react', 'react-dom'],
        registryDependencies: ['streaming-handler'],
        docs: 'https://clarity-chat.dev/components/chat-interface',
        examples: [
            {
                name: 'Basic',
                code: `<ChatInterface
  model="gpt-4"
  onMessage={(msg) => console.log(msg)}
/>`,
            },
            {
                name: 'With Memory',
                code: `<ChatInterface
  model="gpt-4"
  memory={true}
  maxMessages={50}
/>`,
            },
        ],
    },
    'model-selector': {
        name: 'Model Selector',
        slug: 'model-selector',
        description: 'Dropdown to select AI models with provider grouping',
        icon: '🤖',
        category: 'ui',
        files: ['ModelSelector.tsx', 'index.ts'],
        dependencies: ['@clarity-chat/react', '@clarity-chat/types'],
        devDependencies: [],
        peerDependencies: ['react'],
        registryDependencies: [],
        docs: 'https://clarity-chat.dev/components/model-selector',
        examples: [
            {
                name: 'Basic',
                code: `<ModelSelector
  providers={['openai', 'anthropic']}
  onSelect={(model) => setModel(model)}
/>`,
            },
        ],
    },
    'token-counter': {
        name: 'Token Counter',
        slug: 'token-counter',
        description: 'Real-time token usage display with cost estimation',
        icon: '📊',
        category: 'analytics',
        files: ['TokenCounter.tsx', 'index.ts'],
        dependencies: ['@clarity-chat/react'],
        devDependencies: [],
        peerDependencies: ['react'],
        registryDependencies: [],
        docs: 'https://clarity-chat.dev/components/token-counter',
        examples: [
            {
                name: 'Basic',
                code: `<TokenCounter
  input={inputText}
  model="gpt-4"
  showCost={true}
/>`,
            },
        ],
    },
    'cost-estimator': {
        name: 'Cost Estimator',
        slug: 'cost-estimator',
        description: 'Calculate and display API costs in real-time',
        icon: '💰',
        category: 'analytics',
        files: ['CostEstimator.tsx', 'useCostTracking.ts', 'index.ts'],
        dependencies: ['@clarity-chat/react', '@clarity-chat/types'],
        devDependencies: [],
        peerDependencies: ['react'],
        registryDependencies: ['token-counter'],
        docs: 'https://clarity-chat.dev/components/cost-estimator',
        examples: [
            {
                name: 'Basic',
                code: `<CostEstimator
  model="gpt-4"
  inputTokens={1000}
  outputTokens={500}
/>`,
            },
        ],
    },
    'streaming-handler': {
        name: 'Streaming Handler',
        slug: 'streaming-handler',
        description: 'SSE streaming utilities with reconnection and error handling',
        icon: '⚡',
        category: 'core',
        files: ['useStreaming.ts', 'StreamingProvider.tsx', 'index.ts'],
        dependencies: ['@clarity-chat/primitives'],
        devDependencies: [],
        peerDependencies: ['react'],
        registryDependencies: [],
        docs: 'https://clarity-chat.dev/hooks/use-streaming',
        examples: [
            {
                name: 'Basic',
                code: `const { stream, isStreaming, error } = useStreaming({
  url: '/api/chat',
  onChunk: (chunk) => appendMessage(chunk),
})`,
            },
        ],
    },
    'message-list': {
        name: 'Message List',
        slug: 'message-list',
        description: 'Virtualized message list with auto-scroll and lazy loading',
        icon: '📜',
        category: 'chat',
        files: ['MessageList.tsx', 'MessageItem.tsx', 'index.ts'],
        dependencies: ['@clarity-chat/react', '@clarity-chat/primitives'],
        devDependencies: [],
        peerDependencies: ['react'],
        registryDependencies: [],
        docs: 'https://clarity-chat.dev/components/message-list',
        examples: [
            {
                name: 'Basic',
                code: `<MessageList
  messages={messages}
  renderMessage={(msg) => <CustomMessage {...msg} />}
/>`,
            },
        ],
    },
    'chat-input': {
        name: 'Chat Input',
        slug: 'chat-input',
        description: 'Rich text input with attachments, mentions, and keyboard shortcuts',
        icon: '⌨️',
        category: 'chat',
        files: ['ChatInput.tsx', 'index.ts'],
        dependencies: ['@clarity-chat/react'],
        devDependencies: [],
        peerDependencies: ['react'],
        registryDependencies: [],
        docs: 'https://clarity-chat.dev/components/chat-input',
        examples: [
            {
                name: 'Basic',
                code: `<ChatInput
  onSubmit={(text) => sendMessage(text)}
  placeholder="Type a message..."
  maxLength={4000}
/>`,
            },
        ],
    },
    'typing-indicator': {
        name: 'Typing Indicator',
        slug: 'typing-indicator',
        description: 'Animated typing indicator for AI responses',
        icon: '💭',
        category: 'chat',
        files: ['TypingIndicator.tsx', 'index.ts'],
        dependencies: ['@clarity-chat/react'],
        devDependencies: [],
        peerDependencies: ['react'],
        registryDependencies: [],
        docs: 'https://clarity-chat.dev/components/typing-indicator',
        examples: [
            {
                name: 'Basic',
                code: `<TypingIndicator visible={isTyping} />`,
            },
        ],
    },
    'code-block': {
        name: 'Code Block',
        slug: 'code-block',
        description: 'Syntax-highlighted code blocks with copy button and line numbers',
        icon: '📝',
        category: 'ui',
        files: ['CodeBlock.tsx', 'index.ts'],
        dependencies: ['@clarity-chat/react'],
        devDependencies: ['shiki'],
        peerDependencies: ['react'],
        registryDependencies: [],
        docs: 'https://clarity-chat.dev/components/code-block',
        examples: [
            {
                name: 'Basic',
                code: `<CodeBlock
  code={codeString}
  language="typescript"
  showLineNumbers={true}
/>`,
            },
        ],
    },
    'markdown-renderer': {
        name: 'Markdown Renderer',
        slug: 'markdown-renderer',
        description: 'Render markdown with syntax highlighting and LaTeX support',
        icon: '📄',
        category: 'ui',
        files: ['MarkdownRenderer.tsx', 'index.ts'],
        dependencies: ['@clarity-chat/react'],
        devDependencies: ['remark-gfm', 'rehype-katex'],
        peerDependencies: ['react'],
        registryDependencies: ['code-block'],
        docs: 'https://clarity-chat.dev/components/markdown-renderer',
        examples: [
            {
                name: 'Basic',
                code: `<MarkdownRenderer content={markdown} />`,
            },
        ],
    },
    'error-boundary': {
        name: 'Error Boundary',
        slug: 'error-boundary',
        description: 'Graceful error handling for chat components',
        icon: '🛡️',
        category: 'core',
        files: ['ErrorBoundary.tsx', 'index.ts'],
        dependencies: ['@clarity-chat/react'],
        devDependencies: [],
        peerDependencies: ['react'],
        registryDependencies: [],
        docs: 'https://clarity-chat.dev/components/error-boundary',
        examples: [
            {
                name: 'Basic',
                code: `<ErrorBoundary fallback={<ErrorFallback />}>
  <ChatInterface />
</ErrorBoundary>`,
            },
        ],
    },
};
// ============================================================================
// Generator Registry - Generator types for `clarity-chat generate`
// ============================================================================
export const GENERATOR_REGISTRY = {
    component: {
        name: 'React Component',
        slug: 'component',
        icon: '⚛️',
        description: 'Create a React component with TypeScript, tests, and Storybook story',
        defaultDir: './src/components',
        prompts: ['name', 'type', 'withTest', 'withStory', 'description'],
        templates: [
            'component',
            'componentIndex',
            'componentTest',
            'componentStory',
        ],
    },
    hook: {
        name: 'React Hook',
        slug: 'hook',
        icon: '🪝',
        description: 'Create a custom React hook with TypeScript and tests',
        defaultDir: './src/hooks',
        prompts: ['name', 'withTest', 'description'],
        templates: ['hook', 'hookTest'],
    },
    context: {
        name: 'React Context',
        slug: 'context',
        icon: '🔗',
        description: 'Create a React context with provider, hook, and tests',
        defaultDir: './src/contexts',
        prompts: ['name', 'withTest', 'description'],
        templates: ['context', 'contextTest'],
    },
    adapter: {
        name: 'Model Adapter',
        slug: 'adapter',
        icon: '🔌',
        description: 'Create an AI model adapter for streaming responses',
        defaultDir: './src/lib/adapters',
        prompts: ['name', 'provider', 'withTest', 'description'],
        templates: ['adapter', 'adapterTest'],
    },
    'chat-component': {
        name: 'Chat Component',
        slug: 'chat-component',
        icon: '💬',
        description: 'Create an AI chat-specific component with streaming support',
        defaultDir: './src/components/chat',
        prompts: [
            'name',
            'chatType',
            'withMemory',
            'withTest',
            'withStory',
            'description',
        ],
        templates: [
            'chatComponent',
            'chatComponentIndex',
            'chatComponentTest',
            'chatComponentStory',
        ],
    },
    test: {
        name: 'Test File',
        slug: 'test',
        icon: '🧪',
        description: 'Create a test file with Vitest',
        defaultDir: './src/__tests__',
        prompts: ['name', 'testType', 'description'],
        templates: ['test'],
    },
    'api-route': {
        name: 'API Route',
        slug: 'api-route',
        icon: '🌐',
        description: 'Create a Next.js API route for AI chat endpoints',
        defaultDir: './src/app/api',
        prompts: ['name', 'provider', 'withStreaming', 'description'],
        templates: ['apiRoute'],
    },
};
// ============================================================================
// Template Registry - Template configurations
// ============================================================================
export const TEMPLATE_REGISTRY = {
    basic: {
        name: 'Basic',
        slug: 'basic',
        description: 'Simple chat interface with minimal configuration',
        components: ['chat-interface', 'model-selector'],
        features: ['streaming', 'model-selection'],
    },
    chat: {
        name: 'Full Chat',
        slug: 'chat',
        description: 'Complete chat experience with all features',
        components: [
            'chat-interface',
            'model-selector',
            'token-counter',
            'cost-estimator',
            'streaming-handler',
        ],
        features: [
            'streaming',
            'model-selection',
            'token-counting',
            'cost-tracking',
        ],
    },
    rag: {
        name: 'RAG Chat',
        slug: 'rag',
        description: 'Retrieval-augmented generation with document context',
        components: [
            'chat-interface',
            'model-selector',
            'streaming-handler',
            'markdown-renderer',
        ],
        features: ['streaming', 'model-selection', 'document-context', 'citations'],
    },
    analytics: {
        name: 'Analytics Dashboard',
        slug: 'analytics',
        description: 'Usage analytics and cost tracking dashboard',
        components: ['token-counter', 'cost-estimator'],
        features: ['token-counting', 'cost-tracking', 'usage-analytics'],
    },
};
// ============================================================================
// Helper Functions
// ============================================================================
/**
 * Get all components in a specific category
 */
export function getComponentsByCategory(category) {
    return Object.values(COMPONENT_REGISTRY).filter((component) => component.category === category);
}
/**
 * Get all available categories
 */
export function getCategories() {
    const categories = new Set();
    Object.values(COMPONENT_REGISTRY).forEach((component) => {
        categories.add(component.category);
    });
    return Array.from(categories).sort();
}
/**
 * Get component by slug
 */
export function getComponent(slug) {
    return COMPONENT_REGISTRY[slug];
}
/**
 * Get generator by slug
 */
export function getGenerator(slug) {
    return GENERATOR_REGISTRY[slug];
}
/**
 * Get template by slug
 */
export function getTemplate(slug) {
    return TEMPLATE_REGISTRY[slug];
}
/**
 * Search components by name or description
 */
export function searchComponents(query) {
    const normalizedQuery = query.toLowerCase();
    return Object.values(COMPONENT_REGISTRY).filter((component) => component.name.toLowerCase().includes(normalizedQuery) ||
        component.description.toLowerCase().includes(normalizedQuery) ||
        component.slug.toLowerCase().includes(normalizedQuery));
}
/**
 * Get all component slugs
 */
export function getComponentSlugs() {
    return Object.keys(COMPONENT_REGISTRY);
}
/**
 * Get all generator slugs
 */
export function getGeneratorSlugs() {
    return Object.keys(GENERATOR_REGISTRY);
}
/**
 * Resolve component dependencies recursively
 */
export function resolveComponentDependencies(slug) {
    const component = COMPONENT_REGISTRY[slug];
    if (!component)
        return [];
    const deps = new Set([slug]);
    for (const dep of component.registryDependencies) {
        deps.add(dep);
        const nestedDeps = resolveComponentDependencies(dep);
        nestedDeps.forEach((d) => deps.add(d));
    }
    return Array.from(deps);
}
// Export types
export * from './types.js';
//# sourceMappingURL=index.js.map