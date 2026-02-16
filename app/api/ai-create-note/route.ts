export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()
    console.log('[v0] AI create-note API called with prompt:', prompt)
    console.log('[v0] GROQ_API_KEY env var:', process.env.GROQ_API_KEY ? 'SET' : 'NOT SET')
    console.log('[v0] All env vars:', Object.keys(process.env).filter(k => k.includes('GROQ')))

    if (!prompt) {
      return Response.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    if (!process.env.GROQ_API_KEY) {
      console.log('[v0] Missing GROQ_API_KEY!')
      return Response.json(
        { error: 'GROQ_API_KEY environment variable is not set' },
        { status: 500 }
      )
    }

    const systemPrompt = 'You are a helpful assistant that creates well-structured notes. Based on the user prompt, create a clear and organized note with a title and detailed content. Format as JSON: { "title": "...", "content": "..." }'

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
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: `Create a note based on this: "${prompt}"\n\nRespond with valid JSON format.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('[v0] Groq API error:', errorData)
      throw new Error(errorData?.error?.message || `Groq API error: ${response.status}`)
    }

    const data = await response.json()
    const responseText = data.choices[0]?.message?.content || ''

    try {
      const note = JSON.parse(responseText)
      return Response.json({ note })
    } catch {
      // If parsing fails, create a note from the response with a title based on prompt
      const titleFromPrompt = prompt.split('\n')[0].substring(0, 50) || 'AI Generated Note'
      return Response.json({
        note: {
          title: titleFromPrompt,
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
