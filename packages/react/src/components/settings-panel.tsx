'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Textarea,
  Badge,
  ScrollArea,
  Switch,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  cn,
} from '@clarity-chat/primitives'
import type {
  UserSettings,
  AIPersonality,
  UIPreferences,
  PrivacySettings,
  NotificationSettings,
  FontSize,
  MessageLayout,
} from '@clarity-chat/types'
import type { ThemeMode } from '../theme/ThemeProvider'

type SettingsTab = 'ai' | 'ui' | 'privacy' | 'notifications'

type ToggleConfig<T extends string> = { key: T; label: string; description?: string }

const aiToneOptions: AIPersonality['tone'][] = ['professional', 'casual', 'technical', 'friendly', 'creative']
const aiVerbosityOptions: AIPersonality['verbosity'][] = ['concise', 'balanced', 'detailed', 'comprehensive']
const fontSizeOptions: FontSize[] = ['small', 'medium', 'large', 'extra-large']
const layoutOptions: MessageLayout[] = ['bubbles', 'compact', 'spacious']
const displayOptions: ToggleConfig<keyof UIPreferences & string>[] = [
  { key: 'showTimestamps', label: 'Show Timestamps' },
  { key: 'showAvatars', label: 'Show Avatars' },
  { key: 'enableAnimations', label: 'Enable Animations' },
  { key: 'enableSoundEffects', label: 'Enable Sound Effects' },
  { key: 'compactMode', label: 'Compact Mode' },
]
const privacyOptions: ToggleConfig<keyof PrivacySettings & string>[] = [
  {
    key: 'saveHistory',
    label: 'Save Chat History',
    description: 'Store your conversations for future reference',
  },
  {
    key: 'enableAnalytics',
    label: 'Enable Analytics',
    description: 'Help us improve by sharing usage data',
  },
  {
    key: 'shareUsageData',
    label: 'Share Usage Data',
    description: 'Contribute to AI training and improvements',
  },
  {
    key: 'allowTelemetry',
    label: 'Allow Telemetry',
    description: 'Send crash reports and performance data',
  },
]
const notificationChannelOptions: Array<{
  key: keyof NotificationSettings & string
  label: string
  icon: string
}> = [
  { key: 'email', label: 'Email Notifications', icon: '📧' },
  { key: 'push', label: 'Push Notifications', icon: '🔔' },
  { key: 'desktop', label: 'Desktop Notifications', icon: '💻' },
  { key: 'sound', label: 'Sound Alerts', icon: '🔊' },
]
const notificationEventOptions: ToggleConfig<keyof NotificationSettings & string>[] = [
  { key: 'newMessage', label: 'New Messages' },
  { key: 'systemUpdates', label: 'System Updates' },
]

export interface SettingsPanelProps {
  settings: UserSettings
  onUpdate: (settings: Partial<UserSettings>) => void
  onReset?: () => void
  className?: string
}

export function SettingsPanel({
  settings,
  onUpdate,
  onReset,
  className,
}: SettingsPanelProps) {
  const [activeTab, setActiveTab] = React.useState<SettingsTab>('ai')
  const [hasChanges, setHasChanges] = React.useState(false)

  const tabs: Array<{ id: SettingsTab; label: string; icon: string }> = [
    { id: 'ai', label: 'AI Behavior', icon: '🤖' },
    { id: 'ui', label: 'Appearance', icon: '🎨' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
  ]

  const handleUpdateAI = (updates: Partial<AIPersonality>) => {
    onUpdate({ aiPersonality: { ...settings.aiPersonality, ...updates } })
    setHasChanges(true)
  }

  const handleUpdateUI = (updates: Partial<UIPreferences>) => {
    onUpdate({ uiPreferences: { ...settings.uiPreferences, ...updates } })
    setHasChanges(true)
  }

  const handleUpdatePrivacy = (updates: Partial<PrivacySettings>) => {
    onUpdate({ privacy: { ...settings.privacy, ...updates } })
    setHasChanges(true)
  }

  const handleUpdateNotifications = (updates: Partial<NotificationSettings>) => {
    onUpdate({ notifications: { ...settings.notifications, ...updates } })
    setHasChanges(true)
  }

  const handleReset = () => {
    if (confirm('Reset all settings to defaults?')) {
      onReset?.()
      setHasChanges(false)
    }
  }

  return (
    <Card className={cn('flex h-full flex-col', className)}>
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as SettingsTab)}
        className="flex h-full flex-col"
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Customize your AI chat experience</CardDescription>
            </div>
            {hasChanges && (
              <Badge variant="default" className="animate-pulse">
                Unsaved Changes
              </Badge>
            )}
          </div>

          <TabsList className="mt-4 flex flex-wrap gap-2 overflow-x-auto bg-transparent p-0">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2 rounded-md border border-border/40 px-3 py-2 text-sm data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {tab.icon} {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="pb-4">
              <TabsContent value="ai" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="mb-3 text-sm font-semibold">Response Style</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="mb-2 block text-sm font-medium">Tone</label>
                        <div className="grid grid-cols-2 gap-2">
                          {aiToneOptions.map((tone) => (
                            <Button
                              key={tone}
                              variant={settings.aiPersonality.tone === tone ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handleUpdateAI({ tone })}
                              className="justify-start"
                            >
                              {tone.charAt(0).toUpperCase() + tone.slice(1)}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium">Verbosity</label>
                        <div className="grid grid-cols-2 gap-2">
                          {aiVerbosityOptions.map((level) => (
                            <Button
                              key={level}
                              variant={settings.aiPersonality.verbosity === level ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handleUpdateAI({ verbosity: level })}
                              className="justify-start"
                            >
                              {level.charAt(0).toUpperCase() + level.slice(1)}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium">Response Language</label>
                        <select
                          value={settings.aiPersonality.responseLanguage || 'en'}
                          onChange={(event) => handleUpdateAI({ responseLanguage: event.target.value })}
                          className="w-full rounded border bg-background px-3 py-2 text-sm"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                          <option value="zh">Chinese</option>
                          <option value="ja">Japanese</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-sm font-semibold">Custom Instructions</h3>
                    <Textarea
                      value={settings.aiPersonality.customInstructions || ''}
                      onChange={(event) => handleUpdateAI({ customInstructions: event.target.value })}
                      placeholder="Add custom instructions for how the AI should respond to you..."
                      rows={6}
                    />
                    <p className="mt-2 text-xs text-muted-foreground">
                      These instructions will be included in every conversation to personalize responses.
                    </p>
                  </div>

                  <div className="rounded-lg bg-muted/50 p-4">
                    <h4 className="mb-2 text-sm font-medium">💡 Pro Tips</h4>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li>• Use "professional" tone for work-related tasks</li>
                      <li>• Set "concise" for quick answers</li>
                      <li>• Add custom instructions like "Always explain like I'm 5"</li>
                    </ul>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="ui" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="mb-3 text-sm font-semibold">Theme</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {(['light', 'dark', 'system'] as ThemeMode[]).map((theme) => (
                        <Button
                          key={theme}
                          variant={settings.uiPreferences.theme === theme ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            handleUpdateUI({ theme })
                            if (theme === 'dark') {
                              document.documentElement.classList.add('dark')
                            } else if (theme === 'light') {
                              document.documentElement.classList.remove('dark')
                            }
                          }}
                          className="flex flex-col items-center py-4"
                        >
                          {theme === 'light' && '☀️'}
                          {theme === 'dark' && '🌙'}
                          {theme === 'system' && '💻'}
                          <span className="mt-1 text-xs">{theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-sm font-semibold">Text Size</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {fontSizeOptions.map((size) => (
                        <Button
                          key={size}
                          variant={settings.uiPreferences.fontSize === size ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleUpdateUI({ fontSize: size })}
                        >
                          {size === 'small' && 'S'}
                          {size === 'medium' && 'M'}
                          {size === 'large' && 'L'}
                          {size === 'extra-large' && 'XL'}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-sm font-semibold">Message Layout</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {layoutOptions.map((layout) => (
                        <Button
                          key={layout}
                          variant={settings.uiPreferences.messageLayout === layout ? 'default' : 'outline'}
                          size="sm"
                          onClick={() =>
                            handleUpdateUI({
                              messageLayout: layout,
                            })
                          }
                        >
                          {layout.charAt(0).toUpperCase() + layout.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold">Display Options</h3>
                    {displayOptions.map(({ key, label }) => (
                      <Switch
                        key={key}
                        label={label}
                        containerClassName="flex items-center justify-between rounded-lg p-3 hover:bg-muted/50"
                        checked={settings.uiPreferences[key as keyof UIPreferences] as boolean}
                        onChange={(event) => handleUpdateUI({ [key]: event.target.checked } as Partial<UIPreferences>)}
                        name={key}
                      />
                    ))}
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="privacy" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold">Data Collection</h3>
                    {privacyOptions.map(({ key, label, description }) => (
                      <Switch
                        key={key}
                        label={label}
                        description={description}
                        align="start"
                        containerClassName="flex items-start justify-between rounded-lg border p-4 hover:bg-muted/50"
                        checked={settings.privacy[key as keyof PrivacySettings] as boolean}
                        onChange={(event) =>
                          handleUpdatePrivacy({ [key]: event.target.checked } as Partial<PrivacySettings>)
                        }
                        name={key}
                      />
                    ))}
                  </div>

                  <div className="rounded-lg border border-[hsl(var(--warning))/0.2] bg-[hsl(var(--warning))/0.1] p-4 shadow-[0_1px_3px_rgba(15,23,42,0.1)]">
                    <h4 className="mb-2 text-sm font-medium">⚠️ Privacy Notice</h4>
                    <p className="text-xs text-muted-foreground">
                      We take your privacy seriously. Your data is encrypted and never shared with third parties without
                      your explicit consent. You can export or delete your data at any time.
                    </p>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="notifications" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold">Notification Channels</h3>
                    {notificationChannelOptions.map(({ key, label, icon }) => (
                      <Switch
                        key={key}
                        label={
                          <span className="flex items-center gap-1.5 text-sm">
                            <span>{icon}</span> {label}
                          </span>
                        }
                        containerClassName="flex items-center justify-between rounded-lg p-3 hover:bg-muted/50"
                        checked={settings.notifications[key as keyof NotificationSettings] as boolean}
                        onChange={(event) =>
                          handleUpdateNotifications({ [key]: event.target.checked } as Partial<NotificationSettings>)
                        }
                        name={key}
                      />
                    ))}
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold">Notify Me About</h3>
                    {notificationEventOptions.map(({ key, label }) => (
                      <Switch
                        key={key}
                        label={label}
                        containerClassName="flex items-center justify-between rounded-lg p-3 hover:bg-muted/50"
                        checked={settings.notifications[key as keyof NotificationSettings] as boolean}
                        onChange={(event) =>
                          handleUpdateNotifications({ [key]: event.target.checked } as Partial<NotificationSettings>)
                        }
                        name={key}
                      />
                    ))}
                  </div>
                </motion.div>
              </TabsContent>
            </div>
          </ScrollArea>
        </CardContent>
      </Tabs>

      <div className="flex items-center justify-between border-t p-4">
        <Button variant="outline" size="sm" onClick={handleReset} disabled={!onReset}>
          Reset to Defaults
        </Button>
        {hasChanges && (
          <Button size="sm" onClick={() => setHasChanges(false)}>
            Save Changes
          </Button>
        )}
      </div>
    </Card>
  )
}

SettingsPanel.displayName = 'SettingsPanel'
