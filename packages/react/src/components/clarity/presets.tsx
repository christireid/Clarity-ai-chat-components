'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Input } from '@clarity-chat/primitives'
import { Label } from '@clarity-chat/primitives'
import { Textarea } from '@clarity-chat/primitives'
import { Switch } from '@clarity-chat/primitives'
import { Slider } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import { ScrollArea } from '@clarity-chat/primitives'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@clarity-chat/primitives'
import {
  Settings2,
  Save,
  FolderOpen,
  Plus,
  Trash2,
  Copy,
  Star,
  MoreVertical,
  Check,
  Sliders,
  Thermometer,
  Hash,
  Clock,
  Sparkles,
  ChevronDown,
} from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

export interface Preset {
  id: string
  name: string
  description?: string
  model?: string
  temperature?: number
  maxTokens?: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
  systemPrompt?: string
  stopSequences?: string[]
  isDefault?: boolean
  isStarred?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface PresetSelectorProps {
  presets: Preset[]
  selectedId?: string
  onSelect: (preset: Preset) => void
  onSave?: (preset: Omit<Preset, 'id'>) => void
  onDelete?: (id: string) => void
  onDuplicate?: (preset: Preset) => void
  onStar?: (id: string) => void
  currentSettings?: Partial<Preset>
  variant?: 'dropdown' | 'button' | 'minimal'
  className?: string
}

export interface PresetEditorProps {
  preset?: Partial<Preset>
  onSave: (preset: Omit<Preset, 'id'>) => void
  onCancel?: () => void
  availableModels?: string[]
}

export interface ParameterSliderProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  description?: string
  icon?: React.ReactNode
}

// ============================================================================
// PRESET SELECTOR
// ============================================================================

export function PresetSelector({
  presets,
  selectedId,
  onSelect,
  onSave,
  onDelete,
  onDuplicate,
  onStar,
  currentSettings,
  variant = 'dropdown',
  className,
}: PresetSelectorProps) {
  const [isEditorOpen, setIsEditorOpen] = React.useState(false)
  const selectedPreset = presets.find((p) => p.id === selectedId)
  const starredPresets = presets.filter((p) => p.isStarred)
  const regularPresets = presets.filter((p) => !p.isStarred)

  if (variant === 'minimal') {
    return (
      <Select
        value={selectedId}
        onValueChange={(id) => {
          const preset = presets.find((p) => p.id === id)
          if (preset) onSelect(preset)
        }}
      >
        <SelectTrigger className={cn('w-[180px]', className)}>
          <SelectValue placeholder="Select preset" />
        </SelectTrigger>
        <SelectContent>
          {presets.map((preset) => (
            <SelectItem key={preset.id} value={preset.id}>
              <div className="flex items-center gap-2">
                {preset.isStarred && (
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                )}
                {preset.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant === 'button' ? 'default' : 'outline'}
            className="gap-2"
          >
            <Settings2 className="h-4 w-4" />
            {selectedPreset?.name || 'Select Preset'}
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          {starredPresets.length > 0 && (
            <>
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Star className="h-3 w-3" />
                Starred
              </div>
              {starredPresets.map((preset) => (
                <PresetMenuItem
                  key={preset.id}
                  preset={preset}
                  isSelected={selectedId === preset.id}
                  onSelect={() => onSelect(preset)}
                  onDelete={onDelete}
                  onDuplicate={onDuplicate}
                  onStar={onStar}
                />
              ))}
              <DropdownMenuSeparator />
            </>
          )}

          {regularPresets.length > 0 && (
            <>
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                All Presets
              </div>
              {regularPresets.map((preset) => (
                <PresetMenuItem
                  key={preset.id}
                  preset={preset}
                  isSelected={selectedId === preset.id}
                  onSelect={() => onSelect(preset)}
                  onDelete={onDelete}
                  onDuplicate={onDuplicate}
                  onStar={onStar}
                />
              ))}
            </>
          )}

          {onSave && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsEditorOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create new preset
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {onSave && (
        <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Preset</DialogTitle>
              <DialogDescription>
                Save your current settings as a reusable preset
              </DialogDescription>
            </DialogHeader>
            <PresetEditor
              preset={currentSettings}
              onSave={(preset) => {
                onSave(preset)
                setIsEditorOpen(false)
              }}
              onCancel={() => setIsEditorOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// ============================================================================
// PRESET MENU ITEM
// ============================================================================

function PresetMenuItem({
  preset,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
  onStar,
}: {
  preset: Preset
  isSelected: boolean
  onSelect: () => void
  onDelete?: (id: string) => void
  onDuplicate?: (preset: Preset) => void
  onStar?: (id: string) => void
}) {
  return (
    <div className="relative group">
      <DropdownMenuItem
        className={cn('pr-8', isSelected && 'bg-accent')}
        onClick={onSelect}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {isSelected && <Check className="h-4 w-4 text-primary" />}
          <div className="flex-1 min-w-0">
            <p className="truncate font-medium">{preset.name}</p>
            {preset.description && (
              <p className="text-xs text-muted-foreground truncate">
                {preset.description}
              </p>
            )}
          </div>
        </div>
      </DropdownMenuItem>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 opacity-0 group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {onStar && (
            <DropdownMenuItem onClick={() => onStar(preset.id)}>
              <Star
                className={cn(
                  'h-4 w-4 mr-2',
                  preset.isStarred && 'fill-yellow-400 text-yellow-400'
                )}
              />
              {preset.isStarred ? 'Unstar' : 'Star'}
            </DropdownMenuItem>
          )}
          {onDuplicate && (
            <DropdownMenuItem onClick={() => onDuplicate(preset)}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
          )}
          {onDelete && !preset.isDefault && (
            <DropdownMenuItem
              onClick={() => onDelete(preset.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// ============================================================================
// PRESET EDITOR
// ============================================================================

export function PresetEditor({
  preset,
  onSave,
  onCancel,
  availableModels = [
    'gpt-4',
    'gpt-4-turbo',
    'gpt-3.5-turbo',
    'claude-3-opus',
    'claude-3-sonnet',
  ],
}: PresetEditorProps) {
  const [name, setName] = React.useState(preset?.name || '')
  const [description, setDescription] = React.useState(
    preset?.description || ''
  )
  const [model, setModel] = React.useState(preset?.model || 'gpt-4')
  const [temperature, setTemperature] = React.useState(
    preset?.temperature ?? 0.7
  )
  const [maxTokens, setMaxTokens] = React.useState(preset?.maxTokens ?? 4096)
  const [topP, setTopP] = React.useState(preset?.topP ?? 1)
  const [frequencyPenalty, setFrequencyPenalty] = React.useState(
    preset?.frequencyPenalty ?? 0
  )
  const [presencePenalty, setPresencePenalty] = React.useState(
    preset?.presencePenalty ?? 0
  )
  const [systemPrompt, setSystemPrompt] = React.useState(
    preset?.systemPrompt || ''
  )

  const handleSave = () => {
    onSave({
      name,
      description,
      model,
      temperature,
      maxTokens,
      topP,
      frequencyPenalty,
      presencePenalty,
      systemPrompt,
    })
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Preset"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A brief description..."
          />
        </div>

        <div>
          <Label>Model</Label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableModels.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <Sliders className="h-4 w-4" />
          Parameters
        </h4>

        <ParameterSlider
          label="Temperature"
          value={temperature}
          onChange={setTemperature}
          min={0}
          max={2}
          step={0.1}
          description="Higher values make output more random"
          icon={<Thermometer className="h-3.5 w-3.5" />}
        />

        <ParameterSlider
          label="Max Tokens"
          value={maxTokens}
          onChange={setMaxTokens}
          min={1}
          max={128000}
          step={1}
          description="Maximum length of response"
          icon={<Hash className="h-3.5 w-3.5" />}
        />

        <ParameterSlider
          label="Top P"
          value={topP}
          onChange={setTopP}
          min={0}
          max={1}
          step={0.05}
          description="Nucleus sampling threshold"
          icon={<Sparkles className="h-3.5 w-3.5" />}
        />

        <ParameterSlider
          label="Frequency Penalty"
          value={frequencyPenalty}
          onChange={setFrequencyPenalty}
          min={-2}
          max={2}
          step={0.1}
          description="Reduce repetition of tokens"
        />

        <ParameterSlider
          label="Presence Penalty"
          value={presencePenalty}
          onChange={setPresencePenalty}
          min={-2}
          max={2}
          step={0.1}
          description="Encourage new topics"
        />
      </div>

      <div className="pt-4 border-t">
        <Label htmlFor="systemPrompt">System Prompt</Label>
        <Textarea
          id="systemPrompt"
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          placeholder="You are a helpful assistant..."
          rows={3}
          className="mt-2"
        />
      </div>

      <DialogFooter className="pt-4">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button onClick={handleSave} disabled={!name}>
          <Save className="h-4 w-4 mr-2" />
          Save Preset
        </Button>
      </DialogFooter>
    </div>
  )
}

// ============================================================================
// PARAMETER SLIDER
// ============================================================================

export function ParameterSlider({
  label,
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.1,
  description,
  icon,
}: ParameterSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-1.5 text-sm">
          {icon}
          {label}
        </Label>
        <span className="text-sm font-mono text-muted-foreground">
          {value.toFixed(step < 1 ? 1 : 0)}
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  )
}

// ============================================================================
// QUICK SETTINGS
// ============================================================================

export interface QuickSettingsProps {
  temperature?: number
  maxTokens?: number
  model?: string
  onTemperatureChange?: (value: number) => void
  onMaxTokensChange?: (value: number) => void
  onModelChange?: (value: string) => void
  availableModels?: string[]
  className?: string
}

export function QuickSettings({
  temperature = 0.7,
  maxTokens = 4096,
  model = 'gpt-4',
  onTemperatureChange,
  onMaxTokensChange,
  onModelChange,
  availableModels = ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  className,
}: QuickSettingsProps) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      {onModelChange && (
        <Select value={model} onValueChange={onModelChange}>
          <SelectTrigger className="w-[140px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableModels.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {onTemperatureChange && (
        <div className="flex items-center gap-2">
          <Thermometer className="h-3.5 w-3.5 text-muted-foreground" />
          <Slider
            value={[temperature]}
            onValueChange={([v]) => onTemperatureChange(v)}
            min={0}
            max={2}
            step={0.1}
            className="w-20"
          />
          <span className="text-xs text-muted-foreground w-6">
            {temperature.toFixed(1)}
          </span>
        </div>
      )}

      {onMaxTokensChange && (
        <div className="flex items-center gap-2">
          <Hash className="h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="number"
            value={maxTokens}
            onChange={(e) => onMaxTokensChange(Number(e.target.value))}
            className="w-20 h-8"
            min={1}
            max={128000}
          />
        </div>
      )}
    </div>
  )
}

// ============================================================================
// DEFAULT PRESETS
// ============================================================================

export const defaultPresets: Preset[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Balanced settings for general use',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 4096,
    topP: 1,
    isDefault: true,
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Higher temperature for creative tasks',
    model: 'gpt-4',
    temperature: 1.2,
    maxTokens: 4096,
    topP: 0.9,
  },
  {
    id: 'precise',
    name: 'Precise',
    description: 'Lower temperature for factual responses',
    model: 'gpt-4',
    temperature: 0.2,
    maxTokens: 4096,
    topP: 1,
  },
  {
    id: 'fast',
    name: 'Fast',
    description: 'Quick responses with smaller model',
    model: 'gpt-3.5-turbo',
    temperature: 0.5,
    maxTokens: 2048,
    topP: 1,
  },
]
