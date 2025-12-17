import { SecureLogger } from '@/lib/security/secureLogger';
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SafetyStatusCard } from '@clarity-chat/react'
import type { SafetyCheckItem } from '@clarity-chat/react'

const meta: Meta<typeof SafetyStatusCard> = {
  title: 'Components/Feedback/SafetyStatusCard',
  component: SafetyStatusCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Monitor policy checks on model responses. Display safety guardrails status with pass, warn, and fail states.',
      },
    },
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof SafetyStatusCard>

const mockChecks: SafetyCheckItem[] = [
  {
    id: '1',
    label: 'Toxicity',
    status: 'pass',
    detail: 'No toxic content detected',
  },
  {
    id: '2',
    label: 'Violence',
    status: 'pass',
    detail: 'No violent content detected',
  },
  {
    id: '3',
    label: 'Privacy',
    status: 'warn',
    detail: 'Potential PII detected',
    remediation: 'Review before sending',
  },
]

export const Default: Story = {
  args: {
    checks: mockChecks,
  },
}

export const AllPass: Story = {
  args: {
    checks: [
      {
        id: '1',
        label: 'Toxicity',
        status: 'pass',
      },
      {
        id: '2',
        label: 'Violence',
        status: 'pass',
      },
      {
        id: '3',
        label: 'Privacy',
        status: 'pass',
      },
    ],
  },
}

export const WithWarnings: Story = {
  args: {
    checks: [
      {
        id: '1',
        label: 'Toxicity',
        status: 'pass',
      },
      {
        id: '2',
        label: 'Violence',
        status: 'warn',
        detail: 'Contains potentially violent language',
        remediation: 'Review content',
      },
      {
        id: '3',
        label: 'Privacy',
        status: 'warn',
        detail: 'Possible personal information',
        remediation: 'Verify before sharing',
      },
    ],
  },
}

export const WithFailures: Story = {
  args: {
    checks: [
      {
        id: '1',
        label: 'Toxicity',
        status: 'fail',
        detail: 'High toxicity score detected',
        remediation: 'Block message',
      },
      {
        id: '2',
        label: 'Violence',
        status: 'pass',
      },
      {
        id: '3',
        label: 'Privacy',
        status: 'warn',
        detail: 'Possible PII',
      },
    ],
  },
}

export const WithActions: Story = {
  args: {
    checks: mockChecks,
    lastReviewedAt: new Date(),
    onReviewPolicy: () => {
      SecureLogger.debug('Reviewing policy')
      alert('Opening policy review...')
    },
    onAcknowledge: (check) => {
      SecureLogger.debug('Acknowledging check:', check.id)
      alert(`Acknowledged: ${check.label}`)
    },
  },
}

export const CustomTitle: Story = {
  args: {
    checks: mockChecks,
    title: 'Components/Feedback/SafetyStatusCard',
    subtitle: 'Components/Feedback/SafetyStatusCard',
  },
}
