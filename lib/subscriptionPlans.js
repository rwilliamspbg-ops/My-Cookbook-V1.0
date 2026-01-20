// lib/subscriptionPlans.js

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
    // You can keep this null on the client; the API route will pick the real priceId
    priceId: null,
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
      aiParsesPerMonth: -1,
      maxRecipes: -1,
    },
  },
  business: {
    name: 'Business',
    price: 29.99,
    priceId: null,
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
