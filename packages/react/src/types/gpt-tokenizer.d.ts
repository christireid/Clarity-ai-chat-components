/**
 * Type declarations for gpt-tokenizer
 *
 * This is an optional peer dependency that provides accurate token counting.
 * When not installed, the useLazyTokenCounter hook falls back to
 * character-based estimation.
 *
 * Install with: npm install gpt-tokenizer
 * @see https://github.com/niieani/gpt-tokenizer
 */

declare module 'gpt-tokenizer' {
  /**
   * Encode options
   */
  export interface EncodeOptions {
    allowedSpecial?: 'all' | Set<string>
    disallowedSpecial?: 'all' | Set<string>
  }

  /**
   * Encode a string into tokens
   */
  export function encode(text: string, options?: EncodeOptions): number[]

  /**
   * Decode tokens back to a string
   */
  export function decode(tokens: number[]): string

  /**
   * Chat message type
   */
  export interface ChatMessage {
    role: 'system' | 'user' | 'assistant' | 'function' | 'tool'
    content: string
    name?: string
  }

  /**
   * Encode chat messages for a specific model
   */
  export function encodeChat(
    messages: ChatMessage[],
    model?: string
  ): number[]

  /**
   * Check if the tokenizer is available for a specific model
   */
  export function isWithinTokenLimit(text: string, limit: number): boolean

  /**
   * Count tokens in a string
   */
  export function countTokens(text: string): number

  /**
   * Get the encoding for a specific model
   */
  export function encodingForModel(
    model: string
  ): {
    encode: (text: string, options?: EncodeOptions) => number[]
    decode: (tokens: number[]) => string
    free: () => void
  }

  /**
   * Available model encodings
   */
  export type ModelEncoding =
    | 'gpt-4'
    | 'gpt-4-32k'
    | 'gpt-4-turbo'
    | 'gpt-4o'
    | 'gpt-3.5-turbo'
    | 'text-davinci-003'
    | 'text-davinci-002'
    | 'text-curie-001'
    | 'text-babbage-001'
    | 'text-ada-001'
    | 'davinci'
    | 'curie'
    | 'babbage'
    | 'ada'
    | 'code-davinci-002'
    | 'code-davinci-001'
    | 'code-cushman-002'
    | 'code-cushman-001'
    | 'text-embedding-ada-002'
    | 'text-embedding-3-small'
    | 'text-embedding-3-large'
}
