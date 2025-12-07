import { jsx as _jsx } from "react/jsx-runtime";
import { ValidationForm } from '../src/react/components/validation-form';
const meta = {
    title: 'Dev Tools/Validation Form',
    component: ValidationForm,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: 'Validation Form using React 19 client-side form state management.',
            },
        },
    },
    tags: ['autodocs'],
};
export default meta;
/**
 * Environment Validation
 */
export const EnvironmentValidation = {
    render: () => _jsx(ValidationForm, { type: "env" }),
};
/**
 * API Key Validation
 */
export const APIKeyValidation = {
    render: () => _jsx(ValidationForm, { type: "api-key" }),
};
/**
 * Chat Config Validation
 */
export const ChatConfigValidation = {
    render: () => _jsx(ValidationForm, { type: "chat-config" }),
};
//# sourceMappingURL=ValidationForm.stories.js.map