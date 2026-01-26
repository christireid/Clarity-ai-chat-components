/**
 * Peer Dependency Simulator Addon
 *
 * This Storybook addon allows testing components with missing peer dependencies.
 * It adds a toolbar control to simulate missing optional peers and shows warnings.
 */

import React, { useCallback, useState } from 'react'
import { addons, types } from '@storybook/manager-api'
import { useGlobals, useStorybookApi } from '@storybook/manager-api'
import { IconButton, WithTooltip, TooltipLinkList } from '@storybook/components'
import { PackageIcon } from '@storybook/icons'

const ADDON_ID = 'clarity-chat/peer-dependency-simulator'
const TOOL_ID = `${ADDON_ID}/tool`

interface PeerDependency {
  name: string
  required: boolean
  description: string
  bundleSize?: string
}

const PEER_DEPENDENCIES: PeerDependency[] = [
  {
    name: 'react',
    required: true,
    description: 'Core React library',
    bundleSize: '~100KB',
  },
  {
    name: 'framer-motion',
    required: true,
    description: 'Animation library',
    bundleSize: '~80KB',
  },
  {
    name: 'lucide-react',
    required: true,
    description: 'Icon library',
    bundleSize: '~50KB',
  },
  {
    name: 'zod',
    required: true,
    description: 'Schema validation',
    bundleSize: '~60KB',
  },
  {
    name: 'react-dom',
    required: false,
    description: 'React DOM rendering',
    bundleSize: '~130KB',
  },
  {
    name: 'flowtoken',
    required: false,
    description: 'Advanced token streaming',
    bundleSize: '~30KB',
  },
  {
    name: 'mermaid',
    required: false,
    description: 'Diagram rendering',
    bundleSize: '~500KB',
  },
  {
    name: 'pdfjs-dist',
    required: false,
    description: 'PDF document parsing',
    bundleSize: '~2.5MB',
  },
  {
    name: 'mammoth',
    required: false,
    description: 'DOCX document parsing',
    bundleSize: '~200KB',
  },
  {
    name: 'cohere-ai',
    required: false,
    description: 'Reranking service',
    bundleSize: '~150KB',
  },
  {
    name: 'shiki',
    required: false,
    description: 'Advanced syntax highlighting',
    bundleSize: '~400KB',
  },
  {
    name: 'jszip',
    required: false,
    description: 'ZIP file handling',
    bundleSize: '~100KB',
  },
  {
    name: 'prismjs',
    required: false,
    description: 'Basic syntax highlighting',
    bundleSize: '~30KB',
  },
  {
    name: 'react-markdown',
    required: false,
    description: 'Markdown rendering',
    bundleSize: '~40KB',
  },
  {
    name: 'remark-gfm',
    required: false,
    description: 'GitHub Flavored Markdown',
    bundleSize: '~20KB',
  },
  {
    name: 'rehype-highlight',
    required: false,
    description: 'Syntax highlighting for markdown',
    bundleSize: '~15KB',
  },
]

const PeerDependencyTool = () => {
  const [globals, updateGlobals] = useGlobals()
  const api = useStorybookApi()
  const [isOpen, setIsOpen] = useState(false)

  const missingPeers: string[] = globals.missingPeers || []

  const togglePeer = useCallback(
    (peerName: string) => {
      const newMissingPeers = missingPeers.includes(peerName)
        ? missingPeers.filter((p: string) => p !== peerName)
        : [...missingPeers, peerName]

      updateGlobals({
        missingPeers: newMissingPeers,
      })

      // Show notification
      if (newMissingPeers.includes(peerName)) {
        api.addNotification({
          id: `missing-${peerName}`,
          type: 'warning',
          content: {
            headline: `Simulating missing: ${peerName}`,
            subHeadline: 'Components will show fallback UI',
          },
          link: undefined,
        })
      } else {
        api.addNotification({
          id: `restored-${peerName}`,
          type: 'success',
          content: {
            headline: `Restored: ${peerName}`,
            subHeadline: 'Full functionality enabled',
          },
          link: undefined,
        })
      }
    },
    [missingPeers, updateGlobals, api]
  )

  const links = PEER_DEPENDENCIES.map((peer) => {
    const isMissing = missingPeers.includes(peer.name)
    const canToggle = !peer.required

    return {
      id: peer.name,
      title: peer.name,
      value: peer.name,
      right: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {peer.bundleSize && (
            <span
              style={{
                fontSize: '11px',
                color: '#999',
                fontFamily: 'monospace',
              }}
            >
              {peer.bundleSize}
            </span>
          )}
          {peer.required ? (
            <span
              style={{
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '3px',
                background: '#ff4785',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              REQUIRED
            </span>
          ) : isMissing ? (
            <span
              style={{
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '3px',
                background: '#fc521f',
                color: 'white',
              }}
            >
              MISSING
            </span>
          ) : (
            <span
              style={{
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '3px',
                background: '#66bf3c',
                color: 'white',
              }}
            >
              INSTALLED
            </span>
          )}
        </div>
      ),
      active: isMissing,
      disabled: !canToggle,
      onClick: canToggle ? () => togglePeer(peer.name) : undefined,
    }
  })

  const activeCount = missingPeers.length

  return (
    <WithTooltip
      placement="top"
      trigger="click"
      closeOnOutsideClick
      onVisibleChange={setIsOpen}
      tooltip={<TooltipLinkList links={links} />}
    >
      <IconButton
        key={TOOL_ID}
        active={activeCount > 0}
        title={
          activeCount > 0
            ? `${activeCount} peer${activeCount === 1 ? '' : 's'} missing`
            : 'Simulate missing peers'
        }
      >
        <PackageIcon />
        {activeCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              background: '#fc521f',
              color: 'white',
              borderRadius: '50%',
              width: '16px',
              height: '16px',
              fontSize: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
            }}
          >
            {activeCount}
          </span>
        )}
      </IconButton>
    </WithTooltip>
  )
}

// Register the addon
addons.register(ADDON_ID, () => {
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: 'Peer Dependencies',
    match: ({ viewMode }) => viewMode === 'story',
    render: PeerDependencyTool,
  })
})
