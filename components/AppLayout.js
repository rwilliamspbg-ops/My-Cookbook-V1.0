// components/AppLayout.js
import Link from 'next/link';
import { useState } from 'react';

export default function AppLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navigation */}
      <nav style={navStyles.nav}>
        <div style={navStyles.container}>
          <div style={navStyles.navContent}>
            {/* Logo */}
            <Link href="/">
              <a style={navStyles.logo}>
                <span style={navStyles.logoIcon}>🍳</span>
                My Cookbook
              </a>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              style={navStyles.mobileToggle}
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              ☰
            </button>

            {/* Navigation Links */}
            <div style={{
              ...navStyles.navLinks,
              display: mobileMenuOpen ? 'flex' : 'none',
            }}>
              <Link href="/recipes">
                <a style={navStyles.navLink}>Recipes</a>
              </Link>
              <Link href="/recipe/new">
                <a style={navStyles.navLink}>Upload</a>
              </Link>
              <Link href="/pricing">
                <a style={navStyles.navLink}>Pricing</a>
              </Link>
              <Link href="/admin">
                <a style={navStyles.navLink}>Account</a>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, width: '100%' }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={footerStyles.footer}>
        <div style={footerStyles.container}>
          <div style={footerStyles.content}>
            <div style={footerStyles.column}>
              <h4 style={footerStyles.heading}>My Cookbook</h4>
              <p style={footerStyles.text}>
                A modern recipe management system for organizing and sharing your favorite recipes.
              </p>
            </div>
            <div style={footerStyles.column}>
              <h4 style={footerStyles.heading}>Quick Links</h4>
              <ul style={footerStyles.list}>
                <li><Link href="/recipes"><a style={footerStyles.link}>All Recipes</a></Link></li>
                <li><Link href="/recipe/new"><a style={footerStyles.link}>Add Recipe</a></Link></li>
                <li><Link href="/pricing"><a style={footerStyles.link}>Pricing</a></Link></li>
              </ul>
            </div>
            <div style={footerStyles.column}>
              <h4 style={footerStyles.heading}>Support</h4>
              <ul style={footerStyles.list}>
                <li><a href="mailto:support@mycookbook.com" style={footerStyles.link}>Contact</a></li>
                <li><a href="#privacy" style={footerStyles.link}>Privacy</a></li>
                <li><a href="#terms" style={footerStyles.link}>Terms</a></li>
              </ul>
            </div>
          </div>
          <div style={footerStyles.divider}></div>
          <div style={footerStyles.bottom}>
            <p style={footerStyles.copyright}>
              © {new Date().getFullYear()} My Cookbook. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        a {
          color: inherit;
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}

const navStyles = {
  nav: {
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 1rem',
  },
  navContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '64px',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#2563eb',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
  },
  logoIcon: {
    fontSize: '1.75rem',
  },
  mobileToggle: {
    display: 'none',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0.5rem',
  },
  navLinks: {
    gap: '2rem',
    alignItems: 'center',
  },
  navLink: {
    color: '#4b5563',
    fontWeight: '500',
    cursor: 'pointer',
  },
};

const footerStyles = {
  footer: {
    backgroundColor: '#1f2937',
    color: '#e5e7eb',
    padding: '3rem 1rem 1rem',
    marginTop: '4rem',
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    marginBottom: '2rem',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  heading: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '0.75rem',
  },
  text: {
    fontSize: '0.875rem',
    lineHeight: '1.6',
    color: '#d1d5db',
  },
  list: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  link: {
    fontSize: '0.875rem',
    color: '#d1d5db',
    cursor: 'pointer',
  },
  divider: {
    height: '1px',
    backgroundColor: '#374151',
    margin: '2rem 0',
  },
  bottom: {
    textAlign: 'center',
  },
  copyright: {
    fontSize: '0.875rem',
    color: '#9ca3af',
  },
};
