// pages/login.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AppLayout from '../components/AppLayout'; // adjust path if needed

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      router.push('/');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <main className="page-container">
        <section className="card">
          <h1>Login</h1>
          <p>Access your My Cookbook account.</p>
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-full mt-4"
            >
              {loading ? 'Logging in…' : 'Login'}
            </button>
          </form>
          <p className="mt-4 text-center">
            Need an account?{' '}
            <Link href="/signup" className="btn-ghost">
              Sign up
            </Link>
          </p>
        </section>
      </main>
    </AppLayout>
  );
}
