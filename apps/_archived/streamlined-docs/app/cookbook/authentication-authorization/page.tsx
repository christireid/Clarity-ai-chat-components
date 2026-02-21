/**
 * Authentication & Authorization Cookbook
 *
 * Comprehensive guide to implementing secure authentication and authorization
 * in AI chat applications. Covers user authentication, role-based access control,
 * session management, and security best practices.
 *
 * Use Cases:
 * - Enterprise applications with multiple user roles
 * - Multi-tenant SaaS platforms
 * - Applications requiring audit trails and compliance
 */

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { DocumentationPage } from '../../../../../components/Docs/DocumentationPage'
import { Section } from '../../../../../components/Docs/Section'
import { ServerCodeBlock } from '../../../../../components/Docs/ServerCodeBlock'
import type { TocItem } from '../../../../../components/Docs/TableOfContents'

// ISR Configuration
export const revalidate = 3600 // Revalidate every hour

// ============================================================================
// Table of Contents
// ============================================================================

const tableOfContents: TocItem[] = [
  { id: 'overview', title: 'Overview', level: 2 },
  { id: 'authentication', title: 'User Authentication', level: 2 },
  { id: 'session-management', title: 'Session Management', level: 2 },
  { id: 'rbac', title: 'Role-Based Access Control', level: 2 },
  { id: 'security', title: 'Security Best Practices', level: 2 },
  { id: 'examples', title: 'Complete Examples', level: 2 },
  { id: 'use-cases', title: 'Use Cases', level: 2 },
]

// ============================================================================
// Demo Component
// ============================================================================

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
  permissions: string[]
}

function AuthDemo() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mock users for demo
  const mockUsers: Record<string, User & { password: string }> = {
    'admin@example.com': {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      permissions: ['chat:read', 'chat:write', 'chat:delete', 'users:manage'],
    },
    'user@example.com': {
      id: '2',
      name: 'Regular User',
      email: 'user@example.com',
      password: 'user123',
      role: 'user',
      permissions: ['chat:read', 'chat:write'],
    },
    'guest@example.com': {
      id: '3',
      name: 'Guest User',
      email: 'guest@example.com',
      password: 'guest123',
      role: 'guest',
      permissions: ['chat:read'],
    },
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    const user = mockUsers[loginEmail]
    if (user && user.password === loginPassword) {
      const { password, ...userWithoutPassword } = user
      setCurrentUser(userWithoutPassword)
      setLoginEmail('')
      setLoginPassword('')
    } else {
      setError('Invalid email or password')
    }

    setIsLoading(false)
  }

  const handleLogout = () => {
    setCurrentUser(null)
  }

  const hasPermission = (permission: string): boolean => {
    return currentUser?.permissions.includes(permission) ?? false
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      {!currentUser ? (
        // Login Form
        <div className="max-w-md">
          <h3 className="mb-4 text-lg font-semibold">Login Demo</h3>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                placeholder="admin@example.com"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                placeholder="admin123"
                required
              />
            </div>
            {error && (
              <div className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-4 rounded-lg bg-muted/50 p-4 text-sm">
            <p className="mb-2 font-medium">Demo Accounts:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• admin@example.com / admin123 (Full access)</li>
              <li>• user@example.com / user123 (Read + Write)</li>
              <li>• guest@example.com / guest123 (Read only)</li>
            </ul>
          </div>
        </div>
      ) : (
        // User Dashboard
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{currentUser.name}</h3>
              <p className="text-sm text-muted-foreground">
                {currentUser.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              Logout
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Role Badge */}
            <div className="rounded-lg border border-border bg-background p-4">
              <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                Role
              </h4>
              <span
                className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                  currentUser.role === 'admin'
                    ? 'bg-purple-500/10 text-purple-500'
                    : currentUser.role === 'user'
                      ? 'bg-blue-500/10 text-blue-500'
                      : 'bg-gray-500/10 text-gray-500'
                }`}
              >
                {currentUser.role.toUpperCase()}
              </span>
            </div>

            {/* Permissions */}
            <div className="rounded-lg border border-border bg-background p-4">
              <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                Permissions
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentUser.permissions.map((permission) => (
                  <span
                    key={permission}
                    className="rounded-full bg-green-500/10 px-2 py-1 text-xs text-green-500"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons with Permission Checks */}
          <div className="mt-6">
            <h4 className="mb-3 text-sm font-medium">Available Actions</h4>
            <div className="grid gap-2 sm:grid-cols-3">
              <button
                disabled={!hasPermission('chat:read')}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50 disabled:hover:bg-transparent"
              >
                View Chats {!hasPermission('chat:read') && '🔒'}
              </button>
              <button
                disabled={!hasPermission('chat:write')}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50 disabled:hover:bg-transparent"
              >
                Create Chat {!hasPermission('chat:write') && '🔒'}
              </button>
              <button
                disabled={!hasPermission('chat:delete')}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50 disabled:hover:bg-transparent"
              >
                Delete Chat {!hasPermission('chat:delete') && '🔒'}
              </button>
              <button
                disabled={!hasPermission('users:manage')}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50 disabled:hover:bg-transparent sm:col-span-3"
              >
                Manage Users {!hasPermission('users:manage') && '🔒'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export default function AuthenticationAuthorizationCookbook() {
  return (
    <DocumentationPage
      title="Authentication & Authorization"
      description="Secure user authentication, session management, and role-based access control for AI chat applications"
      tableOfContents={tableOfContents}
    >
      {/* Overview */}
      <Section id="overview" title="Overview">
        <p>
          Implementing robust authentication and authorization is critical for
          production AI chat applications. This guide covers industry-standard
          patterns for securing your application, managing user sessions, and
          implementing fine-grained access control.
        </p>

        <div className="my-6">
          <AuthDemo />
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="mb-2 font-semibold">What You&apos;ll Learn</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Secure password hashing with bcrypt</li>
            <li>• JWT token generation and validation</li>
            <li>• Session management with secure cookies</li>
            <li>• Role-based access control (RBAC)</li>
            <li>• Permission-based authorization</li>
            <li>• Multi-tenant isolation</li>
          </ul>
        </div>
      </Section>

      {/* User Authentication */}
      <Section id="authentication" title="User Authentication">
        <p>
          Start with secure password authentication using industry-standard
          hashing algorithms. Never store plain-text passwords.
        </p>

        <ServerCodeBlock
          title="Authentication API Route"
          language="typescript"
          code={`// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const JWT_SECRET = process.env.JWT_SECRET!
const JWT_EXPIRES_IN = '7d'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    // Find user in database
    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        role: true,
        permissions: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )

    // Create response with secure cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
      },
    })

    // Set secure HTTP-only cookie
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}`}
        />

        <ServerCodeBlock
          title="Password Registration"
          language="typescript"
          code={`// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
})

const SALT_ROUNDS = 12

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = registerSchema.parse(body)

    // Check if user already exists
    const existing = await db.user.findUnique({
      where: { email },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

    // Create user
    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'user', // Default role
        permissions: ['chat:read', 'chat:write'], // Default permissions
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}`}
        />
      </Section>

      {/* Session Management */}
      <Section id="session-management" title="Session Management">
        <p>
          Implement secure session management using JWTs stored in HTTP-only
          cookies. Validate tokens on every protected request.
        </p>

        <ServerCodeBlock
          title="Authentication Middleware"
          language="typescript"
          code={`// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

interface JWTPayload {
  userId: string
  email: string
  role: string
  permissions: string[]
}

export async function middleware(request: NextRequest) {
  // Get token from cookie
  const token = request.cookies.get('auth_token')?.value

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    // Verify and decode token
    const payload = jwt.verify(token, JWT_SECRET) as JWTPayload

    // Add user info to request headers
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', payload.userId)
    requestHeaders.set('x-user-role', payload.role)
    requestHeaders.set('x-user-permissions', JSON.stringify(payload.permissions))

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    )
  }
}

// Apply middleware to protected routes
export const config = {
  matcher: [
    '/api/chat/:path*',
    '/api/conversations/:path*',
    '/api/user/:path*',
  ],
}`}
        />

        <ServerCodeBlock
          title="Session Utilities"
          language="typescript"
          code={`// lib/auth/session.ts
import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export interface Session {
  userId: string
  email: string
  role: 'admin' | 'user' | 'guest'
  permissions: string[]
}

/**
 * Get current user session from request
 */
export async function getSession(request: NextRequest): Promise<Session | null> {
  const token = request.cookies.get('auth_token')?.value

  if (!token) {
    return null
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as Session
    return payload
  } catch {
    return null
  }
}

/**
 * Require authenticated user
 */
export async function requireAuth(request: NextRequest): Promise<Session> {
  const session = await getSession(request)

  if (!session) {
    throw new Error('Unauthorized')
  }

  return session
}

/**
 * Require specific role
 */
export async function requireRole(
  request: NextRequest,
  allowedRoles: string[]
): Promise<Session> {
  const session = await requireAuth(request)

  if (!allowedRoles.includes(session.role)) {
    throw new Error('Forbidden')
  }

  return session
}

/**
 * Require specific permission
 */
export async function requirePermission(
  request: NextRequest,
  permission: string
): Promise<Session> {
  const session = await requireAuth(request)

  if (!session.permissions.includes(permission)) {
    throw new Error('Forbidden')
  }

  return session
}`}
        />
      </Section>

      {/* RBAC */}
      <Section id="rbac" title="Role-Based Access Control">
        <p>
          Implement fine-grained access control using roles and permissions.
          This allows flexible authorization without hardcoding rules.
        </p>

        <ServerCodeBlock
          title="Protected API Route with RBAC"
          language="typescript"
          code={`// app/api/chat/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requirePermission } from '@/lib/auth/session'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require read permission
    const session = await requirePermission(request, 'chat:read')

    // Fetch chat
    const chat = await db.chat.findFirst({
      where: {
        id: params.id,
        userId: session.userId, // Ensure user owns this chat
      },
    })

    if (!chat) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(chat)
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require delete permission
    const session = await requirePermission(request, 'chat:delete')

    // Delete chat
    const deleted = await db.chat.deleteMany({
      where: {
        id: params.id,
        userId: session.userId, // Ensure user owns this chat
      },
    })

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: 'Chat not found or unauthorized' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}`}
        />

        <ServerCodeBlock
          title="Permission Definitions"
          language="typescript"
          code={`// lib/auth/permissions.ts

export const PERMISSIONS = {
  // Chat permissions
  CHAT_READ: 'chat:read',
  CHAT_WRITE: 'chat:write',
  CHAT_DELETE: 'chat:delete',

  // User management
  USERS_READ: 'users:read',
  USERS_WRITE: 'users:write',
  USERS_DELETE: 'users:delete',

  // Admin
  ADMIN_ACCESS: 'admin:access',
  ADMIN_MANAGE: 'admin:manage',
} as const

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
} as const

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  [ROLES.ADMIN]: [
    PERMISSIONS.CHAT_READ,
    PERMISSIONS.CHAT_WRITE,
    PERMISSIONS.CHAT_DELETE,
    PERMISSIONS.USERS_READ,
    PERMISSIONS.USERS_WRITE,
    PERMISSIONS.USERS_DELETE,
    PERMISSIONS.ADMIN_ACCESS,
    PERMISSIONS.ADMIN_MANAGE,
  ],
  [ROLES.USER]: [
    PERMISSIONS.CHAT_READ,
    PERMISSIONS.CHAT_WRITE,
  ],
  [ROLES.GUEST]: [
    PERMISSIONS.CHAT_READ,
  ],
}

/**
 * Check if role has permission
 */
export function roleHasPermission(role: string, permission: string): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}`}
        />
      </Section>

      {/* Security */}
      <Section id="security" title="Security Best Practices">
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="mb-2 font-semibold">Password Security</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Use bcrypt with 12+ salt rounds for password hashing</li>
              <li>• Never store plain-text passwords</li>
              <li>• Enforce minimum password length (8+ characters)</li>
              <li>• Implement rate limiting on login endpoints</li>
              <li>• Consider adding 2FA for sensitive operations</li>
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="mb-2 font-semibold">Token Security</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>
                • Store JWT tokens in HTTP-only cookies (not localStorage)
              </li>
              <li>• Set SameSite=Strict to prevent CSRF attacks</li>
              <li>• Use secure flag in production (HTTPS only)</li>
              <li>• Implement token rotation for long-lived sessions</li>
              <li>• Set reasonable expiration times (7 days max)</li>
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="mb-2 font-semibold">Authorization Security</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Always validate permissions on the server side</li>
              <li>• Never trust client-side permission checks alone</li>
              <li>• Implement row-level security for multi-tenant apps</li>
              <li>• Audit permission changes and access attempts</li>
              <li>• Use principle of least privilege (minimal permissions)</li>
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="mb-2 font-semibold">Session Security</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Regenerate session tokens after login</li>
              <li>• Clear session tokens on logout</li>
              <li>• Implement session timeouts for inactivity</li>
              <li>• Allow users to view and revoke active sessions</li>
              <li>• Monitor for suspicious session activity</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Complete Examples */}
      <Section id="examples" title="Complete Examples">
        <ServerCodeBlock
          title="Client-Side Authentication Hook"
          language="typescript"
          code={`// hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react'

interface User {
  id: string
  email: string
  name: string
  role: string
  permissions: string[]
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated on mount
    fetch('/api/auth/me')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => setUser(data?.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.error || 'Login failed')
    }

    const data = await res.json()
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
  }, [])

  const hasPermission = useCallback(
    (permission: string) => {
      return user?.permissions.includes(permission) ?? false
    },
    [user]
  )

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    hasPermission,
  }
}`}
        />

        <ServerCodeBlock
          title="Protected Component"
          language="typescript"
          code={`// components/ProtectedContent.tsx
import { useAuth } from '@/hooks/useAuth'

interface ProtectedContentProps {
  children: React.ReactNode
  permission?: string
  fallback?: React.ReactNode
}

export function ProtectedContent({
  children,
  permission,
  fallback = <div>Access denied</div>,
}: ProtectedContentProps) {
  const { isLoading, isAuthenticated, hasPermission } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return fallback
  }

  if (permission && !hasPermission(permission)) {
    return fallback
  }

  return <>{children}</>
}

// Usage
<ProtectedContent permission="chat:delete">
  <button onClick={handleDelete}>Delete Chat</button>
</ProtectedContent>`}
        />
      </Section>

      {/* Use Cases */}
      <Section id="use-cases" title="Use Cases">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: 'Enterprise Applications',
              description:
                'Multi-role access with department-level permissions, audit trails, and compliance requirements',
              icon: '🏢',
            },
            {
              title: 'Multi-Tenant SaaS',
              description:
                'Tenant isolation, per-organization roles, team management, and subscription-based features',
              icon: '🏗️',
            },
            {
              title: 'Healthcare & Finance',
              description:
                'HIPAA/SOC2 compliance, sensitive data protection, role-based data access, and audit logging',
              icon: '🏥',
            },
          ].map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-lg border border-border bg-card p-6"
            >
              <div className="mb-3 text-3xl">{useCase.icon}</div>
              <h3 className="mb-2 font-semibold">{useCase.title}</h3>
              <p className="text-sm text-muted-foreground">
                {useCase.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>
    </DocumentationPage>
  )
}
