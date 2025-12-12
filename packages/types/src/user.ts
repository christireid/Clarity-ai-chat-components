/**
 * User-related type definitions
 *
 * This module contains types for user accounts, profiles,
 * authentication sessions, and subscriptions.
 *
 * @packageDocumentation
 */

/**
 * Authentication provider used to sign in.
 *
 * @remarks
 * - `email`: Email/password authentication
 * - `google`: Google OAuth
 * - `github`: GitHub OAuth
 */
export type AuthProvider = 'email' | 'google' | 'github'

/**
 * Core user account information.
 *
 * @example
 * ```typescript
 * const user: User = {
 *   id: 'user-1',
 *   email: 'user@example.com',
 *   name: 'John Doe',
 *   avatar: 'https://example.com/avatar.png',
 *   authProvider: 'google',
 *   emailVerified: true,
 *   createdAt: new Date(),
 *   updatedAt: new Date(),
 * }
 * ```
 */
export interface User {
  /** Unique user identifier */
  id: string
  /** User's email address */
  email: string
  /** User's display name */
  name: string
  /** URL to user's avatar image */
  avatar?: string
  /** Authentication provider used */
  authProvider: AuthProvider
  /** Whether the email has been verified */
  emailVerified: boolean
  /** When the account was created */
  createdAt: Date
  /** When the account was last updated */
  updatedAt: Date
}

/**
 * Extended user profile with additional information.
 *
 * @example
 * ```typescript
 * const profile: UserProfile = {
 *   id: 'user-1',
 *   email: 'user@example.com',
 *   name: 'John Doe',
 *   authProvider: 'email',
 *   emailVerified: true,
 *   bio: 'Software developer',
 *   website: 'https://johndoe.dev',
 *   timezone: 'America/New_York',
 *   language: 'en-US',
 *   createdAt: new Date(),
 *   updatedAt: new Date(),
 * }
 * ```
 */
export interface UserProfile extends User {
  /** Short bio or description */
  bio?: string
  /** Personal website URL */
  website?: string
  /** User's timezone (IANA format) */
  timezone?: string
  /** Preferred language (BCP 47 code) */
  language?: string
}

/**
 * Active authentication session.
 *
 * @example
 * ```typescript
 * const session: AuthSession = {
 *   user: { id: 'user-1', ... },
 *   token: 'jwt-token-here',
 *   expiresAt: new Date('2024-12-31'),
 * }
 * ```
 */
export interface AuthSession {
  /** The authenticated user */
  user: User
  /** JWT or session token */
  token: string
  /** When the session expires */
  expiresAt: Date
}

/**
 * User subscription information.
 *
 * @example
 * ```typescript
 * const subscription: Subscription = {
 *   userId: 'user-1',
 *   tier: 'pro',
 *   status: 'active',
 *   currentPeriodStart: new Date('2024-01-01'),
 *   currentPeriodEnd: new Date('2024-02-01'),
 *   cancelAtPeriodEnd: false,
 * }
 * ```
 */
export interface Subscription {
  /** ID of the user */
  userId: string
  /** Subscription tier level */
  tier: 'free' | 'pro' | 'enterprise'
  /** Current subscription status */
  status: 'active' | 'cancelled' | 'past_due'
  /** Start of current billing period */
  currentPeriodStart: Date
  /** End of current billing period */
  currentPeriodEnd: Date
  /** Whether subscription will cancel at period end */
  cancelAtPeriodEnd: boolean
}
