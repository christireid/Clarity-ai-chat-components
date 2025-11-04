/**
 * AI Assistant Template
 *
 * General-purpose AI assistant with rich features
 */
export interface AIAssistantTemplateProps {
    apiKeys?: {
        openai?: string;
        anthropic?: string;
        google?: string;
    };
    defaultModel?: string;
    enableFileUpload?: boolean;
    enableVoiceInput?: boolean;
    enableContextManagement?: boolean;
    systemPrompt?: string;
    maxTokens?: number;
}
/**
 * AI Assistant Template
 *
 * Features:
 * - Multiple AI model support
 * - Streaming responses
 * - Context management
 * - File uploads
 * - Voice input
 * - Conversation history
 *
 * @example
 * ```tsx
 * <AIAssistantTemplate
 *   apiKeys={{
 *     openai: process.env.OPENAI_API_KEY,
 *     anthropic: process.env.ANTHROPIC_API_KEY,
 *   }}
 *   defaultModel="gpt-4"
 *   enableFileUpload
 *   enableVoiceInput
 * />
 * ```
 */
export declare function AIAssistantTemplate({ apiKeys, defaultModel, enableContextManagement, systemPrompt, maxTokens, }: AIAssistantTemplateProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ai-assistant.d.ts.map