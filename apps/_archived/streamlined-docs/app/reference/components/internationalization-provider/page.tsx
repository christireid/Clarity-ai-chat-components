'use client'

/**
 * InternationalizationProvider Component - API Reference Documentation
 *
 * Complete i18n solution with 50+ languages, RTL support, pluralization,
 * and dynamic locale switching.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Globe,
  Languages,
  ArrowLeftRight,
  Code2,
  Settings,
  Calendar,
  DollarSign,
  ChevronRight,
  Play,
  Check,
  Keyboard,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { Section, SubSection } from '@/components/Docs/Section'
import { PropsTable, type PropDefinition } from '@/components/Docs/PropsTable'
import { CodeBlock } from '@/components/Docs/CodeBlock'
import { DocumentationPage } from '@/components/Docs/DocumentationPage'
import type { TocItem } from '@/components/Docs/TableOfContents'

// ISR Configuration: API documentation changes with code updates
export const revalidate = 3600

// ============================================================================
// Language Table Component
// ============================================================================

interface Language {
  code: string
  name: string
  nativeName: string
  rtl: boolean
  region: string
}

const languages: Language[] = [
  // European Languages
  { code: 'en', name: 'English', nativeName: 'English', rtl: false, region: 'Europe' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', rtl: false, region: 'Europe' },
  { code: 'fr', name: 'French', nativeName: 'Français', rtl: false, region: 'Europe' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', rtl: false, region: 'Europe' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', rtl: false, region: 'Europe' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', rtl: false, region: 'Europe' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', rtl: false, region: 'Europe' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', rtl: false, region: 'Europe' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', rtl: false, region: 'Europe' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', rtl: false, region: 'Europe' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', rtl: false, region: 'Europe' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', rtl: false, region: 'Europe' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', rtl: false, region: 'Europe' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', rtl: false, region: 'Europe' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', rtl: false, region: 'Europe' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', rtl: false, region: 'Europe' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', rtl: false, region: 'Europe' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', rtl: false, region: 'Europe' },

  // Asian Languages
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文', rtl: false, region: 'Asia' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文', rtl: false, region: 'Asia' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', rtl: false, region: 'Asia' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', rtl: false, region: 'Asia' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', rtl: false, region: 'Asia' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', rtl: false, region: 'Asia' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', rtl: false, region: 'Asia' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', rtl: false, region: 'Asia' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', rtl: false, region: 'Asia' },
  { code: 'tl', name: 'Filipino', nativeName: 'Filipino', rtl: false, region: 'Asia' },

  // Middle Eastern & RTL Languages
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', rtl: true, region: 'Middle East' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', rtl: true, region: 'Middle East' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', rtl: true, region: 'Middle East' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', rtl: true, region: 'Middle East' },

  // Americas
  { code: 'pt-BR', name: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)', rtl: false, region: 'Americas' },
  { code: 'es-MX', name: 'Spanish (Mexico)', nativeName: 'Español (México)', rtl: false, region: 'Americas' },
  { code: 'es-AR', name: 'Spanish (Argentina)', nativeName: 'Español (Argentina)', rtl: false, region: 'Americas' },
  { code: 'en-US', name: 'English (US)', nativeName: 'English (US)', rtl: false, region: 'Americas' },
  { code: 'en-CA', name: 'English (Canada)', nativeName: 'English (Canada)', rtl: false, region: 'Americas' },
  { code: 'fr-CA', name: 'French (Canada)', nativeName: 'Français (Canada)', rtl: false, region: 'Americas' },

  // Africa
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', rtl: false, region: 'Africa' },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', rtl: false, region: 'Africa' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', rtl: false, region: 'Africa' },

  // Oceania
  { code: 'en-AU', name: 'English (Australia)', nativeName: 'English (Australia)', rtl: false, region: 'Oceania' },
  { code: 'en-NZ', name: 'English (New Zealand)', nativeName: 'English (New Zealand)', rtl: false, region: 'Oceania' },

  // Additional European
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', rtl: false, region: 'Europe' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', rtl: false, region: 'Europe' },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски', rtl: false, region: 'Europe' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', rtl: false, region: 'Europe' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', rtl: false, region: 'Europe' },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', rtl: false, region: 'Europe' },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti', rtl: false, region: 'Europe' },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu', rtl: false, region: 'Europe' },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', rtl: false, region: 'Europe' },
]

function LanguageTable() {
  const [filterRegion, setFilterRegion] = React.useState<string>('all')
  const [searchQuery, setSearchQuery] = React.useState('')

  const regions = ['all', ...Array.from(new Set(languages.map(l => l.region)))]

  const filteredLanguages = languages.filter(lang => {
    const matchesRegion = filterRegion === 'all' || lang.region === filterRegion
    const matchesSearch = searchQuery === '' ||
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.code.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesRegion && matchesSearch
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search languages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm flex-1 min-w-[200px]"
        />
        <div className="flex gap-2">
          {regions.map(region => (
            <button
              key={region}
              onClick={() => setFilterRegion(region)}
              className={cn(
                'px-3 py-1.5 rounded text-xs font-medium transition-colors',
                filterRegion === region
                  ? 'bg-brand-500 text-white'
                  : 'bg-muted hover:bg-muted/70 text-muted-foreground'
              )}
            >
              {region === 'all' ? 'All' : region}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 bg-muted/20">
              <th className="px-4 py-3 text-left font-semibold text-foreground">Code</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Language</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Native Name</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Direction</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Region</th>
            </tr>
          </thead>
          <tbody>
            {filteredLanguages.map((lang, index) => (
              <tr
                key={lang.code}
                className={cn(
                  'border-b border-border/30 last:border-b-0',
                  index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10'
                )}
              >
                <td className="px-4 py-3 font-mono text-xs text-brand-600 dark:text-brand-400">
                  {lang.code}
                </td>
                <td className="px-4 py-3 text-foreground">{lang.name}</td>
                <td className="px-4 py-3 text-muted-foreground" dir={lang.rtl ? 'rtl' : 'ltr'}>
                  {lang.nativeName}
                </td>
                <td className="px-4 py-3">
                  <span className={cn(
                    'px-2 py-0.5 rounded-full text-xs',
                    lang.rtl
                      ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                      : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                  )}>
                    {lang.rtl ? 'RTL' : 'LTR'}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{lang.region}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {filteredLanguages.length} of {languages.length} supported languages
      </p>
    </div>
  )
}

// ============================================================================
// Live Demo Component
// ============================================================================

function LiveDemo() {
  const [locale, setLocale] = React.useState('en')
  const [direction, setDirection] = React.useState<'ltr' | 'rtl'>('ltr')

  const translations = {
    en: {
      greeting: 'Hello, World!',
      welcome: 'Welcome to our chat',
      messageCount: '{{count}} message',
      messageCount_plural: '{{count}} messages',
      time: 'Current time',
    },
    es: {
      greeting: '¡Hola, Mundo!',
      welcome: 'Bienvenido a nuestro chat',
      messageCount: '{{count}} mensaje',
      messageCount_plural: '{{count}} mensajes',
      time: 'Hora actual',
    },
    ar: {
      greeting: 'مرحبا بالعالم!',
      welcome: 'مرحبا بك في الدردشة',
      messageCount: '{{count}} رسالة',
      messageCount_plural: '{{count}} رسائل',
      time: 'الوقت الحالي',
    },
    zh: {
      greeting: '你好，世界！',
      welcome: '欢迎来到我们的聊天',
      messageCount: '{{count}} 条消息',
      messageCount_plural: '{{count}} 条消息',
      time: '当前时间',
    },
    ja: {
      greeting: 'こんにちは、世界！',
      welcome: 'チャットへようこそ',
      messageCount: '{{count}} メッセージ',
      messageCount_plural: '{{count}} メッセージ',
      time: '現在の時刻',
    },
  }

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale)
    // Update direction based on locale
    const rtlLocales = ['ar', 'he', 'fa', 'ur']
    setDirection(rtlLocales.includes(newLocale) ? 'rtl' : 'ltr')
  }

  const t = translations[locale as keyof typeof translations] || translations.en

  return (
    <div className="space-y-4">
      {/* Locale Selector */}
      <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
        <label className="block text-sm font-medium text-foreground mb-2">
          Select Language:
        </label>
        <div className="flex flex-wrap gap-2">
          {Object.keys(translations).map((loc) => (
            <button
              key={loc}
              onClick={() => handleLocaleChange(loc)}
              className={cn(
                'px-3 py-1.5 rounded text-sm transition-colors',
                locale === loc
                  ? 'bg-brand-500 text-white'
                  : 'bg-background hover:bg-muted text-foreground border border-border'
              )}
            >
              {loc.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Demo Display */}
      <div
        className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-lg"
        dir={direction}
      >
        {/* Header */}
        <div className="px-4 py-3 bg-muted/30 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Locale: {locale}</span>
              <span className={cn(
                'px-2 py-0.5 rounded-full text-xs',
                direction === 'rtl'
                  ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                  : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
              )}>
                {direction.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-2">{t.greeting}</h3>
            <p className="text-muted-foreground">{t.welcome}</p>
          </div>

          <div className="space-y-2">
            <div className="p-3 rounded bg-muted/50">
              <p className="text-sm text-foreground">
                {t.messageCount.replace('{{count}}', '1')}
              </p>
            </div>
            <div className="p-3 rounded bg-muted/50">
              <p className="text-sm text-foreground">
                {t.messageCount_plural.replace('{{count}}', '5')}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              {t.time}: {new Date().toLocaleTimeString(locale)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Props Data
// ============================================================================

const coreProps: PropDefinition[] = [
  {
    name: 'locale',
    type: 'string',
    required: true,
    description: 'Current locale code (e.g., "en", "es", "ar"). Must be one of the supported languages.',
  },
  {
    name: 'defaultLocale',
    type: 'string',
    default: '"en"',
    description: 'Fallback locale when translation is missing or locale is invalid.',
  },
  {
    name: 'translations',
    type: 'Record<string, Record<string, string>>',
    required: true,
    description: 'Translation dictionary organized by locale and key.',
  },
  {
    name: 'onLocaleChange',
    type: '(locale: string) => void',
    description: 'Callback when locale is changed via LocaleSwitcher or programmatically.',
  },
  {
    name: 'direction',
    type: '"ltr" | "rtl" | "auto"',
    default: '"auto"',
    description: 'Text direction. "auto" detects from locale (Arabic, Hebrew, etc.).',
  },
]

const loadingProps: PropDefinition[] = [
  {
    name: 'loadTranslations',
    type: '(locale: string) => Promise<Record<string, string>>',
    description: 'Async function to load translations on-demand. Enables code-splitting.',
  },
  {
    name: 'cache',
    type: 'boolean',
    default: 'true',
    description: 'Cache loaded translations in memory to avoid re-fetching.',
  },
  {
    name: 'preload',
    type: 'string[]',
    description: 'Array of locale codes to preload on mount for faster switching.',
  },
  {
    name: 'loadingComponent',
    type: 'ReactNode',
    description: 'Component to show while translations are loading.',
  },
]

const pluralizationProps: PropDefinition[] = [
  {
    name: 'pluralRules',
    type: 'Record<string, (count: number) => string>',
    description: 'Custom pluralization rules per locale. Defaults to ICU MessageFormat.',
  },
  {
    name: 'enablePluralization',
    type: 'boolean',
    default: 'true',
    description: 'Enable automatic pluralization support (_one, _few, _many, _other).',
  },
  {
    name: 'interpolation',
    type: '{ prefix?: string; suffix?: string; escape?: boolean }',
    default: '{ prefix: "{{", suffix: "}}", escape: true }',
    description: 'Variable interpolation configuration for translation strings.',
  },
]

const formattingProps: PropDefinition[] = [
  {
    name: 'dateTimeFormat',
    type: 'Intl.DateTimeFormatOptions',
    description: 'Default date/time formatting options for the locale.',
  },
  {
    name: 'numberFormat',
    type: 'Intl.NumberFormatOptions',
    description: 'Default number formatting options for the locale.',
  },
  {
    name: 'currencyFormat',
    type: '{ currency: string; display?: string }',
    description: 'Currency formatting configuration (e.g., { currency: "USD" }).',
  },
  {
    name: 'relativeTimeFormat',
    type: 'Intl.RelativeTimeFormatOptions',
    description: 'Relative time formatting (e.g., "3 days ago", "in 2 hours").',
  },
]

const namespaceProps: PropDefinition[] = [
  {
    name: 'namespaces',
    type: 'string[]',
    description: 'List of translation namespaces to enable (e.g., ["common", "chat", "errors"]).',
  },
  {
    name: 'defaultNamespace',
    type: 'string',
    default: '"translation"',
    description: 'Default namespace when not specified in translation key.',
  },
  {
    name: 'fallbackNamespace',
    type: 'string | string[]',
    description: 'Namespace(s) to check when key is not found in current namespace.',
  },
  {
    name: 'keyPrefix',
    type: 'string',
    description: 'Prefix to prepend to all translation keys (e.g., "chat.messages").',
  },
]

const advancedProps: PropDefinition[] = [
  {
    name: 'missingKeyHandler',
    type: '(locale: string, namespace: string, key: string) => string',
    description: 'Custom handler for missing translation keys. Defaults to returning the key.',
  },
  {
    name: 'postProcess',
    type: '(value: string, key: string, options: any) => string',
    description: 'Post-process translation values before returning (e.g., markdown parsing).',
  },
  {
    name: 'debug',
    type: 'boolean',
    default: 'false',
    description: 'Enable debug mode to log translation lookups and misses.',
  },
  {
    name: 'suspense',
    type: 'boolean',
    default: 'false',
    description: 'Enable React Suspense for async translation loading.',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import { InternationalizationProvider, useTranslation } from '@clarity-chat/react'
import type { I18nConfig } from '@clarity-chat/react'`

const basicUsageCode = `import { InternationalizationProvider } from '@clarity-chat/react'

const translations = {
  en: {
    greeting: 'Hello!',
    welcome: 'Welcome to our chat',
    messageCount: '{{count}} message',
    messageCount_plural: '{{count}} messages',
  },
  es: {
    greeting: '¡Hola!',
    welcome: 'Bienvenido a nuestro chat',
    messageCount: '{{count}} mensaje',
    messageCount_plural: '{{count}} mensajes',
  },
}

function App() {
  const [locale, setLocale] = useState('en')

  return (
    <InternationalizationProvider
      locale={locale}
      defaultLocale="en"
      translations={translations}
      onLocaleChange={setLocale}
    >
      <ChatWindow />
    </InternationalizationProvider>
  )
}`

const rtlExampleCode = `import { InternationalizationProvider } from '@clarity-chat/react'

const translations = {
  en: { title: 'Chat Application' },
  ar: { title: 'تطبيق الدردشة' },
  he: { title: 'יישום צ׳אט' },
}

function App() {
  const [locale, setLocale] = useState('en')

  return (
    <InternationalizationProvider
      locale={locale}
      translations={translations}
      direction="auto" // Automatically detects RTL for ar, he, fa, ur
      onLocaleChange={setLocale}
    >
      <ChatWindow />
    </InternationalizationProvider>
  )
}

// UI automatically flips to RTL layout when Arabic or Hebrew is selected`

const pluralizationCode = `const translations = {
  en: {
    // Pluralization using _one, _other suffixes
    item_one: '{{count}} item',
    item_other: '{{count}} items',

    // Complex pluralization
    message_zero: 'No messages',
    message_one: '1 message',
    message_few: '{{count}} messages',
    message_many: '{{count}} messages',
    message_other: '{{count}} messages',
  },
  ru: {
    // Russian has complex plural rules
    item_one: '{{count}} предмет',
    item_few: '{{count}} предмета',
    item_many: '{{count}} предметов',
    item_other: '{{count}} предметов',
  },
}

// Usage with useTranslation hook
function MessageCount({ count }: { count: number }) {
  const { t } = useTranslation()

  return <span>{t('message', { count })}</span>
  // Automatically selects correct plural form based on count
}`

const namespacesCode = `// Organize translations by namespace
const translations = {
  en: {
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
    },
    chat: {
      title: 'Chat',
      send: 'Send message',
      typing: '{{user}} is typing...',
    },
    errors: {
      network: 'Network error occurred',
      validation: 'Please check your input',
    },
  },
}

function App() {
  return (
    <InternationalizationProvider
      locale="en"
      translations={translations}
      namespaces={['common', 'chat', 'errors']}
      defaultNamespace="common"
    >
      <ChatWindow />
    </InternationalizationProvider>
  )
}

// Use specific namespace
function ChatComponent() {
  const { t } = useTranslation('chat')
  return <h1>{t('title')}</h1> // "Chat"
}`

const asyncLoadingCode = `import { InternationalizationProvider } from '@clarity-chat/react'

// Lazy load translations for code-splitting
const loadTranslations = async (locale: string) => {
  const translations = await import(\`./locales/\${locale}.json\`)
  return translations.default
}

function App() {
  const [locale, setLocale] = useState('en')

  return (
    <InternationalizationProvider
      locale={locale}
      loadTranslations={loadTranslations}
      preload={['en', 'es']} // Preload common locales
      cache={true} // Cache loaded translations
      loadingComponent={<LoadingSpinner />}
      suspense={true} // Enable React Suspense
    >
      <ChatWindow />
    </InternationalizationProvider>
  )
}`

const translationFileCode = `// locales/en.json
{
  "greeting": "Hello, {{name}}!",
  "welcome": "Welcome to our chat",
  "message": {
    "send": "Send",
    "edit": "Edit",
    "delete": "Delete",
    "copy": "Copy"
  },
  "notification": {
    "new_message": "New message from {{sender}}",
    "new_message_plural": "{{count}} new messages"
  },
  "time": {
    "now": "just now",
    "minutes_ago": "{{count}} minute ago",
    "minutes_ago_plural": "{{count}} minutes ago",
    "hours_ago": "{{count}} hour ago",
    "hours_ago_plural": "{{count}} hours ago"
  }
}

// locales/es.json
{
  "greeting": "¡Hola, {{name}}!",
  "welcome": "Bienvenido a nuestro chat",
  "message": {
    "send": "Enviar",
    "edit": "Editar",
    "delete": "Eliminar",
    "copy": "Copiar"
  },
  "notification": {
    "new_message": "Nuevo mensaje de {{sender}}",
    "new_message_plural": "{{count}} mensajes nuevos"
  },
  "time": {
    "now": "ahora mismo",
    "minutes_ago": "hace {{count}} minuto",
    "minutes_ago_plural": "hace {{count}} minutos",
    "hours_ago": "hace {{count}} hora",
    "hours_ago_plural": "hace {{count}} horas"
  }
}`

const formattingCode = `import { InternationalizationProvider, useTranslation } from '@clarity-chat/react'

function App() {
  return (
    <InternationalizationProvider
      locale="en-US"
      translations={translations}
      dateTimeFormat={{
        dateStyle: 'medium',
        timeStyle: 'short',
      }}
      numberFormat={{
        style: 'decimal',
        minimumFractionDigits: 2,
      }}
      currencyFormat={{
        currency: 'USD',
        display: 'symbol',
      }}
    >
      <ChatWindow />
    </InternationalizationProvider>
  )
}

// Using formatting in components
function MessageTimestamp({ date }: { date: Date }) {
  const { formatDate, formatRelativeTime } = useTranslation()

  return (
    <div>
      <p>{formatDate(date)}</p>
      <p>{formatRelativeTime(date)}</p>
    </div>
  )
}

function PriceDisplay({ amount }: { amount: number }) {
  const { formatCurrency, formatNumber } = useTranslation()

  return (
    <div>
      <p>{formatCurrency(amount)}</p>
      <p>{formatNumber(amount)}</p>
    </div>
  )
}`

const typescriptCode = `// Type definitions
interface I18nConfig {
  locale: string
  defaultLocale?: string
  translations: Record<string, Record<string, string>>
  onLocaleChange?: (locale: string) => void
  direction?: 'ltr' | 'rtl' | 'auto'
  loadTranslations?: (locale: string) => Promise<Record<string, string>>
  cache?: boolean
  preload?: string[]
  loadingComponent?: ReactNode
  pluralRules?: Record<string, (count: number) => string>
  enablePluralization?: boolean
  interpolation?: {
    prefix?: string
    suffix?: string
    escape?: boolean
  }
  dateTimeFormat?: Intl.DateTimeFormatOptions
  numberFormat?: Intl.NumberFormatOptions
  currencyFormat?: {
    currency: string
    display?: string
  }
  relativeTimeFormat?: Intl.RelativeTimeFormatOptions
  namespaces?: string[]
  defaultNamespace?: string
  fallbackNamespace?: string | string[]
  keyPrefix?: string
  missingKeyHandler?: (locale: string, namespace: string, key: string) => string
  postProcess?: (value: string, key: string, options: any) => string
  debug?: boolean
  suspense?: boolean
}

// useTranslation hook
interface UseTranslationReturn {
  t: (key: string, options?: TranslationOptions) => string
  locale: string
  setLocale: (locale: string) => void
  direction: 'ltr' | 'rtl'
  formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string
  formatCurrency: (value: number, currency?: string) => string
  formatRelativeTime: (date: Date | string | number) => string
  ready: boolean
}

interface TranslationOptions {
  count?: number
  context?: string
  defaultValue?: string
  replace?: Record<string, string | number>
  ns?: string
}

// Usage
import type { I18nConfig, UseTranslationReturn } from '@clarity-chat/react'`

// ============================================================================
// Table of Contents
// ============================================================================

const tableOfContents: TocItem[] = [
  { id: 'overview', title: 'Overview' },
  { id: 'installation', title: 'Installation' },
  { id: 'demo', title: 'Live Demo' },
  { id: 'basic-usage', title: 'Basic Usage' },
  {
    id: 'props',
    title: 'Props Reference',
    children: [
      { id: 'core-props', title: 'Core Props' },
      { id: 'loading-props', title: 'Async Loading' },
      { id: 'pluralization-props', title: 'Pluralization' },
      { id: 'formatting-props', title: 'Formatting' },
      { id: 'namespace-props', title: 'Namespaces' },
      { id: 'advanced-props', title: 'Advanced' },
    ],
  },
  { id: 'supported-languages', title: 'Supported Languages' },
  {
    id: 'examples',
    title: 'Examples',
    children: [
      { id: 'example-basic', title: 'Basic Setup' },
      { id: 'example-rtl', title: 'RTL Support' },
      { id: 'example-pluralization', title: 'Pluralization' },
      { id: 'example-namespaces', title: 'Namespaces' },
      { id: 'example-async', title: 'Async Loading' },
    ],
  },
  { id: 'translation-files', title: 'Creating Translations' },
  { id: 'formatting', title: 'Date/Number Formatting' },
  { id: 'typescript', title: 'TypeScript' },
  { id: 'accessibility', title: 'Accessibility' },
  { id: 'best-practices', title: 'Best Practices' },
  { id: 'related', title: 'Related' },
]

// ============================================================================
// Main Page Component
// ============================================================================

export default function InternationalizationProviderPage() {
  return (
    <DocumentationPage
      title="InternationalizationProvider"
      description="Complete i18n solution with 50+ languages, RTL support, pluralization, and dynamic locale switching"
      icon={Globe}
      badges={[{ label: 'Stable', variant: 'stable' }]}
      packageName="@clarity-chat/react"
      features={[
        {
          icon: Languages,
          label: '50+ Languages',
          description: 'Comprehensive support',
        },
        {
          icon: ArrowLeftRight,
          label: 'RTL Support',
          description: 'Automatic layout flip',
        },
        {
          icon: Code2,
          label: 'Pluralization',
          description: 'ICU MessageFormat',
        },
        {
          icon: Settings,
          label: 'Dynamic Loading',
          description: 'Lazy-load translations',
        },
      ]}
      tableOfContents={tableOfContents}
      relatedAPIs={[
        {
          name: 'useTranslation',
          type: 'hook',
          description: 'Access translations and locale management',
          href: '/reference/hooks/use-translation',
        },
        {
          name: 'Trans',
          type: 'component',
          description: 'Component for complex translation strings with JSX',
          href: '/reference/components/trans',
        },
        {
          name: 'LocaleSwitcher',
          type: 'component',
          description: 'Pre-built language selection dropdown',
          href: '/reference/components/locale-switcher',
        },
        {
          name: 'useLocaleDetection',
          type: 'hook',
          description: 'Detect user locale from browser settings',
          href: '/reference/hooks/use-locale-detection',
        },
      ]}
      footerNavigation={[
        {
          label: 'ThemeProvider',
          href: '/reference/components/theme-provider',
          direction: 'previous',
        },
        {
          label: 'useTranslation',
          href: '/reference/hooks/use-translation',
          direction: 'next',
        },
      ]}
    >
      {/* Overview Section */}
      <Section id="overview" title="Overview">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            <code>InternationalizationProvider</code> is a comprehensive i18n solution
            for chat applications. It handles translations, pluralization, RTL layouts,
            date/number formatting, and dynamic locale switching.
          </p>

          <h4 className="text-lg font-semibold mt-6 mb-3">Key Features</h4>
          <ul className="space-y-2">
            <li>
              <strong>50+ Languages:</strong> Extensive language support including European,
              Asian, Middle Eastern, and African languages
            </li>
            <li>
              <strong>RTL Support:</strong> Automatic detection and layout flipping for
              right-to-left languages (Arabic, Hebrew, Persian, Urdu)
            </li>
            <li>
              <strong>Pluralization:</strong> ICU MessageFormat-compliant plural rules
              for all supported languages
            </li>
            <li>
              <strong>Dynamic Loading:</strong> Async translation loading with code-splitting
              and caching for optimal performance
            </li>
            <li>
              <strong>Variable Interpolation:</strong> Template strings with variable
              replacement (e.g., "Hello, {'{{name}}'}!")
            </li>
            <li>
              <strong>Namespaces:</strong> Organize translations by feature or module
            </li>
            <li>
              <strong>Date/Number Formatting:</strong> Locale-aware formatting using
              Intl APIs
            </li>
            <li>
              <strong>Type-Safe:</strong> Full TypeScript support with type inference
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">Architecture</h4>
          <p>
            The provider wraps your application at the root level and makes translations
            available to all child components via React Context. It uses the browser's
            Intl APIs for formatting and supports both synchronous and asynchronous
            translation loading.
          </p>
        </div>
      </Section>

      {/* Installation Section */}
      <Section id="installation" title="Installation">
        <div className="space-y-4">
          <CodeBlock
            code="npm install @clarity-chat/react"
            language="bash"
            filename="Terminal"
            showDownloadButton={false}
          />

          <p className="text-muted-foreground">Import the provider:</p>

          <CodeBlock
            code={importCode}
            language="tsx"
            filename="App.tsx"
            showDownloadButton={false}
          />
        </div>
      </Section>

      {/* Live Demo Section */}
      <Section id="demo" title="Live Demo">
        <p className="text-muted-foreground mb-6">
          Try switching between languages to see translations, pluralization, and RTL
          layout changes in real-time.
        </p>

        <LiveDemo />
      </Section>

      {/* Basic Usage Section */}
      <Section id="basic-usage" title="Basic Usage">
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Wrap your application with InternationalizationProvider:
          </p>

          <CodeBlock code={basicUsageCode} language="tsx" filename="App.tsx" />
        </div>
      </Section>

      {/* Props API Section */}
      <Section id="props" title="Props Reference">
        <SubSection id="core-props" title="Core Props">
          <p className="text-sm text-muted-foreground mb-4">
            Essential configuration for internationalization:
          </p>
          <PropsTable props={coreProps} />
        </SubSection>

        <SubSection id="loading-props" title="Async Loading Props">
          <p className="text-sm text-muted-foreground mb-4">
            Configure dynamic translation loading:
          </p>
          <PropsTable props={loadingProps} />
        </SubSection>

        <SubSection id="pluralization-props" title="Pluralization Props">
          <p className="text-sm text-muted-foreground mb-4">
            Control plural forms and variable interpolation:
          </p>
          <PropsTable props={pluralizationProps} />
        </SubSection>

        <SubSection id="formatting-props" title="Formatting Props">
          <p className="text-sm text-muted-foreground mb-4">
            Locale-aware date, number, and currency formatting:
          </p>
          <PropsTable props={formattingProps} />
        </SubSection>

        <SubSection id="namespace-props" title="Namespace Props">
          <p className="text-sm text-muted-foreground mb-4">
            Organize translations by feature or module:
          </p>
          <PropsTable props={namespaceProps} />
        </SubSection>

        <SubSection id="advanced-props" title="Advanced Props">
          <p className="text-sm text-muted-foreground mb-4">
            Advanced configuration options:
          </p>
          <PropsTable props={advancedProps} />
        </SubSection>
      </Section>

      {/* Supported Languages Section */}
      <Section id="supported-languages" title="Supported Languages">
        <p className="text-muted-foreground mb-6">
          InternationalizationProvider supports 50+ languages across all major regions.
          Filter by region or search to find specific languages.
        </p>

        <LanguageTable />
      </Section>

      {/* Examples Section */}
      <Section id="examples" title="Examples">
        <SubSection id="example-basic" title="Basic Setup">
          <p className="text-muted-foreground mb-4">
            Simple translation setup with multiple languages:
          </p>
          <CodeBlock code={basicUsageCode} language="tsx" filename="App.tsx" />
        </SubSection>

        <SubSection id="example-rtl" title="RTL Support">
          <p className="text-muted-foreground mb-4">
            Automatic right-to-left layout for Arabic, Hebrew, and other RTL languages:
          </p>
          <CodeBlock code={rtlExampleCode} language="tsx" filename="RTLApp.tsx" />
        </SubSection>

        <SubSection id="example-pluralization" title="Pluralization">
          <p className="text-muted-foreground mb-4">
            Handle plural forms correctly for all languages:
          </p>
          <CodeBlock
            code={pluralizationCode}
            language="tsx"
            filename="Pluralization.tsx"
          />
        </SubSection>

        <SubSection id="example-namespaces" title="Namespaces">
          <p className="text-muted-foreground mb-4">
            Organize translations by feature using namespaces:
          </p>
          <CodeBlock code={namespacesCode} language="tsx" filename="Namespaces.tsx" />
        </SubSection>

        <SubSection id="example-async" title="Async Loading">
          <p className="text-muted-foreground mb-4">
            Load translations dynamically for code-splitting:
          </p>
          <CodeBlock code={asyncLoadingCode} language="tsx" filename="AsyncI18n.tsx" />
        </SubSection>
      </Section>

      {/* Translation Files Section */}
      <Section id="translation-files" title="Creating Translation Files">
        <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
          <p>
            Organize your translations in JSON files by locale. Use nested objects
            for structure and template strings for variables.
          </p>

          <h4 className="text-lg font-semibold mt-6 mb-3">File Structure</h4>
          <ul>
            <li>Use nested objects to group related translations</li>
            <li>
              Use <code>_one</code>, <code>_few</code>, <code>_many</code>,{' '}
              <code>_other</code> suffixes for plural forms
            </li>
            <li>
              Use <code>{'{{variable}}'}</code> syntax for interpolation
            </li>
            <li>Keep keys descriptive and consistent across locales</li>
          </ul>
        </div>

        <CodeBlock
          code={translationFileCode}
          language="json"
          filename="Translation Files"
          showLineNumbers
        />
      </Section>

      {/* Formatting Section */}
      <Section id="formatting" title="Date and Number Formatting">
        <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
          <p>
            InternationalizationProvider includes locale-aware formatting for dates,
            numbers, and currencies using the browser's built-in Intl APIs.
          </p>
        </div>

        <CodeBlock code={formattingCode} language="tsx" filename="Formatting.tsx" />

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-brand-500" />
              <h4 className="font-semibold text-foreground">Date Formatting</h4>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Locale-aware date display</p>
              <p>• Relative time (e.g., "3 days ago")</p>
              <p>• Custom date/time formats</p>
              <p>• Time zone support</p>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-5 h-5 text-brand-500" />
              <h4 className="font-semibold text-foreground">Number Formatting</h4>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Decimal and thousand separators</p>
              <p>• Currency symbols and codes</p>
              <p>• Percentage formatting</p>
              <p>• Scientific notation</p>
            </div>
          </div>
        </div>
      </Section>

      {/* TypeScript Section */}
      <Section id="typescript" title="TypeScript">
        <p className="text-muted-foreground mb-4">Full type definitions:</p>
        <CodeBlock code={typescriptCode} language="tsx" filename="types.ts" showLineNumbers />
      </Section>

      {/* Accessibility Section */}
      <Section id="accessibility" title="Accessibility">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h4 className="text-lg font-semibold mt-6 mb-3 flex items-center gap-2">
            <Globe className="w-5 h-5" aria-hidden="true" />
            Language Attributes
          </h4>
          <ul className="space-y-2">
            <li>
              Automatically sets <code>lang</code> attribute on document root
            </li>
            <li>
              Sets <code>dir</code> attribute for RTL languages
            </li>
            <li>Updates when locale changes</li>
            <li>Screen readers announce language changes</li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3 flex items-center gap-2">
            <Keyboard className="w-5 h-5" aria-hidden="true" />
            Keyboard Navigation
          </h4>
          <p>LocaleSwitcher component is fully keyboard accessible:</p>
          <ul className="space-y-2">
            <li>
              <kbd className="px-2 py-1 rounded bg-muted text-xs">Tab</kbd> - Focus
              locale switcher
            </li>
            <li>
              <kbd className="px-2 py-1 rounded bg-muted text-xs">Enter/Space</kbd> -
              Open dropdown
            </li>
            <li>
              <kbd className="px-2 py-1 rounded bg-muted text-xs">Arrow Up/Down</kbd> -
              Navigate options
            </li>
            <li>
              <kbd className="px-2 py-1 rounded bg-muted text-xs">Enter</kbd> - Select
              language
            </li>
            <li>
              <kbd className="px-2 py-1 rounded bg-muted text-xs">Escape</kbd> - Close
              dropdown
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">WCAG Compliance</h4>
          <ul className="space-y-2">
            <li>Level AA: All text meets contrast requirements in all languages</li>
            <li>Level AA: Focus indicators visible and consistent</li>
            <li>Level AA: Text scales up to 200% without loss of content</li>
            <li>Level AAA: Language of page and parts identified</li>
          </ul>
        </div>
      </Section>

      {/* Best Practices Section */}
      <Section id="best-practices" title="Best Practices">
        <div className="space-y-6">
          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Use Descriptive Keys
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Make translation keys self-documenting:
                </p>
                <div className="space-y-1 text-sm">
                  <p className="text-green-600 dark:text-green-400">
                    ✓ "chat.message.send"
                  </p>
                  <p className="text-red-600 dark:text-red-400">✗ "btn1"</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Provide Context for Translators
                </h4>
                <p className="text-sm text-muted-foreground">
                  Add comments in translation files to explain usage context,
                  especially for ambiguous terms or technical jargon.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Test with RTL Languages
                </h4>
                <p className="text-sm text-muted-foreground">
                  Always test your UI with Arabic or Hebrew to ensure proper RTL
                  layout. Check for text truncation, icon placement, and spacing.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Handle Missing Translations
                </h4>
                <p className="text-sm text-muted-foreground">
                  Always provide a defaultLocale and implement missingKeyHandler for
                  graceful degradation when translations are incomplete.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Use Code-Splitting for Large Apps
                </h4>
                <p className="text-sm text-muted-foreground">
                  Enable async translation loading with preload for common locales to
                  optimize initial bundle size while maintaining fast switching.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </DocumentationPage>
  )
}
