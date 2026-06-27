"use client";

// ============================================================
// WALEED AN Portfolio — Hero Section (Redesigned)
// Split layout: Left content + Right image
// Real data from resume — no placeholders
// Fully responsive: mobile, tablet, desktop
// No Ant Design icons — uses inline SVG
// ============================================================

import { useState, useEffect } from "react";
import { Button } from "antd";
import Image from "next/image";
import { SITE_META } from "../../constants";
import ResumeModal from "./ResumeModal";
import {
  EyeOutlined,
  ThunderboltTwoTone,
  VerifiedOutlined,
} from "@ant-design/icons";

// ------------------------------------------------------------
// Real roles from resume — accurately reflects experience
// ------------------------------------------------------------
const ROLES = [
  "Full-Stack Developer",
  "AI & LLM Integration ",
  "Next.js & TypeScript Builder",
  "OpenAI · Claude · Grok Integrator",
];

// ------------------------------------------------------------
// Real tech stack from resume
// ------------------------------------------------------------
const TECH_BADGES = [
  { label: "Next.js", color: "#000000" },
  { label: "TypeScript", color: "#3178C6" },
  { label: "React.js", color: "#61DAFB" },
  { label: "Node.js", color: "#339933" },
  { label: "Claude API", color: "#7C3AED" },
  { label: "OpenAI API", color: "#10A37F" },
  { label: "Grok API", color: "#1A1A2E" },
  { label: "Supabase", color: "#3ECF8E" },
  { label: "Tailwind CSS", color: "#06B6D4" },
  { label: "Express.js", color: "#888888" },
];

// ------------------------------------------------------------
// Real stats — honest numbers from resume timeline
// ------------------------------------------------------------
const STATS = [
  { value: "2", label: "Year Professional Experience" },
  { value: "3+", label: "Companies Worked With" },
  { value: "3+", label: "AI SaaS Products Shipped" },
];

// ------------------------------------------------------------
// Inline SVG Icons — no Ant Design dependency
// ------------------------------------------------------------
const IconArrowRight = () => (
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
    <path d="M5 12h14M12 5l7 7-7 7" />
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

const IconGithub = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const IconLinkedin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const IconMail = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const IconMapPin = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// ------------------------------------------------------------
// Hero Component
// ------------------------------------------------------------
export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setRoleIndex((prev) => (prev + 1) % ROLES.length);
        setFadeIn(true);
      }, 350);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      style={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "5rem 1.5rem 4rem",
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(160deg, #ffffff 0%, #f5f3ff 40%, #ede9fe 70%, #ffffff 100%)",
      }}
    >
      {/* Background orbs */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-10%",
            right: "-5%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            left: "-5%",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(91,33,182,0.06) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* ── SPLIT LAYOUT WRAPPER ── */}
      <div
        className="hero-grid"
        style={{
          maxWidth: "1100px",
          width: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* ══════════════════════════════════════
            LEFT COLUMN — Text Content
        ══════════════════════════════════════ */}
        <div className="hero-left">
          {/* Availability badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "#F0FDF4",
              border: "1px solid #BBF7D0",
              borderRadius: "999px",
              padding: "0.3rem 1rem",
              marginBottom: "1.5rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.78rem",
              fontWeight: 600,
              color: "#15803D",
            }}
          >
            <span style={{ position: "relative", display: "inline-flex" }}>
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#22C55E",
                  display: "block",
                }}
              />
              {mounted && (
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background: "#22C55E",
                    animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite",
                  }}
                />
              )}
            </span>
            Open to freelance & full-time roles
          </div>

          {/* Main headline */}
          <h1
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 800,
              fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
              lineHeight: 1.1,
              color: "var(--text-primary)",
              letterSpacing: "-1.5px",
              marginBottom: "0.75rem",
            }}
          >
            Hi, I'm{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Waleed AN
            </span>
          </h1>

          {/* Rotating role */}
          <div
            style={{
              height: "1.8rem",
              marginBottom: "1.25rem",
              overflow: "hidden",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
                fontWeight: 600,
                color: "var(--accent)",
                letterSpacing: "-0.3px",
                margin: 0,
                opacity: mounted && fadeIn ? 1 : 0,
                transform:
                  mounted && fadeIn ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 0.35s ease, transform 0.35s ease",
              }}
            >
              {ROLES[roleIndex]}
            </p>
          </div>

          {/* Real bio from resume */}
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(0.9rem, 1.8vw, 1rem)",
              fontWeight: 400,
              color: "var(--text-secondary)",
              lineHeight: 1.75,
              maxWidth: "540px",
              marginBottom: "2rem",
              letterSpacing: "-0.1px",
            }}
          >
            Full-Stack SaaS Developer who builds and ships AI-powered products
            end-to-end. I've delivered{" "}
            <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>
              SahiScreen
            </strong>{" "}
            (Claude API · CV screening),{" "}
            <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>
              PromptMinds AI
            </strong>
            {", and "}
            <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>
              PakMentor AI
            </strong>{" "}
            across ERP, POS, and SaaS platforms using React, Next.js,
            TypeScript, Node.js, and LLM APIs.
          </p>

          {/* CTA buttons */}
          <div
            className="hero-cta-buttons"
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              marginBottom: "2rem",
              justifyContent: "flex-start",
            }}
          >
            <button
              onClick={() => scrollTo("projects")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "var(--accent)",
                border: "none",
                color: "#fff",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: "0.9rem",
                borderRadius: "10px",
                height: "48px",
                padding: "0 1.75rem",
                letterSpacing: "-0.2px",
                boxShadow: "0 4px 20px rgba(124,58,237,0.3)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.opacity = "0.88";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.opacity = "1";
              }}
            >
              View Projects <IconArrowRight />
            </button>

            <button
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "#fff",
                border: "1.5px solid #e2e8f0",
                color: "var(--text-primary)",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: "0.9rem",
                borderRadius: "10px",
                height: "48px",
                padding: "0 1.75rem",
                letterSpacing: "-0.2px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onClick={() => setResumeOpen(true)}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "var(--accent)";
                (e.currentTarget as HTMLButtonElement).style.color =
                  "var(--accent)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "#e2e8f0";
                (e.currentTarget as HTMLButtonElement).style.color =
                  "var(--text-primary)";
              }}
            >
              <EyeOutlined /> View Resume
            </button>
          </div>
        </div>
        {resumeOpen && <ResumeModal onClose={() => setResumeOpen(false)} />}

        {/* ══════════════════════════════════════
            RIGHT COLUMN — Photo + Stats card
        ══════════════════════════════════════ */}
        <div className="hero-right">
          {/* Photo frame */}
          <div style={{ position: "relative", marginBottom: "1.5rem" }}>
            {/* Decorative ring */}
            <div
              style={{
                position: "absolute",
                inset: "-6px",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, var(--accent), #a855f7, #6366f1)",
                zIndex: 0,
              }}
            />
            {/* White gap ring */}
            <div
              style={{
                position: "absolute",
                inset: "-3px",
                borderRadius: "50%",
                background: "#fff",
                zIndex: 1,
              }}
            />
            {/* Photo */}
            <div
              style={{
                position: "relative",
                zIndex: 2,
                width: "clamp(220px, 28vw, 320px)",
                height: "clamp(220px, 28vw, 320px)",
                borderRadius: "50%",
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(124,58,237,0.2)",
              }}
            >
              <Image
                src="/images/waleed-avatar.png"
                alt="Waleed AN — Full-Stack SaaS Developer"
                fill
                style={{ objectFit: "cover", objectPosition: "center top" }}
                priority
              />
            </div>

            {/* Floating badge — bottom left */}
            <div
              style={{
                position: "absolute",
                bottom: "8%",
                left: "-10%",
                zIndex: 3,
                background: "#fff",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                padding: "0.5rem 0.85rem",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                fontFamily: "var(--font-body)",
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ color: "var(--accent)" }}>
                <VerifiedOutlined />
              </span>{" "}
              LLM Integrator
            </div>
          </div>

          {/* Stats card */}
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 1px 10px rgba(0,0,0,0.05)",
              overflow: "hidden",
              display: "flex",
              width: "100%",
              maxWidth: "clamp(280px, 28vw, 340px)",
            }}
          >
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                style={{
                  flex: 1,
                  padding: "1rem 0.75rem",
                  textAlign: "center",
                  borderRight:
                    i < STATS.length - 1 ? "1px solid #e2e8f0" : "none",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 800,
                    fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
                    color: "var(--accent)",
                    letterSpacing: "-1px",
                    lineHeight: 1,
                    marginBottom: "0.3rem",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.65rem",
                    fontWeight: 500,
                    color: "var(--text-muted)",
                    lineHeight: 1.3,
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RESPONSIVE STYLES ── */}
      <style jsx global>{`
        @keyframes ping {
          75%,
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        /* ── Desktop ── */
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 4rem;
          align-items: center;
        }

        .hero-left {
          text-align: left;
        }

        .hero-right {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          flex-shrink: 0;
        }

        /* ── Tablet ── */
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
            justify-items: center;
          }
          .hero-left {
            text-align: center;
            order: 2;
          }
          .hero-right {
            order: 1;
          }
          .hero-left p,
          .hero-left h1 {
            margin-left: auto;
            margin-right: auto;
          }
          .hero-cta-buttons {
            justify-content: center !important;
          }
        }

        /* ── Mobile ── */
        @media (max-width: 480px) {
          .hero-grid {
            gap: 2rem;
          }
          .hero-left {
            text-align: center;
          }
          .hero-left > div:first-child {
            flex-wrap: wrap;
            justify-content: center;
          }
          .hero-cta-buttons {
            justify-content: center !important;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}

// ── Shared style helpers ────────────────────────────────────
const socialIconStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "40px",
  height: "40px",
  borderRadius: "10px",
  background: "#fff",
  border: "1px solid #e2e8f0",
  color: "var(--text-secondary)",
  textDecoration: "none",
  transition: "all 0.2s",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
};

const socialPillStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.45rem",
  height: "40px",
  borderRadius: "10px",
  background: "#fff",
  border: "1px solid #e2e8f0",
  color: "var(--text-secondary)",
  fontSize: "0.78rem",
  fontFamily: "var(--font-body)",
  fontWeight: 500,
  textDecoration: "none",
  padding: "0 1rem",
  transition: "all 0.2s",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
};

function applyHover(e: React.MouseEvent<HTMLAnchorElement>, isEnter: boolean) {
  const el = e.currentTarget as HTMLAnchorElement;
  el.style.borderColor = isEnter ? "var(--accent)" : "#e2e8f0";
  el.style.color = isEnter ? "var(--accent)" : "var(--text-secondary)";
}
