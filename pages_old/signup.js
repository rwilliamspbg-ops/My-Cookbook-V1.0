// pages/signup.js
import Link from 'next/link';

export default function Signup() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Sign up</h1>
      <p>Create your My Cookbook account.</p>

      {/* Placeholder form – hook into your auth later */}
      <form>
        <div>
          <label>Email</label>
          <input type="email" name="email" required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" name="password" required />
        </div>
        <button 
  type="submit"
  className="btn-pill primary"
  style={{ width: '100%' }}
>
  Create account
</button>
      </form>

      <p style={{ marginTop: '1rem' }}>
        Already have an account?{' '}
<Link href="/login" className="btn-pill" style={{ display: 'inline-block', marginTop: '0.5rem' }}>
  Log in
</Link>
      </p>
    </main>
  );
}
