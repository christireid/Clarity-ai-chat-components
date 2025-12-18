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

export {
  createBasicChatConfig,
  createMemoryChatConfig,
  createStreamingChatConfig,
  createEnterpriseChatConfig,
  isValidApiEndpoint,
  getApiEndpoint,
} from './clarity-chat-helpers'
