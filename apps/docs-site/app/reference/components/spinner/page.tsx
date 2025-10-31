import React from 'react';
import { Metadata } from 'next';
import LiveDemo from '@/components/LiveDemo';
import ApiTable from '@/components/ApiTable';
import Callout from '@/components/Callout';

export const metadata: Metadata = {
  title: 'Spinner Component - Clarity Chat Components',
  description: 'A loading indicator component that provides visual feedback during asynchronous operations.',
};

export default function SpinnerPage() {
  return (
    <div className="docs-content">
      <header className="docs-header">
        <div>
          <h1>Spinner</h1>
          <p className="text-xl text-neutral-700 dark:text-neutral-300 mt-2">
            A loading indicator component that provides visual feedback during asynchronous operations.
          </p>
        </div>
      </header>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          The Spinner component displays an animated loading indicator to show users that a process is ongoing.
          It's essential for providing feedback during data fetching, form submissions, and other
          asynchronous operations.
        </p>

        <Callout type="info" title="Accessibility First">
          Spinners include proper ARIA attributes and screen reader support to ensure
          loading states are communicated to all users.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <LiveDemo
          code={`import { Spinner } from '@clarity/chat-components';

export default function BasicSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <Spinner />
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <ApiTable
          title="Spinner Props"
          data={[
            {
              prop: 'size',
              type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'",
              default: "'md'",
              description: 'Size of the spinner (xs=16px, sm=20px, md=24px, lg=32px, xl=40px)'
            },
            {
              prop: 'color',
              type: "'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'white' | 'current'",
              default: "'primary'",
              description: "Spinner color variant ('current' uses text color)"
            },
            {
              prop: 'thickness',
              type: "'thin' | 'normal' | 'thick'",
              default: "'normal'",
              description: 'Border thickness of the spinner'
            },
            {
              prop: 'speed',
              type: "'slow' | 'normal' | 'fast'",
              default: "'normal'",
              description: 'Animation speed (slow=1.5s, normal=1s, fast=0.6s)'
            },
            {
              prop: 'label',
              type: 'string',
              default: "'Loading...'",
              description: 'Accessible label for screen readers'
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
        <h2>Sizes</h2>
        <p>
          Choose from 5 predefined sizes to match your UI needs.
        </p>
        <LiveDemo
          code={`import { Spinner } from '@clarity/chat-components';

export default function SpinnerSizes() {
  return (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <Spinner size="xs" />
        <span className="text-xs text-gray-600">XS</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="sm" />
        <span className="text-xs text-gray-600">SM</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="md" />
        <span className="text-xs text-gray-600">MD</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="lg" />
        <span className="text-xs text-gray-600">LG</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="xl" />
        <span className="text-xs text-gray-600">XL</span>
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Colors</h2>
        <p>
          Use semantic colors or match the current text color.
        </p>
        <LiveDemo
          code={`import { Spinner } from '@clarity/chat-components';

export default function SpinnerColors() {
  return (
    <div className="flex flex-wrap gap-6">
      <div className="flex flex-col items-center gap-2">
        <Spinner color="primary" />
        <span className="text-xs text-gray-600">Primary</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner color="secondary" />
        <span className="text-xs text-gray-600">Secondary</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner color="success" />
        <span className="text-xs text-gray-600">Success</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner color="warning" />
        <span className="text-xs text-gray-600">Warning</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner color="error" />
        <span className="text-xs text-gray-600">Error</span>
      </div>
      <div className="flex flex-col items-center gap-2 bg-gray-900 p-4 rounded">
        <Spinner color="white" />
        <span className="text-xs text-white">White</span>
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Thickness</h2>
        <p>
          Adjust the border thickness for different visual weights.
        </p>
        <LiveDemo
          code={`import { Spinner } from '@clarity/chat-components';

export default function SpinnerThickness() {
  return (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <Spinner thickness="thin" size="lg" />
        <span className="text-xs text-gray-600">Thin</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner thickness="normal" size="lg" />
        <span className="text-xs text-gray-600">Normal</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner thickness="thick" size="lg" />
        <span className="text-xs text-gray-600">Thick</span>
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Animation Speed</h2>
        <p>
          Control the rotation speed of the spinner animation.
        </p>
        <LiveDemo
          code={`import { Spinner } from '@clarity/chat-components';

export default function SpinnerSpeed() {
  return (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <Spinner speed="slow" size="lg" />
        <span className="text-xs text-gray-600">Slow (1.5s)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner speed="normal" size="lg" />
        <span className="text-xs text-gray-600">Normal (1s)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner speed="fast" size="lg" />
        <span className="text-xs text-gray-600">Fast (0.6s)</span>
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>In Buttons</h2>
        <p>
          Show loading state within buttons during async operations.
        </p>
        <LiveDemo
          code={`import { useState } from 'react';
import { Spinner, Button } from '@clarity/chat-components';

export default function SpinnerInButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="flex gap-3 flex-wrap">
      <Button
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Spinner size="sm" color="current" />
            Loading...
          </span>
        ) : (
          'Click Me'
        )}
      </Button>

      <Button
        variant="primary"
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Spinner size="sm" color="white" />
            Processing
          </span>
        ) : (
          'Submit Form'
        )}
      </Button>

      <Button
        variant="success"
        onClick={handleClick}
        disabled={loading}
      >
        {loading && <Spinner size="sm" color="white" className="mr-2" />}
        Save Changes
      </Button>
    </div>
  );
}`}
          scope={{ useState: React.useState }}
        />
      </section>

      <section className="docs-section">
        <h2>With Text</h2>
        <p>
          Combine spinners with descriptive text for better UX.
        </p>
        <LiveDemo
          code={`import { Spinner } from '@clarity/chat-components';

export default function SpinnerWithText() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Spinner />
        <span className="text-gray-700">Loading data...</span>
      </div>

      <div className="flex flex-col items-center gap-3 p-6 bg-gray-50 rounded-lg">
        <Spinner size="lg" />
        <div className="text-center">
          <div className="font-medium text-gray-900">Processing Payment</div>
          <div className="text-sm text-gray-600 mt-1">
            Please wait while we process your transaction
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 border border-blue-200 bg-blue-50 rounded-lg">
        <Spinner color="primary" size="sm" />
        <div className="flex-1">
          <div className="font-medium text-blue-900">Syncing...</div>
          <div className="text-sm text-blue-700 mt-1">
            Your files are being synchronized with the cloud
          </div>
        </div>
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Loading Overlay</h2>
        <p>
          Create full-page or component-level loading overlays.
        </p>
        <LiveDemo
          code={`import { useState } from 'react';
import { Spinner, Button } from '@clarity/chat-components';

export default function LoadingOverlay() {
  const [loading, setLoading] = useState(false);

  const handleLoad = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleLoad}>
        Show Loading Overlay
      </Button>

      <div className="relative h-64 border rounded-lg overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2">Content Area</h3>
          <p className="text-gray-600">
            This is some content that will be overlaid with a loading spinner.
          </p>
          <div className="mt-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>

        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Spinner size="lg" />
              <span className="text-gray-700 font-medium">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}`}
          scope={{ useState: React.useState }}
        />
      </section>

      <section className="docs-section">
        <h2>Skeleton Loading</h2>
        <p>
          Combine spinners with skeleton screens for better perceived performance.
        </p>
        <LiveDemo
          code={`import { useState } from 'react';
import { Spinner, Button } from '@clarity/chat-components';

export default function SkeletonLoading() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="space-y-4">
      <Button onClick={() => setLoading(!loading)}>
        Toggle Loading
      </Button>

      <div className="border rounded-lg p-4">
        {loading ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse"></div>
            </div>
            <div className="flex items-center justify-center py-2">
              <Spinner size="sm" />
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                JD
              </div>
              <div>
                <div className="font-medium">John Doe</div>
                <div className="text-sm text-gray-600">@johndoe</div>
              </div>
            </div>
            <p className="text-gray-700">
              This is the actual content that was being loaded.
              It replaced the skeleton screen seamlessly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}`}
          scope={{ useState: React.useState }}
        />
      </section>

      <section className="docs-section">
        <h2>Advanced Patterns</h2>

        <h3>Multi-Step Loading</h3>
        <p>
          Show different messages during long operations.
        </p>
        <LiveDemo
          code={`import { useState, useEffect } from 'react';
import { Spinner, Button } from '@clarity/chat-components';

export default function MultiStepLoading() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  const steps = [
    'Connecting to server...',
    'Authenticating...',
    'Loading your data...',
    'Finalizing...'
  ];

  useEffect(() => {
    if (loading && step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 1000);
      return () => clearTimeout(timer);
    } else if (loading && step === steps.length - 1) {
      setTimeout(() => {
        setLoading(false);
        setStep(0);
      }, 1000);
    }
  }, [loading, step]);

  return (
    <div className="space-y-4">
      <Button onClick={() => setLoading(true)} disabled={loading}>
        Start Process
      </Button>

      {loading && (
        <div className="flex flex-col items-center gap-4 p-6 border rounded-lg bg-gray-50">
          <Spinner size="lg" />
          <div className="text-center">
            <div className="font-medium text-gray-900">
              {steps[step]}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Step {step + 1} of {steps.length}
            </div>
          </div>
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <div
                key={i}
                className={\`h-1 w-8 rounded-full transition-colors \${
                  i <= step ? 'bg-blue-600' : 'bg-gray-300'
                }\`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}`}
          scope={{ useState: React.useState, useEffect: React.useEffect }}
        />

        <h3>Progress with Spinner</h3>
        <p>
          Combine spinners with progress indicators.
        </p>
        <LiveDemo
          code={`import { useState, useEffect } from 'react';
import { Spinner, Button } from '@clarity/chat-components';

export default function ProgressSpinner() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (loading && progress < 100) {
      const timer = setTimeout(() => setProgress(p => p + 10), 200);
      return () => clearTimeout(timer);
    } else if (progress >= 100) {
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 500);
    }
  }, [loading, progress]);

  return (
    <div className="space-y-4">
      <Button onClick={() => setLoading(true)} disabled={loading}>
        Upload File
      </Button>

      {loading && (
        <div className="flex flex-col items-center gap-4 p-6 border rounded-lg">
          <div className="relative">
            <Spinner size="xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-medium">{progress}%</span>
            </div>
          </div>
          <div className="w-full">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-200"
                style={{ width: \`\${progress}%\` }}
              />
            </div>
          </div>
          <span className="text-sm text-gray-600">Uploading file...</span>
        </div>
      )}
    </div>
  );
}`}
          scope={{ useState: React.useState, useEffect: React.useEffect }}
        />
      </section>

      <section className="docs-section">
        <h2>Accessibility</h2>
        <p>
          The Spinner component includes comprehensive accessibility features:
        </p>

        <h3>ARIA Attributes</h3>
        <ul>
          <li><code>role="status"</code> - Announces loading state to screen readers</li>
          <li><code>aria-label</code> - Provides descriptive text for screen readers</li>
          <li><code>aria-live="polite"</code> - Announces changes without interrupting</li>
        </ul>

        <h3>Screen Reader Support</h3>
        <ul>
          <li>Spinner announces "Loading" or custom label to screen readers</li>
          <li>Loading state changes are communicated automatically</li>
          <li>Spinner is focusable and keyboard accessible when appropriate</li>
        </ul>

        <Callout type="warning" title="Custom Labels">
          Always provide descriptive <code>label</code> props for better screen reader experience.
          Example: "Loading user profile" instead of just "Loading".
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>

        <h3>When to Use</h3>
        <ul>
          <li>✅ During data fetching operations</li>
          <li>✅ While processing form submissions</li>
          <li>✅ During file uploads or downloads</li>
          <li>✅ While waiting for async operations to complete</li>
          <li>✅ In buttons to indicate processing state</li>
        </ul>

        <h3>When Not to Use</h3>
        <ul>
          <li>❌ For very fast operations (under 300ms) - it may flash</li>
          <li>❌ When you can show actual progress percentage - use ProgressBar instead</li>
          <li>❌ For initial page load - use skeleton screens</li>
        </ul>

        <h3>Design Guidelines</h3>
        <ul>
          <li>Always accompany spinners with descriptive text when possible</li>
          <li>Use appropriate size - small for inline, large for full-page loading</li>
          <li>Match spinner color to context (white on dark backgrounds)</li>
          <li>Center spinners in their container for better visual balance</li>
          <li>Don't use multiple spinners for the same operation</li>
          <li>Consider skeleton screens for better perceived performance</li>
        </ul>

        <h3>Performance Guidelines</h3>
        <ul>
          <li>Delay showing spinner for 300-500ms to avoid flashing on fast loads</li>
          <li>Keep minimum display time of 300ms once shown to avoid jarring</li>
          <li>Use skeleton screens for predictable content loading</li>
          <li>Provide progress feedback for operations longer than 5 seconds</li>
        </ul>

        <Callout type="info" title="Perceived Performance">
          Skeleton screens with spinners provide better perceived performance than
          spinners alone. Users see structure loading instead of a blank state.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>TypeScript</h2>
        <p>
          The Spinner component is fully typed with TypeScript:
        </p>
        <pre><code>{`type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SpinnerColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'white' | 'current';
type SpinnerThickness = 'thin' | 'normal' | 'thick';
type SpinnerSpeed = 'slow' | 'normal' | 'fast';

interface SpinnerProps {
  // Appearance
  size?: SpinnerSize;
  color?: SpinnerColor;
  thickness?: SpinnerThickness;
  speed?: SpinnerSpeed;
  
  // Accessibility
  label?: string;
  
  // Styling
  className?: string;
}

export default function Spinner(props: SpinnerProps): JSX.Element;`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Related Components</h2>
        <ul>
          <li><a href="/reference/components/progress">Progress</a> - Determinate progress indicator</li>
          <li><a href="/reference/components/skeleton">Skeleton</a> - Placeholder loading screens</li>
          <li><a href="/reference/components/button">Button</a> - Buttons with loading states</li>
        </ul>
      </section>
    </div>
  );
}
