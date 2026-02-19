import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import clsx from 'clsx';
const statusConfig = {
    stable: {
        color: 'green',
        label: 'Stable',
        icon: '✓',
        description: 'Stable and fully supported',
        className: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
    },
    beta: {
        color: 'yellow',
        label: 'Beta',
        icon: '⚠',
        description: 'Under active development, API may change',
        className: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
    },
    deprecated: {
        color: 'red',
        label: 'Deprecated',
        icon: '⨯',
        description: 'Do not use in new projects, will be removed',
        className: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
    },
    new: {
        color: 'blue',
        label: 'New',
        icon: '✨',
        description: 'Recently added to the library',
        className: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
    },
    experimental: {
        color: 'purple',
        label: 'Experimental',
        icon: '🧪',
        description: 'Experimental feature, use with caution',
        className: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800',
    },
};
export const StatusBadge = ({ status, className }) => {
    const config = statusConfig[status];
    return (_jsxs("span", { className: clsx('inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border', config.className, className), title: config.description, children: [_jsx("span", { "aria-hidden": "true", children: config.icon }), config.label] }));
};
//# sourceMappingURL=StatusBadge.js.map