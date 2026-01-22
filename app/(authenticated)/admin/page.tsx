// app/(authenticated)/admin/page.tsx
import Link from 'next/link';

interface AdminPageProps {
  // Remove entirely if you are not using searchParams
  // searchParams?: { [key: string]: string | string[] | undefined };
}

export default function AdminPage(_props: AdminPageProps) {
  // Admin dashboard content
  return (
    <main className="page-container">
      <section className="card">
        <h1 className="card-title">Admin</h1>
        <p className="card-description">
          Manage application settings and data here.
        </p>

        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link href="/recipes" className="btn btn-secondary">
            📚 View recipes
          </Link>
          <Link href="/recipe/new" className="btn btn-primary">
            ➕ Add recipe
          </Link>
        </div>
      </section>
    </main>
  );
}

