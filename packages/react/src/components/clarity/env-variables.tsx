'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Copy,
  Check,
  AlertCircle,
  Lock,
  Globe,
  Server,
  RefreshCw,
  Search,
  MoreHorizontal,
  Edit2,
  Download,
  Upload,
} from 'lucide-react'
import { Button } from '@clarity-chat/primitives'
import { Input } from '@clarity-chat/primitives'
import { Label } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@clarity-chat/primitives'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@clarity-chat/primitives'
import { Textarea } from '@clarity-chat/primitives'

// Types
export type EnvScope = 'development' | 'preview' | 'production' | 'all'

export interface EnvVariable {
  id: string
  key: string
  value: string
  scope: EnvScope[]
  encrypted?: boolean
  createdAt?: Date
  updatedAt?: Date
}

// Single env variable row
interface EnvVariableRowProps {
  variable: EnvVariable
  onEdit?: (variable: EnvVariable) => void
  onDelete?: (id: string) => void
  onCopy?: (value: string) => void
}

function EnvVariableRow({
  variable,
  onEdit,
  onDelete,
  onCopy,
}: EnvVariableRowProps) {
  const [showValue, setShowValue] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(variable.value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    onCopy?.(variable.value)
  }

  const scopeColors: Record<EnvScope, string> = {
    development: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    preview: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    production: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    all: 'bg-muted text-muted-foreground',
  }

  return (
    <div className="group flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex items-center gap-2">
          <code className="font-mono text-sm font-medium">{variable.key}</code>
          {variable.encrypted && (
            <Lock className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <code className="font-mono text-xs text-muted-foreground truncate max-w-xs">
            {showValue ? variable.value : '••••••••••••'}
          </code>
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100"
            onClick={() => setShowValue(!showValue)}
          >
            {showValue ? (
              <EyeOff className="h-3 w-3" />
            ) : (
              <Eye className="h-3 w-3" />
            )}
          </Button>
        </div>
        <div className="flex flex-wrap gap-1">
          {variable.scope.map((scope) => (
            <Badge
              key={scope}
              variant="outline"
              className={cn('text-xs capitalize h-5', scopeColors[scope])}
            >
              {scope}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="h-4 w-4 text-emerald-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
        {onEdit && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onEdit(variable)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            onClick={() => onDelete(variable.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

// Add/Edit env variable dialog
interface EnvVariableDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  variable?: EnvVariable | null
  onSave: (
    variable: Omit<EnvVariable, 'id' | 'createdAt' | 'updatedAt'>
  ) => void
}

export function EnvVariableDialog({
  open,
  onOpenChange,
  variable,
  onSave,
}: EnvVariableDialogProps) {
  const [key, setKey] = React.useState(variable?.key || '')
  const [value, setValue] = React.useState(variable?.value || '')
  const [scope, setScope] = React.useState<EnvScope[]>(
    variable?.scope || ['all']
  )
  const [encrypted, setEncrypted] = React.useState(variable?.encrypted || false)

  React.useEffect(() => {
    if (variable) {
      setKey(variable.key)
      setValue(variable.value)
      setScope(variable.scope)
      setEncrypted(variable.encrypted || false)
    } else {
      setKey('')
      setValue('')
      setScope(['all'])
      setEncrypted(false)
    }
  }, [variable, open])

  const handleSave = () => {
    onSave({ key, value, scope, encrypted })
    onOpenChange(false)
  }

  const toggleScope = (s: EnvScope) => {
    if (s === 'all') {
      setScope(['all'])
    } else {
      const newScope = scope.includes(s)
        ? scope.filter((x) => x !== s)
        : [...scope.filter((x) => x !== 'all'), s]
      setScope(newScope.length === 0 ? ['all'] : newScope)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {variable
              ? 'Edit Environment Variable'
              : 'Add Environment Variable'}
          </DialogTitle>
          <DialogDescription>
            Environment variables are used to configure your application.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="key">Key</Label>
            <Input
              id="key"
              value={key}
              onChange={(e) =>
                setKey(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '_'))
              }
              placeholder="MY_ENV_VARIABLE"
              className="font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">Value</Label>
            <Textarea
              id="value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter value..."
              className="font-mono text-sm min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Environments</Label>
            <div className="flex flex-wrap gap-2">
              {(
                ['all', 'development', 'preview', 'production'] as EnvScope[]
              ).map((s) => (
                <Button
                  key={s}
                  type="button"
                  variant={scope.includes(s) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleScope(s)}
                  className="capitalize"
                >
                  {s === 'development' && (
                    <Server className="h-3.5 w-3.5 mr-1.5" />
                  )}
                  {s === 'preview' && <Globe className="h-3.5 w-3.5 mr-1.5" />}
                  {s === 'production' && (
                    <Globe className="h-3.5 w-3.5 mr-1.5" />
                  )}
                  {s}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!key || !value}>
            {variable ? 'Save Changes' : 'Add Variable'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Main env variables manager
interface EnvVariablesManagerProps {
  variables: EnvVariable[]
  onAdd?: (
    variable: Omit<EnvVariable, 'id' | 'createdAt' | 'updatedAt'>
  ) => void
  onEdit?: (
    id: string,
    variable: Omit<EnvVariable, 'id' | 'createdAt' | 'updatedAt'>
  ) => void
  onDelete?: (id: string) => void
  onImport?: (variables: Array<{ key: string; value: string }>) => void
  onExport?: () => void
  className?: string
}

export function EnvVariablesManager({
  variables,
  onAdd,
  onEdit,
  onDelete,
  onImport,
  onExport,
  className,
}: EnvVariablesManagerProps) {
  const [search, setSearch] = React.useState('')
  const [scopeFilter, setScopeFilter] = React.useState<EnvScope | 'all'>('all')
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingVariable, setEditingVariable] =
    React.useState<EnvVariable | null>(null)

  const filteredVariables = variables.filter((v) => {
    const matchesSearch = v.key.toLowerCase().includes(search.toLowerCase())
    const matchesScope = scopeFilter === 'all' || v.scope.includes(scopeFilter)
    return matchesSearch && matchesScope
  })

  const handleAdd = () => {
    setEditingVariable(null)
    setDialogOpen(true)
  }

  const handleEditClick = (variable: EnvVariable) => {
    setEditingVariable(variable)
    setDialogOpen(true)
  }

  const handleSave = (
    data: Omit<EnvVariable, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    if (editingVariable) {
      onEdit?.(editingVariable.id, data)
    } else {
      onAdd?.(data)
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold">Environment Variables</h3>
          <p className="text-sm text-muted-foreground">
            {variables.length} variable{variables.length !== 1 ? 's' : ''}{' '}
            configured
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onImport && (
                <DropdownMenuItem onClick={() => {}}>
                  <Upload className="h-4 w-4 mr-2" />
                  Import .env
                </DropdownMenuItem>
              )}
              {onExport && (
                <DropdownMenuItem onClick={onExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export .env
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          {onAdd && (
            <Button size="sm" onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-1" />
              Add Variable
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search variables..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={scopeFilter}
          onValueChange={(v) => setScopeFilter(v as EnvScope | 'all')}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All environments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All environments</SelectItem>
            <SelectItem value="development">Development</SelectItem>
            <SelectItem value="preview">Preview</SelectItem>
            <SelectItem value="production">Production</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Variables list */}
      {filteredVariables.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h4 className="font-medium">No variables found</h4>
          <p className="text-sm text-muted-foreground mt-1">
            {search
              ? 'Try a different search term'
              : 'Add your first environment variable to get started'}
          </p>
          {!search && onAdd && (
            <Button size="sm" className="mt-4" onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-1" />
              Add Variable
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredVariables.map((variable) => (
            <EnvVariableRow
              key={variable.id}
              variable={variable}
              onEdit={onEdit ? handleEditClick : undefined}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {/* Dialog */}
      <EnvVariableDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        variable={editingVariable}
        onSave={handleSave}
      />
    </div>
  )
}
