/**
 * Bundle Size Display Addon
 *
 * Shows bundle size information for the current story and its dependencies.
 */

import React, { useCallback, useState, useEffect } from 'react'
import { addons, types } from '@storybook/manager-api'
import { useGlobals, useStorybookApi, useStorybookState } from '@storybook/manager-api'
import { IconButton, WithTooltip, TooltipLinkList } from '@storybook/components'
import { DatabaseIcon } from '@storybook/icons'

const ADDON_ID = 'clarity-chat/bundle-size-display'
const PANEL_ID = `${ADDON_ID}/panel`
const TOOL_ID = `${ADDON_ID}/tool`

interface BundleSizeInfo {
  component: string
  size: string
  gzipped: string
  dependencies: Array<{
    name: string
    size: string
    required: boolean
  }>
  totalSize: string
}

// Mock bundle size data - in production, this would come from real analysis
const COMPONENT_SIZES: Record<string, BundleSizeInfo> = {
  'ClarityChat': {
    component: 'ClarityChat',
    size: '45KB',
    gzipped: '12KB',
    totalSize: '285KB',
    dependencies: [
      { name: 'react', size: '100KB', required: true },
      { name: 'framer-motion', size: '80KB', required: true },
      { name: 'lucide-react', size: '50KB', required: true },
      { name: '@clarity-chat/primitives', size: '10KB', required: true },
    ],
  },
  'ChatInput': {
    component: 'ChatInput',
    size: '8KB',
    gzipped: '2.5KB',
    totalSize: '158KB',
    dependencies: [
      { name: 'react', size: '100KB', required: true },
      { name: 'lucide-react', size: '50KB', required: true },
    ],
  },
  'MessageList': {
    component: 'MessageList',
    size: '12KB',
    gzipped: '3.5KB',
    totalSize: '162KB',
    dependencies: [
      { name: 'react', size: '100KB', required: true },
      { name: 'lucide-react', size: '50KB', required: true },
    ],
  },
  'EnhancedMarkdownRenderer': {
    component: 'EnhancedMarkdownRenderer',
    size: '25KB',
    gzipped: '7KB',
    totalSize: '600KB',
    dependencies: [
      { name: 'react', size: '100KB', required: true },
      { name: 'react-markdown', size: '40KB', required: false },
      { name: 'remark-gfm', size: '20KB', required: false },
      { name: 'rehype-highlight', size: '15KB', required: false },
      { name: 'prismjs', size: '30KB', required: false },
      { name: 'mermaid', size: '500KB', required: false },
    ],
  },
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

const BundleSizePanel = () => {
  const state = useStorybookState()
  const [sizeInfo, setSizeInfo] = useState<BundleSizeInfo | null>(null)

  useEffect(() => {
    // Extract component name from story ID
    const storyId = state.storyId
    if (!storyId) return

    // Try to match against known components
    const matchedComponent = Object.keys(COMPONENT_SIZES).find((key) =>
      storyId.toLowerCase().includes(key.toLowerCase())
    )

    if (matchedComponent) {
      setSizeInfo(COMPONENT_SIZES[matchedComponent])
    } else {
      // Default info if no match
      setSizeInfo({
        component: 'Unknown',
        size: 'N/A',
        gzipped: 'N/A',
        totalSize: 'N/A',
        dependencies: [],
      })
    }
  }, [state.storyId])

  if (!sizeInfo) {
    return (
      <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
        <p style={{ color: '#999' }}>
          Select a story to view bundle size information
        </p>
      </div>
    )
  }

  return (
    <div
      style={{
        padding: '20px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '14px',
      }}
    >
      <div
        style={{
          marginBottom: '20px',
          padding: '16px',
          background: '#f8f9fa',
          borderRadius: '8px',
        }}
      >
        <h3
          style={{
            margin: '0 0 12px 0',
            fontSize: '16px',
            fontWeight: '600',
          }}
        >
          {sizeInfo.component}
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ color: '#666', fontSize: '12px' }}>Raw Size</div>
            <div style={{ fontSize: '20px', fontWeight: '600' }}>
              {sizeInfo.size}
            </div>
          </div>
          <div>
            <div style={{ color: '#666', fontSize: '12px' }}>Gzipped</div>
            <div style={{ fontSize: '20px', fontWeight: '600' }}>
              {sizeInfo.gzipped}
            </div>
          </div>
        </div>
        <div style={{ marginTop: '12px' }}>
          <div style={{ color: '#666', fontSize: '12px' }}>
            Total with Dependencies
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#0066ff' }}>
            {sizeInfo.totalSize}
          </div>
        </div>
      </div>

      <div>
        <h4
          style={{
            margin: '0 0 12px 0',
            fontSize: '14px',
            fontWeight: '600',
          }}
        >
          Dependencies
        </h4>
        {sizeInfo.dependencies.length === 0 ? (
          <p style={{ color: '#999', fontSize: '13px' }}>
            No dependencies tracked for this component
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sizeInfo.dependencies.map((dep) => (
              <div
                key={dep.name}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  background: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <code
                    style={{
                      fontSize: '12px',
                      fontFamily: 'monospace',
                    }}
                  >
                    {dep.name}
                  </code>
                  {!dep.required && (
                    <span
                      style={{
                        fontSize: '10px',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        background: '#e3f2fd',
                        color: '#1976d2',
                      }}
                    >
                      optional
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#666',
                  }}
                >
                  {dep.size}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: '20px',
          padding: '12px',
          background: '#e8f5e9',
          borderLeft: '3px solid #4caf50',
          fontSize: '12px',
          lineHeight: '1.5',
        }}
      >
        <strong>Bundle Optimization Tips:</strong>
        <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
          <li>Optional dependencies are tree-shakeable</li>
          <li>Use code splitting for large features</li>
          <li>Core dependencies are shared across all components</li>
        </ul>
      </div>
    </div>
  )
}

const BundleSizeTool = () => {
  const api = useStorybookApi()
  const [isActive, setIsActive] = useState(false)

  const togglePanel = useCallback(() => {
    api.togglePanel(PANEL_ID)
    setIsActive((prev) => !prev)
  }, [api])

  return (
    <IconButton
      key={TOOL_ID}
      active={isActive}
      title="View bundle size information"
      onClick={togglePanel}
    >
      <DatabaseIcon />
    </IconButton>
  )
}

// Register the addon
addons.register(ADDON_ID, () => {
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: 'Bundle Size',
    match: ({ viewMode }) => viewMode === 'story',
    render: BundleSizeTool,
  })

  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'Bundle Size',
    render: BundleSizePanel,
  })
})
