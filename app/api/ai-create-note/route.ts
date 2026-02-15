import Groq from '@groq/sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    if (!prompt) {
      return Response.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    if (!process.env.GROQ_API_KEY) {
      return Response.json(
        { error: 'GROQ_API_KEY environment variable is not set' },
        { status: 500 }
      )
    }

    const systemPrompt = 'You are a helpful assistant that creates well-structured notes. Based on the user prompt, create a clear and organized note with a title and detailed content. Format as JSON: { "title": "...", "content": "..." }'

    const message = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: `Create a note based on this: "${prompt}"\n\nRespond with valid JSON format.`,
        },
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.7,
      max_tokens: 1024,
    })

    const responseText = message.choices[0]?.message?.content || ''

    try {
      const note = JSON.parse(responseText)
      return Response.json({ note })
    } catch {
      // If parsing fails, create a note from the response
      return Response.json({
        note: {
          title: 'AI Generated Note',
          content: responseText
        }
      })
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create note'
    console.error('[v0] AI note creation error:', errorMessage, error)
    return Response.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
