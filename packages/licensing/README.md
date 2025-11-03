# @clarity-chat/licensing

**License validation and management for Clarity Chat commercial tiers**

This package provides license key generation, validation, and feature management for Clarity Chat's commercial licensing system.

---

## Installation

```bash
npm install @clarity-chat/licensing
```

---

## Usage

### Generate License Keys (Server-side only)

```typescript
import { generateLicenseKey } from '@clarity-chat/licensing'

// Generate Pro Individual license
const license = generateLicenseKey({
  tier: 'pro-individual',
  type: 'annual',
  email: 'customer@example.com',
  expirationMonths: 12,
})

console.log(license.key) // PRO-IND-ANN-ABC123DEF456GHI
```

### Validate License Keys

```typescript
import { validateLicense } from '@clarity-chat/licensing'

// Validate a license key
const result = await validateLicense('PRO-IND-ANN-ABC123DEF456GHI', {
  validationEndpoint: 'https://api.clarity-chat.dev/validate',
})

if (result.valid) {
  console.log('License is valid!')
  console.log('Tier:', result.license.tier)
  console.log('Seats:', result.license.seats)
  console.log('Expires:', result.license.expiresAt)
} else {
  console.error('Invalid license:', result.error)
}
```

### Check Features

```typescript
import { getLicenseFeatures, hasFeature } from '@clarity-chat/licensing'

// Get all features for a tier
const features = getLicenseFeatures('pro-team')
console.log('Components:', features.components.length)
console.log('Themes:', features.themes)
console.log('Support:', features.supportLevel)

// Check if specific feature is available
const canUseVoice = hasFeature('pro-individual', 'VoiceInput')
const canWhiteLabel = hasFeature('enterprise', 'white-label')
```

### Development Mode

```typescript
// Skip validation in development
const result = await validateLicense('any-key', {
  devMode: true, // Always returns valid
})
```

---

## License Tiers

### Free Tier
- **Components:** 15+ core primitives and basic chat
- **Themes:** 3 (default, dark, minimal)
- **AI Providers:** None
- **Support:** Community only
- **SaaS:** Not allowed

### Pro Individual
- **Price:** $149/year or $499 lifetime
- **Components:** 55+ including advanced features
- **Themes:** 11 premium themes
- **AI Providers:** 4 (OpenAI, Anthropic, Azure, Google)
- **Analytics:** 1 provider
- **Error Tracking:** 1 provider
- **Support:** Email (48h response)
- **Seats:** 1 developer
- **SaaS:** Not allowed

### Pro Team
- **Price:** $499/year or $1,499 lifetime
- **Components:** Same as Pro Individual
- **Themes:** Same as Pro Individual
- **Support:** Priority email (24h response)
- **Seats:** 5 developers (+$99/seat for more)
- **SaaS:** Not allowed

### Enterprise
- **Price:** Starting at $2,499/year
- **Components:** 70+ including enterprise-exclusive
- **Themes:** Unlimited + custom
- **AI Providers:** Unlimited + custom
- **Analytics:** Unlimited + custom
- **Error Tracking:** Unlimited + custom
- **Enterprise Features:** SSO, RBAC, multi-tenant, audit logs
- **Support:** Dedicated engineer (4h SLA)
- **Seats:** 10-Unlimited
- **White-Label:** Yes
- **SaaS:** Yes

---

## API Reference

### `generateLicenseKey(options)`

Generate a new license key (server-side only).

**Parameters:**
- `tier`: `'free' | 'pro-individual' | 'pro-team' | 'enterprise'`
- `type`: `'annual' | 'lifetime'`
- `email`: Customer email address
- `company?`: Company name (optional)
- `seats?`: Number of developer seats (default varies by tier)
- `expirationMonths?`: Expiration in months (default: 12, ignored for lifetime)

**Returns:** `LicenseKey`

### `validateLicense(key, config?)`

Validate a license key.

**Parameters:**
- `key`: License key string
- `config?`: Validation configuration
  - `validationEndpoint?`: API endpoint for online validation
  - `enableOfflineValidation?`: Allow offline validation (default: true)
  - `cacheDuration?`: Cache duration in ms (default: 3600000)
  - `devMode?`: Development mode (always valid, default: false)

**Returns:** `Promise<LicenseValidationResult>`

### `getLicenseFeatures(tier)`

Get all features available for a tier.

**Parameters:**
- `tier`: License tier

**Returns:** `LicenseFeatures`

### `hasFeature(tier, feature)`

Check if a specific feature is available.

**Parameters:**
- `tier`: License tier
- `feature`: Feature name to check

**Returns:** `boolean`

### `isComponentAvailable(tier, component)`

Check if a component is available for a tier.

**Parameters:**
- `tier`: License tier
- `component`: Component name

**Returns:** `boolean`

### `isThemeAvailable(tier, theme)`

Check if a theme is available for a tier.

**Parameters:**
- `tier`: License tier
- `theme`: Theme name

**Returns:** `boolean`

### `isLicenseExpired(license)`

Check if a license is expired.

**Parameters:**
- `license`: License key object

**Returns:** `boolean`

### `getDaysUntilExpiration(license)`

Get days until license expiration.

**Parameters:**
- `license`: License key object

**Returns:** `number | null` (null for lifetime licenses)

### `getUpgradePath(currentTier)`

Get the next tier in the upgrade path.

**Parameters:**
- `currentTier`: Current license tier

**Returns:** `LicenseTier | null`

### `getUpgradeDiscount(currentTier, targetTier, remainingMonths)`

Calculate credit when upgrading licenses.

**Parameters:**
- `currentTier`: Current license tier
- `targetTier`: Target license tier
- `remainingMonths`: Months remaining on current license

**Returns:** `number` (discount amount in dollars)

---

## Types

### `LicenseTier`
```typescript
type LicenseTier = 'free' | 'pro-individual' | 'pro-team' | 'enterprise'
```

### `LicenseType`
```typescript
type LicenseType = 'annual' | 'lifetime'
```

### `LicenseStatus`
```typescript
type LicenseStatus = 'active' | 'expired' | 'suspended' | 'cancelled'
```

### `LicenseKey`
```typescript
interface LicenseKey {
  key: string
  tier: LicenseTier
  type: LicenseType
  email: string
  company?: string
  seats: number
  issuedAt: Date
  expiresAt: Date | null
  status: LicenseStatus
  metadata?: Record<string, any>
}
```

### `LicenseValidationResult`
```typescript
interface LicenseValidationResult {
  valid: boolean
  license?: LicenseKey
  error?: string
  validatedAt: Date
  daysUntilExpiration?: number
}
```

---

## Security Notes

**IMPORTANT:** This package is designed to work in conjunction with a server-side validation API.

### Client-Side Validation
- Basic format checking
- Tier feature lookups
- Development mode support

### Server-Side Validation (Required for Production)
- Actual license verification
- Database lookups
- Expiration checking
- Status verification
- Activation limiting

**Never rely solely on client-side validation in production!**

---

## Integration with Clarity Chat

```typescript
import { ChatWindow } from '@clarity-chat/react'
import { validateLicense, isComponentAvailable } from '@clarity-chat/licensing'

async function App() {
  const licenseKey = process.env.CLARITY_CHAT_LICENSE_KEY

  const result = await validateLicense(licenseKey, {
    validationEndpoint: 'https://api.clarity-chat.dev/validate',
  })

  if (!result.valid) {
    console.error('Invalid license:', result.error)
    // Fall back to free tier
  }

  const tier = result.license?.tier || 'free'
  const canUseVoice = isComponentAvailable(tier, 'VoiceInput')

  return (
    <ChatWindow
      // Component props
      showVoiceInput={canUseVoice}
    />
  )
}
```

---

## Environment Variables

```bash
# License key (required for Pro/Enterprise)
CLARITY_CHAT_LICENSE_KEY=PRO-IND-ANN-ABC123...

# Development mode (optional)
CLARITY_CHAT_DEV_MODE=true

# Validation endpoint (optional, defaults to Clarity Chat API)
CLARITY_CHAT_VALIDATION_ENDPOINT=https://your-api.com/validate
```

---

## Examples

### Check License Expiration

```typescript
import { validateLicense, getDaysUntilExpiration } from '@clarity-chat/licensing'

const result = await validateLicense(licenseKey)

if (result.valid && result.license) {
  const days = getDaysUntilExpiration(result.license)
  
  if (days === null) {
    console.log('Lifetime license - never expires')
  } else if (days < 30) {
    console.warn(`License expires in ${days} days - time to renew!`)
  } else {
    console.log(`License valid for ${days} more days`)
  }
}
```

### Upgrade Path

```typescript
import { getUpgradePath, getUpgradeDiscount } from '@clarity-chat/licensing'

const currentTier = 'pro-individual'
const nextTier = getUpgradePath(currentTier) // 'pro-team'

const discount = getUpgradeDiscount(currentTier, nextTier, 6) // 6 months remaining
console.log(`Upgrade credit: $${discount}`)
```

---

## License

MIT © 2024 Code & Clarity

**Note:** This package is for managing commercial licenses. The licensing package itself is open source, but it validates access to commercial Clarity Chat components.

---

## Links

- **Documentation:** [clarity-chat.dev/docs](https://clarity-chat.dev/docs)
- **Pricing:** [clarity-chat.dev/pricing](https://clarity-chat.dev/pricing)
- **Support:** support@codeclarity.ai
- **Enterprise:** enterprise@codeclarity.ai


