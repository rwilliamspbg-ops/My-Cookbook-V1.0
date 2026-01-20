// lib/stripe.js
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});


// Subscription plans configuration
export const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      '10 AI recipe parses per month',
      'Basic recipe storage',
      'Up to 50 recipes',
      'Community support',
    ],
    limits: {
      aiParsesPerMonth: 10,
      maxRecipes: 50,
    },
  },
  premium: {
    name: 'Premium',
    price: 7.99,
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID,
    features: [
      'Unlimited AI recipe parsing',
      'Unlimited recipe storage',
      'Meal planning & grocery lists',
      'Recipe scaling calculator',
      'Export to PDF',
      'Ad-free experience',
      'Priority email support',
    ],
    limits: {
      aiParsesPerMonth: -1, // unlimited
      maxRecipes: -1, // unlimited
    },
  },
  business: {
    name: 'Business',
    price: 29.99,
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID,
    features: [
      'Everything in Premium',
      'Team collaboration (up to 5 users)',
      'Bulk recipe import',
      'Recipe categories & tags',
      'Analytics dashboard',
      'API access',
      'Dedicated account manager',
      'Custom branding',
    ],
    limits: {
      aiParsesPerMonth: -1,
      maxRecipes: -1,
      teamMembers: 5,
    },
  },
};

/**
 * Create a Stripe checkout session for subscription
 */
export async function createCheckoutSession({
  customerId,
  priceId,
  successUrl,
  cancelUrl,
  customerEmail,
}) {
  const sessionParams = {
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
  };

  // Add customer ID or email
  if (customerId) {
    sessionParams.customer = customerId;
  } else if (customerEmail) {
    sessionParams.customer_email = customerEmail;
  }

  const session = await stripe.checkout.sessions.create(sessionParams);
  return session;
}

/**
 * Create a Stripe customer
 */
export async function createCustomer({ email, name }) {
  const customer = await stripe.customers.create({
    email,
    name,
  });
  return customer;
}

/**
 * Create a billing portal session for subscription management
 */
export async function createPortalSession(customerId, returnUrl) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
  return session;
}

/**
 * Get subscription details
 */
export async function getSubscription(subscriptionId) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return subscription;
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(subscriptionId) {
  const subscription = await stripe.subscriptions.cancel(subscriptionId);
  return subscription;
}

/**
 * Get customer by ID
 */
export async function getCustomer(customerId) {
  const customer = await stripe.customers.retrieve(customerId);
  return customer;
}
