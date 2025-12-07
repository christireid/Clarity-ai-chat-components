import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ApiTable } from '@/components/Demo/ApiTable';
import { Callout } from '@/components/MDX/Callout';
import { CodePlayground } from '@/components/Playground/CodePlayground';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Toast Component - Clarity Chat Components',
    description: 'A temporary notification component that displays brief messages about app processes without interrupting the user experience.',
};
export default function ToastPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsx("header", { className: "docs-header", children: _jsxs("div", { children: [_jsxs("div", { className: "flex gap-2 mb-3", children: [_jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800", children: "Component" }), _jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800", children: "Stable" }), _jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800", children: "In Use" })] }), _jsx("h1", { children: "Toast" }), _jsx("p", { className: "text-xl text-neutral-700 dark:text-neutral-300 mt-2", children: "A temporary notification component that displays brief messages about app processes without interrupting the user experience." })] }) }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Overview" }), _jsx("p", { children: "Toast notifications provide lightweight feedback about operations. They appear temporarily at the edge of the screen, auto-dismiss after a few seconds, and don't block interaction with the rest of the app. Perfect for success messages, quick updates, and non-critical information." }), _jsx(Callout, { type: "info", title: "Toast vs Alert", children: "Use Toast for temporary, auto-dismissing notifications. Use Alert for persistent messages that require user attention." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Basic Usage" }), _jsx(CodePlayground, { initialCode: `import { useState } from 'react';
import { Button, useToast } from '@clarity/chat-components';

export default function BasicToast() {
  const { showToast } = useToast();

  return (
    <Button onClick={() => showToast('This is a basic toast message')}>
      Show Toast
    </Button>
  );
}

render(<BasicToast />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Toast Options" }), _jsx(ApiTable, { title: "Toast Configuration", data: [
                            {
                                name: 'message',
                                type: 'string | ReactNode',
                                default: 'undefined',
                                description: 'Toast content message'
                            },
                            {
                                name: 'variant',
                                type: "'info' | 'success' | 'warning' | 'error'",
                                default: "'info'",
                                description: 'Visual style and semantic meaning'
                            },
                            {
                                name: 'title',
                                type: 'string',
                                default: 'undefined',
                                description: 'Optional toast title'
                            },
                            {
                                name: 'duration',
                                type: 'number',
                                default: '3000',
                                description: 'Auto-dismiss duration in milliseconds (0 for persistent)'
                            },
                            {
                                name: 'position',
                                type: "'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'",
                                default: "'top-right'",
                                description: 'Toast position on screen'
                            },
                            {
                                name: 'dismissible',
                                type: 'boolean',
                                default: 'true',
                                description: 'Whether toast can be manually dismissed'
                            },
                            {
                                name: 'action',
                                type: '{ label: string; onClick: () => void }',
                                default: 'undefined',
                                description: 'Action button configuration'
                            },
                            {
                                name: 'icon',
                                type: 'ReactNode | false',
                                default: 'undefined',
                                description: 'Custom icon or false to hide default icon'
                            },
                            {
                                name: 'onDismiss',
                                type: '() => void',
                                default: 'undefined',
                                description: 'Callback fired when toast is dismissed'
                            }
                        ] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Variants" }), _jsx("p", { children: "Use semantic variants to communicate different types of notifications." }), _jsx(CodePlayground, { initialCode: `import { Button, useToast } from '@clarity/chat-components';

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
}

render(<ToastVariants />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "With Title" }), _jsx("p", { children: "Add a title for more structured notifications." }), _jsx(CodePlayground, { initialCode: `import { Button, useToast } from '@clarity/chat-components';

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
}

render(<ToastWithTitle />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Positions" }), _jsx("p", { children: "Display toasts at different screen positions." }), _jsx(CodePlayground, { initialCode: `import { Button, useToast } from '@clarity/chat-components';

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
}

render(<ToastPositions />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Custom Duration" }), _jsx("p", { children: "Control how long toasts remain visible before auto-dismissing." }), _jsx(CodePlayground, { initialCode: `import { Button, useToast } from '@clarity/chat-components';

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
}

render(<ToastDuration />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "With Actions" }), _jsx("p", { children: "Include action buttons for users to respond to toasts." }), _jsx(CodePlayground, { initialCode: `import { Button, useToast } from '@clarity/chat-components';

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
}

render(<ToastWithActions />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Toast Queue" }), _jsx("p", { children: "Multiple toasts are automatically queued and displayed sequentially." }), _jsx(CodePlayground, { initialCode: `import { Button, useToast } from '@clarity/chat-components';

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
}

render(<ToastQueue />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Custom Icons" }), _jsx("p", { children: "Customize or remove icons to match your needs." }), _jsx(CodePlayground, { initialCode: `import { Button, useToast } from '@clarity/chat-components';

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
}

render(<CustomIconToast />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Advanced Patterns" }), _jsx("h3", { children: "Progress Toast" }), _jsx("p", { children: "Show progress within a toast notification." }), _jsx(CodePlayground, { initialCode: `import { useState, useEffect } from 'react';
import { Button, useToast, Progress } from '@clarity/chat-components';
import { CodePlayground } from '@/components/Playground/CodePlayground'

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
}

render(<ProgressToast />)` }), _jsx("h3", { children: "Rich Content Toast" }), _jsx("p", { children: "Display complex content in toast notifications." }), _jsx(CodePlayground, { initialCode: `import { Button, useToast } from '@clarity/chat-components';

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
}

render(<RichContentToast />)` }), _jsx("h3", { children: "Promise Toast" }), _jsx("p", { children: "Automatically show success/error toasts based on promise resolution." }), _jsx(CodePlayground, { initialCode: `import { Button, useToast } from '@clarity/chat-components';

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
}

render(<PromiseToast />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Accessibility" }), _jsx("p", { children: "The Toast component includes comprehensive accessibility features:" }), _jsx("h3", { children: "ARIA Attributes" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("code", { children: "role=\"status\"" }), " - For non-urgent notifications"] }), _jsxs("li", { children: [_jsx("code", { children: "role=\"alert\"" }), " - For urgent, important messages"] }), _jsxs("li", { children: [_jsx("code", { children: "aria-live=\"polite\"" }), " - Announces changes without interrupting"] }), _jsxs("li", { children: [_jsx("code", { children: "aria-atomic=\"true\"" }), " - Announces entire content"] })] }), _jsx("h3", { children: "Keyboard Navigation" }), _jsxs("ul", { children: [_jsx("li", { children: "Action buttons are keyboard focusable" }), _jsxs("li", { children: [_jsx("kbd", { children: "Enter" }), " / ", _jsx("kbd", { children: "Space" }), " - Activate action or dismiss"] }), _jsxs("li", { children: [_jsx("kbd", { children: "Esc" }), " - Dismiss toast"] }), _jsx("li", { children: "Focus management when toasts appear/disappear" })] }), _jsx("h3", { children: "Screen Reader Support" }), _jsxs("ul", { children: [_jsx("li", { children: "Toast content is announced to screen readers" }), _jsx("li", { children: "Variant type is communicated (success, error, etc.)" }), _jsx("li", { children: "Action buttons are clearly labeled" }), _jsx("li", { children: "Multiple toasts are announced individually" })] }), _jsx(Callout, { type: "warning", title: "Don't Overuse Toasts", children: "Too many toasts can be disruptive, especially for screen reader users. Use them sparingly and only for important notifications." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Best Practices" }), _jsx("h3", { children: "When to Use" }), _jsxs("ul", { children: [_jsx("li", { children: "\u2705 Success confirmations for user actions" }), _jsx("li", { children: "\u2705 Quick status updates that don't require action" }), _jsx("li", { children: "\u2705 Background process notifications" }), _jsx("li", { children: "\u2705 Non-critical errors that don't block workflow" }), _jsx("li", { children: "\u2705 Undo actions with time limit" })] }), _jsx("h3", { children: "When Not to Use" }), _jsxs("ul", { children: [_jsx("li", { children: "\u274C Critical errors requiring immediate attention - use Modal" }), _jsx("li", { children: "\u274C Form validation errors - use inline field errors" }), _jsx("li", { children: "\u274C Important information users need to reference - use Alert" }), _jsx("li", { children: "\u274C Actions requiring decision - use Confirmation dialog" })] }), _jsx("h3", { children: "Design Guidelines" }), _jsxs("ul", { children: [_jsx("li", { children: "Keep messages short and scannable (1-2 lines)" }), _jsx("li", { children: "Use clear, action-oriented language" }), _jsx("li", { children: "Position consistently (usually top-right or bottom-center)" }), _jsx("li", { children: "Limit to 3-4 visible toasts at a time" }), _jsx("li", { children: "Use appropriate duration (3-5 seconds for most messages)" }), _jsx("li", { children: "Make toasts dismissible for user control" }), _jsx("li", { children: "Don't use toasts for critical information" })] }), _jsx("h3", { children: "Content Guidelines" }), _jsxs("ul", { children: [_jsx("li", { children: "Start with the outcome (success, failure)" }), _jsx("li", { children: "Be specific about what happened" }), _jsx("li", { children: "Use consistent terminology" }), _jsx("li", { children: "Avoid technical jargon" }), _jsx("li", { children: "Provide context when needed" })] }), _jsx("h3", { children: "Duration Guidelines" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("strong", { children: "1-2 seconds:" }), " Simple confirmations (\"Saved\")"] }), _jsxs("li", { children: [_jsx("strong", { children: "3-5 seconds:" }), " Standard notifications with text"] }), _jsxs("li", { children: [_jsx("strong", { children: "7+ seconds:" }), " Messages with actions or longer text"] }), _jsxs("li", { children: [_jsx("strong", { children: "Persistent:" }), " Only for toasts requiring user action"] })] }), _jsx(Callout, { type: "info", title: "Mobile Considerations", children: "On mobile devices, position toasts at the bottom for better thumb reachability. Increase touch target size for dismiss and action buttons (44x44px minimum)." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "TypeScript" }), _jsx("p", { children: "The Toast system is fully typed with TypeScript:" }), _jsx("pre", { children: _jsx("code", { children: `type ToastVariant = 'info' | 'success' | 'warning' | 'error';
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

export function ToastProvider(props: ToastProviderProps): JSX.Element;` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related Components" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("a", { href: "/reference/components/alert", children: "Alert" }), " - Persistent notifications"] }), _jsxs("li", { children: [_jsx("a", { href: "/reference/components/snackbar", children: "Snackbar" }), " - Mobile-style notifications"] }), _jsxs("li", { children: [_jsx("a", { href: "/reference/hooks/use-notification", children: "useNotification" }), " - Notification system hook"] })] })] })] }));
}
//# sourceMappingURL=page.js.map