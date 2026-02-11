# AI Features Setup Guide

## Overview

Your Notes & Todos app now includes powerful AI-powered features with a freemium model and Stripe payment integration. This guide explains how to set up and configure all the necessary integrations.

## Architecture

### Components Built

1. **Authentication & User Management**
   - Supabase authentication (email/password)
   - User tier system (Free/Pro)
   - AuthContext for app-wide user state

2. **AI Features**
   - AI Note Generation: Create notes from text prompts
   - Text Enhancement: Improve clarity and grammar
   - Smart Questions: Ask questions about selected text
   - Key Point Extraction: Summarize text into key points

3. **Usage Tracking**
   - Per-user monthly token limits
   - Free tier: 100,000 tokens/month
   - Pro tier: 1,000,000 tokens/month
   - Real-time usage display in UI

4. **Payment Integration**
   - Stripe Checkout for subscriptions
   - Automatic tier upgrades/downgrades
   - Webhook handling for payment events

## Environment Variables Required

Add these to your Vercel project settings under "Settings > Environment Variables":

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
NEXT_PUBLIC_STRIPE_PRO_PRODUCT_ID=your_stripe_product_id
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# App URL
NEXT_PUBLIC_APP_URL=https://your-app-domain.com
```

## Setup Steps

### 1. Supabase Setup

1. Create a Supabase project at https://supabase.com
2. Go to Project Settings > API to get your URL and anon key
3. The database schema has already been created via migrations:
   - `users` table with tier information
   - `ai_usage` table for tracking AI calls
   - `usage_quotas` table for monthly limits

### 2. Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Create a new product called "Notes & Todos Pro" with:
   - Price: $9.99/month
   - Billing: Recurring monthly
3. Copy the Product ID to `NEXT_PUBLIC_STRIPE_PRO_PRODUCT_ID`
4. Go to Webhooks and create a new endpoint pointing to:
   - URL: `https://your-app-domain.com/api/webhooks/stripe`
   - Events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
5. Copy the webhook secret to `STRIPE_WEBHOOK_SECRET`

### 3. AI Gateway Setup

The app uses Vercel's AI Gateway with OpenAI by default. The Vercel AI Gateway handles authentication automatically - no additional setup needed! The model used is `openai/gpt-4o-mini` which is optimized for cost and performance.

## Feature Breakdown

### AI Note Generation

**Endpoint:** `POST /api/ai/generate-note`
- User provides a text prompt
- AI generates a complete note from the prompt
- Tokens are deducted from user's monthly quota
- New note is created and saved to storage

**UI:** Main page has "AI Generate" button next to "New Note"

### Text Enhancement

**Endpoint:** `POST /api/ai/enhance-text`

Supports three actions:
- **Enhance:** Improves clarity, grammar, and structure
- **Ask:** Creates Q&A based on the text
- **Extract:** Summarizes key points

**UI:** Context menu appears when text is selected in notes

### Usage Tracking

**Endpoint:** `GET /api/user/usage?userId=<userId>`

Returns:
```json
{
  "used": 25000,
  "limit": 100000,
  "percentage": 25
}
```

**UI:** Usage indicator component shows progress bar and warning when near limit

## Token Usage Estimates

OpenAI charges per 1,000 tokens. Estimates for common operations:

- Simple text enhancement: 200-500 tokens
- Note generation: 500-1,500 tokens
- Text summarization: 300-800 tokens

**Cost breakdown:**
- Free tier (100k tokens): ~$0.15 worth of usage
- Pro tier (1M tokens): ~$1.50 worth of usage

We recommend adjusting Stripe pricing if needed to account for API costs.

## Database Schema

### users table
```sql
id (uuid, PK)
email (string)
name (string)
tier ('free' | 'pro')
created_at (timestamp)
updated_at (timestamp)
```

### ai_usage table
```sql
id (uuid, PK)
user_id (uuid, FK)
tokens_used (integer)
model (string) -- e.g., 'gpt-4o-mini'
feature ('generate' | 'enhance' | 'question' | 'extract')
created_at (timestamp)
```

### usage_quotas table
```sql
id (uuid, PK)
user_id (uuid, FK)
month (string) -- e.g., '2024-12'
tokens_used (integer)
tokens_limit (integer)
```

## Rate Limiting

The app implements per-user monthly limits:
- Free users: 100,000 tokens/month (auto-resets on 1st of each month)
- Pro users: 1,000,000 tokens/month

Once a user hits their limit, they'll see:
1. Warning toast notification
2. "Monthly limit reached" card in usage indicator
3. Disabled AI buttons until next month or upgrade

## Error Handling

### Common Errors

**"Monthly AI usage limit reached"**
- User has exceeded their tier's token limit
- Solution: Upgrade to Pro or wait until next month

**"You need to be logged in to use AI features"**
- User is not authenticated
- Solution: Log in or create an account

**"Failed to record AI usage"**
- Database error or quota exceeded
- Check Supabase connection and error logs

## Security Notes

- All AI operations require authentication (except when testing)
- Usage is tracked per user in Supabase
- Stripe webhook signature verification ensures payment events are legitimate
- Environment variables are kept secure in Vercel

## Future Enhancements

Consider implementing:
1. Daily/weekly usage breakdowns
2. Different AI models for different tiers (GPT-4 for Pro users)
3. Batch operations for multiple notes
4. Custom rate limits per user
5. API keys for third-party integrations
6. Analytics dashboard for usage patterns

## Troubleshooting

**AI features not working:**
1. Check all environment variables are set in Vercel
2. Verify Supabase project is accessible
3. Check browser console for error messages

**Stripe payments failing:**
1. Verify webhook endpoint is publicly accessible
2. Check Stripe logs in dashboard
3. Ensure STRIPE_WEBHOOK_SECRET is correct

**Auth not persisting:**
1. Clear browser cookies/local storage
2. Check Supabase auth settings
3. Ensure AuthProvider is wrapping your app in layout.tsx

## Support

For issues with:
- **Supabase:** https://supabase.com/docs
- **Stripe:** https://stripe.com/docs
- **Vercel AI Gateway:** https://sdk.vercel.ai
- **Next.js:** https://nextjs.org/docs
