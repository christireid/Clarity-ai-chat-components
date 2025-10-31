import React from 'react';
import { Metadata } from 'next';
import LiveDemo from '@/components/LiveDemo';
import ApiTable from '@/components/ApiTable';
import Callout from '@/components/Callout';

export const metadata: Metadata = {
  title: 'Toast Component - Clarity Chat Components',
  description: 'A temporary notification component that displays brief messages about app processes without interrupting the user experience.',
};

export default function ToastPage() {
  return (
    <div className="docs-content">
      <header className="docs-header">
        <div>
          <h1>Toast</h1>
          <p className="text-xl text-neutral-700 dark:text-neutral-300 mt-2">
            A temporary notification component that displays brief messages about app processes without interrupting the user experience.
          </p>
        </div>
      </header>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          Toast notifications provide lightweight feedback about operations. They appear temporarily at the edge
          of the screen, auto-dismiss after a few seconds, and don't block interaction with the rest of the app.
          Perfect for success messages, quick updates, and non-critical information.
        </p>

        <Callout type="info" title="Toast vs Alert">
          Use Toast for temporary, auto-dismissing notifications.
          Use Alert for persistent messages that require user attention.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <LiveDemo
          code={`import { useState } from 'react';
import { Button, useToast } from '@clarity/chat-components';

export default function BasicToast() {
  const { showToast } = useToast();

  return (
    <Button onClick={() => showToast('This is a basic toast message')}>
      Show Toast
    </Button>
  );
}`}
          scope={{ useState: React.useState }}
        />
      </section>

      <section className="docs-section">
        <h2>Toast Options</h2>
        <ApiTable
          title="Toast Configuration"
          data={[
            {
              prop: 'message',
              type: 'string | ReactNode',
              default: 'undefined',
              description: 'Toast content message'
            },
            {
              prop: 'variant',
              type: "'info' | 'success' | 'warning' | 'error'",
              default: "'info'",
              description: 'Visual style and semantic meaning'
            },
            {
              prop: 'title',
              type: 'string',
              default: 'undefined',
              description: 'Optional toast title'
            },
            {
              prop: 'duration',
              type: 'number',
              default: '3000',
              description: 'Auto-dismiss duration in milliseconds (0 for persistent)'
            },
            {
              prop: 'position',
              type: "'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'",
              default: "'top-right'",
              description: 'Toast position on screen'
            },
            {
              prop: 'dismissible',
              type: 'boolean',
              default: 'true',
              description: 'Whether toast can be manually dismissed'
            },
            {
              prop: 'action',
              type: '{ label: string; onClick: () => void }',
              default: 'undefined',
              description: 'Action button configuration'
            },
            {
              prop: 'icon',
              type: 'ReactNode | false',
              default: 'undefined',
              description: 'Custom icon or false to hide default icon'
            },
            {
              prop: 'onDismiss',
              type: '() => void',
              default: 'undefined',
              description: 'Callback fired when toast is dismissed'
            }
          ]}
        />
      </section>

      <section className="docs-section">
        <h2>Variants</h2>
        <p>
          Use semantic variants to communicate different types of notifications.
        </p>
        <LiveDemo
          code={`import { Button, useToast } from '@clarity/chat-components';

export default function ToastVariants() {
  const { showToast } = useToast();

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        size="sm"
        onClick={() => showToast({
          message: 'This is an info toast',
          variant: 'info'
        })}
      >
        Info Toast
      </Button>

      <Button
        size="sm"
        variant="success"
        onClick={() => showToast({
          message: 'Changes saved successfully!',
          variant: 'success'
        })}
      >
        Success Toast
      </Button>

      <Button
        size="sm"
        variant="warning"
        onClick={() => showToast({
          message: 'Warning: Action requires confirmation',
          variant: 'warning'
        })}
      >
        Warning Toast
      </Button>

      <Button
        size="sm"
        variant="danger"
        onClick={() => showToast({
          message: 'Error: Failed to save changes',
          variant: 'error'
        })}
      >
        Error Toast
      </Button>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>With Title</h2>
        <p>
          Add a title for more structured notifications.
        </p>
        <LiveDemo
          code={`import { Button, useToast } from '@clarity/chat-components';

export default function ToastWithTitle() {
  const { showToast } = useToast();

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        size="sm"
        onClick={() => showToast({
          title: 'New Message',
          message: 'You have received a new message from John',
          variant: 'info'
        })}
      >
        Show Notification
      </Button>

      <Button
        size="sm"
        variant="success"
        onClick={() => showToast({
          title: 'Upload Complete',
          message: '5 files uploaded successfully',
          variant: 'success'
        })}
      >
        Upload Success
      </Button>

      <Button
        size="sm"
        variant="danger"
        onClick={() => showToast({
          title: 'Connection Lost',
          message: 'Please check your internet connection',
          variant: 'error'
        })}
      >
        Connection Error
      </Button>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Positions</h2>
        <p>
          Display toasts at different screen positions.
        </p>
        <LiveDemo
          code={`import { Button, useToast } from '@clarity/chat-components';

export default function ToastPositions() {
  const { showToast } = useToast();

  const positions = [
    'top-left',
    'top-center',
    'top-right',
    'bottom-left',
    'bottom-center',
    'bottom-right'
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {positions.map(position => (
        <Button
          key={position}
          size="sm"
          variant="secondary"
          onClick={() => showToast({
            message: \`Toast at \${position}\`,
            position: position
          })}
        >
          {position}
        </Button>
      ))}
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Custom Duration</h2>
        <p>
          Control how long toasts remain visible before auto-dismissing.
        </p>
        <LiveDemo
          code={`import { Button, useToast } from '@clarity/chat-components';

export default function ToastDuration() {
  const { showToast } = useToast();

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        size="sm"
        onClick={() => showToast({
          message: 'Quick toast (1 second)',
          duration: 1000
        })}
      >
        1 Second
      </Button>

      <Button
        size="sm"
        onClick={() => showToast({
          message: 'Normal toast (3 seconds)',
          duration: 3000
        })}
      >
        3 Seconds
      </Button>

      <Button
        size="sm"
        onClick={() => showToast({
          message: 'Long toast (7 seconds)',
          duration: 7000
        })}
      >
        7 Seconds
      </Button>

      <Button
        size="sm"
        variant="secondary"
        onClick={() => showToast({
          message: 'Persistent toast (must dismiss manually)',
          duration: 0
        })}
      >
        Persistent
      </Button>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>With Actions</h2>
        <p>
          Include action buttons for users to respond to toasts.
        </p>
        <LiveDemo
          code={`import { Button, useToast } from '@clarity/chat-components';

export default function ToastWithActions() {
  const { showToast } = useToast();

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        size="sm"
        onClick={() => showToast({
          message: 'Message sent!',
          variant: 'success',
          action: {
            label: 'Undo',
            onClick: () => alert('Message unsent')
          }
        })}
      >
        With Undo
      </Button>

      <Button
        size="sm"
        variant="secondary"
        onClick={() => showToast({
          title: 'Update Available',
          message: 'A new version is ready to install',
          variant: 'info',
          duration: 0,
          action: {
            label: 'Install',
            onClick: () => alert('Installing update...')
          }
        })}
      >
        Update Prompt
      </Button>

      <Button
        size="sm"
        variant="warning"
        onClick={() => showToast({
          title: 'Connection Unstable',
          message: 'Your internet connection is weak',
          variant: 'warning',
          action: {
            label: 'Retry',
            onClick: () => alert('Retrying...')
          }
        })}
      >
        With Retry
      </Button>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Toast Queue</h2>
        <p>
          Multiple toasts are automatically queued and displayed sequentially.
        </p>
        <LiveDemo
          code={`import { Button, useToast } from '@clarity/chat-components';

export default function ToastQueue() {
  const { showToast } = useToast();

  const showMultiple = () => {
    showToast({ message: 'First toast', variant: 'info' });
    showToast({ message: 'Second toast', variant: 'success' });
    showToast({ message: 'Third toast', variant: 'warning' });
    showToast({ message: 'Fourth toast', variant: 'error' });
  };

  return (
    <Button onClick={showMultiple}>
      Show Multiple Toasts
    </Button>
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
          code={`import { Button, useToast } from '@clarity/chat-components';

export default function CustomIconToast() {
  const { showToast } = useToast();

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        size="sm"
        onClick={() => showToast({
          message: 'New message from Alice',
          icon: <span className="text-2xl">💬</span>
        })}
      >
        Message Icon
      </Button>

      <Button
        size="sm"
        onClick={() => showToast({
          message: 'File uploaded successfully',
          variant: 'success',
          icon: <span className="text-2xl">📁</span>
        })}
      >
        File Icon
      </Button>

      <Button
        size="sm"
        onClick={() => showToast({
          message: 'Clean minimal toast',
          icon: false
        })}
      >
        No Icon
      </Button>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Advanced Patterns</h2>

        <h3>Progress Toast</h3>
        <p>
          Show progress within a toast notification.
        </p>
        <LiveDemo
          code={`import { useState, useEffect } from 'react';
import { Button, useToast, Progress } from '@clarity/chat-components';

export default function ProgressToast() {
  const { showToast, dismissToast } = useToast();
  const [toastId, setToastId] = useState(null);

  const startUpload = () => {
    let progress = 0;
    const id = showToast({
      title: 'Uploading...',
      message: (
        <div className="mt-2">
          <Progress value={0} size="sm" />
        </div>
      ),
      duration: 0,
      dismissible: false
    });
    setToastId(id);

    const interval = setInterval(() => {
      progress += 10;
      
      if (progress >= 100) {
        clearInterval(interval);
        dismissToast(id);
        showToast({
          title: 'Upload Complete',
          message: 'File uploaded successfully!',
          variant: 'success'
        });
      } else {
        // Update toast with new progress
        // (This would use a toast update API in real implementation)
      }
    }, 300);
  };

  return (
    <Button onClick={startUpload}>
      Upload File
    </Button>
  );
}`}
          scope={{ useState: React.useState, useEffect: React.useEffect }}
        />

        <h3>Rich Content Toast</h3>
        <p>
          Display complex content in toast notifications.
        </p>
        <LiveDemo
          code={`import { Button, useToast } from '@clarity/chat-components';

export default function RichContentToast() {
  const { showToast } = useToast();

  const showNotification = () => {
    showToast({
      message: (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
              JD
            </div>
            <div>
              <div className="font-medium">John Doe</div>
              <div className="text-xs text-gray-600">2 min ago</div>
            </div>
          </div>
          <p className="text-sm">Commented on your post: "Great work!"</p>
        </div>
      ),
      duration: 5000
    });
  };

  return (
    <Button onClick={showNotification}>
      Show Rich Toast
    </Button>
  );
}`}
        />

        <h3>Promise Toast</h3>
        <p>
          Automatically show success/error toasts based on promise resolution.
        </p>
        <LiveDemo
          code={`import { Button, useToast } from '@clarity/chat-components';

export default function PromiseToast() {
  const { showPromiseToast } = useToast();

  const saveData = () => {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.5 ? resolve() : reject();
      }, 2000);
    });

    showPromiseToast(promise, {
      loading: 'Saving changes...',
      success: 'Changes saved successfully!',
      error: 'Failed to save changes'
    });
  };

  return (
    <Button onClick={saveData}>
      Save (Random Result)
    </Button>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Accessibility</h2>
        <p>
          The Toast component includes comprehensive accessibility features:
        </p>

        <h3>ARIA Attributes</h3>
        <ul>
          <li><code>role="status"</code> - For non-urgent notifications</li>
          <li><code>role="alert"</code> - For urgent, important messages</li>
          <li><code>aria-live="polite"</code> - Announces changes without interrupting</li>
          <li><code>aria-atomic="true"</code> - Announces entire content</li>
        </ul>

        <h3>Keyboard Navigation</h3>
        <ul>
          <li>Action buttons are keyboard focusable</li>
          <li><kbd>Enter</kbd> / <kbd>Space</kbd> - Activate action or dismiss</li>
          <li><kbd>Esc</kbd> - Dismiss toast</li>
          <li>Focus management when toasts appear/disappear</li>
        </ul>

        <h3>Screen Reader Support</h3>
        <ul>
          <li>Toast content is announced to screen readers</li>
          <li>Variant type is communicated (success, error, etc.)</li>
          <li>Action buttons are clearly labeled</li>
          <li>Multiple toasts are announced individually</li>
        </ul>

        <Callout type="warning" title="Don't Overuse Toasts">
          Too many toasts can be disruptive, especially for screen reader users.
          Use them sparingly and only for important notifications.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>

        <h3>When to Use</h3>
        <ul>
          <li>✅ Success confirmations for user actions</li>
          <li>✅ Quick status updates that don't require action</li>
          <li>✅ Background process notifications</li>
          <li>✅ Non-critical errors that don't block workflow</li>
          <li>✅ Undo actions with time limit</li>
        </ul>

        <h3>When Not to Use</h3>
        <ul>
          <li>❌ Critical errors requiring immediate attention - use Modal</li>
          <li>❌ Form validation errors - use inline field errors</li>
          <li>❌ Important information users need to reference - use Alert</li>
          <li>❌ Actions requiring decision - use Confirmation dialog</li>
        </ul>

        <h3>Design Guidelines</h3>
        <ul>
          <li>Keep messages short and scannable (1-2 lines)</li>
          <li>Use clear, action-oriented language</li>
          <li>Position consistently (usually top-right or bottom-center)</li>
          <li>Limit to 3-4 visible toasts at a time</li>
          <li>Use appropriate duration (3-5 seconds for most messages)</li>
          <li>Make toasts dismissible for user control</li>
          <li>Don't use toasts for critical information</li>
        </ul>

        <h3>Content Guidelines</h3>
        <ul>
          <li>Start with the outcome (success, failure)</li>
          <li>Be specific about what happened</li>
          <li>Use consistent terminology</li>
          <li>Avoid technical jargon</li>
          <li>Provide context when needed</li>
        </ul>

        <h3>Duration Guidelines</h3>
        <ul>
          <li><strong>1-2 seconds:</strong> Simple confirmations ("Saved")</li>
          <li><strong>3-5 seconds:</strong> Standard notifications with text</li>
          <li><strong>7+ seconds:</strong> Messages with actions or longer text</li>
          <li><strong>Persistent:</strong> Only for toasts requiring user action</li>
        </ul>

        <Callout type="info" title="Mobile Considerations">
          On mobile devices, position toasts at the bottom for better thumb reachability.
          Increase touch target size for dismiss and action buttons (44x44px minimum).
        </Callout>
      </section>

      <section className="docs-section">
        <h2>TypeScript</h2>
        <p>
          The Toast system is fully typed with TypeScript:
        </p>
        <pre><code>{`type ToastVariant = 'info' | 'success' | 'warning' | 'error';
type ToastPosition = 
  | 'top-left' | 'top-center' | 'top-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';

interface ToastOptions {
  // Content
  message: string | ReactNode;
  title?: string;
  
  // Appearance
  variant?: ToastVariant;
  icon?: ReactNode | false;
  
  // Behavior
  duration?: number; // 0 for persistent
  position?: ToastPosition;
  dismissible?: boolean;
  
  // Action
  action?: {
    label: string;
    onClick: () => void;
  };
  
  // Callbacks
  onDismiss?: () => void;
}

interface UseToastReturn {
  showToast: (options: ToastOptions | string) => string; // Returns toast ID
  dismissToast: (id: string) => void;
  dismissAll: () => void;
  showPromiseToast: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => Promise<T>;
}

export function useToast(): UseToastReturn;

// Provider component
interface ToastProviderProps {
  children: ReactNode;
  maxToasts?: number;
  defaultPosition?: ToastPosition;
  defaultDuration?: number;
}

export function ToastProvider(props: ToastProviderProps): JSX.Element;`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Related Components</h2>
        <ul>
          <li><a href="/reference/components/alert">Alert</a> - Persistent notifications</li>
          <li><a href="/reference/components/snackbar">Snackbar</a> - Mobile-style notifications</li>
          <li><a href="/reference/hooks/use-notification">useNotification</a> - Notification system hook</li>
        </ul>
      </section>
    </div>
  );
}
