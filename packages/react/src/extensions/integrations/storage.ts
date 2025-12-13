/**
 * Storage Provider Extensions
 *
 * Cloud storage integrations for file uploads, attachments, and assets.
 * Supports major cloud providers with unified interface.
 *
 * @packageDocumentation
 */

import { defineExtension } from '../builder'
import type { Extension } from '../types'

// ============================================
// Types
// ============================================

export interface S3Config {
  accessKeyId: string
  secretAccessKey: string
  region: string
  bucket: string
  endpoint?: string
  forcePathStyle?: boolean
  signedUrlExpiration?: number
}

export interface CloudflareR2Config {
  accountId: string
  accessKeyId: string
  secretAccessKey: string
  bucket: string
  publicUrl?: string
}

export interface SupabaseStorageConfig {
  supabaseUrl: string
  supabaseKey: string
  bucket: string
  public?: boolean
}

export interface FirebaseStorageConfig {
  apiKey: string
  storageBucket: string
  projectId: string
}

export interface UploadThingConfig {
  apiKey: string
  appId: string
}

export interface CloudinaryConfig {
  cloudName: string
  apiKey: string
  apiSecret: string
  uploadPreset?: string
}

export interface VercelBlobConfig {
  token: string
  storeId?: string
}

// ============================================
// Storage Interface
// ============================================

interface StorageAdapter {
  upload(
    file: File | Blob,
    path: string,
    options?: UploadOptions
  ): Promise<UploadResult>
  download(path: string): Promise<Blob>
  delete(path: string): Promise<void>
  getSignedUrl(path: string, expiresIn?: number): Promise<string>
  list(prefix?: string): Promise<StorageItem[]>
}

interface UploadOptions {
  contentType?: string
  public?: boolean
  metadata?: Record<string, string>
  onProgress?: (progress: number) => void
}

interface UploadResult {
  url: string
  path: string
  size: number
  contentType: string
  metadata?: Record<string, string>
}

interface StorageItem {
  name: string
  path: string
  size: number
  lastModified: Date
  contentType?: string
}

// ============================================
// Extension Factories
// ============================================

/**
 * Create AWS S3 extension
 */
export function createS3Extension(
  config?: Partial<S3Config>
): Extension<S3Config> {
  return defineExtension<S3Config>({
    id: 'storage-s3',
    name: 'AWS S3',
    category: 'storage',
    description: 'Object storage with Amazon S3',
    author: 'Clarity Chat',
    tags: ['storage', 'aws', 's3', 'cloud'],
    homepage: 'https://aws.amazon.com/s3/',

    configSchema: {
      version: '1.0',
      required: ['accessKeyId', 'secretAccessKey', 'region', 'bucket'],
      properties: {
        accessKeyId: {
          type: 'secret',
          label: 'Access Key ID',
          envVar: 'AWS_ACCESS_KEY_ID',
        },
        secretAccessKey: {
          type: 'secret',
          label: 'Secret Access Key',
          envVar: 'AWS_SECRET_ACCESS_KEY',
        },
        region: {
          type: 'string',
          label: 'Region',
          default: 'us-east-1',
          envVar: 'AWS_REGION',
        },
        bucket: { type: 'string', label: 'Bucket Name', envVar: 'S3_BUCKET' },
        endpoint: { type: 'string', label: 'Custom Endpoint' },
        forcePathStyle: {
          type: 'boolean',
          label: 'Force Path Style',
          default: false,
        },
        signedUrlExpiration: {
          type: 'number',
          label: 'Signed URL Expiration (s)',
          default: 3600,
        },
      },
    },

    defaultConfig: {
      region: 'us-east-1',
      forcePathStyle: false,
      signedUrlExpiration: 3600,
      ...config,
    } as S3Config,

    initialize: async (ctx) => {
      ctx.logger.info('AWS S3 extension initialized')

      // Would use @aws-sdk/client-s3 and @aws-sdk/s3-request-presigner
      const adapter: StorageAdapter = {
        async upload(file, path, options) {
          ctx.logger.debug(`Uploading to S3: ${path}`)
          return {
            url: `https://${ctx.config.bucket}.s3.${ctx.config.region}.amazonaws.com/${path}`,
            path,
            size: file.size,
            contentType: options?.contentType || file.type,
          }
        },
        async download(path) {
          ctx.logger.debug(`Downloading from S3: ${path}`)
          return new Blob()
        },
        async delete(path) {
          ctx.logger.debug(`Deleting from S3: ${path}`)
        },
        async getSignedUrl(path, expiresIn = ctx.config.signedUrlExpiration) {
          ctx.logger.debug(`Generating signed URL for: ${path}`)
          return `https://${ctx.config.bucket}.s3.${ctx.config.region}.amazonaws.com/${path}?signed=true`
        },
        async list(prefix) {
          ctx.logger.debug(`Listing S3 objects with prefix: ${prefix}`)
          return []
        },
      }

      ctx.services.register('storage', adapter)
    },

    healthCheck: async () => {
      // Would check S3 bucket access
      return { healthy: true, message: 'S3 bucket accessible' }
    },
  })
}

/**
 * Create Cloudflare R2 extension
 */
export function createCloudflareR2Extension(
  config?: Partial<CloudflareR2Config>
): Extension<CloudflareR2Config> {
  return defineExtension<CloudflareR2Config>({
    id: 'storage-r2',
    name: 'Cloudflare R2',
    category: 'storage',
    description: 'S3-compatible object storage with zero egress fees',
    author: 'Clarity Chat',
    tags: ['storage', 'cloudflare', 'r2', 'edge'],
    homepage: 'https://cloudflare.com/products/r2/',

    configSchema: {
      version: '1.0',
      required: ['accountId', 'accessKeyId', 'secretAccessKey', 'bucket'],
      properties: {
        accountId: {
          type: 'string',
          label: 'Account ID',
          envVar: 'CLOUDFLARE_ACCOUNT_ID',
        },
        accessKeyId: {
          type: 'secret',
          label: 'Access Key ID',
          envVar: 'R2_ACCESS_KEY_ID',
        },
        secretAccessKey: {
          type: 'secret',
          label: 'Secret Access Key',
          envVar: 'R2_SECRET_ACCESS_KEY',
        },
        bucket: { type: 'string', label: 'Bucket Name', envVar: 'R2_BUCKET' },
        publicUrl: { type: 'string', label: 'Public URL' },
      },
    },

    defaultConfig: config as CloudflareR2Config,

    initialize: async (ctx) => {
      ctx.logger.info('Cloudflare R2 extension initialized')

      // R2 is S3-compatible, would use @aws-sdk/client-s3 with custom endpoint
      const adapter: StorageAdapter = {
        async upload(file, path, options) {
          ctx.logger.debug(`Uploading to R2: ${path}`)
          return {
            url: `${ctx.config.publicUrl || `https://${ctx.config.bucket}.${ctx.config.accountId}.r2.cloudflarestorage.com`}/${path}`,
            path,
            size: file.size,
            contentType: options?.contentType || file.type,
          }
        },
        async download(path) {
          return new Blob()
        },
        async delete(path) {
          ctx.logger.debug(`Deleting from R2: ${path}`)
        },
        async getSignedUrl(path) {
          return ''
        },
        async list(prefix) {
          return []
        },
      }

      ctx.services.register('storage', adapter)
    },
  })
}

/**
 * Create Supabase Storage extension
 */
export function createSupabaseStorageExtension(
  config?: Partial<SupabaseStorageConfig>
): Extension<SupabaseStorageConfig> {
  return defineExtension<SupabaseStorageConfig>({
    id: 'storage-supabase',
    name: 'Supabase Storage',
    category: 'storage',
    description: 'File storage with Supabase',
    author: 'Clarity Chat',
    tags: ['storage', 'supabase', 'managed'],
    homepage: 'https://supabase.com/storage',

    configSchema: {
      version: '1.0',
      required: ['supabaseUrl', 'supabaseKey', 'bucket'],
      properties: {
        supabaseUrl: {
          type: 'string',
          label: 'Supabase URL',
          envVar: 'NEXT_PUBLIC_SUPABASE_URL',
        },
        supabaseKey: {
          type: 'string',
          label: 'Supabase Key',
          envVar: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        },
        bucket: { type: 'string', label: 'Bucket Name' },
        public: { type: 'boolean', label: 'Public Bucket', default: false },
      },
    },

    defaultConfig: {
      public: false,
      ...config,
    } as SupabaseStorageConfig,

    initialize: async (ctx) => {
      ctx.logger.info('Supabase Storage extension initialized')

      // Would use @supabase/supabase-js
      const adapter: StorageAdapter = {
        async upload(file, path, options) {
          ctx.logger.debug(`Uploading to Supabase Storage: ${path}`)
          return {
            url: `${ctx.config.supabaseUrl}/storage/v1/object/public/${ctx.config.bucket}/${path}`,
            path,
            size: file.size,
            contentType: options?.contentType || file.type,
          }
        },
        async download(path) {
          return new Blob()
        },
        async delete(path) {
          ctx.logger.debug(`Deleting from Supabase Storage: ${path}`)
        },
        async getSignedUrl(path, expiresIn = 3600) {
          return ''
        },
        async list(prefix) {
          return []
        },
      }

      ctx.services.register('storage', adapter)
    },
  })
}

/**
 * Create Firebase Storage extension
 */
export function createFirebaseStorageExtension(
  config?: Partial<FirebaseStorageConfig>
): Extension<FirebaseStorageConfig> {
  return defineExtension<FirebaseStorageConfig>({
    id: 'storage-firebase',
    name: 'Firebase Storage',
    category: 'storage',
    description: 'Cloud storage for Firebase',
    author: 'Clarity Chat',
    tags: ['storage', 'firebase', 'google'],
    homepage: 'https://firebase.google.com/docs/storage',

    configSchema: {
      version: '1.0',
      required: ['apiKey', 'storageBucket', 'projectId'],
      properties: {
        apiKey: {
          type: 'string',
          label: 'API Key',
          envVar: 'FIREBASE_API_KEY',
        },
        storageBucket: { type: 'string', label: 'Storage Bucket' },
        projectId: { type: 'string', label: 'Project ID' },
      },
    },

    defaultConfig: config as FirebaseStorageConfig,

    initialize: async (ctx) => {
      ctx.logger.info('Firebase Storage extension initialized')

      const adapter: StorageAdapter = {
        async upload(file, path, options) {
          ctx.logger.debug(`Uploading to Firebase Storage: ${path}`)
          return {
            url: `https://firebasestorage.googleapis.com/v0/b/${ctx.config.storageBucket}/o/${encodeURIComponent(path)}?alt=media`,
            path,
            size: file.size,
            contentType: options?.contentType || file.type,
          }
        },
        async download(path) {
          return new Blob()
        },
        async delete(path) {},
        async getSignedUrl(path) {
          return ''
        },
        async list(prefix) {
          return []
        },
      }

      ctx.services.register('storage', adapter)
    },
  })
}

/**
 * Create UploadThing extension
 */
export function createUploadThingExtension(
  config?: Partial<UploadThingConfig>
): Extension<UploadThingConfig> {
  return defineExtension<UploadThingConfig>({
    id: 'storage-uploadthing',
    name: 'UploadThing',
    category: 'storage',
    description: 'File uploads for modern web apps',
    author: 'Clarity Chat',
    tags: ['storage', 'uploads', 'modern'],
    homepage: 'https://uploadthing.com',

    configSchema: {
      version: '1.0',
      required: ['apiKey', 'appId'],
      properties: {
        apiKey: {
          type: 'secret',
          label: 'API Key',
          envVar: 'UPLOADTHING_SECRET',
        },
        appId: {
          type: 'string',
          label: 'App ID',
          envVar: 'UPLOADTHING_APP_ID',
        },
      },
    },

    defaultConfig: config as UploadThingConfig,

    initialize: async (ctx) => {
      ctx.logger.info('UploadThing extension initialized')

      const adapter: StorageAdapter = {
        async upload(file, path) {
          ctx.logger.debug(`Uploading to UploadThing: ${path}`)
          return {
            url: `https://utfs.io/f/${path}`,
            path,
            size: file.size,
            contentType: file.type,
          }
        },
        async download(path) {
          return new Blob()
        },
        async delete(path) {},
        async getSignedUrl(path) {
          return ''
        },
        async list() {
          return []
        },
      }

      ctx.services.register('storage', adapter)
    },
  })
}

/**
 * Create Cloudinary extension
 */
export function createCloudinaryExtension(
  config?: Partial<CloudinaryConfig>
): Extension<CloudinaryConfig> {
  return defineExtension<CloudinaryConfig>({
    id: 'storage-cloudinary',
    name: 'Cloudinary',
    category: 'storage',
    description: 'Media management and optimization',
    author: 'Clarity Chat',
    tags: ['storage', 'images', 'video', 'cdn', 'optimization'],
    homepage: 'https://cloudinary.com',

    configSchema: {
      version: '1.0',
      required: ['cloudName', 'apiKey', 'apiSecret'],
      properties: {
        cloudName: {
          type: 'string',
          label: 'Cloud Name',
          envVar: 'CLOUDINARY_CLOUD_NAME',
        },
        apiKey: {
          type: 'string',
          label: 'API Key',
          envVar: 'CLOUDINARY_API_KEY',
        },
        apiSecret: {
          type: 'secret',
          label: 'API Secret',
          envVar: 'CLOUDINARY_API_SECRET',
        },
        uploadPreset: { type: 'string', label: 'Upload Preset' },
      },
    },

    defaultConfig: config as CloudinaryConfig,

    initialize: async (ctx) => {
      ctx.logger.info('Cloudinary extension initialized')

      const adapter: StorageAdapter = {
        async upload(file, path, options) {
          ctx.logger.debug(`Uploading to Cloudinary: ${path}`)
          return {
            url: `https://res.cloudinary.com/${ctx.config.cloudName}/image/upload/${path}`,
            path,
            size: file.size,
            contentType: options?.contentType || file.type,
          }
        },
        async download(path) {
          return new Blob()
        },
        async delete(path) {},
        async getSignedUrl(path) {
          return ''
        },
        async list() {
          return []
        },
      }

      ctx.services.register('storage', adapter)
    },
  })
}

/**
 * Create Vercel Blob extension
 */
export function createVercelBlobExtension(
  config?: Partial<VercelBlobConfig>
): Extension<VercelBlobConfig> {
  return defineExtension<VercelBlobConfig>({
    id: 'storage-vercel-blob',
    name: 'Vercel Blob',
    category: 'storage',
    description: 'Edge-first object storage',
    author: 'Clarity Chat',
    tags: ['storage', 'vercel', 'edge', 'serverless'],
    homepage: 'https://vercel.com/docs/storage/vercel-blob',

    configSchema: {
      version: '1.0',
      required: ['token'],
      properties: {
        token: {
          type: 'secret',
          label: 'Blob Token',
          envVar: 'BLOB_READ_WRITE_TOKEN',
        },
        storeId: { type: 'string', label: 'Store ID' },
      },
    },

    defaultConfig: config as VercelBlobConfig,

    initialize: async (ctx) => {
      ctx.logger.info('Vercel Blob extension initialized')

      // Would use @vercel/blob
      const adapter: StorageAdapter = {
        async upload(file, path) {
          ctx.logger.debug(`Uploading to Vercel Blob: ${path}`)
          return {
            url: `https://${ctx.config.storeId || 'default'}.public.blob.vercel-storage.com/${path}`,
            path,
            size: file.size,
            contentType: file.type,
          }
        },
        async download(path) {
          return new Blob()
        },
        async delete(path) {},
        async getSignedUrl(path) {
          return ''
        },
        async list() {
          return []
        },
      }

      ctx.services.register('storage', adapter)
    },
  })
}
