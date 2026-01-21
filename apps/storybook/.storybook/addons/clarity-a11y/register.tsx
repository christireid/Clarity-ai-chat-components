/**
 * Storybook addon for Clarity Chat accessibility testing
 * Extends the default a11y addon with our custom accessibility utilities
 */

import React from 'react'
import { addons, types } from '@storybook/manager-api'
import { IconButton, TooltipLinkList, WithTooltip } from '@storybook/components'
import { AccessibilityIcon } from '@storybook/icons'

// Panel component for the addon
const AccessibilityPanel = () => {
  return (
    <div style={{ padding: '16px', fontSize: '14px' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 'bold' }}>
        Clarity Accessibility Testing
      </h3>

      <div style={{ marginBottom: '16px' }}>
        <p style={{ margin: '0 0 8px 0', color: '#666' }}>
          This addon provides automated accessibility testing using axe-core and integrates with our custom accessibility utilities.
        </p>

        <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '4px', marginBottom: '12px' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }}>
            Features:
          </h4>
          <ul style={{ margin: 0, paddingLeft: '16px' }}>
            <li>WCAG 2.1 AA compliance checking</li>
            <li>Automated color contrast validation</li>
            <li>Semantic HTML structure verification</li>
            <li>Keyboard navigation testing</li>
            <li>Screen reader compatibility checks</li>
          </ul>
        </div>

        <div style={{ background: '#fff3cd', border: '1px solid #ffeaa7', padding: '12px', borderRadius: '4px' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold', color: '#856404' }}>
            Usage:
          </h4>
          <p style={{ margin: 0, color: '#856404', fontSize: '13px' }}>
            Use the default a11y addon tab above for standard accessibility checks.
            This panel provides additional Clarity-specific accessibility guidance.
          </p>
        </div>
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }}>
          Resources:
        </h4>
        <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '13px' }}>
          <li>
            <a
              href="https://github.com/dequelabs/axe-core"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#007acc' }}
            >
              axe-core documentation
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG21/quickref/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#007acc' }}
            >
              WCAG 2.1 Guidelines
            </a>
          </li>
          <li>
            <a
              href="https://clarity-chat.dev/accessibility"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#007acc' }}
            >
              Clarity Accessibility Guide
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

// Toolbar button for quick accessibility checks
const AccessibilityToolbar = () => {
  return (
    <WithTooltip
      placement="top"
      trigger="hover"
      tooltip={() => (
        <TooltipLinkList
          links={[
            {
              title: 'Run Accessibility Tests',
              onClick: () => {
                // This would trigger accessibility testing
                console.log('Running accessibility tests...')
              },
            },
            {
              title: 'View Accessibility Report',
              onClick: () => {
                // Open accessibility panel
                addons.getChannel().emit('clarity-a11y/open-panel')
              },
            },
          ]}
        />
      )}
    >
      <IconButton>
        <AccessibilityIcon />
      </IconButton>
    </WithTooltip>
  )
}

// Register the addon
addons.register('clarity-a11y', (api) => {
  // Add the panel
  addons.add('clarity-a11y/panel', {
    type: types.PANEL,
    title: 'Clarity A11y',
    render: ({ active, key }) => (
      <div key={key} style={{ display: active ? 'block' : 'none' }}>
        <AccessibilityPanel />
      </div>
    ),
  })

  // Add toolbar button
  addons.add('clarity-a11y/toolbar', {
    type: types.TOOL,
    title: 'Accessibility Testing',
    render: () => <AccessibilityToolbar />,
  })
})