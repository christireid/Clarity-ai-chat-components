/**
 * Server-Sent Events (SSE) Transport for MCP
 */
import { MCPTransport } from '../client'

export interface SSETransportOptions {
  headers?: Record<string, string>
  reconnectionTime?: number
}

export class SSETransport implements MCPTransport {
  private eventSource: EventSource | null = null
  private messageHandler: ((message: any) => void) | null = null

  constructor(
    private endpoint: string,
    private options: SSETransportOptions = {}
  ) {}

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.eventSource = new EventSource(this.endpoint)

        this.eventSource.onopen = () => {
          resolve()
        }

        this.eventSource.onerror = (err) => {
          // If we haven't connected yet, reject
          if (this.eventSource?.readyState === EventSource.CONNECTING) {
            reject(err)
          }
          // Otherwise, handle reconnection logic (omitted for brevity)
        }

        this.eventSource.onmessage = (event) => {
          if (this.messageHandler) {
            try {
              const data = JSON.parse(event.data)
              this.messageHandler(data)
            } catch (e) {
              console.error('Failed to parse SSE message:', e)
            }
          }
        }
      } catch (e) {
        reject(e)
      }
    })
  }

  async disconnect(): Promise<void> {
    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
    }
  }

  async send(message: any): Promise<void> {
    // SSE is one-way (server -> client).
    // Typically MCP over SSE uses a separate POST endpoint for client -> server messages.
    // This assumes there is a companion POST endpoint.

    const postEndpoint = this.endpoint // Simplified assumption

    await fetch(postEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.options.headers,
      },
      body: JSON.stringify(message),
    })
  }

  onMessage(handler: (message: any) => void): void {
    this.messageHandler = handler
  }
}
