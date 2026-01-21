/**
 * Provider-specific error handling utilities
 */

export class ProviderError extends Error {
  constructor(
    message: string,
    public readonly provider: string,
    public readonly code?: string,
    public readonly statusCode?: number
  ) {
    super(message)
    this.name = 'ProviderError'
  }
}

export function createProviderError(
  provider: string,
  message: string,
  code?: string,
  statusCode?: number
): ProviderError {
  return new ProviderError(message, provider, code, statusCode)
}

export function isProviderError(error: unknown): error is ProviderError {
  return error instanceof ProviderError
}