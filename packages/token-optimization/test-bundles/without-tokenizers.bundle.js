var w = {
  'gpt-4': {
    displayName: 'GPT-4',
    provider: 'openai',
    encoding: 'cl100k_base',
    charsPerToken: 4,
    contextWindow: 8192,
    maxOutputTokens: 4096,
    recommendedOutputReserve: 2048,
    inputCostPer1M: 30,
    outputCostPer1M: 60,
    supportsCaching: !1,
    capabilities: {
      vision: !1,
      functionCalling: !0,
      reasoning: !1,
      jsonMode: !0,
    },
  },
  'gpt-4-turbo': {
    displayName: 'GPT-4 Turbo',
    provider: 'openai',
    encoding: 'cl100k_base',
    charsPerToken: 4,
    contextWindow: 128e3,
    maxOutputTokens: 4096,
    recommendedOutputReserve: 4096,
    inputCostPer1M: 10,
    outputCostPer1M: 30,
    cachedInputCostPer1M: 5,
    supportsCaching: !0,
    capabilities: {
      vision: !0,
      functionCalling: !0,
      reasoning: !1,
      jsonMode: !0,
    },
  },
  'gpt-4o': {
    displayName: 'GPT-4o',
    provider: 'openai',
    encoding: 'o200k_base',
    charsPerToken: 4,
    contextWindow: 128e3,
    maxOutputTokens: 16384,
    recommendedOutputReserve: 16384,
    inputCostPer1M: 2.5,
    outputCostPer1M: 10,
    cachedInputCostPer1M: 1.25,
    supportsCaching: !0,
    capabilities: {
      vision: !0,
      functionCalling: !0,
      reasoning: !1,
      jsonMode: !0,
    },
  },
  'gpt-4o-mini': {
    displayName: 'GPT-4o Mini',
    provider: 'openai',
    encoding: 'o200k_base',
    charsPerToken: 4,
    contextWindow: 128e3,
    maxOutputTokens: 16384,
    recommendedOutputReserve: 16384,
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.6,
    cachedInputCostPer1M: 0.075,
    supportsCaching: !0,
    capabilities: {
      vision: !0,
      functionCalling: !0,
      reasoning: !1,
      jsonMode: !0,
    },
  },
  'gpt-4.1': {
    displayName: 'GPT-4.1',
    provider: 'openai',
    encoding: 'o200k_base',
    charsPerToken: 4,
    contextWindow: 1e6,
    maxOutputTokens: 32768,
    recommendedOutputReserve: 32768,
    inputCostPer1M: 2,
    outputCostPer1M: 8,
    cachedInputCostPer1M: 0.5,
    supportsCaching: !0,
    capabilities: {
      vision: !0,
      functionCalling: !0,
      reasoning: !1,
      jsonMode: !0,
    },
    releaseDate: '2025-04',
  },
  'gpt-4.1-mini': {
    displayName: 'GPT-4.1 Mini',
    provider: 'openai',
    encoding: 'o200k_base',
    charsPerToken: 4,
    contextWindow: 1e6,
    maxOutputTokens: 32768,
    recommendedOutputReserve: 32768,
    inputCostPer1M: 0.4,
    outputCostPer1M: 1.6,
    cachedInputCostPer1M: 0.1,
    supportsCaching: !0,
    capabilities: {
      vision: !0,
      functionCalling: !0,
      reasoning: !1,
      jsonMode: !0,
    },
    releaseDate: '2025-04',
  },
  'gpt-4.1-nano': {
    displayName: 'GPT-4.1 Nano',
    provider: 'openai',
    encoding: 'o200k_base',
    charsPerToken: 4,
    contextWindow: 1e6,
    maxOutputTokens: 32768,
    recommendedOutputReserve: 32768,
    inputCostPer1M: 0.1,
    outputCostPer1M: 0.4,
    cachedInputCostPer1M: 0.025,
    supportsCaching: !0,
    capabilities: {
      vision: !0,
      functionCalling: !0,
      reasoning: !1,
      jsonMode: !0,
    },
    releaseDate: '2025-04',
  },
  'gpt-3.5-turbo': {
    displayName: 'GPT-3.5 Turbo',
    provider: 'openai',
    encoding: 'cl100k_base',
    charsPerToken: 4,
    contextWindow: 16385,
    maxOutputTokens: 4096,
    recommendedOutputReserve: 4096,
    inputCostPer1M: 0.5,
    outputCostPer1M: 1.5,
    supportsCaching: !1,
    capabilities: {
      vision: !1,
      functionCalling: !0,
      reasoning: !1,
      jsonMode: !0,
    },
  },
  o1: {
    displayName: 'O1',
    provider: 'openai',
    encoding: 'o200k_base',
    charsPerToken: 4,
    contextWindow: 2e5,
    maxOutputTokens: 1e5,
    recommendedOutputReserve: 1e5,
    inputCostPer1M: 15,
    outputCostPer1M: 60,
    cachedInputCostPer1M: 7.5,
    supportsCaching: !0,
    capabilities: {
      vision: !0,
      functionCalling: !0,
      reasoning: !0,
      jsonMode: !0,
    },
    notes: 'Extended thinking model with reasoning tokens',
  },
  'o1-mini': {
    displayName: 'O1 Mini',
    provider: 'openai',
    encoding: 'o200k_base',
    charsPerToken: 4,
    contextWindow: 128e3,
    maxOutputTokens: 65536,
    recommendedOutputReserve: 65536,
    inputCostPer1M: 3,
    outputCostPer1M: 12,
    cachedInputCostPer1M: 1.5,
    supportsCaching: !0,
    capabilities: {
      vision: !1,
      functionCalling: !0,
      reasoning: !0,
      jsonMode: !0,
    },
  },
  'o1-preview': {
    displayName: 'O1 Preview',
    provider: 'openai',
    encoding: 'o200k_base',
    charsPerToken: 4,
    contextWindow: 128e3,
    maxOutputTokens: 32768,
    recommendedOutputReserve: 32768,
    inputCostPer1M: 15,
    outputCostPer1M: 60,
    cachedInputCostPer1M: 7.5,
    supportsCaching: !0,
    capabilities: {
      vision: !1,
      functionCalling: !1,
      reasoning: !0,
      jsonMode: !1,
    },
    notes: 'Preview version, limited capabilities',
  },
  'o3-mini': {
    displayName: 'O3 Mini',
    provider: 'openai',
    encoding: 'o200k_base',
    charsPerToken: 4,
    contextWindow: 2e5,
    maxOutputTokens: 1e5,
    recommendedOutputReserve: 1e5,
    inputCostPer1M: 1.1,
    outputCostPer1M: 4.4,
    cachedInputCostPer1M: 0.55,
    supportsCaching: !0,
    capabilities: {
      vision: !1,
      functionCalling: !0,
      reasoning: !0,
      jsonMode: !0,
    },
    releaseDate: '2025-01',
  },
  'claude-3-opus': {
    displayName: 'Claude 3 Opus',
    provider: 'anthropic',
    encoding: 'claude',
    charsPerToken: 3.8,
    contextWindow: 2e5,
    maxOutputTokens: 4096,
    recommendedOutputReserve: 4096,
    inputCostPer1M: 15,
    outputCostPer1M: 75,
    cachedInputCostPer1M: 1.5,
    supportsCaching: !0,
    capabilities: {
      vision: !0,
      functionCalling: !0,
      reasoning: !1,
      jsonMode: !0,
    },
  },
  'claude-3-sonnet': {
    displayName: 'Claude 3 Sonnet',
    provider: 'anthropic',
    encoding: 'claude',
    charsPerToken: 3.8,
    contextWindow: 2e5,
    maxOutputTokens: 4096,
    recommendedOutputReserve: 4096,
    inputCostPer1M: 3,
    outputCostPer1M: 15,
    cachedInputCostPer1M: 0.3,
    supportsCaching: !0,
    capabilities: {
      vision: !0,
      functionCalling: !0,
      reasoning: !1,
      jsonMode: !0,
    },
  },
  'claude-3-haiku': {
    displayName: 'Claude 3 Haiku',
    provider: 'anthropic',
    encoding: 'claude',
    charsPerToken: 3.8,
    contextWindow: 2e5,
    maxOutputTokens: 4096,
    recommendedOutputReserve: 4096,
    inputCostPer1M: 0.25,
    outputCostPer1M: 1.25,
    cachedInputCostPer1M: 0.03,
    supportsCaching: !0,
    capabilities: {
      vision: !0,
      functionCalling: !0,
      reasoning: !1,
      jsonMode: !0,
    },
  },
  'claude-3-5-sonnet': {
    displayName: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    encoding: 'claude',
    charsPerToken: 3.8,
    contextWindow: 2e5,
    maxOutputTokens: 8192,
    recommendedOutputReserve: 8192,
    inputCostPer1M: 3,
    outputCostPer1M: 15,
    cachedInputCostPer1M: 0.3,
    supportsCaching: !0,
    capabilities: {
      vision: !0,
      functionCalling: !0,
      reasoning: !1,
      jsonMode: !0,
    },
  },
  'claude-3-5-haiku': {
    displayName: 'Claude 3.5 Haiku',
    provider: 'anthropic',
    encoding: 'claude',
    charsPerToken: 3.8,
    contextWindow: 2e5,
    maxOutputTokens: 8192,
    recommendedOutputReserve: 8192,
    inputCostPer1M: 0.8,
    outputCostPer1M: 4,
    cachedInputCostPer1M: 0.08,
    supportsCaching: !0,
    capabilities: {
      vision: !0,
      functionCalling: !0,
      reasoning: !1,
      jsonMode: !0,
    },
  },
  'claude-sonnet-4': {
    displayName: 'Claude Sonnet 4',
    provider: 'anthropic',
    encoding: 'claude',
    charsPerToken: 3.8,
    contextWindow: 1e6,
    maxOutputTokens: 16384,
    recommendedOutputReserve: 16384,
    inputCostPer1M: 3,
    outputCostPer1M: 15,
    cachedInputCostPer1M: 0.3,
    supportsCaching: !0,
    capabilities: {
      vision: !0,
      functionCalling: !0,
      reasoning: !1,
      jsonMode: !0,
    },
    releaseDate: '2024-12',
    notes: 'Context window upgraded to 1M in late 2024',
  },
  'claude-opus-4': {
    displayName: 'Claude Opus 4',
    provider: 'anthropic',
    encoding: 'claude',
    charsPerToken: 3.8,
    contextWindow: 1e6,
    maxOutputTokens: 32768,
    recommendedOutputReserve: 32768,
    inputCostPer1M: 15,
    outputCostPer1M: 75,
    cachedInputCostPer1M: 1.5,
    supportsCaching: !0,
    capabilities: {
      vision: !0,
      functionCalling: !0,
      reasoning: !1,
      jsonMode: !0,
    },
    releaseDate: '2025-01',
    notes: 'Context window upgraded to 1M',
  },
  'gemini-pro': {
    displayName: 'Gemini Pro',
    provider: 'google',
    encoding: 'gemini',
    charsPerToken: 4,
    contextWindow: 32760,
    maxOutputTokens: 8192,
    recommendedOutputReserve: 8192,
    inputCostPer1M: 0.5,
    outputCostPer1M: 1.5,
    supportsCaching: !1,
    capabilities: {
      vision: !1,
      functionCalling: !0,
      reasoning: !1,
      jsonMode: !0,
    },
  },
  'gemini-1.5-pro': {
    displayName: 'Gemini 1.5 Pro',
    provider: 'google',
    encoding: 'gemini',
    charsPerToken: 4,
    contextWindow: 2e6,
    maxOutputTokens: 8192,
    recommendedOutputReserve: 8192,
    inputCostPer1M: 1.25,
    outputCostPer1M: 5,
    cachedInputCostPer1M: 0.31,
    supportsCaching: !0,
    capabilities: {
      vision: !0,
      functionCalling: !0,
      reasoning: !1,
      jsonMode: !0,
    },
  },
  'gemini-1.5-flash': {
    displayName: 'Gemini 1.5 Flash',
    provider: 'google',
    encoding: 'gemini',
    charsPerToken: 4,
    contextWindow: 1e6,
    maxOutputTokens: 8192,
    recommendedOutputReserve: 8192,
    inputCostPer1M: 0.075,
    outputCostPer1M: 0.3,
    cachedInputCostPer1M: 0.01875,
    supportsCaching: !0,
    capabilities: {
      vision: !0,
      functionCalling: !0,
      reasoning: !1,
      jsonMode: !0,
    },
  },
  'gemini-2.0-flash': {
    displayName: 'Gemini 2.0 Flash',
    provider: 'google',
    encoding: 'gemini',
    charsPerToken: 4,
    contextWindow: 1e6,
    maxOutputTokens: 8192,
    recommendedOutputReserve: 8192,
    inputCostPer1M: 0.1,
    outputCostPer1M: 0.4,
    cachedInputCostPer1M: 0.025,
    supportsCaching: !0,
    capabilities: {
      vision: !0,
      functionCalling: !0,
      reasoning: !1,
      jsonMode: !0,
    },
    releaseDate: '2024-12',
  },
  'gemini-2.0-pro': {
    displayName: 'Gemini 2.0 Pro',
    provider: 'google',
    encoding: 'gemini',
    charsPerToken: 4,
    contextWindow: 2e6,
    maxOutputTokens: 8192,
    recommendedOutputReserve: 8192,
    inputCostPer1M: 1.25,
    outputCostPer1M: 5,
    cachedInputCostPer1M: 0.31,
    supportsCaching: !0,
    capabilities: {
      vision: !0,
      functionCalling: !0,
      reasoning: !1,
      jsonMode: !0,
    },
    releaseDate: '2025-01',
  },
  'deepseek-chat': {
    displayName: 'DeepSeek Chat',
    provider: 'deepseek',
    encoding: 'deepseek',
    charsPerToken: 4,
    contextWindow: 65536,
    maxOutputTokens: 8192,
    recommendedOutputReserve: 8192,
    inputCostPer1M: 0.14,
    outputCostPer1M: 0.28,
    cachedInputCostPer1M: 0.014,
    supportsCaching: !0,
    capabilities: {
      vision: !1,
      functionCalling: !0,
      reasoning: !1,
      jsonMode: !0,
    },
  },
  'deepseek-coder': {
    displayName: 'DeepSeek Coder',
    provider: 'deepseek',
    encoding: 'deepseek',
    charsPerToken: 4,
    contextWindow: 65536,
    maxOutputTokens: 8192,
    recommendedOutputReserve: 8192,
    inputCostPer1M: 0.14,
    outputCostPer1M: 0.28,
    cachedInputCostPer1M: 0.014,
    supportsCaching: !0,
    capabilities: {
      vision: !1,
      functionCalling: !0,
      reasoning: !1,
      jsonMode: !0,
    },
  },
  'deepseek-r1': {
    displayName: 'DeepSeek R1',
    provider: 'deepseek',
    encoding: 'deepseek',
    charsPerToken: 4,
    contextWindow: 128e3,
    maxOutputTokens: 32768,
    recommendedOutputReserve: 32768,
    inputCostPer1M: 0.55,
    outputCostPer1M: 2.19,
    cachedInputCostPer1M: 0.14,
    supportsCaching: !0,
    capabilities: {
      vision: !1,
      functionCalling: !0,
      reasoning: !0,
      jsonMode: !0,
    },
    releaseDate: '2025-01',
    notes: 'Reasoning model with extended thinking',
  },
  'llama-3': {
    displayName: 'Llama 3',
    provider: 'meta',
    encoding: 'llama3',
    charsPerToken: 4,
    contextWindow: 8192,
    maxOutputTokens: 4096,
    recommendedOutputReserve: 4096,
    inputCostPer1M: 0.25,
    outputCostPer1M: 0.25,
    supportsCaching: !1,
    capabilities: {
      vision: !1,
      functionCalling: !1,
      reasoning: !1,
      jsonMode: !1,
    },
  },
  'llama-3.1': {
    displayName: 'Llama 3.1',
    provider: 'meta',
    encoding: 'llama3',
    charsPerToken: 4,
    contextWindow: 128e3,
    maxOutputTokens: 4096,
    recommendedOutputReserve: 4096,
    inputCostPer1M: 0.25,
    outputCostPer1M: 0.25,
    supportsCaching: !1,
    capabilities: {
      vision: !1,
      functionCalling: !0,
      reasoning: !1,
      jsonMode: !0,
    },
  },
  'llama-3.2': {
    displayName: 'Llama 3.2',
    provider: 'meta',
    encoding: 'llama3',
    charsPerToken: 4,
    contextWindow: 128e3,
    maxOutputTokens: 4096,
    recommendedOutputReserve: 4096,
    inputCostPer1M: 0.2,
    outputCostPer1M: 0.2,
    supportsCaching: !1,
    capabilities: {
      vision: !0,
      functionCalling: !0,
      reasoning: !1,
      jsonMode: !0,
    },
  },
  'llama-3.3': {
    displayName: 'Llama 3.3',
    provider: 'meta',
    encoding: 'llama3',
    charsPerToken: 4,
    contextWindow: 128e3,
    maxOutputTokens: 8192,
    recommendedOutputReserve: 8192,
    inputCostPer1M: 0.4,
    outputCostPer1M: 0.4,
    supportsCaching: !1,
    capabilities: {
      vision: !0,
      functionCalling: !0,
      reasoning: !1,
      jsonMode: !0,
    },
    releaseDate: '2024-12',
  },
  'mistral-large': {
    displayName: 'Mistral Large',
    provider: 'mistral',
    encoding: 'mistral',
    charsPerToken: 4,
    contextWindow: 128e3,
    maxOutputTokens: 8192,
    recommendedOutputReserve: 8192,
    inputCostPer1M: 2,
    outputCostPer1M: 6,
    supportsCaching: !1,
    capabilities: {
      vision: !1,
      functionCalling: !0,
      reasoning: !1,
      jsonMode: !0,
    },
  },
  'mistral-medium': {
    displayName: 'Mistral Medium',
    provider: 'mistral',
    encoding: 'mistral',
    charsPerToken: 4,
    contextWindow: 32768,
    maxOutputTokens: 8192,
    recommendedOutputReserve: 8192,
    inputCostPer1M: 2.7,
    outputCostPer1M: 8.1,
    supportsCaching: !1,
    capabilities: {
      vision: !1,
      functionCalling: !0,
      reasoning: !1,
      jsonMode: !0,
    },
  },
  'mistral-small': {
    displayName: 'Mistral Small',
    provider: 'mistral',
    encoding: 'mistral',
    charsPerToken: 4,
    contextWindow: 32768,
    maxOutputTokens: 8192,
    recommendedOutputReserve: 8192,
    inputCostPer1M: 0.2,
    outputCostPer1M: 0.6,
    supportsCaching: !1,
    capabilities: {
      vision: !1,
      functionCalling: !0,
      reasoning: !1,
      jsonMode: !0,
    },
  },
}
function W(s) {
  let n =
    s.provider === 'meta' || s.provider === 'mistral' ? 'other' : s.provider
  return {
    inputCostPer1M: s.inputCostPer1M,
    outputCostPer1M: s.outputCostPer1M,
    cachedInputCostPer1M: s.cachedInputCostPer1M,
    contextWindow: s.contextWindow,
    maxOutputTokens: s.maxOutputTokens,
    provider: n,
  }
}
var q = Object.fromEntries(Object.entries(w).map(([s, n]) => [s, W(n)]))
function H(s) {
  return /[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/.test(s)
}
function U(s) {
  let n = 0
  for (let e of s)
    /[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/.test(e)
      ? (n += 3)
      : (n += 1)
  return n
}
function I(s, n) {
  if (!s) return 0
  let e = n && n in w ? w[n].charsPerToken : 4
  return H(s) ? Math.ceil(U(s) / e) : Math.ceil(s.length / e)
}
import * as M from 'react'
import j, {
  useRef as P,
  useEffect as S,
  useCallback as T,
  useMemo as L,
  useState as $,
  useDeferredValue as Be,
  useTransition as We,
  useOptimistic as qe,
} from 'react'
import { jsxs as z, jsx as y, Fragment as G } from 'react/jsx-runtime'
var K = 'gpt-4o',
  Q = 150
var x = {
  minimal: {
    exact: { maxSize: 100, ttl: 3e5 },
    smart: { maxSize: 50, ttl: 3e5 },
  },
  standard: {
    exact: { maxSize: 500, ttl: 18e5 },
    smart: { maxSize: 200, ttl: 18e5 },
  },
  production: {
    exact: { maxSize: 1e3, ttl: 36e5 },
    smart: { maxSize: 500, ttl: 36e5 },
  },
  enterprise: {
    exact: { maxSize: 5e3, ttl: 72e5 },
    smart: { maxSize: 2e3, ttl: 72e5 },
  },
}
var J = {
  maxTokens: 4096,
  reserveForOutput: 1e3,
  warningThreshold: 0.8,
  criticalThreshold: 0.95,
}
var Ue = { model: K, debounceMs: Q, ...J }
var je = {
  minimal: {
    description:
      'Development - lowest security overhead, suitable for local development',
    cache: x.minimal,
    compressionLevel: 'light',
    routingStrategy: 'cost-optimized',
    security: {
      enableSanitization: !0,
      enablePIIRedaction: !1,
      enableAuditLogging: !1,
      complianceLevel: 'minimal',
      auditRetention: 7,
    },
  },
  standard: {
    description:
      'Balanced defaults for most applications (recommended, DEFAULT)',
    cache: x.standard,
    compressionLevel: 'moderate',
    routingStrategy: 'balanced',
    security: {
      enableSanitization: !0,
      enablePIIRedaction: !1,
      enableAuditLogging: !0,
      complianceLevel: 'standard',
      auditRetention: 30,
    },
  },
  production: {
    description: 'Production workloads with enhanced security',
    cache: x.production,
    compressionLevel: 'moderate',
    routingStrategy: 'balanced',
    security: {
      enableSanitization: !0,
      enablePIIRedaction: !0,
      enableAuditLogging: !0,
      complianceLevel: 'standard',
      auditRetention: 30,
    },
  },
  enterprise: {
    description:
      'Maximum performance and compliance for high-volume applications',
    cache: x.enterprise,
    compressionLevel: 'aggressive',
    routingStrategy: 'quality-first',
    security: {
      enableSanitization: !0,
      enablePIIRedaction: !0,
      enableAuditLogging: !0,
      complianceLevel: 'strict',
      auditRetention: 90,
    },
  },
}
var Y = [
    {
      pattern: '[\u2028\u2029]',
      type: 'unicode_line_separator',
      severity: 'high',
    },
    {
      pattern: '[\u200B-\u200F\uFEFF\xAD]',
      type: 'unicode_zero_width',
      severity: 'high',
    },
    {
      pattern: '[\u202A-\u202E\u2066-\u2069]',
      type: 'unicode_bidi_override',
      severity: 'high',
    },
    {
      pattern: '[\uFE00-\uFE0F]',
      type: 'unicode_variation_selector',
      severity: 'medium',
    },
  ],
  Z = [
    {
      pattern: '!\\[.*?\\]\\(javascript:',
      type: 'markdown_js_injection',
      severity: 'high',
    },
    {
      pattern: '!\\[.*?\\]\\(data:',
      type: 'markdown_data_uri',
      severity: 'high',
    },
    { pattern: 'on\\w+\\s*=', type: 'html_event_handler', severity: 'high' },
    {
      pattern: '<script[\\s\\S]*?>',
      type: 'html_script_tag',
      severity: 'high',
    },
  ],
  V = [
    {
      pattern: '\\{\\s*"?function"?\\s*:',
      type: 'tool_function_injection',
      severity: 'high',
    },
    {
      pattern: '\\{\\s*"?tool_calls"?\\s*:',
      type: 'tool_calls_injection',
      severity: 'high',
    },
    {
      pattern: '\\{\\s*"?name"?\\s*:\\s*"?[a-z_]+',
      type: 'tool_name_injection',
      severity: 'medium',
    },
    {
      pattern: '<function_call>|<tool_use>',
      type: 'tool_xml_injection',
      severity: 'high',
    },
  ],
  X = [
    {
      pattern: '\\[INST\\]|\\[\\/INST\\]',
      type: 'indirect_llama_tags',
      severity: 'high',
    },
    {
      pattern: '<<SYS>>|<\\/SYS>>',
      type: 'indirect_system_tags',
      severity: 'high',
    },
    {
      pattern: 'Human:|Assistant:',
      type: 'indirect_role_markers',
      severity: 'high',
    },
    {
      pattern: '###\\s*(Instruction|Response|System)',
      type: 'indirect_markdown_sections',
      severity: 'medium',
    },
  ],
  ee = [
    {
      pattern: '\\bDAN\\b.*mode|do anything now',
      type: 'jailbreak_dan',
      severity: 'high',
    },
    {
      pattern: 'developer mode|dev mode enabled',
      type: 'jailbreak_dev_mode',
      severity: 'high',
    },
    {
      pattern: 'pretend you are|act as if you|imagine you',
      type: 'jailbreak_roleplay',
      severity: 'medium',
    },
  ],
  te = [
    {
      pattern: 'ignore.*previous.*instructions',
      type: 'instruction_override',
      severity: 'high',
    },
    { pattern: 'unicode.*bypass', type: 'encoding_bypass', severity: 'high' },
    { pattern: '\\[encoded:.*\\]', type: 'encoding_bypass', severity: 'high' },
    {
      pattern: 'system:\\s*.*',
      type: 'system_prompt_injection',
      severity: 'high',
    },
    {
      pattern: 'you\\s+are\\s+now',
      type: 'role_manipulation',
      severity: 'high',
    },
    {
      pattern: 'disregard.*above',
      type: 'context_override',
      severity: 'medium',
    },
    {
      pattern: 'translate.*to.*system',
      type: 'indirect_injection',
      severity: 'medium',
    },
    {
      pattern: 'base64.*instruction',
      type: 'encoding_injection',
      severity: 'high',
    },
    {
      pattern: 'compression.*ratio.*leak',
      type: 'side_channel',
      severity: 'medium',
    },
    {
      pattern: 'token.*count.*attack',
      type: 'timing_attack',
      severity: 'medium',
    },
  ],
  Ge = [...te, ...Y, ...Z, ...V, ...X, ...ee]
var ne = class D {
  htmlToText(n, e) {
    if (!n) return ''
    let i = {
        preserveLinks: e?.preserveLinks ?? !1,
        preserveStructure: e?.preserveStructure ?? !0,
      },
      t = n
    return (
      (t = t.replace(/<script[\s\S]*?<\/script>/gi, '')),
      (t = t.replace(/<style[\s\S]*?<\/style>/gi, '')),
      (t = t.replace(/<noscript[\s\S]*?<\/noscript>/gi, '')),
      (t = t.replace(/<!--[\s\S]*?-->/g, '')),
      i.preserveLinks
        ? (t = t.replace(
            /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,
            '$2 ($1)'
          ))
        : (t = t.replace(/<a[^>]*>([\s\S]*?)<\/a>/gi, '$1')),
      (t = t.replace(/<img[^>]+alt=["']([^"']*)["'][^>]*\/?>/gi, '$1')),
      (t = t.replace(/<img[^>]*\/?>/gi, '')),
      i.preserveStructure &&
        ((t = t.replace(
          /<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi,
          `

$1

`
        )),
        (t = t.replace(
          /<p[^>]*>([\s\S]*?)<\/p>/gi,
          `

$1

`
        )),
        (t = t.replace(
          /<div[^>]*>([\s\S]*?)<\/div>/gi,
          `
$1
`
        )),
        (t = t.replace(
          /<br\s*\/?>/gi,
          `
`
        )),
        (t = t.replace(
          /<hr\s*\/?>/gi,
          `
---
`
        ))),
      (t = t.replace(
        /<li[^>]*>([\s\S]*?)<\/li>/gi,
        `- $1
`
      )),
      (t = t.replace(
        /<[uo]l[^>]*>/gi,
        `
`
      )),
      (t = t.replace(
        /<\/[uo]l>/gi,
        `
`
      )),
      (t = t.replace(/<dt[^>]*>([\s\S]*?)<\/dt>/gi, '$1: ')),
      (t = t.replace(
        /<dd[^>]*>([\s\S]*?)<\/dd>/gi,
        `$1
`
      )),
      (t = t.replace(
        /<\/?dl[^>]*>/gi,
        `
`
      )),
      (t = t.replace(
        /<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi,
        `
> $1
`
      )),
      (t = t.replace(
        /<pre[^>]*>([\s\S]*?)<\/pre>/gi,
        `
$1
`
      )),
      (t = t.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '$1')),
      (t = this.convertTableToText(t)),
      (t = t.replace(/<[^>]+>/g, '')),
      (t = this.decodeEntities(t)),
      (t = t.replace(/[ \t]+/g, ' ')),
      (t = t.replace(
        /\n[ \t]+/g,
        `
`
      )),
      (t = t.replace(
        /[ \t]+\n/g,
        `
`
      )),
      (t = t.replace(
        /\n{3,}/g,
        `

`
      )),
      t.trim()
    )
  }
  htmlToMarkdown(n) {
    if (!n) return ''
    let e = n
    return (
      (e = e.replace(/<script[\s\S]*?<\/script>/gi, '')),
      (e = e.replace(/<style[\s\S]*?<\/style>/gi, '')),
      (e = e.replace(/<noscript[\s\S]*?<\/noscript>/gi, '')),
      (e = e.replace(/<!--[\s\S]*?-->/g, '')),
      (e = e.replace(
        /<h1[^>]*>([\s\S]*?)<\/h1>/gi,
        `

# $1

`
      )),
      (e = e.replace(
        /<h2[^>]*>([\s\S]*?)<\/h2>/gi,
        `

## $1

`
      )),
      (e = e.replace(
        /<h3[^>]*>([\s\S]*?)<\/h3>/gi,
        `

### $1

`
      )),
      (e = e.replace(
        /<h4[^>]*>([\s\S]*?)<\/h4>/gi,
        `

#### $1

`
      )),
      (e = e.replace(
        /<h5[^>]*>([\s\S]*?)<\/h5>/gi,
        `

##### $1

`
      )),
      (e = e.replace(
        /<h6[^>]*>([\s\S]*?)<\/h6>/gi,
        `

###### $1

`
      )),
      (e = e.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**')),
      (e = e.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**')),
      (e = e.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*')),
      (e = e.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, '*$1*')),
      (e = e.replace(/<del[^>]*>([\s\S]*?)<\/del>/gi, '~~$1~~')),
      (e = e.replace(/<s[^>]*>([\s\S]*?)<\/s>/gi, '~~$1~~')),
      (e = e.replace(/<strike[^>]*>([\s\S]*?)<\/strike>/gi, '~~$1~~')),
      (e = e.replace(
        /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,
        '[$2]($1)'
      )),
      (e = e.replace(
        /<img[^>]+src=["']([^"']+)["'][^>]+alt=["']([^"']*)["'][^>]*\/?>/gi,
        '![$2]($1)'
      )),
      (e = e.replace(
        /<img[^>]+alt=["']([^"']*)["'][^>]+src=["']([^"']+)["'][^>]*\/?>/gi,
        '![$1]($2)'
      )),
      (e = e.replace(/<img[^>]+src=["']([^"']+)["'][^>]*\/?>/gi, '![]($1)')),
      (e = e.replace(
        /<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi,
        '\n\n```\n$1\n```\n\n'
      )),
      (e = e.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, '\n\n```\n$1\n```\n\n')),
      (e = e.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '`$1`')),
      (e = this.convertBlockquotesToMarkdown(e)),
      (e = this.convertListsToMarkdown(e)),
      (e = this.convertTableToMarkdown(e)),
      (e = e.replace(
        /<p[^>]*>([\s\S]*?)<\/p>/gi,
        `

$1

`
      )),
      (e = e.replace(
        /<br\s*\/?>/gi,
        `
`
      )),
      (e = e.replace(
        /<hr\s*\/?>/gi,
        `

---

`
      )),
      (e = e.replace(/<[^>]+>/g, '')),
      (e = this.decodeEntities(e)),
      (e = e.replace(/[ \t]+/g, ' ')),
      (e = e.replace(
        /\n[ \t]+/g,
        `
`
      )),
      (e = e.replace(
        /[ \t]+\n/g,
        `
`
      )),
      (e = e.replace(
        /\n{3,}/g,
        `

`
      )),
      e.trim()
    )
  }
  decodeEntities(n) {
    let e = n
    for (let [i, t] of Object.entries(D.HTML_ENTITIES))
      e = e.replace(new RegExp(i, 'gi'), t)
    return (
      (e = e.replace(/&#(\d+);/g, (i, t) =>
        String.fromCharCode(parseInt(t, 10))
      )),
      (e = e.replace(/&#x([0-9a-fA-F]+);/g, (i, t) =>
        String.fromCharCode(parseInt(t, 16))
      )),
      e
    )
  }
  convertTableToText(n) {
    return n.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (e, i) => {
      let t = `
`,
        r = i.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || []
      for (let a of r) {
        let o = (a.match(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi) || []).map((d) =>
          d.replace(/<[^>]+>/g, '').trim()
        )
        t +=
          o.join(' | ') +
          `
`
      }
      return (
        t +
        `
`
      )
    })
  }
  convertTableToMarkdown(n) {
    return n.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (e, i) => {
      let t = i.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || []
      if (t.length === 0) return ''
      let r = [],
        a = !0
      for (let l of t) {
        let d = (l.match(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi) || []).map((v) =>
          v.replace(/<[^>]+>/g, '').trim()
        )
        ;(r.push('| ' + d.join(' | ') + ' |'),
          a && (r.push('| ' + d.map(() => '---').join(' | ') + ' |'), (a = !1)))
      }
      return (
        `

` +
        r.join(`
`) +
        `

`
      )
    })
  }
  convertBlockquotesToMarkdown(n) {
    return n.replace(
      /<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi,
      (e, i) =>
        `

` +
        i
          .trim()
          .split(
            `
`
          )
          .map((r) => '> ' + r.trim()).join(`
`) +
        `

`
    )
  }
  convertListsToMarkdown(n) {
    let e = n
    return (
      (e = e.replace(
        /<ul[^>]*>([\s\S]*?)<\/ul>/gi,
        (i, t) =>
          `

` +
          (t.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || []).map(
            (l) => '- ' + l.replace(/<[^>]+>/g, '').trim()
          ).join(`
`) +
          `

`
      )),
      (e = e.replace(
        /<ol[^>]*>([\s\S]*?)<\/ol>/gi,
        (i, t) =>
          `

` +
          (t.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || []).map(
            (l, o) => `${o + 1}. ` + l.replace(/<[^>]+>/g, '').trim()
          ).join(`
`) +
          `

`
      )),
      e
    )
  }
}
ne.HTML_ENTITIES = {
  '&nbsp;': ' ',
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
  '&mdash;': '--',
  '&ndash;': '-',
  '&hellip;': '...',
  '&copy;': '(c)',
  '&reg;': '(R)',
  '&trade;': '(TM)',
  '&bull;': '*',
  '&lsquo;': "'",
  '&rsquo;': "'",
  '&ldquo;': '"',
  '&rdquo;': '"',
  '&laquo;': '<<',
  '&raquo;': '>>',
}
var g = null,
  f = null
function N(s) {
  let n = document.createElement('div')
  return (
    n.setAttribute('aria-live', s),
    n.setAttribute('aria-atomic', 'true'),
    n.setAttribute('role', 'status'),
    (n.style.cssText = `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  `),
    (n.id = `token-optimization-live-region-${s}`),
    document.body.appendChild(n),
    n
  )
}
function se(s) {
  return typeof document > 'u'
    ? null
    : s === 'assertive'
      ? (f || (f = N('assertive')), f)
      : (g || (g = N('polite')), g)
}
function k(s, n = 'polite') {
  let e = se(n)
  e &&
    ((e.textContent = ''),
    requestAnimationFrame(() => {
      e.textContent = s
    }))
}
function F(s, n) {
  let e = Math.round((s / n) * 100),
    i = n - s,
    t = s.toLocaleString(),
    r = n.toLocaleString(),
    a = i.toLocaleString()
  return e >= 95
    ? `Critical: Token usage at ${e}%. ${t} of ${r} tokens used. Only ${a} tokens remaining.`
    : e >= 80
      ? `Warning: Token usage at ${e}%. ${t} of ${r} tokens used. ${a} tokens remaining.`
      : `Token usage: ${t} of ${r} tokens. ${e}% used, ${a} tokens remaining.`
}
function re(s, n = 'USD') {
  let e = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: n,
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }),
    i = e.format(s)
  return s === 0
    ? `Estimated cost: ${i}`
    : s < 0.01
      ? `Estimated cost: less than ${e.format(0.01)}`
      : `Estimated cost: ${i}`
}
function ie(s, n) {
  let e = s - n,
    i = Math.round((e / s) * 100),
    t = s.toLocaleString(),
    r = n.toLocaleString(),
    a = e.toLocaleString()
  return e <= 0
    ? `Compression complete. No token reduction achieved. Content already optimized at ${t} tokens.`
    : `Compression complete. Reduced from ${t} to ${r} tokens. ${i}% reduction, ${a} tokens saved.`
}
function oe(s, n) {
  switch (s) {
    case 'critical':
      return `Critical alert: Token usage has reached ${n}%. You are approaching the token limit.`
    case 'warning':
      return `Warning: Token usage has reached ${n}%. Consider optimizing your content.`
    case 'normal':
      return `Token usage returned to normal levels at ${n}%.`
    default:
      return `Token usage is at ${n}%.`
  }
}
function ae() {
  ;(g && g.parentNode && (g.parentNode.removeChild(g), (g = null)),
    f && f.parentNode && (f.parentNode.removeChild(f), (f = null)))
}
function ce(s = {}) {
  let {
      debounceMs: n = 500,
      minChangeThreshold: e = 100,
      announceThresholds: i = !0,
      warningThreshold: t = 0.8,
      criticalThreshold: r = 0.95,
      formatAnnouncement: a = F,
    } = s,
    l = P(0),
    o = P('normal'),
    d = P(null)
  S(
    () => () => {
      ;(d.current && clearTimeout(d.current), ae())
    },
    []
  )
  let v = T(
      (u, m) => {
        ;(d.current && clearTimeout(d.current),
          (d.current = setTimeout(() => {
            let c = u / m,
              E = Math.abs(u - l.current),
              h = 'normal'
            c >= r ? (h = 'critical') : c >= t && (h = 'warning')
            let b = h !== o.current,
              B = E >= e
            if (b || B) {
              if (i && b) {
                let A = oe(h, Math.round(c * 100))
                k(A, h === 'critical' ? 'assertive' : 'polite')
              } else {
                let A = a(u, m)
                k(A, 'polite')
              }
              ;((l.current = u), (o.current = h))
            }
          }, n)))
      },
      [n, e, i, t, r, a]
    ),
    R = T((u) => {
      k(u, 'polite')
    }, []),
    _ = T((u) => {
      k(u, 'assertive')
    }, []),
    C = T((u, m) => {
      let c = re(u, m)
      k(c, 'polite')
    }, []),
    O = T((u, m) => {
      let c = ie(u, m)
      k(c, 'polite')
    }, [])
  return {
    announceChange: v,
    announceWarning: R,
    announceCritical: _,
    announceCostUpdate: C,
    announceCompressionResult: O,
  }
}
function le(s = {}) {
  let { respectPreference: n = !0, fallback: e = !1 } = s,
    [i, t] = $(e)
  return (
    S(() => {
      if (typeof window > 'u' || !n) return
      let r = window.matchMedia('(prefers-reduced-motion: reduce)')
      t(r.matches)
      let a = (l) => {
        t(l.matches)
      }
      return (
        r.addEventListener('change', a),
        () => {
          r.removeEventListener('change', a)
        }
      )
    }, [n]),
    i
  )
}
function ue() {
  let [s, n] = $(!1)
  return (
    S(() => {
      if (typeof window > 'u') return
      let e = window.matchMedia('(prefers-contrast: more)')
      n(e.matches)
      let i = (t) => {
        n(t.matches)
      }
      return (
        e.addEventListener('change', i),
        () => {
          e.removeEventListener('change', i)
        }
      )
    }, []),
    s
  )
}
function de(s, n, e = 0.8, i = 0.95) {
  return L(() => {
    let t = (s / n) * 100,
      r = Math.max(0, n - s),
      a = 'normal'
    return (
      t / 100 >= i ? (a = 'critical') : t / 100 >= e && (a = 'warning'),
      { level: a, percentage: t, remaining: r }
    )
  }, [s, n, e, i])
}
var p = {
    container: {
      display: 'inline-flex',
      alignItems: 'center',
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      fontSize: '14px',
      lineHeight: 1.5,
    },
    full: { padding: '12px 16px', borderRadius: '8px', gap: '12px' },
    badge: {
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: 500,
      gap: '4px',
    },
    minimal: { gap: '4px', fontSize: '12px' },
    progressContainer: {
      width: '100px',
      height: '8px',
      backgroundColor: '#e0e0e0',
      borderRadius: '4px',
      overflow: 'hidden',
      position: 'relative',
    },
    progressBar: {
      height: '100%',
      borderRadius: '4px',
      transition: 'width 0.3s ease-out, background-color 0.3s ease-out',
    },
    progressBarNoMotion: {
      height: '100%',
      borderRadius: '4px',
      transition: 'none',
    },
    text: { whiteSpace: 'nowrap' },
    colors: {
      normal: {
        background: '#e8f5e9',
        text: '#1b5e20',
        progressBg: '#1b5e20',
        border: '#4caf50',
      },
      warning: {
        background: '#fff8e1',
        text: '#e65100',
        progressBg: '#e65100',
        border: '#ff9800',
      },
      critical: {
        background: '#ffebee',
        text: '#b71c1c',
        progressBg: '#b71c1c',
        border: '#f44336',
      },
    },
    highContrast: {
      normal: {
        background: '#ffffff',
        text: '#000000',
        progressBg: '#000000',
        border: '#000000',
      },
      warning: {
        background: '#ffff00',
        text: '#000000',
        progressBg: '#000000',
        border: '#000000',
      },
      critical: {
        background: '#ff0000',
        text: '#ffffff',
        progressBg: '#ffffff',
        border: '#ffffff',
      },
    },
  },
  pe = ({
    current: s,
    limit: n,
    warningThreshold: e = 0.8,
    criticalThreshold: i = 0.95,
    ariaLabel: t,
    variant: r = 'full',
    className: a,
    onThresholdCrossed: l,
  }) => {
    let o = de(s, n, e, i),
      d = P(o.level),
      { announceChange: v } = ce({
        warningThreshold: e,
        criticalThreshold: i,
        debounceMs: 300,
      }),
      R = le(),
      _ = ue()
    ;(S(() => {
      o.level !== d.current && (l?.(o.level), (d.current = o.level))
    }, [o.level, l]),
      S(() => {
        v(s, n)
      }, [s, n, v]))
    let C = _ ? p.highContrast[o.level] : p.colors[o.level],
      O = {
        ...p.container,
        ...(r === 'full' ? p.full : {}),
        ...(r === 'badge' ? p.badge : {}),
        ...(r === 'minimal' ? p.minimal : {}),
        backgroundColor: r !== 'minimal' ? C.background : 'transparent',
        color: C.text,
        border: r !== 'minimal' ? `1px solid ${C.border}` : 'none',
      },
      u = {
        ...(R ? p.progressBarNoMotion : p.progressBar),
        width: `${Math.min(100, o.percentage)}%`,
        backgroundColor: C.progressBg,
      },
      m = t || F(s, n),
      c = T((b) => b.toLocaleString(), []),
      E = L(() => {
        switch (r) {
          case 'badge':
            return `${c(s)}/${c(n)}`
          case 'minimal':
            return `${c(s)} / ${c(n)}`
          case 'full':
          default:
            return `${c(s)} of ${c(n)} tokens (${Math.round(o.percentage)}%)`
        }
      }, [r, s, n, o.percentage, c]),
      h = L(
        () => (r === 'full' ? `${c(o.remaining)} remaining` : null),
        [r, o.remaining, c]
      )
    return z('div', {
      role: 'status',
      'aria-live': 'polite',
      'aria-atomic': 'true',
      'aria-label': m,
      className: a,
      style: O,
      'data-level': o.level,
      'data-variant': r,
      children: [
        y('span', {
          style: {
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: 0,
          },
          children: m,
        }),
        y('span', { style: p.text, 'aria-hidden': 'true', children: E }),
        r === 'full' &&
          z(G, {
            children: [
              y('div', {
                style: p.progressContainer,
                role: 'progressbar',
                'aria-valuenow': Math.round(o.percentage),
                'aria-valuemin': 0,
                'aria-valuemax': 100,
                'aria-label': `Token usage: ${Math.round(o.percentage)}%`,
                children: y('div', { style: u }),
              }),
              h &&
                y('span', {
                  style: p.text,
                  'aria-hidden': 'true',
                  children: h,
                }),
            ],
          }),
        (r === 'badge' || r === 'minimal') &&
          o.level !== 'normal' &&
          y('span', {
            role: 'img',
            'aria-label': o.level === 'critical' ? 'Critical usage' : 'Warning',
            style: { fontSize: r === 'badge' ? '10px' : '12px' },
            children: o.level === 'critical' ? '!' : '',
          }),
      ],
    })
  },
  Ke = j.memo(pe)
var me = I('Hello world')
console.log(me)
/**
 * Clarity Chat Token Optimization
 * Advanced token counting, compression, and optimization
 * @version 1.0.0
 * @license MIT
 */
