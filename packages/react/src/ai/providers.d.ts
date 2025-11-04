/**
 * AI Providers
 *
 * Built-in providers for suggestions, moderation, and sentiment analysis
 */
import type { SuggestionProvider, ModerationProvider, SentimentAnalyzer } from './types';
/**
 * Quick Reply Suggestion Provider
 *
 * Provides common quick reply suggestions based on context
 */
export declare function createQuickReplyProvider(replies: Array<{
    text: string;
    description?: string;
    triggers?: string[];
    icon?: React.ReactNode;
}>): SuggestionProvider;
/**
 * Command Suggestion Provider
 *
 * Provides command suggestions (e.g., /help, /clear)
 */
export declare function createCommandProvider(commands: Array<{
    command: string;
    description: string;
    icon?: React.ReactNode;
}>): SuggestionProvider;
/**
 * Completion Suggestion Provider
 *
 * Provides text completion suggestions
 */
export declare function createCompletionProvider(completions: Record<string, string[]>): SuggestionProvider;
/**
 * Context-Aware Suggestion Provider
 *
 * Provides suggestions based on conversation history
 */
export declare function createContextAwareProvider(): SuggestionProvider;
/**
 * Basic Profanity Filter
 *
 * Simple client-side profanity detection
 */
export declare function createProfanityFilter(bannedWords?: string[]): ModerationProvider;
/**
 * PII (Personally Identifiable Information) Detector
 *
 * Detects potential PII in content
 */
export declare function createPIIDetector(): ModerationProvider;
/**
 * Simple Sentiment Analyzer
 *
 * Basic rule-based sentiment analysis
 */
export declare function createSimpleSentimentAnalyzer(): SentimentAnalyzer;
/**
 * Combine Multiple Moderation Providers
 *
 * Run multiple moderation checks and combine results
 */
export declare function combineModerationProviders(providers: ModerationProvider[]): ModerationProvider;
//# sourceMappingURL=providers.d.ts.map