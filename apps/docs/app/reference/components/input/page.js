import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ApiTable } from '@/components/Demo/ApiTable';
import { ViewInStorybook } from '@/components/Links/StorybookLink';
import { CodePlayground } from '@/components/Playground/CodePlayground';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Input Component - Clarity Chat Components',
    description: 'A text input component for collecting user text input in forms and interfaces.',
};
export default function InputPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsx("header", { className: "docs-header", children: _jsxs("div", { children: [_jsx("h1", { children: "Input" }), _jsx("p", { className: "text-xl text-neutral-700 dark:text-neutral-300 mt-2", children: "A text input component for collecting user text input in forms and interfaces." })] }) }), _jsx(ViewInStorybook, { component: "Input" }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Overview" }), _jsx("p", { children: "The Input component provides a flexible text input field with support for various types, sizes, states, and validation. Essential for forms, search bars, chat inputs, and any text entry interface." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Interactive Playground" }), _jsx("p", { className: "mb-6", children: "Experiment with the Input component! Try different types, placeholders, and states to build the perfect input experience." }), _jsx(CodePlayground, { initialCode: `function Example() {
  return (
    <div className="p-8 max-w-md mx-auto space-y-4">
      <Input placeholder="Type something..." />
      <Input type="email" placeholder="email@example.com" />
      <Input type="password" placeholder="Password" />
    </div>
  )
}

render(<Example />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Basic Usage" }), _jsx(CodePlayground, { initialCode: `import { Input } from '@clarity/chat-components';

export default function BasicInput() {
  return (
    <div className="space-y-4">
      <Input placeholder="Enter text..." />
      <Input placeholder="With label" label="Username" />
      <Input placeholder="With helper text" helperText="Enter your email address" />
    </div>
  );
}

render(<BasicInput />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Props" }), _jsx(ApiTable, { title: "Input Props", data: [
                            { name: 'type', type: "'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'", default: "'text'", description: 'Input type' },
                            { name: 'value', type: 'string', default: 'undefined', description: 'Controlled value' },
                            { name: 'defaultValue', type: 'string', default: 'undefined', description: 'Uncontrolled default value' },
                            { name: 'placeholder', type: 'string', default: 'undefined', description: 'Placeholder text' },
                            { name: 'label', type: 'string', default: 'undefined', description: 'Input label' },
                            { name: 'helperText', type: 'string', default: 'undefined', description: 'Helper text below input' },
                            { name: 'error', type: 'string | boolean', default: 'undefined', description: 'Error message or state' },
                            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Input size' },
                            { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Whether input spans full width' },
                            { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether input is disabled' },
                            { name: 'readOnly', type: 'boolean', default: 'false', description: 'Whether input is read-only' },
                            { name: 'required', type: 'boolean', default: 'false', description: 'Whether input is required' },
                            { name: 'leftIcon', type: 'ReactNode', default: 'undefined', description: 'Icon on the left side' },
                            { name: 'rightIcon', type: 'ReactNode', default: 'undefined', description: 'Icon on the right side' },
                            { name: 'onChange', type: '(e: ChangeEvent) => void', default: 'undefined', description: 'Change handler' },
                            { name: 'onFocus', type: '(e: FocusEvent) => void', default: 'undefined', description: 'Focus handler' },
                            { name: 'onBlur', type: '(e: FocusEvent) => void', default: 'undefined', description: 'Blur handler' },
                            { name: 'className', type: 'string', default: 'undefined', description: 'Additional CSS classes' }
                        ] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Sizes" }), _jsx(CodePlayground, { initialCode: `import { Input } from '@clarity/chat-components';

export default function InputSizes() {
  return (
    <div className="space-y-4">
      <Input size="sm" placeholder="Small input" />
      <Input size="md" placeholder="Medium input" />
      <Input size="lg" placeholder="Large input" />
    </div>
  );
}

render(<InputSizes />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "With Icons" }), _jsx(CodePlayground, { initialCode: `import { Input } from '@clarity/chat-components';

export default function InputWithIcons() {
  return (
    <div className="space-y-4">
      <Input placeholder="Search..." leftIcon={<span>🔍</span>} />
      <Input placeholder="Email" type="email" leftIcon={<span>📧</span>} />
      <Input placeholder="Password" type="password" rightIcon={<span>👁️</span>} />
    </div>
  );
}

render(<InputWithIcons />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Validation States" }), _jsx(CodePlayground, { initialCode: `import { Input } from '@clarity/chat-components';

export default function InputValidation() {
  return (
    <div className="space-y-4">
      <Input placeholder="Valid input" helperText="Looks good!" />
      <Input placeholder="Invalid input" error="This field is required" />
      <Input placeholder="With warning" helperText="Please check your input" />
    </div>
  );
}

render(<InputValidation />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Controlled Input" }), _jsx(CodePlayground, { initialCode: `import { useState } from 'react';
import { Input } from '@clarity/chat-components';
import { CodePlayground } from '@/components/Playground/CodePlayground'

export default function ControlledInput() {
  const [value, setValue] = useState('');

  return (
    <div className="space-y-4">
      <Input
        label="Controlled Input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type something..."
      />
      <p className="text-sm text-gray-600">Value: {value}</p>
    </div>
  );
}

render(<ControlledInput />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "TypeScript" }), _jsx("pre", { children: _jsx("code", { children: `interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string | boolean;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export default function Input(props: InputProps): JSX.Element;` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related Components" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("a", { href: "/reference/components/textarea", children: "Textarea" }), " - Multi-line text input"] }), _jsxs("li", { children: [_jsx("a", { href: "/reference/components/select", children: "Select" }), " - Dropdown selection"] }), _jsxs("li", { children: [_jsx("a", { href: "/reference/components/message-input", children: "MessageInput" }), " - Chat message input"] })] })] })] }));
}
//# sourceMappingURL=page.js.map