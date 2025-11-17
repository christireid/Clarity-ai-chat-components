/**
 * Message Converter Utilities (Legacy)
 * 
 * @deprecated This file is kept for backward compatibility.
 * New code should import from './message-conversion' instead.
 * 
 * This file re-exports the canonical implementations from message-conversion.ts
 * with the old naming convention (without "convert" prefix).
 */

// Re-export from canonical implementation
export {
  convertCoreMessageToMessage as coreMessageToMessage,
  convertCoreMessagesToMessages as coreMessagesToMessages,
  convertMessageToCoreMessage as messageToCoreMessage,
  convertMessagesToCoreMessages as messagesToCoreMessages,
} from './message-conversion'
