import { customAlphabet } from 'nanoid';
/**
 * Generate a license key
 */
export function generateLicenseKey(options) {
    const { tier, type, email, company, seats = tier === 'pro-team' ? 5 : tier === 'enterprise' ? 10 : 1, expirationMonths = 12, } = options;
    // Generate unique license key
    // Format: TIER-TYPE-RANDOM
    // Example: PRO-IND-ABC123DEF456GHI789
    const tierPrefix = getTierPrefix(tier);
    const typePrefix = type === 'annual' ? 'ANN' : 'LTD';
    // Use custom alphabet to avoid hyphens/underscores in license keys
    const generateId = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 16);
    const random = generateId();
    const key = `${tierPrefix}-${typePrefix}-${random}`;
    const issuedAt = new Date();
    const expiresAt = type === 'lifetime' ? null : addMonths(issuedAt, expirationMonths);
    return {
        key,
        tier,
        type,
        email,
        company,
        seats,
        issuedAt,
        expiresAt,
        status: 'active',
    };
}
/**
 * Get tier prefix for license key
 */
function getTierPrefix(tier) {
    switch (tier) {
        case 'free':
            return 'FREE';
        case 'pro-individual':
            return 'PRO-IND';
        case 'pro-team':
            return 'PRO-TEAM';
        case 'enterprise':
            return 'ENT';
        default:
            return 'UNKNOWN';
    }
}
/**
 * Add months to a date
 */
function addMonths(date, months) {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
}
/**
 * Parse license key to extract tier and type
 */
export function parseLicenseKey(key) {
    const parts = key.split('-');
    if (parts.length < 3) {
        return { tier: null, type: null, valid: false };
    }
    
    // Handle different tier formats:
    // - PRO-IND-ANN-RANDOM (pro-individual)
    // - PRO-TEAM-ANN-RANDOM (pro-team)
    // - ENT-ANN-RANDOM (enterprise)
    // - FREE-ANN-RANDOM (free)
    
    let tier = null;
    let type = null;
    
    if (parts[0] === 'PRO' && parts[1] === 'IND') {
        // PRO-IND-ANN-RANDOM or PRO-IND-LTD-RANDOM
        tier = 'pro-individual';
        type = parseTypePrefix(parts[2]);
    } else if (parts[0] === 'PRO' && parts[1] === 'TEAM') {
        // PRO-TEAM-ANN-RANDOM or PRO-TEAM-LTD-RANDOM
        tier = 'pro-team';
        type = parseTypePrefix(parts[2]);
    } else if (parts[0] === 'ENT') {
        // ENT-ANN-RANDOM or ENT-LTD-RANDOM
        tier = 'enterprise';
        type = parseTypePrefix(parts[1]);
    } else if (parts[0] === 'FREE') {
        // FREE-ANN-RANDOM or FREE-LTD-RANDOM
        tier = 'free';
        type = parseTypePrefix(parts[1]);
    }
    
    return {
        tier,
        type,
        valid: tier !== null && type !== null,
    };
}
// Removed unused parseTierPrefix helper
function parseTypePrefix(prefix) {
    switch (prefix) {
        case 'ANN':
            return 'annual';
        case 'LTD':
            return 'lifetime';
        default:
            return null;
    }
}
//# sourceMappingURL=generator.js.map