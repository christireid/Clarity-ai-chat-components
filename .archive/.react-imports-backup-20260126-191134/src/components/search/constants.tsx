import * as React from 'react'
import {
  User,
  Bot,
  Paperclip,
  AlertCircle,
  Calendar,
} from 'lucide-react'
import type { FilterPreset } from './types'

// Type assertions for icons
const UserIcon = User as React.ComponentType<{ className?: string }>
const BotIcon = Bot as React.ComponentType<{ className?: string }>
const PaperclipIcon = Paperclip as React.ComponentType<{ className?: string }>
const AlertIcon = AlertCircle as React.ComponentType<{ className?: string }>
const CalendarIcon = Calendar as React.ComponentType<{ className?: string }>

/**
 * Local storage keys
 */
export const STORAGE_KEY_SAVED = 'clarity-advanced-search-saved'
export const STORAGE_KEY_RECENT = 'clarity-advanced-search-recent'

/**
 * Default filter presets
 */
export const defaultPresets: FilterPreset[] = [
  {
    id: 'user-messages',
    name: 'User Messages',
    icon: <UserIcon className="h-3.5 w-3.5" />,
    filters: { role: 'user' },
  },
  {
    id: 'ai-responses',
    name: 'AI Responses',
    icon: <BotIcon className="h-3.5 w-3.5" />,
    filters: { role: 'assistant' },
  },
  {
    id: 'with-attachments',
    name: 'Has Attachments',
    icon: <PaperclipIcon className="h-3.5 w-3.5" />,
    filters: { hasAttachments: true },
  },
  {
    id: 'with-errors',
    name: 'Has Errors',
    icon: <AlertIcon className="h-3.5 w-3.5" />,
    filters: { hasErrors: true },
  },
  {
    id: 'today',
    name: 'Today',
    icon: <CalendarIcon className="h-3.5 w-3.5" />,
    filters: {
      dateRange: {
        start: new Date(new Date().setHours(0, 0, 0, 0)),
        end: new Date(),
      },
    },
  },
]
