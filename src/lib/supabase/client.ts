// ============================================================
// WALEED AN Portfolio — Supabase Clients
// ============================================================

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types"; // ✅ Direct — no barrel

// ------------------------------------------------------------
// ENV VALIDATION
// ------------------------------------------------------------
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) throw new Error("Missing env: NEXT_PUBLIC_SUPABASE_URL");
if (!supabaseAnonKey)
  throw new Error("Missing env: NEXT_PUBLIC_SUPABASE_ANON_KEY");

// ------------------------------------------------------------
// BROWSER CLIENT — singleton
// ------------------------------------------------------------
let browserClient: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseBrowserClient() {
  if (browserClient) return browserClient;

  browserClient = createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return browserClient;
}

export const supabase = getSupabaseBrowserClient();

// ------------------------------------------------------------
// SERVER CLIENT
// ------------------------------------------------------------
export function getSupabaseServerClient() {
  if (!supabaseServiceKey) {
    throw new Error("Missing env: SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient<Database>(supabaseUrl!, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// ------------------------------------------------------------
// STORAGE HELPERS
// ------------------------------------------------------------
export const STORAGE_BUCKET = "project-images";

export function getImagePublicUrl(path: string): string {
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadProjectImage(
  file: File,
  projectId: string,
): Promise<{ url: string; path: string; error?: string }> {
  const ext = file.name.split(".").pop();
  const path = `${projectId}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: true });

  if (error) return { url: "", path: "", error: error.message };

  return { url: getImagePublicUrl(path), path };
}

export async function deleteProjectImage(path: string): Promise<void> {
  await supabase.storage.from(STORAGE_BUCKET).remove([path]);
}

// ------------------------------------------------------------
// AUTH HELPERS
// ------------------------------------------------------------
export async function signInAdmin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { session: data.session, user: data.user, error };
}

export async function signOutAdmin() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
}
