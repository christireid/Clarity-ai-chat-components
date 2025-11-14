/**
 * Summarizer Interface
 */

export interface Summarizer {
  summarize(text: string, maxTokens: number): Promise<string>
  summarizeBatch(texts: string[], maxTokens: number): Promise<string[]>
}
