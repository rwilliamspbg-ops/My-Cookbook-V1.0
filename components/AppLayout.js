// components/AppLayout.js
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function AppLayout({ children }) {
  const router = useRouter();
  const path = router.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href) => path === href || path.startsWith(href + "/");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #050816, #120b2e)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "16px",
        color: "#fff",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          minHeight: "640px",
          borderRadius: "24px",
          background:
            "radial-gradient(circle at top, rgba(255,255,255,0.06), transparent 60%), #141022",
          boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Top bar */}
        <header
          style={{
            height: "72px",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "999px",
                background:
                  "radial-gradient(circle at 30% 0, #8b5cf6, #312e81 55%, #1f2937 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "18px",
              }}
            >
              MC
            </div>
            <div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>My Cookbook</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                Personal kitchen
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "12px",
              opacity: 0.85,
            }}
          >
            <span>Recipes</span>
            <span>•</span>
            <span>Secured</span>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            style={{
              marginLeft: "12px",
              background: "none",
              border: "none",
              color: "#e5e7eb",
              fontSize: "20px",
              cursor: "pointer",
              display: "none",
            }}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </header>

        {/* Main content */}
        <main
          style={{
            flex: 1,
            padding: "16px 16px 12px",
            overflowY: "auto",
          }}
        >
          {children}
        </main>

        {/* Bottom nav */}
        <nav
          style={{
            height: "72px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.4))",
          }}
        >
          <NavItem href="/" active={isActive("/")}>
            🏠 Home
          </NavItem>
          <NavItem href="/recipes" active={isActive("/recipes")}>
            📚 Recipes
          </NavItem>
          <NavItem href="/recipe/new" active={isActive("/recipe/new")}>
            ➕ New
          </NavItem>
          <NavItem href="/admin" active={isActive("/admin")}>
            👤 Account
          </NavItem>
        </nav>
      </div>
    </div>
  );
}

function NavItem({ href, active, children }) {
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
        fontSize: "11px",
        color: active ? "#e5e7eb" : "#9ca3af",
        textDecoration: "none",
      }}
    >
      <div
        style={{
          width: "24px",
          height: "24px",
          borderRadius: "999px",
          background: active
            ? "radial-gradient(circle at 30% 0, #a855f7, #6366f1)"
            : "rgba(55,65,81,0.9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
        }}
      >
        {typeof children === "string" ? children[0] : "•"}
      </div>
      <span>{children}</span>
    </Link>
  );
}


