import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChatWindow, ChatInput, Button } from '@clarity-chat/react'
import { StatusBadge } from '../../../.storybook/blocks'
import React, { useState } from 'react'

const meta: Meta = {
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
}

export default meta
type Story = StoryObj

interface StepData {
  personal?: {
    firstName: string
    lastName: string
    email: string
  }
  preferences?: {
    theme: string
    notifications: boolean
    language: string
  }
  subscription?: {
    plan: string
    billing: string
  }
}

export const BasicMultiStepForm: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(0)
    const [formData, setFormData] = useState<StepData>({})
    const [errors, setErrors] = useState<Record<string, string>>({})

    const steps = [
      { id: 'personal', title: 'Personal Info', description: 'Basic information about you' },
      { id: 'preferences', title: 'Preferences', description: 'Customize your experience' },
      { id: 'subscription', title: 'Subscription', description: 'Choose your plan' },
      { id: 'review', title: 'Review', description: 'Confirm your information' },
    ]

    const validateStep = (step: number): boolean => {
      const newErrors: Record<string, string> = {}

      if (step === 0) {
        if (!formData.personal?.firstName) newErrors.firstName = 'First name is required'
        if (!formData.personal?.lastName) newErrors.lastName = 'Last name is required'
        if (!formData.personal?.email) {
          newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personal.email)) {
          newErrors.email = 'Invalid email format'
        }
      }

      if (step === 1) {
        if (!formData.preferences?.theme) newErrors.theme = 'Please select a theme'
        if (!formData.preferences?.language) newErrors.language = 'Please select a language'
      }

      if (step === 2) {
        if (!formData.subscription?.plan) newErrors.plan = 'Please select a plan'
        if (!formData.subscription?.billing) newErrors.billing = 'Please select billing period'
      }

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    }

    const handleNext = () => {
      if (validateStep(currentStep)) {
        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
      }
    }

    const handleBack = () => {
      setCurrentStep((prev) => Math.max(prev - 1, 0))
      setErrors({})
    }

    const handleSubmit = () => {
      console.log('Form submitted:', formData)
      alert('Form submitted successfully! Check console for data.')
    }

    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold">Multi-step Form</h2>
            <StatusBadge status="stable" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Complete the form step by step. Your progress is saved as you navigate between steps.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                      index < currentStep
                        ? 'bg-green-500 text-white'
                        : index === currentStep
                        ? 'bg-brand-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    }`}
                  >
                    {index < currentStep ? '✓' : index + 1}
                  </div>
                  <div className="text-xs mt-2 text-center max-w-[100px]">
                    <div className="font-medium">{step.title}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 transition-colors ${
                      index < currentStep ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-lg p-8 min-h-[400px]">
          {/* Step 1: Personal Info */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Let's start with some basic information about you.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name *</label>
                  <input
                    type="text"
                    value={formData.personal?.firstName || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personal: { ...formData.personal!, firstName: e.target.value },
                      })
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="John"
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Last Name *</label>
                  <input
                    type="text"
                    value={formData.personal?.lastName || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personal: { ...formData.personal!, lastName: e.target.value },
                      })
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Doe"
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.personal?.email || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personal: { ...formData.personal!, email: e.target.value },
                      })
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Preferences */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Preferences</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Customize your experience with these settings.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Theme *</label>
                  <select
                    value={formData.preferences?.theme || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferences: { ...formData.preferences!, theme: e.target.value },
                      })
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                      errors.theme ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <option value="">Select a theme</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                  {errors.theme && <p className="text-red-500 text-sm mt-1">{errors.theme}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Language *</label>
                  <select
                    value={formData.preferences?.language || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferences: { ...formData.preferences!, language: e.target.value },
                      })
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                      errors.language ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <option value="">Select a language</option>
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                  {errors.language && <p className="text-red-500 text-sm mt-1">{errors.language}</p>}
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="notifications"
                    checked={formData.preferences?.notifications || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferences: { ...formData.preferences!, notifications: e.target.checked },
                      })
                    }
                    className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500"
                  />
                  <label htmlFor="notifications" className="text-sm font-medium">
                    Enable email notifications
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Subscription */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Choose Your Plan</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Select the plan that best fits your needs.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-3">Plan *</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['free', 'pro', 'enterprise'].map((plan) => (
                      <label
                        key={plan}
                        className={`cursor-pointer p-4 border-2 rounded-lg transition-colors ${
                          formData.subscription?.plan === plan
                            ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        <input
                          type="radio"
                          name="plan"
                          value={plan}
                          checked={formData.subscription?.plan === plan}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              subscription: { ...formData.subscription!, plan: e.target.value },
                            })
                          }
                          className="sr-only"
                        />
                        <div className="font-semibold capitalize mb-1">{plan}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {plan === 'free' && 'Basic features'}
                          {plan === 'pro' && '$29/month'}
                          {plan === 'enterprise' && 'Custom pricing'}
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.plan && <p className="text-red-500 text-sm mt-2">{errors.plan}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Billing Period *</label>
                  <div className="flex gap-4">
                    {['monthly', 'annually'].map((billing) => (
                      <label
                        key={billing}
                        className={`cursor-pointer flex-1 p-4 border-2 rounded-lg transition-colors ${
                          formData.subscription?.billing === billing
                            ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        <input
                          type="radio"
                          name="billing"
                          value={billing}
                          checked={formData.subscription?.billing === billing}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              subscription: { ...formData.subscription!, billing: e.target.value },
                            })
                          }
                          className="sr-only"
                        />
                        <div className="font-semibold capitalize">{billing}</div>
                        {billing === 'annually' && (
                          <div className="text-sm text-green-600 dark:text-green-400">Save 20%</div>
                        )}
                      </label>
                    ))}
                  </div>
                  {errors.billing && <p className="text-red-500 text-sm mt-2">{errors.billing}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Review Your Information</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Please review your information before submitting.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-semibold mb-3">Personal Information</h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-600 dark:text-gray-400">Name:</dt>
                      <dd className="font-medium">
                        {formData.personal?.firstName} {formData.personal?.lastName}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600 dark:text-gray-400">Email:</dt>
                      <dd className="font-medium">{formData.personal?.email}</dd>
                    </div>
                  </dl>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-semibold mb-3">Preferences</h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-600 dark:text-gray-400">Theme:</dt>
                      <dd className="font-medium capitalize">{formData.preferences?.theme}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600 dark:text-gray-400">Language:</dt>
                      <dd className="font-medium uppercase">{formData.preferences?.language}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600 dark:text-gray-400">Notifications:</dt>
                      <dd className="font-medium">
                        {formData.preferences?.notifications ? 'Enabled' : 'Disabled'}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-semibold mb-3">Subscription</h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-600 dark:text-gray-400">Plan:</dt>
                      <dd className="font-medium capitalize">{formData.subscription?.plan}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600 dark:text-gray-400">Billing:</dt>
                      <dd className="font-medium capitalize">{formData.subscription?.billing}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-6 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Back
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-600 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              Submit
            </button>
          )}
        </div>

        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold mb-3">Pattern Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Step-by-step progression</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Data persistence between steps</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Per-step validation</span>
              </li>
            </ul>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Visual progress indicator</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Navigate back to edit</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Review before submission</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete multi-step form with validation, progress tracking, and review step.',
      },
    },
  },
}
