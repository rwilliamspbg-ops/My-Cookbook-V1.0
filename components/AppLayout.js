import Link from 'next/link';
import { useRouter } from "next/router";

export default function AppLayout({ children }) {
  const router = useRouter();
  const path = router.pathname;
  const isActive = (href) => path === href || path.startsWith(href + "/");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #050816, #120b2e)",
        display: "flex",
        flexDirection: "column",
        padding: "16px",
        color: "#fff",
      }}
    >
      {/* App Container - Header stays fixed */}
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          height: "72px",
          margin: "0 auto",
          borderRadius: "24px 24px 0 0",
          background:
            "radial-gradient(circle at top, rgba(255,255,255,0.06), transparent 60%), #141022",
          boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          zIndex: 10,
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
      </div>

      {/* Recipe Container - Scrollable content */}
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          flex: 1,
          margin: "0 auto",
          background:
            "radial-gradient(circle at top, rgba(255,255,255,0.06), transparent 60%), #141022",
          display: "flex",
          flexDirection: "column",
          overflow: "visible",
        }}
      >
        {/* Main content - scrollable */}
        <main
          style={{
            flex: 1,
            padding: "16px 16px 12px",
            overflowY: "auto",
          }}
        >
          {children}
        </main>

        {/* Bottom nav - Footer stays fixed */}
        <nav
          style={{
            height: "72px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.4))",
            borderRadius: "0 0 24px 24px",
          }}
        >
          <NavItem href="/" active={isActive("/")} icon="🏠" label="Home" />
          <NavItem
            href="/recipes"
            active={isActive("/recipes")}
            icon="📚"
            label="Recipes"
          />
          <NavItem
            href="/recipe/new"
            active={isActive("/recipe/new")}
            icon="➕"
            label="New"
          />
          <NavItem
            href="/admin"
            active={isActive("/admin")}
            icon="👤"
            label="Account"
          />
        </nav>
      </div>
    </div>
  );
}

function NavItem({ href, active, icon, label }) {
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
        {icon}
      </div>
      <span>{label}</span>
    </Link>
  );
}
