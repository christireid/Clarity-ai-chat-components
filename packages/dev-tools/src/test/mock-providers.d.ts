/**
 * Mock AI providers for testing
 *
 * Provides fake implementations of OpenAI, Anthropic, and Google AI
 * for testing without making real API calls
 */
export interface MockResponse {
    content: string;
    model: string;
    usage: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
    delay?: number;
}
export interface MockStreamChunk {
    content: string;
    delay?: number;
}
export interface MockProviderOptions {
    responses?: MockResponse[];
    streamChunks?: MockStreamChunk[];
    error?: Error;
    delay?: number;
}
/**
 * Mock OpenAI client
 */
export declare class MockOpenAI {
    private options;
    private callCount;
    constructor(options?: MockProviderOptions);
    chat: {
        completions: {
            create: (params: any) => Promise<AsyncGenerator<{
                id: string;
                object: string;
                created: number;
                model: string;
                choices: {
                    index: number;
                    delta: {
                        content: string;
                    };
                    finish_reason: null;
                }[];
            } | {
                id: string;
                object: string;
                created: number;
                model: string;
                choices: {
                    index: number;
                    delta: {};
                    finish_reason: string;
                }[];
            }, void, unknown> | {
                id: string;
                object: string;
                created: number;
                model: any;
                choices: {
                    index: number;
                    message: {
                        role: string;
                        content: string;
                    };
                    finish_reason: string;
                }[];
                usage: {
                    prompt_tokens: number;
                    completion_tokens: number;
                    total_tokens: number;
                };
            }>;
        };
    };
    private createMockStream;
    private delay;
    getCallCount(): number;
    reset(): void;
}
/**
 * Mock Anthropic client
 */
export declare class MockAnthropic {
    private options;
    private callCount;
    constructor(options?: MockProviderOptions);
    messages: {
        create: (params: any) => Promise<AsyncGenerator<{
            type: string;
            message: {
                id: string;
                type: string;
                role: string;
                content: never[];
                model: string;
                usage: {
                    input_tokens: number;
                    output_tokens: number;
                };
            };
            index?: undefined;
            delta?: undefined;
            usage?: undefined;
        } | {
            type: string;
            index: number;
            delta: {
                type: string;
                text: string;
                stop_reason?: undefined;
            };
            message?: undefined;
            usage?: undefined;
        } | {
            type: string;
            delta: {
                stop_reason: string;
                type?: undefined;
                text?: undefined;
            };
            usage: {
                output_tokens: number;
            };
            message?: undefined;
            index?: undefined;
        }, void, unknown> | {
            id: string;
            type: string;
            role: string;
            content: {
                type: string;
                text: string;
            }[];
            model: any;
            stop_reason: string;
            usage: {
                input_tokens: number;
                output_tokens: number;
            };
        }>;
    };
    private createMockStream;
    private delay;
    getCallCount(): number;
    reset(): void;
}
/**
 * Mock Google AI client
 */
export declare class MockGoogleAI {
    private options;
    private callCount;
    constructor(options?: MockProviderOptions);
    getGenerativeModel(config: any): {
        generateContent: (prompt: string) => Promise<{
            response: {
                text: () => string;
                usageMetadata: {
                    promptTokenCount: number;
                    candidatesTokenCount: number;
                    totalTokenCount: number;
                };
            };
        }>;
        generateContentStream: (prompt: string) => AsyncGenerator<{
            text: () => string;
        }, void, unknown>;
    };
    private delay;
    getCallCount(): number;
    reset(): void;
}
/**
 * Create mock providers
 */
export declare function createMockProviders(options?: MockProviderOptions): {
    openai: MockOpenAI;
    anthropic: MockAnthropic;
    google: MockGoogleAI;
};
/**
 * Predefined mock scenarios
 */
export declare const mockScenarios: {
    success: {
        responses: {
            content: string;
            model: string;
            usage: {
                promptTokens: number;
                completionTokens: number;
                totalTokens: number;
            };
        }[];
    };
    multiTurn: {
        responses: {
            content: string;
            model: string;
            usage: {
                promptTokens: number;
                completionTokens: number;
                totalTokens: number;
            };
        }[];
    };
    streaming: {
        streamChunks: {
            content: string;
            delay: number;
        }[];
    };
    rateLimitError: {
        error: Error & {
            status: number;
            type: string;
        };
    };
    authError: {
        error: Error & {
            status: number;
            type: string;
        };
    };
    networkError: {
        error: Error & {
            code: string;
        };
    };
    slowResponse: {
        delay: number;
        responses: {
            content: string;
            model: string;
            usage: {
                promptTokens: number;
                completionTokens: number;
                totalTokens: number;
            };
        }[];
    };
};
//# sourceMappingURL=mock-providers.d.ts.map