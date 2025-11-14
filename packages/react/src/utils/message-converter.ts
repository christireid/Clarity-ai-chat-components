/**
 * Message Converter Utilities
 * 
 * @deprecated This file is kept for backward compatibility only.
 * Use `message-conversion.ts` instead, which is the canonical implementation.
 * 
 * This file re-exports from the canonical source to maintain compatibility
 * with existing code that imports from this file.
 * 
 * Migration: Change imports from `'../utils/message-converter'` to `'../utils/message-conversion'`
 */

// Re-export from canonical source for backward compatibility
export {
  convertCoreMessageToMessage as coreMessageToMessage,
  convertCoreMessagesToMessages as coreMessagesToMessages,
} from './message-conversion'
