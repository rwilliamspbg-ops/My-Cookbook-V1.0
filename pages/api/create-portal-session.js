import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { customerId, returnUrl } = req.body;

    // Validate inputs
    if (!customerId) {
      return res.status(400).json({ error: 'customerId is required' });
    }

    if (!returnUrl) {
      return res.status(400).json({ error: 'returnUrl is required' });
    }

    // Create Stripe Billing Portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    res.status(200).json({ url: portalSession.url });
  } catch (err) {
    console.error('Create portal session error:', err);
    res.status(500).json({
      error: 'Failed to create portal session',
      details: err.message,
    });
  }
}
