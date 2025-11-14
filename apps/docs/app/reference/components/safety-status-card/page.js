import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ApiTable } from '@/components/Demo/ApiTable';
import { LiveDemo } from '@/components/Demo/LiveDemo';
import { Callout } from '@/components/MDX/Callout';
export const metadata = {
    title: 'Safety Status Card - Clarity Chat Components',
    description: 'Display AI safety check results - content moderation, policy compliance, and safety guardrails.',
};
export default function SafetyStatusCardPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Component" }), _jsx("h1", { children: "Safety Status Card" }), _jsx("p", { className: "docs-lead", children: "Show safety check results for AI responses. Like a security checkpoint - did the AI say anything unsafe, inappropriate, or against your policies?" })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Overview" }), _jsx("p", { children: "Before showing AI responses to users, you might run safety checks (using OpenAI Moderation API, custom filters, etc.). This component displays those check results in a clear, actionable way." }), _jsx(Callout, { type: "info", title: "Why Safety Checks Matter", children: "AI can sometimes generate inappropriate content. Safety checks catch issues before users see them - protecting your users and your brand." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Basic Usage" }), _jsx(LiveDemo, { title: "Safety Checks", code: `import { SafetyStatusCard } from '@clarity-chat/react'

function BasicSafety() {
  const checks = [
    {
      id: '1',
      label: 'Content Moderation',
      status: 'pass',
      detail: 'No harmful content detected'
    },
    {
      id: '2',
      label: 'PII Detection',
      status: 'pass',
      detail: 'No personal information found'
    },
    {
      id: '3',
      label: 'Policy Compliance',
      status: 'pass',
      detail: 'Meets company guidelines'
    }
  ]

  return (
    <SafetyStatusCard
      checks={checks}
      lastReviewedAt={new Date()}
    />
  )
}

export default BasicSafety`, height: "350px" })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "With Warnings and Failures" }), _jsx(LiveDemo, { title: "Safety Issues Detected", code: `import { SafetyStatusCard } from '@clarity-chat/react'

function SafetyIssues() {
  const checks = [
    {
      id: '1',
      label: 'Hate Speech',
      status: 'pass',
      detail: 'Content is respectful'
    },
    {
      id: '2',
      label: 'Profanity Filter',
      status: 'warn',
      detail: 'Mild language detected',
      remediation: 'Consider rephrasing to be more professional'
    },
    {
      id: '3',
      label: 'Competitive Mentions',
      status: 'fail',
      detail: 'Mentioned competitor products',
      remediation: 'Block response - violates company policy'
    },
    {
      id: '4',
      label: 'Medical Advice',
      status: 'warn',
      detail: 'Contains health-related content',
      remediation: 'Add disclaimer: "Not medical advice"'
    }
  ]

  return (
    <SafetyStatusCard
      checks={checks}
      lastReviewedAt={new Date()}
      onAcknowledge={(check) => {
        console.log('Acknowledged:', check.label)
      }}
    />
  )
}

export default SafetyIssues`, height: "500px" })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Props" }), _jsx(ApiTable, { title: "SafetyStatusCard Props", data: safetyProps })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Integration Example" }), _jsx("pre", { children: _jsx("code", { children: `// Using OpenAI Moderation API
import { SafetyStatusCard } from '@clarity-chat/react'
import OpenAI from 'openai'

const openai = new OpenAI()

async function checkSafety(text: string) {
  const moderation = await openai.moderations.create({
    input: text
  })

  const result = moderation.results[0]
  
  const checks = [
    {
      id: '1',
      label: 'Hate Speech',
      status: result.categories.hate ? 'fail' : 'pass',
      detail: result.categories.hate 
        ? \`Score: \${result.category_scores.hate.toFixed(3)}\`
        : 'Content is respectful'
    },
    {
      id: '2',
      label: 'Violence',
      status: result.categories.violence ? 'fail' : 'pass',
      detail: result.categories.violence
        ? 'Violent content detected'
        : 'No violent content'
    },
    // Add more checks...
  ]

  return checks
}

// In your chat component
const [safetyChecks, setSafetyChecks] = useState([])

useEffect(() => {
  if (aiResponse) {
    checkSafety(aiResponse).then(setSafetyChecks)
  }
}, [aiResponse])` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Best Practices" }), _jsxs("ul", { children: [_jsx("li", { children: "Run safety checks BEFORE displaying AI responses" }), _jsx("li", { children: "Block responses that fail critical checks" }), _jsx("li", { children: "Log all safety events for auditing" }), _jsx("li", { children: "Provide clear remediation steps" }), _jsx("li", { children: "Review warnings manually" })] }), _jsx(Callout, { type: "warning", title: "Not a Replacement for Backend Checks", children: "This component shows results. Always run safety checks on your backend/server, not just in the frontend. Users can bypass frontend checks." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: _jsxs("a", { href: "/reference/components/response-quality-meter", className: "docs-card", children: [_jsx("h3", { children: "Response Quality Meter" }), _jsx("p", { children: "Quality metrics" })] }) })] })] }));
}
const safetyProps = [
    {
        name: 'checks',
        type: 'SafetyCheck[]',
        required: true,
        description: 'Array of safety checks performed'
    },
    {
        name: 'lastReviewedAt',
        type: 'Date',
        required: false,
        description: 'When checks were last run'
    },
    {
        name: 'onReviewPolicy',
        type: '() => void',
        required: false,
        description: 'Callback to review safety policies'
    },
    {
        name: 'onAcknowledge',
        type: '(check: SafetyCheck) => void',
        required: false,
        description: 'Callback when user acknowledges a check'
    },
    {
        name: 'title',
        type: 'string',
        required: false,
        description: 'Section heading'
    },
    {
        name: 'subtitle',
        type: 'string',
        required: false,
        description: 'Description text'
    },
    {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Additional CSS classes'
    }
];
//# sourceMappingURL=page.js.map