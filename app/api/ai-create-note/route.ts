import { generateText } from 'ai'

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    if (!prompt) {
      return Response.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    const systemPrompt = 'You are a helpful assistant that creates well-structured notes. Based on the user prompt, create a clear and organized note with a title and detailed content. Format as JSON: { "title": "...", "content": "..." }'

    const result = await generateText({
      model: 'groq/mixtral-8x7b-32768',
      system: systemPrompt,
      prompt: `Create a note based on this: "${prompt}"\n\nRespond with valid JSON format.`,
      temperature: 0.7,
    })

    try {
      const note = JSON.parse(result.text)
      return Response.json({ note })
    } catch {
      // If parsing fails, create a note from the response
      return Response.json({
        note: {
          title: 'AI Generated Note',
          content: result.text
        }
      })
    }
  } catch (error) {
    console.error('[v0] AI note creation error:', error)
    return Response.json(
      { error: 'Failed to create note' },
      { status: 500 }
    )
  }
}
