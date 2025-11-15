/**
 * Utility Functions Export
 * 
 * Re-export commonly used utilities for convenience.
 * Note: Most utilities are domain-specific and exported from their respective domains.
 */

// Runtime validation utilities (for internal use, but exported for advanced users)
export {
  validateApiEndpoint,
  validateRequiredString,
  validateEnum,
  validateProvider,
  validateFunction,
  validateStorageKey,
} from './runtime-validation'

// Message conversion utilities (exported from chat-ui domain)
// Re-exported here for convenience
export {
  convertCoreMessagesToMessages,
  convertMessageToCoreMessage,
  convertCoreMessageToMessage,
  convertMessagesToCoreMessages,
  // Deprecated aliases (backward compatibility)
  coreMessagesToMessages,
  coreMessageToMessage,
} from './message-conversion'
