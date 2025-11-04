import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Skeleton, SkeletonText, SkeletonCard, SkeletonAvatar, SkeletonButton, } from '@clarity-chat/react';
/**
 * Skeleton Loaders
 *
 * **Provide visual loading placeholders for:**
 * - Text content
 * - Cards and containers
 * - Avatars and images
 * - Buttons and actions
 * - Custom shapes
 *
 * **Key Features:**
 * - Smooth shimmer animation
 * - Multiple preset shapes
 * - Customizable dimensions
 * - Respects dark mode
 * - Reduces perceived loading time
 *
 * **Design Philosophy:**
 * - Progressive: Show structure before content
 * - Predictable: Match final layout
 * - Smooth: Animated transitions
 * - Non-intrusive: Subtle and elegant
 */
const meta = {
    title: 'Components/Skeleton',
    component: Skeleton,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: 'Skeleton loading components that provide visual placeholders while content loads, improving perceived performance.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        className: {
            control: 'text',
            description: 'Additional CSS classes',
        },
    },
};
export default meta;
// ============================================================================
// Basic Skeleton
// ============================================================================
export const Default = {
    render: () => _jsx(Skeleton, { className: "h-4 w-full" }),
};
export const CustomSize = {
    render: () => (_jsxs("div", { className: "space-y-4", children: [_jsx(Skeleton, { className: "h-3 w-3/4" }), _jsx(Skeleton, { className: "h-4 w-full" }), _jsx(Skeleton, { className: "h-6 w-1/2" }), _jsx(Skeleton, { className: "h-8 w-2/3" })] })),
};
export const RoundedVariants = {
    render: () => (_jsxs("div", { className: "space-y-4", children: [_jsx(Skeleton, { className: "h-4 w-full rounded-none" }), _jsx(Skeleton, { className: "h-4 w-full rounded-sm" }), _jsx(Skeleton, { className: "h-4 w-full rounded-md" }), _jsx(Skeleton, { className: "h-4 w-full rounded-lg" }), _jsx(Skeleton, { className: "h-4 w-full rounded-full" })] })),
};
// ============================================================================
// Preset Components
// ============================================================================
export const TextSkeleton = {
    render: () => (_jsxs("div", { className: "space-y-2", children: [_jsx(SkeletonText, { lines: 1 }), _jsx(SkeletonText, { lines: 3 }), _jsx(SkeletonText, { lines: 5 })] })),
    parameters: {
        docs: {
            description: {
                story: 'Preset skeleton for text content with multiple lines.',
            },
        },
    },
};
export const CardSkeleton = {
    render: () => (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx(SkeletonCard, {}), _jsx(SkeletonCard, {})] })),
    parameters: {
        docs: {
            description: {
                story: 'Preset skeleton for card layouts with image, title, and text.',
            },
        },
    },
};
export const AvatarSkeleton = {
    render: () => (_jsxs("div", { className: "flex gap-4", children: [_jsx(SkeletonAvatar, { size: "sm" }), _jsx(SkeletonAvatar, { size: "md" }), _jsx(SkeletonAvatar, { size: "lg" }), _jsx(SkeletonAvatar, { size: "xl" })] })),
    parameters: {
        docs: {
            description: {
                story: 'Preset skeleton for user avatars in various sizes.',
            },
        },
    },
};
export const ButtonSkeleton = {
    render: () => (_jsxs("div", { className: "flex gap-4", children: [_jsx(SkeletonButton, { size: "sm" }), _jsx(SkeletonButton, { size: "md" }), _jsx(SkeletonButton, { size: "lg" })] })),
    parameters: {
        docs: {
            description: {
                story: 'Preset skeleton for button placeholders.',
            },
        },
    },
};
// ============================================================================
// Complex Layouts
// ============================================================================
export const UserProfile = {
    render: () => (_jsxs("div", { className: "max-w-md p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl space-y-4", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(SkeletonAvatar, { size: "lg" }), _jsxs("div", { className: "flex-1 space-y-2", children: [_jsx(Skeleton, { className: "h-4 w-32" }), _jsx(Skeleton, { className: "h-3 w-24" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Skeleton, { className: "h-3 w-full" }), _jsx(Skeleton, { className: "h-3 w-full" }), _jsx(Skeleton, { className: "h-3 w-3/4" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(SkeletonButton, { size: "sm" }), _jsx(SkeletonButton, { size: "sm" })] })] })),
    parameters: {
        docs: {
            description: {
                story: 'Complex user profile layout with avatar, text, and buttons.',
            },
        },
    },
};
export const MessageList = {
    render: () => (_jsx("div", { className: "space-y-4 max-w-2xl", children: [1, 2, 3].map((i) => (_jsxs("div", { className: "flex gap-3", children: [_jsx(SkeletonAvatar, { size: "md" }), _jsxs("div", { className: "flex-1 space-y-2", children: [_jsx(Skeleton, { className: "h-4 w-32" }), _jsxs("div", { className: "space-y-1", children: [_jsx(Skeleton, { className: "h-3 w-full" }), _jsx(Skeleton, { className: "h-3 w-5/6" })] })] })] }, i))) })),
    parameters: {
        docs: {
            description: {
                story: 'Chat message list with avatars and text placeholders.',
            },
        },
    },
};
export const ArticleLayout = {
    render: () => (_jsxs("div", { className: "max-w-3xl space-y-6", children: [_jsxs("div", { className: "space-y-3", children: [_jsx(Skeleton, { className: "h-8 w-3/4" }), _jsx(Skeleton, { className: "h-4 w-1/2" })] }), _jsx(Skeleton, { className: "h-64 w-full rounded-xl" }), _jsxs("div", { className: "space-y-2", children: [_jsx(Skeleton, { className: "h-4 w-full" }), _jsx(Skeleton, { className: "h-4 w-full" }), _jsx(Skeleton, { className: "h-4 w-5/6" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Skeleton, { className: "h-4 w-full" }), _jsx(Skeleton, { className: "h-4 w-full" }), _jsx(Skeleton, { className: "h-4 w-4/5" })] })] })),
    parameters: {
        docs: {
            description: {
                story: 'Article layout with title, image, and body text.',
            },
        },
    },
};
export const DashboardCards = {
    render: () => (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [1, 2, 3].map((i) => (_jsxs("div", { className: "p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl space-y-3", children: [_jsx(Skeleton, { className: "h-6 w-24" }), _jsx(Skeleton, { className: "h-10 w-32" }), _jsx(Skeleton, { className: "h-3 w-full" })] }, i))) })),
    parameters: {
        docs: {
            description: {
                story: 'Dashboard stat cards with metrics and labels.',
            },
        },
    },
};
export const DataTable = {
    render: () => (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "grid grid-cols-4 gap-4 pb-3 border-b-2", children: [1, 2, 3, 4].map((i) => (_jsx(Skeleton, { className: "h-4 w-20" }, i))) }), [1, 2, 3, 4, 5].map((i) => (_jsx("div", { className: "grid grid-cols-4 gap-4", children: [1, 2, 3, 4].map((j) => (_jsx(Skeleton, { className: "h-3 w-full" }, j))) }, i)))] })),
    parameters: {
        docs: {
            description: {
                story: 'Data table with header and rows.',
            },
        },
    },
};
// ============================================================================
// Loading States
// ============================================================================
export const LoadingSimulation = {
    render: () => {
        const [loading, setLoading] = React.useState(true);
        const [data, setData] = React.useState(null);
        React.useEffect(() => {
            // Simulate data loading
            const timer = setTimeout(() => {
                setData({
                    name: 'John Doe',
                    email: 'john@example.com',
                    bio: 'Software engineer passionate about building great user experiences.',
                });
                setLoading(false);
            }, 3000);
            return () => clearTimeout(timer);
        }, []);
        return (_jsxs("div", { className: "max-w-md p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl", children: [loading ? (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(SkeletonAvatar, { size: "lg" }), _jsxs("div", { className: "flex-1 space-y-2", children: [_jsx(Skeleton, { className: "h-4 w-32" }), _jsx(Skeleton, { className: "h-3 w-24" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Skeleton, { className: "h-3 w-full" }), _jsx(Skeleton, { className: "h-3 w-5/6" })] })] })) : (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold", children: "JD" }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold", children: data.name }), _jsx("p", { className: "text-sm text-muted-foreground", children: data.email })] })] }), _jsx("p", { className: "text-sm", children: data.bio })] })), _jsx("button", { onClick: () => {
                        setLoading(true);
                        setData(null);
                        setTimeout(() => {
                            setData({
                                name: 'John Doe',
                                email: 'john@example.com',
                                bio: 'Software engineer passionate about building great user experiences.',
                            });
                            setLoading(false);
                        }, 3000);
                    }, className: "mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm", children: "Reload" })] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Realistic loading simulation showing skeleton to content transition.',
            },
        },
    },
};
export const ProgressiveLoading = {
    render: () => {
        const [stage, setStage] = React.useState(0);
        React.useEffect(() => {
            if (stage < 3) {
                const timer = setTimeout(() => setStage(stage + 1), 1500);
                return () => clearTimeout(timer);
            }
        }, [stage]);
        return (_jsxs("div", { className: "max-w-2xl space-y-6", children: [_jsx("button", { onClick: () => setStage(0), className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm", children: "Restart Loading" }), _jsxs("div", { className: "space-y-4", children: [stage >= 0 && (_jsx("div", { className: "p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl", children: stage === 0 ? (_jsx(SkeletonText, { lines: 3 })) : (_jsx("p", { className: "text-sm", children: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." })) })), stage >= 1 && (_jsx("div", { className: "space-y-3", children: stage <= 1 ? (_jsx(Skeleton, { className: "h-48 w-full rounded-xl" })) : (_jsx("div", { className: "h-48 w-full rounded-xl bg-gradient-to-br from-blue-500 to-purple-600" })) })), stage >= 2 && (_jsx("div", { className: "flex items-center gap-3", children: stage <= 2 ? (_jsxs(_Fragment, { children: [_jsx(SkeletonAvatar, { size: "sm" }), _jsx(Skeleton, { className: "h-3 w-32" })] })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600" }), _jsx("span", { className: "text-sm font-medium", children: "John Doe \u2022 2 hours ago" })] })) }))] })] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Progressive loading pattern where content loads in stages.',
            },
        },
    },
};
// ============================================================================
// Accessibility
// ============================================================================
export const Accessibility = {
    render: () => (_jsxs("div", { className: "space-y-6 max-w-2xl", children: [_jsx(SkeletonCard, {}), _jsxs("div", { className: "p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm space-y-2", children: [_jsx("strong", { children: "Accessibility Features:" }), _jsxs("ul", { className: "list-disc list-inside space-y-1", children: [_jsx("li", { children: "Aria-busy and aria-live attributes for screen readers" }), _jsx("li", { children: "Semantic loading indicators" }), _jsx("li", { children: "Respects prefers-reduced-motion for animations" }), _jsx("li", { children: "Maintains layout structure to prevent content shift" }), _jsx("li", { children: "High contrast in both light and dark modes" }), _jsx("li", { children: "Non-distracting shimmer animation" })] })] })] })),
};
//# sourceMappingURL=Skeleton.stories.js.map