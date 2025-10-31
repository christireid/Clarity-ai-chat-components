import React from 'react';
import { Metadata } from 'next';
import LiveDemo from '@/components/LiveDemo';
import ApiTable from '@/components/ApiTable';
import Callout from '@/components/Callout';

export const metadata: Metadata = {
  title: 'Progress Component - Clarity Chat Components',
  description: 'A visual indicator component that shows the completion progress of a task or operation.',
};

export default function ProgressPage() {
  return (
    <div className="docs-content">
      <header className="docs-header">
        <div>
          <h1>Progress</h1>
          <p className="text-xl text-neutral-700 dark:text-neutral-300 mt-2">
            A visual indicator component that shows the completion progress of a task or operation.
          </p>
        </div>
      </header>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          The Progress component displays a horizontal or circular progress bar to indicate the completion
          status of tasks, file uploads, downloads, or multi-step processes. It provides clear visual
          feedback about ongoing operations.
        </p>

        <Callout type="info" title="Determinate vs Indeterminate">
          Use determinate progress (with value) when you know the completion percentage.
          Use indeterminate progress when the duration is unknown.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <LiveDemo
          code={`import { Progress } from '@clarity/chat-components';

export default function BasicProgress() {
  return (
    <div className="space-y-4">
      <Progress value={30} />
      <Progress value={60} />
      <Progress value={90} />
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <ApiTable
          title="Progress Props"
          data={[
            {
              prop: 'value',
              type: 'number',
              default: '0',
              description: 'Current progress value (0-100)'
            },
            {
              prop: 'max',
              type: 'number',
              default: '100',
              description: 'Maximum value for progress calculation'
            },
            {
              prop: 'size',
              type: "'sm' | 'md' | 'lg'",
              default: "'md'",
              description: 'Height of the progress bar (sm=4px, md=8px, lg=12px)'
            },
            {
              prop: 'color',
              type: "'primary' | 'secondary' | 'success' | 'warning' | 'error'",
              default: "'primary'",
              description: 'Progress bar color variant'
            },
            {
              prop: 'variant',
              type: "'linear' | 'circular'",
              default: "'linear'",
              description: 'Progress bar style'
            },
            {
              prop: 'showLabel',
              type: 'boolean',
              default: 'false',
              description: 'Whether to show percentage label'
            },
            {
              prop: 'isIndeterminate',
              type: 'boolean',
              default: 'false',
              description: 'Whether progress is indeterminate (animated without value)'
            },
            {
              prop: 'striped',
              type: 'boolean',
              default: 'false',
              description: 'Whether to show striped pattern'
            },
            {
              prop: 'animated',
              type: 'boolean',
              default: 'false',
              description: 'Whether to animate the stripes'
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
          Choose from 3 sizes to match your UI needs.
        </p>
        <LiveDemo
          code={`import { Progress } from '@clarity/chat-components';

export default function ProgressSizes() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm text-gray-600 mb-2">Small (4px)</div>
        <Progress value={50} size="sm" />
      </div>
      <div>
        <div className="text-sm text-gray-600 mb-2">Medium (8px)</div>
        <Progress value={50} size="md" />
      </div>
      <div>
        <div className="text-sm text-gray-600 mb-2">Large (12px)</div>
        <Progress value={50} size="lg" />
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Colors</h2>
        <p>
          Use semantic colors to indicate different types of progress.
        </p>
        <LiveDemo
          code={`import { Progress } from '@clarity/chat-components';

export default function ProgressColors() {
  return (
    <div className="space-y-4">
      <div>
        <div className="text-sm text-gray-600 mb-2">Primary</div>
        <Progress value={60} color="primary" />
      </div>
      <div>
        <div className="text-sm text-gray-600 mb-2">Secondary</div>
        <Progress value={60} color="secondary" />
      </div>
      <div>
        <div className="text-sm text-gray-600 mb-2">Success</div>
        <Progress value={60} color="success" />
      </div>
      <div>
        <div className="text-sm text-gray-600 mb-2">Warning</div>
        <Progress value={60} color="warning" />
      </div>
      <div>
        <div className="text-sm text-gray-600 mb-2">Error</div>
        <Progress value={60} color="error" />
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>With Label</h2>
        <p>
          Display the progress percentage as a label.
        </p>
        <LiveDemo
          code={`import { Progress } from '@clarity/chat-components';

export default function ProgressWithLabel() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Downloading...</span>
          <span className="text-sm text-gray-600">45%</span>
        </div>
        <Progress value={45} showLabel />
      </div>

      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Processing</span>
          <span className="text-sm text-gray-600">78%</span>
        </div>
        <Progress value={78} color="success" showLabel />
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Striped Progress</h2>
        <p>
          Add a striped pattern for more visual interest.
        </p>
        <LiveDemo
          code={`import { Progress } from '@clarity/chat-components';

export default function StripedProgress() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm text-gray-600 mb-2">Striped (static)</div>
        <Progress value={60} striped size="lg" />
      </div>
      <div>
        <div className="text-sm text-gray-600 mb-2">Striped + Animated</div>
        <Progress value={60} striped animated size="lg" />
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Indeterminate Progress</h2>
        <p>
          Use indeterminate progress when the duration is unknown.
        </p>
        <LiveDemo
          code={`import { Progress } from '@clarity/chat-components';

export default function IndeterminateProgress() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm text-gray-600 mb-2">Loading...</div>
        <Progress isIndeterminate />
      </div>
      <div>
        <div className="text-sm text-gray-600 mb-2">Processing...</div>
        <Progress isIndeterminate color="success" size="lg" />
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Circular Progress</h2>
        <p>
          Display progress as a circular indicator.
        </p>
        <LiveDemo
          code={`import { Progress } from '@clarity/chat-components';

export default function CircularProgress() {
  return (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <Progress variant="circular" value={25} />
        <span className="text-sm text-gray-600">25%</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Progress variant="circular" value={50} color="warning" />
        <span className="text-sm text-gray-600">50%</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Progress variant="circular" value={75} color="success" />
        <span className="text-sm text-gray-600">75%</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Progress variant="circular" value={100} color="success" />
        <span className="text-sm text-gray-600">Complete</span>
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Animated Progress</h2>
        <p>
          Simulate progress animation over time.
        </p>
        <LiveDemo
          code={`import { useState, useEffect } from 'react';
import { Progress, Button } from '@clarity/chat-components';

export default function AnimatedProgress() {
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setIsRunning(false);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = () => {
    setProgress(0);
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setProgress(0);
    setIsRunning(false);
  };

  return (
    <div className="space-y-4">
      <Progress value={progress} size="lg" color="primary" />
      
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          Progress: {progress}%
        </span>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleStart} disabled={isRunning}>
            Start
          </Button>
          <Button size="sm" variant="secondary" onClick={handleStop} disabled={!isRunning}>
            Stop
          </Button>
          <Button size="sm" variant="ghost" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}`}
          scope={{ useState: React.useState, useEffect: React.useEffect }}
        />
      </section>

      <section className="docs-section">
        <h2>File Upload Progress</h2>
        <p>
          A practical example of file upload with progress tracking.
        </p>
        <LiveDemo
          code={`import { useState } from 'react';
import { Progress, Button } from '@clarity/chat-components';

export default function FileUploadProgress() {
  const [uploads, setUploads] = useState([
    { id: 1, name: 'document.pdf', size: '2.5 MB', progress: 100, status: 'complete' },
    { id: 2, name: 'image.jpg', size: '1.2 MB', progress: 65, status: 'uploading' },
    { id: 3, name: 'video.mp4', size: '45 MB', progress: 23, status: 'uploading' }
  ]);

  return (
    <div className="space-y-4">
      {uploads.map(file => (
        <div key={file.id} className="p-4 border rounded-lg">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="font-medium">{file.name}</div>
              <div className="text-sm text-gray-600">{file.size}</div>
            </div>
            <div className="text-sm text-gray-600">
              {file.status === 'complete' ? '✓ Complete' : \`\${file.progress}%\`}
            </div>
          </div>
          <Progress
            value={file.progress}
            color={file.status === 'complete' ? 'success' : 'primary'}
            size="sm"
          />
        </div>
      ))}
    </div>
  );
}`}
          scope={{ useState: React.useState }}
        />
      </section>

      <section className="docs-section">
        <h2>Multi-Step Progress</h2>
        <p>
          Track progress through multi-step processes.
        </p>
        <LiveDemo
          code={`import { useState } from 'react';
import { Progress, Button } from '@clarity/chat-components';

export default function MultiStepProgress() {
  const [currentStep, setCurrentStep] = useState(1);
  
  const steps = [
    'Personal Info',
    'Address',
    'Payment',
    'Review',
    'Complete'
  ];

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">
            Step {currentStep} of {steps.length}: {steps[currentStep - 1]}
          </span>
          <span className="text-sm text-gray-600">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} color="primary" size="lg" />
      </div>

      <div className="flex gap-2">
        {steps.map((step, index) => (
          <div
            key={index}
            className={\`flex-1 h-16 rounded-lg border flex items-center justify-center text-sm transition-colors \${
              index + 1 === currentStep
                ? 'border-blue-500 bg-blue-50 font-medium'
                : index + 1 < currentStep
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 bg-gray-50 text-gray-500'
            }\`}
          >
            {index + 1 < currentStep ? '✓' : index + 1}
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Button
          variant="ghost"
          onClick={() => setCurrentStep(s => Math.max(1, s - 1))}
          disabled={currentStep === 1}
          fullWidth
        >
          Previous
        </Button>
        <Button
          variant="primary"
          onClick={() => setCurrentStep(s => Math.min(steps.length, s + 1))}
          disabled={currentStep === steps.length}
          fullWidth
        >
          {currentStep === steps.length ? 'Complete' : 'Next'}
        </Button>
      </div>
    </div>
  );
}`}
          scope={{ useState: React.useState }}
        />
      </section>

      <section className="docs-section">
        <h2>Advanced Patterns</h2>

        <h3>Progress with Segments</h3>
        <p>
          Show progress divided into segments for multi-part tasks.
        </p>
        <LiveDemo
          code={`import { Progress } from '@clarity/chat-components';

export default function SegmentedProgress() {
  const segments = [
    { label: 'Upload', progress: 100, color: 'success' },
    { label: 'Process', progress: 60, color: 'primary' },
    { label: 'Complete', progress: 0, color: 'secondary' }
  ];

  return (
    <div className="space-y-4">
      {segments.map((segment, i) => (
        <div key={i}>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">{segment.label}</span>
            <span className="text-sm text-gray-600">{segment.progress}%</span>
          </div>
          <Progress
            value={segment.progress}
            color={segment.color}
          />
        </div>
      ))}
    </div>
  );
}`}
        />

        <h3>Progress with Custom Label</h3>
        <p>
          Add custom labels and status information.
        </p>
        <LiveDemo
          code={`import { Progress } from '@clarity/chat-components';

export default function CustomLabelProgress() {
  return (
    <div className="space-y-6">
      <div className="p-4 border rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="font-medium">Training AI Model</div>
            <div className="text-sm text-gray-600">Epoch 45 / 100</div>
          </div>
          <div className="text-right">
            <div className="font-medium text-blue-600">45%</div>
            <div className="text-xs text-gray-600">~12 min left</div>
          </div>
        </div>
        <Progress value={45} color="primary" size="lg" />
      </div>

      <div className="p-4 border rounded-lg bg-green-50 border-green-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="font-medium text-green-900">Backup Complete</div>
            <div className="text-sm text-green-700">1,234 files backed up</div>
          </div>
          <div className="text-2xl">✓</div>
        </div>
        <Progress value={100} color="success" size="lg" />
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Accessibility</h2>
        <p>
          The Progress component includes comprehensive accessibility features:
        </p>

        <h3>ARIA Attributes</h3>
        <ul>
          <li><code>role="progressbar"</code> - Identifies the element as a progress bar</li>
          <li><code>aria-valuenow</code> - Current progress value</li>
          <li><code>aria-valuemin</code> - Minimum value (0)</li>
          <li><code>aria-valuemax</code> - Maximum value (100)</li>
          <li><code>aria-label</code> - Descriptive label for screen readers</li>
        </ul>

        <h3>Screen Reader Support</h3>
        <ul>
          <li>Progress changes are announced to screen readers</li>
          <li>Percentage is communicated automatically</li>
          <li>Indeterminate state is properly announced</li>
        </ul>

        <Callout type="warning" title="Custom Labels">
          Always provide descriptive <code>aria-label</code> for better context.
          Example: "File upload progress: 45%" instead of just "45%".
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>

        <h3>When to Use</h3>
        <ul>
          <li>✅ File uploads and downloads</li>
          <li>✅ Multi-step forms and wizards</li>
          <li>✅ Data processing operations</li>
          <li>✅ Installation or setup processes</li>
          <li>✅ Long-running tasks with known duration</li>
        </ul>

        <h3>When Not to Use</h3>
        <ul>
          <li>❌ Very fast operations (under 1 second) - may flash</li>
          <li>❌ When duration is completely unknown - use Spinner instead</li>
          <li>❌ For navigation steps - use Stepper component</li>
        </ul>

        <h3>Design Guidelines</h3>
        <ul>
          <li>Always show progress from 0% to 100%, never backwards</li>
          <li>Update progress frequently enough (every 100-200ms) for smooth animation</li>
          <li>Include descriptive text above or below the progress bar</li>
          <li>Use colors semantically (green for success, red for errors)</li>
          <li>Show estimated time remaining for long operations</li>
          <li>Consider circular progress for space-constrained UIs</li>
          <li>Use indeterminate progress only when truly necessary</li>
        </ul>

        <h3>Performance Guidelines</h3>
        <ul>
          <li>Throttle progress updates to avoid excessive re-renders</li>
          <li>Use CSS transitions for smooth visual updates</li>
          <li>Avoid updating progress more than 20 times per second</li>
          <li>Consider debouncing rapid progress updates</li>
        </ul>

        <Callout type="info" title="User Experience Tip">
          Users perceive progress bars that start fast and slow down near completion
          as faster than linear progress. Consider easing functions for better UX.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>TypeScript</h2>
        <p>
          The Progress component is fully typed with TypeScript:
        </p>
        <pre><code>{`type ProgressSize = 'sm' | 'md' | 'lg';
type ProgressColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error';
type ProgressVariant = 'linear' | 'circular';

interface ProgressProps {
  // Value
  value?: number;
  max?: number;
  
  // Appearance
  size?: ProgressSize;
  color?: ProgressColor;
  variant?: ProgressVariant;
  
  // Options
  showLabel?: boolean;
  isIndeterminate?: boolean;
  striped?: boolean;
  animated?: boolean;
  
  // Styling
  className?: string;
}

export default function Progress(props: ProgressProps): JSX.Element;`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Related Components</h2>
        <ul>
          <li><a href="/reference/components/spinner">Spinner</a> - Indeterminate loading indicator</li>
          <li><a href="/reference/components/skeleton">Skeleton</a> - Placeholder loading screens</li>
          <li><a href="/reference/components/stepper">Stepper</a> - Multi-step navigation indicator</li>
        </ul>
      </section>
    </div>
  );
}
