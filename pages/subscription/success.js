import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SubscriptionSuccess() {
  const router = useRouter();
  const { session_id } = router.query;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If you later want to fetch session details from your own API, do it here.
    if (session_id) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [session_id]);

  if (loading) {
    return (
      <main style={{ padding: '2rem' }}>
        <h1>Processing your subscription...</h1>
      </main>
    );
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Subscription Successful 🎉</h1>
      {session_id && (
        <p>
          Your checkout session ID: <code>{session_id}</code>
        </p>
      )}
      <p>Your premium access is now active.</p>
      <Link href="/">
        <button>Go to Dashboard</button>
      </Link>
    </main>
  );
}
