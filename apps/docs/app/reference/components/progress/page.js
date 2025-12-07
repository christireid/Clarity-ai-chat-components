import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodePlayground } from '@/components/Playground/CodePlayground';
import { ApiTable } from '@/components/Demo/ApiTable';
import { Callout } from '@/components/MDX/Callout';
import { ViewInStorybook } from '@/components/Links/StorybookLink';
export const metadata = {
    title: 'Progress Component - Clarity Chat Components',
    description: 'A visual indicator component that shows the completion progress of a task or operation.',
};
export default function ProgressPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsx("header", { className: "docs-header", children: _jsxs("div", { children: [_jsx("h1", { children: "Progress" }), _jsx("p", { className: "text-xl text-neutral-700 dark:text-neutral-300 mt-2", children: "A visual indicator component that shows the completion progress of a task or operation." })] }) }), _jsx(ViewInStorybook, { component: "Progress" }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Overview" }), _jsx("p", { children: "The Progress component displays a horizontal or circular progress bar to indicate the completion status of tasks, file uploads, downloads, or multi-step processes. It provides clear visual feedback about ongoing operations." }), _jsx(Callout, { type: "info", title: "Determinate vs Indeterminate", children: "Use determinate progress (with value) when you know the completion percentage. Use indeterminate progress when the duration is unknown." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Basic Usage" }), _jsx(CodePlayground, { initialCode: `import { Progress } from '@clarity/chat-components';

export default function BasicProgress() {
  return (
    <div className="space-y-4">
      <Progress value={30} />
      <Progress value={60} />
      <Progress value={90} />
    </div>
  );
}

render(<BasicProgress />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Props" }), _jsx(ApiTable, { title: "Progress Props", data: [
                            {
                                name: 'value',
                                type: 'number',
                                default: '0',
                                description: 'Current progress value (0-100)'
                            },
                            {
                                name: 'max',
                                type: 'number',
                                default: '100',
                                description: 'Maximum value for progress calculation'
                            },
                            {
                                name: 'size',
                                type: "'sm' | 'md' | 'lg'",
                                default: "'md'",
                                description: 'Height of the progress bar (sm=4px, md=8px, lg=12px)'
                            },
                            {
                                name: 'color',
                                type: "'primary' | 'secondary' | 'success' | 'warning' | 'error'",
                                default: "'primary'",
                                description: 'Progress bar color variant'
                            },
                            {
                                name: 'variant',
                                type: "'linear' | 'circular'",
                                default: "'linear'",
                                description: 'Progress bar style'
                            },
                            {
                                name: 'showLabel',
                                type: 'boolean',
                                default: 'false',
                                description: 'Whether to show percentage label'
                            },
                            {
                                name: 'isIndeterminate',
                                type: 'boolean',
                                default: 'false',
                                description: 'Whether progress is indeterminate (animated without value)'
                            },
                            {
                                name: 'striped',
                                type: 'boolean',
                                default: 'false',
                                description: 'Whether to show striped pattern'
                            },
                            {
                                name: 'animated',
                                type: 'boolean',
                                default: 'false',
                                description: 'Whether to animate the stripes'
                            },
                            {
                                name: 'className',
                                type: 'string',
                                default: 'undefined',
                                description: 'Additional CSS classes'
                            }
                        ] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Sizes" }), _jsx("p", { children: "Choose from 3 sizes to match your UI needs." }), _jsx(CodePlayground, { initialCode: `import { Progress } from '@clarity/chat-components';

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
}

render(<ProgressSizes />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Colors" }), _jsx("p", { children: "Use semantic colors to indicate different types of progress." }), _jsx(CodePlayground, { initialCode: `import { Progress } from '@clarity/chat-components';

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
}

render(<ProgressColors />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "With Label" }), _jsx("p", { children: "Display the progress percentage as a label." }), _jsx(CodePlayground, { initialCode: `import { Progress } from '@clarity/chat-components';

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
}

render(<ProgressWithLabel />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Striped Progress" }), _jsx("p", { children: "Add a striped pattern for more visual interest." }), _jsx(CodePlayground, { initialCode: `import { Progress } from '@clarity/chat-components';

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
}

render(<StripedProgress />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Indeterminate Progress" }), _jsx("p", { children: "Use indeterminate progress when the duration is unknown." }), _jsx(CodePlayground, { initialCode: `import { Progress } from '@clarity/chat-components';

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
}

render(<IndeterminateProgress />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Circular Progress" }), _jsx("p", { children: "Display progress as a circular indicator." }), _jsx(CodePlayground, { initialCode: `import { Progress } from '@clarity/chat-components';

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
}

render(<CircularProgress />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Animated Progress" }), _jsx("p", { children: "Simulate progress animation over time." }), _jsx(CodePlayground, { initialCode: `import { useState, useEffect } from 'react';
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
}

render(<AnimatedProgress />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "File Upload Progress" }), _jsx("p", { children: "A practical example of file upload with progress tracking." }), _jsx(CodePlayground, { initialCode: `import { useState } from 'react';
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
}

render(<FileUploadProgress />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Multi-Step Progress" }), _jsx("p", { children: "Track progress through multi-step processes." }), _jsx(CodePlayground, { initialCode: `import { useState } from 'react';
import { Progress, Button } from '@clarity/chat-components';
import { CodePlayground } from '@/components/Playground/CodePlayground'

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
}

render(<MultiStepProgress />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Advanced Patterns" }), _jsx("h3", { children: "Progress with Segments" }), _jsx("p", { children: "Show progress divided into segments for multi-part tasks." }), _jsx(CodePlayground, { initialCode: `import { Progress } from '@clarity/chat-components';

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
}

render(<SegmentedProgress />)` }), _jsx("h3", { children: "Progress with Custom Label" }), _jsx("p", { children: "Add custom labels and status information." }), _jsx(CodePlayground, { initialCode: `import { Progress } from '@clarity/chat-components';

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
}

render(<CustomLabelProgress />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Accessibility" }), _jsx("p", { children: "The Progress component includes comprehensive accessibility features:" }), _jsx("h3", { children: "ARIA Attributes" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("code", { children: "role=\"progressbar\"" }), " - Identifies the element as a progress bar"] }), _jsxs("li", { children: [_jsx("code", { children: "aria-valuenow" }), " - Current progress value"] }), _jsxs("li", { children: [_jsx("code", { children: "aria-valuemin" }), " - Minimum value (0)"] }), _jsxs("li", { children: [_jsx("code", { children: "aria-valuemax" }), " - Maximum value (100)"] }), _jsxs("li", { children: [_jsx("code", { children: "aria-label" }), " - Descriptive label for screen readers"] })] }), _jsx("h3", { children: "Screen Reader Support" }), _jsxs("ul", { children: [_jsx("li", { children: "Progress changes are announced to screen readers" }), _jsx("li", { children: "Percentage is communicated automatically" }), _jsx("li", { children: "Indeterminate state is properly announced" })] }), _jsxs(Callout, { type: "warning", title: "Custom Labels", children: ["Always provide descriptive ", _jsx("code", { children: "aria-label" }), " for better context. Example: \"File upload progress: 45%\" instead of just \"45%\"."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Best Practices" }), _jsx("h3", { children: "When to Use" }), _jsxs("ul", { children: [_jsx("li", { children: "\u2705 File uploads and downloads" }), _jsx("li", { children: "\u2705 Multi-step forms and wizards" }), _jsx("li", { children: "\u2705 Data processing operations" }), _jsx("li", { children: "\u2705 Installation or setup processes" }), _jsx("li", { children: "\u2705 Long-running tasks with known duration" })] }), _jsx("h3", { children: "When Not to Use" }), _jsxs("ul", { children: [_jsx("li", { children: "\u274C Very fast operations (under 1 second) - may flash" }), _jsx("li", { children: "\u274C When duration is completely unknown - use Spinner instead" }), _jsx("li", { children: "\u274C For navigation steps - use Stepper component" })] }), _jsx("h3", { children: "Design Guidelines" }), _jsxs("ul", { children: [_jsx("li", { children: "Always show progress from 0% to 100%, never backwards" }), _jsx("li", { children: "Update progress frequently enough (every 100-200ms) for smooth animation" }), _jsx("li", { children: "Include descriptive text above or below the progress bar" }), _jsx("li", { children: "Use colors semantically (green for success, red for errors)" }), _jsx("li", { children: "Show estimated time remaining for long operations" }), _jsx("li", { children: "Consider circular progress for space-constrained UIs" }), _jsx("li", { children: "Use indeterminate progress only when truly necessary" })] }), _jsx("h3", { children: "Performance Guidelines" }), _jsxs("ul", { children: [_jsx("li", { children: "Throttle progress updates to avoid excessive re-renders" }), _jsx("li", { children: "Use CSS transitions for smooth visual updates" }), _jsx("li", { children: "Avoid updating progress more than 20 times per second" }), _jsx("li", { children: "Consider debouncing rapid progress updates" })] }), _jsx(Callout, { type: "info", title: "User Experience Tip", children: "Users perceive progress bars that start fast and slow down near completion as faster than linear progress. Consider easing functions for better UX." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "TypeScript" }), _jsx("p", { children: "The Progress component is fully typed with TypeScript:" }), _jsx("pre", { children: _jsx("code", { children: `type ProgressSize = 'sm' | 'md' | 'lg';
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

export default function Progress(props: ProgressProps): JSX.Element;` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related Components" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("a", { href: "/reference/components/spinner", children: "Spinner" }), " - Indeterminate loading indicator"] }), _jsxs("li", { children: [_jsx("a", { href: "/reference/components/skeleton", children: "Skeleton" }), " - Placeholder loading screens"] }), _jsxs("li", { children: [_jsx("a", { href: "/reference/components/stepper", children: "Stepper" }), " - Multi-step navigation indicator"] })] })] })] }));
}
//# sourceMappingURL=page.js.map