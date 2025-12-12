'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Building2,
  ChevronLeft,
  Users,
  Shield,
  Activity,
  Database,
  Clock,
  AlertTriangle,
  Check,
  RefreshCw,
  ArrowRight,
  TrendingUp,
  Lock,
  FileText,
  Zap
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollReveal } from '@/components/UI/ScrollReveal'

interface MetricCard {
  label: string
  value: string | number
  change?: string
  icon: typeof Users
  color: string
}

interface LogEntry {
  id: string
  timestamp: Date
  level: 'info' | 'warn' | 'error' | 'success'
  action: string
  user: string
  tenant: string
  details: string
}

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

export default function EnterpriseProductionDemo() {
  const [isLive, setIsLive] = useState(true)
  const [metrics, setMetrics] = useState({
    connections: 10247,
    requestsPerSecond: 847,
    avgLatency: 42,
    errorRate: 0.02,
    cacheHitRate: 94.7,
    uptime: 99.99,
  })
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [tenants] = useState([
    { id: 'acme', name: 'Acme Corp', users: 1250, requests: 45000 },
    { id: 'globex', name: 'Globex Inc', users: 890, requests: 32000 },
    { id: 'stark', name: 'Stark Industries', users: 2100, requests: 78000 },
    { id: 'wayne', name: 'Wayne Enterprises', users: 1560, requests: 51000 },
  ])

  const logContainerRef = useRef<HTMLDivElement>(null)
  // Use ref to avoid stale closure in interval callbacks
  const tenantsRef = useRef(tenants)
  tenantsRef.current = tenants

  // Simulate live metrics updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setMetrics(prev => ({
        connections: Math.max(9000, prev.connections + Math.floor(Math.random() * 200 - 100)),
        requestsPerSecond: Math.max(500, prev.requestsPerSecond + Math.floor(Math.random() * 100 - 50)),
        avgLatency: Math.max(20, Math.min(100, prev.avgLatency + Math.floor(Math.random() * 10 - 5))),
        errorRate: Math.max(0, Math.min(1, parseFloat((prev.errorRate + (Math.random() * 0.02 - 0.01)).toFixed(2)))),
        cacheHitRate: Math.max(85, Math.min(99, parseFloat((prev.cacheHitRate + (Math.random() * 1 - 0.5)).toFixed(1)))),
        uptime: 99.99,
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [isLive])

  // Simulate log entries
  useEffect(() => {
    if (!isLive) return

    const actions = [
      { level: 'info', action: 'Message sent', details: 'Chat message processed successfully' },
      { level: 'info', action: 'Session started', details: 'New chat session initiated' },
      { level: 'success', action: 'API response', details: 'Streaming response completed' },
      { level: 'info', action: 'Token validation', details: 'API token validated' },
      { level: 'warn', action: 'Rate limit warning', details: 'Approaching rate limit threshold' },
      { level: 'info', action: 'Cache hit', details: 'Response served from cache' },
      { level: 'success', action: 'Error recovery', details: 'Connection automatically recovered' },
    ]

    const users = ['user_12345', 'user_67890', 'user_24680', 'user_13579', 'admin_001']
    const tenantIds = ['acme', 'globex', 'stark', 'wayne']

    const interval = setInterval(() => {
      const randomAction = actions[Math.floor(Math.random() * actions.length)]
      const newLog: LogEntry = {
        id: generateId(),
        timestamp: new Date(),
        level: randomAction.level as 'info' | 'warn' | 'error' | 'success',
        action: randomAction.action,
        user: users[Math.floor(Math.random() * users.length)],
        tenant: tenantIds[Math.floor(Math.random() * tenantIds.length)],
        details: randomAction.details,
      }

      setLogs(prev => [newLog, ...prev].slice(0, 50))
    }, 1500)

    return () => clearInterval(interval)
  }, [isLive])

  // Simulate occasional error and recovery
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      // Simulate an error and recovery - use ref to avoid stale closure
      const currentTenants = tenantsRef.current
      const errorLog: LogEntry = {
        id: generateId(),
        timestamp: new Date(),
        level: 'error',
        action: 'Connection error',
        user: 'system',
        tenant: currentTenants[Math.floor(Math.random() * currentTenants.length)].id,
        details: 'WebSocket connection dropped',
      }
      setLogs(prev => [errorLog, ...prev].slice(0, 50))

      // Recovery after 500ms
      setTimeout(() => {
        const recoveryLog: LogEntry = {
          id: generateId(),
          timestamp: new Date(),
          level: 'success',
          action: 'Auto-recovery',
          user: 'system',
          tenant: errorLog.tenant,
          details: 'Connection restored via error boundary',
        }
        setLogs(prev => [recoveryLog, ...prev].slice(0, 50))
      }, 500)
    }, 15000)

    return () => clearInterval(interval)
  }, [isLive])

  const metricCards: MetricCard[] = [
    { label: 'Active Connections', value: metrics.connections.toLocaleString(), change: '+12%', icon: Users, color: 'text-blue-600' },
    { label: 'Requests/Second', value: metrics.requestsPerSecond.toLocaleString(), change: '+8%', icon: Zap, color: 'text-green-600' },
    { label: 'Avg Latency', value: `${metrics.avgLatency}ms`, icon: Clock, color: 'text-yellow-600' },
    { label: 'Error Rate', value: `${metrics.errorRate}%`, icon: AlertTriangle, color: 'text-red-600' },
    { label: 'Cache Hit Rate', value: `${metrics.cacheHitRate}%`, icon: Database, color: 'text-purple-600' },
    { label: 'Uptime', value: `${metrics.uptime}%`, icon: Activity, color: 'text-emerald-600' },
  ]

  const logLevelColors = {
    info: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
    warn: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30',
    error: 'text-red-500 bg-red-100 dark:bg-red-900/30',
    success: 'text-green-500 bg-green-100 dark:bg-green-900/30',
  }

  return (
    <div className="container-docs py-12">
      <Link
        href="/demos"
        className="inline-flex items-center gap-2 text-text-secondary hover:text-brand-600 dark:hover:text-brand-400 mb-8 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Demos
      </Link>

      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium mb-6">
              <Building2 className="w-4 h-4" />
              Enterprise Scale
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Day in{' '}
              <span className="bg-gradient-to-r from-slate-600 to-gray-500 bg-clip-text text-transparent">
                Production
              </span>
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Real-time dashboard showing 10K+ concurrent connections, error recovery,
              multi-tenancy, and audit logging.
            </p>
          </div>
        </ScrollReveal>

        {/* Live Toggle */}
        <ScrollReveal delay={0.05}>
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setIsLive(!isLive)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isLive
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              {isLive ? 'Live Simulation' : 'Paused'}
            </button>
          </div>
        </ScrollReveal>

        {/* Metrics Grid */}
        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {metricCards.map((metric, idx) => {
              const Icon = metric.icon
              return (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 rounded-xl bg-bg-secondary border border-border"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-4 h-4 ${metric.color}`} />
                    <span className="text-xs text-text-secondary truncate">{metric.label}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{metric.value}</span>
                    {metric.change && (
                      <span className="text-xs text-green-600 dark:text-green-400 flex items-center">
                        <TrendingUp className="w-3 h-3" />
                        {metric.change}
                      </span>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Multi-Tenant Overview */}
          <ScrollReveal delay={0.2}>
            <div className="p-6 rounded-2xl bg-bg-secondary border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Multi-Tenant Isolation</h3>
                  <p className="text-sm text-text-secondary">Real-time tenant activity</p>
                </div>
              </div>

              <div className="space-y-4">
                {tenants.map((tenant, idx) => (
                  <motion.div
                    key={tenant.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 rounded-lg bg-bg-primary border border-border"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                          {tenant.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{tenant.name}</div>
                          <div className="text-xs text-text-secondary">{tenant.id}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs">
                        <Lock className="w-3 h-3" />
                        Isolated
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <div className="text-xs text-text-secondary">Active Users</div>
                        <div className="font-medium">{tenant.users.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs text-text-secondary">Requests/hr</div>
                        <div className="font-medium">{tenant.requests.toLocaleString()}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Audit Log */}
          <ScrollReveal delay={0.3}>
            <div className="p-6 rounded-2xl bg-bg-secondary border border-border">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Audit Log</h3>
                    <p className="text-sm text-text-secondary">Live activity stream</p>
                  </div>
                </div>
                <span className="text-xs text-text-secondary">
                  {logs.length} events
                </span>
              </div>

              <div
                ref={logContainerRef}
                className="h-[400px] overflow-y-auto space-y-2 pr-2"
              >
                <AnimatePresence initial={false}>
                  {logs.map((log) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3 rounded-lg bg-bg-primary border border-border text-sm"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${logLevelColors[log.level]}`}>
                          {log.level.toUpperCase()}
                        </span>
                        <span className="font-medium">{log.action}</span>
                        <span className="text-text-secondary text-xs ml-auto">
                          {log.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-text-secondary">
                        <span>User: {log.user}</span>
                        <span>Tenant: {log.tenant}</span>
                      </div>
                      <div className="text-xs text-text-secondary mt-1">{log.details}</div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Error Recovery Demo */}
        <ScrollReveal delay={0.4}>
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border border-green-200 dark:border-green-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-green-500 flex items-center justify-center">
                  <RefreshCw className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-green-700 dark:text-green-300">
                    Automatic Error Recovery
                  </h3>
                  <p className="text-green-600 dark:text-green-400">
                    Watch the audit log - errors are automatically caught and recovered
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-xl text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">100%</div>
                  <div className="text-xs text-text-secondary">Auto-Recovery</div>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-xl text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">&lt;500ms</div>
                  <div className="text-xs text-text-secondary">Recovery Time</div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Features Summary */}
        <ScrollReveal delay={0.5}>
          <div className="mt-12 grid md:grid-cols-4 gap-6">
            {[
              { icon: Users, title: '10K+ Concurrent', description: 'Handle massive scale with WebSocket pooling' },
              { icon: Shield, title: 'Multi-Tenant', description: 'Complete data isolation between organizations' },
              { icon: RefreshCw, title: 'Error Recovery', description: 'Automatic reconnection and state restoration' },
              { icon: FileText, title: 'Audit Logging', description: 'Complete activity trail for compliance' },
            ].map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="p-4 rounded-xl border border-border bg-bg-secondary text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                  </div>
                  <h4 className="font-bold mb-1">{feature.title}</h4>
                  <p className="text-sm text-text-secondary">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal delay={0.6}>
          <div className="mt-12 text-center">
            <Link
              href="/guides/multi-tenancy"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-colors"
            >
              Enterprise Guide <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
