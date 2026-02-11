import { loadStripe } from "@stripe/stripe-js"

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""

if (!stripePublishableKey) {
  console.warn("Stripe publishable key is missing. Payment features will not work.")
}

let stripePromise: ReturnType<typeof loadStripe> | null = null

export const getStripe = async () => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey)
  }
  return stripePromise
}

export const STRIPE_PLANS = {
  free: {
    name: "Free",
    price: 0,
    tokens: 100000,
    description: "Perfect for getting started",
  },
  pro: {
    name: "Pro",
    price: 9.99,
    tokens: 1000000,
    description: "For power users",
    stripeProductId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRODUCT_ID || "",
  },
}

export type StripePlan = keyof typeof STRIPE_PLANS
