'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Progress } from '@clarity-chat/primitives'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@clarity-chat/primitives'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'
import {
  ImageIcon,
  Download,
  Copy,
  Share2,
  RotateCcw,
  Maximize2,
  MoreHorizontal,
  Sparkles,
  Loader2,
  Check,
  X,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Wand2,
  Palette,
} from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

export interface GeneratedImage {
  id: string
  url: string
  prompt: string
  negativePrompt?: string
  width: number
  height: number
  model?: string
  seed?: number
  createdAt: Date
  status: 'generating' | 'complete' | 'error'
  progress?: number
  error?: string
}

export interface ImageGenerationSettings {
  width: number
  height: number
  steps?: number
  guidance?: number
  seed?: number
  model?: string
}

// ============================================================================
// IMAGE GENERATION CARD
// ============================================================================

interface ImageGenerationCardProps {
  image: GeneratedImage
  onRegenerate?: (image: GeneratedImage) => void
  onDownload?: (image: GeneratedImage) => void
  onShare?: (image: GeneratedImage) => void
  onVariation?: (image: GeneratedImage) => void
  onExpand?: (image: GeneratedImage) => void
  showPrompt?: boolean
  className?: string
}

export function ImageGenerationCard({
  image,
  onRegenerate,
  onDownload,
  onShare,
  onVariation,
  onExpand,
  showPrompt = true,
  className,
}: ImageGenerationCardProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(image.prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        'rounded-lg border border-border overflow-hidden bg-card',
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-muted">
        {image.status === 'generating' ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
            </div>
            <p className="text-sm text-muted-foreground">Generating...</p>
            {image.progress !== undefined && (
              <div className="w-32">
                <Progress value={image.progress} className="h-1" />
              </div>
            )}
          </div>
        ) : image.status === 'error' ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
            <X className="h-8 w-8 text-destructive" />
            <p className="text-sm text-destructive text-center">
              {image.error || 'Generation failed'}
            </p>
            {onRegenerate && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRegenerate(image)}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            )}
          </div>
        ) : (
          <>
            <img
              src={image.url || '/placeholder.svg'}
              alt={image.prompt}
              className="w-full h-full object-cover"
            />
            {/* Hover Actions */}
            <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              {onExpand && (
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => onExpand(image)}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              )}
              {onDownload && (
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => onDownload(image)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
              {onVariation && (
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => onVariation(image)}
                >
                  <Wand2 className="h-4 w-4" />
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {onRegenerate && (
                    <DropdownMenuItem onClick={() => onRegenerate(image)}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Regenerate
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleCopyPrompt}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy prompt
                  </DropdownMenuItem>
                  {onShare && (
                    <DropdownMenuItem onClick={() => onShare(image)}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        )}
      </div>

      {/* Prompt */}
      {showPrompt && image.status === 'complete' && (
        <div className="p-3 border-t border-border">
          <p className="text-xs text-muted-foreground line-clamp-2">
            {image.prompt}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-muted-foreground">
              {image.width}x{image.height}
            </span>
            {image.model && (
              <>
                <span className="text-muted-foreground">|</span>
                <span className="text-xs text-muted-foreground">
                  {image.model}
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// IMAGE GENERATION GRID
// ============================================================================

interface ImageGenerationGridProps {
  images: GeneratedImage[]
  onRegenerate?: (image: GeneratedImage) => void
  onDownload?: (image: GeneratedImage) => void
  onExpand?: (image: GeneratedImage) => void
  columns?: 2 | 3 | 4
  className?: string
}

export function ImageGenerationGrid({
  images,
  onRegenerate,
  onDownload,
  onExpand,
  columns = 2,
  className,
}: ImageGenerationGridProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {images.map((image) => (
        <ImageGenerationCard
          key={image.id}
          image={image}
          onRegenerate={onRegenerate}
          onDownload={onDownload}
          onExpand={onExpand}
          showPrompt={false}
        />
      ))}
    </div>
  )
}

// ============================================================================
// IMAGE GENERATION PREVIEW
// ============================================================================

interface ImageGenerationPreviewProps {
  image: GeneratedImage
  isOpen: boolean
  onClose: () => void
  onPrevious?: () => void
  onNext?: () => void
  onDownload?: (image: GeneratedImage) => void
  onRegenerate?: (image: GeneratedImage) => void
  onVariation?: (image: GeneratedImage) => void
}

export function ImageGenerationPreview({
  image,
  isOpen,
  onClose,
  onPrevious,
  onNext,
  onDownload,
  onRegenerate,
  onVariation,
}: ImageGenerationPreviewProps) {
  const [zoom, setZoom] = React.useState(1)

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3))
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5))

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl p-0 gap-0">
        <DialogHeader className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-sm font-normal line-clamp-1 pr-4">
              {image.prompt}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-xs text-muted-foreground w-12 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button variant="ghost" size="icon" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="relative bg-muted overflow-auto max-h-[70vh]">
          {onPrevious && (
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10"
              onClick={onPrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          <div className="flex items-center justify-center min-h-[400px] p-4">
            <img
              src={image.url || '/placeholder.svg'}
              alt={image.prompt}
              className="max-w-full transition-transform"
              style={{ transform: `scale(${zoom})` }}
            />
          </div>
          {onNext && (
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10"
              onClick={onNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {image.width}x{image.height} | {image.model || 'Unknown model'}
            {image.seed && ` | Seed: ${image.seed}`}
          </div>
          <div className="flex items-center gap-2">
            {onRegenerate && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRegenerate(image)}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
            )}
            {onVariation && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onVariation(image)}
              >
                <Wand2 className="h-4 w-4 mr-2" />
                Variation
              </Button>
            )}
            {onDownload && (
              <Button size="sm" onClick={() => onDownload(image)}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ============================================================================
// IMAGE GENERATION PROGRESS
// ============================================================================

interface ImageGenerationProgressProps {
  progress: number
  status: string
  estimatedTime?: number
  onCancel?: () => void
  className?: string
}

export function ImageGenerationProgress({
  progress,
  status,
  estimatedTime,
  onCancel,
  className,
}: ImageGenerationProgressProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border p-4 bg-card space-y-3',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span className="text-sm font-medium">{status}</span>
        </div>
        {onCancel && (
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
      <Progress value={progress} className="h-2" />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{progress}% complete</span>
        {estimatedTime && <span>~{estimatedTime}s remaining</span>}
      </div>
    </div>
  )
}

// ============================================================================
// IMAGE PROMPT INPUT
// ============================================================================

interface ImagePromptInputProps {
  value: string
  onChange: (value: string) => void
  onGenerate: () => void
  isGenerating?: boolean
  placeholder?: string
  suggestions?: string[]
  className?: string
}

export function ImagePromptInput({
  value,
  onChange,
  onGenerate,
  isGenerating = false,
  placeholder = 'Describe the image you want to create...',
  suggestions = [],
  className,
}: ImagePromptInputProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full min-h-[100px] rounded-lg border border-input bg-background px-4 py-3 pr-12 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              onGenerate()
            }
          }}
        />
        <Button
          size="icon"
          className="absolute bottom-3 right-3"
          onClick={onGenerate}
          disabled={!value.trim() || isGenerating}
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
        </Button>
      </div>
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs bg-transparent"
              onClick={() =>
                onChange(value ? `${value}, ${suggestion}` : suggestion)
              }
            >
              + {suggestion}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// STYLE PRESET SELECTOR
// ============================================================================

interface StylePreset {
  id: string
  name: string
  preview?: string
  promptSuffix: string
}

interface StylePresetSelectorProps {
  presets: StylePreset[]
  selected?: string
  onSelect: (preset: StylePreset) => void
  className?: string
}

export function StylePresetSelector({
  presets,
  selected,
  onSelect,
  className,
}: StylePresetSelectorProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Palette className="h-4 w-4" />
        <span>Style Presets</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelect(preset)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm border transition-colors',
              selected === preset.id
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background border-border hover:border-primary/50'
            )}
          >
            {preset.name}
          </button>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// HOOKS
// ============================================================================

export function useImageGeneration() {
  const [images, setImages] = React.useState<GeneratedImage[]>([])
  const [isGenerating, setIsGenerating] = React.useState(false)

  const generateImage = React.useCallback(
    async (
      prompt: string,
      settings?: ImageGenerationSettings,
      onProgress?: (progress: number) => void
    ) => {
      const id = `img-${Date.now()}`
      const newImage: GeneratedImage = {
        id,
        url: '',
        prompt,
        width: settings?.width || 512,
        height: settings?.height || 512,
        model: settings?.model,
        seed: settings?.seed,
        createdAt: new Date(),
        status: 'generating',
        progress: 0,
      }

      setImages((prev) => [newImage, ...prev])
      setIsGenerating(true)

      // Simulated generation - replace with actual API call
      try {
        // Simulate progress
        for (let i = 0; i <= 100; i += 10) {
          await new Promise((resolve) => setTimeout(resolve, 200))
          setImages((prev) =>
            prev.map((img) => (img.id === id ? { ...img, progress: i } : img))
          )
          onProgress?.(i)
        }

        // Simulate completion
        setImages((prev) =>
          prev.map((img) =>
            img.id === id
              ? {
                  ...img,
                  status: 'complete',
                  url: `https://picsum.photos/seed/${id}/${settings?.width || 512}/${settings?.height || 512}`,
                }
              : img
          )
        )
      } catch (error) {
        setImages((prev) =>
          prev.map((img) =>
            img.id === id
              ? { ...img, status: 'error', error: 'Generation failed' }
              : img
          )
        )
      } finally {
        setIsGenerating(false)
      }

      return id
    },
    []
  )

  const removeImage = React.useCallback((imageId: string) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId))
  }, [])

  return {
    images,
    isGenerating,
    generateImage,
    removeImage,
    setImages,
  }
}
