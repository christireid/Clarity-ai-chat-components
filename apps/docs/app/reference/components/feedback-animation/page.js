import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const metadata = {
    title: 'Feedback Animation | Clarity Chat',
    description: 'Delightful animated feedback for success, error, warning, and info states.'
};
export default function FeedbackAnimationPage() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "Feedback Animation" }), _jsx("p", { className: "text-xl text-muted-foreground mb-8", children: "Beautiful animated feedback component for user action confirmations with auto-hide and custom durations." }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Key Features" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Four feedback types: success, error, warning, info" }), _jsx("li", { children: "Animated entrance/exit with scale and opacity transitions" }), _jsx("li", { children: "Auto-hide with configurable duration (default: 2000ms)" }), _jsx("li", { children: "Icon animations with rotation and scale effects" }), _jsx("li", { children: "Custom messages for each feedback type" }), _jsx("li", { children: "Completion callbacks for chaining actions" }), _jsx("li", { children: "Framer Motion powered animations" }), _jsx("li", { children: "Color-coded by feedback type" })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Basic Usage" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { FeedbackAnimation } from '@clarity-chat/react'
import { useState } from 'react'

function Example() {
  const [show, setShow] = useState(false)
  
  return (
    <>
      <button onClick={() => setShow(true)}>Save</button>
      
      <FeedbackAnimation
        type="success"
        show={show}
        message="Saved successfully!"
        duration={2000}
        onComplete={() => setShow(false)}
      />
    </>
  )
}` }) }) })] })] }));
}
//# sourceMappingURL=page.js.map