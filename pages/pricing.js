import { useState } from 'react';
import { useRouter } from 'next/router';
import { SUBSCRIPTION_PLANS } from '../lib/stripe';

export default function Pricing() {
  const router = useRouter();
  const [loading, setLoading] = useState(null);

  const handleSubscribe = async (planKey) => {
    if (planKey === 'free') {
      // Redirect to signup for free plan
      router.push('/signup');
      return;
    }

    setLoading(planKey);

    try {
      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planKey }),
      });

      const { url, error } = await response.json();

      if (error) {
        alert(error);
        return;
      }

      // Redirect to Stripe checkout
      window.location.href = url;
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="pricing-page">
      <div className="pricing-header text-center mb-4">
        <h1>Choose Your Plan</h1>
        <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '1rem auto' }}>
          Start for free, upgrade when you need more power.
        </p>
      </div>

      <div className="pricing-grid">
        {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
          <div key={key} className={`pricing-card ${key === 'premium' ? 'featured' : ''}`}>
            {key === 'premium' && (
              <div className="featured-badge">Most Popular</div>
            )}
            
            <div className="pricing-card-header">
              <h2>{plan.name}</h2>
              <div className="price">
                <span className="amount">${plan.price}</span>
                <span className="period">{plan.price === 0 ? '/forever' : '/month'}</span>
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
              className={`button ${key === 'free' ? 'button-secondary' : 'button-primary'} mt-3`}
              onClick={() => handleSubscribe(key)}
              disabled={loading === key}
              style={{ width: '100%' }}
            >
              {loading === key ? 'Loading...' : key === 'free' ? 'Get Started Free' : `Subscribe to ${plan.name}`}
            </button>
          </div>
        ))}
      </div>

      <div className="pricing-faq card mt-4" style={{ maxWidth: '800px', margin: '3rem auto' }}>
        <h2 className="mb-3">Frequently Asked Questions</h2>
        
        <div className="faq-item mb-3">
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Can I cancel anytime?</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
        </div>

        <div className="faq-item mb-3">
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>What payment methods do you accept?</h3>
          <p style={{ color: 'var(--text-secondary)' }}>We accept all major credit cards (Visa, Mastercard, American Express) through our secure Stripe payment processing.</p>
        </div>

        <div className="faq-item mb-3">
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>What happens if I exceed my free tier limits?</h3>
          <p style={{ color: 'var(--text-secondary)' }}>You'll be prompted to upgrade to Premium for unlimited access. Your existing recipes are always safe!</p>
        </div>

        <div className="faq-item">
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Can I upgrade or downgrade my plan?</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Yes! You can change your plan at any time from your account settings. Changes take effect immediately.</p>
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
          background: var(--card-bg);
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 2px solid var(--border-color);
          transition: all 0.3s ease;
          position: relative;
        }

        .pricing-card.featured {
          border-color: var(--primary-color);
          transform: scale(1.05);
          box-shadow: 0 20px 25px -5px rgba(22, 163, 74, 0.2);
        }

        .pricing-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .pricing-card.featured:hover {
          transform: scale(1.05) translateY(-8px);
        }

        .featured-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
          color: white;
          padding: 0.375rem 1rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
          box-shadow: 0 4px 6px rgba(22, 163, 74, 0.3);
        }

        .pricing-card-header {
          text-align: center;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid var(--border-color);
        }

        .pricing-card-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--text-primary);
        }

        .price {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 0.25rem;
        }

        .amount {
          font-size: 3rem;
          font-weight: 800;
          color: var(--primary-color);
          line-height: 1;
        }

        .period {
          font-size: 1rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .features-list {
          list-style: none;
          padding: 0;
          margin: 0 0 2rem 0;
        }

        .features-list li {
          padding: 0.75rem 0;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .features-list li:last-child {
          border-bottom: none;
        }

        .checkmark {
          color: var(--primary-color);
          font-weight: 700;
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .pricing-grid {
            grid-template-columns: 1fr;
          }

          .pricing-card.featured {
            transform: scale(1);
          }

          .pricing-card.featured:hover {
            transform: scale(1) translateY(-8px);
          }
        }
      `}</style>
    </div>
  );
}
