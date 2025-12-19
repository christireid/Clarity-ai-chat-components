/**
 * Message Utilities
 *
 * Utilities for message conversion, grouping, and helpers.
 */

export {
  convertCoreMessageToMessage,
  convertMessageToCoreMessage,
  convertCoreMessagesToMessages,
  convertMessagesToCoreMessages,
  // Backward compatibility aliases (deprecated)
  coreMessageToMessage,
  coreMessagesToMessages,
  messageToCoreMessage,
  messagesToCoreMessages,
} from './message-conversion'

export * from './message-grouping'

export {
  createUserMessage,
  createAssistantMessage,
  createSystemMessage,
  createToolResultMessage,
} from './chat-helpers'

// TODO: Re-enable after fixing clarity-chat-helpers module dependencies
// export {
//   createBasicChatConfig,
//   createMemoryChatConfig,
//   createStreamingChatConfig,
//   createEnterpriseChatConfig,
//   isValidApiEndpoint,
//   getApiEndpoint,
// } from './clarity-chat-helpers'
