import Groq from '@groq/sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

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
      ? 'You are a helpful assistant that generates practical todo items. Based on the provided content, suggest 1-3 specific, actionable todo items that could help accomplish the goal mentioned. Keep each suggestion concise (under 20 words). Format as JSON array: [{ "title": "...", "description": "..." }]'
      : 'You are a helpful assistant that enhances notes. Based on the provided content, suggest 1-3 ways to improve, organize, or expand the note. Keep suggestions practical and brief. Format as JSON array: [{ "title": "...", "description": "..." }]'

    const message = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: `Content: "${content}"\n\nProvide suggestions in valid JSON format.`,
        },
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.7,
      max_tokens: 1024,
    })

    const responseText = message.choices[0]?.message?.content || ''

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
