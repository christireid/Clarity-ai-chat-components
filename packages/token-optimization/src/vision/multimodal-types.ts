/**
 * Multimodal Message Types
 *
 * Type definitions for messages containing text, images, and other media.
 * Compatible with OpenAI, Anthropic, and Google APIs.
 */

import type { ImageDimensions, ImageDetail } from './vision-token-counter'

/**
 * Content block type
 */
export type ContentBlockType = 'text' | 'image' | 'image_url'

/**
 * Image source type
 */
export type ImageSource = 'url' | 'base64' | 'file_path'

/**
 * Text content block
 */
export interface TextContent {
  type: 'text'
  text: string
}

/**
 * Image content block (base64)
 */
export interface ImageContent {
  type: 'image'
  source: {
    type: 'base64'
    media_type: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif'
    data: string
  }
  /** Optional: image dimensions (for token calculation) */
  dimensions?: ImageDimensions
  /** Optional: OpenAI detail level */
  detail?: ImageDetail
}

/**
 * Image URL content block
 */
export interface ImageURLContent {
  type: 'image_url'
  image_url: {
    url: string
    detail?: ImageDetail
  }
  /** Optional: image dimensions (for token calculation) */
  dimensions?: ImageDimensions
}

/**
 * Union of all content types
 */
export type MessageContent = TextContent | ImageContent | ImageURLContent

/**
 * Multimodal message
 */
export interface MultimodalMessage {
  role: 'system' | 'user' | 'assistant'
  content: string | MessageContent[]
}

/**
 * Message with metadata
 */
export interface MultimodalMessageWithMetadata extends MultimodalMessage {
  /** Token count for text */
  textTokens?: number
  /** Token count for images */
  imageTokens?: number
  /** Total token count */
  totalTokens?: number
  /** Cost estimate */
  estimatedCost?: number
}

// ============================================================================
// Provider-Specific Formats
// ============================================================================

/**
 * OpenAI message format
 */
export interface OpenAIMultimodalMessage {
  role: 'system' | 'user' | 'assistant'
  content:
    | string
    | Array<
        | {
            type: 'text'
            text: string
          }
        | {
            type: 'image_url'
            image_url: {
              url: string
              detail?: 'low' | 'high' | 'auto'
            }
          }
      >
}

/**
 * Anthropic message format
 */
export interface AnthropicMultimodalMessage {
  role: 'user' | 'assistant'
  content:
    | string
    | Array<
        | {
            type: 'text'
            text: string
          }
        | {
            type: 'image'
            source: {
              type: 'base64'
              media_type: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif'
              data: string
            }
          }
      >
}

/**
 * Google Gemini content part
 */
export interface GeminiContentPart {
  text?: string
  inlineData?: {
    mimeType: string
    data: string
  }
}

/**
 * Google Gemini message format
 */
export interface GeminiMultimodalMessage {
  role: 'user' | 'model'
  parts: GeminiContentPart[]
}

// ============================================================================
// Conversion Utilities
// ============================================================================

/**
 * Convert unified format to OpenAI format
 */
export function toOpenAIFormat(message: MultimodalMessage): OpenAIMultimodalMessage {
  if (typeof message.content === 'string') {
    return {
      role: message.role,
      content: message.content,
    }
  }

  const content = message.content.map((block) => {
    switch (block.type) {
      case 'text':
        return {
          type: 'text' as const,
          text: block.text,
        }

      case 'image_url':
        return {
          type: 'image_url' as const,
          image_url: {
            url: block.image_url.url,
            detail: block.image_url.detail || 'auto',
          },
        }

      case 'image':
        // Convert base64 image to data URL
        const dataURL = `data:${block.source.media_type};base64,${block.source.data}`
        return {
          type: 'image_url' as const,
          image_url: {
            url: dataURL,
            detail: block.detail || 'auto',
          },
        }

      default:
        throw new Error(`Unsupported content type: ${(block as any).type}`)
    }
  })

  return {
    role: message.role,
    content,
  }
}

/**
 * Convert unified format to Anthropic format
 */
export function toAnthropicFormat(message: MultimodalMessage): AnthropicMultimodalMessage {
  if (message.role === 'system') {
    // Anthropic handles system messages separately
    throw new Error('System messages should be passed as system parameter, not in messages array')
  }

  if (typeof message.content === 'string') {
    return {
      role: message.role,
      content: message.content,
    }
  }

  const content = message.content.map((block) => {
    switch (block.type) {
      case 'text':
        return {
          type: 'text' as const,
          text: block.text,
        }

      case 'image':
        return {
          type: 'image' as const,
          source: block.source,
        }

      case 'image_url':
        // Anthropic doesn't support URLs directly - would need to fetch and convert
        throw new Error(
          'Image URLs not supported in Anthropic format. Convert to base64 first.'
        )

      default:
        throw new Error(`Unsupported content type: ${(block as any).type}`)
    }
  })

  return {
    role: message.role,
    content,
  }
}

/**
 * Convert unified format to Google Gemini format
 */
export function toGeminiFormat(message: MultimodalMessage): GeminiMultimodalMessage {
  const role = message.role === 'assistant' ? 'model' : 'user'

  if (typeof message.content === 'string') {
    return {
      role,
      parts: [{ text: message.content }],
    }
  }

  const parts = message.content.map((block): GeminiContentPart => {
    switch (block.type) {
      case 'text':
        return { text: block.text }

      case 'image':
        return {
          inlineData: {
            mimeType: block.source.media_type,
            data: block.source.data,
          },
        }

      case 'image_url':
        // Gemini doesn't support URLs directly
        throw new Error('Image URLs not supported in Gemini format. Convert to base64 first.')

      default:
        throw new Error(`Unsupported content type: ${(block as any).type}`)
    }
  })

  return {
    role,
    parts,
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Count images in a message
 */
export function countImages(message: MultimodalMessage): number {
  if (typeof message.content === 'string') {
    return 0
  }

  return message.content.filter((block) => block.type === 'image' || block.type === 'image_url')
    .length
}

/**
 * Extract text from multimodal message
 */
export function extractText(message: MultimodalMessage): string {
  if (typeof message.content === 'string') {
    return message.content
  }

  return message.content
    .filter((block) => block.type === 'text')
    .map((block) => (block as TextContent).text)
    .join('\n')
}

/**
 * Extract images from multimodal message
 */
export function extractImages(
  message: MultimodalMessage
): Array<ImageContent | ImageURLContent> {
  if (typeof message.content === 'string') {
    return []
  }

  return message.content.filter(
    (block) => block.type === 'image' || block.type === 'image_url'
  ) as Array<ImageContent | ImageURLContent>
}

/**
 * Check if message contains images
 */
export function hasImages(message: MultimodalMessage): boolean {
  return countImages(message) > 0
}

/**
 * Check if message is text-only
 */
export function isTextOnly(message: MultimodalMessage): boolean {
  return typeof message.content === 'string' || countImages(message) === 0
}

/**
 * Create text-only message
 */
export function createTextMessage(role: MultimodalMessage['role'], text: string): MultimodalMessage {
  return {
    role,
    content: text,
  }
}

/**
 * Create message with text and images
 */
export function createMultimodalMessage(
  role: MultimodalMessage['role'],
  text: string,
  images: Array<ImageContent | ImageURLContent>
): MultimodalMessage {
  return {
    role,
    content: [
      { type: 'text', text },
      ...images,
    ],
  }
}

/**
 * Add image to existing message
 */
export function addImageToMessage(
  message: MultimodalMessage,
  image: ImageContent | ImageURLContent
): MultimodalMessage {
  if (typeof message.content === 'string') {
    // Convert string to content array
    return {
      ...message,
      content: [
        { type: 'text', text: message.content },
        image,
      ],
    }
  }

  return {
    ...message,
    content: [...message.content, image],
  }
}

/**
 * Remove images from message
 */
export function removeImagesFromMessage(message: MultimodalMessage): MultimodalMessage {
  if (typeof message.content === 'string') {
    return message
  }

  const textBlocks = message.content.filter((block) => block.type === 'text')

  if (textBlocks.length === 0) {
    return {
      ...message,
      content: '',
    }
  }

  if (textBlocks.length === 1) {
    return {
      ...message,
      content: (textBlocks[0] as TextContent).text,
    }
  }

  return {
    ...message,
    content: textBlocks,
  }
}

/**
 * Create image content from base64
 */
export function createImageContent(
  base64Data: string,
  mediaType: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif' = 'image/jpeg',
  dimensions?: ImageDimensions,
  detail?: ImageDetail
): ImageContent {
  return {
    type: 'image',
    source: {
      type: 'base64',
      media_type: mediaType,
      data: base64Data,
    },
    dimensions,
    detail,
  }
}

/**
 * Create image URL content
 */
export function createImageURLContent(
  url: string,
  dimensions?: ImageDimensions,
  detail?: ImageDetail
): ImageURLContent {
  return {
    type: 'image_url',
    image_url: {
      url,
      detail,
    },
    dimensions,
  }
}

// ============================================================================
// Validation
// ============================================================================

/**
 * Validate multimodal message
 */
export function validateMultimodalMessage(message: MultimodalMessage): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // Validate role
  if (!['system', 'user', 'assistant'].includes(message.role)) {
    errors.push(`Invalid role: ${message.role}`)
  }

  // Validate content
  if (typeof message.content === 'string') {
    if (message.content.length === 0) {
      errors.push('Empty content string')
    }
  } else if (Array.isArray(message.content)) {
    if (message.content.length === 0) {
      errors.push('Empty content array')
    }

    for (let i = 0; i < message.content.length; i++) {
      const block = message.content[i]

      switch (block.type) {
        case 'text':
          if (!block.text || block.text.length === 0) {
            errors.push(`Text block ${i} has empty text`)
          }
          break

        case 'image':
          if (!block.source || !block.source.data) {
            errors.push(`Image block ${i} missing source data`)
          }
          if (!block.source.media_type) {
            errors.push(`Image block ${i} missing media type`)
          }
          break

        case 'image_url':
          if (!block.image_url || !block.image_url.url) {
            errors.push(`Image URL block ${i} missing URL`)
          }
          break

        default:
          errors.push(`Block ${i} has unsupported type: ${(block as any).type}`)
      }
    }
  } else {
    errors.push('Content must be string or array')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
