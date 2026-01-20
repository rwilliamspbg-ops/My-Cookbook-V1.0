import { createCheckoutSession, SUBSCRIPTION_PLANS } from '../../lib/stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { planKey } = req.body;

    // Validate plan
    if (!planKey || !SUBSCRIPTION_PLANS[planKey]) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    const plan = SUBSCRIPTION_PLANS[planKey];

    // Free plan doesn't need checkout
    if (planKey === 'free') {
      return res.status(400).json({ error: 'Free plan does not require checkout' });
    }

    // Check if price ID is configured
    if (!plan.priceId) {
      return res.status(500).json({ 
        error: 'Subscription not configured. Please add STRIPE_PREMIUM_PRICE_ID and STRIPE_BUSINESS_PRICE_ID to your .env file' 
      });
    }

    // TODO: Get user from session/auth
    // For now, we'll use customer email from request or create new
    const { email, customerId } = req.body;

    // Create checkout session
    const session = await createCheckoutSession({
      customerId,
      customerEmail: email,
      priceId: plan.priceId,
      successUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/pricing`,
      metadata: {
        planKey: planKey,
      }
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Checkout session error:', error);
    return res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error.message 
    });
  }
}
