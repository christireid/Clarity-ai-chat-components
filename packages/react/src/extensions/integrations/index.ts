/**
 * Built-in Integrations
 *
 * Pre-built extensions for popular services and frameworks.
 * All integrations are tree-shakeable and only loaded when imported.
 *
 * @packageDocumentation
 */

// ============================================
// AI Model Providers
// ============================================

export {
  createCohereExtension,
  createMistralExtension,
  createTogetherExtension,
  createGroqExtension,
  createOllamaExtension,
  createAzureOpenAIExtension,
  createFireworksExtension,
  createPerplexityExtension,
  createReplicateExtension,
  createHuggingFaceExtension,
  createDeepSeekExtension,
  createAI21Extension,
} from './ai-providers'

export type {
  CohereConfig,
  MistralConfig,
  TogetherConfig,
  GroqConfig,
  OllamaConfig,
  AzureOpenAIConfig,
  FireworksConfig,
  PerplexityConfig,
  ReplicateConfig,
  HuggingFaceConfig,
  DeepSeekConfig,
  AI21Config,
} from './ai-providers'

// ============================================
// Vector Stores
// ============================================

export {
  createMilvusExtension,
  createPgVectorExtension,
  createSupabaseVectorExtension,
  createElasticsearchExtension,
  createRedisVectorExtension,
  createMongoDBAtlasExtension,
  createLanceDBExtension,
} from './vector-stores'

export type {
  MilvusConfig,
  PgVectorConfig,
  SupabaseVectorConfig,
  ElasticsearchConfig,
  RedisVectorConfig,
  MongoDBAtlasConfig,
  LanceDBConfig,
} from './vector-stores'

// ============================================
// Authentication
// ============================================

export {
  createAuth0Extension,
  createClerkExtension,
  createNextAuthExtension,
  createSupabaseAuthExtension,
  createFirebaseAuthExtension,
  createKeycloakExtension,
  createOktaExtension,
  createCognitoExtension,
} from './auth'

export type {
  Auth0Config,
  ClerkConfig,
  NextAuthConfig,
  SupabaseAuthConfig,
  FirebaseAuthConfig,
  KeycloakConfig,
  OktaConfig,
  CognitoConfig,
} from './auth'

// ============================================
// Real-time Collaboration
// ============================================

export {
  createLiveblocksExtension,
  createSocketIOExtension,
  createYjsExtension,
  createPusherExtension,
  createAblyExtension,
  createPartyKitExtension,
} from './realtime'

export type {
  LiveblocksConfig,
  SocketIOConfig,
  YjsConfig,
  PusherConfig,
  AblyConfig,
  PartyKitConfig,
} from './realtime'

// ============================================
// Storage
// ============================================

export {
  createS3Extension,
  createCloudflareR2Extension,
  createSupabaseStorageExtension,
  createFirebaseStorageExtension,
  createUploadThingExtension,
  createCloudinaryExtension,
  createVercelBlobExtension,
} from './storage'

export type {
  S3Config,
  CloudflareR2Config,
  SupabaseStorageConfig,
  FirebaseStorageConfig,
  UploadThingConfig,
  CloudinaryConfig,
  VercelBlobConfig,
} from './storage'

// ============================================
// Notifications
// ============================================

export {
  createTwilioExtension,
  createSendGridExtension,
  createResendExtension,
  createPostmarkExtension,
  createOneSignalExtension,
  createKnockExtension,
  createNovuExtension,
} from './notifications'

export type {
  TwilioConfig,
  SendGridConfig,
  ResendConfig,
  PostmarkConfig,
  OneSignalConfig,
  KnockConfig,
  NovuConfig,
} from './notifications'

// ============================================
// Search
// ============================================

export {
  createAlgoliaExtension,
  createTypesenseExtension,
  createMeilisearchExtension,
  createElasticSearchExtension,
  createOramaExtension,
} from './search'

export type {
  AlgoliaConfig,
  TypesenseConfig,
  MeilisearchConfig,
  ElasticSearchConfig,
  OramaConfig,
} from './search'

// ============================================
// CRM & Customer Support
// ============================================

export {
  createIntercomExtension,
  createZendeskExtension,
  createHubSpotExtension,
  createFreshDeskExtension,
  createCrispExtension,
  createDriftExtension,
} from './crm'

export type {
  IntercomConfig,
  ZendeskConfig,
  HubSpotConfig,
  FreshDeskConfig,
  CrispConfig,
  DriftConfig,
} from './crm'

// ============================================
// Observability & Monitoring
// ============================================

export {
  createDataDogExtension,
  createOpenTelemetryExtension,
  createNewRelicExtension,
  createHoneycombExtension,
  createGrafanaExtension,
  createLogflareExtension,
  createAxiomExtension,
  createBetterStackExtension,
} from './observability'

export type {
  DataDogConfig,
  OpenTelemetryConfig,
  NewRelicConfig,
  HoneycombConfig,
  GrafanaConfig,
  LogflareConfig,
  AxiomConfig,
  BetterStackConfig,
} from './observability'

// ============================================
// Payments & Billing
// ============================================

export {
  createStripeExtension,
  createLemonSqueezyExtension,
  createPaddleExtension,
} from './payments'

export type { StripeConfig, LemonSqueezyConfig, PaddleConfig } from './payments'

// ============================================
// Feature Flags & Experimentation
// ============================================

export {
  createLaunchDarklyExtension,
  createPostHogFlagsExtension,
  createUnleashExtension,
  createFlagsmithExtension,
  createGrowthBookExtension,
} from './feature-flags'

export type {
  LaunchDarklyConfig,
  PostHogFlagsConfig,
  UnleashConfig,
  FlagsmithConfig,
  GrowthBookConfig,
} from './feature-flags'
