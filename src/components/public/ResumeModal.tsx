"use client";

// ============================================================
// ResumeModal.tsx
// Opens as a full-screen overlay — shows waleed-resume.pdf
// in an <iframe>. Has a Download button + close (✕).
// Closes on: ✕ button / backdrop click / Escape key.
// Fully responsive: mobile falls back to direct open link.
// ============================================================

import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

// ------------------------------------------------------------
// Inline SVG icons — zero external dependency
// ------------------------------------------------------------
const IconClose = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconDownload = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
  </svg>
);

const IconExternalLink = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
  </svg>
);

// ------------------------------------------------------------
// Props
// ------------------------------------------------------------
interface ResumeModalProps {
  onClose: () => void;
}

// ------------------------------------------------------------
// PDF path — update if filename changes
// ------------------------------------------------------------
const PDF_PATH = "/resume/waleed-resume.pdf";

// ------------------------------------------------------------
// Component
// ------------------------------------------------------------
export default function ResumeModal({ onClose }: ResumeModalProps) {
  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    // Lock body scroll while modal is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  // Close when clicking the dark backdrop (not the modal panel itself)
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <>
      {/* ── Backdrop ── */}
      <div
        onClick={handleBackdropClick}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          background: "rgba(15, 10, 30, 0.75)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          animation: "fadeInBackdrop 0.2s ease",
        }}
        aria-modal="true"
        role="dialog"
        aria-label="Resume viewer"
      >
        {/* ── Modal panel ── */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            overflow: "hidden",
            width: "100%",
            maxWidth: "820px",
            height: "90vh",
            maxHeight: "920px",
            display: "flex",
            flexDirection: "column",
            boxShadow:
              "0 32px 80px rgba(124,58,237,0.18), 0 8px 24px rgba(0,0,0,0.12)",
            animation: "slideUpModal 0.25s cubic-bezier(0.16,1,0.3,1)",
            border: "1px solid rgba(124,58,237,0.12)",
          }}
          // Stop backdrop click from propagating through panel
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Modal header ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1rem 1.25rem",
              borderBottom: "1px solid #e2e8f0",
              background: "#fafafa",
              flexShrink: 0,
            }}
          >
            {/* Title + pill */}
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            >
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: "var(--text-primary)",
                  letterSpacing: "-0.3px",
                }}
              >
                Waleed AN — Resume
              </span>
              <span
                style={{
                  background: "#F0FDF4",
                  border: "1px solid #BBF7D0",
                  borderRadius: "999px",
                  padding: "0.15rem 0.65rem",
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  color: "#15803D",
                  fontFamily: "var(--font-body)",
                }}
              >
                2026
              </span>
            </div>

            {/* Right side actions */}
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              {/* Download button */}
              <a
                href={PDF_PATH}
                download="waleed-resume.pdf"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  background: "var(--accent)",
                  color: "#fff",
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  borderRadius: "8px",
                  padding: "0.45rem 1rem",
                  textDecoration: "none",
                  letterSpacing: "-0.1px",
                  transition: "opacity 0.2s",
                  boxShadow: "0 2px 10px rgba(124,58,237,0.25)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
                }}
              >
                <IconDownload />
                Download
              </a>

              {/* Open in new tab */}
              <a
                href={PDF_PATH}
                target="_blank"
                rel="noopener noreferrer"
                title="Open in new tab"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "34px",
                  height: "34px",
                  borderRadius: "8px",
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor =
                    "var(--accent)";
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor =
                    "#e2e8f0";
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    "var(--text-secondary)";
                }}
              >
                <IconExternalLink />
              </a>

              {/* Close button */}
              <button
                onClick={onClose}
                aria-label="Close resume"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "34px",
                  height: "34px",
                  borderRadius: "8px",
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "#fca5a5";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "#ef4444";
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "#fff1f2";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "#e2e8f0";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "var(--text-secondary)";
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "#fff";
                }}
              >
                <IconClose />
              </button>
            </div>
          </div>

          {/* ── PDF iframe ── */}
          {/* On desktop: renders inline. On mobile: shows fallback link. */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
            {/* Desktop iframe */}
            <iframe
              src={`${PDF_PATH}#toolbar=0&view=FitH`}
              title="Waleed AN Resume"
              className="resume-iframe"
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                display: "block",
                background: "#f8f8f8",
              }}
            />

            {/* Mobile fallback — shown via CSS only on small screens */}
            <div
              className="resume-mobile-fallback"
              style={{
                display: "none", // overridden by media query below
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
                height: "100%",
                padding: "2rem",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "3rem" }}>📄</div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                  maxWidth: "280px",
                }}
              >
                PDF preview isn't available on this device. You can open or
                download it directly.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <a
                  href={PDF_PATH}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    background: "var(--accent)",
                    color: "#fff",
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    borderRadius: "8px",
                    padding: "0.6rem 1.25rem",
                    textDecoration: "none",
                  }}
                >
                  <IconExternalLink /> Open PDF
                </a>
                <a
                  href={PDF_PATH}
                  download="waleed-resume.pdf"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    borderRadius: "8px",
                    padding: "0.6rem 1.25rem",
                    textDecoration: "none",
                  }}
                >
                  <IconDownload /> Download
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Animations + responsive ── */}
      <style jsx global>{`
        @keyframes fadeInBackdrop {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUpModal {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Mobile: hide iframe, show fallback */
        @media (max-width: 540px) {
          .resume-iframe {
            display: none !important;
          }
          .resume-mobile-fallback {
            display: flex !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </>,
    document.body,
  );
}
