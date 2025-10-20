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
  cn,
} from '@clarity-chat/primitives'
import type { UserSettings, AIPersonality, UIPreferences, PrivacySettings, NotificationSettings } from '@clarity-chat/types'

export interface SettingsPanelProps {
  settings: UserSettings
  onUpdate: (settings: Partial<UserSettings>) => void
  onReset?: () => void
  className?: string
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onUpdate,
  onReset,
  className,
}) => {
  const [activeTab, setActiveTab] = React.useState<'ai' | 'ui' | 'privacy' | 'notifications'>('ai')
  const [hasChanges, setHasChanges] = React.useState(false)

  const tabs = [
    { id: 'ai' as const, label: 'AI Behavior', icon: '🤖' },
    { id: 'ui' as const, label: 'Appearance', icon: '🎨' },
    { id: 'privacy' as const, label: 'Privacy', icon: '🔒' },
    { id: 'notifications' as const, label: 'Notifications', icon: '🔔' },
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
    <Card className={cn('h-full flex flex-col', className)}>
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

        {/* Tabs */}
        <div className="flex gap-2 mt-4 overflow-x-auto">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="whitespace-nowrap"
            >
              {tab.icon} {tab.label}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6 pb-4"
          >
            {/* AI Behavior Tab */}
            {activeTab === 'ai' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold mb-3">Response Style</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Tone</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['professional', 'casual', 'technical', 'friendly', 'creative'].map((tone) => (
                          <Button
                            key={tone}
                            variant={settings.aiPersonality.tone === tone ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleUpdateAI({ tone: tone as any })}
                            className="justify-start"
                          >
                            {tone.charAt(0).toUpperCase() + tone.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Verbosity</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['concise', 'balanced', 'detailed', 'comprehensive'].map((level) => (
                          <Button
                            key={level}
                            variant={settings.aiPersonality.verbosity === level ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleUpdateAI({ verbosity: level as any })}
                            className="justify-start"
                          >
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Response Language</label>
                      <select
                        value={settings.aiPersonality.responseLanguage || 'en'}
                        onChange={(e) => handleUpdateAI({ responseLanguage: e.target.value })}
                        className="w-full text-sm border rounded px-3 py-2 bg-background"
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
                  <h3 className="text-sm font-semibold mb-3">Custom Instructions</h3>
                  <Textarea
                    value={settings.aiPersonality.customInstructions || ''}
                    onChange={(e) => handleUpdateAI({ customInstructions: e.target.value })}
                    placeholder="Add custom instructions for how the AI should respond to you..."
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    These instructions will be included in every conversation to personalize responses.
                  </p>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">💡 Pro Tips</h4>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Use "professional" tone for work-related tasks</li>
                    <li>• Set "concise" for quick answers</li>
                    <li>• Add custom instructions like "Always explain like I'm 5"</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'ui' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold mb-3">Theme</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {['light', 'dark', 'system'].map((theme) => (
                      <Button
                        key={theme}
                        variant={settings.uiPreferences.theme === theme ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          handleUpdateUI({ theme: theme as any })
                          // Apply theme
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
                  <h3 className="text-sm font-semibold mb-3">Text Size</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {['small', 'medium', 'large', 'extra-large'].map((size) => (
                      <Button
                        key={size}
                        variant={settings.uiPreferences.fontSize === size ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleUpdateUI({ fontSize: size as any })}
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
                  <h3 className="text-sm font-semibold mb-3">Message Layout</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {['bubbles', 'compact', 'spacious'].map((layout) => (
                      <Button
                        key={layout}
                        variant={settings.uiPreferences.messageLayout === layout ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleUpdateUI({ messageLayout: layout as any })}
                      >
                        {layout.charAt(0).toUpperCase() + layout.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">Display Options</h3>
                  {[
                    { key: 'showTimestamps', label: 'Show Timestamps' },
                    { key: 'showAvatars', label: 'Show Avatars' },
                    { key: 'enableAnimations', label: 'Enable Animations' },
                    { key: 'enableSoundEffects', label: 'Enable Sound Effects' },
                    { key: 'compactMode', label: 'Compact Mode' },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                      <span className="text-sm">{label}</span>
                      <input
                        type="checkbox"
                        checked={settings.uiPreferences[key as keyof UIPreferences] as boolean}
                        onChange={(e) => handleUpdateUI({ [key]: e.target.checked })}
                        className="w-4 h-4"
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">Data Collection</h3>
                  {[
                    { key: 'saveHistory', label: 'Save Chat History', description: 'Store your conversations for future reference' },
                    { key: 'enableAnalytics', label: 'Enable Analytics', description: 'Help us improve by sharing usage data' },
                    { key: 'shareUsageData', label: 'Share Usage Data', description: 'Contribute to AI training and improvements' },
                    { key: 'allowTelemetry', label: 'Allow Telemetry', description: 'Send crash reports and performance data' },
                  ].map(({ key, label, description }) => (
                    <label key={key} className="flex items-start justify-between p-4 rounded-lg border hover:bg-muted/50 cursor-pointer">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{label}</p>
                        <p className="text-xs text-muted-foreground mt-1">{description}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.privacy[key as keyof PrivacySettings] as boolean}
                        onChange={(e) => handleUpdatePrivacy({ [key]: e.target.checked })}
                        className="w-4 h-4 mt-1 ml-4"
                      />
                    </label>
                  ))}
                </div>

                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">⚠️ Privacy Notice</h4>
                  <p className="text-xs text-muted-foreground">
                    We take your privacy seriously. Your data is encrypted and never shared with third parties
                    without your explicit consent. You can export or delete your data at any time.
                  </p>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">Notification Channels</h3>
                  {[
                    { key: 'email', label: 'Email Notifications', icon: '📧' },
                    { key: 'push', label: 'Push Notifications', icon: '🔔' },
                    { key: 'desktop', label: 'Desktop Notifications', icon: '💻' },
                    { key: 'sound', label: 'Sound Alerts', icon: '🔊' },
                  ].map(({ key, label, icon }) => (
                    <label key={key} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                      <span className="text-sm">{icon} {label}</span>
                      <input
                        type="checkbox"
                        checked={settings.notifications[key as keyof NotificationSettings] as boolean}
                        onChange={(e) => handleUpdateNotifications({ [key]: e.target.checked })}
                        className="w-4 h-4"
                      />
                    </label>
                  ))}
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">Notify Me About</h3>
                  {[
                    { key: 'newMessage', label: 'New Messages' },
                    { key: 'systemUpdates', label: 'System Updates' },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                      <span className="text-sm">{label}</span>
                      <input
                        type="checkbox"
                        checked={settings.notifications[key as keyof NotificationSettings] as boolean}
                        onChange={(e) => handleUpdateNotifications({ [key]: e.target.checked })}
                        className="w-4 h-4"
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </ScrollArea>
      </CardContent>

      {/* Footer */}
      <div className="p-4 border-t flex items-center justify-between">
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
