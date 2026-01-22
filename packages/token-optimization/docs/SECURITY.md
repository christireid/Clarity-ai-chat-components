# Security Documentation

**Package:** @clarity-chat/token-optimization v1.0.0
**Security Pattern Version:** 2.0.0-owasp-2026
**Date:** 2026-01-20

---

## Table of Contents

1. [Overview](#overview)
2. [OWASP LLM Top 10 Compliance](#owasp-llm-top-10-compliance)
3. [Security Features](#security-features)
4. [Threat Model](#threat-model)
5. [Security Configuration](#security-configuration)
6. [PII Redaction](#pii-redaction)
7. [Audit Logging](#audit-logging)
8. [Best Practices](#best-practices)
9. [Reporting Security Issues](#reporting-security-issues)

---

## Overview

The `@clarity-chat/token-optimization` package implements comprehensive security measures aligned with the **OWASP LLM Top 10 2026** standard. Security features are built-in and enabled by default where appropriate.

### Security Principles

1. **Security by Default** - Safe configurations out of the box
2. **Defense in Depth** - Multiple layers of protection
3. **Fail Securely** - Graceful degradation on security failures
4. **Audit Everything** - Comprehensive logging for compliance
5. **Zero Trust** - Validate all inputs and outputs

---

## OWASP LLM Top 10 Compliance

The package addresses all items in the OWASP LLM Top 10 2026:

### LLM01: Prompt Injection

**Risk:** Malicious instructions embedded in user input that manipulate LLM behavior

**Mitigations:**
- Unicode attack detection (zero-width characters, RTLO, BiDi controls)
- Homograph attack detection (Cyrillic/Greek lookalikes)
- Pattern-based threat detection (SQL injection, XSS, code execution)
- Input sanitization with threat severity scoring
- Security audit logging of all inputs

**Implementation:**
```typescript
import { TokenSecurityManager } from '@clarity-chat/token-optimization'

const security = new TokenSecurityManager({
  enableSanitization: true,
  enableAuditLogging: true,
})

const result = security.sanitizeInput(userInput)
if (result.riskLevel === 'high') {
  // Handle high-risk input
}
```

### LLM02: Sensitive Information Disclosure

**Risk:** LLM responses containing PII, credentials, or confidential data

**Mitigations:**
- PII redaction (emails, phone numbers, SSNs, credit cards)
- Credential pattern detection (API keys, tokens, passwords)
- Obfuscation of token counts to prevent inference attacks
- Configurable redaction levels (basic, enterprise, government)

**Implementation:**
```typescript
const security = new TokenSecurityManager({
  enablePIIRedaction: true,
  complianceLevel: 'enterprise',
})

const sanitized = security.redactPII(text)
// Email addresses → [EMAIL]
// Phone numbers → [PHONE]
// SSNs → [SSN]
```

### LLM03: Supply Chain Vulnerabilities

**Risk:** Compromised dependencies or models

**Mitigations:**
- Minimal dependency tree (only essential packages)
- Regular security audits of dependencies
- Subresource Integrity (SRI) for CDN usage
- Deterministic bundle hashes for verification

**Package Dependencies:**
- `gpt-tokenizer` - OpenAI's official tokenizer
- `llm-splitter` - Text chunking (nearform/llm-splitter)
- `llmlingua` - Compression (Microsoft LLMLingua)
- All dependencies vetted and actively maintained

### LLM04: Data and Model Poisoning

**Risk:** Malicious data influencing model behavior

**Mitigations:**
- Input validation before tokenization
- Content-aware compression (preserves semantic integrity)
- Quality monitoring for compression artifacts
- Rollback mechanisms for failed optimizations

**Implementation:**
```typescript
const compressor = new AdaptiveCompressor({
  targetQuality: 0.95, // Maintain 95% quality
  enableQualityMonitoring: true,
})

const result = await compressor.compress(text)
if (result.qualityScore < 0.95) {
  // Reject low-quality compression
}
```

### LLM05: Improper Output Handling

**Risk:** Unsafe rendering of LLM outputs

**Mitigations:**
- XSS pattern detection in outputs
- HTML entity escaping in markdown conversion
- Code injection pattern detection
- Structured output validation

### LLM06: Excessive Agency

**Risk:** LLM taking actions beyond intended scope

**Mitigations:**
- Token budget enforcement
- Cost-aware optimization (prevents runaway costs)
- Budget alerts at 80%, 95%, 100% thresholds
- Automatic optimization disabling on budget exhaustion

**Implementation:**
```typescript
const costOptimizer = new CostAwareOptimizer({
  totalBudget: 100.00, // $100 budget
  enableBudgetTracking: true,
  budgetAlertThresholds: {
    warning: 0.80,
    critical: 0.95,
    emergency: 1.00,
  },
})
```

### LLM07: System Prompt Leakage

**Risk:** Exposure of system prompts through manipulation

**Mitigations:**
- Prompt injection detection (instruction keywords)
- Role-playing attack detection ("Ignore previous instructions")
- System prompt indicators in threat patterns
- Audit logging of suspicious patterns

### LLM08: Vector and Embedding Weaknesses

**Risk:** Manipulation of embedding space or vector DBs

**Mitigations:**
- Semantic chunking preserves context boundaries
- Overlap strategies prevent context loss
- Token-aware chunking respects semantic units
- Quality validation after compression

### LLM09: Misinformation

**Risk:** LLM generating false or misleading information

**Mitigations:**
- Compression quality monitoring
- Semantic preservation validation
- Rollback on quality degradation
- Audit trails for all optimizations

### LLM10: Unbounded Consumption

**Risk:** Resource exhaustion through excessive usage

**Mitigations:**
- Token budget limits
- Cost tracking and alerts
- Automatic throttling on budget limits
- Performance monitoring and circuit breakers

**Implementation:**
```typescript
// Built-in protection
const counter = new AccurateTokenCounter({
  maxTokens: 100000, // Hard limit
})

try {
  const count = counter.count(veryLargeText)
} catch (error) {
  if (error.code === 'TOKEN_LIMIT_EXCEEDED') {
    // Handle gracefully
  }
}
```

---

## Security Features

### 1. Input Sanitization

**Threat Detection:**
- Unicode attacks (zero-width, RTLO, BiDi)
- Homograph attacks (lookalike characters)
- Injection patterns (SQL, XSS, code)
- Prompt manipulation attempts

**Sanitization Actions:**
- Remove invisible characters
- Normalize bidirectional text
- Escape dangerous patterns
- Log all detections

### 2. PII Redaction

**Supported PII Types:**
- Email addresses
- Phone numbers (US and international)
- Social Security Numbers
- Credit card numbers
- IP addresses
- Street addresses
- Dates of birth

**Redaction Levels:**
- `basic`: Email, phone, SSN
- `enterprise`: + credit cards, IPs, addresses
- `government`: + all PII with highest sensitivity

### 3. Compression Obfuscation

**Purpose:** Prevent inference attacks through token count variations

**Mechanism:**
- Round token counts to nearest 5
- Add noise to compression ratios
- Obfuscate exact optimization results
- Configurable noise levels

**Example:**
```typescript
const security = new TokenSecurityManager({
  enableCompressionObfuscation: true,
  noiseLevel: 0.05, // 5% noise
})

const obfuscated = security.obfuscateTokenCount(1234)
// Returns: ~1235 (rounded to nearest 5)
```

### 4. Audit Logging

**Logged Events:**
- All token counting operations
- Compression operations
- Security threat detections
- PII redactions
- Budget threshold breaches

**Audit Entry Format:**
```typescript
{
  timestamp: '2026-01-20T10:30:00Z',
  type: 'token_count',
  riskLevel: 'medium',
  originalLength: 1000,
  processedLength: 950,
  checks: ['prompt_injection', 'pii_redaction'],
  userId: 'user-123',
  sessionId: 'session-456'
}
```

**Compliance:**
- GDPR-compliant logging
- HIPAA audit trail support
- SOC 2 compliance-ready
- Configurable retention periods

---

## Threat Model

### Assets

1. **User Data**
   - Prompts and responses
   - PII in text content
   - Session information

2. **System Resources**
   - Token counting budget
   - API quotas
   - Memory and CPU

3. **System Integrity**
   - Compression quality
   - Token count accuracy
   - Cost tracking

### Threat Actors

1. **Malicious Users**
   - Attempt prompt injection
   - Try to leak system prompts
   - Probe for vulnerabilities

2. **Insider Threats**
   - Access to audit logs
   - Configuration changes
   - Data exfiltration

3. **External Attackers**
   - Supply chain attacks
   - Dependency vulnerabilities
   - API abuse

### Attack Vectors

1. **Input Manipulation**
   - Unicode attacks
   - Homograph attacks
   - Injection attempts
   - **Mitigation:** Input sanitization + audit logging

2. **Resource Exhaustion**
   - Large input processing
   - Excessive API calls
   - Memory exhaustion
   - **Mitigation:** Budget limits + monitoring

3. **Data Exfiltration**
   - PII exposure in logs
   - Token count inference
   - Audit log access
   - **Mitigation:** PII redaction + obfuscation + access controls

### Security Controls

```
Input → Sanitization → Validation → Processing → Audit → Output
         ↓               ↓              ↓          ↓        ↓
      Threats        Limits         Monitor     Log    Obfuscate
```

---

## Security Configuration

### Recommended Production Config

```typescript
import { TokenSecurityManager } from '@clarity-chat/token-optimization'

const security = new TokenSecurityManager({
  // Input Protection
  enableSanitization: true,
  enablePIIRedaction: true,

  // Audit and Compliance
  enableAuditLogging: true,
  auditRetention: 90, // 90 days

  // Compliance Level
  complianceLevel: 'enterprise', // or 'basic', 'government'

  // Output Protection
  enableCompressionObfuscation: true,
  noiseLevel: 0.05,
})
```

### Compliance Configurations

**Basic (OWASP LLM Compliance):**
```typescript
{
  enableSanitization: true,
  enablePIIRedaction: true,
  enableAuditLogging: true,
  complianceLevel: 'basic'
}
```

**Enterprise (SOC 2, GDPR):**
```typescript
{
  enableSanitization: true,
  enablePIIRedaction: true,
  enableAuditLogging: true,
  enableCompressionObfuscation: true,
  complianceLevel: 'enterprise',
  auditRetention: 365
}
```

**Government (HIPAA, FedRAMP):**
```typescript
{
  enableSanitization: true,
  enablePIIRedaction: true,
  enableAuditLogging: true,
  enableCompressionObfuscation: true,
  complianceLevel: 'government',
  auditRetention: 2555, // 7 years
  noiseLevel: 0.10
}
```

---

## PII Redaction

### Supported Patterns

```typescript
// Email addresses
"user@example.com" → "[EMAIL]"

// Phone numbers
"+1-555-123-4567" → "[PHONE]"
"(555) 123-4567" → "[PHONE]"

// Social Security Numbers
"123-45-6789" → "[SSN]"
"123456789" → "[SSN]"

// Credit cards
"4532-1234-5678-9010" → "[CREDIT_CARD]"

// IP addresses
"192.168.1.1" → "[IP_ADDRESS]"

// Addresses
"123 Main St, City, ST 12345" → "[ADDRESS]"
```

### Custom Redaction

```typescript
const security = new TokenSecurityManager({
  enablePIIRedaction: true,
  customRedactionPatterns: [
    {
      pattern: /\b[A-Z0-9]{10}\b/g,
      replacement: '[CUSTOM_ID]',
      description: 'Custom 10-char IDs',
    },
  ],
})
```

---

## Audit Logging

### Enabling Audit Logs

```typescript
const security = new TokenSecurityManager({
  enableAuditLogging: true,
  auditRetention: 90, // days
})

// Operations are automatically logged
const result = security.sanitizeInput(userInput)
```

### Accessing Audit Logs

```typescript
// Get recent security events
const events = security.getAuditLog({
  since: new Date('2026-01-01'),
  riskLevel: 'high',
})

events.forEach((event) => {
  console.log(`${event.timestamp}: ${event.type} - ${event.riskLevel}`)
})
```

### Compliance Reporting

```typescript
// Generate compliance report
const report = security.generateComplianceReport()

console.log(`Total events: ${report.totalEvents}`)
console.log(`High risk: ${report.highRiskEvents}`)
console.log(`PII redactions: ${report.piiRedactions}`)
console.log(`Threat detections: ${report.threatsDetected.length}`)
```

---

## Best Practices

### 1. Always Enable Security Features in Production

```typescript
// ❌ BAD: No security
const counter = new AccurateTokenCounter()

// ✅ GOOD: Security enabled
const security = new TokenSecurityManager({
  enableSanitization: true,
  enablePIIRedaction: true,
  enableAuditLogging: true,
})

const counter = new AccurateTokenCounter({
  securityManager: security,
})
```

### 2. Use Appropriate Compliance Levels

```typescript
// For healthcare applications
const security = new TokenSecurityManager({
  complianceLevel: 'government', // HIPAA
  auditRetention: 2555, // 7 years
})

// For general SaaS
const security = new TokenSecurityManager({
  complianceLevel: 'enterprise', // SOC 2, GDPR
  auditRetention: 365,
})
```

### 3. Monitor Security Events

```typescript
// Set up alerting for high-risk events
security.on('high-risk-event', (event) => {
  alertSecurityTeam(event)
  logToSIEM(event)
})
```

### 4. Regular Security Audits

```typescript
// Weekly compliance check
setInterval(() => {
  const report = security.generateComplianceReport()

  if (report.highRiskEvents > threshold) {
    triggerSecurityReview()
  }
}, 7 * 24 * 60 * 60 * 1000) // 1 week
```

### 5. Secure Configuration Storage

```typescript
// ❌ BAD: Hardcoded API keys
const counter = new ProviderNativeCounter({
  apiKey: 'sk-1234567890',
})

// ✅ GOOD: Environment variables
const counter = new ProviderNativeCounter({
  apiKey: process.env.ANTHROPIC_API_KEY,
})
```

### 6. Validate All Inputs

```typescript
// Always sanitize user input
const sanitized = security.sanitizeInput(userInput)

if (sanitized.riskLevel === 'high') {
  throw new Error('Input rejected due to security risk')
}

// Proceed with sanitized input
const count = counter.count(sanitized.sanitized)
```

### 7. Implement Budget Limits

```typescript
// Prevent runaway costs
const costOptimizer = new CostAwareOptimizer({
  totalBudget: 1000.00,
  enableBudgetTracking: true,
  budgetAlertThresholds: {
    warning: 0.80,
    critical: 0.95,
    emergency: 1.00,
  },
})

// Alerts automatically triggered
costOptimizer.on('budget-warning', () => {
  notifyAdmin('80% budget reached')
})
```

---

## Reporting Security Issues

### Responsible Disclosure

**DO NOT** open public GitHub issues for security vulnerabilities.

Instead, please email: **security@clarity-chat.com**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Response Timeline

- **24 hours:** Acknowledgment of report
- **72 hours:** Initial assessment
- **7 days:** Fix development (for critical issues)
- **14 days:** Patch release
- **30 days:** Public disclosure (if appropriate)

### Security Updates

Subscribe to security advisories:
- GitHub Security Advisories: `@clarity-chat/token-optimization`
- NPM Security Alerts: Enabled by default

---

## Security Checklist

Before deploying to production:

- [ ] Enable input sanitization
- [ ] Enable PII redaction
- [ ] Enable audit logging
- [ ] Set appropriate compliance level
- [ ] Configure budget limits
- [ ] Set up security event monitoring
- [ ] Configure secure credential storage
- [ ] Review audit log retention policy
- [ ] Test security features in staging
- [ ] Document security configuration

---

**For questions about security features, see:** [ARCHITECTURE.md](./ARCHITECTURE.md)

**Last Updated:** 2026-01-20
**Security Pattern Version:** 2.0.0-owasp-2026
