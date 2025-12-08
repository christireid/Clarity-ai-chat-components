/**
 * useBranching Hook
 *
 * Manages conversation branching with localStorage persistence.
 * Allows users to create alternate conversation paths from any point.
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
  switchBranch: (branchId: string, currentMessages: Message[]) => ConversationBranch | null
  createBranch: (
    name: string,
    currentMessages: Message[],
    branchPointMessageId?: string
  ) => ConversationBranch
  updateCurrentBranchMessages: (messages: Message[]) => void
  hasBranches: boolean
}

const DEFAULT_BRANCH: ConversationBranch = {
  id: 'main',
  name: 'Main Conversation',
  messages: [],
  parentBranchId: null,
  branchPointMessageId: null,
  createdAt: new Date(),
}

const DEFAULT_STATE: BranchState = {
  branches: [DEFAULT_BRANCH],
  currentBranchId: 'main',
}

export function useBranching(options: UseBranchingOptions = {}): UseBranchingReturn {
  const { onBranchSwitch, onBranchCreate } = options

  const [branchState, setBranchState] = useState<BranchState>(DEFAULT_STATE)

  // Load branch state from localStorage on mount
  useEffect(() => {
    try {
      const savedBranches = localStorage.getItem(BRANCHES_KEY)
      if (savedBranches) {
        const parsed = JSON.parse(savedBranches) as BranchState
        if (parsed.branches && parsed.branches.length > 0) {
          // Restore Date objects
          parsed.branches = parsed.branches.map(b => ({
            ...b,
            createdAt: new Date(b.createdAt),
          }))
          setBranchState(parsed)
        }
      }
    } catch (e) {
      console.error('Failed to load branch state:', e)
    }
  }, [])

  // Save branch state to localStorage when it changes
  useEffect(() => {
    try {
      // Only persist if we have more than just the main branch
      if (branchState.branches.length > 1 || branchState.currentBranchId !== 'main') {
        localStorage.setItem(BRANCHES_KEY, JSON.stringify(branchState))
      } else {
        localStorage.removeItem(BRANCHES_KEY)
      }
    } catch (e) {
      console.error('Failed to save branch state:', e)
    }
  }, [branchState])

  // Get current branch
  const currentBranch = useMemo(() => {
    return branchState.branches.find(b => b.id === branchState.currentBranchId) || branchState.branches[0]
  }, [branchState])

  // Check if there are multiple branches
  const hasBranches = useMemo(() => {
    return branchState.branches.length > 1 || branchState.currentBranchId !== 'main'
  }, [branchState])

  // Switch to a different branch
  const switchBranch = useCallback((branchId: string, currentMessages: Message[]): ConversationBranch | null => {
    const targetBranch = branchState.branches.find(b => b.id === branchId)
    if (!targetBranch) {
      return null
    }

    // Save current messages to current branch before switching
    setBranchState(prev => ({
      ...prev,
      branches: prev.branches.map(b =>
        b.id === prev.currentBranchId
          ? { ...b, messages: currentMessages }
          : b
      ),
      currentBranchId: branchId,
    }))

    onBranchSwitch?.(targetBranch)
    return targetBranch
  }, [branchState.branches, onBranchSwitch])

  // Create a new branch
  const createBranch = useCallback((
    name: string,
    currentMessages: Message[],
    branchPointMessageId?: string
  ): ConversationBranch => {
    const newBranch: ConversationBranch = {
      id: `branch-${Date.now()}`,
      name,
      messages: branchPointMessageId
        ? currentMessages.slice(0, currentMessages.findIndex(m => m.id === branchPointMessageId) + 1)
        : [...currentMessages],
      parentBranchId: branchState.currentBranchId,
      branchPointMessageId: branchPointMessageId || null,
      createdAt: new Date(),
    }

    setBranchState(prev => ({
      ...prev,
      branches: [...prev.branches, newBranch],
      currentBranchId: newBranch.id,
    }))

    onBranchCreate?.(newBranch)
    return newBranch
  }, [branchState.currentBranchId, onBranchCreate])

  // Update messages in the current branch
  const updateCurrentBranchMessages = useCallback((messages: Message[]) => {
    setBranchState(prev => ({
      ...prev,
      branches: prev.branches.map(b =>
        b.id === prev.currentBranchId
          ? { ...b, messages }
          : b
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
