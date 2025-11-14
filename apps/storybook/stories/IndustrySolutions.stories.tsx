import type { Meta, StoryObj } from '@storybook/react'
import { ChatWindow, ToolInvocationCard, SafetyStatusCard } from '@clarity-chat/react'
import type { Message, ToolInvocation } from '@clarity-chat/types'
import { useState } from 'react'

const meta: Meta = {
  title: 'Demos/Industry Solutions',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Industry-specific AI chat solutions demonstrating real-world use cases.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta

/**
 * Healthcare Assistant Demo
 * 
 * HIPAA-compliant medical chatbot with:
 * - Patient records integration
 * - Medical terminology understanding
 * - Appointment scheduling
 * - Lab results interpretation
 * - Medication reminders
 */
export const HealthcareAssistant: StoryObj = {
  render: () => {
    const [messages, setMessages] = useState<Message[]>([
      {
        id: '1',
        role: 'assistant',
        content: '👋 Hello! I\'m your healthcare assistant. How can I help you today?',
        createdAt: new Date(Date.now() - 5000),
        senderName: 'HealthBot',
      },
      {
        id: '2',
        role: 'user',
        content: 'Can you help me understand my recent lab results?',
        createdAt: new Date(Date.now() - 3000),
        senderName: 'Patient',
      },
      {
        id: '3',
        role: 'assistant',
        content: `I'd be happy to help explain your lab results. Let me check your recent tests...

**Recent Lab Results (Nov 1, 2024)**

✅ **Cholesterol Panel**
- Total: 185 mg/dL (Normal: <200)
- LDL: 110 mg/dL (Optimal: <100)
- HDL: 55 mg/dL (Good: >40)
- Triglycerides: 120 mg/dL (Normal: <150)

Your cholesterol levels look good overall! Your HDL (good cholesterol) is in a healthy range.

⚠️ **Blood Glucose**
- Fasting: 108 mg/dL (Pre-diabetic: 100-125)

Your blood glucose is slightly elevated. I recommend:
1. Discuss with your doctor about monitoring
2. Consider dietary changes (reduce sugar, increase fiber)
3. Regular exercise (30 min/day)

**Note**: This is informational only. Please consult your physician for medical advice.`,
        createdAt: new Date(Date.now() - 1000),
        senderName: 'HealthBot',
        metadata: {
          model: 'gpt-4-healthcare',
          safetyChecked: true,
        },
      },
    ])

    const handleSend = (content: string) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content,
        createdAt: new Date(),
        senderName: 'Patient',
      }
      setMessages((prev) => [...prev, userMessage])

      // Simulate AI response
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'I understand your concern. Let me help you with that...',
          createdAt: new Date(),
          senderName: 'HealthBot',
        }
        setMessages((prev) => [...prev, aiMessage])
      }, 1000)
    }

    return (
      <div className="h-screen flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6">
          <h1 className="text-2xl font-bold">🏥 Healthcare Assistant</h1>
          <p className="text-blue-100 mt-1">HIPAA-compliant AI medical assistant</p>
        </div>
        <div className="flex-1 p-6">
          <ChatWindow
            messages={messages}
            onSendMessage={handleSend}
            showHeader={false}
            emptyState={
              <div className="text-center p-8">
                <span className="text-6xl mb-4 block">🏥</span>
                <h3 className="text-xl font-semibold mb-2">Healthcare Assistant Ready</h3>
                <p className="text-muted-foreground">
                  Ask about symptoms, medications, lab results, or appointments
                </p>
              </div>
            }
          />
        </div>
        <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border-t border-yellow-200 dark:border-yellow-800 text-sm text-yellow-800 dark:text-yellow-200">
          ⚠️ <strong>Demo Only</strong> - This is for demonstration purposes. Not a substitute for professional medical advice.
        </div>
      </div>
    )
  },
}

/**
 * Financial Advisor Demo
 * 
 * AI-powered financial assistant with:
 * - Budget planning
 * - Expense tracking
 * - Investment insights
 * - Savings goals
 */
export const FinancialAdvisor: StoryObj = {
  render: () => {
    const [messages, setMessages] = useState<Message[]>([
      {
        id: '1',
        role: 'assistant',
        content: '💰 Welcome to your Financial Advisor! I can help with budgeting, expense tracking, and financial planning.',
        createdAt: new Date(Date.now() - 5000),
        senderName: 'FinBot',
      },
      {
        id: '2',
        role: 'user',
        content: 'Help me create a budget for $5000 monthly income',
        createdAt: new Date(Date.now() - 3000),
        senderName: 'You',
      },
      {
        id: '3',
        role: 'assistant',
        content: `Great! Let's create a budget using the 50/30/20 rule:

📊 **Your Monthly Budget ($5,000)**

**50% Needs ($2,500)**
- Rent/Mortgage: $1,500
- Utilities: $200
- Groceries: $400
- Insurance: $250
- Transportation: $150

**30% Wants ($1,500)**
- Dining out: $400
- Entertainment: $300
- Shopping: $400
- Subscriptions: $200
- Hobbies: $200

**20% Savings ($1,000)**
- Emergency fund: $500
- Retirement (401k): $300
- Investments: $200

💡 **Recommendations:**
1. Build 3-6 months emergency fund first
2. Max out employer 401k match
3. Consider opening a Roth IRA
4. Track spending weekly

Would you like me to analyze your current spending or adjust any categories?`,
        createdAt: new Date(Date.now() - 1000),
        senderName: 'FinBot',
        metadata: {
          model: 'gpt-4-financial',
        },
      },
    ])

    const handleSend = (content: string) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content,
        createdAt: new Date(),
        senderName: 'You',
      }
      setMessages((prev) => [...prev, userMessage])

      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Let me help you with that financial question...',
          createdAt: new Date(),
          senderName: 'FinBot',
        }
        setMessages((prev) => [...prev, aiMessage])
      }, 1000)
    }

    return (
      <div className="h-screen flex flex-col">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
          <h1 className="text-2xl font-bold">💰 Financial Advisor</h1>
          <p className="text-green-100 mt-1">Smart budgeting and financial planning</p>
        </div>
        <div className="flex-1 p-6">
          <ChatWindow
            messages={messages}
            onSendMessage={handleSend}
            showHeader={false}
          />
        </div>
        <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border-t border-yellow-200 dark:border-yellow-800 text-sm text-yellow-800 dark:text-yellow-200">
          ⚠️ <strong>Educational Only</strong> - Not financial advice. Consult licensed financial advisors.
        </div>
      </div>
    )
  },
}

/**
 * Ecommerce Assistant Demo
 * 
 * Product recommendations and shopping assistance with:
 * - Product search
 * - Personalized recommendations
 * - Cart management
 * - Order tracking
 */
export const EcommerceAssistant: StoryObj = {
  render: () => {
    const [messages, setMessages] = useState<Message[]>([
      {
        id: '1',
        role: 'assistant',
        content: '🛍️ Hi! I\'m your shopping assistant. I can help you find products, answer questions, and manage your cart.',
        createdAt: new Date(Date.now() - 5000),
        senderName: 'ShopBot',
      },
      {
        id: '2',
        role: 'user',
        content: 'I need a laptop for programming',
        createdAt: new Date(Date.now() - 3000),
        senderName: 'You',
      },
      {
        id: '3',
        role: 'assistant',
        content: `Perfect! I found some great laptops for programming:

**💻 Top Recommendations**

1. **MacBook Pro 14" M3** - $1,999
   - Apple M3 Pro chip (perfect for development)
   - 18GB unified memory
   - 512GB SSD
   - Excellent battery life (17 hours)
   ⭐ 4.8/5 (2,340 reviews)

2. **Dell XPS 15** - $1,699
   - Intel Core i7-13700H
   - 32GB RAM
   - 1TB SSD
   - 15.6" 4K OLED display
   ⭐ 4.6/5 (1,890 reviews)

3. **ThinkPad X1 Carbon** - $1,499
   - Intel Core i7
   - 16GB RAM
   - 512GB SSD
   - Ultra-portable (2.5 lbs)
   ⭐ 4.7/5 (1,560 reviews)

💡 **My Recommendation**: 
For programming, I'd suggest the MacBook Pro M3 for its excellent performance, battery life, and native support for development tools.

Would you like to:
- See detailed specs?
- Compare these models?
- Add one to your cart?
- See customer reviews?`,
        createdAt: new Date(Date.now() - 1000),
        senderName: 'ShopBot',
      },
    ])

    const handleSend = (content: string) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content,
        createdAt: new Date(),
        senderName: 'You',
      }
      setMessages((prev) => [...prev, userMessage])

      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Let me help you with that...',
          createdAt: new Date(),
          senderName: 'ShopBot',
        }
        setMessages((prev) => [...prev, aiMessage])
      }, 1000)
    }

    return (
      <div className="h-screen flex flex-col">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <h1 className="text-2xl font-bold">🛍️ Ecommerce Assistant</h1>
          <p className="text-purple-100 mt-1">Smart product recommendations & shopping help</p>
        </div>
        <div className="flex-1 p-6">
          <ChatWindow
            messages={messages}
            onSendMessage={handleSend}
            showHeader={false}
          />
        </div>
      </div>
    )
  },
}

/**
 * Education Tutor Demo
 * 
 * Interactive learning assistant with:
 * - Quiz generation
 * - Progress tracking
 * - Personalized lessons
 * - Homework help
 */
export const EducationTutor: StoryObj = {
  render: () => {
    const [messages, setMessages] = useState<Message[]>([
      {
        id: '1',
        role: 'assistant',
        content: '📚 Hi! I\'m your AI tutor. What would you like to learn today?',
        createdAt: new Date(Date.now() - 5000),
        senderName: 'TutorBot',
      },
      {
        id: '2',
        role: 'user',
        content: 'Teach me about photosynthesis',
        createdAt: new Date(Date.now() - 3000),
        senderName: 'Student',
      },
      {
        id: '3',
        role: 'assistant',
        content: `Great topic! Let's learn about photosynthesis! 🌱

## What is Photosynthesis?

Photosynthesis is the process plants use to convert **sunlight** into **energy** (food). 

### The Formula
\`\`\`
6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂
(Carbon dioxide + Water + Light → Glucose + Oxygen)
\`\`\`

### Key Steps

1. **Light-Dependent Reactions** (Thylakoid)
   - Chlorophyll absorbs sunlight
   - Water splits into H⁺ and O₂
   - ATP and NADPH are produced

2. **Light-Independent Reactions** (Stroma/Calvin Cycle)
   - CO₂ is captured
   - Uses ATP and NADPH
   - Produces glucose (sugar)

### Why It Matters
🌍 Photosynthesis:
- Produces oxygen we breathe
- Creates food for almost all life
- Removes CO₂ from atmosphere

---

### 📝 Quick Quiz

1. What are the two main products of photosynthesis?
2. Where in the plant does photosynthesis occur?
3. What pigment absorbs light energy?

Try answering these to test your understanding!`,
        createdAt: new Date(Date.now() - 1000),
        senderName: 'TutorBot',
      },
    ])

    const handleSend = (content: string) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content,
        createdAt: new Date(),
        senderName: 'Student',
      }
      setMessages((prev) => [...prev, userMessage])

      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Great answer! Let me explain...',
          createdAt: new Date(),
          senderName: 'TutorBot',
        }
        setMessages((prev) => [...prev, aiMessage])
      }, 1000)
    }

    return (
      <div className="h-screen flex flex-col">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6">
          <h1 className="text-2xl font-bold">📚 Education Tutor</h1>
          <p className="text-indigo-100 mt-1">Interactive AI learning assistant</p>
        </div>
        <div className="flex-1 p-6">
          <ChatWindow
            messages={messages}
            onSendMessage={handleSend}
            showHeader={false}
          />
        </div>
      </div>
    )
  },
}

/**
 * AI Agents Workflow Demo
 * 
 * Multi-agent orchestration with:
 * - Custom agent tools
 * - Agent coordination
 * - Task decomposition
 * - Tool invocations
 */
export const AIAgentsWorkflow: StoryObj = {
  render: () => {
    const [messages, setMessages] = useState<Message[]>([
      {
        id: '1',
        role: 'assistant',
        content: '🤖 AI Agent System initialized. I can coordinate multiple specialized agents to solve complex tasks.',
        createdAt: new Date(Date.now() - 5000),
        senderName: 'AgentOrchestrator',
      },
      {
        id: '2',
        role: 'user',
        content: 'Analyze our sales data and create a marketing strategy',
        createdAt: new Date(Date.now() - 3000),
        senderName: 'You',
      },
      {
        id: '3',
        role: 'assistant',
        content: `I'll coordinate multiple agents to complete this task:

**🔄 Agent Workflow Initiated**

**Step 1**: Data Analyst Agent
🔍 Analyzing sales data...
- Revenue trends: ↑ 15% YoY
- Top products: Laptops (32%), Phones (28%)
- Peak months: Nov-Dec (holiday season)

**Step 2**: Market Research Agent  
📊 Market analysis...
- Competitor pricing studied
- Customer sentiment: Positive (4.2/5)
- Growth opportunities: B2B segment

**Step 3**: Strategy Agent
🎯 Generating marketing strategy...

## Recommended Marketing Strategy

### 1. Email Campaigns
- Target segment: B2B customers
- Focus: Laptop bundles for teams
- Expected ROI: 250%

### 2. Social Media
- Platform: LinkedIn, Twitter
- Content: Product demos, customer success
- Budget: $5k/month

### 3. Holiday Promotion
- Timing: Nov 15 - Dec 31
- Offer: 20% off laptops
- Projected impact: +30% revenue

**Next Steps**: Would you like me to create detailed campaign plans?`,
        createdAt: new Date(Date.now() - 1000),
        senderName: 'AgentOrchestrator',
        metadata: {
          model: 'gpt-4-agents',
          agentChain: ['data-analyst', 'market-research', 'strategist'],
        },
      },
    ])

    const toolInvocations: ToolInvocation[] = [
      {
        id: 'tool-1',
        toolName: 'analyze_sales_data',
        parameters: { period: 'last_12_months' },
        status: 'completed',
        result: { trend: 'up', growth: '15%' },
        timestamp: new Date(Date.now() - 2000),
      },
      {
        id: 'tool-2',
        toolName: 'market_research',
        parameters: { competitors: 5, depth: 'detailed' },
        status: 'completed',
        result: { sentiment: 4.2, opportunities: ['B2B'] },
        timestamp: new Date(Date.now() - 1500),
      },
    ]

    const handleSend = (content: string) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content,
        createdAt: new Date(),
        senderName: 'You',
      }
      setMessages((prev) => [...prev, userMessage])

      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Coordinating agents to analyze your request...',
          createdAt: new Date(),
          senderName: 'AgentOrchestrator',
        }
        setMessages((prev) => [...prev, aiMessage])
      }, 1000)
    }

    return (
      <div className="h-screen flex flex-col">
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white p-6">
          <h1 className="text-2xl font-bold">🤖 AI Agents Workflow</h1>
          <p className="text-violet-100 mt-1">Multi-agent orchestration system</p>
        </div>
        <div className="flex-1 grid grid-cols-3 gap-6 p-6">
          <div className="col-span-2">
            <ChatWindow
              messages={messages}
              onSendMessage={handleSend}
              showHeader={false}
            />
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">🛠️ Tool Invocations</h3>
            {toolInvocations.map((tool) => (
              <ToolInvocationCard key={tool.id} invocation={tool} />
            ))}
          </div>
        </div>
      </div>
    )
  },
}

/**
 * Code Assistant Demo
 * 
 * AI-powered coding help with:
 * - Code explanation
 * - Bug fixing
 * - Code generation
 * - Best practices
 */
export const CodeAssistant: StoryObj = {
  render: () => {
    const [messages, setMessages] = useState<Message[]>([
      {
        id: '1',
        role: 'assistant',
        content: '👨‍💻 Hello! I\'m your code assistant. I can help with code review, debugging, and implementation.',
        createdAt: new Date(Date.now() - 5000),
        senderName: 'CodeBot',
      },
      {
        id: '2',
        role: 'user',
        content: 'How do I implement debouncing in React?',
        createdAt: new Date(Date.now() - 3000),
        senderName: 'Developer',
      },
      {
        id: '3',
        role: 'assistant',
        content: `Great question! Here's how to implement debouncing in React:

## Custom Debounce Hook

\`\`\`typescript
import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Set timeout to update debounced value
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup: cancel timeout if value changes
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
\`\`\`

## Usage Example

\`\`\`typescript
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 300)

  useEffect(() => {
    // This only runs 300ms after user stops typing
    if (debouncedSearch) {
      fetchSearchResults(debouncedSearch)
    }
  }, [debouncedSearch])

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  )
}
\`\`\`

**Why This Works:**
- ✅ Reduces API calls
- ✅ Improves performance
- ✅ Better UX (waits for user to finish typing)
- ✅ Cleanup prevents memory leaks

Need help with anything else?`,
        createdAt: new Date(Date.now() - 1000),
        senderName: 'CodeBot',
      },
    ])

    const handleSend = (content: string) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content,
        createdAt: new Date(),
        senderName: 'Developer',
      }
      setMessages((prev) => [...prev, userMessage])

      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Let me help you with that code...',
          createdAt: new Date(),
          senderName: 'CodeBot',
        }
        setMessages((prev) => [...prev, aiMessage])
      }, 1000)
    }

    return (
      <div className="h-screen flex flex-col">
        <div className="bg-gradient-to-r from-slate-800 to-gray-900 text-white p-6">
          <h1 className="text-2xl font-bold">👨‍💻 Code Assistant</h1>
          <p className="text-slate-300 mt-1">AI-powered coding help</p>
        </div>
        <div className="flex-1 p-6">
          <ChatWindow
            messages={messages}
            onSendMessage={handleSend}
            showHeader={false}
          />
        </div>
      </div>
    )
  },
}

