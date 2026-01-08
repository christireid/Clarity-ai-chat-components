/**
 * Provider configuration and model definitions
 */
export const PROVIDERS = {
    openai: {
        name: 'OpenAI',
        icon: '🤖',
        color: 'rgb(16, 185, 129)',
        description: 'GPT-4 and GPT-3.5 models',
    },
    anthropic: {
        name: 'Anthropic',
        icon: '🧠',
        color: 'rgb(217, 91, 60)',
        description: 'Claude 3 family',
    },
    google: {
        name: 'Google',
        icon: '✨',
        color: 'rgb(66, 133, 244)',
        description: 'Gemini models',
    },
};
export const MODELS = [
    // OpenAI
    {
        id: 'gpt-4-turbo-preview',
        name: 'GPT-4 Turbo',
        provider: 'openai',
        contextWindow: 128000,
        maxOutput: 4096,
        description: 'Most capable GPT-4 model',
        costPer1kInput: 0.01,
        costPer1kOutput: 0.03,
    },
    {
        id: 'gpt-4o',
        name: 'GPT-4o',
        provider: 'openai',
        contextWindow: 128000,
        maxOutput: 16384,
        description: 'Fast multimodal model',
        costPer1kInput: 0.005,
        costPer1kOutput: 0.015,
    },
    {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        provider: 'openai',
        contextWindow: 16385,
        maxOutput: 4096,
        description: 'Fast and cost-effective',
        costPer1kInput: 0.0005,
        costPer1kOutput: 0.0015,
    },
    // Anthropic
    {
        id: 'claude-3-opus-20240229',
        name: 'Claude 3 Opus',
        provider: 'anthropic',
        contextWindow: 200000,
        maxOutput: 4096,
        description: 'Most intelligent Claude',
        costPer1kInput: 0.015,
        costPer1kOutput: 0.075,
    },
    {
        id: 'claude-3-5-sonnet-20241022',
        name: 'Claude 3.5 Sonnet',
        provider: 'anthropic',
        contextWindow: 200000,
        maxOutput: 8192,
        description: 'Best balance of speed & intelligence',
        costPer1kInput: 0.003,
        costPer1kOutput: 0.015,
    },
    {
        id: 'claude-3-haiku-20240307',
        name: 'Claude 3 Haiku',
        provider: 'anthropic',
        contextWindow: 200000,
        maxOutput: 4096,
        description: 'Fastest Claude model',
        costPer1kInput: 0.00025,
        costPer1kOutput: 0.00125,
    },
    // Google
    {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro',
        provider: 'google',
        contextWindow: 2000000,
        maxOutput: 8192,
        description: 'Largest context window',
        costPer1kInput: 0.00125,
        costPer1kOutput: 0.005,
    },
    {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        provider: 'google',
        contextWindow: 1000000,
        maxOutput: 8192,
        description: 'Fast and efficient',
        costPer1kInput: 0.000075,
        costPer1kOutput: 0.0003,
    },
];
export function getModelsByProvider(provider) {
    return MODELS.filter((m) => m.provider === provider);
}
export function getModelById(id) {
    return MODELS.find((m) => m.id === id);
}
//# sourceMappingURL=providers.js.map