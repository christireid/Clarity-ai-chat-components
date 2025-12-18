/**
 * Authentication Provider Extensions
 *
 * Seamless integration with popular authentication providers.
 * Enables user context, permissions, and secure chat sessions.
 *
 * @packageDocumentation
 */

import { defineExtension } from '../builder'
import type { Extension, ExtensionContext } from '../types'

// ============================================
// Types
// ============================================

export interface Auth0Config {
  domain: string
  clientId: string
  clientSecret?: string
  audience?: string
  redirectUri?: string
  scope?: string
}

export interface ClerkConfig {
  publishableKey: string
  secretKey?: string
  signInUrl?: string
  signUpUrl?: string
  afterSignInUrl?: string
  afterSignUpUrl?: string
}

export interface NextAuthConfig {
  providers?: string[]
  secret?: string
  sessionStrategy?: 'jwt' | 'database'
  baseUrl?: string
}

export interface SupabaseAuthConfig {
  supabaseUrl: string
  supabaseAnonKey: string
  autoRefreshToken?: boolean
  persistSession?: boolean
}

export interface FirebaseAuthConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket?: string
  messagingSenderId?: string
  appId?: string
}

export interface KeycloakConfig {
  url: string
  realm: string
  clientId: string
  clientSecret?: string
}

export interface OktaConfig {
  domain: string
  clientId: string
  clientSecret?: string
  redirectUri?: string
  scopes?: string[]
}

export interface CognitoConfig {
  userPoolId: string
  clientId: string
  region: string
  identityPoolId?: string
}

// ============================================
// Auth State Interface
// ============================================

interface AuthUser {
  id: string
  email?: string
  name?: string
  avatar?: string
  metadata?: Record<string, unknown>
}

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  accessToken?: string
}

interface AuthAdapter {
  getUser(): Promise<AuthUser | null>
  getAccessToken(): Promise<string | null>
  signIn(credentials?: Record<string, unknown>): Promise<void>
  signOut(): Promise<void>
  onAuthStateChange(callback: (state: AuthState) => void): () => void
}

// ============================================
// Extension Factories
// ============================================

/**
 * Create Auth0 extension
 */
export function createAuth0Extension(
  config?: Partial<Auth0Config>
): Extension<Auth0Config> {
  return defineExtension<Auth0Config>({
    id: 'auth-auth0',
    name: 'Auth0',
    category: 'authentication',
    description: 'Authentication and authorization with Auth0',
    author: 'Clarity Chat',
    tags: ['auth', 'sso', 'oauth', 'enterprise'],
    homepage: 'https://auth0.com',
    documentation: 'https://auth0.com/docs',

    configSchema: {
      version: '1.0',
      required: ['domain', 'clientId'],
      properties: {
        domain: { type: 'string', label: 'Domain', envVar: 'AUTH0_DOMAIN' },
        clientId: {
          type: 'string',
          label: 'Client ID',
          envVar: 'AUTH0_CLIENT_ID',
        },
        clientSecret: {
          type: 'secret',
          label: 'Client Secret',
          envVar: 'AUTH0_CLIENT_SECRET',
        },
        audience: { type: 'string', label: 'API Audience' },
        redirectUri: { type: 'string', label: 'Redirect URI' },
        scope: {
          type: 'string',
          label: 'Scopes',
          default: 'openid profile email',
        },
      },
    },

    defaultConfig: {
      scope: 'openid profile email',
      ...config,
    } as Auth0Config,

    initialize: async (ctx) => {
      ctx.console.info('Auth0 extension initialized')

      const adapter: AuthAdapter = {
        async getUser() {
          // Would use @auth0/auth0-react or @auth0/auth0-spa-js
          return null
        },
        async getAccessToken() {
          return null
        },
        async signIn() {
          ctx.console.info('Auth0 sign in initiated')
        },
        async signOut() {
          ctx.console.info('Auth0 sign out initiated')
        },
        onAuthStateChange(callback) {
          return () => {}
        },
      }

      ctx.services.register('auth', adapter)
      ctx.events.emit('auth:initialized', { provider: 'auth0' })
    },
  })
}

/**
 * Create Clerk extension
 */
export function createClerkExtension(
  config?: Partial<ClerkConfig>
): Extension<ClerkConfig> {
  return defineExtension<ClerkConfig>({
    id: 'auth-clerk',
    name: 'Clerk',
    category: 'authentication',
    description: 'Complete user management with Clerk',
    author: 'Clarity Chat',
    tags: ['auth', 'user-management', 'modern'],
    homepage: 'https://clerk.com',

    configSchema: {
      version: '1.0',
      required: ['publishableKey'],
      properties: {
        publishableKey: {
          type: 'string',
          label: 'Publishable Key',
          envVar: 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
        },
        secretKey: {
          type: 'secret',
          label: 'Secret Key',
          envVar: 'CLERK_SECRET_KEY',
        },
        signInUrl: {
          type: 'string',
          label: 'Sign In URL',
          default: '/sign-in',
        },
        signUpUrl: {
          type: 'string',
          label: 'Sign Up URL',
          default: '/sign-up',
        },
        afterSignInUrl: {
          type: 'string',
          label: 'After Sign In URL',
          default: '/',
        },
        afterSignUpUrl: {
          type: 'string',
          label: 'After Sign Up URL',
          default: '/',
        },
      },
    },

    defaultConfig: {
      signInUrl: '/sign-in',
      signUpUrl: '/sign-up',
      afterSignInUrl: '/',
      afterSignUpUrl: '/',
      ...config,
    } as ClerkConfig,

    initialize: async (ctx) => {
      ctx.console.info('Clerk extension initialized')

      const adapter: AuthAdapter = {
        async getUser() {
          // Would use @clerk/clerk-react
          return null
        },
        async getAccessToken() {
          return null
        },
        async signIn() {
          ctx.console.info('Clerk sign in initiated')
        },
        async signOut() {
          ctx.console.info('Clerk sign out initiated')
        },
        onAuthStateChange(callback) {
          return () => {}
        },
      }

      ctx.services.register('auth', adapter)
    },
  })
}

/**
 * Create NextAuth extension
 */
export function createNextAuthExtension(
  config?: Partial<NextAuthConfig>
): Extension<NextAuthConfig> {
  return defineExtension<NextAuthConfig>({
    id: 'auth-nextauth',
    name: 'NextAuth.js',
    category: 'authentication',
    description: 'Authentication for Next.js applications',
    author: 'Clarity Chat',
    tags: ['auth', 'nextjs', 'oauth'],
    homepage: 'https://next-auth.js.org',

    configSchema: {
      version: '1.0',
      properties: {
        secret: { type: 'secret', label: 'Secret', envVar: 'NEXTAUTH_SECRET' },
        sessionStrategy: {
          type: 'string',
          label: 'Session Strategy',
          default: 'jwt',
          enum: ['jwt', 'database'],
        },
        baseUrl: { type: 'string', label: 'Base URL', envVar: 'NEXTAUTH_URL' },
      },
    },

    defaultConfig: {
      sessionStrategy: 'jwt',
      ...config,
    } as NextAuthConfig,

    initialize: async (ctx) => {
      ctx.console.info('NextAuth extension initialized')

      const adapter: AuthAdapter = {
        async getUser() {
          // Would use next-auth/react
          return null
        },
        async getAccessToken() {
          return null
        },
        async signIn() {
          ctx.console.info('NextAuth sign in initiated')
        },
        async signOut() {
          ctx.console.info('NextAuth sign out initiated')
        },
        onAuthStateChange(callback) {
          return () => {}
        },
      }

      ctx.services.register('auth', adapter)
    },
  })
}

/**
 * Create Supabase Auth extension
 */
export function createSupabaseAuthExtension(
  config?: Partial<SupabaseAuthConfig>
): Extension<SupabaseAuthConfig> {
  return defineExtension<SupabaseAuthConfig>({
    id: 'auth-supabase',
    name: 'Supabase Auth',
    category: 'authentication',
    description: 'Authentication with Supabase',
    author: 'Clarity Chat',
    tags: ['auth', 'supabase', 'postgres'],
    homepage: 'https://supabase.com/auth',

    configSchema: {
      version: '1.0',
      required: ['supabaseUrl', 'supabaseAnonKey'],
      properties: {
        supabaseUrl: {
          type: 'string',
          label: 'Supabase URL',
          envVar: 'NEXT_PUBLIC_SUPABASE_URL',
        },
        supabaseAnonKey: {
          type: 'string',
          label: 'Anon Key',
          envVar: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        },
        autoRefreshToken: {
          type: 'boolean',
          label: 'Auto Refresh Token',
          default: true,
        },
        persistSession: {
          type: 'boolean',
          label: 'Persist Session',
          default: true,
        },
      },
    },

    defaultConfig: {
      autoRefreshToken: true,
      persistSession: true,
      ...config,
    } as SupabaseAuthConfig,

    initialize: async (ctx) => {
      ctx.console.info('Supabase Auth extension initialized')

      const adapter: AuthAdapter = {
        async getUser() {
          // Would use @supabase/supabase-js
          return null
        },
        async getAccessToken() {
          return null
        },
        async signIn() {
          ctx.console.info('Supabase sign in initiated')
        },
        async signOut() {
          ctx.console.info('Supabase sign out initiated')
        },
        onAuthStateChange(callback) {
          return () => {}
        },
      }

      ctx.services.register('auth', adapter)
    },
  })
}

/**
 * Create Firebase Auth extension
 */
export function createFirebaseAuthExtension(
  config?: Partial<FirebaseAuthConfig>
): Extension<FirebaseAuthConfig> {
  return defineExtension<FirebaseAuthConfig>({
    id: 'auth-firebase',
    name: 'Firebase Auth',
    category: 'authentication',
    description: 'Authentication with Firebase',
    author: 'Clarity Chat',
    tags: ['auth', 'firebase', 'google'],
    homepage: 'https://firebase.google.com/docs/auth',

    configSchema: {
      version: '1.0',
      required: ['apiKey', 'authDomain', 'projectId'],
      properties: {
        apiKey: {
          type: 'string',
          label: 'API Key',
          envVar: 'FIREBASE_API_KEY',
        },
        authDomain: { type: 'string', label: 'Auth Domain' },
        projectId: { type: 'string', label: 'Project ID' },
        storageBucket: { type: 'string', label: 'Storage Bucket' },
        messagingSenderId: { type: 'string', label: 'Messaging Sender ID' },
        appId: { type: 'string', label: 'App ID' },
      },
    },

    defaultConfig: config as FirebaseAuthConfig,

    initialize: async (ctx) => {
      ctx.console.info('Firebase Auth extension initialized')

      const adapter: AuthAdapter = {
        async getUser() {
          return null
        },
        async getAccessToken() {
          return null
        },
        async signIn() {
          ctx.console.info('Firebase sign in initiated')
        },
        async signOut() {
          ctx.console.info('Firebase sign out initiated')
        },
        onAuthStateChange(callback) {
          return () => {}
        },
      }

      ctx.services.register('auth', adapter)
    },
  })
}

/**
 * Create Keycloak extension
 */
export function createKeycloakExtension(
  config?: Partial<KeycloakConfig>
): Extension<KeycloakConfig> {
  return defineExtension<KeycloakConfig>({
    id: 'auth-keycloak',
    name: 'Keycloak',
    category: 'authentication',
    description: 'Enterprise identity management with Keycloak',
    author: 'Clarity Chat',
    tags: ['auth', 'sso', 'enterprise', 'open-source'],
    homepage: 'https://keycloak.org',

    configSchema: {
      version: '1.0',
      required: ['url', 'realm', 'clientId'],
      properties: {
        url: { type: 'string', label: 'Keycloak URL' },
        realm: { type: 'string', label: 'Realm' },
        clientId: { type: 'string', label: 'Client ID' },
        clientSecret: { type: 'secret', label: 'Client Secret' },
      },
    },

    defaultConfig: config as KeycloakConfig,

    initialize: async (ctx) => {
      ctx.console.info('Keycloak extension initialized')

      const adapter: AuthAdapter = {
        async getUser() {
          return null
        },
        async getAccessToken() {
          return null
        },
        async signIn() {
          ctx.console.info('Keycloak sign in initiated')
        },
        async signOut() {
          ctx.console.info('Keycloak sign out initiated')
        },
        onAuthStateChange(callback) {
          return () => {}
        },
      }

      ctx.services.register('auth', adapter)
    },
  })
}

/**
 * Create Okta extension
 */
export function createOktaExtension(
  config?: Partial<OktaConfig>
): Extension<OktaConfig> {
  return defineExtension<OktaConfig>({
    id: 'auth-okta',
    name: 'Okta',
    category: 'authentication',
    description: 'Enterprise identity with Okta',
    author: 'Clarity Chat',
    tags: ['auth', 'sso', 'enterprise', 'okta'],
    homepage: 'https://okta.com',

    configSchema: {
      version: '1.0',
      required: ['domain', 'clientId'],
      properties: {
        domain: { type: 'string', label: 'Okta Domain', envVar: 'OKTA_DOMAIN' },
        clientId: {
          type: 'string',
          label: 'Client ID',
          envVar: 'OKTA_CLIENT_ID',
        },
        clientSecret: {
          type: 'secret',
          label: 'Client Secret',
          envVar: 'OKTA_CLIENT_SECRET',
        },
        redirectUri: { type: 'string', label: 'Redirect URI' },
      },
    },

    defaultConfig: config as OktaConfig,

    initialize: async (ctx) => {
      ctx.console.info('Okta extension initialized')

      const adapter: AuthAdapter = {
        async getUser() {
          return null
        },
        async getAccessToken() {
          return null
        },
        async signIn() {
          ctx.console.info('Okta sign in initiated')
        },
        async signOut() {
          ctx.console.info('Okta sign out initiated')
        },
        onAuthStateChange(callback) {
          return () => {}
        },
      }

      ctx.services.register('auth', adapter)
    },
  })
}

/**
 * Create AWS Cognito extension
 */
export function createCognitoExtension(
  config?: Partial<CognitoConfig>
): Extension<CognitoConfig> {
  return defineExtension<CognitoConfig>({
    id: 'auth-cognito',
    name: 'AWS Cognito',
    category: 'authentication',
    description: 'Authentication with AWS Cognito',
    author: 'Clarity Chat',
    tags: ['auth', 'aws', 'enterprise', 'cognito'],
    homepage: 'https://aws.amazon.com/cognito/',

    configSchema: {
      version: '1.0',
      required: ['userPoolId', 'clientId', 'region'],
      properties: {
        userPoolId: {
          type: 'string',
          label: 'User Pool ID',
          envVar: 'COGNITO_USER_POOL_ID',
        },
        clientId: {
          type: 'string',
          label: 'Client ID',
          envVar: 'COGNITO_CLIENT_ID',
        },
        region: { type: 'string', label: 'Region', default: 'us-east-1' },
        identityPoolId: { type: 'string', label: 'Identity Pool ID' },
      },
    },

    defaultConfig: {
      region: 'us-east-1',
      ...config,
    } as CognitoConfig,

    initialize: async (ctx) => {
      ctx.console.info('AWS Cognito extension initialized')

      const adapter: AuthAdapter = {
        async getUser() {
          return null
        },
        async getAccessToken() {
          return null
        },
        async signIn() {
          ctx.console.info('Cognito sign in initiated')
        },
        async signOut() {
          ctx.console.info('Cognito sign out initiated')
        },
        onAuthStateChange(callback) {
          return () => {}
        },
      }

      ctx.services.register('auth', adapter)
    },
  })
}
