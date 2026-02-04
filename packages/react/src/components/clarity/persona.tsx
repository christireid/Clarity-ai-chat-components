'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Avatar, AvatarFallback, AvatarImage } from '@clarity-chat/primitives'
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
import { Input } from '@clarity-chat/primitives'
import { Label } from '@clarity-chat/primitives'
import { Textarea } from '@clarity-chat/primitives'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import { ScrollArea } from '@clarity-chat/primitives'
import {
  Bot,
  User,
  Sparkles,
  Settings,
  Plus,
  Pencil,
  Trash2,
  Check,
  Crown,
  Zap,
  Brain,
  Heart,
  Code,
  BookOpen,
  Briefcase,
  Palette,
} from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

export interface Persona {
  id: string
  name: string
  avatar?: string
  tagline?: string
  description?: string
  systemPrompt?: string
  type: 'assistant' | 'user'
  style?: 'professional' | 'casual' | 'technical' | 'creative' | 'friendly'
  icon?: React.ReactNode
  color?: string
  isDefault?: boolean
}

export interface PersonaAvatarProps {
  persona: Persona
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showName?: boolean
  showTagline?: boolean
  className?: string
}

export interface PersonaSelectorProps {
  personas: Persona[]
  selectedId?: string
  onSelect: (persona: Persona) => void
  variant?: 'dropdown' | 'grid' | 'list'
  showDescription?: boolean
  className?: string
}

export interface PersonaCardProps {
  persona: Persona
  isSelected?: boolean
  onClick?: () => void
  onEdit?: () => void
  onDelete?: () => void
  showActions?: boolean
  className?: string
}

export interface PersonaEditorProps {
  persona?: Partial<Persona>
  onSave: (persona: Omit<Persona, 'id'>) => void
  onCancel?: () => void
  type?: 'assistant' | 'user'
}

// ============================================================================
// PERSONA AVATAR
// ============================================================================

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
}

const textSizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
}

export function PersonaAvatar({
  persona,
  size = 'md',
  showName = false,
  showTagline = false,
  className,
}: PersonaAvatarProps) {
  const getDefaultIcon = () => {
    if (persona.type === 'user') return <User className="h-1/2 w-1/2" />
    return persona.icon || <Bot className="h-1/2 w-1/2" />
  }

  const getBackgroundColor = () => {
    if (persona.color) return persona.color
    if (persona.type === 'user') return 'bg-primary'
    return 'bg-gradient-to-br from-violet-500 to-purple-600'
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Avatar className={cn(sizeClasses[size], getBackgroundColor())}>
        <AvatarImage
          src={persona.avatar || '/placeholder.svg'}
          alt={persona.name}
        />
        <AvatarFallback className={cn(getBackgroundColor(), 'text-white')}>
          {persona.avatar
            ? persona.name.charAt(0).toUpperCase()
            : getDefaultIcon()}
        </AvatarFallback>
      </Avatar>
      {(showName || showTagline) && (
        <div className="flex flex-col">
          {showName && (
            <span className={cn('font-medium', textSizeClasses[size])}>
              {persona.name}
            </span>
          )}
          {showTagline && persona.tagline && (
            <span className="text-xs text-muted-foreground">
              {persona.tagline}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// PERSONA CARD
// ============================================================================

export function PersonaCard({
  persona,
  isSelected,
  onClick,
  onEdit,
  onDelete,
  showActions = false,
  className,
}: PersonaCardProps) {
  const styleIcons = {
    professional: <Briefcase className="h-3 w-3" />,
    casual: <Heart className="h-3 w-3" />,
    technical: <Code className="h-3 w-3" />,
    creative: <Palette className="h-3 w-3" />,
    friendly: <Sparkles className="h-3 w-3" />,
  }

  return (
    <div
      className={cn(
        'relative group rounded-xl border p-4 transition-all cursor-pointer',
        isSelected
          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
          : 'border-border hover:border-primary/50 hover:bg-accent/50',
        className
      )}
      onClick={onClick}
    >
      {isSelected && (
        <div className="absolute top-2 right-2">
          <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
            <Check className="h-3 w-3 text-primary-foreground" />
          </div>
        </div>
      )}

      {persona.isDefault && (
        <Badge
          variant="secondary"
          className="absolute top-2 left-2 text-[10px] px-1.5 py-0"
        >
          <Crown className="h-2.5 w-2.5 mr-1" />
          Default
        </Badge>
      )}

      <div className="flex flex-col items-center text-center">
        <PersonaAvatar persona={persona} size="lg" />
        <h3 className="font-semibold mt-3">{persona.name}</h3>
        {persona.tagline && (
          <p className="text-xs text-muted-foreground mt-1">
            {persona.tagline}
          </p>
        )}
        {persona.style && (
          <Badge variant="outline" className="mt-2 text-[10px]">
            {styleIcons[persona.style]}
            <span className="ml-1 capitalize">{persona.style}</span>
          </Badge>
        )}
      </div>

      {persona.description && (
        <p className="text-xs text-muted-foreground mt-3 line-clamp-2 text-center">
          {persona.description}
        </p>
      )}

      {showActions && (onEdit || onDelete) && (
        <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation()
                onEdit()
              }}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          )}
          {onDelete && !persona.isDefault && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// PERSONA SELECTOR
// ============================================================================

export function PersonaSelector({
  personas,
  selectedId,
  onSelect,
  variant = 'grid',
  showDescription = true,
  className,
}: PersonaSelectorProps) {
  if (variant === 'dropdown') {
    return (
      <Select
        value={selectedId}
        onValueChange={(id) => {
          const persona = personas.find((p) => p.id === id)
          if (persona) onSelect(persona)
        }}
      >
        <SelectTrigger className={cn('w-full', className)}>
          <SelectValue placeholder="Select a persona">
            {selectedId && (
              <div className="flex items-center gap-2">
                <PersonaAvatar
                  persona={personas.find((p) => p.id === selectedId)!}
                  size="sm"
                />
                <span>{personas.find((p) => p.id === selectedId)?.name}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {personas.map((persona) => (
            <SelectItem key={persona.id} value={persona.id}>
              <div className="flex items-center gap-2">
                <PersonaAvatar persona={persona} size="sm" />
                <div className="flex flex-col">
                  <span className="font-medium">{persona.name}</span>
                  {showDescription && persona.tagline && (
                    <span className="text-xs text-muted-foreground">
                      {persona.tagline}
                    </span>
                  )}
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  if (variant === 'list') {
    return (
      <div className={cn('space-y-2', className)}>
        {personas.map((persona) => (
          <div
            key={persona.id}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
              selectedId === persona.id
                ? 'border-primary bg-primary/5'
                : 'border-border hover:bg-accent/50'
            )}
            onClick={() => onSelect(persona)}
          >
            <PersonaAvatar persona={persona} size="md" />
            <div className="flex-1 min-w-0">
              <p className="font-medium">{persona.name}</p>
              {showDescription && persona.tagline && (
                <p className="text-sm text-muted-foreground truncate">
                  {persona.tagline}
                </p>
              )}
            </div>
            {selectedId === persona.id && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </div>
        ))}
      </div>
    )
  }

  // Grid variant
  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-3 gap-4', className)}>
      {personas.map((persona) => (
        <PersonaCard
          key={persona.id}
          persona={persona}
          isSelected={selectedId === persona.id}
          onClick={() => onSelect(persona)}
        />
      ))}
    </div>
  )
}

// ============================================================================
// PERSONA EDITOR
// ============================================================================

export function PersonaEditor({
  persona,
  onSave,
  onCancel,
  type = 'assistant',
}: PersonaEditorProps) {
  const [name, setName] = React.useState(persona?.name || '')
  const [tagline, setTagline] = React.useState(persona?.tagline || '')
  const [description, setDescription] = React.useState(
    persona?.description || ''
  )
  const [systemPrompt, setSystemPrompt] = React.useState(
    persona?.systemPrompt || ''
  )
  const [style, setStyle] = React.useState<Persona['style']>(
    persona?.style || 'professional'
  )
  const [avatar, setAvatar] = React.useState(persona?.avatar || '')

  const handleSave = () => {
    onSave({
      name,
      tagline,
      description,
      systemPrompt,
      style,
      avatar,
      type,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={avatar || '/placeholder.svg'} />
          <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xl">
            {name ? (
              name.charAt(0).toUpperCase()
            ) : type === 'assistant' ? (
              <Bot />
            ) : (
              <User />
            )}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Label htmlFor="avatar">Avatar URL</Label>
          <Input
            id="avatar"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="grid gap-4">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={type === 'assistant' ? 'AI Assistant' : 'User'}
          />
        </div>

        <div>
          <Label htmlFor="tagline">Tagline</Label>
          <Input
            id="tagline"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="A brief description..."
          />
        </div>

        <div>
          <Label htmlFor="style">Style</Label>
          <Select
            value={style}
            onValueChange={(v) => setStyle(v as Persona['style'])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" /> Professional
                </div>
              </SelectItem>
              <SelectItem value="casual">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4" /> Casual
                </div>
              </SelectItem>
              <SelectItem value="technical">
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4" /> Technical
                </div>
              </SelectItem>
              <SelectItem value="creative">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4" /> Creative
                </div>
              </SelectItem>
              <SelectItem value="friendly">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> Friendly
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the persona..."
            rows={2}
          />
        </div>

        {type === 'assistant' && (
          <div>
            <Label htmlFor="systemPrompt">System Prompt</Label>
            <Textarea
              id="systemPrompt"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Instructions for the AI..."
              rows={4}
            />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button onClick={handleSave} disabled={!name}>
          Save Persona
        </Button>
      </div>
    </div>
  )
}

// ============================================================================
// PERSONA MANAGER DIALOG
// ============================================================================

export interface PersonaManagerProps {
  personas: Persona[]
  selectedId?: string
  onSelect: (persona: Persona) => void
  onAdd?: (persona: Omit<Persona, 'id'>) => void
  onEdit?: (id: string, persona: Partial<Persona>) => void
  onDelete?: (id: string) => void
  trigger?: React.ReactNode
  type?: 'assistant' | 'user'
}

export function PersonaManager({
  personas,
  selectedId,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
  trigger,
  type = 'assistant',
}: PersonaManagerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isEditing, setIsEditing] = React.useState(false)
  const [editingPersona, setEditingPersona] = React.useState<Persona | null>(
    null
  )

  const handleEdit = (persona: Persona) => {
    setEditingPersona(persona)
    setIsEditing(true)
  }

  const handleSave = (data: Omit<Persona, 'id'>) => {
    if (editingPersona) {
      onEdit?.(editingPersona.id, data)
    } else {
      onAdd?.(data)
    }
    setIsEditing(false)
    setEditingPersona(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Manage Personas
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? editingPersona
                ? 'Edit Persona'
                : 'New Persona'
              : 'Personas'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Configure the persona settings'
              : `Select or manage your ${type} personas`}
          </DialogDescription>
        </DialogHeader>

        {isEditing ? (
          <PersonaEditor
            persona={editingPersona || undefined}
            onSave={handleSave}
            onCancel={() => {
              setIsEditing(false)
              setEditingPersona(null)
            }}
            type={type}
          />
        ) : (
          <>
            <ScrollArea className="max-h-[400px]">
              <div className="grid grid-cols-2 gap-4 pr-4">
                {personas.map((persona) => (
                  <PersonaCard
                    key={persona.id}
                    persona={persona}
                    isSelected={selectedId === persona.id}
                    onClick={() => {
                      onSelect(persona)
                      setIsOpen(false)
                    }}
                    onEdit={() => handleEdit(persona)}
                    onDelete={() => onDelete?.(persona.id)}
                    showActions={!!(onEdit || onDelete)}
                  />
                ))}
              </div>
            </ScrollArea>

            {onAdd && (
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Persona
                </Button>
              </DialogFooter>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ============================================================================
// DEFAULT PERSONAS
// ============================================================================

export const defaultAssistantPersonas: Persona[] = [
  {
    id: 'default-assistant',
    name: 'AI Assistant',
    tagline: 'Your helpful AI companion',
    type: 'assistant',
    style: 'professional',
    icon: <Bot className="h-1/2 w-1/2" />,
    isDefault: true,
  },
  {
    id: 'creative-assistant',
    name: 'Creative Writer',
    tagline: 'Imaginative and expressive',
    type: 'assistant',
    style: 'creative',
    icon: <Palette className="h-1/2 w-1/2" />,
    systemPrompt:
      'You are a creative writing assistant. Be imaginative, use vivid descriptions, and help with creative tasks.',
  },
  {
    id: 'technical-assistant',
    name: 'Code Expert',
    tagline: 'Technical and precise',
    type: 'assistant',
    style: 'technical',
    icon: <Code className="h-1/2 w-1/2" />,
    systemPrompt:
      'You are a technical coding assistant. Provide accurate, well-documented code solutions.',
  },
  {
    id: 'tutor-assistant',
    name: 'Learning Tutor',
    tagline: 'Patient and educational',
    type: 'assistant',
    style: 'friendly',
    icon: <BookOpen className="h-1/2 w-1/2" />,
    systemPrompt:
      'You are an educational tutor. Explain concepts clearly and encourage learning.',
  },
]

export const defaultUserPersona: Persona = {
  id: 'default-user',
  name: 'You',
  type: 'user',
  isDefault: true,
}
