/**
 * User-related type definitions
 */

export type AuthProvider = 'email' | 'google' | 'github'

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  authProvider: AuthProvider
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface UserProfile extends User {
  bio?: string
  website?: string
  timezone?: string
  language?: string
}

export interface AuthSession {
  user: User
  token: string
  expiresAt: Date
}

export interface Subscription {
  userId: string
  tier: 'free' | 'pro' | 'enterprise'
  status: 'active' | 'cancelled' | 'past_due'
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
}
