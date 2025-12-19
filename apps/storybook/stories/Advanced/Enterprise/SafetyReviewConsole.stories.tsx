import type { Meta, StoryObj } from '@storybook/react-vite'
import { SafetyReviewConsole } from '@clarity-chat/react/internal'

const meta = {
  title: 'Advanced/Enterprise/SafetyReviewConsole',
  component: SafetyReviewConsole,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Console for reviewing and managing safety highlights in AI-generated content.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-full max-w-4xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SafetyReviewConsole>

export default meta
type Story = StoryObj<typeof meta>

const sampleContent =
  'This is a sample message that contains some potentially sensitive information. The system has identified several areas that may need review before approval. Please review the highlighted sections carefully.'

const sampleHighlights = [
  {
    id: '1',
    start: 50,
    end: 80,
    category: 'PII',
    severity: 'high' as const,
    suggestion: 'Consider redacting personal information',
  },
  {
    id: '2',
    start: 120,
    end: 150,
    category: 'Content',
    severity: 'medium' as const,
    suggestion: 'Review for appropriateness',
  },
  {
    id: '3',
    start: 180,
    end: 210,
    category: 'Safety',
    severity: 'low' as const,
    suggestion: 'Verify accuracy',
  },
]

export const Default: Story = {
  args: {
    content: sampleContent,
    highlights: sampleHighlights,
  },
}

export const WithCallbacks: Story = {
  args: {
    content: sampleContent,
    highlights: sampleHighlights,
    onRedact: (highlight) => {
      console.log('Redact highlight:', highlight)
      alert(`Redacting: ${highlight.category} (${highlight.severity})`)
    },
    onApprove: () => {
      console.log('Approved')
      alert('Content approved')
    },
    onReject: () => {
      console.log('Rejected')
      alert('Content rejected')
    },
  },
}

export const NoHighlights: Story = {
  args: {
    content: 'This is clean content with no safety concerns.',
    highlights: [],
  },
}

export const HighSeverityOnly: Story = {
  args: {
    content: sampleContent,
    highlights: sampleHighlights.filter((h) => h.severity === 'high'),
  },
}

export const LongContent: Story = {
  args: {
    content: Array(10)
      .fill(
        'This is a longer piece of content that contains multiple safety highlights. The system will identify and mark various sections that require review. Each highlight can be individually addressed or redacted as needed.'
      )
      .join(' '),
    highlights: Array.from({ length: 5 }, (_, i) => ({
      id: `highlight-${i}`,
      start: i * 100,
      end: i * 100 + 50,
      category: ['PII', 'Content', 'Safety', 'Bias', 'Accuracy'][i % 5],
      severity: (['high', 'medium', 'low'] as const)[i % 3],
      suggestion: `Review ${['PII', 'Content', 'Safety', 'Bias', 'Accuracy'][i % 5]}`,
    })),
  },
}
