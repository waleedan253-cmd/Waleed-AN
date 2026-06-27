"use client";

// ============================================================
// WALEED AN Portfolio — Admin Dashboard
// Project management: list, publish toggle, delete, edit links
// ============================================================

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button, Switch, Tag, Modal, Input } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  SearchOutlined,
  StarOutlined,
  StarFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useAdminProjects } from "../../../hooks/useProjects";
import { CATEGORY_LABELS } from "../../../constants";
import toast from "react-hot-toast";
import type { Project } from "../../../types";

// ------------------------------------------------------------
// Stat card component
// ------------------------------------------------------------
function StatCard({
  label,
  value,
  icon,
  accent = false,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      style={{
        background: accent ? "var(--accent)" : "#fff",
        border: `1px solid ${accent ? "var(--accent)" : "#e2e8f0"}`,
        borderRadius: "14px",
        padding: "1.25rem 1.5rem",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
      }}
    >
      <span
        style={{
          fontSize: "1.4rem",
          color: accent ? "#fff" : "var(--accent)",
          background: accent ? "rgba(255,255,255,0.2)" : "var(--accent-light)",
          width: "44px",
          height: "44px",
          borderRadius: "11px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </span>
      <div>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 800,
            fontSize: "1.6rem",
            color: accent ? "#fff" : "var(--text-primary)",
            letterSpacing: "-1px",
            lineHeight: 1,
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.78rem",
            fontWeight: 500,
            color: accent ? "rgba(255,255,255,0.75)" : "var(--text-muted)",
            marginTop: "0.2rem",
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// Dashboard Component
// ------------------------------------------------------------
export default function DashboardPage() {
  const {
    projects,
    loading,
    error,
    deleteProject,
    togglePublished,
    toggleFeatured,
  } = useAdminProjects();

  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // ----------------------------------------------------------
  // Filtered projects by search
  // ----------------------------------------------------------
  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.short_description?.toLowerCase().includes(search.toLowerCase()),
  );

  // ----------------------------------------------------------
  // Stats
  // ----------------------------------------------------------
  const totalProjects = projects.length;
  const publishedCount = projects.filter((p) => p.published).length;
  const featuredCount = projects.filter((p) => p.featured).length;
  const draftCount = projects.filter((p) => !p.published).length;

  // ----------------------------------------------------------
  // Delete with confirmation
  // ----------------------------------------------------------
  const confirmDelete = (project: Project) => {
    Modal.confirm({
      title: "Delete Project",
      icon: <ExclamationCircleOutlined style={{ color: "#ef4444" }} />,
      content: (
        <p style={{ fontFamily: "var(--font-body)", margin: 0 }}>
          Are you sure you want to delete <strong>{project.title}</strong>? This
          will also remove its image from storage. This action cannot be undone.
        </p>
      ),
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      okButtonProps: {
        style: {
          background: "#ef4444",
          borderColor: "#ef4444",
          fontFamily: "var(--font-body)",
          fontWeight: 600,
          borderRadius: "8px",
        },
      },
      cancelButtonProps: {
        style: {
          fontFamily: "var(--font-body)",
          borderRadius: "8px",
        },
      },
      onOk: async () => {
        setDeletingId(project.id);
        const result = await deleteProject(project.id);
        if (result.success) {
          toast.success(`"${project.title}" deleted`);
        } else {
          toast.error(result.error ?? "Failed to delete project");
        }
        setDeletingId(null);
      },
    });
  };

  // ----------------------------------------------------------
  // Toggle published
  // ----------------------------------------------------------
  const handleTogglePublished = async (project: Project) => {
    setTogglingId(project.id);
    const result = await togglePublished(project.id, project.published);
    if (result.success) {
      toast.success(
        project.published
          ? `"${project.title}" unpublished`
          : `"${project.title}" published`,
      );
    } else {
      toast.error(result.error ?? "Failed to update");
    }
    setTogglingId(null);
  };

  // ----------------------------------------------------------
  // Toggle featured
  // ----------------------------------------------------------
  const handleToggleFeatured = async (project: Project) => {
    const result = await toggleFeatured(project.id, project.featured);
    if (result.success) {
      toast.success(
        project.featured ? "Removed from featured" : "Marked as featured",
      );
    } else {
      toast.error(result.error ?? "Failed to update");
    }
  };

  // ----------------------------------------------------------
  // Render
  // ----------------------------------------------------------
  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      {/* ---------------------------------------------------- */}
      {/* Page Header                                           */}
      {/* ---------------------------------------------------- */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 800,
              fontSize: "clamp(1.4rem, 3vw, 1.8rem)",
              color: "var(--text-primary)",
              letterSpacing: "-0.8px",
              margin: "0 0 0.25rem",
            }}
          >
            Projects Dashboard
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              color: "var(--text-muted)",
              margin: 0,
            }}
          >
            Manage your portfolio projects
          </p>
        </div>

        <Link href="/admin/projects/new">
          <Button
            icon={<PlusOutlined />}
            size="large"
            style={{
              background: "var(--accent)",
              borderColor: "var(--accent)",
              color: "#fff",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              borderRadius: "10px",
              height: "44px",
              letterSpacing: "-0.2px",
            }}
          >
            Add Project
          </Button>
        </Link>
      </div>

      {/* ---------------------------------------------------- */}
      {/* Stats row                                             */}
      {/* ---------------------------------------------------- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <StatCard
          label="Total Projects"
          value={totalProjects}
          icon="📁"
          accent
        />
        <StatCard
          label="Published"
          value={publishedCount}
          icon={<EyeOutlined />}
        />
        <StatCard
          label="Drafts"
          value={draftCount}
          icon={<EyeInvisibleOutlined />}
        />
        <StatCard
          label="Featured"
          value={featuredCount}
          icon={<StarFilled />}
        />
      </div>

      {/* ---------------------------------------------------- */}
      {/* Search                                               */}
      {/* ---------------------------------------------------- */}
      <div style={{ marginBottom: "1.5rem" }}>
        <Input
          prefix={<SearchOutlined style={{ color: "var(--text-muted)" }} />}
          placeholder="Search projects by title or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          style={{
            maxWidth: "400px",
            borderRadius: "10px",
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            height: "42px",
            borderColor: "#e2e8f0",
          }}
        />
      </div>

      {/* ---------------------------------------------------- */}
      {/* Loading                                              */}
      {/* ---------------------------------------------------- */}
      {loading && (
        <div
          style={{
            textAlign: "center",
            padding: "4rem",
            color: "var(--text-muted)",
            fontFamily: "var(--font-body)",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "3px solid var(--accent-light)",
              borderTop: "3px solid var(--accent)",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 1rem",
            }}
          />
          Loading projects...
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* Error                                                */}
      {/* ---------------------------------------------------- */}
      {error && !loading && (
        <div
          style={{
            textAlign: "center",
            padding: "4rem",
            fontFamily: "var(--font-body)",
            color: "#ef4444",
          }}
        >
          ⚠️ Failed to load projects. Please refresh.
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* Projects Table                                        */}
      {/* ---------------------------------------------------- */}
      {!loading && !error && (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
          }}
        >
          {/* Table header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
              gap: "1rem",
              padding: "0.75rem 1.5rem",
              background: "#f8f9fa",
              borderBottom: "1px solid #e2e8f0",
              fontFamily: "var(--font-body)",
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.8px",
            }}
            className="table-header"
          >
            <span>Project</span>
            <span>Category</span>
            <span>Published</span>
            <span>Featured</span>
            <span>Actions</span>
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div
              style={{
                padding: "4rem 1.5rem",
                textAlign: "center",
                fontFamily: "var(--font-body)",
                color: "var(--text-muted)",
                fontSize: "0.9rem",
              }}
            >
              {search
                ? `No projects match "${search}"`
                : "No projects yet — add your first one!"}
            </div>
          )}

          {/* Project rows */}
          {filtered.map((project, index) => (
            <div
              key={project.id}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
                gap: "1rem",
                padding: "1rem 1.5rem",
                borderBottom:
                  index < filtered.length - 1 ? "1px solid #f1f5f9" : "none",
                alignItems: "center",
                transition: "background 0.15s",
              }}
              className="table-row"
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLDivElement).style.background =
                  "#fafafa")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLDivElement).style.background = "#fff")
              }
            >
              {/* Project info */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  minWidth: 0,
                }}
              >
                {/* Thumbnail */}
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    flexShrink: 0,
                    background: "var(--accent-light)",
                    position: "relative",
                  }}
                >
                  {project.image_url ? (
                    <Image
                      src={project.image_url}
                      alt={project.title}
                      fill
                      sizes="44px"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.2rem",
                      }}
                    >
                      🚀
                    </div>
                  )}
                </div>

                {/* Title + description */}
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      color: "var(--text-primary)",
                      letterSpacing: "-0.2px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {project.title}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      marginTop: "0.1rem",
                    }}
                  >
                    {project.short_description}
                  </div>
                </div>
              </div>

              {/* Category */}
              <Tag
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  color: "var(--accent)",
                  background: "var(--accent-light)",
                  border: "none",
                  borderRadius: "6px",
                  padding: "0.2rem 0.5rem",
                  width: "fit-content",
                }}
              >
                {CATEGORY_LABELS[project.category] ?? project.category}
              </Tag>

              {/* Published toggle */}
              <Switch
                checked={project.published}
                loading={togglingId === project.id}
                onChange={() => handleTogglePublished(project)}
                style={{
                  background: project.published ? "var(--accent)" : undefined,
                  width: "fit-content",
                }}
                checkedChildren={<EyeOutlined />}
                unCheckedChildren={<EyeInvisibleOutlined />}
              />

              {/* Featured toggle */}
              <button
                onClick={() => handleToggleFeatured(project)}
                title={
                  project.featured ? "Remove from featured" : "Mark as featured"
                }
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                  color: project.featured ? "#F59E0B" : "#e2e8f0",
                  padding: "0.2rem",
                  transition: "color 0.2s",
                  display: "flex",
                  alignItems: "center",
                }}
                onMouseEnter={(e) => {
                  if (!project.featured)
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#F59E0B";
                }}
                onMouseLeave={(e) => {
                  if (!project.featured)
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#e2e8f0";
                }}
              >
                {project.featured ? <StarFilled /> : <StarOutlined />}
              </button>

              {/* Actions */}
              <div
                style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}
              >
                {/* Edit */}
                <Link href={`/admin/projects/${project.id}`}>
                  <button
                    title="Edit project"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: "var(--accent-light)",
                      border: "none",
                      color: "var(--accent)",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.background = "var(--accent)";
                      el.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.background = "var(--accent-light)";
                      el.style.color = "var(--accent)";
                    }}
                  >
                    <EditOutlined />
                  </button>
                </Link>

                {/* Delete */}
                <button
                  onClick={() => confirmDelete(project)}
                  title="Delete project"
                  disabled={deletingId === project.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "#FEF2F2",
                    border: "none",
                    color: "#ef4444",
                    cursor:
                      deletingId === project.id ? "not-allowed" : "pointer",
                    fontSize: "0.9rem",
                    transition: "all 0.2s",
                    opacity: deletingId === project.id ? 0.6 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (deletingId !== project.id) {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.background = "#ef4444";
                      el.style.color = "#fff";
                    }
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.background = "#FEF2F2";
                    el.style.color = "#ef4444";
                  }}
                >
                  <DeleteOutlined />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Spin keyframe */}
      <style jsx global>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        @media (max-width: 640px) {
          .table-header {
            display: none !important;
          }
          .table-row {
            grid-template-columns: 1fr auto !important;
          }
        }
      `}</style>
    </div>
  );
}
