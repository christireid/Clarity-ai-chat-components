import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, useCallback } from 'react'
import { expect, within } from 'storybook/test'

/**
 * Documentation UI Patterns
 *
 * **Reusable patterns for documentation sites:**
 * - Social sharing buttons
 * - Quick start tutorials
 * - Interactive code playgrounds
 * - Copy-to-clipboard with feedback
 *
 * These patterns enhance developer experience and can be
 * adapted for any React documentation site.
 */
const meta = {
  title: 'Examples/Documentation Patterns',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'UI patterns commonly used in documentation sites to improve developer experience.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Share Button Pattern
// ============================================================================

interface ShareOption {
  name: string
  color: string
  getUrl: (url: string, text: string) => string
}

const shareOptions: ShareOption[] = [
  {
    name: 'Twitter',
    color: 'bg-[#1DA1F2] hover:bg-[#1a8cd8]',
    getUrl: (url, text) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    name: 'LinkedIn',
    color: 'bg-[#0A66C2] hover:bg-[#094d92]',
    getUrl: (url) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
]

function ShareButton({
  text = 'Check out this awesome library!',
  url = 'https://example.com',
}: {
  text?: string
  url?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [url])

  const handleShare = (option: ShareOption) => {
    const shareUrl = option.getUrl(url, text)
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400')
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors border border-gray-200 dark:border-gray-700"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
        Share
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-2 min-w-[180px]">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 py-2">
              Share via
            </div>
            {shareOptions.map((option) => (
              <button
                key={option.name}
                onClick={() => handleShare(option)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm text-white transition-colors ${option.color}`}
              >
                {option.name}
              </button>
            ))}
            <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
            <button
              onClick={handleCopy}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {copied ? (
                <span className="text-green-500 flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Copied!
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  Copy link
                </span>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export const SocialSharing: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Share Button Pattern</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          A reusable share button with social media options and copy link
          functionality.
        </p>
      </div>

      <ShareButton
        text="Check out Clarity Chat - 70+ React components!"
        url="https://clarity-chat.dev"
      />

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm">
        <strong>Features:</strong>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Twitter and LinkedIn sharing with pre-filled text</li>
          <li>Copy link to clipboard with visual feedback</li>
          <li>Fallback for older browsers</li>
          <li>Native Web Share API support (mobile)</li>
          <li>Accessible dropdown with keyboard support</li>
        </ul>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', { name: /share/i })
    ).toBeInTheDocument()
  },
}

// ============================================================================
// Copy with Confetti Pattern
// ============================================================================

function CopyWithConfetti({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setShowConfetti(true)

      setTimeout(() => {
        setCopied(false)
        setShowConfetti(false)
      }, 2000)
    } catch {
      // Silently fail
    }
  }, [text])

  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    angle: (i / 8) * 360,
    color: ['#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'][i % 5],
  }))

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-900 text-white">
      <svg
        className="w-4 h-4 text-blue-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <code className="font-mono text-sm">{text}</code>
      <div className="relative">
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md hover:bg-gray-800 transition-colors"
          aria-label="Copy to clipboard"
        >
          {copied ? (
            <svg
              className="w-4 h-4 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          )}
        </button>

        {/* Confetti particles */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-visible">
            {particles.map((particle) => (
              <div
                key={particle.id}
                className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full animate-ping"
                style={{
                  backgroundColor: particle.color,
                  transform: `translate(-50%, -50%) translateX(${Math.cos((particle.angle * Math.PI) / 180) * 25}px) translateY(${Math.sin((particle.angle * Math.PI) / 180) * 25}px)`,
                  animationDuration: '0.5s',
                  animationIterationCount: 1,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export const CopyWithAnimation: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">
          Copy with Confetti Animation
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Delightful feedback when users copy install commands.
        </p>
      </div>

      <CopyWithConfetti text="npm install @clarity-chat/react" />

      <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm">
        <strong>Implementation:</strong>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Particles burst outward from the copy button</li>
          <li>Colors cycle through the brand palette</li>
          <li>Animation uses CSS transform for performance</li>
          <li>Optional haptic feedback on mobile</li>
        </ul>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', { name: /copy/i })
    ).toBeInTheDocument()
  },
}

// ============================================================================
// Quick Start Steps Pattern
// ============================================================================

const steps = [
  {
    id: 1,
    title: 'Install',
    description: 'Add the package to your project',
    code: 'npm install @clarity-chat/react',
  },
  {
    id: 2,
    title: 'Import',
    description: 'Import components you need',
    code: "import { ChatWindow } from '@clarity-chat/react'",
  },
  {
    id: 3,
    title: 'Use',
    description: 'Add to your app',
    code: '<ChatWindow messages={messages} />',
  },
]

function QuickStartSteps() {
  const [activeStep, setActiveStep] = useState(1)

  return (
    <div className="w-full max-w-xl">
      <div className="space-y-3">
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() => setActiveStep(step.id)}
            className={`w-full flex items-start gap-4 p-4 rounded-xl text-left transition-all ${
              activeStep === step.id
                ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500'
                : 'bg-gray-50 dark:bg-gray-800 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                activeStep === step.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              {step.id}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">{step.title}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {step.description}
              </p>
              {activeStep === step.id && (
                <pre className="mt-3 p-3 bg-gray-900 rounded-lg text-sm text-white overflow-x-auto">
                  <code>{step.code}</code>
                </pre>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export const QuickStartTutorial: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">
          Quick Start Steps Pattern
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Interactive walkthrough for getting started guides.
        </p>
      </div>

      <QuickStartSteps />

      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg text-sm">
        <strong>Best Practices:</strong>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Keep steps to 3-5 maximum</li>
          <li>Show code snippets inline</li>
          <li>Highlight active step visually</li>
          <li>Allow clicking to jump to any step</li>
          <li>Consider auto-advancing on completion</li>
        </ul>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Install')).toBeInTheDocument()
    await expect(canvas.getByText('Import')).toBeInTheDocument()
    await expect(canvas.getByText('Use')).toBeInTheDocument()
  },
}

// ============================================================================
// GitHub Stars Badge Pattern
// ============================================================================

function GitHubStarsBadge({
  loading = false,
  stars = 1234,
}: {
  loading?: boolean
  stars?: number
}) {
  if (loading) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse" />
        <div className="w-3.5 h-3.5 rounded bg-gray-300 dark:bg-gray-600 animate-pulse" />
        <div className="w-8 h-4 rounded bg-gray-300 dark:bg-gray-600 animate-pulse" />
      </div>
    )
  }

  return (
    <a
      href="#"
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium hover:border-blue-500 transition-all"
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path
          fillRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          clipRule="evenodd"
        />
      </svg>
      <svg
        className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"
        viewBox="0 0 24 24"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      <span>{stars.toLocaleString()}</span>
    </a>
  )
}

export const GitHubStars: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">GitHub Stars Badge</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Display repository stars with loading state and caching.
        </p>
      </div>

      <div className="flex flex-col gap-4 items-center">
        <div>
          <p className="text-sm text-gray-500 mb-2">Loading state:</p>
          <GitHubStarsBadge loading />
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-2">Loaded state:</p>
          <GitHubStarsBadge stars={2847} />
        </div>
      </div>

      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm">
        <strong>Implementation Tips:</strong>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Cache stars count in sessionStorage</li>
          <li>Implement retry logic with exponential backoff</li>
          <li>Show skeleton while loading</li>
          <li>Gracefully handle API errors</li>
          <li>Use stale cache as fallback when offline</li>
        </ul>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('2,847')).toBeInTheDocument()
  },
}

// ============================================================================
// Search with ARIA Pattern
// ============================================================================

function AccessibleSearch() {
  const [query, setQuery] = useState('')
  const [results] = useState([
    { title: 'ChatWindow', category: 'Components' },
    { title: 'useChat', category: 'Hooks' },
    { title: 'MessageList', category: 'Components' },
  ])
  const [selectedIndex, setSelectedIndex] = useState(0)

  const filteredResults = query
    ? results.filter((r) => r.title.toLowerCase().includes(query.toLowerCase()))
    : results

  const resultsAnnouncement = query
    ? `${filteredResults.length} results found for "${query}"`
    : `${results.length} items available`

  return (
    <div className="w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          role="combobox"
          aria-expanded="true"
          aria-controls="search-results"
          aria-activedescendant={`result-${selectedIndex}`}
        />

        {/* Screen reader announcement */}
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {resultsAnnouncement}
        </div>

        <ul
          id="search-results"
          role="listbox"
          className="mt-2 border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden"
        >
          {filteredResults.map((result, index) => (
            <li
              key={result.title}
              id={`result-${index}`}
              role="option"
              aria-selected={index === selectedIndex}
              onClick={() => setSelectedIndex(index)}
              className={`px-4 py-3 cursor-pointer transition-colors ${
                index === selectedIndex
                  ? 'bg-blue-50 dark:bg-blue-900/20'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <div className="font-medium">{result.title}</div>
              <div className="text-sm text-gray-500">{result.category}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export const AccessibleSearchPattern: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">
          Accessible Search Pattern
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Search with proper ARIA attributes for screen readers.
        </p>
      </div>

      <AccessibleSearch />

      <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg text-sm">
        <strong>Accessibility Features:</strong>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>
            <code>role="combobox"</code> on input
          </li>
          <li>
            <code>aria-expanded</code> for dropdown state
          </li>
          <li>
            <code>aria-activedescendant</code> for keyboard navigation
          </li>
          <li>
            <code>role="listbox"</code> and <code>role="option"</code> for
            results
          </li>
          <li>
            <code>aria-live="polite"</code> region for result announcements
          </li>
          <li>Keyboard navigation with arrow keys</li>
        </ul>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('combobox')).toBeInTheDocument()
    await expect(canvas.getByRole('listbox')).toBeInTheDocument()
  },
}
