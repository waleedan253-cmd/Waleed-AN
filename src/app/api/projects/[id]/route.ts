// ============================================================
// WALEED AN Portfolio — /api/projects/[id]
// GET    → fetch single project by ID (public)
// PUT    → update project (admin only)
// DELETE → delete project (admin only)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "../../../../lib/supabase/client";
import type { UpdateProjectInput } from "../../../../types";

// ------------------------------------------------------------
// SHARED AUTH HELPER — verifies Bearer token from request header
// ------------------------------------------------------------
async function requireAuth(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];

  // Use anon client to verify the user JWT token
  const authClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const {
    data: { user },
    error,
  } = await authClient.auth.getUser(token);

  if (error || !user) return null;

  return user;
}

// ------------------------------------------------------------
// GET /api/projects/[id]
// Public — fetch a single project by UUID
// ------------------------------------------------------------
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = getSupabaseServerClient();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Project ID is required", data: null },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: "Project not found", data: null },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, data, error: null },
      { status: 200 },
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json(
      { success: false, error: msg, data: null },
      { status: 500 },
    );
  }
}

// ------------------------------------------------------------
// PUT /api/projects/[id]
// Protected — update an existing project
// ------------------------------------------------------------
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = getSupabaseServerClient();

    // ✅ Auth check — now reads Bearer token from header
    const user = await requireAuth(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", data: null },
        { status: 401 },
      );
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Project ID is required", data: null },
        { status: 400 },
      );
    }

    // Parse body
    let body: Partial<UpdateProjectInput>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body", data: null },
        { status: 400 },
      );
    }

    // Prevent updating protected fields
    const { id: _id, created_at, ...safeBody } = body as any;

    // short_description length check
    if (safeBody.short_description && safeBody.short_description.length > 160) {
      return NextResponse.json(
        {
          success: false,
          error: "short_description must be 160 characters or less",
          data: null,
        },
        { status: 400 },
      );
    }

    // Valid category check if provided
    if (safeBody.category) {
      const validCategories = [
        "ai-saas",
        "fullstack",
        "frontend",
        "erp-pos",
        "api-integration",
      ];
      if (!validCategories.includes(safeBody.category)) {
        return NextResponse.json(
          { success: false, error: "Invalid category", data: null },
          { status: 400 },
        );
      }
    }

    // Trim string fields if present
    if (safeBody.title) safeBody.title = safeBody.title.trim();
    if (safeBody.description)
      safeBody.description = safeBody.description.trim();
    if (safeBody.short_description)
      safeBody.short_description = safeBody.short_description.trim();

    // ✅ Update in Supabase — uncommented and working
    const { data, error } = await supabase
      .from("projects")
      .update(safeBody)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message, data: null },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json(
        { success: false, error: "Project not found", data: null },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, data, error: null },
      { status: 200 },
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json(
      { success: false, error: msg, data: null },
      { status: 500 },
    );
  }
}

// ------------------------------------------------------------
// DELETE /api/projects/[id]
// Protected — permanently delete a project
// ------------------------------------------------------------
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = getSupabaseServerClient();

    // ✅ Auth check — now reads Bearer token from header
    const user = await requireAuth(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", data: null },
        { status: 401 },
      );
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Project ID is required", data: null },
        { status: 400 },
      );
    }

    // Check project exists before deleting
    const { data: existing } = await supabase
      .from("projects")
      .select("id, image_url")
      .eq("id", id)
      .single();

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Project not found", data: null },
        { status: 404 },
      );
    }

    // Delete from database
    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message, data: null },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: { id },
        error: null,
        message: "Project deleted successfully",
      },
      { status: 200 },
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json(
      { success: false, error: msg, data: null },
      { status: 500 },
    );
  }
}
