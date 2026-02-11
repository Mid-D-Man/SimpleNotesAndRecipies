import { NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { recordAIUsage, canUserUseAI } from "@/lib/usage-tracker"

export async function POST(req: NextRequest) {
  try {
    const { userId, text, action = "enhance" } = await req.json()

    if (!userId || !text) {
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

    let prompt = ""
    let featureType: "enhance" | "question" | "extract" = "enhance"

    switch (action) {
      case "enhance":
        prompt = `Improve the clarity, grammar, and structure of the following text while preserving the original meaning:\n\n${text}`
        featureType = "enhance"
        break
      case "ask":
        prompt = `Answer questions about the following text. The user may ask follow-up questions:\n\n${text}`
        featureType = "question"
        break
      case "extract":
        prompt = `Extract the key points and create a summary of the following text:\n\n${text}`
        featureType = "extract"
        break
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const result = await generateText({
      model: "openai/gpt-4o-mini",
      system: "You are a helpful text processing assistant. Provide clear, concise responses.",
      prompt,
      maxOutputTokens: 1000,
    })

    // Record the AI usage
    const estimatedTokens = Math.ceil((result.text.length + text.length) / 4)
    const recorded = await recordAIUsage(userId, estimatedTokens, "gpt-4o-mini", featureType)

    if (!recorded) {
      return NextResponse.json(
        { error: "Failed to record AI usage. Monthly limit may have been exceeded." },
        { status: 429 }
      )
    }

    return NextResponse.json({
      result: result.text,
      tokensUsed: estimatedTokens,
    })
  } catch (error) {
    console.error("Text enhancement error:", error)
    return NextResponse.json(
      { error: "Failed to process text" },
      { status: 500 }
    )
  }
}
