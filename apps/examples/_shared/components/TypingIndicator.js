import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
const sizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
};
export function TypingIndicator({ color = 'bg-blue-500', size = 'md', }) {
    const dotClass = `${sizeClasses[size]} ${color} rounded-full animate-bounce`;
    return (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx("span", { className: dotClass, style: { animationDelay: '0ms' } }), _jsx("span", { className: dotClass, style: { animationDelay: '150ms' } }), _jsx("span", { className: dotClass, style: { animationDelay: '300ms' } })] }));
}
export default TypingIndicator;
//# sourceMappingURL=TypingIndicator.js.map