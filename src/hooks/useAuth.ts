// ============================================================
// WALEED AN Portfolio — useAuth Hook
// Manages admin authentication state via Supabase Auth
// Used by: admin layout (guard), login page, dashboard
// ============================================================

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, signInAdmin, signOutAdmin } from "../lib/supabase/client";
import type { AuthState } from "../types";

// ------------------------------------------------------------
// HOOK: useAuth — Core authentication state
// Returns current user, loading state, login/logout actions
// ------------------------------------------------------------
export function useAuth() {
  const router = useRouter();

  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    isAuthenticated: false,
  });

  // ----------------------------------------------------------
  // Listen to Supabase auth state changes
  // Fires on: login, logout, token refresh, tab focus
  // ----------------------------------------------------------
  useEffect(() => {
    // Get initial session on mount
    supabase.auth.getSession().then(({ data }) => {
      const session = data.session;
      setState({
        user: session?.user
          ? {
              id: session.user.id,
              email: session.user.email ?? "",
              created_at: session.user.created_at,
            }
          : null,
        loading: false,
        isAuthenticated: !!session?.user,
      });
    });

    // Subscribe to future auth changes (login/logout/refresh)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        setState({
          user: session?.user
            ? {
                id: session.user.id,
                email: session.user.email ?? "",
                created_at: session.user.created_at,
              }
            : null,
          loading: false,
          isAuthenticated: !!session?.user,
        });
      },
    );

    // Cleanup subscription on unmount
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // ----------------------------------------------------------
  // LOGIN — Used by admin login page
  // ----------------------------------------------------------
  const login = useCallback(
    async (
      email: string,
      password: string,
    ): Promise<{ success: boolean; error?: string }> => {
      setState((prev) => ({ ...prev, loading: true }));

      try {
        const { session, error } = await signInAdmin(email, password);

        if (error) {
          setState((prev) => ({ ...prev, loading: false }));
          return {
            success: false,
            error: error.message || "Invalid email or password",
          };
        }

        if (!session) {
          setState((prev) => ({ ...prev, loading: false }));
          return { success: false, error: "Login failed — no session created" };
        }

        // Auth state change listener above will update state automatically
        // Just redirect to dashboard
        router.push("/admin/dashboard");
        return { success: true };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Login failed";
        setState((prev) => ({ ...prev, loading: false }));
        return { success: false, error: msg };
      }
    },
    [router],
  );

  // ----------------------------------------------------------
  // LOGOUT — Used by admin sidebar
  // ----------------------------------------------------------
  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      await signOutAdmin();
      router.push("/admin"); // Redirect to login page
    } catch (err) {
      console.error("Logout error:", err);
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [router]);

  return {
    ...state, // user, loading, isAuthenticated
    login,
    logout,
  };
}

// ------------------------------------------------------------
// HOOK: useRequireAuth — Protects admin pages
// Redirects to login if not authenticated
// Use this at the top of every admin page/layout
// ------------------------------------------------------------
export function useRequireAuth() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for loading to finish before checking
    if (auth.loading) return;

    // Not authenticated → redirect to login
    if (!auth.isAuthenticated) {
      router.replace("/admin"); // replace: no back-button to dashboard
    }
  }, [auth.loading, auth.isAuthenticated, router]);

  return auth;
}

// ------------------------------------------------------------
// HOOK: useRedirectIfAuth — For login page only
// If already logged in → go straight to dashboard
// Prevents admin from seeing login page when already in session
// ------------------------------------------------------------
export function useRedirectIfAuth() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.loading) return;

    // Already logged in → skip login page
    if (auth.isAuthenticated) {
      router.replace("/admin/dashboard");
    }
  }, [auth.loading, auth.isAuthenticated, router]);

  return auth;
}
