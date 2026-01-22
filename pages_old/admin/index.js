import Head from 'next/head';
import Link from 'next/link';
import AppLayout from '../../components/AppLayout';

export default function AdminDashboard() {
  return (
    <AppLayout>
      <Head>
        <title>Admin Dashboard | My Cookbook</title>
      </Head>

      <main className="page-container">
        <header className="page-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage members and system tools.</p>
          </div>
          <div className="page-header-actions">
            <Link href="/" className="btn btn-secondary">
              ← Back to app
            </Link>
          </div>
        </header>

        <section className="grid grid-2">
          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="card-title">Members</h2>
                <p className="card-description">
                  View users and subscription status.
                </p>
              </div>
            </div>
            <div className="card-footer">
              <Link href="/admin/members" className="btn btn-primary">
                Open membership console
              </Link>
            </div>
          </div>
        </section>
      </main>
    </AppLayout>
  );
}
