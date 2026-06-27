// app/api/projects/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "../../../lib/supabase/client";
import type { CreateProjectInput } from "../../../types";

// ------------------------------------------------------------
// GET /api/projects
// ------------------------------------------------------------
export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseServerClient();
    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");
    const all = searchParams.get("all");

    let query = supabase
      .from("projects")
      .select("*")
      .order("published_date", { ascending: false });

    if (all !== "true") {
      query = query.eq("published", true);
    }
    if (category && category !== "all") {
      query = query.eq("category", category);
    }
    if (featured === "true") {
      query = query.eq("featured", true);
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message, data: null },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, data, error: null },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      },
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
// POST /api/projects
// ------------------------------------------------------------
export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseServerClient();
    // 🔍 ADD THIS TEMPORARILY
    console.log(
      "Using key type:",
      process.env.SUPABASE_SERVICE_ROLE_KEY ? "SERVICE ROLE ✅" : "MISSING ❌",
    );

    // Parse body
    let body: CreateProjectInput;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body", data: null },
        { status: 400 },
      );
    }

    // Required fields check
    const required = ["title", "description", "short_description", "category"];
    const missing = required.filter(
      (f) => !body[f as keyof CreateProjectInput],
    );
    if (missing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missing.join(", ")}`,
          data: null,
        },
        { status: 400 },
      );
    }

    // short_description length check
    if (body.short_description.length > 160) {
      return NextResponse.json(
        {
          success: false,
          error: "short_description must be 160 characters or less",
          data: null,
        },
        { status: 400 },
      );
    }

    // Category check
    const validCategories = [
      "ai-saas",
      "fullstack",
      "frontend",
      "erp-pos",
      "api-integration",
    ];
    if (!validCategories.includes(body.category)) {
      return NextResponse.json(
        { success: false, error: "Invalid category", data: null },
        { status: 400 },
      );
    }

    const supabaseAny = supabase as any;
    const { data, error } = await supabaseAny
      .from("projects")
      .insert({
        title: body.title.trim(),
        description: body.description.trim(),
        short_description: body.short_description.trim(),
        image_url: body.image_url || "",
        live_url: body.live_url || null, // ✅ renamed from live_demo_url
        github_url: body.github_url || null,
        tech_stack: body.tech_stack || [],
        category: body.category,
        published: body.published ?? false,
        featured: body.featured ?? false,
        published_date:
          body.published_date || new Date().toISOString().split("T")[0],
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message, data: null },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, data, error: null },
      { status: 201 },
    );
  } catch (err: unknown) {
    // ✅ Uncommented — function now returns in ALL paths
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json(
      { success: false, error: msg, data: null },
      { status: 500 },
    );
  }
}
