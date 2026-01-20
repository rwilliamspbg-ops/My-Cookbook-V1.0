# Stripe Webhook Setup Guide

Complete guide for implementing and deploying Stripe webhooks for your freemium subscription system.

## Overview

This implementation includes:
- **Stripe Webhook Handler** - Processes Stripe events (`stripe-webhook.js`)
- **Billing Portal** - User subscription management (`create-portal-session.js`)
- **Success Page** - Post-checkout confirmation (`subscription/success.js`)
- **Database Migrations** - Schema updates (`db-migrations.sql`)
- **Checkout Integration** - Metadata support in checkout session

## Files Added

```
pages/api/stripe-webhook.js          # Main webhook endpoint
pages/api/create-portal-session.js   # Billing portal session
pages/subscription/success.js         # Success page
lib/db-migrations.sql                # Database schema updates
```

## Setup Instructions

### Step 1: Database Migration

Apply the database migrations to add subscription fields:

```bash
sqlite3 recipes.db < lib/db-migrations.sql
```

This adds:
- `stripe_customer_id` - Stripe customer identifier
- `stripe_subscription_id` - Stripe subscription identifier
- `subscription_tier` - User's subscription level (free, premium, business)
- `subscription_status` - Current status (active, canceled, past_due)
- `subscription_start_date` - When subscription started
- `subscription_end_date` - When subscription ended
- `usage_tracking` table - For AI parse rate limiting
- `payment_history` table - For billing logs

### Step 2: Stripe Configuration

#### Enable Billing Portal (Required)

1. Go to https://dashboard.stripe.com/settings/billing/portal
2. Click "Activate portal"
3. Configure allowed features:
   - [x] Subscription pause
   - [x] Plan change
   - [x] Cancellation
   - [x] Invoice history

#### Create Webhook Endpoint

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter your webhook URL:
   - Development: `http://localhost:3000/api/stripe-webhook`
   - Production: `https://yourdomain.com/api/stripe-webhook`
4. Select events to receive:
   - `checkout.session.completed` ✓
   - `customer.subscription.updated` ✓
   - `customer.subscription.deleted` ✓
   - `invoice.payment_failed` ✓
5. Click "Add endpoint"
6. Copy the Webhook Signing Secret

### Step 3: Environment Variables

Add to `.env.local`:

```bash
# Stripe API Keys
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# Stripe Webhook Secret
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Plan IDs (from /pricing page)
STRIPE_PREMIUM_PRICE_ID=price_...
STRIPE_BUSINESS_PRICE_ID=price_...
```

### Step 4: Verify Webhook

#### Test Mode (Development)

1. In Stripe Dashboard, go to Webhooks
2. Click your endpoint
3. Under "Signed events", click "Send test webhook"
4. Select `checkout.session.completed`
5. Click "Send test webhook"
6. Check server logs for: `User X activated on plan premium`

#### Production Mode

Webhooks will automatically fire when:
- Customer completes checkout
- Customer's payment is processed
- Subscription is canceled
- Payment fails

## Webhook Events Handled

### 1. `checkout.session.completed`

**Triggered:** When customer completes checkout

**Actions:**
- Extract customer ID and subscription ID
- Find user by Stripe customer ID or email
- Update user record with:
  - `subscription_tier` from `metadata.planKey`
  - `subscription_status = 'active'`
  - `stripe_subscription_id`
  - `subscription_start_date = now`

```javascript
// Example webhook data
{
  type: 'checkout.session.completed',
  data: {
    object: {
      id: 'cs_test_....',
      customer: 'cus_....',
      subscription: 'sub_....',
      metadata: { planKey: 'premium' }
    }
  }
}
```

### 2. `customer.subscription.updated`

**Triggered:** When subscription status changes

**Actions:**
- Update `subscription_status` based on Stripe status
- Map statuses: `active` → active, `past_due` → past_due, `canceled` → canceled
- Set `subscription_end_date` if canceled

### 3. `customer.subscription.deleted`

**Triggered:** When subscription is canceled

**Actions:**
- Set `subscription_status = 'canceled'`
- Set `subscription_tier = 'free'`
- Set `subscription_end_date = now`

### 4. `invoice.payment_failed`

**Triggered:** When payment fails

**Actions:**
- Set `subscription_status = 'past_due'`
- (Optional) Send email notification

## API Endpoints

### POST `/api/stripe-webhook`

Receives and processes Stripe webhook events.

**Security:** Verifies Stripe signature with `STRIPE_WEBHOOK_SECRET`

```bash
curl -X POST http://localhost:3000/api/stripe-webhook \
  -H "stripe-signature: " \
  -d @event.json
```

### POST `/api/create-portal-session`

Creates a Stripe Billing Portal session for users to manage subscriptions.

**Request:**
```json
{
  "customerId": "cus_....",
  "returnUrl": "https://yourdomain.com/account"
}
```

**Response:**
```json
{
  "url": "https://billing.stripe.com/b/aW...."
}
```

## Testing

### Test Cards

Use these test cards in development:

```
# Successful payment
4242 4242 4242 4242
Expiry: 12/34
CVC: 123

# Payment declined
4000 0000 0000 0002
Expiry: 12/34
CVC: 123

# Requires authentication
4000 0025 0000 3155
Expiry: 12/34
CVC: 123
```

### Webhook Testing

1. Run locally: `npm run dev`
2. Use Stripe CLI to forward webhooks:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe-webhook
   ```
3. In another terminal, trigger events:
   ```bash
   stripe trigger checkout.session.completed
   stripe trigger customer.subscription.updated
   ```

## Production Deployment Checklist

- [ ] Database migrations applied
- [ ] Stripe webhook endpoint configured
- [ ] Environment variables set in production
- [ ] HTTPS enabled for webhook endpoint
- [ ] Test webhook received and processed
- [ ] Billing portal verified working
- [ ] Success page displays correctly
- [ ] Email notifications configured (optional)
- [ ] Monitoring/alerting set up for failed webhooks
- [ ] Rate limiting implemented on checkout endpoint
- [ ] Backup and restore procedures tested

## Monitoring

### Check Webhook Deliveries

1. Go to https://dashboard.stripe.com/webhooks
2. Click your endpoint
3. View recent deliveries and their status
4. Check for failed events (shown in red)

### Enable Logging

Webhook handler logs important events to console:

```javascript
console.log('Checkout session completed:', session.id);
console.log('User X activated on plan Y');
console.log('Webhook error:', err);
```

In production, configure proper logging service (e.g., Sentry, Datadog).

## Troubleshooting

### Webhook Not Receiving Events

1. Verify endpoint URL is correct and publicly accessible
2. Check STRIPE_WEBHOOK_SECRET is set correctly
3. Verify events are selected in Stripe Dashboard
4. Check server logs for errors
5. Test with Stripe CLI forwarding

### Signature Verification Failed

1. Confirm `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard
2. Ensure raw body is being used (not parsed)
3. Check clock skew (server time should be accurate)

### User Not Found After Checkout

1. Verify user exists in database
2. Check `stripe_customer_id` is being set correctly
3. Look for fallback by email in webhook code

### Subscription Status Not Updating

1. Check database has subscription columns
2. Verify webhook is being triggered
3. Check logs for SQL errors
4. Manually verify user record in database

## Next Steps

After webhook implementation:

1. **Add Authentication** - Implement user signup/login (NextAuth)
2. **Enforce Limits** - Add AI parse counting in `parse-recipe.js`
3. **Add Restrictions** - Gate features based on subscription tier
4. **Email Notifications** - Send emails on subscription changes
5. **Analytics** - Track subscription metrics

## Support

For issues:
1. Check Stripe webhook logs: https://dashboard.stripe.com/webhooks
2. Review server logs for errors
3. Test with Stripe CLI locally
4. Contact Stripe support if needed
