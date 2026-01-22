import Head from 'next/head';
import { useState } from 'react';
import { SUBSCRIPTION_PLANS } from '../lib/subscriptionPlans';
import AppLayout from '../components/AppLayout';

export default function PricingPage() {
  const [loading, setLoading] = useState(null);

  const handleSubscribe = async (planKey) => {
    if (planKey === 'free') {
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

  return (
    <AppLayout>
      <Head>
        <title>Pricing | My Cookbook</title>
      </Head>

      <main className="page-container">
        <section className="page-header text-center">
          <div>
            <h1>Choose your plan</h1>
            <p>
              Start free and upgrade when you are ready for unlimited recipe
              parsing and AI assistance.
            </p>
          </div>
        </section>

        <div className="grid grid-3">
          {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
            <div key={key} className="card">
              <div className="card-header">
                <div>
                  <h2 className="card-title">{plan.name}</h2>
                  <p className="card-description">
                    {plan.price === 0
                      ? 'Perfect to get started'
                      : 'For power users'}
                  </p>
                </div>
              </div>

              <ul className="features-list">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>

              <button
                className={`btn ${
                  key === 'free' ? 'btn-secondary' : 'btn-primary'
                } btn-full mt-4`}
                onClick={() => handleSubscribe(key)}
                disabled={loading === key}
              >
                {loading === key
                  ? 'Loading...'
                  : key === 'free'
                  ? 'Get Started Free'
                  : `Subscribe to ${plan.name}`}
              </button>
            </div>
          ))}
        </div>
      </main>
    </AppLayout>
  );
}

