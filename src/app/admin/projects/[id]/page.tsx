"use client";

// ============================================================
// WALEED AN Portfolio — /admin/projects/[id]
// Edit project page — fetches project then passes to ProjectForm
// ============================================================

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProjectForm from "../../../../components/admin/ProjectForm";
import type { Project } from "../../../../types";

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // ----------------------------------------------------------
  // Fetch the project by ID on mount
  // ----------------------------------------------------------
  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${id}`);
        const data = await res.json();

        if (!data.success || !data.data) {
          setError(true);
          return;
        }

        setProject(data.data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  // ----------------------------------------------------------
  // Loading state
  // ----------------------------------------------------------
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          flexDirection: "column",
          gap: "1rem",
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
          }}
        />
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            color: "var(--text-muted)",
            margin: 0,
          }}
        >
          Loading project...
        </p>
        <style jsx global>{`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  // ----------------------------------------------------------
  // Error / not found state
  // ----------------------------------------------------------
  if (error || !project) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          gap: "1rem",
          textAlign: "center",
        }}
      >
        <span style={{ fontSize: "3rem" }}>⚠️</span>
        <h2
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            fontSize: "1.2rem",
            color: "var(--text-primary)",
            letterSpacing: "-0.4px",
            margin: 0,
          }}
        >
          Project Not Found
        </h2>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            color: "var(--text-muted)",
            margin: 0,
          }}
        >
          The project you&apos;re looking for doesn&apos;t exist or was deleted.
        </p>
        <button
          onClick={() => router.push("/admin/dashboard")}
          style={{
            background: "var(--accent)",
            border: "none",
            borderRadius: "10px",
            padding: "0.6rem 1.5rem",
            color: "#fff",
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            fontSize: "0.875rem",
            cursor: "pointer",
            marginTop: "0.5rem",
          }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // ----------------------------------------------------------
  // Render form with fetched project data
  // ----------------------------------------------------------
  return <ProjectForm mode="edit" project={project} />;
}
