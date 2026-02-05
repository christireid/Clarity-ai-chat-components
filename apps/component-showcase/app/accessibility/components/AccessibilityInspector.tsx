'use client'

import { useState, useEffect } from 'react'
import { Eye, ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@clarity-chat/primitives'

interface AccessibilityNode {
  role: string
  name?: string
  description?: string
  children?: AccessibilityNode[]
  properties?: Record<string, string>
  states?: Record<string, boolean>
}

export function AccessibilityInspector() {
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [inspectorMode, setInspectorMode] = useState(false)
  const [accessibilityTree, setAccessibilityTree] = useState<AccessibilityNode | null>(null)

  const demoTree: AccessibilityNode = {
    role: 'application',
    name: 'Chat Interface',
    properties: { live: 'polite' },
    children: [
      {
        role: 'main',
        name: 'Chat Messages',
        children: [
          {
            role: 'list',
            name: 'Message List',
            properties: { 'aria-label': 'Chat messages' },
            children: [
              {
                role: 'listitem',
                name: 'User Message',
                properties: { 'aria-label': 'User: Hello' },
              },
              {
                role: 'listitem',
                name: 'Assistant Message',
                properties: { 'aria-label': 'Assistant: Hi there!' },
              },
            ],
          },
        ],
      },
      {
        role: 'complementary',
        name: 'Chat Input',
        children: [
          {
            role: 'textbox',
            name: 'Message Input',
            properties: {
              'aria-label': 'Type your message',
              'aria-multiline': 'true',
            },
            states: { focused: false, disabled: false },
          },
          {
            role: 'button',
            name: 'Send Message',
            properties: { 'aria-label': 'Send message' },
            states: { focused: false, disabled: false },
          },
        ],
      },
    ],
  }

  useEffect(() => {
    setAccessibilityTree(demoTree)
  }, [])

  const renderTree = (node: AccessibilityNode, level = 0) => {
    const [expanded, setExpanded] = useState(true)

    return (
      <div key={node.name} style={{ marginLeft: `${level * 16}px` }}>
        <div
          className={cn(
            'flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer hover:bg-primary/5',
            selectedElement === node.name && 'bg-primary/10'
          )}
          onClick={() => setSelectedElement(node.name || null)}
        >
          {node.children && node.children.length > 0 && (
            <button onClick={(e) => {
              e.stopPropagation()
              setExpanded(!expanded)
            }}>
              {expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          )}
          <span className="badge-glass text-xs">{node.role}</span>
          <span className="text-sm font-medium">{node.name}</span>
        </div>

        {expanded && node.children && (
          <div>
            {node.children.map((child, idx) => (
              <div key={idx}>{renderTree(child, level + 1)}</div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const selectedNode = (() => {
    const findNode = (node: AccessibilityNode): AccessibilityNode | null => {
      if (node.name === selectedElement) return node
      if (node.children) {
        for (const child of node.children) {
          const found = findNode(child)
          if (found) return found
        }
      }
      return null
    }
    return accessibilityTree ? findNode(accessibilityTree) : null
  })()

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setInspectorMode(!inspectorMode)}
          className={cn(
            'px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2',
            inspectorMode
              ? 'gradient-accent text-white'
              : 'glass hover:bg-primary/5'
          )}
        >
          <Eye className="h-4 w-4" />
          {inspectorMode ? 'Stop Inspecting' : 'Start Inspecting'}
        </button>
      </div>

      {inspectorMode && (
        <div className="glass-panel p-4 border-l-4 border-blue-500">
          <p className="text-sm">
            <strong>Inspector Mode Active:</strong> Hover over elements in the page to
            inspect their accessibility properties. (Demo mode)
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Accessibility Tree */}
        <div className="glass-panel p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <span>Accessibility Tree</span>
            <span className="badge-glass text-xs">Live</span>
          </h3>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {accessibilityTree && renderTree(accessibilityTree)}
          </div>
        </div>

        {/* Properties Panel */}
        <div className="glass-panel p-6">
          <h3 className="font-semibold mb-4">Element Properties</h3>
          {selectedNode ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Role</label>
                <p className="font-mono text-sm mt-1 badge-glass inline-block">
                  {selectedNode.role}
                </p>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Name</label>
                <p className="mt-1">{selectedNode.name || '(none)'}</p>
              </div>

              {selectedNode.description && (
                <div>
                  <label className="text-sm text-muted-foreground">Description</label>
                  <p className="mt-1">{selectedNode.description}</p>
                </div>
              )}

              {selectedNode.properties && Object.keys(selectedNode.properties).length > 0 && (
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    ARIA Properties
                  </label>
                  <div className="space-y-2">
                    {Object.entries(selectedNode.properties).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm glass-panel p-2">
                        <span className="font-mono text-muted-foreground">{key}</span>
                        <span className="font-mono">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedNode.states && Object.keys(selectedNode.states).length > 0 && (
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    States
                  </label>
                  <div className="space-y-2">
                    {Object.entries(selectedNode.states).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm glass-panel p-2">
                        <span className="font-mono text-muted-foreground">{key}</span>
                        <span
                          className={cn(
                            'font-mono',
                            value ? 'text-green-500' : 'text-red-500'
                          )}
                        >
                          {value ? 'true' : 'false'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              Select an element from the tree to view its properties
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
