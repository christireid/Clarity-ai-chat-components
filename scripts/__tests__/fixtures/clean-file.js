// Test fixture: Clean file with no issues
'use client';
import { jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
export function CleanButton({ label, onClick }) {
    const [count, setCount] = useState(0);
    const handleClick = useCallback(() => {
        setCount((c) => c + 1);
        onClick();
    }, [onClick]);
    return (_jsxs("button", { className: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded", onClick: handleClick, children: [label, " (", count, ")"] }));
}
//# sourceMappingURL=clean-file.js.map