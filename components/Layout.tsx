import Head from "next/head";
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
        {/* Top navigation bar */}
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
              <a href="/recipes"> Recipes </a>
              <a href="/upload"> Parse Recipe </a>
              <a href="/recipe/new"> Add Recipe </a>
              <a href="/pricing"> Pricing </a>
            </nav>
          </div>
        </header>

        {/* Main page content */}
        <main className="site-main">{children}</main>
      </div>
    </>
  );
}
