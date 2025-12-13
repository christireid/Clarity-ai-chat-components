import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'


export const metadata: Metadata = {
  title: 'Enterprise Deployment Guide - Clarity Chat Components',
  description: 'Learn how to deploy Clarity Chat Components in enterprise environments with high availability, scaling, and security.',
}

export default function EnterpriseDeploymentPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Enterprise Deployment</h1>
        <p className="docs-lead">
          Learn how to deploy Clarity Chat Components in enterprise environments with high availability, scaling, security, and monitoring.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Deploy with high availability',
          'Scale horizontally',
          'Configure security',
          'Set up monitoring',
          'Handle disaster recovery',
        ]}
      />

      <section className="docs-section">
        <h2>High Availability</h2>
        <p>
          Deploy with high availability:
        </p>
        <CodePlayground
          initialCode={`// docker-compose.yml
version: '3.8'
services:
  chat-api:
    image: your-chat-api:latest
    replicas: 3
    deploy:
      restart_policy:
        condition: on-failure
    environment:
      - DATABASE_URL=postgresql://...
      - REDIS_URL=redis://...
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  chat-frontend:
    image: your-chat-frontend:latest
    replicas: 2
    environment:
      - API_URL=http://chat-api:3000`}
        />
      </section>

      <section className="docs-section">
        <h2>Scaling</h2>
        <p>
          Scale horizontally:
        </p>
        <CodePlayground
          initialCode={`// Kubernetes deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: chat-api
spec:
  replicas: 5
  selector:
    matchLabels:
      app: chat-api
  template:
    metadata:
      labels:
        app: chat-api
    spec:
      containers:
      - name: chat-api
        image: your-chat-api:latest
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: chat-secrets
              key: database-url`}
        />
      </section>

      <section className="docs-section">
        <h2>Security Configuration</h2>
        <p>
          Configure security:
        </p>
        <CodePlayground
          initialCode={`// Security headers
const securityHeaders = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Content-Security-Policy': "default-src 'self'",
  'Referrer-Policy': 'strict-origin-when-cross-origin',
}

// API authentication
function authenticateRequest(req: Request) {
  const token = req.headers.get('Authorization')
  if (!token) throw new Error('Unauthorized')
  
  // Verify token
  const tenant = verifyToken(token)
  return tenant
}

// Rate limiting
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})`}
        />
      </section>

      <section className="docs-section">
        <h2>Monitoring</h2>
        <p>
          Set up monitoring:
        </p>
        <CodePlayground
          initialCode={`// Monitoring setup
import { PerformanceAnalyticsDashboard } from '@clarity-chat/react'

function MonitoringDashboard() {
  return (
    <PerformanceAnalyticsDashboard
      metrics={{
        coreWebVitals: true,
        componentRenders: true,
        networkPerformance: true,
        memoryUsage: true,
        fps: true,
      }}
      onAlert={(alert) => {
        // Send to monitoring service
        sendToMonitoringService(alert)
      }}
    />
  )
}

// Health checks
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: Date.now(),
    uptime: process.uptime(),
  })
})`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Deploy with multiple replicas for HA</li>
          <li>Use load balancers</li>
          <li>Configure security headers</li>
          <li>Set up monitoring and alerts</li>
          <li>Implement disaster recovery</li>
          <li>Use secrets management</li>
          <li>Enable SSL/TLS</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li><a href="/guides/multi-tenancy-setup">Multi-Tenancy Setup</a> - Multi-tenant setup</li>
          <li><a href="/reference/components/performance-analytics-dashboard">PerformanceAnalyticsDashboard</a> - Performance monitoring</li>
        </ul>
      </section>
    </div>
  )
}
