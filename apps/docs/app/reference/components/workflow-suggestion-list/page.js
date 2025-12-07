import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ApiTable } from '@/components/Demo/ApiTable';
import { CodePlayground } from '@/components/Playground/CodePlayground';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Workflow Suggestion List - Clarity Chat Components',
    description: 'Suggest complete workflows and multi-step processes to help users accomplish complex tasks.',
};
export default function WorkflowSuggestionListPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Component" }), _jsx("h1", { children: "Workflow Suggestion List" }), _jsx("p", { className: "docs-lead", children: "Suggest complete workflows for complex tasks. Like having a playbook - \"Want to deploy to production? Here are the 5 steps.\"" })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Overview" }), _jsx("p", { children: "Instead of just suggesting single questions, suggest entire workflows. For example: \"Setting up CI/CD\" workflow includes: 1) Create config file, 2) Set up secrets, 3) Test locally, 4) Deploy. Users get a complete game plan." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Basic Usage" }), _jsx(CodePlayground, { initialCode: `function SimpleWorkflows() {
  const workflows = [
    {
      id: '1',
      name: 'Deploy to Production',
      description: 'Complete deployment checklist',
      steps: [
        'Run all tests',
        'Build production bundle',
        'Update environment variables',
        'Deploy to server',
        'Verify deployment'
      ],
      estimatedTime: '15 min'
    },
    {
      id: '2',
      name: 'Set Up New Feature',
      description: 'Standard feature development workflow',
      steps: [
        'Create feature branch',
        'Write tests first (TDD)',
        'Implement feature',
        'Update documentation',
        'Submit pull request'
      ],
      estimatedTime: '2-3 hours'
    }
  ]

  return (
    <WorkflowSuggestionList
      workflows={workflows}
      onSelect={(w) => console.log('Selected:', w.name)}
    />
  )
}

render(<SimpleWorkflows />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Props" }), _jsx(ApiTable, { title: "WorkflowSuggestionList Props", data: workflowProps })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Best Practices" }), _jsxs("ul", { children: [_jsx("li", { children: "Keep workflows to 3-7 steps (not too simple, not too complex)" }), _jsx("li", { children: "Provide realistic time estimates" }), _jsx("li", { children: "Make steps actionable (start with verbs)" }), _jsx("li", { children: "Group similar workflows by category" }), _jsx("li", { children: "Include common workflows users actually need" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("a", { href: "/reference/components/follow-up-suggestions", className: "docs-card", children: [_jsx("h3", { children: "Follow-Up Suggestions" }), _jsx("p", { children: "Single question suggestions" })] }), _jsxs("a", { href: "/reference/components/prompt-library", className: "docs-card", children: [_jsx("h3", { children: "Prompt Library" }), _jsx("p", { children: "Pre-built prompts" })] })] })] })] }));
}
const workflowProps = [
    {
        name: 'workflows',
        type: 'WorkflowSuggestion[]',
        required: true,
        description: 'Array of workflow suggestions'
    },
    {
        name: 'onSelect',
        type: '(workflow: WorkflowSuggestion) => void',
        required: false,
        description: 'Callback when workflow is selected'
    },
    {
        name: 'onPreview',
        type: '(workflow: WorkflowSuggestion) => void',
        required: false,
        description: 'Callback to preview workflow details'
    },
    {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Additional CSS classes'
    }
];
//# sourceMappingURL=page.js.map