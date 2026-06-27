"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase/client";
import type { Project } from "../../types";

interface ProjectTableProps {
  projects: Project[];
}

function StatusBadge({ status }: { status: string }) {
  const published = status === "published";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "3px 10px",
        borderRadius: "20px",
        fontSize: "0.72rem",
        fontWeight: 600,
        background: published ? "#DCFCE7" : "#F3F4F6",
        color: published ? "#16A34A" : "#6B7280",
        border: `1px solid ${published ? "#BBF7D0" : "#E5E7EB"}`,
      }}
    >
      <span
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: published ? "#16A34A" : "#9CA3AF",
          display: "inline-block",
        }}
      />
      {published ? "Published" : "Draft"}
    </span>
  );
}

export default function ProjectTable({ projects }: ProjectTableProps) {
  const router = useRouter();

  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [localProjects, setLocalProjects] = useState<Project[]>(projects);

  // ✅ handleToggleStatus — standalone function
  const handleToggleStatus = async (project: Project) => {
    setToggling(project.id);
    const newPublished = !project.published;

    // Optimistic update
    setLocalProjects((prev) =>
      prev.map((p) =>
        p.id === project.id ? { ...p, published: newPublished } : p,
      ),
    );

    const { error } = await (supabase as any)
      .from("projects")
      .update({ published: newPublished })
      .eq("id", project.id);

    if (error) {
      // Rollback on error
      setLocalProjects((prev) =>
        prev.map((p) =>
          p.id === project.id ? { ...p, published: project.published } : p,
        ),
      );
    }

    setToggling(null);
    router.refresh();
  };

  // ✅ handleDelete — standalone function
  const handleDelete = async (id: string) => {
    setDeleting(id);
    setDeleteConfirm(null);

    setLocalProjects((prev) => prev.filter((p) => p.id !== id));

    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      setLocalProjects(projects); // Rollback
    }

    setDeleting(null);
    router.refresh();
  };

  // ✅ Empty state — in component body
  if (localProjects.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "60px 20px",
          background: "#fff",
          borderRadius: "12px",
          border: "1px solid #F0EEF8",
        }}
      >
        <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>📂</div>
        <h3 style={{ color: "#1E1B4B", marginBottom: "8px", fontWeight: 600 }}>
          No projects yet
        </h3>
        <p
          style={{
            color: "#6B7280",
            fontSize: "0.875rem",
            marginBottom: "20px",
          }}
        >
          Add your first project to get started
        </p>
        <Link
          href="/admin/projects/new"
          style={{
            display: "inline-block",
            padding: "10px 20px",
            background: "linear-gradient(135deg, #7C3AED, #2563EB)",
            color: "#fff",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "0.875rem",
          }}
        >
          + Add Project
        </Link>
      </div>
    );
  }

  // ✅ Main return — in component body
  return (
    <>
      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "28px",
              width: "min(400px, 90vw)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: "1.5rem", marginBottom: "12px" }}>🗑️</div>
            <h3
              style={{ color: "#1E1B4B", marginBottom: "8px", fontWeight: 700 }}
            >
              Delete project?
            </h3>
            <p
              style={{
                color: "#6B7280",
                fontSize: "0.875rem",
                marginBottom: "24px",
              }}
            >
              This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={!!deleting}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "#EF4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 600,
                  cursor: deleting ? "wait" : "pointer",
                  fontSize: "0.875rem",
                }}
              >
                {deleting ? "Deleting..." : "Yes, delete"}
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "#F3F4F6",
                  color: "#374151",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 500,
                  cursor: "pointer",
                  fontSize: "0.875rem",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          border: "1px solid #F0EEF8",
          overflow: "hidden",
        }}
      >
        {/* Table header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 120px",
            padding: "12px 20px",
            background: "#F8F7FF",
            borderBottom: "1px solid #EDE9FE",
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "#6B7280",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          <span>Project</span>
          <span>Category</span>
          <span>Status</span>
          <span style={{ textAlign: "right" }}>Actions</span>
        </div>

        {/* Rows */}
        {localProjects.map((project, i) => (
          <div
            key={project.id}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 120px",
              padding: "14px 20px",
              alignItems: "center",
              borderBottom:
                i < localProjects.length - 1 ? "1px solid #F3F4F6" : "none",
              transition: "background 0.1s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.background = "#FAFAFE";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.background =
                "transparent";
            }}
          >
            {/* Title + tech */}
            <div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={{
                    fontWeight: 600,
                    color: "#1E1B4B",
                    fontSize: "0.9rem",
                  }}
                >
                  {project.title}
                </span>
                {project.featured && (
                  <span
                    style={{
                      fontSize: "0.65rem",
                      background: "#FEF9C3",
                      color: "#92400E",
                      border: "1px solid #FDE68A",
                      borderRadius: "20px",
                      padding: "1px 7px",
                      fontWeight: 600,
                    }}
                  >
                    ★ Featured
                  </span>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "4px",
                  flexWrap: "wrap",
                  marginTop: "4px",
                }}
              >
                {project.tech_stack?.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: "0.68rem",
                      color: "#7C3AED",
                      background: "#F3F0FF",
                      borderRadius: "4px",
                      padding: "1px 6px",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Category */}
            <span style={{ color: "#6B7280", fontSize: "0.85rem" }}>
              {project.category ?? "—"}
            </span>

            {/* Status */}
            <StatusBadge status={project.published ? "published" : "draft"} />

            {/* Actions */}
            <div
              style={{
                display: "flex",
                gap: "6px",
                justifyContent: "flex-end",
              }}
            >
              {/* Toggle publish */}
              <button
                onClick={() => handleToggleStatus(project)}
                disabled={toggling === project.id}
                title={project.published ? "Unpublish" : "Publish"}
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "6px",
                  border: "1px solid #E5E7EB",
                  background: "#fff",
                  cursor: toggling === project.id ? "wait" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.85rem",
                }}
              >
                {project.published ? "👁️" : "🚀"}
              </button>

              {/* Edit */}
              <Link
                href={`/admin/projects/${project.id}`}
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "6px",
                  border: "1px solid #E5E7EB",
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.85rem",
                  textDecoration: "none",
                }}
              >
                ✏️
              </Link>

              {/* Delete */}
              <button
                onClick={() => setDeleteConfirm(project.id)}
                disabled={deleting === project.id}
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "6px",
                  border: "1px solid #E5E7EB",
                  background: "#fff",
                  cursor: deleting === project.id ? "wait" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.85rem",
                }}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
