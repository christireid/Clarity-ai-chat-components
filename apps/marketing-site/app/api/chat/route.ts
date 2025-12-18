import { openai } from '@ai-sdk/openai'
import { streamText, StreamData } from 'ai'
import { getKnowledgeBase, retrieveContext } from '@/lib/search'
import { BASE_SYSTEM_PROMPT, maxDuration } from '@/lib/ai-config'

export { maxDuration }

export async function POST(req: Request) {
  try {
    const { messages, apiKey } = await req.json()

    // 1. Validation
    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid messages format', { status: 400 })
    }

    // 2. API Key Security
    const openaiKey = apiKey || process.env.OPENAI_API_KEY
    if (!openaiKey) {
      return new Response('Missing OpenAI API Key', { status: 401 })
    }

    // 3. Retrieve Context
    const lastMessage = messages[messages.length - 1]
    const kb = getKnowledgeBase()
    let retrievedContext = ''

    if (kb) {
      const start = Date.now()
      retrievedContext = retrieveContext(lastMessage.content, kb)
      console.log(`[Aura] Context retrieval took ${Date.now() - start}ms`)
    } else {
      console.warn('[Aura] Warning: Knowledge Base not available.')
    }

    // 4. Construct System Prompt
    const finalSystemPrompt = `${BASE_SYSTEM_PROMPT}\n${retrievedContext}`

    // 5. Stream Response
    const result = streamText({
      model: openai('gpt-4o'),
      system: finalSystemPrompt,
      messages,
    })

    const data = new StreamData()
    data.append({ status: 'streaming_started' })

    return result.toDataStreamResponse({ data })
  } catch (error) {
    console.error('[Aura] API Error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
