import { logger } from '@clarity-chat/utils/logger';
/**
 * Real-time Collaboration Extensions
 *
 * Enable live collaboration features in chat applications.
 * Supports presence, live cursors, and synchronized state.
 *
 * @packageDocumentation
 */

import { defineExtension } from '../builder'
import type { Extension } from '../types'

// ============================================
// Types
// ============================================

export interface LiveblocksConfig {
  publicApiKey: string
  secretApiKey?: string
  throttle?: number
  lostConnectionTimeout?: number
}

export interface SocketIOConfig {
  url: string
  path?: string
  transports?: ('websocket' | 'polling')[]
  reconnection?: boolean
  reconnectionAttempts?: number
  reconnectionDelay?: number
  auth?: Record<string, unknown>
}

export interface YjsConfig {
  documentName: string
  provider?: 'websocket' | 'webrtc' | 'indexeddb'
  websocketUrl?: string
  signalingServers?: string[]
}

export interface PusherConfig {
  appKey: string
  cluster: string
  appId?: string
  secret?: string
  useTLS?: boolean
  encrypted?: boolean
}

export interface AblyConfig {
  apiKey: string
  clientId?: string
  echoMessages?: boolean
  recover?: string
}

export interface PartyKitConfig {
  host: string
  room: string
  party?: string
}

// ============================================
// Realtime Interface
// ============================================

interface RealtimeAdapter {
  connect(): Promise<void>
  disconnect(): void
  subscribe(channel: string, callback: (data: unknown) => void): () => void
  publish(channel: string, data: unknown): void
  getPresence(): Map<string, PresenceData>
  updatePresence(data: PresenceData): void
  onPresenceChange(
    callback: (presence: Map<string, PresenceData>) => void
  ): () => void
}

interface PresenceData {
  id: string
  name?: string
  cursor?: { x: number; y: number }
  selection?: unknown
  lastSeen?: Date
  metadata?: Record<string, unknown>
}

// ============================================
// Extension Factories
// ============================================

/**
 * Create Liveblocks extension
 */
export function createLiveblocksExtension(
  config?: Partial<LiveblocksConfig>
): Extension<LiveblocksConfig> {
  return defineExtension<LiveblocksConfig>({
    id: 'realtime-liveblocks',
    name: 'Liveblocks',
    category: 'realtime',
    description: 'Real-time collaboration infrastructure',
    author: 'Clarity Chat',
    tags: ['realtime', 'collaboration', 'presence', 'cursors', 'multiplayer'],
    homepage: 'https://liveblocks.io',

    configSchema: {
      version: '1.0',
      required: ['publicApiKey'],
      properties: {
        publicApiKey: {
          type: 'string',
          label: 'Public API Key',
          envVar: 'LIVEBLOCKS_PUBLIC_KEY',
        },
        secretApiKey: {
          type: 'secret',
          label: 'Secret API Key',
          envVar: 'LIVEBLOCKS_SECRET_KEY',
        },
        throttle: { type: 'number', label: 'Throttle (ms)', default: 100 },
        lostConnectionTimeout: {
          type: 'number',
          label: 'Lost Connection Timeout (ms)',
          default: 5000,
        },
      },
    },

    defaultConfig: {
      throttle: 100,
      lostConnectionTimeout: 5000,
      ...config,
    } as LiveblocksConfig,

    initialize: async (ctx) => {
      ctx.logger.info('Liveblocks extension initialized')

      let presence = new Map<string, PresenceData>()
      const presenceCallbacks = new Set<
        (p: Map<string, PresenceData>) => void
      >()

      const adapter: RealtimeAdapter = {
        async connect() {
          ctx.logger.info('Connecting to Liveblocks')
          // Would use @liveblocks/client
        },
        disconnect() {
          ctx.logger.info('Disconnecting from Liveblocks')
        },
        subscribe(channel, callback) {
          ctx.logger.debug(`Subscribing to channel: ${channel}`)
          return () => {}
        },
        publish(channel, data) {
          ctx.logger.debug(`Publishing to channel: ${channel}`)
        },
        getPresence() {
          return presence
        },
        updatePresence(data) {
          presence.set(data.id, data)
          presenceCallbacks.forEach((cb) => cb(presence))
        },
        onPresenceChange(callback) {
          presenceCallbacks.add(callback)
          return () => presenceCallbacks.delete(callback)
        },
      }

      ctx.services.register('realtime', adapter)
      ctx.events.emit('realtime:initialized', { provider: 'liveblocks' })
    },

    dispose: async (ctx) => {
      const adapter = ctx.services.get<RealtimeAdapter>('realtime')
      adapter?.disconnect()
    },
  })
}

/**
 * Create Socket.IO extension
 */
export function createSocketIOExtension(
  config?: Partial<SocketIOConfig>
): Extension<SocketIOConfig> {
  return defineExtension<SocketIOConfig>({
    id: 'realtime-socketio',
    name: 'Socket.IO',
    category: 'realtime',
    description: 'Bidirectional event-based communication',
    author: 'Clarity Chat',
    tags: ['realtime', 'websocket', 'events', 'bidirectional'],
    homepage: 'https://socket.io',

    configSchema: {
      version: '1.0',
      required: ['url'],
      properties: {
        url: {
          type: 'string',
          label: 'Server URL',
          default: 'ws://localhost:3001',
        },
        path: { type: 'string', label: 'Path', default: '/socket.io' },
        reconnection: {
          type: 'boolean',
          label: 'Auto Reconnect',
          default: true,
        },
        reconnectionAttempts: {
          type: 'number',
          label: 'Reconnection Attempts',
          default: 5,
        },
        reconnectionDelay: {
          type: 'number',
          label: 'Reconnection Delay (ms)',
          default: 1000,
        },
      },
    },

    defaultConfig: {
      url: 'ws://localhost:3001',
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      ...config,
    } as SocketIOConfig,

    initialize: async (ctx) => {
      ctx.logger.info('Socket.IO extension initialized')

      let socket: unknown = null
      const subscriptions = new Map<string, Set<(data: unknown) => void>>()

      const adapter: RealtimeAdapter = {
        async connect() {
          ctx.logger.info(`Connecting to Socket.IO at ${ctx.config.url}`)
          // Would use socket.io-client
          // socket = io(ctx.config.url, {
          //   path: ctx.config.path,
          //   transports: ctx.config.transports,
          //   reconnection: ctx.config.reconnection,
          //   reconnectionAttempts: ctx.config.reconnectionAttempts,
          //   reconnectionDelay: ctx.config.reconnectionDelay,
          //   auth: ctx.config.auth,
          // })
        },
        disconnect() {
          ctx.logger.info('Disconnecting from Socket.IO')
          // socket?.disconnect()
        },
        subscribe(channel, callback) {
          if (!subscriptions.has(channel)) {
            subscriptions.set(channel, new Set())
          }
          subscriptions.get(channel)!.add(callback)
          // socket?.on(channel, callback)
          return () => {
            subscriptions.get(channel)?.delete(callback)
            // socket?.off(channel, callback)
          }
        },
        publish(channel, data) {
          // socket?.emit(channel, data)
        },
        getPresence() {
          return new Map()
        },
        updatePresence(data) {
          // socket?.emit('presence:update', data)
        },
        onPresenceChange(callback) {
          return () => {}
        },
      }

      ctx.services.register('realtime', adapter)
    },

    dispose: async (ctx) => {
      const adapter = ctx.services.get<RealtimeAdapter>('realtime')
      adapter?.disconnect()
    },
  })
}

/**
 * Create Yjs CRDT extension
 */
export function createYjsExtension(
  config?: Partial<YjsConfig>
): Extension<YjsConfig> {
  return defineExtension<YjsConfig>({
    id: 'realtime-yjs',
    name: 'Yjs',
    category: 'realtime',
    description: 'CRDT framework for real-time collaboration',
    author: 'Clarity Chat',
    tags: ['realtime', 'crdt', 'collaboration', 'offline-first'],
    homepage: 'https://yjs.dev',

    configSchema: {
      version: '1.0',
      required: ['documentName'],
      properties: {
        documentName: { type: 'string', label: 'Document Name' },
        provider: {
          type: 'string',
          label: 'Provider',
          default: 'websocket',
          enum: ['websocket', 'webrtc', 'indexeddb'],
        },
        websocketUrl: {
          type: 'string',
          label: 'WebSocket URL',
          default: 'wss://demos.yjs.dev',
        },
      },
    },

    defaultConfig: {
      provider: 'websocket',
      websocketUrl: 'wss://demos.yjs.dev',
      ...config,
    } as YjsConfig,

    initialize: async (ctx) => {
      ctx.logger.info('Yjs extension initialized')

      // Would use yjs and y-websocket/y-webrtc
      const adapter: RealtimeAdapter = {
        async connect() {
          ctx.logger.info('Connecting Yjs document')
        },
        disconnect() {
          ctx.logger.info('Disconnecting Yjs document')
        },
        subscribe(channel, callback) {
          return () => {}
        },
        publish(channel, data) {},
        getPresence() {
          return new Map()
        },
        updatePresence(data) {},
        onPresenceChange(callback) {
          return () => {}
        },
      }

      ctx.services.register('realtime', adapter)
      ctx.services.register('yjs:doc', null) // Would be Y.Doc instance
    },
  })
}

/**
 * Create Pusher extension
 */
export function createPusherExtension(
  config?: Partial<PusherConfig>
): Extension<PusherConfig> {
  return defineExtension<PusherConfig>({
    id: 'realtime-pusher',
    name: 'Pusher',
    category: 'realtime',
    description: 'Hosted real-time messaging service',
    author: 'Clarity Chat',
    tags: ['realtime', 'pusher', 'websocket', 'hosted'],
    homepage: 'https://pusher.com',

    configSchema: {
      version: '1.0',
      required: ['appKey', 'cluster'],
      properties: {
        appKey: { type: 'string', label: 'App Key', envVar: 'PUSHER_APP_KEY' },
        cluster: { type: 'string', label: 'Cluster', default: 'mt1' },
        appId: { type: 'string', label: 'App ID', envVar: 'PUSHER_APP_ID' },
        secret: { type: 'secret', label: 'Secret', envVar: 'PUSHER_SECRET' },
        useTLS: { type: 'boolean', label: 'Use TLS', default: true },
        encrypted: { type: 'boolean', label: 'Encrypted', default: true },
      },
    },

    defaultConfig: {
      cluster: 'mt1',
      useTLS: true,
      encrypted: true,
      ...config,
    } as PusherConfig,

    initialize: async (ctx) => {
      ctx.logger.info('Pusher extension initialized')

      // Would use pusher-js
      const adapter: RealtimeAdapter = {
        async connect() {
          ctx.logger.info('Connecting to Pusher')
        },
        disconnect() {
          ctx.logger.info('Disconnecting from Pusher')
        },
        subscribe(channel, callback) {
          ctx.logger.debug(`Subscribing to Pusher channel: ${channel}`)
          return () => {}
        },
        publish(channel, data) {
          // Pusher client can trigger client events on presence/private channels
        },
        getPresence() {
          return new Map()
        },
        updatePresence(data) {},
        onPresenceChange(callback) {
          return () => {}
        },
      }

      ctx.services.register('realtime', adapter)
    },
  })
}

/**
 * Create Ably extension
 */
export function createAblyExtension(
  config?: Partial<AblyConfig>
): Extension<AblyConfig> {
  return defineExtension<AblyConfig>({
    id: 'realtime-ably',
    name: 'Ably',
    category: 'realtime',
    description: 'Enterprise-grade realtime messaging',
    author: 'Clarity Chat',
    tags: ['realtime', 'ably', 'enterprise', 'messaging'],
    homepage: 'https://ably.com',

    configSchema: {
      version: '1.0',
      required: ['apiKey'],
      properties: {
        apiKey: { type: 'secret', label: 'API Key', envVar: 'ABLY_API_KEY' },
        clientId: { type: 'string', label: 'Client ID' },
        echoMessages: {
          type: 'boolean',
          label: 'Echo Messages',
          default: true,
        },
      },
    },

    defaultConfig: {
      echoMessages: true,
      ...config,
    } as AblyConfig,

    initialize: async (ctx) => {
      ctx.logger.info('Ably extension initialized')

      const adapter: RealtimeAdapter = {
        async connect() {
          ctx.logger.info('Connecting to Ably')
        },
        disconnect() {
          ctx.logger.info('Disconnecting from Ably')
        },
        subscribe(channel, callback) {
          return () => {}
        },
        publish(channel, data) {},
        getPresence() {
          return new Map()
        },
        updatePresence(data) {},
        onPresenceChange(callback) {
          return () => {}
        },
      }

      ctx.services.register('realtime', adapter)
    },
  })
}

/**
 * Create PartyKit extension
 */
export function createPartyKitExtension(
  config?: Partial<PartyKitConfig>
): Extension<PartyKitConfig> {
  return defineExtension<PartyKitConfig>({
    id: 'realtime-partykit',
    name: 'PartyKit',
    category: 'realtime',
    description: 'Deploy realtime applications at the edge',
    author: 'Clarity Chat',
    tags: ['realtime', 'edge', 'serverless', 'multiplayer'],
    homepage: 'https://partykit.io',

    configSchema: {
      version: '1.0',
      required: ['host', 'room'],
      properties: {
        host: {
          type: 'string',
          label: 'PartyKit Host',
          envVar: 'PARTYKIT_HOST',
        },
        room: { type: 'string', label: 'Room ID' },
        party: { type: 'string', label: 'Party Name', default: 'main' },
      },
    },

    defaultConfig: {
      party: 'main',
      ...config,
    } as PartyKitConfig,

    initialize: async (ctx) => {
      ctx.logger.info('PartyKit extension initialized')

      // Would use partysocket
      const adapter: RealtimeAdapter = {
        async connect() {
          ctx.logger.info('Connecting to PartyKit')
        },
        disconnect() {
          ctx.logger.info('Disconnecting from PartyKit')
        },
        subscribe(channel, callback) {
          return () => {}
        },
        publish(channel, data) {},
        getPresence() {
          return new Map()
        },
        updatePresence(data) {},
        onPresenceChange(callback) {
          return () => {}
        },
      }

      ctx.services.register('realtime', adapter)
    },
  })
}
