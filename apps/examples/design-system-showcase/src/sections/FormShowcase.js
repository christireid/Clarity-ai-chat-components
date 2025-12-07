import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Form Showcase
 *
 * Demonstrates form inputs, textareas, and form patterns
 */
import { Input, Textarea, Checkbox, Button } from '@clarity-chat/primitives';
import { useState } from 'react';
export function FormShowcase() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [agreed, setAgreed] = useState(false);
    return (_jsxs("div", { className: "space-y-12", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold mb-2", children: "Form Components" }), _jsx("p", { className: "text-muted-foreground", children: "Form inputs with refined focus states and consistent styling" })] }), _jsxs("section", { children: [_jsx("h3", { className: "text-xl font-semibold mb-4", children: "Input Fields" }), _jsxs("div", { className: "space-y-4 max-w-md", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Text Input" }), _jsx(Input, { placeholder: "Enter text..." })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Email Input" }), _jsx(Input, { type: "email", placeholder: "you@example.com" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Password Input" }), _jsx(Input, { type: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Disabled Input" }), _jsx(Input, { disabled: true, placeholder: "Disabled input" })] })] })] }), _jsxs("section", { children: [_jsx("h3", { className: "text-xl font-semibold mb-4", children: "Textarea" }), _jsx("div", { className: "space-y-4 max-w-md", children: _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Message" }), _jsx(Textarea, { placeholder: "Type your message here...", rows: 4 })] }) })] }), _jsxs("section", { children: [_jsx("h3", { className: "text-xl font-semibold mb-4", children: "Checkboxes" }), _jsxs("div", { className: "space-y-3 max-w-md", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: "terms1" }), _jsx("label", { htmlFor: "terms1", className: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", children: "Accept terms and conditions" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: "terms2", defaultChecked: true }), _jsx("label", { htmlFor: "terms2", className: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", children: "Checked by default" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: "terms3", disabled: true }), _jsx("label", { htmlFor: "terms3", className: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", children: "Disabled checkbox" })] })] })] }), _jsxs("section", { children: [_jsx("h3", { className: "text-xl font-semibold mb-4", children: "Complete Form Example" }), _jsx("div", { className: "max-w-md p-6 rounded-lg ring-1 ring-border/30 bg-card shadow-xs", children: _jsxs("form", { className: "space-y-6", onSubmit: (e) => e.preventDefault(), children: [_jsxs("div", { children: [_jsx("h4", { className: "text-lg font-semibold mb-1", children: "Contact Us" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Send us a message and we'll get back to you" })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Email" }), _jsx(Input, { type: "email", placeholder: "you@example.com", value: email, onChange: (e) => setEmail(e.target.value) }), _jsx("p", { className: "text-xs text-muted-foreground", children: "We'll never share your email" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Message" }), _jsx(Textarea, { placeholder: "Tell us what you're thinking...", rows: 4, value: message, onChange: (e) => setMessage(e.target.value) }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [message.length, "/500 characters"] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: "agree", checked: agreed, onChange: (e) => setAgreed(e.target.checked) }), _jsx("label", { htmlFor: "agree", className: "text-sm font-medium leading-none", children: "I agree to receive updates" })] })] }), _jsxs("div", { className: "flex items-center justify-end gap-2", children: [_jsx(Button, { variant: "outline", type: "button", children: "Cancel" }), _jsx(Button, { type: "submit", children: "Send Message" })] })] }) })] }), _jsxs("section", { children: [_jsx("h3", { className: "text-xl font-semibold mb-4", children: "Form Field States" }), _jsxs("div", { className: "space-y-4 max-w-md", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Normal State" }), _jsx(Input, { placeholder: "ring-1 ring-border/50" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Focus State" }), _jsx(Input, { placeholder: "ring-[3px] ring-ring/50", className: "ring-[3px] ring-ring/50 ring-offset-1" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium text-destructive", children: "Error State" }), _jsx(Input, { placeholder: "ring-destructive/50", className: "ring-destructive/50" }), _jsx("p", { className: "text-sm text-destructive", children: "This field is required" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium text-green-600", children: "Success State" }), _jsx(Input, { placeholder: "ring-green-500/50", className: "ring-green-500/50", defaultValue: "Valid input" }), _jsx("p", { className: "text-sm text-green-600", children: "Looks good!" })] })] })] }), _jsxs("section", { className: "bg-muted/30 rounded-lg p-6 ring-1 ring-border/30", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Code Example" }), _jsx("pre", { className: "bg-background rounded-md p-4 overflow-x-auto text-sm ring-1 ring-border/30", children: _jsx("code", { children: `import { Input, Textarea, Checkbox, Button } from '@clarity-chat/primitives'

// Form field with label
<div className="space-y-2">
  <label className="text-sm font-medium">Email</label>
  <Input 
    type="email" 
    placeholder="you@example.com"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
  <p className="text-xs text-muted-foreground">
    Helper text here
  </p>
</div>

// Textarea
<Textarea 
  placeholder="Your message..."
  rows={4}
/>

// Checkbox with label
<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <label htmlFor="terms">
    I agree to the terms
  </label>
</div>

// Error state
<Input 
  className="ring-destructive/50"
  placeholder="Error input"
/>` }) })] }), _jsxs("section", { children: [_jsx("h3", { className: "text-xl font-semibold mb-4", children: "Form Pattern Details" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "p-4 rounded-lg ring-1 ring-border/30 bg-card", children: [_jsx("h4", { className: "font-medium mb-2", children: "Base Styling" }), _jsxs("ul", { className: "text-sm text-muted-foreground space-y-1", children: [_jsx("li", { children: "\u2022 rounded-md (6px radius)" }), _jsx("li", { children: "\u2022 ring-1 ring-border/50" }), _jsx("li", { children: "\u2022 shadow-xs (subtle depth)" }), _jsx("li", { children: "\u2022 transition-all duration-200" })] })] }), _jsxs("div", { className: "p-4 rounded-lg ring-1 ring-border/30 bg-card", children: [_jsx("h4", { className: "font-medium mb-2", children: "Focus State" }), _jsxs("ul", { className: "text-sm text-muted-foreground space-y-1", children: [_jsx("li", { children: "\u2022 focus-visible:ring-[3px]" }), _jsx("li", { children: "\u2022 focus-visible:ring-ring/50" }), _jsx("li", { children: "\u2022 focus-visible:ring-offset-1" }), _jsx("li", { children: "\u2022 focus-visible:border-primary/60" })] })] }), _jsxs("div", { className: "p-4 rounded-lg ring-1 ring-border/30 bg-card", children: [_jsx("h4", { className: "font-medium mb-2", children: "Hover State" }), _jsxs("ul", { className: "text-sm text-muted-foreground space-y-1", children: [_jsx("li", { children: "\u2022 hover:ring-border/70" }), _jsx("li", { children: "\u2022 Subtle ring darkening" }), _jsx("li", { children: "\u2022 Smooth transition" }), _jsx("li", { children: "\u2022 No movement" })] })] }), _jsxs("div", { className: "p-4 rounded-lg ring-1 ring-border/30 bg-card", children: [_jsx("h4", { className: "font-medium mb-2", children: "Error State" }), _jsxs("ul", { className: "text-sm text-muted-foreground space-y-1", children: [_jsx("li", { children: "\u2022 ring-destructive/50" }), _jsx("li", { children: "\u2022 Red error message" }), _jsx("li", { children: "\u2022 Maintains consistency" }), _jsx("li", { children: "\u2022 Clear visual feedback" })] })] })] })] })] }));
}
//# sourceMappingURL=FormShowcase.js.map