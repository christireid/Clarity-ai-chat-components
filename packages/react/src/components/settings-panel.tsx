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

  const handleUpdateNotifications = (
    updates: Partial<NotificationSettings>
  ) => {
    onUpdate({ notifications: { ...settings.notifications, ...updates } })
    setHasChanges(true)
  }

  const handleReset = () => {
    if (confirm('Reset all settings to defaults?')) {
      onReset?.()
      setHasChanges(false)
    }
  }

# ... trimmed output (due to length) ...

                <div className="p-4 bg-[hsl(var(--warning))]/10 border border-[hsl(var(--warning))]/20 rounded-lg shadow-[0_1px_3px_rgba(15,23,42,0.1)]">
                  <h4 className="text-sm font-medium mb-2">
                    ⚠️ Privacy Notice
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    We take your privacy seriously. Your data is encrypted and
                    never shared with third parties without your explicit
                    consent. You can export or delete your data at any time.
                  </p>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">
                    Notification Channels
                  </h3>
                  {[
                    { key: 'email', label: 'Email Notifications', icon: '📧' },
                    { key: 'push', label: 'Push Notifications', icon: '🔔' },
                    {
                      key: 'desktop',
                      label: 'Desktop Notifications',
                      icon: '💻',
                    },
                    { key: 'sound', label: 'Sound Alerts', icon: '🔊' },
                  ].map(({ key, label, icon }) => (
                    <Switch
                      key={key}
                      label={
                        <span className="text-sm flex items-center gap-1.5">
                          <span>{icon}</span> {label}
                        </span>
                      }
                      containerClassName="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50"
                      checked={
                        settings.notifications[key as keyof NotificationSettings] as boolean
                      }
                      onChange={(event) =>
                        handleUpdateNotifications({ [key]: event.target.checked })
                      }
                      name={key}
                    />
                  ))}
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">Notify Me About</h3>
                  {[
                    { key: 'newMessage', label: 'New Messages' },
                    { key: 'systemUpdates', label: 'System Updates' },
                  ].map(({ key, label }) => (
                    <Switch
                      key={key}
                      label={label}
                      containerClassName="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50"
                      checked={
                        settings.notifications[key as keyof NotificationSettings] as boolean
                      }
                      onChange={(event) =>
                        handleUpdateNotifications({ [key]: event.target.checked })
                      }
                      name={key}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </ScrollArea>
      </CardContent>

      {/* Footer */}
      <div className="p-4 border-t flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          disabled={!onReset}
        >
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
