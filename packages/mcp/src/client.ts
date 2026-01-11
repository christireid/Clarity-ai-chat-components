/**
 * Model Context Protocol (MCP) Client Interface
 *
 * Defines the standard interface for communicating with MCP servers.
 */

export interface MCPTool {
  name: string
  description?: string
  inputSchema: Record<string, any>
}

export interface MCPResource {
  uri: string
  name: string
  mimeType?: string
}

export interface MCPToolResult {
  content: Array<{
    type: 'text' | 'image' | 'resource'
    text?: string
    data?: string
    mimeType?: string
    resource?: MCPResource
  }>
  isError?: boolean
}

export interface MCPTransport {
  connect(): Promise<void>
  disconnect(): Promise<void>
  send(message: any): Promise<void>
  onMessage(handler: (message: any) => void): void
}

export class MCPClient {
  private tools: Map<string, MCPTool> = new Map()

  constructor(private transport: MCPTransport) {}

  async connect() {
    await this.transport.connect()
    // In a real implementation, we would negotiate capabilities here
  }

  async disconnect() {
    await this.transport.disconnect()
  }

  async listTools(): Promise<MCPTool[]> {
    // Send JSON-RPC request to list tools
    await this.transport.send({
      jsonrpc: '2.0',
      method: 'tools/list',
      id: Date.now(),
    })
    // For now, return cached or empty
    return Array.from(this.tools.values())
  }

  async callTool(name: string, args: any): Promise<MCPToolResult> {
    await this.transport.send({
      jsonrpc: '2.0',
      method: 'tools/call',
      params: { name, arguments: args },
      id: Date.now(),
    })

    // Mock response for structure
    return { content: [] }
  }
}
