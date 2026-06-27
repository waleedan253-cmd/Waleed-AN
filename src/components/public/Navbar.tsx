"use client";

// ============================================================
// WALEED AN Portfolio — Navbar Component
// Fixed top navbar with smooth scroll, mobile menu, resume download
// ============================================================

import { useState, useEffect } from "react";
import Link from "next/link";
import { Drawer, Button } from "antd";
import {
  MenuOutlined,
  CloseOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { NAV_LINKS, SITE_META } from "../../constants";

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------
interface NavLink {
  label: string;
  href: string;
}

// ------------------------------------------------------------
// Navbar Component
// ------------------------------------------------------------
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // ----------------------------------------------------------
  // Scroll listener — adds shadow + blur on scroll
  // ----------------------------------------------------------
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ----------------------------------------------------------
  // Intersection Observer — highlights active nav link
  // ----------------------------------------------------------
  useEffect(() => {
    const sections = NAV_LINKS.map((link) => link.href.split("#")[1]).filter(
      Boolean,
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // ----------------------------------------------------------
  // Smooth scroll handler
  // ----------------------------------------------------------
  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const hash = href.includes("#") ? href.split("#")[1] : null;
    if (hash) {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  // ----------------------------------------------------------
  // Render
  // ----------------------------------------------------------
  return (
    <>
      <nav
        className="navbar"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: "64px",
          display: "flex",
          alignItems: "center",
          padding: "0 1.5rem",
          background: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: scrolled
            ? "1px solid #e2e8f0"
            : "1px solid transparent",
          boxShadow: scrolled ? "0 1px 20px rgba(0,0,0,0.06)" : "none",
          transition: "border-color 0.3s, box-shadow 0.3s",
        }}
      >
        {/* -------------------------------------------------- */}
        {/* Logo / Brand                                        */}
        {/* -------------------------------------------------- */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          {/* Purple monogram badge */}
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "var(--accent)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.9rem",
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
              fontSize: "1rem",
              color: "var(--text-primary)",
              letterSpacing: "-0.3px",
            }}
          >
            Waleed AN
          </span>
        </Link>

        {/* -------------------------------------------------- */}
        {/* Desktop Nav Links                                   */}
        {/* -------------------------------------------------- */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            marginLeft: "auto",
            marginRight: "1rem",
          }}
          className="desktop-nav"
        >
          {NAV_LINKS.map((link: NavLink) => {
            const sectionId = link.href.split("#")[1];
            const isActive = activeSection === sectionId;
            return (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.4rem 0.75rem",
                  borderRadius: "8px",
                  fontFamily: "var(--font-body)",
                  fontWeight: isActive ? 600 : 500,
                  fontSize: "0.875rem",
                  color: isActive ? "var(--accent)" : "var(--text-secondary)",
                  //   background: isActive ? "var(--accent-light)" : "transparent",
                  transition: "all 0.2s",
                  letterSpacing: "-0.1px",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "var(--accent)";
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "var(--accent-light)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "var(--text-secondary)";
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "transparent";
                  }
                }}
              >
                {link.label}
              </button>
            );
          })}
        </div>

        {/* -------------------------------------------------- */}
        {/* Mobile Hamburger                                    */}
        {/* -------------------------------------------------- */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          style={{
            display: "none", // shown via CSS below
            marginLeft: "auto",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0.4rem",
            color: "var(--text-primary)",
            fontSize: "1.25rem",
          }}
        >
          <MenuOutlined />
        </button>
      </nav>

      {/* -------------------------------------------------------- */}
      {/* Spacer — prevents content from hiding behind fixed navbar */}
      {/* -------------------------------------------------------- */}
      <div style={{ height: "64px" }} />

      {/* -------------------------------------------------------- */}
      {/* Mobile Drawer                                            */}
      {/* -------------------------------------------------------- */}
      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        placement="right"
        closable={false}
        styles={{
          body: { padding: "1.5rem 1rem" },
          header: { display: "none" },
          wrapper: { width: "280px" },
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "2rem",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: "1rem",
              color: "var(--accent)",
            }}
          >
            Waleed AN
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-secondary)",
              fontSize: "1.1rem",
              padding: "0.25rem",
            }}
          >
            <CloseOutlined />
          </button>
        </div>

        {/* Mobile Nav Links */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
        >
          {NAV_LINKS.map((link: NavLink) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                padding: "0.75rem 1rem",
                borderRadius: "10px",
                fontFamily: "var(--font-body)",
                fontWeight: 500,
                fontSize: "0.95rem",
                color: "var(--text-primary)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "var(--accent-light)";
                (e.currentTarget as HTMLButtonElement).style.color =
                  "var(--accent)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "none";
                (e.currentTarget as HTMLButtonElement).style.color =
                  "var(--text-primary)";
              }}
            >
              {link.label}
            </button>
          ))}
        </div>
      </Drawer>

      {/* -------------------------------------------------------- */}
      {/* Responsive CSS — hides/shows desktop vs mobile elements   */}
      {/* -------------------------------------------------------- */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
