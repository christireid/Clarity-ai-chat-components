/**
 * Button Handler Functions for Chat Page
 * All interactive button functionality implementations
 */

import { ChatMessage, ToolExecution } from './types'

export interface ButtonHandlers {
  handleCopyMessage: (content: string, messageId: string) => Promise<void>
  handleDeleteMessage: (messageId: string) => void
  handleEditMessage: (messageId: string, content: string) => void
  handleSaveEdit: () => void
  handleCancelEdit: () => void
  handleRegenerateResponse: (messageId: string) => Promise<void>
  handlePinMessage: (messageId: string) => void
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleVoiceInput: () => void
  handleExportChat: () => void
  handleShareChat: () => Promise<void>
  handleArchiveChat: () => void
  handleBranchConversation: () => void
  handleRunTool: (toolName: string) => Promise<void>
}

export function createButtonHandlers(
  messages: ChatMessage[],
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setInput: React.Dispatch<React.SetStateAction<string>>,
  handleSend: () => Promise<void>,
  setCopiedMessageId: React.Dispatch<React.SetStateAction<string | null>>,
  setEditingMessageId: React.Dispatch<React.SetStateAction<string | null>>,
  setEditingContent: React.Dispatch<React.SetStateAction<string>>,
  editingMessageId: string | null,
  editingContent: string,
  setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>,
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>,
  isRecording: boolean,
  setShowExportDialog: React.Dispatch<React.SetStateAction<boolean>>,
  tokenUsage: { input: number; output: number; total: number; budget: number },
  simulateToolExecution: (toolName: string) => Promise<ToolExecution>
): ButtonHandlers {

  /**
   * Copy message content to clipboard
   */
  const handleCopyMessage = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
      // Fallback: create temporary textarea
      const textarea = document.createElement('textarea')
      textarea.value = content
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
    }
  }

  /**
   * Delete a message from the conversation
   */
  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== messageId))
  }

  /**
   * Start editing a message
   */
  const handleEditMessage = (messageId: string, content: string) => {
    setEditingMessageId(messageId)
    setEditingContent(content)
  }

  /**
   * Save edited message
   */
  const handleSaveEdit = () => {
    if (editingMessageId) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === editingMessageId ? { ...m, content: editingContent } : m
        )
      )
      setEditingMessageId(null)
      setEditingContent('')
    }
  }

  /**
   * Cancel message editing
   */
  const handleCancelEdit = () => {
    setEditingMessageId(null)
    setEditingContent('')
  }

  /**
   * Regenerate AI response for a message
   */
  const handleRegenerateResponse = async (messageId: string) => {
    // Find the message and regenerate
    const messageIndex = messages.findIndex((m) => m.id === messageId)
    if (messageIndex === -1) return

    // Remove messages after this one
    setMessages((prev) => prev.slice(0, messageIndex))

    // Get the previous user message
    const userMessage = messages[messageIndex - 1]
    if (userMessage && userMessage.role === 'user') {
      setInput(userMessage.content)
      setTimeout(() => handleSend(), 100)
    }
  }

  /**
   * Toggle pin state for a message
   */
  const handlePinMessage = (messageId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId ? { ...m, isPinned: !m.isPinned } : m
      )
    )
  }

  /**
   * Handle file upload from input
   */
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const fileArray = Array.from(files)
      setUploadedFiles((prev) => [...prev, ...fileArray])

      // Add a message about the uploaded files
      const fileNames = fileArray.map((f) => f.name).join(', ')
      setInput((prev) => {
        const newText = prev + (prev ? '\n\n' : '') + `Uploaded files: ${fileNames}`
        return newText
      })
    }
  }

  /**
   * Toggle voice input recording
   */
  const handleVoiceInput = () => {
    setIsRecording(!isRecording)

    if (!isRecording) {
      // Simulate recording - in production, use Web Speech API
      setTimeout(() => {
        setInput(
          'This is a simulated voice input. In production, this would use the Web Speech API.'
        )
        setIsRecording(false)
      }, 2000)
    }
  }

  /**
   * Export chat conversation as JSON
   */
  const handleExportChat = () => {
    const chatData = {
      messages,
      timestamp: new Date().toISOString(),
      tokenUsage,
    }

    const blob = new Blob([JSON.stringify(chatData, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-export-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setShowExportDialog(false)
  }

  /**
   * Share conversation via Web Share API or clipboard
   */
  const handleShareChat = async () => {
    const shareUrl = `${window.location.origin}/chat/shared/${Date.now()}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Chat Conversation',
          text: 'Check out this AI conversation',
          url: shareUrl,
        })
      } catch (err) {
        console.error('Share failed:', err)
        // User cancelled or error occurred
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl)
        alert('Share link copied to clipboard!')
      } catch (err) {
        console.error('Failed to copy share link:', err)
      }
    }
  }

  /**
   * Archive current conversation
   */
  const handleArchiveChat = () => {
    const archiveData = {
      messages,
      timestamp: new Date().toISOString(),
      archived: true,
    }

    // In production, this would save to a database
    console.log('Archived chat:', archiveData)
    alert('Chat archived successfully!')
  }

  /**
   * Create a conversation branch from current state
   */
  const handleBranchConversation = () => {
    const branchData = {
      parentId: 'current-chat',
      messages: [...messages],
      timestamp: new Date().toISOString(),
    }

    // In production, create new conversation in database
    console.log('Created conversation branch:', branchData)
    alert('Created a new conversation branch!')
  }

  /**
   * Manually execute a tool
   */
  const handleRunTool = async (toolName: string) => {
    await simulateToolExecution(toolName)
  }

  return {
    handleCopyMessage,
    handleDeleteMessage,
    handleEditMessage,
    handleSaveEdit,
    handleCancelEdit,
    handleRegenerateResponse,
    handlePinMessage,
    handleFileUpload,
    handleVoiceInput,
    handleExportChat,
    handleShareChat,
    handleArchiveChat,
    handleBranchConversation,
    handleRunTool,
  }
}

/**
 * Hook to use button handlers
 */
export function useButtonHandlers(
  messages: ChatMessage[],
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setInput: React.Dispatch<React.SetStateAction<string>>,
  handleSend: () => Promise<void>,
  setCopiedMessageId: React.Dispatch<React.SetStateAction<string | null>>,
  setEditingMessageId: React.Dispatch<React.SetStateAction<string | null>>,
  setEditingContent: React.Dispatch<React.SetStateAction<string>>,
  editingMessageId: string | null,
  editingContent: string,
  setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>,
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>,
  isRecording: boolean,
  setShowExportDialog: React.Dispatch<React.SetStateAction<boolean>>,
  tokenUsage: { input: number; output: number; total: number; budget: number },
  simulateToolExecution: (toolName: string) => Promise<ToolExecution>
) {
  return createButtonHandlers(
    messages,
    setMessages,
    setInput,
    handleSend,
    setCopiedMessageId,
    setEditingMessageId,
    setEditingContent,
    editingMessageId,
    editingContent,
    setUploadedFiles,
    setIsRecording,
    isRecording,
    setShowExportDialog,
    tokenUsage,
    simulateToolExecution
  )
}
