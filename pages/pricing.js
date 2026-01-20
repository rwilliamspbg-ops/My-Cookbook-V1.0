import Head from 'next/head';
import { useState } from 'react';
import { SUBSCRIPTION_PLANS } from '../lib/subscriptionPlans';

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

  return (
    <>
      <Head>
        <title>Pricing | My Cookbook</title>
      </Head>
      <main style={{ padding: '2rem' }}>
        <section
          style={{
            maxWidth: '900px',
            margin: '0 auto 3rem',
            textAlign: 'center',
          }}
        >
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            Choose your plan
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Start free and upgrade when you are ready for unlimited recipe parsing
            and AI assistance.
          </p>
        </section>

        <div className="pricing-grid">
          {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
            <div
              key={key}
              className={`pricing-card ${key === 'premium' ? 'featured' : ''}`}
            >
              {key === 'premium' && (
                <div className="featured-badge">Most Popular</div>
              )}

              <div className="pricing-card-header">
                <h2>{plan.name}</h2>
                <div className="price">
                  <span className="amount">${plan.price}</span>
                  <span className="period">
                    {plan.price === 0 ? '/forever' : '/month'}
                  </span>
                </div>
              </div>

              <ul className="features-list">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>
                    <span className="checkmark">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`button ${
                  key === 'free' ? 'button-secondary' : 'button-primary'
                } mt-3`}
                onClick={() => handleSubscribe(key)}
                disabled={loading === key}
                style={{ width: '100%' }}
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

        <div
          className="pricing-faq card mt-4"
          style={{ maxWidth: '800px', margin: '3rem auto' }}
        >
          <h2 className="mb-3">Frequently Asked Questions</h2>

          <div className="faq-item mb-3">
            <h3
              style={{
                fontSize: '1.125rem',
                marginBottom: '0.5rem',
              }}
            >
              Can I cancel anytime?
            </h3>
            <p>
              You&apos;ll get unlimited recipe parsing and AI features while your
              subscription is active, and you can cancel at any time from your
              account settings.
            </p>
          </div>

          <div className="faq-item mb-3">
            <h3
              style={{
                fontSize: '1.125rem',
                marginBottom: '0.5rem',
              }}
            >
              What payment methods do you accept?
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              We accept all major credit cards (Visa, Mastercard, American
              Express) through our secure Stripe payment processing.
            </p>
          </div>

          <div className="faq-item mb-3">
            <h3
              style={{
                fontSize: '1.125rem',
                marginBottom: '0.5rem',
              }}
            >
              What happens if I exceed my free tier limits?
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              You&apos;ll be prompted to upgrade to Premium for unlimited access.
              Your existing recipes are always safe.
            </p>
          </div>

          <div className="faq-item">
            <h3
              style={{
                fontSize: '1.125rem',
                marginBottom: '0.5rem',
              }}
            >
              Can I upgrade or downgrade my plan?
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Yes! You can change your plan at any time from your account
              settings. Changes take effect immediately.
            </p>
          </div>
        </div>

        <style jsx>{`
          .pricing-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            max-width: 1200px;
            margin: 0 auto;
          }
          .pricing-card {
            background: var(--card-bg, #ffffff);
            border-radius: 1rem;
            padding: 2rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            border: 2px solid var(--border-color, #e5e7eb);
            transition: all 0.3s ease;
            position: relative;
          }
          .pricing-card.featured {
            border-color: var(--primary-color, #22c55e);
            transform: scale(1.05);
            box-shadow: 0 20px 25px -5px rgba(34, 197, 94, 0.2);
          }
          .pricing-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          }
          .featured-badge {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: var(--primary-color, #22c55e);
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
            letter-spacing: 0.03em;
          }
          .pricing-card-header {
            margin-bottom: 1.5rem;
          }
          .pricing-card-header h2 {
            margin: 0;
            font-size: 1.5rem;
          }
          .price {
            display: flex;
            align-items: baseline;
            gap: 0.25rem;
            margin-top: 0.5rem;
          }
          .amount {
            font-size: 2.25rem;
            font-weight: 700;
          }
          .period {
            color: var(--text-secondary, #6b7280);
          }
          .features-list {
            list-style: none;
            padding: 0;
            margin: 1.5rem 0;
          }
          .features-list li {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.5rem;
            color: var(--text-secondary, #4b5563);
          }
          .checkmark {
            color: var(--primary-color, #22c55e);
            font-weight: 700;
          }
          .button {
            padding: 0.75rem 1.5rem;
            border-radius: 9999px;
            border: none;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.95rem;
          }
          .button-primary {
            background: var(--primary-color, #22c55e);
            color: white;
          }
          .button-secondary {
            background: #ffffff;
            color: var(--primary-color, #22c55e);
            border: 2px solid var(--primary-color, #22c55e);
          }
          .pricing-faq h2 {
            margin-bottom: 1rem;
          }
        `}</style>
      </main>
    </>
  );
}
