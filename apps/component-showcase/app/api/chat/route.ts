import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  const {
    messages,
    model = 'claude-sonnet-4-5-20250929',
    system,
  } = await request.json()
  const apiKey = request.headers.get('x-api-key')

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key required' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      stream: true,
      system:
        system ||
        'You are a helpful AI assistant built into the Clarity Chat component library showcase. Respond concisely and helpfully. You can use markdown formatting.',
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    return new Response(error, {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Forward the SSE stream directly from Anthropic
  return new Response(response.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}
