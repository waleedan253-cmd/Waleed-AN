// ============================================================
// WALEED AN — Portfolio TypeScript Interfaces
// ============================================================
// ✅ Import Database ONLY from its single source
// ✅ Never define or re-export Database here
// ============================================================

import type { Database } from "../lib/supabase/types";

// ------------------------------------------------------------
// DERIVED SUPABASE TYPES
// ------------------------------------------------------------
export type UpdateProjectInput =
  Database["public"]["Tables"]["projects"]["Update"];

// ------------------------------------------------------------
// PROJECT
// -------------------------------------- ----------------------
export interface Project {
  id: string;
  title: string;
  description: string;
  short_description: string;
  image_url: string;
  live_url?: string | null;
  github_url?: string | null;
  tech_stack: string[];
  category: ProjectCategory;
  published: boolean;
  featured: boolean;
  published_date: string;
  created_at: string;
  updated_at: string;
}

export type ProjectCategory =
  | "ai-saas"
  | "fullstack"
  | "frontend"
  | "erp-pos"
  | "api-integration";

export type CreateProjectInput = Omit<
  Project,
  "id" | "created_at" | "updated_at"
>;
// ------------------------------------------------------------
// AI ASSISTANT
// ------------------------------------------------------------
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface AssistantRequest {
  message: string;
  history: ChatMessage[];
}

export interface AssistantResponse {
  reply: string;
  success: boolean;
  error?: string;
}

// ------------------------------------------------------------
// CONTACT FORM
// ------------------------------------------------------------
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  budget?: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

// ------------------------------------------------------------
// ADMIN AUTH
// ------------------------------------------------------------
export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
}

export interface AuthState {
  user: AdminUser | null;
  loading: boolean;
  isAuthenticated: boolean;
}

// ------------------------------------------------------------
// UI STATE TYPES
// ------------------------------------------------------------
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface ProjectFilters {
  category?: ProjectCategory | "all";
  featured?: boolean;
  search?: string;
}

export interface UploadResult {
  url: string;
  path: string;
  error?: string;
}

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface Skill {
  name: string;
  category: SkillCategory;
  icon?: string;
}

export type SkillCategory = "frontend" | "backend" | "ai-llm" | "tools";

export interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  type: "remote" | "onsite";
  bullets: string[];
  current?: boolean;
}
