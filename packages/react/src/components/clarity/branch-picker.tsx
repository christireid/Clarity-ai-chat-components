'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@clarity-chat/primitives'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'
import {
  ChevronLeft,
  ChevronRight,
  GitBranch,
  GitFork,
  MoreHorizontal,
  Trash2,
  Star,
  Clock,
  MessageSquare,
} from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

export interface Branch {
  id: string
  parentId?: string
  messageId: string
  content: string
  createdAt: Date
  isStarred?: boolean
  childCount?: number
}

export interface BranchPickerProps {
  branches: Branch[]
  currentBranchIndex: number
  onBranchChange: (index: number) => void
  onCreateBranch?: () => void
  onDeleteBranch?: (branchId: string) => void
  onStarBranch?: (branchId: string) => void
  variant?: 'default' | 'compact' | 'minimal'
  showBranchCount?: boolean
  showNavigation?: boolean
  className?: string
}

export interface BranchTreeProps {
  branches: Branch[]
  currentBranchId: string
  onSelectBranch: (branchId: string) => void
  onDeleteBranch?: (branchId: string) => void
  onStarBranch?: (branchId: string) => void
  className?: string
}

export interface ForkButtonProps {
  onFork: () => void
  disabled?: boolean
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  showLabel?: boolean
  className?: string
}

export interface MessageBranchIndicatorProps {
  branchCount: number
  currentBranch: number
  onPrevious?: () => void
  onNext?: () => void
  className?: string
}

// ============================================================================
// BRANCH PICKER - Main navigation component
// ============================================================================

export function BranchPicker({
  branches,
  currentBranchIndex,
  onBranchChange,
  onCreateBranch,
  onDeleteBranch,
  onStarBranch,
  variant = 'default',
  showBranchCount = true,
  showNavigation = true,
  className,
}: BranchPickerProps) {
  const currentBranch = branches[currentBranchIndex]
  const hasPrevious = currentBranchIndex > 0
  const hasNext = currentBranchIndex < branches.length - 1

  const handlePrevious = () => {
    if (hasPrevious) {
      onBranchChange(currentBranchIndex - 1)
    }
  }

  const handleNext = () => {
    if (hasNext) {
      onBranchChange(currentBranchIndex + 1)
    }
  }

  if (variant === 'minimal') {
    return (
      <div className={cn('inline-flex items-center gap-1', className)}>
        <span className="text-xs text-muted-foreground">
          {currentBranchIndex + 1}/{branches.length}
        </span>
        {showNavigation && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              onClick={handlePrevious}
              disabled={!hasPrevious}
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              onClick={handleNext}
              disabled={!hasNext}
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </>
        )}
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <TooltipProvider>
        <div
          className={cn(
            'inline-flex items-center gap-0.5 rounded-md border border-border bg-background p-0.5',
            className
          )}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handlePrevious}
                disabled={!hasPrevious}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Previous version</TooltipContent>
          </Tooltip>

          {showBranchCount && (
            <span className="min-w-[3rem] text-center text-xs font-medium">
              {currentBranchIndex + 1} / {branches.length}
            </span>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleNext}
                disabled={!hasNext}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Next version</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    )
  }

  // Default variant
  return (
    <TooltipProvider>
      <div
        className={cn(
          'inline-flex items-center gap-1 rounded-lg border border-border bg-background p-1',
          className
        )}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handlePrevious}
              disabled={!hasPrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Previous version</TooltipContent>
        </Tooltip>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-7 px-2 gap-1.5">
              <GitBranch className="h-3.5 w-3.5" />
              {showBranchCount && (
                <span className="text-xs font-medium">
                  {currentBranchIndex + 1} / {branches.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-64">
            {branches.map((branch, index) => (
              <DropdownMenuItem
                key={branch.id}
                className={cn(
                  'flex items-start gap-2 p-2',
                  index === currentBranchIndex && 'bg-accent'
                )}
                onClick={() => onBranchChange(index)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    {branch.isStarred && (
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    )}
                    <span className="text-sm font-medium">
                      Version {index + 1}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {branch.content.slice(0, 50)}...
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(branch.createdAt).toLocaleTimeString()}
                  </div>
                </div>
                {index === currentBranchIndex && (
                  <div className="h-2 w-2 rounded-full bg-primary" />
                )}
              </DropdownMenuItem>
            ))}
            {(onCreateBranch || onDeleteBranch || onStarBranch) && (
              <>
                <DropdownMenuSeparator />
                {onCreateBranch && (
                  <DropdownMenuItem onClick={onCreateBranch}>
                    <GitFork className="h-4 w-4 mr-2" />
                    Create new branch
                  </DropdownMenuItem>
                )}
                {onStarBranch && currentBranch && (
                  <DropdownMenuItem
                    onClick={() => onStarBranch(currentBranch.id)}
                  >
                    <Star
                      className={cn(
                        'h-4 w-4 mr-2',
                        currentBranch.isStarred &&
                          'fill-yellow-400 text-yellow-400'
                      )}
                    />
                    {currentBranch.isStarred ? 'Unstar' : 'Star'} this version
                  </DropdownMenuItem>
                )}
                {onDeleteBranch && currentBranch && branches.length > 1 && (
                  <DropdownMenuItem
                    onClick={() => onDeleteBranch(currentBranch.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete this version
                  </DropdownMenuItem>
                )}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleNext}
              disabled={!hasNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Next version</TooltipContent>
        </Tooltip>

        {onCreateBranch && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={onCreateBranch}
              >
                <GitFork className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Fork conversation</TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  )
}

// ============================================================================
// BRANCH TREE - Visual tree view
// ============================================================================

export function BranchTree({
  branches,
  currentBranchId,
  onSelectBranch,
  onDeleteBranch,
  onStarBranch,
  className,
}: BranchTreeProps) {
  // Build tree structure
  const rootBranches = branches.filter((b) => !b.parentId)

  const renderBranch = (branch: Branch, depth: number = 0) => {
    const children = branches.filter((b) => b.parentId === branch.id)
    const isSelected = branch.id === currentBranchId

    return (
      <div key={branch.id} className="relative">
        <div
          className={cn(
            'group flex items-start gap-2 p-2 rounded-lg cursor-pointer transition-colors',
            isSelected ? 'bg-accent' : 'hover:bg-accent/50',
            depth > 0 && 'ml-4'
          )}
          style={{ marginLeft: depth * 16 }}
          onClick={() => onSelectBranch(branch.id)}
        >
          {depth > 0 && (
            <div
              className="absolute left-0 top-0 bottom-0 w-px bg-border"
              style={{ left: (depth - 1) * 16 + 8 }}
            />
          )}

          <div className="flex-shrink-0 mt-1">
            <div
              className={cn(
                'h-2 w-2 rounded-full',
                isSelected ? 'bg-primary' : 'bg-muted-foreground/30'
              )}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              {branch.isStarred && (
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              )}
              <span className="text-sm font-medium truncate">
                {branch.content.slice(0, 40)}...
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {new Date(branch.createdAt).toLocaleString()}
              {children.length > 0 && (
                <>
                  <MessageSquare className="h-3 w-3 ml-2" />
                  {children.length} branch{children.length !== 1 ? 'es' : ''}
                </>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onStarBranch && (
                <DropdownMenuItem onClick={() => onStarBranch(branch.id)}>
                  <Star
                    className={cn(
                      'h-4 w-4 mr-2',
                      branch.isStarred && 'fill-yellow-400 text-yellow-400'
                    )}
                  />
                  {branch.isStarred ? 'Unstar' : 'Star'}
                </DropdownMenuItem>
              )}
              {onDeleteBranch && branches.length > 1 && (
                <DropdownMenuItem
                  onClick={() => onDeleteBranch(branch.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {children.map((child) => renderBranch(child, depth + 1))}
      </div>
    )
  }

  return (
    <div className={cn('space-y-1', className)}>
      {rootBranches.map((branch) => renderBranch(branch))}
    </div>
  )
}

// ============================================================================
// FORK BUTTON - Quick fork action
// ============================================================================

export function ForkButton({
  onFork,
  disabled = false,
  variant = 'ghost',
  size = 'icon',
  showLabel = false,
  className,
}: ForkButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            onClick={onFork}
            disabled={disabled}
            className={className}
          >
            <GitFork className={cn('h-4 w-4', showLabel && 'mr-2')} />
            {showLabel && 'Fork'}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Fork conversation from here</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// ============================================================================
// MESSAGE BRANCH INDICATOR - Inline branch indicator
// ============================================================================

export function MessageBranchIndicator({
  branchCount,
  currentBranch,
  onPrevious,
  onNext,
  className,
}: MessageBranchIndicatorProps) {
  if (branchCount <= 1) return null

  return (
    <div
      className={cn(
        'inline-flex items-center gap-0.5 text-xs text-muted-foreground',
        className
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5"
        onClick={onPrevious}
        disabled={currentBranch <= 1}
      >
        <ChevronLeft className="h-3 w-3" />
      </Button>
      <span className="min-w-[2.5rem] text-center font-medium">
        {currentBranch}/{branchCount}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5"
        onClick={onNext}
        disabled={currentBranch >= branchCount}
      >
        <ChevronRight className="h-3 w-3" />
      </Button>
    </div>
  )
}

// ============================================================================
// BRANCH CONTEXT - Hook for branch management
// ============================================================================

interface BranchContextValue {
  branches: Branch[]
  currentBranchId: string | null
  addBranch: (branch: Omit<Branch, 'id' | 'createdAt'>) => string
  selectBranch: (branchId: string) => void
  deleteBranch: (branchId: string) => void
  forkFromMessage: (messageId: string, content: string) => string
}

const BranchContext = React.createContext<BranchContextValue | null>(null)

export function useBranches() {
  const context = React.useContext(BranchContext)
  if (!context) {
    throw new Error('useBranches must be used within a BranchProvider')
  }
  return context
}

export function BranchProvider({
  children,
  initialBranches = [],
}: {
  children: React.ReactNode
  initialBranches?: Branch[]
}) {
  const [branches, setBranches] = React.useState<Branch[]>(initialBranches)
  const [currentBranchId, setCurrentBranchId] = React.useState<string | null>(
    initialBranches[0]?.id ?? null
  )

  const addBranch = React.useCallback(
    (branch: Omit<Branch, 'id' | 'createdAt'>) => {
      const id = `branch-${Date.now()}`
      const newBranch: Branch = {
        ...branch,
        id,
        createdAt: new Date(),
      }
      setBranches((prev) => [...prev, newBranch])
      setCurrentBranchId(id)
      return id
    },
    []
  )

  const selectBranch = React.useCallback((branchId: string) => {
    setCurrentBranchId(branchId)
  }, [])

  const deleteBranch = React.useCallback(
    (branchId: string) => {
      setBranches((prev) => {
        const filtered = prev.filter((b) => b.id !== branchId)
        if (currentBranchId === branchId && filtered.length > 0) {
          setCurrentBranchId(filtered[0].id)
        }
        return filtered
      })
    },
    [currentBranchId]
  )

  const forkFromMessage = React.useCallback(
    (messageId: string, content: string) => {
      const parentBranch = branches.find((b) => b.messageId === messageId)
      return addBranch({
        parentId: parentBranch?.id,
        messageId,
        content,
      })
    },
    [branches, addBranch]
  )

  const value = React.useMemo(
    () => ({
      branches,
      currentBranchId,
      addBranch,
      selectBranch,
      deleteBranch,
      forkFromMessage,
    }),
    [
      branches,
      currentBranchId,
      addBranch,
      selectBranch,
      deleteBranch,
      forkFromMessage,
    ]
  )

  return (
    <BranchContext.Provider value={value}>{children}</BranchContext.Provider>
  )
}
