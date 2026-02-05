/**
 * Feedback Components View
 *
 * Comprehensive showcase of all feedback mechanisms including:
 * - MessageFeedback (thumbs up/down)
 * - RatingWidget (star rating)
 * - DetailedFeedback with text
 * - ExportDialog for chat history
 * - ShareDialog with options
 * - NotificationCenter
 * - Toast notifications
 * - ErrorBoundary with fallback
 */

import React, { useState } from 'react'
import {
  ThumbsFeedback,
  StarRating,
  DetailedFeedback,
  ShareButton,
  ShareDialog,
  NotificationCenter,
  type Notification,
  type FeedbackData,
} from '@clarity-chat/react/clarity'
import { ExportDialog, type ExportOptions } from '@clarity-chat/react'
import { useToast } from '@clarity-chat/react'
import ErrorBoundary from '../components/ErrorBoundary'

export function FeedbackComponentsView() {
  const { showToast } = useToast()
  const [feedback, setFeedback] = useState<FeedbackData | null>(null)
  const [rating, setRating] = useState(0)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [showError, setShowError] = useState(false)

  // Sample notifications
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Message sent successfully',
      message: 'Your message has been delivered to the AI assistant',
      timestamp: new Date(Date.now() - 5 * 60000),
      read: false,
      category: 'messages',
    },
    {
      id: '2',
      type: 'info',
      title: 'New feature available',
      message: 'Try our new voice input feature for hands-free chatting',
      timestamp: new Date(Date.now() - 30 * 60000),
      read: false,
      category: 'updates',
    },
    {
      id: '3',
      type: 'warning',
      title: 'Token limit approaching',
      message: 'You have used 80% of your monthly token quota',
      timestamp: new Date(Date.now() - 2 * 60 * 60000),
      read: true,
      category: 'usage',
    },
    {
      id: '4',
      type: 'error',
      title: 'Export failed',
      message: 'Could not export chat history. Please try again.',
      timestamp: new Date(Date.now() - 24 * 60 * 60000),
      read: true,
      action: {
        label: 'Retry',
        onClick: () => showToast('Retrying export...', 'info'),
      },
      category: 'errors',
    },
  ])

  // Sample messages for export
  const sampleMessages = [
    { id: '1', role: 'user', content: 'Hello, how are you?', timestamp: new Date() },
    { id: '2', role: 'assistant', content: 'I am doing well, thank you!', timestamp: new Date() },
  ]

  const handleFeedback = (data: FeedbackData) => {
    setFeedback(data)
    showToast(`Feedback received: ${data.type}`, 'success')
  }

  const handleRatingChange = (value: number) => {
    setRating(value)
    showToast(`Rated ${value} stars`, 'success')
  }

  const handleExport = async (options: ExportOptions) => {
    console.log('Exporting with options:', options)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    showToast('Chat history exported successfully!', 'success')
    setExportDialogOpen(false)
  }

  const handleShare = (platform: string) => {
    showToast(`Shared to ${platform}`, 'success')
  }

  const handleNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const handleNotificationDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    showToast('Notification deleted', 'info')
  }

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    showToast('All notifications marked as read', 'success')
  }

  const handleClearAll = () => {
    setNotifications([])
    showToast('All notifications cleared', 'info')
  }

  // Component to trigger error for ErrorBoundary demo
  const ErrorTrigger = ({ shouldError }: { shouldError: boolean }) => {
    if (shouldError) {
      throw new Error('Demo error: Something went wrong!')
    }
    return <div className="feedback-success">No errors here!</div>
  }

  return (
    <div className="feedback-components-view">
      <div className="feedback-header">
        <h1>Feedback Components Showcase</h1>
        <p className="feedback-description">
          Interactive demonstrations of all feedback mechanisms available in Clarity Chat
        </p>
      </div>

      <div className="feedback-sections">
        {/* Message Feedback Section */}
        <section className="feedback-section">
          <div className="section-header">
            <h2>1. Message Feedback (Thumbs Up/Down)</h2>
            <p>Quick binary feedback on messages</p>
          </div>
          <div className="demo-container">
            <div className="demo-card">
              <h3>Default Size</h3>
              <div className="demo-content">
                <div className="sample-message">
                  <p>Here's a sample AI response. Was this helpful?</p>
                  <ThumbsFeedback
                    onFeedback={handleFeedback}
                    showLabels={false}
                  />
                </div>
              </div>
            </div>

            <div className="demo-card">
              <h3>With Labels</h3>
              <div className="demo-content">
                <div className="sample-message">
                  <p>Another message with labeled feedback buttons</p>
                  <ThumbsFeedback
                    onFeedback={handleFeedback}
                    showLabels={true}
                    size="lg"
                  />
                </div>
              </div>
            </div>

            <div className="demo-card">
              <h3>Small Size</h3>
              <div className="demo-content">
                <div className="sample-message compact">
                  <p>Compact message with small feedback</p>
                  <ThumbsFeedback
                    onFeedback={handleFeedback}
                    size="sm"
                  />
                </div>
              </div>
            </div>
          </div>
          {feedback && (
            <div className="feedback-result">
              <strong>Last Feedback:</strong> {feedback.type}
              {feedback.reason && ` (${feedback.reason})`}
              {feedback.comment && ` - "${feedback.comment}"`}
            </div>
          )}
        </section>

        {/* Rating Widget Section */}
        <section className="feedback-section">
          <div className="section-header">
            <h2>2. Star Rating Widget</h2>
            <p>5-star rating system for detailed feedback</p>
          </div>
          <div className="demo-container">
            <div className="demo-card">
              <h3>Interactive Rating</h3>
              <div className="demo-content centered">
                <div className="rating-demo">
                  <p>Rate your experience:</p>
                  <StarRating
                    value={rating}
                    onChange={handleRatingChange}
                    size="lg"
                  />
                  <p className="rating-label">
                    {rating === 0 && 'Click to rate'}
                    {rating === 1 && 'Poor'}
                    {rating === 2 && 'Fair'}
                    {rating === 3 && 'Good'}
                    {rating === 4 && 'Very Good'}
                    {rating === 5 && 'Excellent'}
                  </p>
                </div>
              </div>
            </div>

            <div className="demo-card">
              <h3>Read-only Display</h3>
              <div className="demo-content centered">
                <div className="rating-demo">
                  <StarRating value={4} readOnly size="md" />
                  <p className="rating-label">4.0 out of 5</p>
                </div>
              </div>
            </div>

            <div className="demo-card">
              <h3>Half Stars</h3>
              <div className="demo-content centered">
                <div className="rating-demo">
                  <StarRating value={3.5} readOnly allowHalf size="md" />
                  <p className="rating-label">3.5 out of 5</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feedback Form Section */}
        <section className="feedback-section">
          <div className="section-header">
            <h2>3. Detailed Feedback Form</h2>
            <p>Complete feedback with text comments</p>
          </div>
          <div className="demo-container">
            <div className="demo-card full-width">
              <DetailedFeedback
                onSubmit={(data) => {
                  console.log('Feedback submitted:', data)
                  showToast('Thank you for your feedback!', 'success')
                }}
                includeRating={true}
                includeCategory={true}
                categories={['Bug Report', 'Feature Request', 'General Feedback', 'Question']}
              />
            </div>
          </div>
        </section>

        {/* Export Dialog Section */}
        <section className="feedback-section">
          <div className="section-header">
            <h2>4. Export Chat History</h2>
            <p>Download conversations in multiple formats</p>
          </div>
          <div className="demo-container">
            <div className="demo-card">
              <h3>Export Options</h3>
              <div className="demo-content centered">
                <button
                  className="demo-button primary"
                  onClick={() => setExportDialogOpen(true)}
                >
                  Open Export Dialog
                </button>
                <p className="demo-hint">
                  Supports PDF, Word, Markdown, JSON, and HTML formats
                </p>
              </div>
            </div>
          </div>
          <ExportDialog
            open={exportDialogOpen}
            onOpenChange={setExportDialogOpen}
            onExport={handleExport}
            resourceType="chat"
            resourceName="My Conversation"
          />
        </section>

        {/* Share Dialog Section */}
        <section className="feedback-section">
          <div className="section-header">
            <h2>5. Share Conversation</h2>
            <p>Share chats via multiple platforms</p>
          </div>
          <div className="demo-container">
            <div className="demo-card">
              <h3>Quick Share Button</h3>
              <div className="demo-content centered">
                <ShareButton
                  url="https://example.com/chat/123"
                  title="Check out this AI conversation!"
                  description="An interesting chat about machine learning"
                  onShare={handleShare}
                />
              </div>
            </div>

            <div className="demo-card">
              <h3>Full Share Dialog</h3>
              <div className="demo-content centered">
                <button
                  className="demo-button primary"
                  onClick={() => setShareDialogOpen(true)}
                >
                  Open Share Dialog
                </button>
              </div>
            </div>
          </div>
          <ShareDialog
            open={shareDialogOpen}
            onOpenChange={setShareDialogOpen}
            url="https://example.com/chat/123"
            title="AI Conversation"
            onShare={handleShare}
          />
        </section>

        {/* Notification Center Section */}
        <section className="feedback-section">
          <div className="section-header">
            <h2>6. Notification Center</h2>
            <p>Centralized notification management</p>
          </div>
          <div className="demo-container">
            <div className="demo-card full-width">
              <div className="notification-demo">
                <NotificationCenter
                  notifications={notifications}
                  onRead={handleNotificationRead}
                  onDelete={handleNotificationDelete}
                  onMarkAllRead={handleMarkAllRead}
                  onClearAll={handleClearAll}
                />
              </div>
              <div className="demo-actions">
                <button
                  className="demo-button"
                  onClick={() => {
                    const newNotification: Notification = {
                      id: Date.now().toString(),
                      type: 'info',
                      title: 'New notification',
                      message: 'This is a test notification',
                      timestamp: new Date(),
                      read: false,
                      category: 'test',
                    }
                    setNotifications((prev) => [newNotification, ...prev])
                  }}
                >
                  Add Test Notification
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Toast Notifications Section */}
        <section className="feedback-section">
          <div className="section-header">
            <h2>7. Toast Notifications</h2>
            <p>Temporary feedback messages</p>
          </div>
          <div className="demo-container">
            <div className="demo-card">
              <h3>Success Toast</h3>
              <div className="demo-content centered">
                <button
                  className="demo-button success"
                  onClick={() => showToast('Operation completed successfully!', 'success')}
                >
                  Show Success
                </button>
              </div>
            </div>

            <div className="demo-card">
              <h3>Error Toast</h3>
              <div className="demo-content centered">
                <button
                  className="demo-button error"
                  onClick={() => showToast('An error occurred. Please try again.', 'error')}
                >
                  Show Error
                </button>
              </div>
            </div>

            <div className="demo-card">
              <h3>Warning Toast</h3>
              <div className="demo-content centered">
                <button
                  className="demo-button warning"
                  onClick={() => showToast('Warning: Token limit approaching', 'warning')}
                >
                  Show Warning
                </button>
              </div>
            </div>

            <div className="demo-card">
              <h3>Info Toast</h3>
              <div className="demo-content centered">
                <button
                  className="demo-button info"
                  onClick={() => showToast('Tip: Use Ctrl+/ to open command palette', 'info')}
                >
                  Show Info
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Error Boundary Section */}
        <section className="feedback-section">
          <div className="section-header">
            <h2>8. Error Boundary</h2>
            <p>Graceful error handling with fallback UI</p>
          </div>
          <div className="demo-container">
            <div className="demo-card">
              <h3>Without Error</h3>
              <div className="demo-content">
                <ErrorBoundary>
                  <ErrorTrigger shouldError={false} />
                </ErrorBoundary>
              </div>
            </div>

            <div className="demo-card">
              <h3>With Error</h3>
              <div className="demo-content">
                <ErrorBoundary
                  onError={(error) => {
                    console.error('Caught error:', error)
                    showToast('Error caught by boundary', 'error')
                  }}
                >
                  <ErrorTrigger shouldError={showError} />
                </ErrorBoundary>
              </div>
              <div className="demo-actions">
                <button
                  className="demo-button error"
                  onClick={() => setShowError(!showError)}
                >
                  {showError ? 'Reset' : 'Trigger Error'}
                </button>
              </div>
            </div>

            <div className="demo-card">
              <h3>Custom Fallback</h3>
              <div className="demo-content">
                <ErrorBoundary
                  fallback={
                    <div className="custom-error-fallback">
                      <h3>Custom Error UI</h3>
                      <p>This is a custom error fallback component</p>
                      <button className="demo-button">Contact Support</button>
                    </div>
                  }
                >
                  <div className="feedback-success">Custom fallback example</div>
                </ErrorBoundary>
              </div>
            </div>
          </div>
        </section>

        {/* Integration Example */}
        <section className="feedback-section highlight">
          <div className="section-header">
            <h2>Integration Example</h2>
            <p>All feedback components working together</p>
          </div>
          <div className="demo-container">
            <div className="demo-card full-width">
              <div className="integrated-demo">
                <div className="chat-message-example">
                  <div className="message-header">
                    <span className="message-author">AI Assistant</span>
                    <span className="message-time">2 minutes ago</span>
                  </div>
                  <div className="message-content">
                    <p>
                      Here's a comprehensive answer to your question about machine learning.
                      The key concepts include supervised learning, unsupervised learning, and
                      reinforcement learning. Each approach has its own use cases and benefits.
                    </p>
                  </div>
                  <div className="message-actions">
                    <ThumbsFeedback onFeedback={handleFeedback} size="sm" />
                    <button
                      className="action-button"
                      onClick={() => showToast('Message copied to clipboard', 'success')}
                    >
                      Copy
                    </button>
                    <ShareButton
                      title="Check out this AI response"
                      onShare={handleShare}
                    />
                  </div>
                </div>

                <div className="session-rating">
                  <h3>Rate this conversation</h3>
                  <StarRating
                    value={rating}
                    onChange={handleRatingChange}
                    size="md"
                  />
                  <button
                    className="demo-button primary"
                    onClick={() => setExportDialogOpen(true)}
                  >
                    Export Conversation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Usage Guide */}
      <section className="feedback-section usage-guide">
        <div className="section-header">
          <h2>Usage Guide</h2>
        </div>
        <div className="guide-content">
          <div className="guide-item">
            <h3>Message Feedback</h3>
            <pre><code>{`import { ThumbsFeedback } from '@clarity-chat/react/clarity'

<ThumbsFeedback
  onFeedback={(data) => console.log(data)}
  showLabels={true}
  size="md"
/>`}</code></pre>
          </div>

          <div className="guide-item">
            <h3>Star Rating</h3>
            <pre><code>{`import { StarRating } from '@clarity-chat/react/clarity'

<StarRating
  value={rating}
  onChange={setRating}
  size="lg"
  allowHalf={true}
/>`}</code></pre>
          </div>

          <div className="guide-item">
            <h3>Export Dialog</h3>
            <pre><code>{`import { ExportDialog } from '@clarity-chat/react'

<ExportDialog
  open={open}
  onOpenChange={setOpen}
  onExport={handleExport}
  resourceType="chat"
  resourceName="My Chat"
/>`}</code></pre>
          </div>

          <div className="guide-item">
            <h3>Notifications</h3>
            <pre><code>{`import { NotificationCenter } from '@clarity-chat/react/clarity'

<NotificationCenter
  notifications={notifications}
  onRead={handleRead}
  onDelete={handleDelete}
/>`}</code></pre>
          </div>

          <div className="guide-item">
            <h3>Toast Notifications</h3>
            <pre><code>{`import { useToast } from '@clarity-chat/react'

const { showToast } = useToast()

showToast('Success message', 'success')
showToast('Error message', 'error')
showToast('Warning message', 'warning')
showToast('Info message', 'info')`}</code></pre>
          </div>

          <div className="guide-item">
            <h3>Error Boundary</h3>
            <pre><code>{`import ErrorBoundary from './ErrorBoundary'

<ErrorBoundary
  fallback={<CustomError />}
  onError={(error) => console.error(error)}
>
  <YourComponent />
</ErrorBoundary>`}</code></pre>
          </div>
        </div>
      </section>
    </div>
  )
}
