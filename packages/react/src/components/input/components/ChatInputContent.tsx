/**
 * ChatInputContent Component
 *
 * Content layout for PillChatInput including textarea, buttons, and slots.
 * Handles the internal flex layout and conditional rendering.
 */

import * as React from 'react'
import { AnimatePresence } from 'framer-motion'
import { AutoResizeTextarea } from './AutoResizeTextarea'
import { ChatActionButton } from './ChatActionButton'

export interface ChatInputContentProps {
  // Textarea props
  textareaRef: React.RefObject<HTMLTextAreaElement>
  id?: string
  value: string
  onChange: (value: string) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  onFocus: () => void
  onBlur: () => void
  placeholder: string
  disabled: boolean
  isSubmitting: boolean
  maxLength?: number
  minRows: number
  maxRows: number
  textareaClasses: string
  ariaLabel: string
  showCharCounter: boolean

  // Action button props
  isGenerating: boolean
  canSubmit: boolean
  onStop?: () => void
  onSubmit: () => void
  buttonClasses: string
  iconSize: number
  disableAnimations: boolean

  // Slots
  leftSlot?: React.ReactNode
  rightSlot?: React.ReactNode
  renderAttachment: () => React.ReactNode
}

/**
 * ChatInputContent - Internal content layout
 *
 * Handles the flex layout and conditional rendering of input elements.
 */
export const ChatInputContent = React.memo(function ChatInputContent({
  textareaRef,
  id,
  value,
  onChange,
  onKeyDown,
  onFocus,
  onBlur,
  placeholder,
  disabled,
  isSubmitting,
  maxLength,
  minRows,
  maxRows,
  textareaClasses,
  ariaLabel,
  showCharCounter,
  isGenerating,
  canSubmit,
  onStop,
  onSubmit,
  buttonClasses,
  iconSize,
  disableAnimations,
  rightSlot,
  renderAttachment,
}: ChatInputContentProps) {
  return (
    <div className="flex items-end gap-2">
      {/* Left slot (attachment button) */}
      {renderAttachment()}

      {/* Textarea */}
      <div className="flex-1 min-w-0">
        <AutoResizeTextarea
          ref={textareaRef}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled || isSubmitting}
          maxLength={maxLength}
          minRows={minRows}
          maxRows={maxRows}
          className={textareaClasses}
          aria-label={ariaLabel}
          aria-describedby={showCharCounter ? `${id}-counter` : undefined}
        />
      </div>

      {/* Action button */}
      <div className="flex-shrink-0 pb-0.5">
        <AnimatePresence mode="wait">
          <ChatActionButton
            isGenerating={isGenerating}
            canSubmit={canSubmit}
            isSubmitting={isSubmitting}
            onStop={onStop}
            onSubmit={onSubmit}
            buttonClasses={buttonClasses}
            iconSize={iconSize}
            disableAnimations={disableAnimations}
          />
        </AnimatePresence>
      </div>

      {/* Right slot */}
      {rightSlot && <div className="flex-shrink-0 pb-0.5">{rightSlot}</div>}
    </div>
  )
})

ChatInputContent.displayName = 'ChatInputContent'
