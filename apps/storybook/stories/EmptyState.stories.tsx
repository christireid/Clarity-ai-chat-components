import type { Meta, StoryObj } from '@storybook/react'
import {
  EmptyState,
  EmptyChatState,
  NoSearchResultsState,
  NoConversationsState,
  ErrorState,
  SuccessState,
} from '@clarity-chat/react'

const meta = {
  title: 'Components/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Empty state components that gracefully handle no-data scenarios with clear messaging and actionable next steps.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    icon: { control: false },
    action: { control: false },
    secondaryAction: { control: false },
  },
} satisfies Meta<typeof EmptyState>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Nothing here yet',
    description: 'Create your first item to see it appear in this list.',
    action: {
      label: 'Create Item',
      onClick: () => alert('Create clicked!'),
    },
    secondaryAction: {
      label: 'Learn More',
      onClick: () => alert('Learn more clicked!'),
    },
  },
}

export const EmptyChat: Story = {
  render: () => (
    <EmptyChatState onStartChat={() => alert('Start chat clicked!')} />
  ),
}

export const NoSearchResults: Story = {
  render: () => (
    <NoSearchResultsState
      searchQuery="artificial intelligence"
      onClearSearch={() => alert('Clear search!')}
    />
  ),
}

export const NoConversations: Story = {
  render: () => (
    <NoConversationsState
      onCreateConversation={() => alert('Start conversation clicked!')}
    />
  ),
}

export const ErrorView: Story = {
  render: () => (
    <ErrorState
      title="Failed to load data"
      description="We couldn't load the requested content. Please try again."
      onRetry={() => alert('Retry clicked!')}
      onGoBack={() => alert('Go back clicked!')}
    />
  ),
}

export const SuccessView: Story = {
  render: () => (
    <SuccessState
      title="All done!"
      description="You've completed all tasks. Great job!"
      onContinue={() => alert('Continue clicked!')}
    />
  ),
}

export const CustomLayout: Story = {
  render: () => (
    <EmptyState
      title="Inbox zero"
      description="You're all caught up. Check back later for new messages."
      action={{
        label: 'Compose Message',
        onClick: () => alert('Compose clicked!'),
      }}
    />
  ),
}
