"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase/client";
import type { Project, ProjectFilters, ApiResponse } from "../types";

// ------------------------------------------------------------
// useProjects — Public published projects
// ------------------------------------------------------------
export function useProjects(filters?: ProjectFilters) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from("projects")
        .select("*")
        .eq("published", true)
        .order("published_date", { ascending: false });

      if (filters?.category && filters.category !== "all") {
        query = query.eq("category", filters.category);
      }
      if (filters?.featured) {
        query = query.eq("featured", true);
      }
      if (filters?.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`,
        );
      }

      const { data, error: sbError } = await query;
      if (sbError) throw sbError;
      setProjects((data as Project[]) || []);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to load projects";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [filters?.category, filters?.featured, filters?.search]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, loading, error, refetch: fetchProjects };
}

// ------------------------------------------------------------
// useFeaturedProjects — Homepage spotlight (max 3)
// ------------------------------------------------------------
export function useFeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeatured() {
      setLoading(true);
      try {
        const { data, error: sbError } = await supabase
          .from("projects")
          .select("*")
          .eq("published", true)
          .eq("featured", true)
          .order("published_date", { ascending: false })
          .limit(3);

        if (sbError) throw sbError;
        setProjects((data as Project[]) || []);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to load";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  return { projects, loading, error };
}

// ------------------------------------------------------------
// useAdminProjects — All projects for admin dashboard
// ------------------------------------------------------------
export function useAdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: sbError } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (sbError) throw sbError;
      setProjects((data as Project[]) || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ---- Delete ----
  const deleteProject = async (id: string): Promise<ApiResponse<null>> => {
    try {
      const { error: sbError } = await supabase
        .from("projects")
        .delete()
        .eq("id", id);

      if (sbError) throw sbError;
      setProjects((prev) => prev.filter((p) => p.id !== id));
      return { data: null, error: null, success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Delete failed";
      return { data: null, error: msg, success: false };
    }
  };

  // ---- Toggle Published ---- Fix: cast update payload to any
  // ---- Toggle Published ----
  const togglePublished = async (
    id: string,
    current: boolean,
  ): Promise<ApiResponse<null>> => {
    try {
      const { error: sbError } = await (supabase as any) // ← cast CLIENT not value
        .from("projects")
        .update({ published: !current })
        .eq("id", id);

      if (sbError) throw sbError;
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, published: !current } : p)),
      );
      return { data: null, error: null, success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Toggle failed";
      return { data: null, error: msg, success: false };
    }
  };

  // ---- Toggle Featured ----
  const toggleFeatured = async (
    id: string,
    current: boolean,
  ): Promise<ApiResponse<null>> => {
    try {
      const { error: sbError } = await (supabase as any) // ← cast CLIENT not value
        .from("projects")
        .update({ featured: !current })
        .eq("id", id);

      if (sbError) throw sbError;
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, featured: !current } : p)),
      );
      return { data: null, error: null, success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Toggle failed";
      return { data: null, error: msg, success: false };
    }
  };

  return {
    projects,
    loading,
    error,
    refetch: fetchAll,
    deleteProject,
    togglePublished,
    toggleFeatured,
  };
}

// ------------------------------------------------------------
// useSingleProject — Fetch one project by ID (admin edit)
// ← OUTSIDE useAdminProjects — this was the main bug
// ------------------------------------------------------------
export function useSingleProject(id: string | null) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchOne() {
      setLoading(true);
      setError(null);
      try {
        const { data, error: sbError } = await supabase
          .from("projects")
          .select("*")
          .eq("id", id as string)
          .single();

        if (sbError) throw sbError;
        setProject(data as Project);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Project not found";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }

    fetchOne();
  }, [id]);

  return { project, loading, error };
}
