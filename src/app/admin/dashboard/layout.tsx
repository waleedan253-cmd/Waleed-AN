// src/app/admin/layout.tsx
"use client";

import { useRequireAuth } from "../../../hooks/useAuth";
import { useRouter } from "next/navigation";
import { LogoutOutlined, AppstoreOutlined } from "@ant-design/icons";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading, logout, user } = useRequireAuth();
  const router = useRouter();

  // ----------------------------------------------------------
  // Show spinner while checking session
  // ----------------------------------------------------------
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAFAFA",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "3px solid #EDE9FE",
            borderTop: "3px solid #7C3AED",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ----------------------------------------------------------
  // Not authenticated — render nothing (redirect handled by hook)
  // ----------------------------------------------------------
  if (!isAuthenticated) return null;

  // ----------------------------------------------------------
  // Authenticated — show admin shell
  // ----------------------------------------------------------
  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFA" }}>
      {/* Top bar */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          height: "60px",
          background: "#fff",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1.5rem",
          boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
        }}
      >
        {/* Brand */}
        <Link
          href="/admin/dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "34px",
              height: "34px",
              borderRadius: "9px",
              background: "#7C3AED",
              color: "#fff",
              fontWeight: 800,
              fontSize: "0.85rem",
            }}
          >
            WA
          </span>
          <span
            style={{
              fontWeight: 700,
              fontSize: "0.95rem",
              color: "#1E1B4B",
              fontFamily: "var(--font-body)",
            }}
          >
            Admin Panel
          </span>
        </Link>

        {/* Right side — user + logout */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span
            style={{
              fontSize: "0.8rem",
              color: "#64748B",
              fontFamily: "var(--font-body)",
            }}
          >
            {user?.email}
          </span>

          <button
            onClick={logout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: "8px",
              color: "#EF4444",
              cursor: "pointer",
              padding: "0.35rem 0.75rem",
              fontSize: "0.8rem",
              fontWeight: 600,
              fontFamily: "var(--font-body)",
              transition: "all 0.2s",
            }}
          >
            <LogoutOutlined />
            Logout
          </button>
        </div>
      </div>

      {/* Page content */}
      <main style={{ padding: "2rem 1.5rem" }}>{children}</main>
    </div>
  );
}
