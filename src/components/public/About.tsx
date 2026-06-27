"use client";

// ============================================================
// WALEED AN Portfolio — About Section
// Story, skills grid, experience timeline — from real resume
// ============================================================

import { useEffect, useRef } from "react";
import { Tag } from "antd";
import {
  CodeOutlined,
  RobotOutlined,
  DatabaseOutlined,
  CloudOutlined,
  ToolOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import { SKILLS, EXPERIENCES } from "../../constants";

// ------------------------------------------------------------
// Skill category icons mapping
// ------------------------------------------------------------
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Frontend: <CodeOutlined />,
  "AI & LLM": <RobotOutlined />,
  Backend: <DatabaseOutlined />,
  "DevOps & Cloud": <CloudOutlined />,
  Tools: <ToolOutlined />,
  "Soft Skills": <TeamOutlined />,
};

// ------------------------------------------------------------
// useAnimateOnScroll — adds .visible class when in viewport
// ------------------------------------------------------------
function useAnimateOnScroll(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
}

// ------------------------------------------------------------
// AnimatedSection wrapper — reusable scroll-reveal
// ------------------------------------------------------------
function AnimatedSection({
  children,
  delay = 0,
  style = {},
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useAnimateOnScroll(ref);

  return (
    <div
      ref={ref}
      className="animate-on-scroll"
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </div>
  );
}

// ------------------------------------------------------------
// About Component
// ------------------------------------------------------------
export default function About() {
  return (
    <section
      id="about"
      style={{
        padding: "6rem 1.5rem",
        background: "#FAFAFA",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* -------------------------------------------------- */}
        {/* Section Header                                      */}
        {/* -------------------------------------------------- */}
        <AnimatedSection style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span
            style={{
              display: "inline-block",
              fontFamily: "var(--font-body)",
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "var(--accent)",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              marginBottom: "0.75rem",
            }}
          >
            About Me
          </span>
          <h2
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 800,
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              color: "var(--text-primary)",
              letterSpacing: "-1px",
              margin: "0 0 1rem",
            }}
          >
            Developer. Builder. AI Integrator.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              fontWeight: 400,
              color: "var(--text-secondary)",
              maxWidth: "540px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            From Faisalabad to the frontier of AI-powered software — here&apos;s
            my story.
          </p>
        </AnimatedSection>

        {/* -------------------------------------------------- */}
        {/* Two-column layout: Story | Skills                  */}
        {/* -------------------------------------------------- */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "3rem",
            marginBottom: "5rem",
            alignItems: "start",
          }}
        >
          {/* ---- Left: Story ---- */}
          <AnimatedSection delay={100}>
            <h3
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                fontSize: "1.2rem",
                color: "var(--text-primary)",
                letterSpacing: "-0.4px",
                marginBottom: "1.25rem",
              }}
            >
              My Story
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.95rem",
                fontWeight: 400,
                color: "var(--text-secondary)",
                lineHeight: 1.75,
              }}
            >
              <p style={{ margin: 0 }}>
                I started my journey building enterprise systems ERP and POS
                solutions for real businesses. That foundation taught me how to
                build software that actually works under pressure, not just in
                demos.
              </p>
              <p style={{ margin: 0 }}>
                The shift to AI came naturally. I integrated my first LLM into a
                SaaS product and never looked back. Today I build products like{" "}
                <strong
                  style={{ color: "var(--text-primary)", fontWeight: 600 }}
                >
                  SahiScreen
                </strong>{" "}
                (AI screen analysis),{" "}
                <strong
                  style={{ color: "var(--text-primary)", fontWeight: 600 }}
                >
                  PromptMinds AI
                </strong>{" "}
                (prompt engineering platform), and{" "}
                <strong
                  style={{ color: "var(--text-primary)", fontWeight: 600 }}
                >
                  PakMentor AI
                </strong>{" "}
                all shipped, all real.
              </p>
              <p style={{ margin: 0 }}>
                I work with{" "}
                <span style={{ color: "var(--accent)", fontWeight: 600 }}>
                  Next.js
                </span>
                ,{" "}
                <span style={{ color: "var(--accent)", fontWeight: 600 }}>
                  TypeScript
                </span>
                ,{" "}
                <span style={{ color: "var(--accent)", fontWeight: 600 }}>
                  Supabase
                </span>
                , and LLM APIs (Claude, Grok, OpenAI). My goal: turn an idea
                into a live, scalable product — fast.
              </p>
            </div>

            {/* Quick facts */}
            <div
              style={{
                marginTop: "2rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem",
              }}
            >
              {[
                {
                  icon: <EnvironmentOutlined />,
                  text: "Based in Faisalabad, Pakistan",
                },
                {
                  icon: <GlobalOutlined />,
                  text: "Available for remote work globally",
                },
                { icon: <MailOutlined />, text: "waleedancoding@gmail.com" },
                { icon: <WhatsAppOutlined />, text: "+92 340-7615594" },
              ].map((fact) => (
                <div
                  key={fact.text}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "var(--text-secondary)",
                  }}
                >
                  <span style={{ fontSize: "1rem" }}>{fact.icon}</span>
                  {fact.text}
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* ---- Right: Skills ---- */}
          <AnimatedSection delay={200}>
            <h3
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                fontSize: "1.2rem",
                color: "var(--text-primary)",
                letterSpacing: "-0.4px",
                marginBottom: "1.25rem",
              }}
            >
              Skills & Technologies
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              {SKILLS.map((group) => (
                <div key={group.category}>
                  {/* Category label + icon */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      marginBottom: "0.5rem",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      color: "var(--accent)",
                      textTransform: "uppercase",
                      letterSpacing: "0.8px",
                    }}
                  >
                    {CATEGORY_ICONS[group.category] ?? <CodeOutlined />}
                    {group.category}
                  </div>

                  {/* Skill tags */}
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}
                  >
                    {group.items.map((skill) => (
                      <Tag
                        key={skill}
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          color: "var(--text-primary)",
                          background: "#fff",
                          border: "1px solid #e2e8f0",
                          borderRadius: "6px",
                          padding: "0.2rem 0.6rem",
                          margin: 0,
                          letterSpacing: "-0.1px",
                        }}
                      >
                        {skill}
                      </Tag>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>

        {/* -------------------------------------------------- */}
        {/* Experience Timeline                                 */}
        {/* -------------------------------------------------- */}
        <AnimatedSection delay={150}>
          <h3
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: "1.4rem",
              color: "var(--text-primary)",
              letterSpacing: "-0.5px",
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            Work Experience
          </h3>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              position: "relative",
            }}
          >
            {/* Vertical timeline line */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "19px",
                top: "12px",
                bottom: "12px",
                width: "2px",
                background:
                  "linear-gradient(to bottom, var(--accent), var(--accent-light))",
                borderRadius: "2px",
              }}
            />

            {EXPERIENCES.map((exp, index) => (
              <AnimatedSection key={exp.company} delay={index * 80}>
                <div
                  style={{
                    display: "flex",
                    gap: "1.25rem",
                    alignItems: "flex-start",
                  }}
                >
                  {/* Timeline dot */}
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: index === 0 ? "var(--accent)" : "#fff",
                      border: `2px solid ${index === 0 ? "var(--accent)" : "#e2e8f0"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontSize: "1rem",
                      zIndex: 1,
                      boxShadow:
                        index === 0
                          ? "0 0 0 4px rgba(124,58,237,0.15)"
                          : "none",
                    }}
                  >
                    {/* {exp.logo ? (
                      <span style={{ fontSize: "1rem" }}>{exp.logo}</span>
                    ) : (
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontWeight: 700,
                          fontSize: "0.65rem",
                          color: index === 0 ? "#fff" : "var(--accent)",
                        }}
                      >
                        {exp.company.slice(0, 2).toUpperCase()}
                      </span>
                    )} */}
                  </div>

                  {/* Experience card */}
                  <div
                    style={{
                      flex: 1,
                      background: "#fff",
                      border: `1px solid ${index === 0 ? "var(--accent-light)" : "#e2e8f0"}`,
                      borderRadius: "12px",
                      padding: "1.25rem 1.5rem",
                      boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
                    }}
                  >
                    {/* Header row */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontFamily: "var(--font-body)",
                            fontWeight: 700,
                            fontSize: "1rem",
                            color: "var(--text-primary)",
                            letterSpacing: "-0.3px",
                          }}
                        >
                          {exp.role}
                        </div>
                        <div
                          style={{
                            fontFamily: "var(--font-body)",
                            fontWeight: 600,
                            fontSize: "0.85rem",
                            color: "var(--accent)",
                            marginTop: "0.1rem",
                          }}
                        >
                          {exp.company}
                        </div>
                      </div>

                      {/* Duration badge */}
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.75rem",
                          fontWeight: 500,
                          color: "var(--text-muted)",
                          background: "#f8f9fa",
                          border: "1px solid #e2e8f0",
                          borderRadius: "999px",
                          padding: "0.2rem 0.7rem",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {exp.period}
                      </span>
                    </div>

                    {/* Tech tags */}
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.35rem",
                      }}
                    >
                      <ul
                        style={{
                          margin: "0 0 0.75rem",
                          paddingLeft: "1.1rem",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.35rem",
                        }}
                      >
                        {exp.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: "0.875rem",
                              fontWeight: 400,
                              color: "var(--text-secondary)",
                              lineHeight: 1.65,
                            }}
                          >
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
