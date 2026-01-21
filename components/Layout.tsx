// components/Layout.tsx
import React from "react";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-header-inner">
          <Link href="/" className="brand">
            <span className="brand-icon">🍳</span>
            <span className="brand-name">My Cookbook</span>
            <span className="brand-version">V1.0</span>
          </Link>
          <nav className="app-nav">
            <Link href="/recipes">Recipes</Link>
            <Link href="/upload">Parse Recipe</Link>
            <Link href="/recipe/new">Add Recipe</Link>
            <Link href="/pricing">Pricing</Link>
          </nav>
        </div>
      </header>
      <main className="app-main">{children}</main>
      <footer className="app-footer">
        <span>© {new Date().getFullYear()} My Cookbook</span>
      </footer>
    </div>
  );
}
