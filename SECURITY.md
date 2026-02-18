# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please report it responsibly.

### How to Report

**Please DO NOT create public GitHub issues for security vulnerabilities.**

Instead, please report security vulnerabilities by emailing:

**hello@codeclarity.ai**

### What to Include

When reporting a vulnerability, please include:

1. **Description** - A clear description of the vulnerability
2. **Steps to Reproduce** - Detailed steps to reproduce the issue
3. **Impact Assessment** - Your assessment of the potential impact
4. **Affected Versions** - Which versions are affected
5. **Suggested Fix** - If you have one, a suggested remediation

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 5 business days
- **Resolution Target**: Within 30 days for critical issues

### What to Expect

1. **Acknowledgment**: We will acknowledge receipt of your report
2. **Investigation**: Our team will investigate and validate the issue
3. **Communication**: We will keep you informed of our progress
4. **Credit**: With your permission, we will credit you in the security advisory

## Security Practices

### Code Security

- **TypeScript Strict Mode**: All code is written in TypeScript with strict mode enabled
- **No `eval()`**: We never use `eval()` or similar dangerous patterns
- **Input Validation**: All user inputs are validated and sanitized
- **Dependency Auditing**: Dependencies are regularly audited for vulnerabilities

### AI-Specific Security

Clarity Chat includes built-in protections against common AI security threats:

- **Prompt Injection Detection**: Multi-layered detection system with configurable sensitivity
- **Jailbreak Prevention**: Configurable prevention techniques
- **PII Detection & Redaction**: Personal data detection and redaction utilities
- **Content Filtering**: Configurable content moderation
- **Rate Limiting**: Protection against abuse

### Infrastructure Security

- **No Telemetry**: We do not collect any usage data without explicit consent
- **No External Calls**: The library makes no external network requests on its own
- **Secure Defaults**: Security features are enabled by default where possible

### CI/CD Security

- **Automated Testing**: All PRs require passing tests
- **Dependency Review**: Automated dependency vulnerability scanning
- **Code Review**: All changes require review before merging

## Security Features

### For Users

```tsx
import { useSecureChat } from '@clarity-chat/react'

const { messages, sendMessage } = useSecureChat({
  config: {
    promptInjection: { enabled: true },
    pii: { enabled: true, autoRedact: true },
    jailbreakPrevention: { enabled: true },
    rateLimit: { maxRequests: 100, windowMs: 60000 },
  },
})
```

### Available Security Components

- `useSecureChat` - Chat hook with built-in security
- `useSecurity` - Security utilities hook
- `SecurityProvider` - Context provider for security configuration
- `PIIDetector` - Personal information detection
- `ContentFilter` - Content moderation

## Vulnerability Disclosure Policy

We follow a coordinated disclosure process:

1. **Report Received**: We acknowledge receipt within 48 hours
2. **Investigation**: We investigate and confirm the vulnerability
3. **Fix Development**: We develop and test a fix
4. **Release**: We release the fix in a new version
5. **Advisory**: We publish a security advisory (with reporter credit if desired)
6. **Public Disclosure**: Full details are disclosed 30 days after the fix is released

## Security Advisories

Security advisories will be published on:

- [GitHub Security Advisories](https://github.com/christireid/Clarity-ai-chat-components/security/advisories)
- Our [GitHub Discussions](https://github.com/christireid/Clarity-ai-chat-components/discussions)

## Bug Bounty

We currently do not have a formal bug bounty program. However, we deeply appreciate security researchers who responsibly disclose vulnerabilities and will acknowledge their contributions.

## Contact

- **Security Issues**: hello@codeclarity.ai
- **General Support**: hello@codeclarity.ai
- **GitHub Issues**: https://github.com/christireid/Clarity-ai-chat-components/issues
