'use client'

import {
  FileCode,
  FileText,
  Globe,
  Image,
  GitBranch,
  Table2,
  Braces,
} from 'lucide-react'
import React from 'react'
import type { ArtifactType } from '../../_shared'

/** Shared icon mapping for artifact types — used by ArtifactPanel and ArtifactRenderer. */
export const ARTIFACT_TYPE_ICONS: Record<ArtifactType, React.ReactNode> = {
  code: React.createElement(FileCode, { className: 'h-3.5 w-3.5' }),
  document: React.createElement(FileText, { className: 'h-3.5 w-3.5' }),
  html: React.createElement(Globe, { className: 'h-3.5 w-3.5' }),
  svg: React.createElement(Image, { className: 'h-3.5 w-3.5' }),
  mermaid: React.createElement(GitBranch, { className: 'h-3.5 w-3.5' }),
  table: React.createElement(Table2, { className: 'h-3.5 w-3.5' }),
  json: React.createElement(Braces, { className: 'h-3.5 w-3.5' }),
}

/** Shared label mapping for artifact types. */
export const ARTIFACT_TYPE_LABELS: Record<ArtifactType, string> = {
  code: 'Code',
  document: 'Document',
  html: 'HTML',
  svg: 'SVG',
  mermaid: 'Diagram',
  table: 'Table',
  json: 'JSON',
}

export interface ArtifactTemplate {
  trigger: string[]
  artifact: {
    title: string
    type: ArtifactType
    language?: string
    content: string
  }
  response: string
  thinkingSteps: string[]
  toolName: string
}

export const ARTIFACT_TEMPLATES: ArtifactTemplate[] = [
  {
    trigger: ['react', 'component', 'form', 'login'],
    artifact: {
      title: 'UserProfileCard.tsx',
      type: 'code',
      language: 'tsx',
      content: `import React from 'react'

interface UserProfileCardProps {
  name: string
  email: string
  avatarUrl?: string
  role: 'admin' | 'editor' | 'viewer'
  bio?: string
  joinedDate: string
  stats: {
    posts: number
    followers: number
    following: number
  }
  onEdit?: () => void
  onFollow?: () => void
}

export function UserProfileCard({
  name,
  email,
  avatarUrl,
  role,
  bio,
  joinedDate,
  stats,
  onEdit,
  onFollow,
}: UserProfileCardProps) {
  const roleColors = {
    admin: 'bg-red-100 text-red-700 border-red-200',
    editor: 'bg-blue-100 text-blue-700 border-blue-200',
    viewer: 'bg-gray-100 text-gray-700 border-gray-200',
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border bg-white shadow-lg overflow-hidden">
      {/* Header gradient */}
      <div className="h-24 bg-gradient-to-r from-violet-500 to-purple-600" />

      {/* Avatar */}
      <div className="px-6 -mt-12">
        <div className="w-20 h-20 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-md">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-500">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="px-6 pt-3 pb-6">
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-lg font-bold text-gray-900">{name}</h3>
          <span className={\`text-xs px-2 py-0.5 rounded-full border font-medium \${roleColors[role]}\`}>
            {role}
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-2">{email}</p>
        {bio && <p className="text-sm text-gray-600 mb-3">{bio}</p>}
        <p className="text-xs text-gray-400 mb-4">Joined {joinedDate}</p>

        {/* Stats */}
        <div className="flex items-center justify-between py-3 border-t border-b mb-4">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="text-lg font-bold text-gray-900">{value.toLocaleString()}</div>
              <div className="text-xs text-gray-500 capitalize">{key}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onFollow}
            className="flex-1 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors"
          >
            Follow
          </button>
          <button
            onClick={onEdit}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  )
}`,
    },
    response:
      "I've created a **UserProfileCard** React component with TypeScript props. It features a gradient header, circular avatar with fallback initials, role badge with color coding, user stats grid, and action buttons. The component is fully typed and uses Tailwind CSS for styling.",
    thinkingSteps: [
      'Analyzing the request for a React component...',
      'Designing a user profile card with common UI patterns...',
      'Structuring TypeScript interface with proper prop types...',
      'Adding role-based color coding and responsive layout...',
      'Implementing avatar fallback and stats display...',
      'Finalizing with action buttons and hover states...',
    ],
    toolName: 'Code Generator',
  },
  {
    trigger: ['diagram', 'flowchart', 'flow', 'mermaid'],
    artifact: {
      title: 'Software Architecture Diagram',
      type: 'mermaid',
      language: 'mermaid',
      content: `graph TB
    subgraph Client["Client Layer"]
        UI[React Frontend]
        State[State Management]
        Cache[Client Cache]
    end

    subgraph API["API Gateway"]
        GW[API Gateway / Load Balancer]
        Auth[Auth Service]
        Rate[Rate Limiter]
    end

    subgraph Services["Microservices"]
        UserSvc[User Service]
        OrderSvc[Order Service]
        PaymentSvc[Payment Service]
        NotifSvc[Notification Service]
        SearchSvc[Search Service]
    end

    subgraph Data["Data Layer"]
        PG[(PostgreSQL)]
        Redis[(Redis Cache)]
        ES[(Elasticsearch)]
        S3[(Object Storage)]
        MQ[Message Queue]
    end

    subgraph External["External Services"]
        Stripe[Stripe API]
        SendGrid[SendGrid Email]
        Twilio[Twilio SMS]
    end

    UI --> State
    State --> Cache
    UI --> GW

    GW --> Auth
    GW --> Rate
    Auth --> UserSvc

    GW --> UserSvc
    GW --> OrderSvc
    GW --> PaymentSvc
    GW --> SearchSvc

    UserSvc --> PG
    UserSvc --> Redis
    OrderSvc --> PG
    OrderSvc --> MQ
    PaymentSvc --> Stripe
    PaymentSvc --> MQ
    NotifSvc --> SendGrid
    NotifSvc --> Twilio
    SearchSvc --> ES

    MQ --> NotifSvc
    OrderSvc --> S3

    classDef client fill:#e0e7ff,stroke:#6366f1,color:#312e81
    classDef api fill:#fef3c7,stroke:#f59e0b,color:#78350f
    classDef service fill:#d1fae5,stroke:#10b981,color:#064e3b
    classDef data fill:#fce7f3,stroke:#ec4899,color:#831843
    classDef external fill:#f3e8ff,stroke:#8b5cf6,color:#4c1d95

    class UI,State,Cache client
    class GW,Auth,Rate api
    class UserSvc,OrderSvc,PaymentSvc,NotifSvc,SearchSvc service
    class PG,Redis,ES,S3,MQ data
    class Stripe,SendGrid,Twilio external`,
    },
    response:
      "I've created a **software architecture diagram** using Mermaid syntax. It shows a full microservices architecture with five layers: Client (React frontend with state management), API Gateway (with auth and rate limiting), Microservices (User, Order, Payment, Notification, Search), Data (PostgreSQL, Redis, Elasticsearch, Object Storage, Message Queue), and External Services (Stripe, SendGrid, Twilio). Each layer is color-coded for clarity.",
    thinkingSteps: [
      'Planning diagram structure for software architecture...',
      'Identifying key architectural layers and components...',
      'Designing data flow between services...',
      'Adding external integrations and messaging patterns...',
      'Applying color coding for different layers...',
      'Validating Mermaid syntax and connection paths...',
    ],
    toolName: 'Diagram Creator',
  },
  {
    trigger: ['documentation', 'docs', 'readme', 'guide'],
    artifact: {
      title: 'API Documentation',
      type: 'document',
      language: 'markdown',
      content: `# Task Management API Documentation

## Overview

The Task Management API provides a RESTful interface for creating, reading, updating, and deleting tasks and projects. It supports user authentication, team collaboration, and real-time updates via WebSocket connections.

**Base URL:** \`https://api.taskmanager.io/v2\`

**Authentication:** Bearer token via OAuth 2.0

---

## Authentication

All API requests require a valid Bearer token in the Authorization header:

\`\`\`
Authorization: Bearer <your-access-token>
\`\`\`

### Obtaining a Token

\`\`\`http
POST /auth/token
Content-Type: application/json

{
  "client_id": "your-client-id",
  "client_secret": "your-client-secret",
  "grant_type": "client_credentials"
}
\`\`\`

**Response:**
\`\`\`json
{
  "access_token": "eyJhbGciOiJSUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 3600
}
\`\`\`

---

## Endpoints

### Tasks

#### List Tasks

\`\`\`http
GET /tasks?status=active&page=1&limit=20
\`\`\`

| Parameter | Type     | Required | Description              |
|-----------|----------|----------|--------------------------|
| status    | string   | No       | Filter: active, completed, archived |
| page      | integer  | No       | Page number (default: 1) |
| limit     | integer  | No       | Items per page (default: 20, max: 100) |
| sort      | string   | No       | Sort field: created, updated, priority |
| order     | string   | No       | Sort order: asc, desc    |

#### Create Task

\`\`\`http
POST /tasks
Content-Type: application/json

{
  "title": "Implement user authentication",
  "description": "Add OAuth 2.0 login flow with Google and GitHub providers",
  "priority": "high",
  "assignee_id": "usr_abc123",
  "project_id": "prj_xyz789",
  "due_date": "2025-03-15T00:00:00Z",
  "labels": ["backend", "security"],
  "estimated_hours": 8
}
\`\`\`

#### Update Task

\`\`\`http
PATCH /tasks/:id
Content-Type: application/json

{
  "status": "completed",
  "completed_at": "2025-02-28T14:30:00Z"
}
\`\`\`

#### Delete Task

\`\`\`http
DELETE /tasks/:id
\`\`\`

### Projects

#### List Projects

\`\`\`http
GET /projects
\`\`\`

#### Create Project

\`\`\`http
POST /projects
Content-Type: application/json

{
  "name": "Website Redesign",
  "description": "Complete overhaul of the marketing website",
  "team_id": "team_001",
  "visibility": "private"
}
\`\`\`

---

## Error Handling

All errors follow a consistent format:

\`\`\`json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The 'title' field is required",
    "details": [
      { "field": "title", "rule": "required" }
    ]
  }
}
\`\`\`

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| UNAUTHORIZED | 401 | Invalid or expired token |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 422 | Invalid request body |
| RATE_LIMITED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |

---

## Rate Limits

| Plan       | Requests/min | Requests/day |
|------------|-------------|--------------|
| Free       | 30          | 1,000        |
| Pro        | 120         | 10,000       |
| Enterprise | 600         | 100,000      |

---

## Webhooks

Configure webhooks to receive real-time notifications:

\`\`\`http
POST /webhooks
Content-Type: application/json

{
  "url": "https://your-app.com/webhook",
  "events": ["task.created", "task.updated", "task.completed"],
  "secret": "your-webhook-secret"
}
\`\`\`

Webhook payloads are signed with HMAC-SHA256 using your secret.`,
    },
    response:
      "I've created comprehensive **API documentation** for a Task Management API. It covers authentication with OAuth 2.0, CRUD endpoints for tasks and projects with full parameter tables, consistent error handling with error codes, rate limiting tiers, and webhook configuration. The document uses proper markdown formatting with HTTP examples and JSON response samples.",
    thinkingSteps: [
      'Planning documentation structure for an API...',
      'Designing authentication section with OAuth 2.0 flow...',
      'Documenting CRUD endpoints with request/response examples...',
      'Creating error handling reference with status codes...',
      'Adding rate limit tiers and webhook configuration...',
      'Formatting with proper markdown tables and code blocks...',
    ],
    toolName: 'Document Writer',
  },
  {
    trigger: ['dashboard', 'html', 'layout', 'page'],
    artifact: {
      title: 'Analytics Dashboard',
      type: 'html',
      language: 'html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Analytics Dashboard</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; min-height: 100vh; }
  .dashboard { display: grid; grid-template-columns: 240px 1fr; min-height: 100vh; }

  /* Sidebar */
  .sidebar { background: #1e293b; border-right: 1px solid #334155; padding: 24px 16px; }
  .logo { font-size: 20px; font-weight: 700; margin-bottom: 32px; padding: 0 8px; background: linear-gradient(135deg, #818cf8, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .nav-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 8px; color: #94a3b8; font-size: 14px; cursor: pointer; margin-bottom: 4px; transition: all 0.2s; }
  .nav-item:hover { background: #334155; color: #e2e8f0; }
  .nav-item.active { background: #3b82f6; color: white; }
  .nav-icon { width: 18px; text-align: center; }
  .nav-section { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #475569; padding: 16px 12px 8px; }

  /* Main */
  .main { padding: 24px 32px; overflow-y: auto; }
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
  .header h1 { font-size: 24px; font-weight: 700; }
  .header-actions { display: flex; gap: 12px; }
  .btn { padding: 8px 16px; border-radius: 8px; border: 1px solid #334155; background: #1e293b; color: #e2e8f0; font-size: 13px; cursor: pointer; transition: all 0.2s; }
  .btn:hover { background: #334155; }
  .btn-primary { background: #3b82f6; border-color: #3b82f6; }
  .btn-primary:hover { background: #2563eb; }

  /* Stats Grid */
  .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .stat-card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 20px; }
  .stat-label { font-size: 13px; color: #94a3b8; margin-bottom: 8px; }
  .stat-value { font-size: 28px; font-weight: 700; margin-bottom: 4px; }
  .stat-change { font-size: 12px; display: flex; align-items: center; gap: 4px; }
  .stat-change.up { color: #4ade80; }
  .stat-change.down { color: #f87171; }

  /* Charts */
  .charts { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; margin-bottom: 24px; }
  .chart-card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 20px; }
  .chart-title { font-size: 15px; font-weight: 600; margin-bottom: 16px; }
  .chart-placeholder { height: 200px; background: linear-gradient(180deg, rgba(99,102,241,0.1) 0%, transparent 100%); border-radius: 8px; display: flex; align-items: flex-end; padding: 0 8px; gap: 6px; }
  .chart-bar { flex: 1; background: linear-gradient(180deg, #818cf8, #6366f1); border-radius: 4px 4px 0 0; transition: height 0.3s; }

  /* Table */
  .table-card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; overflow: hidden; }
  .table-header { padding: 16px 20px; border-bottom: 1px solid #334155; font-weight: 600; }
  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; padding: 12px 20px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; border-bottom: 1px solid #334155; }
  td { padding: 12px 20px; font-size: 13px; border-bottom: 1px solid #1e293b; }
  tr:hover td { background: #1e293b80; }
  .badge { padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 500; }
  .badge-green { background: #065f4620; color: #4ade80; }
  .badge-yellow { background: #713f1220; color: #fbbf24; }
  .badge-red { background: #7f1d1d20; color: #f87171; }

  /* Donut */
  .donut-container { display: flex; flex-direction: column; align-items: center; gap: 16px; }
  .donut { width: 160px; height: 160px; border-radius: 50%; background: conic-gradient(#818cf8 0% 40%, #f472b6 40% 65%, #fbbf24 65% 85%, #4ade80 85% 100%); position: relative; }
  .donut::after { content: ''; position: absolute; inset: 40px; border-radius: 50%; background: #1e293b; }
  .donut-legend { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; }
  .legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #94a3b8; }
  .legend-dot { width: 8px; height: 8px; border-radius: 50%; }
</style>
</head>
<body>
<div class="dashboard">
  <aside class="sidebar">
    <div class="logo">Analytics</div>
    <div class="nav-section">Main</div>
    <div class="nav-item active"><span class="nav-icon">&#9632;</span> Dashboard</div>
    <div class="nav-item"><span class="nav-icon">&#9650;</span> Analytics</div>
    <div class="nav-item"><span class="nav-icon">&#9679;</span> Reports</div>
    <div class="nav-section">Manage</div>
    <div class="nav-item"><span class="nav-icon">&#9670;</span> Users</div>
    <div class="nav-item"><span class="nav-icon">&#9733;</span> Products</div>
    <div class="nav-item"><span class="nav-icon">&#9881;</span> Settings</div>
  </aside>

  <main class="main">
    <div class="header">
      <h1>Dashboard Overview</h1>
      <div class="header-actions">
        <button class="btn">Last 30 days</button>
        <button class="btn btn-primary">Export</button>
      </div>
    </div>

    <div class="stats">
      <div class="stat-card">
        <div class="stat-label">Total Revenue</div>
        <div class="stat-value">$48,295</div>
        <div class="stat-change up">+12.5% from last month</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Active Users</div>
        <div class="stat-value">2,847</div>
        <div class="stat-change up">+8.2% from last month</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Conversion Rate</div>
        <div class="stat-value">3.24%</div>
        <div class="stat-change down">-1.8% from last month</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Avg. Session</div>
        <div class="stat-value">4m 32s</div>
        <div class="stat-change up">+5.1% from last month</div>
      </div>
    </div>

    <div class="charts">
      <div class="chart-card">
        <div class="chart-title">Revenue Over Time</div>
        <div class="chart-placeholder">
          <div class="chart-bar" style="height:40%"></div>
          <div class="chart-bar" style="height:55%"></div>
          <div class="chart-bar" style="height:45%"></div>
          <div class="chart-bar" style="height:70%"></div>
          <div class="chart-bar" style="height:60%"></div>
          <div class="chart-bar" style="height:85%"></div>
          <div class="chart-bar" style="height:75%"></div>
          <div class="chart-bar" style="height:90%"></div>
          <div class="chart-bar" style="height:65%"></div>
          <div class="chart-bar" style="height:80%"></div>
          <div class="chart-bar" style="height:95%"></div>
          <div class="chart-bar" style="height:88%"></div>
        </div>
      </div>
      <div class="chart-card">
        <div class="chart-title">Traffic Sources</div>
        <div class="donut-container">
          <div class="donut"></div>
          <div class="donut-legend">
            <div class="legend-item"><div class="legend-dot" style="background:#818cf8"></div> Direct (40%)</div>
            <div class="legend-item"><div class="legend-dot" style="background:#f472b6"></div> Social (25%)</div>
            <div class="legend-item"><div class="legend-dot" style="background:#fbbf24"></div> Referral (20%)</div>
            <div class="legend-item"><div class="legend-dot" style="background:#4ade80"></div> Organic (15%)</div>
          </div>
        </div>
      </div>
    </div>

    <div class="table-card">
      <div class="table-header">Recent Transactions</div>
      <table>
        <thead>
          <tr>
            <th>Transaction</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>#TXN-001</td><td>Alice Johnson</td><td>$1,250.00</td><td><span class="badge badge-green">Completed</span></td><td>Feb 5, 2025</td></tr>
          <tr><td>#TXN-002</td><td>Bob Smith</td><td>$890.00</td><td><span class="badge badge-green">Completed</span></td><td>Feb 4, 2025</td></tr>
          <tr><td>#TXN-003</td><td>Carol White</td><td>$2,100.00</td><td><span class="badge badge-yellow">Pending</span></td><td>Feb 4, 2025</td></tr>
          <tr><td>#TXN-004</td><td>David Lee</td><td>$450.00</td><td><span class="badge badge-red">Failed</span></td><td>Feb 3, 2025</td></tr>
          <tr><td>#TXN-005</td><td>Emma Davis</td><td>$3,200.00</td><td><span class="badge badge-green">Completed</span></td><td>Feb 3, 2025</td></tr>
        </tbody>
      </table>
    </div>
  </main>
</div>
</body>
</html>`,
    },
    response:
      "I've built a full **analytics dashboard** in HTML and CSS. It features a dark-themed sidebar navigation, four KPI stat cards with trend indicators, a bar chart visualization for revenue over time, a donut chart for traffic sources, and a transaction table with status badges. The layout uses CSS Grid for a responsive two-column design.",
    thinkingSteps: [
      'Planning dashboard layout with sidebar and main content...',
      'Designing KPI stat cards with trend indicators...',
      'Creating bar chart visualization with CSS...',
      'Building donut chart for traffic source breakdown...',
      'Implementing transaction table with status badges...',
      'Applying dark theme styling across all components...',
    ],
    toolName: 'HTML Builder',
  },
  {
    trigger: ['utility', 'utils', 'helper', 'typescript', 'module'],
    artifact: {
      title: 'string-utils.ts',
      type: 'code',
      language: 'typescript',
      content: `/**
 * String Utility Module
 * A collection of performant string manipulation utilities for TypeScript projects.
 */

/**
 * Truncates a string to a specified length and appends an ellipsis.
 */
export function truncate(str: string, maxLength: number, suffix = '...'): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - suffix.length).trimEnd() + suffix
}

/**
 * Converts a string to camelCase.
 * @example toCamelCase('hello-world') => 'helloWorld'
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/[-_\\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^[A-Z]/, c => c.toLowerCase())
}

/**
 * Converts a string to PascalCase.
 * @example toPascalCase('hello-world') => 'HelloWorld'
 */
export function toPascalCase(str: string): string {
  const camel = toCamelCase(str)
  return camel.charAt(0).toUpperCase() + camel.slice(1)
}

/**
 * Converts a string to kebab-case.
 * @example toKebabCase('helloWorld') => 'hello-world'
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\\s_]+/g, '-')
    .toLowerCase()
}

/**
 * Converts a string to snake_case.
 * @example toSnakeCase('helloWorld') => 'hello_world'
 */
export function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\\s-]+/g, '_')
    .toLowerCase()
}

/**
 * Converts a string to Title Case.
 * @example toTitleCase('hello world') => 'Hello World'
 */
export function toTitleCase(str: string): string {
  const minorWords = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet'])
  return str
    .toLowerCase()
    .split(' ')
    .map((word, i) => {
      if (i === 0 || !minorWords.has(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1)
      }
      return word
    })
    .join(' ')
}

/**
 * Generates a URL-friendly slug from a string.
 * @example slugify('Hello World! 123') => 'hello-world-123'
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\\u0300-\\u036f]/g, '')
    .replace(/[^a-z0-9\\s-]/g, '')
    .trim()
    .replace(/[\\s]+/g, '-')
    .replace(/-+/g, '-')
}

/**
 * Masks a string, showing only the last N characters.
 * @example mask('4242424242424242', 4) => '************4242'
 */
export function mask(str: string, visibleChars = 4, maskChar = '*'): string {
  if (str.length <= visibleChars) return str
  const masked = maskChar.repeat(str.length - visibleChars)
  return masked + str.slice(-visibleChars)
}

/**
 * Extracts initials from a name string.
 * @example initials('John Doe') => 'JD'
 */
export function initials(name: string, maxChars = 2): string {
  return name
    .split(/\\s+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, maxChars)
    .join('')
}

/**
 * Highlights search terms in a string by wrapping matches in a tag.
 */
export function highlight(text: string, query: string, tag = 'mark'): string {
  if (!query.trim()) return text
  const escaped = query.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&')
  const regex = new RegExp(\`(\${escaped})\`, 'gi')
  return text.replace(regex, \`<\${tag}>$1</\${tag}>\`)
}

/**
 * Pluralizes a word based on a count.
 * @example pluralize(1, 'item') => '1 item'
 * @example pluralize(5, 'item') => '5 items'
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  const word = count === 1 ? singular : (plural || singular + 's')
  return \`\${count} \${word}\`
}

/**
 * Generates a random string of specified length.
 */
export function randomString(length = 8, charset = 'alphanumeric'): string {
  const charsets: Record<string, string> = {
    alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    alpha: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    numeric: '0123456789',
    hex: '0123456789abcdef',
  }
  const chars = charsets[charset] || charsets.alphanumeric
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Counts words in a string.
 */
export function wordCount(str: string): number {
  return str.trim().split(/\\s+/).filter(Boolean).length
}

/**
 * Estimates reading time in minutes.
 */
export function readingTime(text: string, wpm = 200): { minutes: number; text: string } {
  const words = wordCount(text)
  const minutes = Math.max(1, Math.ceil(words / wpm))
  return { minutes, text: \`\${minutes} min read\` }
}`,
    },
    response:
      "I've created a **TypeScript string utility module** with 15 well-documented functions: `truncate`, `toCamelCase`, `toPascalCase`, `toKebabCase`, `toSnakeCase`, `toTitleCase`, `slugify`, `mask`, `initials`, `highlight`, `pluralize`, `randomString`, `wordCount`, and `readingTime`. Each function includes JSDoc documentation with usage examples.",
    thinkingSteps: [
      'Planning a comprehensive string utility library...',
      'Designing case conversion functions (camel, pascal, kebab, snake)...',
      'Adding text manipulation utilities (truncate, mask, slugify)...',
      'Implementing search highlighting with regex escaping...',
      'Adding convenience functions (initials, pluralize, wordCount)...',
      'Writing JSDoc documentation with examples for all functions...',
    ],
    toolName: 'Code Generator',
  },
  {
    trigger: ['table', 'data', 'csv', 'schema'],
    artifact: {
      title: 'Employee Data Report',
      type: 'table',
      language: 'html',
      content: `<table style="width:100%;border-collapse:collapse;font-family:-apple-system,sans-serif;font-size:13px;">
<thead>
<tr style="background:#1e293b;color:#e2e8f0;">
<th style="padding:12px 16px;text-align:left;border-bottom:2px solid #334155;font-weight:600;">ID</th>
<th style="padding:12px 16px;text-align:left;border-bottom:2px solid #334155;font-weight:600;">Name</th>
<th style="padding:12px 16px;text-align:left;border-bottom:2px solid #334155;font-weight:600;">Department</th>
<th style="padding:12px 16px;text-align:left;border-bottom:2px solid #334155;font-weight:600;">Role</th>
<th style="padding:12px 16px;text-align:right;border-bottom:2px solid #334155;font-weight:600;">Salary</th>
<th style="padding:12px 16px;text-align:center;border-bottom:2px solid #334155;font-weight:600;">Status</th>
<th style="padding:12px 16px;text-align:left;border-bottom:2px solid #334155;font-weight:600;">Start Date</th>
<th style="padding:12px 16px;text-align:right;border-bottom:2px solid #334155;font-weight:600;">Performance</th>
</tr>
</thead>
<tbody>
<tr style="border-bottom:1px solid #1e293b40;">
<td style="padding:10px 16px;color:#94a3b8;">EMP-001</td>
<td style="padding:10px 16px;font-weight:500;">Sarah Chen</td>
<td style="padding:10px 16px;">Engineering</td>
<td style="padding:10px 16px;">Senior Developer</td>
<td style="padding:10px 16px;text-align:right;font-family:monospace;">$142,000</td>
<td style="padding:10px 16px;text-align:center;"><span style="background:#065f4630;color:#4ade80;padding:2px 8px;border-radius:4px;font-size:11px;">Active</span></td>
<td style="padding:10px 16px;">2021-03-15</td>
<td style="padding:10px 16px;text-align:right;font-weight:600;color:#4ade80;">4.8/5.0</td>
</tr>
<tr style="border-bottom:1px solid #1e293b40;background:#ffffff05;">
<td style="padding:10px 16px;color:#94a3b8;">EMP-002</td>
<td style="padding:10px 16px;font-weight:500;">Marcus Johnson</td>
<td style="padding:10px 16px;">Design</td>
<td style="padding:10px 16px;">Lead Designer</td>
<td style="padding:10px 16px;text-align:right;font-family:monospace;">$128,000</td>
<td style="padding:10px 16px;text-align:center;"><span style="background:#065f4630;color:#4ade80;padding:2px 8px;border-radius:4px;font-size:11px;">Active</span></td>
<td style="padding:10px 16px;">2020-08-01</td>
<td style="padding:10px 16px;text-align:right;font-weight:600;color:#4ade80;">4.6/5.0</td>
</tr>
<tr style="border-bottom:1px solid #1e293b40;">
<td style="padding:10px 16px;color:#94a3b8;">EMP-003</td>
<td style="padding:10px 16px;font-weight:500;">Priya Patel</td>
<td style="padding:10px 16px;">Engineering</td>
<td style="padding:10px 16px;">DevOps Engineer</td>
<td style="padding:10px 16px;text-align:right;font-family:monospace;">$135,000</td>
<td style="padding:10px 16px;text-align:center;"><span style="background:#065f4630;color:#4ade80;padding:2px 8px;border-radius:4px;font-size:11px;">Active</span></td>
<td style="padding:10px 16px;">2022-01-10</td>
<td style="padding:10px 16px;text-align:right;font-weight:600;color:#fbbf24;">3.9/5.0</td>
</tr>
<tr style="border-bottom:1px solid #1e293b40;background:#ffffff05;">
<td style="padding:10px 16px;color:#94a3b8;">EMP-004</td>
<td style="padding:10px 16px;font-weight:500;">Alex Rodriguez</td>
<td style="padding:10px 16px;">Product</td>
<td style="padding:10px 16px;">Product Manager</td>
<td style="padding:10px 16px;text-align:right;font-family:monospace;">$150,000</td>
<td style="padding:10px 16px;text-align:center;"><span style="background:#713f1230;color:#fbbf24;padding:2px 8px;border-radius:4px;font-size:11px;">On Leave</span></td>
<td style="padding:10px 16px;">2019-11-20</td>
<td style="padding:10px 16px;text-align:right;font-weight:600;color:#4ade80;">4.7/5.0</td>
</tr>
<tr style="border-bottom:1px solid #1e293b40;">
<td style="padding:10px 16px;color:#94a3b8;">EMP-005</td>
<td style="padding:10px 16px;font-weight:500;">Elena Kowalski</td>
<td style="padding:10px 16px;">Marketing</td>
<td style="padding:10px 16px;">Content Strategist</td>
<td style="padding:10px 16px;text-align:right;font-family:monospace;">$95,000</td>
<td style="padding:10px 16px;text-align:center;"><span style="background:#065f4630;color:#4ade80;padding:2px 8px;border-radius:4px;font-size:11px;">Active</span></td>
<td style="padding:10px 16px;">2023-06-05</td>
<td style="padding:10px 16px;text-align:right;font-weight:600;color:#4ade80;">4.2/5.0</td>
</tr>
<tr style="border-bottom:1px solid #1e293b40;background:#ffffff05;">
<td style="padding:10px 16px;color:#94a3b8;">EMP-006</td>
<td style="padding:10px 16px;font-weight:500;">James Wright</td>
<td style="padding:10px 16px;">Engineering</td>
<td style="padding:10px 16px;">Junior Developer</td>
<td style="padding:10px 16px;text-align:right;font-family:monospace;">$85,000</td>
<td style="padding:10px 16px;text-align:center;"><span style="background:#065f4630;color:#4ade80;padding:2px 8px;border-radius:4px;font-size:11px;">Active</span></td>
<td style="padding:10px 16px;">2024-01-15</td>
<td style="padding:10px 16px;text-align:right;font-weight:600;color:#fbbf24;">3.5/5.0</td>
</tr>
<tr style="border-bottom:1px solid #1e293b40;">
<td style="padding:10px 16px;color:#94a3b8;">EMP-007</td>
<td style="padding:10px 16px;font-weight:500;">Yuki Tanaka</td>
<td style="padding:10px 16px;">Design</td>
<td style="padding:10px 16px;">UX Researcher</td>
<td style="padding:10px 16px;text-align:right;font-family:monospace;">$110,000</td>
<td style="padding:10px 16px;text-align:center;"><span style="background:#7f1d1d30;color:#f87171;padding:2px 8px;border-radius:4px;font-size:11px;">Inactive</span></td>
<td style="padding:10px 16px;">2020-04-22</td>
<td style="padding:10px 16px;text-align:right;font-weight:600;color:#94a3b8;">N/A</td>
</tr>
<tr style="border-bottom:1px solid #1e293b40;background:#ffffff05;">
<td style="padding:10px 16px;color:#94a3b8;">EMP-008</td>
<td style="padding:10px 16px;font-weight:500;">Omar Hassan</td>
<td style="padding:10px 16px;">Engineering</td>
<td style="padding:10px 16px;">Staff Engineer</td>
<td style="padding:10px 16px;text-align:right;font-family:monospace;">$175,000</td>
<td style="padding:10px 16px;text-align:center;"><span style="background:#065f4630;color:#4ade80;padding:2px 8px;border-radius:4px;font-size:11px;">Active</span></td>
<td style="padding:10px 16px;">2018-09-30</td>
<td style="padding:10px 16px;text-align:right;font-weight:600;color:#4ade80;">4.9/5.0</td>
</tr>
</tbody>
</table>`,
    },
    response:
      "I've created an **employee data report** as a styled HTML table with 8 records. It includes columns for ID, name, department, role, salary, status (with color-coded badges), start date, and performance rating. The data spans multiple departments (Engineering, Design, Product, Marketing) with realistic salary ranges and varied statuses.",
    thinkingSteps: [
      'Designing table schema for employee data...',
      'Creating realistic sample data across departments...',
      'Applying styled headers and alternating row backgrounds...',
      'Adding status badges with color coding...',
      'Formatting salary and performance columns...',
      'Structuring 8 employee records with varied attributes...',
    ],
    toolName: 'Data Transformer',
  },
]

export function findMatchingTemplate(input: string): ArtifactTemplate | null {
  const lower = input.toLowerCase()
  for (const template of ARTIFACT_TEMPLATES) {
    const matchCount = template.trigger.filter((t) => lower.includes(t)).length
    if (matchCount > 0) return template
  }
  return null
}
