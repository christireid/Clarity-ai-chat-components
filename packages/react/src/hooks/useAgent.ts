import { useState, useCallback, useMemo } from 'react'

/**
 * Represents a single node in the conversation tree
 */
export interface MessageNode {
  id: string
  role: 'system' | 'user' | 'assistant' | 'tool'
  content: string
  parentId: string | null
  children: string[]
  createdAt: number
  toolCalls?: any[]
  toolResults?: any[]
}

export interface AgentConfig {
  initialMessages?: MessageNode[]
  initialHeadId?: string | null
}

export interface AgentState {
  messageMap: Map<string, MessageNode>
  headId: string | null
  status: 'idle' | 'thinking' | 'streaming' | 'error'
}

/**
 * useAgent: A React hook for managing branching conversation state
 * Replaces the linear history of useChat with a tree-based structure.
 */
export function useAgent(config: AgentConfig = {}) {
  const [messageMap, setMessageMap] = useState<Map<string, MessageNode>>(
    new Map(config.initialMessages?.map((m) => [m.id, m]))
  )

  // The "head" is the current leaf node we are viewing
  const [headId, setHeadId] = useState<string | null>(
    config.initialHeadId ??
      (config.initialMessages?.length
        ? config.initialMessages[config.initialMessages.length - 1].id
        : null)
  )

  const [status, setStatus] = useState<AgentState['status']>('idle')

  /**
   * Adds a new message to the tree, branching off the current head.
   */
  const addMessage = useCallback(
    (message: Omit<MessageNode, 'children' | 'createdAt' | 'parentId'>) => {
      const newNode: MessageNode = {
        ...message,
        parentId: headId,
        children: [],
        createdAt: Date.now(),
      }

      setMessageMap((prev) => {
        const next = new Map(prev)
        next.set(newNode.id, newNode)

        // Link parent to this new child
        if (headId && next.has(headId)) {
          const parent = next.get(headId)!
          // Create a new parent object to maintain immutability
          next.set(headId, {
            ...parent,
            children: [...parent.children, newNode.id],
          })
        }

        return next
      })

      // Advance head to the new message
      setHeadId(newNode.id)
      return newNode.id
    },
    [headId]
  )

  /**
   * Reconstructs the linear thread from the current head back to the root.
   */
  const thread = useMemo(() => {
    const path: MessageNode[] = []
    let currentId = headId

    // Safety break to prevent infinite loops in malformed trees
    let iterations = 0
    while (currentId && iterations < 10000) {
      const node = messageMap.get(currentId)
      if (!node) break

      path.unshift(node)
      currentId = node.parentId
      iterations++
    }

    return path
  }, [headId, messageMap])

  /**
   * Navigate to a different branch/node
   */
  const navigateToNode = useCallback(
    (nodeId: string) => {
      if (messageMap.has(nodeId)) {
        setHeadId(nodeId)
      }
    },
    [messageMap]
  )

  return {
    messages: thread,
    messageMap,
    headId,
    status,
    setStatus,
    addMessage,
    navigateToNode,
  }
}
