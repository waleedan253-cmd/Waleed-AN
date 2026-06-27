"use client";

// ============================================================
// WALEED AN Portfolio — /projects page
// Full standalone projects page with filtering, search, and grid
// ============================================================

import { useState, useEffect } from "react";
import { Input, Empty } from "antd";
import {
  SearchOutlined,
  AppstoreOutlined,
  ArrowLeftOutlined,
  RobotOutlined,
  ThunderboltOutlined,
  CodeOutlined,
  ShopOutlined,
  ApiOutlined,
} from "@ant-design/icons";
import Link from "next/link";

import AIAssistant from "../../components/public/AIAssistant";
import ProjectCard from "../../components/public/ProjectCard";
import { useProjects } from "../../hooks/useProjects";
import { CATEGORY_LABELS } from "../../constants";
import type { ProjectCategory } from "../../types";

// ------------------------------------------------------------
// Filter tabs
// ------------------------------------------------------------
const FILTER_TABS: {
  key: ProjectCategory | "all";
  label: string;
  icon: React.ReactNode;
}[] = [
  { key: "all", label: "All Projects", icon: <AppstoreOutlined /> },
  { key: "ai-saas", label: "AI SaaS", icon: <RobotOutlined /> },
  { key: "fullstack", label: "Full-Stack", icon: <ThunderboltOutlined /> },
  { key: "frontend", label: "Frontend", icon: <CodeOutlined /> },
  { key: "erp-pos", label: "ERP / POS", icon: <ShopOutlined /> },
  { key: "api-integration", label: "API Integration", icon: <ApiOutlined /> },
];

// ------------------------------------------------------------
// Skeleton card for loading state
// ------------------------------------------------------------
function SkeletonCard() {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        overflow: "hidden",
      }}
    >
      <div className="skeleton" style={{ width: "100%", height: "180px" }} />
      <div
        style={{
          padding: "1.25rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        <div
          className="skeleton"
          style={{ height: "20px", width: "70%", borderRadius: "6px" }}
        />
        <div
          className="skeleton"
          style={{ height: "14px", width: "100%", borderRadius: "4px" }}
        />
        <div
          className="skeleton"
          style={{ height: "14px", width: "80%", borderRadius: "4px" }}
        />
        <div style={{ display: "flex", gap: "0.4rem" }}>
          {[60, 80, 65].map((w) => (
            <div
              key={w}
              className="skeleton"
              style={{ height: "22px", width: `${w}px`, borderRadius: "5px" }}
            />
          ))}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: "0.75rem",
            borderTop: "1px solid #f1f5f9",
          }}
        >
          <div
            className="skeleton"
            style={{ height: "16px", width: "70px", borderRadius: "4px" }}
          />
          <div
            className="skeleton"
            style={{ height: "32px", width: "90px", borderRadius: "8px" }}
          />
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// Projects Page Component
// ------------------------------------------------------------
export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | "all">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // ----------------------------------------------------------
  // Read ?category= from URL on mount
  // ----------------------------------------------------------
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category") as ProjectCategory | null;
    if (category && Object.keys(CATEGORY_LABELS).includes(category)) {
      setActiveCategory(category);
    }
  }, []);

  // ----------------------------------------------------------
  // Debounce search
  // ----------------------------------------------------------
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ----------------------------------------------------------
  // Update URL param when category changes (no page reload)
  // ----------------------------------------------------------
  const handleCategoryChange = (key: ProjectCategory | "all") => {
    setActiveCategory(key);
    const url = new URL(window.location.href);
    if (key === "all") {
      url.searchParams.delete("category");
    } else {
      url.searchParams.set("category", key);
    }
    window.history.replaceState({}, "", url.toString());
  };

  // ----------------------------------------------------------
  // Fetch projects
  // ----------------------------------------------------------
  const { projects, loading, error } = useProjects({
    category: activeCategory,
    search: debouncedQuery || undefined,
  });

  // ----------------------------------------------------------
  // Render
  // ----------------------------------------------------------
  return (
    <>
      <main style={{ minHeight: "100vh", background: "#FAFAFA" }}>
        {/* -------------------------------------------------- */}
        {/* Page Hero Header                                    */}
        {/* -------------------------------------------------- */}
        <div
          style={{
            background:
              "linear-gradient(160deg, #ffffff 0%, #f5f3ff 50%, #ede9fe 100%)",
            padding: "4rem 1.5rem 3rem",
            textAlign: "center",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          {/* Back to home */}
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.82rem",
              fontWeight: 600,
              color: "var(--accent)",
              textDecoration: "none",
              marginBottom: "1.5rem",
              opacity: 0.8,
            }}
          >
            <ArrowLeftOutlined style={{ fontSize: "0.75rem" }} />
            Back to Home
          </Link>

          <h1
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 800,
              fontSize: "clamp(2rem, 5vw, 3rem)",
              color: "var(--text-primary)",
              letterSpacing: "-1.5px",
              margin: "0 0 1rem",
            }}
          >
            All{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Projects
            </span>
          </h1>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              fontWeight: 400,
              color: "var(--text-secondary)",
              maxWidth: "480px",
              margin: "0 auto 2rem",
              lineHeight: 1.7,
            }}
          >
            Every project I have shipped — from AI SaaS products to full-stack
            applications and enterprise systems.
          </p>

          {/* Stats bar */}
          <div
            style={{
              display: "inline-flex",
              gap: "2rem",
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "0.75rem 2rem",
              boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
            }}
          >
            {[
              { value: projects.length || "—", label: "Total Projects" },
              { value: "3+", label: "AI Products" },
              { value: "1.5+", label: "Years Building" },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 800,
                    fontSize: "1.4rem",
                    color: "var(--accent)",
                    letterSpacing: "-0.5px",
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.72rem",
                    fontWeight: 500,
                    color: "var(--text-muted)",
                    marginTop: "0.2rem",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* -------------------------------------------------- */}
        {/* Filters + Grid                                      */}
        {/* -------------------------------------------------- */}
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "3rem 1.5rem",
          }}
        >
          {/* Filters row */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2rem",
            }}
          >
            {/* Category tabs */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.4rem",
                background: "#f8f9fa",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "0.35rem",
              }}
            >
              {FILTER_TABS.map((tab) => {
                const isActive = activeCategory === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => handleCategoryChange(tab.key)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      background: isActive ? "#fff" : "transparent",
                      border: isActive
                        ? "1px solid #e2e8f0"
                        : "1px solid transparent",
                      borderRadius: "8px",
                      cursor: "pointer",
                      padding: "0.4rem 0.9rem",
                      fontFamily: "var(--font-body)",
                      fontWeight: isActive ? 700 : 500,
                      fontSize: "0.82rem",
                      color: isActive
                        ? "var(--accent)"
                        : "var(--text-secondary)",
                      transition: "all 0.18s",
                      boxShadow: isActive
                        ? "0 1px 4px rgba(0,0,0,0.07)"
                        : "none",
                      whiteSpace: "nowrap",
                      letterSpacing: "-0.1px",
                    }}
                  >
                    {/* Ant Design icon */}
                    <span style={{ fontSize: "0.85rem", display: "flex" }}>
                      {tab.icon}
                    </span>
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <Input
              prefix={<SearchOutlined style={{ color: "var(--text-muted)" }} />}
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              allowClear
              style={{
                maxWidth: "260px",
                borderRadius: "10px",
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                height: "40px",
                borderColor: "#e2e8f0",
              }}
            />
          </div>

          {/* Results count */}
          {!loading && !error && (
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.82rem",
                fontWeight: 500,
                color: "var(--text-muted)",
                marginBottom: "1.5rem",
              }}
            >
              {projects.length === 0
                ? "No projects found"
                : `Showing ${projects.length} project${projects.length !== 1 ? "s" : ""}`}
              {debouncedQuery && ` for "${debouncedQuery}"`}
            </p>
          )}

          {/* Loading skeletons */}
          {loading && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div style={{ textAlign: "center", padding: "5rem 1rem" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⚠️</div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--text-muted)",
                  fontSize: "0.95rem",
                }}
              >
                Could not load projects. Please refresh the page.
              </p>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && projects.length === 0 && (
            <div style={{ padding: "5rem 1rem", textAlign: "center" }}>
              <Empty
                image={
                  <AppstoreOutlined
                    style={{ color: "#e2e8f0", fontSize: "3.5rem" }}
                  />
                }
                description={
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      color: "var(--text-muted)",
                      fontSize: "0.9rem",
                    }}
                  >
                    {debouncedQuery
                      ? `No projects match "${debouncedQuery}"`
                      : "No projects in this category yet — check back soon!"}
                  </span>
                }
              />
            </div>
          )}

          {/* Projects grid */}
          {!loading && !error && projects.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  style={{
                    opacity: 0,
                    animation: `fadeIn 0.4s ease forwards`,
                    animationDelay: `${index * 60}ms`,
                    height: "100%",
                  }}
                >
                  <ProjectCard project={project} featured={project.featured} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <AIAssistant />

      {/* Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .skeleton {
          background: linear-gradient(
            90deg,
            #f0f0f0 25%,
            #e8e8e8 50%,
            #f0f0f0 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </>
  );
}
