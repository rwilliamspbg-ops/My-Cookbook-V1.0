import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default function SubscriptionSuccess() {
  const router = useRouter();
  const { session_id } = router.query;
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session_id) return;

    // In a real implementation, you would fetch session details from the server
    // For now, we'll just show a success message
    setLoading(false);
  }, [session_id]);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.spinner}></div>
        <p>Loading your subscription details...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.checkmark}>✓</div>
        <h1 style={styles.title}>Welcome to Premium!</h1>
        <p style={styles.subtitle}>Your subscription is now active</p>

        <div style={styles.details}>
          <p style={styles.detailItem}>
            <strong>Session ID:</strong> {session_id}
          </p>
          <p style={styles.detailItem}>
            Unlimited AI recipe parsing from PDFs and URLs
          </p>
          <p style={styles.detailItem}>
            Unlimited recipe storage and management
          </p>
          <p style={styles.detailItem}>
            Advanced features and priority support
          </p>
        </div>

        <div style={styles.actions}>
          <Link href="/upload" style={styles.primaryButton}>
            Start Parsing Recipes
          </Link>
          <Link href="/" style={styles.secondaryButton}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fff8f0 0%, #fff9f5 100%)',
    padding: '20px',
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
    padding: '40px',
    maxWidth: '500px',
    width: '100%',
    textAlign: 'center',
  },
  checkmark: {
    width: '60px',
    height: '60px',
    background: '#16a34a',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    margin: '0 auto 20px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1a1a1a',
    margin: '0 0 8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '24px',
  },
  details: {
    background: '#f9f9f9',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '24px',
    textAlign: 'left',
  },
  detailItem: {
    fontSize: '14px',
    color: '#555',
    margin: '8px 0',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    flexDirection: 'column',
  },
  primaryButton: {
    background: '#16a34a',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.3s',
    display: 'inline-block',
  },
  secondaryButton: {
    background: '#e5e7eb',
    color: '#1a1a1a',
    padding: '12px 24px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.3s',
    display: 'inline-block',
  },
  spinner: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #16a34a',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    margin: 'auto',
  },
};

// Add CSS animation for spinner
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}
