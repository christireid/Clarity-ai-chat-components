import { Agent } from '@clarity-chat/react'

export interface DevOpsAgent extends Agent {
  id: string
  name: string
  description: string
  status: 'idle' | 'active' | 'busy'
  lastAction?: string
  successRate: number
  icon: string
}

export const devOpsAgents: DevOpsAgent[] = [
  {
    id: 'infrastructure',
    name: 'Infrastructure Agent',
    description: 'Server provisioning, scaling, health monitoring',
    status: 'active',
    lastAction: 'Scaled production to 8 instances',
    successRate: 98.5,
    icon: '🏗️',
    tools: [
      {
        name: 'provision_server',
        description: 'Provision a new server',
        parameters: {
          type: 'object',
          properties: {
            environment: { type: 'string', enum: ['dev', 'staging', 'production'] },
            size: { type: 'string', enum: ['small', 'medium', 'large', 'xlarge'] },
            region: { type: 'string' },
          },
          required: ['environment', 'size'],
        },
        execute: async (params) => {
          return {
            success: true,
            serverId: `srv-${Date.now()}`,
            message: `Server provisioned in ${params.region || 'us-east-1'}`,
          }
        },
      },
      {
        name: 'scale_servers',
        description: 'Scale server count up or down',
        parameters: {
          type: 'object',
          properties: {
            environment: { type: 'string', enum: ['dev', 'staging', 'production'] },
            count: { type: 'number' },
          },
          required: ['environment', 'count'],
        },
        execute: async (params) => {
          return {
            success: true,
            previousCount: 5,
            newCount: params.count,
            message: `Scaled ${params.environment} to ${params.count} instances`,
          }
        },
      },
      {
        name: 'health_check',
        description: 'Check health status of all servers',
        parameters: {
          type: 'object',
          properties: {
            environment: { type: 'string', enum: ['dev', 'staging', 'production', 'all'] },
          },
        },
        execute: async (params) => {
          return {
            success: true,
            healthy: 8,
            unhealthy: 2,
            warnings: ['High CPU on srv-001', 'High memory on srv-003'],
            message: `Health check complete: 8/10 servers healthy`,
          }
        },
      },
    ],
  },
  {
    id: 'security',
    name: 'Security Agent',
    description: 'Vulnerability scanning, compliance, incident response',
    status: 'idle',
    successRate: 99.2,
    icon: '🔒',
    tools: [
      {
        name: 'vulnerability_scan',
        description: 'Scan for security vulnerabilities',
        parameters: {
          type: 'object',
          properties: {
            target: { type: 'string', enum: ['application', 'infrastructure', 'all'] },
            severity: { type: 'string', enum: ['critical', 'high', 'medium', 'low', 'all'] },
          },
        },
        execute: async (params) => {
          return {
            success: true,
            critical: 0,
            high: 2,
            medium: 5,
            low: 12,
            findings: [
              'Outdated SSL certificate on api.example.com',
              'Missing security headers on admin panel',
            ],
            message: `Scan complete: 0 critical, 2 high, 5 medium, 12 low`,
          }
        },
      },
      {
        name: 'compliance_check',
        description: 'Check compliance status',
        parameters: {
          type: 'object',
          properties: {
            standard: { type: 'string', enum: ['SOC2', 'HIPAA', 'GDPR', 'PCI-DSS'] },
          },
          required: ['standard'],
        },
        execute: async (params) => {
          return {
            success: true,
            compliant: true,
            score: 95,
            issues: ['Encryption at rest not enabled on 2 databases'],
            message: `${params.standard} compliance: 95% (mostly compliant)`,
          }
        },
      },
    ],
  },
  {
    id: 'performance',
    name: 'Performance Agent',
    description: 'Load analysis, optimization, bottleneck detection',
    status: 'idle',
    successRate: 97.8,
    icon: '⚡',
    tools: [
      {
        name: 'analyze_performance',
        description: 'Analyze system performance metrics',
        parameters: {
          type: 'object',
          properties: {
            timeRange: { type: 'string', enum: ['1h', '6h', '24h', '7d'] },
            metric: { type: 'string', enum: ['cpu', 'memory', 'network', 'disk', 'all'] },
          },
        },
        execute: async (params) => {
          return {
            success: true,
            avgCpu: 65,
            avgMemory: 72,
            peakLoad: '14:30 UTC',
            bottlenecks: ['Database queries slow during peak hours'],
            recommendations: ['Add read replicas', 'Implement query caching'],
            message: `Performance analysis (${params.timeRange}): avg CPU 65%, memory 72%`,
          }
        },
      },
      {
        name: 'load_test',
        description: 'Run load testing',
        parameters: {
          type: 'object',
          properties: {
            target: { type: 'string' },
            users: { type: 'number' },
            duration: { type: 'number' },
          },
          required: ['target', 'users'],
        },
        execute: async (params) => {
          return {
            success: true,
            requestsPerSecond: 1250,
            avgLatency: 145,
            errorRate: 0.2,
            message: `Load test: ${params.users} users, 1250 req/s, 145ms avg latency`,
          }
        },
      },
    ],
  },
  {
    id: 'cost',
    name: 'Cost Agent',
    description: 'Budget tracking, cost optimization, resource right-sizing',
    status: 'idle',
    successRate: 96.5,
    icon: '💰',
    tools: [
      {
        name: 'cost_analysis',
        description: 'Analyze infrastructure costs',
        parameters: {
          type: 'object',
          properties: {
            timeRange: { type: 'string', enum: ['day', 'week', 'month', 'year'] },
            provider: { type: 'string', enum: ['aws', 'gcp', 'azure', 'all'] },
          },
        },
        execute: async (params) => {
          return {
            success: true,
            totalCost: 12450,
            breakdown: {
              compute: 4800,
              storage: 2100,
              database: 4200,
              network: 1350,
            },
            trend: '+15%',
            message: `Monthly spend: $12,450 (↑15% vs last month)`,
          }
        },
      },
      {
        name: 'optimize_costs',
        description: 'Suggest cost optimization opportunities',
        parameters: {
          type: 'object',
          properties: {
            aggressiveness: { type: 'string', enum: ['conservative', 'moderate', 'aggressive'] },
          },
        },
        execute: async (params) => {
          return {
            success: true,
            recommendations: [
              { action: 'Right-size 3 underutilized instances', savings: 800 },
              { action: 'Use reserved instances for production', savings: 1200 },
              { action: 'Archive cold storage data', savings: 300 },
            ],
            totalPotentialSavings: 2300,
            message: `Found $2,300/month in potential savings`,
          }
        },
      },
    ],
  },
  {
    id: 'deployment',
    name: 'Deployment Agent',
    description: 'CI/CD pipeline, rollback automation, deployments',
    status: 'idle',
    successRate: 98.9,
    icon: '🚀',
    tools: [
      {
        name: 'deploy',
        description: 'Deploy application to environment',
        parameters: {
          type: 'object',
          properties: {
            environment: { type: 'string', enum: ['dev', 'staging', 'production'] },
            version: { type: 'string' },
            strategy: { type: 'string', enum: ['rolling', 'blue-green', 'canary'] },
          },
          required: ['environment'],
        },
        execute: async (params) => {
          return {
            success: true,
            deploymentId: `dep-${Date.now()}`,
            duration: 154,
            status: 'completed',
            message: `Deployed to ${params.environment} using ${params.strategy || 'rolling'} strategy`,
          }
        },
      },
      {
        name: 'rollback',
        description: 'Rollback to previous version',
        parameters: {
          type: 'object',
          properties: {
            environment: { type: 'string', enum: ['dev', 'staging', 'production'] },
            version: { type: 'string' },
          },
          required: ['environment'],
        },
        execute: async (params) => {
          return {
            success: true,
            rolledBackTo: params.version || 'v1.2.3',
            duration: 42,
            message: `Rolled back ${params.environment} to ${params.version || 'previous version'}`,
          }
        },
      },
    ],
  },
]
