import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { supabase } from "@/lib/supabase-client"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-11-20" as any,
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ""

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature") || ""

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error("Webhook signature verification failed:", error)
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        if (userId) {
          // Update user tier to pro
          await supabase
            .from("users")
            .update({ tier: "pro" })
            .eq("id", userId)

          // Update usage quota to pro limits
          const now = new Date()
          const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`

          const { data: existingQuota } = await supabase
            .from("usage_quotas")
            .select("id")
            .eq("user_id", userId)
            .eq("month", month)
            .single()

          if (existingQuota) {
            await supabase
              .from("usage_quotas")
              .update({ tokens_limit: 1000000 })
              .eq("id", existingQuota.id)
          } else {
            await supabase.from("usage_quotas").insert({
              user_id: userId,
              month,
              tokens_used: 0,
              tokens_limit: 1000000,
            })
          }
        }
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        if (userId) {
          // Downgrade user to free tier
          await supabase
            .from("users")
            .update({ tier: "free" })
            .eq("id", userId)

          // Update usage quota to free limits
          const now = new Date()
          const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`

          const { data: existingQuota } = await supabase
            .from("usage_quotas")
            .select("id")
            .eq("user_id", userId)
            .eq("month", month)
            .single()

          if (existingQuota) {
            await supabase
              .from("usage_quotas")
              .update({ tokens_limit: 100000 })
              .eq("id", existingQuota.id)
          }
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook processing error:", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}
