import { generateText } from 'ai'

export async function POST(req: Request) {
  try {
    const { content, type } = await req.json()

    if (!content) {
      return Response.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    const systemPrompt = type === 'todo' 
      ? 'You are a helpful assistant that generates practical todo items. Based on the provided content, suggest 1-3 specific, actionable todo items that could help accomplish the goal mentioned. Keep each suggestion concise (under 20 words). Format as JSON array: [{ "title": "...", "description": "..." }]'
      : 'You are a helpful assistant that enhances notes. Based on the provided content, suggest 1-3 ways to improve, organize, or expand the note. Keep suggestions practical and brief. Format as JSON array: [{ "title": "...", "description": "..." }]'

    const result = await generateText({
      model: 'groq/mixtral-8x7b-32768',
      system: systemPrompt,
      prompt: `Content: "${content}"\n\nProvide suggestions in valid JSON format.`,
      temperature: 0.7,
    })

    try {
      const suggestions = JSON.parse(result.text)
      return Response.json({ suggestions })
    } catch {
      return Response.json({ 
        suggestions: [{ 
          title: 'Suggestion', 
          description: result.text 
        }] 
      })
    }
  } catch (error) {
    console.error('[v0] AI suggestion error:', error)
    return Response.json(
      { error: 'Failed to generate suggestions' },
      { status: 500 }
    )
  }
}
