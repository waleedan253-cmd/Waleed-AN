// src/components/public/PageLoader.tsx
"use client";

import { useEffect, useState } from "react";

export default function PageLoader() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade out after fonts + styles loaded
    const timer = setTimeout(() => {
      setFadeOut(true);
      // Remove from DOM after fade completes
      setTimeout(() => setVisible(false), 400);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "1rem",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.4s ease",
        pointerEvents: fadeOut ? "none" : "all",
      }}
    >
      {/* Logo / Brand */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
        }}
      >
        {/* Purple monogram */}
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            background: "var(--accent)",
            color: "#fff",
            fontWeight: 800,
            fontSize: "1rem",
            letterSpacing: "-0.5px",
            fontFamily: "var(--font-body)",
          }}
        >
          WA
        </span>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            fontSize: "1.1rem",
            color: "var(--text-primary)",
            letterSpacing: "-0.3px",
          }}
        >
          Waleed AN
        </span>
      </div>

      {/* Spinner */}
      <div
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          border: "3px solid #ede9fe",
          borderTop: "3px solid var(--accent)",
          animation: "spin 0.7s linear infinite",
        }}
      />

      {/* Spin keyframe */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
