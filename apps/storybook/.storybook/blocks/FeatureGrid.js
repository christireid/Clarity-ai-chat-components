import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import clsx from 'clsx';
export const FeatureGrid = ({ features, columns = 3, className }) => {
    const gridCols = {
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-2 lg:grid-cols-3',
        4: 'md:grid-cols-2 lg:grid-cols-4',
    };
    return (_jsx("div", { className: clsx('grid grid-cols-1 gap-4 my-8', gridCols[columns], className), children: features.map((feature) => (_jsxs("div", { className: "group p-6 rounded-xl border-2 border-border bg-white dark:bg-gray-900 hover:shadow-lg hover:border-brand-500/50 transition-all duration-200 hover:-translate-y-0.5", children: [feature.icon && (_jsx("div", { className: "w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center mb-3 group-hover:bg-brand-500/20 transition-colors", children: feature.icon })), _jsx("h3", { className: "font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100", children: feature.title }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 leading-relaxed", children: feature.description })] }, feature.title))) }));
};
//# sourceMappingURL=FeatureGrid.js.map