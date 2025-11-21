import type { Meta, StoryObj } from '@storybook/react'
import { AuditLogViewer } from '@clarity-chat/react'

const meta = {
  title: 'Advanced/Enterprise/AuditLogViewer',
  component: AuditLogViewer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Component for displaying audit logs with filtering, search, and detailed entry views.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-full max-w-4xl h-[600px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AuditLogViewer>

export default meta
type Story = StoryObj<typeof meta>

const sampleLogs = [
  {
    id: '1',
    timestamp: new Date('2024-01-20T10:30:00Z'),
    action: 'user.login',
    actor: { type: 'user', id: 'user-123', name: 'Alice Johnson' },
    target: { type: 'session', id: 'session-456' },
    metadata: { ip: '192.168.1.1', userAgent: 'Mozilla/5.0' },
    severity: 'info' as const,
  },
  {
    id: '2',
    timestamp: new Date('2024-01-20T10:25:00Z'),
    action: 'message.sent',
    actor: { type: 'user', id: 'user-123', name: 'Alice Johnson' },
    target: { type: 'conversation', id: 'conv-789' },
    metadata: { messageLength: 150 },
    severity: 'info' as const,
  },
  {
    id: '3',
    timestamp: new Date('2024-01-20T10:20:00Z'),
    action: 'permission.denied',
    actor: { type: 'user', id: 'user-456', name: 'Bob Smith' },
    target: { type: 'resource', id: 'resource-101' },
    metadata: { reason: 'Insufficient permissions' },
    severity: 'warning' as const,
  },
  {
    id: '4',
    timestamp: new Date('2024-01-20T10:15:00Z'),
    action: 'api.key.created',
    actor: { type: 'user', id: 'user-789', name: 'Charlie Brown' },
    target: { type: 'api_key', id: 'key-202' },
    metadata: { keyName: 'Production API Key' },
    severity: 'info' as const,
  },
  {
    id: '5',
    timestamp: new Date('2024-01-20T10:10:00Z'),
    action: 'security.alert',
    actor: { type: 'system', id: 'system-1', name: 'Security System' },
    target: { type: 'user', id: 'user-999' },
    metadata: { alertType: 'suspicious_activity', details: 'Multiple failed login attempts' },
    severity: 'error' as const,
  },
]

export const Default: Story = {
  args: {
    logs: sampleLogs,
  },
}

export const Empty: Story = {
  args: {
    logs: [],
  },
}

export const CustomEmptyState: Story = {
  args: {
    logs: [],
    emptyState: (
      <div className="text-center">
        <p className="text-lg font-semibold">No audit events found</p>
        <p className="text-sm text-muted-foreground mt-2">
          Audit logs will appear here as events occur in your system.
        </p>
      </div>
    ),
  },
}

export const WithCustomTitle: Story = {
  args: {
    logs: sampleLogs,
    title: 'Advanced/Enterprise/AuditLogViewer',
  },
}

export const WithTimezone: Story = {
  args: {
    logs: sampleLogs,
    timezone: 'America/New_York',
  },
}

export const WithClickHandler: Story = {
  args: {
    logs: sampleLogs,
    onEntryClick: (entry) => {
      console.log('Clicked entry:', entry)
      alert(`Clicked: ${entry.action} by ${entry.actor.name}`)
    },
  },
}

export const ManyEntries: Story = {
  args: {
    logs: Array.from({ length: 50 }, (_, i) => ({
      id: `log-${i}`,
      timestamp: new Date(Date.now() - i * 60000),
      action: ['user.login', 'message.sent', 'permission.denied', 'api.key.created'][i % 4],
      actor: {
        type: 'user' as const,
        id: `user-${i}`,
        name: `User ${i}`,
      },
      target: {
        type: 'session' as const,
        id: `session-${i}`,
      },
      metadata: {},
      severity: (['info', 'warning', 'error'] as const)[i % 3],
    })),
  },
}
