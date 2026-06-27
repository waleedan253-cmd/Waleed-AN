// ============================================================
// WALEED AN Portfolio — Supabase Clients
// ============================================================
// Two separate clients:
// 1. Browser client  → used in React components & hooks
// 2. Server client   → used in API routes (serverless functions)
// ============================================================

import { createClient } from "@supabase/supabase-js";

// ------------------------------------------------------------
// ENV VALIDATION — Fail fast with clear error messages
// ------------------------------------------------------------
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing env: NEXT_PUBLIC_SUPABASE_URL");
}
if (!supabaseAnonKey) {
  throw new Error("Missing env: NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

// ------------------------------------------------------------
// DATABASE TYPES
// Mirrors your schema.sql tables exactly
// ------------------------------------------------------------
export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          title: string;
          description: string;
          short_description: string;
          image_url: string;
          live_url: string | null;
          github_url: string | null;
          tech_stack: string[];
          category: string;
          published: boolean;
          featured: boolean;
          published_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          short_description: string;
          image_url?: string;
          live_url?: string | null;
          github_url?: string | null;
          tech_stack?: string[];
          category?: string;
          published?: boolean;
          featured?: boolean;
          published_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          short_description?: string;
          image_url?: string;
          live_url?: string | null;
          github_url?: string | null;
          tech_stack?: string[];
          category?: string;
          published?: boolean;
          featured?: boolean;
          published_date?: string;
          updated_at?: string;
        };
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          budget: string | null;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          budget?: string | null;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          read?: boolean;
        };
      };
    };
  };
};

// ------------------------------------------------------------
// BROWSER CLIENT
// Used in: React components, custom hooks, client-side code
// Uses: anon key (safe to expose — RLS protects the data)
// Singleton pattern: one instance reused across the app
// ------------------------------------------------------------
let browserClient: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseBrowserClient() {
  if (browserClient) return browserClient; // reuse existing

  browserClient = createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      persistSession: true, // Keep admin logged in
      autoRefreshToken: true, // Auto-refresh JWT
      detectSessionInUrl: true, // Handle OAuth redirects
    },
  });

  return browserClient;
}

// Shorthand alias — most files use this
export const supabase = getSupabaseBrowserClient();

// ------------------------------------------------------------
// SERVER CLIENT
// Used in: API routes (app/api/...)
// Uses: service role key (NEVER expose to browser)
// Bypasses RLS → full DB access for admin operations
// ------------------------------------------------------------
export function getSupabaseServerClient() {
  if (!supabaseServiceKey) {
    throw new Error("Missing env: SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient<Database>(supabaseUrl!, supabaseServiceKey, {
    auth: {
      persistSession: false, // No session needed server-side
      autoRefreshToken: false,
    },
  });
}

// ------------------------------------------------------------
// STORAGE HELPERS — Project image uploads
// ------------------------------------------------------------
export const STORAGE_BUCKET = "project-images";

// Build public URL for any stored image
export function getImagePublicUrl(path: string): string {
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// Upload a project image → returns public URL
export async function uploadProjectImage(
  file: File,
  projectId: string,
): Promise<{ url: string; path: string; error?: string }> {
  // Create unique file path: project-images/projectId/filename
  const ext = file.name.split(".").pop();
  const path = `${projectId}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true, // Overwrite if exists
    });

  if (error) {
    return { url: "", path: "", error: error.message };
  }

  const url = getImagePublicUrl(path);
  return { url, path };
}

// Delete a project image from storage
export async function deleteProjectImage(path: string): Promise<void> {
  await supabase.storage.from(STORAGE_BUCKET).remove([path]);
}

// ------------------------------------------------------------
// AUTH HELPERS
// ------------------------------------------------------------

// Sign in admin with email + password
export async function signInAdmin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { session: data.session, user: data.user, error };
}

// Sign out admin
export async function signOutAdmin() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

// Get current session (for auth guards)
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
}
