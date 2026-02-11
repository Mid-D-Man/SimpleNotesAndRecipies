import { NextRequest, NextResponse } from "next/server"
import { getMonthlyUsage } from "@/lib/usage-tracker"

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId parameter" },
        { status: 400 }
      )
    }

    const usage = await getMonthlyUsage(userId)

    return NextResponse.json(usage)
  } catch (error) {
    console.error("Usage fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch usage" },
      { status: 500 }
    )
  }
}
