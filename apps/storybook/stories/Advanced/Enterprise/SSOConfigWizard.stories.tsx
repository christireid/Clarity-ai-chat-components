import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { SSOConfigWizard, type SSOConfigStep } from '@clarity-chat/react'

const meta = {
  title: 'Advanced/Enterprise/SSOConfigWizard',
  component: SSOConfigWizard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# SSO Configuration Wizard

Guided wizard for configuring Single Sign-On (SSO) integration with identity providers like Okta, Azure AD, and Auth0.

## Features

- **Step-by-Step Guidance**: Clear configuration steps
- **Status Tracking**: Track progress (pending, in-progress, complete)
- **Metadata Display**: ACS URL and Entity ID
- **XML Download**: Service provider metadata export
- **Configuration Notes**: Add implementation notes
- **Multiple Providers**: SAML 2.0, OAuth, OIDC support

## Use Cases

- Enterprise SSO setup
- Identity provider integration
- Security configuration
- Compliance requirements
`,
      },
    },
  },
  argTypes: {
    providerName: {
      control: 'text',
      description: 'Name of the SSO provider',
      table: { defaultValue: { summary: '"SAML 2.0"' } },
    },
    steps: {
      control: 'object',
      description: 'Configuration steps',
    },
    metadata: {
      control: 'object',
      description: 'Service provider metadata',
    },
    notes: {
      control: 'text',
      description: 'Configuration notes',
    },
    onNotesChange: {
      action: 'notes-changed',
      description: 'Callback when notes are updated',
    },
    onDownloadMetadata: {
      action: 'download-metadata',
      description: 'Callback when metadata is downloaded',
    },
    onSubmit: {
      action: 'submitted',
      description: 'Callback when configuration is submitted',
    },
  },
} satisfies Meta<typeof SSOConfigWizard>

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Mock Data
// ============================================================================

const oktaSteps: SSOConfigStep[] = [
  {
    id: 'create-app',
    title: 'Advanced/Enterprise/SSOConfigWizard',
    description:
      'Log into your Okta admin console and create a new SAML 2.0 application.',
    status: 'complete',
  },
  {
    id: 'configure-urls',
    title: 'Advanced/Enterprise/SSOConfigWizard',
    description:
      'Copy the ACS URL and Entity ID from below and paste them into your Okta app settings.',
    status: 'complete',
  },
  {
    id: 'download-metadata',
    title: 'Advanced/Enterprise/SSOConfigWizard',
    description:
      'Download the IdP metadata XML file from Okta and upload it in the next step.',
    status: 'in-progress',
  },
  {
    id: 'upload-metadata',
    title: 'Advanced/Enterprise/SSOConfigWizard',
    description:
      'Upload the Okta metadata XML file to complete the integration.',
    status: 'pending',
  },
  {
    id: 'test-connection',
    title: 'Advanced/Enterprise/SSOConfigWizard',
    description:
      'Test the SSO connection to ensure everything is configured correctly.',
    status: 'pending',
  },
]

const azureSteps: SSOConfigStep[] = [
  {
    id: 'create-enterprise-app',
    title: 'Advanced/Enterprise/SSOConfigWizard',
    description:
      'In Azure AD, navigate to Enterprise applications and create a new SAML application.',
    status: 'complete',
  },
  {
    id: 'basic-saml',
    title: 'Advanced/Enterprise/SSOConfigWizard',
    description:
      'Enter the Identifier (Entity ID) and Reply URL (ACS URL) from the metadata below.',
    status: 'in-progress',
  },
  {
    id: 'attributes-claims',
    title: 'Advanced/Enterprise/SSOConfigWizard',
    description:
      'Configure email, first name, and last name attributes to be sent in SAML assertions.',
    status: 'pending',
  },
  {
    id: 'certificate',
    title: 'Advanced/Enterprise/SSOConfigWizard',
    description:
      'Download the Base64 certificate from Azure AD for verification.',
    status: 'pending',
  },
  {
    id: 'assign-users',
    title: 'Advanced/Enterprise/SSOConfigWizard',
    description: 'Assign users or groups who can access the application.',
    status: 'pending',
  },
]

const auth0Steps: SSOConfigStep[] = [
  {
    id: 'create-connection',
    title: 'Advanced/Enterprise/SSOConfigWizard',
    description:
      'In Auth0, go to Authentication > Enterprise and create a new SAML connection.',
    status: 'complete',
  },
  {
    id: 'upload-metadata',
    title: 'Advanced/Enterprise/SSOConfigWizard',
    description: 'Download and upload the XML metadata file to Auth0.',
    status: 'in-progress',
  },
  {
    id: 'mappings',
    title: 'Advanced/Enterprise/SSOConfigWizard',
    description: 'Map SAML attributes to Auth0 user profile fields.',
    status: 'pending',
  },
  {
    id: 'enable-connection',
    title: 'Advanced/Enterprise/SSOConfigWizard',
    description: 'Enable the SAML connection for your application.',
    status: 'pending',
  },
]

const mockMetadata = {
  acsUrl: 'https://app.clarity-chat.ai/auth/saml/acs',
  entityId: 'https://app.clarity-chat.ai/auth/saml/metadata',
}

// ============================================================================
// Basic Examples
// ============================================================================

export const Default: Story = {
  args: {
    providerName: 'SAML 2.0',
    steps: oktaSteps,
    metadata: mockMetadata,
    notes: '',
    onNotesChange: (value) => console.log('Notes:', value),
    onDownloadMetadata: () => console.log('Downloading metadata...'),
    onSubmit: () => console.log('Configuration submitted'),
  },
}

export const OktaConfiguration: Story = {
  args: {
    providerName: 'Okta',
    steps: oktaSteps,
    metadata: mockMetadata,
  },
  parameters: {
    docs: {
      description: {
        story: 'SSO configuration wizard for Okta integration.',
      },
    },
  },
}

export const AzureADConfiguration: Story = {
  args: {
    providerName: 'Azure AD',
    steps: azureSteps,
    metadata: mockMetadata,
  },
  parameters: {
    docs: {
      description: {
        story: 'SSO configuration wizard for Azure AD integration.',
      },
    },
  },
}

export const Auth0Configuration: Story = {
  args: {
    providerName: 'Auth0',
    steps: auth0Steps,
    metadata: mockMetadata,
  },
  parameters: {
    docs: {
      description: {
        story: 'SSO configuration wizard for Auth0 integration.',
      },
    },
  },
}

// ============================================================================
// Status Variants
// ============================================================================

export const AllPending: Story = {
  args: {
    providerName: 'SAML 2.0',
    steps: oktaSteps.map((step) => ({ ...step, status: 'pending' as const })),
    metadata: mockMetadata,
  },
  parameters: {
    docs: {
      description: {
        story: 'Configuration wizard at the start - all steps pending.',
      },
    },
  },
}

export const InProgress: Story = {
  args: {
    providerName: 'SAML 2.0',
    steps: oktaSteps.map((step, index) => ({
      ...step,
      status: (index === 2
        ? 'in-progress'
        : index < 2
          ? 'complete'
          : 'pending') as const,
    })),
    metadata: mockMetadata,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Configuration in progress - some steps complete, current step active.',
      },
    },
  },
}

export const AllComplete: Story = {
  args: {
    providerName: 'SAML 2.0',
    steps: oktaSteps.map((step) => ({ ...step, status: 'complete' as const })),
    metadata: mockMetadata,
  },
  parameters: {
    docs: {
      description: {
        story: 'Configuration complete - all steps finished.',
      },
    },
  },
}

// ============================================================================
// Interactive Demo
// ============================================================================

export const InteractiveSetup: Story = {
  render: () => {
    const [steps, setSteps] = React.useState<SSOConfigStep[]>(oktaSteps)
    const [notes, setNotes] = React.useState('')
    const [provider, setProvider] = React.useState<
      'Okta' | 'Azure AD' | 'Auth0'
    >('Okta')

    const providerSteps = {
      Okta: oktaSteps,
      'Azure AD': azureSteps,
      Auth0: auth0Steps,
    }

    const toggleStepStatus = (stepId: string) => {
      setSteps((current) =>
        current.map((step) => {
          if (step.id === stepId) {
            const statusCycle: Array<SSOConfigStep['status']> = [
              'pending',
              'in-progress',
              'complete',
            ]
            const currentIndex = statusCycle.indexOf(step.status || 'pending')
            const nextStatus =
              statusCycle[(currentIndex + 1) % statusCycle.length]
            return { ...step, status: nextStatus }
          }
          return step
        })
      )
    }

    const handleProviderChange = (
      newProvider: 'Okta' | 'Azure AD' | 'Auth0'
    ) => {
      setProvider(newProvider)
      setSteps(providerSteps[newProvider])
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
          <span className="text-sm font-medium">Select Provider:</span>
          <div className="flex gap-2">
            {(['Okta', 'Azure AD', 'Auth0'] as const).map((p) => (
              <button
                key={p}
                onClick={() => handleProviderChange(p)}
                className={`px-3 py-1.5 text-sm rounded ${
                  provider === p
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background hover:bg-accent'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
          <p className="text-sm">
            <strong>Interactive Demo:</strong> Click on any step title below to
            cycle through statuses (pending → in-progress → complete)
          </p>
        </div>

        <div
          onClick={(e) => {
            const target = e.target as HTMLElement
            const stepElement = target.closest('[data-step-id]')
            if (stepElement) {
              const stepId = stepElement.getAttribute('data-step-id')
              if (stepId) toggleStepStatus(stepId)
            }
          }}
        >
          <SSOConfigWizard
            providerName={provider}
            steps={steps.map(
              (step) => ({ ...step, 'data-step-id': step.id }) as any
            )}
            metadata={mockMetadata}
            notes={notes}
            onNotesChange={setNotes}
            onDownloadMetadata={() => alert('Downloading metadata XML...')}
            onSubmit={() => alert('Configuration saved!')}
          />
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo with provider switching and status toggling.',
      },
    },
  },
}

// ============================================================================
// Complete Integration Flow
// ============================================================================

export const CompleteIntegrationFlow: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = React.useState(0)
    const [notes, setNotes] = React.useState('')
    const [isComplete, setIsComplete] = React.useState(false)

    const steps: SSOConfigStep[] = oktaSteps.map((step, index) => ({
      ...step,
      status:
        index < currentStep
          ? 'complete'
          : index === currentStep
            ? 'in-progress'
            : ('pending' as const),
    }))

    const handleNext = () => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        setIsComplete(true)
      }
    }

    const handlePrevious = () => {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1)
      }
    }

    if (isComplete) {
      return (
        <div className="text-center p-12 border rounded-lg">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-2">
            SSO Configuration Complete!
          </h2>
          <p className="text-muted-foreground mb-6">
            Your Okta integration is now active and ready to use.
          </p>
          <button
            onClick={() => {
              setCurrentStep(0)
              setIsComplete(false)
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Configure Another Provider
          </button>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div>
            <h3 className="font-semibold">
              Step {currentStep + 1} of {steps.length}
            </h3>
            <p className="text-sm text-muted-foreground">
              {steps[currentStep].title}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="px-3 py-1.5 text-sm border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
            </button>
          </div>
        </div>

        <SSOConfigWizard
          providerName="Okta"
          steps={steps}
          metadata={mockMetadata}
          notes={notes}
          onNotesChange={setNotes}
          onDownloadMetadata={() => alert('Downloading metadata...')}
        />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Complete integration flow with step navigation and completion state.',
      },
    },
  },
}

// ============================================================================
// Multi-Provider Setup
// ============================================================================

export const MultiProviderDashboard: Story = {
  render: () => {
    const providers = [
      { name: 'Okta', status: 'complete', steps: oktaSteps, users: 45 },
      { name: 'Azure AD', status: 'in-progress', steps: azureSteps, users: 23 },
      { name: 'Auth0', status: 'pending', steps: auth0Steps, users: 0 },
    ]

    const [selectedProvider, setSelectedProvider] = React.useState<
      string | null
    >(null)

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">SSO Providers</h2>
          <p className="text-muted-foreground mt-1">
            Manage multiple identity provider integrations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {providers.map((provider) => (
            <div
              key={provider.name}
              className="border rounded-lg p-4 cursor-pointer hover:border-primary"
              onClick={() => setSelectedProvider(provider.name)}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{provider.name}</h3>
                <span
                  className={`px-2 py-0.5 text-xs rounded-full ${
                    provider.status === 'complete'
                      ? 'bg-green-100 text-green-800'
                      : provider.status === 'in-progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {provider.status}
                </span>
              </div>
              <div className="text-2xl font-bold">{provider.users}</div>
              <div className="text-sm text-muted-foreground">Active users</div>
            </div>
          ))}
        </div>

        {selectedProvider && (
          <div className="border-t pt-6">
            <button
              onClick={() => setSelectedProvider(null)}
              className="text-sm text-muted-foreground mb-4 hover:text-foreground"
            >
              ← Back to providers
            </button>
            <SSOConfigWizard
              providerName={selectedProvider}
              steps={providers.find((p) => p.name === selectedProvider)!.steps}
              metadata={mockMetadata}
              onDownloadMetadata={() =>
                alert(`Downloading ${selectedProvider} metadata...`)
              }
            />
          </div>
        )}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Dashboard for managing multiple SSO providers.',
      },
    },
  },
}
