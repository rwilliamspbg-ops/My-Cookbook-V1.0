import Head from "next/head";
import Link from "next/link";
import React from "react";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Head>
        <title>My Cookbook V1.0</title>
        <meta
          name="description"
          content="Combined recipe management app with OpenAI parsing from PDF/URL/text, full CRUD operations, and recipe editing capabilities."
        />
      </Head>

      <div className="app-shell">
        <header className="site-header">
          <div className="site-header-inner">
            <div className="site-logo">
              <span role="img" aria-label="cookbook">
                🔍
              </span>
              <span className="site-title">My Cookbook</span>
              <span className="site-version">V1.0</span>
            </div>

            <nav className="site-nav">
              <Link href="/recipes" className="nav-link">
                Recipes
              </Link>
              <Link href="/upload" className="nav-link">
                Parse Recipe
              </Link>
              <Link href="/recipe/new" className="nav-link">
                Add Recipe
              </Link>
              <Link href="/pricing" className="nav-link">
                Pricing
              </Link>
            </nav>
          </div>
        </header>

        <main className="site-main">{children}</main>
      </div>
    </>
  );
}
  );
}
