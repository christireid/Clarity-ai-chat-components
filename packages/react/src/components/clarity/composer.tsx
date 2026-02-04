'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Textarea } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@clarity-chat/primitives'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@clarity-chat/primitives'
import {
  Send,
  Square,
  Mic,
  MicOff,
  Paperclip,
  X,
  ChevronUp,
  ChevronDown,
  Sparkles,
  ImageIcon,
  FileText,
  Globe,
  AtSign,
  Hash,
  Loader2,
} from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

export interface ComposerSlot {
  type: 'text' | 'input' | 'select' | 'tag' | 'mention' | 'custom'
  key: string
  value?: string
  label?: React.ReactNode
  placeholder?: string
  options?: { label: string; value: string }[]
  icon?: React.ReactNode
  color?: string
  removable?: boolean
  customRender?: (
    value: any,
    onChange: (value: any) => void,
    props: { disabled?: boolean; readOnly?: boolean }
  ) => React.ReactNode
}

export interface ComposerSkill {
  key: string
  label: React.ReactNode
  icon?: React.ReactNode
  description?: string
  closable?: boolean
}

export interface ComposerProps {
  value?: string
  defaultValue?: string
  onChange?: (
    value: string,
    slots?: ComposerSlot[],
    skill?: ComposerSkill | null
  ) => void
  onSubmit?: (
    value: string,
    slots?: ComposerSlot[],
    skill?: ComposerSkill | null
  ) => void
  onCancel?: () => void
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  loading?: boolean
  autoFocus?: boolean
  maxLength?: number
  minRows?: number
  maxRows?: number
  submitOnEnter?: boolean
  submitType?: 'enter' | 'shiftEnter' | 'ctrlEnter'

  // Slots and Skills
  slots?: ComposerSlot[]
  skill?: ComposerSkill | null
  onSkillChange?: (skill: ComposerSkill | null) => void

  // Header panel
  header?: React.ReactNode
  headerOpen?: boolean
  onHeaderOpenChange?: (open: boolean) => void
  headerTitle?: React.ReactNode

  // Prefix/Suffix
  prefix?: React.ReactNode
  suffix?: React.ReactNode | false
  footer?: React.ReactNode

  // Features
  allowSpeech?:
    | boolean
    | { recording?: boolean; onRecordingChange?: (recording: boolean) => void }
  allowAttachments?: boolean
  onAttachmentClick?: () => void
  attachments?: { name: string; type: string; size?: number }[]
  onAttachmentRemove?: (index: number) => void

  // Quick actions
  quickActions?: {
    key: string
    icon: React.ReactNode
    label: string
    onClick: () => void
  }[]

  // Mentions
  mentionTrigger?: string
  onMentionSearch?: (query: string) => void
  mentionSuggestions?: { key: string; label: string; icon?: React.ReactNode }[]
  onMentionSelect?: (mention: { key: string; label: string }) => void

  // Styling
  variant?: 'default' | 'minimal' | 'bordered' | 'floating'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  classNames?: {
    root?: string
    input?: string
    header?: string
    footer?: string
    prefix?: string
    suffix?: string
  }
}

export interface ComposerRef {
  focus: (options?: { cursor?: 'start' | 'end' | 'all' }) => void
  blur: () => void
  clear: () => void
  insert: (text: string, position?: 'start' | 'end' | 'cursor') => void
  getValue: () => {
    value: string
    slots: ComposerSlot[]
    skill: ComposerSkill | null
  }
  inputElement: HTMLTextAreaElement | null
  nativeElement: HTMLDivElement | null
}

// ============================================================================
// COMPOSER HEADER
// ============================================================================

export interface ComposerHeaderProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title?: React.ReactNode
  closable?: boolean
  children?: React.ReactNode
  className?: string
}

export function ComposerHeader({
  open = false,
  onOpenChange,
  title,
  closable = true,
  children,
  className,
}: ComposerHeaderProps) {
  return (
    <Collapsible open={open} onOpenChange={onOpenChange}>
      <div className={cn('border-b border-border', className)}>
        <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-sm hover:bg-muted/50 transition-colors">
          <span className="font-medium">{title}</span>
          <div className="flex items-center gap-2">
            {open ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-3 py-3 border-t border-border bg-muted/30">
            {children}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

// ============================================================================
// COMPOSER SWITCH
// ============================================================================

export interface ComposerSwitchProps {
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  icon?: React.ReactNode
  checkedChildren?: React.ReactNode
  unCheckedChildren?: React.ReactNode
  children?: React.ReactNode
  disabled?: boolean
  loading?: boolean
  className?: string
}

export function ComposerSwitch({
  checked,
  defaultChecked = false,
  onChange,
  icon,
  checkedChildren,
  unCheckedChildren,
  children,
  disabled = false,
  loading = false,
  className,
}: ComposerSwitchProps) {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked)
  const isChecked = checked ?? internalChecked

  const handleClick = () => {
    if (disabled || loading) return
    const newChecked = !isChecked
    setInternalChecked(newChecked)
    onChange?.(newChecked)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-colors',
        isChecked
          ? 'bg-primary/10 text-primary hover:bg-primary/15'
          : 'bg-muted text-muted-foreground hover:bg-muted/80',
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        icon && <span className="w-3.5 h-3.5">{icon}</span>
      )}
      {isChecked ? checkedChildren : unCheckedChildren}
      {children}
    </button>
  )
}

// ============================================================================
// COMPOSER SKILL TAG
// ============================================================================

interface SkillTagProps {
  skill: ComposerSkill
  onRemove?: () => void
  disabled?: boolean
}

function SkillTag({ skill, onRemove, disabled }: SkillTagProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        'gap-1.5 pr-1 bg-primary/10 text-primary border-primary/20',
        disabled && 'opacity-50'
      )}
    >
      {skill.icon && <span className="w-3 h-3">{skill.icon}</span>}
      {skill.label}
      {skill.closable !== false && onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="ml-0.5 hover:bg-primary/20 rounded p-0.5 transition-colors"
          disabled={disabled}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </Badge>
  )
}

// ============================================================================
// COMPOSER
// ============================================================================

export const Composer = React.forwardRef<ComposerRef, ComposerProps>(
  (
    {
      value,
      defaultValue = '',
      onChange,
      onSubmit,
      onCancel,
      placeholder = 'Type a message...',
      disabled = false,
      readOnly = false,
      loading = false,
      autoFocus = false,
      maxLength,
      minRows = 1,
      maxRows = 8,
      submitOnEnter = true,
      submitType = 'enter',
      slots = [],
      skill,
      onSkillChange,
      header,
      headerOpen,
      onHeaderOpenChange,
      headerTitle,
      prefix,
      suffix,
      footer,
      allowSpeech = false,
      allowAttachments = false,
      onAttachmentClick,
      attachments = [],
      onAttachmentRemove,
      quickActions = [],
      variant = 'default',
      size = 'md',
      className,
      classNames,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue)
    const [isRecording, setIsRecording] = React.useState(false)
    const [internalHeaderOpen, setInternalHeaderOpen] = React.useState(false)
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)
    const containerRef = React.useRef<HTMLDivElement>(null)

    const currentValue = value ?? internalValue
    const currentHeaderOpen = headerOpen ?? internalHeaderOpen

    // Speech config
    const speechConfig = typeof allowSpeech === 'object' ? allowSpeech : {}
    const speechRecording = speechConfig.recording ?? isRecording

    // Expose ref methods
    React.useImperativeHandle(ref, () => ({
      focus: (options) => {
        textareaRef.current?.focus()
        if (options?.cursor === 'end') {
          const len = textareaRef.current?.value.length || 0
          textareaRef.current?.setSelectionRange(len, len)
        } else if (options?.cursor === 'start') {
          textareaRef.current?.setSelectionRange(0, 0)
        } else if (options?.cursor === 'all') {
          textareaRef.current?.select()
        }
      },
      blur: () => textareaRef.current?.blur(),
      clear: () => {
        setInternalValue('')
        onChange?.('', slots, skill)
      },
      insert: (text, position = 'cursor') => {
        const textarea = textareaRef.current
        if (!textarea) return

        let newValue = currentValue
        if (position === 'start') {
          newValue = text + currentValue
        } else if (position === 'end') {
          newValue = currentValue + text
        } else {
          const start = textarea.selectionStart
          const end = textarea.selectionEnd
          newValue =
            currentValue.slice(0, start) + text + currentValue.slice(end)
        }

        setInternalValue(newValue)
        onChange?.(newValue, slots, skill)
      },
      getValue: () => ({ value: currentValue, slots, skill: skill || null }),
      inputElement: textareaRef.current,
      nativeElement: containerRef.current,
    }))

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value
      setInternalValue(newValue)
      onChange?.(newValue, slots, skill)
    }

    const handleSubmit = () => {
      if (disabled || loading || !currentValue.trim()) return
      onSubmit?.(currentValue.trim(), slots, skill)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (disabled || loading) return

      const isEnter = e.key === 'Enter'
      const hasShift = e.shiftKey
      const hasCtrl = e.ctrlKey || e.metaKey

      if (isEnter) {
        if (submitType === 'enter' && !hasShift && !hasCtrl) {
          e.preventDefault()
          handleSubmit()
        } else if (submitType === 'shiftEnter' && hasShift) {
          e.preventDefault()
          handleSubmit()
        } else if (submitType === 'ctrlEnter' && hasCtrl) {
          e.preventDefault()
          handleSubmit()
        }
      }
    }

    const handleSpeechToggle = () => {
      const newRecording = !speechRecording
      setIsRecording(newRecording)
      speechConfig.onRecordingChange?.(newRecording)
    }

    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    }

    const variantClasses = {
      default: 'bg-background border border-input rounded-xl shadow-sm',
      minimal: 'bg-transparent',
      bordered: 'bg-background border-2 border-input rounded-xl',
      floating:
        'bg-background/95 backdrop-blur-sm border border-input rounded-2xl shadow-lg',
    }

    return (
      <TooltipProvider>
        <div
          ref={containerRef}
          className={cn(
            'flex flex-col',
            variantClasses[variant],
            disabled && 'opacity-50 pointer-events-none',
            className,
            classNames?.root
          )}
        >
          {/* Header Panel */}
          {header && (
            <ComposerHeader
              open={currentHeaderOpen}
              onOpenChange={(open) => {
                setInternalHeaderOpen(open)
                onHeaderOpenChange?.(open)
              }}
              title={headerTitle}
              className={classNames?.header}
            >
              {header}
            </ComposerHeader>
          )}

          {/* Attachments Preview */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 px-3 pt-3">
              {attachments.map((attachment, index) => (
                <Badge key={index} variant="secondary" className="gap-1.5 pr-1">
                  <FileText className="w-3 h-3" />
                  <span className="max-w-[120px] truncate">
                    {attachment.name}
                  </span>
                  {onAttachmentRemove && (
                    <button
                      type="button"
                      onClick={() => onAttachmentRemove(index)}
                      className="ml-0.5 hover:bg-muted rounded p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
          )}

          {/* Skill Tag */}
          {skill && (
            <div className="px-3 pt-3">
              <SkillTag
                skill={skill}
                onRemove={() => onSkillChange?.(null)}
                disabled={disabled}
              />
            </div>
          )}

          {/* Main Input Area */}
          <div className="flex items-end gap-2 p-3">
            {/* Prefix */}
            {prefix && (
              <div
                className={cn('flex items-center gap-1', classNames?.prefix)}
              >
                {prefix}
              </div>
            )}

            {/* Quick Actions */}
            {quickActions.length > 0 && (
              <div className="flex items-center gap-1">
                {quickActions.map((action) => (
                  <Tooltip key={action.key}>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={action.onClick}
                        disabled={disabled}
                      >
                        {action.icon}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">{action.label}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            )}

            {/* Attachment Button */}
            {allowAttachments && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={onAttachmentClick}
                    disabled={disabled}
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Attach files</TooltipContent>
              </Tooltip>
            )}

            {/* Textarea */}
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={currentValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readOnly}
                autoFocus={autoFocus}
                maxLength={maxLength}
                rows={minRows}
                className={cn(
                  'resize-none border-0 bg-transparent p-0 focus-visible:ring-0 shadow-none',
                  sizeClasses[size],
                  classNames?.input
                )}
                style={{
                  minHeight: `${minRows * 1.5}em`,
                  maxHeight: `${maxRows * 1.5}em`,
                }}
              />
            </div>

            {/* Suffix Actions */}
            {suffix !== false && (
              <div
                className={cn('flex items-center gap-1', classNames?.suffix)}
              >
                {suffix || (
                  <>
                    {/* Speech Button */}
                    {allowSpeech && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant={speechRecording ? 'destructive' : 'ghost'}
                            size="icon"
                            className="h-8 w-8"
                            onClick={handleSpeechToggle}
                            disabled={disabled}
                          >
                            {speechRecording ? (
                              <MicOff className="w-4 h-4" />
                            ) : (
                              <Mic className="w-4 h-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          {speechRecording ? 'Stop recording' : 'Voice input'}
                        </TooltipContent>
                      </Tooltip>
                    )}

                    {/* Submit/Cancel Button */}
                    {loading ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={onCancel}
                          >
                            <Square className="w-4 h-4 fill-current" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          Stop generating
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            size="icon"
                            className="h-8 w-8"
                            onClick={handleSubmit}
                            disabled={disabled || !currentValue.trim()}
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          Send{' '}
                          <kbd className="ml-1 text-xs bg-muted px-1 rounded">
                            {submitType === 'enter'
                              ? 'Enter'
                              : submitType === 'shiftEnter'
                                ? 'Shift+Enter'
                                : 'Ctrl+Enter'}
                          </kbd>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {footer && (
            <div className={cn('px-3 pb-3 pt-1', classNames?.footer)}>
              {footer}
            </div>
          )}
        </div>
      </TooltipProvider>
    )
  }
)

Composer.displayName = 'Composer'

// ============================================================================
// PREBUILT COMPOSER VARIANTS
// ============================================================================

export interface SimpleComposerProps {
  onSubmit: (message: string) => void
  loading?: boolean
  onCancel?: () => void
  placeholder?: string
  className?: string
}

export function SimpleComposer({
  onSubmit,
  loading,
  onCancel,
  placeholder,
  className,
}: SimpleComposerProps) {
  const [value, setValue] = React.useState('')

  const handleSubmit = (message: string) => {
    onSubmit(message)
    setValue('')
  }

  return (
    <Composer
      value={value}
      onChange={setValue}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      loading={loading}
      placeholder={placeholder}
      className={className}
    />
  )
}

export interface AgentComposerProps extends Omit<
  ComposerProps,
  'quickActions'
> {
  onImageUpload?: () => void
  onWebSearch?: () => void
  onMention?: () => void
  deepThinking?: boolean
  onDeepThinkingChange?: (enabled: boolean) => void
}

export function AgentComposer({
  onImageUpload,
  onWebSearch,
  onMention,
  deepThinking = false,
  onDeepThinkingChange,
  footer,
  ...props
}: AgentComposerProps) {
  const quickActions = [
    onImageUpload && {
      key: 'image',
      icon: <ImageIcon className="w-4 h-4" />,
      label: 'Upload image',
      onClick: onImageUpload,
    },
    onWebSearch && {
      key: 'search',
      icon: <Globe className="w-4 h-4" />,
      label: 'Web search',
      onClick: onWebSearch,
    },
    onMention && {
      key: 'mention',
      icon: <AtSign className="w-4 h-4" />,
      label: 'Mention',
      onClick: onMention,
    },
  ].filter(Boolean) as ComposerProps['quickActions']

  return (
    <Composer
      {...props}
      quickActions={quickActions}
      footer={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onDeepThinkingChange && (
              <ComposerSwitch
                icon={<Sparkles className="w-3.5 h-3.5" />}
                checked={deepThinking}
                onChange={onDeepThinkingChange}
                checkedChildren="Deep thinking: on"
                unCheckedChildren="Deep thinking: off"
              />
            )}
          </div>
          {footer}
        </div>
      }
    />
  )
}

export default Composer
