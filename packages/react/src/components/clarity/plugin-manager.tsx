'use client'

import * as React from 'react'
import {
  Puzzle,
  Plus,
  Search,
  Settings,
  Trash2,
  Power,
  ExternalLink,
  Download,
  Star,
  Shield,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  Package,
  Code,
  Globe,
  Database,
  MessageSquare,
  ImageIcon,
  FileText,
  Zap,
} from 'lucide-react'
import { Button } from '@clarity-chat/primitives'
import { Input } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import { Switch } from '@clarity-chat/primitives'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@clarity-chat/primitives'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@clarity-chat/primitives'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@clarity-chat/primitives'
import { ScrollArea } from '@clarity-chat/primitives'
import { cn } from '@clarity-chat/primitives'

// Types
export interface Plugin {
  id: string
  name: string
  description: string
  version: string
  author: string
  category: 'tools' | 'models' | 'integrations' | 'ui' | 'data' | 'media'
  enabled: boolean
  installed: boolean
  verified: boolean
  rating?: number
  downloads?: number
  icon?: React.ReactNode
  permissions?: string[]
  config?: PluginConfig[]
}

export interface PluginConfig {
  id: string
  label: string
  type: 'text' | 'number' | 'boolean' | 'select'
  value: string | number | boolean
  options?: { label: string; value: string }[]
  description?: string
}

interface PluginCardProps {
  plugin: Plugin
  onToggle?: (id: string, enabled: boolean) => void
  onUninstall?: (id: string) => void
  onConfigure?: (id: string) => void
  onInstall?: (id: string) => void
}

const categoryIcons: Record<Plugin['category'], React.ReactNode> = {
  tools: <Code className="h-4 w-4" />,
  models: <Zap className="h-4 w-4" />,
  integrations: <Globe className="h-4 w-4" />,
  ui: <Package className="h-4 w-4" />,
  data: <Database className="h-4 w-4" />,
  media: <ImageIcon className="h-4 w-4" />,
}

// Plugin Card Component
export function PluginCard({
  plugin,
  onToggle,
  onUninstall,
  onConfigure,
  onInstall,
}: PluginCardProps) {
  return (
    <Card
      className={cn(
        'transition-all',
        !plugin.enabled && plugin.installed && 'opacity-60'
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              {plugin.icon || (
                <Puzzle className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">{plugin.name}</CardTitle>
                {plugin.verified && <Shield className="h-4 w-4 text-accent" />}
              </div>
              <CardDescription className="text-xs">
                v{plugin.version} by {plugin.author}
              </CardDescription>
            </div>
          </div>
          {plugin.installed ? (
            <div className="flex items-center gap-2">
              <Switch
                checked={plugin.enabled}
                onCheckedChange={(checked) => onToggle?.(plugin.id, checked)}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onConfigure?.(plugin.id)}>
                    <Settings className="mr-2 h-4 w-4" />
                    Configure
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onUninstall?.(plugin.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Uninstall
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button size="sm" onClick={() => onInstall?.(plugin.id)}>
              <Download className="mr-2 h-4 w-4" />
              Install
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">
          {plugin.description}
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            {categoryIcons[plugin.category]}
            <span className="capitalize">{plugin.category}</span>
          </div>
          {plugin.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              <span>{plugin.rating.toFixed(1)}</span>
            </div>
          )}
          {plugin.downloads && (
            <div className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              <span>{plugin.downloads.toLocaleString()}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Plugin Manager Component
interface PluginManagerProps {
  plugins: Plugin[]
  onToggle?: (id: string, enabled: boolean) => void
  onInstall?: (id: string) => void
  onUninstall?: (id: string) => void
  onConfigure?: (id: string) => void
  onRefresh?: () => void
}

export function PluginManager({
  plugins,
  onToggle,
  onInstall,
  onUninstall,
  onConfigure,
  onRefresh,
}: PluginManagerProps) {
  const [search, setSearch] = React.useState('')
  const [activeTab, setActiveTab] = React.useState('installed')
  const [categoryFilter, setCategoryFilter] = React.useState<
    Plugin['category'] | 'all'
  >('all')

  const installedPlugins = plugins.filter((p) => p.installed)
  const availablePlugins = plugins.filter((p) => !p.installed)

  const filteredPlugins = (
    activeTab === 'installed' ? installedPlugins : availablePlugins
  ).filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory =
      categoryFilter === 'all' || p.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-4 p-4 border-b">
        <div className="flex items-center gap-2">
          <Puzzle className="h-5 w-5" />
          <h2 className="font-semibold">Plugins</h2>
          <Badge variant="secondary">{installedPlugins.length} installed</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Plugin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Custom Plugin</DialogTitle>
                <DialogDescription>
                  Enter a plugin URL or upload a plugin package
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input placeholder="https://plugin-url.com/manifest.json" />
                <Button className="w-full">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Load Plugin
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search plugins..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {categoryFilter === 'all' ? 'All Categories' : categoryFilter}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setCategoryFilter('all')}>
                All Categories
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {(
                [
                  'tools',
                  'models',
                  'integrations',
                  'ui',
                  'data',
                  'media',
                ] as const
              ).map((cat) => (
                <DropdownMenuItem
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                >
                  <span className="mr-2">{categoryIcons[cat]}</span>
                  <span className="capitalize">{cat}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="installed">
              Installed ({installedPlugins.length})
            </TabsTrigger>
            <TabsTrigger value="browse">
              Browse ({availablePlugins.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="installed" className="mt-4">
            <ScrollArea className="h-[400px]">
              <div className="space-y-3 pr-4">
                {filteredPlugins.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Puzzle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No plugins installed</p>
                  </div>
                ) : (
                  filteredPlugins.map((plugin) => (
                    <PluginCard
                      key={plugin.id}
                      plugin={plugin}
                      onToggle={onToggle}
                      onUninstall={onUninstall}
                      onConfigure={onConfigure}
                    />
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="browse" className="mt-4">
            <ScrollArea className="h-[400px]">
              <div className="space-y-3 pr-4">
                {filteredPlugins.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No plugins found</p>
                  </div>
                ) : (
                  filteredPlugins.map((plugin) => (
                    <PluginCard
                      key={plugin.id}
                      plugin={plugin}
                      onInstall={onInstall}
                    />
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Plugin Status Badge
interface PluginStatusProps {
  status: 'active' | 'inactive' | 'error' | 'updating'
  className?: string
}

export function PluginStatus({ status, className }: PluginStatusProps) {
  const statusConfig = {
    active: { icon: CheckCircle2, label: 'Active', color: 'text-green-500' },
    inactive: {
      icon: Power,
      label: 'Inactive',
      color: 'text-muted-foreground',
    },
    error: { icon: AlertCircle, label: 'Error', color: 'text-destructive' },
    updating: { icon: RefreshCw, label: 'Updating', color: 'text-yellow-500' },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 text-xs',
        config.color,
        className
      )}
    >
      <Icon
        className={cn('h-3.5 w-3.5', status === 'updating' && 'animate-spin')}
      />
      <span>{config.label}</span>
    </div>
  )
}

// Compact Plugin List
interface PluginListProps {
  plugins: Plugin[]
  onToggle?: (id: string, enabled: boolean) => void
}

export function PluginList({ plugins, onToggle }: PluginListProps) {
  return (
    <div className="divide-y divide-border rounded-lg border">
      {plugins.map((plugin) => (
        <div
          key={plugin.id}
          className={cn(
            'flex items-center justify-between p-3 transition-colors',
            !plugin.enabled && 'bg-muted/50'
          )}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-background border">
              {plugin.icon || (
                <Puzzle className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{plugin.name}</span>
                {plugin.verified && <Shield className="h-3 w-3 text-accent" />}
              </div>
              <span className="text-xs text-muted-foreground">
                v{plugin.version}
              </span>
            </div>
          </div>
          <Switch
            checked={plugin.enabled}
            onCheckedChange={(checked) => onToggle?.(plugin.id, checked)}
          />
        </div>
      ))}
    </div>
  )
}
