import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Progress } from '@clarity-chat/react';
import { useState, useEffect } from 'react';
/**
 * Progress Indicators
 *
 * **Visual feedback for:**
 * - Task completion
 * - File uploads
 * - Data processing
 * - Multi-step workflows
 * - Loading states
 *
 * **Key Features:**
 * - Smooth animations
 * - Customizable colors
 * - Multiple sizes
 * - Indeterminate state
 * - Label support
 *
 * **Design Philosophy:**
 * - Clear: Users always know progress status
 * - Smooth: Animated transitions feel natural
 * - Flexible: Works for many use cases
 * - Accessible: ARIA attributes for screen readers
 */
const meta = {
    title: 'Components/Progress',
    component: Progress,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: 'Progress indicators that provide visual feedback for tasks, uploads, and loading states with smooth animations.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        value: {
            control: { type: 'range', min: 0, max: 100, step: 1 },
            description: 'Current progress value (0-100)',
        },
        max: {
            control: 'number',
            description: 'Maximum value for progress',
        },
        className: {
            control: 'text',
            description: 'Additional CSS classes',
        },
    },
};
export default meta;
// ============================================================================
// Basic Progress
// ============================================================================
export const Default = {
    args: {
        value: 45,
    },
};
export const Empty = {
    args: {
        value: 0,
    },
};
export const Half = {
    args: {
        value: 50,
    },
};
export const AlmostComplete = {
    args: {
        value: 95,
    },
};
export const Complete = {
    args: {
        value: 100,
    },
};
// ============================================================================
// Sizes
// ============================================================================
export const Sizes = {
    render: () => (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-sm font-medium", children: "Small" }), _jsx(Progress, { value: 60, className: "h-1" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-sm font-medium", children: "Default" }), _jsx(Progress, { value: 60, className: "h-2" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-sm font-medium", children: "Large" }), _jsx(Progress, { value: 60, className: "h-4" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-sm font-medium", children: "Extra Large" }), _jsx(Progress, { value: 60, className: "h-6" })] })] })),
};
// ============================================================================
// Colors
// ============================================================================
export const ColorVariants = {
    render: () => (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-sm font-medium", children: "Blue (Default)" }), _jsx(Progress, { value: 75 })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-sm font-medium", children: "Green (Success)" }), _jsx(Progress, { value: 75, className: "[&>div]:bg-green-500" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-sm font-medium", children: "Red (Error)" }), _jsx(Progress, { value: 75, className: "[&>div]:bg-red-500" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-sm font-medium", children: "Yellow (Warning)" }), _jsx(Progress, { value: 75, className: "[&>div]:bg-yellow-500" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-sm font-medium", children: "Purple (Custom)" }), _jsx(Progress, { value: 75, className: "[&>div]:bg-purple-500" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-sm font-medium", children: "Gradient" }), _jsx(Progress, { value: 75, className: "[&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-purple-600" })] })] })),
};
// ============================================================================
// Animated Progress
// ============================================================================
export const AnimatedProgress = {
    render: () => {
        const [progress, setProgress] = useState(0);
        useEffect(() => {
            const timer = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        return 0;
                    }
                    return prev + 1;
                });
            }, 50);
            return () => clearInterval(timer);
        }, []);
        return (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm font-medium", children: "Loading..." }), _jsxs("span", { className: "text-sm font-medium", children: [progress, "%"] })] }), _jsx(Progress, { value: progress })] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Smooth animated progress that automatically fills.',
            },
        },
    },
};
export const StepProgress = {
    render: () => {
        const [step, setStep] = useState(0);
        const steps = [0, 25, 50, 75, 100];
        const nextStep = () => {
            setStep((prev) => (prev + 1) % steps.length);
        };
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "text-sm font-medium", children: ["Step ", Math.min(step + 1, steps.length), " of ", steps.length] }), _jsxs("span", { className: "text-sm font-medium", children: [steps[step], "%"] })] }), _jsx(Progress, { value: steps[step] })] }), _jsx("button", { onClick: nextStep, className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: "Next Step" })] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Progress with discrete steps, useful for multi-step workflows.',
            },
        },
    },
};
// ============================================================================
// Real-World Use Cases
// ============================================================================
export const FileUpload = {
    render: () => {
        const [uploading, setUploading] = useState(false);
        const [progress, setProgress] = useState(0);
        const startUpload = () => {
            setUploading(true);
            setProgress(0);
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setTimeout(() => setUploading(false), 500);
                        return 100;
                    }
                    return prev + Math.random() * 15;
                });
            }, 200);
        };
        return (_jsxs("div", { className: "space-y-4 max-w-md", children: [_jsxs("div", { className: "p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-center", children: [_jsx("p", { className: "text-sm text-muted-foreground mb-3", children: "Drop files here or click to upload" }), _jsx("button", { onClick: startUpload, disabled: uploading, className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50", children: uploading ? 'Uploading...' : 'Upload File' })] }), uploading && (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm font-medium", children: "document.pdf" }), _jsxs("span", { className: "text-sm font-medium", children: [Math.round(progress), "%"] })] }), _jsx(Progress, { value: progress })] }))] }));
    },
};
export const DataProcessing = {
    render: () => {
        const [processing, setProcessing] = useState(false);
        const [progress, setProgress] = useState(0);
        const [currentTask, setCurrentTask] = useState('');
        const tasks = [
            { name: 'Reading file...', duration: 1000 },
            { name: 'Parsing data...', duration: 1500 },
            { name: 'Validating records...', duration: 2000 },
            { name: 'Importing to database...', duration: 1500 },
            { name: 'Finalizing...', duration: 500 },
        ];
        const startProcessing = async () => {
            setProcessing(true);
            setProgress(0);
            for (let i = 0; i < tasks.length; i++) {
                setCurrentTask(tasks[i].name);
                const startProgress = (i / tasks.length) * 100;
                const endProgress = ((i + 1) / tasks.length) * 100;
                await new Promise((resolve) => {
                    const duration = tasks[i].duration;
                    const steps = 20;
                    const stepDuration = duration / steps;
                    let step = 0;
                    const interval = setInterval(() => {
                        step++;
                        const progress = startProgress + ((endProgress - startProgress) * step) / steps;
                        setProgress(progress);
                        if (step >= steps) {
                            clearInterval(interval);
                            resolve(null);
                        }
                    }, stepDuration);
                });
            }
            setProcessing(false);
            setCurrentTask('Complete!');
        };
        return (_jsxs("div", { className: "space-y-4 max-w-md", children: [_jsx("button", { onClick: startProcessing, disabled: processing, className: "w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50", children: processing ? 'Processing...' : 'Process Data' }), (processing || progress === 100) && (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm font-medium", children: currentTask }), _jsxs("span", { className: "text-sm font-medium", children: [Math.round(progress), "%"] })] }), _jsx(Progress, { value: progress, className: progress === 100 ? '[&>div]:bg-green-500' : '' })] }))] }));
    },
};
export const MultipleProgress = {
    render: () => {
        const [files, setFiles] = useState([
            { name: 'document1.pdf', progress: 45 },
            { name: 'image.jpg', progress: 78 },
            { name: 'data.csv', progress: 23 },
        ]);
        useEffect(() => {
            const interval = setInterval(() => {
                setFiles((prev) => prev.map((file) => ({
                    ...file,
                    progress: Math.min(100, file.progress + Math.random() * 10),
                })));
            }, 500);
            return () => clearInterval(interval);
        }, []);
        return (_jsxs("div", { className: "space-y-4 max-w-md", children: [_jsx("h3", { className: "font-semibold", children: "Uploading Files" }), files.map((file) => (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm font-medium", children: file.name }), _jsxs("span", { className: "text-sm font-medium", children: [Math.round(file.progress), "%"] })] }), _jsx(Progress, { value: file.progress, className: file.progress === 100 ? '[&>div]:bg-green-500' : '' })] }, file.name)))] }));
    },
};
export const InstallationProgress = {
    render: () => {
        const [installing, setInstalling] = useState(false);
        const [progress, setProgress] = useState(0);
        const [status, setStatus] = useState('Ready to install');
        const install = async () => {
            setInstalling(true);
            setProgress(0);
            const steps = [
                { status: 'Downloading dependencies...', duration: 2000 },
                { status: 'Installing packages...', duration: 3000 },
                { status: 'Building project...', duration: 2500 },
                { status: 'Running post-install scripts...', duration: 1500 },
            ];
            for (let i = 0; i < steps.length; i++) {
                setStatus(steps[i].status);
                const startProgress = (i / steps.length) * 100;
                const endProgress = ((i + 1) / steps.length) * 100;
                await new Promise((resolve) => {
                    const duration = steps[i].duration;
                    const interval = setInterval(() => {
                        setProgress((prev) => {
                            const next = prev + ((endProgress - startProgress) / duration) * 100;
                            if (next >= endProgress) {
                                clearInterval(interval);
                                resolve(null);
                                return endProgress;
                            }
                            return next;
                        });
                    }, 100);
                });
            }
            setStatus('Installation complete! ✓');
            setInstalling(false);
        };
        return (_jsxs("div", { className: "space-y-4 max-w-md p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "font-semibold", children: "Install Application" }), progress === 100 && (_jsx("span", { className: "text-green-600 dark:text-green-400 text-sm font-semibold", children: "Complete" }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-sm text-muted-foreground", children: status }), (installing || progress > 0) && (_jsxs(_Fragment, { children: [_jsx(Progress, { value: progress, className: progress === 100 ? '[&>div]:bg-green-500' : '' }), _jsxs("p", { className: "text-xs text-muted-foreground text-right", children: [Math.round(progress), "%"] })] }))] }), _jsx("button", { onClick: install, disabled: installing, className: "w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50", children: installing
                        ? 'Installing...'
                        : progress === 100
                            ? 'Reinstall'
                            : 'Install' })] }));
    },
};
// ============================================================================
// Interactive Demo
// ============================================================================
export const InteractiveDemo = {
    render: () => {
        const [value, setValue] = useState(50);
        return (_jsxs("div", { className: "space-y-6 max-w-md", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm font-medium", children: "Progress" }), _jsxs("span", { className: "text-sm font-medium", children: [value, "%"] })] }), _jsx(Progress, { value: value })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("input", { type: "range", min: "0", max: "100", value: value, onChange: (e) => setValue(Number(e.target.value)), className: "w-full" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setValue(Math.max(0, value - 10)), className: "flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors", children: "-10%" }), _jsx("button", { onClick: () => setValue(50), className: "flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors", children: "Reset" }), _jsx("button", { onClick: () => setValue(Math.min(100, value + 10)), className: "flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors", children: "+10%" })] })] })] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Interactive demo to test progress values manually.',
            },
        },
    },
};
// ============================================================================
// Accessibility
// ============================================================================
export const Accessibility = {
    render: () => (_jsxs("div", { className: "space-y-6 max-w-2xl", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-sm font-medium", children: "Accessible Progress Bar" }), _jsx(Progress, { value: 65, "aria-label": "Task completion progress" })] }), _jsxs("div", { className: "p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm space-y-2", children: [_jsx("strong", { children: "Accessibility Features:" }), _jsxs("ul", { className: "list-disc list-inside space-y-1", children: [_jsx("li", { children: "Uses semantic HTML progress element" }), _jsx("li", { children: "ARIA role=\"progressbar\" for screen readers" }), _jsx("li", { children: "aria-valuenow, aria-valuemin, aria-valuemax attributes" }), _jsx("li", { children: "Optional aria-label for context" }), _jsx("li", { children: "High contrast visual indicator" }), _jsx("li", { children: "Smooth animations respect prefers-reduced-motion" }), _jsx("li", { children: "Clear visual distinction between complete and incomplete" })] })] })] })),
};
//# sourceMappingURL=Progress.stories.js.map