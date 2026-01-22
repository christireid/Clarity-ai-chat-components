/**
 * Chat Synchronization Example
 *
 * Demonstrates cross-device chat synchronization with conflict resolution,
 * offline support, and real-time updates.
 */

'use client'

import React, { useState, useCallback } from 'react'
import { ClarityChat } from '@clarity-chat/react'
import { ChatSyncStatus } from '@clarity-chat/react'
import { useChatSync } from '@clarity-chat/react'
import { Button } from '@clarity-chat/react'
import { Card, CardContent, CardHeader, CardTitle } from '@clarity-chat/react'
import { Badge } from '@clarity-chat/react'
import { Separator } from '@clarity-chat/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/react'

// Mock sync server for demonstration
class MockSyncServer {
  private conversations = new Map<string, Message[]>()
  private listeners = new Set<(conversationId: string, messages: Message[]) => void>()

  // Simulate network delay
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  async getConversation(conversationId: string): Promise<Message[]> {
    await this.delay(500) // Simulate network
    return this.conversations.get(conversationId) || []
  }

  async saveConversation(conversationId: string, messages: Message[]): Promise<void> {
    await this.delay(300) // Simulate network
    this.conversations.set(conversationId, [...messages])

    // Notify listeners (simulate real-time updates)
    this.listeners.forEach(listener => {
      setTimeout(() => listener(conversationId, messages), 100)
    })
  }

  subscribe(listener: (conversationId: string, messages: Message[]) => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }
}

// Global mock server instance
const mockServer = new MockSyncServer()

export function ChatSyncExample() {
  const [conversationId] = useState('demo-conversation-' + Date.now())
  const [messages, setMessages] = useState<Message[]>([])
  const [activeTab, setActiveTab] = useState('device1')

  // Device 1 sync
  const device1Sync = useChatSync(
    messages,
    setMessages,
    {
      conversationId,
      apiEndpoint: 'mock://sync', // Would be real API endpoint
      enableRealtime: true,
      conflictStrategy: 'merge',
      syncInterval: 5000, // Sync every 5 seconds
    }
  )

  // Device 2 sync (simulated)
  const [device2Messages, setDevice2Messages] = useState<Message[]>([])
  const device2Sync = useChatSync(
    device2Messages,
    setDevice2Messages,
    {
      conversationId,
      apiEndpoint: 'mock://sync',
      enableRealtime: true,
      conflictStrategy: 'merge',
      syncInterval: 5000,
    }
  )

  // Mock API handlers
  const handleSendMessage = useCallback(async (content: string) => {
    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      role: 'user',
      content,
      timestamp: Date.now(),
    }

    if (activeTab === 'device1') {
      setMessages(prev => [...prev, newMessage])
    } else {
      setDevice2Messages(prev => [...prev, newMessage])
    }

    // Simulate AI response after delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        role: 'assistant',
        content: `I received your message: "${content}". This demonstrates cross-device sync!`,
        timestamp: Date.now(),
      }

      if (activeTab === 'device1') {
        setMessages(prev => [...prev, aiMessage])
      } else {
        setDevice2Messages(prev => [...prev, aiMessage])
      }
    }, 1000)
  }, [activeTab])

  const addConflictMessage = () => {
    const conflictMessage: Message = {
      id: `conflict_${Date.now()}`,
      role: 'user',
      content: `Conflict test message from ${activeTab} at ${new Date().toLocaleTimeString()}`,
      timestamp: Date.now(),
    }

    if (activeTab === 'device1') {
      setMessages(prev => [...prev, conflictMessage])
    } else {
      setDevice2Messages(prev => [...prev, conflictMessage])
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Chat Synchronization Demo</h1>
        <p className="text-xl text-muted-foreground">
          Experience real-time cross-device chat synchronization with conflict resolution
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <Badge variant="secondary" className="px-3 py-1">
            🔄 Real-time Sync
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            ⚡ Conflict Resolution
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            📱 Cross-Device
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            🔌 Offline Support
          </Badge>
        </div>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold">🔄 Synchronization</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Messages sync automatically across devices</li>
                <li>• Real-time updates via WebSocket simulation</li>
                <li>• Offline queuing when network unavailable</li>
                <li>• Periodic sync every 5 seconds</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">⚡ Conflict Resolution</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Automatic merging of concurrent edits</li>
                <li>• Timestamp-based conflict resolution</li>
                <li>• Manual resolution for complex conflicts</li>
                <li>• Version tracking prevents data loss</li>
              </ul>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-3">
            <h4 className="font-semibold">🧪 Try It Out</h4>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Switch between "Device 1" and "Device 2" tabs</li>
              <li>Send messages from each device</li>
              <li>Watch messages sync automatically</li>
              <li>Click "Add Conflict Test" to create concurrent edits</li>
              <li>Observe conflict resolution in action</li>
              <li>Check sync status and error handling</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Main Demo */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="device1">Device 1</TabsTrigger>
          <TabsTrigger value="device2">Device 2</TabsTrigger>
        </TabsList>

        {/* Device 1 */}
        <TabsContent value="device1" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Device 1 - Primary</h3>
            <div className="flex gap-2">
              <Button onClick={addConflictMessage} variant="outline" size="sm">
                Add Conflict Test
              </Button>
              <Button onClick={() => device1Sync.actions.syncNow()} size="sm">
                Force Sync
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <DeviceChat
                messages={messages}
                onSendMessage={handleSendMessage}
                title="Device 1 Chat"
              />
            </div>
            <div className="space-y-4">
              <ChatSyncStatus
                sync={device1Sync}
                showDetails={true}
                showRealtimeToggle={true}
                showManualSync={true}
              />
              <SyncStats messages={messages} device="Device 1" />
            </div>
          </div>
        </TabsContent>

        {/* Device 2 */}
        <TabsContent value="device2" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Device 2 - Secondary</h3>
            <div className="flex gap-2">
              <Button onClick={addConflictMessage} variant="outline" size="sm">
                Add Conflict Test
              </Button>
              <Button onClick={() => device2Sync.actions.syncNow()} size="sm">
                Force Sync
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <DeviceChat
                messages={device2Messages}
                onSendMessage={handleSendMessage}
                title="Device 2 Chat"
              />
            </div>
            <div className="space-y-4">
              <ChatSyncStatus
                sync={device2Sync}
                showDetails={true}
                showRealtimeToggle={true}
                showManualSync={true}
              />
              <SyncStats messages={device2Messages} device="Device 2" />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Technical Details */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Implementation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold">🔧 Core Components</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <code>SyncManager</code> - Central sync orchestration</li>
                <li>• <code>ConflictResolver</code> - Automatic conflict resolution</li>
                <li>• <code>SyncQueue</code> - Offline change queuing</li>
                <li>• <code>RealtimeSync</code> - WebSocket-based updates</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">📊 Sync Strategies</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Merge</strong>: Combine concurrent changes</li>
                <li>• <strong>Last-Write-Wins</strong>: Timestamp-based</li>
                <li>• <strong>Manual</strong>: User-guided resolution</li>
                <li>• <strong>Version Control</strong>: Prevent data loss</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">🔄 Data Flow</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Local IndexedDB storage</li>
                <li>• Remote API synchronization</li>
                <li>• Real-time WebSocket updates</li>
                <li>• Offline queue management</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Device Chat Component
 */
function DeviceChat({
  messages,
  onSendMessage,
  title
}: {
  messages: Message[]
  onSendMessage: (content: string) => void
  title: string
}) {
  const [input, setInput] = useState('')

  const handleSubmit = () => {
    if (input.trim()) {
      onSendMessage(input.trim())
      setInput('')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Messages */}
          <div className="min-h-64 max-h-96 overflow-y-auto space-y-3 p-4 bg-muted/30 rounded-lg">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No messages yet. Start a conversation!
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="font-medium text-xs mb-1 opacity-75">
                      {message.role === 'user' ? 'You' : 'Assistant'}
                    </div>
                    {message.content}
                    <div className="text-xs opacity-60 mt-1">
                      {new Date(message.timestamp || 0).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border rounded-lg text-sm"
            />
            <Button onClick={handleSubmit} disabled={!input.trim()}>
              Send
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Sync Statistics Component
 */
function SyncStats({ messages, device }: { messages: Message[]; device: string }) {
  const userMessages = messages.filter(m => m.role === 'user').length
  const aiMessages = messages.filter(m => m.role === 'assistant').length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{device} Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Messages:</span>
            <span className="font-medium">{messages.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Your Messages:</span>
            <span className="font-medium">{userMessages}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">AI Responses:</span>
            <span className="font-medium">{aiMessages}</span>
          </div>
          {messages.length > 0 && (
            <div className="flex justify-between pt-2 border-t">
              <span className="text-muted-foreground">Last Activity:</span>
              <span className="font-medium text-xs">
                {new Date(Math.max(...messages.map(m => m.timestamp || 0))).toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default ChatSyncExample