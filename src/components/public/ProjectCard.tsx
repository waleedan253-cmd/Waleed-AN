"use client";

// ============================================================
// WALEED AN Portfolio — ProjectCard Component
// Reusable card for displaying a single project publicly
// ============================================================

import { useState } from "react";
import Image from "next/image";
import { Tag, Badge } from "antd";
import {
  GithubOutlined,
  LinkOutlined,
  CalendarOutlined,
  StarFilled,
} from "@ant-design/icons";
import type { Project } from "../../types";
import { CATEGORY_LABELS } from "../../constants";

// ------------------------------------------------------------
// Props
// ------------------------------------------------------------
interface ProjectCardProps {
  project: Project;
  featured?: boolean; // larger card variant for homepage
}

// ------------------------------------------------------------
// ProjectCard Component
// ------------------------------------------------------------
export default function ProjectCard({
  project,
  featured = false,
}: ProjectCardProps) {
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);

  // ----------------------------------------------------------
  // Format published date → "Jan 2025"
  // ----------------------------------------------------------
  const formattedDate = project.published_date
    ? new Date(project.published_date).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : null;

  // ----------------------------------------------------------
  // Category label from constants
  // ----------------------------------------------------------
  const categoryLabel = CATEGORY_LABELS[project.category] ?? project.category;

  // ----------------------------------------------------------
  // Render
  // ----------------------------------------------------------
  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        border: `1px solid ${hovered ? "var(--accent-light)" : "#e2e8f0"}`,
        borderRadius: "16px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.25s ease",
        boxShadow: hovered
          ? "0 8px 32px rgba(124,58,237,0.12)"
          : "0 1px 6px rgba(0,0,0,0.05)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        height: "100%",
        cursor: "default",
      }}
    >
      {/* ---------------------------------------------------- */}
      {/* Project Image                                         */}
      {/* ---------------------------------------------------- */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: featured ? "220px" : "180px",
          overflow: "hidden",
          flexShrink: 0,
          background: "var(--accent-light)",
        }}
      >
        {project.image_url && !imgError ? (
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{
              objectFit: "cover",
              transition: "transform 0.4s ease",
              transform: hovered ? "scale(1.04)" : "scale(1)",
            }}
            onError={() => setImgError(true)}
          />
        ) : (
          /* Fallback placeholder when no image or load error */
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg, var(--accent-light), #f5f3ff)",
              gap: "0.5rem",
            }}
          >
            <span style={{ fontSize: "2.5rem" }}>🚀</span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                fontSize: "0.8rem",
                color: "var(--accent)",
                letterSpacing: "-0.2px",
              }}
            >
              {project.title}
            </span>
          </div>
        )}

        {/* Featured badge — top left */}
        {project.featured && (
          <div
            style={{
              position: "absolute",
              top: "0.75rem",
              left: "0.75rem",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              background: "rgba(124,58,237,0.9)",
              backdropFilter: "blur(8px)",
              borderRadius: "999px",
              padding: "0.25rem 0.65rem",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: "0.7rem",
              color: "#fff",
              letterSpacing: "0.3px",
            }}
          >
            <StarFilled style={{ fontSize: "0.6rem" }} />
            Featured
          </div>
        )}

        {/* Category badge — top right */}
        <div
          style={{
            position: "absolute",
            top: "0.75rem",
            right: "0.75rem",
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(8px)",
            borderRadius: "999px",
            padding: "0.25rem 0.65rem",
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            fontSize: "0.7rem",
            color: "var(--accent)",
            border: "1px solid rgba(124,58,237,0.2)",
          }}
        >
          {categoryLabel}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* Card Body                                             */}
      {/* ---------------------------------------------------- */}
      <div
        style={{
          padding: "1.25rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          gap: "0.75rem",
        }}
      >
        {/* Title */}
        <h3
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            fontSize: featured ? "1.15rem" : "1rem",
            color: "var(--text-primary)",
            letterSpacing: "-0.4px",
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          {project.title}
        </h3>

        {/* Short description */}
        <p
          style={
            {
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              fontWeight: 400,
              color: "var(--text-secondary)",
              lineHeight: 1.65,
              margin: 0,
              flex: 1,
            } as React.CSSProperties
          }
        >
          {project.short_description}
        </p>
        {/* Full description — shown if admin added one */}
        {project.description && (
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              fontWeight: 400,
              color: "var(--text-secondary)",
              lineHeight: 1.65,
              margin: 0,
              whiteSpace: "pre-wrap", // respects line breaks admin typed
            }}
          >
            {project.description}
          </p>
        )}
        {/* Tech stack tags */}
        {project.tech_stack?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
            {project.tech_stack.slice(0, 5).map((tech) => (
              <Tag
                key={tech}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  color: "var(--accent)",
                  background: "var(--accent-light)",
                  border: "none",
                  borderRadius: "5px",
                  padding: "0.15rem 0.5rem",
                  margin: 0,
                }}
              >
                {tech}
              </Tag>
            ))}
            {project.tech_stack.length > 5 && (
              <Tag
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  background: "#f1f5f9",
                  border: "none",
                  borderRadius: "5px",
                  padding: "0.15rem 0.5rem",
                  margin: 0,
                }}
              >
                +{project.tech_stack.length - 5} more
              </Tag>
            )}
          </div>
        )}

        {/* -------------------------------------------------- */}
        {/* Footer — date + action links                        */}
        {/* -------------------------------------------------- */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "0.75rem",
            borderTop: "1px solid #f1f5f9",
            marginTop: "auto",
          }}
        >
          {/* Published date */}
          {formattedDate && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "var(--text-muted)",
              }}
            >
              <CalendarOutlined style={{ fontSize: "0.75rem" }} />
              {formattedDate}
            </div>
          )}

          {/* Action buttons — GitHub + Live Demo */}
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              marginLeft: formattedDate ? "0" : "auto",
            }}
          >
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                title="View source code"
                onClick={(e) => e.stopPropagation()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: "#f8f9fa",
                  border: "1px solid #e2e8f0",
                  color: "var(--text-secondary)",
                  fontSize: "0.9rem",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = "var(--accent)";
                  el.style.borderColor = "var(--accent)";
                  el.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = "#f8f9fa";
                  el.style.borderColor = "#e2e8f0";
                  el.style.color = "var(--text-secondary)";
                }}
              >
                <GithubOutlined />
              </a>
            )}

            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                title="View live demo"
                onClick={(e) => e.stopPropagation()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  height: "32px",
                  borderRadius: "8px",
                  background: "var(--accent)",
                  border: "1px solid var(--accent)",
                  color: "#fff",
                  fontSize: "0.78rem",
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  textDecoration: "none",
                  padding: "0 0.75rem",
                  transition: "all 0.2s",
                  letterSpacing: "-0.1px",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background =
                    "var(--accent-hover)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor =
                    "var(--accent-hover)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background =
                    "var(--accent)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor =
                    "var(--accent)";
                }}
              >
                <LinkOutlined style={{ fontSize: "0.75rem" }} />
                Live link
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
