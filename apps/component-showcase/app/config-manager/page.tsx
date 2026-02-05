'use client'

/**
 * Configuration Manager Page
 * Export/import and manage chat configurations
 */

import { useState, useEffect } from 'react'
import { PageHeader, ComponentSection } from '@/components/component-section'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  Input,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  ScrollArea,
  Separator,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  Label,
  Textarea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Switch,
  cn,
} from '@clarity-chat/primitives'
import {
  Download,
  Upload,
  Share2,
  Save,
  History,
  Copy,
  Check,
  ExternalLink,
  Settings,
  FileJson,
  FileCode,
  Link,
  Trash2,
  Edit3,
  Plus,
  Clock,
  Tag,
  Star,
  Search,
  Filter,
  SortAsc,
  Code,
  GitBranch,
  Package,
  Sparkles,
  Shield,
  Zap,
  Eye,
  X,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle,
  Info,
} from 'lucide-react'
import type { ChatConfiguration, ConfigurationTemplate } from './types'
import {
  getDefaultConfiguration,
  validateConfiguration,
  exportToJSON,
  exportToTypeScript,
  exportToYAML,
  exportToURL,
  downloadFile,
  importFromJSON,
  importFromURL,
  importFromFile,
  saveToLocalStorage,
  getAllFromLocalStorage,
  deleteFromLocalStorage,
  setCurrentConfig,
  getCurrentConfig,
  generateId,
  CONFIGURATION_TEMPLATES,
} from './utils'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// ============================================================================
// EXPORT DIALOG
// ============================================================================
function ExportDialog({
  config,
  open,
  onOpenChange,
}: {
  config: ChatConfiguration
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [format, setFormat] = useState<'json' | 'typescript' | 'yaml' | 'url'>(
    'json'
  )
  const [prettify, setPrettify] = useState(true)
  const [copied, setCopied] = useState(false)

  const getExportedContent = () => {
    switch (format) {
      case 'json':
        return exportToJSON(config, prettify)
      case 'typescript':
        return exportToTypeScript(config)
      case 'yaml':
        return exportToYAML(config)
      case 'url':
        return exportToURL(config)
      default:
        return ''
    }
  }

  const handleDownload = () => {
    const content = getExportedContent()
    const ext = format === 'typescript' ? 'ts' : format === 'yaml' ? 'yaml' : 'json'
    downloadFile(content, `${config.name.replace(/\s+/g, '-')}.${ext}`)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getExportedContent())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Configuration
          </DialogTitle>
          <DialogDescription>
            Export your configuration in various formats
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Format Selection */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { value: 'json', label: 'JSON', icon: FileJson },
              { value: 'typescript', label: 'TypeScript', icon: FileCode },
              { value: 'yaml', label: 'YAML', icon: FileCode },
              { value: 'url', label: 'URL', icon: Link },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFormat(opt.value as any)}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors',
                  format === opt.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-muted'
                )}
              >
                <opt.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{opt.label}</span>
              </button>
            ))}
          </div>

          {/* Options */}
          {format === 'json' && (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <Label htmlFor="prettify">Pretty print</Label>
              <Switch
                id="prettify"
                checked={prettify}
                onCheckedChange={setPrettify}
              />
            </div>
          )}

          {/* Preview */}
          <div className="relative">
            <ScrollArea className="h-[300px] w-full rounded-lg border bg-muted/50 p-4">
              <pre className="text-xs font-mono">
                <code>{getExportedContent()}</code>
              </pre>
            </ScrollArea>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button onClick={handleDownload} className="flex-1 gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button
              variant="outline"
              onClick={handleCopy}
              className="flex-1 gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ============================================================================
// IMPORT DIALOG
// ============================================================================
function ImportDialog({
  open,
  onOpenChange,
  onImport,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (config: ChatConfiguration) => void
}) {
  const [method, setMethod] = useState<'file' | 'paste' | 'url'>('file')
  const [content, setContent] = useState('')
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImporting(true)
    setError(null)

    const result = await importFromFile(file)

    if (result.success && result.config) {
      onImport(result.config)
      onOpenChange(false)
    } else {
      setError(result.errors?.join(', ') || 'Import failed')
    }

    setImporting(false)
  }

  const handlePasteImport = () => {
    if (!content.trim()) {
      setError('Please paste configuration content')
      return
    }

    setImporting(true)
    setError(null)

    const result = importFromJSON(content)

    if (result.success && result.config) {
      onImport(result.config)
      onOpenChange(false)
    } else {
      setError(result.errors?.join(', ') || 'Import failed')
    }

    setImporting(false)
  }

  const handleURLImport = () => {
    if (!content.trim()) {
      setError('Please enter a URL')
      return
    }

    setImporting(true)
    setError(null)

    const result = importFromURL(content)

    if (result.success && result.config) {
      onImport(result.config)
      onOpenChange(false)
    } else {
      setError(result.errors?.join(', ') || 'Import failed')
    }

    setImporting(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Configuration
          </DialogTitle>
          <DialogDescription>
            Import a configuration from file, URL, or clipboard
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Method Selection */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'file', label: 'File Upload', icon: Upload },
              { value: 'paste', label: 'Paste JSON', icon: FileJson },
              { value: 'url', label: 'From URL', icon: Link },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setMethod(opt.value as any)}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors',
                  method === opt.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-muted'
                )}
              >
                <opt.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{opt.label}</span>
              </button>
            ))}
          </div>

          {/* Import Content */}
          {method === 'file' && (
            <div className="space-y-2">
              <Label>Select Configuration File</Label>
              <Input
                type="file"
                accept=".json,.ts,.yaml,.yml"
                onChange={handleFileImport}
                disabled={importing}
              />
            </div>
          )}

          {method === 'paste' && (
            <div className="space-y-2">
              <Label>Paste Configuration JSON</Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your configuration here..."
                className="h-[200px] font-mono text-xs"
              />
              <Button
                onClick={handlePasteImport}
                disabled={importing}
                className="w-full gap-2"
              >
                {importing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Import
              </Button>
            </div>
          )}

          {method === 'url' && (
            <div className="space-y-2">
              <Label>Configuration URL</Label>
              <Input
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="https://..."
              />
              <Button
                onClick={handleURLImport}
                disabled={importing}
                className="w-full gap-2"
              >
                {importing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Import from URL
              </Button>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ============================================================================
// SAVED CONFIGURATIONS
// ============================================================================
function SavedConfigurationsList({
  onLoad,
  onDelete,
}: {
  onLoad: (config: ChatConfiguration) => void
  onDelete: (id: string) => void
}) {
  const [configs, setConfigs] = useState<ChatConfiguration[]>([])
  const [currentConfigId, setCurrentConfigId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadConfigs()
  }, [])

  const loadConfigs = () => {
    setConfigs(getAllFromLocalStorage())
    const current = getCurrentConfig()
    setCurrentConfigId(current?.id || null)
  }

  const filteredConfigs = configs.filter(
    (config) =>
      config.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      config.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Save className="h-5 w-5" />
          Saved Configurations
        </CardTitle>
        <CardDescription>
          {configs.length} configuration{configs.length !== 1 ? 's' : ''} saved
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search configurations..."
            className="pl-9"
          />
        </div>

        {/* Configurations List */}
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {filteredConfigs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Save className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No saved configurations</p>
                <p className="text-sm mt-1">Create and save your first config</p>
              </div>
            ) : (
              filteredConfigs.map((config) => (
                <div
                  key={config.id}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-lg border transition-colors',
                    currentConfigId === config.id
                      ? 'border-primary bg-primary/5'
                      : 'hover:bg-muted'
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium truncate">{config.name}</p>
                      {currentConfigId === config.id && (
                        <Badge className="bg-green-500/20 text-green-600">
                          Active
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {config.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(config.updatedAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />v{config.version}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onLoad(config)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(config.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// CONFIGURATION TEMPLATES
// ============================================================================
function ConfigurationTemplatesGallery({
  onSelect,
}: {
  onSelect: (template: ConfigurationTemplate) => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Configuration Templates
        </CardTitle>
        <CardDescription>
          Start with a pre-configured template
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CONFIGURATION_TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => onSelect(template)}
              className="text-left p-4 rounded-lg border-2 hover:border-primary transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium">{template.name}</h4>
                <Badge variant="outline">{template.category}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {template.description}
              </p>
              <Button variant="ghost" size="sm" className="mt-3 gap-2 w-full">
                <Plus className="h-4 w-4" />
                Use Template
              </Button>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// CONFIGURATION EDITOR
// ============================================================================
function ConfigurationEditor({
  config,
  onChange,
}: {
  config: ChatConfiguration
  onChange: (config: ChatConfiguration) => void
}) {
  const updateConfig = (path: string, value: any) => {
    const keys = path.split('.')
    const updated = { ...config }
    let current: any = updated

    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] }
      current = current[keys[i]]
    }

    current[keys[keys.length - 1]] = value
    onChange(updated)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configuration Editor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic">
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="model">Model</TabsTrigger>
            <TabsTrigger value="theme">Theme</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={config.name}
                onChange={(e) => updateConfig('name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={config.description}
                onChange={(e) => updateConfig('description', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Version</Label>
              <Input
                value={config.version}
                onChange={(e) => updateConfig('version', e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-3">
            {Object.entries(config.features).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <Label htmlFor={key} className="capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </Label>
                <Switch
                  id={key}
                  checked={value}
                  onCheckedChange={(checked) =>
                    updateConfig(`features.${key}`, checked)
                  }
                />
              </div>
            ))}
          </TabsContent>

          <TabsContent value="model" className="space-y-4">
            <div className="space-y-2">
              <Label>Provider</Label>
              <Select
                value={config.model.provider}
                onValueChange={(value) => updateConfig('model.provider', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                  <SelectItem value="cohere">Cohere</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Model Name</Label>
              <Input
                value={config.model.name}
                onChange={(e) => updateConfig('model.name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Temperature ({config.model.temperature})</Label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={config.model.temperature}
                onChange={(e) =>
                  updateConfig('model.temperature', parseFloat(e.target.value))
                }
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>Max Tokens</Label>
              <Input
                type="number"
                value={config.model.maxTokens}
                onChange={(e) =>
                  updateConfig('model.maxTokens', parseInt(e.target.value))
                }
              />
            </div>
          </TabsContent>

          <TabsContent value="theme" className="space-y-4">
            <div className="space-y-2">
              <Label>Theme Mode</Label>
              <Select
                value={config.theme.mode}
                onValueChange={(value) => updateConfig('theme.mode', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Primary Color</Label>
              <Input
                type="color"
                value={config.theme.primaryColor}
                onChange={(e) =>
                  updateConfig('theme.primaryColor', e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Border Radius</Label>
              <Select
                value={config.theme.borderRadius}
                onValueChange={(value) =>
                  updateConfig('theme.borderRadius', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="sm">Small</SelectItem>
                  <SelectItem value="md">Medium</SelectItem>
                  <SelectItem value="lg">Large</SelectItem>
                  <SelectItem value="xl">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function ConfigManagerPage() {
  const [currentConfig, setCurrentConfig] = useState<ChatConfiguration>(
    getDefaultConfiguration()
  )
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    const updated = {
      ...currentConfig,
      updatedAt: new Date().toISOString(),
    }
    setCurrentConfig(updated)
    saveToLocalStorage(updated)
    setCurrentConfig(updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleShare = () => {
    const url = exportToURL(currentConfig)
    setShareUrl(url)
    navigator.clipboard.writeText(url)
  }

  const handleLoadConfig = (config: ChatConfiguration) => {
    setCurrentConfig(config)
    setCurrentConfig(config)
  }

  const handleDeleteConfig = (id: string) => {
    deleteFromLocalStorage(id)
    // Trigger re-render of saved configs
    setCurrentConfig({ ...currentConfig })
  }

  const handleTemplateSelect = (template: ConfigurationTemplate) => {
    const newConfig = {
      ...getDefaultConfiguration(),
      ...template.config,
      id: generateId(),
      name: template.name,
      description: template.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setCurrentConfig(newConfig as ChatConfiguration)
  }

  const validation = validateConfiguration(currentConfig)

  return (
    <div className="space-y-8">
      <PageHeader
        title="Configuration Manager"
        description="Export, import, and manage your chat configurations with templates and version history"
        icon={Settings}
        badge="New"
      />

      {/* Quick Actions */}
      <Card className="glass-card border-0">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleSave} className="gap-2">
              {saved ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Configuration
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setExportDialogOpen(true)}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button
              variant="outline"
              onClick={() => setImportDialogOpen(true)}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Import
            </Button>
            <Button variant="outline" onClick={handleShare} className="gap-2">
              <Share2 className="h-4 w-4" />
              Share URL
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentConfig(getDefaultConfiguration())}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              New Config
            </Button>
          </div>

          {/* Validation Status */}
          {!validation.valid && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-600">
                    Configuration has errors
                  </p>
                  <ul className="text-sm text-red-600 mt-1 space-y-1">
                    {validation.errors.map((error, i) => (
                      <li key={i}>
                        • {error.field}: {error.message}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {shareUrl && (
            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-600">
                    Share URL copied to clipboard!
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 break-all">
                    {shareUrl}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShareUrl(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="space-y-6">
          <ConfigurationEditor
            config={currentConfig}
            onChange={setCurrentConfig}
          />
        </div>

        {/* Saved & Templates */}
        <div className="space-y-6">
          <SavedConfigurationsList
            onLoad={handleLoadConfig}
            onDelete={handleDeleteConfig}
          />
          <ConfigurationTemplatesGallery onSelect={handleTemplateSelect} />
        </div>
      </div>

      {/* Dialogs */}
      <ExportDialog
        config={currentConfig}
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
      />
      <ImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onImport={handleLoadConfig}
      />
    </div>
  )
}
