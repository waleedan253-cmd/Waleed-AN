"use client";

// ============================================================
// WALEED AN Portfolio — Projects Section
// Filterable grid with category tabs, search, and skeleton loading
// ============================================================

import { useState, useRef, useEffect } from "react";
import { Input, Empty, Spin } from "antd";
import {
  SearchOutlined,
  AppstoreOutlined,
  RobotOutlined,
  ThunderboltOutlined,
  CodeOutlined,
  ShopOutlined,
  ApiOutlined,
} from "@ant-design/icons";
import ProjectCard from "./ProjectCard";
import { useProjects } from "../../hooks/useProjects";
import { CATEGORY_LABELS } from "../../constants";
import type { ProjectCategory } from "../../types";

// ------------------------------------------------------------
// Category filter tabs (all + your 5 categories)
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
// Skeleton card — shown while loading
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
      {/* Image placeholder */}
      <div className="skeleton" style={{ width: "100%", height: "180px" }} />
      <div
        style={{
          padding: "1.25rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        {/* Title */}
        <div
          className="skeleton"
          style={{ height: "20px", width: "70%", borderRadius: "6px" }}
        />
        {/* Description lines */}
        <div
          className="skeleton"
          style={{ height: "14px", width: "100%", borderRadius: "4px" }}
        />
        <div
          className="skeleton"
          style={{ height: "14px", width: "85%", borderRadius: "4px" }}
        />
        <div
          className="skeleton"
          style={{ height: "14px", width: "60%", borderRadius: "4px" }}
        />
        {/* Tags */}
        <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.25rem" }}>
          {[60, 80, 70].map((w) => (
            <div
              key={w}
              className="skeleton"
              style={{ height: "22px", width: `${w}px`, borderRadius: "5px" }}
            />
          ))}
        </div>
        {/* Footer */}
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
// ProjectsSection Component
// ------------------------------------------------------------
export default function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | "all">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const sectionRef = useRef<HTMLDivElement>(null);

  // ----------------------------------------------------------
  // Debounce search input — wait 400ms before filtering
  // ----------------------------------------------------------
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ----------------------------------------------------------
  // Fetch projects with active filters
  // ----------------------------------------------------------
  const { projects, loading, error } = useProjects({
    category: activeCategory,
    search: debouncedQuery || undefined,
  });

  // ----------------------------------------------------------
  // Scroll section into view on category change
  // ----------------------------------------------------------
  const handleCategoryChange = (key: ProjectCategory | "all") => {
    setActiveCategory(key);
  };

  // ----------------------------------------------------------
  // Render
  // ----------------------------------------------------------
  return (
    <section
      id="projects"
      ref={sectionRef}
      style={{
        padding: "6rem 1.5rem",
        background: "#fff",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* -------------------------------------------------- */}
        {/* Section Header                                      */}
        {/* -------------------------------------------------- */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
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
            My Work
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
            Projects & Products
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              fontWeight: 400,
              color: "var(--text-secondary)",
              maxWidth: "520px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Shipped SaaS products, AI integrations, and full-stack applications
            — all built and deployed in production.
          </p>
        </div>

        {/* -------------------------------------------------- */}
        {/* Filters — category tabs + search                    */}
        {/* -------------------------------------------------- */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            marginBottom: "2.5rem",
            alignItems: "center",
          }}
        >
          {/* Category tabs */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.4rem",
              justifyContent: "center",
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
                    color: isActive ? "var(--accent)" : "var(--text-secondary)",
                    transition: "all 0.18s",
                    boxShadow: isActive ? "0 1px 4px rgba(0,0,0,0.07)" : "none",
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

          {/* Search input */}
          <Input
            prefix={<SearchOutlined style={{ color: "var(--text-muted)" }} />}
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            allowClear
            style={{
              maxWidth: "320px",
              borderRadius: "10px",
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              height: "40px",
              borderColor: "#e2e8f0",
            }}
          />
        </div>

        {/* -------------------------------------------------- */}
        {/* Results count                                        */}
        {/* -------------------------------------------------- */}
        {!loading && !error && (
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.82rem",
              fontWeight: 500,
              color: "var(--text-muted)",
              marginBottom: "1.5rem",
              textAlign: "center",
            }}
          >
            {projects.length === 0
              ? "No projects found"
              : `${projects.length} project${projects.length !== 1 ? "s" : ""} found`}
            {debouncedQuery && ` for "${debouncedQuery}"`}
          </div>
        )}

        {/* -------------------------------------------------- */}
        {/* Loading skeletons                                   */}
        {/* -------------------------------------------------- */}
        {loading && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* -------------------------------------------------- */}
        {/* Error state                                         */}
        {/* -------------------------------------------------- */}
        {error && !loading && (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 1rem",
              fontFamily: "var(--font-body)",
              color: "var(--text-muted)",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>⚠️</div>
            <p style={{ margin: 0, fontSize: "0.95rem" }}>
              Could not load projects. Please try refreshing.
            </p>
          </div>
        )}

        {/* -------------------------------------------------- */}
        {/* Empty state                                         */}
        {/* -------------------------------------------------- */}
        {!loading && !error && projects.length === 0 && (
          <div style={{ padding: "4rem 1rem" }}>
            <Empty
              image={
                <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>
                  <AppstoreOutlined
                    style={{ color: "#e2e8f0", fontSize: "3rem" }}
                  />
                </div>
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
                    : "No projects in this category yet"}
                </span>
              }
            />
          </div>
        )}

        {/* -------------------------------------------------- */}
        {/* Projects Grid                                       */}
        {/* -------------------------------------------------- */}
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
                className="animate-on-scroll visible"
                style={{
                  animationDelay: `${index * 60}ms`,
                  height: "100%",
                }}
              >
                <ProjectCard project={project} featured={project.featured} />
              </div>
            ))}
          </div>
        )}

        {/* -------------------------------------------------- */}
        {/* Bottom CTA — link to full projects page             */}
        {/* -------------------------------------------------- */}
        {!loading && projects.length > 0 && (
          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <a
              href="/projects"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "var(--accent)",
                textDecoration: "none",
                padding: "0.6rem 1.25rem",
                borderRadius: "10px",
                border: "1px solid var(--accent-light)",
                background: "var(--accent-light)",
                transition: "all 0.2s",
                letterSpacing: "-0.1px",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = "var(--accent)";
                el.style.color = "#fff";
                el.style.borderColor = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = "var(--accent-light)";
                el.style.color = "var(--accent)";
                el.style.borderColor = "var(--accent-light)";
              }}
            >
              View All Projects →
            </a>
          </div>
        )}
      </div>

      {/* -------------------------------------------------------- */}
      {/* Skeleton shimmer animation                               */}
      {/* -------------------------------------------------------- */}
      <style jsx global>{`
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
    </section>
  );
}
