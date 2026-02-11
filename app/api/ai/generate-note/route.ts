import { NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { supabase } from "@/lib/supabase-client"
import { recordAIUsage, canUserUseAI } from "@/lib/usage-tracker"

export async function POST(req: NextRequest) {
  try {
    const { userId, prompt } = await req.json()

    if (!userId || !prompt) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      )
    }

    // Check if user can use AI features
    const canUse = await canUserUseAI(userId)
    if (!canUse) {
      return NextResponse.json(
        { error: "Monthly AI usage limit reached. Upgrade to Pro for unlimited access." },
        { status: 429 }
      )
    }

    // Generate note content using AI
    const result = await generateText({
      model: "openai/gpt-4o-mini",
      system:
        "You are a helpful note-taking assistant. Generate well-structured, clear notes based on the user's prompt. Format the response with proper markdown.",
      prompt,
      maxOutputTokens: 1000,
    })

    // Record the AI usage (estimate tokens)
    const estimatedTokens = Math.ceil((result.text.length + prompt.length) / 4)
    const recorded = await recordAIUsage(userId, estimatedTokens, "gpt-4o-mini", "generate")

    if (!recorded) {
      return NextResponse.json(
        { error: "Failed to record AI usage. Monthly limit may have been exceeded." },
        { status: 429 }
      )
    }

    return NextResponse.json({
      content: result.text,
      tokensUsed: estimatedTokens,
    })
  } catch (error) {
    console.error("AI generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate note" },
      { status: 500 }
    )
  }
}
