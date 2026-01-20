import Link from 'next/link';

export default function SignupSuccess() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Account created ✅</h1>
      <p>Your My Cookbook account is ready.</p>
      <p>You can now log in and access your recipes and subscription features.</p>

      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
        <Link href="/login">
          <button>Go to Login</button>
        </Link>
        <Link href="/pricing">
          <button>View Subscription Plans</button>
        </Link>
      </div>
    </main>
  );
}
