import Head from 'next/head';
import { useState } from 'react';
import { SUBSCRIPTION_PLANS } from '../lib/subscriptionPlans';
import AppLayout from '../components/AppLayout';

export default function PricingPage() {
  const [loading, setLoading] = useState(null);

  const handleSubscribe = async (planKey) => {
    if (planKey === 'free') {
      // Free plan can just redirect back to app/home or signup
      window.location.href = '/signup';
      return;
    }

    try {
      setLoading(planKey);
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planKey,
          // If you collect email or have auth, include it here
          email: undefined,
          customerId: undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Failed to start checkout');
      }

      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      alert('Unable to start checkout. Please try again.');
      setLoading(null);
    }
  };

  import Head from 'next/head';
import { useState } from 'react';
import { SUBSCRIPTION_PLANS } from '../lib/subscriptionPlans';
import AppLayout from '../components/AppLayout';

export default function PricingPage() {
  const [loading, setLoading] = useState(null);

  const handleSubscribe = async (planKey) => {
