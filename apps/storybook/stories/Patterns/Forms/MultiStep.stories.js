import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { StatusBadge } from '../../../.storybook/blocks';
import { useState } from 'react';
const meta = {
    title: 'Patterns/Forms/Multi-step Forms',
    parameters: {
        docs: {
            description: {
                component: `
# Multi-step Form Pattern

Learn how to implement multi-step forms in chat interfaces. This pattern demonstrates progressive data collection without overwhelming users.

## Problem

Complex forms with many fields overwhelm users and lead to abandonment. Presenting all fields at once creates cognitive overload.

## Solution

Break forms into logical steps:
1. Group related fields together
2. Show progress indicator
3. Validate per step
4. Allow navigation between steps
5. Save data between steps
6. Provide review before submission

## Key Benefits

- **Better UX** - Manageable chunks of information
- **Higher Completion** - Reduced form abandonment
- **Clear Progress** - Users know how far they've come
- **Validation** - Catch errors early per step
- **Flexibility** - Edit previous steps easily

## Use Cases

- User onboarding
- Account setup
- Checkout processes
- Survey forms
- Application forms
- Settings configuration
        `,
            },
        },
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};
export default meta;
export const BasicMultiStepForm = {
    render: () => {
        const [currentStep, setCurrentStep] = useState(0);
        const [formData, setFormData] = useState({});
        const [errors, setErrors] = useState({});
        const steps = [
            { id: 'personal', title: 'Personal Info', description: 'Basic information about you' },
            { id: 'preferences', title: 'Preferences', description: 'Customize your experience' },
            { id: 'subscription', title: 'Subscription', description: 'Choose your plan' },
            { id: 'review', title: 'Review', description: 'Confirm your information' },
        ];
        const validateStep = (step) => {
            const newErrors = {};
            if (step === 0) {
                if (!formData.personal?.firstName)
                    newErrors.firstName = 'First name is required';
                if (!formData.personal?.lastName)
                    newErrors.lastName = 'Last name is required';
                if (!formData.personal?.email) {
                    newErrors.email = 'Email is required';
                }
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personal.email)) {
                    newErrors.email = 'Invalid email format';
                }
            }
            if (step === 1) {
                if (!formData.preferences?.theme)
                    newErrors.theme = 'Please select a theme';
                if (!formData.preferences?.language)
                    newErrors.language = 'Please select a language';
            }
            if (step === 2) {
                if (!formData.subscription?.plan)
                    newErrors.plan = 'Please select a plan';
                if (!formData.subscription?.billing)
                    newErrors.billing = 'Please select billing period';
            }
            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        };
        const handleNext = () => {
            if (validateStep(currentStep)) {
                setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
            }
        };
        const handleBack = () => {
            setCurrentStep((prev) => Math.max(prev - 1, 0));
            setErrors({});
        };
        const handleSubmit = () => {
            console.log('Form submitted:', formData);
            alert('Form submitted successfully! Check console for data.');
        };
        return (_jsxs("div", { className: "p-8 max-w-7xl mx-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Multi-step Form" }), _jsx(StatusBadge, { status: "stable" })] }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Complete the form step by step. Your progress is saved as you navigate between steps." })] }), _jsx("div", { className: "mb-8", children: _jsx("div", { className: "flex items-center justify-between mb-2", children: steps.map((step, index) => (_jsxs("div", { className: "flex items-center flex-1", children: [_jsxs("div", { className: "flex flex-col items-center flex-1", children: [_jsx("div", { className: `w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${index < currentStep
                                                ? 'bg-green-500 text-white'
                                                : index === currentStep
                                                    ? 'bg-brand-500 text-white'
                                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`, children: index < currentStep ? '✓' : index + 1 }), _jsx("div", { className: "text-xs mt-2 text-center max-w-[100px]", children: _jsx("div", { className: "font-medium", children: step.title }) })] }), index < steps.length - 1 && (_jsx("div", { className: `h-1 flex-1 transition-colors ${index < currentStep ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}` }))] }, step.id))) }) }), _jsxs("div", { className: "bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-lg p-8 min-h-[400px]", children: [currentStep === 0 && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold mb-2", children: "Personal Information" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Let's start with some basic information about you." })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "First Name *" }), _jsx("input", { type: "text", value: formData.personal?.firstName || '', onChange: (e) => setFormData({
                                                        ...formData,
                                                        personal: { ...formData.personal, firstName: e.target.value },
                                                    }), className: `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`, placeholder: "John" }), errors.firstName && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.firstName })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Last Name *" }), _jsx("input", { type: "text", value: formData.personal?.lastName || '', onChange: (e) => setFormData({
                                                        ...formData,
                                                        personal: { ...formData.personal, lastName: e.target.value },
                                                    }), className: `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`, placeholder: "Doe" }), errors.lastName && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.lastName })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Email *" }), _jsx("input", { type: "email", value: formData.personal?.email || '', onChange: (e) => setFormData({
                                                        ...formData,
                                                        personal: { ...formData.personal, email: e.target.value },
                                                    }), className: `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`, placeholder: "john@example.com" }), errors.email && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.email })] })] })] })), currentStep === 1 && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold mb-2", children: "Preferences" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Customize your experience with these settings." })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Theme *" }), _jsxs("select", { value: formData.preferences?.theme || '', onChange: (e) => setFormData({
                                                        ...formData,
                                                        preferences: { ...formData.preferences, theme: e.target.value },
                                                    }), className: `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.theme ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`, children: [_jsx("option", { value: "", children: "Select a theme" }), _jsx("option", { value: "light", children: "Light" }), _jsx("option", { value: "dark", children: "Dark" }), _jsx("option", { value: "system", children: "System" })] }), errors.theme && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.theme })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Language *" }), _jsxs("select", { value: formData.preferences?.language || '', onChange: (e) => setFormData({
                                                        ...formData,
                                                        preferences: { ...formData.preferences, language: e.target.value },
                                                    }), className: `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.language ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`, children: [_jsx("option", { value: "", children: "Select a language" }), _jsx("option", { value: "en", children: "English" }), _jsx("option", { value: "es", children: "Spanish" }), _jsx("option", { value: "fr", children: "French" }), _jsx("option", { value: "de", children: "German" })] }), errors.language && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.language })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("input", { type: "checkbox", id: "notifications", checked: formData.preferences?.notifications || false, onChange: (e) => setFormData({
                                                        ...formData,
                                                        preferences: { ...formData.preferences, notifications: e.target.checked },
                                                    }), className: "w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500" }), _jsx("label", { htmlFor: "notifications", className: "text-sm font-medium", children: "Enable email notifications" })] })] })] })), currentStep === 2 && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold mb-2", children: "Choose Your Plan" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Select the plan that best fits your needs." })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-3", children: "Plan *" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: ['free', 'pro', 'enterprise'].map((plan) => (_jsxs("label", { className: `cursor-pointer p-4 border-2 rounded-lg transition-colors ${formData.subscription?.plan === plan
                                                            ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                                                            : 'border-gray-300 dark:border-gray-600'}`, children: [_jsx("input", { type: "radio", name: "plan", value: plan, checked: formData.subscription?.plan === plan, onChange: (e) => setFormData({
                                                                    ...formData,
                                                                    subscription: { ...formData.subscription, plan: e.target.value },
                                                                }), className: "sr-only" }), _jsx("div", { className: "font-semibold capitalize mb-1", children: plan }), _jsxs("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: [plan === 'free' && 'Basic features', plan === 'pro' && '$29/month', plan === 'enterprise' && 'Custom pricing'] })] }, plan))) }), errors.plan && _jsx("p", { className: "text-red-500 text-sm mt-2", children: errors.plan })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-3", children: "Billing Period *" }), _jsx("div", { className: "flex gap-4", children: ['monthly', 'annually'].map((billing) => (_jsxs("label", { className: `cursor-pointer flex-1 p-4 border-2 rounded-lg transition-colors ${formData.subscription?.billing === billing
                                                            ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                                                            : 'border-gray-300 dark:border-gray-600'}`, children: [_jsx("input", { type: "radio", name: "billing", value: billing, checked: formData.subscription?.billing === billing, onChange: (e) => setFormData({
                                                                    ...formData,
                                                                    subscription: { ...formData.subscription, billing: e.target.value },
                                                                }), className: "sr-only" }), _jsx("div", { className: "font-semibold capitalize", children: billing }), billing === 'annually' && (_jsx("div", { className: "text-sm text-green-600 dark:text-green-400", children: "Save 20%" }))] }, billing))) }), errors.billing && _jsx("p", { className: "text-red-500 text-sm mt-2", children: errors.billing })] })] })] })), currentStep === 3 && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold mb-2", children: "Review Your Information" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Please review your information before submitting." })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "p-4 bg-gray-50 dark:bg-gray-800 rounded-lg", children: [_jsx("h4", { className: "font-semibold mb-3", children: "Personal Information" }), _jsxs("dl", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("dt", { className: "text-gray-600 dark:text-gray-400", children: "Name:" }), _jsxs("dd", { className: "font-medium", children: [formData.personal?.firstName, " ", formData.personal?.lastName] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("dt", { className: "text-gray-600 dark:text-gray-400", children: "Email:" }), _jsx("dd", { className: "font-medium", children: formData.personal?.email })] })] })] }), _jsxs("div", { className: "p-4 bg-gray-50 dark:bg-gray-800 rounded-lg", children: [_jsx("h4", { className: "font-semibold mb-3", children: "Preferences" }), _jsxs("dl", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("dt", { className: "text-gray-600 dark:text-gray-400", children: "Theme:" }), _jsx("dd", { className: "font-medium capitalize", children: formData.preferences?.theme })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("dt", { className: "text-gray-600 dark:text-gray-400", children: "Language:" }), _jsx("dd", { className: "font-medium uppercase", children: formData.preferences?.language })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("dt", { className: "text-gray-600 dark:text-gray-400", children: "Notifications:" }), _jsx("dd", { className: "font-medium", children: formData.preferences?.notifications ? 'Enabled' : 'Disabled' })] })] })] }), _jsxs("div", { className: "p-4 bg-gray-50 dark:bg-gray-800 rounded-lg", children: [_jsx("h4", { className: "font-semibold mb-3", children: "Subscription" }), _jsxs("dl", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("dt", { className: "text-gray-600 dark:text-gray-400", children: "Plan:" }), _jsx("dd", { className: "font-medium capitalize", children: formData.subscription?.plan })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("dt", { className: "text-gray-600 dark:text-gray-400", children: "Billing:" }), _jsx("dd", { className: "font-medium capitalize", children: formData.subscription?.billing })] })] })] })] })] }))] }), _jsxs("div", { className: "mt-8 flex justify-between", children: [_jsx("button", { onClick: handleBack, disabled: currentStep === 0, className: "px-6 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors", children: "Back" }), currentStep < steps.length - 1 ? (_jsx("button", { onClick: handleNext, className: "px-6 py-2 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-600 transition-colors", children: "Next" })) : (_jsx("button", { onClick: handleSubmit, className: "px-6 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors", children: "Submit" }))] }), _jsxs("div", { className: "mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800", children: [_jsx("h3", { className: "text-lg font-semibold mb-3", children: "Pattern Features" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm", children: [_jsxs("ul", { className: "space-y-2", children: [_jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-green-500 font-bold", children: "\u2713" }), _jsx("span", { children: "Step-by-step progression" })] }), _jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-green-500 font-bold", children: "\u2713" }), _jsx("span", { children: "Data persistence between steps" })] }), _jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-green-500 font-bold", children: "\u2713" }), _jsx("span", { children: "Per-step validation" })] })] }), _jsxs("ul", { className: "space-y-2", children: [_jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-green-500 font-bold", children: "\u2713" }), _jsx("span", { children: "Visual progress indicator" })] }), _jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-green-500 font-bold", children: "\u2713" }), _jsx("span", { children: "Navigate back to edit" })] }), _jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-green-500 font-bold", children: "\u2713" }), _jsx("span", { children: "Review before submission" })] })] })] })] })] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Complete multi-step form with validation, progress tracking, and review step.',
            },
        },
    },
};
//# sourceMappingURL=MultiStep.stories.js.map