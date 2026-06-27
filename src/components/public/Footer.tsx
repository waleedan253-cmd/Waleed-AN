"use client";

// ============================================================
// WALEED AN Portfolio — Footer Component
// Brand mark, nav links, social icons, copyright
// ============================================================

import Link from "next/link";
import {
  GithubOutlined,
  LinkedinOutlined,
  MailOutlined,
  WhatsAppOutlined,
  HeartFilled,
} from "@ant-design/icons";
import { NAV_LINKS, SITE_META } from "../../constants";

// ------------------------------------------------------------
// Footer nav sections
// ------------------------------------------------------------
const FOOTER_SECTIONS = [
  {
    title: "Navigation",
    links: NAV_LINKS.map((link) => ({
      label: link.label,
      href: link.href,
      scroll: true,
    })),
  },
  {
    title: "Projects",
    links: [
      { label: "All Projects", href: "/projects", scroll: false },
      { label: "AI & SaaS", href: "/projects?category=ai-saas", scroll: false },
      {
        label: "Full-Stack Apps",
        href: "/projects?category=fullstack",
        scroll: false,
      },
      { label: "ERP & POS", href: "/projects?category=erp-pos", scroll: false },
    ],
  },
  {
    title: "Contact",
    links: [
      {
        label: SITE_META.email,
        href: `mailto:${SITE_META.email}`,
        scroll: false,
      },
      {
        label: SITE_META.phone,
        href: `https://wa.me/923407615594`,
        scroll: false,
      },
      //   { label: "LinkedIn", href: SITE_META.linkedin, scroll: false },
      //   { label: "GitHub", href: SITE_META.github, scroll: false },
    ],
  },
];

// ------------------------------------------------------------
// Social icon links
// ------------------------------------------------------------
const SOCIAL_LINKS = [
  {
    icon: <LinkedinOutlined />,
    href: "https://www.linkedin.com/in/waleed-an-02204a316/",
    label: "LinkedIn",
  },
  {
    icon: <MailOutlined />,
    href: `mailto:${SITE_META.email}`,
    label: "Email",
  },
  {
    icon: <WhatsAppOutlined />,
    href: `https://wa.me/923407615594`,
    label: "WhatsApp",
  },
];

// ------------------------------------------------------------
// Footer Component
// ------------------------------------------------------------
export default function Footer() {
  const currentYear = new Date().getFullYear();

  // ----------------------------------------------------------
  // Smooth scroll for anchor links
  // ----------------------------------------------------------
  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    scroll: boolean,
  ) => {
    if (!scroll || !href.startsWith("#")) return;
    e.preventDefault();
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // ----------------------------------------------------------
  // Render
  // ----------------------------------------------------------
  return (
    <footer
      style={{
        background: "var(--text-primary)", // #1E1B4B dark
        color: "#fff",
        paddingTop: "4rem",
      }}
    >
      <div
        style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem" }}
      >
        {/* -------------------------------------------------- */}
        {/* Top grid: Brand + Nav sections                      */}
        {/* -------------------------------------------------- */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "2.5rem",
            paddingBottom: "3rem",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {/* ---- Brand column ---- */}
          <div style={{ gridColumn: "span 1" }}>
            {/* Logo mark */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                marginBottom: "1rem",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  borderRadius: "11px",
                  background: "var(--accent)",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  fontFamily: "var(--font-body)",
                  letterSpacing: "-0.5px",
                  flexShrink: 0,
                }}
              >
                WA
              </span>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  color: "#fff",
                  letterSpacing: "-0.3px",
                }}
              >
                Waleed AN
              </span>
            </div>

            {/* Tagline */}
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                fontWeight: 400,
                color: "rgba(255,255,255,0.55)",
                lineHeight: 1.7,
                margin: "0 0 1.5rem",
                maxWidth: "240px",
              }}
            >
              Full-Stack SaaS Developer & AI Integrator.based in Faisalabad,
              Punjab Pakistan.
            </p>

            {/* Social icons */}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  //   target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "36px",
                    height: "36px",
                    borderRadius: "9px",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.65)",
                    fontSize: "1rem",
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = "var(--accent)";
                    el.style.borderColor = "var(--accent)";
                    el.style.color = "#fff";
                    el.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = "rgba(255,255,255,0.08)";
                    el.style.borderColor = "rgba(255,255,255,0.1)";
                    el.style.color = "rgba(255,255,255,0.65)";
                    el.style.transform = "translateY(0)";
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ---- Nav section columns ---- */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h4
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.4)",
                  letterSpacing: "1.2px",
                  textTransform: "uppercase",
                  margin: "0 0 1rem",
                }}
              >
                {section.title}
              </h4>

              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.6rem",
                }}
              >
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.scroll ? (
                      <a
                        href={link.href}
                        onClick={(e) =>
                          handleAnchorClick(e, link.href, link.scroll)
                        }
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          color: "rgba(255,255,255,0.6)",
                          textDecoration: "none",
                          transition: "color 0.2s",
                          letterSpacing: "-0.1px",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLAnchorElement).style.color =
                            "#fff";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLAnchorElement).style.color =
                            "rgba(255,255,255,0.6)";
                        }}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        target={
                          link.href.startsWith("http") ||
                          link.href.startsWith("mailto") ||
                          link.href.startsWith("https://wa")
                            ? "_blank"
                            : undefined
                        }
                        rel="noopener noreferrer"
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          color: "rgba(255,255,255,0.6)",
                          textDecoration: "none",
                          transition: "color 0.2s",
                          letterSpacing: "-0.1px",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLAnchorElement).style.color =
                            "#fff";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLAnchorElement).style.color =
                            "rgba(255,255,255,0.6)";
                        }}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* -------------------------------------------------- */}
        {/* Bottom bar — copyright + admin link                 */}
        {/* -------------------------------------------------- */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem",
            padding: "1.5rem 0",
          }}
        >
          {/* Copyright */}
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8rem",
              fontWeight: 400,
              color: "rgba(255,255,255,0.35)",
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              flexWrap: "wrap",
            }}
          >
            © {currentYear} Waleed AN.
            <HeartFilled
              style={{ color: "var(--accent)", fontSize: "0.75rem" }}
            />
          </p>
        </div>
      </div>
    </footer>
  );
}
