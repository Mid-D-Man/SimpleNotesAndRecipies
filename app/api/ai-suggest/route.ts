export async function POST(req: Request) {
  try {
    const { content, type } = await req.json()

    if (!content) {
      return Response.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    if (!process.env.GROQ_API_KEY) {
      return Response.json(
        { error: 'GROQ_API_KEY environment variable is not set' },
        { status: 500 }
      )
    }

    const systemPrompt = type === 'todo' 
      ? 'Suggest 1-3 todo items to help with this. Respond ONLY with JSON: [{"title":"...","description":"..."}]'
      : 'Suggest 1-3 ways to improve this. Respond ONLY with JSON: [{"title":"...","description":"..."}]'

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000) // 15 second timeout

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: `${systemPrompt}\n\nContent: "${content}"`,
          },
        ],
        temperature: 0.5,
        max_tokens: 300,
      }),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout))

    if (!response.ok) {
      const errorData = await response.json()
      console.error('[v0] Groq API error:', errorData)
      throw new Error(errorData?.error?.message || `Groq API error: ${response.status}`)
    }

    const data = await response.json()
    const responseText = data.choices[0]?.message?.content || ''

    try {
      const suggestions = JSON.parse(responseText)
      return Response.json({ suggestions })
    } catch {
      return Response.json({ 
        suggestions: [{ 
          title: 'Suggestion', 
          description: responseText 
        }] 
      })
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate suggestions'
    console.error('[v0] AI suggestion error:', errorMessage, error)
    return Response.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
