# Memory System - Privacy & Data Safety Review

**Phase:** 3 - Privacy & Data Safety Review
**Date:** 2026-01-22
**Status:** CRITICAL PRIVACY RISKS IDENTIFIED

---

## EXECUTIVE SUMMARY

The memory system has **CRITICAL PRIVACY AND DATA SAFETY ISSUES** that make it **unsuitable for production use with personal data** without significant remediation.

**Risk Level:** 🔴 **CRITICAL** - Not GDPR/CCPA compliant

**Key Findings:**
- Automatic capture of user messages containing PII
- No explicit consent mechanism
- Incomplete right-to-erasure implementation
- Unbounded data retention
- No data minimization strategy
- Missing audit trail for data operations

---

## PRIVACY THREAT MODEL

### Threat Actors
1. **Malicious Insider:** Access to memory storage backend
2. **External Attacker:** Compromise of storage backend
3. **Unintentional Exposure:** Developer misconfiguration
4. **Regulatory Audit:** GDPR/CCPA compliance verification

### Protected Assets
1. **User Messages:** Chat content (may contain PII)
2. **User Preferences:** Personal preferences and settings
3. **Conversation History:** Full thread context
4. **Metadata:** Timestamps, IDs, roles
5. **Embeddings:** Vector representations (can leak information)

### Attack Vectors
1. **Automatic Capture:** Silent collection without consent
2. **Indefinite Retention:** No automatic expiration
3. **Incomplete Deletion:** Data persists after delete request
4. **Scope Leakage:** Session data becomes global
5. **Cache Poisoning:** Stale data in memory cache

---

## CRITICAL PRIVACY ISSUES

### 🚨 PRIVACY ISSUE #1: AUTOMATIC PII COLLECTION (SEVERITY: CRITICAL)

**Reference:** Correctness Issue #1

**Description:**
All user and assistant messages are **automatically captured to memory** when `memory.enabled = true`, with **no explicit consent mechanism**.

**PII Risk:**
Users naturally share PII in chat conversations:
- Names ("My name is John Smith")
- Email addresses ("Contact me at john@example.com")
- Phone numbers ("Call me at 555-1234")
- Addresses ("I live at 123 Main St")
- SSN, credit cards, health information
- Location data, IP addresses
- Biometric data (in future voice/video features)

**GDPR Violations:**
- ❌ **Article 5(1)(a):** Lawfulness, fairness, transparency
  - No transparent disclosure of data collection
  - Users unaware their messages are persistently stored
- ❌ **Article 6:** Legal basis for processing
  - No explicit consent obtained
  - No legitimate interest assessment
- ❌ **Article 7:** Conditions for consent
  - No clear affirmative action required
  - Cannot be inferred from enabling a "memory" feature
- ❌ **Article 25:** Data protection by design and default
  - Privacy is not the default (auto-capture when enabled)
  - No built-in privacy protections

**CCPA Violations:**
- ❌ **§ 1798.100:** Right to know what personal information is collected
  - No disclosure that messages are stored
- ❌ **§ 1798.120:** Right to opt-out of sale
  - No opt-out mechanism for collection itself

**Recommended Mitigations:**
1. **Explicit Opt-In:** Require `memory.autoCapture = true` AND user consent
2. **Consent UI:** Show consent banner/modal before first capture
3. **Per-Message Control:** Allow opting out individual messages
4. **PII Detection:** Auto-detect and flag/redact common PII patterns
5. **Privacy Mode:** Ephemeral mode that never persists (session-only)
6. **Clear Disclosure:** Prominent documentation of data collection

**Priority:** P0 (Legal/regulatory blocker)

---

### 🚨 PRIVACY ISSUE #2: INCOMPLETE RIGHT TO ERASURE (SEVERITY: CRITICAL)

**Reference:** Correctness Issue #10

**Description:**
Users cannot fully delete their data. The memory system lacks:
- Bulk delete by user ID
- Verification that data is truly deleted
- Cascade delete across all storage layers
- Audit trail of deletions

**GDPR Violations:**
- ❌ **Article 17:** Right to erasure ("right to be forgotten")
  - Cannot delete all user data with single operation
  - No verification that deletion is complete
  - Embeddings may persist in vector store after content deleted
  - Cache may retain deleted data

**CCPA Violations:**
- ❌ **§ 1798.105:** Right to deletion
  - Cannot honor deletion requests completely
  - No confirmation of deletion

**Evidence:**
- No `deleteAllUserData(userId)` method
- `delete(id)` only removes from cache, not guaranteed from vector store
- Stale cache issue (Issue #13) means deleted data may still be queryable
- No deletion verification or audit trail

**Recommended Mitigations:**
1. **Implement Full Erasure:** `deleteAllUserData(userId)` that:
   - Deletes from cache
   - Deletes from buffer
   - Deletes from all vector stores
   - Deletes embeddings
   - Verifies deletion
   - Logs deletion event
2. **Deletion Verification:** Return confirmation with counts
3. **Audit Trail:** Log all deletion requests with timestamps
4. **Scheduled Deletion:** Support delayed deletion (30 days) with user confirmation
5. **Data Export:** Provide data export before deletion (GDPR Article 20)

**Priority:** P0 (Legal/regulatory blocker)

---

### 🚨 PRIVACY ISSUE #3: UNBOUNDED DATA RETENTION (SEVERITY: HIGH)

**Reference:** Correctness Issue #6

**Description:**
Memory is retained **indefinitely by default** with:
- No automatic expiration
- No retention limits
- No data minimization
- No aging-out of old data

**GDPR Violations:**
- ❌ **Article 5(1)(e):** Storage limitation
  - "Personal data shall be kept in a form which permits identification of data subjects for no longer than is necessary"
  - No retention limits enforced
- ❌ **Article 5(1)(c):** Data minimization
  - All messages stored, not just necessary ones
  - No filtering or reduction over time

**CCPA Violations:**
- ❌ **§ 1798.105:** Right to deletion
  - Old data not automatically deleted
  - No retention policy disclosure

**Recommended Mitigations:**
1. **Default TTL:** Set reasonable default expiration:
   - Episodic (chat messages): 30 days
   - Semantic (facts): 90 days
   - Session: Clear on logout
   - Profile: 1 year
2. **Retention Policy Config:** `retentionPolicy: { [type]: { ttl: number } }`
3. **Auto-Cleanup:** Enable decay by default with reasonable policies
4. **Storage Limits:** `maxMemories`, `maxTokens`, `maxStorageSize`
5. **Data Aging:** Automatically compress old memories
6. **Disclosure:** Document retention periods in privacy policy

**Priority:** P0 (Regulatory requirement)

---

### 🚨 PRIVACY ISSUE #4: NO DATA PROCESSING RECORDS (SEVERITY: HIGH)

**Description:**
No audit trail or records of processing activities:
- No log of what data was collected
- No log of who accessed data
- No log of data deletions
- No log of data modifications
- No log of data exports

**GDPR Violations:**
- ❌ **Article 30:** Records of processing activities
  - Must maintain records of data processing
  - Must be able to demonstrate compliance
- ❌ **Article 5(2):** Accountability
  - "The controller shall be responsible for, and be able to demonstrate compliance"
  - No way to demonstrate compliance without logs

**Recommended Mitigations:**
1. **Audit Log:** Implement comprehensive audit logging:
   ```typescript
   interface AuditEvent {
     timestamp: Date
     userId: string
     operation: 'create' | 'read' | 'update' | 'delete' | 'export'
     memoryId?: string
     metadata: Record<string, any>
   }
   ```
2. **Event Tracking:** Log all memory operations
3. **Access Logging:** Track who accessed what data when
4. **Retention for Logs:** Keep audit logs for required period (varies by jurisdiction)
5. **Export Capability:** Allow exporting audit logs
6. **Tamper-Proof:** Store logs in append-only storage

**Priority:** P1 (Compliance requirement)

---

### 🚨 PRIVACY ISSUE #5: SCOPE LEAKAGE RISK (SEVERITY: HIGH)

**Reference:** Correctness Issue #7

**Description:**
No validation prevents:
- Session-scoped PII from being promoted to global
- Thread-scoped data from leaking to other threads
- User-scoped data from becoming globally accessible
- Accidental scope widening

**Privacy Impact:**
- User A's session data could become visible to User B
- Personal preferences could leak globally
- Conversation context could cross thread boundaries
- Sensitive data could persist beyond intended lifetime

**Recommended Mitigations:**
1. **Scope Hierarchy Enforcement:**
   ```
   session → thread → user → global
   (most private)  →  (least private)
   ```
2. **Promotion Restrictions:**
   - Require explicit confirmation for scope widening
   - Block promotion of PII-flagged memories
   - Warn on potential privacy impact
3. **Scope Isolation:** Ensure queries respect scope boundaries strictly
4. **User Association:** Always associate memories with user ID for accountability

**Priority:** P1 (Privacy protection)

---

### ⚠️ PRIVACY ISSUE #6: EMBEDDINGS LEAK INFORMATION (SEVERITY: MEDIUM)

**Description:**
Vector embeddings can leak information about original content:
- Research shows embeddings can be partially inverted
- Embeddings stored in vector store may outlive content
- No encryption of embeddings at rest
- No control over embedding provider data handling

**Privacy Impact:**
- Deleted content may be reconstructed from embeddings
- Embeddings stored longer than content
- Third-party embedding providers (OpenAI, etc.) process all content
- No data residency guarantees

**Recommended Mitigations:**
1. **Embedding Deletion:** Always delete embeddings when deleting content
2. **Encryption:** Encrypt embeddings at rest
3. **Local Embeddings:** Provide option for local embedding models
4. **Provider Disclosure:** Warn about third-party processing
5. **Zero-Retention Providers:** Use providers with zero data retention (if available)
6. **Consent for Embeddings:** Separate consent for embedding generation

**Priority:** P1 (Data protection)

---

### ⚠️ PRIVACY ISSUE #7: NO DATA MINIMIZATION (SEVERITY: MEDIUM)

**Description:**
Every message is stored in full with no reduction:
- Full message content stored
- All metadata included
- No filtering of unnecessary information
- No distinction between important and trivial data

**GDPR Violations:**
- ❌ **Article 5(1)(c):** Data minimization
  - "Adequate, relevant and limited to what is necessary"
  - Storing everything violates minimization principle

**Recommended Mitigations:**
1. **Selective Capture:** Only capture important messages (developer decides)
2. **Content Filtering:** Remove unnecessary parts (e.g., greetings, pleasantries)
3. **PII Redaction:** Auto-redact detected PII before storage
4. **Summarization First:** Store summaries instead of full content for old data
5. **Importance Threshold:** Only persist memories above importance threshold

**Priority:** P2 (Best practice)

---

### ⚠️ PRIVACY ISSUE #8: NO ENCRYPTION AT REST (SEVERITY: MEDIUM)

**Description:**
Memory content is stored unencrypted in:
- File store (plain JSON)
- IndexedDB (browser storage, unencrypted)
- In-memory cache (plain objects)
- Vector store (depends on backend)

**Privacy Impact:**
- Data readable by anyone with file system access
- Browser storage accessible via DevTools
- Memory dumps expose plain text data
- Database compromise exposes all data

**Recommended Mitigations:**
1. **Encryption at Rest:** Encrypt sensitive fields before storage:
   - `content` field
   - `metadata` with PII
   - Embeddings
2. **Key Management:** Secure key storage (not in code)
3. **User-Controlled Keys:** Allow users to provide encryption keys
4. **Field-Level Encryption:** Encrypt only sensitive fields, not IDs/timestamps
5. **Documentation:** Document encryption status clearly

**Priority:** P2 (Security hardening)

---

### ⚠️ PRIVACY ISSUE #9: NO CONSENT MANAGEMENT (SEVERITY: HIGH)

**Description:**
No built-in consent management system:
- No way to record user consent
- No way to revoke consent
- No way to audit consent status
- No integration with consent management platforms

**GDPR Violations:**
- ❌ **Article 7:** Conditions for consent
  - Must be able to demonstrate consent was given
  - Must be as easy to withdraw consent as to give it
- ❌ **Article 7(3):** Withdrawal of consent
  - No mechanism to withdraw consent

**Recommended Mitigations:**
1. **Consent API:**
   ```typescript
   interface ConsentManager {
     recordConsent(userId: string, purpose: string): Promise<void>
     withdrawConsent(userId: string, purpose: string): Promise<void>
     hasConsent(userId: string, purpose: string): Promise<boolean>
     getConsentHistory(userId: string): Promise<ConsentEvent[]>
   }
   ```
2. **Consent Purposes:** Define specific purposes:
   - `message_storage` - Store chat messages
   - `preference_storage` - Store user preferences
   - `analytics` - Use data for analytics
   - `embeddings` - Generate and store embeddings
3. **Granular Control:** Allow per-purpose consent
4. **Consent UI:** Provide React component for consent management
5. **Integration:** Allow integration with external consent platforms

**Priority:** P0 (Legal requirement)

---

### ⚠️ PRIVACY ISSUE #10: NO DATA PORTABILITY (SEVERITY: MEDIUM)

**Description:**
No way for users to export their data in standard format:
- No export API
- No data format specification
- Cannot move data between systems
- No interoperability

**GDPR Violations:**
- ❌ **Article 20:** Right to data portability
  - "The data subject shall have the right to receive the personal data concerning him or her...in a structured, commonly used and machine-readable format"

**Recommended Mitigations:**
1. **Export API:**
   ```typescript
   exportUserData(userId: string, format: 'json' | 'csv' | 'xml'): Promise<Blob>
   ```
2. **Standard Format:** Use standard schema (JSON-LD, etc.)
3. **Complete Export:** Include all data:
   - All memories (all scopes)
   - Metadata
   - Timestamps
   - Audit logs
4. **Encrypted Export:** Optional encrypted export
5. **Import API:** Allow importing data from export

**Priority:** P1 (Regulatory requirement)

---

### ⚠️ PRIVACY ISSUE #11: NO PRIVACY POLICY INTEGRATION (SEVERITY: LOW)

**Description:**
No way to:
- Link to privacy policy
- Display privacy policy at consent time
- Version privacy policy updates
- Notify users of policy changes

**Recommended Mitigations:**
1. **Privacy Policy Config:**
   ```typescript
   {
     privacyPolicy: {
       url: 'https://example.com/privacy',
       version: '1.0',
       lastUpdated: '2024-01-01'
     }
   }
   ```
2. **Policy Display:** Show policy before consent
3. **Version Tracking:** Track which version user consented to
4. **Update Notifications:** Notify on policy changes

**Priority:** P2 (Best practice)

---

## PRIVACY BY DESIGN VIOLATIONS

### Missing Privacy Principles

| GDPR Principle | Status | Violation |
|----------------|--------|-----------|
| Lawfulness, fairness, transparency | ❌ | Silent data collection, no transparency |
| Purpose limitation | ❌ | No defined purposes for data use |
| Data minimization | ❌ | Stores all messages, no filtering |
| Accuracy | ⚠️ | No data correction mechanism |
| Storage limitation | ❌ | Indefinite retention by default |
| Integrity and confidentiality | ❌ | No encryption, no access controls |
| Accountability | ❌ | No audit logs, no compliance demos |

---

## DATA SUBJECT RIGHTS COMPLIANCE

| Right | GDPR Article | Status | Implementation |
|-------|--------------|--------|----------------|
| Right to be informed | 13-14 | ❌ | No privacy notices |
| Right of access | 15 | ⚠️ | Can query own data, but no formal export |
| Right to rectification | 16 | ❌ | No data correction API |
| Right to erasure | 17 | ❌ | Incomplete deletion |
| Right to restrict processing | 18 | ❌ | No processing restriction |
| Right to data portability | 20 | ❌ | No export API |
| Right to object | 21 | ❌ | No objection mechanism |
| Rights related to automated decision-making | 22 | N/A | Not applicable (no automated decisions) |

**Compliance Score: 1/8 = 12.5%** 🔴

---

## RECOMMENDED PRIVACY ARCHITECTURE

### Privacy-First Design

```typescript
interface PrivacyConfig {
  // Consent management
  requireConsent: boolean // Default: true
  consentPurposes: string[] // ['message_storage', 'embeddings', etc.]
  consentUI: React.ComponentType<ConsentUIProps>

  // Data minimization
  autoCapture: false // Default: false (explicit opt-in)
  piiDetection: boolean // Default: true
  piiRedaction: 'mask' | 'remove' | 'flag' // Default: 'flag'
  contentFiltering: boolean // Remove unnecessary content

  // Retention & deletion
  retentionPolicies: {
    [type in MemoryType]: {
      ttl: number // milliseconds
      autoDelete: boolean
    }
  }
  hardDelete: boolean // Default: true (no soft delete)
  verifyDeletion: boolean // Default: true

  // Encryption
  encryptAtRest: boolean // Default: true
  encryptionKey?: string // User-provided or generated
  fieldEncryption: string[] // Fields to encrypt

  // Audit & compliance
  auditLog: boolean // Default: true
  auditRetention: number // Days to keep audit logs
  exportFormat: 'json' | 'csv' | 'xml' // Default: 'json'

  // Access control
  accessControl: {
    readOwnDataOnly: boolean // Default: true
    crossUserAccess: false // Default: false
  }

  // Disclosure
  privacyPolicy: {
    url: string
    version: string
    lastUpdated: string
  }

  // Local-first options
  localEmbeddings: boolean // Use local model, not API
  localStorage: boolean // No external storage
}
```

### Default Configuration (Privacy-First)

```typescript
const DEFAULT_PRIVACY_CONFIG: PrivacyConfig = {
  requireConsent: true,
  autoCapture: false, // ✅ Explicit opt-in
  piiDetection: true,
  piiRedaction: 'flag',
  retentionPolicies: {
    episodic: { ttl: 30 * 24 * 60 * 60 * 1000, autoDelete: true }, // 30 days
    semantic: { ttl: 90 * 24 * 60 * 60 * 1000, autoDelete: true }, // 90 days
    session: { ttl: 0, autoDelete: true }, // Clear on logout
    profile: { ttl: 365 * 24 * 60 * 60 * 1000, autoDelete: false }, // 1 year
  },
  hardDelete: true,
  verifyDeletion: true,
  encryptAtRest: true,
  auditLog: true,
  auditRetention: 90, // 90 days
  accessControl: {
    readOwnDataOnly: true,
    crossUserAccess: false,
  },
}
```

---

## MITIGATION ROADMAP

### Phase 1: Critical Fixes (P0) - Immediate

1. **Disable Auto-Capture by Default**
   - Set `autoCapture: false`
   - Require explicit `captureMessage()` calls
   - Add prominent warning in docs

2. **Implement Consent Management**
   - Add consent API
   - Add consent UI component
   - Require consent before first capture

3. **Implement Full Deletion**
   - Add `deleteAllUserData(userId)`
   - Verify deletion across all storage
   - Add deletion audit trail

4. **Add Default Retention Policies**
   - Set reasonable TTLs by default
   - Enable auto-deletion
   - Document retention periods

### Phase 2: High-Priority Fixes (P1) - Short-term

5. **Add Audit Logging**
   - Log all data operations
   - Track access and modifications
   - Provide audit export

6. **Implement Scope Validation**
   - Enforce scope hierarchy
   - Prevent leakage
   - Add user association

7. **Add Data Export API**
   - Implement export function
   - Support standard formats
   - Include all user data

8. **Secure Embeddings**
   - Delete embeddings on content deletion
   - Add encryption option
   - Provide local embedding option

### Phase 3: Improvements (P2) - Medium-term

9. **Add Encryption at Rest**
   - Encrypt sensitive fields
   - Support user-provided keys
   - Document encryption status

10. **Implement Data Minimization**
    - Add PII detection/redaction
    - Filter unnecessary content
    - Summarize old data

11. **Add Privacy Policy Integration**
    - Link to privacy policy
    - Track consent versions
    - Notify on updates

---

## COMPLIANCE CHECKLIST

### Before Production Deployment

- [ ] Disable auto-capture by default
- [ ] Implement and require consent management
- [ ] Add privacy policy disclosure
- [ ] Implement full deletion capability
- [ ] Add audit logging
- [ ] Set default retention policies
- [ ] Enable auto-deletion
- [ ] Add data export API
- [ ] Implement scope validation
- [ ] Add encryption at rest
- [ ] Document all data flows
- [ ] Conduct privacy impact assessment (PIA)
- [ ] Appoint data protection officer (if required)
- [ ] Establish data processing agreements with vendors
- [ ] Test deletion and export functionality
- [ ] Create privacy documentation for users

### Ongoing Compliance

- [ ] Regular privacy audits
- [ ] Monitor consent status
- [ ] Review retention policies
- [ ] Update privacy policy as needed
- [ ] Train developers on privacy requirements
- [ ] Maintain audit logs
- [ ] Respond to data subject requests within 30 days
- [ ] Report data breaches within 72 hours (if applicable)

---

## PHASE 3 STATUS: COMPLETE

**Risk Level:** 🔴 CRITICAL
**Compliance Score:** 12.5% (1/8 data subject rights implemented)
**Blockers:** 5 P0 privacy issues identified
**Recommendation:** **DO NOT deploy to production with personal data until P0 issues resolved**

**Next Phase:** Phase 4 - Streaming, Tool & Memory Interaction Audit
