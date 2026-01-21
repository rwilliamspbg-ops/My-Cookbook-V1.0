// components/Layout.tsx
import React from "react";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-root">

      <main className="app-main">{children}</main>
      <footer className="app-footer">
        <span>© {new Date().getFullYear()} My Cookbook</span>
      </footer>
    </div>
  );
}
