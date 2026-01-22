import { cookies } from 'next/headers';
import { parseUserFromRequest } from '@/lib/auth';
import Link from 'next/link';
import LogoutButton from './LogoutButton';
interface AdminPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function AdminPage({ searchParams }: AdminPageProps) {
  const cookieStore = await cookies();
  const mockReq = {
    headers: { cookie: cookieStore.toString() },
  };
  const user = parseUserFromRequest(mockReq as any);

  return (
    <div className="page-container">
      <div className="card">
        <div className="card-header">
          <div>
            <h1 className="card-title">Account</h1>
            <p className="card-description">Manage your account and settings</p>
          </div>
        </div>

        {/* User Info */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Profile</h2>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.5rem' }}>
            {user?.name && (
              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ opacity: 0.7 }}>Name: </span>
                <span>{user.name}</span>
              </div>
            )}
            {user?.email && (
              <div>
                <span style={{ opacity: 0.7 }}>Email: </span>
                <span>{user.email}</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Quick Actions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link href="/recipes" className="btn btn-secondary" style={{ textAlign: 'left' }}>
              📚 View All Recipes
            </Link>
            <Link href="/upload" className="btn btn-secondary" style={{ textAlign: 'left' }}>
              📤 Parse New Recipe
            </Link>
            <Link href="/recipe/new" className="btn btn-secondary" style={{ textAlign: 'left' }}>
              ➕ Add Recipe Manually
            </Link>
          </div>
        </div>

        {/* Subscription (if you have Stripe) */}
        {user?.subscriptionStatus && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Subscription</h2>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.5rem' }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ opacity: 0.7 }}>Status: </span>
                <span style={{ textTransform: 'capitalize' }}>{user.subscriptionStatus}</span>
              </div>
              <Link href="/subscription" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Manage Subscription
              </Link>
            </div>
          </div>
        )}

        {/* Logout */}
        <div>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
