import type { Meta, StoryObj } from '@storybook/react'
import {
  SupportBot,
  CodeAssistant,
  CustomerSupportTemplate,
  AIAssistantTemplate,
  CreativeWritingTemplate,
  DataAnalystTemplate,
  DocumentationBotTemplate,
  SalesAssistantTemplate,
  EducationTutorTemplate,
  CodeHelperTemplate,
} from '@clarity-chat/react'

const meta: Meta = {
  title: 'Examples/Templates',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Pre-built chat templates optimized for specific use cases.',
      },
    },
    layout: 'fullscreen',
  },
}

export default meta

export const SupportBotDefault: StoryObj<typeof SupportBot> = {
  render: () => (
    <div className="h-screen">
      <SupportBot
        onEscalate={() => {
          alert('Connecting to human agent...')
        }}
      />
    </div>
  ),
}

export const SupportBotCustomized: StoryObj<typeof SupportBot> = {
  render: () => (
    <div className="h-screen">
      <SupportBot
        botName="ShopBot"
        welcomeMessage="👋 Hi! I'm ShopBot. How can I help you with your order today?"
        quickReplies={[
          { text: '📦 Track my order', action: 'track_order' },
          { text: '💰 Refund request', action: 'refund' },
          { text: '📧 Contact email', action: 'contact' },
          { text: '❓ FAQs', action: 'faqs' },
          { text: '👤 Speak to agent', action: 'escalate' },
        ]}
        escalationThreshold={3}
        onEscalate={() => {
          console.log('Escalating to human agent')
          alert('A support specialist will be with you shortly...')
        }}
      />
    </div>
  ),
}

export const SupportBotWithKnowledgeBase: StoryObj<typeof SupportBot> = {
  render: () => (
    <div className="h-screen">
      <SupportBot
        botName="HelpDesk AI"
        welcomeMessage="Hello! I'm here to help with your account questions."
        knowledgeBase={[
          {
            question: 'How do I reset my password?',
            answer: 'To reset your password:\n1. Click "Forgot Password" on the login page\n2. Enter your email address\n3. Check your email for the reset link\n4. Create a new secure password',
            keywords: ['password', 'reset', 'login', 'forgot', 'cant access'],
          },
          {
            question: 'How do I update my billing information?',
            answer: 'You can update your billing information by:\n1. Going to Settings > Billing\n2. Click "Update Payment Method"\n3. Enter your new card details\n4. Click "Save Changes"',
            keywords: ['billing', 'payment', 'credit card', 'update', 'change'],
          },
          {
            question: 'How do I cancel my subscription?',
            answer: 'To cancel your subscription:\n1. Go to Settings > Subscription\n2. Click "Cancel Subscription"\n3. Select a cancellation reason (optional)\n4. Confirm cancellation\n\nYou\'ll retain access until the end of your billing period.',
            keywords: ['cancel', 'subscription', 'unsubscribe', 'stop billing'],
          },
        ]}
        escalationThreshold={5}
      />
    </div>
  ),
}

export const CodeAssistantDefault: StoryObj<typeof CodeAssistant> = {
  render: () => (
    <div className="h-screen">
      <CodeAssistant />
    </div>
  ),
}

export const CodeAssistantWithContext: StoryObj<typeof CodeAssistant> = {
  render: () => (
    <div className="h-screen">
      <CodeAssistant
        assistantName="CodeHelper"
        codeContext={`function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0)
}`}
        supportedLanguages={['javascript', 'typescript', 'python', 'rust']}
      />
    </div>
  ),
}

export const CodeAssistantWithExecution: StoryObj<typeof CodeAssistant> = {
  render: () => (
    <div className="h-screen">
      <CodeAssistant
        assistantName="JavaScript Runner"
        enableExecution={true}
        onExecuteCode={async (code, language) => {
          try {
            // Simple JavaScript evaluation (in production, use a sandbox!)
            if (language === 'javascript' || language === 'typescript') {
              const result = eval(code)
              return `Output: ${result}`
            }
            return 'Execution only supported for JavaScript'
          } catch (error) {
            return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
          }
        }}
        onCopyCode={(code) => {
          navigator.clipboard.writeText(code)
          alert('Code copied to clipboard!')
        }}
      />
    </div>
  ),
}

export const CodeAssistantPython: StoryObj<typeof CodeAssistant> = {
  render: () => (
    <div className="h-screen">
      <CodeAssistant
        assistantName="Python Assistant"
        supportedLanguages={['python', 'numpy', 'pandas']}
        codeContext={`def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))`}
        enableSuggestions={true}
      />
    </div>
  ),
}

export const CodeAssistantTypeScript: StoryObj<typeof CodeAssistant> = {
  render: () => (
    <div className="h-screen">
      <CodeAssistant
        assistantName="TypeScript Guru"
        supportedLanguages={['typescript', 'javascript', 'react']}
        codeContext={`interface User {
  id: number;
  name: string;
  email: string;
}

function getUserById(users: User[], id: number): User | undefined {
  return users.find(user => user.id === id)
}`}
      />
    </div>
  ),
}

export const CustomerSupportTemplateDefault: StoryObj<typeof CustomerSupportTemplate> = {
  render: () => (
    <div className="h-screen">
      <CustomerSupportTemplate
        companyName="Clarity Chat"
        supportCategories={['Onboarding', 'Billing', 'Security']}
        faqs={[
          {
            question: 'How do I add the chat widget to my product?',
            answer: 'Install the @clarity-chat/react package and drop the <ChatWindow /> component into your page.',
          },
          {
            question: 'Do you support SOC 2 compliance?',
            answer: 'Yes, our enterprise plan includes SOC 2 Type II controls and audit documentation.',
          },
        ]}
      />
    </div>
  ),
}

export const AIAssistantTemplateShowcase: StoryObj<typeof AIAssistantTemplate> = {
  render: () => (
    <div className="h-screen">
      <AIAssistantTemplate
        enableContextManagement
        systemPrompt="You are Clarity, an expert product strategist."
        defaultModel="gpt-4-turbo-preview"
      />
    </div>
  ),
}

export const CreativeWritingTemplateStory: StoryObj<typeof CreativeWritingTemplate> = {
  render: () => (
    <div className="h-screen">
      <CreativeWritingTemplate
        systemPrompt="You write vibrant launch copy with strong narrative arcs."
      />
    </div>
  ),
}

export const DataAnalystTemplateStory: StoryObj<typeof DataAnalystTemplate> = {
  render: () => (
    <div className="h-screen">
      <DataAnalystTemplate
        systemPrompt="You are a data analyst focused on SaaS revenue metrics."
        enableContextManagement={false}
      />
    </div>
  ),
}

export const SalesAssistantTemplateStory: StoryObj<typeof SalesAssistantTemplate> = {
  render: () => (
    <div className="h-screen">
      <SalesAssistantTemplate
        defaultPersona="account-executive"
        playbooks={[
          {
            id: 'meddpicc',
            name: 'MEDDPICC Discovery',
            steps: ['Metrics', 'Economic Buyer', 'Decision Criteria'],
          },
        ]}
      />
    </div>
  ),
}

export const EducationTutorTemplateStory: StoryObj<typeof EducationTutorTemplate> = {
  render: () => (
    <div className="h-screen">
      <EducationTutorTemplate
        systemPrompt="You are a patient calculus tutor helping students understand derivatives."
      />
    </div>
  ),
}

export const CodeHelperTemplateStory: StoryObj<typeof CodeHelperTemplate> = {
  render: () => (
    <div className="h-screen">
      <CodeHelperTemplate languages={['typescript', 'python', 'go']} />
    </div>
  ),
}

export const DocumentationBotTemplateStory: StoryObj<typeof DocumentationBotTemplate> = {
  render: () => (
    <div className="h-screen">
      <DocumentationBotTemplate
        companyName="Docs.ai"
        supportCategories={['API Reference', 'Auth', 'Billing']}
      />
    </div>
  ),
}

export const ComparisonView: StoryObj = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 h-screen p-4">
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div className="bg-blue-600 text-white p-3 font-semibold">
          Support Bot Template
        </div>
        <div className="h-[calc(100%-48px)]">
          <SupportBot
            botName="Support Assistant"
            onEscalate={() => alert('Escalating...')}
          />
        </div>
      </div>
      
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div className="bg-purple-600 text-white p-3 font-semibold">
          Code Assistant Template
        </div>
        <div className="h-[calc(100%-48px)]">
          <CodeAssistant
            assistantName="Code Helper"
            codeContext="// Your code here"
          />
        </div>
      </div>
    </div>
  ),
}
