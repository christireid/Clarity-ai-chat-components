import { logger } from '@clarity-chat/utils/logger';
/**
 * useBranching Hook
 *
 * Manages conversation branching with localStorage persistence.
 * Allows users to create alternate conversation paths from any point.
 *
 * SSR-Safe: Uses lazy initialization to avoid hydration mismatches.
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import type { Message } from '@clarity-chat/types'

const BRANCHES_KEY = 'clarity-docs-assistant-branches'

export interface ConversationBranch {
  id: string
  name: string
  messages: Message[]
  parentBranchId: string | null
  branchPointMessageId: string | null
  createdAt: Date
}

export interface BranchState {
  branches: ConversationBranch[]
  currentBranchId: string
}

export interface UseBranchingOptions {
  onBranchSwitch?: (branch: ConversationBranch) => void
  onBranchCreate?: (branch: ConversationBranch) => void
}

export interface UseBranchingReturn {
  branchState: BranchState
  currentBranch: ConversationBranch
  switchBranch: (
    branchId: string,
    currentMessages: Message[]
  ) => ConversationBranch | null
  createBranch: (
    name: string,
    currentMessages: Message[],
    branchPointMessageId?: string
  ) => ConversationBranch
  updateCurrentBranchMessages: (messages: Message[]) => void
  hasBranches: boolean
}

/**
 * Safely check if we're in a browser environment
 */
const isBrowser = typeof window !== 'undefined'

/**
 * Create default branch with current timestamp (called lazily to avoid SSR issues)
 */
function createDefaultBranch(): ConversationBranch {
  return {
    id: 'main',
    name: 'Main Conversation',
    messages: [],
    parentBranchId: null,
    branchPointMessageId: null,
    createdAt: new Date(),
  }
}

/**
 * Create default state (called lazily to avoid SSR issues)
 */
function createDefaultState(): BranchState {
  return {
    branches: [createDefaultBranch()],
    currentBranchId: 'main',
  }
}

/**
 * Safely load branch state from localStorage (SSR-safe)
 */
function loadBranchStateFromStorage(): BranchState | null {
  if (!isBrowser) return null
  try {
    const savedBranches = localStorage.getItem(BRANCHES_KEY)
    if (savedBranches) {
      const parsed = JSON.parse(savedBranches) as BranchState
      if (parsed.branches && parsed.branches.length > 0) {
        // Restore Date objects
        parsed.branches = parsed.branches.map((b) => ({
          ...b,
          createdAt: new Date(b.createdAt),
        }))
        return parsed
      }
    }
  } catch (e) {
    logger.logger.error('Failed to load branch state:', e)
  }
  return null
}

export function useBranching(
  options: UseBranchingOptions = {}
): UseBranchingReturn {
  const { onBranchSwitch, onBranchCreate } = options

  // Use lazy initialization to avoid hydration mismatch
  // Initial state is created fresh on both server and client
  const [branchState, setBranchState] =
    useState<BranchState>(createDefaultState)
  const [isHydrated, setIsHydrated] = useState(false)

  // Hydrate state from localStorage after mount (SSR-safe)
  useEffect(() => {
    const savedState = loadBranchStateFromStorage()
    if (savedState) {
      setBranchState(savedState)
    }
    setIsHydrated(true)
  }, [])

  // Save branch state to localStorage when it changes (SSR-safe)
  useEffect(() => {
    // Only persist after hydration to avoid SSR issues
    if (!isBrowser || !isHydrated) return

    try {
      // Only persist if we have more than just the main branch
      if (
        branchState.branches.length > 1 ||
        branchState.currentBranchId !== 'main'
      ) {
        localStorage.setItem(BRANCHES_KEY, JSON.stringify(branchState))
      } else {
        localStorage.removeItem(BRANCHES_KEY)
      }
    } catch (e) {
      logger.logger.error('Failed to save branch state:', e)
    }
  }, [branchState, isHydrated])

  // Get current branch
  const currentBranch = useMemo(() => {
    return (
      branchState.branches.find((b) => b.id === branchState.currentBranchId) ||
      branchState.branches[0]
    )
  }, [branchState])

  // Check if there are multiple branches
  const hasBranches = useMemo(() => {
    return (
      branchState.branches.length > 1 || branchState.currentBranchId !== 'main'
    )
  }, [branchState])

  // Switch to a different branch
  const switchBranch = useCallback(
    (
      branchId: string,
      currentMessages: Message[]
    ): ConversationBranch | null => {
      const targetBranch = branchState.branches.find((b) => b.id === branchId)
      if (!targetBranch) {
        return null
      }

      // Save current messages to current branch before switching
      setBranchState((prev) => ({
        ...prev,
        branches: prev.branches.map((b) =>
          b.id === prev.currentBranchId
            ? { ...b, messages: currentMessages }
            : b
        ),
        currentBranchId: branchId,
      }))

      onBranchSwitch?.(targetBranch)
      return targetBranch
    },
    [branchState.branches, onBranchSwitch]
  )

  // Create a new branch
  const createBranch = useCallback(
    (
      name: string,
      currentMessages: Message[],
      branchPointMessageId?: string
    ): ConversationBranch => {
      const newBranch: ConversationBranch = {
        id: `branch-${Date.now()}`,
        name,
        messages: branchPointMessageId
          ? currentMessages.slice(
              0,
              currentMessages.findIndex((m) => m.id === branchPointMessageId) +
                1
            )
          : [...currentMessages],
        parentBranchId: branchState.currentBranchId,
        branchPointMessageId: branchPointMessageId || null,
        createdAt: new Date(),
      }

      setBranchState((prev) => ({
        ...prev,
        branches: [...prev.branches, newBranch],
        currentBranchId: newBranch.id,
      }))

      onBranchCreate?.(newBranch)
      return newBranch
    },
    [branchState.currentBranchId, onBranchCreate]
  )

  // Update messages in the current branch
  const updateCurrentBranchMessages = useCallback((messages: Message[]) => {
    setBranchState((prev) => ({
      ...prev,
      branches: prev.branches.map((b) =>
        b.id === prev.currentBranchId ? { ...b, messages } : b
      ),
    }))
  }, [])

  return {
    branchState,
    currentBranch,
    switchBranch,
    createBranch,
    updateCurrentBranchMessages,
    hasBranches,
  }
}
