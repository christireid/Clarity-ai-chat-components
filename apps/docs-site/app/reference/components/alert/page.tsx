import React from 'react';
import { Metadata } from 'next';
import LiveDemo from '@/components/LiveDemo';
import ApiTable from '@/components/ApiTable';
import Callout from '@/components/Callout';

export const metadata: Metadata = {
  title: 'Alert Component - Clarity Chat Components',
  description: 'A feedback component that displays important messages, notifications, and system information to users.',
};

export default function AlertPage() {
  return (
    <div className="docs-content">
      <header className="docs-header">
        <div>
          <h1>Alert</h1>
          <p className="text-xl text-neutral-700 dark:text-neutral-300 mt-2">
            A feedback component that displays important messages, notifications, and system information to users.
          </p>
        </div>
      </header>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          The Alert component provides contextual feedback messages for typical user actions. Alerts are
          persistent notifications that remain visible until dismissed by the user or removed programmatically.
          They're ideal for communicating status, warnings, errors, and informational messages.
        </p>

        <Callout type="info" title="Alert vs Toast">
          Use Alert for persistent messages that require user attention.
          Use Toast for temporary, auto-dismissing notifications.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <LiveDemo
          code={`import { Alert } from '@clarity/chat-components';

export default function BasicAlert() {
  return (
    <Alert>
      This is a basic alert message.
    </Alert>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <ApiTable
          title="Alert Props"
          data={[
            {
              prop: 'variant',
              type: "'info' | 'success' | 'warning' | 'error'",
              default: "'info'",
              description: 'Visual style and semantic meaning'
            },
            {
              prop: 'title',
              type: 'string | ReactNode',
              default: 'undefined',
              description: 'Alert title'
            },
            {
              prop: 'children',
              type: 'ReactNode',
              default: 'undefined',
              description: 'Alert content/message'
            },
            {
              prop: 'icon',
              type: 'ReactNode | false',
              default: 'undefined',
              description: 'Custom icon or false to hide default icon'
            },
            {
              prop: 'dismissible',
              type: 'boolean',
              default: 'false',
              description: 'Whether the alert can be dismissed'
            },
            {
              prop: 'onDismiss',
              type: '() => void',
              default: 'undefined',
              description: 'Callback fired when alert is dismissed'
            },
            {
              prop: 'action',
              type: 'ReactNode',
              default: 'undefined',
              description: 'Action button or element to display'
            },
            {
              prop: 'className',
              type: 'string',
              default: 'undefined',
              description: 'Additional CSS classes'
            }
          ]}
        />
      </section>

      <section className="docs-section">
        <h2>Variants</h2>
        <p>
          Use semantic variants to communicate different types of messages.
        </p>
        <LiveDemo
          code={`import { Alert } from '@clarity/chat-components';

export default function AlertVariants() {
  return (
    <div className="space-y-4">
      <Alert variant="info">
        This is an informational alert with useful information.
      </Alert>

      <Alert variant="success">
        Success! Your changes have been saved.
      </Alert>

      <Alert variant="warning">
        Warning: This action cannot be undone.
      </Alert>

      <Alert variant="error">
        Error: Failed to process your request.
      </Alert>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>With Title</h2>
        <p>
          Add a title for clearer message hierarchy.
        </p>
        <LiveDemo
          code={`import { Alert } from '@clarity/chat-components';

export default function AlertWithTitle() {
  return (
    <div className="space-y-4">
      <Alert variant="info" title="Information">
        Check out our new features and improvements in the latest update.
      </Alert>

      <Alert variant="success" title="Payment Successful">
        Your payment of $49.99 has been processed successfully.
        Receipt has been sent to your email.
      </Alert>

      <Alert variant="warning" title="Account Expiring Soon">
        Your subscription will expire in 3 days.
        Renew now to avoid service interruption.
      </Alert>

      <Alert variant="error" title="Connection Failed">
        Unable to connect to the server. Please check your internet
        connection and try again.
      </Alert>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Dismissible Alerts</h2>
        <p>
          Allow users to dismiss alerts when they're no longer relevant.
        </p>
        <LiveDemo
          code={`import { useState } from 'react';
import { Alert, Button } from '@clarity/chat-components';

export default function DismissibleAlert() {
  const [alerts, setAlerts] = useState({
    info: true,
    success: true,
    warning: true
  });

  const showAll = () => {
    setAlerts({ info: true, success: true, warning: true });
  };

  return (
    <div className="space-y-4">
      {alerts.info && (
        <Alert
          variant="info"
          title="New Feature Available"
          dismissible
          onDismiss={() => setAlerts(prev => ({ ...prev, info: false }))}
        >
          We've added dark mode support! Try it out in settings.
        </Alert>
      )}

      {alerts.success && (
        <Alert
          variant="success"
          dismissible
          onDismiss={() => setAlerts(prev => ({ ...prev, success: false }))}
        >
          Profile updated successfully!
        </Alert>
      )}

      {alerts.warning && (
        <Alert
          variant="warning"
          title="Maintenance Scheduled"
          dismissible
          onDismiss={() => setAlerts(prev => ({ ...prev, warning: false }))}
        >
          System maintenance on Sunday 2AM - 4AM EST.
        </Alert>
      )}

      {!alerts.info && !alerts.success && !alerts.warning && (
        <div className="text-center py-8 text-gray-500">
          <p className="mb-3">All alerts dismissed</p>
          <Button size="sm" onClick={showAll}>
            Show Alerts Again
          </Button>
        </div>
      )}
    </div>
  );
}`}
          scope={{ useState: React.useState }}
        />
      </section>

      <section className="docs-section">
        <h2>With Actions</h2>
        <p>
          Include action buttons for users to respond to alerts.
        </p>
        <LiveDemo
          code={`import { Alert, Button } from '@clarity/chat-components';

export default function AlertWithActions() {
  return (
    <div className="space-y-4">
      <Alert
        variant="info"
        title="Update Available"
        action={
          <Button size="sm" variant="primary">
            Update Now
          </Button>
        }
      >
        A new version is available with bug fixes and improvements.
      </Alert>

      <Alert
        variant="warning"
        title="Confirm Your Email"
        action={
          <div className="flex gap-2">
            <Button size="sm" variant="secondary">
              Resend
            </Button>
            <Button size="sm" variant="primary">
              Open Email
            </Button>
          </div>
        }
      >
        Please verify your email address to access all features.
      </Alert>

      <Alert
        variant="error"
        title="Payment Failed"
        action={
          <Button size="sm" variant="danger">
            Retry Payment
          </Button>
        }
      >
        Your card was declined. Please update your payment method.
      </Alert>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Custom Icons</h2>
        <p>
          Customize or remove icons to match your needs.
        </p>
        <LiveDemo
          code={`import { Alert } from '@clarity/chat-components';

export default function CustomIconAlert() {
  return (
    <div className="space-y-4">
      <Alert variant="info" icon={<span className="text-2xl">📢</span>}>
        Announcement: New features coming soon!
      </Alert>

      <Alert variant="success" icon={<span className="text-2xl">🎉</span>}>
        Congratulations! You've earned a new badge.
      </Alert>

      <Alert variant="warning" icon={<span className="text-2xl">⏰</span>}>
        Reminder: Meeting in 15 minutes.
      </Alert>

      <Alert variant="info" icon={false}>
        This alert has no icon for a cleaner look.
      </Alert>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Rich Content</h2>
        <p>
          Alerts can contain complex content including lists, links, and formatting.
        </p>
        <LiveDemo
          code={`import { Alert } from '@clarity/chat-components';

export default function RichContentAlert() {
  return (
    <div className="space-y-4">
      <Alert variant="info" title="New Features">
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Dark mode support</li>
          <li>Keyboard shortcuts</li>
          <li>Improved performance</li>
        </ul>
        <a href="#" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
          Learn more →
        </a>
      </Alert>

      <Alert variant="warning" title="Before You Continue">
        <p className="mb-2">
          Please review the following before proceeding:
        </p>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Backup your data</li>
          <li>Close all running applications</li>
          <li>Ensure stable internet connection</li>
        </ol>
      </Alert>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Inline vs Block</h2>
        <p>
          Alerts can be used inline within content or as standalone blocks.
        </p>
        <LiveDemo
          code={`import { Alert } from '@clarity/chat-components';

export default function InlineBlockAlert() {
  return (
    <div className="space-y-6">
      <div className="prose">
        <h3>Article Title</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Sed do eiusmod tempor incididunt ut labore.
        </p>
        
        <Alert variant="info" className="my-4">
          <strong>Editor's Note:</strong> This article was updated on
          October 31, 2024 with new information.
        </Alert>

        <p>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco
          laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Advanced Patterns</h2>

        <h3>Alert Stack</h3>
        <p>
          Display multiple alerts in a stack for related messages.
        </p>
        <LiveDemo
          code={`import { Alert } from '@clarity/chat-components';

export default function AlertStack() {
  const notifications = [
    { id: 1, variant: 'success', message: '3 files uploaded successfully' },
    { id: 2, variant: 'warning', message: '1 file was too large and was skipped' },
    { id: 3, variant: 'info', message: 'Processing will begin in a few moments' }
  ];

  return (
    <div className="space-y-2">
      {notifications.map(notif => (
        <Alert key={notif.id} variant={notif.variant}>
          {notif.message}
        </Alert>
      ))}
    </div>
  );
}`}
        />

        <h3>Alert with Progress</h3>
        <p>
          Combine alerts with progress indicators for ongoing operations.
        </p>
        <LiveDemo
          code={`import { useState, useEffect } from 'react';
import { Alert, Progress } from '@clarity/chat-components';

export default function AlertWithProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 100 : prev + 10));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Alert
      variant={progress === 100 ? 'success' : 'info'}
      title={progress === 100 ? 'Upload Complete' : 'Uploading Files...'}
    >
      <div className="mt-2">
        <Progress value={progress} size="sm" />
        <p className="text-sm mt-2">
          {progress === 100
            ? 'All files uploaded successfully!'
            : \`Uploading... \${progress}%\`}
        </p>
      </div>
    </Alert>
  );
}`}
          scope={{ useState: React.useState, useEffect: React.useEffect }}
        />

        <h3>Expandable Alert</h3>
        <p>
          Create expandable alerts for detailed information.
        </p>
        <LiveDemo
          code={`import { useState } from 'react';
import { Alert, Button } from '@clarity/chat-components';

export default function ExpandableAlert() {
  const [expanded, setExpanded] = useState(false);

  return (
    <Alert variant="warning" title="System Update Required">
      <p>A critical security update is available for your system.</p>
      
      {expanded && (
        <div className="mt-3 text-sm space-y-2 border-t pt-3">
          <p><strong>What's included:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Security patches for CVE-2024-XXXX</li>
            <li>Performance improvements</li>
            <li>Bug fixes</li>
          </ul>
          <p className="mt-2">
            <strong>Downtime:</strong> Approximately 5 minutes
          </p>
        </div>
      )}

      <Button
        size="sm"
        variant="ghost"
        onClick={() => setExpanded(!expanded)}
        className="mt-2"
      >
        {expanded ? 'Show Less' : 'Show More Details'}
      </Button>
    </Alert>
  );
}`}
          scope={{ useState: React.useState }}
        />
      </section>

      <section className="docs-section">
        <h2>Accessibility</h2>
        <p>
          The Alert component includes comprehensive accessibility features:
        </p>

        <h3>ARIA Attributes</h3>
        <ul>
          <li><code>role="alert"</code> - For urgent, important messages</li>
          <li><code>role="status"</code> - For non-urgent status updates</li>
          <li><code>aria-live="polite"</code> - Announces changes without interrupting</li>
          <li><code>aria-atomic="true"</code> - Announces entire content when updated</li>
        </ul>

        <h3>Keyboard Navigation</h3>
        <ul>
          <li>Dismiss button is keyboard focusable</li>
          <li><kbd>Enter</kbd> / <kbd>Space</kbd> - Dismiss alert</li>
          <li>Action buttons are keyboard accessible</li>
          <li>Focus is managed when alert is dismissed</li>
        </ul>

        <h3>Screen Reader Support</h3>
        <ul>
          <li>Alert type is announced to screen readers</li>
          <li>Title and content are properly associated</li>
          <li>Dismiss action is clearly labeled</li>
        </ul>

        <Callout type="warning" title="Important Alerts">
          For critical alerts that require immediate attention, use <code>role="alert"</code>
          which interrupts screen reader users. Use sparingly.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>

        <h3>When to Use</h3>
        <ul>
          <li>✅ System-wide messages that affect all users</li>
          <li>✅ Form validation errors at the form level</li>
          <li>✅ Important status changes requiring acknowledgment</li>
          <li>✅ Warnings about consequences of actions</li>
          <li>✅ Success confirmations for major operations</li>
        </ul>

        <h3>When Not to Use</h3>
        <ul>
          <li>❌ Inline field validation - use field-level errors</li>
          <li>❌ Temporary notifications - use Toast instead</li>
          <li>❌ Marketing promotions - use Banner component</li>
          <li>❌ Non-critical updates - consider less intrusive patterns</li>
        </ul>

        <h3>Design Guidelines</h3>
        <ul>
          <li>Keep messages concise and actionable</li>
          <li>Use appropriate variants for semantic meaning</li>
          <li>Include clear calls-to-action when needed</li>
          <li>Don't stack too many alerts (3-4 maximum)</li>
          <li>Position alerts near related content when possible</li>
          <li>Use titles for complex or important messages</li>
          <li>Make alerts dismissible unless action is required</li>
        </ul>

        <h3>Content Guidelines</h3>
        <ul>
          <li>Start with the most important information</li>
          <li>Use active voice and clear language</li>
          <li>Provide context and next steps</li>
          <li>Avoid technical jargon when possible</li>
          <li>Include error codes for support purposes</li>
        </ul>

        <Callout type="info" title="Alert Fatigue">
          Too many alerts can cause users to ignore them. Use sparingly and
          ensure each alert provides value. Consider alternatives like inline
          messages or status indicators.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>TypeScript</h2>
        <p>
          The Alert component is fully typed with TypeScript:
        </p>
        <pre><code>{`import { ReactNode } from 'react';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  // Content
  title?: string | ReactNode;
  children: ReactNode;
  
  // Appearance
  variant?: AlertVariant;
  icon?: ReactNode | false;
  
  // Behavior
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: ReactNode;
  
  // Styling
  className?: string;
}

export default function Alert(props: AlertProps): JSX.Element;`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Related Components</h2>
        <ul>
          <li><a href="/reference/components/toast">Toast</a> - Temporary, auto-dismissing notifications</li>
          <li><a href="/reference/components/banner">Banner</a> - Page-level announcements</li>
          <li><a href="/reference/components/callout">Callout</a> - Highlighted content blocks</li>
        </ul>
      </section>
    </div>
  );
}
