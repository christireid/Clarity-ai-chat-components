'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  Settings,
  X,
  ChevronRight,
  Moon,
  Sun,
  Monitor,
  Globe,
  Bell,
  Shield,
  Database,
  Zap,
  Palette,
  User,
  Key,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  Check,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@clarity-chat/primitives'
import { Switch } from '@clarity-chat/primitives'
import { Slider } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@clarity-chat/primitives'

interface SettingsPanelProps {
  open: boolean
  onClose: () => void
  className?: string
}

export function SettingsPanel({
  open,
  onClose,
  className,
}: SettingsPanelProps) {
  const [activeSection, setActiveSection] = React.useState('general')

  const sections = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'models', label: 'AI Models', icon: Zap },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'data', label: 'Data & Storage', icon: Database },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'account', label: 'Account', icon: User },
    { id: 'api', label: 'API Keys', icon: Key },
  ]

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          'fixed right-0 top-0 z-50 h-full w-full max-w-2xl bg-background border-l border-border shadow-xl flex',
          'animate-slide-in-right',
          className
        )}
      >
        {/* Sidebar */}
        <div className="w-56 border-r border-border p-4 space-y-1">
          <h2 className="font-semibold text-lg mb-4">Settings</h2>
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                activeSection === section.id
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              <section.icon className="w-4 h-4" />
              {section.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
            <h3 className="font-medium">
              {sections.find((s) => s.id === activeSection)?.label}
            </h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Settings Content */}
          <div className="p-6 space-y-6">
            {activeSection === 'general' && <GeneralSettings />}
            {activeSection === 'appearance' && <AppearanceSettings />}
            {activeSection === 'models' && <ModelsSettings />}
            {activeSection === 'privacy' && <PrivacySettings />}
            {activeSection === 'data' && <DataSettings />}
            {activeSection === 'notifications' && <NotificationSettings />}
            {activeSection === 'account' && <AccountSettings />}
            {activeSection === 'api' && <ApiSettings />}
          </div>
        </div>
      </div>
    </>
  )
}

// Setting Section Components
function SettingGroup({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium">{title}</h4>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function SettingRow({
  label,
  description,
  children,
}: {
  label: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div className="pr-4">
        <p className="text-sm font-medium">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      {children}
    </div>
  )
}

function GeneralSettings() {
  return (
    <div className="space-y-8">
      <SettingGroup title="Language & Region">
        <SettingRow
          label="Language"
          description="Select your preferred language"
        >
          <Select defaultValue="en">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="de">German</SelectItem>
              <SelectItem value="ja">Japanese</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>
        <SettingRow label="Time Zone">
          <Select defaultValue="auto">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto-detect</SelectItem>
              <SelectItem value="utc">UTC</SelectItem>
              <SelectItem value="est">Eastern Time</SelectItem>
              <SelectItem value="pst">Pacific Time</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>
      </SettingGroup>

      <SettingGroup title="Behavior">
        <SettingRow
          label="Auto-save conversations"
          description="Automatically save your chat history"
        >
          <Switch defaultChecked />
        </SettingRow>
        <SettingRow
          label="Show typing indicators"
          description="Display when AI is generating a response"
        >
          <Switch defaultChecked />
        </SettingRow>
        <SettingRow
          label="Enable keyboard shortcuts"
          description="Use shortcuts for common actions"
        >
          <Switch defaultChecked />
        </SettingRow>
      </SettingGroup>
    </div>
  )
}

function AppearanceSettings() {
  const [theme, setTheme] = React.useState('dark')

  return (
    <div className="space-y-8">
      <SettingGroup title="Theme">
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'light', label: 'Light', icon: Sun },
            { id: 'dark', label: 'Dark', icon: Moon },
            { id: 'system', label: 'System', icon: Monitor },
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => setTheme(option.id)}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors',
                theme === option.id
                  ? 'border-accent bg-accent/10'
                  : 'border-border hover:bg-muted'
              )}
            >
              <option.icon className="w-5 h-5" />
              <span className="text-sm">{option.label}</span>
            </button>
          ))}
        </div>
      </SettingGroup>

      <SettingGroup title="Display">
        <SettingRow label="Font size">
          <Select defaultValue="medium">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>
        <SettingRow label="Message density">
          <Select defaultValue="comfortable">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compact">Compact</SelectItem>
              <SelectItem value="comfortable">Comfortable</SelectItem>
              <SelectItem value="spacious">Spacious</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>
        <SettingRow
          label="Show avatars"
          description="Display avatars in conversations"
        >
          <Switch defaultChecked />
        </SettingRow>
        <SettingRow
          label="Show timestamps"
          description="Display time for each message"
        >
          <Switch />
        </SettingRow>
      </SettingGroup>

      <SettingGroup title="Code Blocks">
        <SettingRow label="Syntax theme">
          <Select defaultValue="github-dark">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="github-dark">GitHub Dark</SelectItem>
              <SelectItem value="github-light">GitHub Light</SelectItem>
              <SelectItem value="monokai">Monokai</SelectItem>
              <SelectItem value="dracula">Dracula</SelectItem>
              <SelectItem value="nord">Nord</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>
        <SettingRow label="Show line numbers">
          <Switch defaultChecked />
        </SettingRow>
        <SettingRow label="Enable word wrap">
          <Switch />
        </SettingRow>
      </SettingGroup>
    </div>
  )
}

function ModelsSettings() {
  const [temperature, setTemperature] = React.useState([0.7])
  const [maxTokens, setMaxTokens] = React.useState([4096])

  return (
    <div className="space-y-8">
      <SettingGroup
        title="Default Model"
        description="Choose the AI model for new conversations"
      >
        <Select defaultValue="gpt-4">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4">GPT-4</SelectItem>
            <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
            <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
            <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
            <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
          </SelectContent>
        </Select>
      </SettingGroup>

      <SettingGroup title="Model Parameters">
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Temperature</label>
              <span className="text-sm text-muted-foreground font-mono">
                {temperature[0]}
              </span>
            </div>
            <Slider
              value={temperature}
              onValueChange={setTemperature}
              min={0}
              max={2}
              step={0.1}
            />
            <p className="text-xs text-muted-foreground">
              Higher values make output more random, lower values more
              deterministic.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Max Tokens</label>
              <span className="text-sm text-muted-foreground font-mono">
                {maxTokens[0]}
              </span>
            </div>
            <Slider
              value={maxTokens}
              onValueChange={setMaxTokens}
              min={256}
              max={8192}
              step={256}
            />
            <p className="text-xs text-muted-foreground">
              Maximum number of tokens to generate in the response.
            </p>
          </div>
        </div>
      </SettingGroup>

      <SettingGroup title="Features">
        <SettingRow
          label="Enable web search"
          description="Allow AI to search the web for information"
        >
          <Switch defaultChecked />
        </SettingRow>
        <SettingRow
          label="Enable code execution"
          description="Allow AI to run code in a sandbox"
        >
          <Switch defaultChecked />
        </SettingRow>
        <SettingRow
          label="Enable image generation"
          description="Allow AI to generate images"
        >
          <Switch defaultChecked />
        </SettingRow>
      </SettingGroup>
    </div>
  )
}

function PrivacySettings() {
  return (
    <div className="space-y-8">
      <SettingGroup title="Data Collection">
        <SettingRow
          label="Share usage data"
          description="Help improve our service by sharing anonymous usage data"
        >
          <Switch />
        </SettingRow>
        <SettingRow
          label="Training data opt-out"
          description="Exclude your conversations from AI training"
        >
          <Switch defaultChecked />
        </SettingRow>
      </SettingGroup>

      <SettingGroup title="History">
        <SettingRow
          label="Save chat history"
          description="Store your conversations on our servers"
        >
          <Switch defaultChecked />
        </SettingRow>
        <SettingRow
          label="History retention"
          description="How long to keep your chat history"
        >
          <Select defaultValue="forever">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 days</SelectItem>
              <SelectItem value="30d">30 days</SelectItem>
              <SelectItem value="90d">90 days</SelectItem>
              <SelectItem value="forever">Forever</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>
      </SettingGroup>

      <SettingGroup title="Security">
        <SettingRow
          label="Two-factor authentication"
          description="Add an extra layer of security to your account"
        >
          <Button variant="outline" size="sm">
            Enable
          </Button>
        </SettingRow>
        <SettingRow
          label="Active sessions"
          description="Manage devices where you are logged in"
        >
          <Button variant="outline" size="sm">
            Manage
          </Button>
        </SettingRow>
      </SettingGroup>
    </div>
  )
}

function DataSettings() {
  return (
    <div className="space-y-8">
      <SettingGroup title="Storage">
        <div className="p-4 rounded-lg bg-muted/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Storage used</span>
            <span className="text-sm font-medium">2.4 GB / 10 GB</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-1/4 bg-accent rounded-full" />
          </div>
        </div>
      </SettingGroup>

      <SettingGroup title="Export">
        <SettingRow
          label="Export all data"
          description="Download all your conversations and settings"
        >
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </SettingRow>
        <SettingRow
          label="Import data"
          description="Import conversations from a backup"
        >
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
        </SettingRow>
      </SettingGroup>

      <SettingGroup title="Danger Zone">
        <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/5 space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Delete all conversations</p>
              <p className="text-xs text-muted-foreground mt-1">
                This will permanently delete all your chat history. This action
                cannot be undone.
              </p>
            </div>
          </div>
          <Button variant="destructive" size="sm">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete All
          </Button>
        </div>
      </SettingGroup>
    </div>
  )
}

function NotificationSettings() {
  return (
    <div className="space-y-8">
      <SettingGroup title="Notifications">
        <SettingRow label="Enable notifications">
          <Switch defaultChecked />
        </SettingRow>
        <SettingRow label="Sound" description="Play a sound for new messages">
          <Switch defaultChecked />
        </SettingRow>
        <SettingRow
          label="Desktop notifications"
          description="Show system notifications"
        >
          <Switch />
        </SettingRow>
      </SettingGroup>

      <SettingGroup title="Email Notifications">
        <SettingRow label="Product updates">
          <Switch defaultChecked />
        </SettingRow>
        <SettingRow label="Tips and tutorials">
          <Switch />
        </SettingRow>
        <SettingRow label="Marketing emails">
          <Switch />
        </SettingRow>
      </SettingGroup>
    </div>
  )
}

function AccountSettings() {
  return (
    <div className="space-y-8">
      <SettingGroup title="Profile">
        <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
            <User className="w-8 h-8 text-accent" />
          </div>
          <div className="flex-1">
            <p className="font-medium">John Doe</p>
            <p className="text-sm text-muted-foreground">john@example.com</p>
          </div>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </div>
      </SettingGroup>

      <SettingGroup title="Subscription">
        <div className="p-4 rounded-lg border border-accent bg-accent/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge>Pro</Badge>
              <span className="font-medium">Pro Plan</span>
            </div>
            <span className="text-sm text-muted-foreground">$20/month</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Your next billing date is January 15, 2024
          </p>
          <Button variant="outline" size="sm">
            Manage Subscription
          </Button>
        </div>
      </SettingGroup>

      <SettingGroup title="Danger Zone">
        <SettingRow
          label="Delete account"
          description="Permanently delete your account and all data"
        >
          <Button variant="destructive" size="sm">
            Delete Account
          </Button>
        </SettingRow>
      </SettingGroup>
    </div>
  )
}

function ApiSettings() {
  const [showKey, setShowKey] = React.useState(false)
  const apiKey = 'sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxx'

  return (
    <div className="space-y-8">
      <SettingGroup
        title="API Keys"
        description="Manage your API keys for external integrations"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-border space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Default API Key</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Created Dec 1, 2023
                </p>
              </div>
              <Badge variant="outline" className="text-green-500">
                Active
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 rounded bg-muted text-xs font-mono">
                {showKey ? apiKey : 'sk-proj-••••••••••••••••••••••••••••'}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? 'Hide' : 'Show'}
              </Button>
            </div>
          </div>

          <Button variant="outline">
            <Key className="w-4 h-4 mr-2" />
            Generate New Key
          </Button>
        </div>
      </SettingGroup>

      <SettingGroup title="Connected Services">
        <div className="space-y-3">
          {[
            { name: 'GitHub', connected: true },
            { name: 'Google Drive', connected: false },
            { name: 'Notion', connected: true },
            { name: 'Slack', connected: false },
          ].map((service) => (
            <div
              key={service.name}
              className="flex items-center justify-between p-3 rounded-lg border border-border"
            >
              <span className="font-medium text-sm">{service.name}</span>
              {service.connected ? (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-green-500">
                    <Check className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                  <Button variant="ghost" size="sm">
                    Disconnect
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm">
                  Connect
                </Button>
              )}
            </div>
          ))}
        </div>
      </SettingGroup>
    </div>
  )
}
