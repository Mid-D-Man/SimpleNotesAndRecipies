import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { supabase } from "@/lib/supabase-client"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-11-20" as any,
})

export async function POST(req: NextRequest) {
  try {
    const { userId, plan } = await req.json()

    if (!userId || !plan) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      )
    }

    // Get user from Supabase
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("email")
      .eq("id", userId)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    const productId = process.env.NEXT_PUBLIC_STRIPE_PRO_PRODUCT_ID || ""

    if (!productId) {
      return NextResponse.json(
        { error: "Stripe product ID not configured" },
        { status: 500 }
      )
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Notes & Todos Pro",
              description: "Unlock unlimited AI features",
            },
            unit_amount: 999, // $9.99
            recurring: {
              interval: "month",
              interval_count: 1,
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?cancelled=true`,
      metadata: {
        userId,
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("Stripe error:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
