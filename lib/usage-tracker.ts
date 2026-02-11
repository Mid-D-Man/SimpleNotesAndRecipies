import { supabase } from "./supabase-client"

const FREE_TIER_MONTHLY_LIMIT = 100000 // tokens
const PRO_TIER_MONTHLY_LIMIT = 1000000 // tokens

export async function getUserTier(userId: string): Promise<"free" | "pro"> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("tier")
      .eq("id", userId)
      .single()

    if (error) throw error
    return data?.tier || "free"
  } catch (error) {
    console.error("Error fetching user tier:", error)
    return "free"
  }
}

export async function getMonthlyUsage(userId: string): Promise<{
  used: number
  limit: number
  percentage: number
}> {
  try {
    const now = new Date()
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`

    const { data, error } = await supabase
      .from("usage_quotas")
      .select("tokens_used, tokens_limit")
      .eq("user_id", userId)
      .eq("month", month)
      .single()

    if (error && error.code !== "PGRST116") throw error

    const tier = await getUserTier(userId)
    const limit = tier === "pro" ? PRO_TIER_MONTHLY_LIMIT : FREE_TIER_MONTHLY_LIMIT
    const used = data?.tokens_used || 0

    return {
      used,
      limit,
      percentage: (used / limit) * 100,
    }
  } catch (error) {
    console.error("Error fetching monthly usage:", error)
    return {
      used: 0,
      limit: FREE_TIER_MONTHLY_LIMIT,
      percentage: 0,
    }
  }
}

export async function recordAIUsage(
  userId: string,
  tokensUsed: number,
  model: string,
  feature: "generate" | "enhance" | "question" | "extract"
): Promise<boolean> {
  try {
    const usage = await getMonthlyUsage(userId)

    // Check if user would exceed limit
    if (usage.used + tokensUsed > usage.limit) {
      return false // User exceeded limit
    }

    const now = new Date()
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`

    // Record the AI usage
    await supabase.from("ai_usage").insert({
      user_id: userId,
      tokens_used: tokensUsed,
      model,
      feature,
    })

    // Update usage quota
    if (usage.used === 0) {
      // First usage of the month
      await supabase.from("usage_quotas").insert({
        user_id: userId,
        month,
        tokens_used: tokensUsed,
        tokens_limit: usage.limit,
      })
    } else {
      // Update existing quota
      await supabase
        .from("usage_quotas")
        .update({ tokens_used: usage.used + tokensUsed })
        .eq("user_id", userId)
        .eq("month", month)
    }

    return true
  } catch (error) {
    console.error("Error recording AI usage:", error)
    return false
  }
}

export async function canUserUseAI(userId: string): Promise<boolean> {
  try {
    const usage = await getMonthlyUsage(userId)
    return usage.percentage < 100
  } catch (error) {
    console.error("Error checking AI usage:", error)
    return false
  }
}

export async function getUsagePercentage(userId: string): Promise<number> {
  try {
    const usage = await getMonthlyUsage(userId)
    return Math.round(usage.percentage)
  } catch (error) {
    console.error("Error getting usage percentage:", error)
    return 0
  }
}
