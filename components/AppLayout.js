// components/AppLayout.js
import Link from 'next/link';

export default function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <Link href="/" className="app-logo">
            🍳 My Cookbook
          </Link>
          <nav className="app-nav">
            <Link href="/upload">Parse Recipe</Link>
            <Link href="/recipe/new">Add Recipe</Link>
          </nav>
        </div>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
}
