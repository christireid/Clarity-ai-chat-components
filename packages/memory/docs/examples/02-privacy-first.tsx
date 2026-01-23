/**
 * Example 2: Privacy-First Implementation
 *
 * Demonstrates GDPR/CCPA compliant memory usage with consent management,
 * data rights implementation, and audit logging.
 */

import { clarityMemory } from '@clarity-chat/memory'
import type { ConsentRecord } from '@clarity-chat/memory'

async function privacyFirstExample() {
  // Initialize with privacy features enabled
  const memory = clarityMemory({
    privacy: {
      enabled: true,
      requireConsent: true,
      purposes: ['personalization', 'analytics', 'improvement'],
    },
    audit: {
      enabled: true,
      retentionDays: 90,
    },
  })

  const userId = 'user_123'

  // 1. Check consent status
  const consentStatus = await memory.checkConsent(userId)
  console.log('Has consent?', consentStatus.granted)

  // 2. Grant consent before storing memories
  await memory.grantConsent(userId, {
    scopes: ['user', 'thread', 'session'],
    purposes: ['personalization', 'analytics'],
    expiresAt: new Date('2026-12-31'),
  })

  console.log('Consent granted')

  // 3. Now we can store user-scoped memories
  await memory.add('User prefers dark mode', {
    type: 'semantic',
    scope: 'user',
    metadata: {
      userId,
      category: 'preferences',
    },
    priority: 'high',
  })

  console.log('Memory stored (with consent)')

  // 4. Export user data (Right to Access)
  const exportedData = await memory.exportUserData(userId)
  console.log('Exported data:', {
    memoryCount: exportedData.memories.length,
    consent: exportedData.consent,
    auditLog: exportedData.auditLog?.length,
  })

  // 5. Verify consent for specific purpose
  const canPersonalize = await memory.hasConsentForPurpose(
    userId,
    'personalization'
  )
  console.log('Can personalize?', canPersonalize)

  // 6. Revoke consent (GDPR Right to Withdraw)
  await memory.revokeConsent(userId, {
    purposes: ['analytics'], // Partial revocation
  })

  console.log('Analytics consent revoked')

  // 7. Delete all user data (Right to Erasure)
  const deletionResult = await memory.deleteUserData(userId, {
    includeScopes: ['user', 'thread', 'session'],
    auditLog: true,
  })

  console.log('Deletion result:', {
    deleted: deletionResult.deletedCount,
    verified: deletionResult.verified,
  })

  // 8. Verify complete deletion
  const verification = await memory.verifyUserDeletion(userId)
  console.log('Deletion verified:', verification.isComplete)
}

// React Component with Consent Management
import React, { useState, useEffect } from 'react'
import { useMemoryConsent, useMemoryService } from '@clarity-chat/memory'

export function ConsentDialog({ userId }: { userId: string }) {
  const {
    hasConsent,
    grantConsent,
    revokeConsent,
    checkConsent,
    consentRecords,
    loading,
  } = useMemoryConsent(userId)

  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([
    'personalization',
  ])

  const handleGrant = async () => {
    await grantConsent({
      scopes: ['user', 'thread'],
      purposes: selectedPurposes,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    })
  }

  const handleRevoke = async () => {
    await revokeConsent({
      purposes: selectedPurposes,
    })
  }

  if (loading) {
    return <div>Loading consent status...</div>
  }

  if (hasConsent) {
    return (
      <div className="consent-granted">
        <h3>✅ Consent Granted</h3>
        <p>Memory storage is enabled for:</p>
        <ul>
          {consentRecords.map((record) => (
            <li key={record.id}>
              {record.purposes.join(', ')}
              <small> (expires: {record.expiresAt?.toLocaleDateString()})</small>
            </li>
          ))}
        </ul>
        <button onClick={handleRevoke}>Revoke Consent</button>
      </div>
    )
  }

  return (
    <div className="consent-dialog">
      <h3>🔒 Memory Consent Required</h3>
      <p>
        We'd like to store information about your conversations to personalize
        your experience. You can withdraw consent at any time.
      </p>

      <div>
        <h4>Select purposes:</h4>
        <label>
          <input
            type="checkbox"
            checked={selectedPurposes.includes('personalization')}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedPurposes([...selectedPurposes, 'personalization'])
              } else {
                setSelectedPurposes(
                  selectedPurposes.filter((p) => p !== 'personalization')
                )
              }
            }}
          />
          Personalization
        </label>
        <label>
          <input
            type="checkbox"
            checked={selectedPurposes.includes('analytics')}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedPurposes([...selectedPurposes, 'analytics'])
              } else {
                setSelectedPurposes(
                  selectedPurposes.filter((p) => p !== 'analytics')
                )
              }
            }}
          />
          Analytics
        </label>
      </div>

      <button onClick={handleGrant} disabled={selectedPurposes.length === 0}>
        Grant Consent
      </button>
    </div>
  )
}

// Data Export Component (Right to Access)
export function DataExportButton({ userId }: { userId: string }) {
  const memory = useMemoryService()
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    setExporting(true)
    try {
      const data = await memory.exportUserData(userId)

      // Create downloadable JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `memory-export-${userId}-${Date.now()}.json`
      link.click()
      URL.revokeObjectURL(url)
    } finally {
      setExporting(false)
    }
  }

  return (
    <button onClick={handleExport} disabled={exporting}>
      {exporting ? 'Exporting...' : 'Export My Data'}
    </button>
  )
}

// Account Deletion Component (Right to Erasure)
export function DeleteAccountButton({ userId }: { userId: string }) {
  const memory = useMemoryService()
  const [deleting, setDeleting] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const handleDelete = async () => {
    if (!confirmed) {
      setConfirmed(true)
      return
    }

    setDeleting(true)
    try {
      const result = await memory.deleteUserData(userId, {
        includeScopes: ['user', 'thread', 'session'],
        auditLog: true,
      })

      if (result.verified) {
        alert(`Successfully deleted ${result.deletedCount} memories`)
        // Redirect to logout or home page
      } else {
        alert('Deletion may be incomplete. Please contact support.')
      }
    } finally {
      setDeleting(false)
      setConfirmed(false)
    }
  }

  if (confirmed) {
    return (
      <div className="delete-confirmation">
        <p>⚠️ This will permanently delete all your data. Are you sure?</p>
        <button onClick={handleDelete} disabled={deleting}>
          {deleting ? 'Deleting...' : 'Yes, Delete Everything'}
        </button>
        <button onClick={() => setConfirmed(false)}>Cancel</button>
      </div>
    )
  }

  return (
    <button onClick={handleDelete} className="danger">
      Delete My Account
    </button>
  )
}

// Run the example
if (require.main === module) {
  privacyFirstExample().catch(console.error)
}
