'use client'

/**
 * PillChatInput Component
 *
 * Modern, pill-shaped chat input with a clean, floating design.
 * Inspired by modern AI chat interfaces like Claude, ChatGPT, and prompt-kit.
 *
 * Features:
 * - Pill-shaped container with rounded corners
 * - Floating appearance with subtle shadow
 * - Auto-resizing textarea
 * - Send button integrated into the design
 * - Attachment button support
 * - Stop generation button
 * - Character counter
 * - Focus states with glow effect
 * - Fully accessible
 *
 * @example
 * ```tsx
 * // Basic usage
 * <PillChatInput
 *   value={input}
 *   onChange={setInput}
 *   onSubmit={handleSubmit}
 * />
 *
 * // With streaming control
 * <PillChatInput
 *   value={input}
 *   onChange={setInput}
 *   onSubmit={handleSubmit}
 *   isGenerating={isStreaming}
 *   onStop={stopGeneration}
 * />
 *
 * // With attachments
 * <PillChatInput
 *   value={input}
 *   onChange={setInput}
 *   onSubmit={handleSubmit}
 *   onAttach={handleAttachment}
 * />
 * ```
 *
 * @packageDocumentation
 */

import * as React from 'react'
import { cn, useReducedMotion } from '@clarity-chat/primitives'
import {
  useAttachments,
  useChatInputKeyboard,
  useChatInputSubmit,
  useChatInputCharCount,
  useChatInputFocus,
  useChatInputAnimation,
} from './hooks'
import {
  ChatCharCounter,
  ChatInputContainer,
  ChatInputContent,
} from './components'

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

/**
 * Size variants
 */
export type PillChatInputSize = 'sm' | 'md' | 'lg'

/**
 * Props for PillChatInput
 */
export interface PillChatInputProps {
  /** Current value (controlled) */
  value: string
  /** Value change handler */
  onChange: (value: string) => void
  /** Submit handler (Enter key or button) */
  onSubmit: (value: string) => void | Promise<void>
  /** Placeholder text */
  placeholder?: string
  /** Whether input is disabled */
  disabled?: boolean
  /** Whether AI is currently generating */
  isGenerating?: boolean
  /** Stop generation handler */
  onStop?: () => void
  /** Attachment handler */
  onAttach?: () => void
  /** Maximum character length */
  maxLength?: number
  /** Show character counter */
  showCharCounter?: boolean
  /** Size variant */
  size?: PillChatInputSize
  /** Auto-focus on mount */
  autoFocus?: boolean
  /** Minimum rows */
  minRows?: number
  /** Maximum rows (before scrolling) */
  maxRows?: number
  /** Additional CSS class */
  className?: string
  /** ID for the input element */
  id?: string
  /** ARIA label */
  'aria-label'?: string
  /** Disable animations */
  disableAnimations?: boolean
  /** Left slot (before textarea) */
  leftSlot?: React.ReactNode
  /** Right slot (after send button) */
  rightSlot?: React.ReactNode
}

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * Size configurations
 */
const SIZE_CONFIG: Record<PillChatInputSize, {
  container: string
  textarea: string
  button: string
  iconSize: number
}> = {
  sm: {
    container: 'chat-input-pill px-3 py-2',
    textarea: 'text-sm min-h-[32px]',
    button: 'w-7 h-7',
    iconSize: 14,
  },
  md: {
    container: 'chat-input-pill px-4 py-3',
    textarea: 'text-base min-h-[40px]',
    button: 'w-9 h-9',
    iconSize: 18,
  },
  lg: {
    container: 'chat-input-pill px-5 py-4',
    textarea: 'text-lg min-h-[48px]',
    button: 'w-11 h-11',
    iconSize: 22,
  },
}

// =============================================================================
// ICONS
// =============================================================================

// Icons moved to components/ChatActionButton.tsx and hooks/useAttachments.ts
// AutoResizeTextarea moved to components/AutoResizeTextarea.tsx

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * PillChatInput - Modern pill-shaped chat input
 *
 * A clean, modern chat input with a floating pill design. Integrates
 * seamlessly with the CSS classes defined in globals.css.
 */
export function PillChatInput({
  value,
  onChange,
  onSubmit,
  placeholder = 'Message...',
  disabled = false,
  isGenerating = false,
  onStop,
  onAttach,
  maxLength,
  showCharCounter = false,
  size = 'md',
  autoFocus = false,
  minRows = 1,
  maxRows = 5,
  className,
  id,
  'aria-label': ariaLabel = 'Chat input',
  disableAnimations = false,
  leftSlot,
  rightSlot,
}: PillChatInputProps) {
  const prefersReducedMotion = useReducedMotion() || disableAnimations
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const sizeConfig = SIZE_CONFIG[size]

  // Character count and validation
  const { charCount, isOverLimit, isNearLimit } = useChatInputCharCount({
    value,
    maxLength,
  })

  // Submission logic
  const { isSubmitting, canSubmit, handleSubmit } = useChatInputSubmit({
    value,
    onSubmit,
    disabled,
    maxLength,
  })

  // Focus management
  const { isFocused, handleFocus, handleBlur } = useChatInputFocus({
    autoFocus,
    textareaRef,
  })

  // Keyboard interactions
  const { handleKeyDown } = useChatInputKeyboard({
    isGenerating,
    onStop,
    onSubmit: handleSubmit,
    canSubmit,
  })

  // Attachment button
  const { renderAttachment } = useAttachments({
    leftSlot,
    onAttach,
    buttonClasses: sizeConfig.button,
    iconSize: sizeConfig.iconSize,
  })

  // Animation state
  const { containerAnimation } = useChatInputAnimation({
    isFocused,
    disableAnimations: prefersReducedMotion,
  })

  return (
    <div className={cn('relative', className)}>
      {/* Main container */}
      <ChatInputContainer
        prefersReducedMotion={prefersReducedMotion}
        containerClasses={sizeConfig.container}
        isFocused={isFocused}
        disabled={disabled}
        containerAnimation={containerAnimation}
      >
        <ChatInputContent
          textareaRef={textareaRef}
          id={id}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          isSubmitting={isSubmitting}
          maxLength={maxLength}
          minRows={minRows}
          maxRows={maxRows}
          textareaClasses={sizeConfig.textarea}
          ariaLabel={ariaLabel}
          showCharCounter={showCharCounter}
          isGenerating={isGenerating}
          canSubmit={canSubmit}
          onStop={onStop}
          onSubmit={handleSubmit}
          buttonClasses={sizeConfig.button}
          iconSize={sizeConfig.iconSize}
          disableAnimations={prefersReducedMotion}
          rightSlot={rightSlot}
          renderAttachment={renderAttachment}
        />
      </ChatInputContainer>

      {/* Character counter */}
      {showCharCounter && maxLength && (
        <ChatCharCounter
          id={`${id}-counter`}
          charCount={charCount}
          maxLength={maxLength}
          isOverLimit={isOverLimit}
          isNearLimit={isNearLimit}
        />
      )}
    </div>
  )
}

PillChatInput.displayName = 'PillChatInput'

// =============================================================================
// HOOK
// =============================================================================

/**
 * Hook for managing PillChatInput state
 */
export interface UsePillChatInputOptions {
  /** Initial value */
  initialValue?: string
  /** Clear on submit */
  clearOnSubmit?: boolean
  /** Submit handler */
  onSubmit?: (value: string) => void | Promise<void>
}

export interface UsePillChatInputReturn {
  /** Current value */
  value: string
  /** Set value */
  setValue: (value: string) => void
  /** Clear value */
  clear: () => void
  /** Handle submit */
  handleSubmit: (value: string) => Promise<void>
  /** Props for PillChatInput */
  inputProps: {
    value: string
    onChange: (value: string) => void
    onSubmit: (value: string) => void | Promise<void>
  }
}

export function usePillChatInput({
  initialValue = '',
  clearOnSubmit = true,
  onSubmit,
}: UsePillChatInputOptions = {}): UsePillChatInputReturn {
  const [value, setValue] = React.useState(initialValue)

  const clear = React.useCallback(() => {
    setValue('')
  }, [])

  const handleSubmit = React.useCallback(
    async (val: string) => {
      if (onSubmit) {
        await onSubmit(val)
      }
      if (clearOnSubmit) {
        clear()
      }
    },
    [onSubmit, clearOnSubmit, clear]
  )

  return {
    value,
    setValue,
    clear,
    handleSubmit,
    inputProps: {
      value,
      onChange: setValue,
      onSubmit: handleSubmit,
    },
  }
}
