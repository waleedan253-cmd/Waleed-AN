// ============================================================
// WALEED AN — Portfolio TypeScript Interfaces
// ============================================================

// ------------------------------------------------------------
// PROJECT — Core data model (stored in Supabase)
// ------------------------------------------------------------
import type { Database } from "../lib/supabase/client";

export interface Project {
  id: string; // UUID from Supabase
  title: string; // Project name
  description: string; // Full description
  short_description: string; // Card preview (max 120 chars)
  image_url: string; // Supabase Storage public URL
  live_url?: string | null; // Optional live link
  github_url?: string | null; // Optional GitHub link
  tech_stack: string[]; // ['Next.js', 'Claude API', ...]
  category: ProjectCategory; // For filtering
  published: boolean; // Draft vs live
  featured: boolean; // Show on homepage
  published_date: string; // ISO date string
  created_at: string; // Auto by Supabase
  updated_at: string; // Auto by Supabase
}

// Project categories matching Waleed's actual work
export type ProjectCategory =
  | "ai-saas" // AI-powered SaaS products
  | "fullstack" // Full-stack web apps
  | "frontend" // UI/UX focused
  | "erp-pos" // ERP / POS systems
  | "api-integration"; // API & backend work

// For creating a new project (no auto fields yet)
export type CreateProjectInput = Omit<
  Project,
  "id" | "created_at" | "updated_at"
>;

// For updating (all fields optional except id)
export type UpdateProjectInput = Partial<CreateProjectInput> & {
  id: string;
};

// ------------------------------------------------------------
// AI ASSISTANT — Chat between visitor and Waleed's AI
// ------------------------------------------------------------
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface AssistantRequest {
  message: string;
  history: ChatMessage[]; // Conversation context
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
  budget?: string; // Optional for client inquiries
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

// Generic API response wrapper
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

// For project list page filters
export interface ProjectFilters {
  category?: ProjectCategory | "all";
  featured?: boolean;
  search?: string;
}

// Image upload response from Supabase Storage
export interface UploadResult {
  url: string;
  path: string;
  error?: string;
}

// Navbar link shape
export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

// Skill item for About section
export interface Skill {
  name: string;
  category: SkillCategory;
  icon?: string;
}

export type SkillCategory = "frontend" | "backend" | "ai-llm" | "tools";

// Timeline item for experience section
export interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  type: "remote" | "onsite";
  bullets: string[];
  current?: boolean;
}
