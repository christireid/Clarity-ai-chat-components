'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'
import { Languages, ChevronDown, Check, Loader2, RotateCcw } from 'lucide-react'

// =============================================================================
// TYPES
// =============================================================================

export interface Language {
  code: string
  name: string
  nativeName: string
  flag?: string
}

export const COMMON_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
]

// =============================================================================
// TRANSLATION INDICATOR
// =============================================================================

interface TranslationIndicatorProps {
  originalLanguage: string
  translatedLanguage: string
  onShowOriginal?: () => void
  className?: string
}

export function TranslationIndicator({
  originalLanguage,
  translatedLanguage,
  onShowOriginal,
  className,
}: TranslationIndicatorProps) {
  const origLang = COMMON_LANGUAGES.find((l) => l.code === originalLanguage)
  const transLang = COMMON_LANGUAGES.find((l) => l.code === translatedLanguage)

  return (
    <div
      className={cn(
        'flex items-center gap-2 text-xs text-muted-foreground py-1',
        className
      )}
    >
      <Languages className="h-3 w-3" />
      <span>
        Translated from {origLang?.name || originalLanguage} to{' '}
        {transLang?.name || translatedLanguage}
      </span>
      {onShowOriginal && (
        <button
          onClick={onShowOriginal}
          className="text-primary hover:underline"
        >
          Show original
        </button>
      )}
    </div>
  )
}

// =============================================================================
// LANGUAGE SELECTOR
// =============================================================================

interface LanguageSelectorProps {
  value: string
  onChange: (code: string) => void
  languages?: Language[]
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function LanguageSelector({
  value,
  onChange,
  languages = COMMON_LANGUAGES,
  placeholder = 'Select language',
  disabled = false,
  className,
}: LanguageSelectorProps) {
  const selected = languages.find((l) => l.code === value)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn('justify-between', className)}
        >
          {selected ? (
            <span className="flex items-center gap-2">
              {selected.flag && <span>{selected.flag}</span>}
              {selected.name}
            </span>
          ) : (
            placeholder
          )}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-60 overflow-auto">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => onChange(lang.code)}
            className="flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              {lang.flag && <span>{lang.flag}</span>}
              <span>{lang.name}</span>
              <span className="text-muted-foreground text-xs">
                ({lang.nativeName})
              </span>
            </span>
            {value === lang.code && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// =============================================================================
// TRANSLATE BUTTON
// =============================================================================

interface TranslateButtonProps {
  onTranslate: (targetLanguage: string) => void
  isTranslating?: boolean
  isTranslated?: boolean
  onShowOriginal?: () => void
  languages?: Language[]
  className?: string
}

export function TranslateButton({
  onTranslate,
  isTranslating = false,
  isTranslated = false,
  onShowOriginal,
  languages = COMMON_LANGUAGES,
  className,
}: TranslateButtonProps) {
  if (isTranslated && onShowOriginal) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={onShowOriginal}
        className={cn('h-7 text-xs', className)}
      >
        <RotateCcw className="h-3 w-3 mr-1" />
        Show original
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={isTranslating}
          className={cn('h-7 text-xs', className)}
        >
          {isTranslating ? (
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          ) : (
            <Languages className="h-3 w-3 mr-1" />
          )}
          Translate
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-60 overflow-auto">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => onTranslate(lang.code)}
          >
            <span className="flex items-center gap-2">
              {lang.flag && <span>{lang.flag}</span>}
              {lang.name}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// =============================================================================
// AUTO TRANSLATE MESSAGE
// =============================================================================

interface AutoTranslateMessageProps {
  originalContent: string
  translatedContent?: string
  originalLanguage?: string
  targetLanguage?: string
  isTranslating?: boolean
  onTranslate?: (targetLanguage: string) => void
  onShowOriginal?: () => void
  autoDetect?: boolean
  className?: string
}

export function AutoTranslateMessage({
  originalContent,
  translatedContent,
  originalLanguage,
  targetLanguage,
  isTranslating = false,
  onTranslate,
  onShowOriginal,
  autoDetect = true,
  className,
}: AutoTranslateMessageProps) {
  const [showingOriginal, setShowingOriginal] = React.useState(false)
  const displayContent =
    showingOriginal || !translatedContent ? originalContent : translatedContent

  const handleShowOriginal = () => {
    setShowingOriginal(true)
    onShowOriginal?.()
  }

  const handleTranslate = (lang: string) => {
    setShowingOriginal(false)
    onTranslate?.(lang)
  }

  return (
    <div className={cn('space-y-1', className)}>
      <div className="whitespace-pre-wrap">{displayContent}</div>
      {isTranslating && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Translating...</span>
        </div>
      )}
      {translatedContent &&
        !isTranslating &&
        originalLanguage &&
        targetLanguage && (
          <TranslationIndicator
            originalLanguage={originalLanguage}
            translatedLanguage={targetLanguage}
            onShowOriginal={showingOriginal ? undefined : handleShowOriginal}
          />
        )}
      {!translatedContent && !isTranslating && onTranslate && (
        <TranslateButton
          onTranslate={handleTranslate}
          isTranslated={!!translatedContent && !showingOriginal}
          onShowOriginal={
            translatedContent && !showingOriginal
              ? handleShowOriginal
              : undefined
          }
        />
      )}
    </div>
  )
}

// =============================================================================
// LANGUAGE DETECTION BADGE
// =============================================================================

interface LanguageDetectionBadgeProps {
  detectedLanguage: string
  confidence?: number
  className?: string
}

export function LanguageDetectionBadge({
  detectedLanguage,
  confidence,
  className,
}: LanguageDetectionBadgeProps) {
  const lang = COMMON_LANGUAGES.find((l) => l.code === detectedLanguage)

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground',
        className
      )}
    >
      {lang?.flag && <span>{lang.flag}</span>}
      <span>{lang?.name || detectedLanguage}</span>
      {confidence !== undefined && (
        <span className="opacity-60">({Math.round(confidence * 100)}%)</span>
      )}
    </div>
  )
}
