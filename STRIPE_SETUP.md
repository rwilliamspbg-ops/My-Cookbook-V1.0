# Stripe Subscription Setup Guide

This guide will walk you through setting up Stripe payments for your cookbook app's freemium + premium subscription model.

## 📋 Prerequisites

- Stripe account (sign up at https://stripe.com)
- Node.js and npm installed
- Your cookbook app running locally

## 🚀 Step 1: Create Stripe Account

1. Go to https://stripe.com and create an account
2. Verify your email address
3. Complete the onboarding process

## 🔑 Step 2: Get Your API Keys

1. Go to https://dashboard.stripe.com/apikeys
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)
4. Add them to your `.env.local` file:

```bash
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

## 💳 Step 3: Create Products and Prices

### Create Premium Plan

1. Go to https://dashboard.stripe.com/products
2. Click **"+ Add product"**
3. Fill in:
   - **Name**: Recipe Cookbook - Premium
   - **Description**: Unlimited AI parsing, meal planning, and more
   - **Pricing**: $7.99 USD
   - **Billing period**: Monthly
   - **Recurring**: Yes
4. Click **"Save product"**
5. Copy the **Price ID** (starts with `price_`)
6. Add to `.env.local`:

```bash
STRIPE_PREMIUM_PRICE_ID=price_xxxxxxxxxxxxx
```

### Create Business Plan

1. Repeat the above steps with:
   - **Name**: Recipe Cookbook - Business
   - **Description**: Team collaboration, API access, and dedicated support
   - **Pricing**: $29.99 USD
   - **Billing period**: Monthly
2. Add the Price ID to `.env.local`:

```bash
STRIPE_BUSINESS_PRICE_ID=price_xxxxxxxxxxxxx
```

## 🗄️ Step 4: Set Up Database

1. Run the database migration:

```bash
sqlite3 recipes.db < lib/db-schema.sql
```

Or if you prefer, manually create the tables using an SQLite client.

## 📦 Step 5: Install Dependencies

```bash
npm install
```

This will install:
- `stripe` - Stripe Node.js library
- `@stripe/stripe-js` - Stripe.js for client-side
- `next-auth` - Authentication
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT tokens

## 🧪 Step 6: Test the Integration

1. Start your development server:

```bash
npm run dev
```

2. Navigate to http://localhost:3000/pricing

3. Click "Subscribe to Premium"

4. Use Stripe's test card numbers:
   - **Success**: 4242 4242 4242 4242
   - **Decline**: 4000 0000 0000 0002
   - **3D Secure**: 4000 0027 6000 3184
   - **Expiry**: Any future date (e.g., 12/34)
   - **CVC**: Any 3 digits
   - **ZIP**: Any 5 digits

5. Complete the checkout and verify you're redirected back

## 🔔 Step 7: Set Up Webhooks (Production)

Webhooks notify your app when subscriptions are created, updated, or canceled.

1. Go to https://dashboard.stripe.com/webhooks
2. Click **"+ Add endpoint"**
3. Enter your endpoint URL:
   ```
   https://your-domain.com/api/stripe-webhook
   ```
4. Select events to listen for:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add to `.env.local`:

```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

## ✅ Step 8: Verify Setup

Make sure your `.env.local` file has all these variables:

```bash
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PREMIUM_PRICE_ID=price_...
STRIPE_BUSINESS_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_... (for production)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 🎯 What's Implemented

✅ Pricing page with 3 tiers (Free, Premium, Business)
✅ Stripe checkout integration
✅ Database schema for users and subscriptions
✅ Usage tracking system
✅ Subscription management utilities
✅ Beautiful, responsive pricing UI

## 🚧 What's Next (To Be Implemented)

- [ ] User authentication (signup/login)
- [ ] Protected routes for premium features
- [ ] Usage limit enforcement
- [ ] Stripe webhook handler
- [ ] Customer portal for subscription management
- [ ] Invoice history page
- [ ] Email notifications
- [ ] Analytics dashboard

## 🔒 Security Notes

1. **Never commit `.env.local` to Git** - It's already in `.gitignore`
2. **Use test keys in development** - Only use live keys in production
3. **Verify webhook signatures** - Always validate Stripe webhook events
4. **Sanitize user input** - Prevent SQL injection and XSS attacks

## 📊 Subscription Plans Overview

### Free Plan
- 10 AI parses per month
- Up to 50 recipes
- Basic features
- Community support

### Premium Plan - $7.99/month
- Unlimited AI parsing
- Unlimited recipes
- Meal planning
- Recipe scaling
- Export to PDF
- Ad-free
- Priority support

### Business Plan - $29.99/month
- Everything in Premium
- Team collaboration (5 users)
- Bulk import
- API access
- Analytics dashboard
- Dedicated account manager
- Custom branding

## 💡 Tips for Going Live

1. **Switch to live mode** in Stripe Dashboard
2. Update `.env.local` with live API keys
3. Set up proper domain and SSL certificate
4. Configure webhooks with production URL
5. Test with real (small amount) transactions
6. Set up monitoring and error tracking
7. Configure email notifications
8. Review Stripe's go-live checklist

## 🐛 Troubleshooting

### "Price ID not found" error
- Make sure you copied the Price ID (not Product ID)
- Verify it starts with `price_`
- Check it's in your `.env.local` file

### Checkout session fails
- Verify your Stripe keys are correct
- Check browser console for errors
- Ensure you're using test card numbers

### Database errors
- Make sure SQLite is installed
- Run the migration script
- Check file permissions on `recipes.db`

## 📚 Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Dashboard](https://dashboard.stripe.com)
- [Stripe API Reference](https://stripe.com/docs/api)

## 🆘 Support

If you encounter issues:
1. Check the console for error messages
2. Review Stripe Dashboard logs
3. Verify all environment variables are set
4. Test with Stripe's test mode first

---

**Ready to start making money!** 🎉

Once everything is set up, share your pricing page and start accepting subscriptions!
