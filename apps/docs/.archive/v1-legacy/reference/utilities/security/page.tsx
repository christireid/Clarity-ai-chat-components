import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Security Utilities',
  description: 'Comprehensive security utilities for input sanitization, XSS prevention, CSP management, and secure content handling.',
}

const securityFunctionsProps: Prop[] = [
  {
    name: 'sanitizeHTML',
    type: '(html: string, options?: SanitizationOptions) => string',
    description: 'Sanitize HTML content to prevent XSS attacks.',
  },
  {
    name: 'sanitizeMarkdown',
    type: '(markdown: string, options?: SanitizationOptions) => string',
    description: 'Sanitize Markdown content with HTML sanitization.',
  },
  {
    name: 'sanitizeUserInput',
    type: '(input: string, context: "text" | "html" | "url") => string',
    description: 'Sanitize user input based on intended usage context.',
  },
  {
    name: 'detectXSSPatterns',
    type: '(content: string) => XSSDetectionResult',
    description: 'Detect potential XSS patterns in content.',
  },
  {
    name: 'generateCSPHeader',
    type: '(policies: CSPDirectives) => string',
    description: 'Generate Content Security Policy header string.',
  },
  {
    name: 'validateCSPDirectives',
    type: '(directives: CSPDirectives) => ValidationResult',
    description: 'Validate CSP directives for correctness.',
  },
  {
    name: 'generateSecurityHeaders',
    type: '(config?: SecurityConfig) => SecurityHeaders',
    description: 'Generate comprehensive security headers.',
  },
  {
    name: 'auditComponentSecurity',
    type: '(component: React.ComponentType) => SecurityAuditResult',
    description: 'Audit React component for security vulnerabilities.',
  },
  {
    name: 'createSecureContentWrapper',
    type: '(options?: SecurityConfig) => React.ComponentType',
    description: 'Create HOC for secure content rendering.',
  },
  {
    name: 'useSecureContent',
    type: '(options?: SecurityConfig) => SecureContentHook',
    description: 'React hook for secure content handling.',
  },
  {
    name: 'useCSP',
    type: '(directives?: CSPDirectives) => CSPHook',
    description: 'React hook for CSP management.',
  },
  {
    name: 'securityMonitor',
    type: 'SecurityMonitor',
    description: 'Global security monitoring and alerting system.',
  },
]

export default function SecurityPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full text-sm font-medium mb-4">
          <span>🔒 Security Utilities</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">Security Utilities</h1>
        <p className="text-xl text-muted-foreground mb-4">
          Comprehensive security utilities for input sanitization, XSS prevention,
          Content Security Policy management, and secure content handling for AI chat applications.
        </p>
        <p className="text-muted-foreground">
          <strong>Category:</strong> Security •{' '}
          <strong>OWASP Top 10:</strong> A03, A07, A09 •{' '}
          <strong>Impact:</strong> Application Security
        </p>
      </div>

      <Callout type="warning" title="Security First for AI Applications">
        <p className="mb-2">
          <strong>AI chat applications handle sensitive user data and generate dynamic content.</strong>
          Security vulnerabilities can expose users to XSS attacks, data breaches, and malicious content injection.
          These utilities provide defense-in-depth security measures specifically designed for AI chat interfaces.
        </p>
      </Callout>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Input Sanitization</h2>
        <CodePlayground
          code={`import {
  sanitizeUserInput,
  sanitizeHTML,
  sanitizeMarkdown,
  detectXSSPatterns
} from '@clarity-chat/react'

function SecureChatApp() {
  const [userInput, setUserInput] = useState('')
  const [chatMessages, setChatMessages] = useState([])

  const handleUserInput = (input) => {
    // Detect potential XSS before processing
    const xssCheck = detectXSSPatterns(input)
    if (xssCheck.hasPatterns) {
      console.warn('Potential XSS detected:', xssCheck.patterns)
      // Could log to security monitoring system
    }

    // Sanitize based on context
    const sanitized = sanitizeUserInput(input, 'text')
    setUserInput(sanitized)
  }

  const handleSendMessage = async () => {
    if (!userInput.trim()) return

    // Sanitize for display (if allowing HTML/Markdown)
    const displayContent = sanitizeMarkdown(userInput, {
      allowedTags: ['strong', 'em', 'code'],
      allowedAttributes: {}
    })

    const newMessage = {
      id: Date.now(),
      content: displayContent,
      type: 'user',
      timestamp: new Date()
    }

    setChatMessages(prev => [...prev, newMessage])
    setUserInput('')

    // Send to AI (backend should also sanitize)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput }) // Raw input to backend
      })

      const aiResponse = await response.json()

      // Sanitize AI response before displaying
      const sanitizedResponse = sanitizeHTML(aiResponse.content, {
        allowedTags: ['p', 'strong', 'em', 'code', 'pre', 'br'],
        allowedAttributes: {
          'code': ['class'],
          'pre': ['class']
        }
      })

      setChatMessages(prev => [...prev, {
        id: Date.now(),
        content: sanitizedResponse,
        type: 'ai',
        timestamp: new Date()
      }])
    } catch (error) {
      console.error('Chat error:', error)
    }
  }

  return (
    <div className="chat-app">
      <div className="messages">
        {chatMessages.map(msg => (
          <div
            key={msg.id}
            className={\`message \${msg.type}\`}
            dangerouslySetInnerHTML={{ __html: msg.content }}
          />
        ))}
      </div>

      <div className="input-area">
        <input
          type="text"
          value={userInput}
          onChange={(e) => handleUserInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  )
}`}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Multi-layer input sanitization with XSS detection, context-aware cleaning,
          and secure content rendering for AI-generated responses.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Content Security Policy (CSP)</h2>
        <CodePlayground
          code={`import {
  generateCSPHeader,
  validateCSPDirectives,
  useCSP
} from '@clarity-chat/react'

function SecureChatWithCSP() {
  // Define CSP directives for AI chat application
  const cspDirectives = {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "https://cdn.example.com"],
    'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    'img-src': ["'self'", "data:", "https:", "blob:"],
    'connect-src': ["'self'", "https://api.openai.com", "https://api.anthropic.com"],
    'font-src': ["'self'", "https://fonts.gstatic.com"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': true
  }

  // Validate CSP configuration
  const validation = validateCSPDirectives(cspDirectives)
  if (!validation.isValid) {
    console.error('Invalid CSP directives:', validation.errors)
  }

  // Generate CSP header
  const cspHeader = generateCSPHeader(cspDirectives)

  // Use in Next.js API route or Express middleware
  useEffect(() => {
    // Set CSP header on document (client-side)
    const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]')
    if (meta) {
      meta.setAttribute('content', cspHeader)
    }
  }, [])

  // Use CSP hook for dynamic policy updates
  const { updatePolicy, getPolicy } = useCSP(cspDirectives)

  const handleEnableStreaming = () => {
    // Update CSP to allow WebSocket connections for streaming
    updatePolicy({
      'connect-src': ["'self'", "https://api.openai.com", "wss://api.openai.com", "https://api.anthropic.com"]
    })
  }

  return (
    <div>
      <div className="security-info">
        <h3>Content Security Policy Active</h3>
        <p>Directives validated: {validation.isValid ? '✅' : '❌'}</p>
        <details>
          <summary>CSP Header Preview</summary>
          <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-x-auto">
            {cspHeader}
          </pre>
        </details>
      </div>

      <ClarityChat
        api="/api/chat"
        onEnableStreaming={handleEnableStreaming}
      />
    </div>
  )
}

// Server-side CSP middleware example
export function createCSPMiddleware(directives) {
  return (req, res, next) => {
    const cspHeader = generateCSPHeader(directives)
    res.setHeader('Content-Security-Policy', cspHeader)
    next()
  }
}`}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Dynamic CSP management with validation, real-time policy updates,
          and comprehensive protection against XSS and injection attacks.
        </p>

        <Callout type="info" title="CSP Best Practices for AI Chat">
          <ul className="list-disc list-inside">
            <li><strong>Restrict script execution:</strong> Only allow trusted sources</li>
            <li><strong>Limit connections:</strong> Whitelist AI provider APIs</li>
            <li><strong>Control media:</strong> Allow blob: URLs for generated images</li>
            <li><strong>Block inline styles/scripts:</strong> Use nonce-based CSP</li>
            <li><strong>Enable reporting:</strong> Monitor policy violations</li>
          </ul>
        </Callout>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Component Security Auditing</h2>
        <CodePlayground
          code={`import {
  auditComponentSecurity,
  createSecureContentWrapper,
  securityMonitor
} from '@clarity-chat/react'

// Security audit of chat components
function SecurityAuditedChat() {
  const [auditResults, setAuditResults] = useState([])

  const runSecurityAudit = async () => {
    // Audit the main chat components
    const components = [
      { name: 'ClarityChat', component: ClarityChat },
      { name: 'MessageList', component: MessageList },
      { name: 'ChatInput', component: ChatInput }
    ]

    const results = await Promise.all(
      components.map(async ({ name, component }) => {
        const audit = await auditComponentSecurity(component)
        return { name, audit }
      })
    )

    setAuditResults(results)

    // Log critical issues
    results.forEach(({ name, audit }) => {
      if (audit.criticalIssues > 0) {
        console.error(\`🚨 \${name} has \${audit.criticalIssues} critical security issues\`)
        securityMonitor.report({
          type: 'component_audit',
          component: name,
          severity: 'critical',
          issues: audit.issues.filter(i => i.severity === 'critical')
        })
      }
    })
  }

  // Create secure wrapper for user-generated content
  const SecureMessage = createSecureContentWrapper({
    sanitizeContent: true,
    detectXSS: true,
    allowedTags: ['strong', 'em', 'code', 'pre'],
    csp: {
      'script-src': ["'none'"],
      'style-src': ["'unsafe-inline'"] // Allow inline styles for formatting
    }
  })

  return (
    <div>
      {/* Security audit controls */}
      <div className="security-dashboard mb-4">
        <button
          onClick={runSecurityAudit}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          🔒 Run Security Audit
        </button>

        {auditResults.length > 0 && (
          <div className="mt-2 p-3 bg-gray-100 rounded">
            <h4 className="font-semibold">Audit Results</h4>
            {auditResults.map(({ name, audit }) => (
              <div key={name} className="text-sm">
                {name}: {audit.criticalIssues} critical, {audit.warnings} warnings
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Secure chat interface */}
      <ClarityChat
        api="/api/chat"
        components={{
          MessageComponent: SecureMessage
        }}
      />
    </div>
  )
}

// Global security monitoring setup
securityMonitor.configure({
  reporting: {
    console: true,
    endpoint: '/api/security-events',
    batchSize: 10,
    flushInterval: 30000
  },
  alerts: {
    onCriticalIssue: (issue) => {
      // Send alert to security team
      console.error('🚨 CRITICAL SECURITY ISSUE:', issue)
      // Could send email, Slack notification, etc.
    },
    onXSSAttempt: (attempt) => {
      console.warn('⚠️ XSS Attempt Detected:', attempt)
    }
  }
})`}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Automated security auditing, secure content wrappers, and global monitoring
          system for comprehensive application security.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Secure Content Handling</h2>
        <CodePlayground
          code={`import {
  useSecureContent,
  useCSP,
  generateSecurityHeaders
} from '@clarity-chat/react'

function SecureContentChat() {
  const secureContent = useSecureContent({
    sanitizeInput: true,
    detectXSS: true,
    csp: {
      'default-src': ["'self'"],
      'script-src': ["'none'"],
      'style-src': ["'unsafe-inline'"],
      'img-src': ["'self'", "data:", "https:"]
    }
  })

  const { updatePolicy } = useCSP()

  const handleFileUpload = async (file) => {
    // Validate file security
    const validation = await secureContent.validateFile(file)
    if (!validation.isSafe) {
      throw new Error(\`Unsafe file: \${validation.reason}\`)
    }

    // Update CSP for file display
    updatePolicy({
      'img-src': ["'self'", "data:", "blob:"]
    })

    return secureContent.processFile(file)
  }

  const handleAIReponse = (response) => {
    // Sanitize AI-generated content
    const sanitized = secureContent.sanitize(response.content, {
      allowedTags: ['p', 'strong', 'em', 'code', 'pre', 'ul', 'ol', 'li'],
      allowedAttributes: {
        'code': ['class'],
        'pre': ['class']
      }
    })

    // Check for malicious patterns
    const securityCheck = secureContent.scanForThreats(sanitized)
    if (securityCheck.hasThreats) {
      console.warn('AI response contains potential threats:', securityCheck.threats)
      // Could flag for human review
    }

    return sanitized
  }

  return (
    <ClarityChat
      api="/api/chat"
      onFileUpload={handleFileUpload}
      onMessage={(message) => {
        if (message.role === 'assistant') {
          return handleAIReponse(message)
        }
        return message
      }}
      security={{
        sanitizeContent: true,
        validateFiles: true,
        csp: secureContent.csp
      }}
    />
  )
}

// Generate comprehensive security headers
const securityHeaders = generateSecurityHeaders({
  csp: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", "data:", "https:"]
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  permissions: {
    camera: 'none',
    microphone: 'none',
    geolocation: 'none'
  },
  referrer: 'strict-origin-when-cross-origin'
})

// Apply to Express.js server
app.use((req, res, next) => {
  Object.entries(securityHeaders).forEach(([header, value]) => {
    res.setHeader(header, value)
  })
  next()
})`}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Comprehensive secure content handling with file validation, AI response sanitization,
          and automated security header generation.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Security Monitoring Dashboard</h2>
        <CodePlayground
          code={`import { securityMonitor, DEFAULT_SECURITY_CONFIG } from '@clarity-chat/react'

function SecurityDashboard() {
  const [securityEvents, setSecurityEvents] = useState([])
  const [metrics, setMetrics] = useState({
    totalEvents: 0,
    criticalIssues: 0,
    xssAttempts: 0,
    blockedRequests: 0
  })

  useEffect(() => {
    // Subscribe to security events
    const unsubscribe = securityMonitor.subscribe((event) => {
      setSecurityEvents(prev => [event, ...prev.slice(0, 99)]) // Keep last 100

      setMetrics(prev => ({
        ...prev,
        totalEvents: prev.totalEvents + 1,
        [event.type === 'xss_attempt' ? 'xssAttempts' : 'other']: prev[event.type === 'xss_attempt' ? 'xssAttempts' : 'other'] + 1
      }))
    })

    return unsubscribe
  }, [])

  const exportSecurityReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      metrics,
      events: securityEvents,
      summary: {
        period: 'last_24_hours',
        riskLevel: metrics.criticalIssues > 10 ? 'high' : metrics.criticalIssues > 5 ? 'medium' : 'low'
      }
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: 'application/json'
    })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = \`security-report-\${new Date().toISOString().split('T')[0]}.json\`
    a.click()

    URL.revokeObjectURL(url)
  }

  return (
    <div className="security-dashboard">
      <div className="metrics-grid grid grid-cols-4 gap-4 mb-6">
        <div className="metric-card bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{metrics.criticalIssues}</div>
          <div className="text-sm text-red-600">Critical Issues</div>
        </div>
        <div className="metric-card bg-orange-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{metrics.xssAttempts}</div>
          <div className="text-sm text-orange-600">XSS Attempts</div>
        </div>
        <div className="metric-card bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{metrics.blockedRequests}</div>
          <div className="text-sm text-blue-600">Blocked Requests</div>
        </div>
        <div className="metric-card bg-gray-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-gray-600">{metrics.totalEvents}</div>
          <div className="text-sm text-gray-600">Total Events</div>
        </div>
      </div>

      <div className="controls mb-4">
        <button
          onClick={exportSecurityReport}
          className="px-4 py-2 bg-blue-600 text-white rounded mr-2"
        >
          Export Report
        </button>
        <button
          onClick={() => setSecurityEvents([])}
          className="px-4 py-2 bg-gray-600 text-white rounded"
        >
          Clear Events
        </button>
      </div>

      <div className="events-list max-h-96 overflow-y-auto border rounded-lg">
        <div className="p-3 bg-gray-100 font-semibold">Recent Security Events</div>
        {securityEvents.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No security events recorded
          </div>
        ) : (
          securityEvents.map((event, index) => (
            <div key={index} className="p-3 border-t flex justify-between items-center">
              <div>
                <div className="font-medium">{event.type.replace('_', ' ').toUpperCase()}</div>
                <div className="text-sm text-gray-600">
                  {new Date(event.timestamp).toLocaleString()}
                </div>
                {event.details && (
                  <div className="text-xs text-gray-500 mt-1">
                    {JSON.stringify(event.details)}
                  </div>
                )}
              </div>
              <div className={\`px-2 py-1 rounded text-xs \${
                event.severity === 'critical' ? 'bg-red-100 text-red-800' :
                event.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                'bg-yellow-100 text-yellow-800'
              }\`}>
                {event.severity}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}`}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Real-time security monitoring dashboard with event tracking, metrics visualization,
          and automated report generation for security auditing.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">API Reference</h2>
        <PropsTable props={securityFunctionsProps} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Security Best Practices</h2>
        <div className="space-y-4">
          <Callout type="warning" title="Defense in Depth">
            <p>Implement multiple layers of security:</p>
            <ul className="list-disc list-inside mt-2">
              <li><strong>Client-side sanitization:</strong> Immediate user feedback</li>
              <li><strong>Server-side validation:</strong> Authoritative security</li>
              <li><strong>CSP headers:</strong> Prevent script injection</li>
              <li><strong>Content validation:</strong> AI-generated content scanning</li>
              <li><strong>Monitoring:</strong> Continuous threat detection</li>
            </ul>
          </Callout>

          <Callout type="info" title="OWASP Top 10 for AI Applications">
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <h4 className="font-semibold mb-2">Critical for AI Chat</h4>
                <ul className="list-disc list-inside text-sm">
                  <li>A03: Injection (Prompt injection)</li>
                  <li>A07: Identification & Authentication</li>
                  <li>A09: Security Logging & Monitoring</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Implementation</h4>
                <ul className="list-disc list-inside text-sm">
                  <li>Input sanitization & validation</li>
                  <li>Secure session management</li>
                  <li>Comprehensive audit logging</li>
                </ul>
              </div>
            </div>
          </Callout>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Related Documentation</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/guides/security"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Security Guide</h3>
            <p className="text-sm text-muted-foreground">
              Comprehensive security best practices for AI chat applications.
            </p>
          </Link>
          <Link
            href="/reference/utilities/performance-monitoring"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Performance Monitoring</h3>
            <p className="text-sm text-muted-foreground">
              Monitor application performance alongside security metrics.
            </p>
          </Link>
          <Link
            href="/reference/utilities/accessibility-testing"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Accessibility Testing</h3>
            <p className="text-sm text-muted-foreground">
              Ensure secure applications are also accessible to all users.
            </p>
          </Link>
          <Link
            href="/reference/components/error-boundary"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Error Boundaries</h3>
            <p className="text-sm text-muted-foreground">
              Handle security-related errors gracefully.
            </p>
          </Link>
        </div>
      </section>
    </div>
  )
}