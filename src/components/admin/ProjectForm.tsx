"use client";

// ============================================================
// WALEED AN Portfolio — ProjectForm Component
// Shared form for both Add New and Edit Project pages
// ============================================================

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input, Select, Switch, Button, Tag } from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  GithubOutlined,
  LinkOutlined,
  CalendarOutlined,
  TagOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import {
  getSupabaseBrowserClient,
  uploadProjectImage,
} from "../../lib/supabase/client";
import { CATEGORY_LABELS } from "../../constants";
import toast from "react-hot-toast";
import type { Project, CreateProjectInput, ProjectCategory } from "../../types";

const { TextArea } = Input;

// ------------------------------------------------------------
// Props — form works in two modes
// ------------------------------------------------------------
interface ProjectFormProps {
  mode: "create" | "edit";
  project?: Project; // provided in edit mode
}

// ------------------------------------------------------------
// Category options for Select
// ------------------------------------------------------------
const CATEGORY_OPTIONS = (
  Object.entries(CATEGORY_LABELS) as [ProjectCategory | "all", string][]
)
  .filter(([key]) => key !== "all")
  .map(([value, label]) => ({ value, label }));

// ------------------------------------------------------------
// Empty form state
// ------------------------------------------------------------
const EMPTY_FORM: CreateProjectInput = {
  title: "",
  short_description: "",
  description: "",
  category: "ai-saas",
  tech_stack: [],
  image_url: "",
  github_url: "",
  live_url: "",
  published_date: "",
  published: false,
  featured: false,
};

// ------------------------------------------------------------
// Form validation
// ------------------------------------------------------------
type FormErrors = Partial<Record<keyof CreateProjectInput, string>>;

function validateForm(data: CreateProjectInput): FormErrors {
  const errors: FormErrors = {};

  if (!data.title.trim()) errors.title = "Project title is required";
  else if (data.title.trim().length > 100)
    errors.title = "Title too long (max 100 chars)";

  if (!data.short_description.trim())
    errors.short_description = "Short description is required";
  else if (data.short_description.trim().length > 160)
    errors.short_description = `${data.short_description.length}/160 — too long`;

  if (!data.category) errors.category = "Please select a category";

  if (data.github_url && !/^https?:\/\/.+/.test(data.github_url))
    errors.github_url = "Must be a valid URL starting with http(s)://";

  if (data.live_url && !/^https?:\/\/.+/.test(data.live_url))
    errors.live_url = "Must be a valid URL starting with http(s)://";

  return errors;
}

// ------------------------------------------------------------
// ProjectForm Component
// ------------------------------------------------------------
export default function ProjectForm({ mode, project }: ProjectFormProps) {
  const router = useRouter();

  // ----------------------------------------------------------
  // Form state — pre-filled in edit mode
  // ----------------------------------------------------------
  const [form, setForm] = useState<CreateProjectInput>(() => {
    if (mode === "edit" && project) {
      return {
        title: project.title,
        short_description: project.short_description,
        description: project.description ?? "",
        category: project.category,
        tech_stack: project.tech_stack ?? [],
        image_url: project.image_url ?? "",
        github_url: project.github_url ?? "",
        live_url: project.live_url ?? "",
        published_date: project.published_date ?? "",
        published: project.published,
        featured: project.featured,
      };
    }
    return EMPTY_FORM;
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [techInput, setTechInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string>(
    project?.image_url ?? "",
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ----------------------------------------------------------
  // Field change helper — clears error on change
  // ----------------------------------------------------------
  const handleChange = <K extends keyof CreateProjectInput>(
    field: K,
    value: CreateProjectInput[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // ----------------------------------------------------------
  // Tech stack tag management
  // ----------------------------------------------------------
  const addTech = () => {
    const tag = techInput.trim();
    if (!tag || form.tech_stack.includes(tag)) {
      setTechInput("");
      return;
    }
    handleChange("tech_stack", [...form.tech_stack, tag]);
    setTechInput("");
  };

  const removeTech = (tag: string) => {
    handleChange(
      "tech_stack",
      form.tech_stack.filter((t) => t !== tag),
    );
  };

  const handleTechKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTech();
    }
  };

  // ----------------------------------------------------------
  // Image upload to Supabase Storage
  // ----------------------------------------------------------
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size — max 3MB
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Image too large. Max size is 3MB.");
      return;
    }

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);
    setUploading(true);

    try {
      const projectId =
        mode === "edit" && project ? project.id : crypto.randomUUID();
      const result = await uploadProjectImage(file, projectId);

      if (result.error || !result.url) {
        toast.error("Image upload failed. Please try again.");
        setImagePreview(form.image_url);
        return;
      }

      handleChange("image_url", result.url);
      setImagePreview(result.url);
      toast.success("Image uploaded successfully");
    } catch {
      toast.error("Image upload failed.");
      setImagePreview(form.image_url);
    } finally {
      setUploading(false);
      // Reset file input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ----------------------------------------------------------
  // Remove image
  // ----------------------------------------------------------
  const removeImage = () => {
    handleChange("image_url", "");
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ----------------------------------------------------------
  // Submit — create or update
  // ----------------------------------------------------------
  const handleSubmit = async () => {
    // Validate
    const errs = validateForm(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error("Please fix the errors before saving");
      return;
    }

    setSaving(true);
    const supabase = getSupabaseBrowserClient();

    try {
      if (mode === "create") {
        // POST to API route
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();

        if (!data.success) {
          toast.error(data.error ?? "Failed to create project");
          setSaving(false);
          return;
        }

        toast.success(`"${form.title}" created successfully!`);
        router.push("/admin/dashboard");
      } else if (mode === "edit" && project) {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const token = session?.access_token;
        // PUT to API route
        const res = await fetch(`/api/projects/${project.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(form),
        });
        const data = await res.json();

        if (!data.success) {
          toast.error(data.error ?? "Failed to update project");
          setSaving(false);
          return;
        }

        toast.success(`"${form.title}" updated successfully!`);
        router.push("/admin/dashboard");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
      setSaving(false);
    }
  };

  // ----------------------------------------------------------
  // Input style helper
  // ----------------------------------------------------------
  const inputStyle = (
    field: keyof CreateProjectInput,
  ): React.CSSProperties => ({
    borderRadius: "10px",
    fontFamily: "var(--font-body)",
    fontSize: "0.9rem",
    borderColor: errors[field] ? "#ef4444" : "#e2e8f0",
  });

  const ErrorMsg = ({ field }: { field: keyof CreateProjectInput }) =>
    errors[field] ? (
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.75rem",
          color: "#ef4444",
          margin: "0.3rem 0 0",
        }}
      >
        {errors[field]}
      </p>
    ) : null;

  // ----------------------------------------------------------
  // Render
  // ----------------------------------------------------------
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      {/* ---------------------------------------------------- */}
      {/* Page header                                           */}
      {/* ---------------------------------------------------- */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "2rem",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => router.push("/admin/dashboard")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            background: "none",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            padding: "0.5rem 0.9rem",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            fontSize: "0.82rem",
            color: "var(--text-secondary)",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.borderColor = "var(--accent)";
            el.style.color = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.borderColor = "#e2e8f0";
            el.style.color = "var(--text-secondary)";
          }}
        >
          <ArrowLeftOutlined style={{ fontSize: "0.75rem" }} />
          Dashboard
        </button>

        <div>
          <h1
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 800,
              fontSize: "clamp(1.3rem, 3vw, 1.7rem)",
              color: "var(--text-primary)",
              letterSpacing: "-0.6px",
              margin: 0,
            }}
          >
            {mode === "create" ? "Add New Project" : `Edit: ${project?.title}`}
          </h1>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* Form card                                             */}
      {/* ---------------------------------------------------- */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: "20px",
          padding: "2rem",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {/* ---- Title ---- */}
          <div>
            <label
              style={{
                display: "block",
                fontFamily: "var(--font-body)",
                fontSize: "0.82rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: "0.4rem",
              }}
            >
              Project Title <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <Input
              placeholder="e.g. SahiScreen — AI Screen Analysis Tool"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              status={errors.title ? "error" : ""}
              style={{ ...inputStyle("title"), height: "44px" }}
            />
            <ErrorMsg field="title" />
          </div>

          {/* ---- Short Description ---- */}
          <div>
            <label
              style={{
                display: "block",
                fontFamily: "var(--font-body)",
                fontSize: "0.82rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: "0.4rem",
              }}
            >
              Short Description <span style={{ color: "#ef4444" }}>*</span>
              <span
                style={{
                  fontWeight: 400,
                  color: "var(--text-muted)",
                  marginLeft: "0.5rem",
                }}
              >
                ({form.short_description.length}/160)
              </span>
            </label>
            <Input
              placeholder="One sentence that describes what this project does"
              value={form.short_description}
              onChange={(e) =>
                handleChange("short_description", e.target.value)
              }
              maxLength={160}
              status={errors.short_description ? "error" : ""}
              style={{ ...inputStyle("short_description"), height: "44px" }}
            />
            <ErrorMsg field="short_description" />
          </div>

          {/* ---- Full Description ---- */}
          <div>
            <label
              style={{
                display: "block",
                fontFamily: "var(--font-body)",
                fontSize: "0.82rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: "0.4rem",
              }}
            >
              Full Description
              <span
                style={{
                  fontWeight: 400,
                  color: "var(--text-muted)",
                  marginLeft: "0.5rem",
                }}
              >
                (optional — markdown supported)
              </span>
            </label>
            <TextArea
              placeholder="Describe the project in detail — what problem it solves, how it works, key features..."
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={5}
              style={{
                ...inputStyle("description"),
                resize: "vertical",
                lineHeight: 1.65,
              }}
            />
          </div>

          {/* ---- Category + Date row ---- */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            {/* Category */}
            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "0.4rem",
                }}
              >
                Category <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <Select
                value={form.category}
                onChange={(val) => handleChange("category", val)}
                options={CATEGORY_OPTIONS}
                style={{ width: "100%", fontFamily: "var(--font-body)" }}
                status={errors.category ? "error" : ""}
                styles={{ popup: { root: { fontFamily: "var(--font-body)" } } }}
              />
              <ErrorMsg field="category" />
            </div>

            {/* Published Date */}
            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "0.4rem",
                }}
              >
                <CalendarOutlined
                  style={{ marginRight: "0.3rem", color: "var(--accent)" }}
                />
                Published Date
              </label>
              <Input
                type="date"
                value={form.published_date}
                onChange={(e) => handleChange("published_date", e.target.value)}
                style={{ ...inputStyle("published_date"), height: "44px" }}
              />
            </div>
          </div>

          {/* ---- Tech Stack ---- */}
          <div>
            <label
              style={{
                display: "block",
                fontFamily: "var(--font-body)",
                fontSize: "0.82rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: "0.4rem",
              }}
            >
              <TagOutlined
                style={{ marginRight: "0.3rem", color: "var(--accent)" }}
              />
              Tech Stack
              <span
                style={{
                  fontWeight: 400,
                  color: "var(--text-muted)",
                  marginLeft: "0.5rem",
                }}
              >
                (press Enter or comma to add)
              </span>
            </label>

            {/* Tag chips */}
            {form.tech_stack.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.4rem",
                  marginBottom: "0.6rem",
                }}
              >
                {form.tech_stack.map((tag) => (
                  <Tag
                    key={tag}
                    closable
                    onClose={() => removeTech(tag)}
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: "var(--accent)",
                      background: "var(--accent-light)",
                      border: "none",
                      borderRadius: "6px",
                      padding: "0.2rem 0.5rem",
                    }}
                  >
                    {tag}
                  </Tag>
                ))}
              </div>
            )}

            {/* Tech input */}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Input
                placeholder="e.g. Next.js, Supabase, Claude API"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={handleTechKeyDown}
                style={{ ...inputStyle("tech_stack"), height: "40px", flex: 1 }}
              />
              <Button
                onClick={addTech}
                icon={<PlusOutlined />}
                disabled={!techInput.trim()}
                style={{
                  borderRadius: "10px",
                  borderColor: "var(--accent)",
                  color: "var(--accent)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  height: "40px",
                }}
              >
                Add
              </Button>
            </div>
          </div>

          {/* ---- URLs row ---- */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            {/* GitHub URL */}
            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "0.4rem",
                }}
              >
                <GithubOutlined style={{ marginRight: "0.3rem" }} />
                GitHub URL
              </label>
              <Input
                placeholder="https://github.com/..."
                value={form.github_url ?? ""}
                onChange={(e) => handleChange("github_url", e.target.value)}
                status={errors.github_url ? "error" : ""}
                style={{ ...inputStyle("github_url"), height: "44px" }}
              />
              <ErrorMsg field="github_url" />
            </div>

            {/* Live URL */}
            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "0.4rem",
                }}
              >
                <LinkOutlined style={{ marginRight: "0.3rem" }} />
                Live Demo URL
              </label>
              <Input
                placeholder="https://your-project.vercel.app"
                value={form.live_url ?? ""}
                onChange={(e) => handleChange("live_url", e.target.value)}
                status={errors.live_url ? "error" : ""}
                style={{ ...inputStyle("live_url"), height: "44px" }}
              />
              <ErrorMsg field="live_url" />
            </div>
          </div>

          {/* ---- Image Upload ---- */}
          <div>
            <label
              style={{
                display: "block",
                fontFamily: "var(--font-body)",
                fontSize: "0.82rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: "0.4rem",
              }}
            >
              Project Image
              <span
                style={{
                  fontWeight: 400,
                  color: "var(--text-muted)",
                  marginLeft: "0.5rem",
                }}
              >
                (max 3MB, JPG/PNG/WebP)
              </span>
            </label>

            {/* Image preview */}
            {imagePreview ? (
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "200px",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "1px solid #e2e8f0",
                  marginBottom: "0.75rem",
                }}
              >
                <Image
                  src={imagePreview}
                  alt="Project preview"
                  fill
                  sizes="800px"
                  style={{ objectFit: "cover" }}
                />
                <button
                  onClick={removeImage}
                  style={{
                    position: "absolute",
                    top: "0.75rem",
                    right: "0.75rem",
                    background: "rgba(239,68,68,0.9)",
                    border: "none",
                    borderRadius: "8px",
                    padding: "0.4rem 0.6rem",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <DeleteOutlined /> Remove
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: "2px dashed #e2e8f0",
                  borderRadius: "12px",
                  padding: "2.5rem 1.5rem",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  marginBottom: "0.75rem",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "var(--accent)";
                  el.style.background = "var(--accent-light)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "#e2e8f0";
                  el.style.background = "transparent";
                }}
              >
                <UploadOutlined
                  style={{
                    fontSize: "2rem",
                    color: "var(--accent)",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                />
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    margin: "0 0 0.25rem",
                    fontSize: "0.9rem",
                  }}
                >
                  Click to upload image
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.78rem",
                    color: "var(--text-muted)",
                    margin: 0,
                  }}
                >
                  JPG, PNG, WebP — max 3MB
                </p>
              </div>
            )}

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />

            {uploading && (
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8rem",
                  color: "var(--accent)",
                  margin: "0.3rem 0 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <span
                  style={{
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    border: "2px solid var(--accent-light)",
                    borderTop: "2px solid var(--accent)",
                    animation: "spin 0.8s linear infinite",
                    display: "inline-block",
                  }}
                />
                Uploading to Supabase Storage...
              </p>
            )}
          </div>

          {/* ---- Publish & Featured toggles ---- */}
          <div
            style={{
              display: "flex",
              gap: "2rem",
              flexWrap: "wrap",
              padding: "1.25rem 1.5rem",
              background: "#f8f9fa",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
            }}
          >
            {/* Published */}
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            >
              <Switch
                checked={form.published}
                onChange={(val) => handleChange("published", val)}
                style={{
                  background: form.published ? "var(--accent)" : undefined,
                }}
                checkedChildren={<EyeOutlined />}
                unCheckedChildren={<EyeInvisibleOutlined />}
              />
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    color: "var(--text-primary)",
                  }}
                >
                  Published
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                  }}
                >
                  {form.published
                    ? "Visible to visitors"
                    : "Hidden — draft mode"}
                </div>
              </div>
            </div>

            {/* Featured */}
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            >
              <Switch
                checked={form.featured}
                onChange={(val) => handleChange("featured", val)}
                style={{ background: form.featured ? "#F59E0B" : undefined }}
              />
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    color: "var(--text-primary)",
                  }}
                >
                  Featured
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                  }}
                >
                  {form.featured
                    ? "Shown on homepage spotlight"
                    : "Not in homepage spotlight"}
                </div>
              </div>
            </div>
          </div>

          {/* ---- Submit button ---- */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "0.75rem",
              paddingTop: "0.5rem",
            }}
          >
            <Button
              onClick={() => router.push("/admin/dashboard")}
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                borderRadius: "10px",
                height: "44px",
                borderColor: "#e2e8f0",
                color: "var(--text-secondary)",
              }}
            >
              Cancel
            </Button>

            <Button
              onClick={handleSubmit}
              loading={saving}
              icon={<SaveOutlined />}
              style={{
                background: "var(--accent)",
                borderColor: "var(--accent)",
                color: "#fff",
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                fontSize: "0.9rem",
                borderRadius: "10px",
                height: "44px",
                padding: "0 1.75rem",
                letterSpacing: "-0.2px",
                boxShadow: "0 4px 16px rgba(124,58,237,0.25)",
              }}
            >
              {saving
                ? mode === "create"
                  ? "Creating..."
                  : "Saving..."
                : mode === "create"
                  ? "Create Project"
                  : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>

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
