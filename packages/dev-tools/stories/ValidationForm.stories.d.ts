/**
 * Storybook stories for ValidationForm component
 * Demonstrates React 19 client-side form state management
 */
import type { Meta, StoryObj } from '@storybook/react';
import { ValidationForm } from '../src/react/components/validation-form';
declare const meta: Meta<typeof ValidationForm>;
export default meta;
type Story = StoryObj<typeof ValidationForm>;
/**
 * Environment Validation
 */
export declare const EnvironmentValidation: Story;
/**
 * API Key Validation
 */
export declare const APIKeyValidation: Story;
/**
 * Chat Config Validation
 */
export declare const ChatConfigValidation: Story;
//# sourceMappingURL=ValidationForm.stories.d.ts.map